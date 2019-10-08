import _ from 'underscore';

export default class ExpenseRule {
    /**
     * Creates a new instance of this class.
     *
     * @param {array} ruleArray
     */
    constructor(ruleArray) {
        _.each(ruleArray, (value, key) => {
            this[key] = value;
        });
    }

    /**
     * Returns the applyWhen array associated with the passed field
     * i.e. field == category returns [field: 'category', condition: 'matches', value: 'car']
     *
     * @param {string} field
     *
     * @return {array}
     */
    getApplyWhenByField(field) {
        let returnConditions = [];
        _.each(this.applyWhen, (conditions) => {
            if (conditions.field === field) {
                returnConditions = conditions;
            }
        });
        return returnConditions;
    }

    /**
     * Get the externalID saved deep in the tax field
     *
     * @returns {string}
     */
    getExternalTaxID() {
        return this.tax.field_id_TAX.externalID || '';
    }
};
