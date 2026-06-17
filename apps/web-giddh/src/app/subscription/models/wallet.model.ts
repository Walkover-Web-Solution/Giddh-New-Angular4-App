/**
 * Interface for payment provider configuration
 */
export interface IPaymentProvider {
    id: string;
    name: string;
    logo: string;
    description?: string;
    features: Array<{ name: string; icon: string; description?: string; id?: string }>;
    /** Per-module list of supported feature indices, e.g. { subscription: [0, 1] } */
    [moduleKey: string]: any;
}

/**
 * Interface for wallet data
 */
export interface IWalletData {
    balance: number;
    currency: { code: string; symbol: string };
    createdOn: string;
    lastAddedOn: string;
}

/**
 * Interface for capture payment payload
 */
export interface ICapturePayload {
    subscriptionId: string;
    duration: string;
    paymentProvider: string;
    razorpayOrderId?: string;
    paymentId?: string;
    payuTransactionId?: string;
    paymentIntentId?: string;
    paypalOrderId?: string;
}
