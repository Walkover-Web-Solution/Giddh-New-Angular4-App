import { ViewChild, OnChanges, AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ChangeDetectorRef, NgZone, ViewChildren, QueryList, ContentChildren, SimpleChanges } from '@angular/core';
import { AccountDetails } from '../../../../models/api-models/tb-pl-bs';
import { Observable } from 'rxjs/Observable';
import { ChildGroup, Account } from '../../../../models/api-models/Search';
import * as _ from '../../../../lodash-optimized';
import { TlPlGridRowComponent } from '../../tb-pl-bs-grid-row.component';

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
            _.each(this.data$.groupDetails, (grp: any) => {
              grp.isVisible = true;
              _.each(grp.accounts, (acc: any) => {
                acc.isVisible = false;
              });
            });
          }
        });

        // this.data$ = _.cloneDeep(this.data$);
        // this.cd.detectChanges();
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
  private toggleVisibility = (data: ChildGroup[], isVisible: boolean) => {
    _.each(data, (grp: ChildGroup) => {
      grp.isCreated = true;
      grp.isVisible = isVisible;
      _.each(grp.accounts, (acc: Account) => {
        acc.isCreated = true;
        acc.isVisible = isVisible;
      });
      this.toggleVisibility(grp.childGroups, isVisible);
    });
  }
}
