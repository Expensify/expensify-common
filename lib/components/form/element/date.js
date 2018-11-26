/* globals Func, UI, moment */

import React, {Component} from 'react';
import _ from 'underscore';
import cn from 'classnames';
import PropTypes from 'prop-types';

/**
 * Form Element Date - Displays a jQuery UI datepicker
 */

class FormElementDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value,
            error: ''
        };
        this.updateOption = this.updateOption.bind(this);
        this.getValue = this.getValue.bind(this);
        this.clearValue = this.clearValue.bind(this);
        this.showError = this.showError.bind(this);
        this.clearError = this.clearError.bind(this);
    }

    componentDidMount() {
        this.$datepicker = $(this.datepicker);

        this.props.options.selectOtherMonths = true;
        this.props.options.showOtherMonths = true;
        this.props.options.maxDate = this.props.maxDate || null;
        if (this.props.dateFormat) {
            this.props.options.dateFormat = this.props.dateFormat;
        }

        // Force update the form when we select a date
        this.props.options.onClose = (date) => {
            if (!(moment(date, 'YYYY-MM-DD', true).isValid() && moment(date).isBetween('1900-01-01', '2999-12-31'))) {
                this.showError();
            } else {
                this.setState({value: date}, () => {
                    this.props.onChange(date);
                    this.props.forcedUpdate(date);
                });
            }
        };

        // Create our JQuery UI datepicker
        this.$datepicker.datepicker(this.props.options);
        if (this.props.defaultValue) {
            this.$datepicker.datepicker('setDate', this.props.defaultValue);
        }
        if (this.props.openOnInit) {
            this.$datepicker.focus();
        }

        /** 
         * The check for onRef is needed to support legacy usgaes of mixins (which expose these instance methods)
         * And are called directly via a ref rather than expose the entire instance we're just passing the methods
         * we want to make available to any component using instance methods
         */ 
        if (this.props.onRef) {
            this.props.onRef({
                getValue: this.getValue,
                clearValue: this.clearValue,
                showError: this.showError,
                clearError: this.clearError
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(nextProps.value)) {
            this.setState({value: nextProps.value});
        }
    }

    /**
     * Instance method for retrieving date value
     *
     * @return {string}
     */

    getValue() {
        return this.$datepicker.val();
    }

    /**
     * This will update an option on our date picker
     * @param  {string} optionName
     * @param  {mixed} value
     */
    updateOption(optionName, value) {
        this.$datepicker.datepicker('option', optionName, value);
    }

    /**
     * Clears the value of the field
     * @param {bool} [shouldFocus] default true
     */
    clearValue(shouldFocus) {
        this.$datepicker.val('');
        if (shouldFocus !== false) {
            this.$datepicker.focus();
        }
        Func.invoke(this.props.forcedUpdate);
    }

    /**
     * Display the error state of this element
     */
    showError() {
        this.setState({error: UI.ERROR});
    }

    /**
     * Clear the error state of this element
     */
    clearError() {
        this.setState({error: ''});
    }

    render() {
        return (
            <input
                id={this.props.id}
                ref={input => this.datepicker = input}
                name={this.props.id}
                className={cn([this.props.className, this.props.extraClasses, this.state.error])}
                placeholder={this.props.placeholder}
                value={this.state.value}
                defaultValue={this.props.defaultValue}
                onChange={e => this.setState({value: e.currentTarget.value})}
                type="text"
                autoComplete="off"
                disabled={this.props.disabled}
                readOnly={this.props.readOnly}
                required={this.props.required}
            />
        );
    }
}

FormElementDate.propTypes = {
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
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object
    ]),
    // This allows us to force update the form because the Datepicker
    // events don't fire properly for React to listen to them
    forcedUpdate: PropTypes.func,
    openOnInit: PropTypes.bool,
    onRef: PropTypes.func
};

FormElementDate.defaultProps = {
    options: {},
    onRef: null,
    extraClasses: null,
    id: '',
    placeholder: '',
    required: false,
    maxDate: null,
    dateFormat: null,
    value: '',
    defaultValue: null,
    onChange: () => {},
    forcedUpdate: () => {},
    readOnly: false,
    openOnInit: false
};

export default FormElementDate;
