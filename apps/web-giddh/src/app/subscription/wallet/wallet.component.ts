import { Component, ChangeDetectionStrategy, Inject, effect, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { take, delay, debounceTime, takeUntil } from 'rxjs';
import { Subject } from 'rxjs';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { signal, computed } from '@angular/core';
import { ToasterService } from '../../services/toaster.service';
import { WalletService } from '../services/wallet.service';
import { ServiceConfig } from '../../services/service.config';
import { ASIDE_PANE_CONFIG, PaymentProvider } from '../../app.constant';
import { IWalletData, ICapturePayload } from '../models/wallet.model';
import { PaymentProviderCardsComponent } from '../components/payment-provider-cards/payment-provider-cards.component';
import { STRIPE_JS_CDN_URL } from '../../app.constant';
import { StripePaymentDialogComponent, StripePaymentDialogData } from '../buy-plan/stripe-payment-dialog/stripe-payment-dialog.component';
import { WalletTransactionListComponent } from '../wallet-transaction-list/wallet-transaction-list.component';
import { TranslateDirectiveModule } from '../../theme/translate/translate.directive.module';
import { GiddhPageLoaderModule } from '../../shared/giddh-page-loader/giddh-page-loader.module';
import { FormFieldsModule } from '../../theme/form-fields/form-fields.module';

@Component({
    selector: 'app-wallet',
    templateUrl: './wallet.component.html',
    styleUrls: ['./wallet.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        FormFieldsModule,
        PaymentProviderCardsComponent
    ]
})
export class WalletComponent {
    /** Form group for wallet amount and payment provider */
    public walletForm: FormGroup;
    /** Wallet data from API */
    public walletData = signal<IWalletData | null>(null);
    /** Subscription ID from route params */
    public subscriptionId = signal<string>('');
    /** Currency from subscription data (planCurrency) */
    public subscriptionCurrency = signal<{ code: string; symbol: string } | null>(null);
    /** Loading state flag for wallet details */
    public isLoadingWallet = signal<boolean>(false);
    /** Loading state flag for subscription data */
    public isLoadingSubscription = signal<boolean>(false);
    /** Adding amount state flag */
    public isAddingAmount = signal<boolean>(false);
    /** True while a payment popup / dialog is open (any provider). Used to hide the Proceed-to-Pay button. */
    public isPaymentPopupOpen = signal<boolean>(false);
    /** Currently selected payment provider */
    public selectedPaymentProvider = signal<string>(PaymentProvider.RAZORPAY);
    /** Suggested amount values for quick add buttons */
    public readonly amountSuggestions: number[] = [500, 1000, 2000, 5000];
    /** Set of suggestion values currently applied to the amount field */
    public appliedSuggestions = signal<Set<number>>(new Set<number>());
    /** Global Subject for handling check-mark timeout with RxJS */
    private suggestionSubject = new Subject<number>();
    /** GST rate applied on wallet amount */
    public readonly GST_RATE: number = 0.18;
    /** Current amount entered in the form */
    public currentAmount = signal<number>(0);
    /** Tax amount computed from current amount and GST rate */
    public readonly taxAmount = computed(() => +(this.currentAmount() * this.GST_RATE).toFixed(2));
    /** Net amount payable including tax */
    public readonly netAmountPayable = computed(() => +(this.currentAmount() + this.taxAmount()).toFixed(2));

    /**
     * Adds the suggestion amount to the current value. Shows a check-mark
     * on the clicked button for 1 second as visual feedback using RxJS delay.
     */
    public toggleAmountSuggestion(suggestion: number): void {
        const control = this.walletForm.get('amount');
        const current = Number(control?.value) || 0;
        control?.patchValue(current + suggestion);

        this.appliedSuggestions.update((currentSet) => {
            const applied = new Set(currentSet);
            applied.add(suggestion);
            return applied;
        });

        this.suggestionSubject.next(suggestion);
    }

    /** Whether a given suggestion is currently applied */
    public isSuggestionApplied(suggestion: number): boolean {
        return this.appliedSuggestions().has(suggestion);
    }
    /**
     * Supported payment providers based on subscription currency / region:
     * - India (INR)  -> Razorpay, PayU
     * - UK (GBP)     -> PayPal, Stripe
     * - Other        -> PayPal, Stripe, Razorpay
     */
    public readonly supportedPaymentProviders = computed<string[]>(() => {
        const currencyCode = this.subscriptionCurrency()?.code?.toUpperCase();
        if (currencyCode === 'INR') {
            return [PaymentProvider.RAZORPAY, PaymentProvider.PAYU];
        }
        if (currencyCode === 'GBP') {
            return [PaymentProvider.PAYPAL, PaymentProvider.STRIPE];
        }
        return [PaymentProvider.RAZORPAY, PaymentProvider.PAYPAL, PaymentProvider.STRIPE];
    });
    /** Locale data */
    public localeData: any = {};
    /** Common locale data */
    public commonLocaleData: any = {};
    /** Razorpay API key */
    public razorpayKey: string = '';
    /** Stripe publishable key */
    public stripeKey: string = '';
    /** Session storage key prefix used to persist wallet payment context across Stripe 3DS redirect */
    private readonly STRIPE_SESSION_PREFIX: string = 'wallet_stripe_';
    /** Last opened PayPal order id (used for capture after the approval window posts back) */
    private paypalOrderId: string = '';
    /** Currently opened popup window (PayPal approval) so we can close it after success */
    private openedPaypalWindow: Window | null = null;
    /** BroadcastChannel listening for PayPal approval callback from the popup window */
    private paypalBroadcast: BroadcastChannel | null = null;
    /** Currently opened PayU popup window so it can be closed on navigation away */
    private openedPayuWindow: Window | null = null;
    /** PayU `message` listener reference, kept so it can be removed on cleanup */
    private payuMessageHandler: ((event: MessageEvent<any>) => void) | null = null;
    /** Tracks the `setInterval` ids used by `watchPopupClose` so they can be cleared on destroy */
    private popupCloseIntervals = new Set<ReturnType<typeof setInterval>>();
    /** Dimensions of the PayPal approval popup window */
    private readonly PAYPAL_WINDOW_WIDTH: number = 800;
    private readonly PAYPAL_WINDOW_HEIGHT: number = 900;
    private readonly PAYPAL_WINDOW_NAME: string = 'PayPalPayment';

    /**
     * Validates subscription ID
     * @returns true if subscription ID is valid
     */
    public readonly isValidSubscriptionId = computed(() => {
        const id = this.subscriptionId();
        return !!(id && id.trim().length > 0);
    });

    /**
     * Combined loading state for wallet and subscription data
     * @returns true if either API is loading
     */
    public readonly isLoading = computed(() => {
        return this.isLoadingWallet() || this.isLoadingSubscription();
    });
    
    /** Constants for minimum amounts */
    private readonly MIN_AMOUNT_INR: number = 100;
    private readonly MIN_AMOUNT_OTHER: number = 10;
    private readonly PAYU_WINDOW_WIDTH: number = 800;
    private readonly PAYU_WINDOW_HEIGHT: number = 600;
    private readonly PAYU_WINDOW_NAME: string = 'PayUPayment';
    private readonly BRAND_COLOR: string = '#F37254';
    
    /** Route params as signal */
    private readonly routeParams = toSignal(this.route.params, { initialValue: {} as any });

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
        private dialog: MatDialog,
        @Inject(ServiceConfig) private serviceConfig: any,
        private destroyRef: DestroyRef
    ) {
        this.razorpayKey = this.serviceConfig.RAZORPAY_KEY;
        this.stripeKey = this.serviceConfig.STRIPE_PUBLISHABLE_KEY;
        this.initializeForm();
        this.handleStripeRedirectReturn();
        this.setupPaypalBroadcastListener();
        this.destroyRef.onDestroy(() => {
            this.teardownPaypalBroadcastListener();
            this.teardownPayuPayment();
            this.clearAllPopupCloseIntervals();
        });

        this.suggestionSubject.pipe(
            debounceTime(700),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
            this.appliedSuggestions.set(new Set<number>());
        });
        
        // Effect to handle route params changes
        effect((onCleanup) => {
            const params = this.routeParams();
            const subscriptionId = params['subscriptionId'];
            this.subscriptionId.set(subscriptionId || '');
            
            // Only call APIs if subscriptionId is valid
            if (subscriptionId && subscriptionId.trim().length > 0) {
                this.getWalletDetails();
                this.getSubscriptionData();
            }
        });

        // Keep selected payment provider valid for the active region/currency.
        // If the current selection is not in the supported list, fall back to the first supported one.
        effect(() => {
            const providers = this.supportedPaymentProviders();
            if (!providers?.length) {
                return;
            }
            const current = this.walletForm?.get('paymentProvider')?.value;
            if (!current || !providers.includes(current)) {
                this.walletForm?.get('paymentProvider')?.patchValue(providers[0]);
                this.selectedPaymentProvider.set(providers[0]);
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

        this.walletForm.get('amount')?.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                this.currentAmount.set(Number(value) || 0);
            });
    }

    /**
     * Fetches subscription data
     * @private
     */
    private getSubscriptionData(): void {
        this.isLoadingSubscription.set(true);
        this.walletService.getSubscriptionData(this.subscriptionId())
            .pipe(take(1))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success' && response?.body) {
                        // Extract period from subscription data and set as duration in form
                        const period = response.body?.period;
                        if (period) {
                            this.walletForm.patchValue({ duration: period });
                        }
                        // Extract currency from subscription data for payment processing
                        const planCurrency = response.body?.planCurrency;
                        if (planCurrency) {
                            this.subscriptionCurrency.set({ code: planCurrency.code, symbol: planCurrency.symbol });
                        }
                    } else {
                        response?.message && this.toasterService.errorToast(response?.message);
                    }
                    this.isLoadingSubscription.set(false);
                },
                error: (error) => {
                    this.toasterService.errorToast(error?.message);
                    this.isLoadingSubscription.set(false);
                }
            });
    }

    /**
     * Fetches wallet details from API
     * Sets loading state and updates wallet data
     * @private
     */
    private getWalletDetails(): void {
        if (!this.isValidSubscriptionId()) {
            this.toasterService.errorToast('Invalid subscription ID');
            return;
        }

        this.isLoadingWallet.set(true);
        this.walletService.getWalletDetails(this.subscriptionId())
            .pipe(take(1))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success' && response?.body.uniqueName) {
                        this.walletData.set(response.body);
                    } else {
                        response?.message && this.toasterService.errorToast(response?.message);
                    }
                    this.isLoadingWallet.set(false);
                },
                error: (error) => {
                    this.toasterService.errorToast(error?.message);
                    this.isLoadingWallet.set(false);
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
        this.selectedPaymentProvider.set(provider);
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
        const currencyCode = this.subscriptionCurrency()?.code;
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
            subscriptionId: this.subscriptionId(),
            walletAmount: formValue.amount.toString(),
            duration: this.walletForm.get('duration')?.value,
            paymentProvider: formValue.paymentProvider
        };

        this.isAddingAmount.set(true);
        this.walletService.addWalletAmount(payload)
            .pipe(take(1))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success') {
                        this.toasterService.successToast('Payment initiated successfully');
                        this.handlePaymentInitiation(formValue.paymentProvider, response?.body);
                    } else {
                        response?.message && this.toasterService.errorToast(response?.message);
                    }
                    this.isAddingAmount.set(false);
                },
                error: (error) => {
                    this.toasterService.errorToast(error?.message);
                    this.isAddingAmount.set(false);
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
        } else if (provider === PaymentProvider.STRIPE && this.getStripeClientSecret(responseBody)) {
            this.openStripePayment(responseBody);
        } else if (provider === PaymentProvider.PAYPAL && responseBody?.approvalUrl) {
            this.openPaypalPayment(responseBody);
        }
    }

    /**
     * Opens the PayPal approval link in a centered popup window. The opened
     * window is expected to broadcast `{success: true}` on the
     * `call-back-subscription` channel after the user approves the payment.
     *
     * @param responseBody Response from addWalletAmount containing paypal info
     */
    public openPaypalPayment(responseBody: any): void {
        const approvalLink: string = responseBody?.approvalUrl;
        if (!approvalLink) {
            this.toasterService.errorToast('Invalid PayPal approval link');
            return;
        }
        this.paypalOrderId = responseBody?.paypalOrderId || '';

        const features = this.getCenteredPopupFeatures(this.PAYPAL_WINDOW_WIDTH, this.PAYPAL_WINDOW_HEIGHT);
        this.openedPaypalWindow = window.open(approvalLink, this.PAYPAL_WINDOW_NAME, features);

        if (!this.openedPaypalWindow) {
            this.toasterService.errorToast('Failed to open PayPal window. Please check popup blocker settings.');
            return;
        }
        this.isPaymentPopupOpen.set(true);
        this.watchPopupClose(this.openedPaypalWindow);
    }

    /**
     * Sets up a BroadcastChannel listener that captures the wallet payment as
     * soon as the PayPal popup window reports a successful approval.
     *
     * @private
     */
    private setupPaypalBroadcastListener(): void {
        if (typeof BroadcastChannel === 'undefined') {
            return;
        }
        this.paypalBroadcast = new BroadcastChannel('call-back-subscription');
        this.paypalBroadcast.onmessage = (event: MessageEvent<{ success?: boolean }>) => {
            if (!event?.data?.success || !this.paypalOrderId) {
                return;
            }
            const capturePayload: ICapturePayload = {
                subscriptionId: this.subscriptionId(),
                duration: this.walletForm.get('duration')?.value,
                paymentProvider: PaymentProvider.PAYPAL,
                paypalOrderId: this.paypalOrderId
            };
            this.captureWalletPayment(capturePayload);
            this.paypalOrderId = '';
            this.closePaypalWindow();
        };
    }

    /** Cleans up the PayPal BroadcastChannel listener */
    private teardownPaypalBroadcastListener(): void {
        this.paypalBroadcast?.close();
        this.paypalBroadcast = null;
        this.closePaypalWindow();
    }

    /** Closes the open PayPal popup window if any */
    private closePaypalWindow(): void {
        if (this.openedPaypalWindow && !this.openedPaypalWindow.closed) {
            this.openedPaypalWindow.close();
        }
        this.openedPaypalWindow = null;
    }

    /**
     * Extracts the Stripe client secret from a backend response, supporting
     * either `clientSecret` or `stripeClientSecret` keys.
     */
    private getStripeClientSecret(response: any): string | undefined {
        return response?.clientSecret ?? response?.stripeClientSecret;
    }

    /**
     * Extracts payment intent id from a Stripe client secret (format: `pi_xxx_secret_yyy`)
     */
    private extractPaymentIntentId(clientSecret: string): string {
        return clientSecret?.split('_secret_')[0] || '';
    }

    /**
     * Opens the reusable Stripe payment dialog with wallet-specific session data.
     * If the card requires 3DS, the browser will navigate to `returnUrl`; on return
     * `handleStripeRedirectReturn()` reads sessionStorage and captures the payment.
     *
     * @param responseBody Response from addWalletAmount containing the Stripe client secret
     */
    public openStripePayment(responseBody: any): void {
        const clientSecret = this.getStripeClientSecret(responseBody);
        if (!clientSecret) {
            this.toasterService.errorToast('Invalid Stripe configuration');
            return;
        }
        if (!this.stripeKey) {
            this.toasterService.errorToast('Stripe is not configured');
            return;
        }

        const sessionData: Record<string, string> = {
            [`${this.STRIPE_SESSION_PREFIX}subscription_id`]: this.subscriptionId(),
            [`${this.STRIPE_SESSION_PREFIX}duration`]: this.walletForm.get('duration')?.value || '',
            [`${this.STRIPE_SESSION_PREFIX}payment_intent_id`]: responseBody?.paymentIntentId || this.extractPaymentIntentId(clientSecret),
            [`${this.STRIPE_SESSION_PREFIX}amount`]: String(this.getAmountControl()?.value ?? '')
        };

        const dialogData: StripePaymentDialogData = {
            stripeKey: this.stripeKey,
            clientSecret,
            sessionData,
            returnUrl: window.location.origin + window.location.pathname,
            isSetup: !!responseBody?.isSetup,
            localeData: this.localeData,
            commonLocaleData: this.commonLocaleData
        };

        // Pre-load Stripe.js so the payment element renders without delay
        this.loadStripeScript().then(() => {
            const stripeDialogRef = this.dialog.open(StripePaymentDialogComponent, {
                panelClass: ['mat-dialog-sm'],
                disableClose: true,
                data: dialogData
            });
            this.isPaymentPopupOpen.set(true);

            stripeDialogRef.afterClosed().pipe(take(1)).subscribe(() => {
                // Dialog only closes when user cancels or after non-3DS error.
                // 3DS success navigates the browser; capture happens on return.
                this.isPaymentPopupOpen.set(false);
                this.clearStripeSession();
            });
        }).catch(() => {
            this.toasterService.errorToast('Failed to load Stripe payment library');
        });
    }

    /**
     * Detects a Stripe 3DS redirect return based on URL query params
     * (`payment_intent`, `redirect_status`). On success, captures the wallet
     * payment using session data persisted before the redirect.
     *
     * @private
     */
    private handleStripeRedirectReturn(): void {
        const params = new URLSearchParams(window.location.search);
        const paymentIntent = params.get('payment_intent');
        const redirectStatus = params.get('redirect_status');
        const storedIntentId = sessionStorage.getItem(`${this.STRIPE_SESSION_PREFIX}payment_intent_id`);

        if (!paymentIntent || !storedIntentId || paymentIntent !== storedIntentId) {
            return;
        }

        const subscriptionId = sessionStorage.getItem(`${this.STRIPE_SESSION_PREFIX}subscription_id`) || '';
        const duration = sessionStorage.getItem(`${this.STRIPE_SESSION_PREFIX}duration`) || '';

        // Clean URL so a refresh doesn't re-trigger this
        this.router.navigate([], { queryParams: {}, replaceUrl: true });

        if (redirectStatus === 'succeeded') {
            this.captureWalletPayment({
                subscriptionId,
                duration,
                paymentProvider: PaymentProvider.STRIPE,
                paymentIntentId: paymentIntent
            });
        } else {
            this.toasterService.errorToast('Stripe payment failed');
        }
        this.clearStripeSession();
    }

    /** Removes any wallet stripe keys from sessionStorage */
    private clearStripeSession(): void {
        Object.keys(sessionStorage)
            .filter(key => key.startsWith(this.STRIPE_SESSION_PREFIX))
            .forEach(key => sessionStorage.removeItem(key));
    }

    /**
     * Dynamically loads the Stripe.js script from CDN if not already present
     * @private
     */
    private loadStripeScript(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (window['Stripe']) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = STRIPE_JS_CDN_URL;
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.head.appendChild(script);
        });
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
            currency: this.subscriptionCurrency()?.code,
            name: this.serviceConfig.BRAND_NAME,
            description: this.serviceConfig.LEGAL_NAME
        };

        // Flip the popup-open flag off when the user dismisses the Razorpay modal
        // without paying, or when payment fails.
        (options as any).modal = {
            ondismiss: () => this.isPaymentPopupOpen.set(false)
        };

        try {
            const razorpay = new window['Razorpay'](options);
            razorpay.on?.('payment.failed', () => this.isPaymentPopupOpen.set(false));
            razorpay.open();
            this.isPaymentPopupOpen.set(true);
        } catch (error) {
            this.isPaymentPopupOpen.set(false);
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

        // Tear down any previous PayU session (listener + window) before opening a new one.
        this.teardownPayuPayment();

        const blob = new Blob([payuHtml], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        const windowFeatures = this.getCenteredPopupFeatures(this.PAYU_WINDOW_WIDTH, this.PAYU_WINDOW_HEIGHT);
        const payuWindow = window.open(blobUrl, this.PAYU_WINDOW_NAME, windowFeatures);

        if (!payuWindow) {
            URL.revokeObjectURL(blobUrl);
            this.toasterService.errorToast('Failed to open payment window. Please check popup blocker settings.');
            return;
        }

        this.openedPayuWindow = payuWindow;
        this.isPaymentPopupOpen.set(true);
        this.watchPopupClose(payuWindow, () => {
            URL.revokeObjectURL(blobUrl);
            this.teardownPayuPayment();
        });
        this.setupPayUMessageListener(payuWindow);
    }

    /**
     * Closes any open PayU popup and detaches the `message` listener.
     * Called on retry, on successful capture, and on component destroy
     * (e.g. user navigates back in the browser).
     *
     * @private
     */
    private teardownPayuPayment(): void {
        if (this.payuMessageHandler) {
            window.removeEventListener('message', this.payuMessageHandler);
            this.payuMessageHandler = null;
        }
        if (this.openedPayuWindow && !this.openedPayuWindow.closed) {
            this.openedPayuWindow.close();
        }
        this.openedPayuWindow = null;
    }

    /**
     * Polls a popup window every 500ms; when it closes, resets the
     * `isPaymentPopupOpen` flag so the Proceed-to-Pay button reappears.
     * Used for provider popups (PayU / PayPal) that don't expose a close event.
     *
     * @private
     */
    private watchPopupClose(popup: Window, onClose?: () => void): void {
        const interval = setInterval(() => {
            if (!popup || popup.closed) {
                clearInterval(interval);
                this.popupCloseIntervals.delete(interval);
                this.isPaymentPopupOpen.set(false);
                onClose?.();
            }
        }, 500);
        this.popupCloseIntervals.add(interval);
    }

    /** Clears any outstanding `watchPopupClose` intervals (called on destroy). */
    private clearAllPopupCloseIntervals(): void {
        this.popupCloseIntervals.forEach(id => clearInterval(id));
        this.popupCloseIntervals.clear();
    }

    /**
     * Builds a `window.open` features string for a centered popup of the given size.
     * Used by PayU and PayPal provider flows.
     *
     * @param width Popup width in pixels
     * @param height Popup height in pixels
     * @returns Window features string
     * @private
     */
    private getCenteredPopupFeatures(width: number, height: number): string {
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;
        return `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`;
    }

    /**
     * Sets up message listener for PayU payment response
     * @param payuWindow - PayU window reference
     * @private
     */
    private setupPayUMessageListener(payuWindow: Window): void {
        const handlePayUMessage = (event: MessageEvent<any>) => {
            const status = event?.data?.status?.toLowerCase?.();
            if (status === 'success' && event.data.transactionId) {
                this.handlePayuSuccess(event.data);
                this.teardownPayuPayment();
            } else if (status === 'failed') {
                this.toasterService.errorToast('PayU payment failed');
                this.teardownPayuPayment();
            }
        };
        this.payuMessageHandler = handlePayUMessage;
        window.addEventListener('message', handlePayUMessage);
    }

    /**
     * Handles successful Razorpay payment
     * Creates capture payload and calls capture API
     * @param response - Razorpay payment response
     */
    public handleRazorpaySuccess(response: any): void {
        const capturePayload: ICapturePayload = {
            subscriptionId: this.subscriptionId(),
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
            subscriptionId: this.subscriptionId(),
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
            .pipe(take(1))
            .subscribe({
                next: (response: any) => {
                    if (response?.status === 'success') {
                        this.toasterService.successToast('Payment captured successfully');
                        this.resetFormAndRefresh();
                    } else {
                        response?.message && this.toasterService.errorToast(response.message);
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
            (payload?.razorpayOrderId || payload?.payuTransactionId || payload?.paymentIntentId || payload?.paypalOrderId));
    }

    /**
     * Resets form and refreshes wallet details
     * @private
     */
    private resetFormAndRefresh(): void {
        // Reset to the first payment provider supported by the active country/region
        // (e.g. Razorpay for INR, PayPal for GBP) instead of a hard-coded default.
        const defaultProvider = this.supportedPaymentProviders()?.[0] ?? PaymentProvider.RAZORPAY;
        this.walletForm.patchValue({ paymentProvider: defaultProvider, amount: null });
        this.selectedPaymentProvider.set(defaultProvider);
        this.appliedSuggestions.set(new Set<number>());
        this.isPaymentPopupOpen.set(false);
        this.getWalletDetails();
    }

    /**
     * Opens transaction sidebar dialog
     * @public
     */
    public openTransactionSidebar(): void {
        this.dialog.open(WalletTransactionListComponent, { ...ASIDE_PANE_CONFIG, data: { subscriptionId: this.subscriptionId() } });
    }
}
