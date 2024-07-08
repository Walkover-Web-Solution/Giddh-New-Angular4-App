import { Component, OnInit, ViewChild } from '@angular/core';
import { AdjustInventoryComponentStore } from './utility/adjust-inventory.store';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { Observable, ReplaySubject, takeUntil, of as observableOf } from 'rxjs';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OptionInterface } from '../../../models/api-models/Voucher';
import { SearchStockTransactionReportRequest, StockTransactionReportRequest } from '../../../models/api-models/Inventory';
import { ActivatedRoute } from '@angular/router';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as dayjs from 'dayjs';
import { GeneralService } from '../../../services/general.service';
@Component({
    selector: 'adjust-inventory',
    templateUrl: './adjust-inventory.component.html',
    styleUrls: ['./adjust-inventory.component.scss'],
    providers: [AdjustInventoryComponentStore]
})

export class AdjustInventoryComponent implements OnInit {
    /** Instance of create unit component */
    @ViewChild("createReason", { static: false }) public createReason: any;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Modal instance */
    public matDialogRef: any;
    /** Adjust inventory form group */
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
    public panelOpenState = false;
    /** Adjustment Method  */
    public adjustmentMethod: any[] = [
        {
            label: 'Quantity Wise',
            value: 'QUANTITY_WISE'
        },
        {
            label: 'Value Wise',
            value: 'VAlUE_WISE'

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
            value: 'PERCENTAGE',

        },
        {
            label: 'Number',
            value: '#',

        },
    ];
    /** Stock Transactional Object */
    public stockReportRequest: StockTransactionReportRequest = new StockTransactionReportRequest();
    /** Hold inventory variant wise response */
    public displayedColumns: any[] = ['select', 'method', 'changeValue', 'closingValue', 'changes', 'newValue'];
    public dataSource: any[] = [];
    constructor(
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private settingsUtilityService: SettingsUtilityService,
        private generalService: GeneralService,
        private componentStore: AdjustInventoryComponentStore,
        private formBuilder: FormBuilder,
        private dialog: MatDialog,
        private route: ActivatedRoute
    ) {
    }
    public ngOnInit(): void {
        this.initForm();
        this.getWarehouses();
        this.getResons();
        this.getExpensesAccount();
        this.getItemWiseReport();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            console.log(params);
            if (params?.type) {
                this.inventoryType = params?.type.toLowerCase();
            }
        });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.stockReportRequest.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.stockReportRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });

        this.componentStore.reasons$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const mappedReasons: OptionInterface[] = response.results.map(item => ({
                    value: item.uniqueName,
                    label: item.reason,
                    additional: item
                }));
                this.reasons$ = observableOf(mappedReasons);
            }
        });

        this.componentStore.itemWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const mappedIItemWise: OptionInterface[] = response.results.map(item => ({
                    value: item.uniqueName,
                    label: item.name,
                    additional: item
                }));
                this.inventoryList$ = observableOf(mappedIItemWise);
            }
        });

        this.componentStore.variantWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);

            if (response) {
                this.dataSource = response?.body?.results;
            }
        });

        this.componentStore.expensesAccountList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const mappedAccounts: OptionInterface[] = response.results.map(item => ({
                    value: item.uniqueName,
                    label: item.name,
                    additional: item
                }));
                this.expenseAccounts$ = observableOf(mappedAccounts);
            }
        });

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

    public getItemWiseReport(): void {
        console.log(this.searchRequest);
        this.searchRequest.count = 200000000;
        this.searchRequest.inventoryType = this.inventoryType?.toUpperCase();
        this.searchRequest.searchPage = 'VARIANT';
        this.componentStore.getItemWiseReport(this.searchRequest);
    }

    public getExpensesAccount(): void {
        this.componentStore.getExpensesAccounts(this.groupUniqueName);
    }

    /**
   * Opens create reason modal
   *
   * @memberof CustomUnitsComponent
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
     * @memberof CustomUnitsComponent
     */
    public closeCreateReasonModal(event: boolean): void {
        this.matDialogRef?.close();

        if (event) {
            this.getResons();
        }
    }

    private initForm(): void {
        this.adjustInventoryCreateEditForm = this.formBuilder.group({
            entity: [''],
            entityName: [''],
            entityUniqueName: [''],
            reasonUniqueName: [''],
            date: [''],
            refNo: [''], // No validation needed as per your description
            expenseAccountUniqueName: [''],
            warehouseUniqueName: [''],
            description: [''],
            adjustmentMethod: [''], // Default to VALUE_WISE
            calculationMethod: [''], // Default to PERCENTAGE
            changeInValue: [''],
            variantUniqueNames: [],
        });
    }

    /**
   * Callback for select inventory
   *
   * @param {*} event
   * @param {boolean} [isClear=false]
   * @memberof VoucherCreateComponent
   */
    public selectInventory(event: any, isClear: boolean = false): void {
        console.log(event);
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
            let reqObj = {
                queryParams: queryParams,
                stockReportRequest: this.stockReportRequest
            }
            this.componentStore.getVariantWiseReport(reqObj);
        } else {
            let reqObj = {
                queryParams: queryParams,
                stockReportRequest: this.stockReportRequest
            }
            this.stockReportRequest.stockGroupUniqueNames = [];
            this.stockReportRequest.stockUniqueNames = [event.value];
            this.componentStore.getVariantWiseReport(reqObj);
        }

    }

    /**
     * Gets company warehouses
     *
     * @private
     * @memberof VoucherCreateComponent
     */
    private getWarehouses(): void {
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
    }

    public getResons(): void {
        this.componentStore.getAllReasons(true);
    }

}
