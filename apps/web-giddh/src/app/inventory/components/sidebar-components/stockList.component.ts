import { StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Store } from '@ngrx/store';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { InvViewService } from '../../inv.view.service';

@Component({
    selector: 'stock-list',
    styleUrls: ['stockList.component.scss'],
    template: `
    <ul class="list-unstyled stock-items clearfix" [hidden]="!Groups.isOpen">
      <li class="clearfix " *ngFor="let item of Groups.stocks" style="padding: 0px">
        <div class="in-list" [ngClass]="{'active':  (activeStockUniqueName$ | async) === item.uniqueName}">
          <a (click)="OpenStock(item, $event)" style="display: flex;align-items: center;flex: 1;color: black;justify-content: space-between" class="d-flex">
            <span class="span">{{item.name}}</span>
            <span class="d-block" *ngIf="item.count" style="margin-right: 12px;" [hidden]="(activeStockUniqueName$ | async) === item.uniqueName">
         {{item.count}}</span>
          </a>
          <button class="btn btn-link btn-xs pull-right" (click)="goToManageStock(item)" *ngIf="(activeStockUniqueName$ | async) === item.uniqueName">
            <i class="fa fa-pencil"> </i>
          </button>
        </div>
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

    constructor(private store: Store<AppState>, private route: ActivatedRoute, private _router: Router, private inventoryAction: InventoryAction, private sideBarAction: SidebarAction,
        private invViewService: InvViewService) {
        this.activeGroup$ = this.store.select(p => p.inventory.activeGroup);
        this.activeStockUniqueName$ = this.store.select(p => p.inventory.activeStockUniqueName);
    }

    public ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.groupUniqueName = params['groupUniqueName'];
        });

        if (this.Groups.stocks) {
            // this.Groups.stocks = [];
            this.Groups.stocks = _.orderBy(this.Groups.stocks, ['name']);
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public OpenStock(item, e: Event) {
        this.invViewService.setActiveView('stock', item.name, item.uniqueName, this.Groups.uniqueName, true);
        e.stopPropagation();
        this.stockUniqueName = item.uniqueName;
        this.store.dispatch(this.sideBarAction.GetInventoryStock(item.uniqueName, this.Groups.uniqueName));
        // setTimeout(() => {
        this._router.navigate(['/pages', 'inventory', 'stock', this.Groups.uniqueName, 'report', item.uniqueName]);
        // }, 700);
    }

    public goToManageStock(stock) {
        if (stock && stock.uniqueName) {
            this.store.dispatch(this.inventoryAction.showLoaderForStock());
            this.store.dispatch(this.sideBarAction.GetInventoryStock(stock.uniqueName, this.Groups.uniqueName));
            // this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            // this.setInventoryAsideState(true, false, true);
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen: true, isGroup: false, isUpdate: true }));
        }
    }

    /**
     * setInventoryAsideState
     */
    public setInventoryAsideState(isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen, isGroup, isUpdate }));
    }
}
