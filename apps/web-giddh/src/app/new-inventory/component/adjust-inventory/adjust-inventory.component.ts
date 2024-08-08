import { Component, OnInit, ViewChild } from '@angular/core';
import { AdjustInventoryComponentStore } from './utility/adjust-inventory.store';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { Observable, ReplaySubject, takeUntil, of as observableOf, combineLatest, map, debounceTime, distinctUntilChanged } from 'rxjs';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BalanceStockTransactionReportRequest, SearchStockTransactionReportRequest, StockTransactionReportRequest } from '../../../models/api-models/Inventory';
import { ActivatedRoute, Router } from '@angular/router';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { GeneralService } from '../../../services/general.service';
import { Location } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { SettingsFinancialYearActions } from '../../../actions/settings/financial-year/financial-year.action';
import { giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { AdjustmentInventory, API_COUNT_LIMIT } from '../../../app.constant';
import { cloneDeep } from '../../../lodash-optimized';
@Component({
    selector: 'adjust-inventory',
    templateUrl: './adjust-inventory.component.html',
    styleUrls: ['./adjust-inventory.component.scss'],
    providers: [AdjustInventoryComponentStore]
})

export class AdjustInventoryComponent implements OnInit {
    /** Instance of create reason template */
    @ViewChild("createReason", { static: false }) public createReason: any;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Modal instance */
    public matDialogRef: MatDialogRef<any>;
    /** Create adjust inventory form group */
    public adjustInventoryCreateEditForm: FormGroup;
    /**Hold indirect group  expense accounts */
    public groupUniqueName: string = "otherindirectexpenses";
    /** Expense Accounts Observable */
    public expenseAccounts$: Observable<any[]> = observableOf(null);
    /** Warehouse Observable */
    public warehouses$: Observable<any[]> = observableOf(null);
    /** Reasons Observable */
    public reasons$: Observable<any[]> = observableOf(null);
    /** Inventory Observable */
    public inventoryList$: Observable<any[]> = observableOf(null);
    /** True if open panel state  */
    public panelOpenState: boolean = true;
    /** Adjustment Method  */
    public adjustmentMethod: any[] = [];
    /* dayjs object */
    public dayjs: any = dayjs;
    /** Stock Transactional Object */
    public searchRequest: SearchStockTransactionReportRequest = new SearchStockTransactionReportRequest();
    /** Holds Inventory Type */
    public inventoryType: string;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Calculation methods */
    public calculationMethod: any[] = [];
    /** Stock Report Object */
    public stockReportRequest: StockTransactionReportRequest = new StockTransactionReportRequest();
    /** Balance Stock/Group Request */
    public balanceStockReportRequest: BalanceStockTransactionReportRequest = new BalanceStockTransactionReportRequest();
    /** Hold inventory variant table columns */
    public displayedColumns: any[] = ['select', 'method', 'changeValue', 'closingValue', 'changes', 'newValue'];
    /** Holds query params */
    public queryParams: any = {};
    /** Holds entity object */
    public entity: any = {
        entityName: '',
        balance: ''
    };
    /** This will hold stock/group closing balance */
    public stockGroupClosingBalance: any = {
        newValue: 0,
        changeValue: 0,
        closing: 0
    };
    /** False if show hide  */
    public showHideTable: boolean = true;
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Holds Store create adjust inventory is success API success state as observable*/
    public createAdjustInventoryIsSuccess$ = this.componentStore.select(state => state.createAdjustInventoryIsSuccess);
    /** Holds Store create adjust inventory in progress API success state as observable*/
    public createAdjustInventoryInProgress$ = this.componentStore.select(state => state.createAdjustInventoryInProgress);
    /** Holds Store update adjust inventory is success API success state as observable*/
    public updateAdjustInventoryIsSuccess$ = this.componentStore.select(state => state.updateAdjustInventoryIsSuccess);
    /** Holds Store update adjust inventory in progress API success state as observable*/
    public updateAdjustInventoryInProgress$ = this.componentStore.select(state => state.updateAdjustInventoryInProgress);
    /** Hold table data source */
    public dataSource: any;
    /** Decimal places from company settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** This will use for round off value */
    public giddhRoundOff: any = giddhRoundOff;
    /** Hold Reference Number */
    public referenceNumber: string = "";
    /** Hold selected items in list */
    public selection = new SelectionModel<any>(true, []);
    /** Hold balance request object */
    public balanceReqObj: any;
    /** True if entity is stock group */
    public isEntityStockGroup: boolean = false;
    /** Holds true when api is in progress */
    public apiCallInProgress: boolean = true;
    /** Hold Adjusment Inventory Form Value */
    public inventoryFormValue: any;
    /** Holds report type */
    public searchPage: string = "VARIANT";
    /** Filtered options to show in autocomplete list */
    public fieldFilteredOptions: any[] = [];
    /** Hold inventory data */
    public inventoryData: any[] = [];
    /** True if update mode */
    public updateMode: boolean = false;

    constructor(
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private settingsUtilityService: SettingsUtilityService,
        private generalService: GeneralService,
        private componentStore: AdjustInventoryComponentStore,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private settingsFinancialYearActions: SettingsFinancialYearActions
    ) {
        this.store.dispatch(this.settingsFinancialYearActions.getFinancialYearLimits());
        /** Activate router observable */
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.inventoryType = params?.type.toLowerCase();
                this.queryParams = params;
            }
            if (params?.refNo) {
                this.referenceNumber = params?.refNo;
                this.updateMode = true;
                this.componentStore.getAdjustInventoryData(this.referenceNumber);
                this.apiCallInProgress = true;
            }
        });
    }

    /**
     * This will be use for component intialization
     *
     * @memberof AdjustInventoryComponent
     */
    public ngOnInit(): void {
        this.inventoryList$ = observableOf([]);
        this.initForm();
        this.getWarehouses();
        this.getReasons();
        this.getExpensesAccount();
        this.searchInventory(false);
        if (this.referenceNumber) {
            this.componentStore.inventoryAdjustData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    this.initForm(response);
                    this.stockReportRequest.to = this.adjustInventoryCreateEditForm.value.date;
                    this.inventoryData = response.variants;
                    if (this.referenceNumber) {
                        this.stockGroupClosingBalance.closing = response?.closingBeforeAdjustment;
                        this.stockGroupClosingBalance.newValue = response?.closingAfterAdjustment;
                        this.stockGroupClosingBalance.changeValue = response?.changeValue;
                        this.apiCallInProgress = false;
                    }
                    this.selectInventory(
                        {
                            value: this.adjustInventoryCreateEditForm.value.entityUniqueName,
                            label: this.adjustInventoryCreateEditForm.value.entityName,
                            additional: {
                                type: this.adjustInventoryCreateEditForm.value.entity,
                                name: this.adjustInventoryCreateEditForm.value.entityName,
                                uniqueName: this.adjustInventoryCreateEditForm.value.entityUniqueName,
                            }
                        }, false);
                }
            });
        }

        combineLatest([
            this.componentStore.reasons$.pipe(map(response => response?.results)),
            this.componentStore.settingsProfile$,
            this.componentStore.expensesAccountList$.pipe(map(response => response?.results)),
            this.componentStore.warehouseList$.pipe(map(response => response?.results)),
            this.componentStore.financialYear$
        ]).pipe(takeUntil(this.destroyed$))
            .subscribe(([reasons, profile, expensesAccounts, warehouses, financialYear]) => {
                if (this.referenceNumber && this.translationLoaded) {
                    this.componentStore.inventoryAdjustData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                        if (response) {
                            this.initForm(response);
                        }
                    });
                }
                if (reasons) {
                    const mappedReasons = reasons.map(item => ({
                        value: item.uniqueName,
                        label: item.reason,
                        additional: item
                    }));
                    this.reasons$ = observableOf(mappedReasons);
                }

                if (profile) {
                    this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                }

                if (warehouses) {
                    let warehouseResults = warehouses.filter(warehouse => !warehouse.isArchived);
                    const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                    const mappedWarehouses = warehouseData?.formattedWarehouses?.map(item => ({
                        value: item.value,
                        label: item.label,
                        additional: item
                    }));
                    if (mappedWarehouses?.length === 1) {
                        this.adjustInventoryCreateEditForm.get('warehouseName')?.patchValue(mappedWarehouses[0]?.label);
                        this.adjustInventoryCreateEditForm.get('warehouseUniqueName')?.patchValue(mappedWarehouses[0]?.value);
                    }
                    this.warehouses$ = observableOf(mappedWarehouses);
                }

                if (financialYear) {
                    this.stockReportRequest.from = financialYear?.startDate;
                }
                if (expensesAccounts) {
                    const mappedAccounts = expensesAccounts.map(item => ({
                        value: item.uniqueName,
                        label: item.name,
                        additional: item
                    }));
                    if (mappedAccounts?.length === 1) {
                        this.adjustInventoryCreateEditForm.get('expenseAccountName')?.patchValue(mappedAccounts[0]?.label);
                        this.adjustInventoryCreateEditForm.get('expenseAccountUniqueName')?.patchValue(mappedAccounts[0]?.value);
                    }
                    this.expenseAccounts$ = observableOf(mappedAccounts);
                }

            });

        this.componentStore.stockGroupClosingBalance$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && !this.referenceNumber) {
                this.stockGroupClosingBalance.closing = response;
            }
        });
        this.dataSource = new MatTableDataSource<any>([]);
        combineLatest([
            this.componentStore.itemWiseReport$.pipe(map(response => response?.results)),
            this.componentStore.variantWiseReport$.pipe(map(response => response?.results))
        ]).pipe(takeUntil(this.destroyed$))
            .subscribe(([itemWise, variantWise]) => {

                if (itemWise) {
                    const mappedIItemWise = itemWise.map(item => ({
                        value: item.uniqueName,
                        label: `${item.name} (${item?.type})`,
                        additional: item
                    }));

                    let filterdVariantData = mappedIItemWise.filter(item => item?.additional?.type === 'STOCK' || item?.additional?.type === 'STOCK GROUP');
                    this.inventoryList$ = observableOf(filterdVariantData);
                }

                if (variantWise) {
                    let data = variantWise?.map(result => ({
                        ...result,
                        newValue: 0,
                        changeValue: 0
                    }));
                    if (!this.referenceNumber) {
                        this.stockGroupClosingBalance = {
                            newValue: 0,
                            changeValue: 0,
                            closing: 0
                        };
                        this.adjustInventoryCreateEditForm.patchValue({
                            adjustmentMethod: null,
                            calculationMethod: null,
                            changeInValue: null
                        });

                    }
                    this.dataSource = new MatTableDataSource<any>(data);
                    if (!this.referenceNumber) {
                        this.checkTableCheckBox();
                    }
                    this.componentStore.getStockGroupClosingBalance(this.balanceReqObj);
                    if (this.referenceNumber) {
                        this.calculateInventory();
                    }
                } else {
                    this.dataSource = new MatTableDataSource<any>([]);
                }
            });

        /** Create inventory success observable */
        this.createAdjustInventoryIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.apiCallInProgress = false;
                this.router.navigate([`/pages/inventory/v2/${this.inventoryType}/adjust`]);
            } else if (response !== null) {
                this.apiCallInProgress = false;
            }
        });

        /** Update inventory success observable */
        this.updateAdjustInventoryIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.apiCallInProgress = false;
                this.router.navigate([`/pages/inventory/v2/${this.inventoryType}/adjust`]);
            } else if (response !== null) {
                this.apiCallInProgress = false;
            }
        });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.adjustInventoryCreateEditForm.get('date')?.patchValue(dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT));
                this.stockReportRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
    }

    /**
       * Searches the group/stock/variant
       *
       * @param {boolean} [loadMore]
       * @memberof AdjustInventoryComponent
       */
    public searchInventory(searchedText: any, loadMore: boolean = false): void {
        if (this.searchRequest.loadMore) {
            return;
        }
        if (searchedText !== null && searchedText !== undefined && typeof searchedText === 'string') {
            this.searchRequest.q = searchedText;
        }
        this.searchRequest.inventoryType = this.inventoryType?.toUpperCase();
        this.searchRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames ? this.stockReportRequest.stockGroupUniqueNames : [];
        this.searchRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames ? this.stockReportRequest.stockUniqueNames : [];
        this.searchRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames ? this.stockReportRequest.variantUniqueNames : [];
        this.balanceStockReportRequest.stockGroupUniqueNames = this.stockReportRequest.stockGroupUniqueNames ? this.stockReportRequest.stockGroupUniqueNames : [];
        this.balanceStockReportRequest.stockUniqueNames = this.stockReportRequest.stockUniqueNames ? this.stockReportRequest.stockUniqueNames : [];
        this.balanceStockReportRequest.variantUniqueNames = this.stockReportRequest.variantUniqueNames ? this.stockReportRequest.variantUniqueNames : [];
        if (loadMore) {
            this.searchRequest.page++;
        } else {
            this.searchRequest.page = 1;
        }
        this.searchRequest.searchPage = this.searchPage;
        if (this.searchRequest.page === 1 || this.searchRequest.page <= this.searchRequest.totalPages) {
            delete this.searchRequest.totalItems;
            delete this.searchRequest.totalPages;
            this.componentStore.getItemWiseReport(this.searchRequest);
            this.searchRequest.loadMore = true;
            let initialData = cloneDeep(this.fieldFilteredOptions);
            this.componentStore.itemWiseReport$.pipe(debounceTime(700),
                distinctUntilChanged(),
                takeUntil(this.destroyed$)).subscribe(response => {
                    this.searchRequest.loadMore = false;
                    if (response) {
                        if (loadMore) {
                            let nextPaginatedData = response.results.map(item => ({
                                value: item.uniqueName,
                                label: `${item.name} (${item?.type})`,
                                additional: item
                            }));
                            this.fieldFilteredOptions = nextPaginatedData;
                            let concatData = initialData.concat(nextPaginatedData);
                            let filterdVariantData = concatData.filter(item => item?.additional?.type === 'STOCK' || item?.additional?.type === 'STOCK GROUP');
                            this.inventoryList$ = observableOf(filterdVariantData);
                        } else {
                            this.fieldFilteredOptions = response.results.map(item => ({
                                value: item.uniqueName,
                                label: `${item.name} (${item?.type})`,
                                additional: item
                            }));
                            let filterdVariantData = this.fieldFilteredOptions.filter(item => item?.additional?.type === 'STOCK' || item?.additional?.type === 'STOCK GROUP');
                            this.inventoryList$ = observableOf(filterdVariantData);
                        }
                        this.searchRequest.totalItems = response.totalItems;
                        this.searchRequest.totalPages = response.totalPages;
                    } else {
                        this.inventoryList$ = observableOf([]);
                    }
                });
        }
    }

    /**
    * Callback for inventory scroll end
    *
    * @memberof AdjustInventoryComponent
    */
    public handleSearchInventoryScrollEnd(): void {
        this.searchInventory(this.searchRequest.q, true);
    }

    /**
     *This will be use for get expense account
     *
     * @memberof AdjustInventoryComponent
     */
    public getExpensesAccount(): void {
        this.componentStore.getExpensesAccounts(this.groupUniqueName);
    }

    /**
    * Resets the form
    *
    * @memberof AdjustInventoryComponent
    */
    public resetForm(): void {
        this.adjustInventoryCreateEditForm.reset();
        this.dataSource = [];
        this.entity = {
            entityName: '',
            balance: ''
        }
        this.stockGroupClosingBalance = {
            newValue: 0,
            changeValue: 0,
            closing: 0
        }
        this.adjustInventoryCreateEditForm.get('date')?.patchValue(this.stockReportRequest.to);
        this.adjustInventoryCreateEditForm.updateValueAndValidity();
    }

    /**
    * Opens create reason modal
    *
    * @memberof AdjustInventoryComponent
    */
    public openCreateReasonModal(): void {
        this.matDialogRef = this.dialog.open(this.createReason, {
            width: 'var(--aside-pane-width)',
            height: '100vh',
            position: {
                right: '0',
                top: '0'
            }
        });
    }

    /**
     * Closes create reason modal
     *
     * @param {boolean} event
     * @memberof AdjustInventoryComponent
     */
    public closeCreateReasonModal(event: boolean): void {
        this.matDialogRef?.close();

        if (event) {
            this.getReasons();
        }
    }

    /**
     * This will take the user back to last page
     *
     * @memberof AdjustInventoryComponent
     */
    public back(event: boolean): void {
        if (event) {
            this.location.back();
        }
    }

    /**
     * This will be use for component intialization form
     *
     * @private
     * @param {*} [value]
     * @memberof AdjustInventoryComponent
     */
    private initForm(value?: any): void {
        this.adjustInventoryCreateEditForm = this.formBuilder.group({
            date: [value?.date ?? null, Validators.required],
            refNo: [value?.refNo ?? null],
            expenseAccountName: [value?.expenseAccount?.name ?? null],
            expenseAccountUniqueName: [value?.expenseAccount?.uniqueName ?? null, Validators.required],
            warehouseName: [value?.warehouse?.name ?? null],
            warehouseUniqueName: [value?.warehouse?.uniqueName ?? null],
            description: [value?.description ?? null],
            entity: [value?.entity ?? null, Validators.required],
            entityName: [value?.entityInfo?.name ?? null],
            entityUniqueName: [value?.entityInfo?.uniqueName ?? null, Validators.required],
            reasonName: [value?.reason?.name ?? null],
            reasonUniqueName: [value?.reason?.uniqueName ?? null, Validators.required],
            adjustmentMethodName: [value?.adjustmentMethod?.name ?? null],
            adjustmentMethod: [value?.adjustmentMethod?.code ?? null, Validators.required],
            calculationMethod: [value?.calculationMethod?.code ?? null, Validators.required],
            changeInValue: [value?.changeInValue ?? null, Validators.required],
            variantUniqueNames: [value?.variantUniqueNames ?? null]
        });
    }

    /**
    * Callback for select inventory
    *
    * @param {*} event
    * @param {boolean} [isClear=false]
    * @memberof AdjustInventoryComponent
    */
    public selectInventory(event: any, update: boolean): void {
        if (update) {
            this.resetInventory(true);
        }
        let reqObj: any;
        let toDate: any;

        if (typeof this.adjustInventoryCreateEditForm.get('date')?.value === 'object') {
            toDate = dayjs(this.adjustInventoryCreateEditForm.get('date')?.value).format(GIDDH_DATE_FORMAT);
        } else {
            toDate = this.adjustInventoryCreateEditForm.get('date')?.value
        }
        let balanceQueryParams = {
            from: this.stockReportRequest.from ?? '',
            to: toDate ?? '',
            stockGroupUniqueName: '',
            entity: ''
        };
        this.entity.entityName = event?.label;
        this.adjustInventoryCreateEditForm.get('entityName').setValue(event?.label);
        this.adjustInventoryCreateEditForm.get('entityUniqueName').setValue(event?.value);
        this.adjustInventoryCreateEditForm.get('entity').setValue(event?.additional?.type);
        this.stockReportRequest.to = toDate;
        this.stockReportRequest.archived = false;
        let queryParams = {
            from: this.stockReportRequest.from ?? '',
            to: this.stockReportRequest.to ?? '',
            count: API_COUNT_LIMIT,
            page: this.stockReportRequest.page ?? 1,
            sort: this.stockReportRequest.sort ?? '',
            sortBy: this.stockReportRequest.sortBy ?? ''

        };
        this.stockReportRequest.count = API_COUNT_LIMIT;
        this.stockReportRequest.inventoryType = this.inventoryType?.toUpperCase();
        this.stockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
        this.stockReportRequest.warehouseUniqueNames = this.adjustInventoryCreateEditForm.get('warehouseUniqueName')?.value ? [this.adjustInventoryCreateEditForm.get('warehouseUniqueName')?.value] : [];
        if (event && event.additional?.type === 'STOCK GROUP') {
            this.isEntityStockGroup = true;
            this.stockReportRequest.stockUniqueNames = [];
            this.stockReportRequest.stockGroupUniqueNames = [event.value];

            reqObj = {
                queryParams: queryParams,
                stockReportRequest: this.stockReportRequest
            }
            this.balanceStockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
            this.balanceStockReportRequest.from = undefined;
            this.balanceStockReportRequest.to = undefined;
            this.balanceStockReportRequest.stockGroupUniqueNames = [event.value];
            this.balanceStockReportRequest.stockUniqueNames = [];
            this.balanceStockReportRequest['inventoryType'] = this.inventoryType?.toUpperCase();
            this.balanceStockReportRequest.warehouseUniqueNames = this.adjustInventoryCreateEditForm.get('warehouseUniqueName')?.value ? [this.adjustInventoryCreateEditForm.get('warehouseUniqueName')?.value] : [];
            let balanceReqObj = {
                queryParams: balanceQueryParams,
                balanceStockReportRequest: this.balanceStockReportRequest
            }
            this.componentStore.getVariantWiseReport(reqObj);
            this.balanceReqObj = balanceReqObj;
        } else {
            this.isEntityStockGroup = false;
            reqObj = {
                queryParams: queryParams,
                stockReportRequest: this.stockReportRequest
            }
            this.stockReportRequest.stockGroupUniqueNames = [];
            this.stockReportRequest.stockUniqueNames = [event.value];
            this.balanceStockReportRequest.branchUniqueNames = this.generalService.currentBranchUniqueName ? [this.generalService.currentBranchUniqueName] : [];
            this.balanceStockReportRequest.from = undefined;
            this.balanceStockReportRequest.to = undefined;
            this.balanceStockReportRequest.stockGroupUniqueNames = [];
            this.balanceStockReportRequest.stockUniqueNames = [event.value];
            this.balanceStockReportRequest['inventoryType'] = this.inventoryType?.toUpperCase();
            this.balanceStockReportRequest.warehouseUniqueNames = this.adjustInventoryCreateEditForm.get('warehouseUniqueName')?.value ? [this.adjustInventoryCreateEditForm.get('warehouseUniqueName')?.value] : [];
            let balanceReqObj = {
                queryParams: balanceQueryParams,
                balanceStockReportRequest: this.balanceStockReportRequest
            }
            this.componentStore.getVariantWiseReport(reqObj);
            this.balanceReqObj = balanceReqObj;
        }
    }

    /**
     * Gets company warehouses
     *
     * @private
     * @memberof AdjustInventoryComponent
     */
    private getWarehouses(): void {
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
    }

    /**
     * This will be use for get reasons
     *
     * @memberof AdjustInventoryComponent
     */
    public getReasons(): void {
        this.componentStore.getAllReasons(true);
    }
    /**
     *This will be use for update inventory
     *
     * @return {*}  {void}
     * @memberof AdjustInventoryComponent
     */
    public updateInventoryAdjustment(): void {
        this.isFormSubmitted = false;
        if (this.adjustInventoryCreateEditForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        let mappedVariants = this.selection.selected.map(item => (
            item?.variant?.uniqueName
        ));
        this.adjustInventoryCreateEditForm.value.variantUniqueNames = mappedVariants;

        let toDate;
        if (typeof this.adjustInventoryCreateEditForm.get('date')?.value === 'object') {
            toDate = dayjs(this.adjustInventoryCreateEditForm.get('date')?.value).format(GIDDH_DATE_FORMAT);
        } else {
            toDate = this.adjustInventoryCreateEditForm.get('date')?.value
        }
        this.adjustInventoryCreateEditForm.value.date = toDate;
        let adjustFormValue;
        adjustFormValue = this.cleanObject(this.adjustInventoryCreateEditForm.value);
        let reqObj = {
            formValue: adjustFormValue,
            branchUniqueName: this.generalService.currentBranchUniqueName
        }
        this.apiCallInProgress = true;
        this.componentStore.updateInventoryAdjustment(reqObj);
    }

    /**
     * This will be use for create inventory
     *
     * @return {*}  {void}
     * @memberof AdjustInventoryComponent
     */
    public createInventoryAdjustment(): void {
        this.isFormSubmitted = false;
        if (this.adjustInventoryCreateEditForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        let mappedVariants = this.selection.selected.map(item => (
            item?.variant?.uniqueName
        ));
        this.adjustInventoryCreateEditForm.value.variantUniqueNames = mappedVariants;

        let toDate;
        if (typeof this.adjustInventoryCreateEditForm.get('date')?.value === 'object') {
            toDate = dayjs(this.adjustInventoryCreateEditForm.get('date')?.value).format(GIDDH_DATE_FORMAT);
        } else {
            toDate = this.adjustInventoryCreateEditForm.get('date')?.value
        }
        this.adjustInventoryCreateEditForm.value.date = toDate;
        let adjustFormValue;
        adjustFormValue = this.cleanObject(this.adjustInventoryCreateEditForm.value);

        let reqObj = {
            formValue: adjustFormValue,
            branchUniqueName: this.generalService.currentBranchUniqueName
        }
        this.apiCallInProgress = true;
        this.componentStore.createInventoryAdjustment(reqObj);
    }

    /**
     * This will be use for clean request object
     *
     * @param {*} updatedData
     * @return {*}  {void}
     * @memberof AdjustInventoryComponent
     */
    public cleanObject(updatedData: any): void {
        delete updatedData?.adjustmentMethodName;
        delete updatedData?.expenseAccountName;
        delete updatedData?.reasonName;
        delete updatedData?.warehouseName;
        return updatedData;
    }

    /**
     * This will be use for  calculation
     *
     * @memberof AdjustInventoryComponent
     */
    public calculateInventory(): void {
        if (this.referenceNumber) {
            let data;
            const inventoryMap = new Map(this.inventoryData.map(item => [item.variant.uniqueName, item]));
            const mainResult = [];
            const variantWiseOnly = [];
            this.dataSource.data.forEach(result => {
                const updatedVariant = inventoryMap.get(result.variant.uniqueName);
                if (updatedVariant) {
                    mainResult.push(updatedVariant);
                } else {
                    variantWiseOnly.push(result);
                }
            });
            data = [...mainResult, ...variantWiseOnly];
            let mappedData = cloneDeep(data);
            let totalClosing = 0;
            let totalChange = 0;
            let totalNewValue = 0;
            let oldTotalClosing = 0;
            let oldNewValue = 0;
            mappedData?.forEach(element => {
                totalClosing += element.closingBeforeAdjustment ?? 0;
                totalChange += element.changeValue ?? 0;
                totalNewValue += element.closingAfterAdjustment ?? 0;
                oldNewValue += element?.newValue ?? 0;
                if (this.adjustInventoryCreateEditForm.get("adjustmentMethod")?.value ===
                    "QUANTITY_WISE") {
                    oldTotalClosing += element.closing?.quantity ?? 0;
                } else {
                    oldTotalClosing += element.closing?.amount ?? 0;
                }
            });
            this.stockGroupClosingBalance.closing = totalClosing + oldTotalClosing;
            this.stockGroupClosingBalance.changeValue = totalChange;
            this.stockGroupClosingBalance.newValue = totalNewValue + oldNewValue;
            this.dataSource = new MatTableDataSource<any>(data);

            if (this.adjustInventoryCreateEditForm.value.entityUniqueName &&
                this.adjustInventoryCreateEditForm.value.adjustmentMethod === AdjustmentInventory.QuantityWise &&
                this.adjustInventoryCreateEditForm.value.calculationMethod === AdjustmentInventory.Percentage) {
                let changeInValue = this.stockGroupClosingBalance.closing * (this.adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                let newValue = this.stockGroupClosingBalance.closing - changeInValue;


                this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
                this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

                const data = this.dataSource?.data?.map(result => {
                    result.changeValue = (result.closing?.quantity ?? result?.closingBeforeAdjustment) * (this.adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                    result.newValue = giddhRoundOff((result.closing?.quantity ?? result?.closingBeforeAdjustment) - result.changeValue, this.giddhBalanceDecimalPlaces);

                    return result;
                }) || [];
                this.dataSource = new MatTableDataSource<any>(data);
            }

            if (this.adjustInventoryCreateEditForm.value.entityUniqueName &&
                this.adjustInventoryCreateEditForm.value.adjustmentMethod === AdjustmentInventory.QuantityWise
                && this.adjustInventoryCreateEditForm.value.calculationMethod === AdjustmentInventory.Value) {

                let changeInValue = this.adjustInventoryCreateEditForm?.value?.changeInValue * this.dataSource?.data?.length;
                let newValue = this.stockGroupClosingBalance.closing - changeInValue;

                this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
                this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

                const data = this.dataSource?.data?.map(result => {
                    result.closingAfterAdjustment = Number(result.closingBeforeAdjustment) - Number(result.changeValue);
                    result.changeValue = this.adjustInventoryCreateEditForm?.value?.changeInValue;
                    result.newValue = giddhRoundOff((result.closing?.quantity ?? result?.closingBeforeAdjustment) - result.changeValue, this.giddhBalanceDecimalPlaces);
                    return result;
                }) || [];
                this.dataSource = new MatTableDataSource<any>(data);
            }

            if (this.adjustInventoryCreateEditForm.value.entityUniqueName &&
                this.adjustInventoryCreateEditForm.value.adjustmentMethod === AdjustmentInventory.ValueWise &&
                this.adjustInventoryCreateEditForm.value.calculationMethod === AdjustmentInventory.Percentage) {

                let changeInValue = this.stockGroupClosingBalance.closing * (this.adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                let newValue = this.stockGroupClosingBalance.closing - changeInValue;


                this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
                this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

                const data = this.dataSource?.data?.map(result => {
                    result.changeValue = (result.closing?.amount ?? result?.closingBeforeAdjustment) * (this.adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                    result.newValue = giddhRoundOff((result.closing?.amount ?? result?.closingBeforeAdjustment) - result.changeValue, this.giddhBalanceDecimalPlaces);
                    return result
                }) || [];
                this.dataSource = new MatTableDataSource<any>(data);
            }

            if (this.adjustInventoryCreateEditForm.value.entityUniqueName &&
                this.adjustInventoryCreateEditForm.value.adjustmentMethod === AdjustmentInventory.ValueWise &&
                this.adjustInventoryCreateEditForm.value.calculationMethod === AdjustmentInventory.Value) {

                let changeInValue = this.adjustInventoryCreateEditForm?.value?.changeInValue * this.dataSource?.data?.length;
                let newValue = this.stockGroupClosingBalance.closing - changeInValue;

                this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
                this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

                const data = this.dataSource?.data?.map(result => {
                    result.changeValue = this.adjustInventoryCreateEditForm?.value?.changeInValue;
                    result.newValue = giddhRoundOff((result.closing?.amount ?? result?.closingBeforeAdjustment) - result.changeValue, this.giddhBalanceDecimalPlaces);
                    return result;
                }) || [];
                this.dataSource = new MatTableDataSource<any>(data);
            }
            this.checkTableCheckBox();
        } else {
            this.stockGroupClosingBalance.changeValue = 0;
            this.stockGroupClosingBalance.newValue = 0;
            if (this.adjustInventoryCreateEditForm.value.entityUniqueName &&
                this.adjustInventoryCreateEditForm.value.adjustmentMethod === AdjustmentInventory.QuantityWise &&
                this.adjustInventoryCreateEditForm.value.calculationMethod === AdjustmentInventory.Percentage) {

                let changeInValue = this.stockGroupClosingBalance.closing?.closing?.quantity * (this.adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                let newValue = this.stockGroupClosingBalance.closing?.closing?.quantity - changeInValue;

                this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
                this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

                const data = this.dataSource.data.map(result => {
                    result.changeValue = result.closing?.quantity * (this.adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                    result.newValue = giddhRoundOff(result.closing?.quantity - result.changeValue, this.giddhBalanceDecimalPlaces);
                    return result
                }) || [];
                this.dataSource.data = data;
            }

            if (this.adjustInventoryCreateEditForm.value.entityUniqueName &&
                this.adjustInventoryCreateEditForm.value.adjustmentMethod === AdjustmentInventory.QuantityWise
                && this.adjustInventoryCreateEditForm.value.calculationMethod === AdjustmentInventory.Value) {
                let changeInValue = this.adjustInventoryCreateEditForm?.value?.changeInValue * this.dataSource?.data?.length;
                let newValue = this.stockGroupClosingBalance.closing?.closing?.quantity - changeInValue;

                this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
                this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);
                const data = this.dataSource.data.map(result => {
                    result.changeValue = this.adjustInventoryCreateEditForm?.value?.changeInValue;
                    result.newValue = giddhRoundOff(result.closing?.quantity - result.changeValue, this.giddhBalanceDecimalPlaces);
                    return result
                }) || [];
                this.dataSource.data = data;
            }

            if (this.adjustInventoryCreateEditForm.value.entityUniqueName &&
                this.adjustInventoryCreateEditForm.value.adjustmentMethod === AdjustmentInventory.ValueWise &&
                this.adjustInventoryCreateEditForm.value.calculationMethod === AdjustmentInventory.Percentage) {

                let changeInValue = this.stockGroupClosingBalance.closing?.closing?.amount * (this.adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                let newValue = this.stockGroupClosingBalance.closing?.closing?.amount - changeInValue;

                this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
                this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

                const data = this.dataSource.data.map(result => {
                    result.changeValue = result.closing?.amount * (this.adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                    result.newValue = giddhRoundOff(result.closing?.amount - result.changeValue, this.giddhBalanceDecimalPlaces);
                    return result
                }) || [];
                this.dataSource.data = data;

            }

            if (this.adjustInventoryCreateEditForm.value.entityUniqueName &&
                this.adjustInventoryCreateEditForm.value.adjustmentMethod === AdjustmentInventory.ValueWise &&
                this.adjustInventoryCreateEditForm.value.calculationMethod === AdjustmentInventory.Value) {

                let changeInValue = this.adjustInventoryCreateEditForm?.value?.changeInValue * this.dataSource?.data?.length;
                let newValue = this.stockGroupClosingBalance.closing?.closing?.amount - changeInValue;

                this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
                this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

                const data = this.dataSource.data.map(result => {
                    result.changeValue = this.adjustInventoryCreateEditForm?.value?.changeInValue;
                    result.newValue = giddhRoundOff(result.closing?.amount - result.changeValue, this.giddhBalanceDecimalPlaces);
                    return result
                }) || [];
                this.dataSource.data = data;
            }
        }
    }

    /**
     * This will be use for select all variants
     *
     * @return {*}
     * @memberof AdjustInventoryComponent
     */
    public isAllSelected(): boolean {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource?.data?.length;
        return numSelected === numRows;
    }

    /**
     * This will be use for master toggle
     *
     * @memberof AdjustInventoryComponent
     */
    public masterToggle(): void {
        if (this.isEntityStockGroup) {
            this.dataSource?.filteredData.forEach(row => this.selection.select(row));
        } else {
            if (this.isAllSelected()) {
                this.selection.clear();
            } else {
                const data = this.referenceNumber && this.updateMode
                    ? this.dataSource.filteredData.filter(data => data?.closingAfterAdjustment)
                    : this.dataSource.filteredData;

                data.forEach(row => this.selection.select(row));
            }
        }
    }

    /**
     * This will be use for checkbox label
     *
     * @param {*} [row]
     * @return {*}  {string}
     * @memberof AdjustInventoryComponent
     */
    public checkboxLabel(row?: any): string {
        if (!row) {
            return `${this.isAllSelected() ? 'deselect' : 'select'} 'all'`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row + 1}`;
    }

    /**
     *
     * Callback for translation response complete
     * @param {*} event
     * @memberof AdjustInventoryComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.translationLoaded = true;
            this.adjustmentMethod = [
                {
                    label: this.localeData?.quantity_wise,
                    value: AdjustmentInventory.QuantityWise
                },
                {
                    label: this.localeData?.value_wise,
                    value: AdjustmentInventory.ValueWise
                }
            ];
            this.calculationMethod = [
                {
                    label: this.localeData?.percentage,
                    value: AdjustmentInventory.Percentage
                },
                {
                    label: this.localeData?.value,
                    value: AdjustmentInventory.Value
                }
            ];
        }
    }

    /**
     * This will be use for reset Inventory in edit mode
     *
     * @memberof AdjustInventoryComponent
     */
    public resetInventory(bySelectInventory: boolean = false): void {
        if (this.updateMode) {
            this.updateMode = false;
            if (!bySelectInventory) {
                this.adjustInventoryCreateEditForm.get("entityName")?.patchValue(null);
                this.adjustInventoryCreateEditForm.get("entityUniqueName")?.patchValue(null);
            } else {
                this.dataSource = [];
                this.selection.clear();
                this.inventoryData = [];

                this.adjustInventoryCreateEditForm.get("changeInValue")?.patchValue(null);
                this.adjustInventoryCreateEditForm.get("adjustmentMethod")?.patchValue(null);
                this.adjustInventoryCreateEditForm.get("adjustmentMethodName")?.patchValue(null);
                this.adjustInventoryCreateEditForm.get("calculationMethod")?.patchValue(null);
                this.adjustInventoryCreateEditForm.get("entityName")?.patchValue(null);
                this.adjustInventoryCreateEditForm.get("entityUniqueName")?.patchValue(null);
                this.entity = {
                    entityName: '',
                    balance: ''
                };
                this.stockGroupClosingBalance = {
                    newValue: 0,
                    changeValue: 0,
                    closing: 0
                };
            }
        } else {
            this.selectInventory(
                {
                    value: this.adjustInventoryCreateEditForm.value.entityUniqueName,
                    label: this.adjustInventoryCreateEditForm.value.entityName,
                    additional: {
                        type: this.adjustInventoryCreateEditForm.value.entity,
                        name: this.adjustInventoryCreateEditForm.value.entityName,
                        uniqueName: this.adjustInventoryCreateEditForm.value.entityUniqueName
                    }
                }, false);
        }
    }

    /**
     * This will be use for check table checkbox according to stock and stock group
     *
     * @memberof AdjustInventoryComponent
     */
    public checkTableCheckBox(): void {
        const shouldMasterToggle = this.isEntityStockGroup || (this.referenceNumber && !this.isEntityStockGroup);
        if (shouldMasterToggle) {
            this.masterToggle();
        } else {
            this.selection.clear();
        }
        this.showHideTable = false;
        setTimeout(() => {
            this.showHideTable = true;
        });
    }
}
