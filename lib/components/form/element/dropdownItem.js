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

    // Bootstrap 4 compatibility flag
    bs4: PropTypes.bool,
};

const defaultProps = {
    text: '',
    children: null,
    disabled: false,
    focused: false,
    isSelected: false,
    isSelectable: true,
    bs4: false,
};

class DropDownItem extends React.Component {
    constructor(props) {
        super(props);
        this.createTooltip = this.createTooltip.bind(this);
    }

    componentDidMount() {
        this.hasInstantiatedTooltip = false;
    }

    componentWillUnmount() {
        this.destroyTooltip();
    }

    /**
     * Only instantiate the tooltip this dropdown item contains
     */
    createTooltip() {
        if (!this.hasInstantiatedTooltip) {
            this.tooltipContainer.tooltip({
                template: '<div class="tooltip tooltip--from-combobox" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
            });
            this.hasInstantiatedTooltip = true;
        }
    }

    /**
     * If there is an instantiated tooltip on the component, destroy it
     */
    destroyTooltip() {
        if (this.hasInstantiatedTooltip) {
            this.tooltipContainer.tooltip('hide');
            this.hasInstantiatedTooltip = false;
        }
    }

    render() {
        const classes = {
            a: {
                focus: this.props.focused,
            },
            liOrButton: {
                active: this.props.isSelected && this.props.isSelectable !== false,
                'li-compact': !this.props.bs4,
                'dropdown-item': this.props.bs4,
                disabled: this.props.isSelectable === false || this.props.disabled,
                'dropdown-header': this.props.disabled,
                divider: this.props.divider
            },
        };
        const extraClasses = cn('expensicons expensicons-checkmark', this.props.extraClasses);

        // Don't do anything when clicking if we can't select something
        const clickHandler = this.props.isSelectable !== false && !this.props.disabled
            ? this.props.onClick
            : () => {};

        // Special rendering if we're in Bootstrap 4 compat mode
        if (this.props.bs4) {
            if (this.props.divider) {
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
                    data-value={this.props.value}
                    title={typeof this.props.children === 'string' ? this.props.children : Str.htmlDecode(this.props.text)}
                >
                    {this.props.isSelected && this.props.isSelectable !== false ? (
                        <span>
                            <i className={extraClasses} />
                            {' '}
                        </span>
                    ) : ''}
                    {this.props.children || Str.htmlDecode(this.props.text)}
                </button>
            );
        }

        return (
            <li className={cn(classes.liOrButton)} data-value={this.props.value}>
                {!this.props.divider
                    && (
                        <a
                            className={cn(classes.a)}
                            onClick={clickHandler}
                            role="button"
                            tabIndex="-1"
                            data-toggle="tooltip"
                            onMouseEnter={this.createTooltip}
                            onFocus={this.createTooltip}
                            data-container="body"
                            data-delay='{"show":1000, "hide":100}'
                            title={typeof this.props.children === 'string' ? this.props.children : Str.htmlDecode(this.props.text)}
                            ref={el => this.tooltipContainer = $(el)}
                        >
                            {this.props.isSelected && this.props.isSelectable !== false ? (
                                <span>
                                    <i className={extraClasses} />
                                    {' '}
                                </span>
                            ) : ''}
                            {this.props.children || Str.htmlDecode(this.props.text)}
                        </a>
                    )
                }
            </li>
        );
    }
}

DropDownItem.propTypes = propTypes;
DropDownItem.defaultProps = defaultProps;

export default DropDownItem;
