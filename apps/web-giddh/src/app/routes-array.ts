import { Routes } from "@angular/router";
export const ROUTES: Routes = [
    { path: 'company/:companyUniqueName/dns', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./dns-records/dns-records.module') */ Promise.resolve({ default: class DummyModule {} }) },
    { path: 'download', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./download/download.module') */ Promise.resolve({ default: class DummyModule {} }) },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '404', component: null }, // Add proper 404 component later
    { path: 'app-login-success', component: null }, // Add proper component later
    { path: 'token-verify', loadChildren: () => import('./login/token-verify.module').then(module => module.TokenVerifyModule) },
    { path: 'login', loadChildren: () => import('./login/login.module').then(module => module.LoginModule) },
    { path: 'signup', loadChildren: () => import('./signup/signup.module').then(module => module.SignupModule) },
    { path: 'inventory', redirectTo: 'pages/inventory', pathMatch: 'full' },
    { path: 'inventory-in-out', redirectTo: 'pages/inventory-in-out', pathMatch: 'full' },
    { path: 'home', redirectTo: 'pages/home', pathMatch: 'full' },
    { path: 'search', redirectTo: 'pages/search', pathMatch: 'full' },
    { path: 'permissions', redirectTo: 'pages/permissions', pathMatch: 'full' },
    { path: 'settings', redirectTo: 'pages/settings', pathMatch: 'full' },
    { path: 'manufacturing', redirectTo: 'pages/manufacturing', pathMatch: 'full' },
    { path: 'about', redirectTo: 'pages/about', pathMatch: 'full' },
    { path: 'trial-balance-and-profit-loss', redirectTo: 'pages/trial-balance-and-profit-loss', pathMatch: 'full' },
    { path: 'giddh-all-items', redirectTo: 'pages/giddh-all-items', pathMatch: 'full' },
    { path: 'audit-logs', redirectTo: 'pages/audit-logs', pathMatch: 'full' },
    { path: 'activity-logs', redirectTo: 'pages/activity-logs', pathMatch: 'full' },
    { path: 'ledger/:accountUniqueName', redirectTo: 'pages/ledger/:accountUniqueName', pathMatch: 'full' },
    { path: 'dummy', loadChildren: () => import('./dummy/dummy.module').then(module => module.DummyModule) },
    { path: 'proforma-invoice', component: null }, // Add proper component later
    { path: 'user-details', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./subscription/subscription.module') */ Promise.resolve({ default: class DummyModule {} }) },
    { path: 'new-company', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./add-company/add-company-module') */ Promise.resolve({ default: class DummyModule {} }) },
    { path: 'new-company/:subscriptionId', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./add-company/add-company-module') */ Promise.resolve({ default: class DummyModule {} }) },
    { path: 'onboarding', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./onboarding/onboarding.module') */ Promise.resolve({ default: class DummyModule {} }) },
    { path: 'social-login-callback', component: null }, // Add proper component later
    { path: 'invoice', redirectTo: 'pages/invoice', pathMatch: 'full' },
    { path: 'sales', redirectTo: 'pages/sales' },
    { path: 'daybook', redirectTo: 'pages/daybook', pathMatch: 'full' },
    { path: 'purchase', redirectTo: 'pages/purchase-management', pathMatch: 'full' },
    { path: 'user-details', redirectTo: 'pages/user-details', pathMatch: 'full' },
    { path: 'ai-ocr', redirectTo: 'pages/ai-ocr', pathMatch: 'full' },
    { path: 'journal-voucher', redirectTo: 'pages/journal-voucher', pathMatch: 'full' },
    { path: 'contact', redirectTo: 'pages/contact' },
    { path: 'aging-report', redirectTo: 'pages/aging-report', pathMatch: 'full' },
    { path: 'import', redirectTo: 'pages/import', pathMatch: 'full' },
    { path: 'gstfiling', redirectTo: 'pages/gstfiling', pathMatch: 'full' },
    { path: 'company-import-export', redirectTo: 'pages/company-import-export', pathMatch: 'full' },
    { path: 'purchase/create', redirectTo: 'pages/purchase/create' },
    { path: 'new-vs-old-invoices', redirectTo: 'pages/new-vs-old-invoices', pathMatch: 'full' },
    { path: 'reports', redirectTo: 'pages/reports' },
    { path: 'proforma-invoice', redirectTo: 'pages/proforma-invoice' },
    { path: 'select-plan' },
    { path: 'mobile-restricted', redirectTo: 'mobile-restricted', pathMatch: 'full' },
    { path: 'group-name', redirectTo: 'pages/group-name', pathMatch: 'full' },
    {
        path: 'pages',
        children: [
            { path: 'home', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./home/home.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'invoice', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./invoice/invoice.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'daybook', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./daybook/daybook.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'purchase', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./purchase/purchase.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'inventory', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./inventory/inventory.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'inventory/v2', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./new-inventory/new-inventory.module') */ Promise.resolve({ default: class DummyModule {} }) },
            {
                path: 'inventory-in-out',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./inventory-in-out/inventory-in-out.module') */ Promise.resolve({ default: class DummyModule {} }),
                data: { preload: true }
            },
            { path: 'search', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./search/search.module') */ Promise.resolve({ default: class DummyModule {} }) },
            {
                path: 'trial-balance-and-profit-loss',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./financial-reports/financial-reports.module') */ Promise.resolve({ default: class DummyModule {} }),
                data: { preload: true }
            },
            { path: 'audit-logs', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./audit-logs/audit-logs.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'activity-logs', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./activity-logs/activity-logs.module') */ Promise.resolve({ default: class DummyModule {} }) },
            {
                path: 'ledger/:accountUniqueName',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./ledger/ledger.module') */ Promise.resolve({ default: class DummyModule {} }),
                data: { preload: true }
            },
            { path: 'permissions', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./permissions/permission.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'settings', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./settings/settings.module') */ Promise.resolve({ default: class DummyModule {} }) },
            {
                path: 'manufacturing',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./manufacturing/manufacturing.module') */ Promise.resolve({ default: class DummyModule {} }),
                data: { preload: true }
            },
            {
                path: 'journal-voucher',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./accounting/accounting.module') */ Promise.resolve({ default: class DummyModule {} }),
                data: { preload: true }
            },
            { path: 'contact', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./contact/contact.module') */ Promise.resolve({ default: class DummyModule {} }) },
            {
                path: 'new-vs-old-invoices',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./new-vs-old-Invoices/new-vs-old-Invoices.module') */ Promise.resolve({ default: class DummyModule {} })
            },
            { path: 'import', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./import-excel/import-excel.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'gstfiling', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./gst/gst.module') */ Promise.resolve({ default: class DummyModule {} }) },
            {
                path: 'company-import-export',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./company-import-export/company-import-export.module') */ Promise.resolve({ default: class DummyModule {} })
            },
            { path: 'reports', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./reports/reports.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'purchase-management', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./purchase/purchase.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'verify-email', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./verify-email/verify-email.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'billing-detail' },
            { path: 'billing-detail/buy-plan' },
            { path: 'downloads', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./downloads/downloads.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'custom-fields', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./custom-fields/custom-fields.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'new-company', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./add-company/add-company-module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'user-details', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./subscription/subscription.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'ai-ocr', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./ai-ocr/ai-ocr.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'new-company/:subscriptionId', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./add-company/add-company-module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'vouchers', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./vouchers/vouchers.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: 'group-name', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./group-name/group-name.module') */ Promise.resolve({ default: class DummyModule {} }) },
            { path: '**', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: '**', pathMatch: 'full' }
];
