import { PermissionDataService } from './../permissions/permission-data.service';
import { ToasterService } from './../services/toaster.service';
import { AppState } from '../store';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { userLoginStateEnum } from '../store/authentication/authentication.reducer';

@Injectable()
export class NeedsAuthorization implements CanActivate {

  private requestedScope: string = null;

  constructor(public _router: Router, private _toasty: ToasterService, private _permissionDataService: PermissionDataService) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let requestedScopeNeedAuth = this.mapUIRouteWithAPIScope (state.url);
    if (requestedScopeNeedAuth) {
      let permissions = this._permissionDataService.getData;
      if (permissions.length && permissions.indexOf(requestedScopeNeedAuth) !== -1) {
        return true;
      } else {
        this._toasty.errorToast('You do not have permission to access this page.');
        this._router.navigate(['/pages/home']);
        return false;
      }
    } else {
      return true;
    }
  }

  private mapUIRouteWithAPIScope(path: string): string {
    console.log('the url is: ', path);
    if ((path.split('/').length) === 4) {
        path = path.substring(0, path.lastIndexOf('/'));
    }
    console.log('after modification the path is: ', path);
    let requestedScope = null;
    switch (path) {
      case '/pages/home':
        requestedScope = 'DASHBOARD';
        break;
      case '/pages/invoice':
        requestedScope = 'INVOICE';
        break;
      case '/pages/sales':
        requestedScope = 'INVOICE';
        break;
      case '/pages/purchase':
        requestedScope = 'TAXES';
        break;
      case '/pages/inventory':
        requestedScope = 'INVENTORY';
        break;
      case '/pages/search':
        requestedScope = 'SEARCH';
        break;
      case '/pages/trial-balance-and-profit-loss':
        requestedScope = 'TB_PL';
        break;
      case '/pages/audit-logs':
        requestedScope = 'AUDIT_LOGS';
        break;
      case '/pages/permissions':
        requestedScope = 'MANAGE';
        break;
      case '/pages/settings':
        requestedScope = 'SETTINGS';
        break;
      case '/pages/manufacturing':
        requestedScope = 'INVENTORY';
        break;
      case '/pages/ledger':
        requestedScope = 'LEDGER';
        break;
      default:
        requestedScope = null;
    }
    return requestedScope;
  }
}
