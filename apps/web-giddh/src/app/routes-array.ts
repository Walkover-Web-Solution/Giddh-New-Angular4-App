import { Routes } from "@angular/router";
export const ROUTES: Routes = [
    { path: 'company/:companyUniqueName/dns', loadChildren: () => import('./dns-records/dns-records.module').then(module => module.DnsRecordsModule) },
    { path: 'download', loadChildren: () => import('./download/download.module').then(module => module.DownloadModule) },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '404' },
    { path: 'app-login-success' },
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
    { path: 'proforma-invoice' },
    { path: 'user-details', loadChildren: () => import('./subscription/subscription.module').then(module => module.SubscriptionModule) },
    { path: 'new-company', loadChildren: () => import('./add-company/add-company-module').then(module => module.AddcompanyModule) },
    { path: 'new-company/:subscriptionId', loadChildren: () => import('./add-company/add-company-module').then(module => module.AddcompanyModule) },
    { path: 'onboarding', loadChildren: () => import('./onboarding/onboarding.module').then(module => module.OnboardingModule) },
    { path: 'social-login-callback' },
    { path: 'invoice', redirectTo: 'pages/invoice', pathMatch: 'full' },
    { path: 'sales', redirectTo: 'pages/sales' },
    { path: 'daybook', redirectTo: 'pages/daybook', pathMatch: 'full' },
    { path: 'purchase', redirectTo: 'pages/purchase-management', pathMatch: 'full' },
    { path: 'user-details', redirectTo: 'pages/user-details', pathMatch: 'full' },
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
    {
        path: 'pages',
        children: [
            { path: 'home', loadChildren: () => import('./home/home.module').then(module => module.HomeModule) },
            { path: 'invoice', loadChildren: () => import('./invoice/invoice.module').then(module => module.InvoiceModule) },
            { path: 'daybook', loadChildren: () => import('./daybook/daybook.module').then(module => module.DaybookModule) },
            { path: 'purchase', loadChildren: () => import('./purchase/purchase.module').then(module => module.PurchaseModule) },
            { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(module => module.InventoryModule) },
            { path: 'inventory/v2', loadChildren: () => import('./new-inventory/new-inventory.module').then(module => module.NewInventoryModule) },
            {
                path: 'inventory-in-out',
                loadChildren: () => import('./inventory-in-out/inventory-in-out.module').then(module => module.InventoryInOutModule),
                data: { preload: true }
            },
            { path: 'search', loadChildren: () => import('./search/search.module').then(module => module.SearchModule) },
            {
                path: 'trial-balance-and-profit-loss',
                loadChildren: () => import('./financial-reports/financial-reports.module').then(module => module.FinancialReportsModule),
                data: { preload: true }
            },
            { path: 'audit-logs', loadChildren: () => import('./audit-logs/audit-logs.module').then(module => module.AuditLogsModule) },
            { path: 'activity-logs', loadChildren: () => import('./activity-logs/activity-logs.module').then(module => module.ActivityLogsModule) },
            {
                path: 'ledger/:accountUniqueName',
                loadChildren: () => import('./ledger/ledger.module').then(module => module.LedgerModule),
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
                loadChildren: () => import('./accounting/accounting.module').then(module => module.AccountingModule),
                data: { preload: true }
            },
            { path: 'contact', loadChildren: () => import('./contact/contact.module').then(module => module.ContactModule) },
            {
                path: 'new-vs-old-invoices',
                loadChildren: () => import('./new-vs-old-Invoices/new-vs-old-Invoices.module').then(module => module.NewVsOldInvoicesModule)
            },
            { path: 'import', loadChildren: () => import('./import-excel/import-excel.module').then(module => module.ImportExcelModule) },
            { path: 'gstfiling', loadChildren: () => import('./gst/gst.module').then(module => module.GstModule) },
            {
                path: 'company-import-export',
                loadChildren: () => import('./company-import-export/company-import-export.module').then(module => module.CompanyImportExportModule)
            },
            { path: 'reports', loadChildren: () => import('./reports/reports.module').then(module => module.ReportsModule) },
            { path: 'purchase-management', loadChildren: () => import('./purchase/purchase.module').then(module => module.PurchaseModule) },
            { path: 'verify-email', loadChildren: () => import('./verify-email/verify-email.module').then(module => module.VerifyEmailModule) },
            { path: 'billing-detail' },
            { path: 'billing-detail/buy-plan' },
            { path: 'voucher', loadChildren: () => import('./payment-receipt/payment-receipt.module').then(module => module.PaymentReceiptModule) },
            { path: 'downloads', loadChildren: () => import('./downloads/downloads.module').then(module => module.DownloadsModule) },
            { path: 'custom-fields', loadChildren: () => import('./custom-fields/custom-fields.module').then(module => module.CustomFieldsModule) },
            { path: 'new-company', loadChildren: () => import('./add-company/add-company-module').then(module => module.AddcompanyModule) },
            { path: 'user-details', loadChildren: () => import('./subscription/subscription.module').then(module => module.SubscriptionModule) },
            { path: 'new-company/:subscriptionId', loadChildren: () => import('./add-company/add-company-module').then(module => module.AddcompanyModule) },
            { path: 'vouchers', loadChildren: () => import('./vouchers/vouchers.module').then(module => module.VouchersModule) },
            { path: '**', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: '**', pathMatch: 'full' }
];
