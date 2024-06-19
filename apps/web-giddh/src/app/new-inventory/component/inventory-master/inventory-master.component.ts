import { Component, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject } from "rxjs";
import { InventoryService } from "../../../services/inventory.service";
import { debounceTime, distinctUntilChanged, takeUntil } from "rxjs/operators";
import { ActivatedRoute } from "@angular/router";
import { ScrollDispatcher } from "@angular/cdk/scrolling";
import { UntypedFormControl } from "@angular/forms";
import { cloneDeep } from "../../../lodash-optimized";
import { MatDialog } from "@angular/material/dialog";
import { ExportInventoryMasterComponent } from "../export-inventory-master/export-inventory-master.component";

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
    public searchFormControl = new UntypedFormControl();
    /** Holds active parent group */
    public parentGroup: any = {};
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** False if we did not need to show Export button */
    public showExportButton: boolean = true;

    constructor(
        private inventoryService: InventoryService,
        private route: ActivatedRoute,
        private scrollDispatcher: ScrollDispatcher,
        public dialog: MatDialog
    ) {

    }

    /**
     * Lifecycle hook for init component
     *
     * @memberof InventoryMasterComponent
     */
    public ngOnInit(): void {
        this.showExportButton = true;
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (this.inventoryType !== params.type) {
                this.inventoryType = params.type?.toUpperCase();
                if (this.inventoryType === 'FIXEDASSETS') {
                    this.inventoryType = 'FIXED_ASSETS';
                }

                this.getTopLevelGroups();
                this.masterColumnsData = [];
                this.breadcrumbs = [];
                this.resetCurrentStockAndGroup();
                this.showCreateButtons = false;
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
        if(stockGroup.entity === 'STOCK_GROUP') {
            this.showExportButton = true;
        }
        if (!stockGroup?.uniqueName) {
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
                        this.masterColumnsData[newIndex] = { results: response?.body?.results, page: response?.body?.page, totalPages: response?.body?.totalPages, stockGroup: stockGroup, parentName: stockGroup?.name, parentUniqueName: stockGroup?.uniqueName };
                    } else {
                        this.masterColumnsData[currentIndex].page = response?.body?.page;
                        this.masterColumnsData[currentIndex].totalPages = response?.body?.totalPages;
                        this.masterColumnsData[currentIndex].stockGroup = stockGroup;
                        this.masterColumnsData[currentIndex].results = response?.body?.results;
                        this.masterColumnsData[currentIndex].parentName = stockGroup?.name;
                        this.masterColumnsData[currentIndex].parentUniqueName = stockGroup?.uniqueName;
                    }

                    setTimeout(() => {
                        this.scrollToRight();
                    });
                } else {
                    this.masterColumnsData[currentIndex].page = response?.body?.page;
                    this.masterColumnsData[currentIndex].results = this.masterColumnsData[currentIndex].results.concat(response?.body?.results);
                }
            }
            this.loadMoreInProgress = false;
            if (!this.isSearching) {
                this.createBreadcrumbs();
            }
        });

        if (!isLoadMore) {
            this.createUpdateGroup = false;
            setTimeout(() => {
                this.editGroup(stockGroup, currentIndex);
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
                if (this.masterColumnsData?.length && this.masterColumnsData[this.masterColumnsData.length - 1] && this.masterColumnsData[this.masterColumnsData.length - 1]?.results?.length) {
                    if (this.masterColumnsData[this.masterColumnsData.length - 1]?.results[0]?.entity === "STOCK") {
                        this.editStock(this.masterColumnsData[this.masterColumnsData.length - 1]?.results[0], this.masterColumnsData.length - 1);
                    } else {
                        this.editGroup(this.masterColumnsData[this.masterColumnsData.length - 1]?.results[0], this.masterColumnsData.length - 1);
                    }
                }

                setTimeout(() => {
                    this.scrollToRight();
                });
            }
        });
    }

    /**
     * Scrolls to the rightmost column after searching to show highlighted element
     *
     * @private
     * @memberof InventoryMasterComponent
     */
    private scrollToRight(): void {
        let element = document.querySelector('#horizontal-scroll');
        if (element) {
            element.scrollLeft = element.scrollWidth;
        }
    }

    /**
     * Maps search inventory response and converts into master column data
     *
     * @param {*} master
     * @param {*} index
     * @param {*} masterColumnsData
     * @param {*} [parentName=null]
     * @param {*} [parentUniqueName=null]
     * @returns
     * @memberof InventoryMasterComponent
     */
    public mapNestedGroupsStocks(master, index, masterColumnsData, parentName = null, parentUniqueName = null) {
        master?.forEach(data => {
            const item = {
                name: data?.name,
                entity: data?.entity,
                uniqueName: data?.uniqueName,
                parentName: parentName,
                parentUniqueName: parentUniqueName
            };

            if (masterColumnsData[index]) {
                masterColumnsData[index].results.push(item);
            } else {
                masterColumnsData[index] = {
                    results: [item],
                    page: 1,
                    totalPages: 1,
                    stockGroup: {},
                };
            }

            if (data?.stockGroups?.length) {
                this.mapNestedGroupsStocks(
                    data?.stockGroups,
                    index + 1,
                    masterColumnsData,
                    data?.name,
                    data?.uniqueName
                );
            }

            if (data?.stocks?.length) {
                this.mapNestedGroupsStocks(
                    data?.stocks,
                    index + 1,
                    masterColumnsData,
                    data?.name,
                    data?.uniqueName
                );
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
            this.breadcrumbs.push(this.commonLocaleData?.app_create_group);
        }

        if (this.createUpdateStock && !this.currentStock?.uniqueName) {
            this.breadcrumbs.push(this.commonLocaleData?.app_create_stock);
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
    public editStock(masterData: any, index: number): void {
        if(masterData.entity === 'STOCK') {
            this.showExportButton = false;
        }
        this.masterColumnsData = this.masterColumnsData.slice(0, index + 1);
        this.isTopLevel = false;
        this.resetCurrentStockAndGroup();
        this.currentStock = masterData;
        this.showCreateButtons = false;
        this.createUpdateStock = false;
        if (this.isSearching) {
            this.createBreadcrumbFromParentGroups(masterData, index);
        } else {
            this.createBreadcrumbs();
        }
        setTimeout(() => {
            this.createUpdateStock = true;
        });
    }

    /**
     * Opens edit group
     *
     * @param {*} masterData
     * @memberof InventoryMasterComponent
     */
    public editGroup(masterData: any, index): void {
        if (index === -1) {
            this.isTopLevel = true;
        } else {
            this.isTopLevel = false;
        }
        this.resetCurrentStockAndGroup();
        this.currentGroup = masterData;
        this.showCreateButtons = false;
        this.createUpdateGroup = true;
        if (this.isSearching) {
            this.createBreadcrumbFromParentGroups(masterData, index);
        } else {
            this.createBreadcrumbs();
        }
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
        if (this.isSearching) {
            this.searchInventory(this.searchFormControl.value);
        } else {
            this.showCreateButtons = false;

            if (this.isTopLevel) {
                this.breadcrumbs = [];
                this.getTopLevelGroups();

                if (event) {
                    this.createUpdateGroup = true;
                } else {
                    this.masterColumnsData = [];
                }
            } else {
                let createUpdateGroup = false;
                if (!this.currentGroup?.uniqueName || !event) {
                    createUpdateGroup = false;
                } else {
                    createUpdateGroup = true;
                }

                const currentGroup = cloneDeep(this.currentGroup);

                if (!createUpdateGroup) {
                    this.getMasters(this.masterColumnsData[this.activeIndex]?.stockGroup, this.activeIndex - 1);
                } else {
                    this.masterColumnsData[this.activeIndex].page = 0;
                    this.masterColumnsData[this.activeIndex].results = [];
                    this.getMasters(this.masterColumnsData[this.activeIndex]?.stockGroup, this.activeIndex, false, true);
                }

                if (this.activeIndex <= 1) {
                    this.getTopLevelGroups();
                }

                this.currentGroup = currentGroup;
                this.createUpdateGroup = createUpdateGroup;
            }
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
            this.parentGroup = {};
            this.breadcrumbs = [];
        } else if (this.isSearching && this.masterColumnsData[this.activeIndex - 1] && this.masterColumnsData[this.activeIndex - 1]?.results?.length === 1) {
            this.createBreadcrumbFromParentGroups(this.masterColumnsData[this.activeIndex - 1]?.results[0], this.activeIndex - 1);
            this.breadcrumbs.push(this.commonLocaleData?.app_create_group);
            this.parentGroup = { name: this.masterColumnsData[this.activeIndex - 1]?.results[0].name, uniqueName: this.masterColumnsData[this.activeIndex - 1]?.results[0].uniqueName };
        } else {
            this.parentGroup = (!this.isTopLevel) ? this.masterColumnsData[this.activeIndex]?.stockGroup : null;
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

        if (this.isSearching && this.masterColumnsData[this.activeIndex - 1] && this.masterColumnsData[this.activeIndex - 1]?.results?.length === 1) {
            this.createBreadcrumbFromParentGroups(this.masterColumnsData[this.activeIndex - 1]?.results[0], this.activeIndex - 1);
            this.breadcrumbs.push(this.commonLocaleData?.app_create_stock);
            this.parentGroup = { name: this.masterColumnsData[this.activeIndex - 1]?.results[0].name, uniqueName: this.masterColumnsData[this.activeIndex - 1]?.results[0].uniqueName };
        } else {
            this.parentGroup = this.masterColumnsData[this.activeIndex]?.stockGroup;
            this.createBreadcrumbs();
        }
    }

    /**
     * Creates breadcrumb when searching
     *
     * @param {*} masterData
     * @param {number} index
     * @memberof InventoryMasterComponent
     */
    public createBreadcrumbFromParentGroups(masterData: any, index: number): void {
        if (!masterData?.parentUniqueName && index >= 0) {
            masterData.parentName = this.masterColumnsData[index].parentName;
            masterData.parentUniqueName = this.masterColumnsData[index].parentUniqueName;
        }
        if (masterData?.parentUniqueName) {
            let breadcrumbs = [];
            breadcrumbs.push(masterData?.name);

            for (let i = index - 1; i >= 0; i--) {
                let parentGroup = this.masterColumnsData[i]?.results?.filter(parent => parent.uniqueName === masterData?.parentUniqueName);
                if (parentGroup?.length) {
                    breadcrumbs.push(parentGroup[0]?.name);
                    masterData = parentGroup[0];
                }
            }

            breadcrumbs.reverse();
            this.breadcrumbs = breadcrumbs;
        } else {
            let breadcrumbs = [];
            breadcrumbs.push(masterData?.name);
            this.breadcrumbs = breadcrumbs;
        }
    }

    /**
     * Export inventory master detail
     *
     * @memberof InventoryMasterComponent
     */
    public exportInventoryMaster(): void {
        const exportData = {
            exportType: "INVENTORY_EXPORT",
            groupUniqueNames: this.currentGroup?.uniqueName ? [this.currentGroup.uniqueName] : [],
            fileType: "CSV",
            commonLocaleData: this.commonLocaleData,
            localeData: this.localeData
        }

        this.dialog.open(ExportInventoryMasterComponent, {
            width: "750px",
            data: exportData
        })
    }
}