import BrowserDetect from './BrowserDetect';

const CONST = {
    /**
     * Cookie storing the the name of the page we visited the last time
     */
    NAME_LAST_PAGE: 'lastPage',

    /**
     * Cookie storing the name of the reports page we visited the last time (e.g. reports, inbox)
     */
    NAME_LAST_REPORTS_PAGE: 'lastReportsPage',

    /**
     * Cookie storing a user's restricted-access support token
     */
    NAME_STASHED_SUPPORT: '_stashedSupportLogin',

    /**
     * Cookie set by expensify web that's used to identify a request as coming from web.
     */
    NAME_WEB_COOKIE: 'expensifyWeb',

    /**
     * Cookie storing the mode the user wants to use when viewing the expenses page.
     */
    NAME_EXPENSES_VIEW_MODE: 'expensesPageViewMode',

    /**
     * Cookie set that denotes a mobile request
     */
    MOBILE_APP_VERSION: 'appversion',

    /**
     * Two-Factor Auth device token
     */
    TWO_FACTOR_DEVICE_TOKEN: 'stashedTwoFactorLogin',
};

/**
 * Deletes a cookie.
 *
 * @param {String} name The name of the cookie to delete.
 */
function remove(name) {
    const date = new Date();
    document.cookie = `${name}=; expires=${date.toUTCString()}`;
}

/**
 * Sets the value of a cookie and when it will expire.
 *
 * @param {String} name The name of the cookie.
 * @param {String} value The value of the cookie.
 * @param {Number} [expiredays] The number of days until the cookie expires.
 */
function set(name, value, expiredays) {
    // Get expiry date, set
    const exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = `${name}=${encodeURIComponent(value)}${expiredays === null ? '' : `;expires=${exdate.toUTCString()}`}`;
}

/**
 * Detects if cookies are currently enabled in the browser
 * by trying to create a cookie, see if it exists, and delete it afterwards again.
 *
 * @return {Boolean} True if cookies are enabled, otherwise false.
 */
function enabled() {
    // Check they have cookies enabled
    const cookieName = `cookieTest_${Math.floor(Math.random() * 1000)}`;
    const cookieValue = 'enabled';
    set(cookieName, cookieValue, 1);
    const result = Boolean(document.cookie.indexOf(cookieName) >= 0) || false;
    if (result) {
        remove(cookieName);
    }
    return result;
}

/**
 * Fetches the value of a cookie.
 *
 * @param  {String} name The name of the cookie to fetch.
 * @return {String|null} The value of the cookie.
 */
function get(name) {
    if (!name || document.cookie.length <= 0) {
        return null;
    }
    let start;
    let end;
    start = document.cookie.indexOf(`${name}=`);
    if (start !== -1) {
        start = start + name.length + 1;
        end = document.cookie.indexOf(';', start);
        if (end === -1) {
            end = document.cookie.length;
        }
        return decodeURIComponent(document.cookie.substring(start, end));
    }
    return null;
}

/**
 * Parses a cookie value to JSON.
 * Returns a default value specified by param or null.
 *
 * @param {String} name
 * @param {Any|null} defaultValue
 *
 * @return {Any|null}
 */
function getJSON(name, defaultValue = null) {
    let data;

    try {
        data = JSON.parse(get(name));
    } catch (err) {
        data = defaultValue;
    }

    return data;
}

/**
 * Find a cookie that has been set.
 *
 * @param {String} name Name of the cookie to find
 * @return {Boolean} Whether or not the cookie is set
 */
function has(name) {
    return get(name) !== null;
}

/**
 * Returns help link when cookies are enabled or null.
 *
 * @return {(String|null)}
 */
function getHelpLink() {
    if (enabled()) {
        return null;
    }

    let helpLink = 'http://www.google.com/search?q=enable+cookies';

    // Set up help link according to browser
    if (BrowserDetect.browser === BrowserDetect.BROWSERS.EXPLORER) {
        helpLink = 'https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies';
    } else if (BrowserDetect.browser === BrowserDetect.BROWSERS.SAFARI) {
        helpLink = 'https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac';
    } else if (BrowserDetect.browser === BrowserDetect.BROWSERS.MOZILLA) {
        helpLink = 'http://support.mozilla.com/en-US/kb/Enabling%20and%20disabling%20cookies';
    } else if (BrowserDetect.browser === BrowserDetect.BROWSERS.OPERA) {
        helpLink = 'http://www.opera.com/help/tutorials/security/privacy/';
    } else if (BrowserDetect.browser === BrowserDetect.BROWSERS.CHROME) {
        helpLink = 'http://www.google.com/support/chrome/bin/answer.py?answer=95647';
    } else if (BrowserDetect.browser === BrowserDetect.BROWSERS.EDGE) {
        helpLink = 'https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy';
    }
    return helpLink;
}

export default {
    enabled,
    remove,
    get,
    getJSON,
    has,
    getHelpLink,
    set,
    ...CONST,
};
