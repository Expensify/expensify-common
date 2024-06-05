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

test('Test multi-line bold HTML replacement', () => {
    const testString = '<strong>Here is a multi-line<br />comment that should<br />be bold</strong>';
    const replacedString = '*Here is a multi-line\ncomment that should\nbe bold*';

    expect(parser.htmlToMarkdown(testString)).toBe(replacedString);
});

test('Test italic HTML replacement', () => {
    const italicTestStartString = 'This is a <em>sentence,</em> and it has some <em>punctuation, words, and spaces</em>. <em>test</em> _ testing_ test_test_test. _ test _ _test _ '
        + 'This is a <i>sentence,</i> and it has some <i>punctuation, words, and spaces</i>. <i>test</i> _ testing_ test_test_test. _ test _ _test _';
    const italicTestReplacedString = 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. _test_ _ testing_ test_test_test. _ test _ _test _ '
        + 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. _test_ _ testing_ test_test_test. _ test _ _test _';
    expect(parser.htmlToMarkdown(italicTestStartString)).toBe(italicTestReplacedString);
});

test('Test multi-line italic HTML replacement', () => {
    const testString = '<em>Here is a multi-line<br />comment that should<br />be italic</em>';
    const replacedString = '_Here is a multi-line\ncomment that should\nbe italic_';

    expect(parser.htmlToMarkdown(testString)).toBe(replacedString);
});

// Words wrapped in <del></del> or <s></s> successfully replaced with ~
test('Test strikethrough HTML replacement', () => {
    const strikethroughTestStartString = 'This is a <del>sentence,</del> and it has some <del>punctuation, words, and spaces</del>. <s>test</s> ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    const strikethroughTestReplacedString = 'This is a ~sentence,~ and it has some ~punctuation, words, and spaces~. ~test~ ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    expect(parser.htmlToMarkdown(strikethroughTestStartString)).toBe(strikethroughTestReplacedString);
});

test('Test multi-line strikethrough HTML replacement', () => {
    const testString = '<del>Here is a multi-line<br />comment that should<br />have strikethrough applied</del>';
    const replacedString = '~Here is a multi-line\ncomment that should\nhave strikethrough applied~';

    expect(parser.htmlToMarkdown(testString)).toBe(replacedString);
});

test('Test Mixed HTML strings', () => {
    const rawHTMLTestStartString = '<em>This is</em> a <strong>test</strong>. None of <h2>these strings</h2> should display <del>as</del> <div>HTML</div>.';
    const rawHTMLTestReplacedString = '_This is_ a *test*. None of \nthese strings\n should display ~as~ \nHTML\n.';
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

test('Test HTML string with blockquote', () => {
    const testString = '<blockquote><p>This GH seems to assume that there will be something in the paste\nbuffer when you copy block-quoted text out of slack. But when I dump\nsome <em>lorem ipsum</em> into a blockquote in Slack, copy it to the\nbuffer, then dump it into terminal, there\'s nothing. And if I dump it </blockquote>'
        + '<blockquote>line1\nline2\n\nsome <em>lorem ipsum</em> into a blockquote in Slack, copy it to the\n\n\nbuffer </blockquote>'
        + '<blockquote style="color:red;" data-label="note">line1 <em>lorem ipsum</em></blockquote>';

    const resultString = '> This GH seems to assume that there will be something in the paste\n> buffer when you copy block-quoted text out of slack. But when I dump\n> some _lorem ipsum_ into a blockquote in Slack, copy it to the\n> buffer, then dump it into terminal, there\'s nothing. And if I dump it\n'
        + '> line1\n> line2\n> \n> some _lorem ipsum_ into a blockquote in Slack, copy it to the\n> \n> \n> buffer\n'
        + '> line1 _lorem ipsum_';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test HTML string with InlineCodeBlock', () => {
    const testString = 'This is a <code>InlineCodeBlock</code> text';

    const resultString = 'This is a `InlineCodeBlock` text';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test wrapped anchor tags', () => {
    const wrappedUrlTestStartString = '<del><a href="https://www.example.com" target="_blank">https://www.example.com</a></del> <em><a href="http://www.test.com" target="_blank">http://www.test.com</a></em>'
        + ' <strong><a href="http://www.asdf.com/_test" target="_blank">http://www.asdf.com/_test</a></strong>';
    const wrappedUrlTestReplacedString = '~[https://www.example.com](https://www.example.com)~ _[http://www.test.com](http://www.test.com)_ *[http://www.asdf.com/_test](http://www.asdf.com/_test)*';
    expect(parser.htmlToMarkdown(wrappedUrlTestStartString)).toBe(wrappedUrlTestReplacedString);
});

test('Test acnchor tags convesion to markdown style link with various styles', () => {
    const testString = 'Go to <del><a href="https://www.expensify.com" target="_blank">Expensify</a></del> '
        + '<em><a href="https://www.expensify.com" target="_blank">Expensify</a></em> '
        + '<strong><a href="https://www.expensify.com" target="_blank">Expensify</a></strong> '
        + '<a href="https://www.expensify.com" target="_blank">Expensify!</a> '
        + '<a href="https://www.expensify.com" target="_blank">Expensify?</a> '
        + '<a href="https://www.expensify-test.com" target="_blank">Expensify</a> '
        + '<a href="https://www.expensify-test.com" target="_blank"><strong>Expensify</strong></a> '
        + '<a href="https://www.expensify-test.com" target="_blank">test.com</a> '
        + '<a href="https://www.expensify-test.com" target="_blank"><em>italic</em> <del>strikethrough</del> test.com</a> '
        + '<a href="https://www.text.com/_root_folder/1" target="_blank">https://www.text.com/_root_folder/1</a> '
        + '<a href="https://www.expensify.com/settings?param={%22section%22:%22account%22}" target="_blank">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param=(%22section%22+%22account%22)" target="_blank">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param=[%22section%22:%22account%22]" target="_blank">Expensify</a>';

    const resultString = 'Go to ~[Expensify](https://www.expensify.com)~ '
        + '_[Expensify](https://www.expensify.com)_ '
        + '*[Expensify](https://www.expensify.com)* '
        + '[Expensify!](https://www.expensify.com) '
        + '[Expensify?](https://www.expensify.com) '
        + '[Expensify](https://www.expensify-test.com) '
        + '[*Expensify*](https://www.expensify-test.com) '
        + '[test.com](https://www.expensify-test.com) '
        + '[_italic_ ~strikethrough~ test.com](https://www.expensify-test.com) '
        + '[https://www.text.com/_root_folder/1](https://www.text.com/_root_folder/1) '
        + '[Expensify](https://www.expensify.com/settings?param={%22section%22:%22account%22}) '
        + '[Expensify](https://www.expensify.com/settings?param=(%22section%22+%22account%22)) '
        + '[Expensify](https://www.expensify.com/settings?param=[%22section%22:%22account%22])';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links end in a comma', () => {
    const testString = '<a href="https://github.com/Expensify/Expensify/issues/143231" target="_blank">https://github.com/Expensify/Expensify/issues/143231</a>,';
    const resultString = '[https://github.com/Expensify/Expensify/issues/143231](https://github.com/Expensify/Expensify/issues/143231),';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links have a period at the end', () => {
    const testString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank">https://github.com/Expensify/ReactNativeChat/pull/645</a>.';
    const resultString = '[https://github.com/Expensify/ReactNativeChat/pull/645](https://github.com/Expensify/ReactNativeChat/pull/645).';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links ending with a question mark', () => {
    const testString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank">https://github.com/Expensify/ReactNativeChat/pull/645</a>?';
    const resultString = '[https://github.com/Expensify/ReactNativeChat/pull/645](https://github.com/Expensify/ReactNativeChat/pull/645)?';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links ending with a closing parentheses', () => {
    const testString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank">https://github.com/Expensify/ReactNativeChat/pull/645</a>)';
    const resultString = '[https://github.com/Expensify/ReactNativeChat/pull/645](https://github.com/Expensify/ReactNativeChat/pull/645))';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links are markdown style email link with various styles', () => {
    const testString = 'Go to <del><a href="mailto:concierge@expensify.com">Expensify</a></del> '
        + '<em><a href="mailto:concierge@expensify.com">Expensify</a></em> '
        + '<strong><a href="mailto:concierge@expensify.com">Expensify</a></strong> '
        + '<a href="mailto:no-concierge1@expensify.com">Expensify!</a> '
        + '<a href="mailto:concierge?@expensify.com">Expensify?</a> '
        + '<a href="mailto:applausetester+qaabecciv@applause.expensifail.com">Applause</a> '
        + '<a href="mailto:concierge@expensify.com"></a>'
        + '<a href="mailto:concierge@expensify.com">   </a>'
        + '<a href="mailto:concierge@expensify.com"> Expensify </a>'
        + '<a href="mailto:concierge@expensify.com"> Expensify Email </a>'
        + '<a href="mailto:concierge@expensify.com">concierge@expensify.com</a>'
        + '<a href="mailto:concierge@expensify.com">concierge-other@expensify.com</a>'
        + '<a href="mailto:concierge@expensify.com">(Expensify)</a>'
        + '[Expensify <a href="mailto:test@expensify.com">Test</a> Test](<a href="mailto:concierge@expensify.com">concierge@expensify.com</a>)'
        + '[Expensify <a href="mailto:concierge@expensify.com">Test</a>'
        + '[Expensify ]Test](<a href="mailto:concierge@expensify.com">concierge@expensify.com</a>)';

    const resultString = 'Go to ~[Expensify](concierge@expensify.com)~ '
        + '_[Expensify](concierge@expensify.com)_ '
        + '*[Expensify](concierge@expensify.com)* '
        + '[Expensify!](no-concierge1@expensify.com) '
        + '[Expensify?](concierge?@expensify.com) '
        + '[Applause](applausetester+qaabecciv@applause.expensifail.com) '
        + '[](concierge@expensify.com)'
        + '[   ](concierge@expensify.com)'
        + '[ Expensify ](concierge@expensify.com)'
        + '[ Expensify Email ](concierge@expensify.com)'
        + 'concierge@expensify.com'
        + '[concierge-other@expensify.com](concierge@expensify.com)'
        + '[(Expensify)](concierge@expensify.com)'
        + '[Expensify [Test](test@expensify.com) Test](concierge@expensify.com)'
        + '[Expensify [Test](concierge@expensify.com)'
        + '[Expensify ]Test](concierge@expensify.com)';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags with general email link', () => {
    const testString = 'Go to <a href="mailto:concierge@expensify.com">concierge@expensify.com</a> '
        + '<a href="mailto:no-concierge@expensify.com">no-concierge@expensify.com</a> '
        + '<a href="mailto:concierge!@expensify.com">concierge!@expensify.com</a> '
        + '<a href="mailto:concierge1?@expensify.com">concierge1?@expensify.com</a> '
        + '<a href="mailto:applausetester+qaabecciv@applause.expensifail.com">applausetester+qaabecciv@applause.expensifail.com</a> ';
    const resultString = 'Go to concierge@expensify.com '
        + 'no-concierge@expensify.com '
        + 'concierge!@expensify.com '
        + 'concierge1?@expensify.com '
        + 'applausetester+qaabecciv@applause.expensifail.com ';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags where links have inconsistent starting and closing parens', () => {
    const testString = '<a href="http://google.com/(something)?after=parens" target="_blank">google</a> '
        + '(<a href="http://google.com/(something)?after=parens" target="_blank">google</a>) '
        + '(<a href="https://google.com/" target="_blank">google</a>) '
        + '(<a href="http://google.com/(something)?after=parens" target="_blank">google</a>))) '
        + '(((<a href="http://google.com/(something)?after=parens" target="_blank">google</a> '
        + '(<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a>) '
        + '(((<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a> '
        + '(((<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a>))) '
        + '<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a>))) '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank">Yo (click here to see a cool cat)</a> '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank">Yo click here to see a cool cat)</a> '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank">Yo (click here to see a cool cat</a> '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank">Yo click * $ &amp; here to see a cool cat</a> ';

    const resultString = '[google](http://google.com/(something)?after=parens) '
        + '([google](http://google.com/(something)?after=parens)) '
        + '([google](https://google.com/)) '
        + '([google](http://google.com/(something)?after=parens)))) '
        + '((([google](http://google.com/(something)?after=parens) '
        + '([http://foo.com/(something)?after=parens](http://foo.com/(something)?after=parens)) '
        + '((([http://foo.com/(something)?after=parens](http://foo.com/(something)?after=parens) '
        + '((([http://foo.com/(something)?after=parens](http://foo.com/(something)?after=parens)))) '
        + '[http://foo.com/(something)?after=parens](http://foo.com/(something)?after=parens)))) '
        + '[Yo (click here to see a cool cat)](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Yo click here to see a cool cat)](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Yo (click here to see a cool cat](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Yo click * $ & here to see a cool cat](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) ';

    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test anchor tags replacements', () => {
    const urlTestStartString = 'Testing '
        + '<a href="http://foo.com" target="_blank">foo.com</a> \n'
        + '<a href="http://www.foo.com" target="_blank">www.foo.com</a> \n'
        + '<a href="http://www.foo.com" target="_blank">http://www.foo.com</a> \n'
        + '<a href="http://foo.com/blah_blah" target="_blank">http://foo.com/blah_blah</a> \n'
        + '<a href="http://foo.com/blah_blah/" target="_blank">http://foo.com/blah_blah/</a> \n'
        + '<a href="http://foo.com/blah_blah_(wikipedia)" target="_blank">http://foo.com/blah_blah_(wikipedia)</a> \n'
        + '<a href="http://www.example.com/wpstyle/?p=364" target="_blank">http://www.example.com/wpstyle/?p=364</a> \n'
        + '<a href="https://www.example.com/foo/?bar=baz&amp;inga=42&amp;quux" target="_blank">https://www.example.com/foo/?bar=baz&amp;inga=42&amp;quux</a> \n'
        + '<a href="http://foo.com/(something)?after=parens" target="_blank">http://foo.com/(something)?after=parens</a> \n'
        + '<a href="http://code.google.com/events/#&amp;product=browser" target="_blank">http://code.google.com/events/#&amp;product=browser</a> \n'
        + '<a href="http://foo.bar/?q=Test%20URL-encoded%20stuff" target="_blank">http://foo.bar/?q=Test%20URL-encoded%20stuff</a> \n'
        + '<a href="http://www.test.com/path?param=123#123" target="_blank">http://www.test.com/path?param=123#123</a> \n'
        + '<a href="http://1337.net" target="_blank">http://1337.net</a> \n'
        + '<a href="http://a.b-c.de/" target="_blank">http://a.b-c.de/</a> \n'
        + '<a href="https://sd1.sd2.docs.google.com/" target="_blank">https://sd1.sd2.docs.google.com/</a> \n'
        + '<a href="https://expensify.cash/#/r/1234" target="_blank">https://expensify.cash/#/r/1234</a> \n'
        + '<a href="https://github.com/Expensify/ReactNativeChat/pull/6.45" target="_blank">https://github.com/Expensify/ReactNativeChat/pull/6.45</a> \n'
        + '<a href="https://github.com/Expensify/Expensify/issues/143,231" target="_blank">https://github.com/Expensify/Expensify/issues/143,231</a> \n'
        + '<a href="http://testRareTLDs.beer" target="_blank">testRareTLDs.beer</a> \n'
        + '<a href="mailto:test@expensify.com">test@expensify.com</a> \n'
        + 'test.completelyFakeTLD \n'
        + '<a href="https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank">https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878</a>) \n'
        + '<a href="http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank">http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled</a> \n'
        + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank">https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash</a> \n'
        + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank">https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash</a> \n'
        + 'mm..food \n'
        + '<a href="http://upwork.com/jobs/~016781e062ce860b84" target="_blank">upwork.com/jobs/~016781e062ce860b84</a> \n'
        + '<a href="https://bastion1.sjc/logs/app/kibana#/discover?_g=()&amp;_a=(columns:!(_source),index:&#x27;2125cbe0-28a9-11e9-a79c-3de0157ed580&#x27;,interval:auto,query:(language:lucene,query:&#x27;&#x27;),sort:!(timestamp,desc))" target="_blank">https://bastion1.sjc/logs/app/kibana#/discover?_g=()&amp;_a=(columns:!(_source),index:&#x27;2125cbe0-28a9-11e9-a79c-3de0157ed580&#x27;,interval:auto,query:(language:lucene,query:&#x27;&#x27;),sort:!(timestamp,desc))</a> \n'
        + '<a href="http://google.com/maps/place/The+Flying&#x27;+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121" target="_blank">google.com/maps/place/The+Flying&#x27;+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121</a> \n'
        + '<a href="http://google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843" target="_blank">google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843</a> \n'
        + '<a href="https://www.google.com/maps/place/Taj+Mahal+@is~&quot;Awesome&quot;/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422" target="_blank">https://www.google.com/maps/place/Taj+Mahal+@is~&quot;Awesome&quot;/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422</a> \n'
        + '<a href="Https://www.regex101.com" target="_blank" rel="noreferrer noopener">Https://www.regex101.com</a> \n'
        + '<a href="https://www.facebook.com/hashtag/__main/?__eep__=6" target="_blank" rel="noreferrer noopener">https://www.facebook.com/hashtag/__main/?__eep__=6</a> \n'
        + '<a href="https://example.com/~username/foo~bar.txt" target="_blank" rel="noreferrer noopener">https://example.com/~username/foo~bar.txt</a> \n'
        + '<a href="http://example.com/foo/*/bar/*/test.txt" target="_blank" rel="noreferrer noopener">http://example.com/foo/*/bar/*/test.txt</a>';

    const urlTestReplacedString = 'Testing '
        + '[foo.com](http://foo.com) \n'
        + '[www.foo.com](http://www.foo.com) \n'
        + '[http://www.foo.com](http://www.foo.com) \n'
        + '[http://foo.com/blah_blah](http://foo.com/blah_blah) \n'
        + '[http://foo.com/blah_blah/](http://foo.com/blah_blah/) \n'
        + '[http://foo.com/blah_blah_(wikipedia)](http://foo.com/blah_blah_(wikipedia)) \n'
        + '[http://www.example.com/wpstyle/?p=364](http://www.example.com/wpstyle/?p=364) \n'
        + '[https://www.example.com/foo/?bar=baz&inga=42&quux](https://www.example.com/foo/?bar=baz&inga=42&quux) \n'
        + '[http://foo.com/(something)?after=parens](http://foo.com/(something)?after=parens) \n'
        + '[http://code.google.com/events/#&product=browser](http://code.google.com/events/#&product=browser) \n'
        + '[http://foo.bar/?q=Test%20URL-encoded%20stuff](http://foo.bar/?q=Test%20URL-encoded%20stuff) \n'
        + '[http://www.test.com/path?param=123#123](http://www.test.com/path?param=123#123) \n'
        + '[http://1337.net](http://1337.net) \n'
        + '[http://a.b-c.de/](http://a.b-c.de/) \n'
        + '[https://sd1.sd2.docs.google.com/](https://sd1.sd2.docs.google.com/) \n'
        + '[https://expensify.cash/#/r/1234](https://expensify.cash/#/r/1234) \n'
        + '[https://github.com/Expensify/ReactNativeChat/pull/6.45](https://github.com/Expensify/ReactNativeChat/pull/6.45) \n'
        + '[https://github.com/Expensify/Expensify/issues/143,231](https://github.com/Expensify/Expensify/issues/143,231) \n'
        + '[testRareTLDs.beer](http://testRareTLDs.beer) \n'
        + 'test@expensify.com \n'
        + 'test.completelyFakeTLD \n'
        + '[https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&index=logs_expensify-008878](https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&index=logs_expensify-008878)) \n'
        + '[http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled](http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled) \n'
        + '[https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash](https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash) \n'
        + '[https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash](https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash) \n'
        + 'mm..food \n'
        + '[upwork.com/jobs/~016781e062ce860b84](http://upwork.com/jobs/~016781e062ce860b84) \n'
        + '[https://bastion1.sjc/logs/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:\'2125cbe0-28a9-11e9-a79c-3de0157ed580\',interval:auto,query:(language:lucene,query:\'\'),sort:!(timestamp,desc))](https://bastion1.sjc/logs/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:\'2125cbe0-28a9-11e9-a79c-3de0157ed580\',interval:auto,query:(language:lucene,query:\'\'),sort:!(timestamp,desc))) \n'

        + '[google.com/maps/place/The+Flying\'+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121](http://google.com/maps/place/The+Flying\'+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121) \n'

        + '[google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843](http://google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843) \n'
        + '[https://www.google.com/maps/place/Taj+Mahal+@is~"Awesome"/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422](https://www.google.com/maps/place/Taj+Mahal+@is~"Awesome"/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422) \n'
        + '[Https://www.regex101.com](Https://www.regex101.com) \n'
        + '[https://www.facebook.com/hashtag/__main/?__eep__=6](https://www.facebook.com/hashtag/__main/?__eep__=6) \n'
        + '[https://example.com/~username/foo~bar.txt](https://example.com/~username/foo~bar.txt) \n'
        + '[http://example.com/foo/*/bar/*/test.txt](http://example.com/foo/*/bar/*/test.txt)';

    expect(parser.htmlToMarkdown(urlTestStartString)).toBe(urlTestReplacedString);
});

test('Test link markdown with uppercase letter in https replacement', () => {
    const testString = '[Https://www.regex101.com](Https://www.regex101.com)';
    const resultString = '<a href="https://www.regex101.com" target="_blank" rel="noreferrer noopener">Https://www.regex101.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test autolink with uppercase letter in https replacement', () => {
    const testString = 'Https://www.regex101.com';
    const resultString = '<a href="https://www.regex101.com" target="_blank" rel="noreferrer noopener">Https://www.regex101.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test HTML string with code fence', () => {
    const testString = '<pre id="code1">class Expensify extends PureComponent {\n    constructor(props) {\n        super(props);\n    }\n}</pre>';
    const resultString = '```\nclass Expensify extends PureComponent {\n    constructor(props) {\n        super(props);\n    }\n}\n```';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);

    const testStringWithBrTag = '<pre id="code1">class Expensify extends PureComponent {<br />    constructor(props) {<br />        super(props);<br />    }<br />}</pre>';
    const resultStringForBrTag = '```\nclass Expensify extends PureComponent {\n    constructor(props) {\n        super(props);\n    }\n}\n```';
    expect(parser.htmlToMarkdown(testStringWithBrTag)).toBe(resultStringForBrTag);

    const testStringWithNewLinesFromSlack = '<pre class="c-mrkdwn__pre" data-stringify-type="pre" >line1'
    + '<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;">'
    + '</span>line3<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;"></span>'
    + '<span class="c-mrkdwn__br" data-stringify-type="paragraph-break" style="box-sizing: inherit; display: block; height: unset;"></span>line6</pre>';
    const resultStringWithNewLinesFromSlack = '```\nline1\n\nline3\n\n\nline6\n```';
    expect(parser.htmlToMarkdown(testStringWithNewLinesFromSlack)).toBe(resultStringWithNewLinesFromSlack);
});

test('Test code fence and extra backticks', () => {
    let nestedBackticks = '<pre>&#x60;test&#x60;</pre>';
    expect(parser.htmlToMarkdown(nestedBackticks)).toBe('```\n`test`\n```');

    nestedBackticks = '<pre>&#x60;<br />test<br />&#x60;</pre>';
    expect(parser.htmlToMarkdown(nestedBackticks)).toBe('```\n`\ntest\n`\n```');

    nestedBackticks = '<pre>&#x60;&#x60;</pre>';
    expect(parser.htmlToMarkdown(nestedBackticks)).toBe('```\n``\n```');

    nestedBackticks = '<pre>&#x60;<br />&#x60;</pre>';
    expect(parser.htmlToMarkdown(nestedBackticks)).toBe('```\n`\n`\n```');

    nestedBackticks = '<pre>&#x60;&#x60;&#x60;&#x60;&#x60;</pre>';
    expect(parser.htmlToMarkdown(nestedBackticks)).toBe('```\n`````\n```');

    nestedBackticks = '<pre>&#x60;This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)&#x60;</pre>';
    expect(parser.htmlToMarkdown(nestedBackticks)).toBe('```\n`This is how you can write ~strikethrough~, *bold*, _italics_, and [links](https://www.expensify.com)`\n```');
});

test('HTML Entities', () => {
    const testString = '&nbsp; &amp; &dollar; &colon; &gt; &quot;';
    const resultString = `${String.fromCharCode(160)} & $ : > "`;
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Map div to newline', () => {
    const testString = '<div>line 1 <div>line 2</div></div>';
    const resultString = 'line 1 \nline 2';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Map div to newline with empty div', () => {
    const testString = '<div>line 1 <div></div></div>';
    const resultString = 'line 1 ';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Map div to newline with empty div between string', () => {
    const testString = '<div>line 1 <div></div>line 2</div>';
    const resultString = 'line 1 \nline 2';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Map div to newline with empty div before string', () => {
    const testString = '<div><div></div>line 1</div>';
    const resultString = 'line 1';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Map div to newline with empty div before string', () => {
    const testString = '<div><div></div>line 1</div>';
    const resultString = 'line 1';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('map div with bold and italics', () => {
    const testString = '<div><strong>line 1</strong><div></div><em>line 2</em></div>';
    const resultString = '*line 1*\n_line 2_';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('map div with mixed html strings', () => {
    const testString = '<div><em>This is</em> a <strong>test</strong>. None of <h2>these strings</h2> should display <del>as</del><div>HTML</div><div></div><em>line 3</em></div>';
    const resultString = '_This is_ a *test*. None of \nthese strings\n should display ~as~\nHTML\n_line 3_';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('map div with br', () => {
    const testString = '<div>line 1<br/></div>line 2</div>';
    const resultString = 'line 1\nline 2';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('map div with encoded entities', () => {
    const testString = '<div>Text Entity &amp; &quot;</div>line 2</div>';
    const resultString = 'Text Entity & "\nline 2';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('map div with quotes', () => {
    const testString = '<div><blockquote>line 1</blockquote></div>line 2</div>';
    const resultString = '> line 1\nline 2';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('double quotes in same line', () => {
    const testString = '<blockquote><blockquote>line 1</blockquote></blockquote>';
    const resultString = '>> line 1';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('triple quotes in same line', () => {
    const testString = '<blockquote><blockquote><blockquote>line 1</blockquote></blockquote></blockquote>';
    const resultString = '>>> line 1';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('map table to newline', () => {
    const testString = '<tbody><tr>line 1</tr><tr>line 2</tr></tbody>';
    const resultString = 'line 1\nline 2';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('map real message from app', () => {
    const testString = '<div><div><div><div><div><div><div><div><div><div><div><div><comment><div><em>hhh</em><span> ddd</span></div><br></comment></div></div></div></div></div></div><div><div><div><div><div><svg><path/><path/></svg></div></div></div><div><div><div><svg><path/><path/></svg></div></div></div><div><div><div><svg><path/></svg></div></div></div><div><div><div><svg><path/></svg></div></div></div></div></div></div></div></div></div></div><div><div><div><div><div><div><div><div><div><div>ddd</div></div></div></div></div><div></div></div></div></div></div></div><div><div><div><div><div><div><div><div><div><div>dd</div></div></div></div></div></div></div></div></div></div></div>';
    const resultString = '_hhh_ ddd\nddd\ndd';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('map real message with quotes', () => {
    const testString = '<div><div><div><div><div><div><div><div><div><div><div><div><comment><blockquote><div>hi</div></blockquote><br></comment></div></div></div></div></div></div><div><div><div><div><div><svg><path/><path/></svg></div></div></div><div><div><div><svg><path/><path/></svg></div></div></div><div><div><div><svg><path/></svg></div></div></div><div><div><div><svg><path/></svg></div></div></div></div></div></div></div></div></div></div><div><div><div><div><div><div><div><div><div><div><div><comment><blockquote><div>hi</div></blockquote><br></comment></div></div></div></div></div></div></div></div></div></div></div></div>';
    const resultString = '> hi\n> hi';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test heading1 markdown replacement', () => {
    const testString = '# This is a heading1 because starts with # followed by a space\n';
    const resultString = '<h1>This is a heading1 because starts with # followed by a space</h1>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test heading1 markdown replacement when # is followed by multiple spaces', () => {
    const testString = '#    This is also a heading1 because starts with # followed by a space\n';
    const resultString = '<h1>This is also a heading1 because starts with # followed by a space</h1>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test heading1 markdown when # is not followed by a space', () => {
    const testString = '#This is not a heading1 because starts with a # but has no space after it\n';
    const resultString = '<mention-report>#This</mention-report> is not a heading1 because starts with a # but has no space after it<br />';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test heading1 markdown when # is in the middle of the line', () => {
    const testString = 'This is not # a heading1\n';
    const resultString = 'This is not # a heading1<br />';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test html string to heading1 markdown', () => {
    const testString = '<h1>This is a heading1</h1>';
    const resultString = '# This is a heading1';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test html to heading1 markdown when there are other tags inside h1 tag', () => {
    const testString = '<h1>This is a <strong>heading1</strong></h1>';
    const resultString = '# This is a *heading1*';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test html to heading1 markdown when h1 tag is in the beginning of the line', () => {
    const testString = '<h1>heading1</h1> in the beginning of the line';
    const resultString = '# heading1\n'
    + ' in the beginning of the line';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test html to heading1 markdown when h1 tags are in the middle of the line', () => {
    const testString = 'this line has a <h1>heading1</h1> in the middle of the line';
    const resultString = 'this line has a\n'
    + '# heading1\n'
    + ' in the middle of the line';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test html to heading1 markdown when h1 tag is in the end of the line', () => {
    const testString = 'this line has an h1 in the end of the line<h1>heading1</h1>';
    const resultString = 'this line has an h1 in the end of the line'
    + '\n# heading1';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test html to heading1 markdown when there are 2 h1 tags in the line', () => {
    const testString = 'this is the first heading1<h1>heading1</h1>this is the second heading1<h1>heading1</h1>';
    const resultString = 'this is the first heading1'
    + '\n# heading1'
    + '\nthis is the second heading1'
    + '\n# heading1';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test html to heading1 markdown when there are adjacent h1 tags in the line', () => {
    const testString = '<h1>heading1</h1><h1>heading2</h1>';
    const resultString = '# heading1'
    + '\n# heading2';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test link with multiline text do not loses markdown', () => {
    let testString = '<a href="https://google.com/">multiline\ntext</a>';
    let resultString = '[multiline\ntext](https://google.com/)';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
    testString = '<a href="http://localhost:3000/">multiline\ntext</a>';
    resultString = '[multiline\ntext](http://localhost:3000/)';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Map html paragraph to newline', () => {
    const testString = '<p>This is a HTML paragraph</p><p>This is an another HTML paragraph</p>';
    const resultString = 'This is a HTML paragraph\nThis is an another HTML paragraph';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Map html paragraph with <br/> to newline', () => {
    const testString = '<p>This is a HTML paragraph</p><br/><p>This is an another HTML paragraph</p>';
    const resultString = 'This is a HTML paragraph\n\nThis is an another HTML paragraph';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Map html list item to newline with two prefix spaces', () => {
    const testString = '<ul><li>This is a HTML list item</li><li>This is an another HTML list item</li></ul>';
    const resultString = '  This is a HTML list item\n  This is an another HTML list item';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test list item replacement when there is an anchor tag inside <li> tag', () => {
    let testString = '<ul><li><a href="https://example.com">Coffee</a> -- Coffee</li><li><a href="https://example.com">Tea</a> -- Tea</li><li><a href="https://example.com">Milk</a> -- Milk</li></ul>';
    let resultString = '  [Coffee](https://example.com) -- Coffee\n  [Tea](https://example.com) -- Tea\n  [Milk](https://example.com) -- Milk';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);

    testString = '<ul><li><a href="http://localhost">Coffee</a> -- Coffee</li><li><a href="http://localhost/">Tea</a> -- Tea</li><li><a href="http://localhost/">Milk</a> -- Milk</li></ul>';
    resultString = '  [Coffee](http://localhost) -- Coffee\n  [Tea](http://localhost/) -- Tea\n  [Milk](http://localhost/) -- Milk';
    expect(parser.htmlToMarkdown(testString)).toBe(resultString);
});

test('Test codeFence backticks occupying a separate line while not introducing redundant lines', () => {
    let testInput = '<pre>test</pre>';
    expect(parser.htmlToMarkdown(testInput)).toBe('```\ntest\n```');

    testInput = '<pre>test\n</pre>';
    expect(parser.htmlToMarkdown(testInput)).toBe('```\ntest\n```');

    testInput = '<pre>\ntest</pre>';
    expect(parser.htmlToMarkdown(testInput)).toBe('```\n\ntest\n```');

    testInput = '<pre>\ntest\n</pre>';
    expect(parser.htmlToMarkdown(testInput)).toBe('```\n\ntest\n```');

    testInput = '<pre>test\n\n</pre>';
    expect(parser.htmlToMarkdown(testInput)).toBe('```\ntest\n\n```');

    testInput = '<pre><br />#&#32;test<br /><br /></pre>';
    expect(parser.htmlToMarkdown(testInput)).toBe('```\n\n# test\n\n```');

    testInput = '<pre><br /><br />#&#32;test<br /><br /></pre>';
    expect(parser.htmlToMarkdown(testInput)).toBe('```\n\n\n# test\n\n```');
});

test('Test blockquote with h1 inside', () => {
    let testString = '<blockquote><h1>heading</h1></blockquote>';
    expect(parser.htmlToMarkdown(testString)).toBe('> # heading');

    testString = '<blockquote><h1>heading</h1>test</blockquote>';
    expect(parser.htmlToMarkdown(testString)).toBe('> # heading\n> test');

    testString = '<blockquote>test<h1>heading</h1>test</blockquote>';
    expect(parser.htmlToMarkdown(testString)).toBe('> test\n> # heading\n> test');

    testString = '<blockquote><h1>heading A</h1><h1>heading B</h1></blockquote>';
    expect(parser.htmlToMarkdown(testString)).toBe('> # heading A\n> # heading B');
});

test('Test blockquote linebreak handling with text, block and inline elements', () => {
    const testStringQuotes = '<blockquote>one line quote a</blockquote><br /><blockquote>two line quote b<br />two line quote b</blockquote><br /><blockquote>quote c with internal line break<br /><br />quote c with internal line break</blockquote>';
    expect(parser.htmlToMarkdown(testStringQuotes)).toBe('> one line quote a\n\n> two line quote b\n> two line quote b\n\n> quote c with internal line break\n> \n> quote c with internal line break');

    const testStringSurroundedByText = 'text a<br /><blockquote>quote a</blockquote><br /><blockquote>quote b</blockquote>text b<br /><br />text c<br /><blockquote>quote c</blockquote>text c';
    expect(parser.htmlToMarkdown(testStringSurroundedByText)).toBe('text a\n> quote a\n\n> quote b\ntext b\n\ntext c\n> quote c\ntext c');

    const testStringSurroundedByInlineElement = '<em>italic a</em><br /><blockquote>quote a</blockquote><br /><blockquote>quote b</blockquote><strong>bold b</strong><br /><br /><em>italic c</em><br /><blockquote>quote c</blockquote><strong>bold c</strong>';
    expect(parser.htmlToMarkdown(testStringSurroundedByInlineElement)).toBe('_italic a_\n> quote a\n\n> quote b\n*bold b*\n\n_italic c_\n> quote c\n*bold c*');

    const testStringSurroundedByBlockElementCodeFence = '<pre>code fence a</pre><blockquote>quote a</blockquote><br /><blockquote>quote b</blockquote><pre>code fence b</pre><br /><pre>code fence c</pre><blockquote>quote c</blockquote><pre>code fence c</pre>';
    expect(parser.htmlToMarkdown(testStringSurroundedByBlockElementCodeFence)).toBe('```\ncode fence a\n```\n> quote a\n\n> quote b\n```\ncode fence b\n```\n\n```\ncode fence c\n```\n> quote c\n```\ncode fence c\n```');

    const testStringSurroundedByBlockElementHeading = '<h1>h1 a</h1><blockquote>quote a</blockquote><br /><blockquote>quote b</blockquote><h1>h1 b</h1><br /><h1>h1 c</h1><blockquote>quote c</blockquote><h1>h1 c</h1>';
    expect(parser.htmlToMarkdown(testStringSurroundedByBlockElementHeading)).toBe('# h1 a\n> quote a\n\n> quote b\n# h1 b\n\n# h1 c\n> quote c\n# h1 c');
});

test('Test codeFence copy from selection does not add extra new line', () => {
    let testString = '<div><div><comment><pre><div><span>code</span><br></div></pre>text</comment></div></div>';
    expect(parser.htmlToMarkdown(testString)).toBe('```\ncode\n```\ntext');

    testString = '<pre>code<br></pre>text';
    expect(parser.htmlToMarkdown(testString)).toBe('```\ncode\n```\ntext');

    testString = '<h3>test heading</h3><div><pre class=\"notranslate\"><code class=\"notranslate\">Code snippet\n</code></pre></div><blockquote><p><a href=\"https://www.example.com\">link</a></p></blockquote>';
    expect(parser.htmlToMarkdown(testString)).toBe('test heading\n```\nCode snippet\n```\n> [link](https://www.example.com)');
});

test('Linebreak should be remained for text between code block', () => {
    const testCases = [
        {
            testString: '<pre>code1<br></pre>text<br><pre>code2<br></pre>',
            resultString: '```\ncode1\n```\ntext\n```\ncode2\n```',
        },
        {
            testString: 'text<br><pre>code<br></pre>',
            resultString: 'text\n```\ncode\n```',
        },
        {
            testString: '|<br><pre>code<br></pre>',
            resultString: '|\n```\ncode\n```',
        },
        {
            testString: 'text1<pre>code</pre>text2',
            resultString: 'text1```\ncode\n```\ntext2',
        },
        {
            testString: 'text1 <pre>&#32;code&#32;</pre> text2',
            resultString: 'text1 ```\n code \n```\n text2',
        },
        {
            testString: 'text1<br><pre>code</pre>text2',
            resultString: 'text1\n```\ncode\n```\ntext2',
        },
        {
            testString: 'text1<br><pre>&#32;code&#32;</pre>text2',
            resultString: 'text1\n```\n code \n```\ntext2',
        },
        {
            testString: 'text1<br><pre><br>code<br></pre>text2',
            resultString: 'text1\n```\n\ncode\n```\ntext2',
        },
        {
            testString: 'text1<br><pre><br>code<br><br></pre>text2',
            resultString: 'text1\n```\n\ncode\n\n```\ntext2',
        },
        {
            testString: 'text1<br><pre><br><br>code<br><br></pre>text2',
            resultString: 'text1\n```\n\n\ncode\n\n```\ntext2',
        },
        {
            testString: 'text1<br><pre><br>code<br><br><br></pre>text2',
            resultString: 'text1\n```\n\ncode\n\n\n```\ntext2',
        },
    ];
    testCases.forEach(({testString, resultString}) => {
        expect(parser.htmlToMarkdown(testString)).toBe(resultString);
    });
});

test('Mention user html to markdown', () => {
    let testString = '<mention-user>@user@domain.com</mention-user>';
    expect(parser.htmlToMarkdown(testString)).toBe('@user@domain.com');

    testString = '<mention-user>@USER@DOMAIN.COM</mention-user>';
    expect(parser.htmlToMarkdown(testString)).toBe('@USER@DOMAIN.COM');

    testString = '<mention-user>@USER@domain.com</mention-user>';
    expect(parser.htmlToMarkdown(testString)).toBe('@USER@domain.com');

    testString = '<mention-user>@user@DOMAIN.com</mention-user>';
    expect(parser.htmlToMarkdown(testString)).toBe('@user@DOMAIN.com');

    // When there is a phone number mention the sms domain `@expensify.sms`should be removed from returned string
    testString = '<mention-user>@+311231231@expensify.sms</mention-user>';
    expect(parser.htmlToMarkdown(testString)).toBe('@+311231231');

    // When there is `accountID` and no `extras`, `@Hidden` should be returned
    testString = '<mention-user accountID="1234"/>';
    expect(parser.htmlToMarkdown(testString)).toBe('@Hidden');

    const extras = {
        accountIDToName: {
            '1234': 'user@domain.com',
        },
    };
    testString = '<mention-user accountID="1234"/>';
    expect(parser.htmlToMarkdown(testString, extras)).toBe('@user@domain.com');

    testString = '<mention-user accountID="1234" />';
    expect(parser.htmlToMarkdown(testString, extras)).toBe('@user@domain.com');
});

test('Mention report html to markdown', () => {
    let testString = '<mention-report>#room-name</mention-report>';
    expect(parser.htmlToMarkdown(testString)).toBe('#room-name');

    testString = '<mention-report>#ROOM-NAME</mention-report>';
    expect(parser.htmlToMarkdown(testString)).toBe('#ROOM-NAME');

    testString = '<mention-report>#ROOM-name</mention-report>';
    expect(parser.htmlToMarkdown(testString)).toBe('#ROOM-name');

    testString = '<mention-report>#room-NAME</mention-report>';
    expect(parser.htmlToMarkdown(testString)).toBe('#room-NAME');

    // When there is `reportID` and no `extras`, `#Hidden` should be returned
    testString = '<mention-report reportID="1234"/>';
    expect(parser.htmlToText(testString)).toBe('#Hidden');

    const extras = {
        reportIDToName: {
            '1234': '#room-name',
        },
    };
    testString = '<mention-report reportID="1234"/>';
    expect(parser.htmlToMarkdown(testString, extras)).toBe('#room-name');

    testString = '<mention-report reportID="1234" />';
    expect(parser.htmlToMarkdown(testString, extras)).toBe('#room-name');
});

describe('Image tag conversion to markdown', () => {
    test('Image with alt attribute', () => {
        const testString = '<img src="https://example.com/image.png" alt="image" />';
        const resultString = '![image](https://example.com/image.png)';
        expect(parser.htmlToMarkdown(testString)).toBe(resultString);
    });

    test('Image without alt attribute', () => {
        const testString = '<img src="https://example.com/image.png" />';
        const resultString = '!(https://example.com/image.png)';
        expect(parser.htmlToMarkdown(testString)).toBe(resultString);
    });

    test('Image with alt text containing escaped markdown', () => {
        const testString = '<img src="https://example.com/image.png" alt="&ast;bold&ast; &lowbar;italic&lowbar; &#126;strike&#126;" />';
        const resultString = '![*bold* _italic_ ~strike~](https://example.com/image.png)';
        expect(parser.htmlToMarkdown(testString)).toBe(resultString);
    });

    test('Image with alt text containing unescaped markdown', () => {
        const testString = '<img src="https://example.com/image.png" alt="*bold* _italic_ ~strike~" />';
        const resultString = '![*bold* _italic_ ~strike~](https://example.com/image.png)';
        expect(parser.htmlToMarkdown(testString)).toBe(resultString);
    });

    test('Alt attribute with complex/escaped content', () => {
        const testString = '<img src="https://example.com/image.png" alt="&#x60;&#x60;&#x60;code&#x60;&#x60;&#x60;" data-raw-href="https://example.com/image.png" data-link-variant="labeled" />';
        const resultString = '![```code```](https://example.com/image.png)';
        expect(parser.htmlToMarkdown(testString)).toBe(resultString);
    });
});
