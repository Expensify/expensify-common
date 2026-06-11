import {Deferred} from 'simply-deferred';

/**
 * Creates a report history store with platform-specific API and PubSub implementations.
 *
 * @param {Object} API
 * @param {Object} PubSub
 * @returns {Object}
 */
export default function ReportHistoryStore(API, PubSub) {
    if (!API) {
        throw new Error('Cannot instantiate ReportHistoryStore without API');
    }

    const store = {
        API,
        cache: {},
        PubSub,
    };

    /**
     * Filters out actions we never want to display on web or mobile.
     *
     * @param {Object[]} historyItems
     * @returns {Object[]}
     */
    const filterHiddenActions = (historyItems) => historyItems.filter((historyItem) => historyItem.shouldShow);

    /**
     * Merges history items into the cache and creates it if it doesn't yet exist.
     *
     * @param {Number} reportID
     * @param {Object[]} newHistory
     */
    function mergeItems(reportID, newHistory) {
        if (newHistory.length === 0) {
            return;
        }

        const newCache = newHistory.reverse().reduce((prev, curr) => {
            if (!prev.some((item) => item.sequenceNumber === curr.sequenceNumber)) {
                prev.unshift(curr);
            }
            return prev;
        }, store.cache[reportID] || []);

        store.cache[reportID] = newCache.sort((a, b) => b.sequenceNumber - a.sequenceNumber);
    }

    /**
     * Merges history items into the cache and creates it if it doesn't yet exist.
     *
     * @param {Number} reportID
     * @param {Object[]} newHistory
     */
    function mergeHistoryByTimestamp(reportID, newHistory) {
        if (newHistory.length === 0) {
            return;
        }

        const newCache = newHistory.reverse().reduce((prev, curr) => {
            if (!prev.some((item) => item.reportActionTimestamp === curr.reportActionTimestamp)) {
                prev.unshift(curr);
            }
            return prev;
        }, store.cache[reportID] || []);

        store.cache[reportID] = newCache.sort((a, b) => b.reportActionTimestamp - a.reportActionTimestamp);
    }

    /**
     * Merges history items by reportActionID into the cache and creates it if it doesn't yet exist.
     *
     * @param {Number} reportID
     * @param {Object[]} newHistory
     */
    function mergeHistoryByReportActionID(reportID, newHistory) {
        if (newHistory.length === 0) {
            return;
        }

        const newCache = newHistory.reverse().reduce((prev, curr) => {
            if (!prev.some((item) => item.reportActionID === curr.reportActionID)) {
                prev.unshift(curr);
            }
            return prev;
        }, store.cache[reportID] || []);

        store.cache[reportID] = newCache.sort((a, b) => b.reportActionTimestamp - a.reportActionTimestamp);
    }

    /**
     * Gets the history.
     *
     * @param {Number} reportID
     * @param {Boolean} ignoreCache
     * @returns {Deferred}
     */
    function get(reportID, ignoreCache) {
        const promise = new Deferred();

        if (ignoreCache) {
            delete store.cache[reportID];
        }

        const cachedHistory = store.cache[reportID] || [];
        const firstHistoryItem = cachedHistory[0] || {};

        store.API.Report_GetHistory({
            reportID,
            offset: firstHistoryItem.sequenceNumber || 0,
        })
            .done((recentHistory) => {
                mergeItems(reportID, recentHistory);
                promise.resolve(store.cache[reportID]);
            })
            .fail(promise.reject);

        return promise;
    }

    /**
     * Gets the history. This flow does not depend on the deprecated sequence number in report actions.
     *
     * @param {Number} reportID
     * @param {Boolean} ignoreCache
     * @returns {Deferred}
     */
    function getFlatHistory(reportID, ignoreCache) {
        const promise = new Deferred();

        if (ignoreCache) {
            delete store.cache[reportID];
        }

        store.API.Report_GetHistory({
            reportID,
        })
            .done((recentHistory) => {
                mergeHistoryByReportActionID(reportID, recentHistory);
                promise.resolve(store.cache[reportID]);
            })
            .fail(promise.reject);

        return promise;
    }

    /**
     * Gets the history from the cache if it exists. Otherwise fully loads the history.
     *
     * @param {Number} reportID
     * @returns {Deferred}
     */
    function getFromCache(reportID) {
        const promise = new Deferred();
        const cachedHistory = store.cache[reportID] || [];

        if (cachedHistory.length === 0) {
            return getFlatHistory(reportID);
        }

        return promise.resolve(cachedHistory);
    }

    return {
        get: (reportID, ignoreCache = false) => {
            const promise = new Deferred();
            get(reportID, ignoreCache)
                .done((reportHistory) => {
                    promise.resolve(filterHiddenActions(reportHistory));
                })
                .fail(promise.reject);
            return promise;
        },

        getFlatHistory: (reportID, ignoreCache = false) => {
            const promise = new Deferred();
            getFlatHistory(reportID, ignoreCache)
                .done((reportHistory) => {
                    promise.resolve(filterHiddenActions(reportHistory));
                })
                .fail(promise.reject);
            return promise;
        },

        insertIntoCache: (reportID, reportAction) => {
            const promise = new Deferred();
            getFromCache(reportID)
                .done((cachedHistory) => {
                    const sequenceNumber = reportAction.sequenceNumber;

                    if (cachedHistory.length >= sequenceNumber) {
                        mergeItems(reportID, [reportAction]);
                        return promise.resolve(filterHiddenActions(store.cache[reportID]));
                    }

                    get(reportID)
                        .done((reportHistory) => promise.resolve(filterHiddenActions(reportHistory)))
                        .fail(promise.reject);
                })
                .fail(promise.reject);

            return promise;
        },

        insertIntoCacheByActionID: (reportID, reportAction) => {
            const promise = new Deferred();
            getFromCache(reportID)
                .done((cachedHistory) => {
                    if (cachedHistory.some(({reportActionID}) => reportActionID === reportAction.reportActionID)) {
                        mergeHistoryByTimestamp(reportID, [reportAction]);
                        return promise.resolve(filterHiddenActions(store.cache[reportID]));
                    }

                    getFlatHistory(reportID)
                        .done((reportHistory) => promise.resolve(filterHiddenActions(reportHistory)))
                        .fail(promise.reject);
                })
                .fail(promise.reject);

            return promise;
        },

        bindCacheClearingEvents: (events) => {
            for (const event of events) {
                store.PubSub.subscribe(event, () => {
                    store.cache = {};
                });
            }
        },

        filterHiddenActions,
    };
}
