/**
 * IRegistration interface definition
 * Defines the structure and contract for IRegistration objects
 */
export interface IRegistration {
    iciciCorporateDetails: {
        corpId: string,
        userId: string,
        accountNo: string,
        bankUserId: string
    },
    account: {
        name: string,
        uniqueName: string
    }
}

/** Integrated list of bank object */
/**
 * IntegratedBankList class
 * Implements IntegratedBankList functionality
 */
export class IntegratedBankList {
    uniqueName: string;
    bankName: string;
    accountNo: string;
    effectiveBal: string;
    errorMessage?: string;
}

/** Get bank request object */
/**
 * GetOTPRequest class
 * Implements GetOTPRequest functionality
 */
export class GetOTPRequest {
    bankName: string;
    urn: string;
    uniqueName: string;
    totalAmount: string;
    bankPaymentTransactions: BankTransactionForOTP[];
}

/** Transaction object for OTP */
/**
 * BankTransactionForOTP class
 * Implements BankTransactionForOTP functionality
 */
export class BankTransactionForOTP {
    remarks: string;
    amount: string;
    vendorUniqueName: string;
}

/** Bulk payment response object */
/**
 * BulkPaymentResponse class
 * Implements BulkPaymentResponse functionality
 */
export class BulkPaymentResponse {
    message: string;
    otp: any;
    requestId: string;
    success: boolean;
    Message?: string;
}

/** Bulk payment confirmation request object */
/**
 * BulkPaymentConfirmRequest class
 * Implements BulkPaymentConfirmRequest functionality
 */
export class BulkPaymentConfirmRequest {
    otp: any;
    requestId: string;
}
