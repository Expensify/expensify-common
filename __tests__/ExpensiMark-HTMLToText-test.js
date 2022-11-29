/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

test('Test new line replacement on breakline', () => {
    const html = '1<br />2<br />3';
    const text = '1\n2\n3';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on consecutive breaklines', () => {
    const html = '1 <br /><br /><br />2<br />3';
    const text = '1 \n\n\n2\n3';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on blockquote without content before blockquote', () => {
    const html = '<blockquote>Confusing stuff</blockquote>Tell me about it';

    // No new line should be added for <blockquote> if there is no content before it
    const text = 'Confusing stuff\nTell me about it';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on blockquote with content before blockquote', () => {
    const html = 'content before<blockquote>Confusing stuff</blockquote>Tell me about it';

    // A new line should be added for <blockquote> if there is content before it
    const text = 'content before\nConfusing stuff\nTell me about it';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on blockquote without content after closing blockquote', () => {
    const html = 'content before<blockquote>Confusing stuff</blockquote>';

    // No new line should be added after </blockquote> because there is no content after it
    const text = 'content before\nConfusing stuff';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test replacement on mixed html', () => {
    const html = 'First Line<br /><blockquote>Quoted line <code>code</code></blockquote>3<br /><blockquote>4</blockquote>Five';

    // A new line should be added for <blockquote> because there is content before it
    const text = 'First Line\n\nQuoted line code\n3\n\n4\nFive';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test strip unhandled tags', () => {
    const html = 'First Line<br /><div>Quoted line <code>code</code></div>3<br /><span>4</span>Five';

    // A new line should be added for <blockquote> because there is content before it
    const text = 'First Line\nQuoted line code3\n4Five';

    expect(parser.htmlToText(html)).toBe(text);
});
