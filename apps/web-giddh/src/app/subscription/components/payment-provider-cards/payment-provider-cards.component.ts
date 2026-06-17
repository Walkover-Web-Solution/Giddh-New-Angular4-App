import { ChangeDetectionStrategy, Component, effect, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PaymentProvider, PaymentMethod } from '../../../app.constant';
import { IPaymentProvider } from '../../models/wallet.model';

@Component({
    selector: 'payment-provider-cards',
    templateUrl: './payment-provider-cards.component.html',
    styleUrls: ['./payment-provider-cards.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [CommonModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PaymentProviderCardsComponent),
            multi: true
        }
    ]
})
export class PaymentProviderCardsComponent implements ControlValueAccessor {
    /** Optional CSS class(es) to apply to the host element */
    readonly cssClass = input<string>('');
    /** List of supported payment provider IDs to display */
    readonly supportedProviders = input<string[]>([
        PaymentProvider.RAZORPAY,
        PaymentProvider.PAYU,
        PaymentProvider.STRIPE,
        PaymentProvider.PAYPAL,
        PaymentProvider.GOCARDLESS
    ]);
    /** When true, renders accordion layout with method selection */
    readonly showMethodRadio = input<boolean>(false);
    /** Module key for filtering payment methods per provider */
    readonly module = input<string>('');
    /** Pre-selected method ID for the current provider */
    readonly defaultMethodSelected = input<string>('');
    /** Emits the selected provider value whenever it changes */
    readonly valueChange = output<string | null>();
    /** Emits the selected method change when showMethodRadio is enabled */
    readonly methodChange = output<{ providerId: string; methodId: string }>();
    /** Currently selected provider value */
    protected readonly value = signal<string | null>(null);
    /** Selected method ID for the current provider */
    protected readonly selectedMethod = signal<string>('');
    /** Currently expanded provider ID for accordion mode */
    protected readonly defaultExpandeProvider = signal<string>('');
    /** Whether the control is disabled */
    protected disabled: boolean = false;

    private onChange: (value: string | null) => void = () => {};
    private onTouched: () => void = () => {};

    constructor() {
        // Auto-select default method when provider or defaultMethodSelected changes
        effect(() => {
            const defaultMethod = this.defaultMethodSelected();
            const providerId = this.value();
            if (!defaultMethod || !providerId) return;
            const provider = this.paymentProviderDetails[providerId];
            const match = provider?.features?.find(
                f => f.id?.toLowerCase() === defaultMethod.toLowerCase()
            );
            if (match && this.selectedMethod() !== match.id) {
                this.selectedMethod.set(match.id);
            }
        });

        // Sync expanded provider with selected provider
        effect(() => {
            const providerId = this.value();
            if (providerId) this.defaultExpandeProvider.set(providerId);
        });
    }

    /** Payment provider details lookup by ID */
    private readonly paymentProviderDetails: Record<string, IPaymentProvider> = {
        [PaymentProvider.RAZORPAY]: {
            id: PaymentProvider.RAZORPAY,
            name: 'Razorpay',
            logo: 'assets/images/icon/RAZORPAY.svg',
            description: 'Fast, secure and preferred payment gateway in India.',
            features: [
                { name: 'UPI', icon: 'assets/images/UPI.png', description: 'Pay securely using any UPI app', id: PaymentMethod.UPI },
                { name: 'Card', icon: 'assets/images/CARD.png', description: 'Visa, Mastercard, RuPay & more', id: PaymentMethod.CARD },
                { name: 'Net Banking', icon: 'assets/images/NET_BANKING.png', description: 'All major banks supported', id: PaymentMethod.NET_BANKING },
                { name: 'Wallets', icon: 'assets/images/WALLET.png', description: 'Paytm, Amazon Pay, Mobikwik & more', id: PaymentMethod.WALLET },
                { name: 'EMI', icon: 'assets/images/EMI_DISCOUNT.png', description: 'No-cost & standard EMI options', id: PaymentMethod.EMI }
            ],
            subscription: [0 , 1]
        },
        [PaymentProvider.PAYU]: {
            id: PaymentProvider.PAYU,
            name: 'PayU',
            logo: 'assets/images/icon/PAYU.png',
            description: 'Secure payments powered by PayU',
            features: [
                { name: 'UPI', icon: 'assets/images/UPI.png', description: 'Pay securely using any UPI app', id: PaymentMethod.UPI },
                { name: 'Card', icon: 'assets/images/CARD.png', description: 'Visa, Mastercard, RuPay & more', id: PaymentMethod.CARD },
                { name: 'Net Banking', icon: 'assets/images/NET_BANKING.png', description: 'All major banks supported', id: PaymentMethod.NET_BANKING },
                { name: 'Wallets', icon: 'assets/images/WALLET.png', description: 'Paytm, Amazon Pay, Mobikwik & more', id: PaymentMethod.WALLET },
                { name: 'EMI', icon: 'assets/images/EMI_DISCOUNT.png', description: 'No-cost & standard EMI options', id: PaymentMethod.EMI }
            ]
        },
        [PaymentProvider.STRIPE]: {
            id: PaymentProvider.STRIPE,
            name: 'Stripe',
            logo: 'assets/images/icon/STRIPE.png',
            description: 'International cards and global payment solutions',
            features: [
                { name: 'Card', icon: 'assets/images/CARD.png', description: 'Visa, Mastercard, Amex & more', id: PaymentMethod.CARD },
                { name: 'Net Banking', icon: 'assets/images/NET_BANKING.png', description: 'All major banks supported', id: PaymentMethod.NET_BANKING },
                { name: 'Wallets', icon: 'assets/images/WALLET.png', description: 'Apple Pay, Google Pay & more', id: PaymentMethod.WALLET }
            ]
        },
        [PaymentProvider.PAYPAL]: {
            id: PaymentProvider.PAYPAL,
            name: 'PayPal',
            logo: 'assets/images/icon/PAYPAL.svg',
            description: 'Pay with your PayPal balance, card or bank',
            features: [
                { name: 'Card', icon: 'assets/images/CARD.png', description: 'Visa, Mastercard, Amex & more', id: PaymentMethod.CARD },
                { name: 'Net Banking', icon: 'assets/images/NET_BANKING.png', description: 'All major banks supported', id: PaymentMethod.NET_BANKING },
                { name: 'Wallets', icon: 'assets/images/WALLET.png', description: 'PayPal balance & linked wallets', id: PaymentMethod.WALLET }
            ]
        },
        [PaymentProvider.GOCARDLESS]: {
            id: PaymentProvider.GOCARDLESS,
            name: 'GoCardless',
            logo: 'assets/images/icon/GOCARDLESS.svg',
            description: 'Direct debit payments from your bank account',
            features: [
                { name: 'Bank Transfer', icon: 'assets/images/NET_BANKING.png', description: 'Pay directly from your bank', id: PaymentMethod.BANK_TRANSFER },
                { name: 'Direct Debit', icon: 'assets/images/CARD.png', description: 'Recurring direct debit authorization', id: PaymentMethod.DIRECT_DEBIT }
            ]
        }
    };

    /** Get payment provider details by ID
     * @param providerId Provider ID
     * @returns Provider details object
     */
    public getPaymentProviderDetails(providerId: string): IPaymentProvider {
        return this.paymentProviderDetails[providerId];
    }

    /** Get payment methods filtered by module
     * @param provider Provider object
     * @returns Filtered payment methods array
     */
    public getProviderMethods(provider: IPaymentProvider): IPaymentProvider['features'] {
        const moduleKey = this.module();
        if (!moduleKey || !provider) return provider?.features ?? [];
        const allowedIndices = provider[moduleKey];
        if (!Array.isArray(allowedIndices)) return provider.features;
        return allowedIndices
            .map((i: number) => provider.features[i])
            .filter((m): m is IPaymentProvider['features'][number] => !!m);
    }

    /** Handle payment method selection
     * @param providerId Provider ID
     * @param methodId Selected method ID
     */
    protected selectMethod(providerId: string, methodId: string): void {
        this.selectedMethod.set(methodId);
        this.selectProvider(providerId);
        this.methodChange.emit({ providerId, methodId });
    }

    /** Get selected method ID for the given provider
     * @param providerId Provider ID
     * @returns Selected method ID or empty string
     */
    protected getSelectedMethod(providerId: string): string {
        return this.value() === providerId ? this.selectedMethod() : '';
    }

    /** Handle provider selection
     * @param providerId Selected provider ID
     */
    protected selectProvider(providerId: string): void {
        this.value.set(providerId);
        this.onChange(providerId);
        this.onTouched();
        this.valueChange.emit(providerId);
    }

    /** @inheritdoc
     * @param val Selected provider value
     */
    writeValue(val: string | null): void {
        this.value.set(val);
    }

    /** @inheritdoc
     * @param fn Change callback function
     */
    registerOnChange(fn: (value: string | null) => void): void {
        this.onChange = fn;
    }

    /** @inheritdoc
     * @param fn Touched callback function
     */
    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    /** @inheritdoc
     * @param isDisabled Disabled state
     */
    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }
}
