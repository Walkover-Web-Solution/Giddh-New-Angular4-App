import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { Observable } from 'rxjs/Rx';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'invetory-sidebar',  // <home></home>
  templateUrl: './inventory.sidebar.component.html'
})
export class InventorySidebarComponent implements OnInit, OnDestroy {
  public groupsWithStocks$: Observable<IGroupsWithStocksHierarchyMinItem[]>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private sidebarAction: SidebarAction) {
    this.groupsWithStocks$ = this.store.select(s => s.inventory.groupsWithStocks).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    console.log('hello sidebar');
    this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
    // this.exampleData = [
    // ];
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
