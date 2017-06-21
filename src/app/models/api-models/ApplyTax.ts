import { IApplyTax } from '../interfaces/applyTax.interface';
/**
 * Model for apply tax api request
 * API:: (Apply tax) /company/{{companyname}}/tax/assign
 * Takes an array of taxes applicable on accounts or groups
 */
export class ApplyTaxRequest {
  public taxable: IApplyTax[];

  constructor(taxable: IApplyTax[]) {
    this.taxable = taxable;
  }
}

/**
 * Model for apply tax api response
 * API:: (Apply tax) /company/{{companyname}}/tax/assign
 * Response is as success message from api
 */
export class ApplyTaxResponse {
}
