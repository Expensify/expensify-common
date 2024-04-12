import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

const testCases = [
    // Basic text
    'This is a simple text without any Markdown formatting.',

    // Italic
    '*This* is *italic* text with *asterisks*.',
    '_This_ is _italic_ text with _underscores_.',

    // Bold
    '**This** is **bold** text with **asterisks**.',
    '__This__ is __bold__ text with __underscores__.',

    // Bold and Italic
    '***This*** is ***bold and italic*** text with ***asterisks***.',
    '___This___ is ___bold and italic___ text with ___underscores___.',
    '**_This_** is **_bold and italic_** text with **_mixed delimiters_**.',

    // Escaping
    'This text contains an escaped asterisk: \\*not italic\\*.',
    'This text contains an escaped underscore: \\_not italic\\_.',

    // Links
    'This is an [inline link](https://example.com).',
    'This is a [link with title](https://example.com "Example Title").',
    'This is a [reference-style link][example].',
    '[example]: https://example.com',

    // Combinations
    '*This* is *italic* and **this** is **bold**.',
    '_This_ is _italic_ and __this__ is __bold__.',
    '*This* is *italic*, **this** is **bold**, and ***this*** is ***both***.',
    '_This_ is _italic_, __this__ is __bold__, and ___this___ is ___both___.',
    'This is *italic with **bold** inside* and **bold with *italic* inside**.',
    'This is _italic with __bold__ inside_ and __bold with _italic_ inside__.',

    // Edge Cases
    '****Bold with four asterisks****',
    '____Bold with four underscores____',
    '*****Bold and italic with five asterisks*****',
    '_____Bold and italic with five underscores_____',
    '***Bold and italic with three asterisks**',
    '___Bold and italic with three underscores__',
    '**Bold with two asterisks*',
    '__Bold with two underscores_',
    '*Italic with one asterisk**',
    '_Italic with one underscore__',

    // Complex Examples
    'This is a ***complex*** _example_ with [multiple](https://example.com) **formatting** options \\*combined\\*.',
    '*This* is *an **example** of* **_nested_** ~~formatting~~.',
    'This is an *italic [link](https://example.com)* and a **bold [link](https://example.com)**.',
    'This \\*is\\* an \\*example\\* with \\*escaped\\* \\*\\*formatting\\*\\*.',

    // Headers
    '# This is a heading1',
    '## This is a heading2',
    '### This is a heading3',
    '#### This is a heading4',
    '##### This is a heading5',
    '###### This is a heading6',

    // Blockquotes
    '> This is a blockquote',
    '> This is a blockquote\n> with multiple lines',

    // Lists
    '- Item 1\n- Item 2\n- Item 3',
    '1. Item 1\n2. Item 2\n3. Item 3',

    // Code
    'This is `inline code`',
    '```\nThis is a code block\n```',

    // Horizontal Rule
    '---',
    '***',
    '___',

    // Tables
    '| Column 1 | Column 2 |\n| -------- | -------- |\n| Row 1, Cell 1 | Row 1, Cell 2 |\n| Row 2, Cell 1 | Row 2, Cell 2 |',

    // Strikethrough
    'This is ~~strikethrough~~ text.',

    // Task Lists
    '- [x] Completed task\n- [ ] Incomplete task',

    // Emoji
    'This is an :emoji:',

    // Mention
    'This is a @mention',
];

describe('ExpensiMark.truncateMarkdown', () => {
    test('should truncate Markdown text correctly', () => {
        const expectedOutputs = [
            'This is a simple...',
            'This is italic...',
            'This is italic...',
            'This is...',
            'This is...',
            'This is...',
            'This is...',
            'This is...',
            'This text contains...',
            'This text contains...',
            'This is an...',
            'This is a link...',
            'This is a...',
            '[example]:...',
            'This is italic...',
            'This is italic...',
            'This is italic,...',
            'This is italic,...',
            'This is italic...',
            'This is italic...',
            'Bold with...',
            'Bold with...',
            'Bold and...',
            'Bold and...',
            'Bold and...',
            'Bold and...',
            'Bold with two...',
            'Bold with two...',
            'Italic with one...',
            'Italic with one...',
            'This is a...',
            'This is an...',
            'This is an...',
            'This *is* an...',
            'This is a...',
            'This is a...',
            'This is a...',
            'This is a...',
            'This is a...',
            'This is a...',
            'This is a...',
            'This is a...',
            'Item 1...',
            'Item 1...',
            'This is inline...',
            '...',
            '---',
            '***',
            '___',
            'Column 1 |...',
            'This is...',
            'Completed...',
            'This is an...',
            'This is a...',
        ];

        testCases.forEach((testCase, index) => {
            const truncatedText = parser.truncateMarkdown(testCase, 20, true);
            console.log(`Original Text: ${testCase}`);
            console.log(`Truncated Text: ${truncatedText}`);
            console.log('---');

            expect(truncatedText).toEqual(expectedOutputs[index]);
        });
    });

    test('should handle empty text', () => {
        const emptyText = '';
        const truncatedText = parser.truncateMarkdown(emptyText, 20, true);
        expect(truncatedText).toEqual('');
    });

    test('should handle text shorter than the limit', () => {
        const shortText = 'Short text';
        const truncatedText = parser.truncateMarkdown(shortText, 20, true);
        expect(truncatedText).toEqual(shortText);
    });

    test('should add ellipsis when truncated and ellipsis option is true', () => {
        const longText = 'This is a long text that will be truncated.';
        const truncatedText = parser.truncateMarkdown(longText, 20, true);
        expect(truncatedText).toMatch(/\.\.\.$/);
    });

    test('should not add ellipsis when truncated and ellipsis option is false', () => {
        const longText = 'This is a long text that will be truncated.';
        const truncatedText = parser.truncateMarkdown(longText, 20, false);
        expect(truncatedText).not.toMatch(/\.\.\.$/);
    });

    test('should preserve formatting when truncating', () => {
        const formattedText = 'This is *italic*, **bold**, and ***bold italic*** text.';
        const truncatedText = parser.truncateMarkdown(formattedText, 20, true);
        expect(truncatedText).toEqual('This is italic, bold...');
    });

    test('should handle multiple paragraphs', () => {
        const multiParagraphText = 'Paragraph 1\n\nParagraph 2\n\nParagraph 3';
        const truncatedText = parser.truncateMarkdown(multiParagraphText, 20, true);
        expect(truncatedText).toEqual('Paragraph 1...');
    });

    test('should handle headers', () => {
        const headerText = '# Heading 1\n\n## Heading 2\n\nParagraph';
        const truncatedText = parser.truncateMarkdown(headerText, 20, true);
        expect(truncatedText).toEqual('Heading 1...');
    });

    test('should handle blockquotes', () => {
        const blockquoteText = '> This is a blockquote\n>\n> With multiple lines';
        const truncatedText = parser.truncateMarkdown(blockquoteText, 20, true);
        expect(truncatedText).toEqual('This is a...');
    });

    test('should handle lists', () => {
        const listText = '- Item 1\n- Item 2\n- Item 3';
        const truncatedText = parser.truncateMarkdown(listText, 20, true);
        expect(truncatedText).toEqual('Item 1...');
    });

    test('should handle code blocks', () => {
        const codeBlockText = '```\nThis is a code block\nWith multiple lines\n```';
        const truncatedText = parser.truncateMarkdown(codeBlockText, 20, true);
        expect(truncatedText).toEqual('\nThis is a code...\n');
    });

    test('should handle horizontal rules', () => {
        const horizontalRuleText = 'Paragraph\n\n---\n\nParagraph';
        const truncatedText = parser.truncateMarkdown(horizontalRuleText, 20, true);
        expect(truncatedText).toEqual('Paragraph\n\n...');
    });

    test('should handle tables', () => {
        const tableText = '| Column 1 | Column 2 |\n| -------- | -------- |\n| Row 1, Cell 1 | Row 1, Cell 2 |\n| Row 2, Cell 1 | Row 2, Cell 2 |';
        const truncatedText = parser.truncateMarkdown(tableText, 20, true);
        expect(truncatedText).toEqual('| Column 1 | Column...');
    });

    test('should handle strikethrough', () => {
        const strikethroughText = 'This is ~~strikethrough~~ text.';
        const truncatedText = parser.truncateMarkdown(strikethroughText, 20, true);
        expect(truncatedText).toEqual('This is...');
    });

    test('should handle task lists', () => {
        const taskListText = '- [x] Completed task\n- [ ] Incomplete task';
        const truncatedText = parser.truncateMarkdown(taskListText, 20, true);
        expect(truncatedText).toEqual('- [x] Completed task...');
    });

    test('should handle emoji', () => {
        const emojiText = 'This is an :emoji:.';
        const truncatedText = parser.truncateMarkdown(emojiText, 20, true);
        expect(truncatedText).toEqual('This is an :emoji:.');
    });

    test('should handle mentions', () => {
        const mentionText = 'This is a @mention.';
        const truncatedText = parser.truncateMarkdown(mentionText, 20, true);
        expect(truncatedText).toEqual('This is a @mention.');
    });
});
