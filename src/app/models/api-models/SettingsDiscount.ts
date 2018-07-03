import { AccountResponse } from './Account';

export interface IDiscountList {
  name: string;
  uniqueName: string;
  discountType: 'FIX_AMOUNT' | 'PERCENTAGE';
  discountValue: number;
  linkAccount: AccountResponse[];
}

export class CreateDiscountRequest {
  public name: string;
  public type: 'FIX_AMOUNT' | 'PERCENTAGE';
  public discountValue: string;
  public accountUniqueName: string;
}
