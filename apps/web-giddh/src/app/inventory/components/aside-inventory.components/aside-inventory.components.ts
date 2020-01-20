import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, OnChanges, OnDestroy, OnInit, Output, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { Observable, ReplaySubject } from 'rxjs';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';

@Component({
	selector: 'aside-inventory-stock-group',
	styleUrls: [`./aside-inventory.components.scss`],
	templateUrl: './aside-inventory.components.html'
})
export class AsideInventoryComponent implements OnInit, OnChanges, OnDestroy {

	@Input() public autoFocus: boolean = false;
	@Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
	@Output() public animatePaneAside: EventEmitter<any> = new EventEmitter();
	// @Input() public openGroupPane: boolean;

	// public
	public isAddStockOpen: boolean = false;
	public isAddGroupOpen: boolean = false;
	public hideFirstStep: boolean = false;
	public openGroupAsidePane$: Observable<boolean>;
	public createGroupSuccess$: Observable<boolean>;
	public removeGroupSuccess$: Observable<boolean>;
	public removeStockSuccess$: Observable<boolean>;
	public UpdateGroupSuccess$: Observable<boolean>;
	public UpdateStockSuccess$: Observable<boolean>;
	public MoveStockSuccess$: Observable<boolean>;
	public manageInProcess$: Observable<any>;
	public addGroup: boolean;
	public addStock: boolean;
	public createStockSuccess$: Observable<boolean>;
	public autoFocusOnChild: boolean = false;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private store: Store<AppState>,
		private inventoryAction: InventoryAction
	) {
		this.openGroupAsidePane$ = this.store.select(s => s.inventory.showNewGroupAsidePane).pipe(takeUntil(this.destroyed$));
		this.createGroupSuccess$ = this.store.select(s => s.inventory.createGroupSuccess).pipe(takeUntil(this.destroyed$));
		this.manageInProcess$ = this.store.select(s => s.inventory.inventoryAsideState).pipe(takeUntil(this.destroyed$));
		this.createStockSuccess$ = this.store.select(s => s.inventory.createStockSuccess).pipe(takeUntil(this.destroyed$));
		this.removeStockSuccess$ = this.store.select(s => s.inventory.deleteStockSuccess).pipe(takeUntil(this.destroyed$));
		this.removeGroupSuccess$ = this.store.select(s => s.inventory.deleteGroupSuccess).pipe(takeUntil(this.destroyed$));
		this.UpdateStockSuccess$ = this.store.select(s => s.inventory.UpdateStockSuccess).pipe(takeUntil(this.destroyed$));
		this.UpdateGroupSuccess$ = this.store.select(s => s.inventory.UpdateGroupSuccess).pipe(takeUntil(this.destroyed$));
		this.MoveStockSuccess$ = this.store.select(s => s.inventory.moveStockSuccess).pipe(takeUntil(this.destroyed$));

	}

	public ngOnInit() {

		this.manageInProcess$.subscribe(s => {
			if (s.isOpen && s.isGroup) {
				this.isAddGroupOpen = true;
				this.isAddStockOpen = false;
				if (s.isUpdate) {
					this.addGroup = false;
				} else {
					this.addGroup = true;
				}
			} else if (s.isOpen && !s.isGroup) {
				this.isAddGroupOpen = false;
				this.isAddStockOpen = true;
				if (s.isUpdate) {
					this.addStock = false;
				} else {
					this.addStock = true;
				}
			}
		});

		this.createGroupSuccess$.subscribe(d => {
			if (d && this.isAddGroupOpen) {
				this.closeAsidePane();
			}
		});

		this.createStockSuccess$.subscribe(d => {
			if (d && this.isAddStockOpen) {
				this.closeAsidePane();
			}
		});

		// subscribe createStockSuccess for resting form
		this.removeStockSuccess$.subscribe(s => {
			if (s && this.isAddStockOpen) {
				this.closeAsidePane();
			}
		});

		this.removeGroupSuccess$.subscribe(s => {
			if (s && this.isAddGroupOpen) {
				this.closeAsidePane();
			}
		});

		this.UpdateStockSuccess$.subscribe(s => {
			if (s && this.isAddStockOpen) {
				this.closeAsidePane();
			}
		});

		this.UpdateGroupSuccess$.subscribe(s => {
			if (s && this.isAddGroupOpen) {
				this.closeAsidePane();
			}
		});

		this.MoveStockSuccess$.subscribe(s => {
			if (s && this.isAddStockOpen) {
				this.closeAsidePane();
			}
		});

	}

	public openGroupPane() {
		this.hideFirstStep = true;
		this.isAddStockOpen = false;
	}

	public openStockPane() {
		this.hideFirstStep = true;
		this.isAddStockOpen = true;
	}

	public closeAsidePane(e?: any) {
		this.hideFirstStep = false;
		this.isAddStockOpen = false;
		this.isAddGroupOpen = false;
		this.addGroup = false;
		this.addStock = false;
		if (e) {
			//
		} else {
			this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(false));
			this.closeAsideEvent.emit();
			let objToSend = { isOpen: false, isGroup: false, isUpdate: false };
			this.store.dispatch(this.inventoryAction.ManageInventoryAside(objToSend));
		}
	}

	public animateAside(e: any) {
		this.animatePaneAside.emit(e);
	}

	public ngOnChanges(c) {
		if (c.autoFocus && c.autoFocus.currentValue) {
			this.autoFocusOnChild = true;
		} else {
			this.autoFocusOnChild = false;
		}
	}

	public ngOnDestroy() {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}

}
