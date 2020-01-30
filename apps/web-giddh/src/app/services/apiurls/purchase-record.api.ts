/** Common path for purcha */
export const PURCHASE_RECORD = 'company/:companyUniqueName/accounts/:accountUniqueName/';
/** APIs for purchase record */
export const PURCHASE_RECORD_API = {
    GENERATE: `${PURCHASE_RECORD}purchase-record/generate`,
    DOWNLOAD_ATTACHMENT: `${PURCHASE_RECORD}purchase-record/download-file`,
    VALIDATE_RECORD: `${PURCHASE_RECORD}purchase-record/validate`,
    UPDATE: `${PURCHASE_RECORD}purchase-record`,
    DELETE: `company/:companyUniqueName/purchase-record?uniqueName=:uniqueName`
}
