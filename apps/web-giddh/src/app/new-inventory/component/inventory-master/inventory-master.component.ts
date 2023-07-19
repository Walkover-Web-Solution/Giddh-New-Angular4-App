import { Component, OnDestroy, OnInit } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
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
    public config: PerfectScrollbarConfigInterface = { suppressScrollX: false, suppressScrollY: false };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public inventoryType: string = '';
    public topLevelGroups: any = { page: 1, results: [] };
    public masterColumnsData: any[] = [];
    public breadcrumbs: any[] = [];
    public showCreateButtons: boolean = true;
    public createUpdateGroup: boolean = false;
    public createUpdateStock: boolean = false;
    public isTopLevel: boolean = true;
    public currentGroup: any = {};
    public currentStock: any = {};
    public activeIndex: number = 0;
    public isSearching: boolean = false;
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

    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (this.inventoryType !== params.type) {
                this.inventoryType = params.type?.toUpperCase();
                this.getTopLevelGroups();
            }
        });

        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (!this.isSearching && event && event?.getDataLength() - event?.getRenderedRange().end < 50) {
                console.log(event);
            }
        });

        this.searchFormControl.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            this.isSearching = (String(search)?.trim()) ? true : false;

            if (this.isSearching) {
                this.searchInventory(search);
            } else {
                this.masterColumnsData = [];
            }
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getTopLevelGroups(): void {
        if (this.topLevelGroups?.page === 1) {
            this.topLevelGroups = { page: 1, results: [] };
        }
        this.resetCurrentStockAndGroup();
        this.inventoryService.getTopLevelGroups(this.inventoryType).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.topLevelGroups = response.body;
            }
        });
    }

    public getMasters(stockGroup: any, currentIndex: number, isRefresh: boolean = false, isLoadMore: boolean = false): void {
        if (!stockGroup) {
            return;
        }
        this.resetCurrentStockAndGroup();
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
            this.createBreadcrumbs();
        });

        this.createUpdateGroup = false;
        setTimeout(() => {
            this.editGroup(stockGroup);
        }, 50);
    }

    public searchInventory(search: string): void {
        this.breadcrumbs = [];
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

    public createBreadcrumbs(): void {
        this.breadcrumbs = [];

        this.masterColumnsData?.forEach(data => {
            this.breadcrumbs.push(data?.stockGroup?.name);
        });

        if (this.currentStock?.name) {
            this.breadcrumbs.push(this.currentStock?.name);
        }
    }

    public resetCurrentStockAndGroup(): void {
        this.currentGroup = {};
        this.currentStock = {};
        this.createUpdateStock = false;
        this.createUpdateGroup = false;
    }

    public editStock(masterData: any): void {
        this.resetCurrentStockAndGroup();
        this.currentStock = masterData;
        this.showCreateButtons = false;
        this.createUpdateStock = true;
        this.createBreadcrumbs();
    }

    public editGroup(masterData: any): void {
        this.resetCurrentStockAndGroup();
        this.currentGroup = masterData;
        this.showCreateButtons = false;
        this.createUpdateGroup = true;
        this.createBreadcrumbs();
    }

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

    public showCreateStock(): void {
        this.resetCurrentStockAndGroup();
        this.showCreateButtons = false;
        this.createUpdateGroup = false;
        this.createUpdateStock = true;
        this.createBreadcrumbs();
    }
}