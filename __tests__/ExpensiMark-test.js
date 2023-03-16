/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

test('Test text is escaped', () => {
    const testString = '& &amp; &lt; <';
    const resultString = '&amp; &amp;amp; &amp;lt; &lt;';
    expect(parser.replace(testString)).toBe(resultString);
});
