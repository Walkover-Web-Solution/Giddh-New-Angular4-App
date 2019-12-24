import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { InventoryUsersActions } from '../../../actions/inventory/inventory.users.actions';
import { IStocksItem } from '../../../models/interfaces/stocksItem.interface';
import { InventoryEntry, InventoryUser } from '../../../models/api-models/Inventory-in-out';
import { InventoryEntryActions } from '../../../actions/inventory/inventory.entry.actions';
import { GeneralService } from '../../../services/general.service';
import { StockUnitRequest } from '../../../models/api-models/Inventory';
import { CustomStockUnitAction } from '../../../actions/inventory/customStockUnit.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as _ from "../../../lodash-optimized";
import { CompanyResponse } from "../../../models/api-models/Company";
import { createSelector } from "reselect";
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';

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
	public branches$: Observable<CompanyResponse[]>;
	@Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
	@Output() public transferType: EventEmitter<boolean> = new EventEmitter(true);
	@Input() public selectedAsideView: string = 'mainview';
	public isLoading: boolean;
	public currentCompany: CompanyResponse;
	public entrySuccess$: Observable<boolean>;
	public transferEntrySuccess$: Observable<boolean>;
	public isSaveClicked: boolean = false;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private _store: Store<AppState>,
		private _inventoryAction: InventoryAction,
		private _inventoryEntryAction: InventoryEntryActions,
		private _generalService: GeneralService,
		private _inventoryUserAction: InventoryUsersActions,
		private _customStockActions: CustomStockUnitAction,
		private settingsBranchActions: SettingsBranchActions,
	) {
		this._store.dispatch(this._inventoryAction.GetStock());
		// dispatch stockunit request
		this._store.dispatch(this._customStockActions.GetStockUnit());
		this._store.dispatch(this._inventoryUserAction.getAllUsers());
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

		this.entrySuccess$.subscribe(s => {
			if (s && this.isSaveClicked) {
				this.closeAsidePane(s);
				this.isSaveClicked = false;
			}
		});

		// tslint:disable-next-line:no-shadowed-variable
		this._store.select(createSelector([(state: AppState) => state.settings.branches], (branches) => {
			if (branches && branches.results.length > 0) {
				_.each(branches.results, (branch) => {
					if (branch.addresses && branch.addresses.length) {
						branch.addresses = [_.find(branch.addresses, (gst) => gst.isDefault)];
					}
				});
				this.branches$ = observableOf(_.orderBy(branches.results, 'name'));
			} else if (branches && branches.results.length === 0) {
				this.branches$ = observableOf(null);
			}
		})).pipe(takeUntil(this.destroyed$)).subscribe();

		// tslint:disable-next-line:no-shadowed-variable
		this._store.pipe(select(createSelector([(state: AppState) => state.session.companies, (state: AppState) => state.session.companyUniqueName], (companies, uniqueName) => {
			if (!companies) {
				return;
			}
			return companies.find(cmp => {
				if (cmp && cmp.uniqueName) {
					return cmp.uniqueName === uniqueName;
				} else {
					return false;
				}
			});
		})), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
			if (selectedCmp) {
				this.currentCompany = selectedCmp;
			}
		});
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
}
