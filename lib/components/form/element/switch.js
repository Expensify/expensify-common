/* globals Func, Modal */

import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import _ from 'underscore';

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
    confirm: PropTypes.object, // eslint-disable-line react/forbid-prop-types

    // An array of extra classes to put on the combobox
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]),

    // There is usually text just following a switch that says "ENABLED" and "DISABLED" and
    // you can use this option to hide that text
    hideEnabledDisabledText: PropTypes.bool,

    // Text to display in a tooltip
    tooltipText: PropTypes.string,
};

const defaultProps = {
    checked: false,
    disabled: false,
    onChange: () => {},
    confirm: null,
    extraClasses: [],
    hideEnabledDisabledText: false,
    tooltipText: '',
};

class Switch extends React.Component {
    constructor(props) {
        super(props);

        this.fireChangeHandler = this.fireChangeHandler.bind(this);
        this.showConfirm = this.showConfirm.bind(this);

        this.checkbox = null;
        this.element = null;
    }

    componentDidMount() {
        $(this.element).tooltip('destroy').tooltip();
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
        // Don't do anything here if we want the user to confirm their choice
        if (this.props.confirm) {
            return;
        }
        Func.invoke(this.props.onChange, [this.getValue()]);
    }

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
                this.checkbox.checked = !this.getValue();
                Func.invoke(this.props.onChange, [this.getValue()]);
            }
        }, this.props.confirm));
        return false;
    }

    render() {
        return (
            <span
                className={cn('onoffswitch-wrapper js_tooltip', this.props.extraClasses)}
                title={this.props.tooltipText}
                ref={el => this.element = el}
            >
                <input
                    ref={el => this.checkbox = el}
                    type="checkbox"
                    id={this.props.id}
                    className="onoffswitch-checkbox"
                    checked={this.props.checked}
                    disabled={this.props.disabled}
                    onClick={this.showConfirm}
                    onChange={this.fireChangeHandler}
                />
                {/* For 100% a11y compliance we'd need to move the <input> into the <label> element */}
                {/* eslint-disable jsx-a11y/label-has-associated-control */}
                {/* eslint-disable jsx-a11y/label-has-for */}
                <label className="onoffswitch-label" htmlFor={this.props.id}>
                    <span className={cn('onoffswitch-inner', {noText: this.props.hideEnabledDisabledText})} />
                    <span className="onoffswitch-switch" />
                </label>
            </span>
        );
    }
}

Switch.propTypes = propTypes;
Switch.defaultProps = defaultProps;

export default Switch;
