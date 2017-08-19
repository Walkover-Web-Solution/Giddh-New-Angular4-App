import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ProfitLossData } from '../../../../models/api-models/tb-pl-bs';
import { ChildGroup } from '../../../../models/api-models/Search';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pl-grid',  // <home></home>
  templateUrl: './pl-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlGridComponent implements OnInit, AfterViewInit {
  public noData: boolean;
  public showClearSearch: boolean;

  @Input() public showLoader: boolean;
  @Input() public plData: Observable<ProfitLossData>;

  @Input()
  public set expandAll(value: boolean) {
    this.plData = this.plData.map(p => {
      if (p && p.expArr) {
        this.toggleVisibility(p.expArr, !value);
        this.toggleVisibility(p.incArr, !value);
        return {
          ...p,
          expArr: [...this.toggleVisibility(p.expArr, value)],
          incArr: [...this.toggleVisibility(p.incArr, value)]
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
