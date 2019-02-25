import PubSub from './PubSub';

/**
 * Event object used by page to do internal logic.
 * Used with the method pageSubscribe and pageUnSubscribe
 * of the PubSub for automatic clean up of pages events
 *
 * @param {String} eventName Name of the event to listen to
 * @param {Function} callback Function to fire
 * @constructor
 */
module.exports = function (eventName, callback) {
    let id = null;
    return {
        subscribe(scope) {
            id = PubSub.subscribe(eventName, callback, scope);
        },
        unsubscribe() {
            PubSub.unsubscribe(id);
            id = null;
        }
    };
};
