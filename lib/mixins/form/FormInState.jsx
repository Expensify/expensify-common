import _ from 'underscore';

/**
 * This mixin give methods to set form values in the state when they change, and allow to get them all at once then.
 *
 * You can use it rather than React.c.Form for one of these reasons:
 * - You can access your input current values directly from the state. No need to create any refs on the elements.
 * - Because values are in the state, it will automatically re-render any other DOM elements depending on these values.
 * - You can create a more complex DOM hierarchy, while seeing clearly the html in your view, instead of a json.
 *
 * Use it this way:
 *
 * View:
 *
 * ```
 * React.v.Example = window.CreateClass({
 *     mixins: [React.m.FormInState],
 *
 *     getInitialState() {
 *         return {
 *             form: {
 *                 input1: ''
 *             }
 *         };
 *     },
 *
 *     render() {
 *         return (
 *             <form>
 *                 <input type="text" onChange={e => this.setFormValue('input1', e.target.value)} />
 *             </form>
 *         );
 *     }
 * });
 * ```
 *
 * Controller:
 *
 * ```
 * // Return an object with key value of all the form elements. Ex: {input1: 'toto'}
 * const formValues = view.getFormValues();
 * ```
 */
export default {

    /**
     * Add a form value to the state.
     * @param {string} key
     * @param {string} value
     * @param {number} [i] if multiple values to add to an array
     */
    setFormValue(key, value, i) {
        const form = this.state.form || {};

        if (_.isNumber(i)) {
            form[key] = _.isObject(form[key]) ? form[key] : {};
            form[key][i] = value;
        } else {
            form[key] = value;
        }

        this.setState({form});
    },

    /**
     * Get form values from state.
     * @return {object}
     */
    getFormValues() {
        return this.state.form;
    }
};
