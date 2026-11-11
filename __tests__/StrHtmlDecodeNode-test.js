/** @jest-environment node */
import Str from '../lib/str';

describe('Str.htmlDecodeWithJQueryOrNative without a DOM', () => {
    it('decodes entities and leaves markup as text', () => {
        expect(Str.htmlDecodeWithJQueryOrNative('Tom &amp; Jerry <img src=x>')).toBe('Tom & Jerry <img src=x>');
    });
});
