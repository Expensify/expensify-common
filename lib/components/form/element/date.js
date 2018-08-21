/**
 * WARNING! You're required to load jQuery UI independently from this module to use it.
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';
import cn from 'classnames';

import clearValue from '../../../extensions/clearValue';
import getValue from '../../../extensions/getValue';
import validationErrors from '../../../extensions/validationErrors';

const propTypes = {
    // Set of options to be passed to the jQuery UI datepicker component
    options: PropTypes.object,
    id: PropTypes.string,
    defaultValue: PropTypes.string,
    value: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    maxDate: PropTypes.string,
    dateFormat: PropTypes.string,
    classes: PropTypes.string,

    // This allows us to force update the form because the Datepicker
    // events don't fire properly for React to listen to them
    forcedUpdate: PropTypes.func,
    openOnInit: PropTypes.bool
};

const defaultProps = {
    options: {},
    onChange: () => {},
    forcedUpdate: () => {},
    readOnly: false,
    openOnInit: false
};

/**
 * Form Element Date - Displays a jQuery UI datepicker
 */
class Date extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.getValue = getValue.bind(this);
        this.clearValue = clearValue.bind(this);
        this.showError = validationErrors.showError.bind(this);
        this.clearError = validationErrors.clearError.bind(this);

        this.state = {
            value: props.value || props.defaultValue || ''
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(nextProps.value)) {
            this.setState({value: nextProps.value});
        }
    }

    componentDidMount() {
        const $this = $(this.element);

        // Create our jQuery UI datepicker
        $this.datepicker(Object.assign(this.props.options, {
            selectOtherMonths: true,
            showOtherMonths: true,
            maxDate: this.props.maxDate,
            dateFormat: this.props.dateFormat,
            // Force update the form when we select a date
            onClose: (date) => {
                this.setState({value: date}, () => {
                    this.props.onChange(date);
                    this.props.forcedUpdate(date);
                });
            }
        }));

        if (this.props.defaultValue) {
            $this.datepicker('setDate', this.props.defaultValue);
        }
        if (this.props.openOnInit) {
            $this.focus();
        }
    }

    /**
     * Update a specific option of the jQuery UI datepicker
     *
     * @param {string} optionName
     * @param {mixed} value
     */
    updateOption(optionName, value) {
        $(this.element).datepicker('option', optionName, value);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    render() {
        return (
            <input
                id={this.props.id}
                name={this.props.id}
                className={cn('calendar', {error: this.state.error}, this.props.extraClasses)}
                placeholder={this.props.placeholder}
                value={this.state.value}
                onChange={this.handleChange}
                type="text"
                autoComplete="off"
                disabled={this.props.disabled}
                readOnly={this.props.readOnly}
                required={this.props.required}
                ref={e => this.element = e}
            />
        );
    }
}

Date.propTypes = propTypes;
Date.defaultProps = defaultProps;

export default Date;
