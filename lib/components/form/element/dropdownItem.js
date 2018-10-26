/* globals React, Str */

/**
 * A very basic dropdown item
 */
const propTypes = {
    // The function to be called when this item is being clicked
    onClick: window.PropTypes.func.isRequired,

    // The value of the option, should be unique
    value: window.PropTypes.any.isRequired,
    // The human readable text of the option
    text: window.PropTypes.string,
    // If we need more than text to style more each option
    children: window.PropTypes.element,
    // Whether or not the option is currently disabled
    disabled: window.PropTypes.bool,
    // Whether or not the option is currently in focus
    focused: window.PropTypes.bool,
    // Whether or not the option is currently selected
    isSelected: window.PropTypes.bool,
    // Whether or not the option can be selected
    isSelectable: window.PropTypes.bool,
};

const defaultProps = {
    text: '',
    children: null,
    disabled: false,
    focused: false,
    isSelected: false,
    isSelectable: true,
};

function DropDownItem(props) {
    const classes = {
        a: {
            focus: props.focused
        },
        li: {
            active: props.isSelected && props.isSelectable !== false,
            'li-compact': true,
            disabled: props.isSelectable === false || props.disabled,
            'dropdown-header': props.disabled,
            'combobox-option-divider': this.props.divider
        },
    };

    // Don't do anything when clicking if we can't select something
    const clickHandler = props.isSelectable !== false && !props.disabled
        ? props.onClick
        : () => {};

    return (
        <li className={React.classNames(classes.li)} data-value={props.value}>
            { this.props.divider ?
            <a/> :
            <a
                className={React.classNames(classes.a)}
                onClick={clickHandler}
                tabIndex="-1"
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

DropDownItem.propTypes = propTypes;
DropDownItem.defaultProps = defaultProps;

module.exports = DropDownItem;
