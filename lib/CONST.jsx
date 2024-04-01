/* eslint-disable no-useless-escape */

const EMAIL_BASE_REGEX = '(?=((?=[\\w\'#%+-]+(?:\\.[\\w\'#%+-]+)*@)[\\w\\.\'#%+-]{1,64}@(?:(?=[a-z\\d]+(?:-+[a-z\\d]+)*\\.)(?:[a-z\\d-]{1,63}\\.)+[a-z]{2,63})(?= |_|\\b))(?<end>.*))\\S{3,254}(?=\\k<end>$)';

const MOMENT_FORMAT_STRING = 'YYYY-MM-DD';

/**
 * URL of our CloudFront Instance
 */
export const g_cloudFront = 'https://d2k5nsl2zxldvw.cloudfront.net';

/**
 * URL of our image CDN
 */
export const g_cloudFrontImg = `${g_cloudFront}/images/`;

export const CONST = {
    CORPAY_DIRECT_REIMBURSEMENT_CURRENCIES: [
        'USD',
        'GBP',
        'EUR',
        'AUD',
        'CAD',
    ],

    /**
     * Default max ACH limit. It can be overwritten by a private NVP
     *
     * @type {Number}
     */
    ACH_DEFAULT_MAX_AMOUNT_LIMIT: 2000000,

    /**
     * IRS remimbursement rate for mileage
     * WARNING ! UPDATE THE PHP CONSTANT VERSION WHEN UPDATING THIS ONE
     *
     * @type Number
     */
    MILEAGE_IRS_RATE: (new Date() > new Date(2019, 1, 1)) ? 0.545 : 0.58,

    /**
     * Display this amount to users to encourage them to book a call
     *
     * @type Number
     */
    MAX_TRIAL_BONUS_DAYS: 42,

    COUNTRY: {
        US: 'US',
        AU: 'AU',
        UK: 'UK',
        NZ: 'NZ'
    },

    CURRENCIES: {
        US: 'USD',
        AU: 'AUD',
        UK: 'GBP',
        NZ: 'NZD'
    },

    STATES: {
        AK: {
            stateISO: 'AK',
            stateName: 'Alaska'
        },
        AL: {
            stateISO: 'AL',
            stateName: 'Alabama'
        },
        AR: {
            stateISO: 'AR',
            stateName: 'Arkansas'
        },
        AZ: {
            stateISO: 'AZ',
            stateName: 'Arizona'
        },
        CA: {
            stateISO: 'CA',
            stateName: 'California'
        },
        CO: {
            stateISO: 'CO',
            stateName: 'Colorado'
        },
        CT: {
            stateISO: 'CT',
            stateName: 'Connecticut'
        },
        DE: {
            stateISO: 'DE',
            stateName: 'Delaware'
        },
        FL: {
            stateISO: 'FL',
            stateName: 'Florida'
        },
        GA: {
            stateISO: 'GA',
            stateName: 'Georgia'
        },
        HI: {
            stateISO: 'HI',
            stateName: 'Hawaii'
        },
        IA: {
            stateISO: 'IA',
            stateName: 'Iowa'
        },
        ID: {
            stateISO: 'ID',
            stateName: 'Idaho'
        },
        IL: {
            stateISO: 'IL',
            stateName: 'Illinois'
        },
        IN: {
            stateISO: 'IN',
            stateName: 'Indiana'
        },
        KS: {
            stateISO: 'KS',
            stateName: 'Kansas'
        },
        KY: {
            stateISO: 'KY',
            stateName: 'Kentucky'
        },
        LA: {
            stateISO: 'LA',
            stateName: 'Louisiana'
        },
        MA: {
            stateISO: 'MA',
            stateName: 'Massachusetts'
        },
        MD: {
            stateISO: 'MD',
            stateName: 'Maryland'
        },
        ME: {
            stateISO: 'ME',
            stateName: 'Maine'
        },
        MI: {
            stateISO: 'MI',
            stateName: 'Michigan'
        },
        MN: {
            stateISO: 'MN',
            stateName: 'Minnesota'
        },
        MO: {
            stateISO: 'MO',
            stateName: 'Missouri'
        },
        MS: {
            stateISO: 'MS',
            stateName: 'Mississippi'
        },
        MT: {
            stateISO: 'MT',
            stateName: 'Montana'
        },
        NC: {
            stateISO: 'NC',
            stateName: 'North Carolina'
        },
        ND: {
            stateISO: 'ND',
            stateName: 'North Dakota'
        },
        NE: {
            stateISO: 'NE',
            stateName: 'Nebraska'
        },
        NH: {
            stateISO: 'NH',
            stateName: 'New Hampshire'
        },
        NJ: {
            stateISO: 'NJ',
            stateName: 'New Jersey'
        },
        NM: {
            stateISO: 'NM',
            stateName: 'New Mexico'
        },
        NV: {
            stateISO: 'NV',
            stateName: 'Nevada'
        },
        NY: {
            stateISO: 'NY',
            stateName: 'New York'
        },
        OH: {
            stateISO: 'OH',
            stateName: 'Ohio'
        },
        OK: {
            stateISO: 'OK',
            stateName: 'Oklahoma'
        },
        OR: {
            stateISO: 'OR',
            stateName: 'Oregon'
        },
        PA: {
            stateISO: 'PA',
            stateName: 'Pennsylvania'
        },
        PR: {
            stateISO: 'PR',
            stateName: 'Puerto Rico'
        },
        RI: {
            stateISO: 'RI',
            stateName: 'Rhode Island'
        },
        SC: {
            stateISO: 'SC',
            stateName: 'South Carolina'
        },
        SD: {
            stateISO: 'SD',
            stateName: 'South Dakota'
        },
        TN: {
            stateISO: 'TN',
            stateName: 'Tennessee'
        },
        TX: {
            stateISO: 'TX',
            stateName: 'Texas'
        },
        UT: {
            stateISO: 'UT',
            stateName: 'Utah'
        },
        VA: {
            stateISO: 'VA',
            stateName: 'Virginia'
        },
        VT: {
            stateISO: 'VT',
            stateName: 'Vermont'
        },
        WA: {
            stateISO: 'WA',
            stateName: 'Washington'
        },
        WI: {
            stateISO: 'WI',
            stateName: 'Wisconsin'
        },
        WV: {
            stateISO: 'WV',
            stateName: 'West Virginia'
        },
        WY: {
            stateISO: 'WY',
            stateName: 'Wyoming'
        },
        DC: {
            stateISO: 'DC',
            stateName: 'District Of Columbia'
        }
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
        GENERAL_PHONE_PART: /(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}/,

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
        HYPERLINK: new RegExp('^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$', 'i'),

        /**
         * Regex to match valid emails during markdown transformations
         *
         * @type String
         */
        MARKDOWN_EMAIL: EMAIL_BASE_REGEX,

        /**
         * Regex matching an text containing an Emoji
         *
         * @type RegExp
         */
        EMOJIS: /[\p{Extended_Pictographic}\u200d\u{1f1e6}-\u{1f1ff}\u{1f3fb}-\u{1f3ff}\u{e0020}-\u{e007f}\u20E3\uFE0F]|[#*0-9]\uFE0F?\u20E3/gu,

        /**
         * Regex matching an text containing an Emoji that can be a single emoji or made up by some different emojis
         *
         * @type RegExp
         */
        EMOJI_RULE: /[\p{Extended_Pictographic}](\u200D[\p{Extended_Pictographic}]|[\u{1F3FB}-\u{1F3FF}]|[\u{E0020}-\u{E007F}]|\uFE0F|\u20E3)*|[\u{1F1E6}-\u{1F1FF}]{2}|[#*0-9]\uFE0F?\u20E3/gu,
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
        ITUNES_SUBSCRIPTION: 'https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions'
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
        BANK_STATUS_BROKEN: 2
    },

    /**
     * Bank Account Logic Constants
     */
    BANK_ACCOUNT: {
        VERIFICATION_MAX_ATTEMPTS: 7
    },

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
    ],

    /**
     * Smart scan-related constants
     */
    SMART_SCAN: {
        COST: 20,
        FREE_NUMBER: 25
    },

    SMS: {
        // Domain used for accounts that sign up with phone numbers
        DOMAIN: 'expensify.sms',

        // Regex that matches on an E.164 phone number starting with a '+'
        E164_REGEX: /^\+?[1-9]\d{1,14}$/,
    },

    PASSWORD_COMPLEXITY_REGEX_STRING: '^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$',

    INTEGRATIONS: {
        /**
         * Constants that specify how to map (import) Integrations data to Expensify
         * Parallel to IntegrationEntityMappingTypeEnum in the IS
         */
        DATA_MAPPING: {
            NONE: 'NONE',
            TAG: 'TAG',
            REPORT_FIELD: 'REPORT_FIELD',
            DEFAULT: 'DEFAULT'
        },

        EXPORT_DATE: {
            LAST_EXPENSE: 'LAST_EXPENSE',
            REPORT_EXPORTED: 'REPORT_EXPORTED',
            REPORT_SUBMITTED: 'REPORT_SUBMITTED'
        },

        XERO_HQ_CONNECTION_NAME: 'xerohq',

        EXPENSIFY_SYNC_MANAGER_VERSION: '23.0.802.0',
    },

    INTEGRATION_TYPES: {
        ACCOUNTING: 'accounting',
        HR: 'hr'
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
        }
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
        DISMISSED_VIOLATIONS: 'dismissedViolations'
    },
    FILESIZE: {
        BYTES_IN_MEGABYTE: 1000000, // Bytes in a Megabyte
        MAX: 10000000 // Our max filesize allowed is 10MB
    },

    PARTNER_NAMES: {
        IPHONE: 'iphone',
        ANDROID: 'android',
        CHAT: 'chat-expensify-com',
    },

    LOGIN_TYPES: {
        WEB: 'login',
        MOBILE: 'device'
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
        }
    },

    TRAVEL_BOOKING: {
        OPTIONS: {
            shortFlightFare: {
                economy: 'Economy',
                premiumEconomy: 'Premium Economy',
                business: 'Business',
                first: 'First'
            },
            longFlightFare: {
                economy: 'Economy',
                premiumEconomy: 'Premium Economy',
                business: 'Business',
                first: 'First'
            },
            hotelStar: {
                oneStar: '1',
                twoStars: '2',
                threeStars: '3',
                fourStars: '4',
                fiveStars: '5'
            },
        },
        DEFAULT_OPTIONS: {
            shortFlightFare: 'economy',
            longFlightFare: 'economy',
            hotelStar: 'fourStars'
        },
    },

    // Expensify domains
    EXPENSIFY_DOMAINS: [
        'expensify.com',
        'expensifail.com',
        'expensicorp.com'
    ],

    SUBSCRIPTION_CHANGE_REASONS: {
        TOO_LIMITED: {
            id: 'tooLimited',
            label: 'Functionality needs improvement',
            prompt: 'What software are you migrating to and what led to this decision?',
        },
        TOO_EXPENSIVE: {
            id: 'tooExpensive',
            label: 'Too expensive',
            prompt: 'What software are you migrating to and what led to this decision?',
        },
        INADEQUATE_SUPPORT: {
            id: 'inadequateSupport',
            label: 'Inadequate customer support',
            prompt: 'What software are you migrating to and what led to this decision?',
        },
        BUSINESS_CLOSING: {
            id: 'businessClosing',
            label: 'Company closing, downsizing, or acquired',
            prompt: 'What software are you migrating to and what led to this decision?',
        },
    },
};

/**
 * UI Constants
 */
export const UI = {
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
        PENDING_CREDIT_CARD: 'credit-card-pending'
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
    DIALOG_Z_INDEX: 4000
};

// List of most frequently used public domains
export const PUBLIC_DOMAINS = [
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
];
