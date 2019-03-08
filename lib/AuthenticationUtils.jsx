export default (function () {
    var _authResult = {};
    // TODO: Replace this temporary list of public domains with something more reliable, without bloating the JS with ~2500 domains
    // TODO: When you change this list, please let the Mobile team know because we have it hard-coded as well.
    var _publicDomains = ['expensify.sms', 'gmail.com', 'yahoo.com', 'hotmail.com', 'me.com', 'aol.com', 'mac.com', 'comcast.net', 'msn.com', 'live.com', 'sbcglobal.net', 'cox.net', 'yahoo.co.uk', 'att.net', 'ymail.com', 'verizon.net', 'bellsouth.net', 'googlemail.com', 'earthlink.net', 'hotmail.co.uk', 'charter.net', 'btinternet.com', 'yahoo.com.hk', 'yahoo.com.br', 'yahoo.com.mx', 'rocketmail.com', 'shaw.ca', 'bigpond.com', 'yahoo.com.sg', 'yahoo.com.tw', 'hotmail.it'];

    /**
     * Get and cache the result of the 'signin' call to check the status of the account
     * Doesn't sign the user in because no password is supplied.
     * @param {String} email The user's email
     * @returns {Deferred} A promise resolved with the json representing the status of the account
     * @private
     */
    var _getAuthenticationStatusJSON = function (email) {
        var deferred = new Deferred();
        var json = _authResult[email];
        if (!_.isUndefined(json)) {
            deferred.resolve(json);
        } else {
            API.getAccountStatus({
                email: email
            })
                .done(function (doneJSON) {
                    _authResult[email] = doneJSON;
                })
                .fail(function (code, failJSON) {
                    _authResult[email] = failJSON;
                })
                .always(function () {
                    deferred.resolve(_authResult[email]);
                });
        }
        return deferred.promise();
    };

    return {

        /**
         * Check if an account exists.
         * @param {String} email The account to check
         * @returns {Deferred}
         */
        doesAccountExist: function (email) {
            var deferred = new Deferred();
            _getAuthenticationStatusJSON(email).done(function (json) {
                if (json.jsonCode === 405 || (json.jsonCode === 200 && json.partnerList.length)) {
                    deferred.resolve(true, json.domainControlled);
                    return;
                }
                deferred.resolve(false, json.domainControlled);
            });
            return deferred.promise();
        },

        /**
         * Check if an account is validated
         * @param {String} email The account to check
         * @returns {Deferred}
         */
        isAccountValidated: function (email) {
            var deferred = new Deferred();
            _getAuthenticationStatusJSON(email).done(function (json) {
                if (json.jsonCode === 405) {
                    deferred.resolve(false);
                    return;
                }
                deferred.resolve(json.validated);
            });
            return deferred.promise();
        },

        /**
         * Check if an account is on domain control
         * @param {String} email The account to check
         * @returns {Deferred}
         */
        isAccountOnDomainControl: function (email) {
            var deferred = new Deferred();
            _getAuthenticationStatusJSON(email).done(function (json) {
                if (json.jsonCode === 200 && json.domainControlled) {
                    deferred.resolve(true);
                    return;
                }
                deferred.resolve(false);
            });
            return deferred.promise();
        },

        /**
         * Does this account have a partner login for the provided partnerName?
         * @param {String} email
         * @param {String} partnerName
         * @return {Boolean}
         */
        doesAccountHavePartnerLogin: function (email, partnerName) {
            var deferred = new Deferred();
            _getAuthenticationStatusJSON(email).done(function (json) {
                if (json.jsonCode === 200 && json.partnerList.length && _.contains(json.partnerList, partnerName)) {
                    deferred.resolve(true);
                    return;
                }
                deferred.resolve(false);
            });
            return deferred.promise();
        },

        /**
         * Does the user account is on a domain that REQUIRES saml?
         *
         * @param {String} email
         * @returns {*}
         */
        requireSAML: function (email) {
            var deferred = new Deferred();
            _getAuthenticationStatusJSON(email).done(function (json) {
                deferred.resolve(json.samlRequired === true);
            });
            return deferred.promise();
        },

        /**
         * Is this a public domain?
         * @param {String} email
         * @return {Boolean}
         */
        isPublicDomain: function (email) {
            return _.contains(_publicDomains, Str.extractEmailDomain(email));
        },

        /**
         * Check if the user's authToken is valid and has not expired
         * @param {String} email The user's email
         * @returns {APIDeferred}
         */
        isAuthTokenValid: function (email) {
            return API.getAuthenticationStatus({
                userEmail: email
            });
        },

        /**
         * Check if the user has a SmartReports policy
         * @param {Function} callback Called with true if valid, false otherwise
         */
        isAccountOnSmartReports: function (callback) {
            Net.post({
                command: 'SmartReport_GetSmartReportPolicyIDs',
                nocache: true, // Disable localcache
                onError: function () {
                    // Not really sure what we should do here.
                    callback(false);
                }
            }, function (json) {
                callback(!_.isUndefined(json.policyIDs) && !_.isEmpty(json.policyIDs));
            });
        },

        /**
         * Ajax sign in function without the built-in display logic.
         * @param {String} email The user's email
         * @param {String} password The user's password
         * @returns {APIDeferred}
         */
        signIn: function (email, password) {
            return API.signIn({
                email: email,
                password: password
            });
        },

        /**
         * Ajax sign out
         * @param {String} [email] Clear the cache for this email if provided
         * @returns {APIDeferred}
         */
        signOut: function (email) {
            var signOutPromise = API.signOut();
            if (!_.isUndefined(email)) {
                signOutPromise.always(function () {
                    delete _authResult[email];
                });
            }
            return signOutPromise;
        },

        /**
         * Create an expensify account
         *
         * @param {String} email Email to create
         * @returns {APIDeferred}
         */
        signUp: function (email) {
            return API.signUp({
                email: email
            });
        },

        /**
         * Resend validation code to the user
         * @param {String} email The email to resend the code too
         * @returns {APIDeferred}
         */
        resetPassword: function (email) {
            return API.resetPassword({
                email: email
            });
        },

        /**
         * Checks that the string is a list of comma separated valid logins.
         * @param {String} loginsCsv The string to check for login validity.
         * @returns {Boolean} True if all entries are valid or if input is empty
         */
        areValidLogins: function (loginsCsv) {
            var logins = Str.removeTrailingComma(loginsCsv);
            if (logins === '') {
                return true;
            }

            return logins.split(',')
                .map(function (login) {
                    return login.trim();
                })
                .every(function (login) {
                    return Str.isValidPhone(login) || Str.isValidEmail(login);
                });
        }
    };
})();
