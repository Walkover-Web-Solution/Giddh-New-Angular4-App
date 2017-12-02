import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, NgZone } from '@angular/core';
import { ProfitLossData } from '../../../../models/api-models/tb-pl-bs';
import { ChildGroup, Account } from '../../../../models/api-models/Search';
import * as _ from '../../../../lodash-optimized';
import * as moment from 'moment/moment';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'pl-grid',  // <home></home>
  templateUrl: './pl-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlGridComponent implements OnInit, AfterViewInit, OnChanges {
  public noData: boolean;
  public showClearSearch: boolean;
  @Input() public search: string = '';
  @Input() public plData: ProfitLossData;
  @Input() public padding: string;
  @Input() public expandAll: boolean;
  public moment = moment;
  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {
    //
  }
  public ngOnInit() {
    //
  }
  public ngOnChanges(changes: SimpleChanges) {
    if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
      //
      if (this.plData) {
        // this.cd.detach();
        this.zone.run(() => {
          if (this.plData) {
            this.toggleVisibility(this.plData.expArr, changes.expandAll.currentValue);
            this.toggleVisibility(this.plData.incArr, changes.expandAll.currentValue);
            if (this.plData.incArr) {
              _.each(this.plData.incArr, (grp: any) => {
                if (grp.isIncludedInSearch) {
                  grp.isVisible = true;
                  _.each(grp.accounts, (acc: any) => {
                    if (acc.isIncludedInSearch) {
                      acc.isVisible = true;
                    }
                  });
                }
              });
            }
            if (this.plData.expArr) {
              _.each(this.plData.expArr, (grp: any) => {
                if (grp.isIncludedInSearch) {
                  grp.isVisible = true;
                  _.each(grp.accounts, (acc: any) => {
                    if (acc.isIncludedInSearch) {
                      acc.isVisible = true;
                    }
                  });
                }
              });
            }

          }
          this.cd.detectChanges();

        });
      }
    }
  }
  public ngAfterViewInit() {
    //
  }

  // private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
  //   _.each(data, (grp) => {
  //     grp.isVisible = isVisible;
  //     _.each(grp.accounts, (acc) => {
  //       acc.isVisible = isVisible;
  //     });
  //     this.toggleVisibility(grp.childGroups, isVisible);
  //   });
  // }
  private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
    _.each(data, (grp: ChildGroup) => {
      if (grp.isIncludedInSearch) {
        grp.isCreated = true;
        grp.isVisible = isVisible;
        _.each(grp.accounts, (acc: Account) => {
          if (acc.isIncludedInSearch) {
            acc.isCreated = true;
            acc.isVisible = isVisible;
          }
        });
        this.toggleVisibility(grp.childGroups, isVisible);
      }
    });
  }
}
