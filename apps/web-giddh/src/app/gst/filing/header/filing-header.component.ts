import * as dayjs from 'dayjs';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { InvoicePurchaseActions } from '../../../actions/purchase-invoice/purchase-invoice.action';
import { GstOverViewRequest, GstReconcileActionsEnum, GstReconcileInvoiceRequest, GstrJsonDownloadRequest, GstrSheetDownloadRequest } from '../../../models/api-models/GstReconcile';
import { select, Store } from '@ngrx/store';
import { ToasterService } from '../../../services/toaster.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../../store';
import { takeUntil } from 'rxjs/operators';
import { GstReconcileActions } from '../../../actions/gst-reconcile/gst-reconcile.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { GstReport } from '../../constants/gst.constant';
import { GstReconcileService } from '../../../services/gst-reconcile.service';
import { GeneralService } from '../../../services/general.service';
import { saveAs } from 'file-saver';
import { MatDialog } from '@angular/material/dialog';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'filing-header',
    templateUrl: 'filing-header.component.html',
    styleUrls: ['filing-header.component.scss'],
    providers: [
        {
            provide: BsDropdownConfig, useValue: { autoClose: true },
        },
        {
            provide: AlertConfig, useValue: {}
        }
    ],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in <=> out', animate('400ms ease-in-out')),
        ])
    ]
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
    // @ViewChild('cancelConfirmationModel', { static: true }) public cancelConfirmationModel: ModalDirective;
    @ViewChild("cancelConfirmationModel") cancelConfirmationModel: TemplateRef<any>;
    /** Directive to get reference of element */
    @ViewChild('pushToPortalModel', { static: true }) public pushToPortalModel: ModalDirective;
    public gstAuthenticated$: Observable<boolean>;
    public GstAsidePaneState: string = 'out';
    public selectedService: 'TAXPRO' | 'RECONCILE' | 'JIO_GST' | 'VAYANA';
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
    /** This will use for date selected */
    public dateSelected: boolean = false;
    /** This will use for hold url */
    public holdActiveRoute: boolean;
    /** This will use for date show */
    public showDate: boolean = true;
    /** This will use for string date show */
    public visibleSelectMonth: string = '';
    /** Instance of dayjs */
    public dayjs = dayjs;
    /** asideAuthentication Dialog Open */
    @ViewChild("asideAuthentication") asideAuthenticationDialog: TemplateRef<any>;

    constructor(
        private store: Store<AppState>,
        private toasty: ToasterService,
        private reconcileAction: GstReconcileActions,
        private invoicePurchaseActions: InvoicePurchaseActions,
        private gstReconcileActions: GstReconcileActions,
        private activatedRoute: ActivatedRoute,
        private gstReconcileService: GstReconcileService,
        private generalService: GeneralService,
        private router: Router,
        public dialog: MatDialog
    ) {
        this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
        this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));
        this.gstSessionResponse$ = this.store.pipe(select(p => p.gstR.gstSessionResponse), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        if (this.generalService.voucherApiVersion === 2) {
            this.showGstFiling = true;
        }
        this.activatedRoute.url.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.holdActiveRoute = this.router.routerState.snapshot.url.includes('entityType');
            if (this.holdActiveRoute) {
                this.showDate = false;
            } else {
                this.showDate = true;
            }
        });
        this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
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
                }
                this.visibleSelectMonth = dayjs(this.currentPeriod.from, GIDDH_DATE_FORMAT).format('MMMM YYYY');
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
        } else {
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
                this.toggleSettingAsidePane(null, 'TAXPRO');
            }
        }

        if (s && s.fileGstr3b && s.fileGstr3b.currentValue?.via) {
            let gsp = s.fileGstr3b.currentValue.via;
            if (this.gstAuthenticated) {
                if (gsp === 'VAYANA' && this.isVayanaAuthenticated) {
                    this.fileGstr3B(gsp);
                } else if (gsp === 'VAYANA' && !this.isVayanaAuthenticated) {
                    this.toggleSettingAsidePane(null, gsp);
                }

                if (gsp === 'TAXPRO' && this.isTaxproAuthenticated) {
                    this.fileGstr3B(gsp);
                } else if (gsp === 'TAXPRO' && !this.isTaxproAuthenticated) {
                    this.toggleSettingAsidePane(null, gsp);
                }

            } else {
                this.toggleSettingAsidePane(null, gsp);
            }
        }
    }

    /**
     * Toggle Setting Aside Pane
     *
     * @param {*} event
     * @param {('JIO_GST' | 'TAXPRO' | 'RECONCILE' | 'VAYANA')} [selectedService]
     * @memberof FilingHeaderComponent
     */
    public toggleSettingAsidePane(event, selectedService?: 'JIO_GST' | 'TAXPRO' | 'RECONCILE' | 'VAYANA'): void {
        if (event) {
            event.preventDefault();
        }

        if (selectedService) {
            this.selectedService = selectedService;
        }
        // this.GstAsidePaneState = this.GstAsidePaneState === 'out' ? 'in' : 'out';
        this.dialog.open(this.asideAuthenticationDialog,{
            position: {
                right: '0',
                top: '0'
            },
            width: '760px',
            height: '100vh !important'
        })
    }

    public closeAsidePane() {
        this.GstAsidePaneState = 'out';
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
            this.toasty.errorToast(this.localeData?.filing?.gst_unavailable);
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
            this.toasty.errorToast(this.localeData?.filing?.gst_unavailable);
        }
    }

    public fileGstReturnV2() {
        if (this.selectedGst === GstReport.Gstr1) {
            this.store.dispatch(this.gstReconcileActions.FileGstr1({
                gstin: this.activeCompanyGstNumber,
                from: this.currentPeriod.from,
                to: this.currentPeriod.to,
                gsp: this.isVayanaAuthenticated ? 'VAYANA' : 'TAXPRO',
                currentDateTime: this.generalService.getCurrentDateTime()
            }));
        }
        if (this.selectedGst === GstReport.Gstr3b) {
            let gsp;
            gsp = this.isVayanaAuthenticated ? 'VAYANA' : 'TAXPRO';
            this.fileGstr3B(gsp);
        }
    }

    public fileGstr3B(via) {
        this.store.dispatch(this.invoicePurchaseActions.FileGSTR3B({ from: this.currentPeriod.from, to: this.currentPeriod.to }, this.activeCompanyGstNumber, via));
    }

    public toggleCancelModel() {
        // this.cancelConfirmationModel.toggle();
        this.dialog.open(this.cancelConfirmationModel, {
            width: '600px'
        });
    }

    /**
     * This will use for period change
     *
     * @param {*} ev
     * @memberof FilingHeaderComponent
     */
    public periodChanged(event?: any): void {
        if (event) {
            this.selectedMonth = event;
            this.currentPeriod = {
                from: dayjs(event).startOf('month').format(GIDDH_DATE_FORMAT),
                to: dayjs(event).endOf('month').format(GIDDH_DATE_FORMAT)
            };
            this.dateSelected = true;
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
                    let blobData = this.generalService.base64ToBlob(res?.body, "json", 512);
                    return saveAs(blobData, `${this.activeCompanyGstNumber}.json`);
                } else {
                    this.toasty.errorToast(res?.message);
                }
            });
        } else {
            this.toasty.errorToast(this.localeData?.filing?.gst_unavailable);
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
}
