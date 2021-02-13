import $ from 'jquery';
import _ from 'underscore';

/**
 * Invokes the given callback with the given arguments
 *
 * @param {Function} callback
 * @param {Array} [args]
 * @param {Object} [scope]
 *
 * @returns {Mixed}
 */
function invoke(callback, args, scope) {
    if (!_(callback).isFunction()) {
        return null;
    }

    return callback.apply(scope, args || []);
}

/**
 * This is nearly the same as invoke, except that it assumes that the callback returns a promise. The callback doesn't
 * HAVE to return a promise, but it CAN, and if it doesn't, then we provide a promise
 *
 * @param {Function} callback
 * @param {Array} [args]
 * @param {Object} [scope]
 *
 * @returns {$.Deferred}
 */
function invokeAsync(callback, args, scope) {
    if (!_(callback).isFunction()) {
        return new $.Deferred().resolve();
    }

    let promiseFromCallback = callback.apply(scope, args || []);

    // If there was not a promise returned from the prefetch callback, then create a dummy promise and resolve it
    if (!promiseFromCallback) {
        promiseFromCallback = new $.Deferred().resolve();
    }

    return promiseFromCallback;
}

/**
 * Invokes all the given callbacks with the given arguments
 *
 * @param {Function[]} callbacks
 * @param {Array} [args]
 */
function bulkInvoke(callbacks, args) {
    callbacks.forEach(callback => invoke(callback, args));
}

/**
 * Throws an uncaught error in an attempt to stop JS execution
 */
function die() {
    throw new Error('Aborting JavaScript execution');
}

/**
 * Call the method on a list of objects
 *
 * @param {object|array} list
 * @param {string} methodName
 * @returns {Array}
 */
function mapByName(list, methodName) {
    return _.map(list, item => item[methodName].call(item));
}

export {
    invoke,
    invokeAsync,
    bulkInvoke,
    die,
    mapByName,
};
