declare type Parameters = string | Record<string, unknown>;
declare type ServerLoggingCallback = (logger: Logger, options: Record<string, unknown>) => Promise<void>;
declare type ClientLoggingCallBack = (message: string) => void;
export default class Logger {
    logLines: Array<Record<string, unknown>>;
    serverLoggingCallback: ServerLoggingCallback;
    clientLoggingCallback: ClientLoggingCallBack;
    isDebug: boolean;
    constructor({ serverLoggingCallback, isDebug, clientLoggingCallback }: {
        serverLoggingCallback: ServerLoggingCallback;
        isDebug: boolean;
        clientLoggingCallback: ClientLoggingCallBack;
    });
    /**
     * Ask the server to write the log message
     */
    logToServer(): void;
    /**
     * Add a message to the list
     * @param {String} message
     * @param {Object|String} parameters The parameters associated with the message
     * @param {Boolean} forceFlushToServer Should we force flushing all logs to server?
     * @param {Boolean} onlyFlushWithOthers A request will never be sent to the server if all loglines have this set to true
     */
    add(message: string, parameters: Parameters, forceFlushToServer: boolean, onlyFlushWithOthers?: boolean): void;
    /**
     * Caches an informational message locally, to be sent to the server if
     * needed later.
     *
     * @param {String} message The message to log.
     * @param {Boolean} sendNow if true, the message will be sent right away.
     * @param {Object|String} parameters The parameters to send along with the message
     * @param {Boolean} onlyFlushWithOthers A request will never be sent to the server if all loglines have this set to true
     */
    info(message: string, sendNow?: boolean, parameters?: Parameters, onlyFlushWithOthers?: boolean): void;
    /**
     * Logs an alert.
     *
     * @param {String} message The message to alert.
     * @param {Object|String} parameters The parameters to send along with the message
     * @param {Boolean} includeStackTrace Must be disabled for testing
     */
    alert(message: string, parameters?: Parameters, includeStackTrace?: boolean): void;
    /**
     * Logs a warn.
     *
     * @param {String} message The message to warn.
     * @param {Object|String} parameters The parameters to send along with the message
     */
    warn(message: string, parameters?: Parameters): void;
    /**
     * Logs a hmmm.
     *
     * @param {String} message The message to hmmm.
     * @param {Object|String} parameters The parameters to send along with the message
     */
    hmmm(message: string, parameters?: Parameters): void;
    /**
     * Logs a message in the browser console.
     *
     * @param {String} message The message to log.
     */
    client(message: string): void;
}
export {};
