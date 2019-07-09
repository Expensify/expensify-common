/* globals yaplWriteFile, yaplFileExists, yaplReadFile */

import _ from 'underscore';
import LocalStorage from './LocalStorage';
import Network from '../Network';
import API from '../API';

export default class ReportHistoryCache {
    constructor(platform, csrfToken) {
        this.storeExists = false;
        this.platform = platform;
        this.reportHistory = platform === 'mobile' ? this.getReportHistoryFromYapl() : this.getReportHistoryFromLocalStorage();

        const network = Network('/api.php');
        this.expensifyAPI = API(network, {
            enhanceParameters: data => ({
                ...data,
                csrfToken,
            })
        });

        return {
            getHistoryByReportID: reportID => this.getHistoryByReportID(reportID),
            setItem: (reportID, newItem, previousItem) => this.setItem(reportID, newItem, previousItem),
        };
    }

    /**
     * Initializes the report history from localStorage
     *
     * @return {Object}
     */
    getReportHistoryFromLocalStorage() {
        try {
            this.storeExists = LocalStorage.keyExists(LocalStorage.KEY.REPORT_HISTORY);
            if (!this.storeExists) {
                LocalStorage.set(LocalStorage.KEY.REPORT_HISTORY, {});
                this.storeExists = true;
                return LocalStorage.get(LocalStorage.KEY.REPORT_HISTORY);
            }
            return LocalStorage.get(LocalStorage.KEY.REPORT_HISTORY);
        } catch (err) {
            // If we can't access localStorage just return an empty object so we can use in memory storage
            return {};
        }
    }

    /**
     * Only used on mobile. Initializes the report history from yapl file system.
     *
     * @return {Object}
     */
    getReportHistoryFromYapl() {
        this.filename = 'reportHistory.json';
        this.storeExists = yaplFileExists(this.filename);

        if (!this.storeExists) {
            // yaplWriteFile returns true if we successfully created the file
            // so overwrite storeExists with the return value so we know we can read from it.
            this.storeExists = yaplWriteFile(this.filename, '{}');
        }

        return this.storeExists ? JSON.parse(yaplReadFile(this.filename)) : {};
    }

    /**
     * Fetches all the history for a given reportID,
     * updates the in memory cache and saves it to disk.
     *
     * This will completely blow away any history items for a report and query for the entire report history.
     *
     * @param {Number} reportID
     *
     * @return {Deferred}
     */
    fetchAllHistoryByReportID(reportID) {
        return this.expensifyAPI.Report_GetHistory({
            reportID
        })
            .done((history) => {
                // Set history in the local cache
                this.reportHistory[reportID] = history;
                this.persistToDeviceCache();
            });
    }

    /**
     * Takes the current in memory cache and persists it to disk
     */
    persistToDeviceCache() {
        // Don't try to write to the store if we couldn't create it on init.
        // We'll use the in memory cache instead.
        if (!this.storeExists) {
            return;
        }

        if (this.platform === 'mobile') {
            yaplWriteFile(this.filename, JSON.stringify(this.reportHistory));
        } else {
            LocalStorage.set(LocalStorage.KEY.REPORT_HISTORY, this.reportHistory);
        }
    }

    /**
     * Merges history items returned from the API with the correct reportID.
     * Saves to local cache and disk.
     *
     * @param {Number} reportID
     * @param {Array} newHistory
     */
    mergeHistoryItems(reportID, newHistory) {
        // Set local history
        this.reportHistory[reportID] = _.reduce(newHistory.reverse(), (prev, curr) => {
            // Only add history items whose sequence numbers are not in the cache to prevent duplicates
            if (!_.findWhere(prev, {sequenceNumber: curr.sequenceNumber})) {
                prev.unshift(curr);
            }
            return prev;
        }, this.reportHistory[reportID]);

        // Save to disk
        this.persistToDeviceCache();
    }

    /**
     * Get the currently stored history for a report.
     * If the history item does not exist then we will fetch all history before returning.
     *
     * @param {Number} reportID
     * @param {Boolean} cacheFirst - Attempts to return from the local cache first before making a network request
     *
     * @return {Deferred}
     */
    getHistoryByReportID(reportID, cacheFirst) {
        const history = this.reportHistory[reportID] || [];

        // First check to see if we even have this history in cache
        if (_.isEmpty(history)) {
            return this.fetchAllHistoryByReportID(reportID);
        }

        const promise = new $.Deferred();

        // We can override the fetch policy which is to get this
        // from the network if we have passed a param of cacheFirst
        if (cacheFirst) {
            promise.resolve(history);
            return promise;
        }

        const firstHistoryItem = _.first(history) || {};

        // Grabbing the most current sequenceNumber we have and poll the API for fresh data
        this.expensifyAPI.Report_GetHistoryFromSequenceNumber({
            reportID,
            sequenceNumber: firstHistoryItem.sequenceNumber || 0
        })
            .done((response) => {
                // History returned with no new entries we're up to date
                if (response.history.length === 0) {
                    promise.resolve(this.reportHistory[reportID]);
                    return;
                }

                // Update history with new items fetched
                this.mergeHistoryItems(reportID, response.history);

                // Return history for this report
                promise.resolve(this.reportHistory[reportID]);
            });

        return promise;
    }

    /**
     * Used by Pusher subscriptions and device notifications.
     *
     * This method must be supplied an incoming report action and the previous report action.
     * If we have the incoming action then we can assume that we have the previous one and we'll return the cache in memory.
     * If we do not have the incoming action but have the previous action we will insert the incoming action into the cache.
     * If we have neither, we missed something and will need to get the most recent items.
     *
     * @param {Number} reportID
     * @param {Object} newItem
     * @param {Object} previousItem
     *
     * @returns {Deferred}
     */
    setItem(reportID, newItem, previousItem) {
        const promise = new $.Deferred();

        // Get the history with a cacheFirst policy
        this.getHistoryByReportID(reportID, true)
            .done((history) => {
                // If we have the action in the cache already - just return the history in cache since we're up to date
                if (_.findWhere(history, {sequenceNumber: newItem.sequenceNumber})) {
                    return promise.resolve(history);
                }

                // Do we have the reportAction immediately before this one?
                if (_.findWhere(history, {sequenceNumber: previousItem.sequenceNumber})) {
                    // If we have the previous one then we can assume we have an up to date history minus the most recent
                    // Unshift it on to the front of the history list, save to disk, and resolve.
                    this.reportHistory[reportID].unshift(newItem);
                    this.persistToDeviceCache();
                    promise.resolve(this.reportHistory[reportID]);
                    return;
                }

                // If we get here we have an incomplete history and should get
                // the report history again but this time use a network only policy.
                this.getHistoryByReportID(reportID)
                    .done((recentHistory) => {
                        promise.resolve(recentHistory);
                    });
            });

        return promise;
    }
}
