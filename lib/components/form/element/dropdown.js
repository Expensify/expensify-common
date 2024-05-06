import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import _ from 'underscore';
import DropDownItem from './dropdownItem';

const propTypes = {
    // These are the elements to show in the dropdown
    options: PropTypes.arrayOf(
        PropTypes.shape({
            // The value of the option, should be unique
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

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
        }),
    ).isRequired,

    // A callback that is triggered when a selection is made and passes the value
    // of the selected option as the only parameter
    onChange: PropTypes.func,

    // Bootstrap 4 compatibility flag
    bs4: PropTypes.bool,

    // An array of extra classes to put on the combobox
    extraClasses: PropTypes.oneOfType([PropTypes.string, PropTypes.array, PropTypes.object]),
};

const defaultProps = {
    onChange: () => {},
    bs4: false,
    extraClasses: [],
};

class DropDown extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.renderOption = this.renderOption.bind(this);
    }

    handleClick(option) {
        if (option.isSelectable === false || option.disabled) {
            return;
        }
        this.props.onChange(option.value);
    }

    renderOption(option) {
        return (
            <DropDownItem
                key={_.uniqueId()}
                bs4={this.props.bs4}
                value={option.value}
                text={option.text}
                disabled={option.disabled}
                focused={option.focused}
                isSelected={option.isSelected}
                isSelectable={option.isSelectable}
                onClick={() => this.handleClick(option)}
            >
                {option.children}
            </DropDownItem>
        );
    }

    render() {
        const {options, extraClasses} = this.props;
        return <ul className={cn('dropdown-menu', extraClasses)}>{_.map(options, this.renderOption)}</ul>;
    }
}

DropDown.propTypes = propTypes;
DropDown.defaultProps = defaultProps;

export default DropDown;
