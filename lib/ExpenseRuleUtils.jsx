import _ from 'underscore';

module.exports = {
    isMatch(expense, rule) {
        let isMatch = true;
        _.each(rule.applyWhen, (conditions) => {
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
    },

    checkCondition(condition, ruleValue, transactionValue) {
        // Add more condition types (Greater than, Less than, Contains) below
        switch (condition) {
            case 'matches':
                return ruleValue === transactionValue;
            default:
                break;
        }

        return false;
    },
};
