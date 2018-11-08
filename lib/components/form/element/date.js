import React from 'react';
import _ from 'underscore';
import moment from 'moment';
import cn from 'classnames';
import PropTypes from 'prop-types';

const UI = {ERROR: 'error'};

const propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    onClose: PropTypes.func,
    readOnly: PropTypes.bool,
    required: PropTypes.bool,
    dateFormat: PropTypes.string,
    openOnInit: PropTypes.bool,
    disabled: PropTypes.bool,
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object,
        PropTypes.array
    ]),
    hasError: PropTypes.bool,
    maxDate: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
};

const defaultProps = {
    onChange: () => {},
    onClose: () => {},
    readOnly: false,
    openOnInit: false,
    defaultClasses: ['calendar', 'calendarMedium'],
    value: moment().format('YYYY-MM-DD'),
    dateFormat: 'yy-mm-dd',
    disabled: false,
    extraClasses: '',
    hasError: false,
    maxDate: null,
    required: false
};

class FormElementDate extends React.Component {
    constructor(props) {
        super(props);
        this.composeClasses = this.composeClasses.bind(this);
    }

    componentDidMount() {
        const options = {
            selectOtherMonths: true,
            showOtherMoths: true,
            maxDate: this.props.maxDate,
            dateFormat: this.props.dateFormat,
            // pass an onClose callback as a prop not on this component
            // since we might want to call other operations on close
            onClose: this.props.onClose
        };
        this.$el = $(this.el);
        this.$el.datepicker(options);
        this.handleChange = this.handleChange.bind(this);
        this.$el.on('change', this.handleChange);
        if (this.props.openOnInit) {
            this.$el.focus();
        }
    }

    handleChange({target}) {
        const date = target.value || '';
        if (!_.isUndefined(date)) {
            this.props.onChange(date);
        }
    }

    componentWillUnMount() {
        this.$el.off('change', this.handleChange);
        this.$el.datepicker('destroy');
    }

    /**
     * This will update an option on our date picker
     * @param  {string} optionName
     * @param  {mixed} value
     */
    // Can this be removed? It's not in use AFAIK
    updateOption(optionName, value) {
        this.$el.datepicker('option', optionName, value);
    }

    composeClasses() {
        const {extraClasses, hasError, defaultClasses} = this.props;
        return cn(
            defaultClasses,
            extraClasses || [],
            hasError ? (UI.ERROR || 'error') : ''
        );
    }

    render() {
        return (
            <input
                ref={el => this.el = el}
                id={this.props.id}
                name={this.props.id}
                className={this.composeClasses()}
                placeholder={this.props.placeholder}
                value={this.props.value}
                onChange={e => this.props.onChange(e.target.value)}
                type="text"
                readOnly={this.props.readOnly}
                required={this.props.required}
                autoComplete="off"
                disabled={this.props.disabled}
            />
        );
    }
}

FormElementDate.propTypes = propTypes;
FormElementDate.defaultProps = defaultProps;
module.exports = FormElementDate;
