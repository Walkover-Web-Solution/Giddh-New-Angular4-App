import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ProfitLossData } from '../../../../models/api-models/tb-pl-bs';
import { ChildGroup } from '../../../../models/api-models/Search';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pl-grid',  // <home></home>
  templateUrl: './pl-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlGridComponent implements OnInit, AfterViewInit, OnChanges {
  public noData: boolean;
  public showClearSearch: boolean;

  @Input() public plData: ProfitLossData;

  @Input()
  public set expandAll(value: boolean) {
    if (this.plData) {
      if (this.plData.expArr) { this.toggleVisibility(this.plData.expArr, value); }
      if (this.plData.incArr) { this.toggleVisibility(this.plData.incArr, value); }
      // console.log(value);
      this.cd.markForCheck();
      console.log(this.plData);
    }
  }

  constructor(private cd: ChangeDetectorRef) {
    //
  }
  public ngOnChanges(changes: SimpleChanges) {
    if (changes['expandAll']) {
      debugger;
    }
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
