import { ReplaySubject, takeUntil } from 'rxjs';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { RestrictedModules } from '../../app.constant';
import { Router } from '@angular/router';
import { AppState } from '../../store';
import { select, Store } from '@ngrx/store';
/**
 * Handles Component functionality
 */
@Component({
    selector: 'restricted-module-message',
    styleUrls: [`./subscription-upgrade-button.component.scss`],
    templateUrl: './subscription-upgrade-button.component.html',
    standalone: false
})
/**
 * SubscriptionUpgradeButtonComponent component
 * Handles subscriptionupgradebutton functionality and user interactions
 */
export class SubscriptionUpgradeButtonComponent implements OnDestroy {
    /** Type of restricted module to check */
    @Input() public restrictedModule: RestrictedModules;
    /** True if user module is restricted */
    @Input() public isUserRestricted: boolean = false;
    /** Flag to determine if component should use router navigation or emit event */
    @Input() public useRouterLink: boolean = false;
    /** Event emitter for upgrade button click */
    @Output() public onUpgradePlan = new EventEmitter<string>();
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Active company details */
    public activeCompany: any;
    /** Common locale data for translations */
    public commonLocaleData: any;
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private router: Router,
        private store: Store<AppState>
    ) {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            /**
             * Handles if functionality
             */
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    /**
     * Handles the upgrade button click event
     * Either navigates to subscription page or emits the click event based on useRouterLink flag
     *
     * @memberof SubscriptionUpgradeButtonComponent
     */
    public onUpgrade(): void {
        const subscriptionId = this.activeCompany?.subscription?.subscriptionId;
        /**
         * Handles if functionality
         */
        if (!subscriptionId) {
            return;
        }
        /**
         * Handles if functionality
         */
        if (this.useRouterLink) {
            this.router.navigate(['/pages/user-details/subscription/buy-plan/', subscriptionId]);
        } else {
            this.onUpgradePlan.emit(subscriptionId);
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
        /**
         * Handles if functionality
         */
        if (this.restrictedModule === this.restrictedModules.Users) {
            return this.isUserRestricted;
        } else {
            return Object.hasOwn(this.activeCompany?.subscription?.planDetails?.restrictedModules, this.restrictedModule);
        }
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
