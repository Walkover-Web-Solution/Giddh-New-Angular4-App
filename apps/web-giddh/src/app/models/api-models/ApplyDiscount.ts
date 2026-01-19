/**
 * AssignDiscountRequestForAccount class
 * Implements AssignDiscountRequestForAccount functionality
 */
export class AssignDiscountRequestForAccount {
    public discountUniqueNames: string[];
    public accountUniqueName: string;
}

/**
 * ApplyDiscountRequestV2 class
 * Implements ApplyDiscountRequestV2 functionality
 */
export class ApplyDiscountRequestV2 {
    public uniqueName: string;
    public discounts: string[];
    public isAccount: boolean;
}
