import _ from 'underscore';
import $ from 'jquery';

/**
 * JS Templating system, powered by underscore template
 *
 * Templates is a global namespace for each template, HTML ones or inlines ones.
 *
 * @type Module
 * @constructor
 */

const Templates = (function () {
    const templateStore = {};

    /**
     * Returns the template
     *
     * @param {Array} templatePath
     * @return {InlineTemplate|undefined}
     */
    function getTemplate(templatePath) {
        let template = templateStore;
        _.each(templatePath, (pathname) => {
            template = template[pathname];
        });
        return template;
    }

    /**
     * Based on an array of string, return a reference to the object that should hold the template
     * used to augment the template object
     *
     * @param {Array} wantedNamespace Array of string reprensenting the namespace
     * @return {Object} Referene to the object holding the namespace
     */
    function getTemplateNamespace(wantedNamespace) {
        let namespace = templateStore;
        let currentArgument;
        for (let argumentNumber = 0; argumentNumber < wantedNamespace.length; argumentNumber++) {
            currentArgument = wantedNamespace[argumentNumber];

            if (_.isUndefined(namespace[currentArgument])) {
                namespace[currentArgument] = {};
            }
            namespace = namespace[currentArgument];
        }
        return namespace;
    }

    return {
        /**
         * Given a templatePath, return the value
         *
         * @param {Array} templatePath
         * @param {Object} [data] Information that need to be injected into the template
         * @return {String}
         */
        get(templatePath, data = {}) {
            try {
                const template = getTemplate(templatePath);
                if (_.isUndefined(template)) {
                    throw Error(`Template '${templatePath}' is not defined`);
                }

                // Check for the absense of get which means someone is likely using
                // the templating engine wrong and trying to access a template namespace
                if (!{}.propertyIsEnumerable.call(template, 'get')) {
                    throw Error(`'${templatePath}' is not a valid template path`);
                }

                return template.get(data);
            } catch (err) {
                throw err;
            }
        },

        /**
         * Given a templatePath, does it have a registered template?
         * @param  {Array} templatePath
         * @return {Boolean}
         */
        has(templatePath) {
            const template = getTemplate(templatePath);
            return !_.isUndefined(template);
        },

        /**
         * Inits the templating engine, and slurps all DOM templates in an internal data structure
         */
        init() {
            // Read the DOM to find all the templates, and make them available to the code
            $('.js_template').each((__, $el) => {
                const namespaceElements = $el.id.split('_');
                const id = namespaceElements.pop();

                // remove the prefix "template" that MUST be added to have clean HTML ids
                namespaceElements.shift();
                const namespace = getTemplateNamespace(namespaceElements);
                // eslint-disable-next-line no-use-before-define
                namespace[id] = new DOMTemplate($el.id);
            });
        },

        /**
         * Register a new json object in the template manager
         *
         * @param {Array} wantedNamespace Namespace where we want to store the templates
         * @param {object} templateData The literal object that contain the templates
         */
        register(wantedNamespace, templateData) {
            const namespace = getTemplateNamespace(wantedNamespace);
            _.each(_.keys(templateData), (key) => {
                const template = templateData[key];

                if (_.isObject(template)) {
                    // If the template is an object, add templates for all keys
                    namespace[key] = {};
                    _.each(_.keys(template), (templateKey) => {
                        // eslint-disable-next-line no-use-before-define
                        namespace[key][templateKey] = new InlineTemplate(template[templateKey]);
                    });
                } else {
                    // eslint-disable-next-line no-use-before-define
                    namespace[key] = new InlineTemplate(template);
                }
            });
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
        }
    };
})();

// Template Constructors
class InlineTemplate {
    constructor(templateValue) {
        this.templateValue = templateValue;
        this.compiled = null;
        this.get = this.get.bind(this);
    }

    get(data = {}) {
        if (!this.compiled) {
            this.compiled = _.template(this.templateValue);
            this.templateValue = '';
        }
        return this.compiled(data);
    }
}

class DOMTemplate {
    constructor(id) {
        this.id = id;
        this.compiled = null;
        this.get = this.get.bind(this);
    }

    get(data = {}) {
        // Add the "template" object to the parameter to allow nested templates
        const dataToCompile = {...data};
        dataToCompile.nestedTemplate = Templates.get;
        if (!this.compiled) {
            this.compiled = _.template($(`#${this.id}`).html());
        }
        return this.compiled(dataToCompile);
    }
}

module.exports = Templates;
