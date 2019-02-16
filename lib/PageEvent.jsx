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
module.exports = class {
    constructor(eventName, callback) {
        this.id = null;
        this.eventName = eventName;
        this.callback = callback;
    }

    subscribe(scope) {
        this.id = PubSub.subscribe(this.eventName, this.callback, scope);
    }

    unsubscribe() {
        PubSub.unsubscribe(this.id);
        this.id = null;
    }
};
