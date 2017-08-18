import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AccountDetails } from '../../../../models/api-models/tb-pl-bs';
import { Observable } from 'rxjs/Observable';
import { ChildGroup } from '../../../../models/api-models/Search';
import * as _ from 'lodash';

@Component({
  selector: 'tb-grid',  // <home></home>
  templateUrl: './tb-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbGridComponent implements OnInit, AfterViewInit {

  public noData: boolean;
  public showClearSearch: boolean;

  @Input() public showLoader: boolean;
  @Input() public data$: Observable<AccountDetails>;

  @Input()
  public set expandAll(value: boolean) {
    this.data$ = this.data$.map(p => {
      if (p) {
        return {
          forwardedBalance: p.forwardedBalance,
          creditTotal: p.creditTotal,
          debitTotal: p.debitTotal,
          closingBalance: p.closingBalance,
          openingBalance: p.openingBalance,
          groupDetails: this.toggleVisibility(p.groupDetails, value)
        };
      }
    });

  }

  constructor() {
//
  }

  public ngOnInit() {
    //
  }

  public ngAfterViewInit() {
    //
  }

  private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
    return _.each(data, (grp) => {
      grp.isVisible = isVisible;
      _.each(grp.accounts, (acc) => {
        return acc.isVisible = isVisible;
      });
      return _.each(grp.childGroups, (chld) => {
        if (chld.accounts.length > 0) {
          _.each(chld.accounts, (acc) => {
            return acc.isVisible = isVisible;
          });
        }
        chld.isVisible = isVisible;
        if (chld.childGroups.length > 0) {
          return this.toggleVisibility(chld.childGroups, isVisible);
        }
      });
    });
  }
}
