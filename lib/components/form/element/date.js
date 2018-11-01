import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'underscore';
import moment from 'moment';

/**
 * Form Element Date - Displays a jQuery UI datepicker
 */

class FormElementDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        };
    }

    componentDidMount() {
        const $this = $(ReactDOM.findDOMNode(this));

        this.props.options.selectOtherMonths = true;
        this.props.options.showOtherMonths = true;
        this.props.options.maxDate = this.props.maxDate;
        this.props.options.dateFormat = this.props.dateFormat;

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
        const $this = $(ReactDOM.findDOMNode(this));
        $this.datepicker('option', optionName, value);
    }

    render() {
        return (
            <input
                id={this.props.id}
                name={this.props.id}
                className={this.props.className}
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

FormElementDate.defaultProps = {
    options: {},
    onChange: () => {},
    forcedUpdate: () => {},
    readOnly: false,
    openOnInit: false
};

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
    forcedUpdate: PropTypes.func,
    openOnInit: PropTypes.bool
};

export default FormElementDate;
