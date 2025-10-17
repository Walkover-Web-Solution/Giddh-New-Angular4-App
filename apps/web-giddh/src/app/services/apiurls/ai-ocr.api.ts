const UNIVERSAL_URI_OCR = 'company/:companyUniqueName/imports';

export const AI_OCR_API = {
    GET_ALL_DOCUMENTS: UNIVERSAL_URI_OCR + '/all-document?branchUniqueName=:branchUniqueName&page=:page&count=:count&from=:from&to=:to&sort=:sort&sortBy=:sortBy',
    UPLOAD_DOCUMENTS: UNIVERSAL_URI_OCR + '/signed-url?fileName=:fileName&branchUniqueName=:branchUniqueName',
    IMPORT: UNIVERSAL_URI_OCR + '/document/upload?type=DOCUMENT_IMPORT&branchUniqueName=:branchUniqueName',
    COMPLETED_COUNT: 'company/:companyUniqueName/completed-document-count?voucherVersion=2&branchUniqueName=:branchUniqueName',
    EXTRACT_DOCUMENTS: 'company/:companyUniqueName/ocr-data?currentToken=:currentToken&nextToken=:nextToken&voucherVersion=2'
};