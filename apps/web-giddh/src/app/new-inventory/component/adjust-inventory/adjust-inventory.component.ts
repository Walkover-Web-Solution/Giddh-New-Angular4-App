import { Component, OnInit, ViewChild, ElementRef, ViewChildren, TemplateRef } from '@angular/core';
import { AdjustInventoryComponentStore } from './utility/adjust-inventory.store';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { Observable, ReplaySubject, takeUntil, of as observableOf } from 'rxjs';
import { SettingsUtilityService } from '../../../settings/services/settings-utility.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OptionInterface } from '../../../models/api-models/Voucher';
import { SearchStockTransactionReportRequest } from '../../../models/api-models/Inventory';
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
    public method: any[] = [
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
    public searchRequest: SearchStockTransactionReportRequest = new SearchStockTransactionReportRequest();
    public displayedColumns: any[] = ['select', 'position', 'name', 'weight', 'symbol'];
    public dataSource: any[] = [
        { position: 'Red', name: 5000, weight: 500, symbol: 5500 },
        { position: 'Green', name: 5000, weight: 500, symbol: 5500 },
        { position: 'Blue', name: 5000, weight: 500, symbol: 5500 },
    ];

    constructor(
        private store: Store<AppState>,
        private warehouseActions: WarehouseActions,
        private settingsUtilityService: SettingsUtilityService,
        private componentStore: AdjustInventoryComponentStore,
        private formBuilder: FormBuilder,
        private dialog: MatDialog
    ) {
     }
    public ngOnInit(): void {
        this.initForm();
        this.getWarehouses();
        this.getResons();
        this.getExpensesAccount();
        this.getItemWiseReport();

        this.componentStore.reasons$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const mappedReasons: OptionInterface[] = response.results.map(item => ({
                    value: item.uniqueName,
                    label: item.reason,
                    additional: {
                        type: item
                    }
                }));
                this.reasons$ = observableOf(mappedReasons);
            }
        });

        this.componentStore.itemWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
            // if (response) {
            //     const mappedReasons: OptionInterface[] = response.results.map(item => ({
            //         value: item.uniqueName,
            //         label: item.reason,
            //         additional: {
            //             type: item
            //         }
            //     }));
            //     this.reasons$ = observableOf(mappedReasons);
            // }
        });

        this.componentStore.expensesAccountList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                const mappedAccounts: OptionInterface[] = response.results.map(item => ({
                    value: item.uniqueName,
                    label: item.name,
                    additional: {
                        type: item
                    }
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
                    additional: {
                        type: item
                    }
                }));
                this.warehouses$ = observableOf(mappedWarehouses);
            }
        });
    }

    public getItemWiseReport(): void {
        console.log(this.searchRequest);
        this.searchRequest.count = 50;
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
