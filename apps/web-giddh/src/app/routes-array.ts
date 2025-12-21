import { Routes } from "@angular/router";
import { DummyModule } from "./dummy/dummy.module";

export const ROUTES: Routes = [
    { path: 'company/:companyUniqueName/dns', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./dns-records/dns-records.module') */ Promise.resolve(DummyModule) },
    { path: 'download', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./download/download.module') */ Promise.resolve(DummyModule) },
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
    { path: 'user-details', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./subscription/subscription.module') */ Promise.resolve(DummyModule) },
    { path: 'new-company', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./add-company/add-company-module') */ Promise.resolve(DummyModule) },
    { path: 'new-company/:subscriptionId', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./add-company/add-company-module') */ Promise.resolve(DummyModule) },
    { path: 'onboarding', loadChildren: () => import('./onboarding/onboarding.module').then(module => module.OnboardingModule) },
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
            { path: 'home', loadChildren: () => import('./home/home.module').then(module => module.HomeModule) },
            { path: 'invoice', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./invoice/invoice.module') */ Promise.resolve(DummyModule) },
            { path: 'daybook', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./daybook/daybook.module') */ Promise.resolve(DummyModule) },
            { path: 'purchase', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./purchase/purchase.module') */ Promise.resolve(DummyModule) },
            { path: 'inventory', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./inventory/inventory.module') */ Promise.resolve(DummyModule) },
            { path: 'inventory/v2', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./new-inventory/new-inventory.module') */ Promise.resolve(DummyModule) },
            {
                path: 'inventory-in-out',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./inventory-in-out/inventory-in-out.module') */ Promise.resolve(DummyModule),
                data: { preload: true }
            },
            { path: 'search', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./search/search.module') */ Promise.resolve(DummyModule) },
            {
                path: 'trial-balance-and-profit-loss',
                loadChildren: () => import('./financial-reports/financial-reports.module').then(module => module.FinancialReportsModule),
                data: { preload: true }
            },
            { path: 'audit-logs', loadChildren: () => import('./audit-logs/audit-logs.module').then(module => module.AuditLogsModule) },
            { path: 'activity-logs', loadChildren: () =>  import('./activity-logs/activity-logs.module').then(module => module.ActivityLogsModule) },
            {
                path: 'ledger/:accountUniqueName',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./ledger/ledger.module') */ Promise.resolve(DummyModule),
                data: { preload: true }
            },
            { path: 'permissions', loadChildren: () => import('./permissions/permission.module').then(module => module.PermissionModule) },
            { path: 'settings', loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule) },
            {
                path: 'manufacturing',
                loadChildren: () => import('./manufacturing/manufacturing.module').then(module => module.ManufacturingModule),
                data: { preload: true }
            },
            {
                path: 'journal-voucher',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./accounting/accounting.module') */ Promise.resolve(DummyModule),
                data: { preload: true }
            },
            { path: 'contact', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./contact/contact.module') */ Promise.resolve(DummyModule) },
            {path: 'new-vs-old-invoices',
                loadChildren: () => import('./new-vs-old-Invoices/new-vs-old-Invoices.module').then(module => module.NewVsOldInvoicesModule)},
            { path: 'import', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./import-excel/import-excel.module') */ Promise.resolve(DummyModule) },
            { path: 'gstfiling', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./gst/gst.module') */ Promise.resolve(DummyModule) },
            {
                path: 'company-import-export',
                loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./company-import-export/company-import-export.module') */ Promise.resolve(DummyModule)
            },
            { path: 'reports', loadChildren: () => import('./reports/reports.module').then(module => module.ReportsModule) },
            { path: 'purchase-management', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./purchase/purchase.module') */ Promise.resolve(DummyModule) },
            { path: 'verify-email', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./verify-email/verify-email.module') */ Promise.resolve(DummyModule) },
            { path: 'billing-detail' },
            { path: 'billing-detail/buy-plan' },
            { path: 'downloads', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./downloads/downloads.module') */ Promise.resolve(DummyModule) },
            { path: 'custom-fields', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./custom-fields/custom-fields.module') */ Promise.resolve(DummyModule) },
            { path: 'new-company', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./add-company/add-company-module') */ Promise.resolve(DummyModule) },
            { path: 'user-details', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./subscription/subscription.module') */ Promise.resolve(DummyModule) },
            { path: 'ai-ocr', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./ai-ocr/ai-ocr.module') */ Promise.resolve(DummyModule) },
            { path: 'new-company/:subscriptionId', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./add-company/add-company-module') */ Promise.resolve(DummyModule) },
            { path: 'vouchers', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./vouchers/vouchers.module') */ Promise.resolve(DummyModule) },
            { path: 'group-name', loadChildren: () => /* COMMENTED OUT - MISSING MODULE: import('./group-name/group-name.module') */ Promise.resolve(DummyModule) },
            { path: '**', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: '**', pathMatch: 'full' }
];
