

export interface IRegistration {
    iciciCorporateDetails: {
        corpId: string,
        userId: string,
        accountNo: string,
        URN: string
    },
    account: {
        name: string,
        uniqueName: string
    }
}

/** Integrated list of bank object */
export class IntegratedBankList {
    urn: string;
    bankName: string;
    accountNo: string;
}

/** Get bank request object */
export class GetOTPRequest {
    bankName: string;
    urn: string;
    totalAmount: string;
    bankPaymentTransactions: BankTransactionForOTP[];
}

/** Transaction object for OTP */
export class BankTransactionForOTP {
    remarks: string;
    amount: string;
    vendorUniqueName: string;
}

/** Bulk payment response object */
export class BulkPaymentResponse {
    message: string;
    otp: any;
    requestId: string;
    success: boolean;
}

/** Bulk payment confirmation request object */
export class BulkPaymentConfirmRequest {
    otp: any;
    requestId: string;
}
