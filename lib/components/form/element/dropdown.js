/* globals React, _ */

module.exports = window.CreateClass({
    propTypes: {
        // These are the elements to show in the dropdown
        options: window.PropTypes.arrayOf(
            window.PropTypes.shape({
                // The value of the option, should be unique
                value: window.PropTypes.oneOfType([
                    window.PropTypes.string,
                ]),
                // The human readable text of the option
                text: window.PropTypes.oneOfType([
                    window.PropTypes.string,
                ]),
                // Whether or not the option is currently in focus
                focused: window.PropTypes.bool,
                // Whether or not the option is currently selected
                isSelected: window.PropTypes.bool,
                // Whether or not the option can be selected
                isSelectable: window.PropTypes.bool
            })
        ),

        // A callback that is triggered when a selection is made and passes the value
        // of the selected option as the only parameter
        onChange: window.PropTypes.func
    },

    mixins: [
        React.m.ExtraClasses
    ],

    getDefaultProps() {
        return {
            onChange: () => {}
        };
    },

    defaultClasses: ['dropdown-menu'],

    /**
     * Handle what happens when an option is clicked on in the dropdown
     * @param {Object} option
     */
    handleClick(option) {
        // Don't do anything if the option can't be selected
        if (option.isSelectable === false || option.disabled) {
            return;
        }

        this.props.onChange(option.value);
    },

    render() {
        return (
            <ul className={this.state.classes}>
                {_(this.props.options).map(option => (
                    <React.c.DropdownItem
                        key={_.uniqueId()}
                        {...option}
                        onClick={() => this.handleClick(option)}
                    />
                ))}
            </ul>
        );
    }
});
