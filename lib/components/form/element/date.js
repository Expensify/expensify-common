import React from 'react';
import moment from 'moment';
import cn from 'classnames';
import _ from 'underscore';
import PropTypes from 'prop-types';
import withExtraClasses from '../../../hoc/withExtraClasses';
/**
 * Form Element Date - Displays a jQuery UI datepicker
 */

class FormElementDate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: props.value || ''
        };
    }

    componentDidMount() {
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
        const {className, defaultClasses} = this.props;
        return (
            <input
                ref={(input) => { this.input = input; }}
                id={this.props.id}
                name={this.props.id}
                className={cn(defaultClasses, className)}
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
    options: {},
    onChange: () => {},
    forcedUpdate: () => {},
    readOnly: false,
    openOnInit: false,
    defaultClasses: ['calendar', 'calendarMedium'],
    disabled: false,
    className: ''
};

FormElementDate.propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    // This allows us to force update the form because the Datepicker
    // events don't fire properly for React to listen to them
    forcedUpdate: window.PropTypes.func,
    openOnInit: window.PropTypes.bool
};

module.exports = withExtraClasses(FormElementDate);
