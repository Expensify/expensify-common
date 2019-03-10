import _ from 'underscore';
import $ from 'jquery';

// TODO: when we remove site/lib/apiDeferred, rename this to APIDeferred
import ExpensifyAPIDeferred from './apiDeferred';

/**
 * @param {Network} network
 * @param {Object} [args]
 * @param {Function} [args.enhanceParameters] A function that takes the existing command parameters and returns a
 *                      modified version of them (for things like adding CSRF tokens)
 *
 * @returns {Object}
 */
export default function API(network, args) {
    /**
     * @private
     *
     * Maps jsonCode => array of callback functions
     */
    const defaultHandlers = {};
    const _requestIDs = [];

    /**
     * This allows us to track when the version of JS has changed on the server and then let programs treat the
     * situation appropriately.
     */
    let codeVersionChanged = false;

    if (!network) {
        throw new Error('Cannot instantiate API without a Network object');
    }

    /**
     * Returns a promise that is rejected if a change is detected
     * Otherwise, it is resolved successfully
     *
     * @returns {Object} $.Deferred
     */
    function isRunningLatestVersionOfCode() {
        const promise = new $.Deferred();

        $.get('/revision.txt')
            .done((codeRevision) => {
                if (codeRevision.trim() === window.CODE_REVISION) {
                    console.debug('Code revision is up to date');
                    promise.resolve();
                } else {
                    console.debug('Code revision change detected');
                    codeVersionChanged = true;

                    promise.resolve();
                }
            })
            .fail(() => {
                // If we can't read the code revision, we will assume it hasn't changed
                console.debug('Code revision cannot be read at this time');
                promise.resolve();
            });

        return promise;
    }

    /**
     * @private
     *
     * Attaches the callbacks to the promise for each JSON code
     *
     * @param {String} apiDeferred
     */
    function attachJSONCodeCallbacks(apiDeferred) {
        _(defaultHandlers).each((callbacks, code) => {
            // The key, `code`, is returned as a string, so we must cast it to an Integer
            const jsonCode = parseInt(code, 10);
            callbacks.forEach((callback) => {
                if (jsonCode === 200) {
                    apiDeferred.done(callback);
                } else {
                    apiDeferred.handle([jsonCode], callback);
                }
            });
        });
    }

    /**
     * Stores unique request IDs in an array
     *
     * @private
     * @param  {Object} json
     */
    function _recordRequestID(json) {
        if (json.requestID && !_(_requestIDs).contains(json.requestID)) {
            _requestIDs.push(json.requestID);
            // Cap the array at 10 elements by removing the first element if there are too many
            if (_requestIDs.length > 10) {
                _requestIDs.shift();
            }
        }
    }

    /**
     * @private
     *
     * @param {String} command Name of the command to run
     * @param {Object} [parameters] A map of parameter names to their values
     * @param {String} [returnedPropertyName] The value of the property that you want to return if you don't want to
     *                      return the whole response JSON
     * @param {Boolean} [sync] Whether or not the request should be synchronous
     * @param {Boolean} [checkCodeRevision] Whether or not the code revision should be validated
     *
     * @returns {APIDeferred} An APIDeferred representing the promise of this request
     */
    function performPOSTRequest(command, parameters, returnedPropertyName, sync, checkCodeRevision) {
        let newParameters = {...parameters, command};

        // If there was an enhanceParameters() method supplied in our args, then we will call that here
        if (args && _.isFunction(args.enhanceParameters)) {
            newParameters = args.enhanceParameters(newParameters);
        }

        // We need to setup multiple promises here depending on our arguments. If there is no argument, then we will just
        // use an immediately resolved promise for sake of code readability (ie. the promise will always exist and code
        // will be treated the same way regardless of the arguments).

        // This promise is to check to see if we are running the latest version of code
        const codeRevisionPromise = checkCodeRevision
            ? isRunningLatestVersionOfCode
            : () => new $.Deferred().resolve();

        // This is a dummy promise that will perform the actions from our network POST. We have to create it here
        // because we need the final APIDeferred object to return immediately, and then have all this async code run.
        const networkRequestPromise = new $.Deferred();

        // This is the final APIDeferred which gets returned from the API lib.
        const finalApiDeferred = new ExpensifyAPIDeferred(networkRequestPromise, returnedPropertyName);

        // Check that our code is running the latest version
        codeRevisionPromise().done(() => {
            // We are done checking the code version, so now we can make our network request. We then use our
            // dummy promise here in done() and fail() because that was the promise attached to our APIDeferred.
            network.post(newParameters, sync)
                .done(networkRequestPromise.resolve)
                .fail(networkRequestPromise.reject);

            // Finally, we can attach any JSONCode callbacks to our APIDeferred because we know that at this point
            // we're making a real network request.
            attachJSONCodeCallbacks(finalApiDeferred);
        });

        return finalApiDeferred;
    }

    /**
     * @throws {Error} If the "parameters" object has a null or undefined value for any of the given parameterNames
     *
     * @private
     *
     * @param {String[]} parameterNames Array of the required parameter names
     * @param {Object} parameters A map from available parameter names to their values
     * @param {String} commandName The name of the API command
     */
    function requireParameters(parameterNames, parameters, commandName) {
        parameterNames.forEach((parameterName) => {
            if (!_(parameters).has(parameterName)
                || parameters[parameterName] === null
                || parameters[parameterName] === undefined
            ) {
                const parametersCopy = _.clone(parameters);
                if (_(parametersCopy).has('authToken')) {
                    parametersCopy.authToken = '<redacted>';
                }
                if (_(parametersCopy).has('password')) {
                    parametersCopy.password = '<redacted>';
                }
                const keys = _(parametersCopy).keys().join(', ') || 'none';
                throw new Error(`Parameter ${parameterName} is required for "${commandName}". Supplied parameters: ${keys}`);
            }
        });
    }

    return {
        /**
         * @param  {Number[]} jsonCodes
         * @param  {Function} callback
         */
        registerDefaultHandler(jsonCodes, callback) {
            if (!_(callback).isFunction()) {
                return;
            }

            jsonCodes.forEach((jsonCode) => {
                if (!defaultHandlers[jsonCode]) {
                    defaultHandlers[jsonCode] = [];
                }
                defaultHandlers[jsonCode].push(callback);
            });
        },

        /**
         * Return the recent request IDs
         * @param  {Number} num
         * @returns {String[]}
         */
        getRecentRequestIDs: function () {
            return this._requestIDs;
        },

        /**
         * Whether or not the JS code version has changed on the server compared to what was loaded on the page.
         *
         * @returns {Boolean}
         */
        hasChangedCodeVersion() {
            return codeVersionChanged;
        },

        /**
         * @return {Network}
         */
        getNetwork() {
            return network;
        },

        /**
         * @param  {Object} parameters
         * @param  {String} parameters.email
         * @return {ExpensifyAPIDeferred}
         */
        getAccountStatus(parameters) {
            const commandName = 'GetAccountStatus';
            requireParameters(['email'], parameters, commandName);

            // Tell the API not to set cookies for this request
            const newParameters = _.extend({api_setCookie: false}, parameters);

            return performPOSTRequest(commandName, newParameters);
        },

        /**
         * @param {Object} parameters
         * @param {String[]} parameters.emailList
         *
         * @returns {ExpensifyAPIDeferred}
         */
        personalDetails_GetForEmails(parameters) {
            const commandName = 'PersonalDetails_GetForEmails';
            requireParameters(['emailList'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * @param {Object} parameters
         * @param {String} parameters.email
         * @param {String} parameters.password
         * @param {String} [parameters.promoCode]
         * @returns {APIDeferred}
         */
        signIn(parameters) {
            const commandName = 'SignIn';
            requireParameters(['email', 'password'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * @param {Object} parameters Must contain email, May contain:
         * @param {String} parameters.email
         * @param {String} [parameters.initialReferer]
         * @param {Number} [parameters.inviterID]
         * @param {String} [parameters.landingPage]
         * @param {String} [parameters.promoCode]
         *
         * @returns {APIDeferred}
         */
        signUp(parameters) {
            const commandName = 'User_SignUp';
            requireParameters(['email'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Resends the validate code.
         *
         * @return {ExpensifyAPIDeferred}
         */
        resendValidateCode() {
            const commandName = 'ResendValidateCode';
            return performPOSTRequest(commandName, {api_setCookie: false});
        },

        /**
         * Resets the password for an account
         * @param {Object} parameters
         * @param {String} parameters.email
         * @returns {ExpensifyAPIDeferred}
         */
        resetPassword(parameters) {
            const commandName = 'ResetPassword';
            requireParameters(['email'], parameters, commandName);

            const newParameters = _.extend({api_setCookie: false}, parameters);
            return performPOSTRequest(commandName, newParameters);
        },

        /**
         * Sets the value of an NVP
         *
         * @param {Object} parameters
         * @param {String} parameters.name
         * @param {Mixed} parameters.value
         * @returns {APIDeferred}
         */
        setNameValuePair(parameters) {
            const commandName = 'SetNameValuePair';
            requireParameters(['name', 'value'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Send something to be logged into graphite
         *
         * @param {Object} parameters
         * @param {String} parameters.type This can be one of ['timer', 'counter']
         * @param {String} parameters.statName
         * @param {Number} parameters.value
         * @param {Boolean} sync whether or not to make the request synchronously
         * @returns {APIDeferred}
         */
        graphite(parameters, sync) {
            const commandName = 'Graphite';
            requireParameters(['type', 'statName', 'value'], parameters, commandName);
            return performPOSTRequest(commandName, parameters, null, sync);
        },

        expensiworks: {
            /**
             * Get a job to work on
             *
             * @param {Object} parameters
             * @param {String} [parameters.jobName] optional the name of a job to get (used for debugging)
             * @param {Boolean} [parameters.prefetching] Lets the server know that this is a prefetch request
             *
             * @returns {APIDeferred}
             */
            getJob(parameters) {
                const commandName = 'Expensiworks_GetJob';
                return performPOSTRequest(commandName, parameters, null, null, true);
            },

            /**
             * Submit a job for processing
             *
             * @param {Object} parameters
             * @param {Number} parameters.jobID
             * @param {String} parameters.answers
             * @param {String} parameters.startedAt
             *
             * @returns {APIDeferred}
             */
            processJob(parameters) {
                const commandName = 'Expensiworks_ProcessJob';
                requireParameters(['jobID', 'answers', 'duration'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Reject and return a job that needs to be retried by someone else
             *
             * @param {Object} parameters
             * @param {Number} parameters.jobID
             * @param {Object[]} parameters.jobData
             * @param {Number} parameters.startedAt
             * @param {Boolean} [sync] Whether or not the request should be synchronous. It is synchronous when someone
             *                      is closing the browser or refreshing the page. We need to make sure the requests
             *                      complete before the page is closed (or we end up with stuck jobs)
             *
             * @returns {APIDeferred}
             */
            returnJob(parameters, sync) {
                const commandName = 'Expensiworks_ReturnJob';
                requireParameters(['jobID', 'jobData', 'startedAt'], parameters, commandName);
                return performPOSTRequest(commandName, parameters, null, sync);
            },
        },

        ssdos: {
            /**
             * Get the currency list for SSDos
             *
             * @returns {APIDeferred}
             */
            getCurrencyList() {
                const commandName = 'SSDos_GetCurrencyList';
                return performPOSTRequest(commandName);
            },
        },

        chatbot: {
            /**
             * Gets a new chat from chatbot
             *
             * @param {Object} parameters
             * @param {String[]} parameters.queueList
             * @param {Boolean} [parameters.prefetching] Lets the server know that this is a prefetch request
             *
             * @returns {APIDeferred}
             */
            getNew(parameters) {
                const commandName = 'ChatBot_Escalate_GetNextChat';
                requireParameters(['queueList'], parameters, commandName);
                return performPOSTRequest(commandName, parameters, null, null, true);
            },
        },

        JSON_CODES: {
            AUTH_FAILURES: [
                403, // CSRF Token is invalid (expired, absent or mal-formed)
                407, // AuthToken Invalid/Expired
                408, // Account Deleted
                411, // AuthToken has insufficient privileges
                500, // Server Error
            ],
        }
    };
}
