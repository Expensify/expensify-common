import $ from 'jquery';
import _ from 'underscore';

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
    window.onbeforeunload = () => {
        isNavigatingAway = true;
    };

    return {
        /**
         * @param {Object} parameters
         * @param {Boolean} [sync] Whether or not the request should be synchronous
         *
         * @returns {Deferred}
         */
        post(parameters, sync) {
            // Build request
            const settings = {
                url: endpoint,
                type: 'POST',
                data: parameters,
                async: !sync,
            };
            const formData = new FormData();
            let shouldUseFormData = false;

            // Add the API command to our URL (for console debugging purposes)
            if (parameters.command) {
                // Add a ? to the end of the URL if there isn't one already
                if (settings.url.indexOf('?') === -1) {
                    settings.url = `${settings.url}?`;
                }
                settings.url = `${settings.url}&command=${parameters.command}`;
            }

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
