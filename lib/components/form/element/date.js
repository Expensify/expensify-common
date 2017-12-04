/* globals React, ReactDOM */

/**
 * Form Element Date - Displays a jQuery UI datepicker
 */
module.exports =  window.CreateClass({

    propTypes: {
        options: window.PropTypes.object,
        id: window.PropTypes.string,
        defaultValue: window.PropTypes.string,
        value: window.PropTypes.string,
        onChange: window.PropTypes.func,
        maxDate: window.PropTypes.string,
        disabled: window.PropTypes.bool,
        placeholder: window.PropTypes.string,
        dateFormat: window.PropTypes.string,
        readOnly: window.PropTypes.bool,

        // This allows us to force update the form because the Datepicker
        // events don't fire properly for React to listen to them
        forcedUpdate: PropTypes.func
    },

    getDefaultProps() {
        return {
            options: {},
            onChange: () => {
            },
            forcedUpdate: () => {
            },
        }
    },

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
    },

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
                className={this.props.className}
                value={this.props.value}
                placeholder={this.props.placeholder}
                onChange={this.props.onChange}
                type="text"
                disabled={this.props.disabled}
                readOnly={this.props.readOnly}
            />
        );
    }
});