import { Component, EventEmitter, OnInit, Output, Input, OnChanges, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppState } from '../../../store';
import { InvoicePurchaseActions } from '../../../actions/purchase-invoice/purchase-invoice.action';
import { Observable } from 'rxjs';
import { GstReconcileActions } from '../../../actions/gst-reconcile/GstReconcile.actions';
import { VerifyOtpRequest } from '../../../models/api-models/GstReconcile';

@Component({
  selector: 'aside-menu-account',
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
      left: -41px;
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
  templateUrl: './aside-menu-purchase-invoice-setting.component.html'
})
export class AsideMenuPurchaseInvoiceSettingComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public selectedService: 'JIO_GST' | 'TAX_PRO' | 'RECONCILE';
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

  public jioGstForm: any = {};
  public taxProForm: any = {};
  public reconcileForm: any = {};

  public otpSentSuccessFully: boolean = false;
  public reconcileOtpInProcess$: Observable<boolean>;
  public reconcileOtpSuccess$: Observable<boolean>;
  public reconcileOtpVerifyInProcess$: Observable<boolean>;
  public reconcileOtpVerifySuccess$: Observable<boolean>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private invoicePurchaseActions: InvoicePurchaseActions,
    private gstReconcileActions: GstReconcileActions
  ) {
    this.store.select(p => p.invoicePurchase.isTaxProOTPSentSuccessfully).subscribe((yes: boolean) => {
      this.otpSentSuccessFully = yes;
    });
    this.reconcileOtpInProcess$ = this.store.select(p => p.gstReconcile.isGenerateOtpInProcess).takeUntil(this.destroyed$);
    this.reconcileOtpSuccess$ = this.store.select(p => p.gstReconcile.isGenerateOtpSuccess).takeUntil(this.destroyed$);
    this.reconcileOtpVerifyInProcess$ = this.store.select(p => p.gstReconcile.isGstReconcileVerifyOtpInProcess).takeUntil(this.destroyed$);
    this.reconcileOtpVerifySuccess$ = this.store.select(p => p.gstReconcile.isGstReconcileVerifyOtpSuccess).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.reconcileOtpVerifySuccess$.subscribe(s => {
      if (s) {
        this.closeAsidePane(null);
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
  public save(form, type: 'JIO_GST' | 'TAX_PRO') {
    if (type === 'JIO_GST') {
      this.store.dispatch(this.invoicePurchaseActions.SaveJioGst(form));
    } else if (type === 'TAX_PRO' && !this.otpSentSuccessFully) {
      this.store.dispatch(this.invoicePurchaseActions.SaveTaxPro(form));
    } else if (type === 'TAX_PRO' && this.otpSentSuccessFully) {
      this.store.dispatch(this.invoicePurchaseActions.SaveTaxProWithOTP(form));
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

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
