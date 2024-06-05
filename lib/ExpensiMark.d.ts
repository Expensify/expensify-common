declare type Replacement = (...args: string[], extras?: ExtrasObject) => string;
declare type Name =
    | 'codeFence'
    | 'inlineCodeBlock'
    | 'email'
    | 'link'
    | 'hereMentions'
    | 'userMentions'
    | 'reportMentions'
    | 'autoEmail'
    | 'autolink'
    | 'quote'
    | 'italic'
    | 'bold'
    | 'strikethrough'
    | 'heading1'
    | 'newline'
    | 'replacepre'
    | 'listItem'
    | 'exclude'
    | 'anchor'
    | 'breakline'
    | 'blockquoteWrapHeadingOpen'
    | 'blockquoteWrapHeadingClose'
    | 'blockElementOpen'
    | 'blockElementClose'
    | 'stripTag';
declare type Rule = {
    name: Name;
    process?: (textToProcess: string, replacement: Replacement) => string;
    regex?: RegExp;
    replacement: Replacement | string;
    pre?: (input: string) => string;
    post?: (input: string) => string;
};

declare type ExtrasObject = {
    reportIDToName?: Record<string, string>;
    accountIDToName?: Record<string, string>;
};
export default class ExpensiMark {
    rules: Rule[];
    htmlToMarkdownRules: Rule[];
    htmlToTextRules: Rule[];
    constructor();
    /**
     * Replaces markdown with html elements
     *
     * @param text - Text to parse as markdown
     * @param options - Options to customize the markdown parser
     * @param options.filterRules=[] - An array of name of rules as defined in this class.
     * If not provided, all available rules will be applied. If provided, only the rules in the array will be applied.
     * @param options.disabledRules=[] - An array of name of rules as defined in this class.
     * If not provided, all available rules will be applied. If provided, the rules in the array will be skipped.
     * @param options.shouldEscapeText=true - Whether or not the text should be escaped
     * @param options.shouldKeepRawInput=false - Whether or not the raw input should be kept and returned
     */
    replace(
        text: string,
        {
            filterRules,
            shouldEscapeText,
            shouldKeepRawInput,
        }?: {
            filterRules?: Name[];
            disabledRules?: Name[];
            shouldEscapeText?: boolean;
            shouldKeepRawInput?: boolean;
        },
    ): string;
    /**
     * Checks matched URLs for validity and replace valid links with html elements
     *
     * @param regex
     * @param textToCheck
     * @param replacement
     */
    modifyTextForUrlLinks(regex: RegExp, textToCheck: string, replacement: Replacement): string;
    /**
     * Checks matched Emails for validity and replace valid links with html elements
     *
     * @param regex
     * @param textToCheck
     * @param replacement
     */
    modifyTextForEmailLinks(regex: RegExp, textToCheck: string, replacement: Replacement): string;
    /**
     * replace block element with '\n' if :
     * 1. We have text within the element.
     * 2. The text does not end with a new line.
     * 3. The text does not have quote mark '>' .
     * 4. It's not the last element in the string.
     *
     * @param htmlString
     */
    replaceBlockElementWithNewLine(htmlString: string): string;
    /**
     * Replaces HTML with markdown
     *
     * @param htmlString
     * @param extras
     */
    htmlToMarkdown(htmlString: string, extras?: ExtrasObject): string;
    /**
     * Convert HTML to text
     *
     * @param htmlString
     * @param extras
     */
    htmlToText(htmlString: string, extras?: ExtrasObject): string;
    /**
     * Modify text for Quotes replacing chevrons with html elements
     *
     * @param regex
     * @param textToCheck
     * @param replacement
     */
    modifyTextForQuote(regex: RegExp, textToCheck: string, replacement: Replacement): string;
    /**
     * Format the content of blockquote if the text matches the regex or else just return the original text
     *
     * @param regex
     * @param textToCheck
     * @param replacement
     */
    formatTextForQuote(regex: RegExp, textToCheck: string, replacement: Replacement): string;
    /**
     * Check if the input text includes only the open or the close tag of an element.
     *
     * @param textToCheck - Text to check
     */
    containsNonPairTag(textToCheck: string): boolean;
    extractLinksInMarkdownComment(comment: string): string[] | undefined;
    /**
     * Compares two markdown comments and returns a list of the links removed in a new comment.
     *
     * @param oldComment
     * @param newComment
     */
    getRemovedMarkdownLinks(oldComment: string, newComment: string): string[];
}
export {};
