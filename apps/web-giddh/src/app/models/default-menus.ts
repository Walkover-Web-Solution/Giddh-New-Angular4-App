import { IUlist } from './interfaces/ulist.interface';

export let NAVIGATION_ITEM_LIST_ORIGINAL: IUlist[] = [
    { type: 'MENU', name: 'Dashboard', uniqueName: '/pages/home', hasTabs: false },
    // { type: 'MENU', name: 'Journal Voucher', uniqueName: '/pages/accounting-voucher', hasTabs: false },
    { type: 'MENU', name: 'Invoice', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'sales', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'E-way bill', uniqueName: '/pages/invoice/ewaybill', hasTabs: true },
    // {type: 'MENU', name: 'E-way Generate', uniqueName: '/pages/invoice/ewaybill/create'},
    //{ type: 'MENU', name: 'Receipt', uniqueName: '/pages/invoice/receipt' },

    { type: 'MENU', name: 'Debit Note', uniqueName: '/pages/invoice/preview/debit note', additional: { tab: 'debit note', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Credit Note', uniqueName: '/pages/invoice/preview/credit note', additional: { tab: 'credit note', tabIndex: 1 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Pending', uniqueName: '/pages/invoice/preview/pending', additional: { tab: 'pending', tabIndex: 2 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Templates', uniqueName: '/pages/invoice/preview/templates', additional: { tab: 'templates', tabIndex: 3 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Settings', uniqueName: '/pages/invoice/preview/settings', additional: { tab: 'settings', tabIndex: 4 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Recurring', uniqueName: '/pages/invoice/preview/recurring', additional: { tab: 'recurring', tabIndex: 1 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Preview', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'sales', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Estimate (Beta)', uniqueName: '/pages/invoice/preview/estimates', additional: { tab: 'estimates', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Proforma', uniqueName: '/pages/invoice/preview/proformas', additional: { tab: 'proformas', tabIndex: 0 }, hasTabs: true },
    // {type: 'MENU', name: 'Invoice > Sales Order', uniqueName: '/pages/invoice/preview/sales', additional: {tab: 'salesOrder', tabIndex: 0}},

    { type: 'MENU', name: 'Daybook', uniqueName: '/pages/daybook', hasTabs: false },
    { type: 'MENU', name: 'Trial Balance', uniqueName: '/pages/trial-balance-and-profit-loss', additional: { tab: 'trial-balance', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Profit & Loss', uniqueName: '/pages/trial-balance-and-profit-loss', additional: { tab: 'profit-and-loss', tabIndex: 1 }, hasTabs: true },
    { type: 'MENU', name: 'Balance Sheet', uniqueName: '/pages/trial-balance-and-profit-loss', additional: { tab: 'balance-sheet', tabIndex: 2 }, hasTabs: true },

    { type: 'MENU', name: 'Audit Logs', uniqueName: '/pages/audit-logs', hasTabs: false },
    { type: 'MENU', name: 'All Giddh Items', uniqueName: '/pages/giddh-all-items', hasTabs: false },
    // { type: 'MENU', name: 'Taxes', uniqueName: '/pages/purchase/invoice' },
    { type: 'MENU', name: 'Inventory', uniqueName: '/pages/inventory', hasTabs: true },
    // { type: 'MENU', name: 'Inventory > Jobwork', uniqueName: '/pages/inventory/jobwork' },
    { type: 'MENU', name: 'Inventory > Manufacturing', uniqueName: '/pages/inventory/manufacturing', hasTabs: true },
    { type: 'MENU', name: 'Inventory > Report', uniqueName: '/pages/inventory/report', hasTabs: true },

    { type: 'MENU', name: 'New Inventory', uniqueName: '/pages/new-inventory', hasTabs: true },
    { type: 'MENU', name: 'New Inventory > Group Detail', uniqueName: '/pages/new-inventory/about-group-detail', hasTabs: false },
    { type: 'MENU', name: 'New Inventory > About Product Detail', uniqueName: '/pages/new-inventory/about-product-service-detail', hasTabs: false },
    { type: 'MENU', name: 'New Inventory > Create New inventory', uniqueName: '/pages/new-inventory/create-new-inventory', hasTabs: true },
    { type: 'MENU', name: 'New Inventory > About Combo Detail', uniqueName: '/pages/new-inventory/about-combo-detail', hasTabs: false },
    { type: 'MENU', name: 'New Inventory > Create Custom Field', uniqueName: '/pages/new-inventory/create-custom-field', hasTabs: false },




    { type: 'MENU', name: 'Manufacturing', uniqueName: '/pages/manufacturing/report', hasTabs: false },
    { type: 'MENU', name: 'Search', uniqueName: '/pages/search', hasTabs: false },
    { type: 'MENU', name: 'Permissions', uniqueName: '/pages/permissions/list', hasTabs: false },

    { type: 'MENU', name: 'Settings', uniqueName: '/pages/settings', hasTabs: true },
    { type: 'MENU', name: 'Settings > Taxes', uniqueName: '/pages/settings/taxes', additional: { tab: 'taxes', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Integration', uniqueName: '/pages/settings/integration', additional: { tab: 'integration', tabIndex: 1 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Linked Accounts', uniqueName: '/pages/settings/linked-accounts', additional: { tab: 'linked-accounts', tabIndex: 2 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Profile', uniqueName: '/pages/settings/profile', additional: { tab: 'profile', tabIndex: 3 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Financial Year', uniqueName: '/pages/settings/financial-year', additional: { tab: 'financial-year', tabIndex: 4 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Permission', uniqueName: '/pages/settings/permission', additional: { tab: 'permission', tabIndex: 5 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Branch', uniqueName: '/pages/settings/branch', additional: { tab: 'branch', tabIndex: 6 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Tag', uniqueName: '/pages/settings/tag', additional: { tab: 'tag', tabIndex: 7 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Trigger', uniqueName: '/pages/settings/trigger', additional: { tab: 'trigger', tabIndex: 8 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Discount', uniqueName: '/pages/settings/discount', additional: { tab: 'discount', tabIndex: 9 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Warehouse', uniqueName: '/pages/settings/warehouse', additional: { tab: 'warehouse', tabIndex: 10 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Group', uniqueName: '/pages/settings', additional: { tab: 'Group', tabIndex: 10 }, hasTabs: true },
    { type: 'MENU', name: 'Create Warehouse', uniqueName: '/pages/settings/create-warehouse', hasTabs: false },
    { type: 'MENU', name: 'Create Branch', uniqueName: '/pages/settings/create-branch', hasTabs: false },

    // { type: 'MENU', name: 'Contact', uniqueName: '/pages/contact' },
    // {type: 'MENU', name: 'Inventory In/Out', uniqueName: '/pages/inventory-in-out'},
    // { type: 'MENU', name: 'Import', uniqueName: '/pages/import', hasTabs: false },
    // { type: 'MENU', name: 'Import > Groups', uniqueName: '/pages/import/group', hasTabs: false },
    // { type: 'MENU', name: 'Import > Accounts', uniqueName: '/pages/import/account', hasTabs: false },
    // { type: 'MENU', name: 'Import > Inventory', uniqueName: '/pages/import/stock', hasTabs: false },
    // { type: 'MENU', name: 'Import > Entries', uniqueName: '/pages/import/entries', hasTabs: false },
    // { type: 'MENU', name: 'Import > Trial Balance', uniqueName: '/pages/import/trial-balance', hasTabs: false },


    { type: 'MENU', name: 'Settings > Group', uniqueName: '/pages/settings', additional: { tab: 'Group', tabIndex: 10 } },
    { type: 'MENU', name: 'Onboarding', uniqueName: '/pages/onboarding', hasTabs: false },


    { type: 'MENU', name: 'Sales Invoice', uniqueName: '/pages/proforma-invoice/invoice/sales', hasTabs: false },
    { type: 'MENU', name: 'New Purchase Bill', uniqueName: '/pages/proforma-invoice/invoice/purchase', hasTabs: false },
    { type: 'MENU', name: 'Cash Invoice ', uniqueName: '/pages/proforma-invoice/invoice/cash', hasTabs: false },
    { type: 'MENU', name: 'Proforma Invoice', uniqueName: '/pages/proforma-invoice/invoice/proformas', hasTabs: false },
    { type: 'MENU', name: 'Estimate (Beta)', uniqueName: '/pages/proforma-invoice/invoice/estimates', hasTabs: false },
    { type: 'MENU', name: 'New Credit Note', uniqueName: '/pages/proforma-invoice/invoice/credit note', hasTabs: false },
    { type: 'MENU', name: 'New Debit Note', uniqueName: '/pages/proforma-invoice/invoice/debit note', hasTabs: false },

    // { type: 'MENU', name: 'Company Import/Export', uniqueName: '/pages/company-import-export', hasTabs: false },
    { type: 'MENU', name: 'New V/S Old Invoices', uniqueName: '/pages/new-vs-old-invoices', hasTabs: false },
    { type: 'MENU', name: 'GST', uniqueName: '/pages/gstfiling', hasTabs: false },
    { type: 'MENU', name: 'Vat Report', uniqueName: '/pages/vat-report', hasTabs: false },
    { type: 'MENU', name: 'All Modules', uniqueName: '/pages/all-modules', hasTabs: false },
    { type: 'MENU', name: 'Customer', uniqueName: '/pages/contact/customer', additional: { tab: 'customer', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Vendor', uniqueName: '/pages/contact/vendor', additional: { tab: 'vendor', tabIndex: 0 }, hasTabs: false },
    { type: 'MENU', name: 'Aging Report', uniqueName: '/pages/contact/aging-report', additional: { tab: 'aging-report', tabIndex: 1 }, hasTabs: true },
    { type: 'MENU', name: 'User-Details > Api', uniqueName: '/pages/user-details/auth-key', additional: { tab: 'api', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'User-Details > Profile', uniqueName: '/pages/user-details/mobile-number', additional: { tab: 'profile', tabIndex: 1 }, hasTabs: true },
    { type: 'MENU', name: 'User-Details > Session', uniqueName: '/pages/user-details/session', additional: { tab: 'session', tabIndex: 2 }, hasTabs: true },
    { type: 'MENU', name: 'User-Details > Subscriptions', uniqueName: '/pages/user-details/subscription', additional: { tab: 'subscription', tabIndex: 3, isPlanPage: true }, hasTabs: true },


    { type: 'MENU', name: 'User-Details > Company', uniqueName: '/pages/user-details/company', additional: { tab: 'company', tabIndex: 4 }, hasTabs: true },
    { type: 'MENU', name: 'Reports > Sales Register', uniqueName: '/pages/reports/sales-register', hasTabs: false },
    { type: 'MENU', name: 'Reports > Purchase Register', uniqueName: '/pages/reports/purchase-register', hasTabs: false },
    { type: 'MENU', name: 'Reports > Monthly Columnar Report', uniqueName: '/pages/reports/monthly-columnar-report', hasTabs: false },
    { type: 'MENU', name: 'Reports > Cash Flow Statement', uniqueName: '/pages/reports/cash-flow-statement' },
    { type: 'MENU', name: 'Reports', uniqueName: '/pages/reports/reports-dashboard', hasTabs: false },
    { type: 'MENU', name: 'Petty Cash Management > Pending', uniqueName: '/pages/expenses-manager', additional: { tab: 'pending', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Petty Cash Management > Rejected', uniqueName: '/pages/expenses-manager', additional: { tab: 'rejected', tabIndex: 1 }, hasTabs: true },

    { type: 'MENU', name: 'Purchase Management', uniqueName: '/pages/purchase-management/purchase', hasTabs: false },
    { type: 'MENU', name: 'Reports > Receipt', uniqueName: '/pages/reports/receipt', hasTabs: false },

    { type: 'MENU', name: 'Purchase Management', uniqueName: '/pages/purchase-management/purchase', hasTabs: true },
    { type: 'MENU', name: 'Reports > Receipt (Beta)', uniqueName: '/pages/reports/receipt', hasTabs: false },
    // { type: 'MENU', name: 'All Modules', uniqueName: '/pages/all-modules' },
    { type: 'MENU', name: 'Purchase Management > Purchase Order', uniqueName: '/pages/purchase-management/purchase/order', hasTabs: true },
    { type: 'MENU', name: 'Purchase Management > Purchase Bill', uniqueName: '/pages/purchase-management/purchase/bill', hasTabs: true },
    { type: 'MENU', name: 'New Purchase Order', uniqueName: '/pages/purchase-management/purchase-order/new', hasTabs: false },
    { type: 'MENU', name: 'Purchase Management > Settings', uniqueName: '/pages/purchase-management/purchase/settings', hasTabs: true }
];
export let HIDE_NAVIGATION_BAR_FOR_LG_ROUTES = ['journal-voucher', 'inventory',
    'invoice/preview/sales', 'home', 'gstfiling', 'inventory-in-out',
    'ledger'];
export let DEFAULT_MENUS_ORIGINAL: IUlist[] = [
    {
        type: 'MENU', name: 'Customer', uniqueName: '/pages/contact/customer', additional: { tab: 'customer', tabIndex: 0 }, isRemoved: false, pIndex: 3, hasTabs: true
    },
    {
        type: 'MENU', name: 'GST', uniqueName: '/pages/gstfiling', isRemoved: false, pIndex: 5, hasTabs: false
    },
    {
        type: 'MENU', name: 'Vat Report', uniqueName: '/pages/vat-report', isRemoved: false, pIndex: 5, hasTabs: false
    },
    {
        type: 'MENU', name: 'Import', uniqueName: '/pages/import', isRemoved: false, pIndex: 10, hasTabs: false
    },
    {
        type: 'MENU', name: 'Inventory', uniqueName: '/pages/inventory', isRemoved: false, pIndex: 8, hasTabs: true
    },
    {
        type: 'MENU', name: 'Invoice', uniqueName: '/pages/invoice/preview/sales', isRemoved: false, pIndex: 2, additional: { tab: 'sales', tabIndex: 0 }, hasTabs: true
    },
    {
        type: 'MENU', name: 'Journal Voucher', uniqueName: '/pages/accounting-voucher', isRemoved: false, pIndex: 1
    },
    {
        type: 'MENU', name: 'Manufacturing', uniqueName: '/pages/manufacturing/report', isRemoved: false, pIndex: 9, hasTabs: true
    },
    {
        type: 'MENU', name: 'New Purchase Bill', uniqueName: '/pages/proforma-invoice/invoice/purchase', isRemoved: false, pIndex: 7, hasTabs: false
    },
    {
        type: 'MENU', name: 'Sales Invoice', uniqueName: '/pages/proforma-invoice/invoice/sales', isRemoved: false, pIndex: 6, hasTabs: false
    },
    { type: 'MENU', name: 'Vendor', uniqueName: '/pages/contact/vendor', additional: { tab: 'vendor', tabIndex: 0 }, isRemoved: false, pIndex: 4, hasTabs: false },
    { type: 'MENU', name: 'Aging Report', uniqueName: '/pages/contact/aging-report', additional: { tab: 'aging-report', tabIndex: 1 }, isRemoved: false, pIndex: 11, hasTabs: true },
    { type: 'MENU', name: 'Settings', uniqueName: '/pages/settings', isRemoved: false, pIndex: 12, hasTabs: true },
    { type: 'MENU', name: 'Settings > Warehouse', uniqueName: '/pages/settings/warehouse', additional: { tab: 'warehouse', tabIndex: 10 }, isRemoved: false, pIndex: 13, hasTabs: true },
    { type: 'MENU', name: 'Daybook', uniqueName: '/pages/daybook', isRemoved: false, pIndex: 14, hasTabs: false },
    { type: 'MENU', name: 'Purchase Management', uniqueName: '/pages/purchase-management/purchase', isRemoved: false, pIndex: 15, hasTabs: true },
    { type: 'MENU', name: 'User-Details > Profile', uniqueName: '/pages/user-details/mobile-number', additional: { tab: 'profile', tabIndex: 1 }, isRemoved: false, pIndex: 16, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Generate', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'pending', tabIndex: 2 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Templates', uniqueName: '/pages/invoice/preview/templates', additional: { tab: 'templates', tabIndex: 3 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Settings', uniqueName: '/pages/invoice/preview/settings', additional: { tab: 'settings', tabIndex: 4 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Estimate (Beta)', uniqueName: '/pages/invoice/preview/estimates', additional: { tab: 'estimates', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Proforma', uniqueName: '/pages/invoice/preview/proformas', additional: { tab: 'proformas', tabIndex: 0 }, hasTabs: true },
];
export let DEFAULT_AC_ORIGINAL = [
    { type: 'ACCOUNT', name: 'Cash', uniqueName: 'cash', hasTabs: false, time: +new Date() },
    { type: 'ACCOUNT', name: 'Sales', uniqueName: 'sales', hasTabs: false, time: +new Date() },
    { type: 'ACCOUNT', name: 'Purchase', uniqueName: 'purchases', hasTabs: false, time: +new Date() },
    { type: 'ACCOUNT', name: 'General Reserves', uniqueName: 'generalreserves', hasTabs: false, time: +new Date() },
    { type: 'ACCOUNT', name: 'Reverse Charge ', uniqueName: 'reversecharge', hasTabs: false, time: +new Date() },

];
export const DEFAULT_GROUPS_ORIGINAL = ['sundrydebtors', 'sundrycreditors', 'bankaccounts'];


export let NAVIGATION_ITEM_LIST_RESPONSIVE: IUlist[] = [
    { type: 'MENU', name: 'Settings', uniqueName: '/pages/settings', hasTabs: true },
    { type: 'MENU', name: 'Settings > Taxes', uniqueName: '/pages/settings/taxes', additional: { tab: 'taxes', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Integration', uniqueName: '/pages/settings/integration', additional: { tab: 'integration', tabIndex: 1 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Linked Accounts', uniqueName: '/pages/settings/linked-accounts', additional: { tab: 'linked-accounts', tabIndex: 2 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Profile', uniqueName: '/pages/settings/profile', additional: { tab: 'profile', tabIndex: 3 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Financial Year', uniqueName: '/pages/settings/financial-year', additional: { tab: 'financial-year', tabIndex: 4 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Permission', uniqueName: '/pages/settings/permission', additional: { tab: 'permission', tabIndex: 5 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Branch', uniqueName: '/pages/settings/branch', additional: { tab: 'branch', tabIndex: 6 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Tag', uniqueName: '/pages/settings/tag', additional: { tab: 'tag', tabIndex: 7 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Trigger', uniqueName: '/pages/settings/trigger', additional: { tab: 'trigger', tabIndex: 8 }, hasTabs: true },
    { type: 'MENU', name: 'Settings > Warehouse', uniqueName: '/pages/settings/warehouse', additional: { tab: 'warehouse', tabIndex: 10 }, hasTabs: true },
    { type: 'MENU', name: 'Create Warehouse', uniqueName: '/pages/settings/create-warehouse', hasTabs: false },
    { type: 'MENU', name: 'Create Branch', uniqueName: '/pages/settings/create-branch', hasTabs: false },
    { type: 'MENU', name: 'Customer', uniqueName: '/pages/contact/customer', additional: { tab: 'customer', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Vendor', uniqueName: '/pages/contact/vendor', additional: { tab: 'vendor', tabIndex: 0 }, hasTabs: false },
    { type: 'MENU', name: 'Aging Report', uniqueName: '/pages/contact/aging-report', additional: { tab: 'aging-report', tabIndex: 1 }, hasTabs: true },

    { type: 'MENU', name: 'Invoice', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'sales', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Generate', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'pending', tabIndex: 2 }, hasTabs: false },
    { type: 'MENU', name: 'Invoice > Templates', uniqueName: '/pages/invoice/preview/templates', additional: { tab: 'templates', tabIndex: 3 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Settings', uniqueName: '/pages/invoice/preview/settings', additional: { tab: 'settings', tabIndex: 4 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Recurring', uniqueName: '/pages/invoice/preview/recurring', additional: { tab: 'recurring', tabIndex: 1 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Preview', uniqueName: '/pages/invoice/preview/sales', additional: { tab: 'sales', tabIndex: 0 }, hasTabs: false },
    { type: 'MENU', name: 'Invoice > Estimate (Beta)', uniqueName: '/pages/invoice/preview/estimates', additional: { tab: 'estimates', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Invoice > Proforma', uniqueName: '/pages/invoice/preview/proformas', additional: { tab: 'proformas', tabIndex: 0 }, hasTabs: true },
    { type: 'MENU', name: 'Onboarding', uniqueName: '/pages/onboarding', hasTabs: false },
    { type: 'MENU', name: 'Daybook', uniqueName: '/pages/daybook', hasTabs: false },
    { type: 'MENU', name: 'New Purchase Bill ', uniqueName: '/pages/proforma-invoice/invoice/purchase', hasTabs: false },
    { type: 'MENU', name: 'Purchase Management', uniqueName: '/pages/purchase-management/purchase', hasTabs: true },
    { type: 'MENU', name: 'Reports > Receipt (Beta)', uniqueName: '/pages/reports/receipt', hasTabs: false },
    { type: 'MENU', name: 'All Modules', uniqueName: '/pages/all-modules', hasTabs: false },
    { type: 'MENU', name: 'Inventory', uniqueName: '/pages/inventory', hasTabs: true }
];
export let NAVIGATION_ITEM_LIST: IUlist[] = [];


export let DEFAULT_MENUS: IUlist[] = [];
export let DEFAULT_MENUS_RESPONSIVE: IUlist[] = [
    {
        type: 'MENU', name: 'Customer', uniqueName: '/pages/contact/customer', additional: { tab: 'customer', tabIndex: 0 }, isRemoved: false, pIndex: 3, hasTabs: true
    },
    {
        type: 'MENU', name: 'Invoice', uniqueName: '/pages/invoice/preview/sales', isRemoved: false, pIndex: 2, additional: { tab: 'sales', tabIndex: 0 }, hasTabs: true
    },
    {
        type: 'MENU', name: 'Vendor', uniqueName: '/pages/contact/vendor', additional: { tab: 'vendor', tabIndex: 0 }, isRemoved: false, pIndex: 4, hasTabs: false
    },
    {
        type: 'MENU', name: 'Settings', uniqueName: '/pages/settings', hasTabs: true
    },

    { type: 'MENU', name: 'Sales Invoice', uniqueName: '/pages/proforma-invoice/invoice/sales', hasTabs: false },
    { type: 'MENU', name: 'New Purchase Bill', uniqueName: '/pages/proforma-invoice/invoice/purchase', hasTabs: false },
    { type: 'MENU', name: 'Cash Invoice ', uniqueName: '/pages/proforma-invoice/invoice/cash', hasTabs: false },
    { type: 'MENU', name: 'Proforma Invoice', uniqueName: '/pages/proforma-invoice/invoice/proformas', hasTabs: false },
    { type: 'MENU', name: 'Estimate (Beta)', uniqueName: '/pages/proforma-invoice/invoice/estimates', hasTabs: false },
    { type: 'MENU', name: 'New Credit Note', uniqueName: '/pages/proforma-invoice/invoice/credit note', hasTabs: false },
    { type: 'MENU', name: 'New Debit Note', uniqueName: '/pages/proforma-invoice/invoice/debit note', hasTabs: false },
    { type: 'MENU', name: 'Reports > Receipt (Beta)', uniqueName: '/pages/reports/receipt', hasTabs: false }
];

export let DEFAULT_AC = [];
export let DEFAULT_AC_RESPONSIVE = [
    { type: 'ACCOUNT', name: 'Cash', uniqueName: 'cash', hasTabs: false, time: +new Date() },
    { type: 'ACCOUNT', name: 'Sales', uniqueName: 'sales', hasTabs: false, time: +new Date() },
    { type: 'ACCOUNT', name: 'Purchase', uniqueName: 'purchases', hasTabs: false, time: +new Date() },
    { type: 'ACCOUNT', name: 'General Reserves', uniqueName: 'generalreserves', hasTabs: false, time: +new Date() },
    { type: 'ACCOUNT', name: 'Reverse Charge ', uniqueName: 'reversecharge', hasTabs: false, time: +new Date() }
];

export let DEFAULT_GROUPS = [];
export let DEFAULT_GROUPS_RESPONSIVE = [];

export function reassignNavigationalArray(toAssign, isCompany, menuItems: Array<any>) {
    if (toAssign) {
        NAVIGATION_ITEM_LIST = menuItems.slice(0, 7);
        DEFAULT_MENUS = menuItems.slice(0, 7);
        DEFAULT_AC = DEFAULT_AC_RESPONSIVE;
        DEFAULT_GROUPS = DEFAULT_GROUPS_RESPONSIVE;
    } else {
        NAVIGATION_ITEM_LIST = menuItems;
        DEFAULT_MENUS = menuItems.slice(0, 10);
        DEFAULT_AC = DEFAULT_AC_ORIGINAL;
        DEFAULT_GROUPS = DEFAULT_GROUPS_ORIGINAL;
    }
}
