export interface AllItem {
    label: string;
    link: string;
    icon: string;
    description: string;
    additional?: any;
    alwaysPresent?: boolean;
}

export interface AllItems {
    label: string;
    icon: string;
    link?: string;
    items: AllItem[];
}

export const ALL_ITEMS: AllItems[] = [
    {
        label: 'Customer',
        icon: 'icon-customer',
        items: [
            { label: 'Invoice', link: '/pages/invoice/preview/sales', icon: 'icon-invoice-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'sales', tabIndex: 0 } },
            { label: 'Sales Order', link: '/pages/invoice/preview/estimates', icon: 'icon-sales-order1', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'estimates', tabIndex: 0 } },
            { label: 'Customer', link: '/pages/contact/customer', icon: 'icon-customer', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'customer', tabIndex: 0 } },
            { label: 'Aging Report', link: '/pages/contact/aging-report', icon: 'icon-aging-report-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'aging-report', tabIndex: 1 } },
            { label: 'Sales Register', link: '/pages/reports/sales-register', icon: 'icon-register-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Credit Note', link: '/pages/invoice/preview/credit note', icon: 'icon-credit-note-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'credit note', tabIndex: 1 } },
            { label: 'Receipt', link: '/pages/reports/receipt', icon: 'icon-reciept-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Cash Invoice', link: '/pages/proforma-invoice/invoice/cash', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Sales Invoice', link: '/pages/proforma-invoice/invoice/sales', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' }
        ]
    },
    {
        label: 'Vendor',
        icon: 'icon-vendor',
        items: [
            { label: 'Purchase Bill', link: '/pages/proforma-invoice/invoice/purchase', icon: 'icon-invoice-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Purchase Order', link: '/pages/purchase-management/purchase/order', icon: 'icon-purchase-order', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Vendor', link: '/pages/contact/vendor', icon: 'icon-vendor', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Aging Report', link: '/pages/contact/aging-report', icon: 'icon-aging-report-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Purchase Register', link: '/pages/reports/purchase-register', icon: 'icon-register-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Debit Note', link: '/pages/invoice/preview/debit note', icon: 'icon-debit-note-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'debit note', tabIndex: 0 } }
        ]
    },
    // { TODO: After other vouchers are introduced
    //     label: 'Other',
    //     icon: 'icon-voucher',
    //     items: [

    //     ]
    // },
    {
        label: 'Inventory',
        icon: 'icon-inventory',
        items: [
            { label: 'Inventory', link: '/pages/inventory', icon: 'icon-inventory', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Manufacturing', link: '/pages/inventory/manufacturing', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Branch Transfer', link: '/pages/inventory/report', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Warehouse', link: '/pages/settings/warehouse', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' }
        ]
    },
    {
        label: 'Reports',
        icon: 'icon-voucher',
        items: [
            { label: 'Balance Sheet', link: '/pages/trial-balance-and-profit-loss', icon: 'icon-balance-sheet-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'balance-sheet', tabIndex: 2 } },
            { label: 'Profit and Loss', link: '/pages/trial-balance-and-profit-loss', icon: 'icon-proft-loss-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'profit-and-loss', tabIndex: 1 } },
            { label: 'Trial balance', link: '/pages/trial-balance-and-profit-loss', icon: 'icon-trial-balance-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'trial-balance', tabIndex: 0 } },
            { label: 'Sales Bifurcation ', link: '/pages/new-vs-old-invoices', icon: 'icon-sale-bifurcation', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Daybook', link: '/pages/daybook', icon: 'icon-daybook-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Taxes', link: '/pages/settings/taxes', icon: 'icon-tax-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'E-way bill', link: '/pages/invoice/ewaybill', icon: 'icon-eway-bill-new', description: 'Lorem ipsum dolor sit amet, consectetur' }
        ]
    },
    {
        label: 'Import',
        icon: 'icon-import',
        items: [
            { label: 'Accounts', link: '/pages/import/account', icon: 'icon-proft-loss-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Invoice', link: '/pages/import/entries', icon: 'icon-invoice-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Group', link: '/pages/import/group', icon: 'icon-group-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Import Data', link: '/pages/import/select-type', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'TALLY Import', link: '/pages/tallysync', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
        ]
    },
    {
        label: 'Other',
        icon: 'icon-other',
        items: [
            { label: 'Petty Cash', link: '/pages/expenses-manager', icon: 'icon-petty-cash', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'pending', tabIndex: 0 } },
            { label: 'Dashboard', link: '/pages/home', icon: 'icon-dashboard-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Cash Flow', link: '/pages/reports/cash-flow-statement', icon: 'icon-cash-flow-statement', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Columnar Report', link: '/pages/reports/monthly-columnar-report', icon: 'icon-monthly-columnar-report', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Reverse Charge', link: '/pages/reports/reverse-charge', icon: 'icon-reverse-charge', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Audit Log', link: '/pages/audit-logs', icon: 'icon-audit-log', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Audit Logs New', link: '/pages/audit-logs/new', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Search', link: '/pages/search', icon: 'icon-search-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Onboarding', link: '/pages/onboarding', icon: 'icon-onboarding-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Tally Import', link: '/pages/tallysync', icon: 'icon-tally-import', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Company Impex', link: '/pages/company-import-export', icon: 'icon-company-impex', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Template', link: '/pages/invoice/preview/templates/sales', icon: 'icon-template-new', description: 'Lorem ipsum dolor sit amet, consectetur', alwaysPresent: true },
            { label: 'Purchase Management', link: '/pages/purchase-management/purchase', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Journal Voucher *', link: '/pages/journal-voucher', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Settings', link: '/pages/settings', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'GSTR', link: '/pages/gstfiling', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'VAT Report', link: '/pages/vat-report', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Aging Report', link: '/pages/contact/aging-report', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
        ]
    },
    {
        label: 'Security',
        icon: '',
        items: [
            { label: 'Permissions', link: '/pages/settings/permission', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Integration', link: '/pages/settings/integration', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur' }
        ]
    },
    {
        label: 'User',
        icon: '',
        items: [
            { label: 'Profile', link: '/pages/settings/profile', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'profile', tabIndex: 3 }},
            { label: 'Subscriptions', link: '/pages/user-details/subscription', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'subscription', tabIndex: 3, isPlanPage: true } },
            { label: 'Linked Accounts', link: '/pages/settings/linked-accounts', icon: '', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'linked-accounts', tabIndex: 2 } }
        ]
    },
];
