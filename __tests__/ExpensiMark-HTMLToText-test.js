/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

test('Test space replacement on breakline', () => {
    const html = '1<br />2<br />3';
    const text = '1 2 3';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test space replacement on blockquote close tag', () => {
    const html = '<blockquote>Confusing stuff</blockquote>Tell me about it';
    const text = 'Confusing stuff Tell me about it';

    expect(parser.htmlToText(html)).toBe(text);
});

test('Test replacement on html', () => {
    const html = 'First Line<br /><blockquote>Quoted line <code>code</code></blockquote>3<br /><blockquote>4</blockquote>Five';
    const text = 'First Line Quoted line code 3 4 Five';

    expect(parser.htmlToText(html)).toBe(text);
});
