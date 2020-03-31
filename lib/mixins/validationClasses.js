import cn from 'classnames';
import {UI} from '../CONST';

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
     * Display the error state of this element
     */
    showError() {
        this.setState(state => ({classes: cn(state.classes, UI.ERROR)}));
    }
};
