import _ from 'underscore';

export default class ExpenseRule {
    /**
     * Creates a new instance of this class.
     *
     * @param {Array} ruleArray
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
     * @return {Object}
     */
    getApplyWhenByField(field) {
        return _.find(this.applyWhen, (conditions) => {
            return conditions.field === field;
        }) || {};
    }

    /**
     * Get the externalID saved deep in the tax field
     *
     * @returns {String}
     */
    getExternalTaxID() {
        return this.tax.field_id_TAX.externalID || '';
    }

    /**
     * Checks if the passed expense matches this expense rule
     *
     * @param {SExpense3} expense
     * @returns {boolean}
     */
    isMatch(expense) {
        let isMatch = true;
        _.each(this.applyWhen, (conditions) => {
            switch (conditions.field) {
                case 'category':
                    if (!this.checkCondition(conditions.condition, conditions.value, expense.getCategory())) {
                        isMatch = false;
                    }
                    break;
                default:
                    break;
            }
        });

        return isMatch;
    }

    /**
     * Checks the passed value against the actual based on what the condition (matches, greater, less than, etc.)
     *
     * @param {string} condition
     * @param {Mixed} ruleValue
     * @param {Mixed} transactionValue
     * @returns {boolean}
     */
    checkCondition(condition, ruleValue, transactionValue) {
        // Add more condition types (Greater than, Less than, Contains) below
        switch (condition) {
            case 'matches':
                return ruleValue === transactionValue;
            default:
                return false;
        }
    }
};
