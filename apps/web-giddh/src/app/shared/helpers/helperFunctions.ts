import { EMAIL_VALIDATION_REGEX } from '../../app.constant';

/**
 * invalid string replacer in uniqueName
 * @param {string} val
 * @returns {string}
 */
export const uniqueNameInvalidStringReplace = (val: string = ''): string => {
    if (!val) {
        return;
    }
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

export const giddhRoundOff = (number, decimals = 0, returnAsString: boolean = true) => {
    let roundedNumber;
    if (!("" + number).includes("e")) {
        roundedNumber = +(Math.round(Number(number + "e+" + decimals)) + "e-" + decimals);
    } else {
        const arr = ("" + number).split("e");
        let sig = "";
        if (+arr[1] + decimals > 0) {
            sig = "+";
        }
        roundedNumber = +(Math.round(Number(+arr[0] + "e" + sig + (+arr[1] + decimals))) + "e-" + decimals);
    }

    if (returnAsString) {
        return roundedNumber.toFixed(decimals);
    }

    return roundedNumber;
};
