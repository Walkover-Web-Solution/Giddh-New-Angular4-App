const UNIVERSAL_URI_OCR = 'company/:companyUniqueName/imports';

export const OCR_VOUCHER_API = {
    GET_ALL_DOCUMENTS: UNIVERSAL_URI_OCR + '/all-document?branchUniqueName=:branchUniqueName&page=:page&count=:count&from=:from&to=:to&sort=:sort&sortBy=:sortBy',
    UPLOAD_DOCUMENTS: UNIVERSAL_URI_OCR + '/signed-url?fileName=:fileName&branchUniqueName=:branchUniqueName',
    IMPORT: UNIVERSAL_URI_OCR + '/document/upload?type=DOCUMENT_IMPORT&branchUniqueName=:branchUniqueName',
    COMPLETED_COUNT: UNIVERSAL_URI_OCR + '/completed-document-count?voucherVersion=2&branchUniqueName=:branchUniqueName'
};

