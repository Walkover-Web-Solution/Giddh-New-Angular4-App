import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Configuration, EntityCode, IOption, PaymentProvider, PlanDuration } from '../../app.constant';
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
    public filteredPaymentProviders: IOption[] = [];
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
        return this.priceByRegion[this.regionCode];
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
            totalInvoicesToPurchase: String(formValue.totalInvoicesToPurchase),
            totalBillsToPurchase: String(formValue.totalBillsToPurchase),
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
            image: 'data:image/png;base64,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',
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
    * Callback for translation response complete
    *
    * @param {*} event
    * @memberof AddExtraTransactionComponent
    */
    public translationComplete(event: any): void {
        if (event) {
            this.filteredPaymentProviders = [
                { label: this.localeData?.payu, value: PaymentProvider.PAYU },
                { label: this.localeData?.razorpay, value: PaymentProvider.RAZORPAY }
            ];
            this.changeDetection.detectChanges();
        }
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
