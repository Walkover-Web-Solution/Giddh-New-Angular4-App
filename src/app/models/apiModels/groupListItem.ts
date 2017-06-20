import { IGroupListItem } from '../../interfaces/groupListItem.interface';

export class GroupListItem implements IGroupListItem {
  public category: string;
  public groups: IGroupListItem[];
  public name: string;
  public synonyms?: string;
  public uniqueName: string;

  constructor(category: string, groups: IGroupListItem[], name: string, synonyms: string,
              uniqueName: string) {
    this.category = category;
    this.groups = groups;
    this.name = name;
    this.synonyms = synonyms;
    this.uniqueName = uniqueName;
  }
}
