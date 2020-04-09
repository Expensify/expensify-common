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
                name: 'bold',
                regex: '\\B\\*(.*?)\\*\\B',
                replacement: '<strong>$1</strong>'
            },
            {
                name: 'italic',
                regex: '\\b\\_(.*?)\\_\\b',
                replacement: '<em>$1</em>'
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
