import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { InventoryUsersActions } from '../../../actions/inventory/inventory.users.actions';
import { IStocksItem } from '../../../models/interfaces/stocks-item.interface';
import { InventoryEntry, InventoryUser } from '../../../models/api-models/Inventory-in-out';
import { InventoryEntryActions } from '../../../actions/inventory/inventory.entry.actions';
import { GeneralService } from '../../../services/general.service';
import { StockUnitRequest } from '../../../models/api-models/Inventory';
import { CustomStockUnitAction } from '../../../actions/inventory/custom-stock-unit.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CompanyResponse } from "../../../models/api-models/Company";
import { createSelector } from "reselect";
import { each, find, orderBy } from '../../../lodash-optimized';

@Component({
    selector: 'aside-branch-transfer-pane',
    templateUrl: './aside-branch-transfer-pane.component.html',
    styleUrls: ['./aside-branch-transfer-pane.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0);'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0);'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class AsideBranchTransferPaneComponent implements OnInit, OnDestroy {
    public stockList$: Observable<IStocksItem[]>;
    public stockUnits$: Observable<StockUnitRequest[]>;
    public userList$: Observable<InventoryUser[]>;
    public branches$: Observable<CompanyResponse[]>;
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @Output() public transferType: EventEmitter<boolean> = new EventEmitter(true);
    @Input() public selectedAsideView: string = 'mainview';
    public isLoading: boolean;
    public entrySuccess$: Observable<boolean>;
    public transferEntrySuccess$: Observable<boolean>;
    public isSaveClicked: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _store: Store<AppState>,
        private _inventoryAction: InventoryAction,
        private _inventoryEntryAction: InventoryEntryActions,
        private _generalService: GeneralService,
        private _inventoryUserAction: InventoryUsersActions,
        private _customStockActions: CustomStockUnitAction
    ) {
        this.entrySuccess$ = this._store.select(s => s.inventoryInOutState.entrySuccess).pipe(takeUntil(this.destroyed$));
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

        this.entrySuccess$.subscribe(s => {
            if (s && this.isSaveClicked) {
                this.closeAsidePane(s);
                this.isSaveClicked = false;
            }
        });

        // tslint:disable-next-line:no-shadowed-variable
        this._store.pipe(select(createSelector([(state: AppState) => state.settings.branches], (branches) => {
            if (branches && branches.length > 0) {
                each(branches, (branch) => {
                    if (branch.addresses && branch.addresses.length) {
                        branch.addresses = [find(branch.addresses, (gst) => gst && gst.isDefault)];
                    }
                });
                this.branches$ = observableOf(orderBy(branches, 'name'));
            } else if (branches && branches.length === 0) {
                this.branches$ = observableOf(null);
            }
        })), takeUntil(this.destroyed$)).subscribe();
    }

    public onCancel() {
        this.closeAsidePane();
    }

    public closeAsidePane(event?) {
        this.closeAsideEvent.emit();
    }

    public onSave(entry: InventoryEntry, reciever?: InventoryUser) {
        this.isSaveClicked = true;
        this._store.dispatch(this._inventoryEntryAction.addNewTransferEntry(entry, reciever));
    }

    public createAccount(value) {
        this._store.dispatch(this._inventoryUserAction.addNewUser(value.name));
    }

    public openBranchTransferPopup(transferType) {
        this.transferType.emit(transferType);
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof AsideBranchTransferPaneComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
