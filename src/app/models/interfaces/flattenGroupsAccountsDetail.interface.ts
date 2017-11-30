/*
* not sure what we are getting in applicableTaxes as discussed with team, they said will be an
* empty array, for precaution keepin it as any array this will ont break things
*/
export interface IFlattenGroupsAccountsDetailItem {
  applicableTaxes: any[];
  groupName: string;
  groupSynonyms?: string;
  groupUniqueName: string;
  isOpen: boolean;
  name?: string;
  uniqueName?: string;
  amount?: number;
}

export interface IFlattenGroupsAccountsDetail extends IFlattenGroupsAccountsDetailItem {
  accountDetails: IFlattenGroupsAccountsDetailItem[];
}

export interface IFlattenGroupsAccountItem {
  Name: string;
  UniqueName: string;
  isGroup: boolean;
  isOpen: boolean;
  groupUniqueName?: string;
  accounts?: IFlattenGroupsAccountItem[];

}
