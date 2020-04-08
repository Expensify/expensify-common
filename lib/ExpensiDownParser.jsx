export default class ExpensiDownParser {
    constructor() {
        /**
         * The list of regex replacements to do on a comment. Check the link regex is first so links are processed
         * before other delimeters
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
                regex: '(?:^|\\s)(\\*)(.*?)\\1(?:\\s|$)',
                replacement: ' <strong>$2</strong> '
            },
            {
                name: 'italic',
                regex: '(?:^|\\s)(\\_)(.*?)\\1(?:\\s|$)',
                replacement: ' <em>$2</em> '
            },
            {
                name: 'strikethrough',
                regex: '(?:^|\\s)(\\~)(.*?)\\1(?:\\s|$)',
                replacement: ' <del>$2</del> '
            }
        ];
    }

    replace(text) {
        this.rules.forEach((rule) => {
            /**
             * The replacements for bold/italic/strikethrough have spaces added on the front and back of the replacement
             * value (since we're capturing those spaces), so make sure we trim the string after the replacement is done
             *
             * We want to capture those spaces so that we capture "* test *" but not "test*test*test"
             */
            text = text.replace(new RegExp(rule.regex, "g"), rule.replacement).trim();
        });

        return text;
    }
};
