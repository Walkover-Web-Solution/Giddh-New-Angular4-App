import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { STRIPE_JS_CDN_URL } from '../../../app.constant';

/** Data passed to the Stripe payment dialog */
export interface StripePaymentDialogData {
    /** Stripe publishable key */
    stripeKey: string;
    /** Stripe payment intent client secret */
    clientSecret: string;
    /** Session storage key-value pairs to persist before 3DS redirect */
    sessionData: Record<string, string>;
    /** Return URL for Stripe to redirect back after 3DS */
    returnUrl: string;
    /** Locale data for translated strings */
    localeData?: any;
    /** Common locale data for translated strings */
    commonLocaleData?: any;
}

@Component({
    selector: 'app-stripe-payment-dialog',
    templateUrl: './stripe-payment-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatDialogModule, MatButtonModule]
})
export class StripePaymentDialogComponent implements AfterViewInit, OnDestroy {

    /** Reference to the container where Stripe mounts the payment element */
    @ViewChild('stripePaymentElement') private readonly stripePaymentElementRef: ElementRef;

    /** True while payment confirmation is in flight */
    protected readonly paymentInProgress = signal(false);

    /** Error message returned by Stripe, if any */
    protected readonly error = signal('');

    /** Stripe.js instance */
    private stripe: any;

    /** Stripe Elements instance */
    private stripeElements: any;

    constructor(
        @Inject(MAT_DIALOG_DATA) protected readonly data: StripePaymentDialogData,
        private readonly dialogRef: MatDialogRef<StripePaymentDialogComponent>,
    ) {}

    /**
     * Initializes Stripe after the view is ready so the mount target exists
     *
     * @memberof StripePaymentDialogComponent
     */
    public ngAfterViewInit(): void {
        this.initializeStripe();
    }

    /**
     * Cleans up Stripe references on component destroy
     *
     * @memberof StripePaymentDialogComponent
     */
    public ngOnDestroy(): void {
        this.stripe = null;
        this.stripeElements = null;
    }

    /**
     * Writes session data then confirms the Stripe payment.
     * On 3DS the browser navigates away; on card error the dialog stays open with the message.
     *
     * @memberof StripePaymentDialogComponent
     */
    protected async confirmPayment(): Promise<void> {
        if (!this.stripe || !this.stripeElements) {
            return;
        }
        this.paymentInProgress.set(true);
        this.error.set('');

        Object.entries(this.data.sessionData).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                sessionStorage.setItem(key, value);
            }
        });

        const { error } = await this.stripe.confirmPayment({
            elements: this.stripeElements,
            confirmParams: { return_url: this.data.returnUrl }
        });

        if (error) {
            this.paymentInProgress.set(false);
            this.error.set(error.message);
        }
    }

    /**
     * Loads Stripe.js from CDN then mounts the payment element into the container
     *
     * @private
     * @memberof StripePaymentDialogComponent
     */
    private initializeStripe(): void {
        if (!this.data.stripeKey) {
            this.error.set('Stripe publishable key is not configured.');
            return;
        }
        if (!this.data.clientSecret) {
            this.error.set('Stripe client secret is missing.');
            return;
        }
        // Stripe.js is pre-loaded by the parent component before the dialog opens.
        // If for some reason it is not available, fall back to dynamic loading.
        if (window['Stripe']) {
            this.mountStripeElement();
        } else {
            this.loadStripeScript().then(() => this.mountStripeElement()).catch(() => {
                this.error.set('Failed to load Stripe payment library.');
            });
        }
    }

    /**
     * Creates Stripe instance and mounts the payment element
     *
     * @private
     * @memberof StripePaymentDialogComponent
     */
    private mountStripeElement(): void {
        try {
            this.stripe = window['Stripe'](this.data.stripeKey);
            const elements = this.stripe.elements({
                clientSecret: this.data.clientSecret,
                appearance: { theme: 'stripe' }
            });
            this.stripeElements = elements;
            const paymentElement = elements.create('payment');
            paymentElement.mount(this.stripePaymentElementRef.nativeElement);
        } catch (err: any) {
            this.error.set(err?.message || 'Failed to initialize Stripe.');
        }
    }

    /**
     * Dynamically loads the Stripe.js script from CDN if not already present
     *
     * @private
     * @returns {Promise<void>}
     * @memberof StripePaymentDialogComponent
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
}
