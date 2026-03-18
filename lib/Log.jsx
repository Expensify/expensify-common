/* eslint-disable no-console */
import API from './API';
import Network from './Network';
import Logger from './Logger';
import * as Utils from './utils';

/**
 * Network interface for logger.
 *
 * @param {Logger} logger
 * @param {Object} params
 * @param {Object} params.parameters
 * @param {String} params.message
 * @returns {Promise}
 */
function serverLoggingCallback(logger, params) {
    return API(Network('/api/')).logToServer(params);
}

/**
 * Local log messages for client logging.
 *
 * @param {String} message
 */
function clientLoggingCallback(message) {
    if (Utils.isWindowAvailable() && typeof window.g_printableReport !== 'undefined' && window.g_printableReport === true) {
        return;
    }

    if (window.console && Utils.isFunction(console.log)) {
        console.log(message);
    }
}

export default new Logger({
    serverLoggingCallback,
    clientLoggingCallback,
    isDebug: Utils.isWindowAvailable() ? window.DEBUG : false,
});
