/* globals React, Str */

/**
 * A very basic dropdown item
 * @param {Object} props
 * @param {String} props.text
 * @param {String} props.value
 * @param {Boolean} props.disabled
 * @param {Function} props.onClick
 * @param {Boolean} props.focused
 * @param {Boolean} props.isSelected
 * @param {Boolean} props.isSelectable Property that disables combobox click events from firing
 *                                      the logic for this is implemented in `_1dropdown.jsx`
 */

module.exports = (props) => {
    const classes = {
        a: {
            focus: props.focused
        },
        li: {
            active: props.isSelected && props.isSelectable !== false,
            'li-compact': true,
            disabled: props.isSelectable === false || props.disabled,
            'dropdown-header': props.disabled
        }
    };

    // Don't do anything when clicking if we can't select something
    const clickHandler = props.isSelectable !== false && !props.disabled
        ? props.onClick
        : () => {};

    return (
        <li className={React.classNames(classes.li)}>
            <a className={React.classNames(classes.a)} onClick={clickHandler} tabIndex="-1">
                {props.isSelected && props.isSelectable !== false ? <span><React.c.Icon name="checkmark" />{' '}</span> : ''}
                {Str.htmlDecode(props.text)}
            </a>
        </li>
    );
};
