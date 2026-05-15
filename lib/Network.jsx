import $ from 'jquery';
import * as Utils from './utils';

/**
 * Appends the API command as a path segment to the URL, producing URLs of the form `/api/CommandName`.
 *
 * @param {string} command
 * @param {string} url
 * @returns {string}
 */
function addCommandToUrl(command, url) {
    if (!command) {
        return url;
    }
    const separator = url.endsWith('/') ? '' : '/';
    return `${url}${separator}${command}`;
}

/**
 * @param {String} endpoint
 *
 * @returns {Object}
 */
export default function Network(endpoint) {
    // A flag that turns true when the user navigates away
    let isNavigatingAway = false;

    if (!endpoint) {
        throw new Error('Cannot instantiate Network without an url endpoint');
    }

    // Attach a listener to the event indicating that we're leaving a page
    if (Utils.isWindowAvailable()) {
        window.onbeforeunload = () => {
            isNavigatingAway = true;
        };
    }

    return {
        /**
         * @param {String} url to fetch
         * @returns {Deferred}
         */
        get(url) {
            return $.get(url);
        },

        /**
         * @param {Object} parameters
         *
         * @returns {$.Deferred}
         */
        post(parameters) {
            const settings = {
                url: addCommandToUrl(parameters.command, endpoint),
                type: 'POST',
                data: parameters,
            };
            // The command is encoded in the URL path, so it does not need to
            // also travel in the request body.
            // eslint-disable-next-line no-param-reassign
            delete parameters.command;

            const formData = new FormData();
            let shouldUseFormData = false;

            // Check to see if parameters contains a File or Blob object
            // If it does, we should use formData instead of parameters and update
            // the ajax settings accordingly
            Object.entries(parameters).forEach(([key, value]) => {
                if (value === undefined) {
                    return;
                }

                // Populate formData in case we need it
                formData.append(key, value);
                if (value instanceof File || value instanceof Blob) {
                    shouldUseFormData = true;
                }
            });

            if (shouldUseFormData) {
                settings.processData = false;
                settings.contentType = false;
                settings.data = formData;
            }

            return $.ajax(settings);
        },

        /**
         * Uses the fetch API to send a keepalive request that will complete
         * even if the browser is closed
         *
         * Note: This method ONLY provides partial support for sending complex data structures.
         * It supports a single level array of objects with no nested properties
         * eg. [{one: 1}, {two:2}]
         *
         * @param {Object} parameters
         * @returns {$.Deferred}
         */
        keepalive(parameters) {
            // Build request
            const settings = {
                method: 'POST',
                keepalive: true,
                credentials: 'same-origin',
            };
            const url = addCommandToUrl(parameters.command, endpoint);
            // The command is encoded in the URL path, so it does not need to
            // also travel in the request body.
            // eslint-disable-next-line no-param-reassign
            delete parameters.command;

            // Add our data as form data
            const formData = new FormData();
            Object.entries(parameters).forEach(([key, value]) => {
                if (value === undefined) {
                    return;
                }
                if (Array.isArray(value)) {
                    value.forEach((valueItem, i) => {
                        if (Utils.isObject(valueItem)) {
                            Object.entries(valueItem).forEach(([valueItemObjectKey, valueItemObjectValue]) => {
                                formData.append(`${key}[${i}][${valueItemObjectKey}]`, valueItemObjectValue);
                            });
                        } else {
                            formData.append(`${key}[${i}]`, valueItem);
                        }
                    });
                } else {
                    formData.append(key, value);
                }
            });
            settings.body = formData;

            // Make our request via the fetch API but return it in the form of a jQuery promise
            // so that our API can be consistent
            const promise = new $.Deferred();
            fetch(url, settings)
                .then(() => {
                    // No need to return a response since there is no script to process it
                    // due to the browser being closed
                    promise.resolve();
                })
                .catch((error) => {
                    promise.reject(error);
                });
            return promise;
        },

        /**
         * @param {Function} callback
         */
        registerNetworkFailureHandler(callback) {
            $(document).ajaxError((event, jqxhr) => {
                // Some browsers invoke the ajax error callbacks when navigating away during a pending ajax call
                // Ignore this if navigating away
                if (isNavigatingAway) {
                    return;
                }
                const response = jqxhr.responseJSON;
                const jsonCode = response ? parseInt(response.jsonCode, 10) : null;

                callback(jsonCode, response);
            });
        },
    };
}
