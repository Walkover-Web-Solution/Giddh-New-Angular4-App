import { Store } from '@ngrx/store';
import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { AppState } from '../../../store/roots';
import { TlPlActions } from '../../../services/actions/tl-pl.actions';
import { AccountDetails } from '../../../models/api-models/tl-pl';
import { Observable } from 'rxjs/Observable';
import { ChildGroup } from '../../../models/api-models/Search';
import * as _ from 'lodash';

@Component({
  selector: 'tl-pl-grid',  // <home></home>
  templateUrl: './tl-pl-grid.component.html'
})
export class TlPlGridComponent implements OnInit, OnDestroy, AfterViewInit {

  public showTbplLoader: Observable<boolean>;
  public noData: boolean;
  public showClearSearch: boolean;
  public expanded = false;
  public data$: Observable<AccountDetails>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private _tlPlAction: TlPlActions, private cd: ChangeDetectorRef) {
    // this.showTbplLoader = true;
    this.data$ = this.store.select(p => _.cloneDeep(p.tlPl.data));
    this.showTbplLoader = this.store.select(p => p.tlPl.showTbplLoader);
  }

  public ngOnInit() {
    //
    this.data$.subscribe(p => {
      if (p) {
        // this.showTbplLoader = false;
        debugger;
      }
      this.cd.detectChanges();
    });
  }

  public collapseAll() {
    this.data$ = this.data$.map(p => {
      return {
        forwardedBalance: p.forwardedBalance,
        creditTotal: p.creditTotal,
        debitTotal: p.debitTotal,
        closingBalance: p.closingBalance,
        openingBalance: p.openingBalance,
        groupDetails: this.toggleVisibility(p.groupDetails, false)
      };
    });
  }

  public expandAll() {
    this.data$ = this.data$.map(p => {
      return {
        forwardedBalance: p.forwardedBalance,
        creditTotal: p.creditTotal,
        debitTotal: p.debitTotal,
        closingBalance: p.closingBalance,
        openingBalance: p.openingBalance,
        groupDetails: this.toggleVisibility(p.groupDetails, true)
      };
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
