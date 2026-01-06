import * as dayjs from 'dayjs';
import { Component, Input, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { InvoicePurchaseActions } from '../../../actions/purchase-invoice/purchase-invoice.action';
import { GstOverViewRequest, GstReconcileActionsEnum, GstReconcileInvoiceRequest, GstrJsonDownloadRequest, GstrSheetDownloadRequest } from '../../../models/api-models/GstReconcile';
import { select, Store } from '@ngrx/store';
import { ToasterService } from '../../../services/toaster.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../../store';
import { takeUntil } from 'rxjs/operators';
import { GstReconcileActions } from '../../../actions/gst-reconcile/gst-reconcile.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MONTH_YEAR } from '../../../shared/helpers/defaultDateFormat';
import { GstReport, TaxServiceEnum, TaxServiceType } from '../../constants/gst.constant';
import { GstReconcileService } from '../../../services/gst-reconcile.service';
import { GeneralService } from '../../../services/general.service';
import { saveAs } from 'file-saver';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { ServiceConfig } from '../../../services/service.config';
import { ASIDE_PANE_CONFIG, Configuration, RestrictedModules } from '../../../app.constant';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'filing-header',
    templateUrl: 'filing-header.component.html',
    styleUrls: ['filing-header.component.scss'],
    standalone:false
})
export class FilingHeaderComponent implements OnInit, OnChanges, OnDestroy {
    @Input() public currentPeriod: any = null;
    @Input() public selectedGst: string = null;
    @Input() public showTaxPro: boolean = false;
    @Input() public isMonthSelected: boolean = false;
    @Input() public fileReturn: {} = { isAuthenticate: false };
    @Input() public fileGstr3b: {} = { via: null };
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** True if current organization is company */
    @Input() public isCompany: boolean;
    /** True if current organization is consolidated branch */
    @Input() public isConsolidatedBranch: boolean;
    /** Holds cancel confirmation dialog template ref */
    @ViewChild("cancelConfirmationDialog") cancelConfirmationDialog: TemplateRef<any>;
    /** Holds cancel confirmation dialog ref */
    public cancelConfirmationDialogRef: MatDialogRef<any>;
    /** Holds cancel push to portal dialog template ref */
    @ViewChild("pushToPortalDialog") pushToPortalDialog: TemplateRef<any>;
    /** Aside authentication dialog open */
    @ViewChild("asideAuthentication") asideAuthenticationDialog: TemplateRef<any>;
    public gstAuthenticated$: Observable<boolean>;
    /** Stores the active company information observable*/
    public activeCompany$: Observable<any>;
    public selectedService: TaxServiceType;
    public companyGst$: Observable<string> = of('');
    public activeCompanyGstNumber: string = '';
    public imgPath: string = '';
    public gstAuthenticated: boolean = false;
    public gstSessionResponse$: Observable<any> = of({});
    public isTaxproAuthenticated: boolean = false;
    public isVayanaAuthenticated: boolean = false;
    /** Returns the enum to be used in template */
    public get GstReport() {
        return GstReport;
    }
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** True, if GST filing needs to be shown */
    public showGstFiling: boolean = false;
    /** This will use for selected month on datepicker*/
    public selectedMonth: any = null;
    /** This will use for hold url */
    public holdActiveRoute: boolean;
    /** This will use for date show */
    public showDate: boolean = true;
    /** Instance of dayjs */
    public dayjs = dayjs;
    /** Holds aside authentication dialog ref */
    public asideAuthenticationDialogRef: MatDialogRef<any>;
    /** Custom selected month */
    public customMonth: string = '';
    /** Holds start month/year */
    public startAt: Date = new Date();
    /** Holds selected date */
    public date: FormControl<string | null> = new FormControl<string | null>('');
    /** Active company details */
    public activeCompany: any = null;
    /** Enum for restricted modules */
    public restrictedModules: any = RestrictedModules;
    /** Holds Tax Service Enum */
    public taxServiceEnum = TaxServiceEnum;

    constructor(
        private store: Store<AppState>,
        private toasty: ToasterService,
        private reconcileAction: GstReconcileActions,
        private invoicePurchaseActions: InvoicePurchaseActions,
        private gstReconcileActions: GstReconcileActions,
        private activatedRoute: ActivatedRoute,
        @Inject(ServiceConfig) private serviceConfig,
        private gstReconcileService: GstReconcileService,
        private generalService: GeneralService,
        private router: Router,
        public dialog: MatDialog
    ) {
        this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
        this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));
        this.gstSessionResponse$ = this.store.pipe(select(p => p.gstR.gstSessionResponse), takeUntil(this.destroyed$));
        this.activeCompany$ = this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        if (this.generalService.voucherApiVersion === 2) {
            this.showGstFiling = true;
        }
        this.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            this.activeCompany = response;
        });
        this.activatedRoute.url.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.holdActiveRoute = this.router.routerState.snapshot.url.includes('entityType');
            if (this.holdActiveRoute) {
                this.showDate = false;
            } else {
                this.showDate = true;
            }
        });
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        this.companyGst$.subscribe(a => {
            if (a) {
                this.activeCompanyGstNumber = a;
            }
        });

        this.gstSessionResponse$.subscribe(a => {
            if (a) {
                this.isTaxproAuthenticated = a.taxpro;
                this.isVayanaAuthenticated = a.vayana;
            }
        });

        this.gstAuthenticated$.subscribe((a) => this.gstAuthenticated = a);
        this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params && params['from'] && params['to']) {
                this.currentPeriod = {
                    from: params['from'],
                    to: params['to']
                };
                if (!this.selectedMonth) {
                    this.selectedMonth = dayjs(this.currentPeriod.from, GIDDH_DATE_FORMAT).toISOString();
                    this.date.setValue(dayjs(this.selectedMonth).format(GIDDH_DATE_FORMAT_MONTH_YEAR));
                }
                this.store.dispatch(this.gstReconcileActions.SetSelectedPeriod(this.currentPeriod));
            }
            this.selectedGst = params['return_type'];
        });

        let request: GstOverViewRequest = new GstOverViewRequest();
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;
        request.gstin = this.activeCompanyGstNumber;
        if (this.selectedGst === GstReport.Gstr1) {
            this.navigateToOverview();
            this.store.dispatch(this.reconcileAction.GetOverView(GstReport.Gstr1, request));
        } else if (this.selectedGst === GstReport.Gstr2) {
            this.navigateToOverview();
            this.store.dispatch(this.reconcileAction.GetOverView(GstReport.Gstr2, request));
        }
    }

    public pullFromGstIn(ev) {
        let request: GstReconcileInvoiceRequest = new GstReconcileInvoiceRequest();
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;
        request.refresh = true;
        request.action = GstReconcileActionsEnum.notfoundonportal;
        request.gstin = this.activeCompanyGstNumber;
        request.gstReturnType = this.selectedGst === GstReport.Gstr1 ? 'gstr1' : 'gstr2';
        this.store.dispatch(this.reconcileAction.GstReconcileInvoiceRequest(request));
    }

    public ngOnChanges(s: SimpleChanges) {
        if (s && s.currentPeriod && s.currentPeriod.currentValue) {
            let date = {
                startDate: dayjs(this.currentPeriod.from, GIDDH_DATE_FORMAT).startOf('month').format(GIDDH_DATE_FORMAT),
                endDate: dayjs(this.currentPeriod.to, GIDDH_DATE_FORMAT).endOf('month').format(GIDDH_DATE_FORMAT)
            };
            this.isMonthSelected = date.startDate === this.currentPeriod.from && date.endDate === this.currentPeriod.to;
        }

        if (s && s.fileReturn && s.fileReturn.currentValue && s.fileReturn.currentValue.isAuthenticate) {
            if (this.gstAuthenticated) {
                this.fileGstReturnV2();
            } else {
                this.openSettingAsidePane(null, this.taxServiceEnum.TAXPRO);
            }
        }

        if (s && s.fileGstr3b && s.fileGstr3b.currentValue?.via) {
            let gsp = s.fileGstr3b.currentValue.via;
            if (this.gstAuthenticated) {
                if (gsp === this.taxServiceEnum.VAYANA && this.isVayanaAuthenticated) {
                    this.fileGstr3B(gsp);
                } else if (gsp === this.taxServiceEnum.VAYANA && !this.isVayanaAuthenticated) {
                    this.openSettingAsidePane(null, gsp);
                }

                if (gsp === this.taxServiceEnum.TAXPRO && this.isTaxproAuthenticated) {
                    this.fileGstr3B(gsp);
                } else if (gsp === this.taxServiceEnum.TAXPRO && !this.isTaxproAuthenticated) {
                    this.openSettingAsidePane(null, gsp);
                }

            } else {
                this.openSettingAsidePane(null, gsp);
            }
        }
    }

    /**
     * Open setting aside pane dialog
     *
     * @param {*} event
     * @param {TaxServiceType} [selectedService]
     * @memberof FilingHeaderComponent
     */
    public openSettingAsidePane(event: any, selectedService?: TaxServiceType): void {
        if (event) {
            event.preventDefault();
        }

        if (selectedService) {
            this.selectedService = selectedService;
        }
        this.asideAuthenticationDialogRef = this.dialog.open(this.asideAuthenticationDialog, {...ASIDE_PANE_CONFIG, autoFocus: false});
    }

    /**
     * Download Sheet GSTR
     *
     * @param {string} typeOfSheet
     * @memberof FilingHeaderComponent
     */
    public onDownloadSheetGSTR(typeOfSheet: string) {
        if (this.activeCompanyGstNumber) {
            let request: GstrSheetDownloadRequest = new GstrSheetDownloadRequest();
            request.sheetType = typeOfSheet;
            request.type = this.selectedGst;
            request.gstin = this.activeCompanyGstNumber;
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;

            this.store.dispatch(this.reconcileAction.DownloadGstrSheet(request));
        } else {
            this.toasty.showSnackBar('error', this.localeData?.filing?.gst_unavailable);
        }
    }

    /**
     * Releases the memory
     *
     * @memberof FilingHeaderComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public fileGstReturn(Via: 'JIO_GST' | 'TAXPRO' | 'VAYANA') {
        if (this.activeCompanyGstNumber) {
            this.store.dispatch(this.invoicePurchaseActions.FileJioGstReturn(this.currentPeriod, this.activeCompanyGstNumber, Via));
        } else {
            this.toasty.showSnackBar('error', this.localeData?.filing?.gst_unavailable);
        }
    }

    public fileGstReturnV2() {
        if (this.selectedGst === GstReport.Gstr1) {
            this.store.dispatch(this.gstReconcileActions.FileGstr1({
                gstin: this.activeCompanyGstNumber,
                from: this.currentPeriod.from,
                to: this.currentPeriod.to,
                gsp: this.isVayanaAuthenticated ? this.taxServiceEnum.VAYANA : this.taxServiceEnum.TAXPRO,
                currentDateTime: this.generalService.getCurrentDateTime()
            }));
        }
        if (this.selectedGst === GstReport.Gstr3b) {
            let gsp;
            gsp = this.isVayanaAuthenticated ? this.taxServiceEnum.VAYANA : this.taxServiceEnum.TAXPRO;
            this.fileGstr3B(gsp);
        }
    }

    public fileGstr3B(via) {
        this.store.dispatch(this.invoicePurchaseActions.FileGSTR3B({ from: this.currentPeriod.from, to: this.currentPeriod.to }, this.activeCompanyGstNumber, via));
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
     * Open push to portal dialog
     *
     * @memberof FilingHeaderComponent
     */
    public openPushToPortalDialog(): void {
        this.dialog.open(this.pushToPortalDialog, {
            disableClose: true
        });
    }

    /**
     * This will use for period change
     *
     * @param {*} ev
     * @memberof FilingHeaderComponent
     */
    public periodChanged(date: any): void {
        if (date) {
            this.selectedMonth = date;
            this.currentPeriod = {
                from: dayjs(date?.from).format(GIDDH_DATE_FORMAT),
                to: dayjs(date?.to).format(GIDDH_DATE_FORMAT)
            };
            this.isMonthSelected = true;
            this.store.dispatch(this.reconcileAction.SetSelectedPeriod(this.currentPeriod));
            if (this.selectedGst === GstReport.Gstr1) {
                this.navigateToOverview();
            } else {
                this.navigateToOverview();
            }
        }

    }

    /**
    * Download Json GSTR1
    *
    * @param {any} string:
    * @memberof FilingHeaderComponent
    */
    public onDownloadJsonGSTR(type: string): void {
        if (this.activeCompanyGstNumber) {
            let request: GstrJsonDownloadRequest = new GstrJsonDownloadRequest();
            request.type = type;
            request.gstin = this.activeCompanyGstNumber;
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;
            this.gstReconcileService.downloadGSTRJSON(request).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                if (res?.status === "success") {
                    let blobData = this.generalService.base64ToBlob(res?.body.data, "json", 512);
                    return saveAs(blobData, res?.body.name);
                } else {
                    this.toasty.showSnackBar('error', res?.message);
                }
            });
        } else {
            this.toasty.showSnackBar('error', this.localeData?.filing?.gst_unavailable);
        }
    }

    /**
     * Navigate To Overview
     *
     * @param {*} type
     * @memberof FilingHeaderComponent
     */
    public navigateToOverview(): void {
        this.router.navigate(
            [],
            {
                relativeTo: this.activatedRoute,
                queryParams: { from: this.currentPeriod.from, to: this.currentPeriod.to },
                queryParamsHandling: 'merge'
            });
    }

    /**
     * Sets month/year
     *
     * @param {*} date - Selected date from giddh-datepicker
     * @memberof FilingHeaderComponent
     */
    public setMonthAndYear(date: any): void {
        const selectedMonth = new Date(date);
        const firstDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        const lastDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
        this.dateSelected([firstDay, lastDay]);
    }

    /**
     * Selects date and call api
     *
     * @param {*} event
     * @memberof FilingHeaderComponent
     */
    public dateSelected(event: any): void {
        this.customMonth = event[0].toLocaleString('en-us', { month: 'long', year: 'numeric' });
        this.date.setValue(this.customMonth);
        this.periodChanged({ from: event[0], to: event[1] });
    }

    /**
    * Navigates to the page for buy plan.
    * @memberof FilingHeaderComponent
    * @param subscriptionId
    */
    public buyPlan(subscriptionId: string): void {
        this.router.navigate(['/pages/user-details/subscription/buy-plan/' + subscriptionId]);
    }
}
