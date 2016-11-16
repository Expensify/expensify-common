/* global classNames, React */

// We won't return a new object here, but we will extend React
// so it can be a central place to hold our views, components, and mixins

/**
 * This is a local copy of https://github.com/JedWatson/classnames so that
 * we don't have to use it out of global everywhere
 *
 * @type {Function}
 */
window.React.classNames = require('classnames');

/**
 * Where all the React mixins are stored
 *
 * @type {Object}
 */
window.React.m = {
    ExtraClasses: require('./mixins/extraClasses')
};

/**
 * Holds all of the view objects that will be turned into
 * React components when the render() method is called
 *
 * @type {Object}
 */
window.React.v = {
    Report: {},
    PolicyEditor: {},
    Modal: {},
    Banner: {}
};

/**
 * Where all of the React components are stored
 *
 * @type {Object}
 */
window.React.c = {
    DropdownItem: require('./components/form/element/dropdownItem'),
    Dropdown: require('./components/form/element/dropdown'),
    FormElementCombobox: require('./components/form/element/combobox')
};

