import { AccountResponse } from './Account';

/**
 * IDiscountList interface definition
 * Defines the structure and contract for IDiscountList objects
 */
export interface IDiscountList {
    name: string;
    uniqueName: string;
    discountType: 'FIX_AMOUNT' | 'PERCENTAGE';
    discountValue: number;
    linkAccount?: AccountResponse;
    isActive?: boolean;
    amount?: number;
    particular?: string;
}

/**
 * LedgerDiscountClass class
 * Implements LedgerDiscountClass functionality
 */
export class LedgerDiscountClass {
    public discountUniqueName?: string;
    public discountType: 'FIX_AMOUNT' | 'PERCENTAGE';
    public discountValue?: number;
    public name: string;
    public isActive?: boolean;
    public particular: string;
    public amount: number;
    public uniqueName?: string;
    public calculationMethod?: "FIX_AMOUNT" | "PERCENTAGE";
}

/**
 * CreateDiscountRequest class
 * Implements CreateDiscountRequest functionality
 */
export class CreateDiscountRequest {
    public name: string;
    public type: 'FIX_AMOUNT' | 'PERCENTAGE';
    public discountValue: number;
    public accountUniqueName: string;
    public discountUniqueName?: string;
}

/**
 * IDiscountUtilRequest interface definition
 * Defines the structure and contract for IDiscountUtilRequest objects
 */
export interface IDiscountUtilRequest {
    discountsList: Array<any>;
    discountAccountsDetails: Array<LedgerDiscountClass>;
}
