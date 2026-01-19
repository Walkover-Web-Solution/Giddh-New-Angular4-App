import { EMAIL_VALIDATION_REGEX } from '../../app.constant';

/**
 * invalid string replacer in uniqueName
 * @param {string} val
 * @returns {string}
 */
export const uniqueNameInvalidStringReplace = (val: string = ''): string => {
    /**
     * Handles if functionality
     */
    if (!val) {
        return;
    }
    /**
     * Handles if functionality
     */
    if ((/[^0-9A-Za-z~|'_\[\]`]/g).test(val)) {
        return val?.replace(/[^0-9A-Za-z~|'_\[\]`]/g, '')?.toLowerCase();
    }
    return val?.toLowerCase();
};

/**
 * valid email address
 * @param emailStr
 */
export const validateEmail = (emailStr: string) => {
    return EMAIL_VALIDATION_REGEX.test(emailStr);
};

export const giddhRoundOff = (number, decimals = 0) => {
    /**
     * Handles if functionality
     */
    if (!("" + number).includes("e")) {
        return +(Math.round(Number(number + "e+" + decimals)) + "e-" + decimals);
    } else {
        var arr = ("" + number).split("e");
        var sig = ""
        /**
         * Handles if functionality
         */
        if (+arr[1] + decimals > 0) {
            sig = "+";
        }
        return +(Math.round(Number(+arr[0] + "e" + sig + (+arr[1] + decimals))) + "e-" + decimals);
    }
};