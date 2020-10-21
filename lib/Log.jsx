import _ from 'underscore';
import API from './API';
import Network from './Network';

/**
 * Network interface for logger.
 *
 * @param {Object} params
 * @param {Object} params.parameters
 * @param {String} params.message
 */
function loggingCallback(params) {
    API(Network('/api.php')).logToServer(params);
}

export default new Logger({
    loggingCallback,
    isDebug: window.DEBUG,
    shouldLogToConsole: window.console
        && _.isFunction(console.log)
        && typeof window.g_printableReport === 'undefined'
        && window.g_printableReport !== true
});
