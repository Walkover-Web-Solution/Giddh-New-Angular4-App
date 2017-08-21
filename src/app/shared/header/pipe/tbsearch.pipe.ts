import { Pipe, PipeTransform } from '@angular/core';

import * as _ from 'lodash';

@Pipe({
  // tslint:disable-next-line:pipe-naming
  name: 'tbsearch',
  pure: true
})

export class TbsearchPipe implements PipeTransform {
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
      let grpName;
      let grpUnq;
      grpName = grp.groupName.toLowerCase();
      grpUnq = grp.uniqueName.toLowerCase();
      if (!this.checkIndex(grpName, this.srch) && !this.checkIndex(grpUnq, this.srch)) {
        grp.isVisible = false;
        if (grp.childGroups.length > 0) {
          return _.each(grp.childGroups, (sub) => {
            let subName;
            let subUnq;
            subName = sub.groupName.toLowerCase();
            subUnq = sub.uniqueName.toLowerCase();
            if (!this.checkIndex(subName, this.srch) && !this.checkIndex(subUnq, this.srch)) {
              sub.isVisible = false;
              if (sub.childGroups.length) {
                return _.each(sub.childGroups, (child) => {
                  let childName;
                  let childUnq;
                  childName = child.groupName.toLowerCase();
                  childUnq = child.uniqueName.toLowerCase();
                  if (!this.checkIndex(childName, this.srch) && !this.checkIndex(childUnq, this.srch)) {
                    child.isVisible = false;
                    if (child.childGroups.length > 0) {
                      return _.each(child.childGroups, (subChild) => {
                        let subChildName;
                        let subChildUnq;
                        subChildName = subChild.groupName.toLowerCase();
                        subChildUnq = subChild.uniqueName.toLowerCase();
                        if (!this.checkIndex(subChildName, this.srch) && !this.checkIndex(subChildUnq, this.srch)) {
                          subChild.isVisible = false;
                          if (subChild.childGroups.length > 0) {
                            return _.each(child.childGroups, (subChild2) => {
                              let subChild2Name;
                              let subChild2Unq;
                              subChild2Name = subChild2.groupName.toLowerCase();
                              subChild2Unq = subChild2.uniqueName.toLowerCase();
                              if (!this.checkIndex(subChild2Name, this.srch) && !this.checkIndex(subChild2Unq, this.srch)) {
                                subChild2.isVisible = false;
                                if (subChild2.childGroups.length > 0) {
                                  return this.performSearch(subChild.childGroups);
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
      if (grp.childGroups.length > 0) {
        return _.each(grp.childGroups, (sub) => {
          // sub = Object.assign(sub, { isVisible: false });
          sub.isVisible = true;
          if (sub.childGroups.length > 0) {
            return this.resetSearch(sub.childGroups);
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
