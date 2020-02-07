import { IUlist } from './interfaces/ulist.interface';

export let NAVIGATION_ITEM_LIST_ORIGINAL: IUlist[] = [
    { type: 'MENU', name: 'Dashboard', uniqueName: '/pages/home' },
    { type: 'MENU', name: 'Journal Voucher', uniqueName: '/pages/accounting-voucher' },
    { type: 'MENU', name: 'Invoice', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'sales', tabIndex: 0 } },
    { type: 'MENU', name: 'E-way bill', uniqueName: '/pages/invoice/ewaybill' },
    // {type: 'MENU', name: 'E-way Generate', uniqueName: '/pages/invoice/ewaybill/create'},
    { type: 'MENU', name: 'Receipt', uniqueName: '/pages/invoice/receipt' },

    { type: 'MENU', name: 'Debit Note', uniqueName: '/pages/invoice/preview/debit note', additional: { tab: 'debit note', tabIndex: 0 } },
    { type: 'MENU', name: 'Credit Note', uniqueName: '/pages/invoice/preview/credit note', additional: { tab: 'credit note', tabIndex: 1 } },
    { type: 'MENU', name: 'Invoice > Pending', uniqueName: '/pages/invoice/preview/pending', additional: { tab: 'pending', tabIndex: 2 } },
    { type: 'MENU', name: 'Invoice > Templates', uniqueName: '/pages/invoice/preview/templates', additional: { tab: 'templates', tabIndex: 3 } },
    { type: 'MENU', name: 'Invoice > Settings', uniqueName: '/pages/invoice/preview/settings', additional: { tab: 'settings', tabIndex: 4 } },
    { type: 'MENU', name: 'Invoice > Recurring', uniqueName: '/pages/invoice/preview/recurring', additional: { tab: 'recurring', tabIndex: 1 } },
    { type: 'MENU', name: 'Invoice > Preview', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'sales', tabIndex: 0 } },
    { type: 'MENU', name: 'Invoice > Estimate (Beta)', uniqueName: '/pages/invoice/preview/estimates', additional: { tab: 'estimates', tabIndex: 0 } },
    { type: 'MENU', name: 'Invoice > Proforma', uniqueName: '/pages/invoice/preview/proformas', additional: { tab: 'proformas', tabIndex: 0 } },
    // {type: 'MENU', name: 'Invoice > Sales Order', uniqueName: '/pages/invoice/preview/sales', additional: {tab: 'salesOrder', tabIndex: 0}},

    { type: 'MENU', name: 'Daybook', uniqueName: '/pages/daybook' },
    { type: 'MENU', name: 'Trial Balance', uniqueName: '/pages/trial-balance-and-profit-loss', additional: { tab: 'trial-balance', tabIndex: 0 } },
    { type: 'MENU', name: 'Profit & Loss', uniqueName: '/pages/trial-balance-and-profit-loss', additional: { tab: 'profit-and-loss', tabIndex: 1 } },
    { type: 'MENU', name: 'Balance Sheet', uniqueName: '/pages/trial-balance-and-profit-loss', additional: { tab: 'balance-sheet', tabIndex: 2 } },
    { type: 'MENU', name: 'Audit Logs', uniqueName: '/pages/audit-logs' },

    // { type: 'MENU', name: 'Taxes', uniqueName: '/pages/purchase/invoice' },
    { type: 'MENU', name: 'Inventory', uniqueName: '/pages/inventory' },
    // { type: 'MENU', name: 'Inventory > Jobwork', uniqueName: '/pages/inventory/jobwork' },
    { type: 'MENU', name: 'Inventory > Manufacturing', uniqueName: '/pages/inventory/manufacturing' },
    { type: 'MENU', name: 'Inventory > Report', uniqueName: '/pages/inventory/report' },

    { type: 'MENU', name: 'Manufacturing', uniqueName: '/pages/manufacturing/report' },
    { type: 'MENU', name: 'Search', uniqueName: '/pages/search' },
    { type: 'MENU', name: 'Permissions', uniqueName: '/pages/permissions/list' },

    { type: 'MENU', name: 'Settings', uniqueName: '/pages/settings' },
    { type: 'MENU', name: 'Settings > Taxes', uniqueName: '/pages/settings/taxes', additional: { tab: 'taxes', tabIndex: 0 } },
    { type: 'MENU', name: 'Settings > Integration', uniqueName: '/pages/settings/integration', additional: { tab: 'integration', tabIndex: 1 } },
    { type: 'MENU', name: 'Settings > Linked Accounts', uniqueName: '/pages/settings/linked-accounts', additional: { tab: 'linked-accounts', tabIndex: 2 } },
    { type: 'MENU', name: 'Settings > Profile', uniqueName: '/pages/settings/profile', additional: { tab: 'profile', tabIndex: 3 } },
    { type: 'MENU', name: 'Settings > Financial Year', uniqueName: '/pages/settings/financial-year', additional: { tab: 'financial-year', tabIndex: 4 } },
    { type: 'MENU', name: 'Settings > Permission', uniqueName: '/pages/settings/permission', additional: { tab: 'permission', tabIndex: 5 } },
    { type: 'MENU', name: 'Settings > Branch', uniqueName: '/pages/settings/branch', additional: { tab: 'branch', tabIndex: 6 } },
    { type: 'MENU', name: 'Settings > Tag', uniqueName: '/pages/settings/tag', additional: { tab: 'tag', tabIndex: 7 } },
    { type: 'MENU', name: 'Settings > Trigger', uniqueName: '/pages/settings/trigger', additional: { tab: 'trigger', tabIndex: 8 } },
    { type: 'MENU', name: 'Settings > Discount', uniqueName: '/pages/settings/discount', additional: { tab: 'discount', tabIndex: 9 } },
    { type: 'MENU', name: 'Settings > Warehouse', uniqueName: '/pages/settings/warehouse', additional: { tab: 'warehouse', tabIndex: 10 } },
    { type: 'MENU', name: 'Settings > Group', uniqueName: '/pages/settings', additional: { tab: 'Group', tabIndex: 10 } },

    // { type: 'MENU', name: 'Contact', uniqueName: '/pages/contact' },
    // {type: 'MENU', name: 'Inventory In/Out', uniqueName: '/pages/inventory-in-out'},
    { type: 'MENU', name: 'Import', uniqueName: '/pages/import' },
    { type: 'MENU', name: 'Import > Groups', uniqueName: '/pages/import/group' },
    { type: 'MENU', name: 'Import > Accounts', uniqueName: '/pages/import/account' },
    { type: 'MENU', name: 'Import > Inventory', uniqueName: '/pages/import/stock' },
    { type: 'MENU', name: 'Import > Entries', uniqueName: '/pages/import/entries' },
    { type: 'MENU', name: 'Import > Trial Balance', uniqueName: '/pages/import/trial-balance' },


    { type: 'MENU', name: 'Settings > Group', uniqueName: '/pages/settings', additional: { tab: 'Group', tabIndex: 10 } },
    { type: 'MENU', name: 'Onboarding', uniqueName: '/pages/onboarding' },


    { type: 'MENU', name: 'Sales Invoice', uniqueName: '/pages/proforma-invoice/invoice/sales' },
    { type: 'MENU', name: 'Purchase Record ', uniqueName: '/pages/proforma-invoice/invoice/purchase' },
    { type: 'MENU', name: 'Cash Invoice ', uniqueName: '/pages/proforma-invoice/invoice/cash' },
    { type: 'MENU', name: 'Proforma Invoice', uniqueName: '/pages/proforma-invoice/invoice/proformas' },
    { type: 'MENU', name: 'Estimate (Beta)', uniqueName: '/pages/proforma-invoice/invoice/estimates' },
    { type: 'MENU', name: 'New Credit Note', uniqueName: '/pages/proforma-invoice/invoice/credit note' },
    { type: 'MENU', name: 'New Debit Note', uniqueName: '/pages/proforma-invoice/invoice/debit note' },

    { type: 'MENU', name: 'Company Import/Export', uniqueName: '/pages/company-import-export' },
    { type: 'MENU', name: 'New V/S Old Invoices', uniqueName: '/pages/new-vs-old-invoices' },
    { type: 'MENU', name: 'GST', uniqueName: '/pages/gstfiling' },
    { type: 'MENU', name: 'Vat Report', uniqueName: '/pages/vat-report' },
    { type: 'MENU', name: 'Import Data from TALLY', uniqueName: '/pages/tallysync' },
    // { type: 'MENU', name: 'Aging Report', uniqueName: '/pages/aging-report'},
    { type: 'MENU', name: 'Customer', uniqueName: '/pages/contact/customer', additional: { tab: 'customer', tabIndex: 0 } },
    { type: 'MENU', name: 'Vendor', uniqueName: '/pages/contact/vendor', additional: { tab: 'vendor', tabIndex: 0 } },
    { type: 'MENU', name: 'Aging Report', uniqueName: '/pages/contact/aging-report', additional: { tab: 'aging-report', tabIndex: 1 } },
    { type: 'MENU', name: 'User-Details > Api', uniqueName: '/pages/user-details/auth-key', additional: { tab: 'api', tabIndex: 0 } },
    { type: 'MENU', name: 'User-Details > Profile', uniqueName: '/pages/user-details/mobile-number', additional: { tab: 'profile', tabIndex: 1 } },
    { type: 'MENU', name: 'User-Details > Session', uniqueName: '/pages/user-details/session', additional: { tab: 'session', tabIndex: 2 } },
    { type: 'MENU', name: 'User-Details > Subscriptions', uniqueName: '/pages/user-details/subscription', additional: { tab: 'subscription', tabIndex: 3, isPlanPage: true } },
    { type: 'MENU', name: 'User-Details > Company', uniqueName: '/pages/user-details/company', additional: { tab: 'company', tabIndex: 4 } },
    { type: 'MENU', name: 'Reports > Sales Register', uniqueName: '/pages/reports/sales-register' },
    { type: 'MENU', name: 'Reports > Purchase Register', uniqueName: '/pages/reports/purchase-register' },
    { type: 'MENU', name: 'Reports', uniqueName: '/pages/reports/reports-dashboard' },
    { type: 'MENU', name: 'Petty Cash Management > Pending', uniqueName: '/pages/expenses-manager', additional: { tab: 'pending', tabIndex: 0 } },
    { type: 'MENU', name: 'Petty Cash Management > Rejected', uniqueName: '/pages/expenses-manager', additional: { tab: 'rejected', tabIndex: 1 } },

    { type: 'MENU', name: 'Purchase Management', uniqueName: '/pages/purchase-management/purchase' },
];
export let HIDE_NAVIGATION_BAR_FOR_LG_ROUTES = ['accounting-voucher', 'inventory',
    'invoice/preview/sales', 'home', 'gstfiling', 'inventory-in-out',
    'ledger'];
export let DEFAULT_MENUS_ORIGINAL: IUlist[] = [
    {
        type: 'MENU', name: 'Customer', uniqueName: '/pages/contact/customer', additional: { tab: 'customer', tabIndex: 0 }, isRemoved: false, pIndex: 3
    },
    {
        type: 'MENU', name: 'GST', uniqueName: '/pages/gstfiling', isRemoved: false, pIndex: 5
    },
    {
        type: 'MENU', name: 'Vat Report', uniqueName: '/pages/vat-report', isRemoved: false, pIndex: 5
    },
    {
        type: 'MENU', name: 'Import', uniqueName: '/pages/import', isRemoved: false, pIndex: 10
    },
    {
        type: 'MENU', name: 'Inventory', uniqueName: '/pages/inventory', isRemoved: false, pIndex: 8
    },
    {
        type: 'MENU', name: 'Invoice', uniqueName: '/pages/invoice/preview/sales', isRemoved: false, pIndex: 2, additional: { tab: 'sales', tabIndex: 0 }
    },
    {
        type: 'MENU', name: 'Journal Voucher', uniqueName: '/pages/accounting-voucher', isRemoved: false, pIndex: 1
    },
    {
        type: 'MENU', name: 'Manufacturing', uniqueName: '/pages/manufacturing/report', isRemoved: false, pIndex: 9
    },
    {
        type: 'MENU', name: 'Purchase Record ', uniqueName: '/pages/proforma-invoice/invoice/purchase', isRemoved: false, pIndex: 7
    },
    {
        type: 'MENU', name: 'Sales Invoice', uniqueName: '/pages/proforma-invoice/invoice/sales', isRemoved: false, pIndex: 6
    },
    {
        type: 'MENU', name: 'Vendor', uniqueName: '/pages/contact/vendor', additional: { tab: 'vendor', tabIndex: 0 }, isRemoved: false, pIndex: 4
    }
];
export let DEFAULT_AC_ORIGINAL = [
    { type: 'ACCOUNT', name: 'Cash', uniqueName: 'cash' },
    { type: 'ACCOUNT', name: 'Sales', uniqueName: 'sales' },
    { type: 'ACCOUNT', name: 'Purchase', uniqueName: 'purchases' },
    { type: 'ACCOUNT', name: 'General Reserves', uniqueName: 'generalreserves' },
    { type: 'ACCOUNT', name: 'Reverse Charge ', uniqueName: 'reversecharge' },

];
export const DEFAULT_GROUPS_ORIGINAL = ['sundrydebtors', 'sundrycreditors', 'bankaccounts'];


export let NAVIGATION_ITEM_LIST_RESPONSIVE: IUlist[] = [
    { type: 'MENU', name: 'Settings', uniqueName: '/pages/settings' },
    { type: 'MENU', name: 'Settings > Taxes', uniqueName: '/pages/settings/taxes', additional: { tab: 'taxes', tabIndex: 0 } },
    { type: 'MENU', name: 'Settings > Integration', uniqueName: '/pages/settings/integration', additional: { tab: 'integration', tabIndex: 1 } },
    { type: 'MENU', name: 'Settings > Linked Accounts', uniqueName: '/pages/settings/linked-accounts', additional: { tab: 'linked-accounts', tabIndex: 2 } },
    { type: 'MENU', name: 'Settings > Profile', uniqueName: '/pages/settings/profile', additional: { tab: 'profile', tabIndex: 3 } },
    { type: 'MENU', name: 'Settings > Financial Year', uniqueName: '/pages/settings/financial-year', additional: { tab: 'financial-year', tabIndex: 4 } },
    { type: 'MENU', name: 'Settings > Permission', uniqueName: '/pages/settings/permission', additional: { tab: 'permission', tabIndex: 5 } },
    { type: 'MENU', name: 'Settings > Branch', uniqueName: '/pages/settings/branch', additional: { tab: 'branch', tabIndex: 6 } },
    { type: 'MENU', name: 'Settings > Tag', uniqueName: '/pages/settings/tag', additional: { tab: 'tag', tabIndex: 7 } },
    { type: 'MENU', name: 'Settings > Trigger', uniqueName: '/pages/settings/trigger', additional: { tab: 'trigger', tabIndex: 8 } },
    { type: 'MENU', name: 'Settings > Warehouse', uniqueName: '/pages/settings/warehouse', additional: { tab: 'warehouse', tabIndex: 10 } },

    { type: 'MENU', name: 'Customer', uniqueName: '/pages/contact/customer', additional: { tab: 'customer', tabIndex: 0 } },
    { type: 'MENU', name: 'Vendor', uniqueName: '/pages/contact/vendor', additional: { tab: 'vendor', tabIndex: 0 } },
    { type: 'MENU', name: 'Aging Report', uniqueName: '/pages/contact/aging-report', additional: { tab: 'aging-report', tabIndex: 1 } },

    { type: 'MENU', name: 'Invoice', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'sales', tabIndex: 0 } },
    { type: 'MENU', name: 'Invoice > Generate', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'pending', tabIndex: 2 } },
    { type: 'MENU', name: 'Invoice > Templates', uniqueName: '/pages/invoice/preview/templates', additional: { tab: 'templates', tabIndex: 3 } },
    { type: 'MENU', name: 'Invoice > Settings', uniqueName: '/pages/invoice/preview/settings', additional: { tab: 'settings', tabIndex: 4 } },
    { type: 'MENU', name: 'Invoice > Recurring', uniqueName: '/pages/invoice/preview/recurring', additional: { tab: 'recurring', tabIndex: 1 } },
    { type: 'MENU', name: 'Invoice > Preview', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'sales', tabIndex: 0 } },
    { type: 'MENU', name: 'Invoice > Estimate (Beta)', uniqueName: '/pages/invoice/preview/estimates', additional: { tab: 'estimates', tabIndex: 0 } },
    { type: 'MENU', name: 'Invoice > Proforma', uniqueName: '/pages/invoice/preview/proformas', additional: { tab: 'proformas', tabIndex: 0 } },
    { type: 'MENU', name: 'Onboarding', uniqueName: '/pages/onboarding' },
    { type: 'MENU', name: 'Daybook', uniqueName: '/pages/daybook' },
    { type: 'MENU', name: 'Purchase Record ', uniqueName: '/pages/proforma-invoice/invoice/purchase' },
    { type: 'MENU', name: 'Purchase Management', uniqueName: '/pages/purchase-management/purchase' },

];
export let NAVIGATION_ITEM_LIST: IUlist[] = [];


export let DEFAULT_MENUS: IUlist[] = [];
export let DEFAULT_MENUS_RESPONSIVE: IUlist[] = [
    {
        type: 'MENU', name: 'Customer', uniqueName: '/pages/contact/customer', additional: { tab: 'customer', tabIndex: 0 }, isRemoved: false, pIndex: 3
    },
    {
        type: 'MENU', name: 'Invoice', uniqueName: '/pages/invoice/preview/sales', isRemoved: false, pIndex: 2, additional: { tab: 'sales', tabIndex: 0 }
    },
    {
        type: 'MENU', name: 'Vendor', uniqueName: '/pages/contact/vendor', additional: { tab: 'vendor', tabIndex: 0 }, isRemoved: false, pIndex: 4
    },
    {
        type: 'MENU', name: 'Settings', uniqueName: '/pages/settings'
    },

    { type: 'MENU', name: 'Sales Invoice', uniqueName: '/pages/proforma-invoice/invoice/sales' },
    { type: 'MENU', name: 'Purchase Record ', uniqueName: '/pages/proforma-invoice/invoice/purchase' },
    { type: 'MENU', name: 'Cash Invoice ', uniqueName: '/pages/proforma-invoice/invoice/cash' },
    { type: 'MENU', name: 'Proforma Invoice', uniqueName: '/pages/proforma-invoice/invoice/proformas' },
    { type: 'MENU', name: 'Estimate (Beta)', uniqueName: '/pages/proforma-invoice/invoice/estimates' },
    { type: 'MENU', name: 'New Credit Note', uniqueName: '/pages/proforma-invoice/invoice/credit note' },
    { type: 'MENU', name: 'New Debit Note', uniqueName: '/pages/proforma-invoice/invoice/debit note' }
];

export let DEFAULT_AC = [];
export let DEFAULT_AC_RESPONSIVE = [
    { type: 'ACCOUNT', name: 'Cash', uniqueName: 'cash' },
    { type: 'ACCOUNT', name: 'Sales', uniqueName: 'sales' },
    { type: 'ACCOUNT', name: 'Purchase', uniqueName: 'purchases' },
    { type: 'ACCOUNT', name: 'General Reserves', uniqueName: 'generalreserves' },
    { type: 'ACCOUNT', name: 'Reverse Charge ', uniqueName: 'reversecharge' }
];

export let DEFAULT_GROUPS = [];
export let DEFAULT_GROUPS_RESPONSIVE = [];

export function reassignNavigationalArray(toAssign) {
    if (toAssign) {
        NAVIGATION_ITEM_LIST = NAVIGATION_ITEM_LIST_RESPONSIVE;
        DEFAULT_MENUS = DEFAULT_MENUS_RESPONSIVE;
        DEFAULT_AC = DEFAULT_AC_RESPONSIVE;
        DEFAULT_GROUPS = DEFAULT_GROUPS_RESPONSIVE;
    } else {
        NAVIGATION_ITEM_LIST = NAVIGATION_ITEM_LIST_ORIGINAL;
        DEFAULT_MENUS = DEFAULT_MENUS_ORIGINAL;
        DEFAULT_AC = DEFAULT_AC_ORIGINAL;
        DEFAULT_GROUPS = DEFAULT_GROUPS_ORIGINAL;
    }
}
