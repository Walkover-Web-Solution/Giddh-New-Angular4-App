import { StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groups-with-stocks.interface';
import { Store, select } from '@ngrx/store';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { InvViewService } from '../../inv.view.service';
import { takeUntil } from 'rxjs/operators';
@Component({
    selector: 'stock-list',
    standalone: false,
    styleUrls: ['stockList.component.scss'],
    template: `
    <ul class="list-unstyled stock-items clear-both" [hidden]="!Groups.isOpen">
      <li class="clear-both p-0" *ngFor="let item of Groups.stocks">
        <div class="in-list" [ngClass]="{'active':  (activeStockUniqueName$ | async) === item?.uniqueName}">
          <a (click)="OpenStock(item, $event)" class="d-flex align-items-center flex-fill justify-content-between text-default">
            <span class="span">{{item.name}}</span>
            <span class="d-block mr-2" *ngIf="item.count" [hidden]="(activeStockUniqueName$ | async) === item?.uniqueName">
         {{item.count}}</span>
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
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private inventoryAction: InventoryAction,
        private sideBarAction: SidebarAction,
        private invViewService: InvViewService) {
        this.activeGroup$ = this.store.pipe(select(p => p.inventory.activeGroup), takeUntil(this.destroyed$));
        this.activeStockUniqueName$ = this.store.pipe(select(p => p.inventory.activeStockUniqueName), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.sub = this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params) {
                this.groupUniqueName = params['groupUniqueName'];
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public OpenStock(item, e: Event) {
        this.invViewService.setActiveView('stock', item.name, item?.uniqueName, this.Groups?.uniqueName, true);
        this.invViewService.setActiveGroupUniqueName(this.Groups?.uniqueName);
        this.invViewService.setActiveStockUniqueName(item?.uniqueName);
        e.stopPropagation();
        this.stockUniqueName = item?.uniqueName;
        this.store.dispatch(this.sideBarAction.GetInventoryStock(item?.uniqueName, this.Groups?.uniqueName));
    }

}
