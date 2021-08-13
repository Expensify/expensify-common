import _ from 'underscore';
import API from './API';
import Network from './Network';
import Logger from './Logger';

/**
 * Network interface for logger.
 *
 * @param {Logger} logger
 * @param {Object} params
 * @param {Object} params.parameters
 * @param {String} params.message
 * @return {Promise}
 */
function serverLoggingCallback(logger, params) {
    return API(Network('/api.php')).logToServer(params);
}

/**
 * Local log messages for client logging.
 *
 * @param {String} message
 */
function clientLoggingCallback(message) {
    if (typeof window.g_printableReport !== 'undefined' && window.g_printableReport === true) {
        return;
    }

    if (window.console && _.isFunction(console.log)) {
        console.log(message);
    }
}

export default new Logger({
    serverLoggingCallback,
    clientLoggingCallback,
    isDebug: window.DEBUG,
});
