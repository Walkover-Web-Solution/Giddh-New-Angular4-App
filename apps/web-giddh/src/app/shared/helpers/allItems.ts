export interface AllItem {
    label: string;
    link: string;
    icon: string;
    description: string;
    alwaysPresent?: boolean;
    additional?: any;
}

export interface AllItems {
    label: string;
    icon: string;
    items: AllItem[];
    link?: string;
    isActive?: boolean;
}

export const ALL_ITEMS: AllItems[] = [
    {
        label: 'Customer',
        icon: 'icon-customer',
        items: [
            { label: 'Aging Report', link: '/pages/contact/aging-report', icon: 'icon-aging-report-new', description: 'Amount Due in previous days & upcoming', additional: { tab: 'aging-report', tabIndex: 1 } },
            { label: 'Cash Invoice', link: '/pages/proforma-invoice/invoice/cash', icon: 'icon-invoice-new', description: 'Generate cash invoice' },
            { label: 'Credit Note', link: '/pages/invoice/preview/credit note', icon: 'icon-credit-note-new', description: 'Generate credit note & update A/c' },
            { label: 'Customer', link: '/pages/contact/customer', icon: 'icon-customer', description: 'Manage customers, send reminders via SMS/Email', additional: { tab: 'customer', tabIndex: 0 } },
            { label: 'Invoice', link: '/pages/invoice/preview/sales', icon: 'icon-invoice-new', description: 'Multicurrency, Recurring invoice, Cash invoice' },
            { label: 'Receipt', link: '/pages/reports/receipt', icon: 'icon-reciept-new', description: 'Advance, normal, total, & unused receipts' },
            { label: 'Sales Invoice', link: '/pages/proforma-invoice/invoice/sales', icon: 'icon-invoice-new', description: 'Generate sales invoice' },
            { label: 'Sales Order', link: '/pages/invoice/preview/estimates', icon: 'icon-sales-order1', description: 'Final sales order' },
<<<<<<< HEAD
            { label: 'Sales Register', link: '/pages/reports/sales-register', icon: 'icon-register-new', description: 'Net & cumulative sales' },
=======
            { label: 'Sales Register', link: '/pages/reports/sales-register', icon: 'icon-register-new', description: 'Net & cumulative sales weekly/monthly/quarterly' },
>>>>>>> 6fcc28e47a... correct image path
            { label: 'Template', link: '/pages/invoice/preview/templates/sales', icon: 'icon-template', description: 'Edit design & content of the template', alwaysPresent: true }
        ]
    },
    {
        label: 'Import',
        icon: 'icon-import',
        items: [
            { label: 'Accounts', link: '/pages/import/account', icon: 'icon-proft-loss-new', description: 'Import excel and CSV and update existing one' },
            { label: 'Group', link: '/pages/import/group', icon: 'icon-group-new', description: 'Import excel and CSV and update existing one' },
            { label: 'Entries', link: '/pages/import/entries', icon: 'icon-invoice-new', description: 'Multicurrency, Recurring invoice, Cash invoice' },
            { label: 'Inventory', link: '/pages/import/stock', icon: 'icon-inventory', description: 'Import/create stock, group & unit' },
            { label: 'Trial Balance', link: '/pages/import/trial-balance', icon: 'icon-trial-balance-new', description: 'Import all credit & debit balances' },
            { label: 'TALLY Import', link: '/pages/tallysync', icon: 'icon-tally-import1', description: 'Check your synced Tally data online' },
        ]
    },
    {
        label: 'Inventory',
        icon: 'icon-inventory',
        items: [
            { label: 'Branch Transfer', link: '/pages/inventory/report', icon: 'icon-branch-transfer', description: 'Manage & Transfer inventory' },
            { label: 'Inventory', link: '/pages/inventory', icon: 'icon-inventory', description: 'Import/create stock, group & unit' },
            { label: 'Manufacturing', link: '/pages/inventory/manufacturing', icon: 'icon-manufacturing1', description: 'Find mfg. inventory status' },
            { label: 'Warehouse', link: '/pages/settings/warehouse', icon: 'icon-warehouse1', description: 'See all the warehouses' }
        ]
    },
    {
        label: 'Other',
        icon: 'icon-other',
        items: [
            { label: 'Audit Log', link: '/pages/audit-logs', icon: 'icon-audit-log', description: 'Chronological data of entries' },
            { label: 'Audit Logs New', link: '/pages/audit-logs/new', icon: 'icon-audit-log', description: 'Chronological data of entries' },
            { label: 'Cash Flow', link: '/pages/reports/cash-flow-statement', icon: 'icon-cash-flow-statement', description: 'Download cash flow report' },
            { label: 'Columnar Report', link: '/pages/reports/monthly-columnar-report', icon: 'icon-monthly-columnar-report', description: 'Monthly detailed report of each group' },
            { label: 'Company Impex', link: '/pages/company-import-export', icon: 'icon-company-impex', description: 'Company import & export' },
            { label: 'Dashboard', link: '/pages/home', icon: 'icon-dashboard-new', description: 'Overdues, P&L, Bank account, Ratio Analysis' },
            { label: 'GSTR', link: '/pages/gstfiling', icon: 'icon-GSTR', description: 'File & view GSTR1, GSTR2 & GSTR3B' },
            { label: 'Journal Voucher *', link: '/pages/journal-voucher', icon: 'icon-journal-voucher-new', description: 'Entries of Journal Voucher' },
            { label: 'Onboarding', link: '/pages/onboarding', icon: 'icon-onboarding-new', description: 'Import data from Tally, CSV/Excel' },
            { label: 'Petty Cash', link: '/pages/expenses-manager', icon: 'icon-petty-cash', description: 'Manage petty cash & transaction', additional: { tab: 'pending', tabIndex: 0 } },
            { label: 'Search', link: '/pages/search', icon: 'icon-search-new', description: 'Select group and search for a time span' },
            { label: 'Settings', link: '/pages/settings', icon: 'icon-settings-cog', description: 'Add & manage various taxes' },
            { label: 'VAT Report', link: '/pages/vat-report', icon: 'icon-vat', description: 'File & review VAT' },
        ]
    },
    {
        label: 'Reports',
        icon: 'icon-reports',
        items: [
            { label: 'Balance Sheet', link: '/pages/trial-balance-and-profit-loss', icon: 'icon-balance-sheet-new', description: 'Download BS in Excel, multiple type of exports', additional: { tab: 'balance-sheet', tabIndex: 2 } },
            { label: 'Daybook', link: '/pages/daybook', icon: 'icon-daybook-new', description: 'Everyday entries that can be exported' },
            { label: 'E-way bill', link: '/pages/invoice/ewaybill', icon: 'icon-eway-bill-new', description: 'Generate directly from Giddh after' },
            { label: 'Profit and Loss', link: '/pages/trial-balance-and-profit-loss', icon: 'icon-proft-loss-new', description: 'Download data in Excel, project wise report', additional: { tab: 'profit-loss', tabIndex: 1 } },
            { label: 'Sales Bifurcation ', link: '/pages/new-vs-old-invoices', icon: 'icon-sale-bifurcation', description: 'Compare new versus old invoices' },
            { label: 'Reverse Charge', link: '/pages/reports/reverse-charge', icon: 'icon-reverse-charge', description: 'Report of total taxable value & total tax amount', alwaysPresent: true },
            { label: 'Trial balance', link: '/pages/trial-balance-and-profit-loss', icon: 'icon-trial-balance-new', description: 'Download of all credit & debit balances', additional: { tab: 'trial-balance', tabIndex: 0 } },
        ]
    },
    {
        label: 'Security',
        icon: 'icon-security',
        items: [
            { label: 'Integration', link: '/pages/settings/integration', icon: 'icon-integration1', description: 'Integrate for SMS, Email, Ecom, reconciliation' },
            { label: 'Permissions', link: '/pages/settings/permission', icon: 'icon-permission1', description: 'Select role, pages, CIDR range' },
        ]
    },
    {
        label: 'User',
        icon: 'icon-user-new',
        items: [
            { label: 'Linked Accounts', link: '/pages/settings/linked-accounts', icon: 'icon-linked-account', description: 'Connect bank for CCavenue & Razor pay', additional: { tab: 'linked-accounts', tabIndex: 2 } },
            { label: 'Profile', link: '/pages/settings/profile', icon: 'icon-permission1', description: 'Personal info and addresses associated', additional: { tab: 'profile', tabIndex: 3 }},
            { label: 'Subscriptions', link: '/pages/user-details/subscription', icon: 'icon-subscription2', description: 'About the plan', additional: { tab: 'subscription', tabIndex: 3, isPlanPage: true } },
        ]
    },
    {
        label: 'Vendor',
        icon: 'icon-vendor',
        items: [
            { label: 'Debit Note', link: '/pages/invoice/preview/debit note', icon: 'icon-debit-note-new', description: 'Record debit note & update A/c' },
            { label: 'Purchase Bill', link: '/pages/proforma-invoice/invoice/purchase', icon: 'icon-invoice-new', description: 'Purchase request, purchase bill, modify PO' },
            { label: 'Purchase Management', link: '/pages/purchase-management/purchase/bill', icon: 'icon-purchase-management1', description: 'Purchase request, purchase bill, modify PO' },
            { label: 'Purchase Order', link: '/pages/purchase-management/purchase-order/new', icon: 'icon-purchase-order', description: 'Purchase request, purchase bill, modify PO' },
            { label: 'Purchase Register', link: '/pages/reports/purchase-register', icon: 'icon-register-new', description: 'Net & cumulative purchases' },
            { label: 'Vendor', link: '/pages/contact/vendor', icon: 'icon-vendor', description: 'Send Bulk SMS/Emails, Set reminders' },
        ]
    },
    // { TODO: After other vouchers are introduced
    //     label: 'Other',
    //     icon: 'icon-voucher',
    //     items: [

    //     ]
    // },
];
