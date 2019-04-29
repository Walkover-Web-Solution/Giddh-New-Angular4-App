import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToasterService } from 'app/services/toaster.service';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { Observable, of, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { BsDropdownConfig } from 'ngx-bootstrap/dropdown';
import { AlertConfig } from 'ngx-bootstrap/alert';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { InvoicePurchaseActions } from 'app/actions/purchase-invoice/purchase-invoice.action';
import * as moment from 'moment/moment';
import { GstrSheetDownloadRequest } from '../../../models/api-models/GstReconcile';

@Component({
  selector: 'filing-header',
  templateUrl: 'filing-header.component.html',
  styleUrls: ['filing-header.component.css'],
  providers: [
    {
      provide: BsDropdownConfig, useValue: {autoClose: true},
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
  @Input() public fileReturn: {} = {isAuthenticate: false};
  @Input() public fileGstr3b: {} = {via: null};

  public reconcileIsActive: boolean = false;
  public gstAuthenticated$: Observable<boolean>;
  public GstAsidePaneState: string = 'out';
  public selectedService: 'VAYANA' | 'TAXPRO' | 'RECONCILE' | 'JIO_GST';
  public companyGst$: Observable<string> = of('');
  public activeCompanyGstNumber: string = '';
  public moment = moment;
  public imgPath: string = '';
  public gstAuthenticated: boolean = false;
  public getGspSessionInProgress$: Observable<boolean> = of(false);
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
    private _gstReconcileActions: GstReconcileActions
  ) {
    this.gstAuthenticated$ = this.store.select(p => p.gstR.gstAuthenticated).pipe(takeUntil(this.destroyed$));
    this.companyGst$ = this.store.select(p => p.gstR.activeCompanyGst).pipe(takeUntil(this.destroyed$));
    this.getGspSessionInProgress$ = this.store.select(p => p.gstR.getGspSessionInProgress).pipe(takeUntil(this.destroyed$));
    this.gstSessionResponse$ = this.store.select(p => p.gstR.gstSessionResponse).pipe(takeUntil(this.destroyed$));

  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
    this.companyGst$.subscribe(a => {
      if (a) {
        this.activeCompanyGstNumber = a;
      }
    });

    this.getGspSessionInProgress$.subscribe(a => {
      if (!a) {
        this.store.dispatch(this._invoicePurchaseActions.GetGSPSession(this.activeCompanyGstNumber));
      }
    });

    this.gstSessionResponse$.subscribe(a => {
      if (a) {
        this.isTaxproAuthenticated = a.taxpro;
        this.isVayanaAuthenticated = a.vayana;
      }
    });

    this.gstAuthenticated$.subscribe((a) => this.gstAuthenticated = a);
  }

  public pullFromGstIn(ev) {
    if (!this.gstAuthenticated) {
      this.isVayanaAuthenticated ? this.fileGstReturn('VAYANA') : this.fileGstReturn('TAXPRO');
    } else {
      this.store.dispatch(this._reconcileAction.GstReconcileInvoiceRequest(this.currentPeriod, 'NOT_ON_PORTAL', '1', true));
    }
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
  }

  public fileGstr3B(via) {
    this.store.dispatch(this._invoicePurchaseActions.FileGSTR3B({from: this.currentPeriod.from, to: this.currentPeriod.to}, this.activeCompanyGstNumber, via));
  }
}
