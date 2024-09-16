import { NeedsAuthorization } from './decorators/needAuthorization';
import { Routes } from '@angular/router';
import { NeedsAuthentication } from './decorators/needsAuthentication';
import { UserAuthenticated } from './decorators/UserAuthenticated';
import { NewUserAuthGuard } from './decorators/newUserGuard';
import { AppLoginSuccessComponent } from "./app-login-success/app-login-success";
import { PageComponent } from './page/page.component';
import { MobileRestrictedComponent } from './mobile-restricted/mobile-restricted.component';
import { VerifySubscriptionTransferOwnershipComponent } from './verify-subscription-transfer-ownership/verify-subscription-transfer-ownership.component';
import { GocardlessCallBackComponent } from './gocardless-callback /gocardless-callback.component';

export const ROUTES: Routes = [
    { path: 'company/:companyUniqueName/dns', loadChildren: () => import('./dns-records/dns-records.module').then(module => module.DnsRecordsModule) },
    { path: 'download', loadChildren: () => import('./download/download.module').then(module => module.DownloadModule) },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'app-login-success', component: AppLoginSuccessComponent, pathMatch: 'full' },
    { path: 'verify-subscription-ownership/:requestId', component: VerifySubscriptionTransferOwnershipComponent, pathMatch: 'full' },
    { path: 'gocardless-callback', component: GocardlessCallBackComponent, pathMatch: 'full' },
    { path: 'token-verify', loadChildren: () => import('./login/token-verify.module').then(module => module.TokenVerifyModule), canActivate: [UserAuthenticated] },
    { path: 'login', loadChildren: () => import('./login/login.module').then(module => module.LoginModule), canActivate: [UserAuthenticated] },
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
    { path: 'audit-logs', redirectTo: 'pages/audit-logs', pathMatch: 'full' },
    { path: 'activity-logs', redirectTo: 'pages/activity-logs', pathMatch: 'full' },
    { path: 'ledger', redirectTo: 'pages/ledger' },
    { path: 'dummy', loadChildren: () => import('./dummy/dummy.module').then(module => module.DummyModule) },
    { path: 'new-company', loadChildren: () => import('./add-company/add-company-module').then(module => module.AddcompanyModule), canActivate: [NewUserAuthGuard] },
    { path: 'user-details/subscription/buy-plan', loadChildren: () => import('./subscription/subscription.module').then(module => module.SubscriptionModule) },
    { path: 'new-company/:subscriptionId', loadChildren: () => import('./add-company/add-company-module').then(module => module.AddcompanyModule), canActivate: [NewUserAuthGuard] },
    { path: 'onboarding', redirectTo: 'pages/onboarding', pathMatch: 'full' },
    { path: 'invoice', redirectTo: 'pages/invoice', pathMatch: 'full' },
    { path: 'sales', redirectTo: 'pages/proforma-invoice/invoice/sales' },
    { path: 'daybook', redirectTo: 'pages/daybook', pathMatch: 'full' },
    { path: 'purchase', redirectTo: 'pages/purchase', pathMatch: 'full' },
    { path: 'journal-voucher', redirectTo: 'pages/journal-voucher', pathMatch: 'full' },
    { path: 'contact', redirectTo: 'pages/contact' },
    { path: 'aging-report', redirectTo: 'pages/aging-report', pathMatch: 'full' },
    { path: 'import', redirectTo: 'pages/import', pathMatch: 'full' },
    { path: 'gstfiling', redirectTo: 'pages/gstfiling', pathMatch: 'full' },
    { path: 'company-import-export', redirectTo: 'pages/company-import-export', pathMatch: 'full' },
    { path: 'new-vs-old-invoices', redirectTo: 'pages/new-vs-old-invoices', pathMatch: 'full' },
    { path: 'reports', redirectTo: 'pages/reports', pathMatch: 'full' },
    { path: 'user-details', redirectTo: 'pages/user-details', pathMatch: 'full' },
    { path: 'mobile-home', redirectTo: 'pages/mobile-home', pathMatch: 'full' },
    { path: 'mobile-restricted', component: MobileRestrictedComponent },
    {
        path: 'pages', component: PageComponent,
        children: [
            { path: 'home', loadChildren: () => import('./home/home.module').then(module => module.HomeModule), canActivate: [NeedsAuthorization] },
            { path: 'invoice', loadChildren: () => import('./invoice/invoice.module').then(module => module.InvoiceModule), canActivate: [NeedsAuthorization] },
            {
                path: 'daybook',
                loadChildren: () => import('./daybook/daybook.module').then(module => module.DaybookModule),
                canActivate: [NeedsAuthorization]
            },
            {
                path: 'purchase',
                redirectTo: 'purchase-management'
            },
            { path: 'inventory', loadChildren: () => import('./inventory/inventory.module').then(module => module.InventoryModule), canActivate: [NeedsAuthorization] },
            { path: 'inventory/v2', loadChildren: () => import('./new-inventory/new-inventory.module').then(module => module.NewInventoryModule), canActivate: [NeedsAuthorization] },
            { path: 'inventory-in-out', loadChildren: () => import('./inventory-in-out/inventory-in-out.module').then(module => module.InventoryInOutModule), canActivate: [NeedsAuthorization] },
            { path: 'search', loadChildren: () => import('./search/search.module').then(module => module.SearchModule) },
            { path: 'trial-balance-and-profit-loss', loadChildren: () => import('./financial-reports/financial-reports.module').then(module => module.FinancialReportsModule), canActivate: [NeedsAuthentication, NeedsAuthorization] },
            { path: 'audit-logs', loadChildren: () => import('./audit-logs/audit-logs.module').then(module => module.AuditLogsModule), canActivate: [NeedsAuthorization] },
            { path: 'activity-logs', loadChildren: () => import('./activity-logs/activity-logs.module').then(module => module.ActivityLogsModule), canActivate: [NeedsAuthorization] },
            { path: 'ledger', loadChildren: () => import('./ledger/ledger.module').then(module => module.LedgerModule), canActivate: [NeedsAuthorization] },
            { path: 'permissions', loadChildren: () => import('./permissions/permission.module').then(module => module.PermissionModule), canActivate: [NeedsAuthorization] },
            { path: 'settings', loadChildren: () => import('./settings/settings.module').then(module => module.SettingsModule), canActivate: [NeedsAuthorization] },
            { path: 'manufacturing', loadChildren: () => import('./manufacturing/manufacturing.module').then(module => module.ManufacturingModule), canActivate: [NeedsAuthorization] },
            { path: 'journal-voucher', loadChildren: () => import('./accounting/accounting.module').then(module => module.AccountingModule), canActivate: [NeedsAuthorization] },
            { path: 'contact', loadChildren: () => import('./contact/contact.module').then(module => module.ContactModule), canActivate: [NeedsAuthorization] },
            { path: 'new-vs-old-invoices', loadChildren: () => import('./new-vs-old-Invoices/new-vs-old-Invoices.module').then(module => module.NewVsOldInvoicesModule), canActivate: [NeedsAuthorization] },
            { path: 'import', loadChildren: () => import('./import-excel/import-excel.module').then(module => module.ImportExcelModule), canActivate: [NeedsAuthorization] },
            { path: 'gstfiling', loadChildren: () => import('./gst/gst.module').then(module => module.GstModule) },
            { path: 'company-import-export', loadChildren: () => import('./company-import-export/company-import-export.module').then(module => module.CompanyImportExportModule) },
            { path: 'reports', loadChildren: () => import('./reports/reports.module').then(module => module.ReportsModule), canActivate: [NeedsAuthorization] },
            { path: 'user-details', loadChildren: () => import('./subscription/subscription.module').then(module => module.SubscriptionModule), canActivate: [NeedsAuthorization] },
            { path: 'proforma-invoice', loadChildren: () => import('./voucher/voucher.module').then(module => module.VoucherModule), canActivate: [NeedsAuthorization] },
            { path: 'onboarding', loadChildren: () => import('./onboarding/onboarding.module').then(module => module.OnboardingModule), canActivate: [NeedsAuthorization] },
            { path: 'billing-detail', loadChildren: () => import('./billing-details/billing-details.module').then(module => module.BillingDetailModule) },
            { path: 'giddh-all-items', loadChildren: () => import('./all-items/all-item.module').then(module => module.AllItemModule), canActivate: [NeedsAuthorization] },
            { path: 'expenses-manager', loadChildren: () => import('./expenses/expenses.module').then(module => module.ExpensesModule), canActivate: [NeedsAuthorization] },
            { path: 'vat-report', loadChildren: () => import('./vat-report/vat-report.module').then(module => module.VatReportModule), canActivate: [NeedsAuthorization] },
            { path: 'purchase-management', loadChildren: () => import('./purchase/purchase.module').then(module => module.PurchaseModule), canActivate: [NeedsAuthorization] },
            { path: 'verify-email', loadChildren: () => import('./verify-email/verify-email.module').then(module => module.VerifyEmailModule), canActivate: [NeedsAuthorization] },
            { path: 'voucher', loadChildren: () => import('./payment-receipt/payment-receipt.module').then(module => module.PaymentReceiptModule), canActivate: [NeedsAuthorization] },
            { path: 'downloads', loadChildren: () => import('./downloads/downloads.module').then(module => module.DownloadsModule), canActivate: [NeedsAuthorization] },
            { path: 'custom-fields', loadChildren: () => import('./custom-fields/custom-fields.module').then(module => module.CustomFieldsModule), canActivate: [NeedsAuthorization] },
            { path: 'new-company', loadChildren: () => import('./add-company/add-company-module').then(module => module.AddcompanyModule), canActivate: [NeedsAuthorization] },
            { path: 'new-company/:subscriptionId', loadChildren: () => import('./add-company/add-company-module').then(module => module.AddcompanyModule), canActivate: [NeedsAuthorization] },
            { path: 'user-details/subscription/buy-plan', loadChildren: () => import('./subscription/subscription.module').then(module => module.SubscriptionModule) },
            { path: 'vouchers', loadChildren: () => import('./vouchers/vouchers.module').then(module => module.VouchersModule), canActivate: [NeedsAuthorization] },
            { path: 'auth-hmrc', loadChildren: () => import('./auth-hmrc/auth-hmrc.module').then(module => module.AuthHMRCModule), canActivate: [NeedsAuthorization] },
            { path: '**', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: '**', pathMatch: 'full', redirectTo: 'pages/home' },
];
