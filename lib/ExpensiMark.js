import _ from 'underscore';
import Str from './str';
import {MARKDOWN_URL_REGEX, LOOSE_URL_REGEX, URL_REGEX} from './Url';
import {CONST} from './CONST';

const MARKDOWN_LINK_REGEX = `\\[([^\\][]*(?:\\[[^\\][]*][^\\][]*)*)]\\(${MARKDOWN_URL_REGEX}\\)(?![^<]*(<\\/pre>|<\\/code>))`;

const SLACK_SPAN_NEW_LINE_TAG = '<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;"></span>';

export default class ExpensiMark {
    constructor() {
        /**
         * The list of regex replacements to do on a comment. Check the link regex is first so links are processed
         * before other delimiters
         *
         * @type {Object[]}
         */
        this.rules = [
            /**
             * Apply the code-fence first so that we avoid replacing anything inside of it that we're not supposed to
             * (aka any rule with the '(?![^<]*<\/pre>)' avoidance in it
             */
            {
                name: 'codeFence',

                // &#60; is a backtick symbol we are matching on three of them before then after a new line character
                regex: /(&#x60;&#x60;&#x60;[\n]?)((?:\s*?(?![\n]?&#x60;&#x60;&#x60;(?!&#x60;))[\S])+\s*?)((?=\n?)&#x60;&#x60;&#x60;)/g,

                // We're using a function here to perform an additional replace on the content
                // inside the backticks because Android is not able to use <pre> tags and does
                // not respect whitespace characters at all like HTML does. We do not want to mess
                // with the new lines here since they need to be converted into <br>. And we don't
                // want to do this anywhere else since that would break HTML.
                // &nbsp; will create styling issues so use &#32;
                replacement: (match, __, textWithinFences) => {
                    const group = textWithinFences.replace(/(?:(?![\n\r])\s)/g, '&#32;');
                    return `<pre>${group}</pre>`;
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
                regex: /(\B|_|)&#x60;(.*?\S.*?)&#x60;(\B|_|)(?![^<]*<\/pre>)/g,
                replacement: '$1<code>$2</code>$3',
            },

            /**
             * Converts markdown style links to anchor tags e.g. [Expensify](concierge@expensify.com)
             * We need to convert before the auto email link rule and the manual link rule since it will not try to create a link
             * from an existing anchor tag.
             */
            {
                name: 'email',
                process: (textToProcess, replacement) => {
                    const regex = new RegExp(
                        `\\[([^[\\]]*)]\\(${CONST.REG_EXP.MARKDOWN_EMAIL}\\)`, 'gim'
                    );
                    return this.modifyTextForEmailLinks(regex, textToProcess, replacement);
                },
                replacement: (match, g1, g2) => `<a href="mailto:${g2}">${g1.trim()}</a>`,
            },

            /**
             * Converts markdown style links to anchor tags e.g. [Expensify](https://www.expensify.com)
             * We need to convert before the autolink rule since it will not try to create a link
             * from an existing anchor tag.
             */
            {
                name: 'link',
                process: (textToProcess, replacement) => {
                    const regex = new RegExp(MARKDOWN_LINK_REGEX, 'gi');
                    return this.modifyTextForUrlLinks(regex, textToProcess, replacement);
                },

                replacement: (match, g1, g2) => {
                    if (g1.match(CONST.REG_EXP.EMOJIS) || !g1.trim()) {
                        return match;
                    }
                    return `<a href="${Str.sanitizeURL(g2)}" target="_blank" rel="noreferrer noopener">${g1.trim()}</a>`;
                },
            },

            /**
             * Apply the hereMention first because the string @here is still a valid mention for the userMention regex.
             * This ensures that the hereMention is always considered first, even if it is followed by a valid userMention.
             *
             * Also, apply the mention rule after email/link to prevent mention appears in an email/link.
             */
            {
                name: 'hereMentions',
                regex: /[`.a-zA-Z]?@here\b(?![^<]*(<\/pre>|<\/code>|<\/a>))/gm,
                replacement: (match) => {
                    if (!Str.isValidMention(match)) {
                        return match;
                    }
                    return `<mention-here>${match}</mention-here>`;
                },
            },

            /**
             * This regex matches a valid user mention in a string.
             * A user mention is a string that starts with the '@' symbol and is followed by a valid user's primary login
             *
             * Note: currently we are only allowing mentions in a format of @+19728974297@expensify.sms and @username@example.com
             * The username can contain any combination of alphanumeric letters, numbers, and underscores
             */
            {
                name: 'userMentions',
                regex: new RegExp(`[\`.a-zA-Z]?@+${CONST.REG_EXP.EMAIL_PART}(?![^<]*(<\\/pre>|<\\/code>|<\\/a>))`, 'gm'),
                replacement: (match) => {
                    if (!Str.isValidMention(match)) {
                        return match;
                    }
                    return `<mention-user>${match}</mention-user>`;
                },
            },

            /**
             * Automatically links emails that are not in a link. Runs before the autolinker as it will not link an
             * email that is in a link
             * Prevent emails from starting with [~_*]. Such emails should not be supported.
             */
            {
                name: 'autoEmail',
                regex: new RegExp(
                    `(?![^<]*>|[^<>]*<\\/)${CONST.REG_EXP.MARKDOWN_EMAIL}(?![^<]*(<\\/pre>|<\\/code>|<\\/a>))`,
                    'gim',
                ),
                replacement: '<a href="mailto:$1">$1</a>',
            },

            /**
             * Automatically link urls. Runs last of our linkers since we want anything manual to link before this,
             * and we do not want to break emails.
             */
            {
                name: 'autolink',

                process: (textToProcess, replacement) => {
                    const regex = new RegExp(
                        `(?![^<]*>|[^<>]*<\\/)([_*~]*?)${MARKDOWN_URL_REGEX}\\1(?!((?:(?!<a).)+)?<\\/a>|[^<]*(<\\/pre>|<\\/code>))`,
                        'gi',
                    );
                    return this.modifyTextForUrlLinks(regex, textToProcess, replacement);
                },

                replacement: (match, g1, g2) => {
                    const href = Str.sanitizeURL(g2);
                    return `${g1}<a href="${href}" target="_blank" rel="noreferrer noopener">${g2}</a>${g1}`;
                },
            },
            {
                /**
                 * Use \b in this case because it will match on words, letters,
                 * and _: https://www.rexegg.com/regex-boundaries.html#wordboundary
                 * The !_blank is to prevent the `target="_blank">` section of the
                 * link replacement from being captured Additionally, something like
                 * `\b\_([^<>]*?)\_\b` doesn't work because it won't replace
                 * `_https://www.test.com_`
                 * Use [\s\S]* instead of .* to match newline
                 */
                name: 'italic',
                regex: /(?!_blank")[^\W_]?_((?![\s_])[\s\S]*?[^\s_])_(?![^\W_])(?![^<]*(<\/pre>|<\/code>|<\/a>|_blank))/g,
                replacement: (match, g1) => (g1.includes('<pre>') || this.containsNonPairTag(g1) ? match : `<em>${g1}</em>`),
            },
            {
                // Use \B in this case because \b doesn't match * or ~.
                // \B will match everything that \b doesn't, so it works
                // for * and ~: https://www.rexegg.com/regex-boundaries.html#notb
                name: 'bold',
                regex: /\B\*((?=\S)(([^\s*]|\s(?!\*))+?))\*\B(?![^<]*(<\/pre>|<\/code>|<\/a>))/g,
                replacement: (match, g1) => (g1.includes('<pre>') || this.containsNonPairTag(g1) ? match : `<strong>${g1}</strong>`),
            },
            {
                name: 'strikethrough',
                regex: /\B~((?=\S)((~~(?!~)|[^\s~]|\s(?!~))+?))~\B(?![^<]*(<\/pre>|<\/code>|<\/a>))/g,
                replacement: (match, g1) => (this.containsNonPairTag(g1) ? match : `<del>${g1}</del>`),
            },
            {
                name: 'quote',

                // We also want to capture a blank line before or after the quote so that we do not add extra spaces.
                // block quotes naturally appear on their own line. Blockquotes should not appear in code fences or
                // inline code blocks. A single prepending space should be stripped if it exists
                process: (textToProcess, replacement) => {
                    const regex = new RegExp(
                        /\n?^&gt; *(?! )(?![^<]*(?:<\/pre>|<\/code>))([^\v\n\r]+)\n?/gm,
                    );
                    return this.modifyTextForQuote(regex, textToProcess, replacement);
                },
                replacement: (g1) => {
                    const replacedText = this.replace(g1, {filterRules: ['heading1'], shouldEscapeText: false});
                    return `<blockquote>${replacedText}</blockquote>`;
                },
            },
            {
                name: 'heading1',
                regex: /^# +(?! )((?:(?!<pre>|\n|\r\n).)+)\n?/gm,
                replacement: '<h1>$1</h1>',
            },
            {
                name: 'newline',
                regex: /\n/g,
                replacement: '<br />',
            },
            {
                // We're removing <br /> because when </pre> and <br /> occur together, an extra line is added.
                name: 'replacepre',
                regex: /<\/pre>\s*<br\s*[/]?>/gi,
                replacement: '</pre>',
            },
            {
                // We're removing <br /> because when <br /> and <pre> occur together, an extra line is added.
                name: 'replacebr',
                regex: /<br\s*[/]?><pre>\s*/gi,
                replacement: ' <pre>',
            },
        ];

        /**
         * The list of regex replacements to do on a HTML comment for converting it to markdown.
         * Order of rules is important
         * @type {Object[]}
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
                regex: new RegExp(
                    [
                        '<(script|style)(?:"[^"]*"|\'[^\']*\'|[^\'">])*>([\\s\\S]*?)<\\/\\1>',
                        '(?![^<]*(<\\/pre>|<\\/code>))(\n|\r\n)?',
                    ].join(''),
                    'gim',
                ),
                replacement: '',
            },
            {
                name: 'newline',

                // Replaces open and closing <br><br/> tags with a single <br/>
                // Slack uses special <span> tag for empty lines instead of <br> tag
                pre: inputString => inputString.replace('<br></br>', '<br/>').replace('<br><br/>', '<br/>')
                    .replace(/(<tr.*?<\/tr>)/g, '$1<br/>').replace('<br/></tbody>', '')
                    .replace(SLACK_SPAN_NEW_LINE_TAG + SLACK_SPAN_NEW_LINE_TAG, '<br/><br/><br/>')
                    .replace(SLACK_SPAN_NEW_LINE_TAG, '<br/><br/>'),

                // Include the immediately followed newline as `<br>\n` should be equal to one \n.
                regex: /<br(?:"[^"]*"|'[^']*'|[^'"><])*>\n?/gi,
                replacement: '\n',
            },
            {
                name: 'heading1',
                regex: /[^\S\r\n]*<(h1)(?:"[^"]*"|'[^']*'|[^'">])*>(.*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))[^\S\r\n]*/gi,
                replacement: '[block]# $2[block]',
            },
            {
                name: 'listItem',
                regex: /\s*<(li)(?:"[^"]*"|'[^']*'|[^'">])*>(.*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))\s*/gi,
                replacement: '<li>  $2</li>',
            },

            // Use [\s\S]* instead of .* to match newline
            {
                name: 'italic',
                regex: /<(em|i)(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: '_$2_',
            },
            {
                name: 'bold',
                regex: /<(b|strong)(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: '*$2*',
            },
            {
                name: 'strikethrough',
                regex: /<(del)(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: '~$2~',
            },
            {
                name: 'quote',
                regex: /\n?<(blockquote|q)(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: (match, g1, g2) => {
                    // We remove the line break before heading inside quote to avoid adding extra line
                    const resultString = g2.replace(/\n?(\[block\]# )/g, '$1')
                        .replace(/(\[block\])+/g, '\n')
                        .trim()
                        .split('\n')
                        .map(m => `> ${m}`)
                        .join('\n');
                    return `\n${resultString}\n`;
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
                replacement: (match, g1, g2) => `\`\`\`\n${g2}\n\`\`\``,
            },
            {
                name: 'anchor',
                regex: /<(a)[^><]*href\s*=\s*(['"])(.*?)\2(?:".*?"|'.*?'|[^'"><])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: (match, g1, g2, g3, g4) => {
                    const email = g3.startsWith('mailto:') ? g3.slice(7) : '';
                    if (email === g4) {
                        return email;
                    }
                    return `[${g4}](${email || g3})`;
                },
            },
        ];

        /**
         * The list of rules to covert the HTML to text.
         * Order of rules is important
         * @type {Object[]}
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
                name: 'stripTag',
                regex: /(<([^>]+)>)/gi,
                replacement: '',
            },
        ];
    }

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
    replace(text, {filterRules = [], shouldEscapeText = true} = {}) {
        // This ensures that any html the user puts into the comment field shows as raw html
        let replacedText = shouldEscapeText ? _.escape(text) : text;

        const rules = _.isEmpty(filterRules) ? this.rules : _.filter(this.rules, rule => _.contains(filterRules, rule.name));
        rules.forEach((rule) => {
            // Pre-process text before applying regex
            if (rule.pre) {
                replacedText = rule.pre(replacedText);
            }

            if (rule.process) {
                replacedText = rule.process(replacedText, rule.replacement);
            } else {
                replacedText = replacedText.replace(rule.regex, rule.replacement);
            }

            // Post-process text after applying regex
            if (rule.post) {
                replacedText = rule.post(replacedText);
            }
        });

        return replacedText;
    }

    /**
     * Checks matched URLs for validity and replace valid links with html elements
     *
     * @param {RegExp} regex
     * @param {String} textToCheck
     * @param {Function} replacement
     *
     * @returns {String}
     */
    modifyTextForUrlLinks(regex, textToCheck, replacement) {
        let match = regex.exec(textToCheck);
        let replacedText = '';
        let startIndex = 0;

        while (match !== null) {
            // we want to avoid matching email address domains
            let abort = false;
            if ((match.index !== 0) && (textToCheck[match.index - 1] === '@')) {
                abort = true;
            }

            // we want to avoid matching ending ) unless it is a closing parenthesis for the URL
            if (textToCheck[(match.index + match[2].length) - 1] === ')' && !match[2].includes('(')) {
                match[0] = match[0].substr(0, match[0].length - 1);
                match[2] = match[2].substr(0, match[2].length - 1);
            }

            // remove extra ) parentheses
            let brace = 0;
            if (match[2][match[2].length - 1] === ')') {
                for (let i = 0; i < match[2].length; i++) {
                    if (match[2][i] === '(') {
                        brace++;
                    }
                    if (match[2][i] === ')') {
                        brace--;
                    }
                }
                if (brace) {
                    match[0] = match[0].substr(0, match[0].length + brace);
                    match[2] = match[2].substr(0, match[2].length + brace);
                }
            }
            replacedText = replacedText.concat(textToCheck.substr(startIndex, (match.index - startIndex)));

            if (abort) {
                replacedText = replacedText.concat(textToCheck.substr(match.index, (match[0].length)));
            } else {
                const urlRegex = new RegExp(`^${LOOSE_URL_REGEX}$|^${URL_REGEX}$`, 'i');

                // `match[1]` contains the text inside the [] of the markdown e.g. [example](https://example.com)
                // At the entry of function this.replace, text is already escaped due to the rules that precede the link
                // rule (eg, codeFence, inlineCodeBlock, email), so we don't need to escape the text again here.
                // If the text `match[1]` exactly matches a URL, we skip translating the filterRules
                // So that special characters such as ['_', '*', '~'] are preserved in the text.
                const linkText = urlRegex.test(match[1]) ? match[1] : this.replace(match[1], {
                    filterRules: ['bold', 'strikethrough', 'italic'],
                    shouldEscapeText: false,
                });
                replacedText = replacedText.concat(replacement(match[0], linkText, match[2]));
            }
            startIndex = match.index + (match[0].length);

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
     *
     * @param {RegExp} regex
     * @param {String} textToCheck
     * @param {Function} replacement
     *
     * @returns {String}
     */
    modifyTextForEmailLinks(regex, textToCheck, replacement) {
        let match = regex.exec(textToCheck);
        let replacedText = '';
        let startIndex = 0;

        while (match !== null) {
            replacedText = replacedText.concat(textToCheck.substr(startIndex, (match.index - startIndex)));

            // `match[1]` contains the text inside []. Text is already escaped due to the rules
            // that precede the link rule (eg, codeFence, inlineCodeBlock, email).
            const linkText = this.replace(match[1], {
                filterRules: ['bold', 'strikethrough', 'italic'],
                shouldEscapeText: false,
            });
            replacedText = replacedText.concat(replacement(match[0], linkText, match[2]));
            startIndex = match.index + (match[0].length);

            // Now we move to the next match that the js regex found in the text
            match = regex.exec(textToCheck);
        }
        if (startIndex < textToCheck.length) {
            replacedText = replacedText.concat(textToCheck.substr(startIndex));
        }
        return replacedText;
    }

    /**
     * replace [block] with '\n' if :
     * 1. We have text before the [block].
     * 2. The text does not end with a new line.
     * 3. The text does not have quote mark '>' .
     * 4. [block] not the last [block] in the string.
     *
     * @param {String} htmlString
     * @returns {String}
     */
    replaceBlockWithNewLine(htmlString) {
        const splitText = htmlString.split('[block]');
        let joinedText = '';

        // Delete whitespace at the end
        while (splitText.length) {
            if (splitText[splitText.length - 1].trim().length > 0 || splitText[splitText.length - 1].match(/\n/)) {
                break;
            }
            splitText.pop();
        }

        splitText.forEach((text, index) => {
            if (text.trim().length === 0 && !text.match(/\n/)) {
                return;
            }

            // Insert '\n' unless it ends with '\n' or '>' or it's the last [block].
            if (text.match(/[\n|>][>]?[\s]?$/) || index === splitText.length - 1) {
                joinedText += text;
            } else {
                joinedText += `${text}\n`;
            }
        });

        return joinedText;
    }

    /**
     * Replaces HTML with markdown
     *
     * @param {String} htmlString
     *
     * @returns {String}
     */
    htmlToMarkdown(htmlString) {
        let generatedMarkdown = htmlString;
        const body = /<(body)(?:"[^"]*"|'[^']*'|[^'"><])*>(?:\n|\r\n)?([\s\S]*?)(?:\n|\r\n)?<\/\1>(?![^<]*(<\/pre>|<\/code>))/im;
        const parseBodyTag = generatedMarkdown.match(body);

        // If body tag is found then use the content of body rather than the whole HTML
        if (parseBodyTag) {
            generatedMarkdown = parseBodyTag[2];
        }

        this.htmlToMarkdownRules.forEach((rule) => {
            // Pre-processes input HTML before applying regex
            if (rule.pre) {
                generatedMarkdown = rule.pre(generatedMarkdown);
            }
            generatedMarkdown = generatedMarkdown.replace(rule.regex, rule.replacement);
        });
        generatedMarkdown = generatedMarkdown.replace(
            /<div.*?>|<\/div>|<comment.*?>|\n<\/comment>|<\/comment>|<h2>|<\/h2>|<h3>|<\/h3>|<h4>|<\/h4>|<h5>|<\/h5>|<h6>|<\/h6>|<p>|<\/p>|<li>|<\/li>/gm,
            '[block]',
        );
        return Str.htmlDecode(this.replaceBlockWithNewLine(Str.stripHTML(generatedMarkdown)));
    }

    /**
     * Convert HTML to text
     *
     * @param {String} htmlString
     * @returns {String}
     */
    htmlToText(htmlString) {
        let replacedText = htmlString;

        this.htmlToTextRules.forEach((rule) => {
            replacedText = replacedText.replace(rule.regex, rule.replacement);
        });

        // Unescaping because the text is escaped in 'replace' function
        replacedText = _.unescape(replacedText);
        return replacedText;
    }

    /**
     * Modify text for Quotes replacing chevrons with html elements
     *
     * @param {RegExp} regex
     * @param {String} textToCheck
     * @param {Function} replacement
     *
     * @returns {String}
     */

    modifyTextForQuote(regex, textToCheck, replacement) {
        let replacedText = '';
        let textToFormat = '';
        const match = textToCheck.match(regex);

        // If there's matches we need to modify the quotes
        if (match !== null) {
            let insideCodefence = false;

            // Split the textToCheck in lines
            const textSplitted = textToCheck.split('\n');

            for (let i = 0; i < textSplitted.length; i++) {
                if (!insideCodefence) {
                    // We need to know when there is a start of codefence so we dont quote
                    insideCodefence = Str.contains(textSplitted[i], '<pre>');
                }

                // We only want to modify lines starting with &gt; that is not codefence
                if (Str.startsWith(textSplitted[i], '&gt;') && !insideCodefence) {
                    textToFormat += `${textSplitted[i]}\n`;
                } else {
                    // Make sure we will only modify if we have Text needed to be formatted for quote
                    if (textToFormat !== '') {
                        replacedText += this.formatTextForQuote(regex, textToFormat, replacement);
                        textToFormat = '';
                    }

                    // We dont want a \n after the textSplitted if it is the last row
                    if (i === textSplitted.length - 1) {
                        replacedText += `${textSplitted[i]}`;
                    } else {
                        replacedText += `${textSplitted[i]}\n`;
                    }

                    // We need to know when we are not inside codefence anymore
                    if (insideCodefence) {
                        insideCodefence = !Str.contains(textSplitted[i], '</pre>');
                    }
                }
            }

            // When loop ends we need the last quote to be formatted if we have quotes at last rows
            if (textToFormat !== '') {
                replacedText += this.formatTextForQuote(regex, textToFormat, replacement);
            }

            // Replace all the blank lines between quotes, if there are only blank lines between them
            replacedText = replacedText.replace(/(<\/blockquote>((\s*)+)<blockquote>)/g, '</blockquote><blockquote>');
        } else {
            // If we doesn't have matches make sure the function will return the same textToCheck
            replacedText = textToCheck;
        }
        return replacedText;
    }

    /**
     * Format the content of blockquote if the text matches the regex or else just return the original text
     *
     * @param {RegExp} regex
     * @param {String} textToCheck
     * @param {Function} replacement
     *
     * @returns {String}
     */
    formatTextForQuote(regex, textToCheck, replacement) {
        if (textToCheck.match(regex)) {
            // Remove '&gt;' and trim each line of quote content
            let textToFormat = textToCheck.split('\n').map(row => row.substr(4).trim()).join('\n');

            // Remove leading and trailing line breaks
            textToFormat = textToFormat.trim();
            return replacement(textToFormat);
        }
        return textToCheck;
    }

    /**
     * Check if the input text includes only the open or the close tag of an element.
     *
     * @param {String} textToCheck - Text to check
     *
     * @returns {Boolean}
     */
    containsNonPairTag(textToCheck) {
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
     * @param {String} comment
     * @returns {Array}
     */
    extractLinksInMarkdownComment(comment) {
        const regex = new RegExp(MARKDOWN_LINK_REGEX, 'gi');
        const escapedComment = _.escape(comment);
        const matches = [...escapedComment.matchAll(regex)];

        // Element 1 from match is the regex group if it exists which contains the link URLs
        const links = _.map(matches, match => Str.sanitizeURL(match[2]));
        return links;
    }

    /**
     * Compares two markdown comments and returns a list of the links removed in a new comment.
     *
     * @param {String} oldComment
     * @param {String} newComment
     * @returns {Array}
     */
    getRemovedMarkdownLinks(oldComment, newComment) {
        const linksInOld = this.extractLinksInMarkdownComment(oldComment);
        const linksInNew = this.extractLinksInMarkdownComment(newComment);
        return _.difference(linksInOld, linksInNew);
    }
}
