import { takeUntil } from 'rxjs/operators';
import { StockDetailResponse, StockGroupResponse } from '../../../models/api-models/Inventory';
import { AppState } from '../../../store/roots';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groups-with-stocks.interface';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { InvViewService } from '../../inv.view.service';
import { ScrollDispatcher } from '@angular/cdk/scrolling';

@Component({
    selector: 'stockgrp-list',
    styleUrls: ['stockgrplist.component.scss'],
    templateUrl: 'stockgrplist.component.html'
})
export class StockgrpListComponent implements OnInit, OnDestroy {
    public activeStock$: Observable<StockDetailResponse>;
    public activeGroup$: Observable<StockGroupResponse>;
    public activeGroupUniqueName$: Observable<string>;
    @Input() public Groups: IGroupsWithStocksHierarchyMinItem[];
    @Input() public page: number = 0;
    /** Emits if we need to load next page of stocks */
    @Output() public loadMore: EventEmitter<boolean> = new EventEmitter(true);
    public stockUniqueName: string;
    public activeGroup: any = null;
    public activeStock: any = null;
    public activeStockUniqueName$: Observable<string>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if get stocks in progress */
    public getStocksInProgress: boolean = false;

    constructor(
        private store: Store<AppState>, 
        private sideBarAction: SidebarAction,
        private inventoryAction: InventoryAction, 
        private invViewService: InvViewService,
        private scrollDispatcher: ScrollDispatcher
    ) {
        this.activeGroup$ = this.store.pipe(select(p => p.inventory.activeGroup), takeUntil(this.destroyed$));
        this.activeStock$ = this.store.pipe(select(p => p.inventory.activeStock), takeUntil(this.destroyed$));
        this.activeGroupUniqueName$ = this.store.pipe(select(p => p.inventory.activeGroupUniqueName), takeUntil(this.destroyed$));
        this.activeStockUniqueName$ = this.store.pipe(select(p => p.inventory.activeStockUniqueName), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                this.activeGroup = a;
            }
        });

        this.activeStock$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a) {
                this.activeStock = a;
            }
        });

        this.store.pipe(select(state => state.inventory.getStocksInProgress)).subscribe(response => this.getStocksInProgress = response);

        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event?.getDataLength() - event?.getRenderedRange().end < 50) {
                this.loadMore.emit(true);
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public OpenGroup(grp: IGroupsWithStocksHierarchyMinItem, e: Event) {
        this.invViewService.setActiveView('group', grp.name, null, grp?.uniqueName, grp.isOpen);
        this.invViewService.setActiveGroupUniqueName(grp?.uniqueName);
        e.stopPropagation();

        if (grp.isOpen) {
            this.store.dispatch(this.sideBarAction.OpenGroup(grp?.uniqueName));
        } else {
            this.store.dispatch(this.sideBarAction.GetInventoryGroup(grp?.uniqueName));
        }
    }

    public goToManageGroup(grp) {
        if (grp?.uniqueName) {
            this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
            this.setInventoryAsideState(true, true, true);
        }
    }

    /**
     * setInventoryAsideState
     */
    public setInventoryAsideState(isOpen, isGroup, isUpdate) {
        this.store.dispatch(this.inventoryAction.ManageInventoryAside({ isOpen, isGroup, isUpdate }));
    }
}
