const UNIVERSAL_URI_OCR = 'company/:companyUniqueName/imports';

export const AI_OCR_API = {
    GET_ALL_DOCUMENTS: `${UNIVERSAL_URI_OCR}/all-document?branchUniqueName=:branchUniqueName&page=:page&count=:count&from=:from&to=:to&sort=:sort&sortBy=:sortBy&ocrType=:ocrType`,
    UPLOAD_DOCUMENTS: `${UNIVERSAL_URI_OCR}/signed-url?fileName=:fileName&branchUniqueName=:branchUniqueName`,
    IMPORT: `${UNIVERSAL_URI_OCR}/document/upload?type=DOCUMENT_IMPORT&branchUniqueName=:branchUniqueName&ocrType=:ocrType`,
    COMPLETED_COUNT: 'company/:companyUniqueName/completed-document-count?voucherVersion=2&branchUniqueName=:branchUniqueName&ocrType=:ocrType',
    EXTRACT_DOCUMENTS: 'company/:companyUniqueName/ocr-data?currentToken=:currentToken&nextToken=:nextToken&voucherVersion=2&voucherType=:voucherType&requestId=:requestId&ocrType=:ocrType'
};
