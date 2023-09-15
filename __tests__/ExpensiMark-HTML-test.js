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

test('Test heading markdown replacement', () => {
    let testString = '# Heading should not have new line after it.\n';
    expect(parser.replace(testString)).toBe('<h1>Heading should not have new line after it.</h1>');

    testString = '# Heading should have only one new line after it.\n\n';
    expect(parser.replace(testString)).toBe('<h1>Heading should have only one new line after it.</h1><br />');
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

test('Test italic markdown replacement with word boundary and undercores', () => {
    const testString = 'hello_world '
        + 'hello__world '
        + 'h_ello_ '
        + '_hello_ '
        + '___hello_ '
        + '___hello______';
    const replacedString = 'hello_world '
        + 'hello__world '
        + 'h_ello_ '
        + '<em>hello</em> '
        + '__<em>hello</em> '
        + '__<em>hello</em>_____';
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

// Emails containing _ are successfully wrapped in a mailto anchor tag
test('Test markdown replacement for emails and email links containing bold/strikethrough/italic', () => {
    let testInput = 'a_b@gmail.com';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a_b@gmail.com">a_b@gmail.com</a>');

    testInput = '[text](a_b@gmail.com)';
    expect(parser.replace(testInput)).toBe('<a href="mailto:a_b@gmail.com">text</a>');
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

    testInput = '_email@test.com\n_email2@test.com\n\nemail3@test.com_';
    result = '<em><a href="mailto:email@test.com">email@test.com</a><br />'
        + '<a href="mailto:_email2@test.com">_email2@test.com</a><br /><br />'
        + '<a href="mailto:email3@test.com">email3@test.com</a></em>';
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
    result = '<a href="mailto:_abc@gmail.com">text</a><br />'
        + '[text](<a href="mailto:def@gmail.com">def@gmail.com</a>_)';
    expect(parser.replace(testInput)).toBe(result);

    testInput = '[text](~*_abc@gmail.com)\n[text](def@gmail.com_*~)';
    result = '[text](<del><strong><em><a href="mailto:abc@gmail.com">abc@gmail.com</a>)<br />'
        + '[text](<a href="mailto:def@gmail.com">def@gmail.com</a></em></strong></del>)';
    expect(parser.replace(testInput)).toBe(result);
});

// Check emails within other markdown
test('Test emails within other markdown', () => {
    const testString = '> test@example.com\n'
    + '```test@example.com```\n'
    + '`test@example.com`\n'
    + '_test@example.com_ '
    + '_test@example.com__ '
    + '__test@example.com__ '
    + '__test@example.com_';
    const result = '<blockquote><a href="mailto:test@example.com">test@example.com</a></blockquote>'
    + '<pre>test@example.com</pre>'
    + '<code>test@example.com</code><br />'
    + '<em><a href="mailto:test@example.com">test@example.com</a></em> '
    + '<em><a href="mailto:test@example.com">test@example.com</a></em>_ '
    + '<em><a href="mailto:_test@example.com">_test@example.com</a></em>_ '
    + '<em><a href="mailto:_test@example.com">_test@example.com</a></em>';
    expect(parser.replace(testString)).toBe(result);
});

// Check email regex's validity at various limits
test('Test markdown replacement for valid emails', () => {
    const testString = 'A simple email: abc.new@gmail.com, '
    + 'or a very short one a@example.com '
    + 'hitting the maximum domain length (63 chars) test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com '
    + 'or the maximum address length (64 chars) sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@test.com '
    + 'overall length of 254 averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com '
    + 'domain with many dashes sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asj-j-s-sjdjdjdjd-jdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdke.com.ab.net.aa.bb.cc.dd.ee '
    + ' how about a domain with repeated labels of 63 chars test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.com '
    + 'max length email with italics '
    + '_averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com_ '
    + ' xn-- style domain test@xn--diseolatinoamericano-76b.com '
    + 'or a more complex case where we need to determine where to apply italics markdown '
    + '_email@test.com\n_email2@test.com\n\nemail3@test.com_ '
    + 'some unusual, but valid prefixes -test@example.com '
    + ' and _test@example.com '
    + 'a max length email enclosed in brackets '
    + '(averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com) '
    + 'max length email with ellipsis ending '
    + 'averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com... '
    + 'try a markdown link with a valid max-length email '
    + '[text](sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com.a.aa.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjasfff)'
    + '$--test@gmail.com';
    const result = 'A simple email: <a href="mailto:abc.new@gmail.com">abc.new@gmail.com</a>, '
    + 'or a very short one <a href="mailto:a@example.com">a@example.com</a> '
    + 'hitting the maximum domain length (63 chars) <a href="mailto:test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com">test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com</a> '
    + 'or the maximum address length (64 chars) <a href="mailto:sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@test.com">sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@test.com</a> '
    + 'overall length of 254 <a href="mailto:averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com">averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com</a> '
    + 'domain with many dashes <a href="mailto:sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asj-j-s-sjdjdjdjd-jdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdke.com.ab.net.aa.bb.cc.dd.ee">sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asj-j-s-sjdjdjdjd-jdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdke.com.ab.net.aa.bb.cc.dd.ee</a> '
    + ' how about a domain with repeated labels of 63 chars <a href="mailto:test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.com">test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.com</a> '
    + 'max length email with italics '
    + '<em><a href="mailto:averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com">averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com</a></em> '
    + ' xn-- style domain <a href="mailto:test@xn--diseolatinoamericano-76b.com">test@xn--diseolatinoamericano-76b.com</a> '
    + 'or a more complex case where we need to determine where to apply italics markdown '
    + '<em><a href="mailto:email@test.com">email@test.com</a><br />'
    + '<a href="mailto:_email2@test.com">_email2@test.com</a><br /><br />'
    + '<a href="mailto:email3@test.com">email3@test.com</a></em> '
    + 'some unusual, but valid prefixes <a href="mailto:-test@example.com">-test@example.com</a> '
    + ' and <a href="mailto:_test@example.com">_test@example.com</a> '
    + 'a max length email enclosed in brackets '
    + '(<a href="mailto:averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com">averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com</a>) '
    + 'max length email with ellipsis ending '
    + '<a href="mailto:averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com">averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com</a>... '
    + 'try a markdown link with a valid max-length email '
    + '<a href="mailto:sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com.a.aa.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjasfff">text</a>'
    + '$<a href=\"mailto:--test@gmail.com\">--test@gmail.com</a>';
    expect(parser.replace(testString)).toBe(result);
});

test('Test markdown replacement for invalid emails', () => {
    const testString = 'Replace the valid email part within a string '
    + '.test@example.com '
    + '$test@gmail.com '
    + 'test..new@example.com '
    + 'Some chars that are not allowed within emails '
    + 'test{@example.com '
    + 'domain length over limit test@averylongdomainpartoftheemailthatwillgooverthelimitasitismorethan63chars.com '
    + 'address over limit averylongaddresspartoftheemailthatwillgovoerthelimitasitismorethan64chars@example.com '
    + 'overall length too long '
    + 'sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com.a.aa.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjasfffa '
    + 'invalid domain start/end '
    + 'test@example-.com '
    + 'test@-example-.com '
    + 'test@example.a '
    + '[text](sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com.a.aa.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjasfffa)';
    const result = 'Replace the valid email part within a string '
    + '.<a href="mailto:test@example.com">test@example.com</a> '
    + '$<a href="mailto:test@gmail.com">test@gmail.com</a> '
    + 'test..<a href="mailto:new@example.com">new@example.com</a> '
    + 'Some chars that are not allowed within emails '
    + 'test{@example.com '
    + 'domain length over limit test@averylongdomainpartoftheemailthatwillgooverthelimitasitismorethan63chars.com '
    + 'address over limit averylongaddresspartoftheemailthatwillgovoerthelimitasitismorethan64chars@example.com '
    + 'overall length too long '
    + 'sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com.a.aa.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjasfffa '
    + 'invalid domain start/end '
    + 'test@example-.com '
    + 'test@-example-.com '
    + 'test@example.a '
    + '[text](sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com.a.aa.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjasfffa)';
    expect(parser.replace(testString)).toBe(result);
});

// Markdown style links replaced successfully
test('Test markdown style links', () => {
    let testString = 'Go to [Expensify](https://www.expensify.com) to learn more. [Expensify](www.expensify.com) [Expensify](expensify.com) [It\'s really the coolest](expensify.com) [`Some` Special cases - + . = , \'](expensify.com/some?query=par|am)';
    let resultString = 'Go to <a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> to learn more. <a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> <a href="https://expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> <a href="https://expensify.com" target="_blank" rel="noreferrer noopener">It&#x27;s really the coolest</a> <a href="https://expensify.com/some?query=par|am" target="_blank" rel="noreferrer noopener"><code>Some</code> Special cases - + . = , &#x27;</a>';
    expect(parser.replace(testString)).toBe(resultString);

    testString = 'Go to [Localhost](http://localhost:3000) to learn more. [Expensify](www.expensify.com) [Expensify](expensify.com) [It\'s really the coolest](expensify.com) [`Some` Special cases - + . = , \'](expensify.com/some?query=par|am)';
    resultString = 'Go to <a href="http://localhost:3000" target="_blank" rel="noreferrer noopener">Localhost</a> to learn more. <a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> <a href="https://expensify.com" target="_blank" rel="noreferrer noopener">Expensify</a> <a href="https://expensify.com" target="_blank" rel="noreferrer noopener">It&#x27;s really the coolest</a> <a href="https://expensify.com/some?query=par|am" target="_blank" rel="noreferrer noopener"><code>Some</code> Special cases - + . = , &#x27;</a>';
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
    + '[link with someone@expensify.com email in it](https://google.com)'
    + '[Localhost](http://a:3030)';
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
    + '<a href="https://google.com" target="_blank" rel="noreferrer noopener">link with someone@expensify.com email in it</a>'
    + '<a href="http://a:3030" target="_blank" rel="noreferrer noopener">Localhost</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

// HTML encoded strings unaffected by parser
test('Test HTML encoded strings', () => {
    const rawHTMLTestStartString = '<em>This is</em> a <strong>test</strong>. None of <h1>these strings</h1> should display <del>as</del> <div>HTML</div>.';
    const rawHTMLTestReplacedString = '&lt;em&gt;This is&lt;/em&gt; a &lt;strong&gt;test&lt;/strong&gt;. None of &lt;h1&gt;these strings&lt;/h1&gt; should display &lt;del&gt;as&lt;/del&gt; &lt;div&gt;HTML&lt;/div&gt;.';
    expect(parser.replace(rawHTMLTestStartString)).toBe(rawHTMLTestReplacedString);
});

// New lines characters \n or \r\n were successfully replaced with <br>
test('Test newline markdown replacement', () => {
    let newLineTestStartString = 'This sentence has a newline \n Yep just had one \n Oh there it is another one';
    let newLineReplacedString = 'This sentence has a newline <br /> Yep just had one <br /> Oh there it is another one';
    expect(parser.replace(newLineTestStartString)).toBe(newLineReplacedString);

    newLineTestStartString = 'This sentence has a windows-style newline \r\n Yep just had one \r\n Oh there it is another one';
    newLineReplacedString = 'This sentence has a windows-style newline <br /> Yep just had one <br /> Oh there it is another one';
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

test('Test inline code blocks with two backticks', () => {
    const testString = '``JavaScript``';
    expect(parser.replace(testString)).toBe('<code>&#x60;JavaScript&#x60;</code>');
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

test('Test urls ending with special characters followed by unmatched closing parentheses autolinks correctly', () => {
    const testString = 'https://github.com/Expensify/ReactNativeChat/pull/645.) '
        + 'https://github.com/Expensify/ReactNativeChat/pull/645$) '
        + 'https://github.com/Expensify/ReactNativeChat/pull/645*) '
        + 'https://github.com/Expensify/ReactNativeChat/pull/645+) '
        + 'https://github.com/Expensify/ReactNativeChat/pull/645!) '
        + 'https://github.com/Expensify/ReactNativeChat/pull/645,) '
        + 'https://github.com/Expensify/ReactNativeChat/pull/645=) '
        + 'https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings. '
        + 'https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings.. '
        + 'https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings..) '
        + '[https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings] ';
    const resultString = '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>.) '
        + '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>$) '
        + '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>*) '
        + '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>+) '
        + '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>!) '
        + '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>,) '
        + '<a href="https://github.com/Expensify/ReactNativeChat/pull/645" target="_blank" rel="noreferrer noopener">https://github.com/Expensify/ReactNativeChat/pull/645</a>=) '
        + '<a href="https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings" target=\"_blank\" rel=\"noreferrer noopener\">https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings</a>. '
        + '<a href="https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings" target=\"_blank\" rel=\"noreferrer noopener\">https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings</a>.. '
        + '<a href="https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings" target=\"_blank\" rel=\"noreferrer noopener\">https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings</a>..) '
        + '[<a href=\"https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings\" target=\"_blank\" rel=\"noreferrer noopener\">https://staging.new.expensify.com/get-assistance/WorkspaceGeneralSettings</a>] ';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test urls autolinks correctly', () => {
    const testCases = [
        {
            testString: 'test@expensify.com https://www.expensify.com',
            resultString: '<a href="mailto:test@expensify.com">test@expensify.com</a> <a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com</a>',
        },
        {
            testString: 'test@expensify.com-https://www.expensify.com',
            resultString: '<a href="mailto:test@expensify.com">test@expensify.com</a>-<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com</a>',
        },
        {
            testString: 'test@expensify.com/https://www.expensify.com',
            resultString: '<a href="mailto:test@expensify.com">test@expensify.com</a>/<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com</a>',
        },
        {
            testString: 'test@expensify.com?https://www.expensify.com',
            resultString: '<a href="mailto:test@expensify.com">test@expensify.com</a>?<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com</a>',
        },
        {
            testString: 'test@expensify.com>https://www.expensify.com',
            resultString: '<a href="mailto:test@expensify.com">test@expensify.com</a>&gt;<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com</a>',
        },
        {
            testString: 'https://staging.new.expensify.com/details/test@expensify.com',
            resultString: '<a href="https://staging.new.expensify.com/details/test@expensify.com" target="_blank" rel="noreferrer noopener">https://staging.new.expensify.com/details/test@expensify.com</a>',
        },
        {
            testString: 'staging.new.expensify.com/details',
            resultString: '<a href="https://staging.new.expensify.com/details" target="_blank" rel="noreferrer noopener">staging.new.expensify.com/details</a>',
        },
        {
            testString: 'https://www.expensify.com?name=test&email=test@expensify.com',
            resultString: '<a href="https://www.expensify.com?name=test&amp;email=test@expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com?name=test&amp;email=test@expensify.com</a>',
        },
        {
            testString: 'https://staging.new.expensify.com/details?login=testing@gmail.com',
            resultString: '<a href="https://staging.new.expensify.com/details?login=testing@gmail.com" target="_blank" rel="noreferrer noopener">https://staging.new.expensify.com/details?login=testing@gmail.com</a>',
        },
        {
            testString: 'staging.new.expensify.com/details?login=testing@gmail.com',
            resultString: '<a href="https://staging.new.expensify.com/details?login=testing@gmail.com" target="_blank" rel="noreferrer noopener">staging.new.expensify.com/details?login=testing@gmail.com</a>',
        },
        {
            testString: 'http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled',
            resultString: '<a href="http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled" target="_blank" rel="noreferrer noopener">http://necolas.github.io/react-native-web/docs/?path=/docs/components-pressable--disabled</a>',
        },
        {
            testString: '-https://www.expensify.com /https://www.expensify.com @https://www.expensify.com',
            resultString: '-<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com</a> /<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">https://www.expensify.com</a> @https://www.expensify.com',
        },
        {
            testString: 'expensify.com -expensify.com @expensify.com',
            resultString: '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener">expensify.com</a> -<a href="https://expensify.com" target="_blank" rel="noreferrer noopener">expensify.com</a> @expensify.com',
        },
        {
            testString: 'https//www.expensify.com',
            resultString: 'https//<a href="https://www.expensify.com" target="_blank" rel="noreferrer noopener">www.expensify.com</a>',
        },
        {
            testString: '//www.expensify.com?name=test&email=test@expensify.com',
            resultString: '//<a href="https://www.expensify.com?name=test&amp;email=test@expensify.com" target="_blank" rel="noreferrer noopener">www.expensify.com?name=test&amp;email=test@expensify.com</a>',
        },
        {
            testString: '//staging.new.expensify.com/details?login=testing@gmail.com',
            resultString: '//<a href="https://staging.new.expensify.com/details?login=testing@gmail.com" target="_blank" rel="noreferrer noopener">staging.new.expensify.com/details?login=testing@gmail.com</a>',
        },
        {
            testString: '/details?login=testing@gmail.com',
            resultString: '/details?login=<a href="mailto:testing@gmail.com">testing@gmail.com</a>',
        },
        {
            testString: '?name=test&email=test@expensify.com',
            resultString: '?name=test&amp;email=<a href="mailto:test@expensify.com">test@expensify.com</a>',
        },
        {
            testString: 'example.com/https://www.expensify.com',
            resultString: '<a href="https://example.com/https://www.expensify.com" target="_blank" rel="noreferrer noopener">example.com/https://www.expensify.com</a>',
        },
        {
            testString: 'test@gmail.com staging.new.expensify.com/details?login=testing@gmail.com&redirectUrl=https://google.com',
            resultString: '<a href="mailto:test@gmail.com">test@gmail.com</a> <a href="https://staging.new.expensify.com/details?login=testing@gmail.com&amp;redirectUrl=https://google.com" target="_blank" rel="noreferrer noopener">staging.new.expensify.com/details?login=testing@gmail.com&amp;redirectUrl=https://google.com</a>',
        },
        {
            testString: 'test@gmail.com //staging.new.expensify.com/details?login=testing@gmail.com&redirectUrl=https://google.com',
            resultString: '<a href="mailto:test@gmail.com">test@gmail.com</a> //<a href="https://staging.new.expensify.com/details?login=testing@gmail.com&amp;redirectUrl=https://google.com" target="_blank" rel="noreferrer noopener">staging.new.expensify.com/details?login=testing@gmail.com&amp;redirectUrl=https://google.com</a>',
        },
        {
            testString: 'test@gmail.com-https://staging.new.expensify.com/details?login=testing@gmail.com&redirectUrl=https://google.com',
            resultString: '<a href="mailto:test@gmail.com">test@gmail.com</a>-<a href="https://staging.new.expensify.com/details?login=testing@gmail.com&amp;redirectUrl=https://google.com" target="_blank" rel="noreferrer noopener">https://staging.new.expensify.com/details?login=testing@gmail.com&amp;redirectUrl=https://google.com</a>',
        },
        {
            testString: 'test@gmail.com/https://example.com/google@email.com?email=asd@email.com',
            resultString: '<a href="mailto:test@gmail.com\">test@gmail.com</a>/<a href="https://example.com/google@email.com?email=asd@email.com" target="_blank" rel="noreferrer noopener">https://example.com/google@email.com?email=asd@email.com</a>',
        },
        {
            testString: 'test@gmail.com/test@gmail.com/https://example.com/google@email.com?email=asd@email.com',
            resultString: '<a href="mailto:test@gmail.com">test@gmail.com</a>/<a href="mailto:test@gmail.com">test@gmail.com</a>/<a href="https://example.com/google@email.com?email=asd@email.com" target="_blank" rel="noreferrer noopener">https://example.com/google@email.com?email=asd@email.com</a>',
        },
    ];

    testCases.forEach(testCase => {
        expect(parser.replace(testCase.testString)).toBe(testCase.resultString);
    });
});

test('Test markdown style email link with various styles', () => {
    const testString = 'Go to ~[Expensify](concierge@expensify.com)~ '
        + '_[Expensify](concierge@expensify.com)_ '
        + '*[Expensify](concierge@expensify.com)* '
        + '[Expensify!](no-concierge1@expensify.com) '
        + '[Applause](applausetester+qaabecciv@applause.expensifail.com) '
        + '[](concierge@expensify.com)' // only parse autoEmail in ()
        + '[   ](concierge@expensify.com)' // only parse autoEmail in () and keep spaces in []
        + '[   \n ](concierge@expensify.com)' // only parse autoEmail in () and keep spaces in []
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
        + '<a href="mailto:applausetester+qaabecciv@applause.expensifail.com">Applause</a> '
        + '[](<a href="mailto:concierge@expensify.com">concierge@expensify.com</a>)'
        + '[   ](<a href="mailto:concierge@expensify.com">concierge@expensify.com</a>)'
        + '[   <br /> ](<a href="mailto:concierge@expensify.com">concierge@expensify.com</a>)'
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
        + 'applausetester+qaabecciv@applause.expensifail.com ';

    const resultString = 'Go to <a href="mailto:concierge@expensify.com">concierge@expensify.com</a> '
        + '<a href="mailto:no-concierge@expensify.com">no-concierge@expensify.com</a> '
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

test('Test heading1 markdown replacement when heading appear after the quote', () => {
    const testString = '> quote \n# heading 1 after the quote.\nHere is a multi-line\ncomment that contains *bold* string.';
    expect(parser.replace(testString)).toBe('<blockquote>quote</blockquote><h1>heading 1 after the quote.</h1>Here is a multi-line<br />comment that contains <strong>bold</strong> string.');
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
    const testString = '```@username@expensify.com```';
    const resultString = '<pre>@username@expensify.com</pre>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with inlineCodeBlock style', () => {
    const testString = '`@username@expensify.com`';
    const resultString = '<code>@username@expensify.com</code>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with text with codefence style', () => {
    const testString = '```hi @username@expensify.com```';
    const resultString = '<pre>hi&#32;@username@expensify.com</pre>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for user mention with text with inlineCodeBlock style', () => {
    const testString = '`hi @username@expensify.com`';
    const resultString = '<code>hi @username@expensify.com</code>';
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

test('Test for user mention with user email includes underscores', () => {
    const testString = '@_concierge_@expensify.com';
    const resultString = '<mention-user>@_concierge_@expensify.com</mention-user>';
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

test('Test for @here mention with italic, bold and strikethrough styles', () => {
    const testString = '@here'
    + ' _@here_'
    + ' *@here*'
    + ' ~@here~'
    + ' [@here](google.com)'
    + ' @here_123'
    + ' @here_abc'
    + ' @here123'
    + ' @hereabc'
    + ' @here abc'
    + ' @here*'
    + ' @here~'
    + ' @here#'
    + ' @here@'
    + ' @here$'
    + ' @here^'
    + ' @here(';

    const resultString = '<mention-here>@here</mention-here>'
    + ' <em><mention-here>@here</mention-here></em>'
    + ' <strong><mention-here>@here</mention-here></strong>'
    + ' <del><mention-here>@here</mention-here></del>'
    + ' <a href="https://google.com" target="_blank" rel="noreferrer noopener">@here</a>'
    + ' @here_123'
    + ' @here_abc'
    + ' @here123'
    + ' @hereabc'
    + ' <mention-here>@here</mention-here> abc'
    + ' <mention-here>@here</mention-here>*'
    + ' <mention-here>@here</mention-here>~'
    + ' <mention-here>@here</mention-here>#'
    + ' <mention-here>@here</mention-here>@'
    + ' <mention-here>@here</mention-here>$'
    + ' <mention-here>@here</mention-here>^'
    + ' <mention-here>@here</mention-here>(';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for @here mention without space or supported styling character', () => {
    const testString = 'hi@username@expensify.com';
    const resultString = 'hi@<a href=\"mailto:username@expensify.com\">username@expensify.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for mention inside link and email markdown', () => {
    const testString = '[@username@expensify.com](expensify.com) '
    + '[_@username@expensify.com_](expensify.com) '
    + '[*@username@expensify.com*](expensify.com) '
    + '[~@username@expensify.com~](expensify.com) '
    + '[`@username@expensify.com`](expensify.com) '
    + '[@here](expensify.com) '
    + '[_@here_](expensify.com) '
    + '[*@here*](expensify.com) '
    + '[~@here~](expensify.com) '
    + '[`@here`](expensify.com) '
    + '[@username@expensify.com](username@expensify.com) '
    + '[_@username@expensify.com_](username@expensify.com) '
    + '[*@username@expensify.com*](username@expensify.com) '
    + '[~@username@expensify.com~](username@expensify.com) '
    + '[`@username@expensify.com`](username@expensify.com) '
    + '[@here](username@expensify.com) '
    + '[_@here_](username@expensify.com) '
    + '[*@here*](username@expensify.com) '
    + '[~@here~](username@expensify.com) '
    + '[`@here`](username@expensify.com)';

    const resultString = '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener">@username@expensify.com</a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><em>@username@expensify.com</em></a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><strong>@username@expensify.com</strong></a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><del>@username@expensify.com</del></a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><code>@username@expensify.com</code></a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener">@here</a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><em>@here</em></a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><strong>@here</strong></a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><del>@here</del></a> '
    + '<a href="https://expensify.com" target="_blank" rel="noreferrer noopener"><code>@here</code></a> '
    + '<a href="mailto:username@expensify.com">@username@expensify.com</a> '
    + '<a href="mailto:username@expensify.com"><em>@username@expensify.com</em></a> '
    + '<a href="mailto:username@expensify.com"><strong>@username@expensify.com</strong></a> '
    + '<a href="mailto:username@expensify.com"><del>@username@expensify.com</del></a> '
    + '<a href="mailto:username@expensify.com"><code>@username@expensify.com</code></a> '
    + '<a href="mailto:username@expensify.com">@here</a> '
    + '<a href="mailto:username@expensify.com"><em>@here</em></a> '
    + '<a href="mailto:username@expensify.com"><strong>@here</strong></a> '
    + '<a href="mailto:username@expensify.com"><del>@here</del></a> '
    + '<a href="mailto:username@expensify.com"><code>@here</code></a>';

    expect(parser.replace(testString)).toBe(resultString);
});

test('Skip rendering invalid markdown',() => {
    let testString = '_*test_*';
    expect(parser.replace(testString)).toBe('<em>*test</em>*');

    testString = '*_test*_';
    expect(parser.replace(testString)).toBe('*<em>test*</em>');

    testString = '~*test~*';
    expect(parser.replace(testString)).toBe('~<strong>test~</strong>');

    testString = '> *This is multiline\nbold text*';
    expect(parser.replace(testString)).toBe('<blockquote>*This is multiline</blockquote>bold text*');
});

test('Test for email with test+1@gmail.com@gmail.com', () => {
    const testString = 'test+1@gmail.com@gmail.com';
    const resultString = '<a href=\"mailto:test+1@gmail.com\">test+1@gmail.com</a>@gmail.com';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for email with test@gmail.com@gmail.com', () => {
    const testString = 'test@gmail.com@gmail.com';
    const resultString = '<a href=\"mailto:test@gmail.com\">test@gmail.com</a>@gmail.com';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for email with test@here@gmail.com', () => {
    const testString = 'test@here@gmail.com';
    const resultString = 'test@<a href=\"mailto:here@gmail.com\">here@gmail.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test for email with test+1@here@gmail.com', () => {
    const testString = 'test+1@here@gmail.com';
    const resultString = 'test+1@<a href=\"mailto:here@gmail.com\">here@gmail.com</a>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test user mention with @here@here.com', () => {
    const testString = '@here@here.com';
    const resultString = '<mention-user>@here@here.com</mention-user>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test user mention with @abc_@here.com', () => {
    const testString = '@abc_@here.com';
    const resultString = '<mention-user>@abc_@here.com</mention-user>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test user mention with @here_@here.com', () => {
    const testString = '@here_@here.com';
    const resultString = '<mention-user>@here_@here.com</mention-user>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test here mention with @here_@here_.com', () => {
    const testString = '@here_@here_.com';
    const resultString = '<mention-here>@here</mention-here><em><mention-here>@here</mention-here></em>.com';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test here mention with @here@', () => {
    const testString = '@here@';
    const resultString = '<mention-here>@here</mention-here>@';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test here mention with @here@here', () => {
    const testString = '@here@here';
    const resultString = '<mention-here>@here</mention-here><mention-here>@here</mention-here>';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test link with code fence inside the alias text part', () => {
    const testString = '[```code```](google.com) '
        + '[test ```code``` test](google.com)';

    const resultString = '[<pre>code</pre>](<a href="https://google.com" target="_blank" rel="noreferrer noopener">google.com</a>) '
        + '[test <pre>code</pre> test](<a href="https://google.com" target="_blank" rel="noreferrer noopener">google.com</a>)';
    expect(parser.replace(testString)).toBe(resultString);
});

test('Test strikethrough with multiple tilde characters', () => {
    let testString = '~~~hello~~~';
    expect(parser.replace(testString)).toBe('~~<del>hello</del>~~');

    testString = '~~~~';
    expect(parser.replace(testString)).toBe('~~~~');
});
