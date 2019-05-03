/* globals React, Func, Modal, _ */

/**
 * Form Element Switch - Displays an on/off switch
 */
module.exports = window.CreateClass({
    propTypes: {
        id: window.PropTypes.string.isRequired,

        // If it is turned on by default
        checked: window.PropTypes.bool,

        // If it is disabled or not
        disabled: window.PropTypes.bool,

        // A callback method for when the value is changed
        onChange: window.PropTypes.func,

        // A configuration object that is passed to Modal.confirm() if we want to have
        // the user confirm their choice
        confirm: window.PropTypes.object
    },

    mixins: [
        React.m.ExtraClasses,
        React.m.FormValidationClasses
    ],

    getDefaultProps() {
        return {
            checked: false,
            disabled: false
        };
    },

    /**
     * Gets the value of the field
     *
     * @return {boolean}
     */
    getValue() {
        return $(this.refs.checkbox)[0].checked;
    },

    /**
     * Fires the change handler with the current value
     */
    fireChangeHandler() {
        // Don't do anything here if we want the user to confirm their choice
        if (this.props.confirm) {
            return;
        }
        Func.invoke(this.props.onChange, [this.getValue()]);
    },

    /**
     * If there was a confirm object specified in our properties,
     * then we need to open a confirm modal with those settings
     *
     * @param {SyntheticEvent} e
     * @return {Boolean}
     */
    showConfirm(e) {
        // Let our event happen normally
        if (!this.props.confirm) {
            return true;
        }

        e.preventDefault();
        Modal.confirm(_.extend({
            onYesCallback: () => {
                // Toggle the checked property and then fire our change handler
                this.refs.checkbox.checked = !this.getValue();
                Func.invoke(this.props.onChange, [this.getValue()]);
            }
        }, this.props.confirm));
        return false;
    },

    defaultClasses: ['onoffswitch-wrapper'],

    render() {
        return (
            <span className={this.state.classes}>
                <input
                    ref="checkbox"
                    type="checkbox"
                    id={this.props.id}
                    className="onoffswitch-checkbox"
                    checked={this.props.checked}
                    disabled={this.props.disabled}
                    onClick={this.showConfirm}
                    onChange={this.fireChangeHandler}
                />
                <label className="onoffswitch-label" htmlFor={this.props.id}>
                    <span className="onoffswitch-inner" />
                    <span className="onoffswitch-switch" />
                </label>
            </span>
        );
    }
});
