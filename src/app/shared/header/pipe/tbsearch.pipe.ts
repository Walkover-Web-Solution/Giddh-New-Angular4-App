import { Pipe, PipeTransform, NgZone } from '@angular/core';

import * as _ from '../../../lodash-optimized';
import { ChildGroup, Account } from '../../../models/api-models/Search';

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
  constructor(private zone: NgZone
  ) {
    //
  }
  public transform(input: any, search: string): any {
    if (!_.isUndefined(search)) {
      this.srch = search.toLowerCase();
    }
    let initial = input;

    if (!_.isUndefined(this.srch) && this.srch.length > 2) {
      this.zone.run(() => {
        this.performSearch(input);
      });
    } else {
      if (!_.isUndefined(this.srch)) {
        if (this.srch.length < 3) {
          this.zone.run(() => {
            this.resetSearch(input);
          });
        }
      }
    }
    return input;
  }

  public performSearch(input: ChildGroup[]) {
    if (input) {
      for (let grp of input) {
        grp = this.search(grp, this.srch);
        if (grp.accounts.findIndex(p => p.isIncludedInSearch) > -1 || grp.childGroups.findIndex(p => p.isIncludedInSearch) > -1) {
          grp.isVisible = true;
          grp.isIncludedInSearch = true;
        } else {
          grp.isVisible = false;
          grp.isIncludedInSearch = false;
        }
      }
    }
  }
  public search(input: ChildGroup, s: string) {
    if (input) {
      let hasAnyVisible = false;
      for (let grp of input.childGroups) {
        grp = this.search(grp, s);
        if (grp.accounts.findIndex(p => p.isIncludedInSearch) > -1 || grp.childGroups.findIndex(p => p.isIncludedInSearch) > -1 ||
          this.checkIndex(grp.groupName.toLowerCase(), s.toLowerCase()) && this.checkIndex(grp.uniqueName.toLowerCase(), s.toLowerCase())
        ) {
          grp.isVisible = true;
          grp.isIncludedInSearch = true;
          hasAnyVisible = true;
        } else {
          grp.isVisible = false;
          grp.isIncludedInSearch = false;
        }
      }
      for (const acc of input.accounts) {
        if (this.checkIndex(acc.name.toLowerCase(), s.toLowerCase()) && this.checkIndex(acc.uniqueName.toLowerCase(), s.toLowerCase())) {
          acc.isIncludedInSearch = true;
          acc.isVisible = true;
          hasAnyVisible = true;
        } else {
          acc.isIncludedInSearch = false;
          acc.isVisible = false;
        }
      }
      if (hasAnyVisible) {
        input.isIncludedInSearch = false;
        input.isVisible = false;
      } else {
        input.isIncludedInSearch = true;
        input.isVisible = true;
      }
    }
    return input;
  }
  public resetSearch(input: ChildGroup[]) {
    if (input) {
      for (let grp of input) {
        grp = this.resetGroup(grp);
        grp.isVisible = true;
        grp.isIncludedInSearch = true;
      }
    }
  }
  public resetGroup(input: ChildGroup) {
    if (input) {
      for (let grp of input.childGroups) {
        grp = this.resetGroup(grp);
        grp.isVisible = false;
        grp.isIncludedInSearch = true;
      }
      for (const acc of input.accounts) {
        acc.isIncludedInSearch = true;
        acc.isVisible = false;
      }
      input.isIncludedInSearch = true;
      input.isVisible = false;
    }
    return input;
  }
  public checkIndex(src: string, str: string) {
    if (src.replace(' ', '').toLowerCase().indexOf(str.replace(' ', '').toLowerCase()) !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
