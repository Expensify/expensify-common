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

test('Test new line replacement on heading without content before heading', () => {
    const html = '<h1>Confusing stuff</h1>Tell me about it';

    // No new line should be added for <h1> if there is no content before it
    const text = 'Confusing stuff\nTell me about it';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on heading with content before heading', () => {
    const html = 'content before<h1>Confusing stuff</h1>Tell me about it';

    // A new line should be added for <h1> if there is content before it
    const text = 'content before\nConfusing stuff\nTell me about it';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on heading without content after closing heading', () => {
    const html = 'content before<h1>Confusing stuff</h1>';

    // No new line should be added after </h1> because there is no content after it
    const text = 'content before\nConfusing stuff';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on preformatted text without content before preformatted text', () => {
    const html = '<pre>Confusing stuff</pre>Tell me about it';

    // No new line should be added for <pre> if there is no content before it
    const text = 'Confusing stuff\nTell me about it';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on preformatted text with content before preformatted text', () => {
    const html = 'content before<pre>Confusing stuff</pre>Tell me about it';

    // A new line should be added for <pre> if there is content before it
    const text = 'content before\nConfusing stuff\nTell me about it';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on preformatted text without content after closing preformatted text', () => {
    const html = 'content before<pre>Confusing stuff</pre>';

    // No new line should be added after </pre> because there is no content after it
    const text = 'content before\nConfusing stuff';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test strip unhandled tags', () => {
    const html = 'First Line<br /><div>Quoted line <code>code</code></div>3<br /><span>4</span>Five';

    // Unhandled tags like <div> and <span> should be stripped without loosing the text content
    const text = 'First Line\nQuoted line code3\n4Five';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test replacement on mixed html', () => {
    const html = 'First Line<br /><blockquote>Quoted line <code>code</code></blockquote>3<br /><blockquote>4</blockquote><span>Five</span><h1>Six</h1>Seven<pre>Eight</pre>';
    const text = 'First Line\n\nQuoted line code\n3\n\n4\nFive\nSix\nSeven\nEight';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test new line replacement on blockquote with heading inside', () => {
    let testString = '<blockquote><h1>heading</h1></blockquote>';
    expect(parser.htmlToText(testString)).toBe('heading');

    testString = '<blockquote><h1>heading</h1>test</blockquote>';
    expect(parser.htmlToText(testString)).toBe('heading\ntest');

    testString = '<blockquote>test<br /><h1>heading</h1>test</blockquote>';
    expect(parser.htmlToText(testString)).toBe('test\n\nheading\ntest');

    testString = '<blockquote><h1>heading A</h1><h1>heading B</h1></blockquote>';
    expect(parser.htmlToText(testString)).toBe('heading A\n\nheading B');
});
