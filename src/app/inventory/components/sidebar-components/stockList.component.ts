import { StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';

@Component({
  selector: 'stock-list',
  styles: [`
    .active {
      color: #d35f29 !important;
    }
  `],
  template: `
  <ul class="list-unstyled stock-items clearfix" [hidden]="!Groups.isOpen" >
    <li class="clearfix" *ngFor="let item of Groups.stocks" >
      <a (click)="OpenStock(item, $event)" class="pull-left">
        <div [ngClass]="{'active':  (activeStockUniqueName$ | async) === item.uniqueName}">{{item.name}}</div>
      </a>
      <button class="btn btn-link btn-xs pull-right" (click)="goToManageStock(item)" *ngIf="(activeStockUniqueName$ | async) === item.uniqueName">
        Edit
      </button>
    </li>
  </ul>
  `
})
export class StockListComponent implements OnInit, OnDestroy {
  public activeStockUniqueName$: Observable<string>;
  public activeGroup$: Observable<StockGroupResponse>;
  public sub: Subscription;
  public groupUniqueName: string;

  @Input()
  public Stocks: any[];
  @Input()
  public Groups: IGroupsWithStocksHierarchyMinItem;
  public stockUniqueName: string;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private _router: Router, private inventoryAction: InventoryAction, private sideBarAction: SidebarAction) {
    this.activeGroup$ = this.store.select(p => p.inventory.activeGroup);
    this.activeStockUniqueName$ = this.store.select(p => p.inventory.activeStockUniqueName);
  }

  public ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
    });

    if (this.Groups.stocks) {
      // this.Groups.stocks = [];
      // this.Groups.stocks = _.orderBy(this.Groups.stocks, ['name']);
    }
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public OpenStock(item, e: Event) {
    e.stopPropagation();
    this.stockUniqueName = item.uniqueName;
    this._router.navigate(['/pages', 'inventory', 'add-group', this.Groups.uniqueName, 'stock-report', item.uniqueName]);
  }

  public goToManageStock(stock) {
    if (stock && stock.uniqueName) {
      this.store.dispatch(this.inventoryAction.showLoaderForStock());
      this.store.dispatch(this.sideBarAction.GetInventoryStock(stock.uniqueName, this.Groups.uniqueName));
      // this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
      // this.setInventoryAsideState(true, false, true);
    }
  }

  /**
   * setInventoryAsideState
   */
  public setInventoryAsideState(isOpen, isGroup, isUpdate) {
    this.store.dispatch(this.inventoryAction.ManageInventoryAside({isOpen, isGroup, isUpdate}));
  }
}
