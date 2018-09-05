import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, NgZone, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AccountDetails } from '../../../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../../../models/api-models/Search';
import * as _ from '../../../../lodash-optimized';

@Component({
  selector: 'tb-grid',
  templateUrl: './tb-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbGridComponent implements OnInit, AfterViewInit, OnChanges {

  public noData: boolean;
  public showClearSearch: boolean;
  @Input() public search: string = '';
  @Input() public padLeft: number = 30;
  @Input() public showLoader: boolean;
  @Input() public data$: AccountDetails;
  @Input() public expandAll: boolean;
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

  constructor(private cd: ChangeDetectorRef, private zone: NgZone) {
    //
  }

  public ngOnInit() {
    //
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes.expandAll && !changes.expandAll.firstChange && changes.expandAll.currentValue !== changes.expandAll.previousValue) {
      //
      if (this.data$) {
        // this.cd.detach();
        this.zone.run(() => {
          this.toggleVisibility(this.data$.groupDetails, changes.expandAll.currentValue);
          if (this.data$) {
            // always make first level visible ....
            _.each(this.data$.groupDetails, (grp: ChildGroup) => {
              if (grp.isIncludedInSearch) {
                grp.isVisible = true;
                _.each(grp.accounts, (acc: Account) => {
                  if (acc.isIncludedInSearch) {
                    acc.isVisible = false;
                  }
                });
              }
            });
          }
        });

        // this.data$ = _.cloneDeep(this.data$);
        this.cd.detectChanges();
      }
    }
  }

  public ngAfterViewInit() {
    //
  }

  public markForCheck() {
    this.cd.markForCheck();
  }

  public detectChanges() {
    this.cd.detectChanges();
  }

  public trackByFn(index, item: ChildGroup) {
    return item;
  }
}
