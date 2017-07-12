import { PageComponent } from './page.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { PermissionComponent } from './permissions/permission.component';
import { LoginComponent } from './login/login.component';
import { NeedsAuthentication } from './services/decorators/needsAuthentication';
import { UserAuthenticated } from './services/decorators/UserAuthenticated';
import { InventoryComponent } from './inventory/inventory.component';
import { SearchComponent } from './search/search.component';
import { AuditLogsComponent } from './audit-logs/audit-logs.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [UserAuthenticated] },
  {
    path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
    children: [
      { path: '', component: HomeComponent, canActivate: [NeedsAuthentication] },
      { path: 'home', component: HomeComponent, canActivate: [NeedsAuthentication] },
      { path: 'about', component: AboutComponent, canActivate: [NeedsAuthentication] },
      { path: 'inventory', component: InventoryComponent, canActivate: [NeedsAuthentication] },
      { path: 'search', component: SearchComponent, canActivate: [NeedsAuthentication] },
      { path: 'audit-logs', component: AuditLogsComponent, canActivate: [NeedsAuthentication] },
      { path: 'dummy', component: AboutComponent },
      { path: 'permissions', component: PermissionComponent },
    ]
  }
];
