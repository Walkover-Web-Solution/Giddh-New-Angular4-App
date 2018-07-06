import { AccountResponse } from './Account';

export interface IDiscountList {
  name: string;
  uniqueName: string;
  discountType: 'FIX_AMOUNT' | 'PERCENTAGE';
  discountValue: number;
  linkAccount?: AccountResponse;
  isActive?: boolean;
}

export class CreateDiscountRequest {
  public name: string;
  public type: 'FIX_AMOUNT' | 'PERCENTAGE';
  public discountValue: number;
  public accountUniqueName: string;
  public discountUniqueName?: string;
}
