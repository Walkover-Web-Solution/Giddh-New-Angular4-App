import { Component, OnInit, ViewChild } from '@angular/core';
import { AdjustInventoryComponentStore } from './utility/adjust-inventory.store';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { Observable, ReplaySubject, takeUntil, of as observableOf } from 'rxjs';
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
    public adjustmentMethod: any[] = [
        {
            label: 'Quantity Wise',
            value: 'QUANTITY_WISE'
        },
        {
            label: 'Value Wise',
            value: 'VALUE_WISE'

        }
    ];
    /* dayjs object */
    public dayjs = dayjs;
    /** Stock Transactional Object */
    public searchRequest: SearchStockTransactionReportRequest = new SearchStockTransactionReportRequest();
    /** Holds Inventory Type */
    public inventoryType: string;
    /** Holds Calculation methods */
    public calculationMethod: any[] = [
        {
            label: 'Percentage',
            value: 'PERCENTAGE'

        },
        {
            label: 'Value',
            value: 'VALUE'

        }
    ];
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
    /** Holds Store update adjust inventory is success API success state as observable*/
    public updateAdjustInventoryIsSuccess$ = this.componentStore.select(state => state.updateAdjustInventoryIsSuccess);
    /** Holds Store create adjust inventory in progress API success state as observable*/
    public createAdjustInventoryInProgress$ = this.componentStore.select(state => state.createAdjustInventoryInProgress);
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
    }

    /**
     * This will be use for component intialization
     *
     * @memberof AdjustInventoryComponent
     */
    public ngOnInit(): void {
        this.initForm();

        /** Activate router observable */
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.inventoryType = params?.type.toLowerCase();
                this.queryParams = params;
            }
            if (params?.refNo) {
                this.referenceNumber = params?.refNo;
                this.componentStore.getAdjustInventoryData(this.referenceNumber);
            }
        });

        this.getWarehouses();
        this.getResons();
        this.getExpensesAccount();
        this.getItemWiseReport();

        if (this.referenceNumber) {
            this.componentStore.inventoryAdjustData$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    this.initForm(response);
                }
            });
        }

        /** Financial year observable */
        this.componentStore.financialYear$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.stockReportRequest.from = response?.startDate;
            }
        });

        /** Create inventory success observable */
        this.createAdjustInventoryIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate([`/pages/inventory/v2/${this.inventoryType}/adjust-inventory`]);
            }
        });

        /** Update inventory success observable */
        this.updateAdjustInventoryIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.router.navigate([`/pages/inventory/v2/${this.inventoryType}/adjust-inventory`]);
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

        /** Reason observable */
        this.componentStore.reasons$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const mappedReasons: OptionInterface[] = response.results?.map(item => ({
                    value: item.uniqueName,
                    label: item.reason,
                    additional: item
                }));

                mappedReasons.unshift(
                    {
                        value: 'lossByFire',
                        label: 'Loss by fire',
                        additional: {
                            name: 'Loss by fire',
                            uniqueName: 'lossByFire'
                        }
                    },
                    {
                        value: 'lossByTheft',
                        label: 'Loss by theft',
                        additional: {
                            name: 'Loss by theft',
                            uniqueName: 'lossByTheft'
                        }
                    },
                    {
                        value: 'damagedGoods',
                        label: 'Damaged goods',
                        additional: {
                            name: 'Damaged goods',
                            uniqueName: 'damagedGoods'
                        }
                    },
                    {
                        value: 'lossInTransit',
                        label: 'Loss in transit',
                        additional: {
                            name: 'Loss in transit',
                            uniqueName: 'lossInTransit'
                        }
                    },
                    ...mappedReasons
                )
                this.reasons$ = observableOf(mappedReasons);
            }
        });

        /** Setting profile observable */
        this.componentStore.settingsProfile$.pipe(takeUntil(this.destroyed$)).subscribe(profile => {
            if (profile) {
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            }
        });

        /** Item wise observable */
        this.componentStore.itemWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const mappedIItemWise: OptionInterface[] = response.results?.map(item => ({
                    value: item.uniqueName,
                    label: item.name,
                    additional: item
                }));
                this.inventoryList$ = observableOf(mappedIItemWise);
            }
        });

        /** Stock Group CLosing balance observable */
        this.componentStore.stockGroupClosingBalance$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.stockGroupClosingBalance.closing = response;

            }
        });

        /**Variant wise observable */
        this.componentStore.variantWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const data = response?.body?.results.map(result => {
                    return {
                        ...result,
                        newValue: 0,
                        changeValue: 0
                    }
                }) || [];
                this.stockGroupClosingBalance = {
                    newValue: 0,
                    changeValue: 0,
                    closing: 0
                };
                this.dataSource = new MatTableDataSource<any>(data);
                this.adjustInventoryCreateEditForm.patchValue({
                    adjustmentMethod: null,
                    calculationMethod: null,
                    changeInValue: null
                });
                this.showHideTable = false;
                setTimeout(() => {
                    this.showHideTable = true;
                });
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
            }
        });

        /** Expense account observable */
        this.componentStore.expensesAccountList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const mappedAccounts: OptionInterface[] = response.results?.map(item => ({
                    value: item.uniqueName,
                    label: item.name,
                    additional: item
                }));
                this.expenseAccounts$ = observableOf(mappedAccounts);
            }
        });

        /** Warehouse  observable */
        this.componentStore.warehouseList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let warehouseResults = response.results?.filter(warehouse => !warehouse.isArchived);
                const warehouseData = this.settingsUtilityService.getFormattedWarehouseData(warehouseResults);
                const mappedWarehouses: OptionInterface[] = warehouseData?.formattedWarehouses?.map(item => ({
                    value: item.value,
                    label: item.label,
                    additional: item
                }));
                this.warehouses$ = observableOf(mappedWarehouses);
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
            refNo: [value?.refNo ?? null], // No validation needed as per your description
            expenseAccountUniqueName: [value?.expenseAccountUniqueName ?? null, Validators.required],
            warehouseUniqueName: [value?.warehouseUniqueName ?? null],
            description: [value?.description ?? null],
            adjustmentMethod: [value?.adjustmentMethod ?? null, Validators.required], // Default to VALUE_WISE
            calculationMethod: [value?.calculationMethod ?? null, Validators.required], // Default to PERCENTAGE
            changeInValue: [value?.changeInValue ?? null, Validators.required],
            variantUniqueNames: [value?.variantUniqueNames ?? null],
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
        let reqObj;
        let toDate;
        let balanceQueryParams = {
            from: this.stockReportRequest.from ?? '',
            to: this.stockReportRequest.to ?? '',
            stockGroupUniqueName: '',
            entity: ''
        };
        if (typeof this.adjustInventoryCreateEditForm.get('date')?.value === 'object') {
            toDate = dayjs(this.adjustInventoryCreateEditForm.get('date')?.value).format(GIDDH_DATE_FORMAT);
        } else {
            toDate = this.adjustInventoryCreateEditForm.get('date')?.value
        }
        this.entity.entityName = event?.label;
        this.adjustInventoryCreateEditForm.get('entityName').setValue(event?.label);
        this.adjustInventoryCreateEditForm.get('entityUniqueName').setValue(event?.value);
        this.adjustInventoryCreateEditForm.get('entity').setValue(event?.additional?.type);
        this.stockReportRequest.to = toDate;
        let queryParams = {
            from: this.stockReportRequest.from ?? '',
            to: this.stockReportRequest.to ?? '',
            count: 200000000,
            page: this.stockReportRequest.page ?? 1,
            sort: this.stockReportRequest.sort ?? '',
            sortBy: this.stockReportRequest.sortBy ?? ''
        };
        this.stockReportRequest.inventoryType = this.inventoryType?.toUpperCase();
        this.stockReportRequest.branchUniqueNames[0] = this.generalService.currentBranchUniqueName;
        if (event && event.additional?.type === 'STOCK GROUP') {
            this.stockReportRequest.stockUniqueNames = [];
            this.stockReportRequest.stockGroupUniqueNames = [event.value];
            reqObj = {
                queryParams: queryParams,
                stockReportRequest: this.stockReportRequest
            }
            this.componentStore.getVariantWiseReport(reqObj);
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
            this.componentStore.getStockGroupClosingBalance(balanceReqObj);
        } else {
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
            this.componentStore.getStockGroupClosingBalance(balanceReqObj);
        }
        ;
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
        this.componentStore.updateInventoryAdjustment(reqObj);
    }

    /**
     * This will be use for create inventory
     *
     * @return {*}  {void}
     * @memberof AdjustInventoryComponent
     */
    public createInventory(): void {
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
        this.componentStore.createInventoryAdjustment(reqObj);
    }

    /**
     * This will be use fo calculate calculation
     *
     * @param {FormGroup} adjustInventoryCreateEditForm
     * @param {*} stockGroupClosingBalance
     * @memberof AdjustInventoryComponent
     */
    public calculateCalculation(adjustInventoryCreateEditForm: FormGroup, stockGroupClosingBalance: any): void {
        if (adjustInventoryCreateEditForm.value.entityUniqueName &&
            adjustInventoryCreateEditForm.value.adjustmentMethod === 'QUANTITY_WISE' &&
            adjustInventoryCreateEditForm.value.calculationMethod === 'PERCENTAGE') {
            this.stockGroupClosingBalance.changeValue = 0;
            this.stockGroupClosingBalance.newValue = 0;
            let changeInValue = stockGroupClosingBalance.closing?.closing?.quantity * (adjustInventoryCreateEditForm?.value?.changeInValue / 100);
            let newValue = stockGroupClosingBalance.closing?.closing?.quantity - changeInValue;

            this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
            this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

            const data = this.dataSource.data.map(result => {
                result.changeValue = result.closing?.quantity * (adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                result.newValue = giddhRoundOff(result.closing?.quantity - result.changeValue, this.giddhBalanceDecimalPlaces);
                return result
            }) || [];
            this.dataSource.data = data;
        }

        if (adjustInventoryCreateEditForm.value.entityUniqueName &&
            adjustInventoryCreateEditForm.value.adjustmentMethod === 'QUANTITY_WISE'
            && adjustInventoryCreateEditForm.value.calculationMethod === 'VALUE') {
            this.stockGroupClosingBalance.changeValue = 0;
            this.stockGroupClosingBalance.newValue = 0;
            let changeInValue = adjustInventoryCreateEditForm?.value?.changeInValue;
            let newValue = stockGroupClosingBalance.closing?.closing?.quantity - changeInValue;

            this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
            this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

            const data = this.dataSource.data.map(result => {
                result.changeValue = adjustInventoryCreateEditForm?.value?.changeInValue;
                result.newValue = giddhRoundOff(result.closing?.quantity - result.changeValue, this.giddhBalanceDecimalPlaces);
                return result
            }) || [];
            this.dataSource.data = data;
        }

        if (adjustInventoryCreateEditForm.value.entityUniqueName &&
            adjustInventoryCreateEditForm.value.adjustmentMethod === 'VALUE_WISE' &&
            adjustInventoryCreateEditForm.value.calculationMethod === 'PERCENTAGE') {
            this.stockGroupClosingBalance.changeValue = 0;
            this.stockGroupClosingBalance.newValue = 0;
            let changeInValue = stockGroupClosingBalance.closing?.closing?.amount * (adjustInventoryCreateEditForm?.value?.changeInValue / 100);
            let newValue = stockGroupClosingBalance.closing?.closing?.amount - changeInValue;

            this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
            this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

            const data = this.dataSource.data.map(result => {
                result.changeValue = result.closing?.amount * (adjustInventoryCreateEditForm?.value?.changeInValue / 100);
                result.newValue = giddhRoundOff(result.closing?.amount - result.changeValue, this.giddhBalanceDecimalPlaces);
                return result
            }) || [];
            this.dataSource.data = data;

        }

        if (adjustInventoryCreateEditForm.value.entityUniqueName &&
            adjustInventoryCreateEditForm.value.adjustmentMethod === 'VALUE_WISE' &&
            adjustInventoryCreateEditForm.value.calculationMethod === 'VALUE') {
            this.stockGroupClosingBalance.changeValue = 0;
            this.stockGroupClosingBalance.newValue = 0;
            let changeInValue = adjustInventoryCreateEditForm?.value?.changeInValue;
            let newValue = stockGroupClosingBalance.closing?.closing?.amount - changeInValue;

            this.stockGroupClosingBalance.changeValue = giddhRoundOff(changeInValue, this.giddhBalanceDecimalPlaces);
            this.stockGroupClosingBalance.newValue = giddhRoundOff(newValue, this.giddhBalanceDecimalPlaces);

            const data = this.dataSource.data.map(result => {
                result.changeValue = adjustInventoryCreateEditForm?.value?.changeInValue;
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
     * This will be use for master toggle by indirectExpense
     *
     * @memberof AdjustInventoryComponent
     */
    public masterToggle() {
        if (this.isAllSelected()) {
            this.selection.clear();
        } else {
            this.dataSource?.filteredData?.forEach(row => this.selection.select(row));
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
            return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

}
