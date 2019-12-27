/**
 * invalid string replacer in uniqueName
 * @param {string} val
 * @returns {string}
 */
export const uniqueNameInvalidStringReplace = (val: string = ''): string => {
    if (!val) {
        return;
    }
    //  if (val) {
    //   return val.replace(/[\\/(){};:"<>#?%,+-@&$!^*]/g, '').toLowerCase();      //  /[\\/(){};:"<>#?%,+-@&$!^*]/g
    // }
    if ((/[^0-9A-Za-z~|'_\[\]`]/g).test(val)) { // /[^1-9A-Za-z~|'_]/g
        return val.replace(/[^0-9A-Za-z~|'_\[\]`]/g, '').toLowerCase();
    }
    return val.toLowerCase();
};

/**
 * base 64 to blob
 * @param b64Data
 * @param contentType
 * @param sliceSize
 */
export const base64ToBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);
        let byteNumbers = new Array(slice.length);
        let i = 0;
        while (i < slice.length) {
            byteNumbers[i] = slice.charCodeAt(i);
            i++;
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
        offset += sliceSize;
    }
    return new Blob(byteArrays, { type: contentType });
};

/**
 * valid email address
 * @param emailStr
 */
export const validateEmail = (emailStr: string) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(emailStr);
};


export const giddhRoundOff = (number, decimals = 0) => {
    return Number(`${Math.round(Number(number + 'e' + decimals))}e-${decimals}`);
};
