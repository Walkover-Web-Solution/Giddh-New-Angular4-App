import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { InventoryUsersActions } from '../../../actions/inventory/inventory.users.actions';
import { IStocksItem } from '../../../models/interfaces/stocks-item.interface';
import { InventoryEntry, InventoryUser } from '../../../models/api-models/Inventory-in-out';
import { InventoryEntryActions } from '../../../actions/inventory/inventory.entry.actions';
import { GeneralService } from '../../../services/general.service';
import { StockUnitRequest } from '../../../models/api-models/Inventory';
import { CustomStockUnitAction } from '../../../actions/inventory/custom-stock-unit.actions';

@Component({
    selector: 'aside-menu',
    templateUrl: './aside-menu.component.html',
    styleUrls: ['./aside-menu.component.scss'],
})

export class AsideMenuComponent implements OnInit, OnDestroy {
    public stockList$: Observable<IStocksItem[]>;
    public stockUnits$: Observable<StockUnitRequest[]>;
    public userList$: Observable<InventoryUser[]>;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Input() public selectedAsideView: string;
    public view = '';
    public isLoading: boolean;
    public createStockSuccess$: Observable<boolean>;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _store: Store<AppState>,
        private _inventoryAction: InventoryAction,
        private _inventoryEntryAction: InventoryEntryActions,
        private _generalService: GeneralService,
        private _inventoryUserAction: InventoryUsersActions,
        private _customStockActions: CustomStockUnitAction,
    ) {
        this.createStockSuccess$ = this._store.select(s => s.inventory.createStockSuccess).pipe(takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this._store.dispatch(this._inventoryAction.GetStock());
        // dispatch stockunit request
        this._store.dispatch(this._customStockActions.getStockUnit());
        this._store.dispatch(this._inventoryUserAction.getAllUsers());

        this.stockList$ = this._store.pipe(select(p => p.inventory.stocksList && p.inventory.stocksList.results), takeUntil(this.destroyed$));
        this.stockUnits$ = this._store.pipe(select(p => p.inventory.stockUnits), takeUntil(this.destroyed$));
        this.userList$ = this._store.pipe(select(p => p.inventoryInOutState.inventoryUsers?.filter(o => o?.uniqueName !== this._generalService.companyUniqueName)), takeUntil(this.destroyed$));
        this._store.pipe(select(p => p.inventoryInOutState.entryInProcess), takeUntil(this.destroyed$)).subscribe(p => this.isLoading = p);
        this._store.pipe(select(p => p.inventoryInOutState.userSuccess), takeUntil(this.destroyed$)).subscribe(p => p && this.closeAsidePane(p));

        this.createStockSuccess$.subscribe(s => {
            if (s) {
                this.closeAsidePane(s);
                let objToSend = { isOpen: false, isGroup: false, isUpdate: false };
                this._store.dispatch(this._inventoryAction.ManageInventoryAside(objToSend));
            }
        });
    }

    public onCancel() {
        this.view = '';
        this.closeAsidePane();
    }

    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
        this.view = '';
    }

    public onSave(entry: InventoryEntry, reciever?: InventoryUser) {
        this._store.dispatch(this._inventoryEntryAction.addNewEntry(entry, reciever));
    }

    public createAccount(value) {
        this._store.dispatch(this._inventoryUserAction.addNewUser(value.name));
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof AsideMenuComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
