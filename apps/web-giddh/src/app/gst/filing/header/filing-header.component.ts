import * as moment from 'moment/moment';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { InvoicePurchaseActions } from '../../../actions/purchase-invoice/purchase-invoice.action';
import { GstReconcileActionsEnum, GstReconcileInvoiceRequest, GstrSheetDownloadRequest } from '../../../models/api-models/GstReconcile';
import { select, Store } from '@ngrx/store';
import { ToasterService } from '../../../services/toaster.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AlertConfig, BsDropdownConfig, ModalDirective } from 'ngx-bootstrap';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../../store';
import { take, takeUntil } from 'rxjs/operators';
import { GstReconcileActions } from '../../../actions/gst-reconcile/GstReconcile.actions';
import { ActivatedRoute, Router } from '@angular/router';


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
    @ViewChild('cancelConfirmationModel') public cancelConfirmationModel: ModalDirective;

    public gstAuthenticated$: Observable<boolean>;
    public GstAsidePaneState: string = 'out';
    public selectedService: 'VAYANA' | 'TAXPRO' | 'RECONCILE' | 'JIO_GST';
    public companyGst$: Observable<string> = of('');
    public activeCompanyGstNumber: string = '';
    public moment = moment;
    public imgPath: string = '';
    public gstAuthenticated: boolean = false;
    public gstSessionResponse$: Observable<any> = of({});
    public isTaxproAuthenticated: boolean = false;
    public isVayanaAuthenticated: boolean = false;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private router: Router,
        private _toasty: ToasterService,
        private _reconcileAction: GstReconcileActions,
        private _invoicePurchaseActions: InvoicePurchaseActions,
        private _gstReconcileActions: GstReconcileActions,
        private activatedRoute: ActivatedRoute
    ) {
        this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
        this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));
        this.gstSessionResponse$ = this.store.pipe(select(p => p.gstR.gstSessionResponse), takeUntil(this.destroyed$));

    }

    public ngOnInit() {
        this.imgPath = (isElectron||isCordova)  ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
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
            this.currentPeriod = {
                from: params['from'],
                to: params['to']
            };
            this.store.dispatch(this._gstReconcileActions.SetSelectedPeriod(this.currentPeriod));
            this.selectedGst = params['return_type'];
        });
    }

    public pullFromGstIn(ev) {
        // if (!this.gstAuthenticated) {
        //   this.isVayanaAuthenticated ? this.fileGstReturn('VAYANA') : this.fileGstReturn('TAXPRO');
        // } else {
        let request: GstReconcileInvoiceRequest = new GstReconcileInvoiceRequest();
        request.from = this.currentPeriod.from;
        request.to = this.currentPeriod.to;
        request.refresh = true;
        request.action = GstReconcileActionsEnum.notfoundonportal;
        this.store.dispatch(this._reconcileAction.GstReconcileInvoiceRequest(request));
        //  }
    }

    public ngOnChanges(s: SimpleChanges) {
        if (s && s.selectedGst && s.selectedGst.currentValue === 'gstr2') {
            // if (!this.gstAuthenticated && this.selectedGst === 'gstr2') {
            //   this.toggleSettingAsidePane(null, 'RECONCILE');
            // }
        }

        if (s && s.currentPeriod && s.currentPeriod.currentValue) {
            let date = {
                startDate: moment(this.currentPeriod.from, 'DD-MM-YYYY').startOf('month').format('DD-MM-YYYY'),
                endDate: moment(this.currentPeriod.to, 'DD-MM-YYYY').endOf('month').format('DD-MM-YYYY')
            };
            this.isMonthSelected = date.startDate === this.currentPeriod.from && date.endDate === this.currentPeriod.to;
        }

        if (s && s.fileReturn && s.fileReturn.currentValue && s.fileReturn.currentValue.isAuthenticate) {
            if (this.gstAuthenticated) {
                this.fileGstReturnV2();
                // this.isVayanaAuthenticated ? this.fileGstReturn('VAYANA') : this.fileGstReturn('TAXPRO');
            } else {
                this.toggleSettingAsidePane(null, 'VAYANA');
            }
        }

        if (s && s.fileGstr3b && s.fileGstr3b.currentValue.via) {
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
     * toggleSettingAsidePane
     */
    public toggleSettingAsidePane(event, selectedService?: 'JIO_GST' | 'TAXPRO' | 'RECONCILE' | 'VAYANA'): void {
        if (event) {
            event.preventDefault();
        }

        if (selectedService) {
            if (selectedService === 'RECONCILE') {
                let checkIsAuthenticated;
                this.gstAuthenticated$.pipe(take(1)).subscribe(auth => checkIsAuthenticated = auth);
            }
            this.selectedService = selectedService;
        }
        this.GstAsidePaneState = this.GstAsidePaneState === 'out' ? 'in' : 'out';
    }

    public closeAsidePane() {
        this.GstAsidePaneState = 'out';
    }

    /**
     * onDownloadSheetGSTR
     */
    public onDownloadSheetGSTR(typeOfSheet: string) {
        if (this.activeCompanyGstNumber) {
            let request: GstrSheetDownloadRequest = new GstrSheetDownloadRequest();
            request.sheetType = typeOfSheet;
            request.type = this.selectedGst;
            request.gstin = this.activeCompanyGstNumber;
            request.from = this.currentPeriod.from;
            request.to = this.currentPeriod.to;

            this.store.dispatch(this._reconcileAction.DownloadGstrSheet(request));
        } else {
            this._toasty.errorToast('GST number not found.');
        }
    }

    /**
     * ngOnDestroy
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public fileGstReturn(Via: 'JIO_GST' | 'TAXPRO' | 'VAYANA') {
        if (this.activeCompanyGstNumber) {
            this.store.dispatch(this._invoicePurchaseActions.FileJioGstReturn(this.currentPeriod, this.activeCompanyGstNumber, Via));
        } else {
            this._toasty.errorToast('GST number not found.');
        }
    }

    public fileGstReturnV2() {
        if (this.selectedGst === 'gstr1') {
            this.store.dispatch(this._gstReconcileActions.FileGstr1({
                gstin: this.activeCompanyGstNumber,
                from: this.currentPeriod.from,
                to: this.currentPeriod.to,
                gsp: this.isVayanaAuthenticated ? 'VAYANA' : 'TAXPRO'
            }));
        }
        if (this.selectedGst === 'gstr3b') {
            let gsp;
            gsp = this.isVayanaAuthenticated ? 'VAYANA' : 'TAXPRO';
            this.fileGstr3B(gsp);
        }
    }

    public fileGstr3B(via) {
        this.store.dispatch(this._invoicePurchaseActions.FileGSTR3B({ from: this.currentPeriod.from, to: this.currentPeriod.to }, this.activeCompanyGstNumber, via));
    }

    public toggleCancelModel() {
        this.cancelConfirmationModel.toggle();
    }
}
