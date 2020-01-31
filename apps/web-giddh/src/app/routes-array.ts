export const ROUTES = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '404' },
    { path: 'create-invoice', loadChildren: './create/create.module#CreateModule' },
    { path: 'login', loadChildren: './login/login.module#LoginModule' },
    { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
    { path: 'inventory', redirectTo: 'pages/inventory', pathMatch: 'full' },
    { path: 'inventory-in-out', redirectTo: 'pages/inventory-in-out', pathMatch: 'full' },
    // { path: 'success'},
    { path: 'home', redirectTo: 'pages/home', pathMatch: 'full' },
    // { path: 'magic', loadChildren: './magic-link/magicLink.module#MagicLinkModule' },
    { path: 'search', redirectTo: 'pages/search', pathMatch: 'full' },
    { path: 'permissions', redirectTo: 'pages/permissions', pathMatch: 'full' },
    { path: 'settings', redirectTo: 'pages/settings', pathMatch: 'full' },
    { path: 'manufacturing', redirectTo: 'pages/manufacturing', pathMatch: 'full' },
    { path: 'about', redirectTo: 'pages/about', pathMatch: 'full' },
    { path: 'trial-balance-and-profit-loss', redirectTo: 'pages/trial-balance-and-profit-loss', pathMatch: 'full' },
    { path: 'audit-logs', redirectTo: 'pages/audit-logs', pathMatch: 'full' },
    { path: 'ledger/:accountUniqueName', redirectTo: 'pages/ledger/:accountUniqueName', pathMatch: 'full' },
    { path: 'dummy' },
    { path: 'browser-support' },
    { path: 'new-user' },
    { path: 'welcome' },
    { path: 'onboarding' },
    { path: 'social-login-callback' },
    { path: 'invoice', redirectTo: 'pages/invoice', pathMatch: 'full' },
    { path: 'sales', redirectTo: 'pages/sales' },
    { path: 'daybook', redirectTo: 'pages/daybook', pathMatch: 'full' },
    { path: 'purchase', redirectTo: 'pages/purchase', pathMatch: 'full' },
    { path: 'user-details', redirectTo: 'pages/user-details', pathMatch: 'full' },
    { path: 'accounting-voucher', redirectTo: 'pages/accounting', pathMatch: 'full' },
    { path: 'contact', redirectTo: 'pages/contact' },
    { path: 'aging-report', redirectTo: 'pages/aging-report', pathMatch: 'full' },
    { path: 'import', redirectTo: 'pages/import', pathMatch: 'full' },
    { path: 'tallysync', redirectTo: 'pages/tallysync', pathMatch: 'full' },
    { path: 'gstfiling', redirectTo: 'pages/gstfiling', pathMatch: 'full' },
    { path: 'company-import-export', redirectTo: 'pages/company-import-export', pathMatch: 'full' },
    { path: 'purchase/create', redirectTo: 'pages/purchase/create' },
    { path: 'new-vs-old-invoices', redirectTo: 'pages/new-vs-old-invoices', pathMatch: 'full' },
    { path: 'reports', redirectTo: 'pages/reports' },
    {
        path: 'pages',
        children: [
            { path: 'home', loadChildren: './home/home.module#HomeModule' },
            { path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule' },
            { path: 'sales', loadChildren: './sales/sales.module#SalesModule' },
            { path: 'daybook', loadChildren: './daybook/daybook.module#DaybookModule' },
            { path: 'purchase', loadChildren: './purchase/purchase.module#PurchaseModule' },
            { path: 'about', loadChildren: './about/about.module#AboutModule' },
            // {path: 'aging-report', loadChildren: './aging-report/aging-report.module#AgingReportModule'},
            { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule' },
            {
                path: 'inventory-in-out',
                loadChildren: './inventory-in-out/inventory-in-out.module#InventoryInOutModule',
                data: { preload: true }
            },
            { path: 'search', loadChildren: './search/search.module#SearchModule' },
            {
                path: 'trial-balance-and-profit-loss',
                loadChildren: './tb-pl-bs/tb-pl-bs.module#TBPlBsModule',
                data: { preload: true }
            },
            { path: 'audit-logs', loadChildren: './audit-logs/audit-logs.module#AuditLogsModule' },
            {
                path: 'ledger/:accountUniqueName',
                loadChildren: './ledger/ledger.module#LedgerModule',
                data: { preload: true }
            },
            { path: 'permissions', loadChildren: './permissions/permission.module#PermissionModule' },
            { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
            {
                path: 'manufacturing',
                loadChildren: './manufacturing/manufacturing.module#ManufacturingModule',
                data: { preload: true }
            },
            {
                path: 'accounting-voucher',
                loadChildren: './accounting/accounting.module#AccountingModule',
                data: { preload: true }
            },
            { path: 'user-details', loadChildren: './userDetails/userDetails.module#UserDetailsModule' },
            { path: 'contact', loadChildren: './contact/contact.module#ContactModule' },
            {
                path: 'new-vs-old-invoices',
                loadChildren: './new-vs-old-Invoices/new-vs-old-Invoices.module#NewVsOldInvoicesModule'
            },
            { path: 'import', loadChildren: './import-excel/import-excel.module#ImportExcelModule' },
            { path: 'tallysync', loadChildren: './tallysync/tallysync.module#TallysyncModule' },
            { path: 'gstfiling', loadChildren: './gst/gst.module#GstModule' },
            {
                path: 'company-import-export',
                loadChildren: './companyImportExport/companyImportExport.module#CompanyImportExportModule'
            },
            { path: 'purchase/create', loadChildren: './sales/sales.module#SalesModule' },
            { path: 'reports', loadChildren: './reports/reports.module#ReportsModule' },
            { path: 'purchase-management', loadChildren: './purchase/purchase.module#PurchaseModule' },
            { path: '**', redirectTo: 'home', pathMatch: 'full' }


        ]
    },
    // { path: '**', redirectTo: 'login', pathMatch: 'full', canActivate: [CheckIfPublicPath] },
    { path: '**', pathMatch: 'full' }
];
