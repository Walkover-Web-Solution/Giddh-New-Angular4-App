import { INameUniqueName } from "../api-models/Inventory";

export interface IRegistration extends INameUniqueName {
  corporateID: string;
  userID: string;
  accountNumber: number;
  accounts: string;
}
