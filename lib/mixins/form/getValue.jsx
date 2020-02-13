import ReactDOM from 'react-dom';

/**
 * This mixin will add an method to get the value from a form element
 */
export default {
    /**
     * Gets the value of the field
     *
     * @return {string}
     */
    getValue() {
        return $(ReactDOM.findDOMNode(this)).val();
    }
};
