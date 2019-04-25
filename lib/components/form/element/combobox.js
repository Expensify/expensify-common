import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import cn from 'classnames';
import _ from 'underscore';
import get from 'lodash.get';
import has from 'lodash.has';
import Str from '../../../str';
import DropDown from './dropdown';

const propTypes = {
    // These are the elements to show in the dropdown
    options: PropTypes.arrayOf(
        PropTypes.shape({
            // The value of the option, should be unique
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),

            // The human readable text of the option
            text: PropTypes.string,

            // If we need more than text to style more
            children: PropTypes.element,

            // Whether or not this tag has an error (like out of policy)
            hasError: PropTypes.bool,

            // If this option is disabled, then it can't be selected and needs styled differently
            disabled: PropTypes.bool,

            // An id to use when checking if the options changed. It's used to avoid triggering changes when passing
            // children to it, if the id didn't change we assume no other properties changed either.
            id: PropTypes.any,

            // Whether or not the object should be displayed as a divider
            // Used to identify the divider in some UI elements that need a separation between listed options
            divider: PropTypes.bool,

            // Whether or not the option is represented more than once in the list of options and should be selected
            // Used in some UI elements that may display the same user details multiple times to identify which ones
            // are duplicates
            selected: PropTypes.bool
        })
    ).isRequired,

    // A default value to have selected
    defaultValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),

    // A default value to have selected - Use this one rather than defaultValue when the parent view might change the value passed.
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),

    // A list of options to show as selected too. This is used when we are using this component to implement a multi
    // select, where another component holds all the selected options and this component only has to show the ones
    // that are already selected with the check mark.
    alreadySelectedOptions: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number
            ]),
            text: PropTypes.string,
        })
    ),

    // A callback that is fired when the value of the selector has changed
    onChange: PropTypes.func,

    // A callback that is fired when the value is cleared out by deleting text in the input
    onClear: PropTypes.func,

    // Callback fired when the dropdown is open/closed. It will pass a boolean param with true if it's open
    onDropdownStateChange: PropTypes.func,

    // Maximum amount of items to show
    maxItemsToShow: PropTypes.number,

    // Maximum amount of search results
    maxSearchResults: PropTypes.number,

    // By default we show the selected option's value
    // You can overwrite it to display a different property (like 'text')
    propertyToDisplay: PropTypes.oneOf(['text', 'value']),

    // Whether or not the combobox should be open when we initialize it
    openOnInit: PropTypes.bool,

    // A property to allow the combobox set to any manual entry the user chooses
    allowAnyValue: PropTypes.bool,

    // What text should we show when the text entered doesn't match any of the results. It's an underscore template
    // that will be passed `value` as the current entered text.
    noResultsText: PropTypes.string,

    // A property to determine if the selector is user editable
    isReadOnly: PropTypes.bool,

    // Text to use for the placeholder, defaults to "Type to search..."
    placeholder: PropTypes.string,

    // An array of extra classes to put on the combobox
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]),

    // This makes this component hidden till someone manually calls openDropdown
    hideUntilManuallyOpened: PropTypes.bool,

    // Do we want to always show the selected options on top?
    alwaysShowSelectedOnTop: PropTypes.bool,

    // Should this combobox have an error state on init?
    hasInitialError: PropTypes.bool,

    // Bootstrap 4 compatibility flag
    bs4: PropTypes.bool,
};

const defaultProps = {
    defaultValue: '',
    value: '',
    onChange: () => {},
    onClear: () => {},
    onDropdownStateChange: () => {},
    maxItemsToShow: 500,
    maxSearchResults: 200,
    propertyToDisplay: 'value',
    allowAnyValue: false,
    openOnInit: false,
    isReadOnly: false,
    alreadySelectedOptions: [],
    noResultsText: 'No results',
    placeholder: 'Type to search...',
    extraClasses: [],
    hideUntilManuallyOpened: false,
    alwaysShowSelectedOnTop: false,
    hasInitialError: false,
    bs4: false,
};

/**
 * A combobox useful for searching for values in a large list
 */
class Combobox extends React.Component {
    constructor(props) {
        super(props);

        // Bind to our private methods
        this.getStartState = this.getStartState.bind(this);
        this.getTruncatedOptions = this.getTruncatedOptions.bind(this);
        this.getValue = this.getValue.bind(this);
        this.setValue = this.setValue.bind(this);
        this.setText = this.setText.bind(this);
        this.setDisabled = this.setDisabled.bind(this);
        this.setError = this.setError.bind(this);
        this.deselectCurrentOption = this.deselectCurrentOption.bind(this);
        this.switchFocusedIndex = this.switchFocusedIndex.bind(this);
        this.reset = this.reset.bind(this);
        this.resetFocusedElements = this.resetFocusedElements.bind(this);
        this.handleClickAway = this.handleClickAway.bind(this);
        this.resetClickAwayHandler = this.resetClickAwayHandler.bind(this);
        this.clearError = this.clearError.bind(this);
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.openDropdown = this.openDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);
        this.closeDropdownOnTabOut = this.closeDropdownOnTabOut.bind(this);
        this.stopEvent = this.stopEvent.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.performSearch = this.performSearch.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.createTooltips = this.createTooltips.bind(this);
        this.destroyTooltips = this.destroyTooltips.bind(this);

        this.state = this.getStartState();
    }

    componentDidMount() {
        const {openOnInit} = this.props;

        if (openOnInit) {
            // Our dropdown will be open, so we need to listen for our click away events
            // and put focus on the input
            _.defer(this.resetClickAwayHandler);
            $(this.value).focus().select();
        }
    }

    componentWillReceiveProps(nextProps) {
        const {
            options,
            alreadySelectedOptions,
            openOnInit,
            isDisabled,
            isReadOnly
        } = this.props;
        const {currentValue} = this.state;

        if (!_.isUndefined(nextProps.value) && !_.isEmpty(nextProps.value) && !_.isEqual(nextProps.value, currentValue)) {
            this.setValue(nextProps.value);
        }

        if (!_.isUndefined(nextProps.options)) {
            // If the options have an id property, we use that to compare them and determine if they changed, if not
            // we'll use the whole options array.
            if (has(nextProps.options, '0.id')) {
                if (!_.isEqual(_.pluck(nextProps.options, 'id'), _.pluck(options, 'id')) || !_.isEqual(_.pluck(nextProps.alreadySelectedOptions, 'id'), _.pluck(alreadySelectedOptions, 'id'))) {
                    this.reset(false, nextProps.options, nextProps.alreadySelectedOptions);
                }
            } else if (!_.isEqual(nextProps.options, options) || !_.isEqual(nextProps.alreadySelectedOptions, alreadySelectedOptions)) {
                this.reset(false, nextProps.options, nextProps.alreadySelectedOptions);
            }
        }

        if (!_.isUndefined(nextProps.openOnInit) && !_.isEqual(nextProps.openOnInit, openOnInit)) {
            this.setState({
                isDropdownOpen: openOnInit
            });
        }

        if (!_.isUndefined(nextProps.isDisabled) && !_.isEqual(nextProps.isDisabled, isDisabled)) {
            this.setState({
                isDisabled: isReadOnly
            });
        }
    }

    componentDidUpdate() {
        const {isDropdownOpen} = this.state;
        if (isDropdownOpen) {
            this.createTooltips();
        }
    }

    componentWillUnmount() {
        // Always destroy all tooltips
        this.destroyTooltips();

        // Don't ever let this handler linger after unmounting
        $('body').off('click.clickaway', this.handleClickAway);
    }

    /**
     * @param {Boolean} noDefaultValue Overrides the default value to have '' as the currentValue
     * @param {Object[]} [newOptions] when resetting this component, we can specify new options to use
     * @param {Object[]} [newAlreadySelectedOptions] when resetting this component, we can specify new already selected options to use
     *
     * @returns {Object}
     */
    getStartState(noDefaultValue, newOptions, newAlreadySelectedOptions) {
        const {
            options,
            defaultValue,
            openOnInit,
            isReadOnly,
            hasInitialError
        } = this.props;
        let {value} = this.props;

        this.options = newOptions || options;

        value = value || defaultValue || '';
        const currentValue = this.initialValue || value;

        let defaultSelectedOption = _(this.options).find(o => o.value === currentValue && !o.isFake);

        // If no default was found and initialText was present then we can use initialText values
        if (!defaultSelectedOption && this.initialText) {
            defaultSelectedOption = {};
            defaultSelectedOption.text = this.initialText;
        }

        return {
            isDropdownOpen: openOnInit,
            currentValue: noDefaultValue ? this.initialValue || '' : value,
            currentText: defaultSelectedOption ? defaultSelectedOption.text : '',
            options: this.getTruncatedOptions(currentValue, newAlreadySelectedOptions),
            focusedIndex: 0,
            selectedIndex: null,
            isDisabled: isReadOnly,
            hasError: (defaultSelectedOption && defaultSelectedOption.hasError) || hasInitialError
        };
    }

    /**
     * Returns a set of our full options according to the maxItemsToShow
     *
     * @param {String|Number} currentValue
     * @param {Object[]} [newAlreadySelectedOptions]
     * @returns {Array}
     */
    getTruncatedOptions(currentValue, newAlreadySelectedOptions) {
        const {alreadySelectedOptions, maxItemsToShow, alwaysShowSelectedOnTop} = this.props;
        const alreadySelected = newAlreadySelectedOptions || alreadySelectedOptions;

        // Convert an array of strings into an array of objects for our dropdown
        const truncatedOptions = _.chain(this.options).map(option => ({
            text: option.text,
            children: option.children,
            value: option.value,
            disabled: option.disabled,
            divider: option.divider,
            focused: false,
            isSelected: option.selected && (_.isEqual(option.value, currentValue) || Boolean(_.findWhere(alreadySelected, {value: option.value})))
        }))
            .sortBy((o) => {
                // Fake entries go to the bottom and selected entries go to the top only if alwaysShowSelectedOnTop was passed
                if (o.showLast) {
                    return 2;
                }
                return o.isSelected && alwaysShowSelectedOnTop ? 0 : 1;
            })
            .first(maxItemsToShow)
            .value();

        if (!truncatedOptions.length) {
            truncatedOptions.push({
                text: 'No items',
                value: '',
                isSelectable: false,
                isFake: true,
                showLast: true,
            });
        } else if (this.options.length > maxItemsToShow) {
            truncatedOptions.push({
                text: `Viewing first ${maxItemsToShow} items. Search to see more.`,
                value: '',
                isSelectable: false,
                isFake: true,
                showLast: true,
            });
        }

        return truncatedOptions;
    }

    /**
     * Returns the selected value(s)
     *
     * @return {String}
     */
    getValue() {
        const {currentValue} = this.state;
        return currentValue;
    }

    /**
     * Sets the current value
     *
     * @param {String} val
     */
    setValue(val) {
        const {alreadySelectedOptions} = this.props;
        const {options, isDropdownOpen} = this.state;

        // Deselect all other options but the one matching our value
        const newOptions = _(options).map((o) => {
            const option = o;
            const isSelected = _.isEqual(option.value, val);
            option.isSelected = isSelected || Boolean(_.findWhere(alreadySelectedOptions, {value: option.value}));
            return option;
        });

        // We need to look in `this.options` for the matching option because `this.state.options` is a truncated list
        // and might not have every option
        const optionMatchingVal = _.findWhere(this.options, {value: val});
        const currentText = get(optionMatchingVal, 'text', '');

        this.initialValue = val;
        this.setState({
            currentValue: val,
            currentText,
            options: newOptions
        });
        if (isDropdownOpen) {
            // IE11 will intermittently re-open the dropdown on an input.focus() or input.select()
            // Causes https://github.com/Expensify/Expensify/issues/77688
            const msie = RegExp('trident', 'i').test(navigator.userAgent);
            if (!msie) {
                $(this.value).focus().select();
            }
        }
    }

    /**
     * Hard sets the current text to what we want
     *
     * @param {String} currentText
     */
    setText(currentText) {
        this.initialValue = currentText;
        this.initialText = currentText;
        this.setState({currentText});
    }

    /**
     * Sets the disabled state of this component
     *
     * @param {Boolean} isDisabled
     */
    setDisabled(isDisabled) {
        this.setState({isDisabled});
    }

    /**
     * Set an error for a specific tag
     */
    setError() {
        this.setState({
            hasError: true
        });
    }

    /**
     * Deselects any current option if it exists
     */
    deselectCurrentOption() {
        const {selectedIndex, options} = this.state;

        if (selectedIndex !== null
            && options[selectedIndex]) {
            options[selectedIndex].isSelected = false;
        }
    }

    /**
     * Swaps the focused index from {oldFocusedIndex} to {newFocusedIndex}
     *
     * @param {number} oldFocusedIndex
     * @param {number} newFocusedIndex
     */
    switchFocusedIndex(oldFocusedIndex, newFocusedIndex) {
        const {options} = this.state;

        options[oldFocusedIndex].focused = false;
        options[newFocusedIndex].focused = true;
    }

    /**
     * Returns the selector to it's original state
     *
     * @param {Boolean} noDefaultValue Overrides the initials state defaultValue by setting the currentValue to ''
     * @param {Object[]} [newOptions] we can recreate it with new options
     * @param {Object[]} [newAlreadySelectedOptions] we can recreate it with new already selected options
     */
    reset(noDefaultValue, newOptions, newAlreadySelectedOptions) {
        const {onDropdownStateChange} = this.props;

        if (newOptions) {
            this.options = newOptions;
        }
        const state = this.getStartState(noDefaultValue, this.options, newAlreadySelectedOptions);
        this.setState(state, () => onDropdownStateChange(Boolean(state.isDropdownOpen)));
    }

    /**
     * When the dropdown is closed, we reset the focused property of all of our options
     */
    resetFocusedElements() {
        const {options} = this.state;
        this.setState({
            options: _(options).map((o) => {
                const option = o;
                option.focused = false;
                return option;
            })
        });
    }

    /**
     * Fired when we "click away" with the dropdown open
     *
     * @param {SyntheticEvent} e
     */
    handleClickAway(e) {
        const {onChange, value, defaultValue} = this.props;

        // Ignore the click away event if something within our combobox was clicked
        // BIG HACK! I had to add the check for the support password click because it was causing a near
        // unreproducible bug: https://github.com/Expensify/Expensify/issues/76745 that only I could reproduce.
        // It is 100% unexplainable, but works for me
        if ($(e.target).attr('id') === 'supportPassword'
            || (
                $(e.target).parents('.expensify-input-group').length
                && $(e.target).parents('.expensify-input-group')[0] === ReactDOM.findDOMNode(this)
            )
        ) {
            return;
        }
        this.reset(true);

        // Trigger a change so that inline editor knows to cancel itself
        onChange(this.initialValue || value || defaultValue);
    }

    /**
     * Sets a clicklistener to close the dropdown if it is currently open
     */
    resetClickAwayHandler() {
        const {isDropdownOpen} = this.state;
        $('body').off('click.clickaway', this.handleClickAway);
        if (isDropdownOpen) {
            $('body').on('click.clickaway', this.handleClickAway);
        } else {
            this.resetFocusedElements();
        }
    }

    /**
     * Clear an error for a specific tag
     */
    clearError() {
        this.setState({
            hasError: false
        });
    }

    /**
     * Opens or closes the dropdown
     */
    toggleDropdown() {
        const {isDropdownOpen} = this.state;

        if (isDropdownOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    /**
     * Just open the dropdown (when the input gets focus)
     */
    openDropdown() {
        const {onDropdownStateChange} = this.props;
        const {isDropdownOpen} = this.state;

        if (isDropdownOpen) {
            return;
        }
        this.setState({
            isDropdownOpen: true
        }, () => {
            onDropdownStateChange(true);
            this.resetClickAwayHandler();
            $(this.value).focus().select();
        });
    }

    /**
     * Closes the dropdown and removes the click handler that calls this function after the dropdown is closed
     *
     * @param {SyntheticEvent} [e]
     */
    closeDropdown(e) {
        const {
            onDropdownStateChange,
            onChange,
            value,
            defaultValue
        } = this.props;
        const {isDropdownOpen} = this.state;

        if (!isDropdownOpen) {
            return;
        }

        // If the dropdown is being closed from clicking on our input, then we actually don't close the dropdown. This
        // occurs because when first opening the dropdown when the input receives focus, it fires off the clickaway
        // event and I couldn't stop it. So this is the work around.
        if (e && ($(e.target)[0] === $(this.value)[0] || $(e.target).parent().hasClass('disabled'))) {
            return;
        }

        this.setState({
            isDropdownOpen: false
        }, () => {
            onDropdownStateChange(false);
            this.resetClickAwayHandler();
            this.destroyTooltips();
        });

        // The value a user selects is set in state prior to this function running so we want to always treat this as if
        // it were just a blur event and reset the input to an empty value and then let onChange handle showing the proper value
        // This is because users who click the arrow used to be able to save incorrect values in the combobox: https://github.com/Expensify/Expensify/issues/75793#issuecomment-380260662
        this.reset(true);
        onChange(this.initialValue || value || defaultValue);
    }

    /**
     * If the user presses tab when the dropdown button is focused, then we close the dropdown
     * because they are trying to get to the next form components
     *
     * @param {SyntheticEvent} e
     */
    closeDropdownOnTabOut(e) {
        if (e.which === 9) {
            this.closeDropdown();
        }
    }

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
    }

    /**
     * This is triggered whenever there is a key up event in the text input
     *
     * @param {SyntheticEvent} e
     */
    handleKeyDown(e) {
        const {
            allowAnyValue,
            onChange,
            value,
            defaultValue
        } = this.props;
        const {focusedIndex, options, isDropdownOpen} = this.state;

        let oldFocusedIndex;
        let newFocusedIndex;
        let currentValue;
        let currentText;

        // Handle the arrow keys
        switch (e.which) {
            case 40:
                // Down - move focused selection down
                oldFocusedIndex = focusedIndex;
                newFocusedIndex = oldFocusedIndex + 1;

                // Wrap around to the top of the list
                if (newFocusedIndex > options.length - 1) {
                    newFocusedIndex = 0;
                }

                this.switchFocusedIndex(oldFocusedIndex, newFocusedIndex);
                this.setState({
                    focusedIndex: newFocusedIndex,
                    options,
                    isDropdownOpen: true
                }, this.resetClickAwayHandler);
                this.stopEvent(e);
                break;

            case 38:
                // Up - move focused selection up
                oldFocusedIndex = focusedIndex;
                newFocusedIndex = oldFocusedIndex - 1;

                // Wrap around to the bottom of the list
                if (newFocusedIndex < 0) {
                    newFocusedIndex = options.length - 1;
                }

                this.switchFocusedIndex(oldFocusedIndex, newFocusedIndex);
                this.setState({
                    focusedIndex: newFocusedIndex,
                    options,
                    isDropdownOpen: true
                }, this.resetClickAwayHandler);
                this.stopEvent(e);
                break;

            case 13: {
                // Enter - set selection
                if (!isDropdownOpen) {
                    return;
                }

                // Don't select disabled things
                if (options[focusedIndex].disabled) {
                    break;
                }
                this.deselectCurrentOption();

                currentValue = options[focusedIndex].value;
                currentText = options[focusedIndex].text;

                // if allowAnyValue is true and currentValue is absent then set it manually to what the user has entered
                if (!currentValue && allowAnyValue) {
                    currentValue = e.target.value;
                    currentText = currentValue;
                }

                this.setState({
                    options: this.getTruncatedOptions(currentValue),
                    selectedIndex: focusedIndex,
                    currentValue,
                    currentText,
                    isDropdownOpen: false
                }, () => {
                    this.resetClickAwayHandler();
                    this.destroyTooltips();
                });

                // Fire our onChange callback
                onChange(currentValue);
                this.initialValue = currentValue;

                this.stopEvent(e);
                break;
            }

            case 9:
            case 27:
                // Tab & Escape - clear selection
                this.reset(true);

                // Fire our onChange callback
                onChange(this.initialValue || value || defaultValue);

                // Stop the event from propagating if the escape key is pressed
                if (e.which === 27) {
                    this.stopEvent(e);
                    this.destroyTooltips();
                }
                break;

            default:
                break;
        }
    }

    /**
     * This is triggered whenever there is a change event in the text input
     * (from any valid input that's not being handled from the keyUp event)
     *
     * @param {SyntheticEvent} e
     */
    performSearch(e) {
        const {
            onClear,
            maxSearchResults,
            alreadySelectedOptions,
            allowAnyValue,
            noResultsText
        } = this.props;
        const {isDropdownOpen} = this.state;

        let shouldShowDropdown = isDropdownOpen;

        // If we don't have an empty value, show the dropdown.
        // If empty value, hide the dropdown, update the initial fields and show the original options.
        if (e.target.value.trim() !== '' && !shouldShowDropdown) {
            shouldShowDropdown = true;
        } else if (e.target.value === '') {
            this.initialValue = '';
            this.initialText = '';

            // This will show all the original items while the input field stays empty. Also the dropdown will remain open.
            this.setState({
                currentValue: '',
                currentText: '',
                isDropdownOpen: true,
                options: this.getTruncatedOptions('')
            }, this.resetClickAwayHandler);

            // Trigger the callback to clear out the value
            onClear();
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
        const searchOptions = _.uniq(this.options, 'value');

        for (let i = 0; i < matchRegexes.length; i++) {
            if (matches.size < maxSearchResults) {
                for (let j = 0; j < searchOptions.length; j++) {
                    // Don't include the disabled options
                    if (!searchOptions[j].disabled && matchRegexes[i].test(searchOptions[j].text.toString().replace(new RegExp(/&nbsp;/g), ''))) {
                        matches.add(searchOptions[j]);
                    }

                    if (matches.size === maxSearchResults) {
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
            children: option.children,
            focused: false,
            isSelected: _.isEqual(option.value, e.target.value) || Boolean(_.findWhere(alreadySelectedOptions, {value: option.value}))
        }));

        // Focus the first option if there is one and show a message dependent on what options are present
        if (options.length) {
            options[0].focused = true;

            if (hasMoreResults) {
                options.push({
                    text: `Viewing first ${options.length} results`,
                    value: '',
                    isSelectable: false,
                    isFake: true,
                    showLast: true,
                });
            }
        } else {
            options.push({
                text: allowAnyValue ? e.target.value : _.template(noResultsText)({value: e.target.value}),
                value: allowAnyValue ? e.target.value : '',
                isSelectable: allowAnyValue,
                isFake: true,
                showLast: true,
            });
        }

        this.setState({
            currentValue: e.target.value,
            currentText: e.target.value,
            isDropdownOpen: shouldShowDropdown,
            focusedIndex: 0,
            options
        }, this.resetClickAwayHandler);
    }

    /**
     * Handle state changes for when a user clicks on an item in the dropdown
     *
     * @param  {String|Number} selectedValue
     */
    handleClick(selectedValue) {
        const {onChange} = this.props;

        this.deselectCurrentOption();

        // Select the new item, set our new indexes, close the dropdown
        // Unselect all other options
        const newSelectedIndex = _(this.options).findIndex({value: selectedValue});
        const currentlySelectedOption = _(this.options).findWhere({value: selectedValue});

        this.setState({
            options: this.getTruncatedOptions(selectedValue),
            selectedIndex: newSelectedIndex,
            focusedIndex: newSelectedIndex,
            currentValue: selectedValue,
            currentText: get(currentlySelectedOption, 'text', ''),
            isDropdownOpen: false,
            hasError: get(currentlySelectedOption, 'hasError', false)
        }, () => {
            this.resetClickAwayHandler();
            this.destroyTooltips();
        });

        // Fire our onChange callback
        onChange(selectedValue);
    }

    /**
     * On dropdown open, we instantiate all tooltips it generates
     */
    createTooltips() {
        $('.expensify-dropdown a[data-toggle="tooltip"]').tooltip({
            template: '<div class="tooltip tooltip--from-combobox" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
        });
    }

    /**
     * On dropdown close, we destroy all instantiated tooltips
     */
    destroyTooltips() {
        $('.tooltip--from-combobox').tooltip('hide');
    }

    render() {
        const {
            hideUntilManuallyOpened,
            bs4,
            extraClasses,
            propertyToDisplay,
            placeholder
        } = this.props;
        const {
            isDropdownOpen,
            hasError,
            isDisabled,
            currentValue,
            currentText,
            options
        } = this.state;

        if (hideUntilManuallyOpened && !isDropdownOpen) {
            return null;
        }
        const inputGroupClasses = {
            'input-group': true,
            'expensify-input-group': true,
            open: isDropdownOpen
        };
        const inputGroupBtnClasses = {
            'input-group-btn': !bs4,
            'input-group-append': bs4,
            open: isDropdownOpen
        };
        const toggleBtnClasses = bs4
            ? 'dropdown-toggle dropdown-toggle-split btn btn-outline-primary'
            : 'dropdown-toggle btn btn-default';

        return (
            <div
                className={cn(inputGroupClasses, extraClasses)}
                onKeyDown={this.handleKeyDown}
                role="presentation"
            >
                <input
                    ref={ref => this.value = ref}
                    type="text"
                    className={cn(['form-control', {error: hasError}])}
                    disabled={isDisabled}
                    aria-label="..."
                    onChange={this.performSearch}
                    onKeyDown={this.closeDropdownOnTabOut}
                    value={propertyToDisplay === 'value'
                        ? _.unescape(currentValue)
                        : _.unescape(currentText.replace(new RegExp(/&nbsp;/g), ''))}
                    onFocus={this.openDropdown}
                    autoComplete="off"
                    placeholder={placeholder}
                    tabIndex="0"
                />
                <div className={cn(inputGroupBtnClasses)}>
                    <button
                        type="button"
                        className={cn(toggleBtnClasses, {error: hasError})}
                        disabled={isDisabled}
                        onClick={this.toggleDropdown}
                        onKeyDown={this.closeDropdownOnTabOut}
                        tabIndex="-1"
                    >
                        {!bs4 && <span className="caret" />}
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    {isDropdownOpen && (
                        <DropDown
                            options={options}
                            bs4={bs4}
                            extraClasses={{'expensify-dropdown': true, show: bs4 && isDropdownOpen}}
                            onChange={this.handleClick}
                        />
                    )}
                </div>
            </div>
        );
    }
}

Combobox.propTypes = propTypes;
Combobox.defaultProps = defaultProps;

export default Combobox;
