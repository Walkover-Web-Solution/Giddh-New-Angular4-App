const common = 'company/:companyUniqueName/imports/reconciliation';

export const BANK_RECONCILIATION_API = {
    GET_ALL: common,
    UPLOAD: common + '/upload',
    PROCESS: common + '/process'
};
