import { NeedsAuthorization } from './decorators/needAuthorization';
import { SuccessComponent } from './settings/linked-accounts/success.component';
import { PageComponent } from './page.component';
import { Routes } from '@angular/router';
import { NeedsAuthentication } from './decorators/needsAuthentication';
import { UserAuthenticated } from './decorators/UserAuthenticated';
import { DummyComponent } from './dummy.component';
import { NewUserComponent } from './newUser.component';
import { NewUserAuthGuard } from './decorators/newUserGuard';
import { SocialLoginCallbackComponent } from './social-login-callback.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [UserAuthenticated] },
  { path: 'inventory', redirectTo: 'pages/inventory', pathMatch: 'full' },
  { path: 'success', component: SuccessComponent },
  { path: 'home', redirectTo: 'pages/home', pathMatch: 'full' },
  { path: 'search', redirectTo: 'pages/search', pathMatch: 'full' },
  { path: 'permissions', redirectTo: 'pages/permissions', pathMatch: 'full' },
  { path: 'settings', redirectTo: 'pages/settings', pathMatch: 'full' },
  { path: 'manufacturing', redirectTo: 'pages/manufacturing', pathMatch: 'full' },
  { path: 'about', redirectTo: 'pages/about', pathMatch: 'full' },
  { path: 'trial-balance-and-profit-loss', redirectTo: 'pages/trial-balance-and-profit-loss', pathMatch: 'full' },
  { path: 'audit-logs', redirectTo: 'pages/audit-logs', pathMatch: 'full' },
  { path: 'ledger/:accountUniqueName', redirectTo: 'pages/ledger/:accountUniqueName', pathMatch: 'full' },
  { path: 'dummy', component: DummyComponent },
  { path: 'new-user', component: NewUserComponent, canActivate: [NewUserAuthGuard] },
  { path: 'social-login-callback', component: SocialLoginCallbackComponent },
  { path: 'invoice', redirectTo: 'pages/invoice', pathMatch: 'full' },
  { path: 'sales', redirectTo: 'pages/sales', pathMatch: 'full' },
  { path: 'daybook', redirectTo: 'pages/daybook', pathMatch: 'full' },
  { path: 'purchase', redirectTo: 'pages/purchase', pathMatch: 'full' },
  { path: 'user-details', redirectTo: 'pages/user-details', pathMatch: 'full' },
  {
    path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
    children: [
      { path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [NeedsAuthorization] },
      { path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule', canActivate: [NeedsAuthorization] },
      { path: 'sales', loadChildren: './sales/sales.module#SalesModule', canActivate: [NeedsAuthorization] },
      { path: 'daybook', loadChildren: './daybook/daybook.module#DaybookModule', canActivate: [NeedsAuthorization] },
      { path: 'purchase', loadChildren: './purchase/purchase.module#PurchaseModule', canActivate: [NeedsAuthorization] },
      { path: 'about', loadChildren: './about/about.module#AboutModule' },
      { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule', canActivate: [NeedsAuthorization] },
      { path: 'search', loadChildren: './search/search.module#SearchModule', canActivate: [NeedsAuthorization] },
      {
        path: 'trial-balance-and-profit-loss',
        loadChildren: './tb-pl-bs/tb-pl-bs.module#TBPlBsModule',
        canActivate: [NeedsAuthentication, NeedsAuthorization]
      },
      { path: 'audit-logs', loadChildren: './audit-logs/audit-logs.module#AuditLogsModule', canActivate: [NeedsAuthorization] },
      { path: 'ledger/:accountUniqueName', loadChildren: './ledger/ledger.module#LedgerModule', canActivate: [NeedsAuthorization] },
      { path: 'permissions', loadChildren: './permissions/permission.module#PermissionModule', canActivate: [NeedsAuthorization] },
      { path: 'settings', loadChildren: './settings/settings.module#SettingsModule', canActivate: [NeedsAuthorization] },
      { path: 'manufacturing', loadChildren: './manufacturing/manufacturing.module#ManufacturingModule', canActivate: [NeedsAuthorization] },
      { path: 'user-details', loadChildren: './userDetails/userDetails.module#UserDetailsModule' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
