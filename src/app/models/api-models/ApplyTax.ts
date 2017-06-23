import { IApplyTax } from '../interfaces/applyTax.interface';
/**
 * Model for apply tax api request
 * API:: (Apply tax) /company/{{companyname}}/tax/assign
 * Takes an array of taxes applicable on accounts or groups
 * This request will take array of ApplyTaxRequest as payload
 */
export class ApplyTaxRequest implements IApplyTax {
  public uniqueName: string;
  public taxes: string[];
  public isAccount: boolean;
}

/**
 * Model for apply tax api response
 * API:: (Apply tax) /company/{{companyname}}/tax/assign
 * Response is as success message from api in body
 */
export class ApplyTaxResponse {
}
