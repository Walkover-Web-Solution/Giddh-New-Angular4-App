import { INameUniqueName } from './nameUniqueName.interface';

export interface ITaxDetail {
  taxValue: number;
  date: string;
}

export interface ITax extends INameUniqueName {
  account: INameUniqueName;
  duration: string;
  taxDetail: ITaxDetail[];
  taxFileDate: number;
  taxNumber: string;
}
