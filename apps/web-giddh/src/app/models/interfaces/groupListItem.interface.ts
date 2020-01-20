import { IGroup } from './group.interface';

export interface IGroupListItem extends IGroup {
    category: string;
    groups: IGroupListItem[];
}
