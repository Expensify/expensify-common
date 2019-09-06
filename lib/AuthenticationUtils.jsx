import _ from 'underscore';
import {Deferred} from 'simply-deferred';
import ExpensifyAPI from './ExpensifyAPI';
import Str from './str';

const authResult = {};

// TODO: Replace this temporary list of public domains with something more reliable, without bloating the JS with ~2500 domains
// TODO: When you change this list, please let the Mobile team know because we have it hard-coded as well.
const publicDomains = [
    'expensify.sms',
    'gmail.com',
    'yahoo.com',
    'hotmail.com',
    'me.com',
    'aol.com',
    'mac.com',
    'comcast.net',
    'msn.com',
    'live.com',
    'sbcglobal.net',
    'cox.net',
    'yahoo.co.uk',
    'att.net',
    'ymail.com',
    'verizon.net',
    'bellsouth.net',
    'googlemail.com',
    'earthlink.net',
    'hotmail.co.uk',
    'charter.net',
    'btinternet.com',
    'yahoo.com.hk',
    'yahoo.com.br',
    'yahoo.com.mx',
    'rocketmail.com',
    'shaw.ca',
    'bigpond.com',
    'yahoo.com.sg',
    'yahoo.com.tw',
    'hotmail.it'
];

/**
 * Get and cache the result of the 'signin' call to check the status of the account
 * Doesn't sign the user in because no password is supplied.
 * @param {String} email The user's email
 * @returns {Deferred} A promise resolved with the json representing the status of the account
 * @private
 */
const getAuthenticationStatusJSON = function (email) {
    const promise = new Deferred();
    const json = authResult[email];
    if (!_.isUndefined(json)) {
        promise.resolve(json);
    } else {
        ExpensifyAPI.getAccountStatus({
            email
        })
            .done((doneJSON) => {
                authResult[email] = doneJSON;
            })
            .fail((code, failJSON) => {
                authResult[email] = failJSON;
            })
            .always(() => {
                promise.resolve(authResult[email]);
            });
    }
    return promise;
};

export default {
    /**
     * Check if an account exists.
     * @param {String} email The account to check
     * @returns {Deferred}
     */
    doesAccountExist(email) {
        const promise = new Deferred();
        getAuthenticationStatusJSON(email).done((json) => {
            if (json.jsonCode === 405 || (json.jsonCode === 200 && json.partnerList.length)) {
                promise.resolve(true, json.domainControlled);
                return;
            }
            promise.resolve(false, json.domainControlled);
        });
        return promise;
    },

    /**
     * Check if an account is validated
     * @param {String} email The account to check
     * @returns {Deferred}
     */
    isAccountValidated(email) {
        const promise = new Deferred();
        getAuthenticationStatusJSON(email).done((json) => {
            if (json.jsonCode === 405) {
                promise.resolve(false);
                return;
            }
            promise.resolve(json.validated);
        });
        return promise;
    },

    /**
     * Check if an account is on domain control
     * @param {String} email The account to check
     * @returns {Deferred}
     */
    isAccountOnDomainControl(email) {
        const promise = new Deferred();
        getAuthenticationStatusJSON(email).done((json) => {
            if (json.jsonCode === 200 && json.domainControlled) {
                promise.resolve(true);
                return;
            }
            promise.resolve(false);
        });
        return promise;
    },

    /**
     * Does the user account is on a domain that REQUIRES saml?
     *
     * @param {String} email
     * @returns {Deferred}
     */
    requireSAML(email) {
        const promise = new Deferred();
        getAuthenticationStatusJSON(email).done((json) => {
            promise.resolve(json.samlRequired === true);
        });
        return promise;
    },

    /**
     * Is this a public domain?
     * @param {String} email
     * @return {Boolean}
     */
    isPublicDomain(email) {
        return _.contains(publicDomains, Str.extractEmailDomain(email));
    },

    /**
     * Ajax sign in function without the built-in display logic.
     * @param {String} email The user's email
     * @param {String} password The user's password
     * @returns {APIDeferred}
     */
    signIn(email, password) {
        return ExpensifyAPI.signIn({
            email,
            password
        });
    },

    /**
     * Ajax sign out
     * @param {String} [email] Clear the cache for this email if provided
     * @returns {APIDeferred}
     */
    signOut(email) {
        const signOutPromise = ExpensifyAPI.signOut();
        if (!_.isUndefined(email)) {
            signOutPromise.always(() => {
                delete authResult[email];
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
    signUp(email) {
        return ExpensifyAPI.signUp({
            email
        });
    },

    /**
     * Resend validation code to the user
     * @param {String} email The email to resend the code too
     * @returns {APIDeferred}
     */
    resetPassword(email) {
        return ExpensifyAPI.resetPassword({
            email
        });
    },

    /**
     * Checks that the string is a list of comma separated valid logins.
     * @param {String} loginsCsv The string to check for login validity.
     * @returns {Boolean} True if all entries are valid or if input is empty
     */
    areValidLogins(loginsCsv) {
        const logins = Str.removeTrailingComma(loginsCsv);
        if (logins === '') {
            return true;
        }

        return logins.split(',')
            .map(login => login.trim())
            .every(login => Str.isValidPhone(login) || Str.isValidEmail(login));
    }
};
