/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

test('Test text is escaped', () => {
    const testString = '& &amp; &lt; <';
    const resultString = '&amp; &amp;amp; &amp;lt; &lt;';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test text is unescaped', () => {
    const htmlString = '&amp; &#38; &amp;amp; &amp;lt; &#60; &lt;';
    const resultString = '& & &amp; &lt; < <';
    expect(parser.htmlToText(htmlString)).toBe(resultString);
});
