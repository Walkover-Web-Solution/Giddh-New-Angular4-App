export enum InventoryReportType {
    group = 'GROUP',
    stock = 'STOCK',
    variant = 'VARIANT',
    transaction = 'TRANSACTION'
}
export enum InventoryModuleName {
    group = 'GROUP_WISE_REPORT',
    stock = 'ITEM_WISE_REPORT',
    variant = 'VARIANT_WISE_REPORT',
    transaction = 'INVENTORY_TRANSACTION_REPORT'
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
