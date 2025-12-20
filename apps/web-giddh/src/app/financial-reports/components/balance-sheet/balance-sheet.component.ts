import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    ViewChild,
} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { CompanyResponse } from '../../../models/api-models/Company';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { BalanceSheetData, ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store/roots';
import { BalanceSheetGridComponent } from './components/balance-sheet-grid/balance-sheet-grid.component';
import { TlPlService } from '../../../services/tl-pl.service';
import { cloneDeep, each, findIndex, forEach } from '../../../lodash-optimized';

@Component({
selector: 'balance-sheet',
    templateUrl: './balance-sheet.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BalanceSheetComponent implements AfterViewInit, OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    public get selectedCompany(): CompanyResponse {
        return this._selectedCompany;
    }

    /**
     * set company and fetch data
     *
     * @memberof BalanceSheetComponent
     */
    @Input()
    public set selectedCompany(value: CompanyResponse) {
        this._selectedCompany = value;
        if (value && value.activeFinancialYear && value.financialYears && !this.isDateSelected) {
            let index = this.findIndex(value.activeFinancialYear, value.financialYears);
            this.request = {
                refresh: false,
                fy: index,
                from: value.activeFinancialYear.financialYearStarts,
                to: value.activeFinancialYear.financialYearEnds
            };
        }
    }

    public showLoader: Observable<boolean>;
    public data: BalanceSheetData;
    public request: ProfitLossRequest;
    public expandAll: boolean;
    public search: string;
    public from: string;
    public to: string;
    @Input() public isDateSelected: boolean = false;
    @ViewChild('bsGrid', { static: true }) public bsGrid: BalanceSheetGridComponent;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    private _selectedCompany: CompanyResponse;
    /** True if show Tally Report options */
    public showReportTallyOption: boolean;

    constructor(
        private store: Store<AppState>, 
        public tlPlActions: TBPlBsActions, 
        private cd: ChangeDetectorRef, 
        private toaster: ToasterService,
        private tlPlService: TlPlService) {
        this.showLoader = this.store.pipe(select(p => p.tlPl.bs.showLoader), takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.tlPl.bs.data), takeUntil(this.destroyed$)).subscribe((p) => {
            if (p) {
                this.tlPlService.isReportTailed$.next(true);
                this.expandAll = false;
                let data = cloneDeep(p) as BalanceSheetData;
                if (data && data.message) {
                    setTimeout(() => {
                        this.toaster.clearAllToaster();
                        this.toaster.infoToast(data.message);
                    }, 100);
                }
                if (data && data.liabilities) {
                    this.InitData(data.liabilities);
                    data.liabilities.forEach(g => {
                        g.isVisible = true;
                        g.isCreated = true;
                        g.isIncludedInSearch = true;
                    });
                }
                if (data && data.assets) {
                    this.InitData(data.assets);
                    data.assets.forEach(g => {
                        g.isVisible = true;
                        g.isCreated = true;
                        g.isIncludedInSearch = true;
                    });
                }
                this.data = data;
            } else {
                this.data = null;
            }
        });
    }

    public InitData(d: ChildGroup[]) {
        each(d, (grp: ChildGroup) => {
            grp.isVisible = false;
            grp.isCreated = false;
            grp.isIncludedInSearch = true;
            each(grp.accounts, (acc: Account) => {
                acc.isIncludedInSearch = true;
                acc.isCreated = false;
                acc.isVisible = false;
            });
            if (grp.childGroups) {
                this.InitData(grp.childGroups);
            }
        });
    }

    public ngAfterViewInit() {
        this.cd.detectChanges();
    }

    /**
     * Triggers the balance sheet data fetch based on the given request.
     *
     * @param request The request object with required data.
     * @memberof BalanceSheetComponent
     */
    public filterData(request: ProfitLossRequest): void {
        this.request = request;
        this.from = request.from;
        this.to = request.to;
        this.isDateSelected = request && request.selectedDateOption === '1';
        this.store.dispatch(this.tlPlActions.GetBalanceSheet(cloneDeep(request)));
    }

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

    public findIndex(activeFY, financialYears) {
        let tempFYIndex = 0;
        each(financialYears, (fy: any, index: number) => {
            if (fy?.uniqueName === activeFY?.uniqueName) {
                if (index === 0) {
                    tempFYIndex = index;
                } else {
                    tempFYIndex = index * -1;
                }
            }
        });
        return tempFYIndex;
    }

    public expandAllEvent() {
        setTimeout(() => {
            this.cd.detectChanges();
        }, 1);
    }

    public searchChanged(event: string) {
        this.search = event;
        if (!this.search) {
            this.expandAll = false;
        }
        this.cd.detectChanges();
    }

    /**
     * Handles the refresh even
     *
     * @memberof BalanceSheetComponent
     */
    public handleRefresh(): void {
        this.filterData(this.request);
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