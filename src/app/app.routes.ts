import { PageComponent } from './page.component';
import { Routes, LoadChildren } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { NeedsAuthentication } from './services/decorators/needsAuthentication';
import { UserAuthenticated } from './services/decorators/UserAuthenticated';
import { InventoryComponent } from './inventory/inventory.component';
import { SearchComponent } from './search/search.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';
import { TlPlComponent } from './tl-pl/tl-pl.component';
import { LedgerComponent } from './ledger/ledger.component';
import { ManufacturingComponent } from './manufacturing/manufacturing.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [UserAuthenticated] },
  {
    path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
    children: [
      { path: 'home', component: HomeComponent, canActivate: [NeedsAuthentication] },
      { path: 'about', component: AboutComponent, canActivate: [NeedsAuthentication] },
      { path: 'inventory', component: InventoryComponent, canActivate: [NeedsAuthentication] },
      { path: 'search', component: SearchComponent, canActivate: [NeedsAuthentication] },
      { path: 'trial-balance-and-profit-loss', component: TlPlComponent, canActivate: [NeedsAuthentication] },
      { path: 'audit-logs', component: AuditLogsComponent, canActivate: [NeedsAuthentication] },
      { path: 'ledger/:accountUniqueName', component: LedgerComponent, canActivate: [NeedsAuthentication] },
      { path: 'dummy', component: AboutComponent },
<<<<<<< HEAD
      { path: 'manufacturing', component: ManufacturingComponent },
=======
      { path: 'permissions', loadChildren: 'app/permissions/permission.module#PermissionModule', canActivate: [NeedsAuthentication]},
      { path: '**', redirectTo: 'permissions' }
>>>>>>> permission-module
    ]
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
