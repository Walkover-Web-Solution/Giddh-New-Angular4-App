import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { InventoryUsersActions } from '../../../actions/inventory/inventory.users.actions';
import { IStocksItem } from '../../../models/interfaces/stocksItem.interface';
import { InventoryEntry, InventoryUser } from '../../../models/api-models/Inventory-in-out';
import { InventoryEntryActions } from '../../../actions/inventory/inventory.entry.actions';

@Component({
  selector: 'aside-menu',
  templateUrl: './aside-menu.component.html',
  styles: [`
    .buttons-container {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      height: 100vh;
    }

    .buttons-container > * {
      margin: 20px;
    }

    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      z-index: 1045;
    }

    #close {
      display: none;
    }

    :host.in #close {
      display: block;
      position: fixed;
      left: -41px;
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
    }
  `],
})

export class AsideMenuComponent implements OnInit, OnChanges {
  public stockList$: Observable<IStocksItem[]>;
  public userList$: Observable<InventoryUser[]>;
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  public view = '';

  constructor(private _store: Store<AppState>,
              private _inventoryAction: InventoryAction,
              private _inventoryEntryAction: InventoryEntryActions,
              private _inventoryUserAction: InventoryUsersActions,
  ) {
    this._store.dispatch(this._inventoryAction.GetStock());
    this._store.dispatch(this._inventoryUserAction.getAllUsers());
  }

  public ngOnChanges(changes: SimpleChanges): void {
//
  }

  public ngOnInit() {
    this.stockList$ = this._store
      .select(p => p.inventory.stocksList && p.inventory.stocksList.results);

    this.userList$ = this._store
      .select(p => p.inventoryInOutState.inventoryUsers && p.inventoryInOutState.inventoryUsers);
  }

  public onCancel() {
    this.view = '';
  }

  public closeAsidePane(event?) {
    this.closeAsideEvent.emit();
    this.view = '';
  }

  public onSave(entry: InventoryEntry) {
    console.log(entry);
    this._store.dispatch(this._inventoryEntryAction.addNewEntry(entry));
  }
}
