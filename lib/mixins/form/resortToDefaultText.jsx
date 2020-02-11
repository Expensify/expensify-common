import ReactDOM from 'react-dom';

/**
 * This mixin will add a method to set the value of the field to a default value
 */
export default {
    /**
     * Sets the value of the field to the default value if it's empty
     */
    resortToDefaultText() {
        if ($(ReactDOM.findDOMNode(this)).val() === '') {
            $(ReactDOM.findDOMNode(this)).val(this.props.resortToDefaultText);
        }
    }
};
