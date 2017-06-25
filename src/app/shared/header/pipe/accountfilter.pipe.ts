import { Pipe, PipeTransform } from '@angular/core';
import { Birds } from '../models/birds';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import * as _ from 'lodash';
import { IGroupsWithAccounts } from '../../../models/interfaces/groupsWithAccounts.interface';
@Pipe({
  name: 'myAccountFilter',
  pure: false
})

export class AccountFilterPipe implements PipeTransform {
  public transform(group: any, filter: string, groupUniqueName: string): any {
    return _.some(group.parentGroups, (g: any) => {
      return g.uniqueName === groupUniqueName;
    });
  }
}
