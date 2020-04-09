export default class ExpensiDownParser {
    constructor() {
        /**
         * The list of regex replacements to do on a comment. Check the link regex is first so links are processed
         * before other delimiters
         *
         * @type {Object[]}
         */
        this.rules = [
            {
                name: 'link',
                regex: '([_*~]*?)(((?:https?):\\/\\/|www\\.)?[^\\s<>"\'´.-][^\\s<>"\'´]*?\\.[a-z\\d.]+[^\\s<>"\']*)\\1',
                replacement: '$1<a href="$2" target="_blank">$2</a>$1',
            },
            {
                // Use \b in this case because it will match on words, letters, and _: https://www.rexegg.com/regex-boundaries.html#wordboundary
                name: 'italic',
                regex: '\\b\\_(.*?)\\_\\b',
                replacement: '<em>$1</em>'
            },
            {
                // Use \B in this case because \b doesn't match * or ~. \B will match everything that \b doesn't, so it works for * and ~: https://www.rexegg.com/regex-boundaries.html#notb
                name: 'bold',
                regex: '\\B\\*(.*?)\\*\\B',
                replacement: '<strong>$1</strong>'
            },
            {
                name: 'strikethrough',
                regex: '\\B\\~(.*?)\\~\\B',
                replacement: '<del>$1</del>'
            }
        ];
    }

    replace(text) {
        this.rules.forEach((rule) => {
            text = text.replace(new RegExp(rule.regex, "g"), rule.replacement);
        });

        return text;
    }
};
