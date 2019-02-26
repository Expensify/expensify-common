import _ from 'underscore';
import Str from './str';

module.exports = {
    notExponential(num) {
        const numStr = num.toString();

        // If this number isn't exponential already, just return it.
        if (numStr.indexOf('e') === -1) {
            return num;
        }

        const numArr = numStr.split(/e\+/);
        let exponent = parseInt(numArr[1], 10);
        let value = parseFloat(numArr[0]);

        // Convert the number into the largest possible non-exponent.
        exponent -= 20;
        value *= 10 ** 20;

        // Now we make it into a string and start appending '0's
        value = value.toString();
        while (exponent--) {
            value += '0';
        }

        return value;
    },

    /**
     * Format a number, similar to PHP's number_format.
     *
     * @param {Number} a The number you want to format
     * @param {Number} [b="0"] The number of decimal places you want
     * @param {String} [c=","] The decimal separator
     * @param {String} [d="."] The thousands separator
     *
     * @todo should be camelCase.
     * @return {String}
     */
    number_format(a, b = 0, c = '.', d = ',') {
        let sign = '';
        let e = null;
        let f = null;
        let g = null;
        let h = null;
        let i = null;
        let j = null;

        a = Math.round(a * (10 ** b)) / (10 ** b);

        if (a < 0) {
            a *= -1;
            sign = '-';
        }
        e = String(this.notExponential(a));
        f = e.split('.');
        if (!f[0]) {
            f[0] = '0';
        }

        if (!f[1]) {
            f[1] = '';
        }

        if (f[1].length < b) {
            g = f[1];
            for (i = f[1].length + 1; i <= b; i++) {
                g += '0';
            }
            f[1] = g;
        }
        if (d !== '' && f[0].length > 3) {
            h = f[0];
            f[0] = '';
            for (j = 3; j < h.length; j += 3) {
                i = h.slice(h.length - j, h.length - j + 3);
                f[0] = `${d}${i}${f[0]}`;
            }
            j = h.substr(0, (h.length % 3 === 0) ? 3 : (h.length % 3));
            f[0] = j + f[0];
        }
        c = (b <= 0) ? '' : c;
        return `${sign}${f[0]}${c}${f[1]}`;
    },

    generateRandom6DigitID() {
        return Math.floor(Math.random() * 900000) + 100000; // 100000 - 999999
    },

    /**
     * Converts a number to base 26 (using capital english letters as digits).
     *
     * @param {Number} num The number to convert to base 26.
     *
     * @returns {String} The number, converted to base 26.
     */
    toBase26LetterCode(num) {
        const base26Digits = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const outputDigits = [];

        for (let i = num; i >= 0; i = Math.floor(i / 26) - 1) {
            outputDigits.push(base26Digits.charAt(i % 26));
        }

        return outputDigits.reverse().join('');
    },

    /**
     * Check if a number is finite and not NaN. i.e.
     * @param {number} number The number to test
     * @returns {Boolean} true if the number is finite and not NaN.
     */
    isFiniteNumber(number) {
        return _.isNumber(number) && _.isFinite(number) && !_.isNaN(number);
    },

    /**
     * Truncates the given number to the given precision.
     * @param {number} number the number to truncate.
     * @param {number} decimals the number of decimals to keep.
     * @return {number} the truncated number.
     */
    toPrecision(number, decimals) {
        const numeral = 10 ** decimals;
        return Math.round(number * numeral) / numeral;
    },

    /**
     * Check if a number is between 2 numbers, including them.
     * @param {number} number to check
     * @param {number} a the 1st limit
     * @param {number} b the 2nd limit
     * @return {boolean}
     */
    isNumberBetween(number, a, b) {
        return number >= (Math.min(a, b)) && number <= (Math.max(a, b));
    },

    tax: {

        /**
         * Calculate the pre-tax, or net amount
         * @param {Number} total The total to calculate from, in negative cents
         * @param {UserDefinedField} taxUDF The tax UDF
         * @returns {number} The pre-tax amount, in negative cents
         */
        calculatePreTaxAmount(total, taxUDF) {
            return total - taxUDF.getTaxAmount(total);
        },

        /**
         * Calculate the tax amount from the total.
         * @param {Number} total The total to calculate from
         * @param {String} percentage The percentage, as a string, e.g. '20%'
         * @returns {number} The amount of tax
         */
        calculateTaxFromPercentage(total, percentage) {
            const divisor = percentage ? (Str.percentageStringToNumber(percentage) / 100) + 1 : 1;
            return this.calculateTaxFromDivisor(total, divisor);
        },

        /**
         * Calculate the tax amount from a divisor.
         * @param {Number} total The total to calculate from
         * @param {Number} divisor The divisor (0.1 = 10%)
         * @returns {number} The amount of tax
         */
        calculateTaxFromDivisor(total, divisor) {
            const roundedQuotient = Math.round(total / divisor);
            return parseInt(total - roundedQuotient, 10);
        }
    }
};
