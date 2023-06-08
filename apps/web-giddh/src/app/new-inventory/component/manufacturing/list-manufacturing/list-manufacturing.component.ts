import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { InventoryAction } from 'apps/web-giddh/src/app/actions/inventory/inventory.actions';
import { SettingsBranchActions } from 'apps/web-giddh/src/app/actions/settings/branch/settings.branch.action';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
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

export interface ManufacturingList {
    date: string,
    voucher_no: number,
    finished_variant: string,
    stock: string,
    qty_outwards: number,
    qty_outwards_unit: string,
    material_used: string,
    qty_inwards: number,
    qty_inwards_unit: string,
    warehouse: string
}

@Component({
    selector: 'list-manufacturing',
    templateUrl: './list-manufacturing.component.html',
    styleUrls: ['./list-manufacturing.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListManufacturingComponent implements OnInit {
    /** Instance of Mat Dialog for Advance Filter */
    @ViewChild("advance_filter_dialog") public advanceFilterComponent: TemplateRef<any>;
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /** Manufacturing list  product dropdown items*/
    public product: any = [];
    /** Material table elements */
    public displayedColumns: string[] = ['date', 'voucher_no', 'stock', 'finished_variant', 'qty_outwards', 'qty_outwards_unit', 'material_used', 'qty_inwards', 'qty_inwards_unit', 'warehouse'];
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
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
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
    public isReportLoading$: Observable<boolean>;
    public stockList: any[] = [];
    public variantList: any[] = [];
    public selectedStockName: string = "";
    public selectedVariantName: string = "";
    public selectedBranchName: string = "";
    public selectedWarehouseName: string = "";
    public selectedOperationName: string = "";
    public selectedFilterByName: string = "";
    public selectedInventoryTypeName: string = "";
    public totalItems: number = 0;
    public allWarehouses: any[] = [];
    public operatorFilters: any[] = [
        { label: 'Greater', value: 'greaterThan' },
        { label: 'Less Than', value: 'lessThan' },
        { label: 'Greater Than or Equals', value: 'greaterThanOrEquals' },
        { label: 'Less Than or Equals', value: 'lessThanOrEquals' },
        { label: 'Equals', value: 'equals' }
    ];
    public searchByFilters: any[] = [
        { label: 'Quantity Outward', value: 'quantityOutward' },
        { label: 'Voucher Number', value: 'voucherNumber' }
    ];
    public inventoryTypeFilters: any[] = [
        { label: 'PRODUCT', value: 'PRODUCT' },
        { label: 'SERVICE', value: 'SERVICE' },
        { label: 'FIXED ASSET', value: 'FIXED_ASSET' }
    ];

    constructor(
        public dialog: MatDialog,
        private modalService: BsModalService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private warehouseAction: WarehouseActions,
        private changeDetectionRef: ChangeDetectorRef,
        private inventoryAction: InventoryAction,
        private settingsBranchAction: SettingsBranchActions,
        private manufacturingService: ManufacturingService,
        private ledgerService: LedgerService
    ) {
        this.manufacturingSearchRequest.product = '';
        this.manufacturingSearchRequest.searchBy = '';
        this.manufacturingSearchRequest.searchOperation = '';
        this.isReportLoading$ = this.store.pipe(select(state => state.manufacturing.isMFReportLoading), takeUntil(this.destroyed$));
    }

    public ngOnInit(): void {
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.getWarehouses();

        if (this.currentOrganizationType === OrganizationType.Company) {
            this.getAllWarehouses();
        }

        // Refresh the stock list
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

        // Refresh report data according to universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);
                this.manufacturingSearchRequest.dateRange = this.universalDate;
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.manufacturingSearchRequest.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.manufacturingSearchRequest.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getReport();
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch?.alias,
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
                this.isCompany = this.currentOrganizationType !== OrganizationType.Branch && this.currentCompanyBranches?.length > 2;
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
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
                        };
                    }
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
                }
            }
        });
    }

    /**
     * Get warehouses
     *
     * @memberof CreateManufacturingComponent
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

    public getVariants(): void {
        this.variantList = [];
        this.selectedVariantName = "";
        this.ledgerService.loadStockVariants(this.manufacturingSearchRequest.product).pipe(takeUntil(this.destroyed$)).subscribe(variants => {
            if (variants?.length) {
                variants?.forEach(variant => {
                    this.variantList.push({ label: variant?.name, value: variant?.uniqueName });
                });
            }

            this.changeDetectionRef.detectChanges();
        });
    }

    public initializeSearchReqObj(): void {
        this.manufacturingSearchRequest.product = '';
        this.manufacturingSearchRequest.searchBy = '';
        this.manufacturingSearchRequest.searchOperation = '';
        this.manufacturingSearchRequest.page = 1;
        this.manufacturingSearchRequest.count = this.paginationLimit;
    }

    public getReport() {
        let data = cloneDeep(this.manufacturingSearchRequest);
        this.dataSource = [];

        this.manufacturingService.GetMfReport(data).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.results?.length) {
                let reportData = [];

                this.totalItems = response.body.totalItems;

                response.body.results.forEach(item => {
                    reportData.push({
                        date: dayjs(item.date, GIDDH_DATE_FORMAT).format("d MMM YYYY"),
                        voucher_no: item.voucherNumber,
                        stock: item.stockName,
                        variant: item.variant.name,
                        qty_outwards: item.manufacturingQuantity,
                        qty_outwards_unit: item.manufacturingUnit,
                        linkedStocks: item.linkedStocks,
                        warehouse: item.warehouse?.name
                    });
                })

                this.dataSource = reportData;

                this.changeDetectionRef.detectChanges();
            }
        });
    }

    /**
     *  Function to open Dialog on click on Advance Filter Button
     */
    public openAdvanceFilterDialog(): void {
        this.dialog.open(this.advanceFilterComponent, {
            width: '630px',
        })
    }

    /**
      *To show the datepicker
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
      * @memberof InvoicePreviewComponent
      */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ActivityLogsComponent
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

    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity?.label;
        this.manufacturingSearchRequest.branchUniqueName = selectedEntity?.value;

        this.warehouses = this.allWarehouses[selectedEntity?.value];
    }

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
                }
            } else {
                this.store.dispatch(this.inventoryAction.GetAllLinkedStocks());
            }
        });
    }
}