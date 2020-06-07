

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

export class IntegartedBankList {
    urn: string;
    bankName: string;
    accountNo: string;
}
