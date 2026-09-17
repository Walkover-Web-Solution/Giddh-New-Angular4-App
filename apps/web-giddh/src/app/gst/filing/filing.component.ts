import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GstReconcileActions } from '../../actions/gst-reconcile/gst-reconcile.actions';
import { GstDatePeriod, GstOverViewRequest } from '../../models/api-models/GstReconcile';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { AppState } from '../../store';
import { GstReport } from '../constants/gst.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { GiddhDatePipe } from '../../shared/pipes/giddh-date.pipe';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RestrictedModules } from '../../app.constant';
import { ServiceConfig } from '../../services/service.config';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'filing',
    templateUrl: 'filing.component.html',
    styleUrls: ['filing.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
    standalone:false
})
export class FilingComponent implements OnInit, OnDestroy {
    /** This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
    public currentPeriod: GstDatePeriod = null;
    public selectedGst: string = null;
    /** Holds the GST report type that should be auto-navigated to (when URL lacks from/to).
     *  Passed to <tax-sidebar> which uses its own currentPeriod to build the full URL. */
    public pendingNavigateType: string = null;
    public gstNumber: string = null;
    public activeCompanyGstNumber: string = '';
    public selectedTab: string = '';
    public gstAuthenticated$: Observable<boolean>;
    public isTransactionSummary: boolean = false;
    public showTaxPro: boolean = false;
    public fileReturn: {} = { isAuthenticate: false };
    public gstFileSuccess$: Observable<boolean> = of(false);
    public fileReturnSucces: boolean = false;
    /** True, if HSN tab needs to be opened by default (required if a user clicks on HSN data in GSTR1) */
    public showHsn: boolean;
    public gstr1OverviewDataInProgress$: Observable<boolean>;
    public gstr2OverviewDataInProgress$: Observable<boolean>;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }
    private gstr1OverviewDataFetchedSuccessfully$: Observable<boolean>;
    private gstr2OverviewDataFetchedSuccessfully$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the current period */
    public getCurrentPeriod$: Observable<any> = of(null);
    /** True, if month filter is selected */
    public isMonthSelected: boolean = true;
    /** True, if GST filing needs to be shown */
    public showGstFiling: boolean = false;
    /** Holds active tab index */
    public activeTabIndex: number = 0;
    /** Stores the active company information observable*/
    public activeCompany$: Observable<any>;
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;
    /** Image path for assets */
    public imgPath: string = '';

    constructor(
        private route: Router,
        private activatedRoute: ActivatedRoute,
        private store: Store<AppState>,
        private gstAction: GstReconcileActions,
        private generalService: GeneralService,
        @Inject(ServiceConfig) private serviceConfig) {
        this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
        this.gstFileSuccess$ = this.store.pipe(select(p => p.gstR.gstReturnFileSuccess), takeUntil(this.destroyed$));
        this.gstr1OverviewDataFetchedSuccessfully$ = this.store.pipe(select(p => p.gstR.gstr1OverViewDataFetchedSuccessfully), takeUntil(this.destroyed$));
        this.gstr2OverviewDataFetchedSuccessfully$ = this.store.pipe(select(p => p.gstR.gstr2OverViewDataFetchedSuccessfully), takeUntil(this.destroyed$));
        this.gstr1OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr1OverViewDataInProgress), takeUntil(this.destroyed$));
        this.gstr2OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr2OverViewDataInProgress), takeUntil(this.destroyed$));
        this.gstFileSuccess$.subscribe(a => this.fileReturnSucces = a);
        this.activeCompany$ = this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$));
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
            }
        });
    }

    public ngOnInit() {
        this.imgPath = this.serviceConfig.IMG_PATH;
        if (this.generalService.voucherApiVersion === 2) {
            this.showGstFiling = true;
        }
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.currentPeriod = {
                from: params['from'],
                to: params['to']
            };
            if (params['return_type'] && (!params['from'] || !params['to'])) {
                this.pendingNavigateType = params['return_type'];
                return;
            } else {
                this.pendingNavigateType = null;
            }
            if (params['selectedGst']) {
                this.activeCompanyGstNumber = params['selectedGst'];
                this.store.dispatch(this.gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
            }
            this.store.dispatch(this.gstAction.SetSelectedPeriod(this.currentPeriod));
            const returnTypeChanged = this.selectedGst !== params['return_type'];
            if (returnTypeChanged) {
                this.selectedGst = params['return_type'];
            }
            if (params['return_type'] && params['from'] && params['to']) {
                this.loadGstReport(this.activeCompanyGstNumber);
            }
            let tab = Number(params['tab']);
            if (tab > -1) {
                this.selectTabFromUrl(tab);
            }
        });

        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });

        // get activeCompany gst number
        this.store.pipe(select(s => s.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(result => {
            this.loadGstReport(result);
        });
        this.getCurrentPeriod$ = this.store.pipe(select(appStore => appStore.gstR.currentPeriod), takeUntil(this.destroyed$));
        this.getCurrentPeriod$.subscribe(currentPeriod => {
            if (currentPeriod && currentPeriod.from) {
                let date = {
                    startDate: dayjs(currentPeriod.from, GIDDH_DATE_FORMAT).startOf('month').format(GIDDH_DATE_FORMAT),
                    endDate: dayjs(currentPeriod.to, GIDDH_DATE_FORMAT).endOf('month').format(GIDDH_DATE_FORMAT)
                };
                if (date.startDate === currentPeriod.from && date.endDate === currentPeriod.to) {
                    this.isMonthSelected = true;
                } else {
                    this.isMonthSelected = false;
                }
            }
        });
    }

    public selectTab(e, val, tabHeading) {
        this.selectedTab = tabHeading;
        this.isTransactionSummary = this.selectedTab !== this.localeData?.filing?.tabs?.overview;
        this.showTaxPro = val;
        this.fileReturnSucces = false;
    }

    /**
     * Select tab from url
     *
     * @param {number} tab
     * @memberof FilingComponent
     */
    public selectTabFromUrl(tab: number): void {
        this.activeTabIndex = tab;
    }

    public ngOnDestroy(): void {
        this.store.dispatch(this.gstAction.resetGstr1OverViewResponse());
        this.store.dispatch(this.gstAction.resetGstr2OverViewResponse());
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
    }

    /**
     * Opens the HSN/SAC section of GST report
     *
     * @memberof FilingComponent
     */
    public openHsnSacSection(): void {
        this.showHsn = true;
    }

    /**
     * Handle back button
     *
     * @memberof FilingComponent
     */
    public handleBackButton(): void {
        this.showHsn = false;
        this.selectTab('', false, this.localeData?.filing?.tabs?.overview);
    }

    /**
     * Navigates to the overview or dashboard page
     *
     * @param {string} type Type of report (gstr1, gstr2, gstr3b)
     * @memberof FilingComponent
     */
    public navigateToOverview(type: string): void {
        this.route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * Navigates to GSTR 3B
     *
     * @param {string} type Type of report (gstr1, gstr2, gstr3b)
     * @memberof FilingComponent
     */
    public navigateTogstR3B(type: string): void {
        this.route.navigate(['pages', 'gstfiling', 'gstR3'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, isCompany: this.isCompany, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * Handles navigation to other GST reports
     *
     * @param {string} type Type of report (gstr1, gstr2, gstr3b)
     * @memberof FilingComponent
     */
    public handleNavigation(type: string): void {
        switch (type) {
            case GstReport.Gstr1: case GstReport.Gstr2:
                this.navigateToOverview(type);
                break;
            case GstReport.Gstr3b:
                this.navigateTogstR3B(type);
                break;
            default: break;
        }
    }

    /**
     * Loads the GST report for a GST number
     *
     * @private
     * @param {string} gstNumber GST number
     * @memberof FilingComponent
     */
    private loadGstReport(gstNumber: string): void {
        if (gstNumber) {
            this.activeCompanyGstNumber = gstNumber;
        }
        
        if (!this.currentPeriod.from || !this.currentPeriod.to) {
            return;
        }

        let request: GstOverViewRequest = new GstOverViewRequest();
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;
        request.gstin = this.activeCompanyGstNumber;

        if (this.selectedGst === GstReport.Gstr1) {
            this.gstr1OverviewDataFetchedSuccessfully$.pipe(take(1)).subscribe(bool => {
                if (!bool) {
                    // it means no gstr1 data available or error occurred or user directly navigated to this tab
                    this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr1, request));
                }
            });
        } else if (this.selectedGst === GstReport.Gstr2) {
            this.gstr2OverviewDataFetchedSuccessfully$.pipe(take(1)).subscribe(bool => {
                if (!bool) {
                    // it means no gstr2 data available or error occurred or user directly navigated to this tab
                    this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr2, request));
                }
            });
        }

        // get session details
        this.store.dispatch(this.gstAction.GetGSPSession(this.activeCompanyGstNumber));
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof FilingComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.selectedTab = this.localeData?.filing?.tabs?.overview;
        }
    }

    /**
     * This will return gst return filed text
     *
     * @returns {string}
     * @memberof FilingComponent
     */
    public getGstReturnFieldText(): string {
        let text = this.localeData?.filing?.gst_filed_success;
        text = text?.replace("[PERIOD_FROM]", GiddhDatePipe.formatDate(this.currentPeriod?.from))?.replace("[PERIOD_TO]", GiddhDatePipe.formatDate(this.currentPeriod?.to));
        return text;
    }

    /**
     * This will return loading selected gst text
     *
     * @param {*} selectedGst
     * @returns {string}
     * @memberof FilingComponent
     */
    public getLoadingGstText(selectedGst: any): string {
        if (this.localeData) {
            let text = this.localeData?.filing?.loading_gst_data;
            text = text?.replace("[SELECTED_GST]", selectedGst);
            return text;
        }
    }

    /**
     * This will use for on tab changes
     *
     * @param {*} event
     * @memberof FilingComponent
     */
    public onTabChange(event: MatTabChangeEvent): void {
        if (event) {
            this.activeTabIndex = event.index;
            this.selectedTab = event.tab.textLabel;
            // show "Pull from GSTN" button for Reconcilation and File Return tab
            this.showTaxPro = event.index === 1 || event.index === 2;
        }
    }
}
