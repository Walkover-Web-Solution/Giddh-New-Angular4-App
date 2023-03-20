export enum InventoryReportType {
    group = 'GROUP',
    stock = 'STOCK',
    variant = 'VARIANT'
}
export const INVENTORY_COMMON_COLUMNS = [
    {
        "value": "opening_quantity",
        "label": "Opening Stock Qty",
        "checked": true
    },
    {
        "value": "opening_amount",
        "label": "Opening Stock Value",
        "checked": true
    },
    {
        "value": "inward_quantity",
        "label": "Inward Quantity",
        "checked": true
    },
    {
        "value": "inward_amount",
        "label": "Inward Value",
        "checked": true
    },
    {
        "value": "outward_quantity",
        "label": "Outward Qty",
        "checked": true
    },
    {
        "value": "outward_amount",
        "label": "Outward Amount",
        "checked": true
    },
    {
        "value": "closing_quantity",
        "label": "Closing Qty",
        "checked": true
    },
    {
        "value": "closing_amount",
        "label": "Closing Value",
        "checked": true
    }
];
export enum InventoryModuleName {
    group = 'CUSTOMER',
    stock = 'VENDOR',
    variant = 'SALES_REGISTER'
}
