import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

describe('truncateMarkdown', () => {
    test('should return original text if it does not exceed the limit', () => {
        const text = 'This is a *short* text that does not exceed the character limit.';
        const limit = 100;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe(text);
    });

    test('should truncate text and add ellipsis if it exceeds the limit', () => {
        const text = 'This is a *long* text that exceeds the character limit. It contains multiple sentences to test the truncation functionality. The truncation should occur at the nearest space to avoid cutting off words.';
        const limit = 80;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a *long* text that exceeds the character limit. It contains multiple...');
    });

    test('should truncate text without adding ellipsis if specified', () => {
        const text = 'This is a *long* text that exceeds the character limit. It contains multiple sentences to test the truncation functionality. The truncation should occur at the nearest space to avoid cutting off words.';
        const limit = 80;
        const result = parser.truncateMarkdown(text, limit, false);
        expect(result).toBe('This is a *long* text that exceeds the character limit. It contains multiple');
    });

    test('should not truncate in the middle of a word', () => {
        const text = 'This is a *long* text that exceeds the character limit. It contains a very long word at the end: antidisestablishmentarianism.';
        const limit = 90;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a *long* text that exceeds the character limit. It contains a very long word at...');
    });

    test('should handle text with multiple markdown elements', () => {
        const text = 'This is a *long* text with _multiple_ markdown ~elements~. It includes *bold*, _italic_, and ~strikethrough~ formatting. The truncation should preserve the markdown syntax.';
        const limit = 80;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a *long* text with _multiple_ markdown ~elements~. It includes *bold*,...');
    });

    test('should handle text with nested markdown elements', () => {
        const text = 'This is a *long _nested_ markdown* text. It contains *_bold italic_* and ~_strikethrough italic_~ formatting. The truncation should handle the nesting correctly.';
        const limit = 80;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a *long _nested_ markdown* text. It contains *_bold italic_* and...');
    });

    test('should handle text with links', () => {
        const text = 'This is a text with [a link](https://example.com) that exceeds the limit. The link should be preserved in the truncated text. Additionally, it includes [another link](https://example.org) for testing purposes.';
        const limit = 80;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a text with [a link](https://example.com) that exceeds the limit. The...');
    });

    test('should handle text with code blocks', () => {
        const text = 'This is a text with ```code block``` that exceeds the limit. The code block should be preserved in the truncated text. Here is an example code block:\n\n```javascript\nconsole.log("Hello, world!");\n```\n\nThe truncation should handle code blocks correctly.';
        const limit = 100;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a text with ```code block``` that exceeds the limit. The code block should be preserved in...');
    });

    test('should handle text with inline code', () => {
        const text = 'This is a text with `inline code` that exceeds the limit. The inline code should be preserved in the truncated text. Additionally, it includes `another inline code` for testing purposes.';
        const limit = 80;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a text with `inline code` that exceeds the limit. The inline code...');
    });

    test('should handle text with blockquotes', () => {
        const text = 'This is a text with > blockquote that exceeds the limit. The blockquote should be preserved in the truncated text. Here is an example blockquote:\n\n> This is a blockquote.\n> It can span multiple lines.\n\nThe truncation should handle blockquotes correctly.';
        const limit = 100;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a text with > blockquote that exceeds the limit. The blockquote should be preserved in the...');
    });

    test('should handle text with headings', () => {
        const text = '# Heading 1\n\nThis is a text with headings that exceeds the limit. The headings should be preserved in the truncated text. Here is an example of a heading:\n\n## Heading 2\n\nThe truncation should handle headings correctly.';
        const limit = 100;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('# Heading 1\n\nThis is a text with headings that exceeds the limit. The headings should be preserved...');
    });

    test('should handle text with lists', () => {
        const text = 'This is a text with lists that exceeds the limit. The lists should be preserved in the truncated text. Here is an example of a list:\n\n- Item 1\n- Item 2\n- Item 3\n\nThe truncation should handle lists correctly.';
        const limit = 100;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a text with lists that exceeds the limit. The lists should be preserved in the truncated...');
    });

    test('should handle text with horizontal rules', () => {
        const text = 'This is a text with horizontal rules that exceeds the limit. The horizontal rules should be preserved in the truncated text. Here is an example of a horizontal rule:\n\n---\n\nThe truncation should handle horizontal rules correctly.';
        const limit = 100;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a text with horizontal rules that exceeds the limit. The horizontal rules should be...');
    });

    test('should handle text with images', () => {
        const text = 'This is a text with an image ![alt text](https://example.com/image.jpg) that exceeds the limit. The image should be preserved in the truncated text. Additionally, it includes another image ![alt text 2](https://example.org/image2.jpg) for testing purposes.';
        const limit = 80;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a text with an image ![alt text](https://example.com/image.jpg) that...');
    });

    test('should return original text if it does not exceed the limit', () => {
        const htmlString = 'This is a <strong>short</strong> text that does not exceed the character limit.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 100;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a *short* text that does not exceed the character limit.');
    });

    test('should truncate text and add ellipsis if it exceeds the limit', () => {
        const htmlString = 'This is a <strong>long</strong> text that exceeds the character limit. It contains multiple sentences to test the truncation functionality. The truncation should occur at the nearest space to avoid cutting off words.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 80;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a *long* text that exceeds the character limit. It contains multiple...');
    });

    test('should truncate text without adding ellipsis if specified', () => {
        const htmlString = 'This is a <strong>long</strong> text that exceeds the character limit. It contains multiple sentences to test the truncation functionality. The truncation should occur at the nearest space to avoid cutting off words.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 80;
        const result = parser.truncateMarkdown(markdownString, limit, false);
        expect(result).toBe('This is a *long* text that exceeds the character limit. It contains multiple');
    });

    test('should not truncate in the middle of a word', () => {
        const htmlString = 'This is a <strong>long</strong> text that exceeds the character limit. It contains a very long word at the end: antidisestablishmentarianism.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 90;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a *long* text that exceeds the character limit. It contains a very long word at...');
    });

    test('should handle text with multiple markdown elements', () => {
        const htmlString = 'This is a <strong>long</strong> text with <em>multiple</em> markdown <del>elements</del>. It includes <strong>bold</strong>, <em>italic</em>, and <del>strikethrough</del> formatting. The truncation should preserve the markdown syntax.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 80;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a *long* text with _multiple_ markdown ~elements~. It includes *bold*,...');
    });

    test('should handle text with nested markdown elements', () => {
        const htmlString = 'This is a <strong>long <em>nested</em> markdown</strong> text. It contains <strong><em>bold italic</em></strong> and <del><em>strikethrough italic</em></del> formatting. The truncation should handle the nesting correctly.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 80;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a *long _nested_ markdown* text. It contains *_bold italic_* and...');
    });

    test('should handle text with links', () => {
        const htmlString = 'This is a text with <a href="https://example.com">a link</a> that exceeds the limit. The link should be preserved in the truncated text. Additionally, it includes <a href="https://example.org">another link</a> for testing purposes.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 80;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a text with [a link](https://example.com) that exceeds the limit. The...');
    });

    test('should handle text with code blocks', () => {
        const htmlString = 'This is a text with <pre>code block</pre> that exceeds the limit. The code block should be preserved in the truncated text. Here is an example code block:\n\n<pre>console.log("Hello, world!");</pre>\n\nThe truncation should handle code blocks correctly.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 100;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a text with ```\ncode block\n```\n that exceeds the limit. The code block should be preserved...');
    });

    test('should handle text with inline code', () => {
        const htmlString = 'This is a text with <code>inline code</code> that exceeds the limit. The inline code should be preserved in the truncated text. Additionally, it includes <code>another inline code</code> for testing purposes.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 80;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a text with `inline code` that exceeds the limit. The inline code...');
    });

    test('should handle text with blockquotes', () => {
        const htmlString = 'This is a text with <blockquote>blockquote</blockquote> that exceeds the limit. The blockquote should be preserved in the truncated text. Here is an example blockquote:\n\n<blockquote>This is a blockquote.\nIt can span multiple lines.</blockquote>\n\nThe truncation should handle blockquotes correctly.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 100;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a text with \n> blockquote\n that exceeds the limit. The blockquote should be preserved in...');
    });

    test('should handle text with headings', () => {
        const htmlString = '<h1>Heading 1</h1>\n\nThis is a text with headings that exceeds the limit. The headings should be preserved in the truncated text. Here is an example of a heading:\n\n<h2>Heading 2</h2>\n\nThe truncation should handle headings correctly.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 179;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('# Heading 1\n\n\nThis is a text with headings that exceeds the limit. The headings should be preserved in the truncated text. Here is an example of a heading:\n\nHeading 2\n\n\nThe...');
    });

    test('should handle text with lists', () => {
        const htmlString = 'This is a text with lists that exceeds the limit. The lists should be preserved in the truncated text. Here is an example of a list:\n\n<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>\n\nThe truncation should handle lists correctly.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 168;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a text with lists that exceeds the limit. The lists should be preserved in the truncated text. Here is an example of a list:\n\n  Item 1\n  Item 2\n  Item 3\n\n\nThe...');
    });

    test('should handle text with horizontal rules', () => {
        const htmlString = 'This is a text with horizontal rules that exceeds the limit. The horizontal rules should be preserved in the truncated text. Here is an example of a horizontal rule:\n\n<hr />\n\nThe truncation should handle horizontal rules correctly.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 100;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a text with horizontal rules that exceeds the limit. The horizontal rules should be...');
    });

    test('should handle text with images', () => {
        const htmlString = 'This is a text with an image <img src="https://example.com/image.jpg" alt="alt text" /> that exceeds the limit. The image should be preserved in the truncated text. Additionally, it includes another image <img src="https://example.org/image2.jpg" alt="alt text 2" /> for testing purposes.';
        const markdownString = parser.htmlToMarkdown(htmlString);
        const limit = 80;
        const result = parser.truncateMarkdown(markdownString, limit, true);
        expect(result).toBe('This is a text with an image ![alt text](https://example.com/image.jpg) that...');
    });
});