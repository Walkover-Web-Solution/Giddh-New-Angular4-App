/**
 * invalid string replacer in uniqueName
 * @param {string} val
 * @returns {string}
 */
export const uniqueNameInvalidStringReplace = (val: string): string => {
  return val.replace(/[\\/(){};:"<>#?%, ]/g, '').toLowerCase();
};
