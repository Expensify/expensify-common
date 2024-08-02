'worklet';

/** Checks if the `window` global object is available. */
function isWindowAvailable(): boolean {
    return typeof window !== 'undefined';
}

/** Checks if the `navigator` global object is available. */
function isNavigatorAvailable(): boolean {
    return typeof navigator !== 'undefined';
}

const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;',
};
const reUnescapedHtml = /[&<>"'`]/g;
const reHasUnescapedHtml = RegExp(reUnescapedHtml.source);

/**
 * Converts the characters "&", "<", ">", '"', and "'" in `string` to their
 * corresponding HTML entities.
 * Source: https://github.com/lodash/lodash/blob/main/src/escape.ts
 */
function escapeText(string: string): string {
    return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, (chr) => htmlEscapes[chr as keyof typeof htmlEscapes]) : string || '';
}

const htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`',
    '&#32;': ' ',
};

const reEscapedHtml = /&(?:amp|lt|gt|quot|#(x27|x60|32));/g;
const reHasEscapedHtml = RegExp(reEscapedHtml.source);

/**
 * The inverse of `escape`this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;` and `&#39;` in `string` to
 * their corresponding characters.
 * Source: https://github.com/lodash/lodash/blob/main/src/unescape.ts
 * */
function unescapeText(string: string): string {
    return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, (entity) => htmlUnescapes[entity as keyof typeof htmlUnescapes] || "'") : string || '';
}

/**
 * Checks if the given variable is a function
 * @param {*} variableToCheck
 * @returns {boolean}
 */
function isFunction(variableToCheck: unknown): boolean {
    return variableToCheck instanceof Function;
}

/**
 * Checks if the given variable is an object
 * @param {*} obj
 * @returns {boolean}
 */
function isObject(obj: unknown): boolean {
    const type = typeof obj;
    return type === 'function' || (!!obj && type === 'object');
}

export {isWindowAvailable, isNavigatorAvailable, escapeText, unescapeText, isFunction, isObject};
