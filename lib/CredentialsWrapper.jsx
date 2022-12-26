import localForage from 'localforage';

const PARTNER_DETAILS = {
    CREDENTIALS_KEY: 'DEVICE_SESSION_CREDENTIALS',
    EXPENSIFY_PARTNER_PREFIX: 'expensify.',
    PARTNER_NAME: 'chat-expensify-com',
    PARTNER_PASSWORD: 'e21965746fd75f82bb66'
};
const CredentialWrapper = {
    getCredentials() {
        return localForage.getItem(PARTNER_DETAILS.CREDENTIALS_KEY);
    },

    generateCredentials() {
        return {
            partnerUserID: PARTNER_DETAILS.EXPENSIFY_PARTNER_PREFIX + crypto.randomUUID(),
            partnerUserSecret: crypto.randomUUID(),
        };
    },

    setCredentials(credentials) {
        if (!credentials.partnerUserID || credentials.partnerUserSecret) {
            return Promise.reject('Invalid credential pair');
        }

        return localForage.setItem(PARTNER_DETAILS.CREDENTIALS_KEY, credentials);
    },

    clearCredentials() {
        return localForage.removeItem(PARTNER_DETAILS.CREDENTIALS_KEY);
    },
};

export default CredentialWrapper;
