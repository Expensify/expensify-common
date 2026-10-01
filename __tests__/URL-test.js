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
    });

    describe('Optional protocol for URL', () => {
        it('correctly tests valid urls', () => {
            const regexToTest = new RegExp(`^${URL_REGEX}$`, 'i');
            expect(regexToTest.test('google.com/')).toBeTruthy();
            expect(regexToTest.test('x.com')).toBeTruthy();
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

describe('Hostname label length validation', () => {
    it.each([
        ['URL_REGEX', URL_REGEX, `${'a'.repeat(63)}.com`, `${'a'.repeat(64)}.com`],
        ['URL_REGEX_WITH_REQUIRED_PROTOCOL', URL_REGEX_WITH_REQUIRED_PROTOCOL, `https://${'a'.repeat(63)}.com`, `https://${'a'.repeat(64)}.com`],
        ['LOOSE_URL_REGEX', LOOSE_URL_REGEX, `https://${'a'.repeat(63)}.local`, `https://${'a'.repeat(64)}.local`],
    ])('%s accepts 63-character labels and rejects longer labels', (_name, pattern, validUrl, invalidUrl) => {
        // Given a URL whose hostname label is at the DNS limit and one whose label exceeds it.
        const regexToTest = new RegExp(pattern, 'i');

        // When each complete URL is checked by the corresponding URL pattern.
        const validMatch = regexToTest.exec(validUrl);
        regexToTest.lastIndex = 0;
        const invalidMatch = regexToTest.exec(invalidUrl);

        // Then the valid URL matches fully and the invalid URL cannot be partially matched from inside its hostname label.
        expect(validMatch && validMatch[0]).toBe(validUrl);
        expect(invalidMatch).toBeNull();
    });

    it.each([
        ['URL_REGEX', URL_REGEX, ''],
        ['URL_REGEX_WITH_REQUIRED_PROTOCOL', URL_REGEX_WITH_REQUIRED_PROTOCOL, 'https://'],
        ['LOOSE_URL_REGEX', LOOSE_URL_REGEX, 'https://'],
    ])('%s accepts 253-character hostnames and rejects longer hostnames', (_name, pattern, prefix) => {
        // Given hostnames at and above the DNS length limit, with every individual label remaining valid.
        const validHostname = `${'a.'.repeat(125)}com`;
        const invalidHostname = `aa.${'a.'.repeat(124)}com`;
        const regexToTest = new RegExp(pattern, 'i');

        // When each complete URL is checked by the corresponding URL pattern.
        const validUrl = `${prefix}${validHostname}`;
        const invalidUrl = `${prefix}${invalidHostname}`;
        const validMatch = regexToTest.exec(validUrl);
        regexToTest.lastIndex = 0;
        const invalidMatch = regexToTest.exec(invalidUrl);

        // Then only the URL whose complete hostname is within the limit matches.
        expect(validMatch && validMatch[0]).toBe(validUrl);
        expect(invalidMatch).toBeNull();
    });

    it('does not count a URL path toward the hostname limit', () => {
        // Given a URL with a valid hostname and a path that makes the complete URL longer than 253 characters.
        const url = `https://example.com/${'a'.repeat(1000)}`;
        const regexToTest = new RegExp(`^${URL_REGEX_WITH_REQUIRED_PROTOCOL}$`, 'i');

        // When the complete URL is checked.
        const isValid = regexToTest.test(url);

        // Then it remains valid because only the hostname is subject to the 253-character limit.
        expect(isValid).toBeTruthy();
    });

    it('keeps protocol IPv4 URLs valid', () => {
        // Given an IPv4 URL that is supported by the loose URL pattern.
        const ipv4Url = 'http://127.0.0.1/path';
        const regexToTest = new RegExp(`^${LOOSE_URL_REGEX}$`, 'i');

        // When the URL is checked after applying hostname-label limits.
        const isValid = regexToTest.test(ipv4Url);

        // Then its numeric labels remain valid because none exceeds the new limit.
        expect(isValid).toBeTruthy();
    });
});
