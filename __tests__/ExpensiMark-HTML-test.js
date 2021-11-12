/* eslint-disable max-len */
import ExpensiMark from '../lib/ExpensiMark';

const parser = new ExpensiMark();

// Words wrapped in * successfully replaced with <strong></strong>
test('Test bold markdown replacement', () => {
    const boldTestStartString = 'This is a *sentence,* and it has some *punctuation, words, and spaces*. '
        + '*test* * testing* test*test*test. * testing * *testing *';
    const boldTestReplacedString = 'This is a <strong>sentence,</strong> and it has some <strong>punctuation, words, and spaces</strong>. '
        + '<strong>test</strong> * testing* test*test*test. * testing * *testing *';

    expect(parser.replace(boldTestStartString)).toBe(boldTestReplacedString);
});

// Words wrapped in * successfully replaced with <strong></strong>
test('Test quote markdown replacement', () => {
    const quoteTestStartString = '&gt;This is a *quote* that started on a new line.\nHere is a &gt;quote that did not\n```\nhere is a codefenced quote\n>it should not be quoted\n```';
    const quoteTestReplacedString = '<blockquote>This is a <strong>quote</strong> that started on a new line.</blockquote>Here is a &gt;quote that did not<br><pre>here&#32;is&#32;a&#32;codefenced&#32;quote<br>&gt;it&#32;should&#32;not&#32;be&#32;quoted</pre>';

    expect(parser.replace(quoteTestStartString)).toBe(quoteTestReplacedString);
});

// Words wrapped in _ successfully replaced with <em></em>
test('Test italic markdown replacement', () => {
    const italicTestStartString = 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. _test_ _ testing_ test_test_test. _ test _ _test _';
    const italicTestReplacedString = 'This is a <em>sentence,</em> and it has some <em>punctuation, words, and spaces</em>. <em>test</em> _ testing_ test_test_test. _ test _ _test _';
    expect(parser.replace(italicTestStartString)).toBe(italicTestReplacedString);
});

// Words wrapped in ~ successfully replaced with <del></del>
test('Test strikethrough markdown replacement', () => {
    const strikethroughTestStartString = 'This is a ~sentence,~ and it has some ~punctuation, words, and spaces~. ~test~ ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    const strikethroughTestReplacedString = 'This is a <del>sentence,</del> and it has some <del>punctuation, words, and spaces</del>. <del>test</del> ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    expect(parser.replace(strikethroughTestStartString)).toBe(strikethroughTestReplacedString);
});

// Markdown style links replaced successfully
test('Test markdown style links', () => {
    const testString = 'Go to [Expensify](https://www.expensify.com) to learn more. [Expensify](www.expensify.com) [Expensify](expensify.com) [It\'s really the coolest](expensify.com) [`Some` Special cases - + . = , \'](expensify.com/some?query=par|am)';
    const resultString = 'Go to <a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> to learn more. <a href="http://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> <a href="http://expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> <a href="http://expensify.com" target="_blank" rel="noreferrer noopener">It&#x27;s really the coolest</a> <a href="http://expensify.com/some?query=par|am" target="_blank" rel="noreferrer noopener"><code>Some</code> Special cases - + . = , &#x27;</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

// Critical Markdown style links replaced successfully
test('Test critical markdown style links', () => {
    const testString = 'Testing '
    + '[first](https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&index=logs_expensify-008878) '
    + '[first no https://](www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&index=logs_expensify-008878) '
    + '[second](http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled) '
    + '[second no http://](necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled) '
    + '[third](https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash) '
    + '[third no https://](github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash) '
    + '[link `[inside another link](https://google.com)`](https://google.com) '
    + '[link with an @ in it](https://google.com) '
    + '[link with [brackets] inside of it](https://google.com) '
    + '[link with smart quotes ‘’“”](https://google.com) '
    + '[link with someone@expensify.com email in it](https://google.com)';
    const resultString = 'Testing '
    + '<a href="https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank" rel="noreferrer noopener">first</a> '
    + '<a href="http://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank" rel="noreferrer noopener">first no https://</a> '
    + '<a href="http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank" rel="noreferrer noopener">second</a> '
    + '<a href="http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank" rel="noreferrer noopener">second no http://</a> '
    + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank" rel="noreferrer noopener">third</a> '
    + '<a href="http://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank" rel="noreferrer noopener">third no https://</a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener">link <code>[inside another link](https://google.com)</code></a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener">link with an @ in it</a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener">link with [brackets] inside of it</a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener">link with smart quotes ‘’“”</a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener">link with someone@expensify.com email in it</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

// HTML encoded strings unaffected by parser
test('Test HTML encoded strings', () => {
    const rawHTMLTestStartString = '<em>This is</em> a <strong>test</strong>. None of <h1>these strings</h1> should display <del>as</del> <div>HTML</div>.';
    const rawHTMLTestReplacedString = '&lt;em&gt;This is&lt;/em&gt; a &lt;strong&gt;test&lt;/strong&gt;. None of &lt;h1&gt;these strings&lt;/h1&gt; should display &lt;del&gt;as&lt;/del&gt; &lt;div&gt;HTML&lt;/div&gt;.';
    expect(parser.replace(rawHTMLTestStartString)).toBe(rawHTMLTestReplacedString);
});

// New lines characters \\n were successfully replaced with <br>
test('Test newline markdown replacement', () => {
    const newLineTestStartString = 'This sentence has a newline \n Yep just had one \n Oh there it is another one';
    const newLineReplacedString = 'This sentence has a newline <br> Yep just had one <br> Oh there it is another one';
    expect(parser.replace(newLineTestStartString)).toBe(newLineReplacedString);
});

// Period replacement test
test('Test period replacements', () => {
    const periodTestStartString = 'This test ensures that words with trailing... periods.. are. not converted to links.';
    expect(parser.replace(periodTestStartString)).toBe(periodTestStartString);
});

test('Test code fencing', () => {
    let codeFenceExampleMarkdown = '```\nconst javaScript = \'javaScript\'\n```';
    expect(parser.replace(codeFenceExampleMarkdown)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;</pre>');

    codeFenceExampleMarkdown = '```const javaScript = \'javaScript\'\n```';
    expect(parser.replace(codeFenceExampleMarkdown)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;</pre>');

    codeFenceExampleMarkdown = '```\nconst javaScript = \'javaScript\'```';
    expect(parser.replace(codeFenceExampleMarkdown)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;</pre>');

    codeFenceExampleMarkdown = '```const javaScript = \'javaScript\'```';
    expect(parser.replace(codeFenceExampleMarkdown)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;</pre>');
});

test('Test code fencing with spaces and new lines', () => {
    let codeFenceExample = '```\nconst javaScript = \'javaScript\'\n    const php = \'php\'\n```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br>&#32;&#32;&#32;&#32;const&#32;php&#32;=&#32;&#x27;php&#x27;</pre>');

    codeFenceExample = '```const javaScript = \'javaScript\'\n    const php = \'php\'\n```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br>&#32;&#32;&#32;&#32;const&#32;php&#32;=&#32;&#x27;php&#x27;</pre>');

    codeFenceExample = '```\nconst javaScript = \'javaScript\'\n    const php = \'php\'```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br>&#32;&#32;&#32;&#32;const&#32;php&#32;=&#32;&#x27;php&#x27;</pre>');

    codeFenceExample = '```const javaScript = \'javaScript\'\n    const php = \'php\'```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br>&#32;&#32;&#32;&#32;const&#32;php&#32;=&#32;&#x27;php&#x27;</pre>');
});

test('Test inline code blocks', () => {
    const inlineCodeStartString = 'My favorite language is `JavaScript`. How about you?';
    expect(parser.replace(inlineCodeStartString)).toBe('My favorite language is <code>JavaScript</code>. How about you?');
});

test('Test inline code blocks with ExpensiMark syntax inside', () => {
    const inlineCodeStartString = '`This is how you can write ~strikethrough~, *bold*, and _italics_`';
    expect(parser.replace(inlineCodeStartString)).toBe('<code>This is how you can write ~strikethrough~, *bold*, and _italics_</code>');
});

test('Test inline code blocks inside ExpensiMark', () => {
    const testString = '_`test`_'
   + '*`test`*'
   + '~`test`~';
    const resultString = '<em><code>test</code></em>'
   + '<strong><code>test</code></strong>'
   + '<del><code>test</code></del>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test code fencing with ExpensiMark syntax inside', () => {
    let codeFenceExample = '```\nThis is how you can write ~strikethrough~, *bold*, _italics_, and [links](https://www.expensify.com)\n```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)</pre>');

    codeFenceExample = '```This is how you can write ~strikethrough~, *bold*, _italics_, and [links](https://www.expensify.com)\n```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)</pre>');

    codeFenceExample = '```\nThis is how you can write ~strikethrough~, *bold*, _italics_, and [links](https://www.expensify.com)```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)</pre>');

    codeFenceExample = '```This is how you can write ~strikethrough~, *bold*, _italics_, and [links](https://www.expensify.com)```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)</pre>');
});

test('Test combination replacements', () => {
    const urlTestStartString = '<em>Here</em> is a _combination test_ that <marquee>sees</marquee> if ~https://www.example.com~ https://otherexample.com links get rendered first followed by *other markup* or if _*two work together*_ as well. This sentence also has a newline \n Yep just had one.';
    const urlTestReplacedString = '&lt;em&gt;Here&lt;/em&gt; is a <em>combination test</em> that &lt;marquee&gt;sees&lt;/marquee&gt; if <del><a href="https://www.example.com" target="_blank" rel="noreferrer noopener">https://www.example.com</a></del> <a href="https://otherexample.com"'
        + ' target="_blank" rel="noreferrer noopener">https://otherexample.com</a> links get rendered first followed by <strong>other markup</strong> or if <em><strong>two work together</strong></em> as well. This sentence also has a newline <br> Yep just had one.';
    expect(parser.replace(urlTestStartString)).toBe(urlTestReplacedString);
});

test('Test wrapped URLs', () => {
    const wrappedUrlTestStartString = '~https://www.example.com~ _http://www.test.com_ *http://www.asdf.com/_test*';
    const wrappedUrlTestReplacedString = '<del><a href="https://www.example.com" target="_blank" rel="noreferrer noopener">https://www.example.com</a></del> <em><a href="http://www.test.com" target="_blank" rel="noreferrer noopener">http://www.test.com</a></em>'
    + ' <strong><a href="http://www.asdf.com/_test" target="_blank" rel="noreferrer noopener">http://www.asdf.com/_test</a></strong>';
    expect(parser.replace(wrappedUrlTestStartString)).toBe(wrappedUrlTestReplacedString);
});

test('Test url replacements', () => {
    const urlTestStartString = 'Testing '
        + 'foo.com '
        + 'www.foo.com '
        + 'http://www.foo.com '
        + 'http://foo.com/blah_blah '
        + 'http://foo.com/blah_blah/ '
        + 'http://foo.com/blah_blah_(wikipedia) '
        + 'http://www.example.com/wpstyle/?p=364 '
        + 'https://www.example.com/foo/?bar=baz&inga=42&quux '
        + 'http://foo.com/(something)?after=parens '
        + 'http://code.google.com/events/#&product=browser '
        + 'http://foo.bar/?q=Test%20URL-encoded%20stuff '
        + 'http://www.test.com/path?param=123#123 '
        + 'http://1337.net '
        + 'http://a.b-c.de/ '
        + 'https://sd1.sd2.docs.google.com/ '
        + 'https://expensify.cash/#/r/1234 '
        + 'https://github.com/Expensify/ReactNativeChat/pull/6.45 '
        + 'https://github.com/Expensify/Expensify/issues/143,231 '
        + 'testRareTLDs.beer '
        + 'test@expensify.com '
        + 'test.completelyFakeTLD '
        + 'https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&index=logs_expensify-008878) '
        + 'http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled '
        + 'https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash '
        + 'https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash '
        + 'mm..food '
        + 'upwork.com/jobs/~016781e062ce860b84 '
        + 'https://bastion1.sjc/logs/app/kibana#/discover?_g=()&_a=(columns:!(_source),index:\'2125cbe0-28a9-11e9-a79c-3de0157ed580\',interval:auto,query:(language:lucene,query:\'\'),sort:!(timestamp,desc)) '
        + 'google.com/maps/place/The+Flying\'+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121 '
        + 'google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843 '
        + 'https://www.google.com/maps/place/Taj+Mahal+@is~"Awesome"/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422';

    const urlTestReplacedString = 'Testing '
        + '<a href="http://foo.com" target="_blank" rel="noreferrer noopener">foo.com</a> '
        + '<a href="http://www.foo.com" target="_blank" rel="noreferrer noopener">www.foo.com</a> '
        + '<a href="http://www.foo.com" target="_blank" rel="noreferrer noopener">http://www.foo.com</a> '
        + '<a href="http://foo.com/blah_blah" target="_blank" rel="noreferrer noopener">http://foo.com/blah_blah</a> '
        + '<a href="http://foo.com/blah_blah/" target="_blank" rel="noreferrer noopener">http://foo.com/blah_blah/</a> '
        + '<a href="http://foo.com/blah_blah_(wikipedia)" target="_blank" rel="noreferrer noopener">http://foo.com/blah_blah_(wikipedia)</a> '
        + '<a href="http://www.example.com/wpstyle/?p=364" target="_blank" rel="noreferrer noopener">http://www.example.com/wpstyle/?p=364</a> '
        + '<a href="https://www.example.com/foo/?bar=baz&amp;inga=42&amp;quux" target="_blank" rel="noreferrer noopener">https://www.example.com/foo/?bar=baz&amp;inga=42&amp;quux</a> '
        + '<a href="http://foo.com/(something)?after=parens" target="_blank" rel="noreferrer noopener">http://foo.com/(something)?after=parens</a> '
        + '<a href="http://code.google.com/events/#&amp;product=browser" target="_blank" rel="noreferrer noopener">http://code.google.com/events/#&amp;product=browser</a> '
        + '<a href="http://foo.bar/?q=Test%20URL-encoded%20stuff" target="_blank" rel="noreferrer noopener">http://foo.bar/?q=Test%20URL-encoded%20stuff</a> '
        + '<a href="http://www.test.com/path?param=123#123" target="_blank" rel="noreferrer noopener">http://www.test.com/path?param=123#123</a> '
        + '<a href="http://1337.net" target="_blank" rel="noreferrer noopener">http://1337.net</a> '
        + '<a href="http://a.b-c.de/" target="_blank" rel="noreferrer noopener">http://a.b-c.de/</a> '
        + '<a href="https://sd1.sd2.docs.google.com/" target="_blank" rel="noreferrer noopener">https://sd1.sd2.docs.google.com/</a> '
        + '<a href="https://expensify.cash/#/r/1234" target="_blank" rel="noreferrer noopener">https://expensify.cash/#/r/1234</a> '
        + '<a href="https://github.com/Expensify/ReactNativeChat/pull/6.45" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/6.45</a> '
        + '<a href="https://github.com/Expensify/Expensify/issues/143,231" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/Expensify/issues/143,231</a> '
        + '<a href="http://testRareTLDs.beer" target="_blank" rel="noreferrer noopener">testRareTLDs.beer</a> '
        + '<a href="mailto:test@expensify.com">test@expensify.com</a> '
        + 'test.completelyFakeTLD '
        + '<a href="https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank" rel="noreferrer noopener">https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878</a>) '
        + '<a href="http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank" rel="noreferrer noopener">http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled</a> '
        + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash</a> '
        + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash</a> '
        + 'mm..food '
        + '<a href="http://upwork.com/jobs/~016781e062ce860b84" target="_blank" rel="noreferrer noopener">upwork.com/jobs/~016781e062ce860b84</a> '
        + '<a href="https://bastion1.sjc/logs/app/kibana#/discover?_g=()&amp;_a=(columns:!(_source),index:&#x27;2125cbe0-28a9-11e9-a79c-3de0157ed580&#x27;,interval:auto,query:(language:lucene,query:&#x27;&#x27;),sort:!(timestamp,desc))" target="_blank" rel="noreferrer noopener">https://bastion1.sjc/logs/app/kibana#/discover?_g=()&amp;_a=(columns:!(_source),index:&#x27;2125cbe0-28a9-11e9-a79c-3de0157ed580&#x27;,interval:auto,query:(language:lucene,query:&#x27;&#x27;),sort:!(timestamp,desc))</a> '
        + '<a href="http://google.com/maps/place/The+Flying&#x27;+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121" target="_blank" rel="noreferrer noopener">google.com/maps/place/The+Flying&#x27;+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121</a> '
        + '<a href="http://google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843" target="_blank" rel="noreferrer noopener">google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843</a> '
        + '<a href="https://www.google.com/maps/place/Taj+Mahal+@is~&quot;Awesome&quot;/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422" target="_blank" rel="noreferrer noopener">https://www.google.com/maps/place/Taj+Mahal+@is~&quot;Awesome&quot;/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422</a>';

    expect(parser.replace(urlTestStartString)).toBe(urlTestReplacedString);
});

test('Test markdown style link with various styles', () => {
    const testString = 'Go to ~[Expensify](https://www.expensify.com)~ '
        + '_[Expensify](https://www.expensify.com)_ '
        + '*[Expensify](https://www.expensify.com)* '
        + '[Expensify!](https://www.expensify.com) '
        + '[Expensify?](https://www.expensify.com) '
        + '[Expensify](https://www.expensify-test.com) '
        + '[Expensify](https://www.expensify.com/settings?param={%22section%22:%22account%22}) '
        + '[Expensify](https://www.expensify.com/settings?param=(%22section%22+%22account%22)) '
        + '[Expensify](https://www.expensify.com/settings?param=[%22section%22:%22account%22])';

    const resultString = 'Go to <del><a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a></del> '
        + '<em><a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a></em> '
        + '<strong><a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a></strong> '
        + '<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify!</a> '
        + '<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify?</a> '
        + '<a href="https://www.expensify-test.com" target="_blank" rel="noreferrer noopener">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param={%22section%22:%22account%22}" target="_blank" rel="noreferrer noopener">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param=(%22section%22+%22account%22)" target="_blank" rel="noreferrer noopener">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param=[%22section%22:%22account%22]" target="_blank" rel="noreferrer noopener">Expensify</a>';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test links that end in a comma autolink correctly', () => {
    const testString = 'https://github.com/Expensify/Expensify/issues/143231,';
    const resultString = '<a href="https://github.com/Expensify/Expensify/issues/143231" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/Expensify/issues/143231</a>,';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test links inside two backticks are not autolinked', () => {
    const testString = '`https://github.com/Expensify/Expensify/issues/143231`';
    const resultString = '<code>https://github.com/Expensify/Expensify/issues/143231</code>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test a period at the end of a link autolinks correctly', () => {
    const testString = 'https://github.com/Expensify/ReactNativeChat/pull/645.';
    const resultString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>.';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test a url ending with a question mark autolinks correctly', () => {
    const testString = 'https://github.com/Expensify/ReactNativeChat/pull/645?';
    const resultString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>?';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test a url ending with a closing parentheses autolinks correctly', () => {
    const testString = 'https://github.com/Expensify/ReactNativeChat/pull/645)';
    const resultString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>)';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test markdown style email link with various styles', () => {
    const testString = 'Go to ~[Expensify](concierge@expensify.com)~ '
        + '_[Expensify](concierge@expensify.com)_ '
        + '*[Expensify](concierge@expensify.com)* '
        + '[Expensify!](no-concierge1@expensify.com) '
        + '[Expensify?](concierge?@expensify.com) '
        + '[Applause](applausetester+qaabecciv@applause.expensifail.com) ';

    const resultString = 'Go to <del><a href="mailto:concierge@expensify.com">Expensify</a></del> '
        + '<em><a href="mailto:concierge@expensify.com">Expensify</a></em> '
        + '<strong><a href="mailto:concierge@expensify.com">Expensify</a></strong> '
        + '<a href="mailto:no-concierge1@expensify.com">Expensify!</a> '
        + '<a href="mailto:concierge?@expensify.com">Expensify?</a> '
        + '<a href="mailto:applausetester+qaabecciv@applause.expensifail.com">Applause</a> ';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test general email link with various styles', () => {
    const testString = 'Go to concierge@expensify.com '
        + 'no-concierge@expensify.com '
        + 'concierge!@expensify.com '
        + 'concierge1?@expensify.com '
        + 'applausetester+qaabecciv@applause.expensifail.com ';

    const resultString = 'Go to <a href="mailto:concierge@expensify.com">concierge@expensify.com</a> '
        + '<a href="mailto:no-concierge@expensify.com">no-concierge@expensify.com</a> '
        + '<a href="mailto:concierge!@expensify.com">concierge!@expensify.com</a> '
        + '<a href="mailto:concierge1?@expensify.com">concierge1?@expensify.com</a> '
        + '<a href="mailto:applausetester+qaabecciv@applause.expensifail.com">applausetester+qaabecciv@applause.expensifail.com</a> ';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test markdown and url links with inconsistent starting and closing parens', () => {
    const testString = '[google](http://google.com/(something)?after=parens) '
        + '([google](http://google.com/(something)?after=parens)) '
        + '([google](https://google.com/)) '
        + '([google](http://google.com/(something)?after=parens)))) '
        + '((([google](http://google.com/(something)?after=parens) '
        + '(http://foo.com/(something)?after=parens) '
        + '(((http://foo.com/(something)?after=parens '
        + '(((http://foo.com/(something)?after=parens))) '
        + 'http://foo.com/(something)?after=parens))) '
        + '[Yo (click here to see a cool cat)](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Yo click here to see a cool cat)](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Yo (click here to see a cool cat](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Yo click * $ & here to see a cool cat](https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg) '
        + '[Text text] more text ([link here](www.google.com))'
        + '[Text text] more text ([link [square brackets within] here](www.google.com))'
        + '[Text text] more text ([link (parenthesis within) here](www.google.com))'
        + '[Text text] more text [link here](www.google.com)'
        + '[Text text] more text ([link here  ](www.google.com))'
        + '[Text text] more text (([link here](www.google.com)))'
        + '[Text text] more text [([link here](www.google.com))]'
        + '[Text text] more text ([link here](www.google.com))[Text text] more text ([link here](www.google.com))';


    const resultString = '<a href="http://google.com/(something)?after=parens" target="_blank" rel="noreferrer noopener">google</a> '
        + '(<a href="http://google.com/(something)?after=parens" target="_blank" rel="noreferrer noopener">google</a>) '
        + '(<a href="https://google.com/" target="_blank" rel="noreferrer noopener">google</a>) '
        + '(<a href="http://google.com/(something)?after=parens" target="_blank" rel="noreferrer noopener">google</a>))) '
        + '(((<a href="http://google.com/(something)?after=parens" target="_blank" rel="noreferrer noopener">google</a> '
        + '(<a href="http://foo.com/(something)?after=parens" target="_blank" rel="noreferrer noopener">http://foo.com/(something)?after=parens</a>) '
        + '(((<a href="http://foo.com/(something)?after=parens" target="_blank" rel="noreferrer noopener">http://foo.com/(something)?after=parens</a> '
        + '(((<a href="http://foo.com/(something)?after=parens" target="_blank" rel="noreferrer noopener">http://foo.com/(something)?after=parens</a>))) '
        + '<a href="http://foo.com/(something)?after=parens" target="_blank" rel="noreferrer noopener">http://foo.com/(something)?after=parens</a>))) '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank" rel="noreferrer noopener">Yo (click here to see a cool cat)</a> '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank" rel="noreferrer noopener">Yo click here to see a cool cat)</a> '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank" rel="noreferrer noopener">Yo (click here to see a cool cat</a> '
        + '<a href="https://c8.alamy.com/compes/ha11pc/cookie-cat-con-sombrero-de-cowboy-y-sun-glass-ha11pc.jpg" target="_blank" rel="noreferrer noopener">Yo click * $ &amp; here to see a cool cat</a> '
        + '[Text text] more text (<a href="http://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>)'
        + '[Text text] more text (<a href="http://www.google.com" target="_blank" rel="noreferrer noopener">link [square brackets within] here</a>)'
        + '[Text text] more text (<a href="http://www.google.com" target="_blank" rel="noreferrer noopener">link (parenthesis within) here</a>)'
        + '[Text text] more text <a href="http://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>'
        + '[Text text] more text (<a href="http://www.google.com" target="_blank" rel="noreferrer noopener">link here  </a>)'
        + '[Text text] more text ((<a href="http://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>))'
        + '[Text text] more text [(<a href="http://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>)]'
        + '[Text text] more text (<a href="http://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>)[Text text] more text (<a href="http://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>)';


    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text matching inside and outside codefence without spaces', () => {
    const testString = 'The next line should be quoted\n&gt;Hello,I’mtext\n```\nThe next line should not be quoted\n&gt;Hello,I’mtext\nsince its inside a codefence```';

    const resultString = 'The next line should be quoted<br><blockquote>Hello,I’mtext</blockquote><pre>The&#32;next&#32;line&#32;should&#32;not&#32;be&#32;quoted<br>&gt;Hello,I’mtext<br>since&#32;its&#32;inside&#32;a&#32;codefence</pre>';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text matching inside and outside codefence at the same line', () => {
    const testString = 'The next line should be quoted\n&gt;Hello,I’mtext\nThe next line should not be quoted\n```&gt;Hello,I’mtext```\nsince its inside a codefence';

    const resultString = 'The next line should be quoted<br><blockquote>Hello,I’mtext</blockquote>The next line should not be quoted<br><pre>&gt;Hello,I’mtext</pre><br>since its inside a codefence';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text matching inside and outside codefence at the end of the text', () => {
    const testString = 'The next line should be quoted\n&gt;Hello,I’mtext\nThe next line should not be quoted\n```&gt;Hello,I’mtext```';

    const resultString = 'The next line should be quoted<br><blockquote>Hello,I’mtext</blockquote>The next line should not be quoted<br><pre>&gt;Hello,I’mtext</pre>';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text matching inside and outside codefence with quotes at the end of the text', () => {
    const testString = 'The next line should be quoted\n```&gt;Hello,I’mtext```\nThe next line should not be quoted\n&gt;Hello,I’mtext';

    const resultString = 'The next line should be quoted<br><pre>&gt;Hello,I’mtext</pre><br>The next line should not be quoted<br><blockquote>Hello,I’mtext</blockquote>';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Single char matching', () => {
    const testString = ' *1* char _1_ char ~1~ char';
    const resultString = ' <strong>1</strong> char <em>1</em> char <del>1</del> char';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test autolink with . before a slash', () => {
    const testString = 'https://www.google.com/maps/place/Poster+Auctions+International,+Inc./@40.7384572,-73.9942151,20.17z/data=!4m13!1m7!3m6!1s0x89c259a2c5fdee77:0x1439488db9133bae!2s26+W+17th+St,+New+York,+NY+10011!3b1!8m2!3d40.7383679!4d-73.993907!3m4!1s0x89c259a2c438eb63:0x115ba65a3675338b!8m2!3d40.7384793!4d-73.9937764';
    const resultString = '<a href="https://www.google.com/maps/place/Poster+Auctions+International,+Inc./@40.7384572,-73.9942151,20.17z/data=!4m13!1m7!3m6!1s0x89c259a2c5fdee77:0x1439488db9133bae!2s26+W+17th+St,+New+York,+NY+10011!3b1!8m2!3d40.7383679!4d-73.993907!3m4!1s0x89c259a2c438eb63:0x115ba65a3675338b!8m2!3d40.7384793!4d-73.9937764" target="_blank" rel="noreferrer noopener">https://www.google.com/maps/place/Poster+Auctions+International,+Inc./@40.7384572,-73.9942151,20.17z/data=!4m13!1m7!3m6!1s0x89c259a2c5fdee77:0x1439488db9133bae!2s26+W+17th+St,+New+York,+NY+10011!3b1!8m2!3d40.7383679!4d-73.993907!3m4!1s0x89c259a2c438eb63:0x115ba65a3675338b!8m2!3d40.7384793!4d-73.9937764</a>';
    expect(parser.replace(testString)).toBe(resultString);
});
