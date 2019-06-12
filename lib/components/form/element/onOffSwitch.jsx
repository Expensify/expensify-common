import React from 'react';
import {invoke} from '../../../Func';
import {UI} from '../../../CONST';
import PropTypes from 'prop-types';
import Switch from './switch';
import cn from 'classnames';

/**
 * An on off switch.
 *
 * To be used like this :
 * <React.c.OnOffSwitch
 *      extraClasses=""
 *      id="intacct_category"
 *      label="Categories"
 *      checked={true}
 *      description="This is it"
 *      preventEdit={true}
 *      onChangeCallback={this.onCallback}
 *      onlyShowDescriptionWhenOn={false}
 *      noLeftPaddingOnChildren={false}
 *      descriptionBeforeChildren={false}
 * >
 *      <Children />
 * </React.c.OnOffSwitch>
 */
 const propTypes = {
    id: PropTypes.string.isRequired,
    alwaysShowChildren: PropTypes.bool,
    labelClasses: PropTypes.any,
    labelOnRight: PropTypes.bool,

    // Label to be displayed left to the switch
    label: PropTypes.string,

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

    // If set to true, the description of the switch will be placed above the children elements (optional)
    descriptionBeforeChildren: PropTypes.bool,

    //
    safeDescription: PropTypes.bool,

    // An array of extra classes to put on the combobox
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]),
};

const defaultProps = {
    checked: false,
    safeDescription: false,
    extraClasses: [],
};

class onOffSwitch extends React.Component {
    constructor (props) {
        super(props);

        this.getInitialState = this.getInitialState.bind(this);
        this.onChangeCallback = this.onChangeCallback.bind(this);
        this.lock = this.lock.bind(this);
        this.unlock = this.unlock.bind(this);

        this.state = this.getInitialState();
    }

    getInitialState() {
        return {
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
            checked: checked,
            preventEdit: true,
            preventEditDescription: msg
        });
    }

    /**
     * Release switch to its original value, and allow editing it
     */
    unlock() {
        this.setState({
            checked: this.state.checked,
            preventEdit: false,
            preventEditDescription: ''
        });
    }

    render() {
        console.log('~~HELLOOOO from js-libs');
        const childrenClasses = {
            depreciated: !this.props.noLeftPaddingOnChildren,
            helperLabel: !this.props.noLeftPaddingOnChildren
        };
        if (!this.props.alwaysShowChildren) {
            childrenClasses[UI.HIDDEN] = !this.state.checked;
        }

        const children = this.props.children
            ? <div className={cn(childrenClasses)}>{this.props.children}</div>
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
                {this.props.label && !this.props.labelOnRight ? <label className={cn(this.props.labelClasses)} htmlFor={this.props.id}>{this.props.label}</label> : null}
                <Switch
                    id={this.props.id}
                    checked={this.state.checked}
                    disabled={this.state.preventEdit}
                    onChange={this.onChangeCallback}
                    extraClasses={[cn('onoffswitch-wrapper', this.props.extraClasses), !this.props.labelOnRight ? 'marginLeft10' : '']}
                />
                {this.props.label && this.props.labelOnRight ? <label className={cn(this.props.labelClasses, 'marginLeft5')} htmlFor={this.props.id}>{this.props.label}</label> : null}
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
};

onOffSwitch.propTypes = propTypes;
onOffSwitch.defaultProps = defaultProps;

export default onOffSwitch;
