import { PermissionDetailsComponent } from './permissions/components/details/permission.details.component';
import { PermissionListComponent } from './permissions/components/list/permission.list.component';
import { PermissionComponent } from './permissions/permission.component';
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
import { DummyComponent } from './dummy.component';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadChildren: './login/login.module#LoginModule', canActivate: [UserAuthenticated] },
    { path: 'inventory', redirectTo: 'pages/inventory', pathMatch: 'full', canActivate: [NeedsAuthentication] },
    { path: 'home', redirectTo: 'pages/home', pathMatch: 'full', canActivate: [NeedsAuthentication] },
    { path: 'search', redirectTo: 'pages/search', pathMatch: 'full', canActivate: [NeedsAuthentication] },
    { path: 'permissions', redirectTo: 'pages/permissions', pathMatch: 'full', canActivate: [NeedsAuthentication] },
    { path: 'about', redirectTo: 'pages/about', pathMatch: 'full', canActivate: [NeedsAuthentication] },
    { path: 'trial-balance-and-profit-loss', redirectTo: 'pages/trial-balance-and-profit-loss', pathMatch: 'full', canActivate: [NeedsAuthentication] },
    { path: 'audit-logs', redirectTo: 'pages/audit-logs', pathMatch: 'full', canActivate: [NeedsAuthentication] },
    { path: 'ledger/:accountUniqueName', redirectTo: 'pages/ledger/:accountUniqueName', pathMatch: 'full', canActivate: [NeedsAuthentication] },
    {
        path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
        children: [
            { path: 'home', loadChildren: './home/home.module#HomeModule', canActivate: [NeedsAuthentication] },
            { path: 'about', loadChildren: './about/about.module#AboutModule', canActivate: [NeedsAuthentication] },
            { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryModule', canActivate: [NeedsAuthentication] },
            { path: 'search', loadChildren: './search/search.module#SearchModule', canActivate: [NeedsAuthentication] },
            { path: 'trial-balance-and-profit-loss', loadChildren: './tl-pl/tl-pl.module#TlPlModule', canActivate: [NeedsAuthentication] },
            { path: 'audit-logs', loadChildren: './audit-logs/audit-logs.module#AuditLogsModule', canActivate: [NeedsAuthentication] },
            { path: 'ledger/:accountUniqueName', loadChildren: './ledger/ledger.module#LedgerModule', canActivate: [NeedsAuthentication] },
            { path: 'dummy', component: DummyComponent },
            { path: 'permissions', loadChildren: './permissions/permission.module#PermissionModule', canActivate: [NeedsAuthentication] },
            { path: '**', redirectTo: 'permissions' }
        ]
    },
    { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
