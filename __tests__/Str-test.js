import Str from '../lib/str';

const buildTestURLForType = (type) => `https://chat.expensify.com/chat-attachments/5/w_eadf5d35cfce6a98e2dd3607cf8463b1e46219e4.${type}?authToken=12345`;

describe('Str.isImage', () => {
    it('Correctly identifies all valid image types', () => {
        expect(Str.isImage(buildTestURLForType('gif'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('jpeg'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('jpg'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('bmp'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('png'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('GIF'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('JPEG'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('JPG'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('BMP'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('PNG'))).toBeTruthy();
        expect(Str.isImage(buildTestURLForType('webp'))).toBeTruthy();
    });

    it('Does not confirm these types', () => {
        // Note: These are types that React Native does not support as images so attempt to prevent their addition here
        expect(Str.isImage(buildTestURLForType('tiff'))).toBeFalsy();
        expect(Str.isImage(buildTestURLForType('psd'))).toBeFalsy();
        expect(Str.isImage(buildTestURLForType('pdf'))).toBeFalsy();
    });
});

describe('Str.isVideo', () => {
    it('Correctly identifies all valid video types', () => {
        expect(Str.isVideo(buildTestURLForType('mov'))).toBeTruthy();
        expect(Str.isVideo(buildTestURLForType('mp4'))).toBeTruthy();
        expect(Str.isVideo(buildTestURLForType('webm'))).toBeTruthy();
        expect(Str.isVideo(buildTestURLForType('mkv'))).toBeTruthy();
        expect(Str.isVideo(buildTestURLForType('MOV'))).toBeTruthy();
        expect(Str.isVideo(buildTestURLForType('MP4'))).toBeTruthy();
        expect(Str.isVideo(buildTestURLForType('WEBM'))).toBeTruthy();
        expect(Str.isVideo(buildTestURLForType('MKV'))).toBeTruthy();
    });

    it('Does not confirm these types', () => {
        // Note: These are types that React Native does not support as images so attempt to prevent their addition here
        expect(Str.isVideo(buildTestURLForType('tiff'))).toBeFalsy();
        expect(Str.isVideo(buildTestURLForType('psd'))).toBeFalsy();
        expect(Str.isVideo(buildTestURLForType('pdf'))).toBeFalsy();
        expect(Str.isVideo(buildTestURLForType('jpeg'))).toBeFalsy();
    });
});

describe('Str.isPDF', () => {
    it('Correctly identifies PDF', () => {
        expect(Str.isPDF(buildTestURLForType('pdf'))).toBeTruthy();
        expect(Str.isPDF(buildTestURLForType('PDF'))).toBeTruthy();
    });
});

describe('Str.isValidURL', () => {
    it('Correctly identifies valid urls', () => {
        expect(Str.isValidURL('http://expensify.com')).toBeTruthy();
        expect(Str.isValidURL('https://www.expensify.com/')).toBeTruthy();
        expect(Str.isValidURL('expensify.com ')).toBeFalsy();
        expect(Str.isValidURL(' expensify.com')).toBeFalsy();
        expect(Str.isValidURL('expensify .com')).toBeFalsy();
        expect(Str.isValidURL('test')).toBeFalsy();
    });
});

describe('Str.stripHTML', () => {
    it('Correctly strips HTML/XML tags', () => {
        expect(Str.stripHTML('<strong>hello</strong>')).toBe('hello');
        expect(Str.stripHTML('<img onerror=\'alert("could run arbitrary JS here")\' src=bogus>')).toBe('');
        expect(Str.stripHTML('hello')).toBe('hello');
        expect(Str.stripHTML(0)).toBe('');
    });
});

describe('Str.toBool', () => {
    it('Correctly converts value to boolean, case-insensitive', () => {
        expect(Str.toBool('true')).toBeTruthy();
        expect(Str.toBool('True')).toBeTruthy();
        expect(Str.toBool('hello')).toBeFalsy();
        expect(Str.toBool(5)).toBeTruthy();
        expect(Str.toBool(undefined)).toBeFalsy();
    });
});

describe('Str.isValidMention', () => {
    it('Correctly detects a valid mentions ', () => {
        expect(Str.isValidMention('@username@expensify.com')).toBeTruthy();
        expect(Str.isValidMention('*@username@expensify.com*')).toBeTruthy();
        expect(Str.isValidMention(' @username@expensify.com')).toBeTruthy();
        expect(Str.isValidMention('~@username@expensify.com~')).toBeTruthy();
        expect(Str.isValidMention('_@username@expensify.com_')).toBeTruthy();
        expect(Str.isValidMention('`@username@expensify.com`')).toBeFalsy();
        expect(Str.isValidMention('\'@username@expensify.com\'')).toBeTruthy();
        expect(Str.isValidMention('"@username@expensify.com"')).toBeTruthy();
    });
});

describe('Str.sanitizeURL', () => {
    it('Normalize domain name to lower case and add missing https:// protocol', () => {
        expect(Str.sanitizeURL('https://google.com')).toBe('https://google.com');
        expect(Str.sanitizeURL('google.com')).toBe('https://google.com');
        expect(Str.sanitizeURL('Https://google.com')).toBe('https://google.com');
        expect(Str.sanitizeURL('https://GOOgle.com')).toBe('https://google.com');
        expect(Str.sanitizeURL('FOO.com/blah_BLAH')).toBe('https://foo.com/blah_BLAH');
        expect(Str.sanitizeURL('http://FOO.com/blah_BLAH')).toBe('http://foo.com/blah_BLAH');
        expect(Str.sanitizeURL('HTtp://FOO.com/blah_BLAH')).toBe('http://foo.com/blah_BLAH');
    });
});

describe('Str.isValidEmail', () => {
    it('Correctly identifies valid emails', () => {
        expect(Str.isValidEmail('abc@gmail.com')).toBeTruthy();
        expect(Str.isValidEmail('test@gmail')).toBeFalsy();
        expect(Str.isValidEmail('@gmail.com')).toBeFalsy();
        expect(Str.isValidEmail('usernamelongerthan64charactersshouldnotworkaccordingtorfc822whichisusedbyphp@gmail.com')).toBeFalsy();
        
        // Domain length (63 chars in each label)
        expect(Str.isValidEmail('test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com')).toBeTruthy();
        expect(Str.isValidEmail('abc@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890.km')).toBeTruthy();
        expect(Str.isValidEmail('abc@co.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890.km')).toBeTruthy();

        // Address length (64 chars)
        expect(Str.isValidEmail('sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@test.com')).toBeTruthy();

        // Overall length (254 chars)
        expect(Str.isValidEmail('averylongaddresspartthatalmostwillreachthelimitofcharsperaddress@nowwejustneedaverylongdomainpartthatwill.reachthetotallengthlimitforthewholeemailaddress.whichis254charsaccordingtothePHPvalidate-email-filter.extendingthetestlongeruntilwereachtheright.com')).toBeTruthy();

        // Domain with lots of dashes
        expect(Str.isValidEmail('sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asj-j-s-sjdjdjdjd-jdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdke.com.ab.net.aa.bb.cc.dd.ee')).toBeTruthy();
        expect(Str.isValidEmail('abc@g---m--ai-l.com')).toBeTruthy();

        // Domain with repeated labels of 63 chars
        expect(Str.isValidEmail('test@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekasgasgasgasgashfnfn.com')).toBeTruthy();

        // TLD >=2 chars
        expect(Str.isValidEmail('abc@gmail.co')).toBeTruthy();
        expect(Str.isValidEmail('a@a.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijk')).toBeTruthy();

        // Very short address
        expect(Str.isValidEmail('a@example.com')).toBeTruthy();

        // xn-- style domain name
        expect(Str.isValidEmail('test@xn--diseolatinoamericano-76b.com')).toBeTruthy();

        // Unusual but valid prefixes
        expect(Str.isValidEmail('-test@example.com')).toBeTruthy();
        expect(Str.isValidEmail('_test@example.com')).toBeTruthy();
        expect(Str.isValidEmail('#test@example.com')).toBeTruthy();
        expect(Str.isValidEmail('test.+123@example.com')).toBeTruthy();
        expect(Str.isValidEmail('-test-@example.com')).toBeTruthy();

        // Invalid chars
        expect(Str.isValidEmail('$test@gmail.com')).toBeFalsy();
        expect(Str.isValidEmail('!test@gmail.com')).toBeFalsy();
        expect(Str.isValidEmail('"test"@gmail.com')).toBeFalsy();
        expect(Str.isValidEmail('~abc@gmail.com~')).toBeFalsy();
        expect(Str.isValidEmail('abc@gmail.com~')).toBeFalsy();
        expect(Str.isValidEmail('test@example_123site.com')).toBeFalsy();
        expect(Str.isValidEmail('test{@example.com')).toBeFalsy();
        expect(Str.isValidEmail('test..new@example.com')).toBeFalsy();
        expect(Str.isValidEmail('test@example-.a.com')).toBeFalsy();
        expect(Str.isValidEmail('test@example......a.com')).toBeFalsy();

        // Invalid period location
        expect(Str.isValidEmail('.test@example.com')).toBeFalsy();
        expect(Str.isValidEmail('.test.new@example.com')).toBeFalsy();
        expect(Str.isValidEmail('test.@example.com')).toBeFalsy();

        // Domain too long (>63 chars in each label)
        expect(Str.isValidEmail('test@averylongdomainpartoftheemailthatwillgooverthelimitasitismorethan63chars.com')).toBeFalsy();
        expect(Str.isValidEmail('abc@abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890a.km')).toBeFalsy();
        expect(Str.isValidEmail('abc@co.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890a.km')).toBeFalsy();

        // Address too long (>64 chars)
        expect(Str.isValidEmail('averylongaddresspartoftheemailthatwillgovoerthelimitasitismorethan64chars@example.com')).toBeFalsy();

        // Overall length too long
        expect(Str.isValidEmail('sjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcjab@asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.com.a.aa.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjdkekejdcjdkeekcj.asjjssjdjdjdjdjdjjeiwiwiwowkdjdjdieikdjfidekjcjasfffa')).toBeFalsy();

        // Incorrect domains start/end
        expect(Str.isValidEmail('test@example-.com')).toBeFalsy();
        expect(Str.isValidEmail('test@-example-.com')).toBeFalsy();

        // TLD too short
        expect(Str.isValidEmail('test@example.a')).toBeFalsy();

        // TLD too long
        expect(Str.isValidEmail('a@a.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijkl')).toBeFalsy();
    });
});

describe('Str.isValidPhone', () => {
    it('Correctly identifies valid phone numbers', () => {
        // Significant part of phone
        expect(Str.isValidPhone('4404589784')).toBeTruthy();
        // International standard
        expect(Str.isValidPhone('+1 440-458-9784')).toBeTruthy();
        // E.164 standard
        expect(Str.isValidPhone('+14404589784')).toBeTruthy();
        // US national standard
        expect(Str.isValidPhone('(440) 458-9784')).toBeTruthy();
        expect(Str.isValidPhone('123.456.7890')).toBeTruthy();
    });
});

describe('Str.isValidE164Phone', () => {
    it('Correctly identifies valid E.164 phone numbers', () => {
        expect(Str.isValidE164Phone('+14404589784')).toBeTruthy();
    });
});