import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

describe('truncateHTML', () => {
    test('should return original text as HTML if it does not exceed the limit', () => {
        const markdown = 'This is a *short* text that does not exceed the character limit.';
        const limit = 100;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: true});
        expect(result).toBe(html);
    });

    test('should truncate HTML and add ellipsis if it exceeds the limit', () => {
        const markdown =
            'This is a *long* text that exceeds the character limit. It contains multiple sentences to test the truncation functionality. The truncation should occur at the specified character count.';
        const limit = 80;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: true});
        expect(result).toBe('This is a <strong>long</strong> text that exceeds the character limit. It contains multiple sente...');
    });

    test('should handle HTML with multiple markdown elements', () => {
        const markdown =
            'This is a *long* text with _multiple_ markdown ~elements~. It includes *bold*, _italic_, and ~strikethrough~ formatting. The truncation should preserve the markdown syntax.';
        const limit = 150;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: true});
        expect(result).toBe(
            'This is a <strong>long</strong> text with <em>multiple</em> markdown <del>elements</del>. It includes <strong>bold</strong>, <em>italic</em>, and <del>strikethrough</del> formatting. The truncation should preserve the markdo...',
        );
    });

    test('should handle HTML with nested markdown elements', () => {
        const markdown = 'This is a *long _nested_ markdown* text. It contains *_bold italic_* and ~_strikethrough italic_~ formatting. The truncation should handle the nesting correctly.';
        const limit = 120;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: true});
        expect(result).toBe(
            'This is a <strong>long <em>nested</em> markdown</strong> text. It contains <strong><em>bold italic</em></strong> and <del><em>strikethrough italic</em></del> formatting. The truncation should ...',
        );
    });

    test('should handle HTML with links', () => {
        const markdown =
            'This is a text with [a link](https://example.com) that exceeds the limit. The link should be preserved in the truncated text. Additionally, it includes [another link](https://example.org) for testing purposes.';
        const limit = 141;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: true});
        expect(result).toBe(
            `This is a text with <a href=\"https://example.com\" target=\"_blank\" rel=\"noreferrer noopener\">a link</a> that exceeds the limit. The link should be preserved in the truncated text. Additionally, it includes <a href=\"https://example.org\" target=\"_blank\" rel=\"noreferrer noopener\">another link</a>...`,
        );
    });

    test('should handle HTML with inline code', () => {
        const markdown = 'This is a text with `inline code`. The inline code should be preserved in the truncated text.';
        const limit = 25;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: true});
        expect(result).toBe('This is a text with <code>inlin...</code>');
    });

    test('should handle HTML with headings', () => {
        const markdown =
            '# Heading 1\n\nThis is a text with headings that exceeds the limit. The headings should be preserved in the truncated text. Here is an example of a heading:\n\n## Heading 2\n\nThe truncation should handle headings correctly.';
        const limit = 100;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: true});
        expect(result).toBe('<h1>Heading 1</h1><br />This is a text with headings that exceeds the limit. The headings should be preserved in th...');
    });

    test('should handle HTML with lists', () => {
        const markdown = `
    This is a text with lists. Here are examples:
    
    Unordered list:
    - Item 1
    - Item 2
    - Item 3
    
    Ordered list:
    1. First item
    2. Second item
    3. Third item
    `;
        const limit = 250; // Increased to accommodate full lists
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: false});
        expect(result).toBe(`<br />    This is a text with lists. Here are examples:<br />    <br />    Unordered list:<br />    - Item 1<br />    - Item 2<br />    - Item 3<br />    <br />    Ordered list:<br />    1. First item<br />    2. Second item<br />    3. Third item<br />    `);
    });

    test('should handle HTML with horizontal rules', () => {
        const markdown = 'This is a text with horizontal rules. Here is an example of a horizontal rule:\n\n---\n\nThe truncation should handle horizontal rules correctly.';
        const limit = 100;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: true});
        expect(result).toBe('This is a text with horizontal rules. Here is an example of a horizontal rule:<br /><br />---<br /><br />The truncation shou...');
    });

    test('should handle HTML with images', () => {
        const markdown =
            'This is a text with an image ![alt text](https://example.com/image.jpg) that exceeds the limit. The image should be preserved in the truncated text. Additionally, it includes another image ![alt text 2](https://example.org/image2.jpg) for testing purposes.';
        const limit = 80;
        const html = parser.replace(markdown);
        const result = parser.truncateHTML(html, limit, {ellipsis: true});
        expect(result).toBe('This is a text with an image <img src="https://example.com/image.jpg" alt="alt text" /> that exceeds the limit. The image should be preser...');
    });
});
