import { PageComponent } from './page.component';
import { Routes } from '@angular/router';
import { NeedsAuthentication } from './services/decorators/needsAuthentication';
import { UserAuthenticated } from './services/decorators/UserAuthenticated';
import { DummyComponent } from './dummy.component';
import { NewUserComponent } from './newUser.component';
import { NewUserAuthGuard } from './services/decorators/newUserGuard';
import { SocialLoginCallbackComponent } from './social-login-callback.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [UserAuthenticated] },
  { path: 'inventory', redirectTo: 'pages/inventory', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'home', redirectTo: 'pages/home', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'search', redirectTo: 'pages/search', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'permissions', redirectTo: 'pages/permissions', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'settings', redirectTo: 'pages/settings', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'manufacturing', redirectTo: 'pages/manufacturing', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'about', redirectTo: 'pages/about', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'trial-balance-and-profit-loss', redirectTo: 'pages/trial-balance-and-profit-loss', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'audit-logs', redirectTo: 'pages/audit-logs', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'ledger/:accountUniqueName', redirectTo: 'pages/ledger/:accountUniqueName', pathMatch: 'full', canActivate: [NeedsAuthentication] },
  { path: 'dummy', component: DummyComponent },
  { path: 'new-user', component: NewUserComponent, canActivate: [NewUserAuthGuard] },
  { path: 'social-login-callback', component: SocialLoginCallbackComponent },
  { path: 'invoice', redirectTo: 'pages/invoice', pathMatch: 'full', canActivate: [NeedsAuthentication]  },
  { path: 'purchase', redirectTo: 'pages/purchase', pathMatch: 'full', canActivate: [NeedsAuthentication]  },
  {
    path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
    children: [
      { path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [NeedsAuthentication] },
      { path: 'invoice', loadChildren: './invoice/invoice.module#InvoiceModule', canActivate: [NeedsAuthentication] },
      { path: 'purchase', loadChildren: './purchase/purchase.module#PurchaseModule', canActivate: [NeedsAuthentication] },
      { path: 'about', loadChildren: './about/about.module#AboutModule', canActivate: [NeedsAuthentication] },
      { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule', canActivate: [NeedsAuthentication] },
      { path: 'search', loadChildren: './search/search.module#SearchModule', canActivate: [NeedsAuthentication] },
      {
        path: 'trial-balance-and-profit-loss',
        loadChildren: './tb-pl-bs/tb-pl-bs.module#TBPlBsModule',
        canActivate: [NeedsAuthentication]
      },
      { path: 'audit-logs', loadChildren: './audit-logs/audit-logs.module#AuditLogsModule', canActivate: [NeedsAuthentication] },
      { path: 'ledger/:accountUniqueName', loadChildren: './ledger/ledger.module#LedgerModule', canActivate: [NeedsAuthentication] },
      { path: 'permissions', loadChildren: './permissions/permission.module#PermissionModule', canActivate: [NeedsAuthentication] },
      { path: 'settings', loadChildren: './settings/settings.module#SettingsModule', canActivate: [NeedsAuthentication] },
      { path: 'manufacturing', loadChildren: './manufacturing/manufacturing.module#ManufacturingModule', canActivate: [NeedsAuthentication] },
      { path: '**', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
