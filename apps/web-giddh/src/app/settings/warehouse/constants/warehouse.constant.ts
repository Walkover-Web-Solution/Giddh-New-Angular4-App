export const WAREHOUSE_API = {
    CREATE: 'company/:companyUniqueName/warehouse',
    UPDATE: 'company/:companyUniqueName/warehouse/:warehouseUniqueName',
    FETCH: 'company/:companyUniqueName/warehouse?page=:page&refresh=true',
    SET_DEFAULT_WAREHOUSE: 'company/:companyUniqueName/warehouse/:warehouseUniqueName/default',
    GET_WAREHOUSE_DETAILS: 'company/:companyUniqueName/warehouse/:warehouseUniqueName',
    UPDATE_WAREHOUSE_STATUS: 'company/:companyUniqueName/warehouse/:warehouseUniqueName'
}
