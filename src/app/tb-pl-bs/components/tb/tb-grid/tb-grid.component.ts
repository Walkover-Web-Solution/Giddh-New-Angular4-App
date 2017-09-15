import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { AccountDetails } from '../../../../models/api-models/tb-pl-bs';
import { Observable } from 'rxjs/Observable';
import { ChildGroup } from '../../../../models/api-models/Search';
import * as _ from 'lodash';

@Component({
  selector: 'tb-grid',  // <home></home>
  templateUrl: './tb-grid.component.html'
})
export class TbGridComponent implements OnInit, AfterViewInit {

  public noData: boolean;
  public showClearSearch: boolean;
  @Input() public padLeft: number = 30;
  @Input() public search: string = '';

  @Input() public showLoader: boolean;
  @Input() public data$: AccountDetails;

  @Input()
  public set expandAll(value: boolean) {
    // debugger;
    if (this.data$) {
      this.toggleVisibility(this.data$.groupDetails, value);
      if (this.data$) {
        _.each(this.data$.groupDetails, (grp: any) => {
          grp.isVisible = true;
          _.each(grp.accounts, (acc: any) => {
            acc.isVisible = true;
          });
          _.each(grp.childGroups, (cgrp: any) => {
            cgrp.isVisible = value;
          });
        });
      }
      this.data$ = _.cloneDeep(this.data$);
    }
  }

  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {
    //
  }

  public ngOnInit() {
    //
  }

  public ngAfterViewInit() {
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
