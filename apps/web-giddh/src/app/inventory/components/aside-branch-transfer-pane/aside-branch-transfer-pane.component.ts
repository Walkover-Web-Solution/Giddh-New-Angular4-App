import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { InventoryUsersActions } from '../../../actions/inventory/inventory.users.actions';
import { IStocksItem } from '../../../models/interfaces/stocksItem.interface';
import { InventoryEntry, InventoryUser } from '../../../models/api-models/Inventory-in-out';
import { InventoryEntryActions } from '../../../actions/inventory/inventory.entry.actions';
import { GeneralService } from '../../../services/general.service';
import { StockUnitRequest } from '../../../models/api-models/Inventory';
import { CustomStockUnitAction } from '../../../actions/inventory/customStockUnit.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';

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

export class AsideBranchTransferPaneComponent implements OnInit, OnChanges {
  public stockList$: Observable<IStocksItem[]>;
  public stockUnits$: Observable<StockUnitRequest[]>;
  public userList$: Observable<InventoryUser[]>;
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Input() public selectedAsideView: string = 'mainview';
  public isLoading: boolean;
  public createStockSuccess$: Observable<boolean>;
  public entrySuccess$: Observable<boolean>;


  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _store: Store<AppState>,
    private _inventoryAction: InventoryAction,
    private _inventoryEntryAction: InventoryEntryActions,
    private _generalService: GeneralService,
    private _inventoryUserAction: InventoryUsersActions,
    private _customStockActions: CustomStockUnitAction,
  ) {
    this._store.dispatch(this._inventoryAction.GetStock());
    // dispatch stockunit request
    this._store.dispatch(this._customStockActions.GetStockUnit());
    this._store.dispatch(this._inventoryUserAction.getAllUsers());
    this.createStockSuccess$ = this._store.select(s => s.inventory.createStockSuccess).pipe(takeUntil(this.destroyed$));
    this.entrySuccess$ = this._store.select(s => s.inventoryInOutState.entrySuccess).pipe(takeUntil(this.destroyed$));
  }

  public ngOnChanges(changes: SimpleChanges): void {
    //
  }

  public ngOnInit() {
    this.stockList$ = this._store
      .select(p => p.inventory.stocksList && p.inventory.stocksList.results);

    this.stockUnits$ = this._store
      .select(p => p.inventory.stockUnits);

    this.userList$ = this._store
      .select(p => p.inventoryInOutState.inventoryUsers.filter(o => o.uniqueName !== this._generalService.companyUniqueName));

    this._store
      .select(p => p.inventoryInOutState.entryInProcess)
      .subscribe(p => this.isLoading = p);

    this._store
      .select(p => p.inventoryInOutState.userSuccess)
      .subscribe(p => p && this.closeAsidePane(p));

    // use here transfer success observable
    // this.createStockSuccess$.subscribe(s => {
    //   if (s) {
    //
    //   }
    // });
  }

  public onCancel() {
    this.closeAsidePane();
  }

  public closeAsidePane(event?) {
    this.closeAsideEvent.emit();
  }

  public onSave(entry: InventoryEntry, reciever?: InventoryUser) {
    this._store.dispatch(this._inventoryEntryAction.addNewEntry(entry, reciever));
  }

  public createAccount(value) {
    this._store.dispatch(this._inventoryUserAction.addNewUser(value.name));
  }
}
