import _ from 'underscore';

export default class Logger {
    constructor({serverLoggingCallback, isDebug, clientLoggingCallback}) {
        this.TEMP_LOG_LINES_TO_KEEP = 50;
        // An array of log lines that limits itself to a certain number of entries (deleting the oldest)
        this.logLines = [];
        this.serverLoggingCallback = serverLoggingCallback;
        this.clientLoggingCallback = clientLoggingCallback;
        this.isDebug = isDebug;

        // Public Methods
        return {
            info: this.info.bind(this),
            alert: this.alert.bind(this),
            warn: this.warn.bind(this),
            hmmm: this.hmmm.bind(this),
            client: this.client.bind(this),
        };
    }

    /**
    * Ask the server to write the log message
    *
    * @param {String} message The message to write
    * @param {Number} recentMessages A number of recent messages to append as context
    * @param {Object|String} parameters The parameters to send along with the message
    */
    logToServer(message, recentMessages, parameters = {}) {
        // Optionally append recent log lines as context
        let msg = message;
        if (recentMessages > 0) {
            msg += ' | Context:  ';
            msg += JSON.stringify(this.get(recentMessages));
        }

        // Output the message to the console too.
        if (this.isDebug) {
            this.client(`${msg} - ${JSON.stringify(parameters)}`);
        }

        // We don't care about log setting web cookies so let's define it as false
        const params = {parameters, message, api_setCookie: false};
        this.serverLoggingCallback(params);
    }

    /**
     * Add a message to the list
     * @param {String} message
     * @param {Object|String} parameters The parameters associated with the message
     */
    add(message, parameters) {
        const length = this.logLines.push({
            message,
            parameters,
            timestamp: (new Date())
        });

        // If we're over the limit, remove one line.
        if (length > this.TEMP_LOG_LINES_TO_KEEP) {
            this.logLines.shift();
        }
    }

    /**
     * Get the last messageCount lines
     * @param {Number} messageCount Number of messages to get (optional,
     *              defaults to 1)
     * @return {array} an array of messages (oldest first)
     */
    get(messageCount = 1) {
        // Don't get more than we have
        const count = Math.min(this.TEMP_LOG_LINES_TO_KEEP, messageCount);
        return this.logLines.slice(this.logLines.length - count);
    }

    /**
     * Caches an informational message locally, to be sent to the server if
     * needed later.
     *
     * @param {String} message The message to log.
     * @param {Boolean} sendNow if true, the message will be sent right away.
     * @param {Object|String} parameters The parameters to send along with the message
     */
    info(message, sendNow = false, parameters= '') {
        if (sendNow) {
            const msg = `[info] ${message}`;
            this.logToServer(msg, 0, parameters);
        } else {
            this.add(message, parameters);
        }
    }

    /**
     * Logs an alert.
     *
     * @param {String} message The message to alert.
     * @param {Number} recentMessages A number of recent messages to append as context
     * @param {Object|String} parameters The parameters to send along with the message
     * @param {Boolean} includeStackTrace Must be disabled for testing
     */
    alert(message, recentMessages = 0, parameters = {}, includeStackTrace = true) {
        const msg = `[alrt] ${message}`;
        const params = parameters;

        if (includeStackTrace) {
            params.stack = JSON.stringify(new Error().stack);
        }

        this.logToServer(msg, recentMessages, params);
        this.add(msg, params);
    }

    /**
     * Logs a warn.
     *
     * @param {String} message The message to warn.
     * @param {Number} recentMessages A number of recent messages to append as context
     * @param {Object|String} parameters The parameters to send along with the message
     */
    warn(message, recentMessages = 0, parameters = '') {
        const msg = `[warn] ${message}`;
        this.logToServer(msg, recentMessages, parameters);
        this.add(msg, parameters);
    }

    /**
     * Logs a hmmm.
     *
     * @param {String} message The message to hmmm.
     * @param {Number} recentMessages A number of recent messages to append as context
     * @param {Object|String} parameters The parameters to send along with the message
     */
    hmmm(message, recentMessages = 0, parameters= '') {
        const msg = `[hmmm] ${message}`;
        this.logToServer(msg, recentMessages, parameters);
        this.add(msg, parameters);
    }

    /**
     * Logs a message in the browser console.
     *
     * @param {String} message The message to log.
     */
    client(message) {
        this.add(message);

        if (!this.clientLoggingCallback) {
            return;
        }

        this.clientLoggingCallback(message);
    }
}
