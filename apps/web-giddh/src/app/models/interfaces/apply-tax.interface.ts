/**
 * IApplyTax interface definition
 * Defines the structure and contract for IApplyTax objects
 */
export interface IApplyTax {
    uniqueName: string;
    taxes: string[];
    isAccount: boolean;
}
