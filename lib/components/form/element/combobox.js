/* globals _, KeyboardShortcutManager, React, ReactDOM, Str, UI */

/**
 * A combobox useful for searching for values in a large list
 */
module.exports = React.createClass({
    propTypes: {
        // These are the elements to show in the dropdown
        options: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                // The value of the option, should be unique
                value: React.PropTypes.string,
                // The human readable text of the option
                text: React.PropTypes.string,
                // Whether or not this tag has an error (like out of policy)
                hasError: React.PropTypes.bool,
                // If this option is disabled, then it can't be selected and needs styled differently
                disabled: React.PropTypes.bool
            })
        ),

        // A default value to have selected
        defaultValue: React.PropTypes.oneOfType([
            React.PropTypes.string,
            React.PropTypes.number
        ]),

        // A callback that is fired when the value of the selector has changed
        onChange: React.PropTypes.func,

        // A callback that is fired when the value is cleared out by deleting text in the input
        onClear: React.PropTypes.func,

        // By default we show the selected option's value
        // You can overwrite it to display a different property (like 'text')
        propertyToDisplay: React.PropTypes.oneOf(['text', 'value']),

        // Whether or not the combobox should be open when we initialize it
        openOnInit: React.PropTypes.bool
    },

    getDefaultProps() {
        return {
            onChange: () => {},
            maxItemsToShow: 500,
            maxSearchResults: 200,
            propertyToDisplay: 'value'
        };
    },

    /**
     * @param {Boolean} noDefaultValue Overrides the default value to have '' as the currentValue
     * @param {Object[]} [newOptions] when resetting this component, we can specifiy new options to use
     *
     * @returns {Object}
     */
    getInitialState(noDefaultValue, newOptions) {
        this.options = newOptions || this.props.options;

        // Convert an array of strings into an array of objects for our dropdown
        const truncatedOptions = _(this.options).first(this.props.maxItemsToShow).map(option => ({
            text: option.text,
            value: option.value,
            disabled: option.disabled,
            focused: false,
            isSelected: option.value.toString() === this.props.defaultValue
        }));

        if (!truncatedOptions.length) {
            truncatedOptions.push({
                text: 'No items',
                value: '',
                isSelectable: false
            });
        } else if (this.options.length > this.props.maxItemsToShow) {
            truncatedOptions.push({
                text: `Viewing first ${this.props.maxItemsToShow} items. Search to see more.`,
                value: '',
                isSelectable: false
            });
        }

        const defaultSelectedOption = _(this.options).findWhere({value: this.props.defaultValue});

        return {
            isDropdownOpen: this.props.openOnInit,
            currentValue: noDefaultValue ? '' : this.props.defaultValue || '',
            currentText: defaultSelectedOption ? defaultSelectedOption.text : '',
            options: truncatedOptions,
            focusedIndex: 0,
            selectedIndex: null,
            hasError: false
        };
    },

    componentDidMount() {
        if (this.props.openOnInit) {
            // Our dropdown will be open, so we need to listen for our click away events
            // and put focus on the input
            _.defer(this.resetClickAwayHandler);
            $(this.refs.input).focus();
        }
    },

    componentWillUnmount() {
        // Don't ever let this handler linger after unmounting
        $('body').off('click.clickaway', this.handleClickAway);
    },

    /**
     * Returns the selected value(s)
     *
     * @return {String}
     */
    getValue() {
        return this.state.currentValue;
    },

    /**
     * Sets the current value
     *
     * @param {String} val
     */
    setValue(val) {
        let currentText = '';
        // Deselect all other options but the one matching our value
        const newOptions = _(this.state.options).map((o) => {
            const option = o;
            option.isSelected = option.value === val;
            if (option.isSelected) {
                currentText = option.text;
            }
            return option;
        });
        this.setState({
            currentValue: val,
            currentText,
            options: newOptions
        });
    },

    /**
     * Set an error for a specific tag
     */
    setError() {
        this.setState({
            hasError: true
        });
    },

    /**
     * Deselects any current option if it exists
     */
    deselectCurrentOption() {
        if (this.state.selectedIndex !== null
            && this.state.options[this.state.selectedIndex]) {
            this.state.options[this.state.selectedIndex].isSelected = false;
        }
    },

    /**
     * Swaps the focused index from {oldFocusedIndex} to {newFocusedIndex}
     *
     * @param {number} oldFocusedIndex
     * @param {number} newFocusedIndex
     */
    switchFocusedIndex(oldFocusedIndex, newFocusedIndex) {
        this.state.options[oldFocusedIndex].focused = false;
        this.state.options[newFocusedIndex].focused = true;
    },

    /**
     * Returns the selector to it's original state
     *
     * @param {Boolean} noDefaultValue Overrides the initials state defaultValue by setting the currentValue to ''
     * @param {Object[]} [newOptions] we can recreate it with new options
     */
    reset(noDefaultValue, newOptions) {
        if (newOptions) {
            this.options = newOptions;
        }
        this.setState(this.getInitialState(noDefaultValue, this.options));
    },

    /**
     * When the dropdown is closed, we reset the focused property of all of our options
     */
    resetFocusedElements() {
        this.setState({
            options: _(this.state.options).map((o) => {
                const option = o;
                option.focused = false;
                return option;
            })
        });
    },

    /**
     * Fired when we "click away" with the dropdown open
     *
     * @param {SyntheticEvent} e
     */
    handleClickAway(e) {
        // Ignore the click away event if something within our combobox was clicked
        if ($(e.target).parents('.expensify-input-group').length
            && $(e.target).parents('.expensify-input-group')[0] === ReactDOM.findDOMNode(this)) {
            return;
        }
        this.closeDropdown();

        // Trigger a change so that inline editor knows to cancel itself
        this.props.onChange(this.state.currentValue);
    },

    /**
     * Sets a clicklistener to close the dropdown if it is currently open
     */
    resetClickAwayHandler() {
        $('body').off('click.clickaway', this.handleClickAway);
        if (this.state.isDropdownOpen) {
            $('body').on('click.clickaway', this.handleClickAway);
        } else {
            this.resetFocusedElements();
        }
    },

    /**
     * Clear an error for a specific tag
     */
    clearError() {
        this.setState({
            hasError: false
        });
    },

    /**
     * Opens or closes the dropdown
     */
    toggleDropdown() {
        if (this.state.isDropdownOpen) {
            this.closeDropdown();

            // Trigger a change so that inline editor knows to cancel itself
            this.props.onChange(this.state.currentValue);
        } else {
            this.openDropdown();
            $(this.refs.input).focus();
        }
    },

    /**
     * Just open the dropdown (when the input gets focus)
     */
    openDropdown() {
        if (this.state.isDropdownOpen) {
            return;
        }
        this.setState({
            isDropdownOpen: true
        }, this.resetClickAwayHandler);
    },

    /**
     * Closes the dropdown and removes the click handler that calls this function after the dropdown is closed
     *
     * @param {SyntheticEvent} [e]
     */
    closeDropdown(e) {
        if (!this.state.isDropdownOpen) {
            return;
        }
        // If the dropdown is being closed from clicking on our input, then we actually don't close the dropdown. This
        // occurs because when first opening the dropdown when the input receives focus, it fires off the clickaway
        // event and I couldn't stop it. So this is the work around.
        if (e && ($(e.target)[0] === $(this.refs.input)[0] || $(e.target).parent().hasClass(UI.DISABLED))) {
            return;
        }
        this.setState({
            isDropdownOpen: false
        }, this.resetClickAwayHandler);
    },

    /**
     * If the user presses tab when the dropdown button is focused, then we close the dropdown
     * because they are trying to get to the next form components
     *
     * @param {SyntheticEvent} e
     */
    closeDropdownOnTabOut(e) {
        if (e.which === KeyboardShortcutManager.MAPPINGS.KEY_TAB) {
            this.closeDropdown();
        }
    },

    /**
     * Stops events from doing anything outside of the current function (in theory).
     * This doesn't work between jquery and React events because React's event propagation is a separate system.
     *
     * @param {SyntheticEvent} e
     */
    stopEvent(e) {
        e.preventDefault();
        if (e.nativeEvent) {
            e.nativeEvent.stopImmediatePropagation();
        } else {
            e.stopImmediatePropagation();
        }
        e.stopPropagation();
    },

    /**
     * This is triggered whenever there is a key up event in the text input
     *
     * @param {SyntheticEvent} e
     */
    handleKeyDown(e) {
        let oldFocusedIndex;
        let newFocusedIndex;

        // Handle the arrow keys
        switch (e.which) {
        // Down - move focused selection down
        case KeyboardShortcutManager.MAPPINGS.KEY_DOWN:
            oldFocusedIndex = this.state.focusedIndex;
            newFocusedIndex = oldFocusedIndex + 1;

            // Wrap around to the top of the list
            if (newFocusedIndex > this.state.options.length - 1) {
                newFocusedIndex = 0;
            }

            this.switchFocusedIndex(oldFocusedIndex, newFocusedIndex);
            this.setState({
                focusedIndex: newFocusedIndex,
                options: this.state.options,
                isDropdownOpen: true
            }, this.resetClickAwayHandler);
            this.stopEvent(e);
            break;

        // Up - move focused selection up
        case KeyboardShortcutManager.MAPPINGS.KEY_UP:
            oldFocusedIndex = this.state.focusedIndex;
            newFocusedIndex = oldFocusedIndex - 1;

            // Wrap around to the bottom of the list
            if (newFocusedIndex < 0) {
                newFocusedIndex = this.state.options.length - 1;
            }

            this.switchFocusedIndex(oldFocusedIndex, newFocusedIndex);
            this.setState({
                focusedIndex: newFocusedIndex,
                options: this.state.options,
                isDropdownOpen: true
            }, this.resetClickAwayHandler);
            this.stopEvent(e);
            break;

        // Enter - set selection
        case KeyboardShortcutManager.MAPPINGS.KEY_ENTER:
            // Don't do anything if the dropdown is closed
            if (!this.state.isDropdownOpen) {
                return;
            }

            // Don't select disabled things
            if (this.state.options[this.state.focusedIndex].disabled) {
                break;
            }

            this.deselectCurrentOption();
            this.state.options[this.state.focusedIndex].isSelected = true;

            this.setState({
                selectedIndex: this.state.focusedIndex,
                currentValue: this.state.options[this.state.focusedIndex].value,
                currentText: this.state.options[this.state.focusedIndex].text,
                options: this.state.options,
                isDropdownOpen: false
            }, this.resetClickAwayHandler);

            // Fire our onChange callback
            this.props.onChange(this.state.options[this.state.focusedIndex].value);
            this.stopEvent(e);
            break;

        // Escape - clear selection
        case KeyboardShortcutManager.MAPPINGS.KEY_ESCAPE:
            this.reset(true);

            // Fire our onChange callback
            this.props.onChange(this.state.currentValue);
            this.stopEvent(e);
            break;

        default:
            break;
        }
    },

    /**
     * This is triggered whenever there is a change event in the text input
     * (from any valid input that's not being handled from the keyUp event)
     *
     * @param {SyntheticEvent} e
     */
    performSearch(e) {
        let shouldShowDropdown = this.state.isDropdownOpen;

        // Show the dropdown if we don't have an empty value and hide the dropdown
        // if we do have an empty value
        if (e.target.value.trim() !== '' && !shouldShowDropdown) {
            shouldShowDropdown = true;
        } else if (e.target.value === '' && shouldShowDropdown) {
            shouldShowDropdown = false;
            // This will bring back scrolling when there are < this.props.maxItemsToShow options total
            this.reset(true);

            // Trigger the callback to clear out the value
            this.props.onClear();
            return;
        }

        // Search our original options. We want:
        // Exact matches first
        // beginning-of-string matches second
        // middle-of-string matches last
        const matchRegexes = [
            new RegExp(`^${Str.escapeForRegExp(e.target.value)}$`, 'i'),
            new RegExp(`^${Str.escapeForRegExp(e.target.value)}`, 'i'),
            new RegExp(Str.escapeForRegExp(e.target.value), 'i'),
        ];
        let hasMoreResults = false;
        let matches = new Set();

        for (let i = 0; i < matchRegexes.length; i++) {
            if (matches.size < this.props.maxSearchResults) {
                for (let j = 0; j < this.options.length; j++) {
                    // Don't include the disabled options
                    if (!this.options[j].disabled && matchRegexes[i].test(this.options[j].text.toString().replace(new RegExp(/&nbsp;/g), ''))) {
                        matches.add(this.options[j]);
                    }

                    if (matches.size === this.props.maxSearchResults) {
                        hasMoreResults = true;
                        break;
                    }
                }
            } else {
                hasMoreResults = true;
                break;
            }
        }
        matches = Array.from(matches);

        const options = _(matches).map(option => ({
            text: option.text,
            value: option.value,
            disabled: option.disabled,
            focused: false,
            isSelected: option.value.toString() === e.target.value
        }));

        // Focus the first option if there is one and show a message dependent on what options are present
        if (options.length) {
            options[0].focused = true;

            if (hasMoreResults) {
                options.push({
                    text: `Viewing first ${options.length} results`,
                    value: '',
                    isSelectable: false
                });
            }
        } else {
            options.push({
                text: 'No results',
                value: '',
                isSelectable: false
            });
        }

        this.setState({
            currentValue: e.target.value,
            currentText: e.target.value,
            isDropdownOpen: shouldShowDropdown,
            focusedIndex: 0,
            options
        }, this.resetClickAwayHandler);
    },

    /**
     * Handle state changes for when a user clicks on an item in the dropdown
     *
     * @param  {String|Number} selectedValue
     */
    handleClick(selectedValue) {
        this.deselectCurrentOption();

        // Select the new item, set our new indexes, close the dropdown
        // Unselect all other options
        const newSelectedIndex = _(this.state.options).findIndex({value: selectedValue});
        let currentText = '';
        const newOptions = _(this.state.options).each((o) => {
            const option = o;
            option.isSelected = option.value === selectedValue;
            if (option.isSelected) {
                currentText = option.text;
            }
        });

        this.setState({
            options: newOptions,
            selectedIndex: newSelectedIndex,
            focusedIndex: newSelectedIndex,
            currentValue: selectedValue,
            currentText,
            isDropdownOpen: false
        }, this.resetClickAwayHandler);

        // Fire our onChange callback
        this.props.onChange(selectedValue);
    },

    render() {
        const inputGroupClasses = {
            'input-group': true,
            'expensify-input-group': true,
            open: this.state.isDropdownOpen
        };
        const inputGroupBtnClasses = {
            'input-group-btn': true,
            open: this.state.isDropdownOpen
        };
        return (
            <div
                className={React.classNames(inputGroupClasses)}
                onKeyDown={this.handleKeyDown}
            >
                <input
                    ref="input"
                    type="text"
                    className={React.classNames(['form-control', {error: this.state.hasError}])}
                    aria-label="..."
                    onChange={this.performSearch}
                    onKeyDown={this.closeDropdownOnTabOut}
                    value={this.props.propertyToDisplay === 'value'
                        ? _.unescape(this.state.currentValue)
                        : _.unescape(this.state.currentText.replace(new RegExp(/&nbsp;/g), ''))}
                    onFocus={this.openDropdown}
                    autoComplete="off"
                    placeholder="Type to search..."
                    tabIndex="0"
                />
                <div className={React.classNames(inputGroupBtnClasses)}>
                    <button
                        type="button"
                        className={React.classNames(['btn', 'btn-default', 'dropdown-toggle', {error: this.state.hasError}])}
                        onClick={this.toggleDropdown}
                        onKeyDown={this.closeDropdownOnTabOut}
                        tabIndex="-1"
                    >
                        <span className="caret" />
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <React.c.Dropdown
                        options={this.state.options}
                        extraClasses={['expensify-dropdown']}
                        onChange={this.handleClick}
                    />
                </div>
            </div>
        );
    }
});
