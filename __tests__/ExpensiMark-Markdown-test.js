/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

test('Test bold HTML replacement', () => {
    const boldTestStartString = 'This is a <strong>sentence,</strong> and it has some <strong>punctuation, words, and spaces</strong>. '
    + '<strong>test</strong> * testing* test*test*test. * testing * *testing * '
    + 'This is a <b>sentence,</b> and it has some <b>punctuation, words, and spaces</b>. '
    + '<b>test</b> * testing* test*test*test. * testing * *testing *';
    const boldTestReplacedString = 'This is a *sentence,* and it has some *punctuation, words, and spaces*. '
        + '*test* * testing* test*test*test. * testing * *testing * '
        + 'This is a *sentence,* and it has some *punctuation, words, and spaces*. '
        + '*test* * testing* test*test*test. * testing * *testing *';

    expect(parser.htmlToMarkdown(boldTestStartString)).toBe(boldTestReplacedString);
});

test('Test italic HTML replacement', () => {
    const italicTestStartString = 'This is a <em>sentence,</em> and it has some <em>punctuation, words, and spaces</em>. <em>test</em> _ testing_ test_test_test. _ test _ _test _ '
    + 'This is a <i>sentence,</i> and it has some <i>punctuation, words, and spaces</i>. <i>test</i> _ testing_ test_test_test. _ test _ _test _';
    const italicTestReplacedString = 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. _test_ _ testing_ test_test_test. _ test _ _test _ '
    + 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. _test_ _ testing_ test_test_test. _ test _ _test _';
    expect(parser.htmlToMarkdown(italicTestStartString)).toBe(italicTestReplacedString);
});

// Words wrapped in ~ successfully replaced with <del></del>
test('Test strikethrough HTML replacement', () => {
    const strikethroughTestStartString = 'This is a <del>sentence,</del> and it has some <del>punctuation, words, and spaces</del>. <del>test</del> ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    const strikethroughTestReplacedString = 'This is a ~sentence,~ and it has some ~punctuation, words, and spaces~. ~test~ ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    expect(parser.htmlToMarkdown(strikethroughTestStartString)).toBe(strikethroughTestReplacedString);
});

test('Test Mixed HTML strings', () => {
    const rawHTMLTestStartString = '<em>This is</em> a <strong>test</strong>. None of <h1>these strings</h1> should display <del>as</del> <div>HTML</div>.';
    const rawHTMLTestReplacedString = '_This is_ a *test*. None of these strings should display ~as~ HTML.';
    expect(parser.htmlToMarkdown(rawHTMLTestStartString)).toBe(rawHTMLTestReplacedString);
});

test('Test HTML string with <br/> tags to markdown ', () => {
    const testString = 'Hello<br/>World,<br/>Welcome<br/>To<br/>Expensify';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with inconsistent <br/> closing tags to markdown ', () => {
    const testString = 'Hello<br>World,<br/>Welcome<br>To<br/>Expensify';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with seperate closing tags (<br><br/>) to markdown ', () => {
    const testString = 'Hello<br>World,<br><br/>Welcome<br/>To<br/>Expensify';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});
