import _ from 'underscore';

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
 * @param {int} messageCount Number of messages to get (optional,
 *              defaults to 1)
 * @return {array} an array of messages (oldest first)
 */
const get = (messageCount) => {
    // Default to 1
    messageCount = _.isUndefined(messageCount) ? 1 : messageCount;
    // Don't get more than we have
    messageCount = Math.min(TEMP_LOG_LINES_TO_KEEP, messageCount);
    return logLines.slice(logLines.length - messageCount);
};

/**
* Ask the server to write the log message
*
* @param {String} message The message to write
* @param {int} recentMessages A number of recent messages to append as context
* @param {object|String} parameters The parameters to send along with the message
*/

const logToServer = (message, recentMessages, parameters) => {
    // Optionally append recent log lines as context
    if (recentMessages > 0) {
        message += ' | Context:  ';
        message += JSON.stringify(get(recentMessages));
    }

    // Output the message to the console too.
    if (window.DEBUG) {
       this.client(message + ' - ' + JSON.stringify(parameters));
    }
 
    // TODO: Remove dependency on ajax() which is deprecated.
    ajax('/api', {
        command: 'Log',
        message: message,
        parameters: parameters,
        referer: 'webjs'
    });
};


export default {
    /**
     * Caches an informational message locally, to be sent to the server if
     * needed later.
     *
     * @param {String} message The message to log.
     * @param {Boolean} sendNow if true, the message will be sent right away.
     * @param {object|String} parameters The parameters to send along with the message
     */
    info: (message, sendNow, parameters) => {
        if (sendNow) {
            message = '[info] ' + message;
            logToServer(message, 0, parameters);
        } else {
            add(message, parameters);
        }
    },

    /**
     * Logs an alert.
     *
     * @param {String} message The message to alert.
     * @param {int} recentMessages A number of recent messages to append as context
     * @param {object|String} parameters The parameters to send along with the message
     */
    alert: (message, recentMessages, parameters) => {
        message = '[alrt] ' + message;

        parameters = parameters || {};
        parameters.stack = JSON.stringify(new Error().stack);

        logToServer(message, recentMessages, parameters);
        add(message, parameters);
    },

    /**
     * Logs a warn.
     *
     * @param {String} message The message to warn.
     * @param {int} recentMessages A number of recent messages to append as context
     * @param {object|String} parameters The parameters to send along with the message
     */
    warn: (message, recentMessages, parameters) => {
        message = '[warn] ' + message;
        logToServer(message, recentMessages, parameters);
        add(message, parameters);
    },

    /**
     * Logs a hmmm.
     *
     * @param {String} message The message to hmmm.
     * @param {int} recentMessages A number of recent messages to append as context
     * @param {object|String} parameters The parameters to send along with the message
     */
    hmmm: (message, recentMessages, parameters) => {
        message = '[hmmm] ' + message;
        logToServer(message, recentMessages, parameters);
        add(message, parameters);
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

        if (exists(window.console) && _.isFunction(console.log)) {
            console.log(message);
        }
    }
};
