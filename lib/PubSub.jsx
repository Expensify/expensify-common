import _ from 'underscore';
import has from 'lodash.has';

/**
 * PubSub
 *
 * A simple publisher subscriber system for async / decouple/ cross module communication
 */

const eventMap = {};

// Used to generate the uniq id of the event
let counter = 0;

/**
 * Create a unique ID for each event subscriber
 * @param {String} eventName Name of the event to listen to
 * @return {String} unique ID
 */
const generateID = (eventName) => {
    counter++;
    return `${eventName}@#@${counter}`;
};

/**
* Find the name of the event from the ID
* @param {string} eventID
* @return {String}
*/
const extractEventName = eventID => eventID.substr(0, eventID.indexOf('@#@'));

module.exports = {
    /**
     * Publish an event
     *
     * @param {String} eventName Name of the event to fire
     * @param {Object} [para] Parameters to send with the event, send to the callback
     */
    publish(eventName, para) {
        if (eventMap[eventName] === undefined) {
            return;
        }

        const param = para || {};
        const eventIDs = _.keys(eventMap[eventName]);

        _.each(eventIDs, (eventID) => {
            const subscriber = eventMap[eventName][eventID];
            if (subscriber) {
                subscriber.callback.call(subscriber.scope, param);
            }
        });
    },

    /**
     * Subscribes to an event and triggers the callback only once with the given scope
     *
     * @param  {String}   eventName
     * @param  {Function} callback
     * @param  {Object}   [optionalScope]
     * @returns {String}
     */
    once(eventName, callback, optionalScope) {
        const scope = _.isObject(optionalScope) ? optionalScope : window;
        const functionToCallOnce = _.once((...args) => callback.apply(scope, args));
        return this.subscribe(eventName, functionToCallOnce);
    },

    /**
     * Listen to an event and call the callback when it is done.
     * Order of callback call is not guaranteed
     *
     * "PUBLIC" event ( aka for views ) are available in lib/constant.js
     * "PRIVATE" event should be used only by system modules
     *
     * @param {String} eventName Name of the event to listen
     * @param {Function} optionalCallback Callback function to call when event occur
     * @param {Object} optionalScope
     * @return {String} event identifier that should be used to unsubscribe
     */
    subscribe(eventName, optionalCallback, optionalScope) {
        if (!eventName) {
            throw new Error('Attempted to subscribe to undefined event');
        }

        const callback = _.isFunction(optionalCallback) ? optionalCallback : () => {};
        const scope = _.isObject(optionalScope) ? optionalScope : window;
        const eventID = generateID(eventName);

        if (eventMap[eventName] === undefined) {
            eventMap[eventName] = {};
        }

        eventMap[eventName][eventID] = {
            callback,
            scope
        };

        return eventID;
    },

    /**
     * Remove a subscriber
     *
     * @param {String} bindID The id of the element to delete
     */
    unsubscribe(bindID) {
        const IDs = _.isArray(bindID) ? bindID : [bindID];
        _.each(IDs, (id) => {
            const eventName = extractEventName(id);
            if (has(eventMap, `${eventName}.${id}`)) {
                delete eventMap[eventName][id];
            }
        });
    }
};
