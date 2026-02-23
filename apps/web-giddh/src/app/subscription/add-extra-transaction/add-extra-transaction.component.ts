import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { PaymentProviderOption } from '../components/payment-provider-selector/payment-provider-selector.component';
import { Configuration, EntityCode, PaymentProvider, PlanDuration } from '../../app.constant';
import { ServiceConfig } from '../../services/service.config';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { GeneralActions } from '../../actions/general/general.actions';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { ToasterService } from '../../services/toaster.service';

@Component({
    selector: 'add-extra-transaction',
    templateUrl: './add-extra-transaction.component.html',
    styles: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AddExtraTransactionComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Subject to unsubscribe from listeners */
    private readonly destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds the subscription ID from route params */
    public subscriptionId: string = '';
    /** Form group for extra transaction purchase */
    public extraTransactionForm: FormGroup;
    /** True if form is submitted */
    protected readonly isFormSubmitted = signal<boolean>(false);
    /** Holds filtered payment providers */
    public filteredPaymentProviders: PaymentProviderOption[] = [];
    /** Razorpay instance */
    public razorpay: any;
    /** Razorpay key */
    public razorpayKey: string = '';
    /** Retry count for Razorpay failures */
    public razorpayRetryCount: number = 0;
    /** Max retry count for Razorpay failures */
    public readonly maxRazorpayRetryCount: number = 3;
    /** True when buy extra voucher API is in progress */
    public buyExtraVoucherInProgress: boolean = false;
    /** True when capture extra voucher API is in progress */
    public captureExtraVoucherInProgress: boolean = false;
    /** Payment provider constant reference */
    public readonly paymentProvider: typeof PaymentProvider = PaymentProvider;
    /** Entity code constant reference */
    public readonly entityCode: typeof EntityCode = EntityCode;
    /** Plan duration constant reference */
    public readonly planDuration: typeof PlanDuration = PlanDuration;
    /** Holds the subscription region code */
    public regionCode: string = '';
    /** Holds the subscription data passed via navigation state */
    public subscriptionData: any = null;

    /** Per-unit price by region */
    private readonly priceByRegion: Record<string, { price: number; symbol: string; code: string }> = {
        IND: { price: 1, symbol: '₹', code: 'INR' },
        ARE: { price: 0.043, symbol: 'د.إ', code: 'AED' },
        GLB: { price: 0.012, symbol: '$', code: 'USD' },
        GBR: { price: 0.0087, symbol: '£', code: 'GBP' }
    };

    constructor(
        private readonly formBuilder: FormBuilder,
        private readonly route: ActivatedRoute,
        private readonly router: Router,
        private readonly changeDetection: ChangeDetectorRef,
        private readonly store: Store<AppState>,
        private readonly generalActions: GeneralActions,
        private readonly subscriptionsService: SubscriptionsService,
        private readonly toasterService: ToasterService,
        @Inject(ServiceConfig) private readonly serviceConfig: any
    ) {
        this.razorpayKey = this.serviceConfig.RAZORPAY_KEY || Configuration.RAZORPAY_KEY;
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras?.state) {
            this.subscriptionData = navigation.extras.state['subscriptionData'];
            this.regionCode = this.subscriptionData?.region?.code ?? '';
        }
    }

    /**
     * Hook cycle for component initialization
     *
     * @memberof AddExtraTransactionComponent
     */
    public ngOnInit(): void {
        this.store.dispatch(this.generalActions.openSideMenu(false));
        this.initForm();
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe((params: any) => {
            if (params?.subscriptionId) {
                this.subscriptionId = params.subscriptionId;
            }
        });
        this.filteredPaymentProviders = [
            { label: 'Razorpay', value: PaymentProvider.RAZORPAY },
            { label: 'PayU', value: PaymentProvider.PAYU }
        ];
    }

    /**
     * Initializes the extra transaction form
     *
     * @private
     * @memberof AddExtraTransactionComponent
     */
    private initForm(): void {
        this.extraTransactionForm = this.formBuilder.group(
            {
                totalInvoicesToPurchase: [null, [Validators.min(0)]],
                totalBillsToPurchase: [null, [Validators.min(0)]],
                paymentProvider: [null, Validators.required]
            },
            { validators: this.atLeastOneVoucherRequired() }
        );
    }

    /**
     * Cross-field validator: at least one of invoice count or bill count must be > 0
     *
     * @private
     * @returns {ValidatorFn}
     * @memberof AddExtraTransactionComponent
     */
    private atLeastOneVoucherRequired(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const invoices = Number(group.get('totalInvoicesToPurchase')?.value) || 0;
            const bills = Number(group.get('totalBillsToPurchase')?.value) || 0;
            return invoices > 0 || bills > 0 ? null : { atLeastOneRequired: true };
        };
    }

    /**
     * Returns the price info for the current region
     *
     * @returns {{ price: number; symbol: string }}
     * @memberof AddExtraTransactionComponent
     */
    public getPriceInfo(): { price: number; symbol: string; code: string } {
        return this.priceByRegion[this.regionCode] ?? this.priceByRegion['GLB'];
    }

    /**
     * Calculates the total amount based on invoice and bill counts
     *
     * @returns {number}
     * @memberof AddExtraTransactionComponent
     */
    public getTotalAmount(): number {
        const priceInfo = this.getPriceInfo();
        const invoices = Number(this.extraTransactionForm.get('totalInvoicesToPurchase')?.value) || 0;
        const bills = Number(this.extraTransactionForm.get('totalBillsToPurchase')?.value) || 0;
        return (invoices + bills) * priceInfo.price;
    }

    /**
     * Handles form submission to initiate extra voucher purchase
     *
     * @memberof AddExtraTransactionComponent
     */
    public onSubmit(): void {
        this.isFormSubmitted.set(true);
        this.changeDetection.detectChanges();
        if (this.extraTransactionForm.invalid) {
            return;
        }
        const formValue = this.extraTransactionForm.value;
        const request = {
            subscriptionId: this.subscriptionId,
            paymentProvider: formValue.paymentProvider,
            totalInvoicesToPurchase: String(formValue.totalInvoicesToPurchase ?? 0),
            totalBillsToPurchase: String(formValue.totalBillsToPurchase ?? 0),
            duration: PlanDuration.YEARLY
        };
        this.buyExtraVoucherInProgress = true;
        this.changeDetection.detectChanges();
        this.subscriptionsService.buyExtraVoucher(request).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (res: any) => {
                this.buyExtraVoucherInProgress = false;
                if (res?.status === 'success' && res?.body) {
                    if (formValue.paymentProvider === PaymentProvider.RAZORPAY) {
                        this.initializeRazorpayPayment(res.body);
                    } else if (formValue.paymentProvider === PaymentProvider.PAYU) {
                        this.openPayUPayment(res.body);
                    }
                } else if (res?.message) {
                    this.toasterService.showSnackBar('error', res.message);
                }
                this.changeDetection.detectChanges();
            },
            error: () => {
                this.buyExtraVoucherInProgress = false;
                this.changeDetection.detectChanges();
            }
        });
    }

    /**
     * Initializes Razorpay payment with the order ID returned from buy-extra-voucher API
     *
     * @param {string} orderId - Razorpay order ID
     * @memberof AddExtraTransactionComponent
     */
    public initializeRazorpayPayment(orderId: string): void {
        const that = this;
        window.alert = () => {
            that.razorpay?.close();
            that.handleRazorpayFailure();
        };

        const options = {
            key: this.razorpayKey,
            handler: (res: any) => {
                that.capturePayment(res.razorpay_order_id, res.razorpay_payment_id, null);
                that.razorpayRetryCount = 0;
            },
            order_id: orderId,
            theme: { color: '#F37254' },
            name: 'GIDDH',
            description: 'Extra Voucher Purchase - Walkover Technologies Private Limited.'
        };

        try {
            this.razorpay = new window['Razorpay'](options);
            setTimeout(() => { this.razorpay?.open(); }, 100);
        } catch { }
    }

    /**
     * Handles Razorpay payment failure with retry logic
     *
     * @private
     * @memberof AddExtraTransactionComponent
     */
    private handleRazorpayFailure(): void {
        this.razorpay?.close();
        if (this.razorpayRetryCount < this.maxRazorpayRetryCount) {
            this.razorpayRetryCount++;
            setTimeout(() => { this.onSubmit(); }, 3000);
        }
    }

    /**
     * Opens PayU payment in a new window and listens for the response
     *
     * @param {string} html - PayU HTML returned from buy-extra-voucher API
     * @memberof AddExtraTransactionComponent
     */
    public openPayUPayment(html: string): void {
        const blob = new Blob([html], { type: 'text/html' });
        window.open(URL.createObjectURL(blob));

        const handlePayUMessage = (event: MessageEvent<{ status: string; transactionId: string; provider: string }>) => {
            if (event.data?.status?.toLowerCase() === 'success' && event.data.transactionId) {
                this.capturePayment(null, null, event.data.transactionId);
                window.removeEventListener('message', handlePayUMessage);
            } else if (event.data?.status?.toLowerCase() === 'failed') {
                window.removeEventListener('message', handlePayUMessage);
            }
        };
        window.addEventListener('message', handlePayUMessage);
    }

    /**
     * Calls capture-extra-voucher API after payment provider confirms success
     *
     * @param {string | null} razorpayOrderId - Razorpay order ID
     * @param {string | null} paymentId - Razorpay payment ID
     * @param {string | null} payuTransactionId - PayU transaction ID
     * @memberof AddExtraTransactionComponent
     */
    public capturePayment(razorpayOrderId: string | null, paymentId: string | null, payuTransactionId: string | null): void {
        const paymentProviderValue = this.extraTransactionForm.get('paymentProvider')?.value;
        let model: any = { paymentProvider: paymentProviderValue };

        if (paymentProviderValue === PaymentProvider.RAZORPAY) {
            model.razorpayOrderId = razorpayOrderId;
            model.paymentId = paymentId;
        } else if (paymentProviderValue === PaymentProvider.PAYU) {
            model.payuTransactionId = payuTransactionId;
        }

        this.captureExtraVoucherInProgress = true;
        this.changeDetection.detectChanges();
        this.subscriptionsService.captureExtraVoucher(this.subscriptionId, model).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (res: any) => {
                this.captureExtraVoucherInProgress = false;
                if (res?.status === 'success') {
                    this.toasterService.showSnackBar('success', this.localeData?.extra_vouchers_purchased_successfully);
                    this.router.navigate(['/pages/user-details/subscription']);
                } else if (res?.message) {
                    this.toasterService.showSnackBar('error', res.message);
                }
                this.changeDetection.detectChanges();
            },
            error: () => {
                this.captureExtraVoucherInProgress = false;
                this.changeDetection.detectChanges();
            }
        });
    }

    /**
     * Navigates back to subscription list
     *
     * @memberof AddExtraTransactionComponent
     */
    public goBack(): void {
        this.router.navigate(['/pages/user-details/subscription']);
    }

    /**
     * Hook cycle for component destroy
     *
     * @memberof AddExtraTransactionComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
