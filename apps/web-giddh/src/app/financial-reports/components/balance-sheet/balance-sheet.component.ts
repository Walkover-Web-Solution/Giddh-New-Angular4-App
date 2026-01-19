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
import { Observable, ReplaySubject } from 'rxjs';
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

/**
 * Handles Component functionality
 */
@Component({
selector: 'balance-sheet',
    templateUrl: './balance-sheet.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
/**
 * BalanceSheetComponent component
 * Handles balancesheet functionality and user interactions
 */
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
        /**
         * Handles if functionality
         */
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
    private _selectedCompany: CompanyResponse;
    /** True if show Tally Report options */
    public showReportTallyOption: boolean;

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>, 
        public tlPlActions: TBPlBsActions, 
        private cd: ChangeDetectorRef, 
        private toaster: ToasterService,
        private tlPlService: TlPlService) {
        this.showLoader = this.store.pipe(select(p => p.tlPl.bs.showLoader), takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.tlPl.bs.data), takeUntil(this.destroyed$)).subscribe((p) => {
            /**
             * Handles if functionality
             */
            if (p) {
                this.tlPlService.isReportTailed$.next(true);
                this.expandAll = false;
                let data = cloneDeep(p) as BalanceSheetData;
                /**
                 * Handles if functionality
                 */
                if (data && data.message) {
                    /**
                     * Sets timeout value
                     */
                    setTimeout(() => {
                        this.toaster.clearAllToaster();
                        this.toaster.infoToast(data.message);
                    }, 100);
                }
                /**
                 * Handles if functionality
                 */
                if (data && data.liabilities) {
                    this.InitData(data.liabilities);
                    (Array.isArray(data.liabilities) ? data.liabilities : []).forEach(g => {
                        g.isVisible = true;
                        g.isCreated = true;
                        g.isIncludedInSearch = true;
                    });
                }
                /**
                 * Handles if functionality
                 */
                if (data && data.assets) {
                    this.InitData(data.assets);
                    (Array.isArray(data.assets) ? data.assets : []).forEach(g => {
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

    /**
     * Handles InitData functionality
     */
    public InitData(d: ChildGroup[]) {
        /**
         * Handles each functionality
         */
        each(d, (grp: ChildGroup) => {
            grp.isVisible = false;
            grp.isCreated = false;
            grp.isIncludedInSearch = true;
            /**
             * Handles each functionality
             */
            each(grp.accounts, (acc: Account) => {
                acc.isIncludedInSearch = true;
                acc.isCreated = false;
                acc.isVisible = false;
            });
            /**
             * Handles if functionality
             */
            if (grp.childGroups) {
                this.InitData(grp.childGroups);
            }
        });
    }

    /**
     * Handles ngAfterViewInit functionality
     */
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

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles findIndex functionality
     */
    public findIndex(activeFY, financialYears) {
        let tempFYIndex = 0;
        /**
         * Handles each functionality
         */
        each(financialYears, (fy: any, index: number) => {
            /**
             * Handles if functionality
             */
            if (fy?.uniqueName === activeFY?.uniqueName) {
                /**
                 * Handles if functionality
                 */
                if (index === 0) {
                    tempFYIndex = index;
                } else {
                    tempFYIndex = index * -1;
                }
            }
        });
        return tempFYIndex;
    }

    /**
     * Handles expandAllEvent functionality
     */
    public expandAllEvent() {
        /**
         * Sets timeout value
         */
        setTimeout(() => {
            this.cd.detectChanges();
        }, 1);
    }

    /**
     * Handles searchChanged functionality
     */
    public searchChanged(event: string) {
        this.search = event;
        /**
         * Handles if functionality
         */
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
}