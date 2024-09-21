import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { CommonActions } from 'apps/web-giddh/src/app/actions/common.actions';
import { InventoryAction } from 'apps/web-giddh/src/app/actions/inventory/inventory.actions';
import { SettingsBranchActions } from 'apps/web-giddh/src/app/actions/settings/branch/settings.branch.action';
import { BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { cloneDeep, forEach } from 'apps/web-giddh/src/app/lodash-optimized';
import { MfStockSearchRequestClass } from 'apps/web-giddh/src/app/manufacturing/manufacturing.utility';
import { LinkedStocksResponse } from 'apps/web-giddh/src/app/models/api-models/BranchTransfer';
import { IMfStockSearchRequest } from 'apps/web-giddh/src/app/models/interfaces/manufacturing.interface';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { LedgerService } from 'apps/web-giddh/src/app/services/ledger.service';
import { ManufacturingService } from 'apps/web-giddh/src/app/services/manufacturing.service';
import { WarehouseActions } from 'apps/web-giddh/src/app/settings/warehouse/action/warehouse.action';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { AppState } from 'apps/web-giddh/src/app/store';
import * as dayjs from 'dayjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/internal/Observable';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'list-manufacturing',
    templateUrl: './list-manufacturing.component.html',
    styleUrls: ['./list-manufacturing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListManufacturingComponent implements OnInit {
    /** Instance of Mat Dialog for Advance Filter */
    @ViewChild("advanceFilterDialog") public advanceFilterComponent: TemplateRef<any>;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Table columns */
    public displayedColumns: string[] = ['date', 'voucher_no', 'stock', 'finished_variant', 'qty_outwards', 'qty_outwards_unit', 'raw_stock', 'raw_variant', 'qty_inwards', 'qty_inwards_unit', 'warehouse'];
    /** Holds list of data */
    public dataSource: any = [];
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Datepicker modal reference */
    public modalRef: BsModalRef;
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Manufacturing search request */
    public manufacturingSearchRequest: IMfStockSearchRequest = new MfStockSearchRequestClass();
    /** Instance of dayjs */
    public dayjs = dayjs;
    /* Universal date observer */
    public universalDate$: Observable<any>;
    /** Holds universal date */
    private universalDate: Date[];
    /** Clears all the memory leakes */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /* Stores warehouses for a company */
    public warehouses: Array<any> = [];
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Holds if report is loading */
    public isReportLoading: boolean = false;
    /** List of stocks */
    public stockList: any[] = [];
    /** List of variants */
    public variantList: any[] = [];
    /** Selected stock name */
    public selectedStockName: string = "";
    /** Selected variant name */
    public selectedVariantName: string = "";
    /** Selected branch name */
    public selectedBranchName: string = "";
    /** Selected warehouse name */
    public selectedWarehouseName: string = "";
    /** Selected operation name */
    public selectedOperationName: string = "";
    /** Selected filter by name */
    public selectedFilterByName: string = "";
    /** Selected inventory type name */
    public selectedInventoryTypeName: string = "";
    /** Total items count */
    public totalItems: number = 0;
    /** List of all warehouses */
    public allWarehouses: any[] = [];
    /** List of operator filters */
    public operatorFilters: any[] = [];
    /** List of search by filters */
    public searchByFilters: any[] = [];
    /** List of inventory type filters */
    public inventoryTypeFilters: any[] = [];
    /** True if need to show clear filter button */
    public showClearButton: boolean = false;
    /** Holds filters in store */
    private storeFilters: any;
    /** Hold current url */
    private currentUrl: string = "";
    /** True if initial load of store filters */
    private initialLoad: boolean = false;
    /** Holds Total Pages Count*/
    public totalPages:number = 1;
    /** Holds Current Page Number */
    public currentPage:number = 1;

    constructor(
        private dialog: MatDialog,
        private modalService: BsModalService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private warehouseAction: WarehouseActions,
        private changeDetectionRef: ChangeDetectorRef,
        private inventoryAction: InventoryAction,
        private settingsBranchAction: SettingsBranchActions,
        private manufacturingService: ManufacturingService,
        private ledgerService: LedgerService,
        private router: Router,
        private commonAction: CommonActions
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof ListManufacturingComponent
     */
    public ngOnInit(): void {
        this.currentUrl = this.router.url;
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.getWarehouses();

        this.manufacturingSearchRequest.count = this.paginationLimit;
        this.manufacturingSearchRequest.page = this.currentPage;

        if (this.currentOrganizationType === OrganizationType.Company) {
            this.getAllWarehouses();
        }

        // Refresh the manufactured stock list
        this.store.dispatch(this.inventoryAction.GetManufacturingStock());

        this.store.pipe(select(state => state.inventory.manufacturingStockList), takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response) {
                if (response.results) {
                    this.stockList = [];
                    forEach(response.results, (unit: any) => {
                        this.stockList.push({
                            label: ` ${unit.name} (${unit?.uniqueName})`,
                            value: unit?.uniqueName,
                            additional: unit.stockGroup
                        });
                    });
                }
            } else {
                this.store.dispatch(this.inventoryAction.GetManufacturingStock());
            }
        });

        this.store.pipe(select(state => state.session?.filters), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && !this.storeFilters?.length) {
                this.storeFilters = response;
                if (this.storeFilters[this.currentUrl]) {
                    this.initialLoad = true;
                    this.manufacturingSearchRequest = this.storeFilters[this.currentUrl].manufacturingSearchRequest;

                    this.selectedDateRange = { startDate: dayjs(this.manufacturingSearchRequest.from, GIDDH_DATE_FORMAT), endDate: dayjs(this.manufacturingSearchRequest.to, GIDDH_DATE_FORMAT) };
                    this.selectedDateRangeUi = dayjs(this.manufacturingSearchRequest.from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.manufacturingSearchRequest.to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);

                    this.selectedStockName = this.storeFilters[this.currentUrl].selectedStockName;
                    this.selectedVariantName = this.storeFilters[this.currentUrl].selectedVariantName;
                    this.selectedBranchName = this.storeFilters[this.currentUrl].selectedBranchName;
                    this.selectedWarehouseName = this.storeFilters[this.currentUrl].selectedWarehouseName;
                    this.selectedOperationName = this.storeFilters[this.currentUrl].selectedOperationName;
                    this.selectedFilterByName = this.storeFilters[this.currentUrl].selectedFilterByName;
                    this.selectedInventoryTypeName = this.storeFilters[this.currentUrl].selectedInventoryTypeName;

                    this.getReport();
                }
            }
        });

        // Refresh report data according to universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);
                setTimeout(() => {
                    if (!this.initialLoad) {
                        this.manufacturingSearchRequest.dateRange = this.universalDate;
                        this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                        this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                        this.manufacturingSearchRequest.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                        this.manufacturingSearchRequest.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                        this.getReport();
                    }

                    this.initialLoad = false;
                }, 1000);
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (!this.activeCompany) {
                this.activeCompany = activeCompany;

                this.store.pipe(select(state => state.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
                    if (response && response.length) {
                        this.currentCompanyBranches = response.map(branch => ({
                            label: branch?.name,
                            value: branch?.uniqueName,
                            name: branch?.name,
                            parentBranch: branch?.parentBranch
                        }));
                        this.currentCompanyBranches.unshift({
                            label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            name: this.activeCompany ? this.activeCompany.name : '',
                            value: this.activeCompany ? this.activeCompany.uniqueName : '',
                            isCompany: true
                        });
                        this.isCompany = this.currentOrganizationType === OrganizationType.Company && this.currentCompanyBranches?.length > 2;
                        let currentBranchUniqueName;
                        if (!this.currentBranch?.uniqueName) {
                            // Assign the current branch only when it is not selected. This check is necessary as
                            // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                            // branches are loaded
                            if (this.currentOrganizationType === OrganizationType.Branch) {
                                currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                                this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                            } else {
                                currentBranchUniqueName = this.activeCompany ? this.activeCompany?.uniqueName : '';
                                this.currentBranch = {
                                    name: this.activeCompany ? this.activeCompany.name : '',
                                    alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                                    uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
                                };

                                this.handleBranchChange({ label: this.currentBranch.name, value: this.currentBranch.uniqueName });
                            }
                        }

                        this.changeDetectionRef.detectChanges();
                    } else {
                        if (this.generalService.companyUniqueName) {
                            // Avoid API call if new user is onboarded
                            this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                        }
                    }
                });
            }
        });

        this.showHideClearFilterButton();
    }

    /**
     * Get warehouses
     *
     * @memberof ListManufacturingComponent
     */
    public getWarehouses(): void {
        this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));

        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses: any) => {
            if (warehouses?.results?.length) {
                this.warehouses = [];
                warehouses?.results?.forEach(warehouse => {
                    this.warehouses.push({ label: warehouse?.name, value: warehouse?.uniqueName });
                });
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     * Get stock variants
     *
     * @memberof ListManufacturingComponent
     */
    public getVariants(): void {
        this.variantList = [];
        this.selectedVariantName = "";
        this.ledgerService.loadStockVariants(this.manufacturingSearchRequest.product).pipe(takeUntil(this.destroyed$)).subscribe(variants => {
            if (variants?.length) {
                variants?.forEach(variant => {
                    this.variantList.push({ label: variant?.name, value: variant?.uniqueName });
                });

                if (variants?.length === 1) {
                    this.selectedVariantName = variants[0].name;
                    this.manufacturingSearchRequest.productVariant = variants[0].uniqueName;
                } else {
                    this.selectedVariantName = "";
                    this.manufacturingSearchRequest.productVariant = "";
                }
            }

            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Initiates search object
     *
     * @memberof ListManufacturingComponent
     */
    public initializeSearchReqObj(): void {
        this.manufacturingSearchRequest.product = '';
        this.manufacturingSearchRequest.productVariant = '';
        this.manufacturingSearchRequest.warehouseUniqueName = '';
        this.manufacturingSearchRequest.branchUniqueName = '';
        this.manufacturingSearchRequest.searchBy = '';
        this.manufacturingSearchRequest.searchOperation = '';
        this.manufacturingSearchRequest.searchValue = '';
        this.manufacturingSearchRequest.inventoryType = '';
        this.selectedBranchName = '';
        this.selectedStockName = "";
        this.selectedVariantName = "";
        this.selectedWarehouseName = "";
        this.selectedOperationName = "";
        this.selectedFilterByName = "";
        this.selectedInventoryTypeName = "";
        this.totalItems = 0;

        this.manufacturingSearchRequest.page = 1;
        this.manufacturingSearchRequest.count = this.paginationLimit;
        this.selectedDateRange = { startDate: dayjs(this.universalDate[0]), endDate: dayjs(this.universalDate[1]) };
        this.selectedDateRangeUi = dayjs(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
        this.manufacturingSearchRequest.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
        this.manufacturingSearchRequest.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);

        this.handleBranchChange({ label: this.currentBranch.name, value: this.currentBranch.uniqueName });
        this.getReport();
    }

    /**
     * Get manufacturing report
     *
     * @memberof ListManufacturingComponent
     */
    public getReport(): void {
        let data = cloneDeep(this.manufacturingSearchRequest);
        this.dataSource = [];
        this.isReportLoading = true;
        this.showHideClearFilterButton();
        this.setFiltersInStore();

        this.manufacturingService.GetMfReport(data).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.results?.length) {
                let reportData = [];

                this.totalItems = response.body.totalItems;
                this.totalPages = response.body.totalPages;

                response.body.results.forEach(item => {
                    reportData.push({
                        date: dayjs(item.date, GIDDH_DATE_FORMAT).format("DD MMM YY"),
                        voucher_no: item.voucherNumber,
                        stock: item.stockName,
                        variant: item.variant.name,
                        qty_outwards: item.manufacturingQuantity,
                        qty_outwards_unit: item.manufacturingUnitCode,
                        linkedStocks: item.linkedStocks,
                        warehouse: item.warehouse?.name,
                        uniqueName: item.uniqueName
                    });
                });

                this.dataSource = reportData;
            }

            this.isReportLoading = false;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Open advance filter modal
     *
     * @memberof ListManufacturingComponent
     */
    public openAdvanceFilterDialog(): void {
        this.dialog.open(this.advanceFilterComponent, {
            width: '500px',
            autoFocus: false,
            role: 'alertdialog',
            ariaLabel: 'Advance filter Dialog'
        });
    }

    /**
      * To show the datepicker
      *
      * @param {*} element
      * @memberof ListManufacturingComponent
      */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
      * This will hide the datepicker
      *
      * @memberof ListManufacturingComponent
      */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ListManufacturingComponent
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.manufacturingSearchRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.manufacturingSearchRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
     * Branch change callback
     *
     * @param {*} selectedEntity
     * @memberof ListManufacturingComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity?.label;
        this.selectedBranchName = selectedEntity?.label;
        this.manufacturingSearchRequest.branchUniqueName = selectedEntity?.value;
        this.manufacturingSearchRequest.warehouseUniqueName = "";
        this.selectedWarehouseName = "";
        if (this.currentOrganizationType === OrganizationType.Company && this.allWarehouses?.length) {
            this.warehouses = this.allWarehouses[selectedEntity?.value];
        }
    }

    /**
     * Get warehouses of all branches
     *
     * @memberof ListManufacturingComponent
     */
    public getAllWarehouses(): void {
        this.store.pipe(select(state => state.inventoryBranchTransfer.linkedStocks), takeUntil(this.destroyed$)).subscribe((branches: LinkedStocksResponse) => {
            if (branches) {
                if (branches.results?.length) {
                    this.allWarehouses = [];
                    branches.results.forEach(branch => {
                        if (!this.allWarehouses[branch?.uniqueName]) {
                            this.allWarehouses[branch?.uniqueName] = [];
                        }

                        if (branch?.warehouses?.length > 0) {
                            branch?.warehouses.forEach(warehouse => {
                                this.allWarehouses[branch?.uniqueName].push({ label: warehouse?.name, value: warehouse?.uniqueName, additional: warehouse?.taxNumber });
                            });
                        }
                    });
                    this.changeDetectionRef.detectChanges();
                }
            } else {
                this.store.dispatch(this.inventoryAction.GetAllLinkedStocks());
            }
        });
    }

    /**
     * Callback for translation complete
     *
     * @param {*} event
     * @memberof ListManufacturingComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.operatorFilters = [
                { label: this.commonLocaleData?.app_comparision_filters?.greater_than, value: 'greaterThan' },
                { label: this.commonLocaleData?.app_comparision_filters?.less_than, value: 'lessThan' },
                { label: this.commonLocaleData?.app_comparision_filters?.greater_than_equals, value: 'greaterThanOrEquals' },
                { label: this.commonLocaleData?.app_comparision_filters?.less_than_equals, value: 'lessThanOrEquals' },
                { label: this.commonLocaleData?.app_comparision_filters?.equals, value: 'equals' }
            ];

            this.searchByFilters = [
                { label: this.localeData?.search_by_filters?.quantity_outward, value: 'quantityOutward' },
                { label: this.localeData?.search_by_filters?.voucher_no, value: 'voucherNumber' }
            ];

            this.inventoryTypeFilters = [
                { label: this.commonLocaleData?.app_inventory_types?.product, value: 'PRODUCT' },
                { label: this.commonLocaleData?.app_inventory_types?.service, value: 'SERVICE' },
                { label: this.commonLocaleData?.app_inventory_types?.fixed_assets, value: 'FIXED_ASSETS' }
            ];
        }
    }

    /**
     * Show/hide clear filter button
     *
     * @memberof ListManufacturingComponent
     */
    public showHideClearFilterButton(): void {
        this.showClearButton = false;

        if ((this.universalDate && (this.manufacturingSearchRequest.from !== dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT) || this.manufacturingSearchRequest.to !== dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT))) || this.manufacturingSearchRequest.product || this.manufacturingSearchRequest.productVariant || (this.currentOrganizationType === OrganizationType.Company && this.manufacturingSearchRequest.branchUniqueName && this.manufacturingSearchRequest.branchUniqueName !== this.currentBranch.uniqueName) || this.manufacturingSearchRequest.warehouseUniqueName || this.manufacturingSearchRequest.inventoryType || this.manufacturingSearchRequest.searchBy || this.manufacturingSearchRequest.searchOperation || this.manufacturingSearchRequest.searchValue) {
            this.showClearButton = true;
        }

        this.changeDetectionRef.detectChanges();
    }

    /**
     * Sets filters in store
     *
     * @private
     * @memberof ListManufacturingComponent
     */
    private setFiltersInStore(): void {
        if (!this.storeFilters) {
            this.storeFilters = [];
        }

        this.storeFilters[this.currentUrl] = { manufacturingSearchRequest: this.manufacturingSearchRequest, selectedStockName: this.selectedStockName, selectedVariantName: this.selectedVariantName, selectedBranchName: this.selectedBranchName, selectedWarehouseName: this.selectedWarehouseName, selectedOperationName: this.selectedOperationName, selectedFilterByName: this.selectedFilterByName, selectedInventoryTypeName: this.selectedInventoryTypeName };
        this.store.dispatch(this.commonAction.setFilters(this.storeFilters));
    }

    /**
     *  Handle Pagination Event to change the page number and call api
     *
     * @param {*} event
     * @memberof ListManufacturingComponent
     */
    public pageChanged(event: any): void {
        if (this.currentPage !== event.page) {
            this.currentPage = event.page
            this.manufacturingSearchRequest.page = event.page;
            this.getReport();
        }
    }
}
