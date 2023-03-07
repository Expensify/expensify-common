/**
 * ----------------------------------------------------------------------------------------------
 * WIP, This is in the process of migration from web-e. Please add methods to this as is needed.|
 * ----------------------------------------------------------------------------------------------
 */
import _ from 'underscore';

// Use this deferred lib so we don't have a dependency on jQuery (so we can use this module in mobile)
import {Deferred} from 'simply-deferred';
import ExpensifyAPIDeferred from './APIDeferred';

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
        const promise = new Deferred();

        network.get('/revision.txt')
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
     * @private
     *
     * @param {String} command Name of the command to run
     * @param {Object} [parameters] A map of parameter names to their values
     * @param {String} [returnedPropertyName] The value of the property that you want to return if you don't want to
     *                      return the whole response JSON
     * @param {Boolean} [keepalive] Whether or not the request should be kept alive if the browser is closed in the
     *                      middle of the request
     * @param {Boolean} [checkCodeRevision] Whether or not the code revision should be validated
     *
     * @returns {APIDeferred} An APIDeferred representing the promise of this request
     */
    function performPOSTRequest(command, parameters, returnedPropertyName, keepalive, checkCodeRevision) {
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
            : () => new Deferred().resolve();

        // This is a dummy promise that will perform the actions from our network POST. We have to create it here
        // because we need the final APIDeferred object to return immediately, and then have all this async code run.
        const networkRequestPromise = new Deferred();

        // This is the final APIDeferred which gets returned from the API lib.
        const finalApiDeferred = new ExpensifyAPIDeferred(networkRequestPromise, returnedPropertyName);

        // Check that our code is running the latest version
        codeRevisionPromise().done(() => {
            // We are done checking the code version, so now we can make our network request. We then use our
            // dummy promise here in done() and fail() because that was the promise attached to our APIDeferred.
            if (keepalive) {
                network.keepalive(newParameters)
                    .done(networkRequestPromise.resolve)
                    .fail(networkRequestPromise.reject);
            } else {
                network.post(newParameters)
                    .done(networkRequestPromise.resolve)
                    .fail(networkRequestPromise.reject);
            }

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
         * Whether or not the JS code version has changed on the server compared to what was loaded on the page.
         *
         * @returns {Boolean}
         */
        hasChangedCodeVersion() {
            return codeVersionChanged;
        },

        /**
         * Forces an update of the stored latest code version without firing off an additional POST request
         *
         * @returns {exports.Deferred}
         */
        updateCodeVersion() {
            return isRunningLatestVersionOfCode();
        },

        /**
         * Used to extend an API instance with new methods.
         *
         * @example
         *
         * conciergeAPI.chatbot.getNew = (parameters) => conciergeAPI.extendMethod({
         *     commandName: 'ChatBot_Escalate_GetNextChat',
         *     requireParameters: ['queueList'],
         *     checkCodeRevision: true,
         * })(parameters);
         *
         * @param {Object} data
         * @param {String} data.commandName
         * @param {Function} [data.validate]
         * @param {String[]} [data.requireParameters]
         * @param {String} [data.returnedPropertyType]
         * @param {Boolean} [data.checkCodeRevision]
         *
         * @return {Function}
         */
        extendMethod: (data) => {
            if (!data.commandName) {
                throw new Error('Must pass commandName to API.extendMethod');
            }

            return (parameters, keepalive = false) => {
                // Optional validate function for required logic before making the call. e.g. validating params in the front-end etc.
                if (_.isFunction(data.validate)) {
                    data.validate(parameters);
                }

                requireParameters(data.requireParameters || [], parameters, data.commandName);
                return performPOSTRequest(
                    data.commandName,
                    parameters,
                    data.returnedPropertyName || false,
                    keepalive,
                    data.checkCodeRevision || false
                );
            };
        },

        /**
         * @return {Network}
         */
        getNetwork() {
            return network;
        },

        /**
         * @param  {Object} parameters
         * @return {ExpensifyAPIDeferred}
         */
        logToServer(parameters) {
            const commandName = 'Log';
            return performPOSTRequest(commandName, parameters);
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
         * @param  {Object} parameters
         * @param  {String} parameters.email
         * @return {ExpensifyAPIDeferred}
         */
        Domain_RequestAccess(parameters) {
            const commandName = 'Domain_RequestAccess';
            requireParameters(['email'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
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
         * Performs API command "Get"
         *
         * @param {Object} parameters The API call parameters, must contain "returnValueList"
         * @param {Domain} [domain] If you want to run this command as the domain account of this domain
         * @param {DomainMember} [domainMember] If you want to run this command as specified domain member
         *
         * @returns {APIDeferred} An APIDeferred representing the promise of this request
         */
        get(parameters) {
            const commandName = 'Get';
            requireParameters(['returnValueList'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * @param {Object} parameters
         * @param {String} parameters.email
         * @param {String} [parameters.password]
         * @param {String} [parameters.promoCode]
         * @param {String} [parameters.validateCode]
         * @returns {APIDeferred}
         */
        signIn(parameters) {
            const commandName = 'SignIn';
            requireParameters(['email'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Perform API command 'SignOut'
         *
         * @param {Object} [parameters]
         * @param {Boolean} [parameters.clean] clear the 'email' cookie
         * @returns {APIDeferred} An APIDeferred representing the promise of this request
         */
        signOut(parameters) {
            return performPOSTRequest('SignOut', parameters);
        },

        /**
         * @param {Object} parameters
         * @param {String} parameters.email
         * @param {String} parameters.token
         * @param {String} [parameters.promoCode]
         * @returns {APIDeferred}
         */
        signInGoogle(parameters) {
            const commandName = 'SignInGoogle';
            requireParameters(['email', 'token'], parameters, commandName);
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
         * @param {Object} parameters
         * @param {String} [parameters.email]
         *
         * @return {ExpensifyAPIDeferred}
         */
        resendValidateCode(parameters = {}) {
            const commandName = 'ResendValidateCode';
            return performPOSTRequest(commandName, {
                ...parameters,
                api_setCookie: false,
            });
        },

        /**
         * Reopen a closed account.
         *
         * @param {Object} parameters
         * @param {String} parameters.email
         *
         * @return {ExpensifyAPIDeferred}
         */
        reopenAccount(parameters) {
            const commandName = 'User_ReopenAccount';
            requireParameters(['email'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
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
         * Sets the password for an account
         *
         * @param {Object} parameters
         * @param {String} parameters.email
         * @param {String} parameters.password
         * @param {String} parameters.validateCode
         * @returns {ExpensifyAPIDeferred}
         */
        setPassword(parameters) {
            const commandName = 'SetPassword';
            requireParameters(['email', 'password', 'validateCode'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Validate a user
         *
         * @param {Object} parameters
         * @param {String} validateCode
         * @param {Number} accountID
         * @returns {ExpensifyAPIDeferred}
         */
        validateEmail(parameters) {
            const commandName = 'ValidateEmail';
            requireParameters(['validateCode', 'accountID'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Retrieves a short lived auth token for transitions to NewDot
         *
         * @returns {APIDeferred}
         */
        getShortLivedAuthToken() {
            const commandName = 'GetShortLivedAuthToken';
            return performPOSTRequest(commandName);
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
         * @param {Boolean} [keepalive] whether or not the request can complete after the browser is closed
         * @returns {APIDeferred}
         */
        graphite(parameters, keepalive) {
            const commandName = 'Graphite';
            requireParameters(['type', 'statName', 'value'], parameters, commandName);
            return performPOSTRequest(commandName, parameters, null, keepalive);
        },

        /**
         * Performs API command Report_GetHistory
         * @param {Object} parameters
         * @param {Number} parameters.reportID
         * @param {Number} [parameters.offset] - optional offset (inclusive defaults to 0)
         * @returns {APIDeferred}
         */
        Report_GetHistory(parameters) {
            const commandName = 'Report_GetHistory';
            requireParameters(['reportID'], parameters, commandName);
            return performPOSTRequest(commandName, parameters, 'history');
        },

        /**
         * Performs API command Report_AddComment
         * @param {Object} parameters The API call parameters. Must contain reportID and reportComment
         * @param {Number} parameters.reportID
         * @param {String} parameters.reportComment
         * @returns {APIDeferred} An APIDeferred representing the promise of this request
         */
        Report_AddComment(parameters) {
            const commandName = 'Report_AddComment';
            requireParameters(['reportID', 'reportComment'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Performs API command GetRequestCountryCode
         * Fetches the country code based on the location of the request
         *
         * @return {APIDeferred}
         */
        getRequestCountryCode() {
            const commandName = 'GetRequestCountryCode';
            return performPOSTRequest(commandName, {});
        },

        /**
         * Performs API command Github_Close
         *
         * @param {Object} parameters
         * @param {String} parameters.githubLink
         * @param {Boolean} [parameters.reopen] True by default. If false, we will not reopen the Concierge chats linked in the Github
         *
         * @returns {APIDeferred}
         */
        githubClose(parameters) {
            const commandName = 'Github_Close';
            requireParameters(['githubLink'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Performs API command Expense_Create
         *
         * @param {Object} parameters
         * @param {Number} parameters.chatID
         * @param {String} parameters.file
         *
         * @returns {APIDeferred}
         */
        forwardTravelDocument(parameters) {
            const commandName = 'ForwardTravelDocument';
            requireParameters(['chatID', 'file'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Performs API command Expense_Create
         *
         * @param {Object} parameters API parameters. Must contain 'transactionList'
         *
         * @returns {APIDeferred}
         */
        Expense_Create(parameters) {
            const commandName = 'Expense_Create';
            requireParameters(['transactionList'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Performs API command Domain_AddNote
         *
         * @param {Object} parameters
         * @param {String} parameters.note-html
         * @param {String} parameters.targetEmail
         * @param {String} [parameters.domainName]
         *
         * @returns {APIDeferred}
         */
        Domain_Add_Note(parameters) {
            const commandName = 'Domain_AddNote';
            requireParameters(['note-html', 'targetEmail'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Performs API command Domain_DeleteNote
         *
         * @param {Object} parameters
         * @param {String} parameters.note-html
         * @param {String} [parameters.domainName]
         *
         * @returns {APIDeferred}
         */
        Domain_Delete_Note(parameters) {
            const commandName = 'Domain_DeleteNote';
            requireParameters(['note-html'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Performs API command CreateLogin
         * This method gets called to add a new login method to the Logins table
         *
         * @param {Object} parameters
         * @param {String} parameters.partnerName
         * @param {String} parameters.partnerPassword
         * @param {String} parameters.partnerUserID
         * @param {String} parameters.partnerUserSecret
         *
         * @returns {APIDeferred}
         */
        createLogin(parameters) {
            const commandName = 'CreateLogin';
            requireParameters(['partnerName', 'partnerPassword', 'partnerUserID', 'partnerUserSecret'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        /**
         * Performs API command Authenticate
         * This method gets called when existing token are expired
         * which helps in having an infinite session
         *
         * @param {Object} parameters
         * @param {String} parameters.partnerName
         * @param {String} parameters.partnerPassword
         * @param {String} parameters.partnerUserID
         * @param {String} parameters.partnerUserSecret
         *
         * @returns {APIDeferred}
         */
        authenticate(parameters) {
            const commandName = 'Authenticate';
            requireParameters(['partnerName', 'partnerPassword', 'partnerUserID', 'partnerUserSecret'], parameters, commandName);
            return performPOSTRequest(commandName, parameters);
        },

        expensiworks: {
            /**
             * Get the logged in agent's accuracy fields
             *
             * @returns {APIDeferred}
             */
            getAgentAccuracy() {
                const commandName = 'Expensiworks_GetAgentAccuracy';

                return performPOSTRequest(commandName);
            },

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
                requireParameters(['jobID', 'jobName', 'answers', 'duration'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Reject and return a job that needs to be retried by someone else
             *
             * @param {Object} parameters
             * @param {Number} parameters.jobID
             * @param {Array} parameters.jobData
             * @param {Number} parameters.startedAt
             * @param {Boolean} [keepalive] Whether or not the request can complete after the page is closed
             *
             * @returns {APIDeferred}
             */
            returnJob(parameters, keepalive) {
                const commandName = 'Expensiworks_ReturnJob';
                requireParameters(['jobID', 'jobData', 'startedAt'], parameters, commandName);
                return performPOSTRequest(commandName, parameters, null, keepalive);
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

        user: {
            /**
             * Get the travel details for a
             *
             * @param {Object} parameters
             * @param {String} parameters.chatID
             * @param {String} [parameters.password] only needed if we don't have it stored in the cookie
             *
             * @returns {APIDeferred}
             */
            getUserTravelDetails(parameters) {
                const commandName = 'GetTravelDetails';
                requireParameters(['chatID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Save the travel details for a user
             *
             * @param {Object} parameters
             * @param {String} parameters.chatID
             * @param {String} parameters.details
             *
             * @returns {APIDeferred}
             */
            setUserTravelDetails(parameters) {
                const commandName = 'SetTravelDetails';
                requireParameters(['chatID', 'details'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Get the lounge details for a user
             *
             * @param {Object} parameters
             * @param {String} parameters.chatID
             *
             * @returns {APIDeferred}
             */
            getUserLoungeDetails(parameters) {
                const commandName = 'GetLoungeDetails';
                requireParameters(['chatID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Set the lounge details for a user
             *
             * @param {Object} parameters
             * @param {String} parameters.chatID
             * @param {String} parameters.details
             *
             * @returns {APIDeferred}
             */
            setUserLoungeDetails(parameters) {
                const commandName = 'SetLoungeDetails';
                requireParameters(['chatID', 'details'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Checks if the domain is public
             *
             * @param {Object} parameters
             * @param {String} parameters.email
             *
             * @returns {APIDeferred}
             */
            isFromPublicDomain(parameters) {
                const commandName = 'User_IsFromPublicDomain';
                requireParameters(['email'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },
        },

        card: {
            /**
             * Set the limit of an expensify card.
             *
             * @param {Object} parameters
             * @param {String} parameters.cardUserEmail who the card is assigned to
             * @param {Boolean} parameters.hasCustomLimit whether or not the card has a custom limit
             * @param {Number} [parameters.cardID]
             * @param {Number} [parameters.limit] should be in positive cents
             * @param {String} [parameters.domainName] The domain of the card
             *
             * @returns {APIDeferred}
             */
            setLimit(parameters) {
                const commandName = 'Card_setLimit';
                requireParameters(['cardUserEmail', 'hasCustomLimit', 'domainName'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
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
