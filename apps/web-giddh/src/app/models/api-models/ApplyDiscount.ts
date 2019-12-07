export class ApplyDiscountRequest {
    public discountUniqueName: string;
    public accountUniqueNames: string[];
}

export class AssignDiscountRequestForAccount {
    public discountUniqueNames: string[];
    public accountUniqueName: string;
}
