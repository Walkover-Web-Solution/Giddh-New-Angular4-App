import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { fromEvent as observableFromEvent, Observable, ReplaySubject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';

import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { InventoryDownloadRequest } from '../../../models/api-models/Inventory';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { InventoryService } from '../../../services/inventory.service';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { InvViewService } from '../../inv.view.service';

@Component({
	selector: 'inventory-sidebar',  // <home></home>
	templateUrl: './inventory.sidebar.component.html',
	styleUrls: ['inventory.sidebar.component.scss']
})
export class InventorySidebarComponent implements OnInit, OnDestroy, AfterViewInit {
	public groupsWithStocks$: Observable<IGroupsWithStocksHierarchyMinItem[]>;
	public sidebarRect: any;
	public isSearching: boolean = false;
	public groupUniqueName: string;
	public stockUniqueName: string;
	public fromDate: string;
	public toDate: string;
	/** Stores data related to stock group for inventory module */
	public stockGroupData: Array<any>;
	@ViewChild('search') public search: ElementRef;
	@ViewChild('sidebar') public sidebar: ElementRef;
	private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

	/**
	 * TypeScript public modifiers
	 */
	constructor(private store: Store<AppState>, private sidebarAction: SidebarAction, private inventoryAction: InventoryAction, private router: Router,
		private inventoryService: InventoryService,
		private invViewService: InvViewService,
		private _toasty: ToasterService) {
		this.store.pipe(select(inventoryStore => inventoryStore.inventory.groupsWithStocks),takeUntil(this.destroyed$)).subscribe((data: any) => {
			this.stockGroupData = data;
		});
		this.sidebarRect = window.screen.height;
	}

	@HostListener('window:resize')
	public resizeEvent() {
		this.sidebarRect = window.screen.height;
	}

	// @HostListener('window:load', ['$event'])

	public ngOnInit() {
		this.invViewService.getActiveDate().pipe(takeUntil(this.destroyed$)).subscribe(v => {
			this.fromDate = v.from;
			this.toDate = v.to;
		});

		this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin());
	}

	public ngAfterViewInit() {
		this.invViewService.getActiveView().subscribe(v => {
			this.groupUniqueName = v.groupUniqueName;
			this.stockUniqueName = v.stockUniqueName;
		})
		observableFromEvent(this.search.nativeElement, 'input').pipe(
			debounceTime(500),
			distinctUntilChanged(),
			map((e: any) => e.target.value))
			.subscribe((val: string) => {
				if (val) {
					this.isSearching = true;
				}
				this.store.dispatch(this.sidebarAction.SearchGroupsWithStocks(val));
			});
	}

	public showBranchScreen() {
		// this.store.dispatch(this.inventoryAction.ResetInventoryState());
		this.store.dispatch(this.sidebarAction.ShowBranchScreen(true));
		this.store.dispatch(this.sidebarAction.ShowBranchScreenSideBar(true));
		// this.router.navigate(['inventory']);
	}

	public downloadAllInventoryReports(reportType: string, reportFormat: string) {
		let obj = new InventoryDownloadRequest();
		if (this.groupUniqueName) {
			obj.stockGroupUniqueName = this.groupUniqueName;
		}
		if (this.stockUniqueName) {
			obj.stockUniqueName = this.stockUniqueName;
		}
		obj.format = reportFormat;
		obj.reportType = reportType;
		obj.from = this.fromDate;
		obj.to = this.toDate;
		this.inventoryService.downloadAllInventoryReports(obj)
			.subscribe(res => {
				if (res.status === 'success') {
					this._toasty.infoToast(res.body);
				} else {
					this._toasty.errorToast(res.message);
				}
			});
	}

	/**
	 * Unsubscribe to all subscriptions
	 *
	 * @memberof InventorySidebarComponent
	 */
	public ngOnDestroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
	}
}
