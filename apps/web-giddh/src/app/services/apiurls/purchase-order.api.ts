/** Common path for purchase order */
export const PURCHASE_ORDER = 'company/:companyUniqueName/';
/** APIs for purchase order */
export const PURCHASE_ORDER_API = {
    GET_ALL: `${PURCHASE_ORDER}purchase-order/get-all?from=:from&to=:to&page=:page&count=:count&q=:q&sort=:sort&sortBy=:sortBy`
}
