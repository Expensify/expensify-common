import _ from 'underscore';

const isAvailable = (() => {
    const test = 'test';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
})();

/**
 * Sets an object to localStorage
 *
 * @param {String} key
 * @param {Object} object
 *
 * @return {Boolean}
 */
function set(key, object) {
    if (!isAvailable) {
        return;
    }

    try {
        localStorage.setItem(key, JSON.stringify(object));
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Check to see if we have data on localStorage
 *
 * @param {String} key
 *
 * @return {Boolean}
 */
function keyExists(key) {
    if (!isAvailable) {
        return;
    }

    return !_.isNull(localStorage.getItem(key));
}

/**
 * Removes key and data returns true if successful.
 *
 * @param {String} key
 *
 * @return {Boolean}
 */
function remove(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (err) {
        return false;
    }
}

/**
 * Gets data from localStorage
 *
 * @param {String} key
 *
 * @return {Object}
 */
function get(key) {
    if (!isAvailable) {
        return {};
    }

    try {
        return JSON.parse(localStorage.getItem(key));
    } catch (err) {
        return {};
    }
}

export default {
    isAvailable,
    set,
    get,
    keyExists,
    remove,
    KEY: {
        REPORT_HISTORY: 'reportHistory',
    }
};
