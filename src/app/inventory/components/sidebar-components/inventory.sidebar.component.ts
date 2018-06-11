import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'inventory-sidebar',  // <home></home>
  templateUrl: './inventory.sidebar.component.html',
  styles: [`
    .parent-Group > ul > li ul li div {
      color: #8a8a8a;
    }

    #inventory-sidebar {
      background: #fff;
      min-height: 100vh;
    }
  `]
})
export class InventorySidebarComponent implements OnInit, OnDestroy, AfterViewInit {
  public groupsWithStocks$: Observable<IGroupsWithStocksHierarchyMinItem[]>;
  public sidebarRect: any;
  @ViewChild('search') public search: ElementRef;
  @ViewChild('sidebar') public sidebar: ElementRef;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private sidebarAction: SidebarAction) {
    this.groupsWithStocks$ = this.store.select(s => s.inventory.groupsWithStocks).takeUntil(this.destroyed$);
    this.sidebarRect = window.screen.height;
    // console.log(this.sidebarRect);
  }

  @HostListener('window:resize')
  public resizeEvent() {
    this.sidebarRect = window.screen.height;
  }

  // @HostListener('window:load', ['$event'])

  public ngOnInit() {
    this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
  }

  public ngAfterViewInit() {
    Observable.fromEvent(this.search.nativeElement, 'input')
      .debounceTime(500)
      .distinctUntilChanged()
      .map((e: any) => e.target.value)
      .subscribe((val: string) => {
        if (val) {
          this.store.dispatch(this.sidebarAction.SearchGroupsWithStocks(val));
        } else {
          this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin(val));
        }
      });
  }

  public showBranchScreen() {
    this.store.dispatch(this.sidebarAction.ShowBranchScreen(true));
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
