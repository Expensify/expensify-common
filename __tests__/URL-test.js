import {URL_REGEX_WITH_REQUIRED_PROTOCOL, URL_REGEX} from '../lib/Url';

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
