import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GeneralService } from '../services/general.service';
import { ReportType } from './multi-currency.const';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'multi-currency-report',
    templateUrl: './multi-currency-reports.component.html',
    styleUrls: ['./multi-currency-reports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultiCurrencyReportsComponent implements OnInit, OnDestroy {
    /** Flag to determine if the Trial Balance (TB) can be loaded */
    public CanTBLoad: boolean = true;
    /** Flag to determine if the Profit Loss (PL) can be loaded */
    public CanPLLoad: boolean = false;
    /** Flag to determine if the Balance Sheet (BS) can be loaded */
    public CanBSLoad: boolean = false;
    /** Flag to determine if the company is a walkover company */
    public isWalkoverCompany: boolean = false;
    /** Prevents redundant routing when navigating tabs through routing */
    public preventTabChangeWithRoute: boolean;
    /** Observable subject to handle component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds the local JSON data for the component */
    public localeData: any = {};
    /** Holds the common JSON data for the component */
    public commonLocaleData: any = {};
    /** Holds active selected Tab Index  */
    public selectedTabIndex: number = 0;

    constructor(
        private generalService: GeneralService,
        private activatedRoute: ActivatedRoute,
        private router: Router) {
    }

    /**
     * Initializes the component
     *
     * @returns {void}
     * @memberof MultiCurrencyReportsComponent
     */
    public ngOnInit(): void {
        this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val.tabIndex) {
                this.selectedTabIndex = Number(val.tabIndex);
                this.tabChanged(this.selectedTabIndex);
            }
        });
    }

    /**
     * This will destroy all the memory used by this component
     * 
     * @returns {void}
     * @memberof FinancialReportsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will navigate to selected tab
     * 
     * @returns {void}
     * @param {number} selectedTabIndex
     * @memberof FinancialReportsComponent
     */
    public tabChanged(selectedTabIndex: any): void {
        this.selectedTabIndex = selectedTabIndex;
        this.generalService.updateActivatedRouteQueryParams({ val: selectedTabIndex === 0 ? ReportType.TrialBalance : selectedTabIndex === 1 ? ReportType.ProfitLoss : ReportType.BalanceSheet, tabIndex: selectedTabIndex });
    }
}

