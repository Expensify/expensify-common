/* globals Func, Modal, _ */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

/**
 * Form Element Switch - Displays an on/off switch
 */

const propTypes = {
    id: PropTypes.string.isRequired,

    // If it is turned on by default
    checked: PropTypes.bool,

    // If it is disabled or not
    disabled: PropTypes.bool,

    // A callback method for when the value is changed
    onChange: PropTypes.func,

    // A configuration object that is passed to Modal.confirm() if we want to have
    // the user confirm their choice
    confirm: PropTypes.object,

    // An array of extra classes to put on the combobox
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]),
};

const defaultProps = {
    checked: false,
    disabled: false,
    onChange: () => {},
    confirm: null,
    extraClasses: [],
};

class Switch extends React.Component {
    constructor(props) {
        super(props);

        this.fireChangeHandler = this.fireChangeHandler.bind(this);
        this.showConfirm = this.showConfirm.bind(this);

        this.checkbox = null;
    }

    /**
     * Gets the value of the field
     *
     * @return {boolean}
     */
    getValue() {
        return $(this.checkbox)[0].checked;
    }

    /**
     * Fires the change handler with the current value
     */
    fireChangeHandler() {
        const {confirm, onChange} = this.props;

        // Don't do anything here if we want the user to confirm their choice
        if (confirm) {
            return;
        }

        Func.invoke(onChange, [this.getValue()]);
    }

    /**
     * If there was a confirm object specified in our properties,
     * then we need to open a confirm modal with those settings
     *
     * @param {SyntheticEvent} e
     * @return {Boolean}
     */
    showConfirm(e) {
        const {confirm, onChange} = this.props;

        // Let our event happen normally
        if (!confirm) {
            return true;
        }

        e.preventDefault();
        Modal.confirm(_.extend({
            onYesCallback: () => {
                // Toggle the checked property and then fire our change handler
                this.checkbox.checked = !this.getValue();
                Func.invoke(onChange, [this.getValue()]);
            }
        }, confirm));
        return false;
    }

    render() {
        const {
            id,
            checked,
            disabled,
            extraClasses
        } = this.props;

        return (
            <span className={cn('onoffswitch-wrapper', extraClasses)}>
                <input
                    ref={ref => this.checkbox = ref}
                    type="checkbox"
                    id={id}
                    className="onoffswitch-checkbox"
                    checked={checked}
                    disabled={disabled}
                    onClick={this.showConfirm}
                    onChange={this.fireChangeHandler}
                />
                <label className="onoffswitch-label" htmlFor={id}>
                    <span className="onoffswitch-inner" />
                    <span className="onoffswitch-switch" />
                </label>
            </span>
        );
    }
}

Switch.propTypes = propTypes;
Switch.defaultProps = defaultProps;

export default Switch;
