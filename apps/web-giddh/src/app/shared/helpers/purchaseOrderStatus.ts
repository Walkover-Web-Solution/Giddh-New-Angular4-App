export const PURCHASE_ORDER_STATUS = {
    'open': 'open',
    'received': 'received',
    'partiallyReceived': 'partially-received',
    'expired': 'expired',
    'cancelled': 'cancelled'
}

export const BULK_UPDATE_FIELDS = {
    'purchasedate': 'purchasedate',
    'duedate': 'duedate',
    'warehouse': 'warehouse',
    'expire': 'expire',
    'delete': 'delete',
    'create_purchase_bill': 'create_purchase_bill'
}

export interface PurchaseOrderStatus {
    value: string;
    label: string;
}

export const purchaseOrderStatus: PurchaseOrderStatus[] = [
    { label: 'Open', value: PURCHASE_ORDER_STATUS.open },
    { label: 'Received', value: PURCHASE_ORDER_STATUS.received },
    { label: 'Partially Received', value: PURCHASE_ORDER_STATUS.partiallyReceived },
    { label: 'Expired', value: PURCHASE_ORDER_STATUS.expired },
    { label: 'Cancelled', value: PURCHASE_ORDER_STATUS.cancelled }
];
