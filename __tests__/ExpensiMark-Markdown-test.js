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
    const testString = 'Hello<br/>World,<br/>Welcome<br/>To<br/>\nExpensify<br/>\n\nTwo new lines preceded by br';
    const resultString = 'Hello\nWorld,\nWelcome\nTo\nExpensify\n\nTwo new lines preceded by br';

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

test('Test HTML string with attributes', () => {
    const testString = '<em style="color:red;">This is</em><br style="border-color:red;"> a <button disabled>test</button>. None of <strong data-link=\'bad\'>these strings</strong>.';
    const resultString = '_This is_\n a test. None of *these strings*.';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with spcial Tags', () => {
    const testString = '<html>\n<body>\n<!--StartFragment--><span style="color: rgb(0, 0, 0); font-family: &quot;Times New Roman&quot;; font-size: medium; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: normal; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; white-space: pre-wrap; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; display: inline !important; float: none;">test message</span><!--EndFragment-->\n</body>\n</html>\n';
    const resultString = 'test message';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});


test('Test HTML string with Internal Tags', () => {
    const testString = `<style>
    span {
        color: rgb(0, 0, 0);
        font-family: "Times New Roman";
        font-size: medium;
        font-style: normal;
        font-variant-ligatures: normal;
        font-variant-caps: normal;
        font-weight: 400;
        letter-spacing: normal;
        orphans: 2;
        text-align: start;
        text-indent: 0px;
        text-transform: none;
        white-space: pre-wrap;
        widows: 2;
        word-spacing: 0px;
        -webkit-text-stroke-width: 0px;
        text-decoration-thickness: initial;
        text-decoration-style: initial;
        text-decoration-color: initial;
        display: inline !important;
        float: none;
    }
</style>
<script type="text/javascript">
    document.write('Hacked');
</script>
<p>test message</p>`;
    const resultString = 'test message';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with encoded entities', () => {
    const testString = 'Text Entity &amp; &quot;';
    const resultString = 'Text Entity & "';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with hyperlinks', () => {
    const testString = 'Test Hyperlinks '
        + '<a href="https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank">first</a> '
    + '<a href="www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank">first no https://</a> '
    + '<a href="http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank">second</a> '
    + '<a href="necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank">second no http://</a> '
    + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank">third</a> '
    + '<a href="github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank">third no https://</a> '
    + '<a href="https://google.com" target="_blank">link [inside another link](https://google.com)</a> '
    + '<a href="https://google.com" target="_blank">link with an @ in it</a> '
    + '<a href="https://google.com" target="_blank">link with [brackets] inside of it</a> '
    + '<a href="https://google.com" target="_blank">link with smart quotes ‘’“”</a> '
    + '<a href="https://google.com" target="_blank">link with someone@expensify.com email in it</a>'
    + '<a href="testemail@example.com">email example</a>'
    + '<a href="mailto:testemail@example.com">email example with mailto</a>'
    + '<a href="defaultemailonly@example.com">defaultemailonly@example.com</a>'
    + '<a href="https://google.com">https://google.com</a>';
    const resultString = 'Test Hyperlinks '
        + '[first](https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&index=logs_expensify-008878) '
    + '[first no https://](www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&index=logs_expensify-008878) '
    + '[second](http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled) '
    + '[second no http://](necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled) '
    + '[third](https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash) '
    + '[third no https://](github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash) '
    + '[link [inside another link](https://google.com)](https://google.com) '
    + '[link with an @ in it](https://google.com) '
    + '[link with [brackets] inside of it](https://google.com) '
    + '[link with smart quotes ‘’“”](https://google.com) '
    + '[link with someone@expensify.com email in it](https://google.com)'
    + '[email example](testemail@example.com)'
    + '[email example with mailto](mailto:testemail@example.com)'
    + 'defaultemailonly@example.com'
    + 'https://google.com';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});
