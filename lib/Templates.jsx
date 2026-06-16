import $ from 'jquery';
import createTemplate from 'lodash/template';
import * as Utils from './utils';

/**
 * JS Templating system, powered by underscore template
 *
 * Templates is a global namespace for each template, HTML ones or inlines ones.
 *
 * @type Module
 * @class
 */
const templateStore = {};

/**
 * @param {String} templateValue
 * @returns {{get: function(Object=): String}}
 */
function createInlineTemplate(templateValue) {
    let compiled = null;
    let storedValue = templateValue;

    return {
        get(data = {}) {
            if (!compiled) {
                compiled = createTemplate(storedValue, {
                    imports: {
                        // Here we ignore the eslint rule because _ is imported from OD which does not exist in this repo
                        // eslint-disable-next-line no-undef, object-shorthand
                        _: _,
                    },
                });
                storedValue = '';
            }
            return compiled(data);
        },
    };
}

/**
 * @param {String} id
 * @param {function} getNestedTemplate
 * @returns {{get: function(Object=): String}}
 */
function createDOMTemplate(id, getNestedTemplate) {
    let compiled = null;

    return {
        get(data = {}) {
            // Add the "template" object to the parameter to allow nested templates
            const dataToCompile = {...data};
            dataToCompile.nestedTemplate = getNestedTemplate;
            if (!compiled) {
                compiled = createTemplate($(`#${id}`).html(), {
                    imports: {
                        // Here we ignore the eslint rule because _ is imported from OD which does not exist in this repo
                        // eslint-disable-next-line no-undef, object-shorthand
                        _: _,
                    },
                });
            }
            return compiled(dataToCompile);
        },
    };
}

/**
 * Returns the template
 *
 * @param {Array} templatePath
 * @returns {InlineTemplate|undefined}
 */
function getTemplate(templatePath) {
    let template = templateStore;
    for (const pathname of templatePath) {
        template = template[pathname];
    }
    return template;
}

/**
 * Based on an array of string, return a reference to the object that should hold the template
 * used to augment the template object
 *
 * @param {Array} wantedNamespace Array of string reprensenting the namespace
 * @returns {Object} Referene to the object holding the namespace
 */
function getTemplateNamespace(wantedNamespace) {
    let namespace = templateStore;
    let currentArgument;
    for (let argumentNumber = 0; argumentNumber < wantedNamespace.length; argumentNumber++) {
        currentArgument = wantedNamespace[argumentNumber];

        if (namespace[currentArgument] === undefined) {
            namespace[currentArgument] = {};
        }
        namespace = namespace[currentArgument];
    }
    return namespace;
}

const Templates = {
    /**
     * Given a templatePath, return the value
     *
     * @param {Array} templatePath
     * @param {Object} [data] Information that need to be injected into the template
     * @returns {String}
     */
    get(templatePath, data = {}) {
        const template = getTemplate(templatePath);
        if (template === undefined) {
            throw Error(`Template '${templatePath}' is not defined`);
        }

        // Check for the absense of get which means someone is likely using
        // the templating engine wrong and trying to access a template namespace
        if (!{}.propertyIsEnumerable.call(template, 'get')) {
            throw Error(`'${templatePath}' is not a valid template path`);
        }

        return template.get(data);
    },

    /**
     * Given a templatePath, does it have a registered template?
     * @param  {Array} templatePath
     * @returns {Boolean}
     */
    has(templatePath) {
        return getTemplate(templatePath) !== undefined;
    },

    /**
     * Inits the templating engine, and slurps all DOM templates in an internal data structure
     */
    init() {
        // Read the DOM to find all the templates, and make them available to the code
        for (const $el of $('.js_template').toArray()) {
            const namespaceElements = $el.id.split('_');
            const id = namespaceElements.pop();

            // remove the prefix "template" that MUST be added to have clean HTML ids
            namespaceElements.shift();
            const namespace = getTemplateNamespace(namespaceElements);
            namespace[id] = createDOMTemplate($el.id, Templates.get);
        }
    },

    /**
     * Register a new json object in the template manager
     *
     * @param {Array} wantedNamespace Namespace where we want to store the templates
     * @param {object} templateData The literal object that contain the templates
     */
    register(wantedNamespace, templateData) {
        const namespace = getTemplateNamespace(wantedNamespace);
        for (const key of Object.keys(templateData)) {
            const template = templateData[key];

            if (Utils.isObject(template)) {
                // If the template is an object, add templates for all keys
                namespace[key] = {};
                for (const templateKey of Object.keys(template)) {
                    namespace[key][templateKey] = createInlineTemplate(template[templateKey]);
                }
            } else {
                namespace[key] = createInlineTemplate(template);
            }
        }
    },

    /**
     * Removes a namespace from the templateStore (only used for testing purposes)
     *
     * @param {String} nameSpace
     */
    unregister(nameSpace) {
        delete templateStore[nameSpace];
    },

    /**
     * Replace the DOM HTML with the template value
     *
     * @param {jQuery} $target Element(s) that will be updated
     * @param {Array} templatePath
     * @param {Object} [data] Information that need to be injected into the template
     */
    insert($target, templatePath, data = {}) {
        $target.html(this.get(templatePath, data));
    },

    /**
     * Append the template value into a DOM elements
     *
     * @param {jQuery} $target Element(s) that will be updated
     * @param {Array} templatePath
     * @param {Object} data Information that need to be injected into the template
     */
    prepend($target, templatePath, data) {
        $target.prepend(this.get(templatePath, data));
    },

    /**
     * Prepend the template value into a DOM elements
     *
     * @param {jQuery} $target Element(s) that will be updated
     * @param {array} templatePath
     * @param {object} [data] Information that need to be injected into the template
     */
    append($target, templatePath, data) {
        $target.append(this.get(templatePath, data));
    },
};

export default Templates;
