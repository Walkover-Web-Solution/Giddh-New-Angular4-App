import { debounceTime, distinctUntilChanged, map, take, takeUntil } from 'rxjs/operators';
import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent as observableFromEvent, Observable, ReplaySubject } from 'rxjs';
import { IStocksItem } from '../../../models/interfaces/stocksItem.interface';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { InventoryUser } from '../../../models/api-models/Inventory-in-out';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'jobwork-sidebar',  // <home></home>
  templateUrl: './jobwork.sidebar.component.html',
  styleUrls: ['./jobwork.sidebar.component.scss']
})
export class JobworkSidebarComponent implements OnInit, OnDestroy, AfterViewInit {
  public stocksList$: Observable<IStocksItem[]>;
  public stocksList: IStocksItem[];
  public inventoryUsers$: Observable<InventoryUser[]>;
  public inventoryUsers: InventoryUser[];
  public sidebarRect: any;
  public reportType: string = 'stock';
  @ViewChild('search') public search: ElementRef;
  @ViewChild('sidebar') public sidebar: ElementRef;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>,
    private _router: ActivatedRoute,
    private _inventoryAction: InventoryAction,
    private sideBarAction: SidebarAction,
    private router: Router, private route: ActivatedRoute) {
    this.store.dispatch(this._inventoryAction.GetStock());
    this.stocksList$ = this.store.select(s => s.inventory.stocksList && s.inventory.stocksList.results).pipe(takeUntil(this.destroyed$));
    this.inventoryUsers$ = this.store.select(s => s.inventoryInOutState.inventoryUsers && s.inventoryInOutState.inventoryUsers).pipe(takeUntil(this.destroyed$));
    this.sidebarRect = window.screen.height;
    this.store.pipe(take(1)).subscribe(state => {
      if (state.inventory.groupsWithStocks === null) {
        this.store.dispatch(this.sideBarAction.GetGroupsWithStocksHierarchyMin());
      }
    });
    // console.log(this.sidebarRect);
  }

  @HostListener('window:resize')
  public resizeEvent() {
    this.sidebarRect = window.screen.height;
  }

  public ngOnInit() {
    if (this.router.url.indexOf('stock') > 0 && this.router.url.indexOf('jobwork') > 0) {
      this.reportType = 'stock';
    } else {
      this.reportType = 'person';
    }
  }

  public selectReportType(reportType: string) {
    this.reportType = reportType;
    if (reportType === 'stock') {
      // do action
    }
  }

  public showReport(reportType: string, uniqueName: string) {
    console.log('reportType :', reportType, 'uniqueName:', uniqueName);
  }

  public ngAfterViewInit() {
    this.stocksList$.subscribe(res => {
      this.stocksList = res;
    });
    this.inventoryUsers$.subscribe(res => {
      this.inventoryUsers = res;
    });
    observableFromEvent(this.search.nativeElement, 'input').pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((e: any) => e.target.value))
      .subscribe((val: string) => {

        this.stocksList$.subscribe();

        if (this.reportType === 'stock') {
          this.stocksList$.subscribe(res => { this.stocksList = res; });
          if (val) {
            this.stocksList = Object.assign([], this.stocksList).filter(
              item => item.name.toLowerCase().indexOf(val.toLowerCase()) > -1
            )
          }
        } else if (this.reportType === 'person') {
          this.inventoryUsers$.subscribe(res => { this.inventoryUsers = res; });
          if (val) {
            this.inventoryUsers = Object.assign([], this.inventoryUsers).filter(
              item => item.name.toLowerCase().indexOf(val.toLowerCase()) > -1
            )
          }
        }
      });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
