import { IScope, PermissionDataService } from './../permissions/permission-data.service';
import { ToasterService } from './../services/toaster.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { GeneralService } from '../services/general.service';

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

    private requestedScope: IScope = null;

    constructor(public _router: Router, private _toasty: ToasterService, private _permissionDataService: PermissionDataService, private generalService: GeneralService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route && route.routeConfig && route.routeConfig.path === "journal-voucher") {
            if(this._permissionDataService.getCompany && this._permissionDataService.getCompany.createdBy && this._permissionDataService.getCompany.createdBy.email) {
                return this.generalService.checkIfEmailDomainAllowed(this._permissionDataService.getCompany.createdBy.email);
            } else {
                return false;
            }
        } else {
            return true;
        }
        /*
        let requestedScopeNeedAuth = this.mapUIRouteWithAPIScope(state.url);
        if (requestedScopeNeedAuth) {
          let permissions: IScope[] = this._permissionDataService.getData;
          let permissionIndex = permissions.findIndex((ele: IScope) => ele.name === requestedScopeNeedAuth);
          if (permissions.length &&  permissionIndex !== -1) {
            return true;
          } else {
            this._toasty.errorToast('You do not have permission to access this page.');
            let indexOfHome = permissions.findIndex((ele: IScope) => ele.name === 'DASHBOARD');
            if (indexOfHome !== -1) {
              this._router.navigate(['/pages/home']);
            } else {
              if (permissions && permissions.length) {
                let firstPermittedScope = SCOPE_TO_ROUTE_MAPPING.find((scope) => scope.value === permissions[0].name);
                this._router.navigate([firstPermittedScope.key]);
              } else {
                this._router.navigate(['/login']);
              }
            }
            return false;
          }
        } else {
          return true;
        }
        */
    }

    private mapUIRouteWithAPIScope(path: string): string {
        if ((path.split('/').length) === 4) {
            path = path.substring(0, path.lastIndexOf('/'));
        }
        let requestedScope = SCOPE_TO_ROUTE_MAPPING.find((obj) => obj.key === path);
        if (requestedScope) {
            return requestedScope.value;
        } else {
            return null;
        }
    }
}