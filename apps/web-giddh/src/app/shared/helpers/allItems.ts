export interface AllItem {
    label: string;
    link: string;
    icon: string;
    description: string;
}

export interface AllItems {
    [label: string]: AllItem[];
}

export const allItems: AllItems[] = [
    { 
        ["Customer"]: [
            { label: 'Invoice', link: '/pages/invoice/preview/sales', icon: 'icon-invoice-new', description: 'Lorem' },
            { label: 'Estimate', link: '/pages/invoice/preview/estimates', icon: 'icon-invoice-new', description: 'Lorem' },
            { label: 'Sales Order', link: '/pages/invoice/preview/sales', icon: 'icon-sales-order1', description: 'Lorem' },
            { label: 'Customer', link: '/pages/contact/customer', icon: 'icon-invoice-new', description: 'Lorem' },
        ]
    },
    {
        ["Vendor"]: [
            { label: 'Invoice5', link: '/pages/invoice/preview/sales', icon: 'icon-invoice-new', description: 'Lorem' },
            { label: 'Invoice6', link: '/pages/invoice/preview/sales', icon: 'icon-invoice-new', description: 'Lorem' },
            { label: 'Invoice2', link: '/pages/invoice/preview/sales', icon: 'icon-invoice-new', description: 'Lorem' },
            { label: 'Invoice8', link: '/pages/invoice/preview/sales', icon: 'icon-invoice-new', description: 'Lorem' },
        ]
    }
];