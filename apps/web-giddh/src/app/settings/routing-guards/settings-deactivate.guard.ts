import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { SettingsComponent } from '../settings.component';

/**
 * Deactivate guard to prevent browser navigation when modal is displayed
 *
 * @export
 * @class SettingsDeactivateGuard
 * @implements {CanDeactivate<SettingsComponent>}
 */
@Injectable()
export class SettingsDeactivateGuard  {

    /**
     * Returns true if there is no modal displayed in the UI and only then navigation
     * will occur
     *
     * @param {SettingsComponent} component Component associated with deactivate guard
     * @param {ActivatedRouteSnapshot} currentRoute Current Route
     * @param {RouterStateSnapshot} currentState Current history state
     * @param {RouterStateSnapshot} [nextState] Next state
     * @returns {boolean}
     * @memberof SettingsDeactivateGuard
     */
    canDeactivate(
        component: SettingsComponent,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): boolean {
        return !!document.querySelectorAll('.modal.show .universal_modal')?.length || document.querySelectorAll('.modal.show')?.length === 0;
    }

}
