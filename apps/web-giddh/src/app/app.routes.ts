import { NeedsAuthorization } from './decorators/needAuthorization';
import { Routes } from '@angular/router';
import { NeedsAuthentication } from './decorators/needsAuthentication';
import { UserAuthenticated } from './decorators/UserAuthenticated';
import { NewUserAuthGuard } from './decorators/newUserGuard';
import { AppLoginSuccessComponent } from "./app-login-success/app-login-success";
import { PageComponent } from './page/page.component';
import { MobileRestrictedComponent } from './mobile-restricted/mobile-restricted.component';
// COMMENTED OUT - MISSING: import { VerifySubscriptionTransferOwnershipComponent } from './verify-subscription-transfer-ownership/verify-subscription-transfer-ownership.component';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'app-login-success', component: AppLoginSuccessComponent, pathMatch: 'full' },
    // COMMENTED OUT - MISSING COMPONENT: { path: 'verify-subscription-ownership/:requestId', component: VerifySubscriptionTransferOwnershipComponent, pathMatch: 'full' },
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
    { path: 'ai-ocr', redirectTo: 'pages/ai-ocr', pathMatch: 'full' },
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
    { path: 'group-name', redirectTo: 'pages/group-name', pathMatch: 'full' },
    { path: 'mobile-restricted', component: MobileRestrictedComponent },
    {
        path: 'pages', component: PageComponent, canActivate: [NeedsAuthentication],
        children: [
            { path: 'giddh-all-items', loadChildren: () => import('./all-items/all-item.module').then(module => module.AllItemModule), canActivate: [NeedsAuthorization] },
            { path: '**', redirectTo: 'home', pathMatch: 'full' }
        ]
    },
    { path: '**', pathMatch: 'full', redirectTo: 'pages/home' }
];
