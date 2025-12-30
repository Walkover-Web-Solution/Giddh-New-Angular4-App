import * as dayjs from 'dayjs';
import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { Observable, ReplaySubject, of } from 'rxjs';
import {
    GstOverViewRequest,
    GstDatePeriod,
    Gstr3bOverviewResult2
} from '../../models/api-models/GstReconcile';
import { takeUntil, take } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import { GstReconcileActions } from '../../actions/gst-reconcile/gst-reconcile.actions';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MONTH_YEAR } from '../../shared/helpers/defaultDateFormat';
import { InvoicePurchaseActions } from '../../actions/purchase-invoice/purchase-invoice.action';
import { GstReport, TaxServiceEnum, TaxServiceType } from '../constants/gst.constant';
import { GeneralService } from '../../services/general.service';
import { FormControl } from '@angular/forms';
import { BreakpointObserver } from "@angular/cdk/layout";
import { ASIDE_PANE_CONFIG, BREAKPOINT_SCREEN_SIZE, RestrictedModules } from '../../app.constant';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GstComponentStore } from '../gst.store';

@Component({
    selector: 'file-gstr3',
    templateUrl: './gstR3.component.html',
    styleUrls: ['gstR3.component.scss'],
    providers: [GstComponentStore],
    standalone: false
})
export class FileGstR3Component implements OnInit, OnDestroy {
    /** Aside authentication dialog open */
    @ViewChild("asideAuthentication") asideAuthenticationDialog: TemplateRef<any>;
    /** Holds cancel confirmation dialog template ref */
    @ViewChild("cancelConfirmationDialog") cancelConfirmationDialog: TemplateRef<any>;
    /** This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
    public gstr3BData: Gstr3bOverviewResult2;
    public currentPeriod: GstDatePeriod = null;
    public selectedGstr: string = null;
    public gstNumber: string = null;
    public activeCompanyGstNumber: string = '';
    public selectedMonth: any = null;
    public selectedGstr3BTab: string = 'pushGSTN';
    public returnGstr3B: {} = { via: null };
    public gstFileSuccess$: Observable<boolean> = of(false);
    public fileReturnSucces: boolean = false;
    public showTaxPro: boolean = true;
    public gstAuthenticated$: Observable<boolean>;
    public gstAuthenticated: boolean = false;
    public dateSelected: boolean = false;
    public userEmail: string = '';
    public selectedMMYYYY: string = '';
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    private gstr3BOverviewDataFetchedSuccessfully$: Observable<boolean>;
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
    /** Custom selected month */
    public customMonth: string = '';
    /** Holds start month/year */
    public startAt: Date = new Date();
    /** Holds selected date */
    public date: FormControl<string | null> = new FormControl<string | null>('');
    /** Holds displayed columns */
    public gstrUserTableDataDisplayedColumns: string[] = ['number', 'label', 'value'];
    /** Holds gstr user table data */
    public gstrUserTableData: any[] = []
    /** Holds displayed columns */
    public gstr3bTableDataDisplayedColumns: string[] = ['supplyNature', 'taxableValue', 'integratedTax', 'centralTax', 'stateUtTax', 'cessTax'];
    /** Holds gstr3b table data */
    public gstr3bTableData: any[] = [];
    /** Holds Gstr3b supplies table data */
    public suppliesTableData: any[] = [];
    /** Holds supplies table data displayed columns */
    public suppliesTableDataDisplayedColumns: string[] = ['empty', 'placeOfSupply', 'taxableValue', 'integratedTax'];
    /** Holds itc displayed columns */
    public itcDisplayedColumns: string[] = ['details', 'integratedTax', 'centralTax', 'stateUtTax', 'cessTax'];
    /** Holds itc table data */
    public itcTableData: any[] = [];
    /** Holds exempt values displayed columns */
    public exemptValuesDisplayedColumns: string[] = ['supplyNature', 'interStateSupplies', 'intraStateSupplies'];
    /** Holds exempt values table data */
    public exemptValuesTableData: any[] = [];
     /** Holds true, if screen size  less than or equals to 1024px */
    public isTabScreen: boolean = false;
    /** Holds selected service */
    public selectedService: TaxServiceType;
    /** Holds aside authentication dialog ref */
    public asideAuthenticationDialogRef: MatDialogRef<any>;
    /** Holds cancel confirmation dialog ref */
    public cancelConfirmationDialogRef: MatDialogRef<any>;
    /** Stores the active company information observable*/
    public activeCompany$: Observable<any>;
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;
    /** Holds GST return type */
    public returnType: string = GstReport.Gstr3b;

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private toasty: ToasterService,
        private gstAction: GstReconcileActions,
        private activatedRoute: ActivatedRoute,
        private invoicePurchaseActions: InvoicePurchaseActions,
        private generalService: GeneralService,
        private breakPointObservar: BreakpointObserver,
        private dialog: MatDialog,
        private componentStore: GstComponentStore
    ) {
        this.gstAuthenticated$ = this.store.pipe(select(state => state.gstR.gstAuthenticated), takeUntil(this.destroyed$));
        this.activeCompany$ = this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$));
        this.gstr3BOverviewDataFetchedSuccessfully$ = this.store.pipe(select(p => p.gstR.gstr3BOverViewDataFetchedSuccessfully), takeUntil(this.destroyed$));
        this.gstFileSuccess$ = this.store.pipe(select(p => p.gstR.gstReturnFileSuccess), takeUntil(this.destroyed$));
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
            }
        });
        this.gstFileSuccess$.subscribe(a => this.fileReturnSucces = a);
    }

    public ngOnInit(): void {
        if (this.generalService.voucherApiVersion === 2) {
            this.showGstFiling = true;
        }
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.activatedRoute.queryParams.pipe(take(1)).subscribe(params => {
            this.currentPeriod = {
                from: params['from'],
                to: params['to']
            };
            if (params['selectedGst']) {
                this.activeCompanyGstNumber = params['selectedGst'];
                this.store.dispatch(this.gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
            }
            this.isCompany = params['isCompany'] === 'true';
            if (!this.selectedMonth) {
                this.selectedMonth = dayjs(this.currentPeriod.from, GIDDH_DATE_FORMAT).toISOString();
                this.date.setValue(dayjs(this.selectedMonth).format(GIDDH_DATE_FORMAT_MONTH_YEAR));
            }
            this.store.dispatch(this.gstAction.SetSelectedPeriod(this.currentPeriod));
            this.selectedGstr = params['return_type'];
        });

        this.gstAuthenticated$.subscribe((a) => this.gstAuthenticated = a);
        this.store.pipe(select(s => s.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(result => {
            if (result) {
                this.activeCompanyGstNumber = result;
                // get session details
                this.store.dispatch(this.gstAction.GetGSPSession(this.activeCompanyGstNumber));
            }

            let request: GstOverViewRequest = new GstOverViewRequest();
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            request.gstin = this.activeCompanyGstNumber;

            this.gstr3BOverviewDataFetchedSuccessfully$.pipe(takeUntil(this.destroyed$)).subscribe(bool => {
                if (!bool && !this.dateSelected) {
                    this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr3b, request));
                }
            });
        });

        this.store.pipe(select(p => p.gstR.gstr3BOverViewDate), takeUntil(this.destroyed$)).subscribe((response: Gstr3bOverviewResult2) => {

            if (response) {
                this.gstr3BData = response;
                if (this.gstr3BData.ret_period) {
                    this.selectedMMYYYY = this.gstr3BData.ret_period
                }
                if (this.gstr3BData) {

                    if (this.gstr3BData.sup_details) {
                        this.gstr3BData.sumTaxVal =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.txval ? this.gstr3BData.sup_details.osup_det.txval : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.txval ? this.gstr3BData.sup_details.isup_rev.txval : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.txval ? this.gstr3BData.sup_details.osup_nil_exmp.txval : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.txval ? this.gstr3BData.sup_details.osup_nongst.txval : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.txval ? this.gstr3BData.sup_details.osup_zero.txval : 0) : 0));

                        this.gstr3BData.sumIamtVal =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.iamt ? this.gstr3BData.sup_details.osup_det.iamt : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.iamt ? this.gstr3BData.sup_details.isup_rev.iamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.iamt ? this.gstr3BData.sup_details.osup_nil_exmp.iamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.iamt ? this.gstr3BData.sup_details.osup_nongst.iamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.iamt ? this.gstr3BData.sup_details.osup_zero.iamt : 0) : 0));

                        this.gstr3BData.sumCamtval =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.camt ? this.gstr3BData.sup_details.osup_det.camt : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.camt ? this.gstr3BData.sup_details.isup_rev.camt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.camt ? this.gstr3BData.sup_details.osup_nil_exmp.camt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.camt ? this.gstr3BData.sup_details.osup_nongst.camt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.camt ? this.gstr3BData.sup_details.osup_zero.camt : 0) : 0));

                        this.gstr3BData.sumSamtval =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.samt ? this.gstr3BData.sup_details.osup_det.samt : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.samt ? this.gstr3BData.sup_details.isup_rev.samt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.samt ? this.gstr3BData.sup_details.osup_nil_exmp.samt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.samt ? this.gstr3BData.sup_details.osup_nongst.samt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.samt ? this.gstr3BData.sup_details.osup_zero.samt : 0) : 0));

                        this.gstr3BData.sumCsamtval =
                            ((this.gstr3BData.sup_details.osup_det ?
                                (this.gstr3BData.sup_details.osup_det.csamt ? this.gstr3BData.sup_details.osup_det.csamt : 0) : 0) +
                                (this.gstr3BData.sup_details.isup_rev ?
                                    (this.gstr3BData.sup_details.isup_rev.csamt ? this.gstr3BData.sup_details.isup_rev.csamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nil_exmp ?
                                    (this.gstr3BData.sup_details.osup_nil_exmp.csamt ? this.gstr3BData.sup_details.osup_nil_exmp.csamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_nongst ?
                                    (this.gstr3BData.sup_details.osup_nongst.csamt ? this.gstr3BData.sup_details.osup_nongst.csamt : 0) : 0) +
                                (this.gstr3BData.sup_details.osup_zero ?
                                    (this.gstr3BData.sup_details.osup_zero.csamt ? this.gstr3BData.sup_details.osup_zero.csamt : 0) : 0));
                    }
                }
                this.setGstrUserTableData();
                this.setGstr3bTableData();
                this.setGstr3bSuppliesTableData();
                this.setIctTableData();
                this.setExemptValuesTableData();
            }
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
        this.breakPointObservar.observe([
            BREAKPOINT_SCREEN_SIZE.TABLET
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isTabScreen = result.breakpoints[BREAKPOINT_SCREEN_SIZE.TABLET];
        });

        this.componentStore.fileGstr3BSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.asideAuthenticationDialogRef?.close();
            }
        });
    }

    /**
     * Sets gstr user table data
     *
     * @memberof GstR3Component
     */
    public setGstrUserTableData(): void {
        this.gstrUserTableData = [
            {
                number: this.commonLocaleData?.app_numbers?.one + '.',
                label: this.commonLocaleData?.app_gstin,
                value: this.gstr3BData?.gstin
            },
            {
                number: this.commonLocaleData?.app_numbers?.two + '.',
                label: this.localeData?.gstr3b?.gst_username,
                value: this.gstr3BData?.ret_period
            }
        ];
    }

    /**
     * Sets gstr3b table data
     *
     * @memberof GstR3Component
     */
    public setGstr3bTableData(): void {
        this.gstr3bTableData = [
            {
                supplyNature: this.localeData?.gstr3b?.outward_taxable_supplies_non_zero,
                taxableValue: this.gstr3BData?.sup_details?.osup_det?.txval,
                integratedTax: this.gstr3BData?.sup_details?.osup_det?.iamt,
                centralTax: this.gstr3BData?.sup_details?.osup_det?.camt,
                stateUtTax: this.gstr3BData?.sup_details?.osup_det?.samt,
                cessTax: this.gstr3BData?.sup_details?.osup_det?.csamt,
                hideIntegratedTax: false,
                hideCentralTax: false,
                hideStateUtTax: false,
                hideCessTax: false
            },
            {
                supplyNature: this.localeData?.gstr3b?.outward_taxable_supplies_zero,
                taxableValue: this.gstr3BData?.sup_details?.osup_zero?.txval,
                integratedTax: this.gstr3BData?.sup_details?.osup_zero?.iamt,
                centralTax: null,
                stateUtTax: null,
                cessTax: this.gstr3BData?.sup_details?.osup_zero?.csamt,
                hideIntegratedTax: false,
                hideCentralTax: true,
                hideStateUtTax: true,
                hideCessTax: false
            },
            {
                supplyNature: this.localeData?.gstr3b?.other_outward_supplies,
                taxableValue: this.gstr3BData?.sup_details?.osup_nil_exmp?.txval || 0,
                integratedTax: null,
                centralTax: null,
                stateUtTax: null,
                cessTax: null,
                hideIntegratedTax: true,
                hideCentralTax: true,
                hideStateUtTax: true,
                hideCessTax: true
            },
            {
                supplyNature: this.localeData?.gstr3b?.inward_supplies,
                taxableValue: this.gstr3BData?.sup_details?.isup_rev?.txval || 0,
                integratedTax: this.gstr3BData?.sup_details?.isup_rev?.iamt || 0,
                centralTax: this.gstr3BData?.sup_details?.isup_rev?.camt || 0,
                stateUtTax: this.gstr3BData?.sup_details?.isup_rev?.samt || 0,
                cessTax: this.gstr3BData?.sup_details?.isup_rev?.csamt || 0,
                hideIntegratedTax: false,
                hideCentralTax: false,
                hideStateUtTax: false,
                hideCessTax: false
            },
            {
                supplyNature: this.localeData?.gstr3b?.non_gst_outward_supplies,
                taxableValue: this.gstr3BData?.sup_details?.osup_nongst?.txval || 0,
                integratedTax: null,
                centralTax: null,
                stateUtTax: null,
                cessTax: null,
                hideIntegratedTax: true,
                hideCentralTax: true,
                hideStateUtTax: true,
                hideCessTax: true
            }
        ];
    }

    /**
     * Sets exempt values table data
     *
     * @memberof GstR3Component
     */
    public setExemptValuesTableData(): void {
        if (this.gstr3BData?.inward_sup?.isup_details) {
            this.exemptValuesTableData = this.gstr3BData.inward_sup.isup_details.map(item => ({
                supplyNature: item.ty === 'GST' ? this.localeData?.gstr3b?.composition_schema : this.localeData?.gstr3b?.nongst_supply,
                inter: item.inter,
                intra: item.intra
            }));
        } else {
            this.exemptValuesTableData = [];
        }
    }

    /**
     * Sets itc table data
     *
     * @memberof GstR3Component
     */
    public setIctTableData(): void {
        const tableData = [];

        // ITC Available Section
        if (this.gstr3BData?.itc_elg?.itc_avl) {
            tableData.push({
                type: 'header',
                details: this.localeData?.gstr3b?.itc_available
            });

            (Array.isArray(this.gstr3BData.itc_elg.itc_avl) ? this.gstr3BData.itc_elg.itc_avl : []).forEach(item => {
                switch (item.ty) {
                    case 'IMPG':
                        tableData.push({
                            type: 'data',
                            details: this.localeData?.gstr3b?.goods_import,
                            iamt: item.iamt,
                            csamt: item.csamt,
                            hideCentralTax: true,
                            hideStateUtTax: true,
                            hideCessTax: false,
                            hideIntegratedTax: false
                        });
                        break;
                    case 'IMPS':
                        tableData.push({
                            type: 'data',
                            details: this.localeData?.gstr3b?.services_import,
                            iamt: item.iamt,
                            csamt: item.csamt,
                            hideCentralTax: true,
                            hideStateUtTax: true,
                            hideCessTax: false,
                            hideIntegratedTax: false
                        });
                        break;
                    case 'ISRC':
                        tableData.push({
                            type: 'data',
                            details: this.localeData?.gstr3b?.inward_supplies3,
                            iamt: item.iamt,
                            camt: item.camt,
                            samt: item.samt,
                            csamt: item.csamt,
                            hideCentralTax: false,
                            hideStateUtTax: false,
                            hideCessTax: false,
                            hideIntegratedTax: false
                        });
                        break;
                    case 'ISD':
                        tableData.push({
                            type: 'data',
                            details: this.localeData?.gstr3b?.inward_supplies_isd,
                            iamt: null,
                            camt: null,
                            samt: null,
                            csamt: null,
                            hideCentralTax: true,
                            hideStateUtTax: true,
                            hideCessTax: true,
                            hideIntegratedTax: true,
                            isNotSupported: true
                        });
                        break;
                    case 'OTH':
                        tableData.push({
                            type: 'data',
                            details: this.localeData?.gstr3b?.all_other_itc,
                            iamt: item.iamt,
                            camt: item.camt,
                            samt: item.samt,
                            csamt: item.csamt,
                            hideCentralTax: false,
                            hideStateUtTax: false,
                            hideCessTax: false,
                            hideIntegratedTax: false
                        });
                        break;
                }
            });
        }

        // ITC Reversed Section
        if (this.gstr3BData?.itc_elg?.itc_rev) {
            tableData.push({
                type: 'header',
                details: this.localeData?.gstr3b?.itc_reversed
            });

            (Array.isArray(this.gstr3BData.itc_elg.itc_rev) ? this.gstr3BData.itc_elg.itc_rev : []).forEach(item => {
                switch (item.ty) {
                    case 'RUL':
                        tableData.push({
                            type: 'data',
                            details: this.localeData?.gstr3b?.cgst_rules,
                            iamt: item.iamt,
                            camt: item.camt,
                            samt: item.samt,
                            csamt: item.csamt,
                            hideCentralTax: false,
                            hideStateUtTax: false,
                            hideCessTax: false,
                            hideIntegratedTax: false
                        });
                        break;
                    case 'OTH':
                        tableData.push({
                            type: 'data',
                            details: this.localeData?.gstr3b?.others,
                            iamt: item.iamt,
                            camt: item.camt,
                            samt: item.samt,
                            csamt: item.csamt,
                            hideCentralTax: false,
                            hideStateUtTax: false,
                            hideCessTax: false,
                            hideIntegratedTax: false
                        });
                        break;
                }
            });
        }

        // Net ITC Available
        if (this.gstr3BData?.itc_elg?.itc_net) {
            tableData.push({
                type: 'header',
                details: this.localeData?.gstr3b?.net_itc_available,
                iamt: this.gstr3BData.itc_elg.itc_net.iamt || 0,
                camt: this.gstr3BData.itc_elg.itc_net.camt || 0,
                samt: this.gstr3BData.itc_elg.itc_net.samt || 0,
                csamt: this.gstr3BData.itc_elg.itc_net.csamt || 0,
                hideCentralTax: false,
                hideStateUtTax: false,
                hideCessTax: false,
                hideIntegratedTax: false
            });
        }

        // Ineligible ITC Section
        if (this.gstr3BData?.itc_elg?.itc_inelg) {
            tableData.push({
                type: 'header',
                details: this.localeData?.gstr3b?.ineligible_itc
            });

            (Array.isArray(this.gstr3BData.itc_elg.itc_inelg) ? this.gstr3BData.itc_elg.itc_inelg : []).forEach(item => {
                switch (item.ty) {
                    case 'RUL':
                        tableData.push({
                            type: 'data',
                            details: this.localeData?.gstr3b?.section_17,
                            iamt: item.iamt,
                            camt: item.camt,
                            samt: item.samt,
                            csamt: item.csamt,
                            hideCentralTax: false,
                            hideStateUtTax: false,
                            hideCessTax: false,
                            hideIntegratedTax: false
                        });
                        break;
                    case 'OTH':
                        tableData.push({
                            type: 'data',
                            details: this.localeData?.gstr3b?.others,
                            iamt: item.iamt,
                            camt: item.camt,
                            samt: item.samt,
                            csamt: item.csamt,
                            hideCentralTax: false,
                            hideStateUtTax: false,
                            hideCessTax: false,
                            hideIntegratedTax: false
                        });
                        break;
                }
            });
        }

        this.itcTableData = tableData;
    }

    /**
     * Sets Gstr3b supplies table data
     *
     * @memberof GstR3Component
     */
    public setGstr3bSuppliesTableData(): void {
        this.suppliesTableData = [];

        // Add subheading for unregistered persons
        this.suppliesTableData.push({
            isSubheading: true,
            subheadingText: this.localeData?.gstr3b?.supplies_unregistered_persons
        });

        // Add unregistered details
        if (this.gstr3BData?.inter_sup?.unreg_details) {
            this.suppliesTableData.push(...this.gstr3BData.inter_sup.unreg_details.map(item => ({
                ...item,
                isSubheading: false
            })));
        }

        // Add subheading for composition taxable persons
        this.suppliesTableData.push({
            isSubheading: true,
            subheadingText: this.localeData?.gstr3b?.supplies_composition_taxable_persons
        });

        // Add composition details
        if (this.gstr3BData?.inter_sup?.comp_details) {
            this.suppliesTableData.push(...this.gstr3BData.inter_sup.comp_details.map(item => ({
                ...item,
                isSubheading: false
            })));
        }

        // Add subheading for UIN holders
        this.suppliesTableData.push({
            isSubheading: true,
            subheadingText: this.localeData?.gstr3b?.supplies_uin_holders
        });

        // Add UIN details
        if (this.gstr3BData?.inter_sup?.uin_details) {
            this.suppliesTableData.push(...this.gstr3BData.inter_sup.uin_details.map(item => ({
                ...item,
                isSubheading: false
            })));
        }
    }

    /**
     * Period changed
     *
     * @param {*} date
     * @memberof GstR3Component
     */
    public periodChanged(date:  any): void {
        if (date) {
            this.selectedMonth = date;
            this.currentPeriod = {
                from: dayjs(date?.from).format(GIDDH_DATE_FORMAT),
                to: dayjs(date?.to).format(GIDDH_DATE_FORMAT)
            };
            this.isMonthSelected = true;
            this.dateSelected = true;
            this.store.dispatch(this.gstAction.SetSelectedPeriod(this.currentPeriod));
            let request: GstOverViewRequest = new GstOverViewRequest();
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            request.gstin = this.activeCompanyGstNumber;
            this.store.dispatch(this.gstAction.GetOverView(GstReport.Gstr3b, request));
        }
    }

    public selectedTab(tabType) {
        this.selectedGstr3BTab = tabType;
    }

    /**
     * Download/Email GSTR3B sheet
     *
     * @param {boolean} isDownloadDetailSheet
     * @returns
     * @memberof FileGstR3Component
     */
    public emailGSTR3bSheet(isDownloadDetailSheet: boolean) {

        if (!this.userEmail) {
            return this.toasty.showSnackBar('error', this.localeData?.email_required_error);
        }
        // Note:- appended ",1" with selectedMonth (July 2020) because "July 2020" format does not support for firefox browser and ("July 2020, 1") is valid format for chrome and firefox browser
        let convertValidDateFormat = this.date.value + ',1';
        let monthToSend = dayjs(convertValidDateFormat).format("MM") + "-" + dayjs(convertValidDateFormat).format("YYYY");
        if (!monthToSend) {
            this.toasty.showSnackBar('error', this.localeData?.month_required_error);
        } else if (!this.activeCompanyGstNumber) {
            return this.toasty.showSnackBar('error', this.localeData?.gstin_unavailable_error);
        } else {
            this.store.dispatch(this.invoicePurchaseActions.SendGSTR3BEmail(monthToSend, this.activeCompanyGstNumber, isDownloadDetailSheet, this.userEmail));
            this.userEmail = '';
        }
    }

    /**
    * Unsubscribes from subscription
    *
    * @memberof GstComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.store.dispatch(this.gstAction.resetGstr3BOverViewResponse());
    }

    /**
     * Handles GST sidebar navigation event
     *
     * @param {string} type Type of report (gstr1, gstr2, gstr3b) to navigate to
     * @memberof FileGstR3Component
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
     * Navigates to the overview or dashboard page
     *
     * @param {*} type Type of report (gstr1, gstr2, gstr3b)
     * @memberof FileGstR3Component
     */
    public navigateToOverview(type): void {
        this.router.navigate(['pages', 'gstfiling', 'filing-return'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: 0, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * Navigates to GSTR 3B
     *
     * @param {*} type Type of report (gstr1, gstr2, gstr3b)
     * @memberof FileGstR3Component
     */
    public navigateTogstR3B(type): void {
        this.router.navigate(['pages', 'gstfiling', 'gstR3'], { queryParams: { return_type: type, from: this.currentPeriod.from, to: this.currentPeriod.to, isCompany: this.isCompany, selectedGst: this.activeCompanyGstNumber } });
    }

    /**
     * This will return gst return filed text
     *
     * @returns {string}
     * @memberof FileGstR3Component
     */
    public getGstReturnFieldText(): string {
        let text = this.localeData?.filing?.gst_filed_success;
        text = text?.replace("[PERIOD_FROM]", this.currentPeriod?.from)?.replace("[PERIOD_TO]", this.currentPeriod.to);
        return text;
    }

    /**
    * Sets month/year
    *
    * @param {*} date - Selected date from giddh-datepicker
    * @memberof FileGstR3Component
    */
    public setMonthAndYear(date: any): void {
        const selectedMonth = new Date(date);
        const firstDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        const lastDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
        this.dateSelectedEvent([firstDay, lastDay]);
    }

    /**
     * Selects date and call api
     *
     * @param {*} event
     * @memberof FilingHeaderComponent
     */
    public dateSelectedEvent(event: any): void {
        this.customMonth = event[0].toLocaleString('en-us', { month: 'long', year: 'numeric' });
        this.date.setValue(this.customMonth);
        this.periodChanged({ from: event[0], to: event[1] });
    }

    /**
    * Callback for translation response complete
    *
    * @param {*} event
    * @memberof FilingHeaderComponent
    */
    public translationComplete(event: any): void {
        if (event) {
            this.setGstrUserTableData();
            this.setGstr3bTableData();
            this.setGstr3bSuppliesTableData();
            this.setIctTableData();
            this.setExemptValuesTableData();
        }
    }

    /**
     * Open setting aside pane dialog
     *
     * @memberof FilingHeaderComponent
     */
    public openSettingAsidePane(): void {
        this.selectedService = TaxServiceEnum.TAXPRO;
        this.asideAuthenticationDialogRef = this.dialog.open(this.asideAuthenticationDialog, {...ASIDE_PANE_CONFIG, autoFocus: false});
    }

    /**
     * Open cancel confirmation dialog
     *
     * @memberof FilingHeaderComponent
     */
    public openCancelConfirmationDialog(): void {
        this.cancelConfirmationDialogRef = this.dialog.open(this.cancelConfirmationDialog, {
            panelClass: ['mat-dialog-sm'],
            disableClose: true
        });
    }

    /**
     * File GSTR3B
     *
     * @memberof FileGstR3Component
     */
    public fileGstr3B(): void {
        const monthYear = dayjs(this.currentPeriod.from, GIDDH_DATE_FORMAT).format('MM-YYYY');
        const currentDateTime = this.generalService.getCurrentDateTime();
        this.componentStore.fileGstr3B({
            period: this.currentPeriod,
            gstNumber: this.activeCompanyGstNumber,
            via: TaxServiceEnum.TAXPRO,
            monthYear,
            currentDateTime
        });
    }

    /**
     * Checks authentication status and either files GSTR3B or opens settings pane
     *
     * @memberof FileGstR3Component
     */
    public checkAuthenticationAndFileGstr3B(): void {
        if (this.gstAuthenticated) {
            this.fileGstr3B();
        } else {
            this.openSettingAsidePane();
        }
    }

    /**
    * Navigates to the page for buy plan.
    *
    * @param subscriptionId
    * @memberof FileGstR3Component
    */
    public buyPlan(subscriptionId: string): void {
        this.router.navigate(['/pages/user-details/subscription/buy-plan/' + subscriptionId]);
    }
}
