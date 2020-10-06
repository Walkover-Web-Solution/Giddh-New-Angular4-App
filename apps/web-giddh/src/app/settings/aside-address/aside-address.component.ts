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
  selector: 'aside-address',
  templateUrl: './aside-address.component.html',
  styleUrls: ['./aside-address.component.css']
})
export class AsideAddressComponent implements OnInit {


	@Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
	@Input() public selectedAsideView: string;
	public view = '';
	public isLoading: boolean;
	public createStockSuccess$: Observable<boolean>;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
	
	) {

	}

  public ngOnChanges(changes: SimpleChanges): void {
		//
	}

	public ngOnInit() {

	}

	public onCancel() {
		this.view = '';
		this.closeAsidePane();
	}

	public closeAsidePane(event?) {
		this.closeAsideEvent.emit();
		this.view = '';
	}




}
