import { Pipe, PipeTransform } from '@angular/core';
import { GroupsWithAccountsResponse } from '../../../models/api-models/GroupsWithAccounts';
import * as _ from 'lodash';
import { IGroupsWithAccounts } from '../../../models/interfaces/groupsWithAccounts.interface';
@Pipe({
  name: 'myAccountFilter',
  pure: false
})

export class AccountFilterPipe implements PipeTransform {
  /**
   *
   */
  public srch: string;
  constructor() {
    //
  }
  public transform(input: any, search: string): any {
    input = _.cloneDeep(input);
    if (!_.isUndefined(search)) {
      this.srch = search.toLowerCase();
    }
    let initial = input;

    if (!_.isUndefined(this.srch)) {
      this.performSearch(input);
      if (this.srch.length < 2) {
        this.resetSearch(input);
      }
    }
    return input;
  }

  public performSearch(input) {
    return _.each(input, (grp) => {
      // console.log(input);
      // grp = Object.assign( grp, { isVisible: false });
      let grpName;
      let grpUnq;
      grpName = grp.name.toLowerCase();
      grpUnq = grp.uniqueName.toLowerCase();
      if (!this.checkIndex(grpName, this.srch) && !this.checkIndex(grpUnq, this.srch)) {
        grp.isVisible = false;
        if (grp.groups.length > 0) {
          return _.each(grp.groups, (sub) => {
            // sub = Object.assign( sub, { isVisible: false });
            let subName;
            let subUnq;
            subName = sub.name.toLowerCase();
            subUnq = sub.uniqueName.toLowerCase();
            if (!this.checkIndex(subName, this.srch) && !this.checkIndex(subUnq, this.srch)) {
              sub.isVisible = false;
              if (sub.groups.length) {
                return _.each(sub.groups, (child) => {
                  // child = Object.assign( child, { isVisible: false });
                  let childName;
                  let childUnq;
                  childName = child.name.toLowerCase();
                  childUnq = child.uniqueName.toLowerCase();
                  if (!this.checkIndex(childName, this.srch) && !this.checkIndex(childUnq, this.srch)) {
                    child.isVisible = false;
                    if (child.groups.length > 0) {
                      return _.each(child.groups, (subChild) => {
                        // subChild = Object.assign( subChild, { isVisible: false });
                        let subChildName;
                        let subChildUnq;
                        subChildName = subChild.name.toLowerCase();
                        subChildUnq = subChild.uniqueName.toLowerCase();
                        if (!this.checkIndex(subChildName, this.srch) && !this.checkIndex(subChildUnq, this.srch)) {
                          subChild.isVisible = false;
                          if (subChild.groups.length > 0) {
                            return _.each(child.groups, (subChild2) => {
                              let subChild2Name;
                              let subChild2Unq;
                              subChild2Name = subChild2.name.toLowerCase();
                              subChild2Unq = subChild2.uniqueName.toLowerCase();
                              if (!this.checkIndex(subChild2Name, this.srch) && !this.checkIndex(subChild2Unq, this.srch)) {
                                subChild2.isVisible = false;
                                if (subChild2.groups.length > 0) {
                                  return this.performSearch(subChild.groups);
                                }
                              } else {
                                grp.isVisible = true;
                                child.isVisible = true;
                                sub.isVisible = true;
                                subChild.isVisible = true;
                                return subChild2.isVisible = true;
                              }
                            });
                          }
                        } else {
                          grp.isVisible = true;
                          child.isVisible = true;
                          sub.isVisible = true;
                          return subChild.isVisible = true;
                        }
                      });
                    }
                  } else if (this.checkIndex(childName, this.srch) || this.checkIndex(childUnq, this.srch)) {
                    grp.isVisible = true;
                    child.isVisible = true;
                    return sub.isVisible = true;
                  }
                });
              }
            } else if (this.checkIndex(subName, this.srch) || this.checkIndex(subUnq, this.srch)) {
              grp.isVisible = true;
              return sub.isVisible = true;
            }
          });
        }
      } else if (this.checkIndex(grpName, this.srch) || this.checkIndex(grpUnq, this.srch)) {
        return grp.isVisible = true;
      }
    });
  }
  public resetSearch(input) {
    return _.each(input, (grp) => {
      // grp = Object.assign(grp, { isVisible: false });
      grp.isVisible = true;
      if (grp.groups.length > 0) {
        return _.each(grp.groups, (sub) => {
          // sub = Object.assign(sub, { isVisible: false });
          sub.isVisible = true;
          if (sub.groups.length > 0) {
            return this.resetSearch(sub.groups);
          }
        });
      }
    });
  }
  public checkIndex(src, str) {
    if (src.indexOf(str) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
