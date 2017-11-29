/* global React */

/**
 * This mixin adds the ability to specify an `extraClasses` property
 * on a component that is added to any default classes that the component uses.
 * It keeps these classes in the state so that they can be dynamically changed
 * if needed.
 *
 * The `extraClasses` property should be an array containing elements
 * for each class to add to the component.
 *
 * Usage:
 * // Use the mixin in a component
 * React.registerComponent(['div'], {
 *     mixins: [React.m.ExtraClasses)],
 *     render() { return <div className={this.state.classes} />; }
 * });
 *
 * // Using that component
 * render() {
 *     let Div = React.c(['div']);
 *     return <Div extraClasses={['large', 'primary']} />;
 * }
 */
module.exports = {
    propTypes: {
        extraClasses: window.PropTypes.oneOf([
            window.PropTypes.string,
            window.PropTypes.array,
            window.PropTypes.object,
        ]),
    },

    componentWillReceiveProps(nextProps) {
        this.setState({classes: React.classNames(this.defaultClasses || [], nextProps.extraClasses)});
    },

    getInitialState() {
        return {
            classes: React.classNames(this.defaultClasses || [], this.props.extraClasses)
        };
    }
};
