/**
 * ----------------------------------------------------------------------------------------------
 * WIP, This is in the process of migration from web-e. Please add methods to this as is needed.|
 * ----------------------------------------------------------------------------------------------
 */
import _ from 'underscore';
import $ from 'jquery';
import ExpensifyAPIDeferred from './APIDeferred';

/**
 * @param {Network} network
 * @param {Object} [args]
 * @param {Function} [args.enhanceParameters] A function that takes the existing command parameters and returns a
 *                      modified version of them (for things like adding CSRF tokens)
 * @param {Function} [args.deferredOverride] Override implementation of $.Deferred for mobile
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
     * @private
     *
     * Override the default jQuery Deferred implementation
     */
    const Deferred = args.deferredOverride ? args.deferredOverride : $.Deferred;

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

        Report_GetHistory(parameters) {
            const commandName = 'Report_GetHistory';
            requireParameters(['reportID'], parameters, commandName);
            return performPOSTRequest(commandName, parameters, 'history');
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
             * Gets a specific chat from chatbot
             *
             * @param {Object} parameters
             * @param {String} [parameters.chatID] either chatID or channelID are required
             * @param {String} [parameters.channelID] either chatID or channelID are required
             *
             * @returns {APIDeferred}
             */
            get(parameters) {
                if (!parameters.chatID && !parameters.channelID) {
                    throw new Error('You must pass either a chatID or a channelID to chatbot.get()');
                }

                return performPOSTRequest('ChatBot_Chat_Get', parameters);
            },

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

            /**
             * Triggers an input in chatbot, typically used for creating a brand new conversation with a user
             *
             * @param {Object} parameters
             * @param {String} parameters.recipient
             * @param {String} parameters.chatbotMessage
             *
             * @returns {APIDeferred}
             */
            triggerInput(parameters) {
                const commandName = 'ChatBot_Input_Trigger';
                requireParameters(['recipient', 'chatbotMessage'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Escalate a chat to the logged in user in Intercom
             *
             * @param {Object} parameters
             * @param {String} parameters.inputID
             * @param {String} parameters.jobID
             *
             * @returns {APIDeferred}
             */
            escalateToMyself(parameters) {
                const commandName = 'ChatBot_Escalate_AssignToMe';
                requireParameters(['inputID', 'jobID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Adds a history event to the last input of a given chat
             *
             * @param {Object} parameters
             * @param {Number} parameters.chatID
             * @param {String} parameters.eventName
             * @param {Number} [parameters.timestamp]
             *
             * @returns {APIDeferred}
             */
            addHistoryEvent(parameters) {
                const commandName = 'ChatBot_Chat_AddHistory';
                requireParameters(['chatID', 'eventName'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Requeue a chat into a desired queue
             *
             * @param {Object} parameters
             * @param {String} parameters.queue
             * @param {Number} parameters.jobID
             * @param {String} [parameters.notes]
             * @param {Boolean} [parameters.wasExited]
             * @param {Boolean} [sync]
             *
             * @returns {APIDeferred}
             */
            requeueChat(parameters, sync = false) {
                const commandName = 'ChatBot_Escalate_RequeueChat';
                requireParameters(['queue', 'jobID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters, null, sync);
            },

            /**
             * Escalate a chat to the success team
             *
             * @param {Object} parameters
             * @param {String} parameters.teamID
             * @param {String} parameters.notehtml
             * @param {Number} parameters.chatID
             * @param {Number} parameters.inputID
             * @param {Number} parameters.jobID
             *
             * @returns {APIDeferred}
             */
            escalateToTeam(parameters) {
                const commandName = 'ChatBot_Escalate_AssignToTeam';
                requireParameters(['teamID', 'note-html', 'chatID', 'inputID', 'jobID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Trigger an event for an input
             *
             * @param {Object} parameters
             * @param {Number} parameters.inputID
             * @param {Number} parameters.eventID
             * @param {Boolean} paramters.needsReview
             * @param {Boolean} parameters.shouldTeachResponse
             * @param {Number} parameters.jobID
             * @param {String} [parameters.feedbackText]
             *
             * @returns {APIDeferred}
             */
            triggerEvent(parameters) {
                const commandName = 'ChatBot_Input_TriggerEvent';
                requireParameters(['inputID', 'eventID', 'needsReview', 'shouldTeachResponse', 'jobID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Retrieves an updated concierge authtoken
             *
             * @returns {APIDeferred}
             */
            updateConciergeAuthToken() {
                const commandName = 'ChatBot_Update_ConciergeAuthToken';
                return performPOSTRequest(commandName);
            },

            /**
             * Updates an event response
             *
             * @param {Object} parameters
             * @param {Number} parameters.eventID
             * @param {String} [parameters.bodyhtml]
             * @param {String} [parameters.githubLink]
             *
             * @returns {APIDeferred}
             */
            updateResponse(parameters) {
                const commandName = 'ChatBot_Event_Update_Response';
                requireParameters(['eventID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Deletes a specific event
             *
             * @param {Objects} parameters
             * @param {Number} parameters.eventID
             *
             * @returns {APIDeferred}
             */
            deleteEvent(parameters) {
                const commandName = 'ChatBot_Event_Delete';
                requireParameters(['eventID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Get an event by eventID
             *
             * @param {Object} parameters
             * @param {Number} parameters.eventID
             *
             * @returns {APIDeferred}
             */
            getByEventID(parameters) {
                const commandName = 'ChatBot_Event_Get';
                requireParameters(['eventID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Get events for a specific input ID
             *
             * @param {Object} parameters
             * @param {Number} parameters.inputID
             *
             * @returns {APIDeferred}
             */
            getByInputID(parameters) {
                const commandName = 'ChatBot_Event_GetRelevantByInputID';
                requireParameters(['inputID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Creates a new event and immediately responds.
             *
             * @param {Object} parameters
             * @param {String} parameters.chatbotDetails
             * @param {String} parameters.stateID
             * @param {String} parameters.inputID
             * @param {Number} parameters.jobID
             * @param {Boolean} [parameters.shouldTeachResponse]
             * @param {String} [parameters.githubLink]
             * @param {String} [parameters.feedbacktext]
             *
             * @returns {APIDeferred}
             */
            createAndTrigger(parameters) {
                const commandName = 'ChatBot_Event_CreateAndTrigger';
                requireParameters(['chatbotDetails', 'stateID', 'inputID', 'jobID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Marks an input as incorrect
             *
             * @param {Object} parameters
             * @param {String} parameters.inputID
             * @param {Number} parameters.eventID
             * @param {String} parameters.reason
             *
             * @returns {APIDeferred}
             */
            markIncorrect(parameters) {
                const commandName = 'ChatBot_Input_MarkResponseAsIncorrect';
                requireParameters(['inputID', 'eventID', 'reason'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Mark an agent's response as correct
             *
             * @param {Object} parameters
             * @param {Number} parameters.inputID
             *
             * @returns {APIDeferred}
             */
            markAgentCorrect(parameters) {
                const commandName = 'ChatBot_Input_MarkAgentCorrect';
                requireParameters(['inputID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Send a response to a input
             *
             * @param {Object} parameters
             * @param {String} parameters.inputID
             * @param {Number} parameters.jobID
             * @param {String} parameters.chatbotMessage
             * @param {String} [parameters.reason]
             * @param {Boolean} [parameters.respondAsSelf]
             * @param {String} [parameters.notehtml]
             * @param {String} [parameters.feedbacktext]
             *
             * @returns {APIDeferred}
             */
            respond(parameters) {
                const commandName = 'ChatBot_Input_Respond';
                requireParameters(['inputID', 'jobID', 'chatbotMessage'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Add an audit note to an input
             *
             * @param {Object} parameters
             * @param {String} parameters.inputID
             * @param {String} [parameters.notehtml]
             *
             * @returns {APIDeferred}
             */
            addNote(parameters) {
                const commandName = 'ChatBot_Input_Note';
                requireParameters(['inputID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Add an agent's recommendation to the recommendation list
             *
             * @param {Object} parameters
             * @param {Number} parameters.inputID
             * @param {Number} parameters.eventID
             * @param {Number} parameters.jobID
             * @param {String} [parameters.reason]
             * @param {String} [parameters.notehtml]
             *
             * @returns {APIDeferred}
             */
            addRecommendation(parameters) {
                const commandName = 'ChatBot_Input_AddRecommendation';
                requireParameters(['inputID', 'eventID', 'jobID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Add an agent's written recommendation to the recommendation list
             *
             * @param {Object} parameters
             * @param {Number} parameters.inputID
             * @param {Number} parameters.jobID
             * @param {Boolean} parameters.shouldTeachResponse
             * @param {String} [parameters.notehtml]
             *
             * @returns {APIDeferred}
             */
            addWrittenRecommendation(parameters) {
                const commandName = 'ChatBot_Input_AddWrittenRecommendation';
                requireParameters(['inputID', 'jobID', 'shouldTeachResponse'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Gets all our intercom tags
             *
             * @returns {APIDeferred}
             */
            getIntercomTags() {
                return performPOSTRequest('ChatBot_GetIntercomTags');
            },

            /**
             * Gets the user info specific for the chatID provided.
             *
             * @param {Object} parameters
             * @param {String} parameters.chatID
             *
             * @returns {APIDeferred}
             */
            getUserInfo(parameters) {
                const commandName = 'ChatBot_GetUserInfo';
                requireParameters(['chatID'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Toggle an intercom tag for a specific user
             *
             * @param {Object} parameters
             * @param {String} parameters.tag
             * @param {String} parameters.email
             * @param {Boolean} parameters.state
             *
             * @returns {APIDeferred}
             */
            toggleIntercomTag(parameters) {
                const commandName = 'ChatBot_User_Tag';
                requireParameters(['tag', 'email', 'state'], parameters, commandName);
                return performPOSTRequest(commandName, parameters);
            },

            /**
             * Retrieves a fresh S3 hash for the Froala editor to use for image upload
             *
             * @returns {APIDeferred}
             */
            getFroalaS3Hash() {
                return performPOSTRequest('ChatBot_FroalaS3Hash_Get');
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
