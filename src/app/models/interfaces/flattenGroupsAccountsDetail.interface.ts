/*
* not sure what we are getting in applicableTaxes as discussed with team, they said will be an
* empty array, for precaution keepin it as any array this will ont break things
*/
export interface IFlattenGroupsAccountsDetailItem {
  applicableTaxes: any[];
  groupName: string;
  groupSynonyms?: string;
  groupUniqueName: string;
}

export interface IFlattenGroupsAccountsDetail extends IFlattenGroupsAccountsDetailItem {
  accountDetails: IFlattenGroupsAccountsDetailItem[];
}
