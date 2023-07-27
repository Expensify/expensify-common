/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';
import _ from 'underscore';

const parser = new ExpensiMark();

test('Test text is escaped', () => {
    const testString = '& &amp; &lt; <';
    const resultString = '&amp; &amp;amp; &amp;lt; &lt;';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test text is unescaped', () => {
    const htmlString = '&amp;&#32;&amp;amp;&#32;&amp;lt;&#32;&lt;';
    const resultString = '& &amp; &lt; <';
    expect(parser.htmlToText(htmlString)).toBe(resultString);
});

test('Test with regex Maximum regex stack depth reached error', () => {
    const testString = '<h1>heading</h1> asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjcdidjjcdkekdiccjdkejdjcjxisdjjdkedncicdjejejcckdsijcjdsodjcicdkejdicdjejajasjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfisjksksjsjssskssjskskssksksksksskdkddkddkdksskskdkdkdksskskskdkdkdkdkekeekdkddenejeodxkdndekkdjddkeemdjxkdenendkdjddekjcjdkekejdcjdkeekcjcdidjjcdkekdiccjdkejdjcjxisdjjdkedncicdjejejcckdsijcjdsodjcicdkejdicdjejajasjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjcdidjjcdkekdiccjdkejdjcjxisdjjdkedncicdjejejcckdsijcjdsodjcicdkejdi.cdjd';
    const parser = new ExpensiMark();
    // Mock method modifyTextForUrlLinks to let it throw an error to test try/catch of method ExpensiMark.replace
    const modifyTextForUrlLinksMock = jest.fn((a, b, c) => {throw new Error('Maximum regex stack depth reached')});
    parser.modifyTextForUrlLinks = modifyTextForUrlLinksMock;
    expect(parser.replace(testString)).toBe(_.escape(testString));
    expect(modifyTextForUrlLinksMock).toHaveBeenCalledTimes(1);

    // Mock method extractLinksInMarkdownComment to let it return undefined to test try/catch of method ExpensiMark.extractLinksInMarkdownComment
    const extractLinksInMarkdownCommentMock = jest.fn((a) => undefined);
    parser.extractLinksInMarkdownComment = extractLinksInMarkdownCommentMock;
    expect(parser.extractLinksInMarkdownComment(testString)).toBe(undefined);
    expect(parser.getRemovedMarkdownLinks(testString, 'google.com')).toStrictEqual([]);
    expect(extractLinksInMarkdownCommentMock).toHaveBeenCalledTimes(3);
});
