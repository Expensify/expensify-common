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

    // Whether this item is a divider or not
    divider: PropTypes.bool,

    // Bootstrap 4 compatibility flag
    bs4: PropTypes.bool,

    // An array of extra classes to put on the combobox
    extraClasses: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]),
};

const defaultProps = {
    text: '',
    children: null,
    disabled: false,
    focused: false,
    isSelected: false,
    isSelectable: true,
    divider: false,
    bs4: false,
    extraClasses: [],
};

const DropDownItem = (props) => {
    const classes = {
        a: {
            focus: props.focused,
        },
        liOrButton: {
            active: props.isSelected && props.isSelectable !== false,
            'li-compact': !props.bs4,
            'dropdown-item': props.bs4,
            disabled: props.isSelectable === false || props.disabled,
            'dropdown-header': props.disabled,
            divider: props.divider
        },
    };
    const extraClasses = cn('expensicons expensicons-checkmark', props.extraClasses);

    // Don't do anything when clicking if we can't select something
    const clickHandler = props.isSelectable !== false && !props.disabled
        ? props.onClick
        : () => {};

    // Special rendering if we're in Bootstrap 4 compat mode
    if (props.bs4) {
        if (props.divider) {
            return (<div className="dropdown-divider" />);
        }

        return (
            <button
                type="button"
                className={cn(classes.liOrButton)}
                onClick={clickHandler}
                data-toggle="tooltip"
                data-container="body"
                data-delay='{"show":1000, "hide":100}'
                data-value={props.value}
                title={typeof props.children === 'string' ? props.children : Str.htmlDecode(props.text)}
            >
                {props.isSelected && props.isSelectable !== false ? (
                    <span>
                        <i className={extraClasses} />
                        {' '}
                    </span>
                ) : ''}
                {props.children || Str.htmlDecode(props.text)}
            </button>
        );
    }

    return (
        <li className={cn(classes.liOrButton)} data-value={props.value}>
            {!props.divider
                && (
                    // eslint-disable-next-line jsx-a11y/anchor-is-valid
                    <a
                        href="#"
                        className={cn(classes.a)}
                        onClick={clickHandler}
                        role="button"
                        tabIndex="-1"
                        data-toggle="tooltip"
                        data-container="body"
                        data-delay='{"show":1000, "hide":100}'
                        title={typeof props.children === 'string' ? props.children : Str.htmlDecode(props.text)}
                    >
                        {props.isSelected && props.isSelectable !== false ? (
                            <span>
                                <i className={extraClasses} />
                                {' '}
                            </span>
                        ) : ''}
                        {props.children || Str.htmlDecode(props.text)}
                    </a>
                )
            }
        </li>
    );
};

DropDownItem.propTypes = propTypes;
DropDownItem.defaultProps = defaultProps;

export default DropDownItem;
