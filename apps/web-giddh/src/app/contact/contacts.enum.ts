/**
 * ContactsTab enumeration
 * Defines constant values for ContactsTab
 */
export enum ContactsTab {
    customer = 'CUSTOMER',
    vendor = 'VENDOR'
}
export const CONTACTS_COMMON_COLUMNS = [
    {
        "value": "closing",
        "label": "Closing",
        "checked": true
    },
    {
        "value": "contacts",
        "label": "Contacts",
        "checked": true
    },
    {
        "value": "state",
        "label": "State",
        "checked": true
    },
    {
        "value": "gstin",
        "label": "Tax Number",
        "checked": true
    },
    {
        "value": "comment",
        "label": "Comment",
        "checked": true
    }
];
/**
 * ContactsColumn enumeration
 * Defines constant values for ContactsColumn
 */
export enum ContactsColumn {
    CUSTOMER_NAME = 'customer_name',
    PARENT_GROUP = 'parent_group',
    OPENING = 'opening',
    SALES = 'sales',
    RECEIPT = 'receipt',
    CLOSING = 'closing',
    CONTACTS = 'contacts',
    GSTIN = 'gstin',
    STATE = 'state',
    COMMENT = 'comment',
    VENDOR_NAME = 'vendor_name',
    PURCHASE = 'purchase',
    PAYMENT = 'payment',
    ACTION = 'action'
}