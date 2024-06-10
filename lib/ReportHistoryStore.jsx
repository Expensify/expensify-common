import {Deferred} from 'simply-deferred';

export default class ReportHistoryStore {
    // We need to instantiate the history cache with the platform specific implementations
    constructor(API, PubSub) {
        if (!API) {
            throw new Error('Cannot instantiate ReportHistoryStore without API');
        }

        this.API = API;

        /**
         * Main report history cache
         * Map of reportIDs with value of report history items array
         */
        this.cache = {};

        /**
         * PubSub instance used for the bindCacheClearingEvents method.
         *
         * Since Mobile and Web use different instances of PubSub, this is unfortunately necessary to subscribe to
         * events in both code bases.
         */
        this.PubSub = PubSub;

        /**
         * Filters out actions we never want to display on web or mobile.
         *
         * @param {Object[]} historyItems
         *
         * @returns {Object[]}
         */
        this.filterHiddenActions = (historyItems) => historyItems.filter((historyItem) => historyItem.shouldShow);

        /**
         * Public Methods
         */

        return {
            /**
             * Returns the history for a given report.
             * Note that we are unable to ask for the cached history.
             *
             * @param {Number} reportID
             * @param {Boolean} ignoreCache - useful if you need to force the report history to reload completely.
             *
             * @returns {Deferred}
             */
            get: (reportID, ignoreCache = false) => {
                const promise = new Deferred();
                this.get(reportID, ignoreCache)
                    .done((reportHistory) => {
                        promise.resolve(this.filterHiddenActions(reportHistory));
                    })
                    .fail(promise.reject);
                return promise;
            },

            /**
             * Returns the history for a given report.
             * Note that we are unable to ask for the cached history.
             *
             * @param {Number} reportID
             * @param {Boolean} ignoreCache - useful if you need to force the report history to reload completely.
             *
             * @returns {Deferred}
             */
            getFlatHistory: (reportID, ignoreCache = false) => {
                const promise = new Deferred();
                this.getFlatHistory(reportID, ignoreCache)
                    .done((reportHistory) => {
                        promise.resolve(this.filterHiddenActions(reportHistory));
                    })
                    .fail(promise.reject);
                return promise;
            },

            /**
             * Set a history item directly into the cache. Checks to see if we have the previous item first.
             *
             * @param {Number} reportID
             * @param {Object} reportAction
             *
             * @returns {Deferred}
             */
            insertIntoCache: (reportID, reportAction) => {
                const promise = new Deferred();
                this.getFromCache(reportID)
                    .done((cachedHistory) => {
                        const sequenceNumber = reportAction.sequenceNumber;

                        // Do we have the reportAction immediately before this one?
                        // Note: History is zero indexed. So if we want to check if we have the previous message before an
                        // incoming message with a sequenceNumber of 18 then we'd be looking for a cache length of 18
                        // which would indicate that we have sequenceNumber 17)
                        if (cachedHistory.length >= sequenceNumber) {
                            // If we have the previous one then we can assume we have an up to date history minus the most recent
                            // and must merge it into the cache
                            this.mergeItems(reportID, [reportAction]);
                            return promise.resolve(this.filterHiddenActions(this.cache[reportID]));
                        }

                        // If we get here we have an incomplete history and should get
                        // the report history again, but this time do not check the cache first.
                        this.get(reportID)
                            .done((reportHistory) => promise.resolve(this.filterHiddenActions(reportHistory)))
                            .fail(promise.reject);
                    })
                    .fail(promise.reject);

                return promise;
            },

            /**
             * Set a history item directly into the cache. Checks to see if we have the previous item first.
             *
             * @param {Number} reportID
             * @param {Object} reportAction
             *
             * @returns {Deferred}
             */
            insertIntoCacheByActionID: (reportID, reportAction) => {
                const promise = new Deferred();
                this.getFromCache(reportID)
                    .done((cachedHistory) => {
                        // Do we have the reportAction immediately before this one?
                        if (cachedHistory.some(({reportActionID}) => reportActionID === reportAction.reportActionID)) {
                            // If we have the previous one then we can assume we have an up to date history minus the most recent
                            // and must merge it into the cache
                            this.mergeHistoryByTimestamp(reportID, [reportAction]);
                            return promise.resolve(this.filterHiddenActions(this.cache[reportID]));
                        }

                        // If we get here we have an incomplete history and should get
                        // the report history again, but this time do not check the cache first.
                        this.getFlatHistory(reportID)
                            .done((reportHistory) => promise.resolve(this.filterHiddenActions(reportHistory)))
                            .fail(promise.reject);
                    })
                    .fail(promise.reject);

                return promise;
            },

            /**
             * Certain events need to completely clear the cache. This method allows other code modules using this
             * (like Web, Mobile) to assign which events would do so.
             *
             * @param {String[]} events
             */
            bindCacheClearingEvents: (events) => {
                events.each((event) => this.PubSub.subscribe(event, () => (this.cache = {})));
            },

            // We need this to be publically available for cases where we get the report history
            // via PHP or html pages within the app e.g. printablereport.html
            filterHiddenActions: this.filterHiddenActions,
        };
    }

    /**
     * Merges history items into the cache and creates it if it doesn't yet exist.
     *
     * @param {Number} reportID
     * @param {Object[]} newHistory
     */
    mergeItems(reportID, newHistory) {
        if (newHistory.length === 0) {
            return;
        }

        const newCache = newHistory.reverse().reduce((prev, curr) => {
            if (!prev.some((item) => item.sequenceNumber === curr.sequenceNumber)) {
                prev.unshift(curr);
            }
            return prev;
        }, this.cache[reportID] || []);

        // Sort items in case they have become out of sync
        this.cache[reportID] = newCache.sort((a, b) => b.sequenceNumber - a.sequenceNumber);
    }

    /**
     * Merges history items into the cache and creates it if it doesn't yet exist.
     *
     * @param {Number} reportID
     * @param {Object[]} newHistory
     */
    mergeHistoryByTimestamp(reportID, newHistory) {
        if (newHistory.length === 0) {
            return;
        }

        const newCache = newHistory.reverse().reduce((prev, curr) => {
            if (!prev.some((item) => item.reportActionTimestamp === curr.reportActionTimestamp)) {
                prev.unshift(curr);
            }
            return prev;
        }, this.cache[reportID] || []);

        // Sort items in case they have become out of sync
        this.cache[reportID] = newCache.sort((a, b) => b.reportActionTimestamp - a.reportActionTimestamp);
    }

    /**
     * Gets the history.
     *
     * @param {Number} reportID
     * @param {Boolean} ignoreCache
     *
     * @returns {Deferred}
     */
    get(reportID, ignoreCache) {
        const promise = new Deferred();

        // Remove the cache entry if we're ignoring the cache, since we'll be replacing it later.
        if (ignoreCache) {
            delete this.cache[reportID];
        }

        // We'll poll the API for the un-cached history
        const cachedHistory = this.cache[reportID] || [];
        const firstHistoryItem = cachedHistory[0] || {};

        // Grab the most recent sequenceNumber we have and poll the API for fresh data
        this.API.Report_GetHistory({
            reportID,
            offset: firstHistoryItem.sequenceNumber || 0,
        })
            .done((recentHistory) => {
                // Update history with new items fetched
                this.mergeItems(reportID, recentHistory);

                // Return history for this report
                promise.resolve(this.cache[reportID]);
            })
            .fail(promise.reject);

        return promise;
    }

    /**
     * Gets the history. This flow does not depend on the deprecated sequence number in report actions.
     *
     * @param {Number} reportID
     * @param {Boolean} ignoreCache
     *
     * @returns {Deferred}
     */
    getFlatHistory(reportID, ignoreCache) {
        const promise = new Deferred();

        // Remove the cache entry if we're ignoring the cache, since we'll be replacing it later.
        if (ignoreCache) {
            delete this.cache[reportID];
        }

        this.API.Report_GetHistory({
            reportID,
        })
            .done((recentHistory) => {
                // Update history with new items fetched
                this.mergeHistoryByTimestamp(reportID, recentHistory);

                // Return history for this report
                promise.resolve(this.cache[reportID]);
            })
            .fail(promise.reject);

        return promise;
    }

    /**
     * Gets the history from the cache if it exists. Otherwise fully loads the history.
     *
     * @param {Number} reportID
     *
     * @return {Deferrred}
     */
    getFromCache(reportID) {
        const promise = new Deferred();
        const cachedHistory = this.cache[reportID] || [];

        // If comment is not in cache then fetch it
        if (cachedHistory.length === 0) {
            return this.getFlatHistory(reportID);
        }

        return promise.resolve(cachedHistory);
    }
}
