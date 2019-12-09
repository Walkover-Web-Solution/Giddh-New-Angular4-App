import { AccountResponse } from './Account';

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

export class LedgerDiscountClass {
    public discountUniqueName?: string;
    public discountType: 'FIX_AMOUNT' | 'PERCENTAGE';
    public discountValue?: number;
    public name: string;
    public isActive?: boolean;
    public particular: string;
    public amount: number;
    public uniqueName?: string;
}

export class CreateDiscountRequest {
    public name: string;
    public type: 'FIX_AMOUNT' | 'PERCENTAGE';
    public discountValue: number;
    public accountUniqueName: string;
    public discountUniqueName?: string;
}
