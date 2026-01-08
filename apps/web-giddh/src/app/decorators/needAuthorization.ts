import { PermissionDataService } from './../permissions/permission-data.service';
import { GeneralService } from '../services/general.service';
import { OrganizationType } from '../models/user-login-state';
import { RESTRICTED_BRANCH_ROUTES } from '../app.constant';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class NeedsAuthorization {

    constructor(public router: Router, private permissionDataService: PermissionDataService, private generalService: GeneralService) {
    }

    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.generalService.currentOrganizationType === OrganizationType.Branch && RESTRICTED_BRANCH_ROUTES.includes(state.url.split('?')[0])) {
            this.router.navigate(['/pages/home']);
            return false;
        } else {
            return true;
        }
    }
}
