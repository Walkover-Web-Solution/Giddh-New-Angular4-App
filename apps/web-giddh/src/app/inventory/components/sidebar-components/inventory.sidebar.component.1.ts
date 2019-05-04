import { fromEvent as observableFromEvent, Observable, ReplaySubject } from 'rxjs';

import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { Router } from '@angular/router';
import { base64ToBlob } from './../../../shared/helpers/helperFunctions';
import { ToasterService } from './../../../services/toaster.service';
import { InventoryService } from '../../../services/inventory.service';

@Component({
  selector: 'inventory-sidebar',  // <home></home>
  templateUrl: './inventory.sidebar.component.html',
  styles: [`
  .invisible{
    visibility:hidden;
  }
    .parent-Group > ul > li ul li div {
      color: #8a8a8a;
    }
    .btn-group.show{
      display:inline-block!important;
    }
    .btn-group>.btn:first-child {
      margin-left: 8px;
      margin-top: -3px;
      background: none;
      color: #707070;
      padding: 6px;
      margin-right:0px!important;
    }
    .dropdown-menu>li>a:hover {
      background:#E5E5E5;
      cursor:pointer;
    }
    .dropdown-menu>li>a {
      color:#ff5200;
    }
    span.caret{
      display:none;
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
  constructor(private store: Store<AppState>, private sidebarAction: SidebarAction, private inventoryAction: InventoryAction, private router: Router,
    private inventoryService: InventoryService,
    private _toasty: ToasterService) {
    this.groupsWithStocks$ = this.store.select(s => s.inventory.groupsWithStocks).pipe(takeUntil(this.destroyed$));
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
    this.groupsWithStocks$.subscribe();
    observableFromEvent(this.search.nativeElement, 'input').pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((e: any) => e.target.value))
      .subscribe((val: string) => {
        if (val) {
          this.store.dispatch(this.sidebarAction.SearchGroupsWithStocks(val));
        } else {
          this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin(val));
        }
      });
  }

  public showBranchScreen() {
    // this.store.dispatch(this.inventoryAction.ResetInventoryState());
    this.store.dispatch(this.sidebarAction.ShowBranchScreen(true));
    this.store.dispatch(this.sidebarAction.ShowBranchScreenSideBar(true));
    // this.router.navigate(['inventory']);
  }

  public downloadAllInventoryReports() {
    console.log('Called : download all inventory report');
    this.inventoryService.downloadAllInventoryReports()
      .subscribe(d => {
        if (d.status === 'success') {
          let blob = base64ToBlob(d.body, 'application/xls', 512);
          return saveAs(blob, 'all-inventory-report.xlsx');
        } else {
          this._toasty.errorToast(d.message);
        }
      });
  }
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
