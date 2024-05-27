import $ from 'jquery';
import _ from 'underscore';

/**
 * Adds our API command to the URL so the API call is more easily identified in the
 * network tab of the JS console
 *
 * @param {string} command
 * @param {string} url
 * @returns {string}
 */
function addCommandToUrl(command, url) {
    let newUrl = url;

    if (command) {
        // Add a ? to the end of the URL if there isn't one already
        if (newUrl.indexOf('?') === -1) {
            newUrl = `${newUrl}?`;
        }
        newUrl = `${newUrl}&command=${command}`;
    }

    return newUrl;
}

/**
 * @param {String} endpoint
 *
 * @returns {Object}
 */
export default function Network(endpoint) {
    // A flag that turns true when the user navigates away
    let isNavigatingAway = false;

    // If URL ends in `/` we're using /api/{command} format.
    const isNewURLFormat = endpoint[endpoint.length - 1] === '/';

    if (!endpoint) {
        throw new Error('Cannot instantiate Network without an url endpoint');
    }

    // Attach a listener to the event indicating that we're leaving a page
    window.onbeforeunload = () => {
        isNavigatingAway = true;
    };

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
            // Build request
            let newURL = endpoint;
            if (isNewURLFormat) {
                // Remove command from parameters and use it in the URL
                const command = parameters.command;
                // eslint-disable-next-line no-param-reassign
                delete parameters.command;
                newURL = `${endpoint}${command}`;
            }

            const settings = {
                url: newURL,
                type: 'POST',
                data: parameters,
            };
            const formData = new FormData();
            let shouldUseFormData = false;

            // Add the API command to our URL (for console debugging purposes)
            // Note that parameters.command is empty if we're using the new API format and this will do nothing.
            settings.url = addCommandToUrl(parameters.command, settings.url);

            // Check to see if parameters contains a File or Blob object
            // If it does, we should use formData instead of parameters and update
            // the ajax settings accordingly
            _(parameters).each((value, key) => {
                if (!value) {
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
            let url = endpoint;

            // Add the API command to our URL (for console debugging purposes)
            url = addCommandToUrl(parameters.command, url);

            // Add our data as form data
            const formData = new FormData();
            _(parameters).each((value, key) => {
                if (_.isUndefined(value)) {
                    return;
                }
                if (_.isArray(value)) {
                    _.each(value, (valueItem, i) => {
                        if (_.isObject(valueItem)) {
                            _.each(valueItem, (valueItemObjectValue, valueItemObjectKey) => {
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
