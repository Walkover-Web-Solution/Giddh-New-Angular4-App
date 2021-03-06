export const ROUTES = [
    { path: 'download' },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '404' },
    { path: 'app-login-success' },
    { path: 'token-verify' },
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
    { path: 'ledger/:accountUniqueName', redirectTo: 'pages/ledger/:accountUniqueName', pathMatch: 'full' },
    { path: 'dummy' },
    { path: 'browser-support' },
    { path: 'proforma-invoice' },
    { path: 'new-user' },
    { path: 'welcome' },
    { path: 'onboarding' },
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
    // { path: 'tallysync', redirectTo: 'pages/tallysync', pathMatch: 'full' },
    { path: 'gstfiling', redirectTo: 'pages/gstfiling', pathMatch: 'full' },
    { path: 'company-import-export', redirectTo: 'pages/company-import-export', pathMatch: 'full' },
    { path: 'purchase/create', redirectTo: 'pages/purchase/create' },
    { path: 'new-vs-old-invoices', redirectTo: 'pages/new-vs-old-invoices', pathMatch: 'full' },
    { path: 'reports', redirectTo: 'pages/reports' },
    { path: 'proforma-invoice', redirectTo: 'pages/proforma-invoice' },
    { path: 'mobile-home', redirectTo: 'pages/mobile-home', pathMatch: 'full' },
    { path: 'select-plan' },
    { path: 'billing-detail' },
    { path: 'billing-detail/buy-plan' },
    //{ path: 'new-inventory/create-group', component: InventoryCreateGroupComponent },
    {
        path: 'pages',
        children: [
            { path: 'home', loadChildren: () => import('./home/home.module').then(module => module.HomeModule) },
            { path: 'invoice', loadChildren: () => import('./invoice/invoice.module').then(module => module.InvoiceModule) },
            { path: 'daybook', loadChildren: () => import('./daybook/daybook.module').then(module => module.DaybookModule) },
            { path: 'purchase', loadChildren: () => import('./purchase/purchase.module').then(module => module.PurchaseModule) },
            { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(module => module.InventoryModule) },
            { path: 'new-inventory', loadChildren: () => import('./new-inventory/new-inventory.module').then(module => module.NewInventoryModule) },
            {
                path: 'inventory-in-out',
                loadChildren: () => import('./inventory-in-out/inventory-in-out.module').then(module => module.InventoryInOutModule),
                data: { preload: true }
            },
            { path: 'search', loadChildren: () => import('./search/search.module').then(module => module.SearchModule) },
            {
                path: 'trial-balance-and-profit-loss',
                loadChildren: () => import('./tb-pl-bs/tb-pl-bs.module').then(module => module.TBPlBsModule),
                data: { preload: true }
            },
            { path: 'audit-logs', loadChildren: () => import('./audit-logs/audit-logs.module').then(module => module.AuditLogsModule) },
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
            { path: 'user-details', loadChildren: () => import('./userDetails/userDetails.module').then(module => module.UserDetailsModule) },
            { path: 'contact', loadChildren: () => import('./contact/contact.module').then(module => module.ContactModule) },
            {
                path: 'new-vs-old-invoices',
                loadChildren: () => import('./new-vs-old-Invoices/new-vs-old-Invoices.module').then(module => module.NewVsOldInvoicesModule)
            },
            { path: 'import', loadChildren: () => import('./import-excel/import-excel.module').then(module => module.ImportExcelModule) },
            // { path: 'tallysync', loadChildren: () => import('./tallysync/tallysync.module').then(module => module.TallysyncModule) },
            { path: 'gstfiling', loadChildren: () => import('./gst/gst.module').then(module => module.GstModule) },
            {
                path: 'company-import-export',
                loadChildren: () => import('./companyImportExport/companyImportExport.module').then(module => module.CompanyImportExportModule)
            },
            { path: 'reports', loadChildren: () => import('./reports/reports.module').then(module => module.ReportsModule) },
            { path: 'purchase-management', loadChildren: () => import('./purchase/purchase.module').then(module => module.PurchaseModule) },
            { path: '**', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: '**', pathMatch: 'full' }
];
