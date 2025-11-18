export default class ExpenseRule {
    /**
     * Creates a new instance of this class.
     *
     * @param {Object|Array} ruleArray
     */
    constructor(ruleArray) {
        // It's not 100% certain that `ruleArray` is an array or an object, so support both of them so the app doesn't crash
        if (Array.isArray(ruleArray)) {
            for (const [key, value] of ruleArray.entries()) {
                this[key] = value;
            }
        } else if (ruleArray && typeof ruleArray === 'object') {
            for (const key of Object.keys(ruleArray)) {
                this[key] = ruleArray[key];
            }
        }
    }

    /**
     * Returns the applyWhen array associated with the passed field
     * i.e. field == category returns [field: 'category', condition: 'matches', value: 'car']
     *
     * @param {string} field
     *
     * @returns {Object}
     */
    getApplyWhenByField(field) {
        return this.applyWhen.find((conditions) => conditions.field === field) || {};
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
        for (const conditions of this.applyWhen) {
            switch (conditions.field) {
                case 'category':
                    if (!this.checkCondition(conditions.condition, conditions.value, expense.getCategory())) {
                        isMatch = false;
                    }
                    break;
                default:
                    break;
            }
        }

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
}
