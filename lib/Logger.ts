type Parameters = string | Record<string, unknown> | Array<Record<string, unknown>> | Error;
type ServerLoggingCallbackOptions = {api_setCookie: boolean; logPacket: string};
type ServerLoggingCallback = (logger: Logger, options: ServerLoggingCallbackOptions) => Promise<{requestID: string}> | undefined;
type ClientLoggingCallBack = (message: string, extraData: Parameters) => void;
type LogLine = {message: string; parameters: Parameters; onlyFlushWithOthers?: boolean; timestamp: Date; email?: string | null};
type LoggerOptions = {
    serverLoggingCallback: ServerLoggingCallback;
    isDebug: boolean;
    clientLoggingCallback: ClientLoggingCallBack;
    maxLogLinesBeforeFlush?: number;
    getContextEmail?: () => string | null;
};

const MAX_LOG_LINES_BEFORE_FLUSH = 50;

export default class Logger {
    logLines: LogLine[];

    serverLoggingCallback: ServerLoggingCallback;

    clientLoggingCallback: ClientLoggingCallBack;

    isDebug: boolean;

    maxLogLinesBeforeFlush: number;

    getContextEmail?: () => string | null;

    constructor({serverLoggingCallback, isDebug, clientLoggingCallback, maxLogLinesBeforeFlush, getContextEmail}: LoggerOptions) {
        // An array of log lines that limits itself to a certain number of entries (deleting the oldest)
        this.logLines = [];
        this.serverLoggingCallback = serverLoggingCallback;
        this.clientLoggingCallback = clientLoggingCallback;
        this.isDebug = isDebug;
        this.maxLogLinesBeforeFlush = maxLogLinesBeforeFlush || MAX_LOG_LINES_BEFORE_FLUSH;
        this.getContextEmail = getContextEmail;

        // Public Methods
        this.info = this.info.bind(this);
        this.alert = this.alert.bind(this);
        this.warn = this.warn.bind(this);
        this.hmmm = this.hmmm.bind(this);
        this.client = this.client.bind(this);
    }

    /**
     * Ask the server to write the log message
     */
    logToServer(): void {
        // We do not want to call the server with an empty list or if all the lines has onlyFlushWithOthers=true
        if (!this.logLines.length || this.logLines?.every((l) => l.onlyFlushWithOthers)) {
            return;
        }

        // We don't care about log setting web cookies so let's define it as false
        const linesToLog = this.logLines?.map((l) => {
            // eslint-disable-next-line no-param-reassign
            delete l.onlyFlushWithOthers;
            return l;
        });
        this.logLines = [];
        const promise = this.serverLoggingCallback(this, {api_setCookie: false, logPacket: JSON.stringify(linesToLog)});
        if (!promise) {
            return;
        }
        // eslint-disable-next-line rulesdir/prefer-early-return
        promise.then((response) => {
            if (!response.requestID) {
                return;
            }
            this.info('Previous log requestID', false, {requestID: response.requestID}, true);
        });
    }

    /**
     * Add a message to the list
     * @param parameters The parameters associated with the message
     * @param forceFlushToServer Should we force flushing all logs to server?
     * @param onlyFlushWithOthers A request will never be sent to the server if all loglines have this set to true
     */
    add(message: string, parameters: Parameters, forceFlushToServer: boolean, onlyFlushWithOthers = false, extraData: Parameters = '') {
        // Capture the user's email at the moment this specific log line is created
        // This ensures the log retains user context even if the session is cleared before sending
        let email: string | null = null;
        try {
            email = this.getContextEmail ? this.getContextEmail() : null;
        } catch {
            // Silently fail if getContextEmail throws - logging should not crash
        }

        const length = this.logLines.push({
            message,
            parameters,
            onlyFlushWithOthers,
            timestamp: new Date(),
            email,
        });

        if (this.isDebug) {
            this.client(`${message} - ${JSON.stringify(parameters)}`, extraData);
        }

        // If we're over the limit, flush the logs
        if (length > this.maxLogLinesBeforeFlush || forceFlushToServer) {
            this.logToServer();
        }
    }

    /**
     * Caches an informational message locally, to be sent to the server if
     * needed later.
     *
     * @param message The message to log.
     * @param sendNow if true, the message will be sent right away.
     * @param parameters The parameters to send along with the message
     * @param onlyFlushWithOthers A request will never be sent to the server if all loglines have this set to true
     */
    info(message: string, sendNow = false, parameters: Parameters = '', onlyFlushWithOthers = false, extraData: Parameters = '') {
        const msg = `[info] ${message}`;
        this.add(msg, parameters, sendNow, onlyFlushWithOthers, extraData);
    }

    /**
     * Logs an alert.
     *
     * @param message The message to alert.
     * @param parameters The parameters to send along with the message
     * @param includeStackTrace Must be disabled for testing
     */
    alert(message: string, parameters: Parameters = {}, includeStackTrace = true) {
        const msg = `[alrt] ${message}`;
        const params = parameters;

        if (includeStackTrace && typeof params === 'object' && !Array.isArray(params)) {
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
    warn(message: string, parameters: Parameters = '') {
        const msg = `[warn] ${message}`;
        this.add(msg, parameters, true);
    }

    /**
     * Logs a hmmm.
     *
     * @param message The message to hmmm.
     * @param parameters The parameters to send along with the message
     */
    hmmm(message: string, parameters: Parameters = '') {
        const msg = `[hmmm] ${message}`;
        this.add(msg, parameters, false);
    }

    /**
     * Logs a message in the browser console.
     *
     * @param message The message to log.
     */
    client(message: string, extraData: Parameters = '') {
        if (!this.clientLoggingCallback) {
            return;
        }

        this.clientLoggingCallback(message, extraData);
    }
}
