import { PermissionDataService } from './../permissions/permission-data.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { OrganizationType } from '../models/user-login-state';
import { RESTRICTED_BRANCH_ROUTES } from '../app.constant';

export const SCOPE_TO_ROUTE_MAPPING = [
    {
        key: '/pages/home',
        value: 'DASHBOARD'
    },
    {
        key: '/pages/invoice',
        value: 'INVOICE'
    },
    {
        key: '/pages/sales',
        value: 'INVOICE'
    },
    {
        key: '/pages/purchase',
        value: 'INVOICE'
    },
    {
        key: '/pages/inventory',
        value: 'INVENTORY'
    },
    {
        key: '/pages/search',
        value: 'SEARCH'
    },
    {
        key: '/pages/trial-balance-and-profit-loss',
        value: 'REPORT'
    },
    {
        key: '/pages/audit-logs',
        value: 'AUDIT_LOGS'
    },
    {
        key: '/pages/permissions',
        value: 'MANAGE'
    },
    {
        key: '/pages/settings',
        value: 'SETTINGS'
    },
    {
        key: '/pages/manufacturing',
        value: 'INVENTORY'
    },
    {
        key: '/pages/ledger',
        value: 'LEDGER'
    }
];

@Injectable()
export class NeedsAuthorization implements CanActivate {

    constructor(public _router: Router, private _permissionDataService: PermissionDataService, private generalService: GeneralService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route && route.routeConfig && route.routeConfig.path === "journal-voucher") {
            if (this._permissionDataService.getCompany && this._permissionDataService.getCompany.createdBy && this._permissionDataService.getCompany.createdBy.email) {
                return this.generalService.checkIfEmailDomainAllowed(this._permissionDataService.getCompany.createdBy.email);
            } else {
                return false;
            }
        } else if (this.generalService.currentOrganizationType === OrganizationType.Branch && RESTRICTED_BRANCH_ROUTES.includes(state.url.split('?')[0])) {
            this._router.navigate(['/pages/home']);
            return false;
        } else {
            return true;
        }
    }
}
