import _ from 'underscore';
import API from './API';
import Network from './Network';

const TEMP_LOG_LINES_TO_KEEP = 50;

// An array of log lines that limits itself to a certain number of entries (deleting the oldest)
const logLines = [];

/**
 * Add a message to the list
 * @param {String} message
 * @param {object|String} parameters The parameters associated with the message
 */
const add = (message, parameters) => {
    const length = logLines.push({
        message,
        parameters,
        timestamp: (new Date())
    });

    // If we're over the limit, remove one line.
    if (length > TEMP_LOG_LINES_TO_KEEP) {
        logLines.shift();
    }
};

/**
 * Get the last messageCount lines
 * @param {Number} messageCount Number of messages to get (optional,
 *              defaults to 1)
 * @return {array} an array of messages (oldest first)
 */
const get = (messageCount) => {
    // Default to 1
    let mc = _.isUndefined(messageCount) ? 1 : messageCount;

    // Don't get more than we have
    mc = Math.min(TEMP_LOG_LINES_TO_KEEP, mc);
    return logLines.slice(logLines.length - mc);
};

const Log = {
    /**
    * Ask the server to write the log message
    *
    * @param {String} message The message to write
    * @param {Number} recentMessages A number of recent messages to append as context
    * @param {object|String} parameters The parameters to send along with the message
    * @param {object} requestParameters The parameters to send along with the request
    */
    logToServer: (message, recentMessages, parameters = {}, requestParameters = {}) => {
        // Optionally append recent log lines as context
        let msg = message;
        if (recentMessages > 0) {
            msg += ' | Context:  ';
            msg += JSON.stringify(get(recentMessages));
        }

        // Output the message to the console too.
        if (window.DEBUG) {
            Log.client(`${msg} - ${JSON.stringify(parameters)}`);
        }
        const params = {parameters, message, ...requestParameters};
        API(Network('/api.php')).logToServer(params);
    },

    /**
     * Caches an informational message locally, to be sent to the server if
     * needed later.
     *
     * @param {String} message The message to log.
     * @param {Boolean} sendNow if true, the message will be sent right away.
     * @param {object|String} parameters The parameters to send along with the message
     * @param {object} requestParameters The parameters to send along with the request
     */
    info: (message, sendNow, parameters, requestParameters = {}) => {
        if (sendNow) {
            const msg = `[info] ${message}`;
            Log.logToServer(msg, 0, parameters, requestParameters);
        } else {
            add(message, parameters);
        }
    },

    /**
     * Logs an alert.
     *
     * @param {String} message The message to alert.
     * @param {Number} recentMessages A number of recent messages to append as context
     * @param {object|String} parameters The parameters to send along with the message
     * @param {object} requestParameters The parameters to send along with the request
     */
    alert: (message, recentMessages, parameters = {}, requestParameters = {}) => {
        const msg = `[alrt] ${message}`;
        const params = parameters;
        params.stack = JSON.stringify(new Error().stack);
        Log.logToServer(msg, recentMessages, params, requestParameters);
        add(msg, params);
    },

    /**
     * Logs a warn.
     *
     * @param {String} message The message to warn.
     * @param {Number} recentMessages A number of recent messages to append as context
     * @param {object|String} parameters The parameters to send along with the message
     * @param {object} requestParameters The parameters to send along with the request
     */
    warn: (message, recentMessages, parameters, requestParameters = {}) => {
        const msg = `[warn] ${message}`;
        Log.logToServer(msg, recentMessages, parameters, requestParameters);
        add(msg, parameters);
    },

    /**
     * Logs a hmmm.
     *
     * @param {String} message The message to hmmm.
     * @param {Number} recentMessages A number of recent messages to append as context
     * @param {object|String} parameters The parameters to send along with the message
     * @param {object} requestParameters The parameters to send along with the request
     */
    hmmm: (message, recentMessages, parameters, requestParameters = {}) => {
        const msg = `[hmmm] ${message}`;
        Log.logToServer(msg, recentMessages, parameters, requestParameters);
        add(msg, parameters);
    },

    /**
     * Logs a message in the browser console.
     *
     * @param {String} message The message to log.
     */
    client: (message) => {
        add(message);

        if (typeof window.g_printableReport !== 'undefined' && window.g_printableReport === true) {
            return;
        }

        if (window.console && _.isFunction(console.log)) {
            console.log(message);
        }
    }
};

export default _.omit(Log, 'logToServer');
