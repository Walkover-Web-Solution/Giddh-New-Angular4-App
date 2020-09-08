export const PURCHASE_ORDER_STATUS = {
    'open' : 'open',
    'received' : 'received',
    'partiallyReceived' : 'partially-received',
    'expired' : 'expired',
    'cancelled' : 'cancelled'
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