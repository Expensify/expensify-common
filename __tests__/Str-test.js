import * as StrUtils from '../lib/str';

const buildTestURLForType = (type) => `https://chat.expensify.com/chat-attachments/5/w_eadf5d35cfce6a98e2dd3607cf8463b1e46219e4.${type}?authToken=12345`;

describe('Str.isImage', () => {
    it('Correctly identifies all valid image types', () => {
        expect(StrUtils.Str.isImage(buildTestURLForType('gif'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('jpeg'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('jpg'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('bmp'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('png'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('GIF'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('JPEG'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('JPG'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('BMP'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('PNG'))).toBeTruthy();
        expect(StrUtils.Str.isImage(buildTestURLForType('webp'))).toBeTruthy();
    });

    it('Does not confirm these types', () => {
        // Note: These are types that React Native does not support as images so attempt to prevent their addition here
        expect(StrUtils.Str.isImage(buildTestURLForType('tiff'))).toBeFalsy();
        expect(StrUtils.Str.isImage(buildTestURLForType('psd'))).toBeFalsy();
        expect(StrUtils.Str.isImage(buildTestURLForType('pdf'))).toBeFalsy();
    });
});

describe('Str.isVideo', () => {
    it('Correctly identifies all valid video types', () => {
        expect(StrUtils.Str.isVideo(buildTestURLForType('mov'))).toBeTruthy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('mp4'))).toBeTruthy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('webm'))).toBeTruthy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('mkv'))).toBeTruthy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('MOV'))).toBeTruthy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('MP4'))).toBeTruthy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('WEBM'))).toBeTruthy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('MKV'))).toBeTruthy();
    });

    it('Does not confirm these types', () => {
        // Note: These are types that React Native does not support as images so attempt to prevent their addition here
        expect(StrUtils.Str.isVideo(buildTestURLForType('tiff'))).toBeFalsy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('psd'))).toBeFalsy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('pdf'))).toBeFalsy();
        expect(StrUtils.Str.isVideo(buildTestURLForType('jpeg'))).toBeFalsy();
    });
});

describe('Str.isPDF', () => {
    it('Correctly identifies PDF', () => {
        expect(StrUtils.Str.isPDF(buildTestURLForType('pdf'))).toBeTruthy();
        expect(StrUtils.Str.isPDF(buildTestURLForType('PDF'))).toBeTruthy();
    });
});

describe('Str.isValidURL', () => {
    it('Correctly identifies valid urls', () => {
        expect(StrUtils.Str.isValidURL('http://expensify.com')).toBeTruthy();
        expect(StrUtils.Str.isValidURL('https://www.expensify.com/')).toBeTruthy();
        expect(StrUtils.Str.isValidURL('expensify.com ')).toBeFalsy();
        expect(StrUtils.Str.isValidURL(' expensify.com')).toBeFalsy();
        expect(StrUtils.Str.isValidURL('expensify .com')).toBeFalsy();
        expect(StrUtils.Str.isValidURL('test')).toBeFalsy();
    });
});

describe('Str.stripHTML', () => {
    it('Correctly strips HTML/XML tags', () => {
        expect(StrUtils.Str.stripHTML('<strong>hello</strong>')).toBe('hello');
        expect(StrUtils.Str.stripHTML('<img onerror=\'alert("could run arbitrary JS here")\' src=bogus>')).toBe('');
        expect(StrUtils.Str.stripHTML('hello')).toBe('hello');
        expect(StrUtils.Str.stripHTML(0)).toBe('');
    });
});

describe('Str.toBool', () => {
    it('Correctly converts value to boolean, case-insensitive', () => {
        expect(StrUtils.Str.toBool('true')).toBeTruthy();
        expect(StrUtils.Str.toBool('True')).toBeTruthy();
        expect(StrUtils.Str.toBool('hello')).toBeFalsy();
        expect(StrUtils.Str.toBool(5)).toBeTruthy();
        expect(StrUtils.Str.toBool(undefined)).toBeFalsy();
    });
});

describe('Str.isValidMention', () => {
    it('Correctly detects a valid mentions ', () => {
        expect(StrUtils.Str.isValidMention('@username@expensify.com')).toBeTruthy();
        expect(StrUtils.Str.isValidMention('*@username@expensify.com*')).toBeTruthy();
        expect(StrUtils.Str.isValidMention(' @username@expensify.com')).toBeTruthy();
        expect(StrUtils.Str.isValidMention('~@username@expensify.com~')).toBeTruthy();
        expect(StrUtils.Str.isValidMention('_@username@expensify.com_')).toBeTruthy();
        expect(StrUtils.Str.isValidMention('`@username@expensify.com`')).toBeFalsy();
        expect(StrUtils.Str.isValidMention('\'@username@expensify.com\'')).toBeTruthy();
        expect(StrUtils.Str.isValidMention('"@username@expensify.com"')).toBeTruthy();
    });
});

describe('Str.sanitizeURL', () => {
    it('Normalize domain name to lower case and add missing https:// protocol', () => {
        expect(StrUtils.Str.sanitizeURL('https://google.com')).toBe('https://google.com');
        expect(StrUtils.Str.sanitizeURL('google.com')).toBe('https://google.com');
        expect(StrUtils.Str.sanitizeURL('Https://google.com')).toBe('https://google.com');
        expect(StrUtils.Str.sanitizeURL('https://GOOgle.com')).toBe('https://google.com');
        expect(StrUtils.Str.sanitizeURL('FOO.com/blah_BLAH')).toBe('https://foo.com/blah_BLAH');
        expect(StrUtils.Str.sanitizeURL('http://FOO.com/blah_BLAH')).toBe('http://foo.com/blah_BLAH');
        expect(StrUtils.Str.sanitizeURL('HTtp://FOO.com/blah_BLAH')).toBe('http://foo.com/blah_BLAH');
    });
});

describe('Str.isValidEmail', () => {
    it('Correctly identifies valid emails', () => {
        expect(StrUtils.Str.isValidEmail('abc@gmail.com')).toBeTruthy();
        expect(StrUtils.Str.isValidEmail('test@gmail')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('@gmail.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('usernamelongerthan64charactersshouldnotworkaccordingtorfc822whichisusedbyphp@gmail.com')).toBeFalsy();
        
        // Domain length (63 chars in each label)
        expect(StrUtils.Str.isValidEmail('test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com')).toBeTruthy();
        expect(StrUtils.Str.isValidEmail('abc@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890.km')).toBeTruthy();
        expect(StrUtils.Str.isValidEmail('abc@co.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890.km')).toBeTruthy();

        // Address length (64 chars)
        expect(StrUtils.Str.isValidEmail('sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@test.com')).toBeTruthy();

        // Overall length (254 chars)
        expect(StrUtils.Str.isValidEmail('averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com')).toBeTruthy();

        // Domain with lots of dashes
        expect(StrUtils.Str.isValidEmail('sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asj-j-s-sjdjdjdjd-jdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdke.com.ab.net.aa.bb.cc.dd.ee')).toBeTruthy();
        expect(StrUtils.Str.isValidEmail('abc@g---m--ai-l.com')).toBeTruthy();

        // Domain with repeated labels of 63 chars
        expect(StrUtils.Str.isValidEmail('test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.com')).toBeTruthy();

        // TLD >=2 chars
        expect(StrUtils.Str.isValidEmail('abc@gmail.co')).toBeTruthy();
        expect(StrUtils.Str.isValidEmail('a@a.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk')).toBeTruthy();

        // Very short address
        expect(StrUtils.Str.isValidEmail('a@example.com')).toBeTruthy();

        // xn-- style domain name
        expect(StrUtils.Str.isValidEmail('test@xn--diseolatinoamericano-76b.com')).toBeTruthy();

        // Unusual but valid prefixes
        expect(StrUtils.Str.isValidEmail('-test@example.com')).toBeTruthy();
        expect(StrUtils.Str.isValidEmail('_test@example.com')).toBeTruthy();
        expect(StrUtils.Str.isValidEmail('#test@example.com')).toBeTruthy();
        expect(StrUtils.Str.isValidEmail('test.+123@example.com')).toBeTruthy();
        expect(StrUtils.Str.isValidEmail('-test-@example.com')).toBeTruthy();

        // Invalid chars
        expect(StrUtils.Str.isValidEmail('$test@gmail.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('!test@gmail.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('"test"@gmail.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('~abc@gmail.com~')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('abc@gmail.com~')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('test@example_123site.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('test{@example.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('test..new@example.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('test@example-.a.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('test@example......a.com')).toBeFalsy();

        // Invalid period location
        expect(StrUtils.Str.isValidEmail('.test@example.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('.test.new@example.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('test.@example.com')).toBeFalsy();

        // Domain too long (>63 chars in each label)
        expect(StrUtils.Str.isValidEmail('test@averylongdomainpartoftheemailthatwillgooverthelimitasitismorethan63chars.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('abc@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890a.km')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('abc@co.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890a.km')).toBeFalsy();

        // Address too long (>64 chars)
        expect(StrUtils.Str.isValidEmail('averylongaddresspartoftheemailthatwillgovoerthelimitasitismorethan64chars@example.com')).toBeFalsy();

        // Overall length too long
        expect(StrUtils.Str.isValidEmail('sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com.a.aa.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjasfffa')).toBeFalsy();

        // Incorrect domains start/end
        expect(StrUtils.Str.isValidEmail('test@example-.com')).toBeFalsy();
        expect(StrUtils.Str.isValidEmail('test@-example-.com')).toBeFalsy();

        // TLD too short
        expect(StrUtils.Str.isValidEmail('test@example.a')).toBeFalsy();

        // TLD too long
        expect(StrUtils.Str.isValidEmail('a@a.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl')).toBeFalsy();
    });
});
