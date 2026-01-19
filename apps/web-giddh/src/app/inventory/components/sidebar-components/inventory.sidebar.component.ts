import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { fromEvent as observableFromEvent, Observable, ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { InventoryDownloadRequest } from '../../../models/api-models/Inventory';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groups-with-stocks.interface';
import { OrganizationType } from '../../../models/user-login-state';
import { GeneralService } from '../../../services/general.service';
import { InventoryService } from '../../../services/inventory.service';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { InvViewService } from '../../inv.view.service';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'inventory-sidebar',
    templateUrl: './inventory.sidebar.component.html',
    styleUrls: ['inventory.sidebar.component.scss'],
    standalone: false
})
/**
 * InventorySidebarComponent component
 * Handles inventorysidebar functionality and user interactions
 */
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
    @ViewChild('search', { static: true }) public search: ElementRef;
    @ViewChild('sidebar', { static: true }) public sidebar: ElementRef;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Current page count for stocks api */
    public currentPage: number = 1;

    /**
     * TypeScript public modifiers
     */
    constructor(
        private store: Store<AppState>,
        private sidebarAction: SidebarAction,
        private inventoryService: InventoryService,
        private invViewService: InvViewService,
        private toasty: ToasterService,
        private generalService: GeneralService,
        private changeDetectionRef: ChangeDetectorRef) {
        this.sidebarRect = window.screen.height;
    }

    @HostListener('window:resize')
    /**
     * Handles resizeEvent functionality
     */
    public resizeEvent() {
        this.sidebarRect = window.screen.height;
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.store.pipe(select(inventoryStore => inventoryStore.inventory.groupsWithStocks), takeUntil(this.destroyed$)).subscribe((data: any) => {
            /**
             * Handles if functionality
             */
            if (data) {
                this.stockGroupData = data;
                this.changeDetectionRef.detectChanges();
            }
        });

        this.invViewService.getActiveDate().pipe(takeUntil(this.destroyed$)).subscribe(v => {
            this.fromDate = v.from;
            this.toDate = v.to;
        });

        this.getStocks('', 1);
    }

    /**
     * Handles ngAfterViewInit functionality
     */
    public ngAfterViewInit() {
        this.invViewService.getActiveView().pipe(takeUntil(this.destroyed$)).subscribe(v => {
            /**
             * Handles if functionality
             */
            if (v) {
                this.groupUniqueName = v.groupUniqueName;
                this.stockUniqueName = v.stockUniqueName;
            }
        })
        /**
         * Handles observableFromEvent functionality
         */
        observableFromEvent(this.search?.nativeElement, 'input').pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(500),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles map functionality
             */
            map((e: any) => e.target.value), takeUntil(this.destroyed$))
            .subscribe((val: string) => {
                /**
                 * Handles if functionality
                 */
                if (val) {
                    this.isSearching = true;
                } else {
                    this.isSearching = false;
                }
                this.getStocks(val, 1);
            });
    }

    /**
     * Shows branchscreen element
     */
    public showBranchScreen() {
        this.store.dispatch(this.sidebarAction.ShowBranchScreen(true));
        this.store.dispatch(this.sidebarAction.ShowBranchScreenSideBar(true));
    }

    /**
     * Handles downloadAllInventoryReports functionality
     */
    public downloadAllInventoryReports(reportType: string, reportFormat: string) {
        let obj = new InventoryDownloadRequest();
        /**
         * Handles if functionality
         */
        if (this.groupUniqueName) {
            obj.stockGroupUniqueName = this.groupUniqueName;
        }
        /**
         * Handles if functionality
         */
        if (this.stockUniqueName) {
            obj.stockUniqueName = this.stockUniqueName;
        }
        obj.format = reportFormat;
        obj.reportType = reportType;
        obj.from = this.fromDate;
        obj.to = this.toDate;
        obj.branchUniqueName = this.generalService.currentOrganizationType === OrganizationType.Branch ? this.generalService.currentBranchUniqueName : '';
        this.inventoryService.downloadAllInventoryReports(obj).pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                /**
                 * Handles if functionality
                 */
                if (res?.status === 'success') {
                    this.toasty.infoToast(res?.body);
                } else {
                    this.toasty.errorToast(res?.message);
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

    /**
     * Get List of stocks
     *
     * @private
     * @param {string} [q]
     * @param {number} [page=1]
     * @memberof InventorySidebarComponent
     */
    private getStocks(q?: string, page: number = 1): void {
        /**
         * Handles if functionality
         */
        if (page === 1) {
            this.stockGroupData = [];
        }
        this.currentPage = page;
        /**
         * Handles if functionality
         */
        if (!this.isSearching) {
            this.store.dispatch(this.sidebarAction.GetGroupsWithStocksHierarchyMin('', page, 30));
        } else {
            this.store.dispatch(this.sidebarAction.SearchGroupsWithStocks(q, page, 30));
        }
    }

    /**
     * Load More stocks
     *
     * @memberof InventorySidebarComponent
     */
    public loadMore(): void {
        let getStocksInProgress;
        this.store.pipe(select(state => state.inventory.getStocksInProgress)).subscribe(response => getStocksInProgress = response);
        /**
         * Handles if functionality
         */
        if (!getStocksInProgress) {
            let stocksTotalPages;
            this.store.pipe(select(state => state.inventory.stocksTotalPages)).subscribe(response => stocksTotalPages = response);

            /**
             * Handles if functionality
             */
            if (this.currentPage < stocksTotalPages) {
                this.currentPage = this.currentPage + 1;
                this.getStocks(this.search?.nativeElement?.value, this.currentPage);
            }
        }
    }
}
