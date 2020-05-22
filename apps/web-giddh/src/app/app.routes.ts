// import { MagicLinkComponent } from './magic-link/magic-link.component';
import { NeedsAuthorization } from './decorators/needAuthorization';
// import { SuccessComponent } from './settings/linked-accounts/success.component';
import { PageComponent } from './page.component';
import { Routes } from '@angular/router';
import { NeedsAuthentication } from './decorators/needsAuthentication';
import { UserAuthenticated } from './decorators/UserAuthenticated';
import { DummyComponent } from './dummy.component';
import { NewUserComponent } from './newUser.component';
import { NewUserAuthGuard } from './decorators/newUserGuard';
import { SocialLoginCallbackComponent } from './social-login-callback.component';
import { PublicPageHandlerComponent } from './public-page-handler.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { NotFoundComponent } from './404/404-component';
import { BrowserSupported } from './decorators/BrowserSupported';
import { BrowserDetectComponent } from './browser-support/browserDetect.component';
import { SelectPlanComponent } from './selectPlan/selectPlan.component';
import { BillingDetailComponent } from './billing-details/billingDetail.component';
import { TokenVerifyComponent } from './login/token-verify.component';
import {AppLoginSuccessComponent} from "./app-login-success/app-login-success";

export const ROUTES: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    {path: '404', component: NotFoundComponent},
    {path: 'app-login-success', component: AppLoginSuccessComponent, pathMatch: 'full'},
    {
        path: 'token-verify',
        component: TokenVerifyComponent
    },
    {path: 'create-invoice', loadChildren: './create/create.module#CreateModule'},
    {
        path: 'login',
        loadChildren: './login/login.module#LoginModule',
        canActivate: [BrowserSupported, UserAuthenticated]
    },
    {path: 'signup', loadChildren: './signup/signup.module#SignupModule'},
    {path: 'inventory', redirectTo: 'pages/inventory', pathMatch: 'full'},
    {path: 'inventory-in-out', redirectTo: 'pages/inventory-in-out', pathMatch: 'full'},
    // { path: 'success', component: SuccessComponent },
    {path: 'home', redirectTo: 'pages/home', pathMatch: 'full'},
    // { path: 'magic', loadChildren: './magic-link/magicLink.module#MagicLinkModule' },
    { path: 'search', redirectTo: 'pages/search', pathMatch: 'full' },
    { path: 'permissions', redirectTo: 'pages/permissions', pathMatch: 'full' },
    { path: 'settings', redirectTo: 'pages/settings', pathMatch: 'full' },
    { path: 'manufacturing', redirectTo: 'pages/manufacturing', pathMatch: 'full' },
    { path: 'about', redirectTo: 'pages/about', pathMatch: 'full' },
    { path: 'trial-balance-and-profit-loss', redirectTo: 'pages/trial-balance-and-profit-loss', pathMatch: 'full' },
    { path: 'audit-logs', redirectTo: 'pages/audit-logs', pathMatch: 'full' },
    { path: 'ledger', redirectTo: 'pages/ledger' },
    { path: 'dummy', component: DummyComponent },
    { path: 'browser-support', component: BrowserDetectComponent },
    { path: 'new-user', component: NewUserComponent, canActivate: [NewUserAuthGuard] },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'onboarding', redirectTo: 'pages/onboarding', pathMatch: 'full' },
    { path: 'social-login-callback', component: SocialLoginCallbackComponent },
    { path: 'invoice', redirectTo: 'pages/invoice', pathMatch: 'full' },
    { path: 'sales', redirectTo: 'pages/proforma-invoice/invoice/sales' },
    { path: 'daybook', redirectTo: 'pages/daybook', pathMatch: 'full' },
    { path: 'purchase', redirectTo: 'pages/purchase', pathMatch: 'full' },
    { path: 'user-details', redirectTo: 'pages/user-details', pathMatch: 'full' },
    // { path: 'accounting-voucher', redirectTo: 'pages/accounting-voucher', pathMatch: 'full' },
    { path: 'contact', redirectTo: 'pages/contact' },
    { path: 'aging-report', redirectTo: 'pages/aging-report', pathMatch: 'full' },
    { path: 'import', redirectTo: 'pages/import', pathMatch: 'full' },
    { path: 'gstfiling', redirectTo: 'pages/gstfiling', pathMatch: 'full' },
    { path: 'company-import-export', redirectTo: 'pages/company-import-export', pathMatch: 'full' },
    // { path: 'purchase/create', redirectTo: 'pages/purchase/create' },
    // { path: 'credit-note/create', redirectTo: 'pages/credit-note/create' },
    // { path: 'debit-note/create', redirectTo: 'pages/debit-note/create' },
    {path: 'new-vs-old-invoices', redirectTo: 'pages/new-vs-old-invoices', pathMatch: 'full'},
    {path: 'reports', redirectTo: 'pages/reports', pathMatch: 'full'},
    {path: 'proforma-invoice', redirectTo: 'pages/proforma-invoice', pathMatch: 'full'},
    {path: 'select-plan', component: SelectPlanComponent},
    {path: 'billing-detail', component: BillingDetailComponent},
    {path: 'billing-detail/buy-plan', component: BillingDetailComponent},
    {
        path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
        children: [
            {path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [NeedsAuthorization]},
            {
                path: 'invoice',
                loadChildren: './invoice/invoice.module#InvoiceModule',
                canActivate: [NeedsAuthorization]
            },
            // { path: 'sales', loadChildren: './sales/sales.module#SalesModule', canActivate: [NeedsAuthorization] },
            {
                path: 'daybook',
                loadChildren: './daybook/daybook.module#DaybookModule',
                canActivate: [NeedsAuthorization]
            },
            {
                path: 'purchase',
                redirectTo: 'purchase-management'
            },
            {path: 'about', loadChildren: './about/about.module#AboutModule'},
            //{ path: 'aging-report', loadChildren: './aging-report/aging-report.module#AgingReportModule' },
            { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule', canActivate: [NeedsAuthorization] },
            { path: 'inventory-in-out', loadChildren: './inventory-in-out/inventory-in-out.module#InventoryInOutModule', canActivate: [NeedsAuthorization] },
            { path: 'search', loadChildren: './search/search.module#SearchModule' },
            { path: 'trial-balance-and-profit-loss', loadChildren: './tb-pl-bs/tb-pl-bs.module#TBPlBsModule', canActivate: [NeedsAuthentication, NeedsAuthorization] },
            { path: 'audit-logs', loadChildren: './audit-logs/audit-logs.module#AuditLogsModule', canActivate: [NeedsAuthorization] },
            { path: 'all-modules', loadChildren: './all-modules/all-modules.module#AllModulesModule', canActivate: [NeedsAuthorization] },
            // { path: 'create-advance-receipt', loadChildren: './create-advance-receipt/create-advance-receipt.module#CreateAdvanceReceiptModule', canActivate: [NeedsAuthorization] },
            { path: 'ledger', loadChildren: './ledger/ledger.module#LedgerModule', canActivate: [NeedsAuthorization] },
            { path: 'permissions', loadChildren: './permissions/permission.module#PermissionModule', canActivate: [NeedsAuthorization] },
            { path: 'settings', loadChildren: './settings/settings.module#SettingsModule', canActivate: [NeedsAuthorization] },
            { path: 'manufacturing', loadChildren: './manufacturing/manufacturing.module#ManufacturingModule', canActivate: [NeedsAuthorization] },
            // { path: 'accounting-voucher', loadChildren: './accounting/accounting.module#AccountingModule' },
            { path: 'user-details', loadChildren: './userDetails/userDetails.module#UserDetailsModule' },
            { path: 'contact', loadChildren: './contact/contact.module#ContactModule', canActivate: [NeedsAuthorization] },
            { path: 'new-vs-old-invoices', loadChildren: './new-vs-old-Invoices/new-vs-old-Invoices.module#NewVsOldInvoicesModule', canActivate: [NeedsAuthorization] },
            { path: 'import', loadChildren: './import-excel/import-excel.module#ImportExcelModule', canActivate: [NeedsAuthorization] },
            { path: 'gstfiling', loadChildren: './gst/gst.module#GstModule' },
            { path: 'company-import-export', loadChildren: './companyImportExport/companyImportExport.module#CompanyImportExportModule' },
            // { path: 'purchase/create', loadChildren: './sales/sales.module#SalesModule', canActivate: [NeedsAuthorization] },
            // { path: 'credit-note/create', loadChildren: './sales/sales.module#SalesModule', canActivate: [NeedsAuthorization] },
            // { path: 'debit-note/create', loadChildren: './sales/sales.module#SalesModule', canActivate: [NeedsAuthorization] },
            {
                path: 'reports',
                loadChildren: './reports/reports.module#ReportsModule',
                canActivate: [NeedsAuthorization]
            },
            {
                path: 'proforma-invoice',
                loadChildren: './proforma-invoice/proforma-invoice.module#ProformaInvoiceModule',
                canActivate: [NeedsAuthorization]
            },
            {path: 'onboarding', component: OnboardingComponent, canActivate: [NeedsAuthorization]},
            {path: 'welcome', component: WelcomeComponent, canActivate: [NeedsAuthorization]},
            {path: 'select-plan', component: SelectPlanComponent, canActivate: [NeedsAuthorization]},
            {path: 'billing-detail', component: BillingDetailComponent, canActivate: [NeedsAuthorization]},
            {
                path: 'tallysync',
                loadChildren: './tallysync/tallysync.module#TallysyncModule',
                canActivate: [NeedsAuthorization]
            },

            {
                path: 'expenses-manager',
                loadChildren: './expenses/expenses.module#ExpensesModule',
                canActivate: [NeedsAuthorization]
            },

            { path: 'vat-report', loadChildren: './vat-report/vatReport.module#VatReportModule', canActivate: [NeedsAuthorization] },
            { path: 'purchase-management', loadChildren: './purchase/purchase.module#PurchaseModule', canActivate: [NeedsAuthorization] },
            { path: '**', redirectTo: 'home', pathMatch: 'full' }
            // {path: '**', pathMatch: 'full', component: NotFoundComponent},

        ]
    },
    {path: '**', pathMatch: 'full', component: PublicPageHandlerComponent},
];
