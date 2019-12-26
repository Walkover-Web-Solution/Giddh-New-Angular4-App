import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../../store';
import { InvoicePurchaseActions } from '../../../actions/purchase-invoice/purchase-invoice.action';
import { GstReconcileActions } from '../../../actions/gst-reconcile/GstReconcile.actions';
import { VerifyOtpRequest } from '../../../models/api-models/GstReconcile';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'aside-menu-account',
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
	templateUrl: './aside-menu-purchase-invoice-setting.component.html'
})
export class AsideMenuPurchaseInvoiceSettingComponent implements OnInit, OnChanges, OnDestroy {

	@Input() public selectedService: 'JIO_GST' | 'TAXPRO' | 'RECONCILE' | 'VAYANA';
	@Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
	@Output() public fireReconcileRequest: EventEmitter<boolean> = new EventEmitter(true);
	@Input() public activeCompanyGstNumber: string = '';

	public jioGstForm: any = {};
	public taxProForm: any = {};
	public reconcileForm: any = {};

	public otpSentSuccessFully: boolean = false;
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
		private gstReconcileActions: GstReconcileActions
	) {
		this.store.select(p => p.invoicePurchase.isTaxProOTPSentSuccessfully).subscribe((yes: boolean) => {
			this.otpSentSuccessFully = yes;
		});
		this.reconcileOtpInProcess$ = this.store.select(p => p.gstReconcile.isGenerateOtpInProcess).pipe(takeUntil(this.destroyed$));
		this.reconcileOtpSuccess$ = this.store.select(p => p.gstReconcile.isGenerateOtpSuccess).pipe(takeUntil(this.destroyed$));
		this.reconcileOtpVerifyInProcess$ = this.store.select(p => p.gstReconcile.isGstReconcileVerifyOtpInProcess).pipe(takeUntil(this.destroyed$));
		this.reconcileOtpVerifySuccess$ = this.store.select(p => p.gstReconcile.isGstReconcileVerifyOtpSuccess).pipe(takeUntil(this.destroyed$));
		this.gstAuthenticated$ = this.store.select(p => p.gstR.gstAuthenticated).pipe(takeUntil(this.destroyed$));
		this.companyGst$ = this.store.select(p => p.gstR.activeCompanyGst).pipe(takeUntil(this.destroyed$));

		this.store.select(s => s.settings.profile).subscribe(pro => {
			if (pro && pro.addresses) {
				let gstNo = pro.addresses.filter(f => {
					return f.isDefault === true;
				}).map(p => {
					return p.taxNumber;
				});
				if (gstNo && gstNo[0]) {
					this.defaultGstNumber = gstNo[0];
					this.taxProForm.gstin = this.defaultGstNumber;
				}
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
		this.closeAsideEvent.emit(event);
	}

	/**
	 * save
	 */
	public save(form) {
		let type = _.cloneDeep(this.selectedService);
		form.gsp = type;
		if (type === 'JIO_GST') {
			this.store.dispatch(this.invoicePurchaseActions.SaveJioGst(form));
		} else if ((type === 'TAXPRO' || type === 'VAYANA') && !this.otpSentSuccessFully) {
			this.store.dispatch(this.invoicePurchaseActions.SaveGSPSession(form));
		} else if ((type === 'TAXPRO' || type === 'VAYANA') && this.otpSentSuccessFully) {
			this.store.dispatch(this.invoicePurchaseActions.SaveGSPSessionWithOTP(form));
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
		this.selectedService = _.cloneDeep(provider);
		this.otpSentSuccessFully = false;
		this.taxProForm.otp = '';
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
