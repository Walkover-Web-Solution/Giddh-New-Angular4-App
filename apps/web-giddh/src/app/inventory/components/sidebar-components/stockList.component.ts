import { StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { Store, select } from '@ngrx/store';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { InvViewService } from '../../inv.view.service';
import { takeUntil } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector: 'stock-list',
    styleUrls: ['stockList.component.scss'],
    template: `
    <ul class="list-unstyled stock-items clearfix" [hidden]="!Groups.isOpen">
      <li class="clearfix p-0" *ngFor="let item of Groups.stocks">
        <div class="in-list" [ngClass]="{'active':  (activeStockUniqueName$ | async) === item.uniqueName}">
          <a (click)="OpenStock(item, $event)" class="d-flex align-items-center flex-fill justify-content-between black-color">
            <span class="span">{{item.name}}</span>
            <span class="d-block mr-r1" *ngIf="item.count" [hidden]="(activeStockUniqueName$ | async) === item.uniqueName">
         {{item.count}}</span>
          </a>
          <a class="btn btn-link btn-xs pull-right" [routerLink]="'/pages/new-inventory/stock/edit/' + item.uniqueName" *ngIf="!isMobileScreen && (activeStockUniqueName$ | async) === item.uniqueName">
            <i class="icon-edit-pencil"> </i>
          </a>
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
    /* True, if mobile screen */
    public isMobileScreen: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private inventoryAction: InventoryAction,
        private sideBarAction: SidebarAction,
        private invViewService: InvViewService,
        private breakPointObserver: BreakpointObserver) {
        this.activeGroup$ = this.store.pipe(select(p => p.inventory.activeGroup), takeUntil(this.destroyed$));
        this.activeStockUniqueName$ = this.store.pipe(select(p => p.inventory.activeStockUniqueName), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.sub = this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if(params) {
                this.groupUniqueName = params['groupUniqueName'];
            }
        });
        this.breakPointObserver.observe([
            '(max-width:1024px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public OpenStock(item, e: Event) {
        this.invViewService.setActiveView('stock', item.name, item.uniqueName, this.Groups.uniqueName, true);
        this.invViewService.setActiveGroupUniqueName(this.Groups.uniqueName);
        this.invViewService.setActiveStockUniqueName(item.uniqueName);
        e.stopPropagation();
        this.stockUniqueName = item.uniqueName;
        this.store.dispatch(this.sideBarAction.GetInventoryStock(item.uniqueName, this.Groups.uniqueName));
    }

    public goToManageStock(stock) {
        if (stock && stock.uniqueName) {
            this.store.dispatch(this.inventoryAction.showLoaderForStock());
            this.store.dispatch(this.sideBarAction.GetInventoryStock(stock.uniqueName, this.Groups.uniqueName));
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
