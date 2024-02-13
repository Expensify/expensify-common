/**
 * URL of our CloudFront Instance
 */
export declare const g_cloudFront: "https://d2k5nsl2zxldvw.cloudfront.net";
/**
 * URL of our image CDN
 */
export declare const g_cloudFrontImg: "https://d2k5nsl2zxldvw.cloudfront.net/images/";
export declare const CONST: {
    readonly CORPAY_DIRECT_REIMBURSEMENT_CURRENCIES: readonly ["USD", "GBP", "EUR", "AUD", "CAD"];
    /**
     * Default max ACH limit. It can be overwritten by a private NVP
     */
    readonly ACH_DEFAULT_MAX_AMOUNT_LIMIT: 2000000;
    /**
     * IRS remimbursement rate for mileage
     * WARNING ! UPDATE THE PHP CONSTANT VERSION WHEN UPDATING THIS ONE
     */
    readonly MILEAGE_IRS_RATE: 0.545 | 0.58;
    readonly COUNTRY: {
        readonly US: "US";
        readonly AU: "AU";
        readonly UK: "UK";
        readonly NZ: "NZ";
    };
    readonly CURRENCIES: {
        readonly US: "USD";
        readonly AU: "AUD";
        readonly UK: "GBP";
        readonly NZ: "NZD";
    };
    readonly STATES: {
        readonly AK: {
            readonly stateISO: "AK";
            readonly stateName: "Alaska";
        };
        readonly AL: {
            readonly stateISO: "AL";
            readonly stateName: "Alabama";
        };
        readonly AR: {
            readonly stateISO: "AR";
            readonly stateName: "Arkansas";
        };
        readonly AZ: {
            readonly stateISO: "AZ";
            readonly stateName: "Arizona";
        };
        readonly CA: {
            readonly stateISO: "CA";
            readonly stateName: "California";
        };
        readonly CO: {
            readonly stateISO: "CO";
            readonly stateName: "Colorado";
        };
        readonly CT: {
            readonly stateISO: "CT";
            readonly stateName: "Connecticut";
        };
        readonly DE: {
            readonly stateISO: "DE";
            readonly stateName: "Delaware";
        };
        readonly FL: {
            readonly stateISO: "FL";
            readonly stateName: "Florida";
        };
        readonly GA: {
            readonly stateISO: "GA";
            readonly stateName: "Georgia";
        };
        readonly HI: {
            readonly stateISO: "HI";
            readonly stateName: "Hawaii";
        };
        readonly IA: {
            readonly stateISO: "IA";
            readonly stateName: "Iowa";
        };
        readonly ID: {
            readonly stateISO: "ID";
            readonly stateName: "Idaho";
        };
        readonly IL: {
            readonly stateISO: "IL";
            readonly stateName: "Illinois";
        };
        readonly IN: {
            readonly stateISO: "IN";
            readonly stateName: "Indiana";
        };
        readonly KS: {
            readonly stateISO: "KS";
            readonly stateName: "Kansas";
        };
        readonly KY: {
            readonly stateISO: "KY";
            readonly stateName: "Kentucky";
        };
        readonly LA: {
            readonly stateISO: "LA";
            readonly stateName: "Louisiana";
        };
        readonly MA: {
            readonly stateISO: "MA";
            readonly stateName: "Massachusetts";
        };
        readonly MD: {
            readonly stateISO: "MD";
            readonly stateName: "Maryland";
        };
        readonly ME: {
            readonly stateISO: "ME";
            readonly stateName: "Maine";
        };
        readonly MI: {
            readonly stateISO: "MI";
            readonly stateName: "Michigan";
        };
        readonly MN: {
            readonly stateISO: "MN";
            readonly stateName: "Minnesota";
        };
        readonly MO: {
            readonly stateISO: "MO";
            readonly stateName: "Missouri";
        };
        readonly MS: {
            readonly stateISO: "MS";
            readonly stateName: "Mississippi";
        };
        readonly MT: {
            readonly stateISO: "MT";
            readonly stateName: "Montana";
        };
        readonly NC: {
            readonly stateISO: "NC";
            readonly stateName: "North Carolina";
        };
        readonly ND: {
            readonly stateISO: "ND";
            readonly stateName: "North Dakota";
        };
        readonly NE: {
            readonly stateISO: "NE";
            readonly stateName: "Nebraska";
        };
        readonly NH: {
            readonly stateISO: "NH";
            readonly stateName: "New Hampshire";
        };
        readonly NJ: {
            readonly stateISO: "NJ";
            readonly stateName: "New Jersey";
        };
        readonly NM: {
            readonly stateISO: "NM";
            readonly stateName: "New Mexico";
        };
        readonly NV: {
            readonly stateISO: "NV";
            readonly stateName: "Nevada";
        };
        readonly NY: {
            readonly stateISO: "NY";
            readonly stateName: "New York";
        };
        readonly OH: {
            readonly stateISO: "OH";
            readonly stateName: "Ohio";
        };
        readonly OK: {
            readonly stateISO: "OK";
            readonly stateName: "Oklahoma";
        };
        readonly OR: {
            readonly stateISO: "OR";
            readonly stateName: "Oregon";
        };
        readonly PA: {
            readonly stateISO: "PA";
            readonly stateName: "Pennsylvania";
        };
        readonly PR: {
            readonly stateISO: "PR";
            readonly stateName: "Puerto Rico";
        };
        readonly RI: {
            readonly stateISO: "RI";
            readonly stateName: "Rhode Island";
        };
        readonly SC: {
            readonly stateISO: "SC";
            readonly stateName: "South Carolina";
        };
        readonly SD: {
            readonly stateISO: "SD";
            readonly stateName: "South Dakota";
        };
        readonly TN: {
            readonly stateISO: "TN";
            readonly stateName: "Tennessee";
        };
        readonly TX: {
            readonly stateISO: "TX";
            readonly stateName: "Texas";
        };
        readonly UT: {
            readonly stateISO: "UT";
            readonly stateName: "Utah";
        };
        readonly VA: {
            readonly stateISO: "VA";
            readonly stateName: "Virginia";
        };
        readonly VT: {
            readonly stateISO: "VT";
            readonly stateName: "Vermont";
        };
        readonly WA: {
            readonly stateISO: "WA";
            readonly stateName: "Washington";
        };
        readonly WI: {
            readonly stateISO: "WI";
            readonly stateName: "Wisconsin";
        };
        readonly WV: {
            readonly stateISO: "WV";
            readonly stateName: "West Virginia";
        };
        readonly WY: {
            readonly stateISO: "WY";
            readonly stateName: "Wyoming";
        };
        readonly DC: {
            readonly stateISO: "DC";
            readonly stateName: "District Of Columbia";
        };
    };
    /**
     * Store all the regular expression we are using for matching stuff
     */
    readonly REG_EXP: {
        /**
         * Regular expression to check that a domain is valid
         */
        readonly DOMAIN: RegExp;
        /**
         * Regex matching an text containing an email
         */
        readonly EMAIL_PART: "([\\w\\-\\+\\'#]+(?:\\.[\\w\\-\\'\\+]+)*@(?:[\\w\\-]+\\.)+[a-z]{2,})";
        /**
         * Regular expression to check that a basic name is valid
         */
        readonly FREE_NAME: RegExp;
        /**
         * Regular expression to check that a card is masked
         */
        readonly MASKED_CARD: RegExp;
        /**
         * Regular expression to check that an email is valid
         */
        readonly EMAIL: RegExp;
        /**
         * Regular expression to extract an email from a text
         */
        readonly EXTRACT_EMAIL: RegExp;
        /**
         * Regular expression to search for valid email addresses in a string
         */
        readonly EMAIL_SEARCH: RegExp;
        /**
         * Regular expression to detect if something is a hyperlink
         *
         * Adapted from: https://gist.github.com/dperini/729294
         */
        readonly HYPERLINK: RegExp;
        /**
         * Regex to match valid emails during markdown transformations
         */
        readonly MARKDOWN_EMAIL: "([a-zA-Z0-9.!#$%&'+/=?^`{|}-][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*@[a-zA-Z0-9-]+?(\\.[a-zA-Z]+)+)";
        /**
         * Regex matching an text containing an Emoji
         */
        readonly EMOJIS: RegExp;
    };
    readonly REPORT: {
        /**
         * Limit when we decided to turn off print to pdf and use only the native feature
         */
        readonly LIMIT_PRINT_PDF: 250;
        readonly ACH_LIMIT: 2000000;
        readonly ACH_DEFAULT_DAYS: 4;
        /**
         * This is the string that a user can enter in a formula to refer to the report title field
         */
        readonly TITLE_FORMULA: "{report:title}";
        /**
         * The max time a comment can be made after another to be considered the same comment, in seconds
         */
        readonly MAX_AGE_SAME_COMMENT: 300;
        readonly SMARTREPORT_AGENT_EMAIL: "smartreports@expensify.com";
    };
    /**
     * Root URLs
     */
    readonly URL: {
        readonly FORUM_ROOT: "https://community.expensify.com/";
        readonly RECEIPTS: {
            readonly DEVELOPMENT: "https://www.expensify.com.dev/receipts/";
            readonly STAGING: "https://staging.expensify.com/receipts/";
            readonly PRODUCTION: "https://www.expensify.com/receipts/";
        };
        readonly CLOUDFRONT: "https://d2k5nsl2zxldvw.cloudfront.net";
        readonly CLOUDFRONT_IMG: "https://d2k5nsl2zxldvw.cloudfront.net/images/";
        readonly CLOUDFRONT_FILES: "https://d2k5nsl2zxldvw.cloudfront.net/files/";
        readonly EXPENSIFY_SYNC_MANAGER: "quickbooksdesktop/Expensify_QuickBooksDesktop_Setup_2300802.exe";
        readonly USEDOT_ROOT: "https://use.expensify.com/";
        readonly ITUNES_SUBSCRIPTION: "https://buy.itunes.apple.com/WebObjects/MZFinance.woa/wa/manageSubscriptions";
    };
    readonly DATE: {
        readonly FORMAT_STRING: "yyyy-MM-dd";
        readonly FORMAT_STRING_PRETTY: "MMM d, yyyy";
        /**
         * Expensify date format string for moment js
         * usage: moment().format( CONST.DATE.MOMENT_FORMAT_STRING )
         */
        readonly MOMENT_FORMAT_STRING: "YYYY-MM-DD";
        /**
         * This is a typical format of the date plus the time
         */
        readonly MOMENT_DATE_TIME: "YYYY-MM-DD HH:mm";
        /**
         * Pretty format used for report history items
         *
         * @example Jun 19, 2019 12:38 PM
         */
        readonly MOMENT_DATE_TIME_PRETTY: "MMM DD YYYY h:mma";
        /**
         * Date-time format, including timezone information, eg "2015-10-14T19:44:35+07:00"
         */
        readonly MOMENT_DATE_TIME_TIMEZONE: "YYYY-MM-DDTHH:mm:ssZ";
        /**
         * Moment formatting option for a date of this format "Jul 2, 2014"
         */
        readonly MOMENT_US_DATE: "MMM D, YYYY";
        /**
         * Moment formatting option for a date of this format "July 2, 2014"
         * ie, full month name
         */
        readonly MOMENT_US_DATE_LONG: "MMMM D, YYYY";
        /**
         * Moment formatting option for full month name and year as in "July 2015"
         */
        readonly MOMENT_US_MONTH_YEAR_LONG: "MMMM YYYY";
        /**
         * Difference between the local time and UTC time in ms
         */
        readonly TIMEZONE_OFFSET_MS: number;
        readonly SHORT_MONTH_SHORT_DAY: "MMM d";
        readonly LONG_YEAR_MONTH_DAY_24_TIME: "yyyy-MM-dd HH:mm:ss";
        readonly SHORT_MONTH_DAY_LOCAL_TIME: "MMM D [at] LT";
        readonly SHORT_MONTH_DAY_YEAR_LOCAL_TIME: "MMM D, YYYY [at] LT";
    };
    /**
     * Message used by the Func.die() exception
     */
    readonly FUNC_DIE_MESSAGE: "Aborting JavaScript execution";
    /**
     * Default for how long the email delivery failure NVP should be valid (in seconds)
     * Currently 14 days (14 * 24 * 60 * 60)
     *
     * WARNING ! UPDATE THE PHP CONSTANT VERSION WHEN UPDATING THIS ONE
     */
    readonly EMAIL_DELIVERY_FAILURE_VALIDITY: 1209600;
    /**
     * Bill Processing-related constants
     */
    readonly BILL_PROCESSING_PARTNER_NAME: "expensify.cash";
    readonly BILL_PROCESSING_EMAIL_DOMAIN: "expensify.cash";
    /**
     * Bank Import Logic Constants
     */
    readonly BANK_IMPORT: {
        readonly BANK_STATUS_BROKEN: 2;
    };
    /**
     * Bank Account Logic Constants
     */
    readonly BANK_ACCOUNT: {
        readonly VERIFICATION_MAX_ATTEMPTS: 7;
    };
    /**
     * Emails that the user shouldn't be interacting with from the front-end interface
     * Trying to add these emails as a delegate, onto a policy, or as an approver is considered invalid
     * Any changes here should be reflected in the PHP constant in web-expensify,
     * which is located in _constant.php and also named EXPENSIFY_EMAILS.
     * And should also be reflected in the constant in expensify/app,
     * which is located in src/CONST.js and also named EXPENSIFY_EMAILS.
     */
    readonly EXPENSIFY_EMAILS: readonly ["concierge@expensify.com", "help@expensify.com", "receipts@expensify.com", "chronos@expensify.com", "qa@expensify.com", "contributors@expensify.com", "firstresponders@expensify.com", "qa+travisreceipts@expensify.com", "bills@expensify.com", "studentambassadors@expensify.com", "accounting@expensify.com", "payroll@expensify.com", "svfg@expensify.com", "integrationtestingcreds@expensify.com", "admin@expensify.com", "notifications@expensify.com"];
    /**
     * Emails that the user shouldn't submit reports to nor share reports with
     * Any changes here should be reflected in the PHP constant,
     * which is located in _constant.php and also named INVALID_APPROVER_AND_SHAREE_EMAILS
     */
    readonly INVALID_APPROVER_AND_SHAREE_EMAILS: readonly ["concierge@expensify.com", "help@expensify.com", "receipts@expensify.com", "chronos@expensify.com", "qa@expensify.com", "contributors@expensify.com", "firstresponders@expensify.com", "qa+travisreceipts@expensify.com", "bills@expensify.com", "admin@expensify.com", "notifications@expensify.com"];
    /**
     * Smart scan-related constants
     */
    readonly SMART_SCAN: {
        readonly COST: 20;
        readonly FREE_NUMBER: 25;
    };
    readonly SMS: {
        readonly DOMAIN: "expensify.sms";
        readonly E164_REGEX: RegExp;
    };
    readonly PASSWORD_COMPLEXITY_REGEX_STRING: "^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$";
    readonly INTEGRATIONS: {
        /**
         * Constants that specify how to map (import) Integrations data to Expensify
         * Parallel to IntegrationEntityMappingTypeEnum in the IS
         */
        readonly DATA_MAPPING: {
            readonly NONE: "NONE";
            readonly TAG: "TAG";
            readonly REPORT_FIELD: "REPORT_FIELD";
            readonly DEFAULT: "DEFAULT";
        };
        readonly EXPORT_DATE: {
            readonly LAST_EXPENSE: "LAST_EXPENSE";
            readonly REPORT_EXPORTED: "REPORT_EXPORTED";
            readonly REPORT_SUBMITTED: "REPORT_SUBMITTED";
        };
        readonly XERO_HQ_CONNECTION_NAME: "xerohq";
        readonly EXPENSIFY_SYNC_MANAGER_VERSION: "23.0.802.0";
    };
    readonly INTEGRATION_TYPES: {
        readonly ACCOUNTING: "accounting";
        readonly HR: "hr";
    };
    readonly DIRECT_INTEGRATIONS: {
        readonly zenefits: {
            readonly value: "zenefits";
            readonly text: "Zenefits";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/zenefit.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/zenefit_gray.svg";
            readonly alert_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/zenefit_alert.svg";
            readonly types: readonly ["hr"];
            readonly isCorporateOnly: false;
        };
        readonly gusto: {
            readonly value: "gusto";
            readonly text: "Gusto";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/gusto.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/gusto_gray.svg";
            readonly alert_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/gusto_alert.svg";
            readonly types: readonly ["hr"];
            readonly isCorporateOnly: false;
        };
        readonly quickbooksOnline: {
            readonly value: "quickbooksOnline";
            readonly text: "QuickBooks Online";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/quickbooks.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/quickbooks_gray.svg";
            readonly alert_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/quickbooks_alert.svg";
            readonly types: readonly ["hr", "accounting"];
            readonly isCorporateOnly: false;
        };
        readonly xero: {
            readonly value: "xero";
            readonly text: "Xero";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/xero.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/xero_gray.svg";
            readonly alert_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/xero_alert.svg";
            readonly types: readonly ["accounting"];
            readonly isCorporateOnly: false;
        };
        readonly netsuite: {
            readonly value: "netsuite";
            readonly text: "NetSuite";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/netsuite.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/netsuite_gray.svg";
            readonly alert_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/netsuite_alert.svg";
            readonly types: readonly ["hr", "accounting"];
            readonly isCorporateOnly: true;
        };
        readonly quickbooksDesktop: {
            readonly value: "qbd";
            readonly text: "QuickBooks Desktop";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/quickbooks.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/quickbooks_gray.svg";
            readonly alert_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/quickbooks_alert.svg";
            readonly types: readonly ["accounting"];
            readonly isCorporateOnly: false;
        };
        readonly intacct: {
            readonly value: "intacct";
            readonly text: "Sage Intacct";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/sage.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/sage_gray.svg";
            readonly alert_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/sage_alert.svg";
            readonly types: readonly ["hr", "accounting"];
            readonly isCorporateOnly: true;
        };
        readonly financialforce: {
            readonly value: "financialforce";
            readonly text: "FinancialForce";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/financialforce.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/financialforce_gray.svg";
            readonly alert_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/financialforce_alert.svg";
            readonly types: readonly ["accounting"];
            readonly isCorporateOnly: true;
        };
    };
    readonly INDIRECT_INTEGRATIONS: {
        readonly microsoft_dynamics: {
            readonly value: "microsoft_dynamics";
            readonly text: "Microsoft Dynamics";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/microsoft_dynamics.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/microsoft_dynamics_gray.svg";
            readonly types: readonly ["accounting"];
            readonly isCorporateOnly: true;
        };
        readonly oracle: {
            readonly value: "oracle";
            readonly text: "Oracle";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/oracle.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/oracle_gray.svg";
            readonly types: readonly ["hr", "accounting"];
            readonly isCorporateOnly: true;
        };
        readonly sage: {
            readonly value: "sage";
            readonly text: "Sage";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/sage.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/sage_gray.svg";
            readonly types: readonly ["accounting"];
            readonly isCorporateOnly: true;
        };
        readonly sap: {
            readonly value: "sap";
            readonly text: "SAP";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/sap.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/sap_gray.svg";
            readonly types: readonly ["accounting"];
            readonly isCorporateOnly: true;
        };
        readonly myob: {
            readonly value: "myob";
            readonly text: "MYOB";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/myob.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/myob_gray.svg";
            readonly types: readonly ["accounting"];
            readonly isCorporateOnly: true;
        };
        readonly workday: {
            readonly value: "workday";
            readonly text: "Workday";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/workday.svg";
            readonly gray_image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/workday_gray.svg";
            readonly types: readonly ["hr"];
            readonly isCorporateOnly: true;
        };
        readonly adp: {
            readonly value: "adp";
            readonly text: "ADP";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/export-icons/adp.svg";
            readonly types: readonly ["hr"];
            readonly isCorporateOnly: true;
        };
        readonly generic_indirect_connection: {
            readonly value: "generic_indirect_connection";
            readonly text: "Other";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/accounting-other--blue.svg";
            readonly types: readonly ["hr", "accounting"];
        };
    };
    readonly DEFAULT_IS_TEMPLATES: {
        readonly default: {
            readonly value: "default_template";
            readonly text: "Basic Export";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/accounting-other--blue.svg";
        };
        readonly tag: {
            readonly value: "tag_template";
            readonly text: "Tag Export";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/accounting-other--blue.svg";
        };
        readonly category: {
            readonly value: "category_template";
            readonly text: "Category Export";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/accounting-other--blue.svg";
        };
        readonly detailed: {
            readonly value: "detailed_export";
            readonly text: "All Data - Expense Level Export";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/accounting-other--blue.svg";
        };
        readonly report: {
            readonly value: "report_level_export";
            readonly text: "All Data - Report Level Export";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/accounting-other--blue.svg";
        };
        readonly tax: {
            readonly value: "multiple_tax_export";
            readonly text: "Canadian Multiple Tax Export";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/accounting-other--blue.svg";
        };
        readonly perdiem: {
            readonly value: "per_diem_export";
            readonly text: "Per Diem Export";
            readonly image: "https://d2k5nsl2zxldvw.cloudfront.net/images/icons/accounting-other--blue.svg";
        };
    };
    readonly NVP: {
        readonly DISMISSED_VIOLATIONS: "dismissedViolations";
    };
    readonly FILESIZE: {
        readonly BYTES_IN_MEGABYTE: 1000000;
        readonly MAX: 10000000;
    };
    readonly PARTNER_NAMES: {
        readonly IPHONE: "iphone";
        readonly ANDROID: "android";
        readonly CHAT: "chat-expensify-com";
    };
    readonly LOGIN_TYPES: {
        readonly WEB: "login";
        readonly MOBILE: "device";
    };
    readonly EXPENSIFY_CARD: {
        readonly FEED_NAME: "Expensify Card";
        readonly FRAUD_STATES: {
            readonly NONE: 0;
            readonly DOMAIN_CARDS_REIMBURSEMENTS_INVESTIGATION: 1;
            readonly DOMAIN_CARDS_RAPID_INCREASE_INVESTIGATION: 2;
            readonly DOMAIN_CARDS_RAPID_INCREASE_CLEARED: 3;
            readonly DOMAIN_CARDS_RAPID_INCREASE_CONFIRMED: 4;
            readonly INDIVIDUAL_CARD_RAPID_INCREASE_INVESTIGATION: 5;
            readonly INDIVIDUAL_CARD_RAPID_INCREASE_CLEARED: 6;
            readonly INDIVIDUAL_CARD_RAPID_INCREASE_CONFIRMED: 7;
            readonly SUSPICIOUS_PAN_ENTRY: 8;
            readonly SUSPICIOUS_PAN_ENTRY_CLEARED: 9;
            readonly SUSPICIOUS_PAN_ENTRY_CONFIRMED: 10;
        };
    };
    readonly TRAVEL_BOOKING: {
        readonly OPTIONS: {
            readonly shortFlightFare: {
                readonly economy: "Economy";
                readonly premiumEconomy: "Premium Economy";
                readonly business: "Business";
                readonly first: "First";
            };
            readonly longFlightFare: {
                readonly economy: "Economy";
                readonly premiumEconomy: "Premium Economy";
                readonly business: "Business";
                readonly first: "First";
            };
            readonly hotelStar: {
                readonly oneStar: "1";
                readonly twoStars: "2";
                readonly threeStars: "3";
                readonly fourStars: "4";
                readonly fiveStars: "5";
            };
        };
        readonly DEFAULT_OPTIONS: {
            readonly shortFlightFare: "economy";
            readonly longFlightFare: "economy";
            readonly hotelStar: "fourStars";
        };
    };
    readonly EXPENSIFY_DOMAINS: readonly ["expensify.com", "expensifail.com", "expensicorp.com"];
    readonly SUBSCRIPTION_CHANGE_REASONS: {
        readonly TOO_LIMITED: {
            readonly id: "tooLimited";
            readonly label: "Functionality needs improvement";
            readonly prompt: "What software are you migrating to and what led to this decision?";
        };
        readonly TOO_EXPENSIVE: {
            readonly id: "tooExpensive";
            readonly label: "Too expensive";
            readonly prompt: "What software are you migrating to and what led to this decision?";
        };
        readonly INADEQUATE_SUPPORT: {
            readonly id: "inadequateSupport";
            readonly label: "Inadequate customer support";
            readonly prompt: "What software are you migrating to and what led to this decision?";
        };
        readonly BUSINESS_CLOSING: {
            readonly id: "businessClosing";
            readonly label: "Company closing, downsizing, or acquired";
            readonly prompt: "What software are you migrating to and what led to this decision?";
        };
    };
};
/**
 * UI Constants
 */
export declare const UI: {
    readonly ICON: {
        readonly DELETE: "trashcan";
        readonly CAR: "car";
        readonly CASH: "cash";
        readonly MANAGED_CARD: "corporate-card";
        readonly CARD: "credit-card";
        readonly CLOCK: "time";
        readonly PER_DIEM: "per-diem";
        readonly PENDING_CARD: "card-transaction-pending";
        readonly CSV_UPLOAD: "csv-upload";
        readonly PENDING_CREDIT_CARD: "credit-card-pending";
    };
    readonly spinnerDIV: "<div class=\"spinner\"></div>";
    readonly spinnerSmallDIV: "<div class=\"spinner spinner-small\"></div>";
    readonly spinnerLargeDIV: "<div class=\"spinner spinner-large\"></div>";
    readonly spinnerClass: "view_spinner";
    readonly SPINNER: "spinner";
    readonly imageURLPrefix: "https://d2k5nsl2zxldvw.cloudfront.net/images/";
    readonly ACTIVE: "active";
    readonly ERROR: "error";
    readonly HIDDEN: "hidden";
    readonly INVISIBLE: "invisible";
    readonly DEPRECIATED: "depreciated";
    readonly DISABLED: "disabled";
    readonly REQUIRED: "required";
    readonly SELECT_DEFAULT: "###";
    readonly SELECTED: "selected";
    readonly QR_CODE: "js_qrCode";
    readonly DIALOG_Z_INDEX: 4000;
};
export declare const PUBLIC_DOMAINS: readonly ["accountant.com", "afis.ch", "aol.com", "artlover.com", "asia.com", "att.net", "bellsouth.net", "bills.expensify.com", "btinternet.com", "cheerful.com", "chromeexpensify.com", "comcast.net", "consultant.com", "contractor.com", "cox.net", "cpa.com", "cryptohistoryprice.com", "dr.com", "email.com", "engineer.com", "europe.com", "evernote.user", "execs.com", "expensify.cash", "expensify.sms", "gmail.com", "gmail.con", "googlemail.com", "hey.com", "hotmail.co.uk", "hotmail.com", "hotmail.fr", "hotmail.it", "icloud.com", "iname.com", "jeeviess.com", "live.com", "mac.com", "mail.com", "mail.ru", "mailfence.com", "me.com", "msn.com", "musician.org", "myself.com", "outlook.com", "pm.me", "post.com", "privaterelay.appleid.com", "proton.me", "protonmail.ch", "protonmail.com", "qq.com", "rigl.ch", "sasktel.net", "sbcglobal.net", "spacehotline.com", "tafmail.com", "techie.com", "usa.com", "verizon.net", "vomoto.com", "wolfandcranebar.tech", "workmail.com", "writeme.com", "yahoo.ca", "yahoo.co.in", "yahoo.co.uk", "yahoo.com", "yahoo.com.br", "ymail.com"];
