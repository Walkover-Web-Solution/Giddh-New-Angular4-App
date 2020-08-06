/** Common path for purchase order */
export const PURCHASE_ORDER = 'company/:companyUniqueName/';
/** APIs for purchase order */
export const PURCHASE_ORDER_API = {
    GET_ALL: `${PURCHASE_ORDER}purchase-order/get-all?from=:from&to=:to&page=:page&count=:count&sort=:sort&sortBy=:sortBy`,
    CREATE: `${PURCHASE_ORDER}accounts/:accountUniqueName/purchase-order/generate`,
    GET: `${PURCHASE_ORDER}purchase-order/:purchaseOrderUniqueName`,
    BULK_UPDATE: `${PURCHASE_ORDER}purchase-order/bulk-update?action=:action`,
    STATUS_UPDATE: `${PURCHASE_ORDER}accounts/:accountUniqueName/purchase-order/status/change`,
    DELETE: `${PURCHASE_ORDER}purchase-order?uniqueName=:poUniqueName`
}
