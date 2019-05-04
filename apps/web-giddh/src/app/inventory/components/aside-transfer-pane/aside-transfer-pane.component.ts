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

@Component({
  selector: 'aside-transfer-pane',
  templateUrl: './aside-transfer-pane.component.html',
  styles: [`
  :host.in {
    left: auto;
    top: 0;
    right: 0;
    bottom: 0;
    width: 480px;
    z-index: 1045;
    position:fixed;
    display:block;
  }
  :host.out {
    display:none;
  }
  :host.in #close {
    display: block;
    position: fixed;
    left: auto;
    right: 472px;
    top: 0;
    z-index: 5;
    border: 0;
    border-radius: 0;
  }

    :host .container-fluid {
      padding-left: 0;
      padding-right: 0;
    }

    :host .aside-pane {
      width: 480px;
      background: #fff;
      width: 100%;
      padding:0px;
    }

    .flexy-child {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .flexy-child-1 {
      flex-grow: 1;
    }

    .vmiddle {
      position: absolute;
      top: 50%;
      bottom: 0;
      left: 0;
      display: table;
      width: 100%;
      right: 0;
      transform: translateY(-50%);
      text-align: center;
      margin: 0 auto;
    }

    :host.in #back {
      display: block;
      position: fixed;
      left: none;
      right: 472px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }

    .btn-lg {
      min-width: 155px;
      background:#FFF3EC;
      color:#FF5F00;
      border-radius:0px;
      box-shadow:none;
    }
    .btn-lg:hover{
      background:#FF5F00;
      color:#FFFFFF;
      box-shadow: 0px 4px 4px -3px #afabab;
      border-radius:0px;
    }
  `],
})

export class AsideTransferPaneComponent implements OnInit, OnChanges {
  public stockList$: Observable<IStocksItem[]>;
  public stockUnits$: Observable<StockUnitRequest[]>;
  public userList$: Observable<InventoryUser[]>;
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Input() public selectedAsideView: string = 'mainview';
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
    this._store.dispatch(this._inventoryAction.GetStock());
    // dispatch stockunit request
    this._store.dispatch(this._customStockActions.GetStockUnit());
    this._store.dispatch(this._inventoryUserAction.getAllUsers());
    this.createStockSuccess$ = this._store.select(s => s.inventory.createStockSuccess).pipe(takeUntil(this.destroyed$));
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

    this.createStockSuccess$.subscribe(s => {
      if (s) {
        this.closeAsidePane(s);
        let objToSend = { isOpen: false, isGroup: false, isUpdate: false };
        this._store.dispatch(this._inventoryAction.ManageInventoryAside(objToSend));
      }
    });
  }

  public onCancel() {
    this.closeAsidePane();
  }
  public selectView(view: string) {
    this.selectedAsideView = view;
  }
  public backButtonPressed() {
    this.selectedAsideView = 'mainview';
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
