// tslint:disable:variable-name
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GstSaveGspSessionRequest, VerifyOtpRequest } from '../../../models/api-models/GstReconcile';
import { AppState } from '../../../store';
import { InvoicePurchaseActions } from '../../../actions/purchase-invoice/purchase-invoice.action';
import { GstReconcileActions } from '../../../actions/gst-reconcile/GstReconcile.actions';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'gst-aside-menu',
  styles: [`
    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      max-width:480px;
      width: 100%;
      z-index: 99999;
    }

    #close {
      display: none;
    }

    :host.in #close {
      display: block;
      position: fixed;
      left: -33px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }

    :host .container-fluid {
      padding-left: 0;
      padding-right: 0;
    }

    :host .aside-pane {
      max-width:480px;
      width: 100%;
      padding: 0;
      background: #fff;
    }
  `],
  templateUrl: './gst-aside-menu.component.html'
})
export class GstAsideMenuComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public selectedService: 'VAYANA' | 'TAXPRO' | 'RECONCILE' | 'JIO_GST';
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public fireReconcileRequest: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public fileGst: EventEmitter<boolean> = new EventEmitter();
  @Output() public fileGstComplete: EventEmitter<boolean> = new EventEmitter();
  @Input() public activeCompanyGstNumber = '';
  @Input() public returnType: string;
  @Output() public cancelConfirmationEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public taxProForm: GstSaveGspSessionRequest = new GstSaveGspSessionRequest();
  public reconcileForm: any = {};

  public saveGspSessionInProcess = false;
  public otpSentSuccessFully = false;

  public authorizeGspSessionOtpInProcess = false;
  public gspSessionOtpAuthorized = false;

  public reconcileOtpInProcess$: Observable<boolean>;
  public reconcileOtpSuccess$: Observable<boolean>;
  public reconcileOtpVerifyInProcess$: Observable<boolean>;
  public reconcileOtpVerifySuccess$: Observable<boolean>;
  public pointsAccepted = false;
  public pointsAcceptedSubmitted = false;
  public submitGstForm: { isAccepted: boolean, txtVal: string } = {isAccepted: false, txtVal: ''};
  public defaultGstNumber: string = null;
  public companyGst$: Observable<string> = of('');
  public showCancelModal = false;
  public getCurrentPeriod: any = {};
  public gstAuthenticated = false;
  public gstReturnInProcess = false;
  public isTaxproAuthenticated = false;
  public isVayanaAuthenticated = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private invoicePurchaseActions: InvoicePurchaseActions,
    private gstReconcileActions: GstReconcileActions,
    private _toaster: ToasterService
  ) {

    this.reconcileOtpInProcess$ = this.store.pipe(select(p => p.gstReconcile.isGenerateOtpInProcess), takeUntil(this.destroyed$));
    this.reconcileOtpSuccess$ = this.store.pipe(select(p => p.gstReconcile.isGenerateOtpSuccess), takeUntil(this.destroyed$));
    this.reconcileOtpVerifyInProcess$ = this.store.pipe(select(p => p.gstReconcile.isGstReconcileVerifyOtpInProcess), takeUntil(this.destroyed$));
    this.reconcileOtpVerifySuccess$ = this.store.pipe(select(p => p.gstReconcile.isGstReconcileVerifyOtpSuccess), takeUntil(this.destroyed$));

    this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));

    this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(pro => {
      if (pro && pro.gstDetails) {
        const gstNo = pro.gstDetails.filter(f => {
          return f.addressList[0] && f.addressList[0].isDefault === true;
        }).map(p => {
          return p.gstNumber;
        });
        if (gstNo && gstNo[0]) {
          this.defaultGstNumber = gstNo[0];
          this.taxProForm.gstin = this.defaultGstNumber;
        }
      }
    });

    this.store.pipe(select(p => p.gstR.saveGspSessionOtpSent), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
      this.otpSentSuccessFully = yes;
    });

    this.store.pipe(select(p => p.gstR.saveGspSessionInProcess), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
      this.saveGspSessionInProcess = yes;
    });

    this.store.pipe(select(p => p.gstR.authorizeGspSessionOtpInProcess), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
      this.authorizeGspSessionOtpInProcess = yes;
    });

    this.store.pipe(select(p => p.gstR.gspSessionOtpAuthorized), takeUntil(this.destroyed$)).subscribe((yes: boolean) => {
      this.gspSessionOtpAuthorized = yes;
    });

    this.store.pipe(select(p => p.gstR.currentPeriod)).subscribe(data => {
      if (data) {
        this.getCurrentPeriod = data;
      }
    });

    this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$)).subscribe((bool) => {
      this.gstAuthenticated = bool;
    });

    this.store.pipe(select(p => p.gstR.gstReturnFileSuccess), takeUntil(this.destroyed$)).subscribe((val) => {
      if (val) {
        this.fileGstComplete.emit(true);
        this.resetLocalFlags();
      }
    });

    this.store.pipe(select(p => p.gstR.gstReturnFileInProgress), takeUntil(this.destroyed$)).subscribe((value => this.gstReturnInProcess = value));

    this.store.pipe(select(s => s.gstR.gstSessionResponse)).subscribe(a => {
      if (a) {
        this.isTaxproAuthenticated = a.taxpro;
        this.isVayanaAuthenticated = a.vayana;
      }
    });
  }

  public ngOnInit() {
    this.reconcileOtpVerifySuccess$.subscribe(s => {
      if (s) {
        this.fireReconcileRequest.emit(true);
        this.closeAsidePane(null);
      }
    });

    this.companyGst$.subscribe(a => {
      if (a) {
        this.taxProForm.gstin = a;
      }
    });
  }

  public ngOnChanges(changes) {
    if ('selectedService' in changes && changes['selectedService'].currentValue) {
      // alert('selectedService ' + changes['selectedService'].currentValue);
    }
  }

  public closeAsidePane(event) {
    this.resetLocalFlags();
    this.closeAsideEvent.emit(event);
  }

  public resetTaxPro() {
    this.selectedService = 'VAYANA';
    this.taxProForm.otp = '';
    this.taxProForm.userName = '';
    this.otpSentSuccessFully = false;
  }

  public resetLocalFlags() {
    this.resetTaxPro();
    this.pointsAccepted = false;
    this.pointsAcceptedSubmitted = false;
    this.submitGstForm = {isAccepted: false, txtVal: ''};
    this.store.dispatch(this.gstReconcileActions.ResetGstAsideFlags());
  }

  /**
   * save
   */
  public save() {
    this.taxProForm.gsp = this.selectedService;
    if ((this.selectedService === 'TAXPRO' || this.selectedService === 'VAYANA') && !this.otpSentSuccessFully) {
      this.store.dispatch(this.gstReconcileActions.SaveGSPSession(this.taxProForm));
    } else if ((this.selectedService === 'TAXPRO' || this.selectedService === 'VAYANA') && this.otpSentSuccessFully) {
      if (!(/^(?!\s*$).+/g.test(this.taxProForm.otp))) {
        this._toaster.errorToast('Please add Otp..');
        return;
      }
      this.store.dispatch(this.gstReconcileActions.SaveGSPSessionWithOTP(this.taxProForm));
    }
  }

  public generateReconcileOtp(form) {
    this.store.dispatch(
      this.gstReconcileActions.GstReconcileOtpRequest(form.uid)
    );
  }

  public sendReconcileOtp(form) {
    const model: VerifyOtpRequest = new VerifyOtpRequest();
    model.otp = form.otp;
    this.store.dispatch(
      this.gstReconcileActions.GstReconcileVerifyOtpRequest(model)
    );
  }

  public submitGstReturn() {
    this.submitGstForm.isAccepted = true;
    if (this.submitGstForm.txtVal.toLowerCase() !== 'SUBMIT'.toLowerCase()) {
      this._toaster.errorToast('Please Enter Submit In Text Box..');
      return;
    }
    this.fileGst.emit(true);
  }

  public resendOtp() {
    this.otpSentSuccessFully = false;
    this.save();
  }

  public changeProvider() {
    this.otpSentSuccessFully = false;
    this.taxProForm.otp = '';
  }

  public toggleCancelModel() {
    this.cancelConfirmationEvent.emit(true);
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
