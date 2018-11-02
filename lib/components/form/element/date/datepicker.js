import React from 'react';
import cn from 'classnames';
import _ from 'underscore';
// import moment from 'moment';

class DatePicker extends React.Component {
    constructor(props) {
        super(props);
        this.showError = props.showError;
        this.clearError = props.clearError;
        this.handleChange = this.handleChange.bind(this);
        this.getValue = this.getValue.bind(this);
        this.updateOption = this.updateOption.bind(this);
    }

    componentDidMount() {
        // bind instance to onRef prop passed to FormElementData
        this.props.onRef(this);
        const options = {
            selectOtherMonths: true,
            showOtherMoths: true,
            maxDate: this.props.maxDate,
            dateFormat: this.props.dateFormat
        };

        this.$el = $(this.el);
        this.$el.datepicker(options);
        this.handleChange = this.handleChange.bind(this);
        this.$el.on('change', this.handleChange);
        if (this.props.defaultValue) {
            this.$el.datepicker('setDate', this.props.defaultValue);
        }
        if (this.props.openOnInit) {
            this.$el.focus();
        }
    }

    getValue() {
        return this.$el.val();
    }

    handleChange(e) {
        const date = e.target.value;
        if (!_.isUndefined(date)) {
            this.clearError();
            this.props.onChange(date);
        }
        // Still need to fix validation...
        // if (!(moment(date, 'YYYY-MM-DD', true).isValid() && moment(date).isBetween('1900-01-01', '2999-12-31'))) {
        //     this.showError();
        // }
    }

    componentWillUnMount() {
        this.$el.off('change', this.handleChange);
        this.$el.datepicker('destroy');
    }

    clearValue(shouldFocus) {
        this.$el.val('');
        if (shouldFocus !== false) {
            this.$el.focus();
        }
    }

    /**
     * This will update an option on our date picker
     * @param  {string} optionName
     * @param  {mixed} value
     */

    updateOption(optionName, value) {
        this.$el.datepicker('option', optionName, value);
    }

    render() {
        const {extraClasses, defaultClasses, validationClasses} = this.props;
        return (
            <React.Fragment>
                <input
                    ref={el => this.el = el}
                    id={this.props.id}
                    name={this.props.id}
                    className={cn(extraClasses, defaultClasses, validationClasses)}
                    placeholder={this.props.placeholder}
                    type="text"
                    disabled={this.props.disabled}
                    readOnly={this.props.readOnly}
                    required={this.props.required}
                    autoComplete="off"
                />
            </React.Fragment>
        );
    }
}

export default DatePicker;
