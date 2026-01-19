import { TaxResponse } from '../api-models/Company';
import { INameUniqueName } from '../api-models/Inventory';

/**
 * ITaxDetail interface definition
 * Defines the structure and contract for ITaxDetail objects
 */
export interface ITaxDetail {
    taxValue: number;
    date: string;
}

/**
 * ITax interface definition
 * Defines the structure and contract for ITax objects
 */
export interface ITax extends INameUniqueName {
    account?: INameUniqueName;
    duration: string;
    taxDetail: ITaxDetail[];
    taxFileDate: number | string;
    taxNumber: string;
}
/**
 * ITaxControlData class
 * Implements ITaxControlData functionality
 */
export class ITaxControlData {
    public name?: string;
    public uniqueName: string;
    public amount?: number;
    public isChecked?: boolean;
    public isDisabled?: boolean;
    public type?: string;
    public calculationMethod?: string;
}
/**
 * ITaxUtilRequest interface definition
 * Defines the structure and contract for ITaxUtilRequest objects
 */
export interface ITaxUtilRequest {
    customTaxTypesForTaxFilter?: Array<string>;
    taxes?: Array<TaxResponse>;
    exceptTaxTypes?: Array<string>;
    taxRenderData?: Array<ITaxControlData>;
    date?: string;
    applicableTaxes?: Array<string>;
}

/**
 * ITaxAuthority interface definition
 * Defines the structure and contract for ITaxAuthority objects
 */
export interface ITaxAuthority {
    name?: string;
    uniqueName: string;
    description?: string;
}