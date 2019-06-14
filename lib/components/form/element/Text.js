import React, {Component} from 'react';
import _ from 'underscore';
import cn from 'classnames';
import PropTypes from 'prop-types';
import {invoke} from '../../../Func';

/**
 * Form Element Text - Displays a standard input element with type of "text"
 */
export default class FormElementText extends Component {
    static get propTypes() {
        return {
            id: PropTypes.string,
            inputType: PropTypes.string
        };
    }

    static get defaultProps() {
        return {
            inputType: 'text'
        };
    }

    constructor(props) {
        super(props);
        this.initialClasses = props.extraClasses;
        this.getValue = this.getValue.bind(this);
        this.clearValue = this.getValue.bind(this);
        this.resortToDefaultText = this.resortToDefaultText.bind(this);
        this.clearError = this.clearError.bind(this);
        this.showError = this.showError.bind(this);

        this.state = {
            classes: this.initClasses
        };
    }

    componentDidMount() {
        this.$textElement = $(this.textElement);
    }

    getValue() {
        return this.$textElement.val();
    }

    clearValue(shouldFocus) {
        this.$textElement.val('');
        if (shouldFocus !== false) {
            this.$textElement.focus();
        }

        invoke(this.props.forcedUpdate);
    }

    resortToDefaultText() {
        if (this.$textElement.val() === '') {
            this.$textElement.val(this.props.resortToDefaultText);
        }
    }

    clearError() {
        this.setState({
            classes: this.initialClasses
        });
    }

    showError() {
        this.setState(state => ({
            classes: cn(state.classes, UI.ERROR)
        }));
    }

    render() {
        return (
            <input
                ref={el = this.textElement = el}
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
}
