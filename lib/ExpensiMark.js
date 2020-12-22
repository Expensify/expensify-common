import Str from './str';
import TLD_REGEX from './tlds';

const URL_WEBSITE_REGEX = `(https?:\\/\\/)?((?:www\\.)?[-a-z0-9]+?\\.)+(?:${TLD_REGEX})(?:\\:\\d{2,4}|\\b|(?=_))`;
const URL_PATH_REGEX = '(?:\\/[-\\w$@.&+!*"\'(),=%]*[-\\w~@:%)]|\\/)*';
const URL_PARAM_REGEX = '\\?[-\\w$@.&+!*"\'(),=%{}:;\\[\\]]+';
const URL_FRAGMENT_REGEX = '#[-\\w$@.&+!*"\'(),=%;\\/]*';
const URL_REGEX = `(${URL_WEBSITE_REGEX}${URL_PATH_REGEX}(?:${URL_PARAM_REGEX}|${URL_FRAGMENT_REGEX})?)`;

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
                regex: /&#x60;&#x60;&#x60;\n((?:(?!&#x60;&#x60;&#x60;)[\s\S])+)\n&#x60;&#x60;&#x60;/g,

                // We're using a function here to perform an additional replace on the content
                // inside the backticks because Android is not able to use <pre> tags and does
                // not respect whitespace characters at all like HTML does. We do not want to mess
                // with the new lines here since they need to be converted into <br>. And we don't
                // want to do this anywhere else since that would break HTML.
                replacement: (match, firstCapturedGroup) => {
                    const group = firstCapturedGroup.replace(/(?:(?![\n\r])\s)/g, '&nbsp;');
                    return `<pre>${group}</pre>`;
                },
            },

            /**
             * Apply inline code-block to avoid applying any other formatting rules inside of it,
             * like we do for the multi-line code-blocks
             */
            {
                name: 'inlineCodeBlock',

                // Use the url escaped version of a backtick (`) symbol
                regex: /\B&#x60;(.*?)&#x60;\B(?![^<]*<\/pre>)/g,
                replacement: '<code>$1</code>',
            },

            /**
             * Converts markdown style links to anchor tags e.g. [Expensify](https://www.expensify.com)
             * We need to convert before the autolink rule since it will not try to create a link
             * from an existing anchor tag.
             */
            {
                name: 'link',

                process: (textToProcess, replacement) => {
                    // eslint-disable-next-line max-len
                    const regex = new RegExp(`\\[([\\w\\s\\d!?&#;]+)\\]\\(${URL_REGEX}\\)(?![^<]*(<\\/pre>|<\\/code>))`, 'gi');
                    return this.modifyTextForUrlLinks(regex, textToProcess, replacement);
                },

                // We use a function here to check if there is already a https:// on the link. If there is not, we force
                // the link to be absolute by prepending '//' to the target.
                // eslint-disable-next-line max-len
                replacement: (match, g1, g2, g3) => `<a href="${g3 && g3.includes('http') ? '' : 'http://'}${g2}" target="_blank">${g1}</a>`,
            },
            {
                name: 'autolink',

                process: (textToProcess, replacement) => {
                    // eslint-disable-next-line max-len
                    const regex = new RegExp(`(?![^<]*>|[^<>]*<\\/)([_*~]*?)${URL_REGEX}\\1(?![^<]*(<\\/pre>|<\\/code>))`, 'gi');
                    return this.modifyTextForUrlLinks(regex, textToProcess, replacement);
                },

                // We use a function here to check if there is already a https:// on the link.
                // If there is not, we force the link to be absolute by prepending '//' to the target.
                // eslint-disable-next-line max-len
                replacement: (match, g1, g2, g3) => `${g1}<a href="${g3 && g3.includes('http') ? '' : 'http://'}${g2}" target="_blank">${g2}</a>${g1}`,
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
                regex: /(?!_blank">)\b_(.*?)_\b(?![^<]*(<\/pre>|<\/code>))/g,
                replacement: '<em>$1</em>'
            },
            {
                // Use \B in this case because \b doesn't match * or ~.
                // \B will match everything that \b doesn't, so it works
                // for * and ~: https://www.rexegg.com/regex-boundaries.html#notb
                name: 'bold',
                regex: /\B\*(.*?)\*\B(?![^<]*(<\/pre>|<\/code>))/g,
                replacement: '<strong>$1</strong>'
            },
            {
                name: 'strikethrough',
                regex: /\B~(.*?)~\B(?![^<]*(<\/pre>|<\/code>))/g,
                replacement: '<del>$1</del>'
            },
            {
                name: 'quote',

                // We also want to capture a blank line before or after the quote so that we do not add extra spaces.
                // block quotes naturally appear on their own line. Blockquotes should not appear in code fences or
                // inline code blocks. A single prepending space should be stripped if it exists
                regex: /\n?^&gt; ?(?![^<]*(?:<\/pre>|<\/code>))([^\v\n\r]+)\n?/gm,
                replacement: '<blockquote>$1</blockquote>'
            },
            {
                name: 'newline',
                regex: /\n/g,
                replacement: '<br>',
            },
        ];
    }

    /**
     * Replaces markdown with html elements
     *
     * @param {String} text
     *
     * @returns {String}
     */
    replace(text) {
        // This ensures that any html the user puts into the comment field shows as raw html
        let replacedText = Str.safeEscape(text);

        this.rules.forEach((rule) => {
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

            replacedText = replacedText.concat(textToCheck.substr(startIndex, (match.index - startIndex)));

            if (abort) {
                replacedText = replacedText.concat(textToCheck.substr(match.index, (match[0].length)));
            } else {
                replacedText = replacedText.concat(replacement(match[0], match[1], match[2], match[3]));
            }
            startIndex = match.index + (match[0].length);

            // Now we move to the next match that the js regex found in the text
            match = regex.exec(textToCheck);
        }
        if (startIndex < textToCheck.length) replacedText = replacedText.concat(textToCheck.substr(startIndex));

        return replacedText;
    }
}
