import PubSubModule from '../PubSub';
import * as Utils from '../utils';

const PubSub = (Utils.isWindowAvailable() && window.PubSub) || PubSubModule;

/**
 * This mixin sets up automatic PubSub bindings which will be removed when
 * the component is unmounted.
 *
 * Usage:
 * MyView = window.CreateClass({
 *     mixins: [React.m.PubSub],
 *     componentDidMount() {
 *         this.subscribe('event_name', () => {
 *             console.log('event was triggered');
 *         });
 *     }
 * });
 */
const PubSubMixin = {
    UNSAFE_componentWillMount() {
        this.eventIds = [];
    },

    /**
     * Registers an event listener for a PubSub event and keeps track of the event ID
     * @param  {String}   name
     * @param  {Function} callback
     */
    subscribe(name, callback) {
        this.eventIds.push(PubSub.subscribe(name, callback, this));
    },

    /**
     * Publish an event
     * @param  {String} name
     * @param  {Object} [data]
     */
    publish(name, data) {
        PubSub.publish(name, data || {});
    },

    /**
     * When the component is unmounted, we want to subscribe from all of our event IDs
     */
    componentWillUnmount() {
        this.eventIds.forEach((eventId) => {
            PubSub.unsubscribe(eventId);
        });
    },
};

export default PubSubMixin;
