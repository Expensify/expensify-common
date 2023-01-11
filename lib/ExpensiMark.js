import _ from 'underscore';
import Str from './str';
import {URL_REGEX} from './Url';

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
                regex: /(&#x60;&#x60;&#x60;[\n]?)((?:\s*?(?![\n]?&#x60;&#x60;&#x60;(?!&#x60;))[\S])+\s*?)([\n]?&#x60;&#x60;&#x60;)/g,

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
                        '\\[([^[\\]]*)]\\(([a-zA-Z0-9.!#$%&\'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9-]+?(\\.[a-zA-Z]+)+)\\)', 'gim'
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
                    const regex = new RegExp(
                        `\\[([^\\][]*(?:\\[[^\\][]*][^\\][]*)*)]\\(${URL_REGEX}\\)(?![^<]*(<\\/pre>|<\\/code>))`,
                        'gi',
                    );
                    return this.modifyTextForUrlLinks(regex, textToProcess, replacement);
                },

                // We use a function here to check if there is already a https:// on the link.
                // If there is not, we force the link to be absolute by prepending '//' to the target.
                replacement: (match, g1, g2, g3) => {
                    if (!g1.trim()) {
                        return match;
                    }

                    return `<a href="${g3 && g3.includes('http') ? '' : 'https://'}${g2}" target="_blank" rel="noreferrer noopener">${g1.trim()}</a>`;
                },
            },

            /**
             * Automatically links emails that are not in a link. Runs before the autolinker as it will not link an
             * email that is in a link
             */
            {
                name: 'autoEmail',
                regex: /(?![^<]*>|[^<>]*<\\)([_*~]*)([_*~]*)([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+?(\.[a-zA-Z]+)+)\2\1(?![^<]*(<\/pre>|<\/code>|<\/a>))/gim,
                replacement: (match, g1, g2, g3) => `${g1}${g2}<a href="mailto:${g3}">${g3}</a>${g2}${g1}`,
            },

            /**
             * Automatically link urls. Runs last of our linkers since we want anything manual to link before this,
             * and we do not want to break emails.
             */
            {
                name: 'autolink',

                process: (textToProcess, replacement) => {
                    const regex = new RegExp(
                        `(?![^<]*>|[^<>]*<\\/)([_*~]*?)${URL_REGEX}\\1(?![^<]*(<\\/pre>|<\\/code>))`,
                        'gi',
                    );
                    return this.modifyTextForUrlLinks(regex, textToProcess, replacement);
                },

                // We use a function here to check if there is already a https:// on the link.
                // If there is not, we force the link to be absolute by prepending '//' to the target.
                replacement: (match, g1, g2, g3) => (
                    `${g1}<a href="${g3 && g3.includes('http') ? '' : 'https://'}${g2}" target="_blank" rel="noreferrer noopener">${g2}</a>${g1}`
                ),
            },
            {
                /**
                 * Use \b in this case because it will match on words, letters,
                 * and _: https://www.rexegg.com/regex-boundaries.html#wordboundary
                 * The !_blank is to prevent the `target="_blank">` section of the
                 * link replacement from being captured Additionally, something like
                 * `\b\_([^<>]*?)\_\b` doesn't work because it won't replace
                 * `_https://www.test.com_`
                 */
                name: 'italic',
                regex: /(?!_blank")\b_((?!\s).*?\S)_\b(?![^<]*(<\/pre>|<\/code>|<\/a>|_blank))/g,
                replacement: '<em>$1</em>',
            },
            {
                // Use \B in this case because \b doesn't match * or ~.
                // \B will match everything that \b doesn't, so it works
                // for * and ~: https://www.rexegg.com/regex-boundaries.html#notb
                name: 'bold',
                regex: /\B\*((?=\S)(([^\s*]|\s(?!\*))+?))\*\B(?![^<]*(<\/pre>|<\/code>|<\/a>))/g,
                replacement: '<strong>$1</strong>',
            },
            {
                name: 'strikethrough',
                regex: /\B~((?=\S)((~~(?!~)|[^\s~]|\s(?!~))+?))~\B(?![^<]*(<\/pre>|<\/code>|<\/a>))/g,
                replacement: '<del>$1</del>',
            },
            {
                name: 'quote',

                // We also want to capture a blank line before or after the quote so that we do not add extra spaces.
                // block quotes naturally appear on their own line. Blockquotes should not appear in code fences or
                // inline code blocks. A single prepending space should be stripped if it exists
                process: (textToProcess, replacement) => {
                    const regex = new RegExp(
                        /\n?^&gt; ?(?![^<]*(?:<\/pre>|<\/code>))([^\v\n\r]+)\n?/gm,
                    );
                    return this.modifyTextForQuote(regex, textToProcess, replacement);
                },
                replacement: g1 => `<blockquote>${g1}</blockquote>`,
            },
            {
                name: 'heading1',
                regex: /^#(?!#) +(.+)$\s*/gm,
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
            {
                name: 'replacebrquote',
                regex: /<br\s*[/]?><blockquote>\s*/gi,
                replacement: '<blockquote>',
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
                regex: /\s*<(h1)(?:"[^"]*"|'[^']*'|[^'">])*>(.*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))\s*/gi,
                replacement: '\n# $2\n',
            },
            {
                name: 'italic',
                regex: /<(em|i)(?:"[^"]*"|'[^']*'|[^'">])*>(.*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
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
                    const resultString = g2.trim().split('\n').map(m => `> ${m}`).join('\n');
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
                regex: /<(pre)(?:"[^"]*"|'[^']*'|[^'">])*>([\s\S]*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
                replacement: '```\n$2\n```',
            },
            {
                name: 'anchor',
                regex: /<(a)[^><]*href\s*=\s*(['"])(.*?)\2(?:".*?"|'.*?'|[^'"><])*>(.*?)<\/\1>(?![^<]*(<\/pre>|<\/code>))/gi,
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
                name: 'blockquoteopen',
                regex: /(.|\s)(<blockquote>)/gi,
                replacement: '$1\n',
            },
            {
                name: 'blockquote',
                regex: /<\/blockquote>(.|\s)/gm,
                replacement: '\n$1',
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
        let replacedText = shouldEscapeText ? Str.safeEscape(text) : text;

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
        let abort = false;

        while (match !== null) {
            // we want to avoid matching email address domains
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
                // `match[1]` contains the text inside []. Text is already escaped due to the rules
                // that precede the link rule (eg, codeFence, inlineCodeBlock, email).
                const linkText = this.replace(match[1], {
                    filterRules: ['bold', 'strikethrough', 'italic'],
                    shouldEscapeText: false,
                });
                replacedText = replacedText.concat(replacement(match[0], linkText, match[2], match[3]));
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
        generatedMarkdown = generatedMarkdown.replace(/<div.*?>|<\/div>|<comment.*?>|\n<\/comment>|<\/comment>|<h2>|<\/h2>|<h3>|<\/h3>|<h4>|<\/h4>|<h5>|<\/h5>|<h6>|<\/h6>/gm, '[block]');
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
                    // Avoid blank lines starting with &gt;
                    if (textSplitted[i].trim() !== '&gt;') {
                        textSplitted[i] = textSplitted[i].substr(4).trim();
                        textSplitted[i] = textSplitted[i].trim();
                        textToFormat += `${textSplitted[i]}\n`;

                        // We need ensure that index i-1 >= 0
                    } else if (i > 0) {
                        // Certificate that we will have only one blank row
                        if (textSplitted[i - 1].trim() !== '') {
                            textSplitted[i] = textSplitted[i].substr(4).trim();
                            textSplitted[i] = textSplitted[i].trim();
                            textToFormat += `${textSplitted[i]}\n`;
                        }
                    }
                } else {
                    // Make sure we will only modify if we have Text needed to be formatted for quote
                    if (textToFormat !== '') {
                        textToFormat = textToFormat.replace(/\n$/, '');
                        replacedText += replacement(textToFormat);
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
                textToFormat = textToFormat.replace(/\n$/, '');
                replacedText += replacement(textToFormat);
            }

            // Replace all the blank lines between quotes, if there are only blank lines between them
            replacedText = replacedText.replace(/(<\/blockquote>((\s*)+)<blockquote>)/g, '</blockquote><blockquote>');
        } else {
            // If we doesn't have matches make sure the function will return the same textToCheck
            replacedText = textToCheck;
        }
        return replacedText;
    }
}
