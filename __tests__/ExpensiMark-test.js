/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';
import * as Utils from '../lib/utils';

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
    const testString =
        '<h1>heading</h1> asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjcdidjjcdkekdiccjdkejdjcjxisdjjdkedncicdjejejcckdsijcjdsodjcicdkejdicdjejajasjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfisjksksjsjssskssjskskssksksksksskdkddkddkdksskskdkdkdksskskskdkdkdkdkekeekdkddenejeodxkdndekkdjddkeemdjxkdenendkdjddekjcjdkekejdcjdkeekcjcdidjjcdkekdiccjdkejdjcjxisdjjdkedncicdjejejcckdsijcjdsodjcicdkejdicdjejajasjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjcdidjjcdkekdiccjdkejdjcjxisdjjdkedncicdjejejcckdsijcjdsodjcicdkejdi.cdjd';
    const expensiMarkParser = new ExpensiMark();
    // Mock method modifyTextForUrlLinks to let it throw an error to test try/catch of method ExpensiMark.replace
    const modifyTextForUrlLinksMock = jest.fn(() => {
        throw new Error('Maximum regex stack depth reached');
    });
    expensiMarkParser.modifyTextForUrlLinks = modifyTextForUrlLinksMock;
    expect(expensiMarkParser.replace(testString)).toBe(Utils.escape(testString));
    expect(modifyTextForUrlLinksMock).toHaveBeenCalledTimes(1);

    // Mock method extractLinksInMarkdownComment to let it return undefined to test try/catch of method ExpensiMark.extractLinksInMarkdownComment
    const extractLinksInMarkdownCommentMock = jest.fn(() => undefined);
    expensiMarkParser.extractLinksInMarkdownComment = extractLinksInMarkdownCommentMock;
    expect(expensiMarkParser.extractLinksInMarkdownComment(testString)).toBe(undefined);
    expect(expensiMarkParser.getRemovedMarkdownLinks(testString, 'google.com')).toStrictEqual([]);
    expect(extractLinksInMarkdownCommentMock).toHaveBeenCalledTimes(3);
});

test('Test extract link with ending parentheses', () => {
    const comment =
        '[Staging Detail](https://staging.new.expensify.com/details) [Staging Detail](https://staging.new.expensify.com/details)) [Staging Detail](https://staging.new.expensify.com/details)))';
    const links = ['https://staging.new.expensify.com/details', 'https://staging.new.expensify.com/details', 'https://staging.new.expensify.com/details'];
    expect(parser.extractLinksInMarkdownComment(comment)).toStrictEqual(links);
});

test('Test extract link from Markdown link syntax', () => {
    const comment = 'www.google.com https://www.google.com [Expensify](https://new.expensify.com/)';
    const links = ['https://new.expensify.com/'];
    expect(parser.extractLinksInMarkdownComment(comment)).toStrictEqual(links);
});
