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
