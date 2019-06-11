import React from 'react';
import {invoke} from '../../../Func';
import {UI} from '../../../CONST';

/**
 * On off switch.
 *
 * To be used like this :
 * <React.c.OnOffSwitch
 *      extraClasses=""
 *      id="intacct_category"
 *      label="Categories"                  // Label to be displayed left to the switch
 *      checked={true}                      // True if the switch is on
 *      description="This is it"            // Description to be displayed below the switch (optional)
 *      preventEdit={true}                  // Disable edition of the switch (optional)
 *      onChangeCallback={this.onCallback}  // Callback function to call when changing the switch (optional)
 *      onlyShowDescriptionWhenOn={false}   // If set to true, the description of the switch is only displayed when it is in the 'checked' state (optional)
 *      noLeftPaddingOnChildren={false}     // If set to true, children elements won't be applied a left padding (optional)
 *      descriptionBeforeChildren={false}   // If set to true, the description of the switch will be placed above the children elements (optional)
 * >
 *      <Children />                        // Element to be displayed below the switch when it's on (optional)
 * </React.c.OnOffSwitch>
 */
React.c.OnOffSwitch = window.CreateClass({
    propTypes: {
        id: window.PropTypes.string.isRequired,
        label: window.PropTypes.string,
        labelOnRight: window.PropTypes.bool,
        labelClasses: window.PropTypes.any,
        checked: window.PropTypes.bool.isRequired,
        onChangeCallback: window.PropTypes.func,
        children: window.PropTypes.node,
        preventEdit: window.PropTypes.bool,
        description: window.PropTypes.string,
        onlyShowDescriptionWhenOn: window.PropTypes.bool,
        noLeftPaddingOnChildren: window.PropTypes.bool,
        alwaysShowChildren: window.PropTypes.bool,
        descriptionBeforeChildren: window.PropTypes.bool,
        safeDescription: window.PropTypes.bool
    },

    mixins: [React.m.ExtraClasses],

    getDefaultProps() {
        return {
            safeDescription: false
        };
    },

    getInitialState() {
        return {
            checked: this.props.checked,
            preventEdit: this.props.preventEdit,
            preventEditDescription: ''
        };
    },

    /**
     * Callback function called after toggling the switch
     * @param {boolean} newState
     */
    onChangeCallback(newState) {
        invoke(this.props.onChangeCallback, [newState]);
        this.setState({
            checked: newState
        });
    },

    /**
     * Is the switch on or off ?
     *
     * @returns {boolean} true if on
     */
    getValue() {
        return this.state.checked;
    },

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
    },

    /**
     * Release switch to its original value, and allow editing it
     */
    unlock() {
        this.setState({
            checked: this.props.checked,
            preventEdit: false,
            preventEditDescription: ''
        });
    },

    defaultClasses: ['onoffswitch-wrapper'],

    render() {
        const childrenClasses = {
            depreciated: !this.props.noLeftPaddingOnChildren,
            helperLabel: !this.props.noLeftPaddingOnChildren
        };
        if (!this.props.alwaysShowChildren) {
            childrenClasses[UI.HIDDEN] = !this.state.checked;
        }

        const children = this.props.children
            ? <div className={React.classNames(childrenClasses)}>{this.props.children}</div>
            : null;

        // Only use dangerouslySetInnerHTML if we explicitly pass safeDescription as a parameter; otherwise, just set the description inside a div
        // We use dangerouslySetInnerHTML, which could introduce XSS vulnerabilities if derived from user input, to keep the description property simple without a bunch of nested HTML elements
        const description = this.state.preventEdit && this.state.preventEditDescription ? this.state.preventEditDescription : this.props.description;
        let descriptionElm = null;
        if (description && (this.state.checked || !this.props.onlyShowDescriptionWhenOn)) {
            if (this.props.safeDescription) {
                descriptionElm = <div className={'depreciated helperLabel'} dangerouslySetInnerHTML={{__html: description}} />;
            } else {
                descriptionElm = <div className={'depreciated helperLabel'}>{description}</div>;
            }
        }

        return (
            <div>
                {this.props.label && !this.props.labelOnRight ? <label className={React.classNames(this.props.labelClasses)} htmlFor={this.props.id}>{this.props.label}</label> : null}
                <React.c.FormElementSwitch
                    id={this.props.id}
                    checked={this.state.checked}
                    disabled={this.state.preventEdit}
                    onChange={this.onChangeCallback}
                    extraClasses={[this.state.classes, !this.props.labelOnRight ? 'marginLeft10' : '']}
                />
                {this.props.label && this.props.labelOnRight ? <label className={React.classNames(this.props.labelClasses, 'marginLeft5')} htmlFor={this.props.id}>{this.props.label}</label> : null}
                {this.props.descriptionBeforeChildren ? <div>
                    {descriptionElm}
                    {children}
                </div> : <div>
                    {children}
                    {descriptionElm}
                </div>}
            </div>
        );
    }
});
