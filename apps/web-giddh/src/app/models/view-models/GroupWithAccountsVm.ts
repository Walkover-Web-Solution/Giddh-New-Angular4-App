import { GroupsWithAccountsResponse } from '../api-models/GroupsWithAccounts';

export class GroupsWithAccountsVm extends GroupsWithAccountsResponse {
  public isActive: boolean = false;
  public isOpen: boolean = false;
}
