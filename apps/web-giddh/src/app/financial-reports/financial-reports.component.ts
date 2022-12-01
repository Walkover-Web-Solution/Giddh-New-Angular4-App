import { BreakpointObserver } from '@angular/cdk/layout';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompanyResponse } from '../models/api-models/Company';
import { AppState } from '../store';

@Component({
    selector: 'financial-reports',
    templateUrl: './financial-reports.component.html',
    styleUrls: ['./financial-reports.component.scss'],
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
    /** This will store screen size */
    public isMobileScreen: boolean = false;
    @ViewChild('staticTabsTBPL', { static: true }) public staticTabs: TabsetComponent;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private router: Router,
        private breakPointObservar: BreakpointObserver) {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.selectedCompany = activeCompany;
            }
        });
    }

    /**
     * This will return page heading based on active tab
     *
     * @param {boolean} event
     * @memberof InvoiceComponent
     */
     public getPageHeading(): string {
        if(this.isMobileScreen){
            if(this.CanTBLoad) {
                return this.localeData?.tabs?.trial_balance;
            }
            else if(this.CanPLLoad) {
                return this.localeData?.tabs?.profit_loss;
            }
            else if(this.CanBSLoad) {
                return this.localeData?.tabs?.balance_sheet;
            }
        }
        else {
            return " ";
        }
    }

    public ngOnInit() {
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        if (TEST_ENV) {
            this.CanNewTBLoadOnThisEnv = true;
        } else {
            this.CanNewTBLoadOnThisEnv = false;
        }

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val && val.tab && val.tabIndex) {
                this.activeTab = val.tab;
                this.activeTabIndex = val.tabIndex;
                this.preventTabChangeWithRoute = true;
                this.selectTab(val.tabIndex);
            }
        });
    }

    public selectTab(id: number) {
        if (this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[id]) {
            this.staticTabs.tabs[id].active = true;
        }
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof FinancialReportsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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
}
