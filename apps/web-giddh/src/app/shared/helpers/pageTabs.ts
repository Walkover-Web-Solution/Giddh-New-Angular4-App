export interface PageTab {
    label: string;
    link: string;
    icon: string;
}

export interface PageTabs {
    [index: number]: PageTab[];
}

export const settingsPageTabs: PageTabs[] = [
    {
        [0]: [
            { label: 'Company Profile', link: '/pages/settings/profile', icon: '<i class="icon-company-profile"></i>' },
            { label: 'User Profile', link: '/pages/user-details/mobile-number', icon: '<i class="icon-user"></i>' },
            { label: 'Manage User(Permission)', link: '/pages/settings/permission', icon: '<i class="icon-manage-user"></i>' }
        ],
        [1]: [
            { label: 'Taxes', link: '/pages/settings/taxes', icon: '<i class="icon-taxes"></i>' },
            { label: 'Integration', link: '/pages/settings/integration', icon: '<i class="icon-integration font-12"></i>' },
            { label: 'Linked Accounts', link: '/pages/settings/linked-accounts', icon: '<i class="icon-linked-accounts"></i>' },
            { label: 'Tags', link: '/pages/settings/tag', icon: '<i class="icon-tags"></i>' },
            { label: 'Trigger', link: '/pages/settings/trigger', icon: '<i class="icon-trigger"></i>' }
        ],
        [2]: [
            { label: 'Financial Year', link: '/pages/settings/financial-year', icon: '<i class="icon-financial-year"></i>' },
            { label: 'Branch', link: '/pages/settings/branch', icon: '<i class="icon-branch"></i>' },
            { label: 'Discount', link: '/pages/settings/discount', icon: '<i class="icon-discount"></i>' },
            { label: 'Warehouse', link: '/pages/settings/warehouse', icon: '<i class="icon-warehouse"></i>' }
        ],
        [3]: [
            { label: 'Invoice Management', link: '/pages/invoice/preview/sales', icon: '<i class="icon-invoice-managment"></i>' },
            { label: 'Subscription', link: '/pages/user-details/subscription', icon: '<i class="icon-subscription"></i>' }
        ]
    }
];
