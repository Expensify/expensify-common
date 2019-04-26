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

const DropDownItem = ({
    focused,
    isSelected,
    isSelectable,
    bs4,
    disabled,
    divider,
    onClick,
    value,
    children,
    text,
    extraClasses
}) => {
    const classes = {
        a: {
            focus: focused,
        },
        liOrButton: {
            active: isSelected && isSelectable !== false,
            'li-compact': !bs4,
            'dropdown-item': bs4,
            disabled: isSelectable === false || disabled,
            'dropdown-header': disabled,
            divider
        },
    };

    // Don't do anything when clicking if we can't select something
    const clickHandler = isSelectable !== false && !disabled
        ? onClick
        : () => {};

    // Special rendering if we're in Bootstrap 4 compat mode
    if (bs4) {
        if (divider) {
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
                data-value={value}
                title={typeof children === 'string' ? children : Str.htmlDecode(text)}
            >
                {isSelected && isSelectable !== false ? (
                    <span>
                        <i className={cn('expensicons expensicons-checkmark', extraClasses)} />
                        {' '}
                    </span>
                ) : ''}
                {children || Str.htmlDecode(text)}
            </button>
        );
    }

    return (
        <li className={cn(classes.liOrButton)} data-value={value}>
            {!divider && (
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
                    title={typeof children === 'string' ? children : Str.htmlDecode(text)}
                >
                    {isSelected && isSelectable !== false ? (
                        <span>
                            <i className={cn('expensicons expensicons-checkmark', extraClasses)} />
                            {' '}
                        </span>
                    ) : ''}
                    {children || Str.htmlDecode(text)}
                </a>
            )}
        </li>
    );
};

DropDownItem.propTypes = propTypes;
DropDownItem.defaultProps = defaultProps;

export default DropDownItem;
