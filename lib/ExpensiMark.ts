'worklet';

import Str from './str';
import * as Constants from './CONST';
import * as UrlPatterns from './Url';
import Logger from './Logger';
import * as Utils from './utils';

type Extras = {
    reportIDToName?: Record<string, string>;
    accountIDToName?: Record<string, string>;

    /**
     * @deprecated Replaced with mediaAttributeCachingFn
     */
    cacheVideoAttributes?: (vidSource: string, attrs: string) => void;

    /**
     * @deprecated Replaced with mediaAttributeCache
     */
    videoAttributeCache?: Record<string, string>;

    /**
     * Function used to cache HTML tag attributes during conversion to and from Markdown
     * @param mediaSource URI to media source
     * @param attrs Additional attributes to be cached
     */
    mediaAttributeCachingFn?: (mediaSource: string, attrs: string) => void;

    /**
     * Key/value cache for HTML tag attributes, where the key is media source URI, value is cached attributes
     */
    mediaAttributeCache?: Record<string, string>;
};
export type {Extras};

const EXTRAS_DEFAULT = {};

type ReplacementFn = (extras: Extras, ...matches: string[]) => string;
type Replacement = ReplacementFn | string;
type ProcessFn = (textToProcess: string, replacement: Replacement, shouldKeepRawInput: boolean) => string;

type CommonRule = {
    name: string;
    replacement: Replacement;
    rawInputReplacement?: Replacement;
    pre?: (input: string) => string;
    post?: (input: string) => string;
};

type RuleWithRegex = CommonRule & {
    regex: RegExp;
};

type RuleWithProcess = CommonRule & {
    process: ProcessFn;
};

type Rule = RuleWithRegex | RuleWithProcess;

type ReplaceOptions = {
    extras?: Extras;
    filterRules?: string[];
    disabledRules?: string[];
    shouldEscapeText?: boolean;
    shouldKeepRawInput?: boolean;
};

type TruncateOptions = {
    ellipsis?: string;
    truncateLastWord?: boolean;
    slop?: number;
    removeImageTag?: boolean;
};

const MARKDOWN_LINK_REGEX = new RegExp(`\\[([^\\][]*(?:\\[[^\\][]*][^\\][]*)*)]\\(${UrlPatterns.MARKDOWN_URL_REGEX}\\)(?![^<]*(<\\/pre>|<\\/code>))`, 'gi');
const MARKDOWN_IMAGE_REGEX = new RegExp(`\\!(?:\\[([^\\][]*(?:\\[[^\\][]*][^\\][]*)*)])?\\(${UrlPatterns.MARKDOWN_URL_REGEX}\\)(?![^<]*(<\\/pre>|<\\/code>))`, 'gi');

const MARKDOWN_VIDEO_REGEX = new RegExp(
    `\\!(?:\\[([^\\][]*(?:\\[[^\\][]*][^\\][]*)*)])?\\(((${UrlPatterns.MARKDOWN_URL_REGEX})\\.(?:${Constants.CONST.VIDEO_EXTENSIONS.join('|')}))\\)(?![^<]*(<\\/pre>|<\\/code>))`,
    'gi',
);

const SLACK_SPAN_NEW_LINE_TAG = '<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;"></span>';

export default class ExpensiMark {
    getAttributeCache = (extras?: Extras) => {
        if (!extras) {
            return {attrCachingFn: undefined, attrCache: undefined};
        }

        return {
            attrCachingFn: extras.mediaAttributeCachingFn ?? extras.cacheVideoAttributes,
            attrCache: extras.mediaAttributeCache ?? extras.videoAttributeCache,
        };
    };

    static Log = new Logger({
        serverLoggingCallback: () => undefined,
        // eslint-disable-next-line no-console
        clientLoggingCallback: (message) => console.warn(message),
        isDebug: true,
    });

    /**
     * Set the logger to use for logging inside of the ExpensiMark class
     * @param logger - The logger object to use
     */
    static setLogger(logger: Logger) {
        ExpensiMark.Log = logger;
    }

    /** Rules to apply to the text */
    rules: Rule[];

    /**
     * The list of regex replacements to do on a HTML comment for converting it to markdown.
     * Order of rules is important
     */
    htmlToMarkdownRules: RuleWithRegex[];

    /**
     * The list of rules to covert the HTML to text.
     * Order of rules is important
     */
    htmlToTextRules: RuleWithRegex[];

    /**
     * The list of rules that we have to exclude in shouldKeepWhitespaceRules list.
     */
    whitespaceRulesToDisable = ['newline', 'replacepre', 'replacebr', 'replaceh1br'];

    /**
     * The list of rules that have to be applied when shouldKeepWhitespace flag is true.
     */
    filterRules: (rule: Rule) => boolean;

    /**
     * Filters rules to determine which should keep whitespace.
     */
    shouldKeepWhitespaceRules: Rule[];

    /**
     * maxQuoteDepth is the maximum depth of nested quotes that we want to support.
     */
    maxQuoteDepth: number;

    /**
     * currentQuoteDepth is the current depth of nested quotes that we are processing.
     */
    currentQuoteDepth: number;

    constructor() {
        /**
         * The list of regex replacements to do on a comment. Check the link regex is first so links are processed
         * before other delimiters
         */
        this.rules = [
            // Apply the emoji first avoid applying any other formatting rules inside of it
            {
                name: 'emoji',
                regex: Constants.CONST.REG_EXP.EMOJI_RULE,
                replacement: (_extras, match) => `<emoji>${match}</emoji>`,
            },

            /**
             * Apply the mermaid-chart rule before the generic code-fence to process Mermaid code blocks specifically
             * Converts ```mermaid blocks to mermaid-chart tags
             */
            {
                name: 'mermaidChart',

                // &#x60; is a backtick symbol we are matching on three of them, followed by 'mermaid', then content, then closing backticks
                regex: /(&#x60;&#x60;&#x60;mermaid.*?(\r\n|\n))((?:\s*?(?!(?:\r\n|\n)?&#x60;&#x60;&#x60;(?!&#x60;))[\S])+\s*?(?:\r\n|\n))(&#x60;&#x60;&#x60;)/g,

                // Extract the chart content and create a mermaid-chart tag with the content as an attribute
                replacement: (_extras, _match, _g1, _g2, chartContent) => {
                    // Clean up the chart content and preserve newlines by encoding them
                    const cleanContent = chartContent.trim();
                    // Replace newlines with a placeholder that won't be stripped by escapeAttributeContent
                    const contentWithEncodedNewlines = cleanContent.replace(/\r?\n/g, '__MERMAID_NEWLINE__');
                    const escapedContent = this.escapeAttributeContent(contentWithEncodedNewlines);
                    return `<mermaid-chart data-mermaid-chart="${escapedContent}"></mermaid-chart>`;
                },
                rawInputReplacement: (_extras, _match, _g1, newLineCharacter, chartContent) => {
                    // Clean up the chart content and preserve newlines by encoding them
                    const cleanContent = chartContent.trim();
                    // Replace newlines with a placeholder that won't be stripped by escapeAttributeContent
                    const contentWithEncodedNewlines = cleanContent.replace(/\r?\n/g, '__MERMAID_NEWLINE__');
                    const escapedContent = this.escapeAttributeContent(contentWithEncodedNewlines);
                    return `<mermaid-chart data-mermaid-chart="${escapedContent}"></mermaid-chart>`;
                },
            },

            /**
             * Apply the code-fence to avoid replacing anything inside of it that we're not supposed to
             * (aka any rule with the '(?![^<]*<\/pre>)' avoidance in it
             */
            {
                name: 'codeFence',

                // &#x60; is a backtick symbol we are matching on three of them before then after a new line character
                regex: /(&#x60;&#x60;&#x60;.*?(\r\n|\n))((?:\s*?(?!(?:\r\n|\n)?&#x60;&#x60;&#x60;(?!&#x60;))[\S])+\s*?(?:\r\n|\n))(&#x60;&#x60;&#x60;)/g,

                // We're using a function here to perform an additional replace on the content
                // inside the backticks because Android is not able to use <pre> tags and does
                // not respect whitespace characters at all like HTML does. We do not want to mess
                // with the new lines here since they need to be converted into <br>. And we don't
                // want to do this anywhere else since that would break HTML.
                // &nbsp; will create styling issues so use &#32;
                replacement: (_extras, _match, _g1, _g2, textWithinFences) => {
                    const group = textWithinFences.replace(/(?:(?![\n\r])\s)/g, '&#32;');
                    return `<pre>${group}</pre>`;
                },
                rawInputReplacement: (_extras, _match, _g1, newLineCharacter, textWithinFences) => {
                    const group = textWithinFences.replace(/(?:(?![\n\r])\s)/g, '&#32;').replace(/<emoji>|<\/emoji>/g, '');
                    return `<pre>${newLineCharacter}${group}</pre>`;
                },
            },

            /**
             * Converts markdown style video to video tags e.g. ![Expensify](https://www.expensify.com/attachment.mp4)
             * We need to convert before image rules since they will not try to create a image tag from an existing video URL
             * Extras arg could contain the attribute cache for the video tag which is cached during the html-to-markdown conversion
             */
            {
                name: 'video',
                regex: MARKDOWN_VIDEO_REGEX,
                /**
                 * @param extras - The extras object
                 * @param videoName - The first capture group - video name
                 * @param videoSource - The second capture group - video URL
                 * @return Returns the HTML video tag
                 */
                replacement: (extras, _match, videoName, videoSource) => {
                    const attrCache = this.getAttributeCache(extras).attrCache;
                    const extraAttrs = attrCache && attrCache[videoSource];
                    return `<video data-expensify-source="${Str.sanitizeURL(videoSource)}" ${extraAttrs || ''}>${videoName ? `${videoName}` : ''}</video>`;
                },
                rawInputReplacement: (extras, _match, videoName, videoSource) => {
                    const attrCache = this.getAttributeCache(extras).attrCache;
                    const extraAttrs = attrCache && attrCache[videoSource];
                    return `<video data-expensify-source="${Str.sanitizeURL(videoSource)}" data-raw-href="${videoSource}" data-link-variant="${typeof videoName === 'string' ? 'labeled' : 'auto'}" ${extraAttrs || ''}>${videoName ? `${videoName}` : ''}</video>`;
                },
            },

            /**
             * Apply inline code-block to avoid applying any other formatting rules inside of it,
             * like we do for the multi-line code-blocks
             */
            {
                name: 'inlineCodeBlock',

                // Use the url escaped version of a backtick (`) symbol. Mobile platforms do not support lookbehinds,
                // so capture the first and third group and place them in the replacement.
                // but we should not replace backtick symbols if they include <pre> tags between them.
                // At least one non-whitespace character or a specific whitespace character (" " and "\u00A0")
                // must be present inside the backticks.
                regex: /(\B|_|)&#x60;(.*?)&#x60;(\B|_|)(?!(?!<pre>)[^<]*(?:<(?!pre>)[^<]*)*<\/pre>|[^<]*<\/video>)/gm,
                replacement: (_extras, match, g1, g2, g3) => {
                    const g2Value = g2.trim() === '' ? g2.replaceAll(' ', '&nbsp;') : g2;
                    if (!g2Value) {
                        return match;
                    }
                    return `${g1}<code>${g2Value}</code>${g3}`;
                },
                rawInputReplacement: (_extras, match, g1, g2, g3) => (g2 ? `${g1}<code>${g2}</code>${g3}` : match),
            },

            /**
             * Converts markdown style links to anchor tags e.g. [Expensify](concierge@expensify.com)
             * We need to convert before the auto email link rule and the manual link rule since it will not try to
             * create a link from an existing anchor tag.
             */
            {
                name: 'email',
                process: (textToProcess, replacement, shouldKeepRawInput) => {
                    const regex = new RegExp(`(?!\\[\\s*\\])\\[([^[\\]]*)]\\((mailto:)?${Constants.CONST.REG_EXP.MARKDOWN_EMAIL}\\)`, 'gim');
                    return this.modifyTextForEmailLinks(regex, textToProcess, replacement as ReplacementFn, shouldKeepRawInput);
                },
                replacement: (_extras, match, g1, g2) => {
                    if (!g1.trim()) {
                        return match;
                    }
                    const label = g1.trim();
                    const href = `mailto:${g2}`;
                    const formattedLabel = label === href ? g2 : label;
                    return `<a href="${href}">${formattedLabel}</a>`;
                },
                rawInputReplacement: (_extras, match, g1, g2, g3) => {
                    if (!g1.trim()) {
                        return match;
                    }

                    const dataRawHref = g2 ? g2 + g3 : g3;
                    const href = `mailto:${g3}`;
                    return `<a href="${href}" data-raw-href="${dataRawHref}" data-link-variant="labeled">${g1}</a>`;
                },
            },

            {
                name: 'heading1',
                process: (textToProcess, replacement, shouldKeepRawInput = false) => {
                    const regexp = shouldKeepRawInput ? /^# ( *(?! )(?:(?!<pre>|<video>|\n|\r\n).)+)/gm : /^# +(?! )((?:(?!<pre>|<video>|\n|\r\n).)+)/gm;
                    return this.replaceTextWithExtras(textToProcess, regexp, EXTRAS_DEFAULT, replacement);
                },
                replacement: '<h1>$1</h1>',
            },

            /**
             * Converts markdown style images to image tags e.g. ![Expensify](https://www.expensify.com/attachment.png)
             * We need to convert before linking rules since they will not try to create a link from an existing img
             * tag.
             * Additional sanitization is done to the alt attribute to prevent parsing it further to html by later
             * rules.
             * Additional tags from cache are applied to the result HTML.
             */
            {
                name: 'image',
                regex: MARKDOWN_IMAGE_REGEX,
                replacement: (extras, _match, imgAlt, imgSource) => {
                    const attrCache = this.getAttributeCache(extras).attrCache;
                    const extraAttrs = attrCache && attrCache[imgSource];
                    return `<img src="${Str.sanitizeURL(imgSource)}"${imgAlt ? ` alt="${this.escapeAttributeContent(imgAlt)}"` : ''} ${extraAttrs || ''}/>`;
                },
                rawInputReplacement: (extras, _match, imgAlt, imgSource) => {
                    const attrCache = this.getAttributeCache(extras).attrCache;
                    const extraAttrs = attrCache && attrCache[imgSource];
                    return `<img src="${Str.sanitizeURL(imgSource)}"${imgAlt ? ` alt="${this.escapeAttributeContent(imgAlt)}"` : ''} data-raw-href="${imgSource}" data-link-variant="${typeof imgAlt === 'string' ? 'labeled' : 'auto'}" ${extraAttrs || ''}/>`;
                },
            },

            /**
             * Converts markdown style links to anchor tags e.g. [Expensify](https://www.expensify.com)
             * We need to convert before the autolink rule since it will not try to create a link
             * from an existing anchor tag.
             */
            {
                name: 'link',
                process: (textToProcess, replacement) => this.modifyTextForUrlLinks(MARKDOWN_LINK_REGEX, textToProcess, replacement as ReplacementFn),
                replacement: (_extras, match, g1, g2) => {
                    if (!g1.trim()) {
                        return match;
                    }
                    return `<a href="${Str.sanitizeURL(g2)}" target="_blank" rel="noreferrer noopener">${g1.trim()}</a>`;
                },
                rawInputReplacement: (_extras, match, g1, g2) => {
                    if (!g1.trim()) {
                        return match;
                    }
                    return `<a href="${Str.sanitizeURL(g2)}" data-raw-href="${g2}" data-link-variant="labeled" target="_blank" rel="noreferrer noopener">${g1}</a>`;
                },
            },

            /**
             * Apply the hereMention first because the string @here is still a valid mention for the userMention regex.
             * This ensures that the hereMention is always considered first, even if it is followed by a valid
             * userMention.
             *
             * Also, apply the mention rule after email/link to prevent mention appears in an email/link.
             */
            {
                name: 'hereMentions',
                regex: /([a-zA-Z0-9.!$%&+/=?^`{|}_-]?)(@here)([.!$%&+/=?^`{|}_-]?)(?=\b)(?!([\w'#%+-]*@(?:[a-z\d-]+\.)+[a-z]{2,}(?:\s|$|@here))|((?:(?!<a).)+)?<\/a>|[^<]*(<\/pre>|<\/code>))/gm,
                replacement: (_extras, match, g1, g2, g3) => {
                    if (!Str.isValidMention(match)) {
                        return match;
                    }
                    return `${g1}<mention-here>${g2}</mention-here>${g3}`;
                },
            },

            /**
             * A room mention is a string that starts with the '#' symbol and is followed by a valid room name.
             *
             * Note: We are allowing mentions in a format of #room-name The room name can contain any
             * combination of letters and hyphens
             */
            {
                name: 'reportMentions',

                regex: /(?<=^[*~_:]?|[ \n][*~_:]?|[:#])(#[\p{Ll}0-9-]{1,99})(?![^<]*(?:<\/pre>|<\/code>|<\/a>))/gimu,
                replacement: '<mention-report>$1</mention-report>',
            },

            /**
             * This regex matches a valid user mention in a string.
             * A user mention is a string that starts with the '@' symbol and is followed by a valid user's primary
             * login
             *
             * Note: currently we are only allowing mentions in a format of @+19728974297 (E.164 format phone number)
             * and @username@example.com The username can contain any combination of alphanumeric letters, numbers, and
             * underscores
             */
            {
                name: 'userMentions',
                regex: new RegExp(
                    `${Constants.CONST.REG_EXP.PRE_MENTION_TEXT_PART}(@${Constants.CONST.REG_EXP.EMAIL_PART}|@${Constants.CONST.REG_EXP.PHONE_PART})(?!((?:(?!<a).)+)?<\\/a>|[^<]*(<\\/pre>|<\\/code>))`,
                    'gim',
                ),
                replacement: (_extras, match, g1, g2) => {
                    const phoneNumberRegex = new RegExp(`^${Constants.CONST.REG_EXP.PHONE_PART}$`);
                    const mention = g2.slice(1);
                    const mentionWithoutSMSDomain = Str.removeSMSDomain(mention);
                    if (!Str.isValidMention(match) || (phoneNumberRegex.test(mentionWithoutSMSDomain) && !Str.isValidPhoneNumber(mentionWithoutSMSDomain))) {
                        return match;
                    }
                    const phoneRegex = new RegExp(`^@${Constants.CONST.REG_EXP.PHONE_PART}$`);
                    return `${g1}<mention-user>${g2}${phoneRegex.test(g2) ? `@${Constants.CONST.SMS.DOMAIN}` : ''}</mention-user>`;
                },
                rawInputReplacement: (_extras, match, g1, g2) => {
                    const phoneNumberRegex = new RegExp(`^${Constants.CONST.REG_EXP.PHONE_PART}$`);
                    const mention = g2.slice(1);
                    const mentionWithoutSMSDomain = Str.removeSMSDomain(mention);
                    if (!Str.isValidMention(match) || (phoneNumberRegex.test(mentionWithoutSMSDomain) && !Str.isValidPhoneNumber(mentionWithoutSMSDomain))) {
                        return match;
                    }
                    return `${g1}<mention-user>${g2}</mention-user>`;
                },
            },

            {
                name: 'hereMentionAfterUserMentions',
                regex: /(<\/mention-user>)(@here)(?=\b)/gm,
                replacement: '$1<mention-here>$2</mention-here>',
            },

            /**
             * Automatically link urls. Runs last of our linkers since we want anything manual to link before this,
             * and we do not want to break emails.
             */
            {
                name: 'autolink',

                process: (textToProcess, replacement) => {
                    const regex = new RegExp(`(?![^<]*>|[^<>]*<\\/(?!h1>))([_*~]*?)${UrlPatterns.MARKDOWN_URL_REGEX}\\1(?!((?:(?!<a).)+)?<\\/a>|[^<]*(<\\/pre>|<\\/code>))`, 'gi');
                    return this.modifyTextForUrlLinks(regex, textToProcess, replacement as ReplacementFn);
                },

                replacement: (_extras, _match, g1, g2) => {
                    const href = Str.sanitizeURL(g2);
                    return `${g1}<a href="${href}" target="_blank" rel="noreferrer noopener">${g2}</a>${g1}`;
                },
                rawInputReplacement: (_extras, _match, g1, g2) => {
                    const href = Str.sanitizeURL(g2);
                    return `${g1}<a href="${href}" data-raw-href="${g2}" data-link-variant="auto" target="_blank" rel="noreferrer noopener">${g2}</a>${g1}`;
                },
            },

            {
                name: 'quote',

                // We also want to capture a blank line before or after the quote so that we do not add extra spaces.
                // block quotes naturally appear on their own line. Blockquotes should not appear in code fences or
                // inline code blocks. A single prepending space should be stripped if it exists
                process: (textToProcess, replacement, shouldKeepRawInput = false) => {
                    const regex = /^(?:&gt;)+ +(?! )(?![^<]*(?:<\/pre>|<\/code>|<\/video>))([^\v\n\r]*)/gm;

                    let replacedText = this.replaceTextWithExtras(textToProcess, regex, EXTRAS_DEFAULT, replacement);
                    if (shouldKeepRawInput) {
                        return replacedText;
                    }

                    for (let i = this.maxQuoteDepth; i > 0; i--) {
                        replacedText = replacedText.replaceAll(`${'</blockquote>'.repeat(i)}\n${'<blockquote>'.repeat(i)}`, '\n');
                    }
                    replacedText = replacedText.replaceAll('</blockquote>\n', '</blockquote>');
                    return replacedText;
                },
                replacement: (_extras, g1) => {
                    const {replacedText} = this.replaceQuoteText(g1, false);
                    return `<blockquote>${replacedText || ' '}</blockquote>`;
                },
                rawInputReplacement: (_extras, g1) => {
                    const {replacedText, shouldAddSpace} = this.replaceQuoteText(g1, true);
                    return `<blockquote>${shouldAddSpace ? ' ' : ''}${replacedText}</blockquote>`;
                },
            },
            /**
             * Use \b in this case because it will match on words, letters,
             * and _: https://www.rexegg.com/regex-boundaries.html#wordboundary
             * Use [\s\S]* instead of .* to match newline
             */
            {
                name: 'italic',
                regex: /(<(pre|code|a|mention-user|video)[^>]*>(.*?)<\/\2>)|((\b_+|\b|(?<=_)(?<!\b[^\W_]*_))_((?![\s_])[\s\S]*?[^\s_](?<!\s))_(?![^\W_])(?![^<]*>)(?![^<]*(<\/pre>|<\/code>|<\/a>|<\/mention-user>|<\/video>)))/g,
                replacement: (_extras, match, html, tag, content, text, extraLeadingUnderscores, textWithinUnderscores) => {
                    // Skip any <pre>, <code>, <a>, <mention-user>, <video> tag contents
                    if (html) {
                        return html;
                    }

                    // If any tags are included inside underscores, ignore it. ie. _abc <pre>pre tag</pre> abc_
                    if (textWithinUnderscores.includes('</pre>') || this.containsNonPairTag(textWithinUnderscores)) {
                        return match;
                    }

                    if (String(textWithinUnderscores).match(`^${Constants.CONST.REG_EXP.MARKDOWN_EMAIL}`)) {
                        return `<em>${extraLeadingUnderscores}${textWithinUnderscores}</em>`;
                    }
                    return `${extraLeadingUnderscores}<em>${textWithinUnderscores}</em>`;
                },
            },

            /**
             * Automatically links emails that are not in a link. Runs before the autolinker as it will not link an
             * email that is in a link
             * Prevent emails from starting with [~_*]. Such emails should not be supported.
             */
            {
                name: 'autoEmail',
                regex: new RegExp(`([^\\w'#%+-]|^)${Constants.CONST.REG_EXP.MARKDOWN_EMAIL}(?!((?:(?!<a).)+)?<\\/a>|[^<>]*<\\/(?!em|h1|blockquote))`, 'gim'),
                replacement: '$1<a href="mailto:$2">$2</a>',
                rawInputReplacement: '$1<a href="mailto:$2" data-raw-href="$2" data-link-variant="auto">$2</a>',
            },

            /**
             * This regex matches a short user mention in a string.
             * A short-mention is a string that starts with the '@' symbol and is followed by a valid user's primary login without the email domain part
             * Ex: @john.doe, @user12345, but NOT @user@email.com
             *
             * Notes:
             * Phone is not a valid short mention.
             * In reality these "short-mentions" are just possible candidates, because the parser has no way of verifying if there exists a user named ex: @john.examplename.
             * The actual verification whether these mentions are pointing to real users is done in specific projects using ExpensiMark.
             * Nevertheless, "@john.examplename" is a correct possible short-mention, and so would be parsed.
             * This behaviour is similar to treating every user@something as valid user login.
             *
             * This regex will correctly preserve any @here mentions, the same way as "userMention" rule.
             */
            {
                name: 'shortMentions',

                regex: new RegExp(
                    `${Constants.CONST.REG_EXP.PRE_MENTION_TEXT_PART}(@(?=((?=[\\w]+[\\w'#%+-]+(?:\\.[\\w'#%+-]+)*)[\\w\\.'#%+-]{1,64}(?= |_|\\b))(?!([:\\/\\\\]))(?<end>.*))(?!here)\\S{3,254}(?=\\k<end>$))(?!((?:(?!<a).)+)?<\\/a>|[^<]*(<\\/pre>|<\\/code>|<\\/mention-user>|<\\/mention-here>))`,
                    'gim',
                ),
                replacement: (_extras, match, g1, g2) => {
                    if (!Str.isValidMention(match)) {
                        return match;
                    }
                    return `${g1}<mention-short>${g2}</mention-short>`;
                },
            },

            {
                name: 'hereMentionAfterShortMentions',
                regex: /(<\/mention-short>)(@here)(?=\b)/gm,
                replacement: '$1<mention-here>$2</mention-here>',
            },

            {
                // Use \B in this case because \b doesn't match * or ~.
                // \B will match everything that \b doesn't, so it works
                // for * and ~: https://www.rexegg.com/regex-boundaries.html#notb
                name: 'bold',
                regex: /(?<!<[^>]*)(\b_|\B)\*(?!(?:<\/em))(?![^<]*(?:<\/pre>|<\/code>|<\/a>|<\/video>))((?![\s*])[\s\S]*?[^\s*](?<!\s))\*\B(?![^<]*>)(?![^<]*(<\/pre>|<\/code>|<\/a>|<\/video>))/g,
                replacement: (_extras, match, g1, g2) => {
                    if (g1.includes('_')) {
                        return `${g1}<strong>${g2}</strong>`;
                    }

                    return g2.includes('</pre>') || this.containsNonPairTag(g2) ? match : `<strong>${g2}</strong>`;
                },
            },
            {
                name: 'strikethrough',
                regex: /(?<!<[^>]*)\B~((?![\s~])[\s\S]*?[^\s~](?<!\s))~\B(?![^<]*>)(?![^<]*(<\/pre>|<\/code>|<\/a>|<\/video>))/g,
                replacement: (_extras, match, g1) => (g1.includes('</pre>') || this.containsNonPairTag(g1) ? match : `<del>${g1}</del>`),
            },
            {
                name: 'newline',
                regex: /\r?\n/g,
                replacement: '<br />',
            },
            {
                // We're removing <br /> because when </pre> and <br /> occur together, an extra line is added.
                name: 'replacepre',
                regex: /<\/pre>\s*<br\s*[/]?>/gi,
                replacement: '</pre>',
            },
            {
                // We're removing <br /> because when <h1> and <br /> occur together, an extra line is added.
                name: 'replaceh1br',
                regex: /<\/h1><br\s*[/]?>/gi,
                replacement: '</h1>',
            },
        ];

        /**
         * The list of regex replacements to do on a HTML comment for converting it to markdown.
         * Order of rules is important
         */
        this.htmlToMarkdownRules = [
            // Used to Exclude tags
            {
                name: 'replacepre',
                regex: /<\/pre>(.)/gi,
                replacement: '</pre><br />$1',
            },
            {
                name: 'exclude',
                regex: new RegExp(['<(script|style)(?:"[^"]*"|\'[^\']*\'|[^\'">])*>([\\s\\S]*?)<\\/\\1>', '(?![^<]*(<\\/pre>|<\\/code>))(\n|\r\n)?'].join(''), 'gim'),
                replacement: '',
            },
            {
                name: 'nested',
                regex: /<(pre)(?:"[^"]*"|'[^']*'|[^'">])*><(div|code)(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\2><\/pre>/gi,
                replacement: '<pre>$3</pre>',
            },
            {
                name: 'newline',

                // Replaces open and closing <br><br/> tags with a single <br/>
                // Slack uses special <span> tag for empty lines instead of <br> tag
                pre: (inputString) =>
                    inputString
                        .replace('<br></br>', '<br/>')
                        .replace('<br><br/>', '<br/>')
                        .replace(/(<tr.*?<\/tr>)/g, '$1<br/>')
                        .replace('<br/></tbody>', '')
                        .replace(SLACK_SPAN_NEW_LINE_TAG + SLACK_SPAN_NEW_LINE_TAG, '<br/><br/><br/>')
                        .replace(SLACK_SPAN_NEW_LINE_TAG, '<br/><br/>'),

                // Include the immediately followed newline as `<br>\n` should be equal to one \n.
                regex: /<br(?:"[^"]*"|'[^']*'|[^'"><])*>\n?/gi,
                replacement: '\n',
            },
            {
                name: 'heading1',
                regex: /[^\S\r\n]*<(h1)(?:"[^"]*"|'[^']*'|[^'">])*>(.*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: '<h1># $2</h1>',
            },
            {
                name: 'listItem',
                regex: /\s*<(li)(?:"[^"]*"|'[^']*'|[^'">])*>(.*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))\s*/gi,
                replacement: '<li>  $2</li>',
            },

            // Use [\s\S]* instead of .* to match newline
            {
                name: 'italic',
                regex: /<(em|i)\b(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: '_$2_',
            },
            {
                name: 'bold',
                regex: /<(b|strong)\b(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: (extras, match, tagName, innerContent) => {
                    // To check if style attribute contains bold font-weight
                    const isBoldFromStyle = (style: string | null) => {
                        return style ? style.replace(/\s/g, '').includes('font-weight:bold;') || style.replace(/\s/g, '').includes('font-weight:700;') : false;
                    };

                    const updateSpacesAndWrapWithAsterisksIfBold = (content: string, isBold: boolean) => {
                        const trimmedContent = content.trim();
                        const leadingSpace = content.startsWith(' ') ? ' ' : '';
                        const trailingSpace = content.endsWith(' ') ? ' ' : '';
                        return isBold ? `${leadingSpace}*${trimmedContent}*${trailingSpace}` : content;
                    };

                    // Determine if the outer tag is bold
                    const fontWeightRegex = /style="([^"]*?\bfont-weight:\s*(\d+|bold|normal)[^"]*?)"/;
                    const styleAttributeMatch = match.match(fontWeightRegex);
                    const isFontWeightBold = isBoldFromStyle(styleAttributeMatch ? styleAttributeMatch[1] : null);
                    const isBold = styleAttributeMatch ? isFontWeightBold : tagName === 'b' || tagName === 'strong';

                    // Process nested spans with potential bold style
                    const processedInnerContent = innerContent.replace(/<span(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/span>/gi, (nestedMatch, nestedContent) => {
                        const nestedStyleMatch = nestedMatch.match(fontWeightRegex);
                        const isNestedBold = isBoldFromStyle(nestedStyleMatch ? nestedStyleMatch[1] : null);
                        return updateSpacesAndWrapWithAsterisksIfBold(nestedContent, isNestedBold);
                    });

                    return updateSpacesAndWrapWithAsterisksIfBold(processedInnerContent, isBold);
                },
            },
            {
                name: 'strikethrough',
                regex: /<(del|s)(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: '~$2~',
            },
            {
                name: 'quote',
                regex: /<(blockquote|q)(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: (_extras, _match, _g1, g2) => {
                    // We remove the line break before heading inside quote to avoid adding extra line
                    let resultString: string[] | string = g2
                        .replace(/\n?(<h1># )/g, '$1')
                        .replace(/(<h1>|<\/h1>)+/g, '\n')
                        .trim()
                        .split('\n');

                    // Wrap each string in the array with <blockquote> and </blockquote>
                    resultString = resultString.map((line) => {
                        return `<blockquote>${line}</blockquote>`;
                    });

                    resultString = resultString
                        .map((text) => {
                            let modifiedText = text;
                            let depth;
                            do {
                                depth = (modifiedText.match(/<blockquote>/gi) || []).length;
                                modifiedText = modifiedText.replace(/<blockquote>/gi, '');
                                modifiedText = modifiedText.replace(/<\/blockquote>/gi, '');
                            } while (/<blockquote>/i.test(modifiedText));
                            return `${'>'.repeat(depth)} ${modifiedText}`;
                        })
                        .join('\n');

                    // We want to keep <blockquote> tag here and let method replaceBlockElementWithNewLine to handle the line break later
                    return `<blockquote>${resultString}</blockquote>`;
                },
            },
            {
                name: 'inlineCodeBlock',
                regex: /<(code)(?:"[^"]*"|'[^']*'|[^'">])*>(.*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: '`$2`',
            },
            {
                name: 'codeFence',
                regex: /<(pre)(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)(\n?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: (_extras, _match, _g1, g2) => `\`\`\`\n${g2}\n\`\`\``,
            },
            {
                name: 'anchor',
                regex: /<(a)[^><]*href\s*=\s*(['"])(.*?)\2(?:".*?"|'.*?'|[^'"><])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: (_extras, _match, _g1, _g2, g3, g4) => {
                    const email = g3.startsWith('mailto:') ? g3.slice(7) : '';
                    if (email === g4) {
                        return email;
                    }
                    return `[${g4}](${email || g3})`;
                },
            },

            {
                name: 'image',
                regex: /<img[^><]*src\s*=\s*(['"])(.*?)\1(.*?)>(?![^<][\s\S]*?(<\/pre>|<\/code>))/gi,
                /**
                 * @param extras - The extras object
                 * @param _match - The full match
                 * @param _g1 - The first capture group (the quote)
                 * @param imgSource - The second capture group - src attribute value
                 * @param imgAttrs - The third capture group - any attributes after src
                 * @returns The markdown image tag
                 */
                replacement: (extras, _match, _g1, imgSource, imgAttrs) => {
                    // Extract alt attribute from imgAttrs
                    let altText = '';
                    const altRegex = /alt\s*=\s*(['"])(.*?)\1/i;
                    const altMatch = imgAttrs.match(altRegex);
                    const attrCachingFn = this.getAttributeCache(extras).attrCachingFn;
                    let attributes = imgAttrs;
                    if (altMatch) {
                        altText = altMatch[2];
                        // Remove the alt attribute from imgAttrs
                        attributes = attributes.replace(altRegex, '');
                    }
                    // Remove trailing slash and extra whitespace
                    attributes = attributes.replace(/\s*\/\s*$/, '').trim();
                    // Cache attributes without alt and trailing slash
                    if (imgAttrs && attrCachingFn && typeof attrCachingFn === 'function') {
                        attrCachingFn(imgSource, attributes);
                    }
                    // Return the markdown image tag
                    if (altText) {
                        return `![${altText}](${imgSource})`;
                    }
                    return `!(${imgSource})`;
                },
            },

            {
                name: 'video',
                regex: /<video[^><]*data-expensify-source\s*=\s*(['"])(\S*?)\1(.*?)>([^><]*)<\/video>*(?![^<][\s\S]*?(<\/pre>|<\/code>))/gi,
                /**
                 * @param extras - The extras object
                 * @param match The full match
                 * @param _g1 The first capture group
                 * @param videoSource - the second capture group - video source (video URL)
                 * @param videoAttrs - the third capture group - video attributes (data-expensify-width, data-expensify-height, etc...)
                 * @param videoName - the fourth capture group will be the video file name (the text between opening and closing video tags)
                 * @returns The markdown video tag
                 */
                replacement: (extras, _match, _g1, videoSource, videoAttrs, videoName) => {
                    const attrCachingFn = this.getAttributeCache(extras).attrCachingFn;

                    if (videoAttrs && attrCachingFn && typeof attrCachingFn === 'function') {
                        attrCachingFn(videoSource, videoAttrs);
                    }
                    if (videoName) {
                        return `![${videoName}](${videoSource})`;
                    }

                    return `!(${videoSource})`;
                },
            },

            {
                name: 'reportMentions',
                regex: /<mention-report reportID="?(\d+)"?(?: *\/>|><\/mention-report>)/gi,
                replacement: (extras, _match, g1, _offset, _string) => {
                    const reportToNameMap = extras.reportIDToName;
                    if (!reportToNameMap || !reportToNameMap[g1]) {
                        ExpensiMark.Log.alert('[ExpensiMark] Missing report name', {reportID: g1});
                        return '#Hidden';
                    }

                    return reportToNameMap[g1];
                },
            },
            {
                name: 'userMention',
                regex: /(?:<mention-user accountID="?(\d+)"?(?: *\/>|><\/mention-user>))|(?:<mention-user>(.*?)<\/mention-user>)/gi,
                replacement: (extras, _match, g1, g2, _offset, _string) => {
                    if (g1) {
                        const accountToNameMap = extras.accountIDToName;
                        if (!accountToNameMap || !accountToNameMap[g1]) {
                            ExpensiMark.Log.alert('[ExpensiMark] Missing account name', {accountID: g1});
                            return '@Hidden';
                        }

                        return `@${Str.removeSMSDomain(extras.accountIDToName?.[g1] ?? '')}`;
                    }
                    return Str.removeSMSDomain(g2);
                },
            },
        ];

        /**
         * The list of rules to covert the HTML to text.
         * Order of rules is important
         */
        this.htmlToTextRules = [
            {
                name: 'breakline',
                regex: /<br[^>]*>/gi,
                replacement: '\n',
            },
            {
                name: 'blockquoteWrapHeadingOpen',
                regex: /<blockquote><h1>/gi,
                replacement: '<blockquote>',
            },
            {
                name: 'blockquoteWrapHeadingClose',
                regex: /<\/h1><\/blockquote>/gi,
                replacement: '</blockquote>',
            },
            {
                name: 'blockElementOpen',
                regex: /(.|\s)<(blockquote|h1|pre)>/gi,
                replacement: '$1\n',
            },
            {
                name: 'blockElementClose',
                regex: /<\/(blockquote|h1|pre)>(.|\s)/gm,
                replacement: '\n$2',
            },
            {
                name: 'removeStyle',
                regex: /<style>.*?<\/style>/gi,
                replacement: '',
            },
            {
                name: 'image',
                regex: /<img[^><]*src\s*=\s*(['"])(.*?)\1(?:[^><]*alt\s*=\s*(['"])(.*?)\3)?[^><]*>*(?![^<][\s\S]*?(<\/pre>|<\/code>))/gi,
                replacement: '[Attachment]',
            },
            {
                name: 'video',
                regex: /<video[^><]*data-expensify-source\s*=\s*(['"])(\S*?)\1(.*?)>([^><]*)<\/video>*(?![^<][\s\S]*?(<\/pre>|<\/code>))/gi,
                replacement: '[Attachment]',
            },
            {
                name: 'otherAttachments',
                regex: /<a[^><]*data-expensify-source\s*=\s*(['"])(\S*?)\1(.*?)>([^><]*)<\/a>*(?![^<][\s\S]*?(<\/pre>|<\/code>))/gi,
                replacement: '[Attachment]',
            },
            {
                name: 'reportMentions',
                regex: /<mention-report reportID="?(\d+)"?(?: *\/>|><\/mention-report>)/gi,
                replacement: (extras, _match, g1, _offset, _string) => {
                    const reportToNameMap = extras.reportIDToName;
                    if (!reportToNameMap || !reportToNameMap[g1]) {
                        ExpensiMark.Log.alert('[ExpensiMark] Missing report name', {reportID: g1});
                        return '#Hidden';
                    }

                    return reportToNameMap[g1];
                },
            },
            {
                name: 'userMention',
                regex: /(?:<mention-user accountID="?(\d+)"?(?: *\/>|><\/mention-user>))|(?:<mention-user>(.*?)<\/mention-user>)/gi,
                replacement: (extras, _match, g1, g2, _offset, _string) => {
                    if (g1) {
                        const accountToNameMap = extras.accountIDToName;
                        if (!accountToNameMap || !accountToNameMap[g1]) {
                            ExpensiMark.Log.alert('[ExpensiMark] Missing account name', {accountID: g1});
                            return '@Hidden';
                        }
                        return `@${Str.removeSMSDomain(extras.accountIDToName?.[g1] ?? '')}`;
                    }
                    return Str.removeSMSDomain(g2);
                },
            },
            {
                name: 'stripTag',
                regex: /(<([^>]+)>)/gi,
                replacement: '',
            },
        ];

        /**
         * The list of rules that we have to exclude in shouldKeepWhitespaceRules list.
         */
        this.whitespaceRulesToDisable = ['newline', 'replacepre', 'replacebr', 'replaceh1br'];

        /**
         * The list of rules that have to be applied when shouldKeepWhitespace flag is true.
         * @param rule - The rule to check.
         * @returns true if the rule should be applied, otherwise false.
         */
        this.filterRules = (rule: Rule) => !this.whitespaceRulesToDisable.includes(rule.name);

        /**
         * Filters rules to determine which should keep whitespace.
         * @returns The filtered rules.
         */
        this.shouldKeepWhitespaceRules = this.rules.filter(this.filterRules);

        /**
         * maxQuoteDepth is the maximum depth of nested quotes that we want to support.
         */
        this.maxQuoteDepth = 3;

        /**
         * currentQuoteDepth is the current depth of nested quotes that we are processing.
         */
        this.currentQuoteDepth = 0;
    }

    /**
     * Retrieves the HTML ruleset based on the provided filter rules, disabled rules, and shouldKeepRawInput flag.
     * @param filterRules - An array of rule names to filter the ruleset.
     * @param disabledRules - An array of rule names to disable in the ruleset.
     * @param shouldKeepRawInput - A boolean flag indicating whether to keep raw input.
     */
    getHtmlRuleset(filterRules: string[], disabledRules: string[], shouldKeepRawInput: boolean) {
        let rules = this.rules;
        const hasRuleName = (rule: Rule) => filterRules.includes(rule.name);
        const hasDisabledRuleName = (rule: Rule) => !disabledRules.includes(rule.name);
        if (shouldKeepRawInput) {
            rules = this.shouldKeepWhitespaceRules;
        }
        if (filterRules.length > 0) {
            rules = this.rules.filter(hasRuleName);
        }
        if (disabledRules.length > 0) {
            rules = rules.filter(hasDisabledRuleName);
        }
        return rules;
    }

    /**
     * Replaces markdown with html elements
     *
     * @param text - Text to parse as markdown
     * @param [options] - Options to customize the markdown parser
     * @param [options.filterRules=[]] - An array of name of rules as defined in this class.
     * If not provided, all available rules will be applied.
     * @param [options.shouldEscapeText=true] - Whether or not the text should be escaped
     * @param [options.disabledRules=[]] - An array of name of rules as defined in this class.
     * If not provided, all available rules will be applied. If provided, the rules in the array will be skipped.
     */
    replace(text: string, {filterRules = [], shouldEscapeText = true, shouldKeepRawInput = false, disabledRules = [], extras = EXTRAS_DEFAULT}: ReplaceOptions = {}): string {
        // This ensures that any html the user puts into the comment field shows as raw html
        let replacedText = shouldEscapeText ? Utils.escapeText(text) : text;
        const rules = this.getHtmlRuleset(filterRules, disabledRules, shouldKeepRawInput);

        const processRule = (rule: Rule) => {
            // Pre-process text before applying regex
            if (rule.pre) {
                replacedText = rule.pre(replacedText);
            }
            const replacement = shouldKeepRawInput && rule.rawInputReplacement ? rule.rawInputReplacement : rule.replacement;
            if ('process' in rule) {
                replacedText = rule.process(replacedText, replacement, shouldKeepRawInput);
            } else {
                replacedText = this.replaceTextWithExtras(replacedText, rule.regex, extras, replacement);
            }

            // Post-process text after applying regex
            if (rule.post) {
                replacedText = rule.post(replacedText);
            }
        };
        try {
            rules.forEach(processRule);
        } catch (e) {
            ExpensiMark.Log.alert('Error replacing text with html in ExpensiMark.replace', {error: e});

            // We want to return text without applying rules if exception occurs during replacing
            return shouldEscapeText ? Utils.escapeText(text) : text;
        }

        return replacedText;
    }

    /**
     * Checks matched URLs for validity and replace valid links with html elements
     */
    modifyTextForUrlLinks(regex: RegExp, textToCheck: string, replacement: ReplacementFn): string {
        let match = regex.exec(textToCheck);
        let replacedText = '';
        let startIndex = 0;

        while (match !== null) {
            // We end the link at the last closing parenthesis that matches an opening parenthesis because unmatched closing parentheses are unlikely to be in the url
            // and can be part of markdown for example
            let unmatchedOpenParentheses = 0;
            let url = match[2];
            for (let i = 0; i < url.length; i++) {
                if (url[i] === '(') {
                    unmatchedOpenParentheses++;
                } else if (url[i] === ')') {
                    // Unmatched closing parenthesis
                    if (unmatchedOpenParentheses <= 0) {
                        const numberOfCharsToRemove = url.length - i;
                        match[0] = match[0].substr(0, match[0].length - numberOfCharsToRemove);
                        url = url.substr(0, url.length - numberOfCharsToRemove);
                        break;
                    }
                    unmatchedOpenParentheses--;
                }
            }

            // Because we are removing ) parenthesis, some special characters that shouldn't be in the href are in the href
            // For example google.com/toto.) is accepted by the regular expression above and we remove the ) parenthesis, so the link becomes google.com/toto. which is not a valid link
            // In that case we should also remove the "."
            // Those characters should only be remove from the url if this url doesn't have a parameter or a fragment
            if (!url.includes('?') && !url.includes('#')) {
                let numberOfCharsToRemove = 0;

                for (let i = url.length - 1; i >= 0; i--) {
                    if (Constants.CONST.SPECIAL_CHARS_TO_REMOVE.includes(url[i])) {
                        numberOfCharsToRemove++;
                    } else {
                        break;
                    }
                }
                if (numberOfCharsToRemove) {
                    match[0] = match[0].substring(0, match[0].length - numberOfCharsToRemove);
                    url = url.substring(0, url.length - numberOfCharsToRemove);
                }
            }

            replacedText = replacedText.concat(textToCheck.substr(startIndex, match.index - startIndex));

            // We want to avoid matching domains in email addresses so we don't render them as URLs,
            // but we need to check if there are valid URLs after the email address and render them accordingly,
            // e.g. test@expensify.com/https://www.test.com
            let isDoneMatching = false;
            let shouldApplyAutoLinkAgain = true;

            // If we find a URL with a leading @ sign, we need look for other domains in the rest of the string
            if (match.index !== 0 && textToCheck[match.index - 1] === '@') {
                const domainRegex = /^(([a-z-0-9]+\.)+[a-z]{2,})(\S*)/i;
                const domainMatch = domainRegex.exec(url);

                // If we find another domain in the remainder of the string, we apply the auto link rule again and set a flag to avoid re-doing below.
                if (domainMatch !== null && domainMatch[3] !== '') {
                    replacedText = replacedText.concat(domainMatch[1] + this.replace(domainMatch[3], {filterRules: ['autolink']}));
                    shouldApplyAutoLinkAgain = false;
                } else {
                    // Otherwise, we're done applying rules
                    isDoneMatching = true;
                }
            }

            // We don't want to apply link rule if match[1] contains the code block inside the [] of the markdown e.g. [```example```](https://example.com)
            // or if match[1] is multiline text preceeded by markdown heading, e.g., # [example\nexample\nexample](https://example.com)
            if (isDoneMatching || match[1].includes('</pre>') || match[1].includes('</h1>')) {
                replacedText = replacedText.concat(textToCheck.substr(match.index, match[0].length));
            } else if (shouldApplyAutoLinkAgain) {
                const urlRegex = new RegExp(`^${UrlPatterns.LOOSE_URL_REGEX}$|^${UrlPatterns.URL_REGEX}$`, 'i');

                // `match[1]` contains the text inside the [] of the markdown e.g. [example](https://example.com)
                // At the entry of function this.replace, text is already escaped due to the rules that precede the link
                // rule (eg, codeFence, inlineCodeBlock, email), so we don't need to escape the text again here.
                // If the text `match[1]` exactly matches a URL, we skip translating the filterRules
                // So that special characters such as ['_', '*', '~'] are preserved in the text.
                const linkText = urlRegex.test(match[1])
                    ? match[1]
                    : this.replace(match[1], {
                          filterRules: ['bold', 'strikethrough', 'italic', 'newline'],
                          shouldEscapeText: false,
                      });
                replacedText = replacedText.concat(replacement(EXTRAS_DEFAULT, match[0], linkText, url));
            }
            startIndex = match.index + match[0].length;

            // Now we move to the next match that the js regex found in the text
            match = regex.exec(textToCheck);
        }
        if (startIndex < textToCheck.length) {
            replacedText = replacedText.concat(textToCheck.substr(startIndex));
        }
        return replacedText;
    }

    /**
     * Checks matched Emails for validity and replace valid links with html elements
     */
    modifyTextForEmailLinks(regex: RegExp, textToCheck: string, replacement: ReplacementFn, shouldKeepRawInput: boolean): string {
        let match = regex.exec(textToCheck);
        let replacedText = '';
        let startIndex = 0;

        while (match !== null) {
            replacedText = replacedText.concat(textToCheck.substr(startIndex, match.index - startIndex));

            // `match[1]` contains the text inside []. Text is already escaped due to the rules
            // that precede the link rule (eg, codeFence, inlineCodeBlock, email).
            const linkText = this.replace(match[1], {
                filterRules: ['bold', 'strikethrough', 'italic'],
                shouldEscapeText: false,
            });

            // rawInputReplacement needs to be called with additional parameters from match
            const replacedMatch = shouldKeepRawInput ? replacement(EXTRAS_DEFAULT, match[0], linkText, match[2], match[3]) : replacement(EXTRAS_DEFAULT, match[0], linkText, match[3]);
            replacedText = replacedText.concat(replacedMatch);
            startIndex = match.index + match[0].length;

            // Line breaks (`\n`) followed by empty contents are already removed
            // but line breaks inside contents should be parsed to <br/> to skip `autoEmail` rule
            replacedText = this.replace(replacedText, {filterRules: ['newline'], shouldEscapeText: false});

            // Now we move to the next match that the js regex found in the text
            match = regex.exec(textToCheck);
        }
        if (startIndex < textToCheck.length) {
            replacedText = replacedText.concat(textToCheck.substr(startIndex));
        }
        return replacedText;
    }

    /**
     * replace block element with '\n' if :
     * 1. We have text within the element.
     * 2. The text does not end with a new line.
     * 3. The text does not have quote mark '>' .
     * 4. It's not the last element in the string.
     */
    replaceBlockElementWithNewLine(htmlString: string): string {
        // eslint-disable-next-line max-len
        let splitText = htmlString.split(
            /<div.*?>|<\/div>|<comment.*?>|\n<\/comment>|<\/comment>|<h1>|<\/h1>|<h2>|<\/h2>|<h3>|<\/h3>|<h4>|<\/h4>|<h5>|<\/h5>|<h6>|<\/h6>|<p>|<\/p>|<li>|<\/li>|<blockquote>|<\/blockquote>/,
        );
        const stripHTML = (text: string) => Str.stripHTML(text);
        splitText = splitText.map(stripHTML);
        let joinedText = '';

        // Delete whitespace at the end
        while (splitText.length) {
            if (splitText[splitText.length - 1].trim().length > 0 || splitText[splitText.length - 1].match(/\n/)) {
                break;
            }
            splitText.pop();
        }

        const processText = (text: string, index: number) => {
            if (text.trim().length === 0 && !text.match(/\n/)) {
                return;
            }

            const nextItem = splitText?.[index + 1];
            // Insert '\n' unless it ends with '\n' or '>' or it's the last element, or if it's a header ('# ') with a space.
            if ((nextItem && text.match(/>[\s]?$/) && !nextItem.startsWith('> ')) || text.match(/\n[\s]?$/) || index === splitText.length - 1 || text === '# ') {
                joinedText += text;
            } else {
                joinedText += `${text}\n`;
            }
        };

        splitText.forEach(processText);

        return joinedText;
    }

    /**
     * Unpacks nested quote HTML tags that have been packed by the 'quote' rule in this.rules for shouldKeepRawInput = false
     *
     * For example, it parses the following HTML:
     * <blockquote>
     *     quote 1
     *    <blockquote>
     *      quote 2
     *    </blockquote>
     *    quote 3
     * </blockquote>
     *
     * into:
     * <blockquote> quote 1</blockquote>
     * <blockquote><blockquote> quote 2</blockquote>
     * <blockquote> quote 3</blockquote>
     *
     * Note that there will always be only a single closing tag, even if multiple opening tags exist.
     * Only one closing tag is needed to detect if a nested quote has ended.
     */
    unpackNestedQuotes(text: string): string {
        let parsedText = text.replace(/((<\/blockquote>)+(<br \/>)?)|(<br \/>)/g, (match) => {
            return `${match}</split>`;
        });
        const splittedText = parsedText.split('</split>');
        if (splittedText.length > 0 && splittedText[splittedText.length - 1] === '') {
            splittedText.pop();
        }

        let count = 0;
        parsedText = splittedText
            .map((line) => {
                const hasBR = line.endsWith('<br />');
                if (line === '' && count === 0) {
                    return '';
                }

                const textLine = line.replace(/(<br \/>)$/g, '');
                if (textLine.startsWith('<blockquote>')) {
                    count += (textLine.match(/<blockquote>/g) || []).length;
                }
                if (textLine.endsWith('</blockquote>')) {
                    count -= (textLine.match(/<\/blockquote>/g) || []).length;
                    if (count > 0) {
                        return `${textLine}${'<blockquote>'.repeat(count)}`;
                    }
                }

                if (count > 0) {
                    return `${textLine}${'</blockquote>'}${'<blockquote>'.repeat(count)}`;
                }

                return textLine + (hasBR ? '<br />' : '');
            })
            .join('');

        return parsedText;
    }

    /**
     * Replaces HTML with markdown
     */
    htmlToMarkdown(htmlString: string, extras: Extras = EXTRAS_DEFAULT, maxBodyLength = 0): string {
        let generatedMarkdown = htmlString;
        const body = /<(body)(?:"[^"]*"|'[^']*'|[^'"><])*>(?:\n|\r\n)?([\s\S]*?)(?:\n|\r\n)?<\/\1>(?![^<]*(<\/pre>|<\/code>))/im;
        const parseBodyTag = generatedMarkdown.match(body);

        // If body tag is found then use the content of body rather than the whole HTML
        if (parseBodyTag) {
            generatedMarkdown = parseBodyTag[2];
        }
        if (maxBodyLength > 0) {
            /*
             * Some HTML sources (such as Microsoft Word) have headers larger than the typical maxLength of
             * 10K even for a small body text. So the text is truncated after extracting the body element, to
             * maximise the amount of body text that is included while still staying inside the length limit.
             *
             * The truncation happens before HTML to Markdown conversion, as the conversion is very slow for
             * large input especially on mobile devices.
             */
            generatedMarkdown = generatedMarkdown.slice(0, maxBodyLength);
        }
        generatedMarkdown = this.unpackNestedQuotes(generatedMarkdown);

        const processRule = (rule: RuleWithRegex) => {
            // Pre-processes input HTML before applying regex
            if (rule.pre) {
                generatedMarkdown = rule.pre(generatedMarkdown);
            }

            generatedMarkdown = this.replaceTextWithExtras(generatedMarkdown, rule.regex, extras, rule.replacement);
        };

        this.htmlToMarkdownRules.forEach(processRule);
        return Str.htmlDecode(this.replaceBlockElementWithNewLine(generatedMarkdown));
    }

    /**
     * Convert HTML to text
     */
    htmlToText(htmlString: string, extras: Extras = EXTRAS_DEFAULT): string {
        let replacedText = htmlString;
        const processRule = (rule: RuleWithRegex) => {
            replacedText = this.replaceTextWithExtras(replacedText, rule.regex, extras, rule.replacement);
        };

        this.htmlToTextRules.forEach(processRule);

        // Unescaping because the text is escaped in 'replace' function
        // We use 'htmlDecode' instead of 'unescape' to replace entities like '&#32;'
        replacedText = Str.htmlDecode(replacedText);
        return replacedText;
    }

    /**
     * Main text to html 'quote' parsing logic.
     * Removes &gt;( ) from text and recursively calls replace function to process nested quotes and build blockquote HTML result.
     * @param shouldKeepRawInput determines if the raw input should be kept for nested quotes.
     */
    replaceQuoteText(text: string, shouldKeepRawInput: boolean): {replacedText: string; shouldAddSpace: boolean} {
        let isStartingWithSpace = false;
        const handleMatch = (_match: string, g2: string) => {
            isStartingWithSpace = !!g2;
            return '';
        };
        const textToReplace = text.replace(/^&gt;( )?/gm, handleMatch);
        const filterRules = ['heading1'];
        // If we don't reach the max quote depth, we allow the recursive call to process other possible quotes
        if (this.currentQuoteDepth < this.maxQuoteDepth - 1 && !isStartingWithSpace) {
            filterRules.push('quote');
            this.currentQuoteDepth++;
        }
        const replacedText = this.replace(textToReplace, {
            filterRules,
            shouldEscapeText: false,
            shouldKeepRawInput,
        });
        this.currentQuoteDepth = 0;

        return {replacedText, shouldAddSpace: isStartingWithSpace};
    }

    /**
     * Check if the input text includes only the open or the close tag of an element.
     */
    containsNonPairTag(textToCheck: string): boolean {
        // Create a regular expression to match HTML tags
        const tagRegExp = /<([a-z][a-z0-9-]*)\b[^>]*>|<\/([a-z][a-z0-9-]*)\s*>/gi;

        // Use a stack to keep track of opening tags
        const tagStack = [];

        // Match all HTML tags in the string
        let match = tagRegExp.exec(textToCheck);
        while (match) {
            const openingTag = match[1];
            const closingTag = match[2];

            if (openingTag && openingTag !== 'br') {
                // If it's an opening tag, push it onto the stack
                tagStack.push(openingTag);
            } else if (closingTag) {
                // If it's a closing tag, pop the top of the stack
                const expectedTag = tagStack.pop();

                // If the closing tag doesn't match the expected opening tag, return false
                if (closingTag !== expectedTag) {
                    return true;
                }
            }
            match = tagRegExp.exec(textToCheck);
        }

        // If there are any tags left in the stack, they're unclosed
        return tagStack.length !== 0;
    }

    /**
     * @returns array or undefined if exception occurs when executing regex matching
     */
    extractLinksInMarkdownComment(comment: string): string[] | undefined {
        try {
            const htmlString = this.replace(comment, {filterRules: ['link']});
            // We use same anchor tag template as link and autolink rules to extract link
            const regex = new RegExp(`<a href="${UrlPatterns.MARKDOWN_URL_REGEX}" target="_blank" rel="noreferrer noopener">`, 'gi');
            const matches = [...htmlString.matchAll(regex)];

            // Element 1 from match is the regex group if it exists which contains the link URLs
            const sanitizeMatch = (match: RegExpExecArray) => Str.sanitizeURL(match[1]);
            const links = matches.map(sanitizeMatch);
            return links;
        } catch (e) {
            ExpensiMark.Log.alert('Error parsing url in ExpensiMark.extractLinksInMarkdownComment', {error: e});
            return undefined;
        }
    }

    /**
     * Compares two markdown comments and returns a list of the links removed in a new comment.
     */
    getRemovedMarkdownLinks(oldComment: string, newComment: string): string[] {
        const linksInOld = this.extractLinksInMarkdownComment(oldComment);
        const linksInNew = this.extractLinksInMarkdownComment(newComment);
        return linksInOld === undefined || linksInNew === undefined ? [] : linksInOld.filter((link) => !linksInNew.includes(link));
    }

    /**
     * Escapes the content of an HTML attribute value
     * @param content - string content that possible contains HTML
     * @returns original MD content escaped for use in HTML attribute value
     */
    escapeAttributeContent(content: string): string {
        let originalContent = this.htmlToMarkdown(content);
        if (content === originalContent) {
            return content;
        }

        // When the attribute contains HTML and is converted back to MD we need to re-escape it to avoid
        // illegal attribute value characters like `," or ' which might break the HTML
        originalContent = Str.replaceAll(originalContent, '\n', '');
        return Utils.escapeText(originalContent);
    }

    /**
     * Determines the end position to truncate the HTML content while considering word boundaries.
     *
     * @param {string} content - The HTML content to be truncated.
     * @param {number} tailPosition - The position up to which the content should be considered.
     * @param {number} maxLength - The maximum length of the truncated content.
     * @param {number} totalLength - The length of the content processed so far.
     * @param {Object} opts - Options to customize the truncation.
     * @returns {number} The calculated position to truncate the content.
     */
    getEndPosition(content: string, tailPosition: number | undefined, maxLength: number, totalLength: number, opts: TruncateOptions) {
        const WORD_BREAK_REGEX = /\W+/g;

        // Calculate the default position to truncate based on the maximum length and the length of the content processed so far
        const defaultPosition = maxLength - totalLength;

        // Define the slop value, which determines the tolerance for cutting off content near the maximum length
        const slop = opts.slop;
        if (!slop) return defaultPosition;

        // Initialize the position to the default position
        let position = defaultPosition;

        // Determine if the default position is considered "short" based on the slop value
        const isShort = defaultPosition < slop;

        // Calculate the position within the slop range
        const slopPos = isShort ? defaultPosition : slop - 1;

        // Extract the substring to analyze for word boundaries, considering the slop and tail position
        const substr = content.slice(isShort ? 0 : defaultPosition - slop, tailPosition !== undefined ? tailPosition : defaultPosition + slop);

        // Find the first word boundary within the substring
        const wordBreakMatch = WORD_BREAK_REGEX.exec(substr);

        // Adjust the position to avoid truncating in the middle of a word if the option is enabled
        if (!opts.truncateLastWord) {
            if (tailPosition && substr.length <= tailPosition) {
                // If tail position is defined and the substring length is within the tail position, set position to the substring length
                position = substr.length;
            } else {
                // Iterate through word boundary matches to adjust the position
                while (wordBreakMatch !== null) {
                    if (wordBreakMatch.index < slopPos) {
                        // If the word boundary is before the slop position, adjust position backward
                        position = defaultPosition - (slopPos - wordBreakMatch.index);
                        if (wordBreakMatch.index === 0 && defaultPosition <= 1) {
                            break;
                        }
                    } else if (wordBreakMatch.index === slopPos) {
                        // If the word boundary is at the slop position, set position to the default position
                        position = defaultPosition;
                        break;
                    } else {
                        // If the word boundary is after the slop position, adjust position forward
                        position = defaultPosition + (wordBreakMatch.index - slopPos);
                        break;
                    }
                }
            }
            // If the character at the determined position is a whitespace, adjust position backward
            if (content.charAt(position - 1).match(/\s$/)) {
                position--;
            }
        }

        // Return the calculated position to truncate the content
        return position;
    }

    /**
     * Truncate HTML string and keep tag safe.
     * pulled from https://github.com/huang47/nodejs-html-truncate/blob/master/lib/truncate.js
     *
     * @param {string} html - The string that needs to be truncated
     * @param {number} maxLength - Length of truncated string
     * @param {Object} [options] - Optional configuration options
     * @returns {string} The truncated string
     */
    truncateHTML(html: string, maxLength: number, options?: TruncateOptions) {
        const EMPTY_STRING = '';
        const DEFAULT_TRUNCATE_SYMBOL = '...';
        const DEFAULT_SLOP = Math.min(10, maxLength);
        const tagsStack = [];
        const KEY_VALUE_REGEX = '((?:\\s+(?:\\w+|-)+(?:\\s*=\\s*(?:"(?:\\\\.|[^"\\\\])*"|\'(?:\\\\.|[^\'\\\\])*\'|[^\'">\\s]+))?)*)';
        const IS_CLOSE_REGEX = '\\s*\\/?\\s*';
        const CLOSE_REGEX = '\\s*\\/\\s*';
        const SELF_CLOSE_REGEX = new RegExp(`<\\/?(\\w+)${KEY_VALUE_REGEX}${CLOSE_REGEX}>`);
        const HTML_TAG_REGEX = new RegExp(`<\\/?(\\w+)${KEY_VALUE_REGEX}${IS_CLOSE_REGEX}>`);
        const URL_REGEX = /(((ftp|https?):\/\/)[\\-\w@:%_\\+.~#?,&\\/\\/=]+)|((mailto:)?[_.\w\\-]+@([\w][\w\\-]+\.)+[a-zA-Z]{2,3})/g;
        const IMAGE_TAG_REGEX = new RegExp(`<img\\s*${KEY_VALUE_REGEX}${CLOSE_REGEX}>`);
        let truncatedContent = EMPTY_STRING;
        let totalLength = 0;
        let matches = HTML_TAG_REGEX.exec(html);
        let endResult;
        let index;
        let tag;
        let selfClose = null;
        let htmlString = html;

        const opts = {
            ellipsis: DEFAULT_TRUNCATE_SYMBOL,
            truncateLastWord: true,
            slop: DEFAULT_SLOP,
            ...options,
        };

        function removeImageTag(content: string): string {
            const match = IMAGE_TAG_REGEX.exec(content);
            if (!match) {
                return content;
            }

            const matchIndex = match.index;
            const matchLength = match[0].length;

            return content.substring(0, matchIndex) + content.substring(matchIndex + matchLength);
        }

        function closeTags(tags: string[]): string {
            return tags
                .reverse()
                .map((mappedTag) => {
                    return `</${mappedTag}>`;
                })
                .join('');
        }

        while (matches) {
            matches = HTML_TAG_REGEX.exec(htmlString);

            if (!matches) {
                if (totalLength >= maxLength) {
                    break;
                }

                matches = URL_REGEX.exec(htmlString);
                if (!matches || matches.index >= maxLength) {
                    truncatedContent += htmlString.substring(0, this.getEndPosition(htmlString, undefined, maxLength, totalLength, opts));
                    break;
                }

                while (matches) {
                    endResult = matches[0];
                    if (endResult !== null) {
                        index = matches.index;
                        truncatedContent += htmlString.substring(0, index + endResult.length - totalLength);
                        htmlString = htmlString.substring(index + endResult.length);
                        matches = URL_REGEX.exec(htmlString);
                    }
                }
                break;
            }

            endResult = matches[0];
            index = matches.index;

            if (totalLength + index > maxLength) {
                truncatedContent += htmlString.substring(0, this.getEndPosition(htmlString, index, maxLength, totalLength, opts));
                break;
            } else {
                totalLength += index;
                truncatedContent += htmlString.substring(0, index);
            }

            if (endResult[1] === '/') {
                tagsStack.pop();
                selfClose = null;
            } else {
                selfClose = SELF_CLOSE_REGEX.exec(endResult);
                if (!selfClose) {
                    tag = matches[1];
                    tagsStack.push(tag);
                }
            }

            truncatedContent += selfClose ? selfClose[0] : endResult;
            htmlString = htmlString.substring(index + endResult.length); // Update htmlString
        }

        if (htmlString.length > maxLength - totalLength && opts.ellipsis) {
            truncatedContent += opts.ellipsis ? '...' : '';
        }
        truncatedContent += closeTags(tagsStack);

        if (opts.removeImageTag) {
            truncatedContent = removeImageTag(truncatedContent);
        }

        return truncatedContent;
    }

    /**
     * Replaces text with a replacement based on a regex
     * @param text - The text to replace
     * @param regexp - The regex to match
     * @param extras - The extras object
     * @param replacement - The replacement string or function
     * @returns The replaced text
     */
    replaceTextWithExtras(text: string, regexp: RegExp, extras: Extras, replacement: Replacement): string {
        if (typeof replacement === 'function') {
            // if the replacement is a function, we pass the extras object to it
            return text.replace(regexp, (...args) => replacement(extras, ...args));
        }
        return text.replace(regexp, replacement);
    }
}
