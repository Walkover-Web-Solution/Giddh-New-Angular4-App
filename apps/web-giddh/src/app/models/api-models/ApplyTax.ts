import { IApplyTax } from '../interfaces/apply-tax.interface';

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
