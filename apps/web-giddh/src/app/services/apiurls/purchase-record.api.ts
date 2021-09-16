/** Common path for purcha */
export const PURCHASE_RECORD = 'company/:companyUniqueName/accounts/:accountUniqueName/';
/** APIs for purchase record */
export const PURCHASE_RECORD_API = {
    GENERATE: `${PURCHASE_RECORD}purchase-record/generate`,
    DOWNLOAD_ATTACHMENT: `${PURCHASE_RECORD}purchase-record/download-file`,
    VALIDATE_RECORD: `${PURCHASE_RECORD}purchase-record/validate`,
    UPDATE: `${PURCHASE_RECORD}purchase-record`,
    DELETE: `company/:companyUniqueName/purchase-record?uniqueName=:uniqueName`,
    GET_ALL_VERSIONS: `${PURCHASE_RECORD}purchase-record/versions/all?page=:page&count=:count`,
    EMAIL: `${PURCHASE_RECORD}purchase-record/:uniqueName/mail`,
    GET_PDF: `${PURCHASE_RECORD}purchase-record/:uniqueName/download?fileType=base64`,
    V2: {
        DOWNLOAD_ATTACHMENT: `${PURCHASE_RECORD}vouchers/download-file?fileType=base64`,
        GET_PDF: `${PURCHASE_RECORD}vouchers/download?fileType=base64`
    }
}
