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


export const giddhRoundOff = (number, decimals = 0) => {
    return (!isNaN(Number(`${Math.round(Number(number + 'e' + decimals))}e-${decimals}`))) ? Number(`${Math.round(Number(number + 'e' + decimals))}e-${decimals}`) : 0;
};
