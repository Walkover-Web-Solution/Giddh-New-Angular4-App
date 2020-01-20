import { INameUniqueName } from '../api-models/Inventory';

export class AccountChartDataLastCurrentYear implements INameUniqueName {
    public uniqueName: string;
    public name: string;
    public isActive?: boolean;

    public lastYear?: number;
    public activeYear?: number;

}
