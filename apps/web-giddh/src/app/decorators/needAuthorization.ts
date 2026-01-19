// COMMENTED OUT - MISSING: import { PermissionDataService } from './../permissions/permission-data.service';
import { GeneralService } from '../services/general.service';
import { OrganizationType } from '../models/user-login-state';
import { RESTRICTED_BRANCH_ROUTES } from '../app.constant';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';

/**
 * Handles Injectable functionality
 */
@Injectable({
    providedIn: 'root'
})
/**
 * NeedsAuthorization class
 * Implements NeedsAuthorization functionality
 */
export class NeedsAuthorization {

    /**
     * Creates an instance of class
     * Initializes component dependencies and sets up initial state
     */
    constructor(public router: Router, private generalService: GeneralService) {
    }

    /**
     * Handles canActivate functionality
     */
    public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        /**
         * Handles if functionality
         */
        if (this.generalService.currentOrganizationType === OrganizationType.Branch && RESTRICTED_BRANCH_ROUTES.includes(state.url.split('?')[0])) {
            this.router.navigate(['/pages/home']);
            return false;
        } else {
            return true;
        }
    }
}
