import { PermissionDataService } from './../permissions/permission-data.service';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { OrganizationType } from '../models/user-login-state';
import { RESTRICTED_BRANCH_ROUTES } from '../app.constant';

@Injectable()
export class NeedsAuthorization implements CanActivate {

    constructor(public router: Router, private permissionDataService: PermissionDataService, private generalService: GeneralService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (route && route.routeConfig && route.routeConfig.path === "journal-voucher") {
            if (this.permissionDataService.getCompany && this.permissionDataService.getCompany.createdBy && this.permissionDataService.getCompany.createdBy.email) {
                return this.generalService.checkIfEmailDomainAllowed(this.permissionDataService.getCompany.createdBy.email);
            } else {
                return false;
            }
        } else if (this.generalService.currentOrganizationType === OrganizationType.Branch && RESTRICTED_BRANCH_ROUTES.includes(state.url.split('?')[0])) {
            this.router.navigate(['/pages/home']);
            return false;
        } else {
            return true;
        }
    }
}
