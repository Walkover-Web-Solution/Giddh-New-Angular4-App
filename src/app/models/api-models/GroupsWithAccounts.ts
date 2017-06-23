import { IAccountsInfo } from '../interfaces/accountInfo.interface';
import { IGroupsWithAccounts } from '../interfaces/groupsWithAccounts.interface';
import { GroupsWithAccountsVm } from '../view-models/GroupWithAccountsVm';

/**
 * Model for getting group list api response
 * API:: (group-list) company/companyUniqueName/groups-with-accounts
 */

export class GroupsWithAccountsResponse implements IGroupsWithAccounts {
  public synonyms: string;
  public accounts: IAccountsInfo[];
  public name: string;
  public uniqueName: string;
  public category: string;
  public isActive?: boolean;
  public isOpen?: boolean;
  public groups: IGroupsWithAccounts[];

}
