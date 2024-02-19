import {URL_REGEX_WITH_REQUIRED_PROTOCOL, URL_REGEX, LOOSE_URL_REGEX} from '../lib/Url';

describe('Strict URL validation', () => {
    describe('Mandatory protocol for URL', () => {
        it('correctly tests valid urls', () => {
            const regexToTest = new RegExp(`^${URL_REGEX_WITH_REQUIRED_PROTOCOL}$`, 'i');
            expect(regexToTest.test('https://google.com/')).toBeTruthy();
            expect(regexToTest.test('http://google.com/')).toBeTruthy();
            expect(regexToTest.test('ftp://google.com/')).toBeTruthy();
            expect(regexToTest.test('https://we.are.expensify.com/how-we-got-here')).toBeTruthy();
            expect(regexToTest.test('https://google.com:12')).toBeTruthy();
            expect(regexToTest.test('https://google.com:65535')).toBeTruthy();
            expect(regexToTest.test('https://google.com:65535/path/my')).toBeTruthy();
        });
        it('correctly tests invalid urls', () => {
            const regexToTest = new RegExp(`^${URL_REGEX_WITH_REQUIRED_PROTOCOL}$`, 'i');
            expect(regexToTest.test('google.com')).toBeFalsy();
            expect(regexToTest.test('https://google.com:02')).toBeFalsy();
            expect(regexToTest.test('https://google.com:65536')).toBeFalsy();
            expect(regexToTest.test('smtp://google.com')).toBeFalsy();
        });

        it('should not match urls inside tags', () => {
            const regexToTest = new RegExp(`^${URL_REGEX_WITH_REQUIRED_PROTOCOL}$`, 'i');
            expect(regexToTest.test('<code>http://google.com/</code>')).toBeFalsy();
            expect(regexToTest.test('<pre>http://google.com/</pre>')).toBeFalsy();
        });
    });

    describe('Optional protocol for URL', () => {
        it('correctly tests valid urls', () => {
            const regexToTest = new RegExp(`^${URL_REGEX}$`, 'i');
            expect(regexToTest.test('google.com/')).toBeTruthy();
            expect(regexToTest.test('https://google.com/')).toBeTruthy();
            expect(regexToTest.test('ftp://google.com/')).toBeTruthy();
            expect(regexToTest.test('we.are.expensify.com/how-we-got-here')).toBeTruthy();
            expect(regexToTest.test('google.com:12')).toBeTruthy();
            expect(regexToTest.test('google.com:65535')).toBeTruthy();
            expect(regexToTest.test('google.com:65535/path/my')).toBeTruthy();
        });
        it('correctly tests invalid urls', () => {
            const regexToTest = new RegExp(`^${URL_REGEX}$`, 'i');
            expect(regexToTest.test('google.com:02')).toBeFalsy();
            expect(regexToTest.test('google.com:65536')).toBeFalsy();
        });
    });
});

describe('Loose URL validation', () => {
    it('correctly tests urls that can be valid on local machine', () => {
        const regexToTest = new RegExp(`^${LOOSE_URL_REGEX}$`, 'i');
        expect(regexToTest.test('http://localhost:3000')).toBeTruthy();
        expect(regexToTest.test('https://local.url')).toBeTruthy();
        expect(regexToTest.test('http://a.b')).toBeTruthy();
        expect(regexToTest.test('http://expensify')).toBeTruthy();
        expect(regexToTest.test('http://google.com/abcd')).toBeTruthy();
        expect(regexToTest.test('http://my.localhost.local-domain')).toBeTruthy();
    });

    it('correctly tests invalid urls', () => {
        const regexToTest = new RegExp(`^${LOOSE_URL_REGEX}$`, 'i');
        expect(regexToTest.test('localhost:3000')).toBeFalsy();
        expect(regexToTest.test('local.url')).toBeFalsy();
        expect(regexToTest.test('https://otherexample.com links get rendered first')).toBeFalsy();
        expect(regexToTest.test('http://-localhost')).toBeFalsy();
        expect(regexToTest.test('http://_')).toBeFalsy();
        expect(regexToTest.test('http://_localhost')).toBeFalsy();
        expect(regexToTest.test('http://-77.com')).toBeFalsy();
        expect(regexToTest.test('http://77-.com')).toBeFalsy();
        expect(regexToTest.test('http://my.localhost....local-domain:8080')).toBeFalsy();
    });
});
