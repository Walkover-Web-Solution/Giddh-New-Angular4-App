export interface AllItem {
    label: string;
    link: string;
    icon: string;
    description: string;
    additional?: any;
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
            { label: 'Estimate', link: '/pages/invoice/preview/estimates', icon: 'icon-estimate-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'estimates', tabIndex: 0 } },
            { label: 'Sales Order', link: '/pages/invoice/preview/sales', icon: 'icon-sales-order1', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Customer', link: '/pages/contact/customer', icon: 'icon-customer', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'customer', tabIndex: 0 } },
            { label: 'Aging Report', link: '/pages/contact/aging-report', icon: 'icon-aging-report-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'aging-report', tabIndex: 1 } },
            { label: 'Sales Register', link: '/pages/reports/sales-register', icon: 'icon-register-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Template', link: '/pages/invoice/preview/templates/sales', icon: 'icon-template-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'templates', tabIndex: 3 } },
            { label: 'Credit Note', link: '/pages/invoice/preview/credit note', icon: 'icon-credit-note-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'credit note', tabIndex: 1 } }
        ]
    },
    {
        label: 'Vendor',
        icon: 'icon-vendor',
        items: [
            { label: 'Purchase', link: '/pages/proforma-invoice/invoice/purchase', icon: 'icon-invoice-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Purchase Order', link: '/pages/purchase-management/purchase/order', icon: 'icon-purchase-order', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Vendor', link: '/pages/contact/vendor', icon: 'icon-vendor', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Aging Report', link: '/pages/contact/aging-report', icon: 'icon-aging-report-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Purchase Register', link: '/pages/reports/purchase-register', icon: 'icon-register-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Template', link: '/pages/invoice/preview/templates/sales', icon: 'icon-template-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Debit Note', link: '/pages/invoice/preview/debit note', icon: 'icon-debit-note-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'debit note', tabIndex: 0 } }
        ]
    },
    {
        label: 'Other Voucher',
        icon: 'icon-voucher',
        items: [
            { label: 'Credit Note', link: '/pages/invoice/preview/credit note', icon: 'icon-credit-note-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'credit note', tabIndex: 1 } },
            { label: 'Debit Note', link: '/pages/invoice/preview/debit note', icon: 'icon-debit-note-new', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'debit note', tabIndex: 0 } },
            { label: 'Receipt', link: '/pages/reports/receipt', icon: 'icon-reciept-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Template', link: '/pages/invoice/preview/templates/sales', icon: 'icon-template-new', description: 'Lorem ipsum dolor sit amet, consectetur' }
        ]
    },
    {
        label: 'Inventory',
        icon: 'icon-inventory',
        link: '/pages/inventory',
        items: [  ]
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
            { label: 'Master', link: '', icon: 'icon-master-new1', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Accounts', link: '/pages/import/account', icon: 'icon-proft-loss-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Invoice', link: '/pages/import/entries', icon: 'icon-invoice-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Group', link: '/pages/import/group', icon: 'icon-group-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Trial Balance', link: '/pages/trial-balance-and-profit-loss', icon: 'icon-trial-balance-new', description: 'Lorem ipsum dolor sit amet, consectetur' }
        ]
    },
    {
        label: 'Other',
        icon: 'icon-other',
        items: [
            { label: 'Petty Cash', link: '/pages/expenses-manager?tab=pending&tabIndex=0', icon: 'icon-petty-cash', description: 'Lorem ipsum dolor sit amet, consectetur', additional: { tab: 'pending', tabIndex: 0 } },
            { label: 'Dashboard', link: '/pages/home', icon: 'icon-dashboard-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Cash Flow', link: '/pages/reports/cash-flow-statement', icon: 'icon-cash-flow-statement', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Columnar Report', link: '/pages/reports/monthly-columnar-report', icon: 'icon-monthly-columnar-report', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Reverse Charge', link: '/pages/reports/reverse-charge', icon: 'icon-reverse-charge', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Audit Log', link: '/pages/audit-logs', icon: 'icon-audit-log', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Search', link: '/pages/search', icon: 'icon-search-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Onboarding', link: '/pages/onboarding', icon: 'icon-onboarding-new', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Tally Import', link: '/pages/tallysync', icon: 'icon-tally-import', description: 'Lorem ipsum dolor sit amet, consectetur' },
            { label: 'Company Impex', link: '/pages/company-import-export', icon: 'icon-company-impex', description: 'Lorem ipsum dolor sit amet, consectetur' }
        ]
    },

];
