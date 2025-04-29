import { TaxResponse } from '../api-models/Company';
import { INameUniqueName } from '../api-models/Inventory';

export interface ITaxDetail {
    taxValue: number;
    date: string;
}

export interface ITax extends INameUniqueName {
    account?: INameUniqueName;
    duration: string;
    taxDetail: ITaxDetail[];
    taxFileDate: number | string;
    taxNumber: string;
}
export class ITaxControlData {
    public name?: string;
    public uniqueName: string;
    public amount?: number;
    public isChecked?: boolean;
    public isDisabled?: boolean;
    public type?: string;
    public calculationMethod?: string;
}
export interface ITaxUtilRequest {
    customTaxTypesForTaxFilter?: Array<string>;
    taxes?: Array<TaxResponse>;
    exceptTaxTypes?: Array<string>;
    taxRenderData?: Array<ITaxControlData>;
    date?: string;
    applicableTaxes?: Array<string>;
}

export interface ITaxAuthority {
    name?: string;
    uniqueName: string;
    description?: string;
}