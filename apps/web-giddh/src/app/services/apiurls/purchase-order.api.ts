/** Common path for purchase order */
export const PURCHASE_ORDER = 'company/:companyUniqueName/';
/** APIs for purchase order */
export const PURCHASE_ORDER_API = {
    GET_ALL: `${PURCHASE_ORDER}purchase-order/get-all?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`,
    CREATE: `${PURCHASE_ORDER}accounts/:accountUniqueName/purchase-order/generate`,
    GET: `${PURCHASE_ORDER}purchase-order/:poUniqueName`,
    BULK_UPDATE: `${PURCHASE_ORDER}purchase-order/bulk-update?action=:action`,
    STATUS_UPDATE: `${PURCHASE_ORDER}accounts/:accountUniqueName/purchase-order/status/change`,
    DELETE: `${PURCHASE_ORDER}purchase-order?uniqueName=:poUniqueName`,
    EMAIL: `${PURCHASE_ORDER}accounts/:accountUniqueName/purchase-order/:poUniqueName/mail`,
    UPDATE: `${PURCHASE_ORDER}accounts/:accountUniqueName/purchase-order`,
    GET_PREVIEW: `${PURCHASE_ORDER}purchase-order/preview?uniqueName=:poUniqueName`,
    UPDATE_SETTINGS_EMAIL: `${PURCHASE_ORDER}purchase-bill-setting`,
    GET_ALL_VERSIONS: `${PURCHASE_ORDER}accounts/:accountUniqueName/purchase-order/versions/all?page=:page&count=:count`,
    GET_PDF: `${PURCHASE_ORDER}accounts/:accountUniqueName/purchase-order/:poUniqueName/download?fileType=base64`,
    GET_ALL_PENDING: `${PURCHASE_ORDER}accounts/:accountUniqueName/purchase-order/pending-numbers?page=:page&count=:count&sort=:sort&sortBy=:sortBy&pendingItems=true`,
    VERIFY_EMAIL: `${PURCHASE_ORDER}purchase-bill-setting/verify-email?emailAddress=:emailAddress&scope=:scope&branchUniqueName=:branchUniqueName`
}
