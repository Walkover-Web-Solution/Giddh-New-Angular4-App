/**
 * Interface for payment provider configuration
 */
export interface IPaymentProvider {
    id: string;
    name: string;
    logo: string;
    features: Array<{ name: string; icon: string }>;
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
}
