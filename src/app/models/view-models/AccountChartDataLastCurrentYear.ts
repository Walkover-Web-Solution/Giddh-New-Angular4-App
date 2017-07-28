import { INameUniqueName } from '../interfaces/nameUniqueName.interface';
export class AccountChartDataLastCurrentYear implements INameUniqueName {
  public uniqueName: string;
  public name: string;
  public isActive?: boolean;

  public lastYear?: number;
  public activeYear?: number;

}
