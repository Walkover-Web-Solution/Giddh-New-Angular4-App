

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

export class IntegratedBankList {
    urn: string;
    bankName: string;
    accountNo: string;
}

export class GetOTPRequest{
   bankType: string;
    urn: string
    totalAmount: string;
    bankPaymentTransactions: BankTransactionForOTP[];
}


export class BankTransactionForOTP {
   remarks: string;
    amount: string
    vendorUniqueName: string;
}
