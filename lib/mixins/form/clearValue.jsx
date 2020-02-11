import Func from '../../Func';
import ReactDOM from 'react-dom';

/**
 * This mixin will provide a method to clear out the value of a form element
 */
export default {
    /**
     * Clears the value of the field
     * @param {bool} [shouldFocus] default true
     */
    clearValue(shouldFocus) {
        const $elm = $(ReactDOM.findDOMNode(this));
        $elm.val('');
        if (shouldFocus !== false) {
            $elm.focus();
        }
        Func.invoke(this.props.forcedUpdate);
    }
};
