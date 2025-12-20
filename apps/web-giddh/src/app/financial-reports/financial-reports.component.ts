import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { ReplaySubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyResponse } from '../models/api-models/Company';
import { AppState } from '../store';
import { environment } from '../../environments/environment';

@Component({
    selector: 'financial-reports',
    templateUrl: './financial-reports.component.html',
    styleUrls: ['./financial-reports.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialReportsComponent implements OnInit, OnDestroy {
    public selectedCompany: CompanyResponse;
    public CanTBLoad: boolean = true;
    public CanPLLoad: boolean = false;
    public CanBSLoad: boolean = false;
    public CanNewTBLoadOnThisEnv: boolean = false;
    public isWalkoverCompany: boolean = false;
    /** This will hold active tab */
    public activeTab: string = 'trial-balance';
    /** This will hold active tab index */
    public activeTabIndex: number = 0;
    /** True, when tabs are navigated with the help of routing, done to prevent redundant routing as
     * tab changed event is triggered on setting any tab as active which leads to a second navigation to the
     * same route which cancels the previous route with route ID and doesn't highlight the menu item
     */
    public preventTabChangeWithRoute: boolean;
    @ViewChild('staticTabsTBPL', { static: true }) public staticTabs: MatTabGroup;
    /** Selected tab index for Material tabs */
    public selectedTabIndex: number = 0;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router) {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.selectedCompany = activeCompany;
            }
        });
    }

    public ngOnInit() {
        if (!environment.production) {
            this.CanNewTBLoadOnThisEnv = true;
        } else {
            this.CanNewTBLoadOnThisEnv = false;
        }

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val && val.tab && val.tabIndex) {
                this.activeTab = val.tab;
                this.activeTabIndex = val.tabIndex;
                this.preventTabChangeWithRoute = true;
                this.selectTab(Number(val.tabIndex));
            }
        });
    }

    /**
     * Selects a tab by index using Angular Material tabs API
     *
     * @param {number} id - The index of the tab to select (0-based)
     * @memberof FinancialReportsComponent
     */
    public selectTab(id: number) {
        if (this.staticTabs) {
            this.staticTabs.selectedIndex = id;
            this.selectedTabIndex = id;
            this.CanTBLoad = id === 0;
            this.CanPLLoad = id === 1;
            this.CanBSLoad = id === 2;
        }
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof FinancialReportsComponent
     */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * This will navigate to selected tab
     *
     * @param {string} tab
     * @param {number} tabIndex
     * @memberof FinancialReportsComponent
     */
    public tabChanged(tab: string, tabIndex: number): void {
        if (!this.preventTabChangeWithRoute) {
            this.router.navigate(['/pages/trial-balance-and-profit-loss'], { queryParams: { tab, tabIndex } });
        }
    }

    /**
     * Handles Material tab change events
     *
     * @param {MatTabChangeEvent} event
     * @memberof FinancialReportsComponent
     */
    public onTabChanged(event: MatTabChangeEvent): void {
        const tabNames = ['trial-balance', 'profit-loss', 'balance-sheet'];
        const tabName = tabNames[event.index];

        if (tabName) {
            this.preventTabChangeWithRoute = false;
            this.selectedTabIndex = event.index;

            // Update the loading flags based on selected tab
            this.CanTBLoad = (event.index === 0);
            this.CanPLLoad = (event.index === 1);
            this.CanBSLoad = (event.index === 2);

            this.tabChanged(tabName, event.index);
        }
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
