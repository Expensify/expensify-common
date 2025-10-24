/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';
import * as Utils from '../lib/utils';

const parser = new ExpensiMark();

test('Test text is escaped', () => {
    const testString = '& &amp; &lt; <';
    const resultString = '&amp; &amp;amp; &amp;lt; &lt;';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Disallow multiline markdown links (label and URL)', () => {
    // Multiline label inside [] should not form a link; URL is auto-linked inside parentheses
    let testString = 'Text with multiline label [Expensi\nfy](https://www.expensify.com) end.';
    let resultString = 'Text with multiline label [Expensi<br />fy](<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com</a>) end.';
    expect(parser.replace(testString)).toBe(resultString);

    // Windows-style newline in label -> auto-link URL inside parentheses
    testString = 'Text with CRLF label [Expen\r\nsify](https://www.expensify.com) end.';
    resultString = 'Text with CRLF label [Expen<br />sify](<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com</a>) end.';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Do not extract links from multiline markdown link', () => {
    const commentLabel = 'Before [Expen\nsify](https://example.com) after';
    const commentURL = 'Before [Expensify](https://exa\nmple.com) after';
    expect(parser.extractLinksInMarkdownComment(commentLabel)).toStrictEqual([]);
    expect(parser.extractLinksInMarkdownComment(commentURL)).toStrictEqual([]);
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
    expect(expensiMarkParser.replace(testString)).toBe(Utils.escapeText(testString));
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

describe('Test ExpensiMark getAttributeCache', () => {
    const expensiMark = new ExpensiMark();

    describe('For attrCachingFn', () => {
        test('If mediaAttributeCachingFn is provided, returns it', () => {
            const extras = {
                mediaAttributeCachingFn: jest.fn(),
            }
            expect(expensiMark.getAttributeCache(extras).attrCachingFn).toBe(extras.mediaAttributeCachingFn);
        })

        test('If mediaAttributeCachingFn is not provided, returns cacheVideoAttributes', () => {
            const extras = {
                cacheVideoAttributes: jest.fn(),
            }
            expect(expensiMark.getAttributeCache(extras).attrCachingFn).toBe(extras.cacheVideoAttributes);
        })

        test('If mediaAttributeCachingFn and cacheVideoAttributes are not provided, returns undefined', () => {
            const extras = {}
            expect(expensiMark.getAttributeCache(extras).attrCachingFn).toBe(undefined);
        })
    });

    describe('For attrCache', () => {
        test('If mediaAttributeCache is provided, returns it', () => {
            const extras = {
                mediaAttributeCache: jest.fn(),
            }
            expect(expensiMark.getAttributeCache(extras).attrCache).toBe(extras.mediaAttributeCache);
        })

        test('If mediaAttributeCache is not provided, returns videoAttributeCache', () => {
            const extras = {
                videoAttributeCache: jest.fn(),
            }
            expect(expensiMark.getAttributeCache(extras).attrCache).toBe(extras.videoAttributeCache);
        })

        test('If mediaAttributeCache and videoAttributeCache are not provided, returns undefined', () => {
            const extras = {}
            expect(expensiMark.getAttributeCache(extras).attrCache).toBe(undefined);
        })
    });

    test('If no extras are undefined, returns undefined for both attrCachingFn and attrCache', () => {
        const {attrCachingFn, attrCache} = expensiMark.getAttributeCache(undefined);
        expect(attrCachingFn).toBe(undefined);
        expect(attrCache).toBe(undefined);
    })
});

describe('Test ExpensiMark replaceBlockElementWithNewLine', () => {
    const blockElement = ['div', 'comment', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li'];
    describe.each(blockElement)('replace <%s> block exactly', (blockName) => {
        test('without blockquote', () => {
            const input = `textLine1<${blockName}>textLine2</${blockName}>textLine3   <${blockName}>textLine4\n</${blockName}><${blockName}># </${blockName}><${blockName}>textLine6</${blockName}>`;
            const expected = 'textLine1\ntextLine2\ntextLine3   \ntextLine4\n# textLine6';
            expect(parser.replaceBlockElementWithNewLine(input)).toBe(expected);
        });
        test('with blockquote', () => {
            const input = `<blockquote>> <${blockName}>textLine</${blockName}></blockquote>`;
            const expected = '> textLine';
            expect(parser.replaceBlockElementWithNewLine(input)).toBe(expected);
        });
    });

    test('replace <blockquote> block exactly', () => {
        const input = `<blockquote>> textLine1 </blockquote><blockquote>> textLine2\n</blockquote><blockquote>> textLine3</blockquote>`;
        const expected = '> textLine1 \n> textLine2\n> textLine3';
        expect(parser.replaceBlockElementWithNewLine(input)).toBe(expected);
    });

    test('replace multi block exactly', () => {
        const input = `<blockquote>> textLine1 </blockquote><blockquote>> <p>textLine2\n<p><div>textLine3</div></blockquote><h1>textLine4</h1><div><p><comment>textLine5\n\n</comment></p></div><li><p>textLine6</p></li>`;
        const expected = '> textLine1 \n> textLine2\ntextLine3\ntextLine4\ntextLine5\ntextLine6';
        expect(parser.replaceBlockElementWithNewLine(input)).toBe(expected);
    });
});