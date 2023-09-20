declare type Parameters = string | Record<string, unknown> | Array<Record<string, unknown>>;
declare type ServerLoggingCallbackOptions = {api_setCookie: boolean; logPacket: string};
declare type ServerLoggingCallback = (logger: Logger, options: ServerLoggingCallbackOptions) => Promise<{requestID: string}> | undefined;
declare type ClientLoggingCallBack = (message: string) => void;
declare type LogLine = {message: string; parameters: Parameters; onlyFlushWithOthers: boolean; timestamp: Date};
export default class Logger {
    logLines: LogLine[];
    serverLoggingCallback: ServerLoggingCallback;
    clientLoggingCallback: ClientLoggingCallBack;
    isDebug: boolean;
    constructor({serverLoggingCallback, isDebug, clientLoggingCallback}: {serverLoggingCallback: ServerLoggingCallback; isDebug: boolean; clientLoggingCallback: ClientLoggingCallBack});
    /**
     * Ask the server to write the log message
     */
    logToServer(): void;
    /**
     * Add a message to the list
     * @param message
     * @param parameters The parameters associated with the message
     * @param forceFlushToServer Should we force flushing all logs to server?
     * @param onlyFlushWithOthers A request will never be sent to the server if all loglines have this set to true
     */
    add(message: string, parameters: Parameters, forceFlushToServer: boolean, onlyFlushWithOthers?: boolean): void;
    /**
     * Caches an informational message locally, to be sent to the server if
     * needed later.
     *
     * @param message The message to log.
     * @param sendNow if true, the message will be sent right away.
     * @param parameters The parameters to send along with the message
     * @param onlyFlushWithOthers A request will never be sent to the server if all loglines have this set to true
     */
    info(message: string, sendNow?: boolean, parameters?: Parameters, onlyFlushWithOthers?: boolean): void;
    /**
     * Logs an alert.
     *
     * @param message The message to alert.
     * @param parameters The parameters to send along with the message
     * @param includeStackTrace Must be disabled for testing
     */
    alert(message: string, parameters?: Parameters, includeStackTrace?: boolean): void;
    /**
     * Logs a warn.
     *
     * @param message The message to warn.
     * @param parameters The parameters to send along with the message
     */
    warn(message: string, parameters?: Parameters): void;
    /**
     * Logs a hmmm.
     *
     * @param message The message to hmmm.
     * @param parameters The parameters to send along with the message
     */
    hmmm(message: string, parameters?: Parameters): void;
    /**
     * Logs a message in the browser console.
     *
     * @param message The message to log.
     */
    client(message: string): void;
}
export {};
