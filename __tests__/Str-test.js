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

describe('Str.isValidEmailMarkdown', () => {
    it('Correctly identifies valid mark down emails', () => {
        expect(Str.isValidEmailMarkdown('abc@gmail.com')).toBeTruthy();
        expect(Str.isValidEmailMarkdown('$test@gmail.com')).toBeTruthy();
        expect(Str.isValidEmailMarkdown('~abc@gmail.com~')).toBeFalsy();
        expect(Str.isValidEmailMarkdown('abc@gmail.com~')).toBeFalsy();
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
    it('Correctly detects a valid email', () => {
        expect(Str.isValidEmail('abc@gmail.com')).toBeTruthy();
        expect(Str.isValidEmail('test@gmail')).toBeFalsy();
        expect(Str.isValidEmail('usernamelongerthan64charactersshouldnotworkaccordingtorfc822whichisusedbyphp@gmail.com')).toBeFalsy();
    });
});
