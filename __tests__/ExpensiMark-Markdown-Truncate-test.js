import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

describe('truncateHTML', () => {
    test('should return original text as HTML if it does not exceed the limit', () => {
        const markdown = 'This is a *short* text that does not exceed the character limit.';
        const limit = 100;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe(html);
    });

    test('should truncate HTML and add ellipsis if it exceeds the limit', () => {
        const markdown = 'This is a *long* text that exceeds the character limit. It contains multiple sentences to test the truncation functionality. The truncation should occur at the nearest space to avoid cutting off words.';
        const limit = 80;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a <strong>long</strong> text that exceeds the character limit. It contains multiple...');
    });

    test('should truncate HTML without adding ellipsis if specified', () => {
        const markdown = 'This is a *long* text that exceeds the character limit. It contains multiple sentences to test the truncation functionality. The truncation should occur at the nearest space to avoid cutting off words.';
        const limit = 80;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: false });
        expect(result).toBe('This is a <strong>long</strong> text that exceeds the character limit. It contains multiple');
    });

    test('should not truncate HTML in the middle of a word', () => {
        const markdown = 'This is a *long* text that exceeds the character limit. It contains a very long word at the end: antidisestablishmentarianism.';
        const limit = 90;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a <strong>long</strong> text that exceeds the character limit. It contains a very long word at...');
    });

    test('should handle HTML with multiple markdown elements', () => {
        const markdown = 'This is a *long* text with _multiple_ markdown ~elements~. It includes *bold*, _italic_, and ~strikethrough~ formatting. The truncation should preserve the markdown syntax.';
        const limit = 80;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a <strong>long</strong> text with <em>multiple</em> markdown <del>elements</del>. It includes...');
    });

    test('should handle HTML with nested markdown elements', () => {
        const markdown = 'This is a *long _nested_ markdown* text. It contains *_bold italic_* and ~_strikethrough italic_~ formatting. The truncation should handle the nesting correctly.';
        const limit = 80;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a <strong>long <em>nested</em> markdown</strong> text. It contains <strong><em>bold italic</em></strong> and...');
    });

    test('should handle HTML with links', () => {
        const markdown = 'This is a text with [a link](https://example.com) that exceeds the limit. The link should be preserved in the truncated text. Additionally, it includes [another link](https://example.org) for testing purposes.';
        const limit = 80;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a text with <a href="https://example.com" target="_blank" rel="noreferrer noopener">a link</a> that exceeds the limit. The...');
    });

    test('should handle HTML with code blocks', () => {
        const markdown = 'This is a text with ```code block``` that exceeds the limit. The code block should be preserved in the truncated text. Here is an example code block:\n\n```javascript\nconsole.log("Hello, world!");\n```\n\nThe truncation should handle code blocks correctly.';
        const limit = 100;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a text with <pre>code block</pre> that exceeds the limit. The code block should be preserved...');
    });

    test('should handle HTML with inline code', () => {
        const markdown = 'This is a text with `inline code` that exceeds the limit. The inline code should be preserved in the truncated text. Additionally, it includes `another inline code` for testing purposes.';
        const limit = 80;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a text with <code>inline code</code> that exceeds the limit. The inline code...');
    });

    test('should handle HTML with blockquotes', () => {
        const markdown = 'This is a text with > blockquote that exceeds the limit. The blockquote should be preserved in the truncated text. Here is an example blockquote:\n\n> This is a blockquote.\n> It can span multiple lines.\n\nThe truncation should handle blockquotes correctly.';
        const limit = 100;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a text with <blockquote>blockquote</blockquote> that exceeds the limit. The blockquote should be preserved...');
    });

    test('should handle HTML with headings', () => {
        const markdown = '# Heading 1\n\nThis is a text with headings that exceeds the limit. The headings should be preserved in the truncated text. Here is an example of a heading:\n\n## Heading 2\n\nThe truncation should handle headings correctly.';
        const limit = 100;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('<h1>Heading 1</h1>\n\nThis is a text with headings that exceeds the limit. The headings should be preserved...');
    });

    test('should handle HTML with lists', () => {
        const markdown = 'This is a text with lists that exceeds the limit. The lists should be preserved in the truncated text. Here is an example of a list:\n\n- Item 1\n- Item 2\n- Item 3\n\nThe truncation should handle lists correctly.';
        const limit = 100;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a text with lists that exceeds the limit. The lists should be preserved in the truncated text. Here is an example of a list:\n\n<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>\n\nThe...');
    });

    test('should handle HTML with horizontal rules', () => {
        const markdown = 'This is a text with horizontal rules that exceeds the limit. The horizontal rules should be preserved in the truncated text. Here is an example of a horizontal rule:\n\n---\n\nThe truncation should handle horizontal rules correctly.';
        const limit = 100;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a text with horizontal rules that exceeds the limit. The horizontal rules should be...');
    });

    test('should handle HTML with images', () => {
        const markdown = 'This is a text with an image ![alt text](https://example.com/image.jpg) that exceeds the limit. The image should be preserved in the truncated text. Additionally, it includes another image ![alt text 2](https://example.org/image2.jpg) for testing purposes.';
        const limit = 80;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, { ellipsis: true });
        expect(result).toBe('This is a text with an image <img src="https://example.com/image.jpg" alt="alt text" /> that...');
    });
});
