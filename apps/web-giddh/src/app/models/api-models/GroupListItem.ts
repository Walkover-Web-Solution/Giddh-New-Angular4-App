import { IGroupListItem } from '../interfaces/groupListItem.interface';

/**
 * Model for company groups api response
 * API:: (company-groups) /company/companyUniqueName/groups
 */

export class GroupListItemResponse implements IGroupListItem {
  public category: string;
  public groups: IGroupListItem[];
  public name: string;
  public synonyms?: string;
  public uniqueName: string;
}
