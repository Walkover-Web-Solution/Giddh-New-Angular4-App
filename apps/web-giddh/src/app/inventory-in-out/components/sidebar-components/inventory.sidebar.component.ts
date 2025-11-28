import { take, takeUntil } from 'rxjs/operators';
import { AppState } from '../../../store/roots';
import { Store, select } from '@ngrx/store';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { IStocksItem } from '../../../models/interfaces/stocks-item.interface';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { InventoryUser } from '../../../models/api-models/Inventory-in-out';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
    selector: 'invetory-sidebar',
    templateUrl: './inventory.sidebar.component.html',
    styles: [`
        .parent-group > ul > li ul li div {
            color: #8a8a8a;
        }

        #inventory-sidebar {
            background: #fff;
            min-height: 100vh;
        }
    `]
})

export class InventoryInOutSidebarComponent implements OnInit, OnDestroy {
    public stocksList$: Observable<IStocksItem[]>;
    public inventoryUsers$: Observable<InventoryUser[]>;
    public sidebarRect: any;
    /** Selected tab index for Material tabs */
    public selectedTabIndex: number = 0;
    @ViewChild('search', { static: true }) public search: ElementRef;
    @ViewChild('sidebar', { static: true }) public sidebar: ElementRef;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * TypeScript public modifiers
     */
    constructor(private store: Store<AppState>,
        private _inventoryAction: InventoryAction,
        private sideBarAction: SidebarAction) {
        this.stocksList$ = this.store.pipe(select(s => s.inventory.stocksList && s.inventory.stocksList.results), takeUntil(this.destroyed$));
        this.inventoryUsers$ = this.store.pipe(select(s => s.inventoryInOutState.inventoryUsers && s.inventoryInOutState.inventoryUsers), takeUntil(this.destroyed$));
        this.sidebarRect = window.screen.height;
    }

    @HostListener('window:resize')
    public resizeEvent() {
        this.sidebarRect = window.screen.height;
    }

    public ngOnInit() {
        this.store.dispatch(this._inventoryAction.GetStock());
        this.store.pipe(take(1)).subscribe(state => {
            if (state.inventory.groupsWithStocks === null) {
                this.store.dispatch(this.sideBarAction.GetGroupsWithStocksHierarchyMin());
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles Material tab change events
     *
     * @param {MatTabChangeEvent} event - The tab change event containing the new tab index
     * @memberof InventoryInOutSidebarComponent
     */
    public tabChanged(event: MatTabChangeEvent): void {
        this.selectedTabIndex = event.index;
    }
}
