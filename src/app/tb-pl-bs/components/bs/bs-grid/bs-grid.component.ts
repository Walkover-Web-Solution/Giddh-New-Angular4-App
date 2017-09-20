import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { BalanceSheetData } from '../../../../models/api-models/tb-pl-bs';
import { ChildGroup } from '../../../../models/api-models/Search';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'bs-grid',  // <home></home>
  templateUrl: './bs-grid.component.html'
})
export class BsGridComponent implements OnInit, AfterViewInit, OnChanges {
  public noData: boolean;
  public showClearSearch: boolean;
  @Input() public search: string = '';
  @Input() public bsData: BalanceSheetData;
  @Input() public padding: string;

  @Input()
  public set expandAll(value: boolean) {
    if (this.bsData) {
      if (this.bsData.assets) { this.toggleVisibility(this.bsData.assets, value); }
      if (this.bsData.liabilities) { this.toggleVisibility(this.bsData.liabilities, value); }
      this.bsData = _.cloneDeep(this.bsData);
    }
  }

  constructor(private cd: ChangeDetectorRef) {
    //
  }
  public ngOnChanges(changes: SimpleChanges) {
    if (changes['expandAll']) {
      // debugger;
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
      return this.toggleVisibility(grp.childGroups, isVisible);
    });
  }
}
