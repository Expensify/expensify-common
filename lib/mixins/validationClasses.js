import cn from 'classnames';
import * as CONST from '../CONST';

/**
 * This mixin will add two methods to a component which are uses to add
 * and remove the error class from the component. Used great with refs and
 * form elements. You can see how it is used in component/list/item/formelement.jsx
 */
export default {
    /**
     * Clear the error state of this element
     */
    clearError() {
        this.setState(this.getInitialState());
    },

    /**
     * Update the error state of this element
     *
     * @param {object} state - The current state of the component.
     * @returns {object} The updated state with modified classes.
     */
    handleErrorStateUpdate: (state) => ({
        classes: cn(state.classes, CONST.UI.ERROR),
    }),

    /**
     * Display the error state of this element
     */
    showError() {
        this.setState(this.handleErrorStateUpdate);
    },
};
