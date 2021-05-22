import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Observable, of, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GstReconcileActions } from '../../actions/gst-reconcile/GstReconcile.actions';
import { GstDatePeriod, GstOverViewRequest } from '../../models/api-models/GstReconcile';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { AppState } from '../../store';
import { GstReport } from '../constants/gst.constant';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'filing',
    templateUrl: 'filing.component.html',
    styleUrls: ['filing.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class FilingComponent implements OnInit, OnDestroy {
    @ViewChild('staticTabs', { static: true }) public staticTabs: TabsetComponent;
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /* Aside pane state*/
    public asideMenuState: string = 'out';
    /* this will check mobile screen size */
    public isMobileScreen: boolean = false;
    public currentPeriod: GstDatePeriod = null;
    public selectedGst: string = null;
    public gstNumber: string = null;
    public activeCompanyGstNumber: string = '';
    public selectedTab: string = '';
    public gstAuthenticated$: Observable<boolean>;
    public isTransactionSummary: boolean = false;
    public showTaxPro: boolean = false;
    public fileReturn: {} = { isAuthenticate: false };
    public selectedTabId: number = null;
    public gstFileSuccess$: Observable<boolean> = of(false);
    public fileReturnSucces: boolean = false;
    /** True, if HSN tab needs to be opened by default (required if a user clicks on HSN data in GSTR1) */
    public showHsn: boolean;

    public gstr1OverviewDataInProgress$: Observable<boolean>;
    public gstr2OverviewDataInProgress$: Observable<boolean>;

    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }

    private gstr1OverviewDataFetchedSuccessfully$: Observable<boolean>;
    private gstr2OverviewDataFetchedSuccessfully$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private _route: Router,
        private activatedRoute: ActivatedRoute,
        private store: Store<AppState>,
        private _gstAction: GstReconcileActions,
        private generalService: GeneralService,
        private breakpointObserver: BreakpointObserver) {
        this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
        this.gstFileSuccess$ = this.store.pipe(select(p => p.gstR.gstReturnFileSuccess), takeUntil(this.destroyed$));
        this.gstr1OverviewDataFetchedSuccessfully$ = this.store.pipe(select(p => p.gstR.gstr1OverViewDataFetchedSuccessfully), takeUntil(this.destroyed$));
        this.gstr2OverviewDataFetchedSuccessfully$ = this.store.pipe(select(p => p.gstR.gstr2OverViewDataFetchedSuccessfully), takeUntil(this.destroyed$));
        this.gstr1OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr1OverViewDataInProgress), takeUntil(this.destroyed$));
        this.gstr2OverviewDataInProgress$ = this.store.pipe(select(p => p.gstR.gstr2OverViewDataInProgress), takeUntil(this.destroyed$));

        this.gstFileSuccess$.subscribe(a => this.fileReturnSucces = a);

        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
            }
        });
    }
    /**
     * Aside pane toggle fixed class
     *
     *
     * @memberof FilingComponent
     */
    public toggleBodyClass(): void {
        if (this.asideGstSidebarMenuState === 'in') {
            document.querySelector('body').classList.add('gst-sidebar-open');
        } else {
            document.querySelector('body').classList.remove('gst-sidebar-open');
        }
    }
    /**
      * This will toggle the settings popup
      *
      * @param {*} [event]
      * @memberof FilingComponent
      */
    public toggleGstPane(event?): void {
        this.toggleBodyClass();

        if (this.isMobileScreen && event && this.asideGstSidebarMenuState === 'in') {
            this.asideGstSidebarMenuState = "out";
        }
    }

    public ngOnInit() {
        this.breakpointObserver
        .observe(['(max-width: 768px)'])
        .pipe(takeUntil(this.destroyed$))
        .subscribe((state: BreakpointState) => {
            this.isMobileScreen = state.matches;
            if (!this.isMobileScreen) {
                this.asideGstSidebarMenuState = 'in';
            }
        });
        this.toggleGstPane();
        this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.currentPeriod = {
                from: params['from'],
                to: params['to']
            };
            if (params['selectedGst']) {
                this.activeCompanyGstNumber = params['selectedGst'];
                this.store.dispatch(this._gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
            }
            this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));
            if (this.selectedGst !== params['return_type']) {
                this.selectedGst = params['return_type'];
                this.loadGstReport(this.activeCompanyGstNumber);
            }
            //
            let tab = Number(params['tab']);
            if (tab > -1) {
                this.selectTabFromUrl(tab);
            }
        });

        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;

        // get activeCompany gst number
        this.store.pipe(select(s => s.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(result => {
            this.loadGstReport(result);
        });
    }

    public selectTab(e, val, tabHeading) {
        this.selectedTab = tabHeading;
        this.isTransactionSummary = this.selectedTab !== this.localeData?.filing?.tabs?.overview;
        this.showTaxPro = val;
        this.fileReturnSucces = false;
        // this._route.navigate(['pages', 'gstfiling', 'filing-return'], {queryParams: {return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: this.selectedTabId}});
    }

    public selectTabFromUrl(tab: number) {
        if (this.staticTabs && this.staticTabs.tabs && this.staticTabs.tabs[tab]) {
            this.selectedTabId = tab;
            this.staticTabs.tabs[this.selectedTabId].active = true;
        }
    }

    public ngOnDestroy(): void {
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
        this.selectTab('', true, 'pushToGstn');
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
     * @param {*} type Type of report (gstr1, gstr2, gstr3b)
     * @memberof FilingComponent
     */
    public navigateToOverview(type) {
        this._route.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * Navigates to GSTR 3B
     *
     * @param {*} type Type of report (gstr1, gstr2, gstr3b)
     * @memberof FilingComponent
     */
    public navigateTogstR3B(type) {
        this._route.navigate(['pages', 'gstfiling', 'gstR3'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, isCompany: this.isCompany, selectedGst: this.activeCompanyGstNumber } });
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

        let request: GstOverViewRequest = new GstOverViewRequest();
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;
        request.gstin = this.activeCompanyGstNumber;

        if (this.selectedGst === GstReport.Gstr1) {
            this.gstr1OverviewDataFetchedSuccessfully$.pipe(take(1)).subscribe(bool => {
                if (!bool) {
                    // it means no gstr1 data available or error occurred or user directly navigated to this tab
                    this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr1, request));
                }
            });
        } else {
            this.gstr2OverviewDataFetchedSuccessfully$.pipe(take(1)).subscribe(bool => {
                if (!bool) {
                    // it means no gstr2 data available or error occurred or user directly navigated to this tab
                    this.store.dispatch(this._gstAction.GetOverView(GstReport.Gstr2, request));
                }
            });
        }

        // get session details
        this.store.dispatch(this._gstAction.GetGSPSession(this.activeCompanyGstNumber));

        this.store.pipe(select(appState => appState.general.openGstSideMenu), takeUntil(this.destroyed$)).subscribe(shouldOpen => {
            if (this.isMobileScreen) {
                if (shouldOpen) {
                    this.asideGstSidebarMenuState = 'in';
                } else {
                    this.asideGstSidebarMenuState = 'out';
                }
            }
        });
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof FilingComponent
     */
    public translationComplete(event: any): void {
        if(event) {
            this.selectedTab = this.localeData?.filing?.tabs?.overview;
        }
    }

    /**
     * This will return gst return filed text
     *
     * @returns {string}
     * @memberof FilingComponent
     */
    public getGstReturnFiledText(): string {
        let text = this.localeData?.filing?.gst_filed_success;
        text = text?.replace("[PERIOD_FROM]", this.currentPeriod?.from)?.replace("[PERIOD_TO]", this.currentPeriod.to);
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
        let text = this.localeData?.loading_gst_data;
        text = text?.replace("[SELECTED_GST]", selectedGst);
        return text;
    }
}
