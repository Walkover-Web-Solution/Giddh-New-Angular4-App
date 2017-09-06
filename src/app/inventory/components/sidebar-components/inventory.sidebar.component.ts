import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { Observable } from 'rxjs/Rx';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'invetory-sidebar',  // <home></home>
  templateUrl: './inventory.sidebar.component.html'
})
export class InventorySidebarComponent implements OnInit, OnDestroy, AfterViewInit {
  public groupsWithStocks$: Observable<IGroupsWithStocksHierarchyMinItem[]>;
  @ViewChild('search') public search: ElementRef;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private sidebarAction: SidebarAction) {
    this.groupsWithStocks$ = this.store.select(s => s.inventory.groupsWithStocks).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
  }

  public ngAfterViewInit() {
    Observable.fromEvent(this.search.nativeElement, 'input')
      .debounceTime(500)
      .distinctUntilChanged()
      .map((e: any) => e.target.value)
      .subscribe((val: string) => this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin(val)));
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
