declare const Str: {
    /**
     * Return true if the string is ending with the provided suffix
     *
     * @param str String ot search in
     * @param suffix What to look for
     */
    endsWith(str: string, suffix: string): boolean;
    /**
     * Converts a USD string into th number of cents it represents.
     *
     * @param  amountStr     A string representing a USD value.
     * @param allowFraction Flag indicating if fractions of cents should be
     *                               allowed in the output.
     *
     * @returns The cent value of the @p amountStr.
     */
    fromUSDToNumber(amountStr: string, allowFraction: boolean): number;
    /**
     * Truncates the middle section of a string based on the max allowed length
     *
     * @param fullStr
     * @param    maxLength
     */
    truncateInMiddle(fullStr: string, maxLength: number): string;
    /**
     * Convert new line to <br />
     *
     * @param str
     */
    nl2br(str: string): string;
    /**
     * Decodes the given HTML encoded string.
     *
     * @param s The string to decode.
     * @returns The decoded string.
     */
    htmlDecode(s: string): string;
    /**
     * HTML encodes the given string.
     *
     * @param s The string to encode.
     * @returns @p s HTML encoded.
     */
    htmlEncode(s: string): string;
    /**
     * Escape text while preventing any sort of double escape, so 'X & Y' -> 'X &amp; Y' and 'X &amp; Y' -> 'X &amp; Y'
     *
     * @param s the string to escape
     * @returns the escaped string
     */
    safeEscape(s: string): string;
    /**
     * HTML encoding insensitive equals.
     *
     * @param first string to compare
     * @param second string to compare
     * @returns true when first === second, ignoring HTML encoding
     */
    htmlEncodingInsensitiveEquals(first: string, second: string): boolean;
    /**
     * Creates an ID that can be used as an HTML attribute from @p str.
     *
     * @param str A string to create an ID from.
     * @returns The ID string made from @p str.
     */
    makeID(str: string): string;
    /**
     * Extracts an ID made with Str.makeID from a larger string.
     *
     * @param str A string containing an id made with Str.makeID
     * @returns The ID string.
     */
    extractID(str: string): string | null;
    /**
     * Modifies the string so the first letter of each word is capitalized and the
     * rest lowercased.
     *
     * @param val The string to modify
     */
    recapitalize(val: string): string;
    /**
     * Replace all the non alphanumerical character by _
     *
     * @param input
     */
    sanitizeToAlphaNumeric(input: string): string;
    /**
     * Strip out all the non numerical characters
     *
     * @param input
     */
    stripNonNumeric(input: string): string;
    /**
     * Strips all non ascii characters from a string
     * @param input
     * @returns The ascii version of the string.
     */
    stripNonASCIICharacters(input: string): string;
    /**
     * Shortens the @p text to @p length and appends an ellipses to it.
     *
     * The ellipses will only be appended if @p text is longer than the @p length
     * given.
     *
     * @param val   The string to reduce in size.
     * @param length The maximal length desired.
     * @returns The shortened @p text.
     */
    shortenText(val: string, length: number): string;
    /**
     * Returns the byte size of a character
     * @param inputChar You can input more than one character, but it will only return the size of the first
     * one.
     * @returns Byte size of the character
     */
    getRawByteSize(inputChar: string): number;
    /**
     * Gets the length of a string in bytes, including non-ASCII characters
     * @param input
     * @returns The number of bytes used by string
     */
    getByteLength(input: string): number;
    /**
     * Shortens the input by max byte size instead of by character length
     * @param input
     * @param maxSize The max size in bytes, e.g. 256
     * @returns Returns a shorted input if the input size exceeds the max
     */
    shortenByByte(input: string, maxSize: number): string;
    /**
     * Returns true if the haystack begins with the needle
     *
     * @param haystack  The full string to be searched
     * @param needle    The case-sensitive string to search for
     * @returns Retruns true if the haystack starts with the needle.
     */
    startsWith(haystack: string, needle: string): boolean;
    /**
     * Gets the textual value of the given string.
     *
     * @param str The string to fetch the text value from.
     * @returns The text from within the HTML string.
     */
    stripHTML(str: string): string;
    /**
     * Modifies the string so the first letter of the string is capitalized
     *
     * @param str The string to modify.
     * @returns The recapitalized string.
     */
    UCFirst(str: string): string;
    /**
     * Returns a string containing all the characters str from the beginning
     * of str to the first occurrence of substr.
     * Example: Str.cutAfter( 'hello$%world', '$%' ) // returns 'hello'
     *
     * @param str The string to modify.
     * @param substr The substring to search for.
     * @returns The cut/trimmed string.
     */
    cutAfter(str: string, substr: string): string;
    /**
     * Returns a string containing all the characters str from after the first
     * occurrence of substr to the end of the string.
     * Example: Str.cutBefore( 'hello$%world', '$%' ) // returns 'world'
     *
     * @param str The string to modify.
     * @param substr The substring to search for.
     * @returns The cut/trimmed string.
     */
    cutBefore(str: string, substr: string): string;
    /**
     * Checks that the string is a domain name (e.g. example.com)
     *
     * @param string The string to check for domainnameness.
     *
     * @returns True iff the string is a domain name
     */
    isValidDomainName(string: string): boolean;
    /**
     * Checks that the string is a valid url
     *
     * @param string
     *
     * @returns True if the string is a valid hyperlink
     */
    isValidURL(string: string): boolean;
    /**
     * Checks that the string is an email address.
     * NOTE: TLDs are not just 2-4 characters. Keep this in sync with _inputrules.php
     *
     * @param string The string to check for email validity.
     *
     * @returns True iff the string is an email
     */
    isValidEmail(string: string): boolean;
    /**
     * Checks if the string is an valid email address formed during comment markdown formation.
     *
     * @param string The string to check for email validity.
     *
     * @returns True if the string is an valid email created by comment markdown.
     */
    isValidEmailMarkdown(string: string): boolean;
    /**
     * Remove trailing comma from a string.
     *
     * @param string The string with any trailing comma to be removed.
     *
     * @returns string with the trailing comma removed
     */
    removeTrailingComma(string: string): string;
    /**
     * Checks that the string is a list of coma separated email addresss.
     *
     * @param str The string to check for emails validity.
     *
     * @returns True if all emails are valid or if input is empty
     */
    areValidEmails(str: string): boolean;
    /**
     * Extract the email addresses from a string
     *
     * @param string
     */
    extractEmail(string: string): RegExpMatchArray | null;
    /**
     * Extracts the domain name from the given email address
     * (e.g. "domain.com" for "joe@domain.com").
     *
     * @param email The email address.
     *
     * @returns The domain name in the email address.
     */
    extractEmailDomain(email: string): string;
    /**
     * Tries to extract the company name from the given email address
     * (e.g. "yelp" for "joe@yelp.co.uk").
     *
     * @param email The email address.
     *
     * @returns The company name in the email address or null.
     */
    extractCompanyNameFromEmailDomain(email: string): string | null;
    /**
     * Extracts the local part from the given email address
     * (e.g. "joe" for "joe@domain.com").
     *
     * @param email The email address.
     *
     * @returns The local part in the email address.
     */
    extractEmailLocalPart(email: string): string;
    /**
     * Sanitize phone number to return only numbers. Return null if non valid phone number.
     *
     * @param str
     */
    sanitizePhoneNumber(str: string): string | null;
    /**
     * Sanitize email. Return null if non valid email.
     *
     * @param str
     */
    sanitizeEmail(str: string): string | null;
    /**
     * Escapes all special RegExp characters from a string
     *
     * @param string The subject
     *
     * @returns The escaped string
     */
    escapeForRegExp(string: string): string;
    /**
     * Escapes all special RegExp characters from a string except for the period
     *
     * @param string The subject
     * @returns The escaped string
     */
    escapeForExpenseRule(string: string): string;
    /**
     * Adds a backslash in front of each of colon
     * if they don't already have a backslash in front of them
     *
     * @param string The subject
     * @returns The escaped string
     */
    addBackslashBeforeColonsForTagNamesComingFromQBD(string: string): string;
    /**
     * Removes backslashes from string
     * eg: myString\[\]\* -> myString[]*
     *
     * @param string
     *
     */
    stripBackslashes(string: string): string;
    /**
     * Checks if a string's length is in the specified range
     *
     * @param string The subject
     * @param minimumLength
     * @param [maximumLength]
     *
     * @returns true if the length is in the range, false otherwise
     */
    isOfLength(string: string, minimumLength: number, maximumLength: number): boolean;
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
    occurences(haystack: string, needle: string, allowOverlapping: boolean): number;
    /**
     * Uppercases the first letter of each word
     * via https://github.com/kvz/phpjs/blob/master/functions/strings/ucwords.js
     *
     * @param  str to uppercase words
     * @returns  Uppercase worded string
     */
    ucwords(str: string): string;
    /**
     * Returns true if the haystack contains the needle
     *
     * @param haystack The full string to be searched
     * @param needle The case-sensitive string to search for
     *
     * @returns Returns true if the haystack contains the needle
     */
    contains(haystack: string, needle: string): boolean;
    /**
     * Returns true if the haystack contains the needle, ignoring case
     *
     * @param haystack The full string to be searched
     * @param needle The case-insensitive string to search for
     *
     * @returns Returns true if the haystack contains the needle, ignoring case
     */
    caseInsensitiveContains(haystack: string, needle: string): boolean;
    /**
     * Case insensitive compare function
     *
     * @param string1 string to compare
     * @param string2 string to compare
     *
     * @returns -1 if first string < second string
     *                   1 if first string > second string
     *                   0 if first string = second string
     */
    caseInsensitiveCompare(string1: string, string2: string): 1 | 0 | -1;
    /**
     * Case insensitive equals
     *
     * @param first string to compare
     * @param second string to compare
     * @returns true when first == second except for case
     */
    caseInsensitiveEquals(first: string, second: string): boolean;
    /**
     * Compare function
     *
     * @param string1 string to compare
     * @param string2 string to compare
     *
     * @returns -1 if first string < second string
     *                   1 if first string > second string
     *                   0 if first string = second string
     */
    compare(string1: string, string2: string): 1 | 0 | -1;
    /**
     * Check if a file extension is supported by SmartReports
     * @param  filename
     */
    isFileExtensionSmartReportsValid(filename: string): boolean;
    /**
     * Mask Permanent Account Number (PAN) the same way Auth does
     * @param number account number
     * @returns masked account number
     */
    maskPAN(number: number | string): string;
    /**
     * Checks if something is a string
     * Stolen from underscore
     * @param obj
     */
    isString(obj: unknown): boolean;
    /**
     * Checks if something is a number
     * Stolen from underscore
     * @param obj
     */
    isNumber(obj: unknown): boolean;
    /**
     * Checks if something is a certain type
     * Stolen from underscore
     * @param  obj
     * @param  type one of ['Arguments', 'Function', 'String', 'Number', 'Date',
     *                       'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet']
     */
    isTypeOf(obj: unknown, type: 'Arguments' | 'Function' | 'String' | 'Number' | 'Date' | 'RegExp' | 'Error' | 'Symbol' | 'Map' | 'WeakMap' | 'Set' | 'WeakSet'): boolean;
    /**
     * Checks to see if something is undefined
     * Stolen from underscore
     * @param obj
     */
    isUndefined(obj: unknown): boolean;
    /**
     * Replace first N characters of the string with maskChar
     * eg: maskFirstNCharacters( '1234567890', 6, 'X' ) yields XXXXXX7890
     * @param str string to mask
     * @param n number of characters we want to mask from the string
     * @param mask string we want replace the first N chars with
     * @returns masked string
     */
    maskFirstNCharacters(str: string, n: number, mask: string): string;
    /**
     * Trim a string
     *
     * @param str
     */
    trim(str: string): string;
    /**
     * Convert a percentage string like '25%' to 25/
     * @param percentageString The percentage as a string
     */
    percentageStringToNumber(percentageString: string): number;
    /**
     * Remoce all the spaces from a string
     * @param input
     *
     */
    removeSpaces(input: string): string;
    /**
     * Returns the proper phrase depending on the count that is passed.
     * Example:
     * console.log(Str.pluralize('puppy', 'puppies', 1)); // puppy
     * console.log(Str.pluralize('puppy', 'puppies', 3)); // puppies
     *
     * @param singular form of the phrase
     * @param plural form of the phrase
     * @param n the count which determines the plurality
     */
    pluralize(singular: string, plural: string, n: number): string;
    /**
     * Returns whether or not a string is an encrypted number or not.
     *
     * @param number that we want to see if its encrypted or not
     *
     * @returns Whether or not this string is an encrpypted number
     */
    isEncryptedCardNumber(number: string): boolean;
    /**
     * Converts a value to boolean, case-insensitive.
     * @param value
     */
    toBool(value: unknown): boolean;
    /**
     * Checks if a string could be the masked version of another one.
     *
     * @param first string to compare
     * @param second string to compare
     * @param [mask] defaults to X
     * @returns true when first could be the masked version of second
     */
    maskedEquals(first: string, second: string, mask: string): boolean;
    /**
     * Bold any word matching the regexp in the text.
     * @param text, htmlEncoded
     * @param regexp
     */
    boldify(text: string, regexp: RegExp): string;
    /**
     * Check for whether a phone number is valid.
     * @param phone
     * @deprecated use isValidE164Phone to validate E.164 phone numbers, isValidPhoneFormat to validate phone number format, or isValidPhoneNumber to validate phone numbers in general
     */
    isValidPhone(phone: string): boolean;
    /**
     * Check for whether a phone number is valid.
     * @param phone
     */
    isValidPhoneNumber(phone: string): boolean;
    /**
     * Check for whether a phone number is valid according to E.164 standard.
     * @param phone
     */
    isValidE164Phone(phone: string): boolean;
    /**
     * Check for whether a phone number is valid in different formats/standards. For example:
     * significant: 4404589784
     * international: +1 440-458-9784
     * e164: +14404589784
     * national: (440) 458-9784
     * 123.456.7890
     * @param phone
     */
    isValidPhoneFormat(phone: string): boolean;
    /**
     * We validate mentions by checking if it's first character is an allowed character.
     *
     * @param mention
     */
    isValidMention(mention: string): boolean;
    /**
     * Returns text without our SMS domain
     *
     * @param text
     */
    removeSMSDomain(text: string): string;
    /**
     * Returns true if the text is a valid E.164 phone number with our SMS domain removed
     *
     * @param text
     */
    isSMSLogin(text: string): boolean;
    /**
     * This method will return all matches of a single regex like preg_match_all() in PHP. This is not a common part of
     * JS yet, so this is a good way of doing it according to
     * https://github.com/airbnb/javascript/issues/1439#issuecomment-306297399 and doesn't get us in trouble with
     * linting rules.
     *
     * @param str
     * @param regex
     */
    matchAll(str: string, regex: RegExp): Array<RegExpMatchArray & {input: string; index: number}>;
    /**
     * A simple GUID generator taken from https://stackoverflow.com/a/32760401/9114791
     *
     * @param [prefix] an optional prefix to put in front of the guid
     *
     */
    guid(prefix?: string): string;
    /**
     * Takes in a URL and returns it with a leading '/'
     *
     * @param url The URL to be formatted
     * @returns The formatted URL
     */
    normalizeUrl(url: string): string;
    /**
     *  Formats a URL by converting the domain name to lowercase and adding the missing 'https://' protocol.
     *
     * @param url The URL to be formatted
     * @returns The formatted URL
     */
    sanitizeURL(url: string): string;
    /**
     * Checks if parameter is a string or function
     * if it is a function then we will call it with
     * any additional arguments.
     *
     * @param parameter
     */
    result: {
        <R, A extends unknown[]>(parameter: string): string;
        <R, A extends unknown[]>(parameter: (...args: A) => R, ...args: A): R;
    };
    /**
     * Get file extension for a given url with or
     * without query parameters
     *
     * @param url
     */
    getExtension(url: string): string | undefined;
    /**
     * Takes in a URL and checks if the file extension is PDF
     *
     * @param url The URL to be checked
     * @returns Whether file path is PDF or not
     */
    isPDF(url: string): boolean;
    /**
     * Takes in a URL and checks if the file extension is an image
     * that can be rendered by React Native. Do NOT add extensions
     * to this list unless they appear in this list and are
     * supported by all platforms.
     *
     * https://reactnative.dev/docs/image#source
     *
     * @param url
     */
    isImage(url: string): boolean;
    /**
     * Takes in a URL and checks if the file extension is a video
     * that can be rendered by React Native. Do NOT add extensions
     * to this list unless they are supported by all platforms.
     *
     * https://developer.android.com/media/platform/supported-formats#video-formats
     * https://developer.apple.com/documentation/coremedia/1564239-video_codec_constants
     * https://developer.mozilla.org/en-US/docs/Web/Media/Formats/Video_codecs
     *
     * @param url
     */
    isVideo(url: string): boolean;
    /**
     * Checks whether the given string is a +@ domain email account, such as
     * +@domain.com
     *
     * @param email
     * @returns True if is a domain account email, otherwise false.
     */
    isDomainEmail(email: string): boolean;
    /**
     * Polyfill for String.prototype.replaceAll
     *
     * @param text
     * @param searchValue
     * @param replaceValue
     */
    replaceAll(text: string, searchValue: string | RegExp, replaceValue: string | ((...args: unknown[]) => string)): string;
};
export default Str;
