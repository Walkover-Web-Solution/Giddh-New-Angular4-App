import { ReplaySubject } from 'rxjs';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { RestrictedModules } from '../../app.constant';
import { Router } from '@angular/router';
@Component({
    selector: 'restricted-module-message',
    styleUrls: [`./subscription-upgrade-button.component.scss`],
    templateUrl: './subscription-upgrade-button.component.html'
})
export class SubscriptionUpgradeButtonComponent implements OnDestroy {
    /** Active company details */
    @Input() public activeCompany: any;
    /** Type of restricted module to check */
    @Input() public restrictedModule: RestrictedModules;
    /** Common locale data for translations */
    @Input() public commonLocaleData: any;
    /** Remaining count for specific features (like users) */
    @Input() public remainingCount?: number = null;
    /** Flag to determine if component should use router navigation or emit event */
    @Input() public useRouterLink: boolean = false;
    /** Event emitter for upgrade button click */
    @Output() public upgradeClick = new EventEmitter<string>();
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private router: Router) { }

    /**
     * Gets the router link array for subscription upgrade
     *
     * @returns {string[]} Array containing the router link segments
     * @memberof SubscriptionUpgradeButtonComponent
     */
    public getRouterLink(): string[] {
        const subscriptionId = this.activeCompany?.subscription?.subscriptionId;
        if (!subscriptionId) {
            return;
        }
        return ['/pages/user-details/subscription/buy-plan/', subscriptionId];
    }

    /**
     * Handles the upgrade button click event
     * Either navigates to subscription page or emits the click event based on useRouterLink flag
     *
     * @memberof SubscriptionUpgradeButtonComponent
     */
    public onUpgradeClick(): void {
        const subscriptionId = this.activeCompany?.subscription?.subscriptionId;
        if (!subscriptionId) {
            return;
        }
        if (this.useRouterLink) {
            this.router.navigate(this.getRouterLink());
        } else {
            this.upgradeClick.emit(subscriptionId);
        }
    }

    /**
     * Determines whether to show the upgrade message
     * Checks for module restrictions and remaining count if provided
     *
     * @returns {boolean} True if message should be shown
     * @memberof SubscriptionUpgradeButtonComponent
     */
    public shouldShowMessage(): boolean {
        const hasRestriction = this.activeCompany?.subscription?.planDetails?.restrictedModules.hasOwnProperty(this.restrictedModule);
        if (this.remainingCount !== null) {
            return this.remainingCount === 0 && hasRestriction;
        }
        return hasRestriction;
    }

    /**
     * Releases the memory
     *
     * @memberof SubscriptionUpgradeButtonComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
