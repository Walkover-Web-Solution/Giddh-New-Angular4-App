import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject, takeUntil, filter, take, tap } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { WalletService } from '../services/wallet.service';
import { ServiceConfig } from '../../services/service.config';
import { ASIDE_PANE_CONFIG, PaymentProvider } from '../../app.constant';
import { IPaymentProvider, IWalletData, ICapturePayload } from '../models/wallet.model';
import { WalletTransactionListComponent } from '../wallet-transaction-list/wallet-transaction-list.component';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class WalletComponent implements OnInit, OnDestroy {
    /** Form group for wallet amount and payment provider */
    public walletForm: FormGroup;
    /** Wallet data from API */
    public walletData: IWalletData | null = null;
    /** Subscription ID from route params */
    public subscriptionId: string = '';
    /** Loading state flag */
    public isLoading: boolean = false;
    /** Adding amount state flag */
    public isAddingAmount: boolean = false;
    /** Currently selected payment provider */
    public selectedPaymentProvider: string = PaymentProvider.RAZORPAY;
    /** Available payment providers */
    public readonly paymentProviders: IPaymentProvider[] = [
        {
            id: PaymentProvider.RAZORPAY,
            name: 'Razorpay',
            logo: 'assets/images/icon/RAZORPAY.svg',
            features: [
                { name: 'UPI', icon: 'assets/images/UPI.png' },
                { name: 'Cards', icon: 'assets/images/CARD.png' },
                { name: 'Net Banking', icon: 'assets/images/NET_BANKING.png' },
                { name: 'Wallets', icon: 'assets/images/WALLET.png' },
                { name: 'EMI', icon: 'assets/images/EMI_DISCOUNT.png' }
            ]
        },
        {
            id: PaymentProvider.PAYU,
            name: 'PayU',
            logo: 'assets/images/icon/PAYU.svg',
            features: [
                { name: 'UPI', icon: 'assets/images/UPI.png' },
                { name: 'Cards', icon: 'assets/images/CARD.png' },
                { name: 'Net Banking', icon: 'assets/images/NET_BANKING.png' },
                { name: 'Wallets', icon: 'assets/images/WALLET.png' },
                { name: 'EMI', icon: 'assets/images/EMI_DISCOUNT.png' }
            ]
        }
    ];
    /** Locale data */
    public localeData: any = {};
    /** Common locale data */
    public commonLocaleData: any = {};
    /** Razorpay API key */
    public razorpayKey: string = '';

    /**
     * Validates subscription ID
     * @returns true if subscription ID is valid
     */
    public get isValidSubscriptionId(): boolean {
        return !!(this.subscriptionId && this.subscriptionId.trim().length > 0);
    }
    
    /** Constants for minimum amounts */
    private readonly MIN_AMOUNT_INR: number = 100;
    private readonly MIN_AMOUNT_OTHER: number = 10;
    private readonly PAYU_WINDOW_WIDTH: number = 800;
    private readonly PAYU_WINDOW_HEIGHT: number = 600;
    private readonly PAYU_WINDOW_NAME: string = 'PayUPayment';
    private readonly BRAND_COLOR: string = '#F37254';
    
    /** Subject for unsubscribing from observables */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Component constructor
     * Initializes form and Razorpay key from service config
     */
    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private toasterService: ToasterService,
        private walletService: WalletService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        @Inject(ServiceConfig) private serviceConfig: any
    ) {
        this.razorpayKey = this.serviceConfig.RAZORPAY_KEY;
        this.initializeForm();
    }

    /**
     * Angular lifecycle hook - component initialization
     * Subscribes to route params and loads subscription data and wallet details
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.subscriptionId = params['subscriptionId'];
            if (this.isValidSubscriptionId) {
                this.getWalletDetails();
                this.getSubscriptionData();
            }
        });
    }

    /**
     * Initializes the wallet form with validators
     * @private
     */
    private initializeForm(): void {
        this.walletForm = this.fb.group({
            amount: ['', [Validators.required, Validators.min(0.01)]],
            paymentProvider: [PaymentProvider.RAZORPAY, Validators.required],
            duration: ['', Validators.required]
        });
    }

    /**
     * Fetches subscription data
     * @private
     */
    private getSubscriptionData(): void {
        this.isLoading = true;
        this.cdr.markForCheck();
        this.walletService.getSubscriptionData(this.subscriptionId)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success' && response?.body) {
                        // Extract period from subscription data and set as duration in form
                        const period = response.body?.period;
                        if (period) {
                            this.walletForm.patchValue({ duration: period });
                        }
                    } else {
                        this.toasterService.errorToast(response?.message);
                        this.isLoading = false;
                        this.cdr.markForCheck();
                    }
                },
                error: (error) => {
                    this.toasterService.errorToast(error?.message);
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            });
    }

    /**
     * Fetches wallet details from API
     * Sets loading state and updates wallet data
     * @private
     */
    private getWalletDetails(): void {
        if (!this.isValidSubscriptionId) {
            this.toasterService.errorToast('Invalid subscription ID');
            return;
        }

        this.isLoading = true;
        this.cdr.markForCheck();
        this.walletService.getWalletDetails(this.subscriptionId)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success' && response?.body) {
                        this.walletData = response.body;
                    } else {
                        this.toasterService.errorToast(response?.message);
                    }
                    this.isLoading = false;
                    this.cdr.markForCheck();
                },
                error: (error) => {
                    this.toasterService.errorToast(error?.message);
                    this.isLoading = false;
                    this.cdr.markForCheck();
                }
            });
    }

    /**
     * Selects a payment provider
     * @param provider - Payment provider ID
     */
    public selectPaymentProvider(provider: string): void {
        if (!Object.values(PaymentProvider).includes(provider)) {
            this.toasterService.errorToast('Invalid payment provider');
            return;
        }
        this.selectedPaymentProvider = provider;
        this.walletForm.patchValue({ paymentProvider: provider });
    }

    /**
     * Gets feature names as comma-separated string
     * @param features - Array of features
     * @returns Comma-separated feature names
     */
    public getFeatureNames(features: Array<{ name: string; icon: string }>): string {
        if (!Array.isArray(features) || features.length === 0) {
            return '';
        }
        return features.map(f => f?.name).filter(Boolean).join(', ');
    }

    /**
     * Validates if entered amount meets minimum requirement
     * @returns true if amount is valid
     */
    public isAmountValid(): boolean {
        const amount = this.getAmountControl()?.value;
        if (!amount || isNaN(amount)) {
            return false;
        }
        const minAmount = this.getMinimumAmount();
        return amount >= minAmount;
    }

    /**
     * Gets the minimum amount based on currency
     * @returns Minimum amount (100 for INR/IND, 10 for others)
     */
    public getMinimumAmount(): number {
        const currencyCode = this.walletData?.currency?.code;
        return this.isIndianCurrency(currencyCode) ? this.MIN_AMOUNT_INR : this.MIN_AMOUNT_OTHER;
    }

    /**
     * Checks if currency is Indian (INR or IND)
     * @param currencyCode - Currency code to check
     * @returns true if currency is Indian
     * @private
     */
    private isIndianCurrency(currencyCode: string): boolean {
        return currencyCode === 'INR' || currencyCode === 'IND';
    }

    /**
     * Gets the amount form control
     * @returns Amount form control
     * @private
     */
    private getAmountControl(): AbstractControl | null {
        return this.walletForm.get('amount');
    }

    /**
     * Initiates adding funds to wallet
     * Validates form and calls API to add wallet amount
     */
    public addFundsToWallet(): void {
        if (!this.walletForm.valid || !this.isAmountValid()) {
            return;
        }

        const formValue = this.walletForm.value;
        const payload = {
            subscriptionId: this.subscriptionId,
            walletAmount: formValue.amount.toString(),
            duration: this.walletForm.get('duration')?.value,
            paymentProvider: formValue.paymentProvider
        };

        this.isAddingAmount = true;
        this.cdr.markForCheck();
        this.walletService.addWalletAmount(payload)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success') {
                        this.toasterService.successToast('Payment initiated successfully');
                        this.handlePaymentInitiation(formValue.paymentProvider, response?.body);
                    } else {
                        this.toasterService.errorToast(response?.message);
                    }
                    this.isAddingAmount = false;
                    this.cdr.markForCheck();
                },
                error: (error) => {
                    this.toasterService.errorToast(error?.message);
                    this.isAddingAmount = false;
                    this.cdr.markForCheck();
                }
            });
    }

    /**
     * Handles payment initiation based on provider
     * @param provider - Payment provider type
     * @param responseBody - Response body from API
     * @private
     */
    private handlePaymentInitiation(provider: string, responseBody: any): void {
        if (provider === PaymentProvider.RAZORPAY && responseBody?.orderId) {
            this.openRazorpayPayment(responseBody.orderId);
        } else if (provider === PaymentProvider.PAYU && responseBody?.payuHtml) {
            this.openPayuPayment(responseBody.payuHtml);
        }
    }

    /**
     * Opens Razorpay payment popup
     * Uses Razorpay script loaded globally in app.component.ts
     * @param orderId - Razorpay order ID
     */
    public openRazorpayPayment(orderId: string): void {
        if (!orderId || orderId.trim().length === 0) {
            this.toasterService.errorToast('Invalid order ID');
            return;
        }

        // Razorpay script is loaded globally in app.component.ts
        if (window['Razorpay']) {
            this.initializeRazorpayPayment(orderId);
        } else {
            this.toasterService.errorToast('Razorpay is not available');
        }
    }

    /**
     * Initializes Razorpay payment options and opens checkout
     * @param orderId - Razorpay order ID
     * @private
     */
    private initializeRazorpayPayment(orderId: string): void {
        const amount = this.getAmountControl()?.value;
        const options = {
            key: this.razorpayKey,
            order_id: orderId,
            handler: (response: any) => {
                this.handleRazorpaySuccess(response);
            },
            theme: {
                color: this.BRAND_COLOR
            },
            amount: amount,
            currency: this.walletData?.currency?.code,
            name: this.serviceConfig.BRAND_NAME,
            description: this.serviceConfig.LEGAL_NAME
        };

        try {
            const razorpay = new window['Razorpay'](options);
            razorpay.open();
        } catch (error) {
            this.toasterService.errorToast('Failed to open payment gateway');
        }
    }

    /**
     * Opens PayU payment in a new window
     * Listens for payment response via postMessage
     * @param payuHtml - PayU HTML form
     */
    public openPayuPayment(payuHtml: string): void {
        if (!payuHtml || payuHtml.trim().length === 0) {
            this.toasterService.errorToast('Invalid payment form');
            return;
        }

        const blob = new Blob([payuHtml], { type: 'text/html' });
        const windowFeatures = this.getPayUWindowFeatures();
        const payuWindow = window.open(URL.createObjectURL(blob), this.PAYU_WINDOW_NAME, windowFeatures);

        if (!payuWindow) {
            this.toasterService.errorToast('Failed to open payment window. Please check popup blocker settings.');
            return;
        }

        this.setupPayUMessageListener(payuWindow);
    }

    /**
     * Gets PayU window features string with centered position
     * @returns Window features string
     * @private
     */
    private getPayUWindowFeatures(): string {
        const left = (window.innerWidth - this.PAYU_WINDOW_WIDTH) / 2;
        const top = (window.innerHeight - this.PAYU_WINDOW_HEIGHT) / 2;
        return `width=${this.PAYU_WINDOW_WIDTH},height=${this.PAYU_WINDOW_HEIGHT},left=${left},top=${top},resizable=yes,scrollbars=yes`;
    }

    /**
     * Sets up message listener for PayU payment response
     * @param payuWindow - PayU window reference
     * @private
     */
    private setupPayUMessageListener(payuWindow: Window): void {
        const handlePayUMessage = (event: MessageEvent<any>) => {
            if (event.data?.status?.toLowerCase() === 'success' && event.data.transactionId) {
                this.handlePayuSuccess(event.data);
                window.removeEventListener('message', handlePayUMessage);
                payuWindow?.close();
            } else if (event.data?.status?.toLowerCase() === 'failed') {
                this.toasterService.errorToast('PayU payment failed');
                window.removeEventListener('message', handlePayUMessage);
                payuWindow?.close();
            }
        };
        window.addEventListener('message', handlePayUMessage);
    }

    /**
     * Handles successful Razorpay payment
     * Creates capture payload and calls capture API
     * @param response - Razorpay payment response
     */
    public handleRazorpaySuccess(response: any): void {
        const capturePayload: ICapturePayload = {
            subscriptionId: this.subscriptionId,
            duration: this.walletForm.get('duration')?.value,
            paymentProvider: PaymentProvider.RAZORPAY,
            razorpayOrderId: response?.razorpay_order_id,
            paymentId: response?.razorpay_payment_id
        };
        this.captureWalletPayment(capturePayload);
    }

    /**
     * Handles successful PayU payment
     * Creates capture payload and calls capture API
     * @param response - PayU payment response
     */
    public handlePayuSuccess(response: any): void {
        const capturePayload: ICapturePayload = {
            subscriptionId: this.subscriptionId,
            duration: this.walletForm.get('duration')?.value,
            paymentProvider: PaymentProvider.PAYU,
            payuTransactionId: response?.transactionId
        };
        this.captureWalletPayment(capturePayload);
    }

    /**
     * Captures wallet payment after successful payment gateway transaction
     * @param payload - Capture payment payload
     */
    public captureWalletPayment(payload: ICapturePayload): void {
        if (!this.isValidCapturePayload(payload)) {
            this.toasterService.errorToast('Invalid payment details');
            return;
        }

        this.walletService.captureWalletPayment(payload)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success') {
                        this.toasterService.successToast('Payment captured successfully');
                        this.resetFormAndRefresh();
                    } else {
                        this.toasterService.errorToast('Failed to capture payment');
                    }
                },
                error: (error) => {
                    this.toasterService.errorToast(error?.message || 'Failed to capture payment');
                }
            });
    }

    /**
     * Validates capture payment payload
     * @param payload - Payload to validate
     * @returns true if payload is valid
     * @private
     */
    private isValidCapturePayload(payload: ICapturePayload): boolean {
        return !!(payload?.subscriptionId && payload?.paymentProvider &&
            (payload?.razorpayOrderId || payload?.payuTransactionId));
    }

    /**
     * Resets form and refreshes wallet details
     * @private
     */
    private resetFormAndRefresh(): void {
        this.walletForm.reset({ paymentProvider: PaymentProvider.RAZORPAY });
        this.selectedPaymentProvider = PaymentProvider.RAZORPAY;
        this.getWalletDetails();
    }

    /**
     * Opens transaction sidebar dialog
     * @public
     */
    public openTransactionSidebar(): void {
        this.dialog.open(WalletTransactionListComponent, { ...ASIDE_PANE_CONFIG, data: { subscriptionId: this.subscriptionId } });
    }


    /**
     * Angular lifecycle hook - component destruction
     * Cleans up subscriptions
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
