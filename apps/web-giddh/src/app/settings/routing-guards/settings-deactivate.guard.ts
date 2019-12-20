import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router';

import { SettingsComponent } from '../settings.component';

/**
 * Deactivate guard to prevent browser navigation when modal is displayed
 *
 * @export
 * @class SettingsDeactivateGuard
 * @implements {CanDeactivate<SettingsComponent>}
 */
@Injectable()
export class SettingsDeactivateGuard implements CanDeactivate<SettingsComponent> {

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
        return document.querySelectorAll('.modal-dialog').length === 0;
    }

}
