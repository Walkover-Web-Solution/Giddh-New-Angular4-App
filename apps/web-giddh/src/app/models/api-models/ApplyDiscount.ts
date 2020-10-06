export class ApplyDiscountRequest {
    public discountUniqueName: string;
    public accountUniqueNames: string[];
}
export class AssignDiscountRequestForAccount {
    public discountUniqueNames: string[];
    public accountUniqueName: string;
}

export class ApplyDiscountRequestV2 {
    public uniqueName: string;
    public discounts: string[];
    public isAccount: boolean;
}
