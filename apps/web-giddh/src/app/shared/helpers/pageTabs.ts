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
            { label: 'Company Profile', link: '/pages/settings/profile', icon: '<i class="icon-company"></i>' },
            { label: 'User Profile', link: '/pages/user-details/mobile-number', icon: '<i class="icon-user-new"></i>' },
            { label: 'Manage User (Permission)', link: '/pages/settings/permission', icon: '<i class="icon-permission1"></i>' }
        ],
        [1]: [
            { label: 'Taxes', link: '/pages/settings/taxes', icon: '<i class="icon-tax-new"></i>' },
            { label: 'Integration', link: '/pages/settings/integration', icon: '<i class="icon-integration1"></i>' },
            { label: 'Linked Accounts', link: '/pages/settings/linked-accounts', icon: '<i class="icon-account"></i>' },
            { label: 'Tags', link: '/pages/settings/tag', icon: '<i class="icon-tag-new"></i>' },
            { label: 'Trigger', link: '/pages/settings/trigger', icon: '<i class="icon-trigger-new"></i>' }
        ],
        [2]: [
            { label: 'Financial Year', link: '/pages/settings/financial-year', icon: '<i class="icon-financial-year-new"></i>' },
            { label: 'Branch', link: '/pages/settings/branch', icon: '<i class="icon-branch1"></i>' },
            { label: 'Discount', link: '/pages/settings/discount', icon: '<i class="icon-discount-new"></i>' },
            { label: 'Warehouse', link: '/pages/settings/warehouse', icon: '<i class="icon-warehouse1"></i>' }
        ],
        [3]: [
            { label: 'Invoice Management', link: '/pages/invoice/preview/settings/sales', icon: '<i class="icon-invoice-management"></i>' },
            { label: 'Subscription', link: '/pages/user-details/subscription', icon: '<i class="icon-subscription2"></i>' }
        ]
    },
    {
        [0]: [
            { label: 'Branch Profile', link: '/pages/settings/profile', icon: '<i class="icon-branch1"></i>' },
            { label: 'User Profile', link: '/pages/user-details/mobile-number', icon: '<i class="icon-user-new"></i>' },
        ],
        [1]: [
            { label: 'Taxes', link: '/pages/settings/taxes', icon: '<i class="icon-tax-new"></i>' },
            { label: 'Integration', link: '/pages/settings/integration', icon: '<i class="icon-integration1"></i>' },
            { label: 'Linked Accounts', link: '/pages/settings/linked-accounts', icon: '<i class="icon-linked-account"></i>' },
            { label: 'Tags', link: '/pages/settings/tag', icon: '<i class="icon-tag-new"></i>' },
            { label: 'Trigger', link: '/pages/settings/trigger', icon: '<i class="icon-trigger-new"></i>' }
        ],
        [2]: [
            { label: 'Discount', link: '/pages/settings/discount', icon: '<i class="icon-discount-new"></i>' },
            { label: 'Warehouse', link: '/pages/settings/warehouse', icon: '<i class="icon-warehouse1"></i>' }
        ],
        [3]: [
            { label: 'Invoice Management', link: '/pages/invoice/preview/settings/sales', icon: '<i class="icon-invoice-management"></i>' },
        ]
    }
];
