/* eslint-disable no-useless-escape */

const emailBaseRegex = "([\\w\\-\\+\\'#]+(?:\\.[\\w\\-\\+]+)*@(?:[\\w\\-]+\\.)+[a-z]{2,})";

module.exports = {
    REG_EXP: {
        /**
         * Regular expression to check that a domain is valid
         *
         * @type RegExp
         */
        DOMAIN: /^[\w-\.]*\.\w{2,}$/,

        /**
         * Regular expression to check that a basic name is valid
         *
         * @type RegExp
         */
        FREE_NAME: /^[^\r\n\t]{1,256}$/,

        /**
         * Regular expression to check that a card is masked
         *
         * @type RegExp
         */
        MASKED_CARD: /^\d{0,6}[X]+\d{4,7}$/,

        /**
         * Regular expression to check that an email address is valid
         *
         * @type RegExp
         */
        EMAIL_VALID: new RegExp(`^${emailBaseRegex}$`, 'i'),

        /**
         * Regular expression to search for valid email addresses in a string
         *
         * @type RegExp
         */
        EMAIL_SEARCH: new RegExp(emailBaseRegex, 'gi')
    }
};
