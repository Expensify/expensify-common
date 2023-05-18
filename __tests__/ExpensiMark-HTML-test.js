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

// Multi-line text wrapped in * is successfully replaced with <strong></strong>
test('Test multi-line bold markdown replacement', () => {
    const testString = '*Here is a multi-line\ncomment that should\nbe bold*';
    const replacedString = '<strong>Here is a multi-line<br />comment that should<br />be bold</strong>';

    expect(parser.replace(testString)).toBe(replacedString);
});

// Sections starting with > are successfully wrapped with <blockquote></blockquote>
test('Test quote markdown replacement', () => {
    const quoteTestStartString = '>This is a *quote* that started on a new line.\nHere is a >quote that did not\n```\nhere is a codefenced quote\n>it should not be quoted\n```';
    const quoteTestReplacedString = '<blockquote>This is a <strong>quote</strong> that started on a new line.</blockquote>Here is a &gt;quote that did not <pre>here&#32;is&#32;a&#32;codefenced&#32;quote<br />&gt;it&#32;should&#32;not&#32;be&#32;quoted<br /></pre>';

    expect(parser.replace(quoteTestStartString)).toBe(quoteTestReplacedString);
});

// Words wrapped in _ successfully replaced with <em></em>
test('Test italic markdown replacement', () => {
    const italicTestStartString = 'This is a _sentence,_ and it has some _punctuation, words, and spaces_. ___ _italic__ _test_ _ testing_ test_test_test. _ test _ _test _';
    const italicTestReplacedString = 'This is a <em>sentence,</em> and it has some <em>punctuation, words, and spaces</em>. ___ <em>italic</em>_ <em>test</em> _ testing_ test_test_test. _ test _ _test _';
    expect(parser.replace(italicTestStartString)).toBe(italicTestReplacedString);
});

// Multi-line text wrapped in _ is successfully replaced with <em></em>
test('Test multi-line italic markdown replacement', () => {
    const testString = '_Here is a multi-line\ncomment that should\nbe italic_ \n_\n_test\n_';
    const replacedString = '<em>Here is a multi-line<br />comment that should<br />be italic</em> <br />_<br />_test<br />_';

    expect(parser.replace(testString)).toBe(replacedString);
});

// Words wrapped in ~ successfully replaced with <del></del>
test('Test strikethrough markdown replacement', () => {
    const strikethroughTestStartString = 'This is a ~sentence,~ and it has some ~punctuation, words, and spaces~. ~test~ ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    const strikethroughTestReplacedString = 'This is a <del>sentence,</del> and it has some <del>punctuation, words, and spaces</del>. <del>test</del> ~ testing~ test~test~test. ~ testing ~ ~testing ~';
    expect(parser.replace(strikethroughTestStartString)).toBe(strikethroughTestReplacedString);
});


// Multi-line text wrapped in ~ is successfully replaced with <del></del>
test('Test multi-line strikethrough markdown replacement', () => {
    const testString = '~Here is a multi-line\ncomment that should\nhave strikethrough applied~';
    const replacedString = '<del>Here is a multi-line<br />comment that should<br />have strikethrough applied</del>';

    expect(parser.replace(testString)).toBe(replacedString);
});

// Emails containing *_~ are successfully wrapped in a mailto anchor tag
test('Test markdown replacement for emails and email links containing bold/strikethrough/italic', () => {
    let testInput = 'a~b@gmail.com';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a~b@gmail.com">a~b@gmail.com</a>');

    testInput = 'a*b@gmail.com';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a*b@gmail.com">a*b@gmail.com</a>');

    testInput = 'a_b@gmail.com';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a_b@gmail.com">a_b@gmail.com</a>');

    testInput = 'a~*_b@gmail.com';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a~*_b@gmail.com">a~*_b@gmail.com</a>');

    testInput = '[text](a~b@gmail.com)';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a~b@gmail.com">text</a>');

    testInput = '[text](a*b@gmail.com)';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a*b@gmail.com">text</a>');

    testInput = '[text](a_b@gmail.com)';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a_b@gmail.com">text</a>');

    testInput = '[text](a~*_b@gmail.com)';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a~*_b@gmail.com">text</a>');
});

// Single-line emails wrapped in *_~ are successfully wrapped in a mailto anchor tag
test('Test markdown replacement for emails wrapped in bold/strikethrough/italic in a single line', () => {
    let testInput = '~abc@gmail.com~';
    expect(parser.replace(testInput)).toBe('<del><a href="mailto:abc@gmail.com">abc@gmail.com</a></del>');

    testInput = '*abc@gmail.com*';
    expect(parser.replace(testInput)).toBe('<strong><a href="mailto:abc@gmail.com">abc@gmail.com</a></strong>');

    testInput = '_abc@gmail.com_';
    expect(parser.replace(testInput)).toBe('<em><a href="mailto:abc@gmail.com">abc@gmail.com</a></em>');

    testInput = '~*_abc@gmail.com_*~';
    expect(parser.replace(testInput)).toBe('<del><strong><em><a href="mailto:abc@gmail.com">abc@gmail.com</a></em></strong></del>');

    testInput = '[text](~abc@gmail.com~)';
    expect(parser.replace(testInput)).toBe('[text](<del><a href="mailto:abc@gmail.com">abc@gmail.com</a></del>)');

    testInput = '[text](*abc@gmail.com*)';
    expect(parser.replace(testInput)).toBe('[text](<strong><a href="mailto:abc@gmail.com">abc@gmail.com</a></strong>)');

    testInput = '[text](_abc@gmail.com_)';
    expect(parser.replace(testInput)).toBe('[text](<em><a href="mailto:abc@gmail.com">abc@gmail.com</a></em>)');

    testInput = '[text](~*_abc@gmail.com_*~)';
    expect(parser.replace(testInput)).toBe('[text](<del><strong><em><a href="mailto:abc@gmail.com">abc@gmail.com</a></em></strong></del>)');
});

// Multi-line emails wrapped in *_~ are successfully wrapped in a mailto anchor tag
test('Test markdown replacement for emails wrapped in bold/strikethrough/italic in multi-line', () => {
    let testInput = '~abc@gmail.com\ndef@gmail.com~';
    let result = '<del><a href="mailto:abc@gmail.com">abc@gmail.com</a><br />'
        + '<a href="mailto:def@gmail.com">def@gmail.com</a></del>';
    expect(parser.replace(testInput)).toBe(result);

    testInput = '*abc@gmail.com\ndef@gmail.com*';
    result = '<strong><a href="mailto:abc@gmail.com">abc@gmail.com</a><br />'
        + '<a href="mailto:def@gmail.com">def@gmail.com</a></strong>';
    expect(parser.replace(testInput)).toBe(result);

    testInput = '_abc@gmail.com\ndef@gmail.com_';
    result = '<em><a href="mailto:abc@gmail.com">abc@gmail.com</a><br />'
        + '<a href="mailto:def@gmail.com">def@gmail.com</a></em>';
    expect(parser.replace(testInput)).toBe(result);

    testInput = '~*_abc@gmail.com\ndef@gmail.com_*~';
    result = '<del><strong><em><a href="mailto:abc@gmail.com">abc@gmail.com</a><br />'
        + '<a href="mailto:def@gmail.com">def@gmail.com</a></em></strong></del>';
    expect(parser.replace(testInput)).toBe(result);

    testInput = '[text](~abc@gmail.com)\n[text](def@gmail.com~)';
    result = '[text](<del><a href="mailto:abc@gmail.com">abc@gmail.com</a>)<br />'
        + '[text](<a href="mailto:def@gmail.com">def@gmail.com</a></del>)';
    expect(parser.replace(testInput)).toBe(result);

    testInput = '[text](*abc@gmail.com)\n[text](def@gmail.com*)';
    result = '[text](<strong><a href="mailto:abc@gmail.com">abc@gmail.com</a>)<br />'
        + '[text](<a href="mailto:def@gmail.com">def@gmail.com</a></strong>)';
    expect(parser.replace(testInput)).toBe(result);

    testInput = '[text](_abc@gmail.com)\n[text](def@gmail.com_)';
    result = '[text](<em><a href="mailto:abc@gmail.com">abc@gmail.com</a>)<br />'
        + '[text](<a href="mailto:def@gmail.com">def@gmail.com</a></em>)';
    expect(parser.replace(testInput)).toBe(result);

    testInput = '[text](~*_abc@gmail.com)\n[text](def@gmail.com_*~)';
    result = '[text](<del><strong><em><a href="mailto:abc@gmail.com">abc@gmail.com</a>)<br />'
        + '[text](<a href="mailto:def@gmail.com">def@gmail.com</a></em></strong></del>)';
    expect(parser.replace(testInput)).toBe(result);
});

// Markdown style links replaced successfully
test('Test markdown style links', () => {
    const testString = 'Go to [Expensify](https://www.expensify.com) to learn more. [Expensify](www.expensify.com) [Expensify](expensify.com) [It\'s really the coolest](expensify.com) [`Some` Special cases - + . = , \'](expensify.com/some?query=par|am)';
    const resultString = 'Go to <a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> to learn more. <a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> <a href="https://expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> <a href="https://expensify.com" target="_blank" rel="noreferrer noopener">It&#x27;s really the coolest</a> <a href="https://expensify.com/some?query=par|am" target="_blank" rel="noreferrer noopener"><code>Some</code> Special cases - + . = , &#x27;</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

// Critical Markdown style links replaced successfully
test('Test critical markdown style links', () => {
    const testString = 'Testing '
    + '[~strikethrough~ *bold* _italic_](expensify.com) '
    + '[~strikethrough~ *bold* _italic_ test.com](expensify.com) '
    + '[~strikethrough~ *bold* _italic_ https://test.com](https://expensify.com) '
    + '[https://www.text.com/_root_folder/1](https://www.text.com/_root_folder/1) '
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
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><del>strikethrough</del> <strong>bold</strong> <em>italic</em></a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><del>strikethrough</del> <strong>bold</strong> <em>italic</em> test.com</a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><del>strikethrough</del> <strong>bold</strong> <em>italic</em> https://test.com</a> '
    + '<a href="https://www.text.com/_root_folder/1" target="_blank" rel="noreferrer noopener">https://www.text.com/_root_folder/1</a> '
    + '<a href="https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank" rel="noreferrer noopener">first</a> '
    + '<a href="https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank" rel="noreferrer noopener">first no https://</a> '
    + '<a href="http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank" rel="noreferrer noopener">second</a> '
    + '<a href="https://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank" rel="noreferrer noopener">second no http://</a> '
    + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank" rel="noreferrer noopener">third</a> '
    + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank" rel="noreferrer noopener">third no https://</a> '
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
    const newLineReplacedString = 'This sentence has a newline <br /> Yep just had one <br /> Oh there it is another one';
    expect(parser.replace(newLineTestStartString)).toBe(newLineReplacedString);
});

// Period replacement test
test('Test period replacements', () => {
    const periodTestStartString = 'This test ensures that words with trailing... periods.. are. not converted to links.';
    expect(parser.replace(periodTestStartString)).toBe(periodTestStartString);
});

test('Test code fencing', () => {
    let codeFenceExampleMarkdown = '```\nconst javaScript = \'javaScript\'\n```';
    expect(parser.replace(codeFenceExampleMarkdown)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br /></pre>');

    codeFenceExampleMarkdown = '```const javaScript = \'javaScript\'\n```';
    expect(parser.replace(codeFenceExampleMarkdown)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br /></pre>');

    codeFenceExampleMarkdown = '```\nconst javaScript = \'javaScript\'```';
    expect(parser.replace(codeFenceExampleMarkdown)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;</pre>');

    codeFenceExampleMarkdown = '```const javaScript = \'javaScript\'```';
    expect(parser.replace(codeFenceExampleMarkdown)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;</pre>');
});

test('Test code fencing with spaces and new lines', () => {
    let codeFenceExample = '```\nconst javaScript = \'javaScript\'\n    const php = \'php\'\n```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br />&#32;&#32;&#32;&#32;const&#32;php&#32;=&#32;&#x27;php&#x27;<br /></pre>');

    codeFenceExample = '```const javaScript = \'javaScript\'\n    const php = \'php\'\n```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br />&#32;&#32;&#32;&#32;const&#32;php&#32;=&#32;&#x27;php&#x27;<br /></pre>');

    codeFenceExample = '```\nconst javaScript = \'javaScript\'\n    const php = \'php\'```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br />&#32;&#32;&#32;&#32;const&#32;php&#32;=&#32;&#x27;php&#x27;</pre>');

    codeFenceExample = '```const javaScript = \'javaScript\'\n    const php = \'php\'```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>const&#32;javaScript&#32;=&#32;&#x27;javaScript&#x27;<br />&#32;&#32;&#32;&#32;const&#32;php&#32;=&#32;&#x27;php&#x27;</pre>');

    codeFenceExample = '```\n\n# test\n\n```';
    expect(parser.replace(codeFenceExample)).toBe('<pre><br />#&#32;test<br /><br /></pre>');

    codeFenceExample = '```\n\n\n# test\n\n```';
    expect(parser.replace(codeFenceExample)).toBe('<pre><br /><br />#&#32;test<br /><br /></pre>');
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
    expect(parser.replace(codeFenceExample)).toBe('<pre>This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)<br /></pre>');

    codeFenceExample = '```This is how you can write ~strikethrough~, *bold*, _italics_, and [links](https://www.expensify.com)\n```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)<br /></pre>');

    codeFenceExample = '```\nThis is how you can write ~strikethrough~, *bold*, _italics_, and [links](https://www.expensify.com)```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)</pre>');

    codeFenceExample = '```This is how you can write ~strikethrough~, *bold*, _italics_, and [links](https://www.expensify.com)```';
    expect(parser.replace(codeFenceExample)).toBe('<pre>This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)</pre>');
});

test('Test code fencing with ExpensiMark syntax outside', () => {
    let codeFenceExample = '# Test1 ```code``` Test2';
    expect(parser.replace(codeFenceExample)).toBe('<h1>Test1 </h1><pre>code</pre> Test2');

    codeFenceExample = '*Test1 ```code``` Test2*';
    expect(parser.replace(codeFenceExample)).toBe('*Test1 <pre>code</pre> Test2*');

    codeFenceExample = '_Test1 ```code``` Test2_';
    expect(parser.replace(codeFenceExample)).toBe('_Test1 <pre>code</pre> Test2_');
});

test('Test code fencing with additional backticks inside', () => {
    let nestedBackticks = '````test````';
    expect(parser.replace(nestedBackticks)).toBe('<pre>&#x60;test&#x60;</pre>');

    nestedBackticks = '````\ntest\n````';
    expect(parser.replace(nestedBackticks)).toBe('<pre>&#x60;<br />test<br />&#x60;</pre>');

    nestedBackticks = '````````';
    expect(parser.replace(nestedBackticks)).toBe('<pre>&#x60;&#x60;</pre>');

    nestedBackticks = '````\n````';
    expect(parser.replace(nestedBackticks)).toBe('<pre>&#x60;<br />&#x60;</pre>');

    nestedBackticks = '```````````';
    expect(parser.replace(nestedBackticks)).toBe('<pre>&#x60;&#x60;&#x60;&#x60;&#x60;</pre>');

    nestedBackticks = '````This is how you can write ~strikethrough~, *bold*, _italics_, and [links](https://www.expensify.com)````';
    expect(parser.replace(nestedBackticks)).toBe('<pre>&#x60;This&#32;is&#32;how&#32;you&#32;can&#32;write&#32;~strikethrough~,&#32;*bold*,&#32;_italics_,&#32;and&#32;[links](https://www.expensify.com)&#x60;</pre>');
});

test('Test combination replacements', () => {
    const urlTestStartString = '<em>Here</em> is a _combination test_ that <marquee>sees</marquee> if ~https://www.example.com~ https://otherexample.com links get rendered first followed by *other markup* or if _*two work together*_ as well. This sentence also has a newline \n Yep just had one.';
    const urlTestReplacedString = '&lt;em&gt;Here&lt;/em&gt; is a <em>combination test</em> that &lt;marquee&gt;sees&lt;/marquee&gt; if <del><a href="https://www.example.com" target="_blank" rel="noreferrer noopener">https://www.example.com</a></del> <a href="https://otherexample.com"'
        + ' target="_blank" rel="noreferrer noopener">https://otherexample.com</a> links get rendered first followed by <strong>other markup</strong> or if <em><strong>two work together</strong></em> as well. This sentence also has a newline <br /> Yep just had one.';
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
        + 'https://www.google.com/maps/place/Taj+Mahal+@is~"Awesome"/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422 '
        + 'https://www.facebook.com/hashtag/__main/?__eep__=6 '
        + 'https://example.com/~username/foo~bar.txt '
        + 'http://example.com/foo/*/bar/*/test.txt '
        + 'test-.com '
        + '-test.com '
        + '@test.com '
        + '@test.com test.com '
        + '@test.com @test.com ';

    const urlTestReplacedString = 'Testing '
        + '<a href="https://foo.com" target="_blank" rel="noreferrer noopener">foo.com</a> '
        + '<a href="https://www.foo.com" target="_blank" rel="noreferrer noopener">www.foo.com</a> '
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
        + '<a href="https://testraretlds.beer" target="_blank" rel="noreferrer noopener">testRareTLDs.beer</a> '
        + '<a href="mailto:test@expensify.com">test@expensify.com</a> '
        + 'test.completelyFakeTLD '
        + '<a href="https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878" target="_blank" rel="noreferrer noopener">https://www.expensify.com/_devportal/tools/logSearch/#query=request_id:(%22Ufjjim%22)+AND+timestamp:[2021-01-08T03:48:10.389Z+TO+2021-01-08T05:48:10.389Z]&amp;index=logs_expensify-008878</a>) '
        + '<a href="http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank" rel="noreferrer noopener">http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled</a> '
        + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash</a> '
        + '<a href="https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/Expensify.cash/issues/123#:~:text=Please%20work/Expensify.cash</a> '
        + 'mm..food '
        + '<a href="https://upwork.com/jobs/~016781e062ce860b84" target="_blank" rel="noreferrer noopener">upwork.com/jobs/~016781e062ce860b84</a> '
        + '<a href="https://bastion1.sjc/logs/app/kibana#/discover?_g=()&amp;_a=(columns:!(_source),index:&#x27;2125cbe0-28a9-11e9-a79c-3de0157ed580&#x27;,interval:auto,query:(language:lucene,query:&#x27;&#x27;),sort:!(timestamp,desc))" target="_blank" rel="noreferrer noopener">https://bastion1.sjc/logs/app/kibana#/discover?_g=()&amp;_a=(columns:!(_source),index:&#x27;2125cbe0-28a9-11e9-a79c-3de0157ed580&#x27;,interval:auto,query:(language:lucene,query:&#x27;&#x27;),sort:!(timestamp,desc))</a> '
        + '<a href="https://google.com/maps/place/The+Flying&#x27;+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121" target="_blank" rel="noreferrer noopener">google.com/maps/place/The+Flying&#x27;+Saucer/@42.4043314,-86.2742418,15z/data=!4m5!3m4!1s0x0:0xe28f6108670216bc!8m2!3d42.4043316!4d-86.2742121</a> '
        + '<a href="https://google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843" target="_blank" rel="noreferrer noopener">google.com/maps/place/%E9%9D%92%E5%B3%B6%E9%80%A3%E7%B5%A1%E8%88%B9%E4%B9%97%E5%A0%B4/@33.7363156,132.4877213,17.78z/data=!4m5!3m4!1s0x3545615c8c65bf7f:0xb89272c1a705a33f!8m2!3d33.7366776!4d132.4878843</a> '
        + '<a href="https://www.google.com/maps/place/Taj+Mahal+@is~&quot;Awesome&quot;/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422" target="_blank" rel="noreferrer noopener">https://www.google.com/maps/place/Taj+Mahal+@is~&quot;Awesome&quot;/@27.1751496,78.0399535,17z/data=!4m12!1m6!3m5!1s0x39747121d702ff6d:0xdd2ae4803f767dde!2sTaj+Mahal!8m2!3d27.1751448!4d78.0421422!3m4!1s0x39747121d702ff6d:0xdd2ae4803f767dde!8m2!3d27.1751448!4d78.0421422</a> '
        + '<a href="https://www.facebook.com/hashtag/__main/?__eep__=6" target="_blank" rel="noreferrer noopener">https://www.facebook.com/hashtag/__main/?__eep__=6</a> '
        + '<a href="https://example.com/~username/foo~bar.txt" target="_blank" rel="noreferrer noopener">https://example.com/~username/foo~bar.txt</a> '
        + '<a href="http://example.com/foo/*/bar/*/test.txt" target="_blank" rel="noreferrer noopener">http://example.com/foo/*/bar/*/test.txt</a> '
        + 'test-.com '
        + '-<a href="https://test.com" target="_blank" rel="noreferrer noopener">test.com</a> '
        + '@test.com '
        + '@test.com <a href="https://test.com" target="_blank" rel="noreferrer noopener">test.com</a> '
        + '@test.com @test.com ';

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
        + '[Expensify](https://www.expensify.com/settings?param=[%22section%22:%22account%22]) '
        + '[https://www.facebook.com/hashtag/__main/?__eep__=6](https://www.facebook.com/hashtag/__main/?__eep__=6) '
        + '[https://example.com/~username/foo~bar.txt](https://example.com/~username/foo~bar.txt) '
        + '[http://example.com/foo/*/bar/*/test.txt](http://example.com/foo/*/bar/*/test.txt)';

    const resultString = 'Go to <del><a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a></del> '
        + '<em><a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a></em> '
        + '<strong><a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a></strong> '
        + '<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify!</a> '
        + '<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify?</a> '
        + '<a href="https://www.expensify-test.com" target="_blank" rel="noreferrer noopener">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param={%22section%22:%22account%22}" target="_blank" rel="noreferrer noopener">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param=(%22section%22+%22account%22)" target="_blank" rel="noreferrer noopener">Expensify</a> '
        + '<a href="https://www.expensify.com/settings?param=[%22section%22:%22account%22]" target="_blank" rel="noreferrer noopener">Expensify</a> '
        + '<a href="https://www.facebook.com/hashtag/__main/?__eep__=6" target="_blank" rel="noreferrer noopener">https://www.facebook.com/hashtag/__main/?__eep__=6</a> '
        + '<a href="https://example.com/~username/foo~bar.txt" target="_blank" rel="noreferrer noopener">https://example.com/~username/foo~bar.txt</a> '
        + '<a href="http://example.com/foo/*/bar/*/test.txt" target="_blank" rel="noreferrer noopener">http://example.com/foo/*/bar/*/test.txt</a>';

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
    const resultString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645?" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645?</a>';
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
        + '[Applause](applausetester+qaabecciv@applause.expensifail.com) '
        + '[](concierge@expensify.com)' // empty in []
        + '[   ](concierge@expensify.com)' // only spaces in []
        + '[ Expensify ](concierge@expensify.com)' // edge spaces in []
        + '[ Expensify Email ](concierge@expensify.com)' // space between words in []
        + '[concierge@expensify.com](concierge@expensify.com)' // same email between [] and ()
        + '[concierge-other@expensify.com](concierge@expensify.com)' // different emails between [] and ()
        + '[(Expensify)](concierge@expensify.com)' // () in []
        + '[Expensify [Test](test@expensify.com) Test](concierge@expensify.com)' // []() in []
        + '[Expensify [Test](concierge@expensify.com)' // [ in []
        + '[Expensify ]Test](concierge@expensify.com)'; // ] in []

    const resultString = 'Go to <del><a href="mailto:concierge@expensify.com">Expensify</a></del> '
        + '<em><a href="mailto:concierge@expensify.com">Expensify</a></em> '
        + '<strong><a href="mailto:concierge@expensify.com">Expensify</a></strong> '
        + '<a href="mailto:no-concierge1@expensify.com">Expensify!</a> '
        + '<a href="mailto:concierge?@expensify.com">Expensify?</a> '
        + '<a href="mailto:applausetester+qaabecciv@applause.expensifail.com">Applause</a> '
        + '<a href="mailto:concierge@expensify.com"></a>'
        + '<a href="mailto:concierge@expensify.com"></a>'
        + '<a href="mailto:concierge@expensify.com">Expensify</a>'
        + '<a href="mailto:concierge@expensify.com">Expensify Email</a>'
        + '<a href="mailto:concierge@expensify.com">concierge@expensify.com</a>'
        + '<a href="mailto:concierge@expensify.com">concierge-other@expensify.com</a>'
        + '<a href="mailto:concierge@expensify.com">(Expensify)</a>'
        + '[Expensify <a href="mailto:test@expensify.com">Test</a> Test](<a href="mailto:concierge@expensify.com">concierge@expensify.com</a>)'
        + '[Expensify <a href="mailto:concierge@expensify.com">Test</a>'
        + '[Expensify ]Test](<a href="mailto:concierge@expensify.com">concierge@expensify.com</a>)';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test a url with multiple underscores', () => {
    const testString = '[_example link_](https://www.facebook.com/hashtag/__main/?__eep__=6)';
    const resultString = '<a href="https://www.facebook.com/hashtag/__main/?__eep__=6" target="_blank" rel="noreferrer noopener"><em>example link</em></a>';
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
        + '[Text text] more text (<a href="https://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>)'
        + '[Text text] more text (<a href="https://www.google.com" target="_blank" rel="noreferrer noopener">link [square brackets within] here</a>)'
        + '[Text text] more text (<a href="https://www.google.com" target="_blank" rel="noreferrer noopener">link (parenthesis within) here</a>)'
        + '[Text text] more text <a href="https://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>'
        + '[Text text] more text (<a href="https://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>)'
        + '[Text text] more text ((<a href="https://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>))'
        + '[Text text] more text [(<a href="https://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>)]'
        + '[Text text] more text (<a href="https://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>)[Text text] more text (<a href="https://www.google.com" target="_blank" rel="noreferrer noopener">link here</a>)';


    expect(parser.replace(testString)).toBe(resultString);
});

test('Test autolink replacement to avoid parsing nested links', () => {
    const testString = '[click google.com *here*](google.com) '
        + '[click google.com ~here~](google.com) '
        + '[click google.com _here_](google.com) '
        + '[click google.com `here`](google.com) '
        + '[*click* google.com here](google.com) '
        + '[~click~ google.com here](google.com) '
        + '[_click_ google.com here](google.com) '
        + '[`click` google.com here](google.com) '
        + '[`click` google.com *here*](google.com)';

    const resultString = '<a href="https://google.com" target="_blank" rel="noreferrer noopener">click google.com <strong>here</strong></a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener">click google.com <del>here</del></a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener">click google.com <em>here</em></a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener">click google.com <code>here</code></a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener"><strong>click</strong> google.com here</a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener"><del>click</del> google.com here</a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener"><em>click</em> google.com here</a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener"><code>click</code> google.com here</a> '
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener"><code>click</code> google.com <strong>here</strong></a>';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text matching inside and outside codefence without spaces', () => {
    const testString = 'The next line should be quoted\n>Hello,I’mtext\n```\nThe next line should not be quoted\n>Hello,I’mtext\nsince its inside a codefence```';

    const resultString = 'The next line should be quoted<br /><blockquote>Hello,I’mtext</blockquote><pre>The&#32;next&#32;line&#32;should&#32;not&#32;be&#32;quoted<br />&gt;Hello,I’mtext<br />since&#32;its&#32;inside&#32;a&#32;codefence</pre>';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text matching inside and outside codefence at the same line', () => {
    const testString = 'The next line should be quoted\n>Hello,I’mtext\nThe next line should not be quoted\n```>Hello,I’mtext```\nsince its inside a codefence';

    const resultString = 'The next line should be quoted<br /><blockquote>Hello,I’mtext</blockquote>The next line should not be quoted <pre>&gt;Hello,I’mtext</pre>since its inside a codefence';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text matching inside and outside codefence at the end of the text', () => {
    const testString = 'The next line should be quoted\n>Hello,I’mtext\nThe next line should not be quoted\n```>Hello,I’mtext```';

    const resultString = 'The next line should be quoted<br /><blockquote>Hello,I’mtext</blockquote>The next line should not be quoted <pre>&gt;Hello,I’mtext</pre>';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text matching inside and outside codefence with quotes at the end of the text', () => {
    const testString = 'The next line should be quoted\n```>Hello,I’mtext```\nThe next line should not be quoted\n>Hello,I’mtext';

    const resultString = 'The next line should be quoted <pre>&gt;Hello,I’mtext</pre>The next line should not be quoted<br /><blockquote>Hello,I’mtext</blockquote>';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement and removing <br/> from <br/><pre> and </pre><br/>', () => {
    const testString = 'The next line should be quoted\n```>Hello,I’mtext```\nThe next line should not be quoted';

    const resultString = 'The next line should be quoted <pre>&gt;Hello,I’mtext</pre>The next line should not be quoted';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement skipping blank quotes', () => {
    const testString = '> \n>';
    const resultString = '&gt; <br />&gt;';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text starts with blank quote', () => {
    const testString = '> \ntest';
    const resultString = '&gt; <br />test';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with quotes starts with blank quote row', () => {
    const testString = '> \n>test';
    const resultString = '<blockquote>test</blockquote>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with quotes ends with blank quote rows', () => {
    const testString = '>test\n> \n>';
    const resultString = '<blockquote>test</blockquote>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with quotes includes a middle blank quote row', () => {
    const testString = '>test\n> \n>test';
    const resultString = '<blockquote>test<br /><br />test</blockquote>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with quotes includes multiple middle blank quote rows', () => {
    const testString = '>test\n> \n> \n>test\ntest\n>test\n> \n> \n> \n>test';
    const resultString = '<blockquote>test<br /><br /><br />test</blockquote>test<br /><blockquote>test<br /><br /><br /><br />test</blockquote>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test quotes markdown replacement with text includes blank quotes', () => {
    const testString = '> \n>quote1 line a\n> quote1 line b\ntest\n> \ntest\n>quote2 line a\n> \n> \n>quote2 line b with an empty line above';
    const resultString = '<blockquote>quote1 line a<br />quote1 line b</blockquote>test<br />&gt; <br />test<br /><blockquote>quote2 line a<br /><br /><br />quote2 line b with an empty line above</blockquote>';
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

test('Test for backticks with prefix', () => {
    const testString = 'a`b`';
    const resultString = 'a<code>b</code>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for backticks with suffix', () => {
    const testString = '`a`b';
    const resultString = '<code>a</code>b';
    expect(parser.replace(testString)).toBe(resultString);
});

// Backticks with no content are not replaced with <code>
test('Test for backticks with no content', () => {
    const testString = '`   `';
    const resultString = '&#x60;   &#x60;';
    expect(parser.replace(testString)).toBe(resultString);
});

// Code-fence with no content is not replaced with <pre>
test('Test for codefence with no content', () => {
    const testString = '```   ```';
    const resultString = '<code>&#x60;</code>   <code>&#x60;</code>';
    expect(parser.replace(testString)).toBe(resultString);
});

// link brackets with no content is not replaced with <a>
test('Test for link with no content', () => {
    const testString = '[  ](www.link.com)';
    const resultString = '[  ](<a href="https://www.link.com" target="_blank" rel="noreferrer noopener">www.link.com</a>)';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for link with emoji', () => {
    const testString = '[😀](www.link.com)';
    const resultString = '[😀](<a href="https://www.link.com" target="_blank" rel="noreferrer noopener">www.link.com</a>)';
    expect(parser.replace(testString)).toBe(resultString);
});
test('Test quotes markdown replacement with heading inside', () => {
    let testString = '> # heading';
    expect(parser.replace(testString)).toBe('<blockquote><h1>heading</h1></blockquote>');

    testString = '> # heading\n> test';
    expect(parser.replace(testString)).toBe('<blockquote><h1>heading</h1>test</blockquote>');

    testString = '> test\n> # heading\n> test';
    expect(parser.replace(testString)).toBe('<blockquote>test<br /><h1>heading</h1>test</blockquote>');

    testString = '> # heading A\n> # heading B';
    expect(parser.replace(testString)).toBe('<blockquote><h1>heading A</h1><h1>heading B</h1></blockquote>');

    testString = '> test\n>\n> # heading\n>\n>test';
    expect(parser.replace(testString)).toBe('<blockquote>test<br /><br /><h1>heading</h1><br />test</blockquote>');
});

test('Test heading1 markdown replacement with line break before or after the heading1', () => {
    const testString = 'test\n\n# heading\n\ntest';
    expect(parser.replace(testString)).toBe('test<br /><br /><h1>heading</h1><br />test');
});

// Valid text that should match for user mentions
test('Test for user mention with @username@domain.com', () => {
    const testString = '@username@expensify.com';
    const resultString = '<mention-user>@username@expensify.com</mention-user>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with @phoneNumber@domain.sms', () => {
    const testString = '@+19728974297@expensify.sms';
    const resultString = '<mention-user>@+19728974297@expensify.sms</mention-user>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with bold style', () => {
    const testString = '*@username@expensify.com*';
    const resultString = '<strong><mention-user>@username@expensify.com</mention-user></strong>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with italic style', () => {
    const testString = '_@username@expensify.com_';
    const resultString = '<em><mention-user>@username@expensify.com</mention-user></em>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with heading1 style', () => {
    const testString = '# @username@expensify.com';
    const resultString = '<h1><mention-user>@username@expensify.com</mention-user></h1>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with strikethrough style', () => {
    const testString = '~@username@expensify.com~';
    const resultString = '<del><mention-user>@username@expensify.com</mention-user></del>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with @here', () => {
    const testString = '@here say hello to @newuser@expensify.com';
    const resultString = '<mention-here>@here</mention-here> say hello to <mention-user>@newuser@expensify.com</mention-user>';
    expect(parser.replace(testString)).toBe(resultString);
});

// Invalid text should not match for user mentions:
test('Test for user mention without leading whitespace', () => {
    const testString = 'hi...@username@expensify.com';
    const resultString = 'hi...@<a href=\"mailto:username@expensify.com\">username@expensify.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with @username@expensify', () => {
    const testString = '@username@expensify';
    const resultString = '@username@expensify';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with valid email in the middle of a word', () => {
    const testString = 'hello username@expensify.com is my email';
    const resultString = 'hello <a href=\"mailto:username@expensify.com\">username@expensify.com</a> is my email';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with invalid username', () => {
    const testString = '@ +19728974297 hey';
    const resultString = '@ +19728974297 hey';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with codefence style', () => {
    const testString = '```hi @username@expensify.com```';
    const resultString = '<pre>@username@expensify.com</pre>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with inlineCodeBlock style', () => {
    const testString = '`hi @username@expensify.com`';
    const resultString = '<code>@username@expensify.com</code>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention inside link markdown', () => {
    const testString = '[@username@expensify.com](expensify.com)';
    const resultString = '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener">@username@expensify.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention inside email markdown', () => {
    const testString = '[@username@expensify.com](username@expensify.com)';
    const resultString = '<a href="mailto:username@expensify.com">@username@expensify.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention without space or supported styling character', () => {
    const testString = 'hi@username@expensify.com';
    const resultString = 'hi@<a href=\"mailto:username@expensify.com\">username@expensify.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention without space or supported styling character', () => {
    const testString = 'hi@here';
    const resultString = 'hi@here';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for @here mention with codefence style', () => {
    const testString = '```@here```';
    const resultString = '<pre>@here</pre>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for @here mention with inlineCodeBlock style', () => {
    const testString = '`@here`';
    const resultString = '<code>@here</code>';
    expect(parser.replace(testString)).toBe(resultString);
});

// Examples that should match for here mentions:
test('Test for here mention with @here', () => {
    const testString = '@here';
    const resultString = '<mention-here>@here</mention-here>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for here mention with leading word and space', () => {
    const testString = 'hi all @here';
    const resultString = 'hi all <mention-here>@here</mention-here>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for here mention with @here in the middle of a word', () => {
    const testString = '@here how are you guys?';
    const resultString = '<mention-here>@here</mention-here> how are you guys?';
    expect(parser.replace(testString)).toBe(resultString);
});

// Examples that should not match for here mentions:
test('Test for here mention without leading whitespace', () => {
    const testString = 'hi...@here';
    const resultString = 'hi...@here';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for here mention with invalid username', () => {
    const testString = '@ here hey';
    const resultString = '@ here hey';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for @here mention without space or supported styling character', () => {
    const testString = 'hi@username@expensify.com';
    const resultString = 'hi@<a href=\"mailto:username@expensify.com\">username@expensify.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Skip rendering invalid markdown',() => {
    let testString = '_*test_*';
    expect(parser.replace(testString)).toBe('<em>*test</em>*');

    testString = '*_test*_';
    expect(parser.replace(testString)).toBe('*<em>test*</em>');

    testString = '~*test~*';
    expect(parser.replace(testString)).toBe('~<strong>test~</strong>');
});
