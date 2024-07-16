/* eslint-disable no-control-regex */
import {parsePhoneNumber} from 'awesome-phonenumber';
import * as HtmlEntities from 'html-entities';
import * as Constants from './CONST';
import * as UrlPatterns from './Url';
import * as Utils from './utils';

const REMOVE_SMS_DOMAIN_PATTERN = /@expensify\.sms/gi;

/**
 * Checks if parameter is a string or function
 * if it is a function then we will call it with
 * any additional arguments.
 */
function resultFn(parameter: string): string;
function resultFn<R, A extends unknown[]>(parameter: (...args: A) => R, ...args: A): R;
function resultFn<R, A extends unknown[]>(parameter: string | ((...a: A) => R), ...args: A): string | R {
    if (typeof parameter === 'function') {
        return parameter(...args);
    }

    return parameter;
}

const Str = {
    /**
     * Return true if the string is ending with the provided suffix
     *
     * @param str String ot search in
     * @param suffix What to look for
     */
    endsWith(str: string, suffix: string): boolean {
        if (!str || !suffix) {
            return false;
        }
        return str.substr(-suffix.length) === suffix;
    },

    /**
     * Converts a USD string into th number of cents it represents.
     *
     * @param amountStr A string representing a USD value.
     * @param allowFraction Flag indicating if fractions of cents should be
     *                               allowed in the output.
     *
     * @returns The cent value of the @p amountStr.
     */
    fromUSDToNumber(amountStr: string, allowFraction: boolean): number {
        let amount: string | number = String(amountStr).replace(/[^\d.\-()]+/g, '');
        if (amount.match(/\(.*\)/)) {
            const modifiedAmount = amount.replace(/[()]/g, '');
            amount = `-${modifiedAmount}`;
        }
        amount = Number(amount) * 100;

        amount = Math.round(amount * 1e3) / 1e3;
        return allowFraction ? amount : Math.round(amount);
    },

    /**
     * Truncates the middle section of a string based on the max allowed length
     */
    truncateInMiddle(fullStr: string, maxLength: number): string {
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
     */
    nl2br(str: string): string {
        return str.replace(/\n/g, '<br />');
    },

    /**
     * Decodes the given HTML encoded string.
     *
     * @param s The string to decode.
     * @returns The decoded string.
     */
    htmlDecode(s: string) {
        return HtmlEntities.decode(s);
    },

    /**
     * HTML encodes the given string.
     *
     * @param s The string to encode.
     * @return string @p s HTML encoded.
     */
    htmlEncode(s: string) {
        return HtmlEntities.encode(s);
    },

    /**
     * Escape text while preventing any sort of double escape, so 'X & Y' -> 'X &amp; Y' and 'X &amp; Y' -> 'X &amp; Y'
     *
     * @param s The string to escape
     * @returns The escaped string
     */
    safeEscape(s: string) {
        return Utils.escapeText(Utils.unescapeText(s));
    },

    /**
     * HTML encoding insensitive equals.
     *
     * @param first string to compare
     * @param second string to compare
     * @returns True when first === second, ignoring HTML encoding
     */
    htmlEncodingInsensitiveEquals(first: string, second: string): boolean {
        return first === second || this.htmlDecode(first) === second || this.htmlEncode(first) === second;
    },

    /**
     * Creates an ID that can be used as an HTML attribute from @p str.
     *
     * @param str A string to create an ID from.
     * @returns The ID string made from @p str.
     */
    makeID(str: string): string {
        const modifiedString = String(str)
            .replace(/[^A-Za-z0-9]/g, '_')
            .toUpperCase();
        return `id_${modifiedString}`;
    },

    /**
     * Extracts an ID made with Str.makeID from a larger string.
     *
     * @param str A string containing an id made with Str.makeID
     * @returns The ID string.
     */
    extractID(str: string): string | null {
        const matches = str.match(/id[A-Z0-9_]+/);
        return matches && matches.length > 0 ? matches[0] : null;
    },

    /**
     * Modifies the string so the first letter of each word is capitalized and the
     * rest lowercased.
     *
     * @param val The string to modify
     */
    recapitalize(val: string): string {
        // First replace every letter with its lowercase equivalent
        // Cast to string.
        let str = String(val);
        if (str.length <= 0) {
            return str;
        }
        str = str.substr(0, 1).toUpperCase() + str.substr(1).toLowerCase();

        function recap_callback(t: unknown, a: string, b: string) {
            return a + b.toUpperCase();
        }
        return str.replace(
            // **NOTE: Match to _libfop.php
            /([^A-Za-z'.0-9])([a-z])/g,
            recap_callback,
        );
    },

    /**
     * Replace all the non alphanumerical character by _
     */
    sanitizeToAlphaNumeric(input: string): string {
        return String(input).replace(/[^\d\w]/g, '_');
    },

    /**
     * Strip out all the non numerical characters
     */
    stripNonNumeric(input: string): string {
        return String(input).replace(/[^\d]/g, '');
    },

    /**
     * Strips all non ascii characters from a string
     * @returns The ascii version of the string.
     */
    stripNonASCIICharacters(input: string): string {
        return String(input).replace(/[\u0000-\u0019\u0080-\uffff]/g, '');
    },

    /**
     * Shortens the @p text to @p length and appends an ellipses to it.
     *
     * The ellipses will only be appended if @p text is longer than the @p length
     * given.
     *
     * @param val The string to reduce in size.
     * @param length The maximal length desired.
     * @returns The shortened @p text.
     */
    shortenText(val: string, length: number): string {
        // Remove extra spaces because they don't show up in html anyway.
        const text = String(val).replace(/\s+/g, ' ');
        const truncatedText = text.substr(0, length - 3);
        return text.length > length ? `${truncatedText}...` : text;
    },

    /**
     * Returns the byte size of a character
     * @param inputChar You can input more than one character, but it will only return the size of the first
     * one.
     * @returns Byte size of the character
     */
    getRawByteSize(inputChar: string): number {
        const onlyChar = String(inputChar);
        const c = onlyChar.charCodeAt(0);

        // If we are grabbing the byte size, we need to temporarily diable no-bitwise for linting
        /* eslint-disable no-bitwise */
        if (c < 1 << 7) {
            return 1;
        }
        if (c < 1 << 11) {
            return 2;
        }
        if (c < 1 << 16) {
            return 3;
        }
        if (c < 1 << 21) {
            return 4;
        }
        if (c < 1 << 26) {
            return 5;
        }
        if (c < 1 << 31) {
            return 6;
        }
        /* eslint-enable no-bitwise */
        return Number.NaN;
    },

    /**
     * Gets the length of a string in bytes, including non-ASCII characters
     * @returns The number of bytes used by string
     */
    getByteLength(input: string): number {
        // Force string type
        const stringInput = String(input);
        const byteLength = Array.from(stringInput).reduce((acc, char) => acc + this.getRawByteSize(char), 0);
        return byteLength;
    },

    /**
     * Shortens the input by max byte size instead of by character length
     * @param maxSize The max size in bytes, e.g. 256
     * @returns Returns a shorted input if the input size exceeds the max
     */
    shortenByByte(input: string, maxSize: number): string {
        const stringInput = String(input);
        let totalByteLength = 0;
        for (let i = 0; i < stringInput.length; i++) {
            const charByteSize = this.getRawByteSize(stringInput[i]);
            if (charByteSize + totalByteLength > maxSize) {
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
     * @param haystack The full string to be searched
     * @param needle  The case-sensitive string to search for
     * @returns True if the haystack starts with the needle.
     */
    startsWith(haystack: string, needle: string): boolean {
        return this.isString(haystack) && this.isString(needle) && haystack.substring(0, needle.length) === needle;
    },

    /**
     * Gets the textual value of the given string.
     *
     * @param str The string to fetch the text value from.
     * @returns The text from within the HTML string.
     */
    stripHTML(str: string): string {
        if (!this.isString(str)) {
            return '';
        }

        return str.replace(/<[^>]*>?/gm, '');
    },

    /**
     * Modifies the string so the first letter of the string is capitalized
     *
     * @param str The string to modify.
     * @returns The recapitalized string.
     */
    UCFirst(str: string): string {
        return str.substr(0, 1).toUpperCase() + str.substr(1);
    },

    /**
     * Returns a string containing all the characters str from the beginning
     * of str to the first occurrence of substr.
     * Example: Str.cutAfter( 'hello$%world', '$%' ) // returns 'hello'
     *
     * @param str The string to modify.
     * @param substr The substring to search for.
     * @returns The cut/trimmed string.
     */
    cutAfter(str: string, substr: string): string {
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
     * @param str The string to modify.
     * @param substr The substring to search for.
     * @returns The cut/trimmed string.
     */
    cutBefore(str: string, substr: string): string {
        const index = str.indexOf(substr);
        if (index !== -1) {
            return str.substring(index + substr.length);
        }
        return str;
    },

    /**
     * Checks that the string is a domain name (e.g. example.com)
     *
     * @param str The string to check for domainnameness.
     *
     * @returns True if the string is a domain name
     */
    isValidDomainName(str: string): boolean {
        return !!String(str).match(Constants.CONST.REG_EXP.DOMAIN);
    },

    /**
     * Checks that the string is a valid url
     *
     * @returns True if the string is a valid hyperlink
     */
    isValidURL(str: string): boolean {
        return !!String(str).match(Constants.CONST.REG_EXP.HYPERLINK);
    },

    /**
     * Checks that the string is an email address.
     * NOTE: TLDs are not just 2-4 characters. Keep this in sync with _inputrules.php
     *
     * @param str The string to check for email validity.
     *
     * @returns True if the string is an email
     */
    isValidEmail(str: string): boolean {
        return !!String(str).match(Constants.CONST.REG_EXP.EMAIL);
    },

    /**
     * Checks if the string is an valid email address formed during comment markdown formation.
     *
     * @param str The string to check for email validity.
     *
     * @returns True if the string is an valid email created by comment markdown.
     */
    isValidEmailMarkdown(str: string): boolean {
        return !!String(str).match(`^${Constants.CONST.REG_EXP.MARKDOWN_EMAIL}$`);
    },

    /**
     * Remove trailing comma from a string.
     *
     * @param str The string with any trailing comma to be removed.
     *
     * @returns string with the trailing comma removed
     */
    removeTrailingComma(str: string): string {
        return str.trim().replace(/(,$)/g, '');
    },

    /**
     * Checks that the string is a list of coma separated email addresss.
     *
     * @param str The string to check for emails validity.
     *
     * @returns True if all emails are valid or if input is empty
     */
    areValidEmails(str: string): boolean {
        const string = this.removeTrailingComma(str);
        if (string === '') {
            return true;
        }

        const emails = string.split(',');
        const result = emails.every((email) => this.isValidEmail(email.trim()));
        return result;
    },

    /**
     * Extract the email addresses from a string
     */
    extractEmail(str: string): RegExpMatchArray | null {
        return String(str).match(Constants.CONST.REG_EXP.EMAIL_SEARCH);
    },

    /**
     * Extracts the domain name from the given email address
     * (e.g. "domain.com" for "joe@domain.com").
     *
     * @param email The email address.
     *
     * @returns The domain name in the email address.
     */
    extractEmailDomain(email: string): string {
        return this.cutBefore(email, '@');
    },

    /**
     * Tries to extract the company name from the given email address
     * (e.g. "yelp" for "joe@yelp.co.uk").
     *
     * @param email The email address.
     *
     * @returns The company name in the email address or null.
     */
    extractCompanyNameFromEmailDomain(email: string): string | null {
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
     * @param email The email address.
     *
     * @returns The local part in the email address.
     */
    extractEmailLocalPart(email: string): string {
        return this.cutAfter(email, '@');
    },

    /**
     * Sanitize phone number to return only numbers. Return null if non valid phone number.
     */
    sanitizePhoneNumber(str: string): string | null {
        const string = str.replace(/(?!^\+)\D/g, '');
        return string.length <= 15 && string.length >= 10 ? string : null;
    },

    /**
     * Sanitize email. Return null if non valid email.
     */
    sanitizeEmail(str: string): string | null {
        const string = str.toLowerCase().trim();
        return Constants.CONST.REG_EXP.EMAIL.test(string) ? string : null;
    },

    /**
     * Escapes all special RegExp characters from a string
     *
     * @param str The subject
     *
     * @returns The escaped string
     */
    escapeForRegExp(str: string): string {
        return str.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&');
    },

    /**
     * Escapes all special RegExp characters from a string except for the period
     *
     * @param str The subject
     * @returns The escaped string
     */
    escapeForExpenseRule(str: string): string {
        return str.replace(/[-[\]/{}()*+?\\^$|]/g, '\\$&');
    },

    /**
     * Adds a backslash in front of each of colon
     * if they don't already have a backslash in front of them
     *
     * @param str The subject
     * @returns The escaped string
     */
    addBackslashBeforeColonsForTagNamesComingFromQBD(str: string): string {
        return str.replace(/([^\\]):/g, '$1\\:');
    },

    /**
     * Removes backslashes from string
     * eg: myString\[\]\* -> myString[]*
     */
    stripBackslashes(str: string): string {
        return str.replace(/\\/g, '');
    },

    /**
     * Checks if a string's length is in the specified range
     *
     * @returns true if the length is in the range, false otherwise
     */
    isOfLength(str: string, minimumLength: number, maximumLength: number): boolean {
        if (!this.isString(str)) {
            return false;
        }
        if (str.length < minimumLength) {
            return false;
        }
        if (!this.isUndefined(maximumLength) && str.length > maximumLength) {
            return false;
        }
        return true;
    },

    /**
     * Count the number of occurences of needle in haystack.
     * This is faster than counting the results of haystack.match( /needle/g )
     * via http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string
     *
     * @param haystack The string to look inside of
     * @param needle What we're looking for
     * @param allowOverlapping Defaults to false
     *
     * @returns The number of times needle is in haystack.
     */
    occurences(haystack: string, needle: string, allowOverlapping: boolean): number {
        let count = 0;
        let pos = 0;

        // Force strings for input
        const haystackStr = String(haystack);
        const needleStr = String(needle);

        if (needleStr.length <= 0) {
            return haystackStr.length + 1;
        }

        const step = allowOverlapping ? 1 : needleStr.length;

        while (pos >= 0) {
            pos = haystackStr.indexOf(needleStr, pos);
            if (pos >= 0) {
                count += 1;
                pos += step;
            }
        }
        return count;
    },

    /**
     * Uppercases the first letter of each word
     * via https://github.com/kvz/phpjs/blob/master/functions/strings/ucwords.js
     *
     * @param str to uppercase words
     * @returns Uppercase worded string
     */
    ucwords(str: string): string {
        const capitalize = ($1: string) => $1.toUpperCase();
        return String(str).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, capitalize);
    },

    /**
     * Returns true if the haystack contains the needle
     *
     * @param haystack The full string to be searched
     * @param needle The case-sensitive string to search for
     *
     * @returns Returns true if the haystack contains the needle
     */
    contains(haystack: string, needle: string): boolean {
        return haystack.indexOf(needle) !== -1;
    },

    /**
     * Returns true if the haystack contains the needle, ignoring case
     *
     * @param haystack The full string to be searched
     * @param needle The case-insensitive string to search for
     *
     * @returns Returns true if the haystack contains the needle, ignoring case
     */
    caseInsensitiveContains(haystack: string, needle: string): boolean {
        return this.contains(haystack.toLowerCase(), needle.toLowerCase());
    },

    /**
     * Case insensitive compare function
     *
     * @param strA string to compare
     * @param strB string to compare
     *
     * @returns -1 if first string < second string
     *                   1 if first string > second string
     *                   0 if first string = second string
     */
    caseInsensitiveCompare(strA: string, strB: string): 1 | 0 | -1 {
        const lowerCaseStrA = strA.toLocaleLowerCase();
        const lowerCaseStrB = strB.toLocaleLowerCase();

        return this.compare(lowerCaseStrA, lowerCaseStrB);
    },

    /**
     * Case insensitive equals
     *
     * @param strA string to compare
     * @param strB string to compare
     * @returns true when first == second except for case
     */
    caseInsensitiveEquals(strA: string, strB: string): boolean {
        return this.caseInsensitiveCompare(strA, strB) === 0;
    },

    /**
     * Compare function
     *
     * @param strA string to compare
     * @param strB string to compare
     *
     * @returns -1 if first string < second string
     *                   1 if first string > second string
     *                   0 if first string = second string
     */
    compare(strA: string, strB: string): 1 | 0 | -1 {
        if (strA < strB) {
            return -1;
        }
        if (strA > strB) {
            return 1;
        }
        return 0;
    },

    /**
     * Check if a file extension is supported by SmartReports
     */
    isFileExtensionSmartReportsValid(filename: string): boolean {
        // Allowed extensions. Make sure to keep them in sync with those defined
        // in SmartReport_Utils::templateFileUploadCheck()
        const allowedExtensions = ['xls', 'xlsx', 'xlsm', 'xltm'];
        const extension = filename.split('.').pop()?.toLowerCase();
        return !!extension && allowedExtensions.indexOf(extension) > -1;
    },

    /**
     * Mask Permanent Account Number (PAN) the same way Auth does
     * @param num account number
     * @returns masked account number
     */
    maskPAN(num: number | string): string {
        // cast to string
        const accountNumber = String(num);
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
     */
    isString(obj: unknown): obj is string {
        return this.isTypeOf(obj, 'String');
    },

    /**
     * Checks if something is a number
     * Stolen from underscore
     * @param obj
     */
    isNumber(obj: unknown): obj is number {
        return this.isTypeOf(obj, 'Number');
    },

    /**
     * Checks if something is a certain type
     * Stolen from underscore
     */
    isTypeOf(obj: unknown, type: 'Arguments' | 'Function' | 'String' | 'Number' | 'Date' | 'RegExp' | 'Error' | 'Symbol' | 'Map' | 'WeakMap' | 'Set' | 'WeakSet'): boolean {
        return Object.prototype.toString.call(obj) === `[object ${type}]`;
    },

    /**
     * Checks to see if something is undefined
     * Stolen from underscore
     */
    isUndefined(obj: unknown): boolean {
        // eslint-disable-next-line no-void
        return obj === void 0;
    },

    /**
     * Replace first N characters of the string with maskChar
     * eg: maskFirstNCharacters( '1234567890', 6, 'X' ) yields XXXXXX7890
     * @param str String to mask
     * @param num Number of characters we want to mask from the string
     * @param mask String we want replace the first N chars with
     * @returns Masked string
     */
    maskFirstNCharacters(str: string, num: number, mask: string): string {
        // if str is empty, str or mask aren't strings,
        // or n is not a number, do nothing
        if (!this.isString(str) || !this.isString(mask) || str.length === 0 || !this.isNumber(num)) {
            return str;
        }

        return str.substring(0, num).replace(/./g, mask) + str.substring(num);
    },

    /**
     * Trim a string
     */
    trim(str: string) {
        return str.trim();
    },

    /**
     * Convert a percentage string like '25%' to 25/
     * @param percentageString The percentage as a string
     */
    percentageStringToNumber(percentageString: string): number {
        return Number(this.cutAfter(percentageString, '%'));
    },

    /**
     * Remove all the spaces from a string
     */
    removeSpaces(input: string): string {
        return String(input).replace(' ', '');
    },

    /**
     * Returns the proper phrase depending on the count that is passed.
     * Example:
     * console.log(Str.pluralize('puppy', 'puppies', 1)) { // puppy
     * console.log(Str.pluralize('puppy', 'puppies', 3)) { // puppies
     *
     * @param singular form of the phrase
     * @param plural form of the phrase
     * @param num the count which determines the plurality
     */
    pluralize(singular: string, plural: string, num: number): string {
        if (!num || num > 1) {
            return plural;
        }
        return singular;
    },

    /**
     * Returns whether or not a string is an encrypted number or not.
     *
     * @param num that we want to see if its encrypted or not
     *
     * @returns Whether or not this string is an encrpypted number
     */
    isEncryptedCardNumber(num: string): boolean {
        // Older encrypted versioning.
        if (/^[\da-fA-F]+$/.test(num)) {
            return num.length % 32 === 0;
        }

        // Check with the new versioning.
        if (/^[vV][\d]+:[\da-fA-F]+$/.test(num)) {
            return num.split(':')[1].length % 32 === 0;
        }

        return false;
    },

    /**
     * Converts a value to boolean, case-insensitive.
     */
    toBool(value: unknown): boolean {
        if (this.isString(value)) {
            return value.toLowerCase() === 'true';
        }
        return !!value;
    },

    /**
     * Checks if a string could be the masked version of another one.
     *
     * @param strA String to compare
     * @param strB String to compare
     * @param [mask] Defaults to X
     * @returns True when first could be the masked version of second
     */
    maskedEquals(strA: string, strB: string, mask: string): boolean {
        const firsts = strA.match(/.{1,1}/g) ?? [];
        const seconds = strB.match(/.{1,1}/g) ?? [];
        const defaultMask = mask || 'X';

        if (firsts.length !== seconds.length) {
            return false;
        }

        for (let i = 0; i < firsts.length; i += 1) {
            if (firsts[i] !== seconds[i] && firsts[i] !== defaultMask && seconds[i] !== defaultMask) {
                return false;
            }
        }

        return true;
    },

    /**
     * Bold any word matching the regexp in the text.
     */
    boldify(text: string, regexp: RegExp): string {
        return text.replace(regexp, '<strong>$1</strong>');
    },

    /**
     * Check for whether a phone number is valid.
     * @deprecated use isValidE164Phone to validate E.164 phone numbers or isValidPhoneFormat to validate phone numbers in general
     */
    isValidPhone(phone: string): boolean {
        return Constants.CONST.SMS.E164_REGEX.test(phone);
    },

    /**
     * Check for whether a phone number is valid.
     */
    isValidPhoneNumber(phone: string): boolean {
        return parsePhoneNumber(phone).possible;
    },

    /**
     * Check for whether a phone number is valid according to E.164 standard.
     */
    isValidE164Phone(phone: string): boolean {
        return Constants.CONST.SMS.E164_REGEX.test(phone);
    },

    /**
     * Check for whether a phone number is valid in different formats/standards. For example:
     * significant: 4404589784
     * international: +1 440-458-9784
     * e164: +14404589784
     * national: (440) 458-9784
     * 123.456.7890
     */
    isValidPhoneFormat(phone: string): boolean {
        return Constants.CONST.REG_EXP.GENERAL_PHONE_PART.test(phone);
    },

    /**
     * We validate mentions by checking if it's first character is an allowed character.
     */
    isValidMention(mention: string): boolean {
        // Mentions can start @ proceeded by a space, eg "ping @user@domain.tld"
        if (/[\s@]/g.test(mention.charAt(0))) {
            return true;
        }

        // Mentions can also start and end with a *, _, ~, ', or " (with no other preceding characters)
        // eg "ping *@user@domain.tld*"
        const firstChar = mention.charAt(0);
        const lastChar = mention.charAt(mention.length - 1);
        return /[*~_'"]/g.test(firstChar) && /[*~_'"]/g.test(lastChar) && firstChar === lastChar;
    },

    /**
     * Returns text without our SMS domain
     */
    removeSMSDomain(text: string): string {
        return text.replace(REMOVE_SMS_DOMAIN_PATTERN, '');
    },

    /**
     * Returns true if the text is a valid E.164 phone number with our SMS domain removed
     */
    isSMSLogin(text: string): boolean {
        return this.isValidE164Phone(this.removeSMSDomain(text));
    },

    /**
     * This method will return all matches of a single regex like preg_match_all() in PHP. This is not a common part of
     * JS yet, so this is a good way of doing it according to
     * https://github.com/airbnb/javascript/issues/1439#issuecomment-306297399 and doesn't get us in trouble with
     * linting rules.
     */
    matchAll(str: string, regex: RegExp): Array<RegExpMatchArray & {input: string; index: number}> {
        const matches: Array<RegExpMatchArray & {input: string; index: number}> = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const collectMatches = (...args: any[]) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const match: any = Array.prototype.slice.call(args, 0, -2);
            match.input = args[args.length - 1];
            match.index = args[args.length - 2];
            matches.push(match);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        str.replace(regex, collectMatches as any);
        return matches;
    },

    /**
     * A simple GUID generator taken from https://stackoverflow.com/a/32760401/9114791
     *
     * @param [prefix] an optional prefix to put in front of the guid
     */
    guid(prefix = ''): string {
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
     * @param url The URL to be formatted
     * @returns The formatted URL
     */
    normalizeUrl(url: string): string {
        return typeof url === 'string' && url.startsWith('/') ? url : `/${url}`;
    },

    /**
     *  Formats a URL by converting the domain name to lowercase and adding the missing 'https://' protocol.
     *
     * @param url The URL to be formatted
     * @returns The formatted URL
     */
    sanitizeURL(url: string): string {
        const regex = new RegExp(`^${UrlPatterns.URL_REGEX}$`, 'i');
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
     */
    result: resultFn,

    /**
     * Get file extension for a given url with or
     * without query parameters
     */
    getExtension(url: string): string | undefined {
        return url.split('.').pop()?.split('?')[0]?.toLowerCase();
    },

    /**
     * Takes in a URL and checks if the file extension is PDF
     *
     * @param url The URL to be checked
     * @returns Whether file path is PDF or not
     */
    isPDF(url: string): boolean {
        return this.getExtension(url) === 'pdf';
    },

    /**
     * Takes in a URL and checks if the file extension is an image
     * that can be rendered by React Native. Do NOT add extensions
     * to this list unless they appear in this list and are
     * supported by all platforms.
     *
     * https://reactnative.dev/docs/image#source
     */
    isImage(url: string): boolean {
        const extension = this.getExtension(url);

        if (!extension) {
            return false;
        }

        return ['jpeg', 'jpg', 'gif', 'png', 'bmp', 'webp'].includes(extension);
    },

    /**
     * Takes in a URL and checks if the file extension is a video
     * that can be rendered by React Native. Do NOT add extensions
     * to this list unless they are supported by all platforms.
     *
     * https://developer.android.com/media/platform/supported-formats#video-formats
     * https://developer.apple.com/documentation/coremedia/1564239-video_codec_constants
     * https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs
     */
    isVideo(url: string): boolean {
        const extension = this.getExtension(url);

        if (!extension) {
            return false;
        }

        return ['mov', 'mp4', 'webm', 'mkv'].includes(extension);
    },

    /**
     * Checks whether the given string is a +@ domain email account, such as
     * +@domain.com
     *
     * @returns True if is a domain account email, otherwise false.
     */
    isDomainEmail(email: string): boolean {
        return this.startsWith(email, '+@');
    },

    /**
     * Polyfill for String.prototype.replaceAll
     */
    replaceAll(text: string, searchValue: string | RegExp, replaceValue: string | ((...args: unknown[]) => string)): string {
        return String.prototype.replaceAll.call(text, searchValue, replaceValue as (...args: unknown[]) => string);
    },
};

export default Str;
