import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Str from '../../../str';

/**
 * A very basic dropdown item
 */
const propTypes = {
    // The function to be called when this item is being clicked
    onClick: PropTypes.func.isRequired,
    // The value of the option, should be unique
    value: PropTypes.any.isRequired,
    // The human readable text of the option
    text: PropTypes.string,
    // If we need more than text to style more each option
    children: PropTypes.element,
    // Whether or not the option is currently disabled
    disabled: PropTypes.bool,
    // Whether or not the option is currently in focus
    focused: PropTypes.bool,
    // Whether or not the option is currently selected
    isSelected: PropTypes.bool,
    // Whether or not the option can be selected
    isSelectable: PropTypes.bool,
};

const defaultProps = {
    text: '',
    children: null,
    disabled: false,
    focused: false,
    isSelected: false,
    isSelectable: true,
};

class DropDownItem extends React.Component {
    render() {
        const classes = {
            a: {
                focus: this.props.focused
            },
            li: {
                active: this.props.isSelected && this.props.isSelectable !== false,
                'li-compact': true,
                disabled: this.props.isSelectable === false || this.props.disabled,
                'dropdown-header': this.props.disabled,
                'combobox-option-divider': this.props.divider
            },
        };
        const extraClasses = cn('expensicons expensicons-checkmark', this.props.extraClasses);

        // Don't do anything when clicking if we can't select something
        const clickHandler = this.props.isSelectable !== false && !this.props.disabled
            ? this.props.onClick
            : () => {};

        return (
            <li className={cn(classes.li)} data-value={this.props.value}>
                { props.divider ?
                <a/> :
                <a
                    className={React.classNames(classes.a)}
                    onClick={clickHandler}
                    tabIndex="-1"
                    data-toggle="tooltip"
                    data-toggle={props.divider ? null : "tooltip"}
                    data-container="body"
                    data-delay='{"show":1000, "hide":100}'
                    title={typeof props.children === 'string' ? props.children : Str.htmlDecode(props.text)}
                >
                    {props.isSelected && props.isSelectable !== false ? <span><React.c.Icon name="checkmark" />{' '}</span> : ''}
                    {props.children || Str.htmlDecode(props.text)}
                </a>
                }
            </li>
        );
    }
}

DropDownItem.propTypes = propTypes;
DropDownItem.defaultProps = defaultProps;

export default DropDownItem;
