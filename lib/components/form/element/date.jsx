/* globals React, ReactDOM */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const propTypes = {
    options: PropTypes.object,
    id: PropTypes.string,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    maxDate: PropTypes.string,
    disabled: PropTypes.bool,
    dateFormat: PropTypes.bool,

    // This allows us to force update the form because the Datepicker
    // events don't fire properly for React to listen to them
    forcedUpdate: PropTypes.func
};

const defaultProps = {
    options: {},
    onChange: () => {},
    forcedUpdate: () => {},
};

/**
 * Form Element Date - Displays a jQuery UI datepicker
 */
class FormElementDate extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const $this = $(ReactDOM.findDOMNode(this));

        this.props.options.selectOtherMonths = true;
        this.props.options.showOtherMonths = true;
        this.props.options.maxDate = this.props.maxDate;
        this.props.options.dateFormat = this.props.dateFormat;

        // Force update the form when we select a date
        this.props.options.onSelect = (e) => {
            this.props.onChange(e);
            this.props.forcedUpdate(e);
        };

        // Create our JQuery UI datepicker
        $this.datepicker(this.props.options);
        if (this.props.defaultValue) {
            $this.datepicker('setDate', this.props.defaultValue);
        }
    }

    /**
     * This will update an option on our date picker
     * @param  {string} optionName
     * @param  {mixed} value
     */
    updateOption(optionName, value) {
        const $this = $(ReactDOM.findDOMNode(this));
        $this.datepicker('option', optionName, value);
    }

    render() {
        return (
            <input
                id={this.props.id}
                name={this.props.id}
                className={this.props.className}
                value={this.props.value}
                onChange={this.props.onChange}
                type="text"
                disabled={this.props.disabled}
                readOnly="true"
            />
        );
    }
}

FormElementDate.propTypes = propTypes;
FormElementDate.defaultProps = defaultProps;

export default FormElementDate;