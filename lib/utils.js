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
 * @param {string} string - The input string to escape.
 * @returns {string} - The escaped string.
 */
function escape(string) {
    return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, (chr) => htmlEscapes[chr]) : string || '';
}

const htmlUnescapes = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#x27;': "'",
    '&#x60;': '`',
    '&#32': ' ',
};

const reEscapedHtml = /&(?:amp|lt|gt|quot|#(x27|x60|32));/g;
const reHasEscapedHtml = RegExp(reEscapedHtml.source);

/**
 * The inverse of `escape`this method converts the HTML entities
 * `&amp;`, `&lt;`, `&gt;`, `&quot;` and `&#39;` in `string` to
 * their corresponding characters.
 * @param {string} string - The input string to unescape.
 * @returns {string} - The unescaped string.
 * */
function unescape(string) {
    return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, (entity) => htmlUnescapes[entity] || "'") : string || '';
}
function once(fn) {
    let hasBeenCalled = false;
    let result;

    return (...args) => {
        if (!hasBeenCalled) {
            hasBeenCalled = true;
            result = fn(...args);
        }
        return result;
    };
}

function has(obj, key) {
    return obj != null && Object.prototype.hasOwnProperty.call(obj, key);
}

function isFunction(variableToCheck) {
    return variableToCheck instanceof Function;
}

function isObject(obj) {
    const type = typeof obj;
    return type === 'function' || (!!obj && type === 'object');
}

export {escape, unescape, once, has, isFunction, isObject};
