import localForage from 'localforage';

const LOGIN_PARTNER_DETAILS = {
    CREDENTIALS_KEY: 'DEVICE_SESSION_CREDENTIALS',
    EXPENSIFY_PARTNER_PREFIX: 'expensify.',
    PARTNER_NAME: 'chat-expensify-com',
    PARTNER_PASSWORD: 'e21965746fd75f82bb66'
};
const CredentialWrapper = {
    /**
     *
     * @returns {Promise} Promise resolves to an object containing partnerUserID and partnerUserSecret
     */
    getCredentials() {
        return localForage.getItem(LOGIN_PARTNER_DETAILS.CREDENTIALS_KEY);
    },

    /**
     *
     * @returns {Object} Object contains randomly generated partnerUserID and partnerUserSecret
     */
    generateCredentials() {
        return {
            partnerUserID: LOGIN_PARTNER_DETAILS.EXPENSIFY_PARTNER_PREFIX + crypto.randomUUID(),
            partnerUserSecret: crypto.randomUUID(),
        };
    },

    /**
     * @param {Object} credentials
     * @param {String} credentials.partnerUserID
     * @param {String} credentials.partnerUserSecret
     *
     * @returns {Promise} Promise resolves to an object containing partnerUserID and partnerUserSecret
     */
    setCredentials(credentials) {
        if (!credentials.partnerUserID || credentials.partnerUserSecret) {
            return Promise.reject('Invalid credential pair');
        }

        return localForage.setItem(LOGIN_PARTNER_DETAILS.CREDENTIALS_KEY, credentials);
    },

    /**
     *
     * @returns {Promise}
     */
    clearCredentials() {
        return localForage.removeItem(LOGIN_PARTNER_DETAILS.CREDENTIALS_KEY);
    },
};

export default CredentialWrapper;
