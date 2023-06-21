declare type Replacement = string | ((...args: string[]) => string);
declare type Rule = {
    name: string;
    process?: (textToProcess: string, replacement: Replacement) => string;
    regex?: RegExp;
    replacement: Replacement;
    pre?: (input: string) => string;
    post?: (input: string) => string;
};
export default class ExpensiMark {
    rules: Rule[];
    htmlToMarkdownRules: Rule[];
    htmlToTextRules: Rule[];
    constructor();
    /**
     * Replaces markdown with html elements
     *
     * @param {String} text - Text to parse as markdown
     * @param {Object} [options] - Options to customize the markdown parser
     * @param {String[]} [options.filterRules=[]] - An array of name of rules as defined in this class.
     * If not provided, all available rules will be applied.
     * @param {Boolean} [options.shouldEscapeText=true] - Whether or not the text should be escaped
     *
     * @returns {String}
     */
    replace(text: string, { filterRules, shouldEscapeText }?: {
        filterRules?: string[];
        shouldEscapeText?: boolean;
    }): string;
    /**
     * Checks matched URLs for validity and replace valid links with html elements
     *
     * @param {RegExp} regex
     * @param {String} textToCheck
     * @param {Function} replacement
     *
     * @returns {String}
     */
    modifyTextForUrlLinks(regex: RegExp, textToCheck: string, replacement: Replacement): string;
    /**
     * Checks matched Emails for validity and replace valid links with html elements
     *
     * @param {RegExp} regex
     * @param {String} textToCheck
     * @param {Function} replacement
     *
     * @returns {String}
     */
    modifyTextForEmailLinks(regex: RegExp, textToCheck: string, replacement: Replacement): string;
    /**
     * replace block element with '\n' if :
     * 1. We have text within the element.
     * 2. The text does not end with a new line.
     * 3. The text does not have quote mark '>' .
     * 4. It's not the last element in the string.
     *
     * @param {String} htmlString
     * @returns {String}
     */
    replaceBlockElementWithNewLine(htmlString: string): string;
    /**
     * Replaces HTML with markdown
     *
     * @param {String} htmlString
     *
     * @returns {String}
     */
    htmlToMarkdown(htmlString: string): string;
    /**
     * Convert HTML to text
     *
     * @param {String} htmlString
     * @returns {String}
     */
    htmlToText(htmlString: string): string;
    /**
     * Modify text for Quotes replacing chevrons with html elements
     *
     * @param {RegExp} regex
     * @param {String} textToCheck
     * @param {Function} replacement
     *
     * @returns {String}
     */
    modifyTextForQuote(regex: RegExp, textToCheck: string, replacement: Replacement): string;
    /**
     * Format the content of blockquote if the text matches the regex or else just return the original text
     *
     * @param {RegExp} regex
     * @param {String} textToCheck
     * @param {Function} replacement
     *
     * @returns {String}
     */
    formatTextForQuote(regex: RegExp, textToCheck: string, replacement: Replacement): string;
    /**
     * Check if the input text includes only the open or the close tag of an element.
     *
     * @param {String} textToCheck - Text to check
     *
     * @returns {Boolean}
     */
    containsNonPairTag(textToCheck: string): boolean;
    /**
     * @param {String} comment
     * @returns {Array}
     */
    extractLinksInMarkdownComment(comment: string): string[];
    /**
     * Compares two markdown comments and returns a list of the links removed in a new comment.
     *
     * @param {String} oldComment
     * @param {String} newComment
     * @returns {Array}
     */
    getRemovedMarkdownLinks(oldComment: string, newComment: string): string[];
}
export {};
