import _ from 'underscore';
import {Deferred} from 'simply-deferred';

export default (API) => ({
    /**
     * Store getter, contain the pagination logic
     *
     * @param {String} listName What list of items we want to return
     * @param {Function} resourceConstructor a class used to construct our resources
     * @param {Object} resourceStore gets filled up with all the resources
     * @param {Number} paginationStep number of elements return by pagination each call
     * @param {Object} param options for the API call
     * @return {Deferred}
     */
    storeGetter: function (listName, resourceConstructor, resourceStore, paginationStep, param) {
        const promise = new Deferred();
        const fullList = [];
        let nbRequest = 1;

        if (!_.isFunction(resourceConstructor.prototype.getID)) {
            throw new Error('storeGetter called with a non-compatible ressource');
        }

        // param.limit can contain the number of elements asked
        // determine how many call we are going to do
        if (param.limit === undefined) {
            param.limit = Infinity;
        }

        if (param.limit === Infinity || param.limit === -1) {
            nbRequest = Infinity;
            param.limit = paginationStep;
        } else if (param.limit !== paginationStep) {
            nbRequest = Math.floor(param.limit / paginationStep) + 1;
        }

        // over write the param by the store value to avoid server explosion
        param.limit = param.limit > paginationStep ? paginationStep : param.limit;
        param.limit += 1;

        param.returnValueList = listName;

        // we add the LIMIT on every get call. so to start at zero we need to go in the negative
        // Do that only when the offset is not set or equal to zero
        if (!_.isNumber(param.offset) || param.offset <= 0) {
            param.offset = (-1) * paginationStep;
        } else {
            param.offset -= paginationStep;
        }

        // mega private function to do recursive call
        // define here to not pollute global space.
        // might be a mistake
        // genintho 2012-04-05
        (function _store_get_call() {
            if (promise.state() !== 'pending') {
                return;
            }
            param.offset += paginationStep;
            API.get(param).done(function (json) {
                var subList = [];
                _.each(json[listName], function (rawItem) {
                    var resourceInstance = new resourceConstructor(rawItem);
                    resourceStore[resourceInstance.getID()] = resourceInstance;
                    fullList.push(resourceInstance);
                    subList.push(resourceInstance);
                });

                // Get transactionList might return reportList when passing "withReportList". Let's update them in the store.
                if (listName !== 'reportList' && json.reportList) {
                    _.each(json.reportList, function (reportJSON) {
                        Store.Reports._deprecatedUpdate(reportJSON);
                    });
                }

                // Notify the listener that we have some data to use
                promise.notify(subList, fullList);

                // handle pagination call
                //
                // case we want everything with the current param
                // we check the length of results to know if there is more available
                if (nbRequest === Infinity) {
                    // the request return the limit size, it must have more on the server
                    if (subList.length === param.limit) {
                        _store_get_call();
                        return;
                    }
                } else {
                    // we have a defined number of request, we need to callback
                    // only when we have done all of them or if the server odeesn't
                    // return a full set of data'
                    nbRequest--;
                    if (nbRequest > 0 && subList.length === param.limit) {
                        _store_get_call();
                        return;
                    }
                }

                // callback
                promise.resolve(_.uniq(fullList));
            }).fail(function (jsonCode, response) {
                promise.reject(jsonCode, response);
            });
        }).call();

        return promise;
    }
});