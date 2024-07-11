import { Component, OnInit, ViewChild } from '@angular/core';
import { AdjustInventoryComponentStore } from './utility/adjust-inventory.store';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { Observable, ReplaySubject, takeUntil, of as observableOf, combineLatest, map } from 'rxjs';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OptionInterface } from '../../../models/api-models/Voucher';
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
    public matDialogRef: any;
    /** Create adjust inventory form group */
    public adjustInventoryCreateEditForm: FormGroup;
    /**Hold indirect group  expense accounts */
    public groupUniqueName: string = "interestexpense";
    /** Expense Accounts Observable */
    public expenseAccounts$: Observable<any[]> = observableOf(null);
    /** Warehouse Observable */
    public warehouses$: Observable<any[]> = observableOf(null);
    /** Reasons Observable */
    public reasons$: Observable<any[]> = observableOf(null);
    /** Inventory Observable */
    public inventoryList$: Observable<any[]> = observableOf(null);
    /** True if open panel state  */
    public panelOpenState = true;
    /** Adjustment Method  */
    public adjustmentMethod: any[] = [];
    /* dayjs object */
    public dayjs = dayjs;
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
    public showHideTable = true;
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
    /** Hold inventory reasponse */
    public inventoryResponse: any = {
        expenseAccountName: null,
        warehouseName: null,
        adjustmentMethodName: null,
        reasonName: null,
        inventoryName: null,
        calculationMethodName: null
    };
    /** Hold balance request object */
    public balanceReqObj: any;
    /** True if entity is stock group */
    public isEntityStockGroup: boolean = false;
    /** True if allApiCalled */
    public allApiCalled: boolean = true;
    /** Hold Adjusment Inventory Form Value */
    public inventoryFormValue: any;

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
                this.componentStore.getAdjustInventoryData(this.referenceNumber);
                this.allApiCalled = true;
            }
        });
    }

    /**
     * This will be use for component intialization
     *
     * @memberof AdjustInventoryComponent
     */
    public ngOnInit(): void {
        this.initForm();
        this.getWarehouses();
        this.getResons();
        this.getExpensesAccount();
        this.getItemWiseReport();
        if (this.referenceNumber) {
            this.componentStore.inventoryAdjustData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    this.initForm(response);
                    this.stockReportRequest.to = this.adjustInventoryCreateEditForm.value.date;
                    setTimeout(() => {
                        let adjustmentMethod = this.adjustmentMethod.filter(method => method.value === this.adjustInventoryCreateEditForm.value.adjustmentMethod);
                        this.inventoryResponse.adjustmentMethodName = adjustmentMethod[0]?.label;
                        this.selectInventory(
                            {
                                value: this.adjustInventoryCreateEditForm.value.entityUniqueName,
                                label: this.adjustInventoryCreateEditForm.value.entityName,
                                additional: {
                                    type: this.adjustInventoryCreateEditForm.value.entity,
                                    name: this.adjustInventoryCreateEditForm.value.entityName,
                                    uniqueName: this.adjustInventoryCreateEditForm.value.entityUniqueName,
                                }
                            });
                    }, 1000);
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
                    if (this.referenceNumber) {
                        let filteredReason = mappedReasons?.length && mappedReasons.filter(reason => reason.value === this.adjustInventoryCreateEditForm.value.reasonUniqueName);
                        this.inventoryResponse.reasonName = filteredReason[0]?.label;
                    }
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
                    if (this.referenceNumber) {
                        let filteredWarehouse = mappedWarehouses?.find(warehouse => warehouse.value === this.adjustInventoryCreateEditForm.value.warehouseUniqueName);
                        this.inventoryResponse.warehouseName = filteredWarehouse?.label;
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
                    if (this.referenceNumber) {
                        let filteredExpenses = mappedAccounts?.find(account => account.value === this.adjustInventoryCreateEditForm.value.expenseAccountUniqueName);
                        this.inventoryResponse.expenseAccountName = filteredExpenses?.label;
                    }
                    this.expenseAccounts$ = observableOf(mappedAccounts);
                }

            });

        this.componentStore.stockGroupClosingBalance$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.stockGroupClosingBalance.closing = response;
                if (this.referenceNumber) {
                    this.stockGroupClosingBalance.changeValue = 0;
                    this.stockGroupClosingBalance.newValue = 0;
                    this.calculateCalculation();
                    this.allApiCalled = false;
                }
            }
        });

        combineLatest([
            this.componentStore.itemWiseReport$.pipe(map(response => response?.results)),
            this.componentStore.variantWiseReport$.pipe(map(response => response?.results))
        ]).pipe(takeUntil(this.destroyed$))
            .subscribe(([itemWise, variantWise]) => {

                if (itemWise) {
                    const mappedIItemWise = itemWise.map(item => ({
                        value: item.uniqueName,
                        label: item.name,
                        additional: item
                    }));
                    this.inventoryList$ = observableOf(mappedIItemWise);
                }

                if (variantWise) {
                    const data = variantWise?.map(result => ({
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
                    if (this.referenceNumber && this.isEntityStockGroup) {
                        this.masterToggle();
                    } else {
                        this.selection.clear();
                    }
                    this.showHideTable = false;
                    setTimeout(() => {
                        this.showHideTable = true;
                    });
                    this.componentStore.getStockGroupClosingBalance(this.balanceReqObj);
                } else {
                    this.dataSource = new MatTableDataSource<any>([]);
                }
            });

        /** Create inventory success observable */
        this.createAdjustInventoryIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.allApiCalled = false;
                this.router.navigate([`/pages/inventory/v2/${this.inventoryType}/adjust-inventory`]);
            } else if (response !== null) {
                this.allApiCalled = false;
            }
        });

        /** Update inventory success observable */
        this.updateAdjustInventoryIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.allApiCalled = false;
                this.router.navigate([`/pages/inventory/v2/${this.inventoryType}/adjust-inventory`]);
            } else if (response !== null) {
                this.allApiCalled = false;
            }
        });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.adjustInventoryCreateEditForm.get('date')?.patchValue(dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT));
                this.stockReportRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
    }

    /**
     * This will be use for get item wise report
     *
     * @memberof AdjustInventoryComponent
     */
    public getItemWiseReport(): void {
        this.searchRequest.count = 20000000;
        this.searchRequest.inventoryType = this.inventoryType?.toUpperCase();
        this.searchRequest.searchPage = 'VARIANT';
        this.componentStore.getItemWiseReport(this.searchRequest);
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
        this.adjustInventoryCreateEditForm.get('date')?.patchValue(this.stockReportRequest.to);
    }

    /**
    * Opens create reason modal
    *
    * @memberof AdjustInventoryComponent
    */
    public openCreateReasonModal(): void {
        this.matDialogRef = this.dialog.open(this.createReason, {
            width: 'var(--aside-pane-width)',
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
            this.getResons();
        }
    }

    /**
     * This will take the user back to last page
     *
     * @memberof AdjustInventoryComponent
     */
    public backClicked(i): void {
        this.location.back();
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
            entity: [value?.entity ?? null, Validators.required],
            entityName: [value?.entityUniqueName ?? null, Validators.required],
            entityUniqueName: [value?.entityUniqueName ?? null, Validators.required],
            reasonUniqueName: [value?.reasonUniqueName ?? null, Validators.required],
            date: [value?.date ?? null, Validators.required],
            refNo: [value?.refNo ?? null],
            expenseAccountUniqueName: [value?.expenseAccountUniqueName ?? null, Validators.required],
            warehouseUniqueName: [value?.warehouseUniqueName ?? null],
            description: [value?.description ?? null],
            adjustmentMethod: [value?.adjustmentMethod ?? null, Validators.required],
            calculationMethod: [value?.calculationMethod ?? null, Validators.required],
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
    public selectInventory(event: any): void {
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
        this.stockReportRequest.branchUniqueNames[0] = this.generalService.currentBranchUniqueName;
        if (event && event.additional?.type === 'STOCK GROUP') {
            this.isEntityStockGroup = true;
            this.stockReportRequest.stockUniqueNames = [];
            this.stockReportRequest.stockGroupUniqueNames = [event.value];
            reqObj = {
                queryParams: queryParams,
                stockReportRequest: this.stockReportRequest
            }
            this.balanceStockReportRequest.branchUniqueNames[0] = this.generalService.currentBranchUniqueName;
            this.balanceStockReportRequest.from = undefined;
            this.balanceStockReportRequest.to = undefined;
            this.balanceStockReportRequest.stockGroupUniqueNames = [event.value];
            this.balanceStockReportRequest.stockUniqueNames = [];
            this.balanceStockReportRequest['inventoryType'] = this.inventoryType?.toUpperCase();
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
            this.componentStore.getVariantWiseReport(reqObj);
            this.balanceStockReportRequest.branchUniqueNames[0] = this.generalService.currentBranchUniqueName;
            this.balanceStockReportRequest.from = undefined;
            this.balanceStockReportRequest.to = undefined;
            this.balanceStockReportRequest.stockGroupUniqueNames = [];
            this.balanceStockReportRequest.stockUniqueNames = [event.value];
            this.balanceStockReportRequest['inventoryType'] = this.inventoryType?.toUpperCase();
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
    public getResons(): void {
        this.componentStore.getAllReasons(true);
    }
    /**
     *This will be use for upate inventory
     *
     * @return {*}  {void}
     * @memberof AdjustInventoryComponent
     */
    public updateInventory(): void {
        this.isFormSubmitted = false;
        if (this.adjustInventoryCreateEditForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        let mappedVariants = this.selection.selected.map(item => (
            item?.variant?.uniqueName
        ));
        this.adjustInventoryCreateEditForm.value.variantUniqueNames = mappedVariants;
        this.adjustInventoryCreateEditForm.value.date = dayjs(this.adjustInventoryCreateEditForm.value.date).format(GIDDH_DATE_FORMAT);
        let reqObj = {
            formValue: this.adjustInventoryCreateEditForm.value,
            branchUniqueName: this.generalService.currentBranchUniqueName
        }
        this.allApiCalled = true;
        this.componentStore.updateInventoryAdjustment(reqObj);
    }

    /**
     * This will be use for create inventory
     *
     * @return {*}  {void}
     * @memberof AdjustInventoryComponent
     */
    public createInventory(): void {
        this.inventoryFormValue = cloneDeep(this.adjustInventoryCreateEditForm.value);
        this.isFormSubmitted = false;
        if (this.adjustInventoryCreateEditForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        let mappedVariants = this.selection.selected.map(item => (
            item?.variant?.uniqueName
        ));
        this.adjustInventoryCreateEditForm.value.variantUniqueNames = mappedVariants;
        this.adjustInventoryCreateEditForm.value.date = dayjs(this.adjustInventoryCreateEditForm.value.date).format(GIDDH_DATE_FORMAT);
        let reqObj = {
            formValue: this.adjustInventoryCreateEditForm.value,
            branchUniqueName: this.generalService.currentBranchUniqueName
        }
        this.allApiCalled = true;
        this.componentStore.createInventoryAdjustment(reqObj);
    }

    /**
     * This will be use fo calculate calculation
     *
     * @param {FormGroup} adjustInventoryCreateEditForm
     * @param {*} stockGroupClosingBalance
     * @memberof AdjustInventoryComponent
     */
    public calculateCalculation(): void {
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
            let changeInValue = this.adjustInventoryCreateEditForm?.value?.changeInValue;
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

            let changeInValue = this.adjustInventoryCreateEditForm?.value?.changeInValue;
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

    /**
     * This will be use for select all variants
     *
     * @return {*}
     * @memberof AdjustInventoryComponent
     */
    public isAllSelected() {
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
            // Select all rows if isEntityStockGroup is true
            this.dataSource?.filteredData?.forEach(row => this.selection.select(row));
        } else {
            // Toggle selection based on current state
            if (this.isAllSelected()) {
                this.selection.clear();
            } else {
                this.dataSource?.filteredData?.forEach(row => this.selection.select(row));
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

}
