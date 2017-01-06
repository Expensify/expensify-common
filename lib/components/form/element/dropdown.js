/* globals React, _ */

module.exports = React.createClass({
    propTypes: {
        // These are the elements to show in the dropdown
        options: React.PropTypes.arrayOf(
            React.PropTypes.shape({
                // The value of the option, should be unique
                value: React.PropTypes.oneOfType([
                    React.PropTypes.string,
                ]),
                // The human readable text of the option
                text: React.PropTypes.oneOfType([
                    React.PropTypes.string,
                ]),
                // Whether or not the option is currently in focus
                focused: React.PropTypes.bool,
                // Whether or not the option is currently selected
                isSelected: React.PropTypes.bool,
                // Whether or not the option can be selected
                isSelectable: React.PropTypes.bool
            })
        ),

        // A callback that is triggered when a selection is made and passes the value
        // of the selected option as the only parameter
        onChange: React.PropTypes.func
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
                        key={option.value}
                        {...option}
                        onClick={() => this.handleClick(option)}
                    />
                ))}
            </ul>
        );
    }
});
