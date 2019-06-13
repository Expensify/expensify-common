import React from 'react';
import _ from 'underscore';
import createClass from 'create-react-class';
import ExtraClasses from '../../../mixins/extraClasses';
import FormValidationClasses from '../../../mixins/validationClasses';
import FormGetValue from '../../../mixins/getValue';
import FormClearValue from '../../../mixins/clearValue';
import FormResortToDefaultText from '../../../mixins/resortToDefaultText';

/**
 * Form Element Text - Displays a standard input element with type of "text"
 */
export default createClass({
    propTypes: {
        id: window.PropTypes.string,
        inputType: window.PropTypes.string
    },

    mixins: [
        ExtraClasses,
        FormValidationClasses,
        FormGetValue,
        FormClearValue,
        FormResortToDefaultText
    ],

    getDefaultProps() {
        return {
            inputType: 'text'
        };
    },

    render() {
        return (
            <input
                type={this.props.inputType}
                id={this.props.id}
                name={this.props.id}
                className={this.state.classes}

                // The `omit` below acts as a blacklist of HTML attribute properties. This is useful
                // to maximize the flexibility of this form component while also avoiding the need
                // to keep track of all possible attributes.
                // Need to escape the 'type' here as it will otherwise override the inputType
                {..._.omit(this.props, ['type', 'inputType', 'forcedUpdate', 'extraClasses', 'showWhen', 'validation', 'noErrorText'])}
            />
        );
    }
});
