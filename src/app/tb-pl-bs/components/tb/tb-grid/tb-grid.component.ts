import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AccountDetails } from '../../../../models/api-models/tb-pl-bs';
import { Account, ChildGroup } from '../../../../models/api-models/Search';
import * as _ from '../../../../lodash-optimized';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'tb-grid',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'translateX(100%)', opacity: 0}),
          animate('500ms', style({transform: 'translateX(0)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'translateX(0)', opacity: 1}),
          animate('0ms', style({transform: 'translateX(100%)', opacity: 0}))
        ])
      ]
    )
  ],
  templateUrl: './tb-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbGridComponent implements OnInit, AfterViewInit, OnChanges {

  public noData: boolean;
  public accountSearchControl: FormControl = new FormControl();
  public showClearSearch: boolean = false;
  @Input() public search: string = '';
  @Input() public searchInput: string = '';
  @Input() public padLeft: number = 30;
  @Input() public showLoader: boolean;
  @Input() public data$: AccountDetails;
  @Input() public expandAll: boolean;
  @Output() public searchChange = new EventEmitter<string>();
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
    this.accountSearchControl.valueChanges.pipe(
      debounceTime(700))
      .subscribe((newValue) => {
        this.searchInput = newValue;
        this.searchChange.emit(this.searchInput);
        this.cd.detectChanges();
      });
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
