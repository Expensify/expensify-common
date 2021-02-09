import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import {invoke} from '../../../Func';
import {UI} from '../../../CONST';
import Switch from './switch';

/**
 * Displays an on off switch (optionally) with label
 */
const propTypes = {
    // A unique identifier
    id: PropTypes.string.isRequired,

    // Label to be displayed left to the switch
    label: PropTypes.string,

    // True if the label should be on the right
    labelOnRight: PropTypes.bool,

    // Classes of the label
    labelClasses: PropTypes.any,

    // True if the switch is on
    checked: PropTypes.bool.isRequired,

    // Callback function to call when changing the switch (optional)
    onChangeCallback: PropTypes.func,

    // Element to be displayed below the switch when it's on (optional)
    children: PropTypes.node,

    // Disable edition of the switch (optional)
    preventEdit: PropTypes.bool,

    // Description to be displayed below the switch (optional)
    description: PropTypes.string,

    // If set to true, the description of the switch is only displayed when it is in the 'checked' state (optional)
    onlyShowDescriptionWhenOn: PropTypes.bool,

    // If set to true, children elements won't be applied a left padding (optional)
    noLeftPaddingOnChildren: PropTypes.bool,

    // Whether we should always show the children classes
    alwaysShowChildren: PropTypes.bool,

    // If set to true, the description of the switch will be placed above the children elements (optional)
    descriptionBeforeChildren: PropTypes.bool,

    // Safety check to ensure we are using dangerouslySetInnerHTML() safely
    safeDescription: PropTypes.bool,

    // An array of extra classes to put on the combobox
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]),

    // There is usually text just following a switch that says "ENABLED" and "DISABLED" and
    // you can use this option to hide that text
    hideEnabledDisabledText: PropTypes.bool,

    // Text to display in a tooltip
    tooltipText: PropTypes.string,
};

const defaultProps = {
    label: '',
    labelOnRight: false,
    labelClasses: null,
    onChangeCallback: () => {},
    children: null,
    preventEdit: false,
    description: '',
    onlyShowDescriptionWhenOn: false,
    noLeftPaddingOnChildren: false,
    alwaysShowChildren: false,
    descriptionBeforeChildren: false,
    safeDescription: false,
    hideEnabledDisabledText: false,
    extraClasses: [],
    tooltipText: '',
};

class OnOffSwitch extends Component {
    constructor(props) {
        super(props);

        this.onChangeCallback = this.onChangeCallback.bind(this);
        this.lock = this.lock.bind(this);
        this.unlock = this.unlock.bind(this);
        this.getValue = this.getValue.bind(this);

        this.state = {
            checked: this.props.checked,
            preventEdit: this.props.preventEdit,
            preventEditDescription: '',
        };
    }

    /**
     * Callback function called after toggling the switch
     * @param {boolean} newState
     */
    onChangeCallback(newState) {
        invoke(this.props.onChangeCallback, [newState]);
        this.setState({
            checked: newState
        });
    }

    /**
     * Is the switch on or off ?
     *
     * @returns {boolean} true if on
     */
    getValue() {
        return this.state.checked;
    }

    /**
     * Force switch off and prevent editing it
     * @param {boolean} checked
     * @param {string} msg
     */
    lock(checked, msg) {
        this.setState({
            checked,
            preventEdit: true,
            preventEditDescription: msg
        });
    }

    /**
     * Release switch to its original value, and allow editing it
     */
    unlock() {
        this.setState(prevState => ({
            checked: prevState.checked,
            preventEdit: false,
            preventEditDescription: ''
        }));
    }

    render() {
        const childrenClasses = {
            depreciated: !this.props.noLeftPaddingOnChildren,
            helperLabel: !this.props.noLeftPaddingOnChildren
        };

        if (!this.props.alwaysShowChildren) {
            childrenClasses[UI.HIDDEN] = !this.state.checked;
        }

        const children = this.props.children ? (
            <div className={cn(childrenClasses)}>{this.props.children}</div>
        ) : null;

        // Only use dangerouslySetInnerHTML if we explicitly pass safeDescription as a parameter.
        // Otherwise, just set the description inside a div
        // We use dangerouslySetInnerHTML, which could introduce XSS vulnerabilities if derived from user input,
        // to keep the description property simple without a bunch of nested HTML elements
        const description = this.state.preventEdit && this.state.preventEditDescription
            ? this.state.preventEditDescription
            : this.props.description;
        let descriptionElm = null;

        if (description && (this.state.checked || !this.props.onlyShowDescriptionWhenOn)) {
            if (this.props.safeDescription) {
                descriptionElm = (
                    <div
                        className="depreciated helperLabel"
                        dangerouslySetInnerHTML={{__html: description}}
                    />
                );
            } else {
                descriptionElm = <div className="depreciated helperLabel">{description}</div>;
            }
        }

        return (
            <div>
                {/* For 100% a11y compliance we'd need to move the <input> into the <label> element */}
                {/* eslint-disable jsx-a11y/label-has-for */}
                {this.props.label && !this.props.labelOnRight
                    && <label className={cn(this.props.labelClasses)} htmlFor={this.props.id}>{this.props.label}</label>
                }
                <Switch
                    id={this.props.id}
                    checked={this.state.checked}
                    disabled={this.state.preventEdit}
                    onChange={this.onChangeCallback}
                    extraClasses={[
                        this.props.extraClasses,
                        {marginLeft10: !this.props.labelOnRight}
                    ]}
                    hideEnabledDisabledText={this.props.hideEnabledDisabledText}
                    tooltipText={this.props.tooltipText}
                />
                {this.props.label && this.props.labelOnRight && (
                    <label
                        className={cn(this.props.labelClasses, 'marginLeft5')}
                        htmlFor={this.props.id}
                    >
                        {this.props.label}
                    </label>
                )}
                {this.props.descriptionBeforeChildren ? (
                    <div>
                        {descriptionElm}
                        {children}
                    </div>
                ) : (
                    <div>
                        {children}
                        {descriptionElm}
                    </div>
                )}
            </div>
        );
    }
}

OnOffSwitch.propTypes = propTypes;
OnOffSwitch.defaultProps = defaultProps;

export default OnOffSwitch;
