import _ from 'underscore';

const MAX_LOG_LINES_BEFORE_FLUSH = 50;
export default class Logger {
    constructor({serverLoggingCallback, isDebug, clientLoggingCallback}) {
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
    */
    logToServer() {
        // We do not want to call the server with an empty list or if all the lines has onlyFlushWithOthers=true
        if (!this.logLines.length || _.all(this.logLines, l => l.onlyFlushWithOthers)) {
            return;
        }

        // We don't care about log setting web cookies so let's define it as false
        const linesToLog = _.map(this.logLines, l => {
            delete l.onlyFlushWithOthers;
            return l;
        });
        const promise = this.serverLoggingCallback({api_setCookie: false, logPacket: JSON.stringify(linesToLog)});
        this.logLines = [];
        if (!promise) {
            return;
        }
        promise.then((response) => {
            if (response.requestID) {
                this.info('Previous log requestID', false, {requestID: response.requestID}, true);
            }
        });
    }

    /**
     * Add a message to the list
     * @param {String} message
     * @param {Object|String} parameters The parameters associated with the message
     * @param {Boolean} forceFlushToServer Should we force flushing all logs to server?
     * @param {Boolean} onlyFlushWithOthers A request will never be sent to the server if all loglines have this set to true
     */
    add(message, parameters, forceFlushToServer, onlyFlushWithOthers = false) {
        const length = this.logLines.push({
            message,
            parameters,
            onlyFlushWithOthers,
            timestamp: (new Date())
        });

        if (this.isDebug) {
            this.client(`${message} - ${JSON.stringify(parameters)}`);
        }

        // If we're over the limit, flush the logs
        if (length > MAX_LOG_LINES_BEFORE_FLUSH || forceFlushToServer) {
            this.logToServer()
        }
    }

    /**
     * Caches an informational message locally, to be sent to the server if
     * needed later.
     *
     * @param {String} message The message to log.
     * @param {Boolean} sendNow if true, the message will be sent right away.
     * @param {Object|String} parameters The parameters to send along with the message
     * @param {Boolean} onlyFlushWithOthers A request will never be sent to the server if all loglines have this set to true
     */
    info(message, sendNow = false, parameters= '', onlyFlushWithOthers = false) {
        const msg = `[info] ${message}`;
        this.add(msg, parameters, sendNow, onlyFlushWithOthers);
    }

    /**
     * Logs an alert.
     *
     * @param {String} message The message to alert.
     * @param {Object|String} parameters The parameters to send along with the message
     * @param {Boolean} includeStackTrace Must be disabled for testing
     */
    alert(message, parameters = {}, includeStackTrace = true) {
        const msg = `[alrt] ${message}`;
        const params = parameters;

        if (includeStackTrace) {
            params.stack = JSON.stringify(new Error().stack);
        }

        this.add(msg, params, true);
    }

    /**
     * Logs a warn.
     *
     * @param {String} message The message to warn.
     * @param {Object|String} parameters The parameters to send along with the message
     */
    warn(message, parameters = '') {
        const msg = `[warn] ${message}`;
        this.add(msg, parameters, true);
    }

    /**
     * Logs a hmmm.
     *
     * @param {String} message The message to hmmm.
     * @param {Object|String} parameters The parameters to send along with the message
     */
    hmmm(message, parameters = '') {
        const msg = `[hmmm] ${message}`;
        this.add(msg, parameters, false);
    }

    /**
     * Logs a message in the browser console.
     *
     * @param {String} message The message to log.
     */
    client(message) {
        if (!this.clientLoggingCallback) {
            return;
        }

        this.clientLoggingCallback(message);
    }
}
