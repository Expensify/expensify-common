import fastMerge from '../lib/fastMerge';

const testObject = {
    a: 'a',
    b: {
        c: 'c',
        d: {
            e: 'e',
            f: 'f',
        },
        g: 'g',
    },
};

const testObjectWithNullishValues = {
    a: undefined,
    b: {
        c: {
            h: 'h',
        },
        d: {
            e: null,
        },
    },
};

describe('fastMerge', () => {
    it('should merge an object with another object and remove nested null values', () => {
        const result = fastMerge(testObject, testObjectWithNullishValues);

        expect(result).toEqual({
            a: 'a',
            b: {
                c: {
                    h: 'h',
                },
                d: {
                    f: 'f',
                },
                g: 'g',
            },
        });
    });

    it('should merge an object with another object and not remove nested null values', () => {
        const result = fastMerge(testObject, testObjectWithNullishValues, false);

        expect(result).toEqual({
            a: 'a',
            b: {
                c: {
                    h: 'h',
                },
                d: {
                    e: null,
                    f: 'f',
                },
                g: 'g',
            },
        });
    });

    it('should replace an object with an array', () => {
        const result = fastMerge(testObject, [1, 2, 3]);

        expect(result).toEqual([1, 2, 3]);
    });

    it('should replace an array with an object', () => {
        const result = fastMerge([1, 2, 3], testObject);

        expect(result).toEqual(testObject);
    });

    it.each([true, false])('should ignore __proto__ keys from both objects, with null removal %s', (removeNulls) => {
        const target = JSON.parse('{"__proto__":{"fromTarget":true},"name":"a","nested":{"__proto__":{"fromTarget":true},"y":2}}');
        const source = JSON.parse('{"__proto__":{"isAdmin":true},"role":"user","nested":{"__proto__":{"isAdmin":true},"x":1}}');
        const result = fastMerge(target, source, removeNulls);

        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        expect(Object.getPrototypeOf(result.nested)).toBe(Object.prototype);
        expect(result.isAdmin).toBeUndefined();
        expect(result.fromTarget).toBeUndefined();
        expect(result.nested.isAdmin).toBeUndefined();
        expect(result.nested.fromTarget).toBeUndefined();
        expect(result).toEqual({name: 'a', role: 'user', nested: {x: 1, y: 2}});
        expect({}.isAdmin).toBeUndefined();
    });

    it.each([
        [JSON.parse('{"__proto__":{"injected":true}}'), {}],
        [{}, JSON.parse('{"__proto__":{"injected":true}}')],
        [null, JSON.parse('{"__proto__":{"injected":true}}')],
    ])('should ignore __proto__ on either side of a merge', (target, source) => {
        const result = fastMerge(target, source);

        expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
        expect(result.injected).toBeUndefined();
        expect(Object.prototype.hasOwnProperty.call(result, '__proto__')).toBe(false);
    });

    it('should preserve constructor and prototype keys as own data properties', () => {
        const result = fastMerge({a: 1}, JSON.parse('{"constructor":{"prototype":{"value":true}},"prototype":"p"}'));

        expect(Object.prototype.hasOwnProperty.call(result, 'constructor')).toBe(true);
        expect(result.constructor).toEqual({prototype: {value: true}});
        expect(result.prototype).toBe('p');
        expect({}.value).toBeUndefined();
    });
});
