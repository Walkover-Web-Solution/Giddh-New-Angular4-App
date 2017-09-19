import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { ProfitLossData } from '../../../../models/api-models/tb-pl-bs';
import { ChildGroup } from '../../../../models/api-models/Search';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pl-grid',  // <home></home>
  templateUrl: './pl-grid.component.html'
})
export class PlGridComponent {
  public noData: boolean;
  public showClearSearch: boolean;
  @Input() public search: string = '';
  @Input() public plData: ProfitLossData;

  @Input()
  public set expandAll(value: boolean) {
    if (this.plData) {
      this.toggleVisibility(this.plData.expArr, value);
      this.toggleVisibility(this.plData.incArr, value);
    }
    this.plData = _.cloneDeep(this.plData);
    this.cd.detectChanges();
  }

  constructor(private cd: ChangeDetectorRef) {
    //
  }
  private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
    _.each(data, (grp) => {
      grp.isVisible = isVisible;
      _.each(grp.accounts, (acc) => {
        acc.isVisible = isVisible;
      });
      this.toggleVisibility(grp.childGroups, isVisible);
    });
  }
}
