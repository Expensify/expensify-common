/* globals React, ReactDOM, _, moment */

/**
 * Form Element Date - Displays a jQuery UI datepicker
 */
module.exports = window.CreateClass({
    propTypes: {
        options: window.PropTypes.object,
        id: window.PropTypes.string,
        defaultValue: window.PropTypes.string,
        value: window.PropTypes.string,
        placeholder: window.PropTypes.string,
        onChange: window.PropTypes.func,
        readOnly: window.PropTypes.bool,
        required: window.PropTypes.bool,

        // This allows us to force update the form because the Datepicker
        // events don't fire properly for React to listen to them
        forcedUpdate: window.PropTypes.func,
        openOnInit: window.PropTypes.bool
    },
    getDefaultProps() {
        return {
            options: {},
            onChange: () => {},
            forcedUpdate: () => {},
            readOnly: false,
            openOnInit: false
        };
    },
    getInitialState() {
        return {
            value: this.props.value
        };
    },
    componentWillReceiveProps(nextProps) {
        if (!_.isUndefined(nextProps.value)) {
            this.setState({value: nextProps.value});
        }
    },
    mixins: [
        React.m.ExtraClasses,
        React.m.FormValidationClasses,
        React.m.FormGetValue,
        React.m.FormClearValue
    ],

    componentDidMount() {
        const $this = $(ReactDOM.findDOMNode(this));

        this.props.options.selectOtherMonths = true;
        this.props.options.showOtherMonths = true;

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
    },

    defaultClasses: ['calendar', 'calendarMedium'],

    /**
     * This will update an option on our date picker
     * @param  {string} optionName
     * @param  {mixed} value
     */
    updateOption(optionName, value) {
        const $this = $(ReactDOM.findDOMNode(this));
        $this.datepicker('option', optionName, value);
    },

    render() {
        return (
            <input
                id={this.props.id}
                name={this.props.id}
                className={this.state.classes}
                placeholder={this.props.placeholder}
                value={this.state.value}
                defaultValue={this.props.defaultValue}
                onChange={e => this.setState({value: e.currentTarget.value})}
                type="text"
                readOnly={this.props.readOnly}
                required={this.props.required}
                autoComplete="off"
            />
        );
    }
});
