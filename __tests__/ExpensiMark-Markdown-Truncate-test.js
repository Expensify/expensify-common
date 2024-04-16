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
        expect(result).toBe('This is a text with [a link](https://example.com) that exceeds the limit. The link...');
    });

    test('should handle text with code blocks', () => {
        const text = 'This is a text with ```code block``` that exceeds the limit. The code block should be preserved in the truncated text. Here is an example code block:\n\n```javascript\nconsole.log("Hello, world!");\n```\n\nThe truncation should handle code blocks correctly.';
        const limit = 100;
        const result = parser.truncateMarkdown(text, limit, true);
        expect(result).toBe('This is a text with ```code block``` that exceeds the limit. The code block should be preserved in...');
    });
});