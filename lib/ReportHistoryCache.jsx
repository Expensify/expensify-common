/* globals globalThis */

import _ from 'underscore';
import Network from 'js-libs/lib/Network';
import API from 'js-libs/lib/API';
import APIDeferred from 'js-libs/lib/APIDeferred';

// TODO: Make Deferred JS-Libs versions all platform independent if possible.
// For now we are just looking for it on the globalThis object
const {Deferred} = globalThis;

const expensifyAPI = new API(Network('/api.php'), {
    enhanceParameters: data => ({
        ...data,
        csrfToken: window.g_csrfToken,
        deferredOverride: Deferred,
    })
});

/**
 * Main report history cache
 * Map of reportIDs with value of report history items array
 *
 * @private
 */
const cache = {};

/**
 * Fetches the entire report history from the API
 *
 * @param {Number} reportID
 *
 * @returns {APIDeferred}
 *
 * @private
 */
function fetchAll(reportID) {
    return expensifyAPI.Report_GetHistory({reportID})
        .done((reportHistory) => {
            cache[reportID] = reportHistory;
        });
}

/**
 * Merges partial history items into the cache.
 *
 * @param {Number} reportID
 * @param {Object[]} newHistory
 *
 * @private
 */
function mergeItems(reportID, newHistory) {
    cache[reportID] = _.reduce(newHistory.reverse(), (prev, curr) => {
        if (!_.findWhere(prev, {sequenceNumber: curr.sequenceNumber})) {
            prev.unshift(curr);
        }
        return prev;
    }, cache[reportID]);
}

/**
 * Gets the history.
 *
 * @param {Number} reportID
 * @param {Boolean} cacheFirst - private usage only
 *
 * @returns {APIDeferred}
 */
function getHistory(reportID, cacheFirst = false) {
    const history = cache[reportID] || [];

    // First check to see if we even have this history in cache
    if (_.isEmpty(history)) {
        return fetchAll(reportID);
    }

    const promise = new Deferred();

    // We can override the fetch policy which is to get this
    // from the network if we have passed a param of cacheFirst
    if (cacheFirst) {
        promise.resolve(history);
        return promise;
    }

    const firstHistoryItem = _.first(history) || {};

    // Grabbing the most current sequenceNumber we have and poll the API for fresh data
    expensifyAPI.Report_GetHistory({
        reportID,
        cursor: firstHistoryItem.sequenceNumber || 0
    })
        .done((recentHistory) => {
            // History returned with no new entries we're up to date
            if (recentHistory.length === 0) {
                promise.resolve(cache[reportID]);
                return;
            }

            // Update history with new items fetched
            mergeItems(reportID, recentHistory);

            // Return history for this report
            promise.resolve(cache[reportID]);
        });

    return new APIDeferred(promise);
}

/**
 * Public Methodss
 */
export default {
    getHistory: reportID => getHistory(reportID),
    setItem: (reportID, reportAction, previousSequenceNumber) => {
        const promise = new Deferred();
        getHistory(reportID, true)
            .done((history) => {
                // If we have the action in the cache already - just return the history in cache since we're up to date
                if (_.findWhere(history, {sequenceNumber: reportAction.sequenceNumber})) {
                    return promise.resolve(history);
                }

                // Do we have the reportAction immediately before this one?
                if (_.findWhere(history, {sequenceNumber: previousSequenceNumber})) {
                    // If we have the previous one then we can assume we have an up to date history minus the most recent
                    // Unshift it on to the front of the history list, save to disk, and resolve.
                    cache[reportID].unshift(reportAction);
                    promise.resolve(cache[reportID]);
                    return;
                }

                // If we get here we have an incomplete history and should get
                // the report history again but this time use a network only policy.
                getHistory(reportID)
                    .done(promise.resolve);
            });

        return promise;
    }
};
