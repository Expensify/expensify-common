/**
 * ----------------------------------------------------------------------------------------------
 * WIP, This is in the process of migration from web-e. Please add methods to this as is needed.|
 * ----------------------------------------------------------------------------------------------
 */

import _ from 'underscore';
import {invoke, bulkInvoke} from './Func';

/**
 * @param {jquery.Deferred} promise
 * @param {String} [extractedProperty]
 *
 * @returns {Object}
 */
export default function APIDeferred(promise, extractedProperty) {
    /**
     * @private
     */
    const extractedPropertyName = extractedProperty || null;
    let cachedResponse = null;
    const doneCallbacks = [];
    const alwaysCallbacks = [];
    const unhandledCallbacks = [];
    const failCallbacks = [];
    const errorHandlers = {};

    if (!promise) {
        throw new Error('Cannot instantiate APIDeferred without a Deferred promise');
    }

    /**
     * @private
     * @param {Object} [response]
     * @returns {?Number}
     */
    function extractJSONCode(response) {
        return response ? response.jsonCode : null;
    }

    /**
     * Called when the jsonCode is not 200 and invokes the appropriate callbacks for the jsonCode
     * If no callback is defined for the jsonCode then the unhandledCallbacks are invoked
     * The failCallbacks are always called
     *
     * @private
     * @param {Number} jsonCode
     * @param {Object} [response]
     */
    function handleError(jsonCode, response) {
        // Look for handlers for this error code
        const handlers = errorHandlers[jsonCode];
        if (!_(handlers).isEmpty()) {
            bulkInvoke(handlers, [jsonCode, response]);
        } else {
            // No explicit handlers, call the unhandled callbacks
            bulkInvoke(unhandledCallbacks, [jsonCode, response]);
        }

        // Always run the "fail" callbacks in case of error
        bulkInvoke(failCallbacks, [jsonCode, response]);
    }

    /**
     * Called when network call succeeds or when a callback is added via any of the following methods after the promise is resolved:
     *      done(), always(), handle(), unhandled(), or fail()
     *
     * @private
     * @param {Object} [response]
     */
    function handleDone(response) {
        let returnedData;

        // Figure out if we need to extract a property from the response, and if it is there.
        const jsonCode = extractJSONCode(response);
        const propertyRequested = !_.isNull(extractedPropertyName);
        const requestedPropertyPresent = propertyRequested && response && !_.isUndefined(response[extractedPropertyName]);
        const propertyRequestedButMissing = propertyRequested && !requestedPropertyPresent;

        // Save the response for any callbacks that might run in the future
        cachedResponse = response;

        // Handle three different success/failure scenarios: ok (jsonCode == 200), exception (jsonCode != 200), other error
        if (jsonCode === 200 && (!propertyRequested || requestedPropertyPresent)) {
            // Get the data that was requested
            returnedData = propertyRequested && requestedPropertyPresent ? response[extractedPropertyName] : response;

            // And then run the success callbacks
            bulkInvoke(doneCallbacks, [returnedData]);
        } else if (!_(jsonCode).isNull() && jsonCode !== 200) {
            // Exception thrown, handle it
            handleError(jsonCode, response);
        } else {
            // Edge cases:
            // If a specific property was requested but is missing, or if we got a blank response, throw an error
            if (propertyRequestedButMissing) {
                throw new Error(`Requested property " ${extractedPropertyName}" missing from response`);
            }
            if (!response) {
                throw new Error('Blank response returned from API');
            }
        }

        // Always run the "always" callbacks
        bulkInvoke(alwaysCallbacks, [response]);
    }

    /**
     * Re-runs the "done" flow with a saved response to ensure that all callbacks are invoked,
     * even if they were added after the deferred was resolved
     *
     * @private
     */
    function ensureFutureCallbacksFire() {
        if (promise.state() === 'pending') {
            return;
        }

        // Re-run the done handler with the response we saved
        handleDone(cachedResponse);
    }

    // Attach the function to be called when the promise is resolved
    // See handleDone() for more details
    promise.done(handleDone);

    return {
        /**
         * Attaches a callback that will be invoked when the jsonCode is 200
         *
         * @param {Function} callback A function that takes the response as a parameter
         *
         * @returns {APIDeferred} itself, for chaining
         */
        done(callback) {
            if (_(callback).isFunction()) {
                doneCallbacks.push(_(callback).once());
                ensureFutureCallbacksFire();
            }
            return this;
        },

        /**
         * Attaches a callback that will always be invoked
         *
         * @param {Function} callback A function that takes the response as a parameter
         *
         * @returns {APIDeferred} itself, for chaining
         */
        always(callback) {
            if (_(callback).isFunction()) {
                alwaysCallbacks.push(_(callback).once());
                ensureFutureCallbacksFire();
            }
            return this;
        },

        /**
         * Attaches a callback that will be invoked on non-200 jsonCodes
         * Callbacks for jsonCode 200 are expected to be attached with done() and are therefore ignored here
         *
         * @param {Number[]} jsonCodes A list of error codes to handle
         * @param {Function} callback A function that takes the jsonCode and response as parameters
         *
         * @returns {APIDeferred} itself, for chaining
         */
        handle(jsonCodes, callback) {
            if (_(callback).isFunction()) {
                jsonCodes.forEach((code) => {
                    if (code === 200) {
                        return;
                    }

                    if (!errorHandlers[code]) {
                        errorHandlers[code] = [];
                    }
                    errorHandlers[code].push(_(callback).once());
                });

                ensureFutureCallbacksFire();
            }

            return this;
        },

        /**
         * Attaches a callback that will be invoked on all errors not explicitly handled via handle()
         *
         * @param {Function} callback A function that takes the jsonCode and response as parameters
         *
         * @returns {APIDeferred} itself, for chaining
         */
        unhandled(callback) {
            if (_(callback).isFunction()) {
                unhandledCallbacks.push(_(callback).once());
                ensureFutureCallbacksFire();
            }
            return this;
        },

        /**
         * Attaches a callback that will be always be invoked when the API does NOT return jsonCode 200, regardless of
         * handle() or unhandled()
         *
         * @param {Function} callback A function that takes the jsonCode and response as parameters
         *
         * @returns {APIDeferred} itself, for chaining
         */
        fail(callback) {
            if (_(callback).isFunction()) {
                failCallbacks.push(_(callback).once());
                ensureFutureCallbacksFire();
            }
            return this;
        },

        /**
         * Attaches a callback that will be invoked when this deferred resolves successfully
         *
         * @param {Function} callback A function that takes the response as a parameter
         *
         * @returns {APIDeferred} itself, for chaining
         */
        then(callback) {
            return promise.then((response) => {
                const responseCode = extractJSONCode(response);

                if (responseCode !== 200 || !_(callback).isFunction()) {
                    return;
                }

                invoke(callback, [response]);

                return this;
            });
        },
    };
}
