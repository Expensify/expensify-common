import fs from 'node:fs';
import * as UrlPatterns from '../lib/Url';

const {URL_REGEX_WITH_REQUIRED_PROTOCOL, URL_REGEX, LOOSE_URL_REGEX, MARKDOWN_URL_REGEX} = UrlPatterns;

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
    it('finds separate domains after repeated dots without restarting inside oversized labels', () => {
        // Given domains separated by repeated dots and an oversized hostname containing a valid-looking suffix.
        const input = `wait..google.com example.com...valid.org ${'a'.repeat(64)}.example.com`;
        const regexToTest = new RegExp(URL_REGEX, 'gi');

        // When the URL pattern searches for every domain in the text.
        const matches = [...input.matchAll(regexToTest)].map((match) => match[0]);

        // Then repeated dots separate valid domains while a single dot cannot expose an invalid hostname's suffix.
        expect(matches).toEqual(['google.com', 'example.com', 'valid.org']);
    });

    it.each([
        ['URL_REGEX', URL_REGEX, ''],
        ['LOOSE_URL_REGEX', LOOSE_URL_REGEX, 'https://'],
    ])('%s preserves valid prefixes before long malformed hostname continuations', (_name, pattern, protocol) => {
        // Given valid hostnames followed by malformed punctuation whose text would exceed a DNS length limit.
        const regexToTest = new RegExp(pattern, 'i');
        const validUrl = `${protocol}example.com`;
        const maximumLengthUrl = `${protocol}${'a.'.repeat(125)}com`;
        const inputs = [`${validUrl}..${'a'.repeat(300)}`, `${validUrl}.-${'a'.repeat(63)}`, `${validUrl}-.${'a'.repeat(300)}`, `${maximumLengthUrl}..nonsense`];

        // When URL matching reaches malformed punctuation after the valid hostname.
        const matches = inputs.map((input) => {
            const match = regexToTest.exec(input);
            return match && match[0];
        });

        // Then only the actual hostname counts toward the limits, so each valid prefix still matches.
        expect(matches).toEqual([validUrl, validUrl, validUrl, maximumLengthUrl]);
    });

    it.each([
        ['URL_REGEX', URL_REGEX, ''],
        ['LOOSE_URL_REGEX', LOOSE_URL_REGEX, 'https://'],
    ])('%s rejects oversized hostnames even before malformed continuations', (_name, pattern, protocol) => {
        // Given an oversized hostname containing a known-TLD prefix, followed by malformed punctuation.
        const input = `${protocol}example.com${'.a'.repeat(122)}..nonsense`;
        const regexToTest = new RegExp(pattern, 'i');

        // When URL matching checks the hostname before the malformed continuation.
        const match = regexToTest.exec(input);

        // Then the whole oversized hostname remains rejected rather than matching its earlier valid-looking prefix.
        expect(match).toBeNull();
    });

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

    it.each([
        ['an invalid dot-separated label', `${'a'.repeat(64)}.example.com`],
        ['an invalid hyphenated label after a protocol', `https://${'a'.repeat(64)}-valid.com`],
        ['a leading hyphen attached to another hostname label', 'foo.-valid.com'],
        ['multiple leading hyphens', '--valid.com'],
    ])('does not match a valid hostname suffix inside %s', (_name, invalidUrl) => {
        // Given an invalid hostname that contains a shorter valid-looking domain suffix.
        const regexToTest = new RegExp(MARKDOWN_URL_REGEX, 'i');

        // When the URL pattern searches the complete invalid value.
        const match = regexToTest.exec(invalidUrl);

        // Then it rejects the whole value instead of matching only the valid suffix.
        expect(match).toBeNull();
    });

    it('keeps matching a domain after a standalone boundary hyphen', () => {
        // Given a valid domain preceded by one standalone hyphen used as punctuation.
        const input = '-example.com';
        const regexToTest = new RegExp(MARKDOWN_URL_REGEX, 'i');

        // When the URL pattern searches the complete text.
        const match = regexToTest.exec(input);

        // Then it links the valid domain after the boundary without including the hyphen.
        expect(match && match[0]).toBe('example.com');
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

describe('URL pattern consistency', () => {
    it.each([
        ['a one-character label', 'a', true],
        ['a hyphen inside a label', 'valid-label', true],
        ['a leading hyphen', '-invalid', false],
        ['a trailing hyphen', 'invalid-', false],
        ['an underscore', 'invalid_label', false],
    ])('keeps strict and loose URL patterns aligned for %s', (_name, label, shouldMatch) => {
        // Given the same hostname label used by strict and loose URL patterns.
        const labelRegex = new RegExp(`^${UrlPatterns.URL_HOSTNAME_LABEL_REGEX}$`, 'i');
        const strictUrlRegex = new RegExp(`^${URL_REGEX}$`, 'i');
        const looseUrlRegex = new RegExp(`^${LOOSE_URL_REGEX}$`, 'i');

        // When each URL pattern validates the label.
        const results = [labelRegex.test(label), strictUrlRegex.test(`${label}.com`), looseUrlRegex.test(`https://${label}.local`)];

        // Then every pattern applies the same label syntax and length limits.
        expect(results).toEqual([shouldMatch, shouldMatch, shouldMatch]);
    });

    it('keeps published URL pattern declarations aligned with their runtime values', () => {
        // Given the URL patterns exported at runtime and their published literal declarations.
        const declaration = fs.readFileSync('lib/Url.d.ts', 'utf8');
        const literalPatternNames = [
            'URL_PROTOCOL_REGEX',
            'URL_PORT_REGEX',
            'URL_HOSTNAME_LABEL_REGEX',
            'URL_WEBSITE_REGEX',
            'URL_PATH_REGEX',
            'URL_PARAM_REGEX',
            'URL_FRAGMENT_REGEX',
            'URL_REGEX',
            'LOOSE_URL_WEBSITE_REGEX',
            'LOOSE_URL_REGEX',
            'MARKDOWN_URL_REGEX',
        ];

        // When each runtime value is escaped as the matching TypeScript string literal.
        const staleDeclarations = literalPatternNames.filter((name) => {
            const escapedPattern = UrlPatterns[name].replaceAll('\\', '\\\\').replaceAll("'", "\\'");
            return !declaration.includes(`declare const ${name}: '${escapedPattern}';`);
        });

        // Then Url.d.ts describes the exact patterns exported by Url.js.
        expect(staleDeclarations).toEqual([]);
    });
});
