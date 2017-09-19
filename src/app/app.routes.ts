import { PageComponent } from './page.component';
import { Routes } from '@angular/router';
import { NeedsAuthentication } from './services/decorators/needsAuthentication';
import { UserAuthenticated } from './services/decorators/UserAuthenticated';
import { DummyComponent } from './dummy.component';
import { SalesComponent } from './sales/sales.component';
import { NewUserComponent } from './newUser.component';
import { NewUserAuthGuard } from './services/decorators/newUserGuard';
import { SocialLoginCallbackComponent } from './social-login-callback.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [UserAuthenticated] },
  { path: 'inventory', redirectTo: 'pages/inventory', pathMatch: 'full' },
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
  { path: 'purchase', redirectTo: 'pages/purchase', pathMatch: 'full' },
  {
    path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
    children: [
      { path: 'home', loadChildren: './home/home.module#HomeModule' },
      { path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule' },
      { path: 'sales', component: SalesComponent, canActivate: [NeedsAuthentication] },
      { path: 'purchase', loadChildren: './purchase/purchase.module#PurchaseModule' },
      { path: 'about', loadChildren: './about/about.module#AboutModule' },
      { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule' },
      { path: 'search', loadChildren: './search/search.module#SearchModule' },
      {
        path: 'trial-balance-and-profit-loss',
        loadChildren: './tb-pl-bs/tb-pl-bs.module#TBPlBsModule',
        canActivate: [NeedsAuthentication]
      },
      { path: 'audit-logs', loadChildren: './audit-logs/audit-logs.module#AuditLogsModule' },
      { path: 'ledger/:accountUniqueName', loadChildren: './ledger/ledger.module#LedgerModule' },
      { path: 'permissions', loadChildren: './permissions/permission.module#PermissionModule' },
      { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
      { path: 'manufacturing', loadChildren: './manufacturing/manufacturing.module#ManufacturingModule' },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
