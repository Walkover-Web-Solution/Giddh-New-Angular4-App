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

export const ROUTES: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: '404', component: NotFoundComponent},
  {path: 'create-invoice', loadChildren: './create/create.module#CreateModule'},
  {path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [BrowserSupported, UserAuthenticated]},
  {path: 'signup', loadChildren: './signup/signup.module#SignupModule'},
  {path: 'inventory', redirectTo: 'pages/inventory', pathMatch: 'full'},
  {path: 'inventory-in-out', redirectTo: 'pages/inventory-in-out', pathMatch: 'full'},
  // { path: 'success', component: SuccessComponent },
  {path: 'home', redirectTo: 'pages/home', pathMatch: 'full'},
  // { path: 'magic', loadChildren: './magic-link/magicLink.module#MagicLinkModule' },
  {path: 'search', redirectTo: 'pages/search', pathMatch: 'full'},
  {path: 'permissions', redirectTo: 'pages/permissions', pathMatch: 'full'},
  {path: 'settings', redirectTo: 'pages/settings', pathMatch: 'full'},
  {path: 'manufacturing', redirectTo: 'pages/manufacturing', pathMatch: 'full'},
  {path: 'about', redirectTo: 'pages/about', pathMatch: 'full'},
  {path: 'trial-balance-and-profit-loss', redirectTo: 'pages/trial-balance-and-profit-loss', pathMatch: 'full'},
  {path: 'audit-logs', redirectTo: 'pages/audit-logs', pathMatch: 'full'},
  {path: 'ledger/:accountUniqueName', redirectTo: 'pages/ledger/:accountUniqueName', pathMatch: 'full'},
  {path: 'dummy', component: DummyComponent},
  {path: 'browser-support', component: BrowserDetectComponent},
  {path: 'new-user', component: NewUserComponent, canActivate: [NewUserAuthGuard]},
  {path: 'welcome', component: WelcomeComponent, canActivate: [NeedsAuthorization]},
  {path: 'onboarding', component: OnboardingComponent, canActivate: [NeedsAuthorization]},
  {path: 'social-login-callback', component: SocialLoginCallbackComponent},
  {path: 'invoice', redirectTo: 'pages/invoice', pathMatch: 'full'},
  {path: 'sales', redirectTo: 'pages/sales'},
  {path: 'daybook', redirectTo: 'pages/daybook', pathMatch: 'full'},
  {path: 'purchase', redirectTo: 'pages/purchase', pathMatch: 'full'},
  {path: 'user-details', redirectTo: 'pages/user-details', pathMatch: 'full'},
  {path: 'accounting-voucher', redirectTo: 'pages/accounting-voucher', pathMatch: 'full'},
  {path: 'contact', redirectTo: 'pages/contact'},
  {path: 'aging-report', redirectTo: 'pages/aging-report', pathMatch: 'full'},
  {path: 'import', redirectTo: 'pages/import', pathMatch: 'full'},
  {path: 'gstfiling', redirectTo: 'pages/gstfiling', pathMatch: 'full'},
  {path: 'company-import-export', redirectTo: 'pages/company-import-export', pathMatch: 'full'},
  {path: 'purchase/create', redirectTo: 'pages/purchase/create'},
  {path: 'new-vs-old-invoices', redirectTo: 'pages/new-vs-old-invoices', pathMatch: 'full'},
  {
    path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
    children: [
      {path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [NeedsAuthorization], data: {preload: true}},
      {path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule', canActivate: [NeedsAuthorization], data: {preload: true}},
      {path: 'sales', loadChildren: './sales/sales.module#SalesModule', canActivate: [NeedsAuthorization], data: {preload: true}},
      {path: 'daybook', loadChildren: './daybook/daybook.module#DaybookModule', canActivate: [NeedsAuthorization]},
      {path: 'purchase', loadChildren: './purchase/purchase.module#PurchaseModule', canActivate: [NeedsAuthorization]},
      {path: 'about', loadChildren: './about/about.module#AboutModule'},
      {path: 'aging-report', loadChildren: './aging-report/aging-report.module#AgingReportModule'},
      {path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule', canActivate: [NeedsAuthorization], data: {preload: true}},
      {path: 'inventory-in-out', loadChildren: './inventory-in-out/inventory-in-out.module#InventoryInOutModule', canActivate: [NeedsAuthorization], data: {preload: true}},
      {path: 'search', loadChildren: './search/search.module#SearchModule'},
      {
        path: 'trial-balance-and-profit-loss',
        loadChildren: './tb-pl-bs/tb-pl-bs.module#TBPlBsModule',
        canActivate: [NeedsAuthentication, NeedsAuthorization],
        data: {preload: true}
      },
      {path: 'audit-logs', loadChildren: './audit-logs/audit-logs.module#AuditLogsModule', canActivate: [NeedsAuthorization]},
      {path: 'ledger/:accountUniqueName', loadChildren: './ledger/ledger.module#LedgerModule', canActivate: [NeedsAuthorization], data: {preload: true}},
      {path: 'permissions', loadChildren: './permissions/permission.module#PermissionModule', canActivate: [NeedsAuthorization]},
      {path: 'settings', loadChildren: './settings/settings.module#SettingsModule', canActivate: [NeedsAuthorization], data: {preload: true}},
      {path: 'manufacturing', loadChildren: './manufacturing/manufacturing.module#ManufacturingModule', canActivate: [NeedsAuthorization], data: {preload: true}},
      {path: 'accounting-voucher', loadChildren: './accounting/accounting.module#AccountingModule', data: {preload: true}},
      {path: 'user-details', loadChildren: './userDetails/userDetails.module#UserDetailsModule'},
      {path: 'contact', loadChildren: './contact/contact.module#ContactModule', data: {preload: true}},
      {path: 'new-vs-old-invoices', loadChildren: './new-vs-old-Invoices/new-vs-old-Invoices.module#NewVsOldInvoicesModule', canActivate: [NeedsAuthorization]},
      {path: 'import', loadChildren: './import-excel/import-excel.module#ImportExcelModule'},
      {path: 'gstfiling', loadChildren: './gst/gst.module#GstModule', data: {preload: true}},
      {path: 'company-import-export', loadChildren: './companyImportExport/companyImportExport.module#CompanyImportExportModule'},
      {path: 'purchase/create', loadChildren: './sales/sales.module#SalesModule', canActivate: [NeedsAuthorization]},
      {path: '**', redirectTo: 'home', pathMatch: 'full'}
      // {path: '**', pathMatch: 'full', component: NotFoundComponent},

    ]
  },
  // { path: '**', redirectTo: 'login', pathMatch: 'full', canActivate: [CheckIfPublicPath] },
  {path: '**', pathMatch: 'full', component: PublicPageHandlerComponent},
];
