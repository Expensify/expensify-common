/* eslint-disable no-control-regex */
import _ from 'underscore';
import {AllHtmlEntities} from 'html-entities';
import replaceAll from 'string.prototype.replaceall';
import {CONST} from './CONST';
import {URL_REGEX} from './Url';

const REMOVE_SMS_DOMAIN_PATTERN = new RegExp(`@${CONST.SMS.DOMAIN}`, 'gi');

const Str = {

    /**
     * Return true if the string is ending with the provided suffix
     *
     * @param {String} str String ot search in
     * @param {String} suffix What to look for
     * @return {Boolean}
     */
    endsWith(str, suffix) {
        if (!str || !suffix) {
            return false;
        }
        return str.substr(-suffix.length) === suffix;
    },

    /**
     * Converts a USD string into th number of cents it represents.
     *
     * @param {String}  amountStr     A string representing a USD value.
     * @param {Boolean} allowFraction Flag indicating if fractions of cents should be
     *                               allowed in the output.
     *
     * @return {Number} The cent value of the @p amountStr.
     */
    fromUSDToNumber(amountStr, allowFraction) {
        let amount = String(amountStr).replace(/[^\d.\-()]+/g, '');
        if (amount.match(/\(.*\)/)) {
            const modifiedAmount = amount.replace(/[()]/g, '');
            amount = `-${modifiedAmount}`;
        }
        amount = Number(amount) * 100;

        // We round it here to a precision of 3 because some floating point numbers, when multiplied by 100
        // don't give us a very pretty result. Try this in the JS console:
        // 0.678 * 100
        // 67.80000000000001
        // 0.679 * 100
        // 67.9
        amount = Math.round(amount * 1e3) / 1e3;
        return allowFraction ? amount : Math.round(amount);
    },

    /**
     * Truncates the middle section of a string based on the max allowed length
     * @param {string} fullStr
     * @param {int}    maxLength
     * @returns {string}
     */
    truncateInMiddle(fullStr, maxLength) {
        if (fullStr.length <= maxLength) {
            return fullStr;
        }

        const separator = '...';
        const halfLengthToShow = (maxLength - separator.length) / 2;
        const beginning = fullStr.substr(0, Math.ceil(halfLengthToShow));
        const end = fullStr.substr(fullStr.length - Math.floor(halfLengthToShow));

        return beginning + separator + end;
    },

    /**
     * Convert new line to <br />
     *
     * @param {String} str
     * @returns {string}
     */
    nl2br(str) {
        return str.replace(/\n/g, '<br />');
    },

    /**
     * Decodes the given HTML encoded string.
     *
     * @param {String} s The string to decode.
     * @return {String} The decoded string.
     */
    htmlDecode(s) {
        // Use jQuery if it exists or else use html-entities
        if (typeof jQuery !== 'undefined') {
            return jQuery('<textarea/>').html(s).text();
        }
        return AllHtmlEntities.decode(s);
    },

    /**
     * HTML encodes the given string.
     *
     * @param {String} s The string to encode.
     * @return {String} @p s HTML encoded.
     */
    htmlEncode(s) {
        // Use jQuery if it exists or else use html-entities
        if (typeof jQuery !== 'undefined') {
            return jQuery('<textarea/>').text(s).html();
        }
        return AllHtmlEntities.encode(s);
    },

    /**
     * Escape text while preventing any sort of double escape, so 'X & Y' -> 'X &amp; Y' and 'X &amp; Y' -> 'X &amp; Y'
     *
     * @param {String} s the string to escape
     * @return {String} the escaped string
     */
    safeEscape(s) {
        return _.escape(_.unescape(s));
    },

    /**
     * HTML encoding insensitive equals.
     *
     * @param {String} first string to compare
     * @param {String} second string to compare
     * @return {Boolean} true when first === second, ignoring HTML encoding
     */
    htmlEncodingInsensitiveEquals(first, second) {
        return first === second
            || this.htmlDecode(first) === second
            || this.htmlEncode(first) === second;
    },

    /**
     * Creates an ID that can be used as an HTML attribute from @p str.
     *
     * @param {String} str A string to create an ID from.
     * @return {String} The ID string made from @p str.
     */
    makeID(str) {
        const modifiedString = String(str).replace(/[^A-Za-z0-9]/g, '_').toUpperCase();
        return `id_${modifiedString}`;
    },

    /**
     * Extracts an ID made with Str.makeID from a larger string.
     *
     * @param {String} str A string containing an id made with Str.makeID
     * @return {String|null} The ID string.
     */
    extractID(str) {
        const matches = str.match(/id[A-Z0-9_]+/);
        return matches.length > 0 ? matches[0] : null;
    },

    /**
     * Modifies the string so the first letter of each word is capitalized and the
     * rest lowercased.
     *
     * @param {String} val The string to modify
     * @return {String}
     */
    recapitalize(val) {
        // First replace every letter with its lowercase equivalent
        // Cast to string.
        let str = String(val);
        if (str.length <= 0) {
            return str;
        }
        str = str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();

        function recap_callback(t, a, b) {
            return a + b.toUpperCase();
        }
        return str.replace(

            // **NOTE: Match to _libfop.php
            new RegExp('([^A-Za-z\'.0-9])([a-z])', 'g'),
            recap_callback,
        );
    },

    /**
     * Replace all the non alphanumerical character by _
     *
     * @param {String} input
     * @returns {String}
     */
    sanitizeToAlphaNumeric(input) {
        return String(input).replace(/[^\d\w]/g, '_');
    },

    /**
     * Strip out all the non numerical characters
     *
     * @param {String} input
     * @returns {String}
     */
    stripNonNumeric(input) {
        return String(input).replace(/[^\d]/g, '');
    },

    /**
     * Strips all non ascii characters from a string
     * @param {String} input
     * @returns {String} The ascii version of the string.
     */
    stripNonASCIICharacters(input) {
        return String(input).replace(/[\u0000-\u0019\u0080-\uffff]/g, '');
    },

    /**
     * Shortens the @p text to @p length and appends an ellipses to it.
     *
     * The ellipses will only be appended if @p text is longer than the @p length
     * given.
     *
     * @param {String} val   The string to reduce in size.
     * @param {Number} length The maximal length desired.
     * @return {String} The shortened @p text.
     */
    shortenText(val, length) {
        // Remove extra spaces because they don't show up in html anyway.
        const text = String(val).replace(/\s+/g, ' ');
        const truncatedText = text.substr(0, length - 3);
        return (text.length > length ? `${truncatedText}...` : text);
    },

    /**
     * Returns the byte size of a character
     * @param {String} inputChar You can input more than one character, but it will only return the size of the first
     * one.
     * @returns {Number} Byte size of the character
     */
    getRawByteSize(inputChar) {
        const onlyChar = String(inputChar);
        const c = onlyChar.charCodeAt();

        // If we are grabbing the byte size, we need to temporarily diable no-bitwise for linting
        /* eslint-disable no-bitwise */
        if (c < (1 << 7)) {
            return 1;
        }
        if (c < (1 << 11)) {
            return 2;
        }
        if (c < (1 << 16)) {
            return 3;
        }
        if (c < (1 << 21)) {
            return 4;
        }
        if (c < (1 << 26)) {
            return 5;
        }
        if (c < (1 << 31)) {
            return 6;
        }
        /* eslint-enable no-bitwise */
        return Number.NaN;
    },

    /**
     * Gets the length of a string in bytes, including non-ASCII characters
     * @param {String} input
     * @returns {Number} The number of bytes used by string
     */
    getByteLength(input) {
        // Force string type
        const stringInput = String(input);
        let byteLength = 0;
        for (let i = 0; i < stringInput.length; i++) {
            byteLength += this.getRawByteSize(stringInput[i]);
        }
        return byteLength;
    },

    /**
     * Shortens the input by max byte size instead of by character length
     * @param {String} input
     * @param {Number} maxSize The max size in bytes, e.g. 256
     * @returns {String} Returns a shorted input if the input size exceeds the max
     */
    shortenByByte(input, maxSize) {
        const stringInput = String(input);
        let totalByteLength = 0;
        for (let i = 0; i < stringInput.length; i++) {
            const charByteSize = this.getRawByteSize(stringInput[i]);
            if ((charByteSize + totalByteLength) > maxSize) {
                // If the next character exceeds the limit, stop and return the truncated string.
                return `${stringInput.substr(0, i - 3)}...`;
            }
            totalByteLength += charByteSize;
        }
        return stringInput;
    },

    /**
     * Returns true if the haystack begins with the needle
     *
     * @param {String} haystack  The full string to be searched
     * @param {String} needle    The case-sensitive string to search for
     * @return {Boolean} Retruns true if the haystack starts with the needle.
     */
    startsWith(haystack, needle) {
        return this.isString(haystack)
            && this.isString(needle)
            && haystack.substring(0, needle.length) === needle;
    },

    /**
     * Gets the textual value of the given string.
     *
     * @param {String} str The string to fetch the text value from.
     * @return {String} The text from within the HTML string.
     */
    stripHTML(str) {
        if (!this.isString(str)) {
            return '';
        }

        return str.replace(/<[^>]*>?/gm, '');
    },

    /**
     * Modifies the string so the first letter of the string is capitalized
     *
     * @param {String} str The string to modify.
     * @return {String} The recapitalized string.
     */
    UCFirst(str) {
        return str.substr(0, 1).toUpperCase() + str.substr(1);
    },

    /**
     * Returns a string containing all the characters str from the beginning
     * of str to the first occurrence of substr.
     * Example: Str.cutAfter( 'hello$%world', '$%' ) // returns 'hello'
     *
     * @param {String} str The string to modify.
     * @param {String} substr The substring to search for.
     * @return {String} The cut/trimmed string.
     */
    cutAfter(str, substr) {
        const index = str.indexOf(substr);
        if (index !== -1) {
            return str.substring(0, index);
        }
        return str;
    },

    /**
     * Returns a string containing all the characters str from after the first
     * occurrence of substr to the end of the string.
     * Example: Str.cutBefore( 'hello$%world', '$%' ) // returns 'world'
     *
     * @param {String} str The string to modify.
     * @param {String} substr The substring to search for.
     * @return {String} The cut/trimmed string.
     */
    cutBefore(str, substr) {
        const index = str.indexOf(substr);
        if (index !== -1) {
            return str.substring(index + substr.length);
        }
        return str;
    },

    /**
     * Checks that the string is a domain name (e.g. example.com)
     *
     * @param {String} string The string to check for domainnameness.
     *
     * @returns {Boolean} True iff the string is a domain name
     */
    isValidDomainName(string) {
        return Boolean(String(string).match(CONST.REG_EXP.DOMAIN));
    },

    /**
     * Checks that the string is a valid url
     *
     * @param {String} string
     *
     * @returns {Boolean} True if the string is a valid hyperlink
     */
    isValidURL(string) {
        return Boolean(String(string).match(CONST.REG_EXP.HYPERLINK));
    },

    /**
     * Checks that the string is an email address.
     * NOTE: TLDs are not just 2-4 characters. Keep this in sync with _inputrules.php
     *
     * @param {String} string The string to check for email validity.
     *
     * @returns {Boolean} True iff the string is an email
     */
    isValidEmail(string) {
        return Boolean(String(string).match(CONST.REG_EXP.EMAIL));
    },

    /**
     * Checks if the string is an valid email address formed during comment markdown formation.
     *
     * @param {String} string The string to check for email validity.
     *
     * @returns {Boolean} True if the string is an valid email created by comment markdown.
     */
    isValidEmailMarkdown(string) {
        return Boolean(String(string).match(`^${CONST.REG_EXP.MARKDOWN_EMAIL}$`));
    },

    /**
     * Remove trailing comma from a string.
     *
     * @param {String} string The string with any trailing comma to be removed.
     *
     * @returns {String} string with the trailing comma removed
     */
    removeTrailingComma(string) {
        return string.trim().replace(/(,$)/g, '');
    },

    /**
     * Checks that the string is a list of coma separated email addresss.
     *
     * @param {String} str The string to check for emails validity.
     *
     * @returns {Boolean} True if all emails are valid or if input is empty
     */
    areValidEmails(str) {
        const string = this.removeTrailingComma(str);
        if (string === '') {
            return true;
        }

        const emails = string.split(',');
        let result = true;
        for (let i = 0; i < emails.length; i += 1) {
            if (!this.isValidEmail(emails[i].trim())) {
                result = false;
            }
        }
        return result;
    },

    /**
     * Extract the email addresses from a string
     *
     * @param {String} string
     * @returns {String[]|null}
     */
    extractEmail(string) {
        return String(string).match(CONST.REG_EXP.EMAIL_SEARCH);
    },

    /**
     * Extracts the domain name from the given email address
     * (e.g. "domain.com" for "joe@domain.com").
     *
     * @param {String} email The email address.
     *
     * @returns {String} The domain name in the email address.
     */
    extractEmailDomain(email) {
        return this.cutBefore(email, '@');
    },

    /**
     * Tries to extract the company name from the given email address
     * (e.g. "yelp" for "joe@yelp.co.uk").
     *
     * @param {String} email The email address.
     *
     * @returns {String} The company name in the email address or null.
     */
    extractCompanyNameFromEmailDomain(email) {
        const domain = this.extractEmailDomain(email);
        if (!domain) {
            return null;
        }

        const domainParts = domain.split('.');
        if (!domainParts.length) {
            return null;
        }

        return domainParts[0];
    },

    /**
     * Extracts the local part from the given email address
     * (e.g. "joe" for "joe@domain.com").
     *
     * @param {String} email The email address.
     *
     * @returns {String} The local part in the email address.
     */
    extractEmailLocalPart(email) {
        return this.cutAfter(email, '@');
    },

    /**
     * Sanitize phone number to return only numbers. Return null if non valid phone number.
     *
     * @param {String} str
     * @returns {String|null}
     */
    sanitizePhoneNumber(str) {
        const string = str.replace(/(?!^\+)\D/g, '');
        return string.length <= 15 && string.length >= 10 ? string : null;
    },

    /**
     * Sanitize email. Return null if non valid email.
     *
     * @param {String} str
     * @returns {String|null}
     */
    sanitizeEmail(str) {
        const string = str.toLowerCase().trim();
        return CONST.REG_EXP.EMAIL.test(string) ? string : null;
    },

    /**
     * Escapes all special RegExp characters from a string
     *
     * @param {String} string The subject
     *
     * @returns {String} The escaped string
     */
    escapeForRegExp(string) {
        return string.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    },

    /**
     * Escapes all special RegExp characters from a string except for the period
     *
     * @param {String} string The subject
     * @returns {String} The escaped string
     */
    escapeForExpenseRule(string) {
        return string.replace(/[-[\]/{}()*+?\\^$|]/g, '\\$&');
    },

    /**
     * Adds a backslash in front of each of colon
     * if they don't already have a backslash in front of them
     *
     * @param {String} string The subject
     * @returns {String} The escaped string
     */
    addBackslashBeforeColonsForTagNamesComingFromQBD(string) {
        return string.replace(/([^\\]):/g, '$1\\:');
    },

    /**
     * Removes backslashes from string
     * eg: myString\[\]\* -> myString[]*
     *
     * @param {String} string
     * @returns {String}
     */
    stripBackslashes(string) {
        return string.replace(/\\/g, '');
    },

    /**
     * Checks if a string's length is in the specified range
     *
     * @param {String} string The subject
     * @param {Number} minimumLength
     * @param {Number} [maximumLength]
     *
     * @returns {Boolean} true if the length is in the range, false otherwise
     */
    isOfLength(string, minimumLength, maximumLength) {
        if (!this.isString(string)) {
            return false;
        }
        if (string.length < minimumLength) {
            return false;
        }
        if (!this.isUndefined(maximumLength) && string.length > maximumLength) {
            return false;
        }
        return true;
    },

    /**
     * Count the number of occurences of needle in haystack.
     * This is faster than counting the results of haystack.match( /needle/g )
     * via http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
     *
     * @param {String} haystack The string to look inside of
     * @param {String} needle What we're looking for
     * @param {Boolean} allowOverlapping Defaults to false
     *
     * @returns {Integer} The number of times needle is in haystack.
     */
    occurences(haystack, needle, allowOverlapping) {
        let count = 0;
        let pos = 0;

        // Force strings for input
        const haystackStr = String(haystack);
        const needleStr = String(needle);

        if (needleStr.length <= 0) {
            return haystackStr.length + 1;
        }

        const step = (allowOverlapping) ? (1) : (needleStr.length);

        while (pos >= 0) {
            pos = haystackStr.indexOf(needleStr, pos);
            if (pos >= 0) {
                count += 1;
                pos += step;
            }
        }
        return (count);
    },

    /**
     * Uppercases the first letter of each word
     * via https://github.com/kvz/phpjs/blob/master/functions/strings/ucwords.js
     *
     * @param   {String}  str to uppercase words
     * @returns {String}  Uppercase worded string
     */
    ucwords(str) {
        return (String(str)).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g,
            $1 => $1.toUpperCase());
    },

    /**
     * Returns true if the haystack contains the needle
     *
     * @param {String} haystack The full string to be searched
     * @param {String} needle The case-sensitive string to search for
     *
     * @return {Boolean} Retruns true if the haystack contains the needle
     */
    contains(haystack, needle) {
        return haystack.indexOf(needle) !== -1;
    },

    /**
     * Returns true if the haystack contains the needle, ignoring case
     *
     * @param {String} haystack The full string to be searched
     * @param {String} needle The case-insensitive string to search for
     *
     * @return {Boolean} Retruns true if the haystack contains the needle, ignoring case
     */
    caseInsensitiveContains(haystack, needle) {
        return this.contains(haystack.toLowerCase(), needle.toLowerCase());
    },

    /**
     * Case insensitive compare function
     *
     * @param {String} string1 string to compare
     * @param {String} string2 string to compare
     *
     * @return {Number} -1 if first string < second string
     *                   1 if first string > second string
     *                   0 if first string = second string
     */
    caseInsensitiveCompare(string1, string2) {
        const lowerCase1 = string1.toLocaleLowerCase();
        const lowerCase2 = string2.toLocaleLowerCase();

        return this.compare(lowerCase1, lowerCase2);
    },

    /**
     * Case insensitive equals
     *
     * @param {String} first string to compare
     * @param {String} second string to compare
     * @return {Boolean} true when first == second except for case
     */
    caseInsensitiveEquals(first, second) {
        return this.caseInsensitiveCompare(first, second) === 0;
    },

    /**
     * Compare function
     *
     * @param {String} string1 string to compare
     * @param {String} string2 string to compare
     *
     * @return {Number} -1 if first string < second string
     *                   1 if first string > second string
     *                   0 if first string = second string
     */
    compare(string1, string2) {
        if (string1 < string2) {
            return -1;
        } if (string1 > string2) {
            return 1;
        }
        return 0;
    },

    /**
     * Check if a file extension is supported by SmartReports
     * @param  {String}  filename
     * @return {Boolean}
     */
    isFileExtensionSmartReportsValid(filename) {
        // Allowed extensions. Make sure to keep them in sync with those defined
        // in SmartReport_Utils::templateFileUploadCheck()
        const allowedExtensions = ['xls', 'xlsx', 'xlsm', 'xltm'];
        const extension = filename.split('.').pop().toLowerCase();
        return allowedExtensions.indexOf(extension) > -1;
    },

    /**
     * Mask Permanent Account Number (PAN) the same way Auth does
     * @param {Number|String} number account number
     * @return {String} masked account number
     */
    maskPAN(number) {
        // cast to string
        const accountNumber = String(number);
        const len = accountNumber.length;

        // Hide these numbers completely
        // We should not be getting account numbers this small or large
        if (len < 6 || len > 20) {
            return this.maskFirstNCharacters(accountNumber, len, 'X');
        }

        // Can show last 4
        if (len < 14) {
            return this.maskFirstNCharacters(accountNumber, len - 4, 'X');
        }

        // Can show first 6 and last 4
        const first = accountNumber.substr(0, 6);
        const last = accountNumber.substr(7);
        const masked = this.maskFirstNCharacters(last, len - 11, 'X');
        return `${first}${masked}`;
    },

    /**
     * Checks if something is a string
     * Stolen from underscore
     * @param  {Mixed} obj
     * @return {Boolean}
     */
    isString(obj) {
        return this.isTypeOf(obj, 'String');
    },

    /**
     * Checks if something is a number
     * Stolen from underscore
     * @param  {Mixed} obj
     * @return {Boolean}
     */
    isNumber(obj) {
        return this.isTypeOf(obj, 'Number');
    },

    /**
     * Checks if something is a certain type
     * Stolen from underscore
     * @param  {Mixed} obj
     * @param  {String} type one of ['Arguments', 'Function', 'String', 'Number', 'Date',
     *                       'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet']
     * @return {Boolean}
     */
    isTypeOf(obj, type) {
        return Object.prototype.toString.call(obj) === `[object ${type}]`;
    },

    /**
     * Checks to see if something is undefined
     * Stolen from underscore
     * @param  {Mixed} obj
     * @return {Boolean}
     */
    isUndefined(obj) {
        // eslint-disable-next-line no-void
        return obj === void 0;
    },

    /**
     * Replace first N characters of the string with maskChar
     * eg: maskFirstNCharacters( '1234567890', 6, 'X' ) yields XXXXXX7890
     * @param {String} str string to mask
     * @param {Number} n number of characters we want to mask from the string
     * @param {String} mask string we want replace the first N chars with
     * @return {String} masked string
     */
    maskFirstNCharacters(str, n, mask) {
        // if str is empty, str or mask aren't strings,
        // or n is not a number, do nothing
        if (!this.isString(str) || !this.isString(mask)
            || str.length === 0 || !this.isNumber(n)) {
            return str;
        }

        return str.substring(0, n).replace(/./g, mask) + str.substring(n);
    },

    /**
     * Trim a string
     *
     * @param {String} str
     * @returns {string}
     */
    trim(str) {
        return $.trim(str);
    },

    /**
     * Convert a percentage string like '25%' to 25/
     * @param {String} percentageString The percentage as a string
     * @returns {Number}
     */
    percentageStringToNumber(percentageString) {
        return Number(this.cutAfter(percentageString, '%'));
    },

    /**
     * Remoce all the spaces from a string
     * @param {string} input
     * @returns {string}
     */
    removeSpaces(input) {
        return String(input).replace(' ', '');
    },

    /**
     * Returns the proper phrase depending on the count that is passed.
     * Example:
     * console.log(Str.pluralize('puppy', 'puppies', 1)); // puppy
     * console.log(Str.pluralize('puppy', 'puppies', 3)); // puppies
     *
     * @param {String} singular form of the phrase
     * @param {String} plural form of the phrase
     * @param {Number} n the count which determines the plurality
     *
     * @return {String}
     */
    pluralize(singular, plural, n) {
        if (!n || n > 1) {
            return plural;
        }
        return singular;
    },

    /**
     * Returns whether or not a string is an encrypted number or not.
     *
     * @param {String} number that we want to see if its encrypted or not
     *
     * @return {Boolean} Whether or not this string is an encrpypted number
     */
    isEncryptedCardNumber(number) {
        // Older encrypted versioning.
        if (/^[\da-fA-F]+$/.test(number)) {
            return number.length % 32 === 0;
        }

        // Check with the new versioning.
        if (/^[vV][\d]+:[\da-fA-F]+$/.test(number)) {
            return number.split(':')[1].length % 32 === 0;
        }

        return false;
    },

    /**
     * Converts a value to boolean, case-insensitive.
     * @param {mixed} value
     * @return {Boolean}
     */
    toBool(value) {
        if (this.isString(value)) {
            return value.toLowerCase() === 'true';
        }
        return Boolean(value);
    },

    /**
     * Checks if a string could be the masked version of another one.
     *
     * @param {String} first string to compare
     * @param {String} second string to compare
     * @param {String} [mask] defaults to X
     * @return {Boolean} true when first could be the masked version of second
     */
    maskedEquals(first, second, mask) {
        const firsts = first.match(/.{1,1}/g);
        const seconds = second.match(/.{1,1}/g);
        const defaultMask = mask || 'X';

        if (firsts.length !== seconds.length) {
            return false;
        }

        for (let i = 0; i < firsts.length; i += 1) {
            if (firsts[i] !== seconds[i]
                && firsts[i] !== defaultMask
                && seconds[i] !== defaultMask) {
                return false;
            }
        }

        return true;
    },

    /**
     * Bold any word matching the regexp in the text.
     * @param {string} text, htmlEncoded
     * @param {RegExp} regexp
     * @return {string}
     */
    boldify(text, regexp) {
        return text.replace(regexp, '<strong>$1</strong>');
    },

    /**
     * Check for whether a phone number is valid.
     * @param {String} phone
     *
     * @return {bool}
     */
    isValidPhone(phone) {
        return CONST.SMS.E164_REGEX.test(phone);
    },

    /**
     * We validate mentions by checking if it's first character is an allowed character
     * and by checking that we make sure it isn't inside other tags where mentions aren't allowed.
     * For example, *@username@expensify.com* is a valid mention because we allow bold styling for it,
     * but `@username@expensify.com` is not because we do not allow mentions within code
     *
     * @param {String} mention
     * @returns {bool}
     */
    isValidMention(mention) {
        // A valid mention starts with a space, *, _, #, ', ", or @ (with no preceding characters).
        const startsWithValidChar = /[\s*~_#'"@]/g.test(mention.charAt(0));

        // We don't support mention inside code or codefence styling,
        // for example using `@username@expensify.com` or ```@username@expensify.com``` will be invalid.
        const containsInvalidTag = /(<code>|<pre>|&#x60;)/g.test(mention);
        return startsWithValidChar && !containsInvalidTag;
    },

    /**
     * Returns text without our SMS domain
     *
     * @param {String} text
     * @return {String}
     */
    removeSMSDomain(text) {
        return text.replace(REMOVE_SMS_DOMAIN_PATTERN, '');
    },

    /**
     * Returns true if the text is a valid phone number with our SMS domain removed
     *
     * @param {String} text
     * @return {String}
     */
    isSMSLogin(text) {
        return this.isValidPhone(this.removeSMSDomain(text));
    },

    /**
     * This method will return all matches of a single regex like preg_match_all() in PHP. This is not a common part of
     * JS yet, so this is a good way of doing it according to
     * https://github.com/airbnb/javascript/issues/1439#issuecomment-306297399 and doesn't get us in trouble with
     * linting rules.
     *
     * @param {String} str
     * @param {RegExp} regex
     *
     * @returns {Array}
     */
    matchAll(str, regex) {
        const matches = [];
        str.replace(regex, (...args) => {
            const match = Array.prototype.slice.call(args, 0, -2);
            match.input = args[args.length - 1];
            match.index = args[args.length - 2];
            matches.push(match);
        });
        return matches;
    },

    /**
     * A simple GUID generator taken from https://stackoverflow.com/a/32760401/9114791
     *
     * @param {String} [prefix] an optional prefix to put in front of the guid
     * @returns {String}
     */
    guid(prefix = '') {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return `${prefix}${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
    },

    /**
     * Takes in a URL and returns it with a leading '/'
     *
     * @param {mixed} url The URL to be formatted
     * @returns {String} The formatted URL
     */
    normalizeUrl(url) {
        return (typeof url === 'string' && url.startsWith('/')) ? url : `/${url}`;
    },

    /**
     *  * Formats a URL by converting the domain name to lowercase and adding the missing 'https://' protocol.
     *
     * @param {url} url The URL to be formatted
     * @returns {String} The formatted URL
     */
    sanitizeURL(url) {
        const regex = new RegExp(`^${URL_REGEX}$`, 'i');
        const match = regex.exec(url);
        if (!match) {
            return url;
        }
        const website = match[3] ? match[2] : `https://${match[2]}`;
        return website.toLowerCase() + this.cutBefore(match[1], match[2]);
    },

    /**
     * Checks if parameter is a string or function
     * if it is a function then we will call it with
     * any additional arguments.
     *
     * @param {String|Function} parameter
     * @returns {String}
     */
    result(parameter, ...args) {
        return _.isFunction(parameter)
            ? parameter(...args)
            : parameter;
    },

    /**
     * Get file extension for a given url with or
     * without query parameters
     *
     * @param {String} url
     * @returns {String}
     */
    getExtension(url) {
        return _.first(_.last(url.split('.')).split('?')).toLowerCase();
    },

    /**
     * Takes in a URL and checks if the file extension is PDF
     *
     * @param {String} url The URL to be checked
     * @returns {Boolean} Whether file path is PDF or not
     */
    isPDF(url) {
        return this.getExtension(url) === 'pdf';
    },

    /**
     * Takes in a URL and checks if the file extension is an image
     * that can be rendered by React Native. Do NOT add extensions
     * to this list unless they appear in this list and are
     * supported by all platforms.
     *
     * https://reactnative.dev/docs/image#source
     *
     * @param {String} url
     * @returns {Boolean}
     */
    isImage(url) {
        return _.contains(['jpeg', 'jpg', 'gif', 'png', 'bmp', 'webp'], this.getExtension(url));
    },

    /**
     * Checks whether the given string is a +@ domain email account, such as
     * +@domain.com
     *
     * @param {String} email
     * @return {Boolean} True if is a domain account email, otherwise false.
     */
    isDomainEmail(email) {
        return this.startsWith(email, '+@');
    },

    /**
     * Polyfill for String.prototype.replaceAll
     *
     * @param {String} text
     * @param {String|RegExp} searchValue
     * @param {String|Function} replaceValue
     * @returns {String}
     */
    replaceAll(text, searchValue, replaceValue) {
        return replaceAll(text, searchValue, replaceValue);
    },
};

export default Str;
