/* eslint-disable no-useless-escape */

const EMAIL_BASE_REGEX =
    "(?=((?=[\\w'#%+-]+(?:\\.[\\w'#%+-]+)*@)[\\w\\.'#%+-]{1,64}@(?:(?=[a-z\\d]+(?:-+[a-z\\d]+)*\\.)(?:[a-z\\d-]{1,63}\\.)+[a-z]{2,63})(?= |_|\\b))(?<end>.*))\\S{3,254}(?=\\k<end>$)";

const MOMENT_FORMAT_STRING = 'YYYY-MM-DD';

/**
 * URL of our CloudFront Instance
 */
const g_cloudFront = 'https://d2k5nsl2zxldvw.cloudfront.net';

/**
 * URL of our image CDN
 */
const g_cloudFrontImg = `${g_cloudFront}/images/`;

const CONST = {
    CORPAY_DIRECT_REIMBURSEMENT_CURRENCIES: ['USD', 'GBP', 'EUR', 'AUD', 'CAD', 'SGD'],

    /**
     * Default max ACH limit. It can be overwritten by a private NVP
     *
     * @type {Number}
     */
    ACH_DEFAULT_MAX_AMOUNT_LIMIT: 2000000,

    /**
     * This is set in main.html and is derived from a PHP template variable
     * @type {String}
     */
    URL_TO_SECURE_WEBSITE: '',

    /**
     * IRS remimbursement rate for mileage
     * WARNING ! UPDATE THE PHP CONSTANT VERSION WHEN UPDATING THIS ONE
     *
     * @type Number
     */
    MILEAGE_IRS_RATE: new Date() > new Date(2019, 1, 1) ? 0.545 : 0.58,

    /**
     * Display this amount to users to encourage them to book a call
     *
     * @type Number
     */
    MAX_TRIAL_BONUS_DAYS: 42,

    COUNTRY: {
        US: 'US',
        MX: 'MX',
        AU: 'AU',
        CA: 'CA',
        UK: 'UK',
        NZ: 'NZ',
    },

    CURRENCIES: {
        US: 'USD',
        AU: 'AUD',
        UK: 'GBP',
        NZ: 'NZD',
        EU: 'EUR',
        GB: 'GBP',
    },

    STATES: {
        AK: {
            stateISO: 'AK',
            stateName: 'Alaska',
        },
        AL: {
            stateISO: 'AL',
            stateName: 'Alabama',
        },
        AR: {
            stateISO: 'AR',
            stateName: 'Arkansas',
        },
        AZ: {
            stateISO: 'AZ',
            stateName: 'Arizona',
        },
        CA: {
            stateISO: 'CA',
            stateName: 'California',
        },
        CO: {
            stateISO: 'CO',
            stateName: 'Colorado',
        },
        CT: {
            stateISO: 'CT',
            stateName: 'Connecticut',
        },
        DE: {
            stateISO: 'DE',
            stateName: 'Delaware',
        },
        FL: {
            stateISO: 'FL',
            stateName: 'Florida',
        },
        GA: {
            stateISO: 'GA',
            stateName: 'Georgia',
        },
        HI: {
            stateISO: 'HI',
            stateName: 'Hawaii',
        },
        IA: {
            stateISO: 'IA',
            stateName: 'Iowa',
        },
        ID: {
            stateISO: 'ID',
            stateName: 'Idaho',
        },
        IL: {
            stateISO: 'IL',
            stateName: 'Illinois',
        },
        IN: {
            stateISO: 'IN',
            stateName: 'Indiana',
        },
        KS: {
            stateISO: 'KS',
            stateName: 'Kansas',
        },
        KY: {
            stateISO: 'KY',
            stateName: 'Kentucky',
        },
        LA: {
            stateISO: 'LA',
            stateName: 'Louisiana',
        },
        MA: {
            stateISO: 'MA',
            stateName: 'Massachusetts',
        },
        MD: {
            stateISO: 'MD',
            stateName: 'Maryland',
        },
        ME: {
            stateISO: 'ME',
            stateName: 'Maine',
        },
        MI: {
            stateISO: 'MI',
            stateName: 'Michigan',
        },
        MN: {
            stateISO: 'MN',
            stateName: 'Minnesota',
        },
        MO: {
            stateISO: 'MO',
            stateName: 'Missouri',
        },
        MS: {
            stateISO: 'MS',
            stateName: 'Mississippi',
        },
        MT: {
            stateISO: 'MT',
            stateName: 'Montana',
        },
        NC: {
            stateISO: 'NC',
            stateName: 'North Carolina',
        },
        ND: {
            stateISO: 'ND',
            stateName: 'North Dakota',
        },
        NE: {
            stateISO: 'NE',
            stateName: 'Nebraska',
        },
        NH: {
            stateISO: 'NH',
            stateName: 'New Hampshire',
        },
        NJ: {
            stateISO: 'NJ',
            stateName: 'New Jersey',
        },
        NM: {
            stateISO: 'NM',
            stateName: 'New Mexico',
        },
        NV: {
            stateISO: 'NV',
            stateName: 'Nevada',
        },
        NY: {
            stateISO: 'NY',
            stateName: 'New York',
        },
        OH: {
            stateISO: 'OH',
            stateName: 'Ohio',
        },
        OK: {
            stateISO: 'OK',
            stateName: 'Oklahoma',
        },
        OR: {
            stateISO: 'OR',
            stateName: 'Oregon',
        },
        PA: {
            stateISO: 'PA',
            stateName: 'Pennsylvania',
        },
        PR: {
            stateISO: 'PR',
            stateName: 'Puerto Rico',
        },
        RI: {
            stateISO: 'RI',
            stateName: 'Rhode Island',
        },
        SC: {
            stateISO: 'SC',
            stateName: 'South Carolina',
        },
        SD: {
            stateISO: 'SD',
            stateName: 'South Dakota',
        },
        TN: {
            stateISO: 'TN',
            stateName: 'Tennessee',
        },
        TX: {
            stateISO: 'TX',
            stateName: 'Texas',
        },
        UT: {
            stateISO: 'UT',
            stateName: 'Utah',
        },
        VA: {
            stateISO: 'VA',
            stateName: 'Virginia',
        },
        VT: {
            stateISO: 'VT',
            stateName: 'Vermont',
        },
        WA: {
            stateISO: 'WA',
            stateName: 'Washington',
        },
        WI: {
            stateISO: 'WI',
            stateName: 'Wisconsin',
        },
        WV: {
            stateISO: 'WV',
            stateName: 'West Virginia',
        },
        WY: {
            stateISO: 'WY',
            stateName: 'Wyoming',
        },
        DC: {
            stateISO: 'DC',
            stateName: 'District Of Columbia',
        },
    },

    /** Canadian provinces */
    PROVINCES: {
        AB: {
            provinceISO: 'AB',
            provinceName: 'Alberta',
        },
        BC: {
            provinceISO: 'BC',
            provinceName: 'British Columbia',
        },
        MB: {
            provinceISO: 'MB',
            provinceName: 'Manitoba',
        },
        NB: {
            provinceISO: 'NB',
            provinceName: 'New Brunswick',
        },
        NL: {
            provinceISO: 'NL',
            provinceName: 'Newfoundland and Labrador',
        },
        NS: {
            provinceISO: 'NS',
            provinceName: 'Nova Scotia',
        },
        NT: {
            provinceISO: 'NT',
            provinceName: 'Northwest Territories',
        },
        NU: {
            provinceISO: 'NU',
            provinceName: 'Nunavut',
        },
        ON: {
            provinceISO: 'ON',
            provinceName: 'Ontario',
        },
        PE: {
            provinceISO: 'PE',
            provinceName: 'Prince Edward Island',
        },
        QC: {
            provinceISO: 'QC',
            provinceName: 'Quebec',
        },
        SK: {
            provinceISO: 'SK',
            provinceName: 'Saskatchewan',
        },
        YT: {
            provinceISO: 'YT',
            provinceName: 'Yukon',
        },
    },

    /**
     * Special characters that need to be removed when they are ending an url
     *
     * @type String
     */
    SPECIAL_CHARS_TO_REMOVE: '$*.+!(,=',

    /**
     * Store all the regular expression we are using for matching stuff
     */
    REG_EXP: {
        /**
         * Regular expression to check that a domain is valid
         *
         * @type RegExp
         */
        DOMAIN: /^[\w-\.]*\.\w{2,}$/,

        /**
         * Regex matching an text containing an email
         *
         * @type String
         */
        EMAIL_PART: EMAIL_BASE_REGEX,

        /**
         * Regex matching a text containing general phone number
         *
         * @type RegExp
         */
        GENERAL_PHONE_PART: /^(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}$/,

        /**
         * Regex matching a text containing an E.164 format phone number
         */
        PHONE_PART: '\\+[1-9]\\d{1,14}',

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
         * Regular expression to check that an email is valid
         *
         * @type RegExp
         */
        EMAIL: new RegExp(`^${EMAIL_BASE_REGEX}$`, 'i'),

        /**
         * Regular expression to extract an email from a text
         *
         * @type RegExp
         */
        EXTRACT_EMAIL: new RegExp(EMAIL_BASE_REGEX, 'gi'),

        /**
         * Regular expression to search for valid email addresses in a string
         *
         * @type RegExp
         */
        EMAIL_SEARCH: new RegExp(EMAIL_BASE_REGEX, 'gi'),

        /**
         * Regular expression to detect if something is a hyperlink
         *
         * Adapted from: https://gist.github.com/dperini/729294
         *
         * @type RegExp
         */
        HYPERLINK:
            /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i,

        /**
         * Regex to match valid emails during markdown transformations
         *
         * @type String
         */
        MARKDOWN_EMAIL: EMAIL_BASE_REGEX,

        /**
         * Regex matching an text containing an Emoji that can be a single emoji or made up by some different emojis
         *
         * @type RegExp
         */
        EMOJI_RULE:
            /[\p{Extended_Pictographic}\uE000-\uF8FF\u{F0000}-\u{FFFFD}\u{100000}-\u{10FFFD}](\u200D[\p{Extended_Pictographic}]|[\u{1F3FB}-\u{1F3FF}]|[\u{E0020}-\u{E007F}]|\uFE0F|\u20E3)*|[\u{1F1E6}-\u{1F1FF}]{2}|[#*0-9]\uFE0F?\u20E3/gu,
        /**
         * Regex to match a piece of text or @here, needed for both shortMention and userMention
         */
        PRE_MENTION_TEXT_PART: '(@here|[a-zA-Z0-9.!$%&+=?^\\`{|}-]?)',
    },

    REPORT: {
        /**
         * Limit when we decided to turn off print to pdf and use only the native feature
         */
        LIMIT_PRINT_PDF: 250,
        ACH_LIMIT: 2000000,
        ACH_DEFAULT_DAYS: 4,

        /**
         * This is the string that a user can enter in a formula to refer to the report title field
         *
         * @type {String}
         */
        TITLE_FORMULA: '{report:title}',

        /**
         * The max time a comment can be made after another to be considered the same comment, in seconds
         */
        MAX_AGE_SAME_COMMENT: 300,

        SMARTREPORT_AGENT_EMAIL: 'smartreports@expensify.com',

        /**
         * Email to submit smart reports to (alias for consistency)
         */
        SMART_REPORT_AGENT_EMAIL: 'smartreports@expensify.com',
    },

    /**
     * Root URLs
     */
    URL: {
        FORUM_ROOT: 'https://community.expensify.com/',
        RECEIPTS: {
            DEVELOPMENT: 'https://www.expensify.com.dev/receipts/',
            STAGING: 'https://staging.expensify.com/receipts/',
            PRODUCTION: 'https://www.expensify.com/receipts/',
        },
        CLOUDFRONT: 'https://d2k5nsl2zxldvw.cloudfront.net',
        CLOUDFRONT_IMG: 'https://d2k5nsl2zxldvw.cloudfront.net/images/',
        CLOUDFRONT_FILES: 'https://d2k5nsl2zxldvw.cloudfront.net/files/',
        EXPENSIFY_SYNC_MANAGER: 'quickbooksdesktop/Expensify_QuickBooksDesktop_Setup_2300802.exe',
        USEDOT_ROOT: 'https://use.expensify.com/',
        HELPDOT_ROOT: 'https://help.expensify.com/',
        ITUNES_SUBSCRIPTION: 'https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions',
    },

    DATE: {
        FORMAT_STRING: 'yyyy-MM-dd',
        FORMAT_STRING_PRETTY: 'MMM d, yyyy',

        /**
         * Expensify date format string for moment js
         * usage: moment().format( CONST.DATE.MOMENT_FORMAT_STRING )
         */
        MOMENT_FORMAT_STRING,

        /**
         * This is a typical format of the date plus the time
         *
         * @type {String}
         */
        MOMENT_DATE_TIME: 'YYYY-MM-DD HH:mm',

        /**
         * Pretty format used for report history items
         *
         * @example Jun 19, 2019 12:38 PM
         *
         * @type {String}
         */
        MOMENT_DATE_TIME_PRETTY: 'MMM DD YYYY h:mma',

        /**
         * Date-time format, including timezone information, eg "2015-10-14T19:44:35+07:00"
         *
         * @type {String}
         */
        MOMENT_DATE_TIME_TIMEZONE: 'YYYY-MM-DDTHH:mm:ssZ',

        /**
         * Moment formatting option for a date of this format "Jul 2, 2014"
         *
         * @type {string}
         */
        MOMENT_US_DATE: 'MMM D, YYYY',

        /**
         * Moment formatting option for a date of this format "July 2, 2014"
         * ie, full month name
         *
         * @type {string}
         */
        MOMENT_US_DATE_LONG: 'MMMM D, YYYY',

        /**
         * Moment formatting option for full month name and year as in "July 2015"
         *
         * @type {string}
         */
        MOMENT_US_MONTH_YEAR_LONG: 'MMMM YYYY',

        /**
         * Difference between the local time and UTC time in ms
         */
        TIMEZONE_OFFSET_MS: new Date().getTimezoneOffset() * 60000,

        SHORT_MONTH_SHORT_DAY: 'MMM d', // e.g. Jan 1
        LONG_YEAR_MONTH_DAY_24_TIME: 'yyyy-MM-dd HH:mm:ss', // e.g. 2020-01-01 20:45:15

        SHORT_MONTH_DAY_LOCAL_TIME: 'MMM D [at] LT', // e.g. Jan 1 at 12:00 PM
        SHORT_MONTH_DAY_YEAR_LOCAL_TIME: 'MMM D, YYYY [at] LT', // e.g. Jan 1, 2020 at 12:00 PM
    },

    /**
     * Message used by the Func.die() exception
     *
     * @type String
     */
    FUNC_DIE_MESSAGE: 'Aborting JavaScript execution',

    /**
     * Default for how long the email delivery failure NVP should be valid (in seconds)
     * Currently 14 days (14 * 24 * 60 * 60)
     *
     * WARNING ! UPDATE THE PHP CONSTANT VERSION WHEN UPDATING THIS ONE
     *
     * @type Integer
     */
    EMAIL_DELIVERY_FAILURE_VALIDITY: 1209600,

    /**
     * Bill Processing-related constants
     */
    BILL_PROCESSING_PARTNER_NAME: 'expensify.cash',
    BILL_PROCESSING_EMAIL_DOMAIN: 'expensify.cash',

    /**
     * Bank Import Logic Constants
     */
    BANK_IMPORT: {
        BANK_STATUS_BROKEN: 2,
    },

    /**
     * Bank Account Logic Constants
     */
    BANK_ACCOUNT: {
        VERIFICATION_MAX_ATTEMPTS: 7,
    },

    // The number of days that certain banks limit their transaction imports to
    // see https://stackoverflow.com/c/expensify/questions/1289/1290#1290 for more about this.
    // If a bank isn't on this list, we default to 90 days
    BANK_IMPORT_DAY_LIMITS: {
        'americanexpress.com': 30,
        'oauth.bankofamerica.com': 30,
        'oauth.capitalone.com': 90,
        'oauth.chase.com': 90,
        'discover.com': 30,
        'admin.pexcard.com': 30,
        svbdirect: 75,
        'oauth.wellsfargo.com': 30,
    },
    DEFAULT_BANK_IMPORT_DAYS: 90,
    PERSONAL_CARD_START_DATE_TOOLTIP:
        'Expensify will automatically import the earliest available transactions from this card. If a start date is selected, transactions with a posted date prior to this will not be included.',

    /**
     * Emails that the user shouldn't be interacting with from the front-end interface
     * Trying to add these emails as a delegate, onto a policy, or as an approver is considered invalid
     * Any changes here should be reflected in the PHP constant in web-expensify,
     * which is located in _constant.php and also named EXPENSIFY_EMAILS.
     * And should also be reflected in the constant in expensify/app,
     * which is located in src/CONST.js and also named EXPENSIFY_EMAILS.
     */
    EXPENSIFY_EMAILS: [
        'concierge@expensify.com',
        'help@expensify.com',
        'receipts@expensify.com',
        'chronos@expensify.com',
        'qa@expensify.com',
        'contributors@expensify.com',
        'firstresponders@expensify.com',
        'qa+travisreceipts@expensify.com',
        'bills@expensify.com',
        'studentambassadors@expensify.com',
        'accounting@expensify.com',
        'payroll@expensify.com',
        'svfg@expensify.com',
        'integrationtestingcreds@expensify.com',
        'admin@expensify.com',
        'notifications@expensify.com',
    ],

    /**
     * Emails that the user shouldn't submit reports to nor share reports with
     * Any changes here should be reflected in the PHP constant,
     * which is located in _constant.php and also named INVALID_APPROVER_AND_SHAREE_EMAILS
     */
    INVALID_APPROVER_AND_SHAREE_EMAILS: [
        'concierge@expensify.com',
        'help@expensify.com',
        'receipts@expensify.com',
        'chronos@expensify.com',
        'qa@expensify.com',
        'contributors@expensify.com',
        'firstresponders@expensify.com',
        'qa+travisreceipts@expensify.com',
        'bills@expensify.com',
        'admin@expensify.com',
        'notifications@expensify.com',
    ],

    /**
     * Smart scan-related constants
     */
    SMART_SCAN: {
        COST: 20,
        FREE_NUMBER: 25,
    },

    SMS: {
        // Domain used for accounts that sign up with phone numbers
        DOMAIN: 'expensify.sms',

        // Regex that matches on an E.164 phone number starting with a '+'
        E164_REGEX: /^\+?[1-9]\d{1,14}$/,
    },

    PASSWORD_COMPLEXITY_REGEX_STRING: '^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$',

    INTEGRATIONS: {
        ACCOUNTING_METHOD: {
            CASH: 'CASH',
            ACCRUAL: 'ACCRUAL',
        },

        /**
         * Constants that specify how to map (import) Integrations data to Expensify
         * Parallel to IntegrationEntityMappingTypeEnum in the IS
         */
        DATA_MAPPING: {
            NONE: 'NONE',
            TAG: 'TAG',
            REPORT_FIELD: 'REPORT_FIELD',
            DEFAULT: 'DEFAULT',
        },

        EXPORT_DATE: {
            LAST_EXPENSE: 'LAST_EXPENSE',
            REPORT_EXPORTED: 'REPORT_EXPORTED',
            REPORT_SUBMITTED: 'REPORT_SUBMITTED',
        },

        XERO_HQ_CONNECTION_NAME: 'xerohq',

        EXPENSIFY_SYNC_MANAGER_VERSION: '23.0.802.0',
    },

    INTEGRATION_TYPES: {
        ACCOUNTING: 'accounting',
        HR: 'hr',
    },

    DIRECT_INTEGRATIONS: {
        zenefits: {
            value: 'zenefits',
            text: 'Zenefits',
            image: `${g_cloudFrontImg}icons/export-icons/zenefit.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/zenefit_gray.svg`,
            alert_image: `${g_cloudFrontImg}icons/export-icons/zenefit_alert.svg`,
            types: ['hr'],
            isCorporateOnly: false,
        },
        gusto: {
            value: 'gusto',
            text: 'Gusto',
            image: `${g_cloudFrontImg}icons/export-icons/gusto.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/gusto_gray.svg`,
            alert_image: `${g_cloudFrontImg}icons/export-icons/gusto_alert.svg`,
            types: ['hr'],
            isCorporateOnly: false,
        },
        quickbooksOnline: {
            value: 'quickbooksOnline',
            text: 'QuickBooks Online',
            image: `${g_cloudFrontImg}icons/export-icons/quickbooks.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/quickbooks_gray.svg`,
            alert_image: `${g_cloudFrontImg}icons/export-icons/quickbooks_alert.svg`,
            types: ['hr', 'accounting'],
            isCorporateOnly: false,
        },
        xero: {
            value: 'xero',
            text: 'Xero',
            image: `${g_cloudFrontImg}icons/export-icons/xero.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/xero_gray.svg`,
            alert_image: `${g_cloudFrontImg}icons/export-icons/xero_alert.svg`,
            types: ['accounting'],
            isCorporateOnly: false,
        },
        netsuite: {
            value: 'netsuite',
            text: 'NetSuite',
            image: `${g_cloudFrontImg}icons/export-icons/netsuite.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/netsuite_gray.svg`,
            alert_image: `${g_cloudFrontImg}icons/export-icons/netsuite_alert.svg`,
            types: ['hr', 'accounting'],
            isCorporateOnly: true,
        },
        quickbooksDesktop: {
            value: 'qbd',
            text: 'QuickBooks Desktop',
            image: `${g_cloudFrontImg}icons/export-icons/quickbooks.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/quickbooks_gray.svg`,
            alert_image: `${g_cloudFrontImg}icons/export-icons/quickbooks_alert.svg`,
            types: ['accounting'],
            isCorporateOnly: false,
        },
        intacct: {
            value: 'intacct',
            text: 'Sage Intacct',
            image: `${g_cloudFrontImg}icons/export-icons/sage.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/sage_gray.svg`,
            alert_image: `${g_cloudFrontImg}icons/export-icons/sage_alert.svg`,
            types: ['hr', 'accounting'],
            isCorporateOnly: true,
        },
        financialforce: {
            value: 'financialforce',
            text: 'Certinia',
            image: `${g_cloudFrontImg}icons/export-icons/certinia.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/certinia_gray.svg`,
            alert_image: `${g_cloudFrontImg}icons/export-icons/certinia_alert.svg`,
            types: ['accounting'],
            isCorporateOnly: true,
        },
    },

    INDIRECT_INTEGRATIONS: {
        microsoft_dynamics: {
            value: 'microsoft_dynamics',
            text: 'Microsoft Dynamics',
            image: `${g_cloudFrontImg}icons/export-icons/microsoft_dynamics.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/microsoft_dynamics_gray.svg`,
            types: ['accounting'],
            isCorporateOnly: true,
        },
        oracle: {
            value: 'oracle',
            text: 'Oracle',
            image: `${g_cloudFrontImg}icons/export-icons/oracle.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/oracle_gray.svg`,
            types: ['hr', 'accounting'],
            isCorporateOnly: true,
        },
        sage: {
            value: 'sage',
            text: 'Sage',
            image: `${g_cloudFrontImg}icons/export-icons/sage.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/sage_gray.svg`,
            types: ['accounting'],
            isCorporateOnly: true,
        },
        sap: {
            value: 'sap',
            text: 'SAP',
            image: `${g_cloudFrontImg}icons/export-icons/sap.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/sap_gray.svg`,
            types: ['accounting'],
            isCorporateOnly: true,
        },
        myob: {
            value: 'myob',
            text: 'MYOB',
            image: `${g_cloudFrontImg}icons/export-icons/myob.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/myob_gray.svg`,
            types: ['accounting'],
            isCorporateOnly: true,
        },
        workday: {
            value: 'workday',
            text: 'Workday',
            image: `${g_cloudFrontImg}icons/export-icons/workday.svg`,
            gray_image: `${g_cloudFrontImg}icons/export-icons/workday_gray.svg`,
            types: ['hr'],
            isCorporateOnly: true,
        },
        adp: {
            value: 'adp',
            text: 'ADP',
            image: `${g_cloudFrontImg}icons/export-icons/adp.svg`,
            types: ['hr'],
            isCorporateOnly: true,
        },
        generic_indirect_connection: {
            value: 'generic_indirect_connection',
            text: 'Other',
            image: `${g_cloudFrontImg}icons/accounting-other--blue.svg`,
            types: ['hr', 'accounting'],
        },
    },

    DEFAULT_IS_TEMPLATES: {
        default: {
            value: 'default_template',
            text: 'Basic Export',
            image: `${g_cloudFrontImg}icons/accounting-other--blue.svg`,
        },
        tag: {
            value: 'tag_template',
            text: 'Tag Export',
            image: `${g_cloudFrontImg}icons/accounting-other--blue.svg`,
        },
        category: {
            value: 'category_template',
            text: 'Category Export',
            image: `${g_cloudFrontImg}icons/accounting-other--blue.svg`,
        },
        detailed: {
            value: 'detailed_export',
            text: 'All Data - Expense Level Export',
            image: `${g_cloudFrontImg}icons/accounting-other--blue.svg`,
        },
        report: {
            value: 'report_level_export',
            text: 'All Data - Report Level Export',
            image: `${g_cloudFrontImg}icons/accounting-other--blue.svg`,
        },
        tax: {
            value: 'multiple_tax_export',
            text: 'Canadian Multiple Tax Export',
            image: `${g_cloudFrontImg}icons/accounting-other--blue.svg`,
        },
        perdiem: {
            value: 'per_diem_export',
            text: 'Per Diem Export',
            image: `${g_cloudFrontImg}icons/accounting-other--blue.svg`,
        },
        attendees: {
            value: 'attendee_audit_export',
            text: 'Attendee Audit Export',
            image: `${g_cloudFrontImg}icons/accounting-other--blue.svg`,
        },
    },

    NVP: {
        // Dismissed Violations
        DISMISSED_VIOLATIONS: 'dismissedViolations',
    },
    FILESIZE: {
        BYTES_IN_MEGABYTE: 1000000, // Bytes in a Megabyte
        MAX: 10000000, // Our max filesize allowed is 10MB
    },

    PARTNER_NAMES: {
        IPHONE: 'iphone',
        ANDROID: 'android',
        CHAT: 'chat-expensify-com',
    },

    LOGIN_TYPES: {
        WEB: 'login',
        MOBILE: 'device',
    },

    VALIDATE_CODE_REASONS: {
        SIGN_IN: 'sign_in',
        ADD_CONTACT_METHOD: 'add_contact_method',
        VALIDATE_ACCOUNT: 'validate_account',
        REVEAL_CARD_DETAILS: 'reveal_card_details',
    },

    EXPENSIFY_CARD: {
        FEED_NAME: 'Expensify Card',

        // The following variables must be kept up to date with the Card::FraudState constants found in Auth
        FRAUD_STATES: {
            NONE: 0,
            DOMAIN_CARDS_REIMBURSEMENTS_INVESTIGATION: 1,
            DOMAIN_CARDS_RAPID_INCREASE_INVESTIGATION: 2,
            DOMAIN_CARDS_RAPID_INCREASE_CLEARED: 3,
            DOMAIN_CARDS_RAPID_INCREASE_CONFIRMED: 4,
            INDIVIDUAL_CARD_RAPID_INCREASE_INVESTIGATION: 5,
            INDIVIDUAL_CARD_RAPID_INCREASE_CLEARED: 6,
            INDIVIDUAL_CARD_RAPID_INCREASE_CONFIRMED: 7,
            SUSPICIOUS_PAN_ENTRY: 8,
            SUSPICIOUS_PAN_ENTRY_CLEARED: 9,
            SUSPICIOUS_PAN_ENTRY_CONFIRMED: 10,
            SUSPICIOUS_TRANSACTIONS_DETECTED: 11,
            SUSPICIOUS_TRANSACTIONS_DETECTED_CLEARED: 12,
            SUSPICIOUS_TRANSACTIONS_DETECTED_CONFIRMED: 13,
        },
    },

    TRAVEL_BOOKING: {
        OPTIONS: {
            shortFlightFare: {
                economy: 'Economy',
                premiumEconomy: 'Premium Economy',
                business: 'Business',
                first: 'First',
            },
            longFlightFare: {
                economy: 'Economy',
                premiumEconomy: 'Premium Economy',
                business: 'Business',
                first: 'First',
            },
            hotelStar: {
                oneStar: '1',
                twoStars: '2',
                threeStars: '3',
                fourStars: '4',
                fiveStars: '5',
            },
        },
        DEFAULT_OPTIONS: {
            shortFlightFare: 'economy',
            longFlightFare: 'economy',
            hotelStar: 'fourStars',
        },
        PAYMENT_TYPE: {
            PAY_AT_HOTEL: 'PAY_AT_HOTEL',
            PAY_AT_VENDOR: 'PAY_AT_VENDOR',
        },
    },

    // Expensify domains
    EXPENSIFY_DOMAINS: ['expensify.com', 'expensifail.com', 'expensicorp.com'],

    SUBSCRIPTION_CHANGE_REASONS: {
        TOO_LIMITED: {
            id: 'tooLimited',
            label: 'Functionality needs improvement',
            prompt: 'What software are you moving to and why?',
        },
        TOO_EXPENSIVE: {
            id: 'tooExpensive',
            label: 'Too expensive',
            prompt: 'What software are you moving to and why?',
        },
        INADEQUATE_SUPPORT: {
            id: 'inadequateSupport',
            label: 'Inadequate customer support',
            prompt: 'What software are you moving to and why?',
        },
        BUSINESS_CLOSING: {
            id: 'businessClosing',
            label: 'Company closing, downsizing, or acquired',
            prompt: 'What software are you moving to and why?',
        },
    },
    VIDEO_EXTENSIONS: ['mp4', 'mov', 'avi', 'wmv', 'flv', 'mkv', 'webm', '3gp', 'm4v', 'mpg', 'mpeg', 'ogv'],

    // Country keys are ISO 3166-1 alpha-2 codes: https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
    // Per-country zip regex sources:
    // - https://github.com/FormatterKit/PostalCodeValidator/blob/master/Sources/PostalCodeValidator/PostalCodeValidator.swift
    // - https://en.wikipedia.org/wiki/List_of_postal_codes
    COUNTRY_ZIP_REGEX_DATA: {
        AC: {
            regex: /^ASCN 1ZZ$/,
            samples: 'ASCN 1ZZ',
        },
        AD: {
            regex: /^AD[1-7]0\d$/,
            samples: 'AD206, AD403, AD106, AD406',
        },

        // We have kept the empty object for the countries which do not have any zip code validation
        // to ensure consistency so that the amount of countries displayed and in this object are same
        AE: {},
        AF: {
            regex: /^\d{4}$/,
            samples: '9536, 1476, 3842, 7975',
        },
        AG: {},
        AI: {
            regex: /^AI-2640$/,
            samples: 'AI-2640',
        },
        AL: {
            regex: /^\d{4}$/,
            samples: '1631, 9721, 2360, 5574',
        },
        AM: {
            regex: /^\d{4}$/,
            samples: '5581, 7585, 8434, 2492',
        },
        AO: {},
        AQ: {},
        AR: {
            regex: /^((?:[A-HJ-NP-Z])?\d{4})([A-Z]{3})?$/,
            samples: 'Q7040GFQ, K2178ZHR, P6240EJG, J6070IAE',
        },
        AS: {
            regex: /^96799$/,
            samples: '96799',
        },
        AT: {
            regex: /^\d{4}$/,
            samples: '4223, 2052, 3544, 5488',
        },
        AU: {
            regex: /^\d{4}$/,
            samples: '7181, 7735, 9169, 8780',
        },
        AW: {},
        AX: {
            regex: /^22\d{3}$/,
            samples: '22270, 22889, 22906, 22284',
        },
        AZ: {
            regex: /^(AZ) (\d{4})$/,
            samples: 'AZ 6704, AZ 5332, AZ 3907, AZ 6892',
        },
        BA: {
            regex: /^\d{5}$/,
            samples: '62722, 80420, 44595, 74614',
        },
        BB: {
            regex: /^BB\d{5}$/,
            samples: 'BB64089, BB17494, BB73163, BB25752',
        },
        BD: {
            regex: /^\d{4}$/,
            samples: '8585, 8175, 7381, 0154',
        },
        BE: {
            regex: /^\d{4}$/,
            samples: '7944, 5303, 6746, 7921',
        },
        BF: {},
        BG: {
            regex: /^\d{4}$/,
            samples: '6409, 7657, 1206, 7908',
        },
        BH: {
            regex: /^\d{3}\d?$/,
            samples: '047, 1116, 490, 631',
        },
        BI: {},
        BJ: {},
        BL: {
            regex: /^97133$/,
            samples: '97133',
        },
        BM: {
            regex: /^[A-Z]{2} ?[A-Z0-9]{2}$/,
            samples: 'QV9P, OSJ1, PZ 3D, GR YK',
        },
        BN: {
            regex: /^[A-Z]{2} ?\d{4}$/,
            samples: 'PF 9925, TH1970, SC 4619, NF0781',
        },
        BO: {},
        BQ: {},
        BR: {
            regex: /^\d{5}-?\d{3}$/,
            samples: '18816-403, 95177-465, 43447-782, 39403-136',
        },
        BS: {},
        BT: {
            regex: /^\d{5}$/,
            samples: '28256, 52484, 30608, 93524',
        },
        BW: {},
        BY: {
            regex: /^\d{6}$/,
            samples: '504154, 360246, 741167, 895047',
        },
        BZ: {},
        CA: {
            regex: /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z] ?\d[ABCEGHJ-NPRSTV-Z]\d$/,
            samples: 'S1A7K8, Y5H 4G6, H9V0P2, H1A1B5',
        },
        CC: {
            regex: /^6799$/,
            samples: '6799',
        },
        CD: {},
        CF: {},
        CG: {},
        CH: {
            regex: /^\d{4}$/,
            samples: '6370, 5271, 7873, 8220',
        },
        CI: {},
        CK: {},
        CL: {
            regex: /^\d{7}$/,
            samples: '7565829, 8702008, 3161669, 1607703',
        },
        CM: {},
        CN: {
            regex: /^\d{6}$/,
            samples: '240543, 870138, 295528, 861683',
        },
        CO: {
            regex: /^\d{6}$/,
            samples: '678978, 775145, 823943, 913970',
        },
        CR: {
            regex: /^\d{5}$/,
            samples: '28256, 52484, 30608, 93524',
        },
        CU: {
            regex: /^(?:CP)?(\d{5})$/,
            samples: '28256, 52484, 30608, 93524',
        },
        CV: {
            regex: /^\d{4}$/,
            samples: '9056, 8085, 0491, 4627',
        },
        CW: {},
        CX: {
            regex: /^6798$/,
            samples: '6798',
        },
        CY: {
            regex: /^\d{4}$/,
            samples: '9301, 2478, 1981, 6162',
        },
        CZ: {
            regex: /^\d{3} ?\d{2}$/,
            samples: '150 56, 50694, 229 08, 82811',
        },
        DE: {
            regex: /^\d{5}$/,
            samples: '33185, 37198, 81711, 44262',
        },
        DJ: {},
        DK: {
            regex: /^\d{4}$/,
            samples: '1429, 2457, 0637, 5764',
        },
        DM: {},
        DO: {
            regex: /^\d{5}$/,
            samples: '11877, 95773, 93875, 98032',
        },
        DZ: {
            regex: /^\d{5}$/,
            samples: '26581, 64621, 57550, 72201',
        },
        EC: {
            regex: /^\d{6}$/,
            samples: '541124, 873848, 011495, 334509',
        },
        EE: {
            regex: /^\d{5}$/,
            samples: '87173, 01127, 73214, 52381',
        },
        EG: {
            regex: /^\d{5}$/,
            samples: '98394, 05129, 91463, 77359',
        },
        EH: {
            regex: /^\d{5}$/,
            samples: '30577, 60264, 16487, 38593',
        },
        ER: {},
        ES: {
            regex: /^\d{5}$/,
            samples: '03315, 00413, 23179, 89324',
        },
        ET: {
            regex: /^\d{4}$/,
            samples: '6269, 8498, 4514, 7820',
        },
        FI: {
            regex: /^\d{5}$/,
            samples: '21859, 72086, 22422, 03774',
        },
        FJ: {},
        FK: {
            regex: /^FIQQ 1ZZ$/,
            samples: 'FIQQ 1ZZ',
        },
        FM: {
            regex: /^(9694[1-4])(?:[ -](\d{4}))?$/,
            samples: '96942-9352, 96944-4935, 96941 9065, 96943-5369',
        },
        FO: {
            regex: /^\d{3}$/,
            samples: '334, 068, 741, 787',
        },
        FR: {
            regex: /^\d{2} ?\d{3}$/,
            samples: '25822, 53 637, 55354, 82522',
        },
        GA: {},
        GB: {
            regex: /^[A-Z]{1,2}[0-9R][0-9A-Z]?\s*([0-9][ABD-HJLNP-UW-Z]{2})?$/,
            samples: 'LA102UX, BL2F8FX, BD1S9LU, WR4G 6LH, W1U',
        },
        GD: {},
        GE: {
            regex: /^\d{4}$/,
            samples: '1232, 9831, 4717, 9428',
        },
        GF: {
            regex: /^9[78]3\d{2}$/,
            samples: '98380, 97335, 98344, 97300',
        },
        GG: {
            regex: /^GY\d[\dA-Z]? ?\d[ABD-HJLN-UW-Z]{2}$/,
            samples: 'GY757LD, GY6D 6XL, GY3Y2BU, GY85 1YO',
        },
        GH: {},
        GI: {
            regex: /^GX11 1AA$/,
            samples: 'GX11 1AA',
        },
        GL: {
            regex: /^39\d{2}$/,
            samples: '3964, 3915, 3963, 3956',
        },
        GM: {},
        GN: {
            regex: /^\d{3}$/,
            samples: '465, 994, 333, 078',
        },
        GP: {
            regex: /^9[78][01]\d{2}$/,
            samples: '98069, 97007, 97147, 97106',
        },
        GQ: {},
        GR: {
            regex: /^\d{3} ?\d{2}$/,
            samples: '98654, 319 78, 127 09, 590 52',
        },
        GS: {
            regex: /^SIQQ 1ZZ$/,
            samples: 'SIQQ 1ZZ',
        },
        GT: {
            regex: /^\d{5}$/,
            samples: '30553, 69925, 09376, 83719',
        },
        GU: {
            regex: /^((969)[1-3][0-2])$/,
            samples: '96922, 96932, 96921, 96911',
        },
        GW: {
            regex: /^\d{4}$/,
            samples: '1742, 7941, 4437, 7728',
        },
        GY: {},
        HK: {
            regex: /^999077$|^$/,
            samples: '999077',
        },
        HN: {
            regex: /^\d{5}$/,
            samples: '86238, 78999, 03594, 30406',
        },
        HR: {
            regex: /^\d{5}$/,
            samples: '85240, 80710, 78235, 98766',
        },
        HT: {
            regex: /^(?:HT)?(\d{4})$/,
            samples: '5101, HT6991, HT3871, 1126',
        },
        HU: {
            regex: /^\d{4}$/,
            samples: '0360, 2604, 3362, 4775',
        },
        ID: {
            regex: /^\d{5}$/,
            samples: '60993, 52656, 16521, 34931',
        },
        IE: {},
        IL: {
            regex: /^\d{5}(?:\d{2})?$/,
            samples: '74213, 6978354, 2441689, 4971551',
        },
        IM: {
            regex: /^IM\d[\dA-Z]? ?\d[ABD-HJLN-UW-Z]{2}$/,
            samples: 'IM2X1JP, IM4V 9JU, IM3B1UP, IM8E 5XF',
        },
        IN: {
            regex: /^\d{6}$/,
            samples: '946956, 143659, 243258, 938385',
        },
        IO: {
            regex: /^BBND 1ZZ$/,
            samples: 'BBND 1ZZ',
        },
        IQ: {
            regex: /^\d{5}$/,
            samples: '63282, 87817, 38580, 47725',
        },
        IR: {
            regex: /^\d{5}-?\d{5}$/,
            samples: '0666174250, 6052682188, 02360-81920, 25102-08646',
        },
        IS: {
            regex: /^\d{3}$/,
            samples: '408, 013, 001, 936',
        },
        IT: {
            regex: /^\d{5}$/,
            samples: '31701, 61341, 92781, 45609',
        },
        JE: {
            regex: /^JE\d[\dA-Z]? ?\d[ABD-HJLN-UW-Z]{2}$/,
            samples: 'JE0D 2EX, JE59 2OF, JE1X1ZW, JE0V 1SO',
        },
        JM: {},
        JO: {
            regex: /^\d{5}$/,
            samples: '20789, 02128, 52170, 40284',
        },
        JP: {
            regex: /^\d{3}-?\d{4}$/,
            samples: '5429642, 046-1544, 6463599, 368-5362',
        },
        KE: {
            regex: /^\d{5}$/,
            samples: '33043, 98830, 59324, 42876',
        },
        KG: {
            regex: /^\d{6}$/,
            samples: '500371, 176592, 184133, 225279',
        },
        KH: {
            regex: /^\d{5,6}$/,
            samples: '220281, 18824, 35379, 09570',
        },
        KI: {
            regex: /^KI\d{4}$/,
            samples: 'KI0104, KI0109, KI0112, KI0306',
        },
        KM: {},
        KN: {
            regex: /^KN\d{4}(-\d{4})?$/,
            samples: 'KN2522, KN2560-3032, KN3507, KN4440',
        },
        KP: {},
        KR: {
            regex: /^\d{5}$/,
            samples: '67417, 66648, 08359, 93750',
        },
        KW: {
            regex: /^\d{5}$/,
            samples: '74840, 53309, 71276, 59262',
        },
        KY: {
            regex: /^KY\d-\d{4}$/,
            samples: 'KY0-3078, KY1-7812, KY8-3729, KY3-4664',
        },
        KZ: {
            regex: /^\d{6}$/,
            samples: '129113, 976562, 226811, 933781',
        },
        LA: {
            regex: /^\d{5}$/,
            samples: '08875, 50779, 87756, 75932',
        },
        LB: {
            regex: /^(?:\d{4})(?: ?(?:\d{4}))?$/,
            samples: '5436 1302, 9830 7470, 76911911, 9453 1306',
        },
        LC: {
            regex: /^(LC)?\d{2} ?\d{3}$/,
            samples: '21080, LC99127, LC24 258, 51 740',
        },
        LI: {
            regex: /^\d{4}$/,
            samples: '6644, 2852, 4630, 4541',
        },
        LK: {
            regex: /^\d{5}$/,
            samples: '44605, 27721, 90695, 65514',
        },
        LR: {
            regex: /^\d{4}$/,
            samples: '6644, 2852, 4630, 4541',
        },
        LS: {
            regex: /^\d{3}$/,
            samples: '779, 803, 104, 897',
        },
        LT: {
            regex: /^((LT)[-])?(\d{5})$/,
            samples: 'LT-22248, LT-12796, 69822, 37280',
        },
        LU: {
            regex: /^((L)[-])?(\d{4})$/,
            samples: '5469, L-4476, 6304, 9739',
        },
        LV: {
            regex: /^((LV)[-])?\d{4}$/,
            samples: '9344, LV-5030, LV-0132, 8097',
        },
        LY: {},
        MA: {
            regex: /^\d{5}$/,
            samples: '50219, 95871, 80907, 79804',
        },
        MC: {
            regex: /^980\d{2}$/,
            samples: '98084, 98041, 98070, 98062',
        },
        MD: {
            regex: /^(MD[-]?)?(\d{4})$/,
            samples: '6250, MD-9681, MD3282, MD-0652',
        },
        ME: {
            regex: /^\d{5}$/,
            samples: '87622, 92688, 23129, 59566',
        },
        MF: {
            regex: /^9[78][01]\d{2}$/,
            samples: '97169, 98180, 98067, 98043',
        },
        MG: {
            regex: /^\d{3}$/,
            samples: '854, 084, 524, 064',
        },
        MH: {
            regex: /^((969)[6-7][0-9])(-\d{4})?/,
            samples: '96962, 96969, 96970-8530, 96960-3226',
        },
        MK: {
            regex: /^\d{4}$/,
            samples: '8299, 6904, 6144, 9753',
        },
        ML: {},
        MM: {
            regex: /^\d{5}$/,
            samples: '59188, 93943, 40829, 69981',
        },
        MN: {
            regex: /^\d{5}$/,
            samples: '94129, 29906, 53374, 80141',
        },
        MO: {},
        MP: {
            regex: /^(9695[012])(?:[ -](\d{4}))?$/,
            samples: '96952 3162, 96950 1567, 96951 2994, 96950 8745',
        },
        MQ: {
            regex: /^9[78]2\d{2}$/,
            samples: '98297, 97273, 97261, 98282',
        },
        MR: {},
        MS: {
            regex: /^[Mm][Ss][Rr]\s{0,1}\d{4}$/,
            samples: 'MSR1110, MSR1230, MSR1250, MSR1330',
        },
        MT: {
            regex: /^[A-Z]{3} [0-9]{4}|[A-Z]{2}[0-9]{2}|[A-Z]{2} [0-9]{2}|[A-Z]{3}[0-9]{4}|[A-Z]{3}[0-9]{2}|[A-Z]{3} [0-9]{2}$/,
            samples: 'DKV 8196, KSU9264, QII0259, HKH 1020',
        },
        MU: {
            regex: /^([0-9A-R]\d{4})$/,
            samples: 'H8310, 52591, M9826, F5810',
        },
        MV: {
            regex: /^\d{5}$/,
            samples: '16354, 20857, 50991, 72527',
        },
        MW: {},
        MX: {
            regex: /^\d{5}$/,
            samples: '71530, 76424, 73811, 50503',
        },
        MY: {
            regex: /^\d{5}$/,
            samples: '75958, 15826, 86715, 37081',
        },
        MZ: {
            regex: /^\d{4}$/,
            samples: '0902, 6258, 7826, 7150',
        },
        NA: {
            regex: /^\d{5}$/,
            samples: '68338, 63392, 21820, 61211',
        },
        NC: {
            regex: /^988\d{2}$/,
            samples: '98865, 98813, 98820, 98855',
        },
        NE: {
            regex: /^\d{4}$/,
            samples: '9790, 3270, 2239, 0400',
        },
        NF: {
            regex: /^2899$/,
            samples: '2899',
        },
        NG: {
            regex: /^\d{6}$/,
            samples: '289096, 223817, 199970, 840648',
        },
        NI: {
            regex: /^\d{5}$/,
            samples: '86308, 60956, 49945, 15470',
        },
        NL: {
            regex: /^\d{4} ?[A-Z]{2}$/,
            samples: '6998 VY, 5390 CK, 2476 PS, 8873OX',
        },
        NO: {
            regex: /^\d{4}$/,
            samples: '0711, 4104, 2683, 5015',
        },
        NP: {
            regex: /^\d{5}$/,
            samples: '42438, 73964, 66400, 33976',
        },
        NR: {
            regex: /^(NRU68)$/,
            samples: 'NRU68',
        },
        NU: {
            regex: /^(9974)$/,
            samples: '9974',
        },
        NZ: {
            regex: /^\d{4}$/,
            samples: '7015, 0780, 4109, 1422',
        },
        OM: {
            regex: /^(?:PC )?\d{3}$/,
            samples: 'PC 851, PC 362, PC 598, PC 499',
        },
        PA: {
            regex: /^\d{4}$/,
            samples: '0711, 4104, 2683, 5015',
        },
        PE: {
            regex: /^\d{5}$/,
            samples: '10013, 12081, 14833, 24615',
        },
        PF: {
            regex: /^987\d{2}$/,
            samples: '98755, 98710, 98748, 98791',
        },
        PG: {
            regex: /^\d{3}$/,
            samples: '193, 166, 880, 553',
        },
        PH: {
            regex: /^\d{4}$/,
            samples: '0137, 8216, 2876, 0876',
        },
        PK: {
            regex: /^\d{5}$/,
            samples: '78219, 84497, 62102, 12564',
        },
        PL: {
            regex: /^\d{2}-\d{3}$/,
            samples: '63-825, 26-714, 05-505, 15-200',
        },
        PM: {
            regex: /^(97500)$/,
            samples: '97500',
        },
        PN: {
            regex: /^PCRN 1ZZ$/,
            samples: 'PCRN 1ZZ',
        },
        PR: {
            regex: /^(00[679]\d{2})(?:[ -](\d{4}))?$/,
            samples: '00989 3603, 00639 0720, 00707-9803, 00610 7362',
        },
        PS: {
            regex: /^(00[679]\d{2})(?:[ -](\d{4}))?$/,
            samples: '00748, 00663, 00779-4433, 00934 1559',
        },
        PT: {
            regex: /^\d{4}-\d{3}$/,
            samples: '0060-917, 4391-979, 5551-657, 9961-093',
        },
        PW: {
            regex: /^(969(?:39|40))(?:[ -](\d{4}))?$/,
            samples: '96940, 96939, 96939 6004, 96940-1871',
        },
        PY: {
            regex: /^\d{4}$/,
            samples: '7895, 5835, 8783, 5887',
        },
        QA: {},
        RE: {
            regex: /^9[78]4\d{2}$/,
            samples: '98445, 97404, 98421, 98434',
        },
        RO: {
            regex: /^\d{6}$/,
            samples: '935929, 407608, 637434, 174574',
        },
        RS: {
            regex: /^\d{5,6}$/,
            samples: '929863, 259131, 687739, 07011',
        },
        RU: {
            regex: /^\d{6}$/,
            samples: '138294, 617323, 307906, 981238',
        },
        RW: {},
        SA: {
            regex: /^\d{5}(-{1}\d{4})?$/,
            samples: '86020-1256, 72375, 70280, 96328',
        },
        SB: {},
        SC: {},
        SD: {
            regex: /^\d{5}$/,
            samples: '78219, 84497, 62102, 12564',
        },
        SE: {
            regex: /^\d{3} ?\d{2}$/,
            samples: '095 39, 41052, 84687, 563 66',
        },
        SG: {
            regex: /^\d{6}$/,
            samples: '606542, 233985, 036755, 265255',
        },
        SH: {
            regex: /^(?:ASCN|TDCU|STHL) 1ZZ$/,
            samples: 'STHL 1ZZ, ASCN 1ZZ, TDCU 1ZZ',
        },
        SI: {
            regex: /^\d{4}$/,
            samples: '6898, 3413, 2031, 5732',
        },
        SJ: {
            regex: /^\d{4}$/,
            samples: '7616, 3163, 5769, 0237',
        },
        SK: {
            regex: /^\d{3} ?\d{2}$/,
            samples: '594 52, 813 34, 867 67, 41814',
        },
        SL: {},
        SM: {
            regex: /^4789\d$/,
            samples: '47894, 47895, 47893, 47899',
        },
        SN: {
            regex: /^[1-8]\d{4}$/,
            samples: '48336, 23224, 33261, 82430',
        },
        SO: {},
        SR: {},
        SS: {
            regex: /^[A-Z]{2} ?\d{5}$/,
            samples: 'JQ 80186, CU 46474, DE33738, MS 59107',
        },
        ST: {},
        SV: {},
        SX: {},
        SY: {},
        SZ: {
            regex: /^[HLMS]\d{3}$/,
            samples: 'H458, L986, M477, S916',
        },
        TA: {
            regex: /^TDCU 1ZZ$/,
            samples: 'TDCU 1ZZ',
        },
        TC: {
            regex: /^TKCA 1ZZ$/,
            samples: 'TKCA 1ZZ',
        },
        TD: {},
        TF: {},
        TG: {},
        TH: {
            regex: /^\d{5}$/,
            samples: '30706, 18695, 21044, 42496',
        },
        TJ: {
            regex: /^\d{6}$/,
            samples: '381098, 961344, 519925, 667883',
        },
        TK: {},
        TL: {},
        TM: {
            regex: /^\d{6}$/,
            samples: '544985, 164362, 425224, 374603',
        },
        TN: {
            regex: /^\d{4}$/,
            samples: '6075, 7340, 2574, 8988',
        },
        TO: {},
        TR: {
            regex: /^\d{5}$/,
            samples: '42524, 81057, 50859, 42677',
        },
        TT: {
            regex: /^\d{6}$/,
            samples: '041238, 033990, 763476, 981118',
        },
        TV: {},
        TW: {
            regex: /^\d{3}(?:\d{2})?$/,
            samples: '21577, 76068, 68698, 08912',
        },
        TZ: {},
        UA: {
            regex: /^\d{5}$/,
            samples: '10629, 81138, 15668, 30055',
        },
        UG: {},
        UM: {},
        US: {
            regex: /^[0-9]{5}(?:[- ][0-9]{4})?$/,
            samples: '12345, 12345-1234, 12345 1234',
        },
        UY: {
            regex: /^\d{5}$/,
            samples: '40073, 30136, 06583, 00021',
        },
        UZ: {
            regex: /^\d{6}$/,
            samples: '205122, 219713, 441699, 287471',
        },
        VA: {
            regex: /^(00120)$/,
            samples: '00120',
        },
        VC: {
            regex: /^VC\d{4}$/,
            samples: 'VC0600, VC0176, VC0616, VC4094',
        },
        VE: {
            regex: /^\d{4}$/,
            samples: '9692, 1953, 6680, 8302',
        },
        VG: {
            regex: /^VG\d{4}$/,
            samples: 'VG1204, VG7387, VG3431, VG6021',
        },
        VI: {
            regex: /^(008(?:(?:[0-4]\d)|(?:5[01])))(?:[ -](\d{4}))?$/,
            samples: '00820, 00804 2036, 00825 3344, 00811-5900',
        },
        VN: {
            regex: /^\d{6}$/,
            samples: '133836, 748243, 894060, 020597',
        },
        VU: {},
        WF: {
            regex: /^986\d{2}$/,
            samples: '98692, 98697, 98698, 98671',
        },
        WS: {
            regex: /^WS[1-2]\d{3}$/,
            samples: 'WS1349, WS2798, WS1751, WS2090',
        },
        XK: {
            regex: /^[1-7]\d{4}$/,
            samples: '56509, 15863, 46644, 21896',
        },
        YE: {},
        YT: {
            regex: /^976\d{2}$/,
            samples: '97698, 97697, 97632, 97609',
        },
        ZA: {
            regex: /^\d{4}$/,
            samples: '6855, 5179, 6956, 7147',
        },
        ZM: {
            regex: /^\d{5}$/,
            samples: '77603, 97367, 80454, 94484',
        },
        ZW: {},
    },

    GENERIC_ZIP_CODE_REGEX: /^(?:(?![\s-])[\w -]{0,9}[\w])?$/,
} as const;

/**
 * UI Constants
 */
const UI = {
    ICON: {
        DELETE: 'trashcan',
        CAR: 'car',
        CASH: 'cash',
        MANAGED_CARD: 'corporate-card',
        CARD: 'credit-card',
        CLOCK: 'time',
        PER_DIEM: 'per-diem',
        PENDING_CARD: 'card-transaction-pending',
        CSV_UPLOAD: 'csv-upload',
        PENDING_CREDIT_CARD: 'credit-card-pending',
    },
    spinnerDIV: '<div class="spinner"></div>',
    spinnerSmallDIV: '<div class="spinner spinner-small"></div>',
    spinnerLargeDIV: '<div class="spinner spinner-large"></div>',
    spinnerClass: 'view_spinner',
    SPINNER: 'spinner',
    imageURLPrefix: g_cloudFrontImg,
    ACTIVE: 'active',
    ERROR: 'error',
    HIDDEN: 'hidden',
    INVISIBLE: 'invisible',
    DEPRECIATED: 'depreciated',
    DISABLED: 'disabled',
    REQUIRED: 'required',
    SELECT_DEFAULT: '###',
    SELECTED: 'selected',

    // Class used to identify qrCode container
    QR_CODE: 'js_qrCode',

    // Base z-index for dialogs $zindex-dialog in _vars.scss should take it's value from here!
    DIALOG_Z_INDEX: 4000,
} as const;

/**
 * Set of most frequently used public domains
 */
const PUBLIC_DOMAINS_SET = new Set<string>([
    'accountant.com',
    'afis.ch',
    'aol.com',
    'artlover.com',
    'asia.com',
    'att.net',
    'bellsouth.net',
    'bills.expensify.com',
    'btinternet.com',
    'cheerful.com',
    'chromeexpensify.com',
    'comcast.net',
    'consultant.com',
    'contractor.com',
    'cox.net',
    'cpa.com',
    'cryptohistoryprice.com',
    'dr.com',
    'email.com',
    'engineer.com',
    'europe.com',
    'evernote.user',
    'execs.com',
    'expensify.cash',
    'expensify.sms',
    'gmail.com',
    'gmail.con',
    'googlemail.com',
    'hey.com',
    'hotmail.co.uk',
    'hotmail.com',
    'hotmail.fr',
    'hotmail.it',
    'icloud.com',
    'iname.com',
    'jeeviess.com',
    'live.com',
    'mac.com',
    'mail.com',
    'mail.ru',
    'mailfence.com',
    'me.com',
    'msn.com',
    'musician.org',
    'myself.com',
    'outlook.com',
    'pm.me',
    'post.com',
    'privaterelay.appleid.com',
    'proton.me',
    'protonmail.ch',
    'protonmail.com',
    'qq.com',
    'rigl.ch',
    'sasktel.net',
    'sbcglobal.net',
    'spacehotline.com',
    'tafmail.com',
    'techie.com',
    'usa.com',
    'verizon.net',
    'vomoto.com',
    'wolfandcranebar.tech',
    'workmail.com',
    'writeme.com',
    'yahoo.ca',
    'yahoo.co.in',
    'yahoo.co.uk',
    'yahoo.com',
    'yahoo.com.br',
    'ymail.com',
]);

export {g_cloudFront, g_cloudFrontImg, CONST, UI, PUBLIC_DOMAINS_SET};
