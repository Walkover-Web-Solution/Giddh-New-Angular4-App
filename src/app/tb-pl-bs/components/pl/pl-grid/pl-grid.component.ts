import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppState } from '../../../../store/roots';
import { TBPlBsActions } from '../../../../services/actions/tl-pl.actions';
import { AccountDetails } from '../../../../models/api-models/tb-pl-bs';
import { Observable } from 'rxjs/Observable';
import { ChildGroup } from '../../../../models/api-models/Search';
import * as _ from 'lodash';

@Component({
  selector: 'pl-grid',  // <home></home>
  templateUrl: './pl-grid.component.html'
})
export class PlGridComponent implements OnInit, OnDestroy, AfterViewInit {

  public showTbplLoader: Observable<boolean>;
  public noData: boolean;
  public showClearSearch: boolean;
  public expanded = false;
  public data$: Observable<AccountDetails>;

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
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _tlPlAction: TBPlBsActions, private cd: ChangeDetectorRef) {
    // this.showLoader = true;
    this.data$ = this.store.select(p => _.cloneDeep(p.tlPl.pl.data)).takeUntil(this.destroyed$);
    this.showTbplLoader = this.store.select(p => p.tlPl.pl.showLoader).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    //
    this.data$.subscribe(p => {
      if (p) {
        // this.showLoader = false;
      }
      this.cd.detectChanges();
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
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
