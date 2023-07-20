import { Component, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { InventoryService } from "../../../services/inventory.service";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { ScrollDispatcher } from "@angular/cdk/scrolling";
import { FormControl } from "@angular/forms";
import { cloneDeep } from "../../../lodash-optimized";

@Component({
    selector: "inventory-master",
    templateUrl: "./inventory-master.component.html",
    styleUrls: ["./inventory-master.component.scss"]
})
export class InventoryMasterComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Inventory type */
    public inventoryType: string = '';
    /** Holds top level groups */
    public topLevelGroups: any = { page: 1, results: [] };
    /** Holds master columns data */
    public masterColumnsData: any[] = [];
    /** Holds breadcrumbs */
    public breadcrumbs: any[] = [];
    /** True if we need to show create stock/group buttons */
    public showCreateButtons: boolean = false;
    /** True if we need to show create/update group component */
    public createUpdateGroup: boolean = false;
    /** True if we need to show create/update stock component */
    public createUpdateStock: boolean = false;
    /** True if clicked group is of top level */
    public isTopLevel: boolean = true;
    /** Holds current group object */
    public currentGroup: any = {};
    /** Holds current stock object */
    public currentStock: any = {};
    /** Holds active index */
    public activeIndex: number = 0;
    /** True if search in progress */
    public isSearching: boolean = false;
    /** True if load more in progress */
    public loadMoreInProgress: boolean = false;
    /** Search field form control */
    public searchFormControl = new FormControl();
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private inventoryService: InventoryService,
        private route: ActivatedRoute,
        private scrollDispatcher: ScrollDispatcher
    ) {

    }

    /**
     * Lifecycle hook for init component
     *
     * @memberof InventoryMasterComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (this.inventoryType !== params.type) {
                this.inventoryType = params.type?.toUpperCase();
                this.getTopLevelGroups();
            }
        });

        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (!this.isSearching && event && event?.getDataLength() - event?.getRenderedRange().end < 50) {
                if (!this.loadMoreInProgress) {
                    let elementId = event?.elementRef?.nativeElement?.id;
                    if (elementId > 0) {
                        elementId = elementId - 1; // since 2nd level of inventory start from 0, so we are decreasing count by 1
                        if (this.masterColumnsData[elementId]?.page < this.masterColumnsData[elementId]?.totalPages) {
                            this.loadMoreInProgress = true;
                            this.getMasters(this.masterColumnsData[elementId]?.stockGroup, elementId, false, true);
                        }
                    } else if (this.topLevelGroups?.page < this.topLevelGroups?.totalPages) {
                        this.loadMoreInProgress = true;
                        this.topLevelGroups.page++;
                        this.getTopLevelGroups();
                    }
                }
            }
        });

        this.searchFormControl.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            const wasSearching = cloneDeep(this.isSearching);
            this.isSearching = (String(search)?.trim()) ? true : false;

            if (this.isSearching) {
                this.searchInventory(search);
            } else {
                if (wasSearching) {
                    this.breadcrumbs = [];
                    this.resetCurrentStockAndGroup();
                    this.showCreateButtons = false;
                }
                this.masterColumnsData = [];
            }
        });
    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof InventoryMasterComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Get top level groups
     *
     * @memberof InventoryMasterComponent
     */
    public getTopLevelGroups(): void {
        if (this.topLevelGroups?.page === 1) {
            this.topLevelGroups = { page: 1, results: [] };
            this.resetCurrentStockAndGroup();
        }
        this.inventoryService.getTopLevelGroups(this.inventoryType, String(this.topLevelGroups?.page)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.topLevelGroups.totalPages = response?.body?.totalPages;
                this.topLevelGroups.results = this.topLevelGroups.results.concat(response.body?.results);
            }
            this.loadMoreInProgress = false;
        });
    }

    /**
     * Get master stocks/groups
     *
     * @param {*} stockGroup
     * @param {number} currentIndex
     * @param {boolean} [isRefresh=false]
     * @param {boolean} [isLoadMore=false]
     * @returns {void}
     * @memberof InventoryMasterComponent
     */
    public getMasters(stockGroup: any, currentIndex: number, isRefresh: boolean = false, isLoadMore: boolean = false): void {
        if (!stockGroup) {
            return;
        }
        if (!isLoadMore) {
            this.resetCurrentStockAndGroup();
        }
        const page = (isLoadMore) ? (Number(this.masterColumnsData[currentIndex]?.page) + 1) : 1;
        this.inventoryService.getMasters(stockGroup?.uniqueName, String(page)).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                if (!isLoadMore) {
                    if (!isRefresh) {
                        let newIndex = Number(currentIndex) + 1;
                        this.masterColumnsData = this.masterColumnsData.slice(0, newIndex);
                        this.masterColumnsData[newIndex] = { results: response?.body?.results, page: response?.body?.page, totalPages: response?.body?.totalPages, stockGroup: stockGroup };
                    } else {
                        this.masterColumnsData[currentIndex].page = response?.body?.page;
                        this.masterColumnsData[currentIndex].totalPages = response?.body?.totalPages;
                        this.masterColumnsData[currentIndex].stockGroup = stockGroup;
                        this.masterColumnsData[currentIndex].results = response?.body?.results;
                    }
                } else {
                    this.masterColumnsData[currentIndex].page = response?.body?.page;
                    this.masterColumnsData[currentIndex].results = this.masterColumnsData[currentIndex].results.concat(response?.body?.results);
                }
            }
            this.loadMoreInProgress = false;
            this.createBreadcrumbs();
        });

        if (!isLoadMore) {
            this.createUpdateGroup = false;
            setTimeout(() => {
                this.editGroup(stockGroup);
            }, 50);
        }
    }

    /**
     * Search inventory
     *
     * @param {string} search
     * @memberof InventoryMasterComponent
     */
    public searchInventory(search: string): void {
        this.breadcrumbs = [];
        this.masterColumnsData = [];
        this.resetCurrentStockAndGroup();
        this.showCreateButtons = false;

        this.inventoryService.searchInventory(this.inventoryType, search).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                let masterColumnsData = [];
                if (response?.body?.length > 0) {
                    masterColumnsData = this.mapNestedGroupsStocks(response?.body, 0, masterColumnsData);
                    masterColumnsData?.map(columnData => {
                        columnData.results = columnData?.results.sort((a, b) => b.entity.localeCompare(a.entity));
                        return columnData;
                    });
                }
                this.masterColumnsData = cloneDeep(masterColumnsData);
            }
        });
    }

    /**
     * Maps search inventory response and converts into master column data
     *
     * @param {*} master
     * @param {number} index
     * @param {*} masterColumnsData
     * @returns {*}
     * @memberof InventoryMasterComponent
     */
    public mapNestedGroupsStocks(master: any, index: number, masterColumnsData: any): any {
        master?.forEach(data => {
            if (masterColumnsData[index]) {
                masterColumnsData[index].results.push({ name: data?.name, entity: data?.entity, uniqueName: data?.uniqueName });
            } else {
                masterColumnsData[index] = { results: [{ name: data?.name, entity: data?.entity, uniqueName: data?.uniqueName }], page: 1, totalPages: 1, stockGroup: {} };
            }

            if (data?.stockGroups?.length) {
                masterColumnsData = this.mapNestedGroupsStocks(data?.stockGroups, (index + 1), masterColumnsData);
            }

            if (data?.stocks?.length) {
                masterColumnsData = this.mapNestedGroupsStocks(data?.stocks, (index + 1), masterColumnsData);
            }
        });

        return masterColumnsData;
    }

    /**
     * Creats breadcrumb
     *
     * @memberof InventoryMasterComponent
     */
    public createBreadcrumbs(): void {
        this.breadcrumbs = [];

        this.masterColumnsData?.forEach(data => {
            if (data?.stockGroup?.name) {
                this.breadcrumbs.push(data?.stockGroup?.name);
            }
        });

        if (this.currentStock?.name) {
            this.breadcrumbs.push(this.currentStock?.name);
        }

        if (this.createUpdateGroup && !this.currentGroup?.uniqueName) {
            this.breadcrumbs.push("Create Group");
        }

        if (this.createUpdateStock && !this.currentStock?.uniqueName) {
            this.breadcrumbs.push("Create Stock");
        }
    }

    /**
     * Resets current stock/group
     *
     * @memberof InventoryMasterComponent
     */
    public resetCurrentStockAndGroup(): void {
        this.currentGroup = {};
        this.currentStock = {};
        this.createUpdateStock = false;
        this.createUpdateGroup = false;
    }

    /**
     * Opens edit stock
     *
     * @param {*} masterData
     * @memberof InventoryMasterComponent
     */
    public editStock(masterData: any): void {
        this.resetCurrentStockAndGroup();
        this.currentStock = masterData;
        this.showCreateButtons = false;
        this.createUpdateStock = true;
        this.createBreadcrumbs();
    }

    /**
     * Opens edit group
     *
     * @param {*} masterData
     * @memberof InventoryMasterComponent
     */
    public editGroup(masterData: any): void {
        this.resetCurrentStockAndGroup();
        this.currentGroup = masterData;
        this.showCreateButtons = false;
        this.createUpdateGroup = true;
        this.createBreadcrumbs();
    }

    /**
     * Closes stock create/edit
     *
     * @param {*} event
     * @memberof InventoryMasterComponent
     */
    public closeStock(event: any): void {
        this.showCreateButtons = false;
        this.createUpdateStock = false;

        if (!event) {
            this.getMasters(this.masterColumnsData[this.activeIndex]?.stockGroup, this.activeIndex - 1);
        } else {
            this.resetCurrentStockAndGroup();
            this.createBreadcrumbs();
        }
    }

    /**
     * Closes group create/edit
     *
     * @param {*} event
     * @memberof InventoryMasterComponent
     */
    public closeGroup(event: any): void {
        this.showCreateButtons = false;
        this.createUpdateGroup = false;

        if (!event) {
            if (this.isTopLevel) {
                this.breadcrumbs = [];
                this.getTopLevelGroups();
                this.masterColumnsData = [];
            } else {
                this.getMasters(this.masterColumnsData[this.activeIndex]?.stockGroup, this.activeIndex - 1);
            }
        } else {
            this.resetCurrentStockAndGroup();
            this.createBreadcrumbs();
        }
    }

    /**
     * Shows create group
     *
     * @memberof InventoryMasterComponent
     */
    public showCreateGroup(): void {
        this.resetCurrentStockAndGroup();
        this.showCreateButtons = false;
        this.createUpdateStock = false;
        this.createUpdateGroup = true;

        if (this.isTopLevel) {
            this.breadcrumbs = [];
        } else {
            this.createBreadcrumbs();
        }
    }

    /**
     * Shows create stock
     *
     * @memberof InventoryMasterComponent
     */
    public showCreateStock(): void {
        this.resetCurrentStockAndGroup();
        this.showCreateButtons = false;
        this.createUpdateGroup = false;
        this.createUpdateStock = true;
        this.createBreadcrumbs();
    }
}