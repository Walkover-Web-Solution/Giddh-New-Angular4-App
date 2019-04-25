import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../../store';
import { InvoicePurchaseActions } from '../../../actions/purchase-invoice/purchase-invoice.action';
import { GstReconcileActions } from '../../../actions/gst-reconcile/GstReconcile.actions';
import { GstSaveGspSessionRequest, VerifyOtpRequest } from '../../../models/api-models/GstReconcile';
import { takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../../services/toaster.service';

@Component({
  selector: 'gst-aside-menu',
  styles: [`
    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      z-index: 1045;
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
      width: 480px;
      padding: 0;
      background: #fff;
    }
  `],
  templateUrl: './gst-aside-menu.component.html'
})
export class GstAsideMenuComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public selectedService: 'VAYANA' | 'TAXPRO' | 'RECONCILE';
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public fireReconcileRequest: EventEmitter<boolean> = new EventEmitter(true);
  @Input() public activeCompanyGstNumber: string = '';

  public taxProForm: GstSaveGspSessionRequest = new GstSaveGspSessionRequest();
  public reconcileForm: any = {};

  public saveGspSessionInProcess: boolean = false;
  public otpSentSuccessFully: boolean = false;

  public authorizeGspSessionOtpInProcess: boolean = false;

  public reconcileOtpInProcess$: Observable<boolean>;
  public reconcileOtpSuccess$: Observable<boolean>;
  public reconcileOtpVerifyInProcess$: Observable<boolean>;
  public reconcileOtpVerifySuccess$: Observable<boolean>;
  public gstAuthenticated$: Observable<boolean>;
  public defaultGstNumber: string = null;
  public companyGst$: Observable<string> = of('');

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

    this.gstAuthenticated$ = this.store.pipe(select(p => p.gstR.gstAuthenticated), takeUntil(this.destroyed$));
    this.companyGst$ = this.store.pipe(select(p => p.gstR.activeCompanyGst), takeUntil(this.destroyed$));

    this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(pro => {
      if (pro && pro.gstDetails) {
        let gstNo = pro.gstDetails.filter(f => {
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
    this.closeAsideEvent.emit(event);
  }

  /**
   * save
   */
  public save() {
    this.taxProForm.gsp = this.selectedService;
    if ((this.selectedService === 'TAXPRO' || this.selectedService === 'VAYANA') && !this.otpSentSuccessFully) {
      this.store.dispatch(this.gstReconcileActions.SaveGSPSession(this.taxProForm));
    } else if ((this.selectedService === 'TAXPRO' || this.selectedService === 'VAYANA') && this.otpSentSuccessFully) {
      if (!this.taxProForm.otp) {
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
    let model: VerifyOtpRequest = new VerifyOtpRequest();
    model.otp = form.otp;
    this.store.dispatch(
      this.gstReconcileActions.GstReconcileVerifyOtpRequest(model)
    );
  }

  public changeProvider(provider) {
    this.selectedService = provider;
    this.otpSentSuccessFully = false;
    this.taxProForm.otp = '';
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
