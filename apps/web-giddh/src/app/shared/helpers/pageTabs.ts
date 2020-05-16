export interface PageTab {
    label: string;
    link: string;
    image: string;
}

export interface PageTabs {
    [index: number]: PageTab[];
}

export const settingsPageTabs: PageTabs[] = [
    {
        [0]: [
            { label: 'Company Profile', link: '/pages/settings/profile', image: 'setting-icons/company-profile.svg' },
            { label: 'User Profile', link: '/pages/user-details/mobile-number', image: 'setting-icons/user.svg' },
            { label: 'Manage User(Permission)', link: '/pages/settings/permission', image: 'setting-icons/manage-user.svg' }
        ],
        [1]: [
            { label: 'Taxes', link: '/pages/settings', image: 'setting-icons/taxes.svg' },
            { label: 'Integration', link: '/pages/settings/integration', image: 'setting-icons/integration.svg' },
            { label: 'Linked Accounts', link: '/pages/settings/linked-accounts', image: 'setting-icons/linked-accounts.svg' },
            { label: 'Tags', link: '/pages/settings/tag', image: 'setting-icons/tags.svg' },
            { label: 'Trigger', link: '/pages/settings/trigger', image: 'setting-icons/trigger.svg' }
        ],
        [2]: [
            { label: 'Financial Year', link: '/pages/settings/financial-year', image: 'setting-icons/financial-year.svg' },
            { label: 'Branch', link: '/pages/settings/branch', image: 'setting-icons/branch.svg' },
            { label: 'Discount', link: '/pages/settings/discount', image: 'setting-icons/discount.svg' },
            { label: 'Warehouse', link: '/pages/settings/warehouse', image: 'setting-icons/warehouse.svg' }
        ],
        [3]: [
            { label: 'Invoice Management', link: '/pages/invoice/preview/sales', image: 'setting-icons/invoice-managment.svg' },
            { label: 'Subscription', link: '/pages/user-details/subscription', image: 'setting-icons/subscription.svg' }
        ]
    }
];
