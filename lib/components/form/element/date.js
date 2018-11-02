import React from 'react';
import moment from 'moment';
import cn from 'classnames';
import _ from 'underscore';
import PropTypes from 'prop-types';
import {compose} from 'recompose';
import withExtraClasses from '../../../hoc/withExtraClasses';
import withValidationClasses from '../../../hoc/withValidationClasses';

/**
 * Form Element Date - Displays a jQuery UI datepicker
 */

class FormElementDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || ''
        };
        this.showError = props.showError;
        this.clearError = props.clearError;
    }

    componentDidMount() {
        // lift component instance up to any parent components that might require it
        // kind of an anti-pattern tbh but get's us one step further away from mixins!
        this.props.onRef(this);
        const $this = $(this.input);
        const options = {
            selectOtherMonths: true,
            showOtherMoths: true,
            maxDate: this.props.maxDate || null,
            dateFormat: this.props.dateFormat || 'mm/dd/yy'
        };

        // Force update the form when we select a date
        options.onClose = (date) => {
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
        $this.datepicker(this.props.options);
        if (this.props.defaultValue) {
            $this.datepicker('setDate', this.props.defaultValue);
        }
        if (this.props.openOnInit) {
            $this.focus();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(nextProps.value)) {
            this.setState({value: nextProps.value});
        }
    }

    componentDidUpdate() {
        console.log('component updated');
    }

    // temp putting these methods over here

    getValue() {
        return $(this.input).val();
    }

    clearValue(shouldFocus) {
        const $elm = $(this.input);
        $elm.val('');
        if (shouldFocus !== false) {
            $elm.focus();
        }
        this.props.forcedUpdate();
    }

    /**
     * This will update an option on our date picker
     * @param  {string} optionName
     * @param  {mixed} value
     */
    updateOption(optionName, value) {
        const $this = $(this.input);
        $this.datepicker('option', optionName, value);
    }

    render() {
        const {errorClasses, defaultClasses, validationClasses, className} = this.props;
        console.log('Updating... validationClasses', validationClasses);
        return (
            <input
                ref={(input) => { this.input = input; }}
                id={this.props.id}
                name={this.props.id}
                className={cn(defaultClasses, errorClasses, validationClasses, className)}
                placeholder={this.props.placeholder}
                value={this.state.value}
                defaultValue={this.props.defaultValue}
                onChange={e => this.setState({value: e.currentTarget.value})}
                type="text"
                disabled={this.props.disabled}
                readOnly={this.props.readOnly}
                required={this.props.required}
                autoComplete="off"
            />
        );
    }
}

FormElementDate.defaultProps = {
    id: '',
    options: {},
    readOnly: false,
    openOnInit: false,
    disabled: false,
    className: '',
    errorClasses: '',
    validationClasses: '',
    required: false,
    placeholder: '',
    defaultClasses: ['calendar', 'calendarMedium'],
    showError: () => {},
    clearError: () => {},
    onRef: () => {},
    onChange: () => {},
    forcedUpdate: () => {}
};

FormElementDate.propTypes = {
    id: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    onRef: PropTypes.func,
    required: PropTypes.bool,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    errorClasses: PropTypes.string,
    defaultClasses: PropTypes.arrayOf(PropTypes.string),
    validationClasses: PropTypes.string,
    // This allows us to force update the form because the Datepicker
    // events don't fire properly for React to listen to them
    forcedUpdate: PropTypes.func,
    openOnInit: PropTypes.bool,
    showError: PropTypes.func,
    clearError: PropTypes.func
};

module.exports = compose(
    withValidationClasses,
    withExtraClasses
)(FormElementDate);
