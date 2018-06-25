import { AppState } from '../../../store/roots';

import { Store } from '@ngrx/store';

import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IStocksItem } from '../../../models/interfaces/stocksItem.interface';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { ActivatedRoute } from '@angular/router';
import { InventoryUser } from '../../../models/api-models/Inventory-in-out';

@Component({
  selector: 'invetory-sidebar',  // <home></home>
  templateUrl: './inventory.sidebar.component.html',
  styles: [`
    .parent-Group > ul > li ul li div {
      color: #8a8a8a;
    }

    #inventory-sidebar {
      background: #fff;
      min-height: 100vh;
    }
    :host ::ng-deep .nav-tabs>li{
      width: 50%;
      text-align: center;
      background: #f5f5f5;
    }
  `]
})
export class InventoryInOutSidebarComponent implements OnInit, OnDestroy, AfterViewInit {
  public stocksList$: Observable<IStocksItem[]>;
  public inventoryUsers$: Observable<InventoryUser[]>;
  public sidebarRect: any;
  @ViewChild('search') public search: ElementRef;
  @ViewChild('sidebar') public sidebar: ElementRef;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>,
              private _router: ActivatedRoute,
              private _inventoryAction: InventoryAction) {
    this.store.dispatch(this._inventoryAction.GetStock());
    this.stocksList$ = this.store.select(s => s.inventory.stocksList && s.inventory.stocksList.results).takeUntil(this.destroyed$);
    this.inventoryUsers$ = this.store.select(s => s.inventoryInOutState.inventoryUsers && s.inventoryInOutState.inventoryUsers).takeUntil(this.destroyed$);
    this.sidebarRect = window.screen.height;

    // console.log(this.sidebarRect);
  }

  @HostListener('window:resize')
  public resizeEvent() {
    this.sidebarRect = window.screen.height;
  }

  // @HostListener('window:load', ['$event'])

  public ngOnInit() {
//
  }

  public ngAfterViewInit() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
