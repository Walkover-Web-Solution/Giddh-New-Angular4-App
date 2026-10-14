import { A11yModule } from "@angular/cdk/a11y";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { API_BULK_FETCH_LIMIT, IOption } from "../../../app.constant";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { BatchReportItem } from "../../../models/interfaces/batch-report.interface";
import { InventoryService } from "../../../services/inventory.service";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { GiddhDatepickerModule } from "../../../theme/giddh-datepicker/giddh-datepicker.module";
import { cloneDeep } from "../../../lodash-optimized";
import { mapAvailabilityBatches } from "../batch-report/batch-report.helper";

dayjs.extend(customParseFormat);

export interface VariantOpeningBalanceDialogData {
    variantName?: string;
    unitName?: string;
    stockUnit?: { name?: string; uniqueName?: string };
    warehouseBalance?: any[];
    warehouses?: any[];
    localeData?: any;
    commonLocaleData?: any;
    currencySymbol?: string;
    inputMaskFormat?: string;
}

export interface VariantOpeningBalanceDialogResult {
    warehouseBalance: any[];
}

@Component({
    selector: "variant-opening-balance-dialog",
    templateUrl: "./variant-opening-balance-dialog.component.html",
    styleUrls: ["./variant-opening-balance-dialog.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        A11yModule,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatSlideToggleModule,
        MatTooltipModule,
        FormFieldsModule,
        GiddhDatepickerModule
    ]
})
export class VariantOpeningBalanceDialogComponent implements OnDestroy {
    /** RxJS teardown. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Working copy of warehouse balance rows. */
    public warehouseBalance: any[] = [];
    /** Parent locale strings. */
    public localeData: any = {};
    /** Common locale strings. */
    public commonLocaleData: any = {};
    /** Company warehouses. */
    public warehouses: any[] = [];
    /** Availability dropdown options keyed by warehouse unique name. */
    private batchAvailabilityByWarehouse: Record<string, IOption[]> = {};
    /** Batch numbers already used on other rows. */
    private selectedBatchNumbers: string[] = [];
    /** Company currency symbol. */
    public currencySymbol: string = "";
    /** Amount mask. */
    public inputMaskFormat: string = "";
    /** Stock unit applied to warehouse rows. */
    private stockUnit: { name?: string; uniqueName?: string } = {};
    /** True after Apply is clicked with validation errors. */
    public isApplySubmitted: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: VariantOpeningBalanceDialogData,
        private dialogRef: MatDialogRef<VariantOpeningBalanceDialogComponent, VariantOpeningBalanceDialogResult | undefined>,
        private inventoryService: InventoryService,
        private cdr: ChangeDetectorRef
    ) {
        this.localeData = dialogData?.localeData ?? {};
        this.commonLocaleData = dialogData?.commonLocaleData ?? {};
        this.currencySymbol = dialogData?.currencySymbol ?? "";
        this.inputMaskFormat = dialogData?.inputMaskFormat ?? "";
        this.warehouses = dialogData?.warehouses ?? [];
        this.stockUnit = { ...(dialogData?.stockUnit ?? {}) };
        this.warehouseBalance = this.normalizeIncomingWarehouses(dialogData?.warehouseBalance);
        if (!this.warehouseBalance.length) {
            this.warehouseBalance = [this.createEmptyWarehouseRow()];
        }
        this.warehouseBalance.forEach(warehouse => {
            if (warehouse?.warehouse?.uniqueName) {
                this.searchBatchAvailability("", warehouse.warehouse.uniqueName);
            }
        });
        this.syncSelectedBatchNumbers();
    }

    /**
     * Cleanup.
     *
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Warehouse dropdown options excluding warehouses already selected on other rows.
     *
     * @param {number} rowIndex Current warehouse row index
     * @return {*}  {IOption[]}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public getWarehouseOptions(rowIndex: number): IOption[] {
        const selectedUniqueNames = this.warehouseBalance
            .map((row, index) => (index === rowIndex ? "" : row?.warehouse?.uniqueName))
            .filter(Boolean);
        return (this.warehouses ?? [])
            .filter(warehouse => warehouse?.uniqueName && !selectedUniqueNames.includes(warehouse.uniqueName))
            .map(warehouse => ({
                label: warehouse?.name,
                value: warehouse?.uniqueName,
                additional: warehouse
            }));
    }

    /**
     * Display name for warehouse dropdown.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @return {*}  {string}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public getWarehouseLabel(warehouseRow: any): string {
        return warehouseRow?.warehouse?.name ?? "";
    }

    /**
     * Adds an empty warehouse card with one empty batch when tracking is on.
     *
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public addWarehouse(): void {
        const row = this.createEmptyWarehouseRow();
        this.warehouseBalance.push(row);
        this.cdr.detectChanges();
    }

    /**
     * Removes a warehouse row when more than one exists.
     *
     * @param {number} index Warehouse row index
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public removeWarehouse(index: number): void {
        if (this.warehouseBalance.length <= 1) {
            this.clearWarehouse(index);
            return;
        }
        this.warehouseBalance.splice(index, 1);
        this.syncSelectedBatchNumbers();
        this.cdr.detectChanges();
    }

    /**
     * Clears qty, amount and resets batches for a single warehouse row.
     *
     * @param {number} index Warehouse row index
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public clearWarehouse(index: number): void {
        const row = this.warehouseBalance[index];
        if (!row) {
            return;
        }
        row.openingQuantity = 0;
        row.openingAmount = 0;
        if (row.isShowBatch) {
            row.batches = [this.createEmptyBatch()];
        } else {
            row.batches = [];
        }
        this.syncSelectedBatchNumbers();
        this.cdr.detectChanges();
    }

    /**
     * Handles warehouse selection on a row.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @param {*} option Selected dropdown option
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public onWarehouseSelected(warehouseRow: any, option: any): void {
        if (!option?.value) {
            return;
        }
        const warehouseChanged = warehouseRow?.warehouse?.uniqueName !== option.value;
        warehouseRow.warehouse = {
            name: option.label,
            uniqueName: option.value
        };
        if (warehouseChanged) {
            this.filterBatchesForWarehouse(warehouseRow, option.value);
            this.syncSelectedBatchNumbers();
        }
        this.searchBatchAvailability("", option.value);
        this.cdr.detectChanges();
    }

    /**
     * Keeps batches for the selected warehouse; drops only batches tied to another warehouse.
     *
     * @private
     * @param {*} warehouseRow Warehouse balance row
     * @param {string} warehouseUniqueName Newly selected warehouse
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private filterBatchesForWarehouse(warehouseRow: any, warehouseUniqueName: string): void {
        if (!warehouseRow?.isShowBatch) {
            warehouseRow.batches = [];
            return;
        }
        const selectedWarehouse = String(warehouseUniqueName ?? "").trim();
        const keptBatches = (warehouseRow.batches ?? []).filter(batch => {
            const batchWarehouse = String(batch?.warehouseUniqueName ?? "").trim();
            return !batchWarehouse || batchWarehouse === selectedWarehouse;
        });
        warehouseRow.batches = keptBatches.length ? keptBatches : [this.createEmptyBatch()];
    }

    /**
     * Toggles batch tracking visibility for a warehouse (`isShowBatch`).
     *
     * @param {*} warehouseRow Warehouse balance row
     * @param {boolean} checked Toggle value
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public onTrackByBatchChange(warehouseRow: any, checked: boolean): void {
        warehouseRow.isShowBatch = checked;
        if (checked && (!Array.isArray(warehouseRow.batches) || !warehouseRow.batches.length)) {
            warehouseRow.batches = [this.createEmptyBatch()];
        }
        this.cdr.detectChanges();
    }

    /**
     * Adds an empty batch under a warehouse.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public addBatch(warehouseRow: any): void {
        if (!Array.isArray(warehouseRow.batches)) {
            warehouseRow.batches = [];
        }
        warehouseRow.batches.push(this.createEmptyBatch());
        this.cdr.detectChanges();
    }

    /**
     * Removes a batch row, keeping one empty row when it is the last.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @param {number} batchIndex Batch index
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public removeBatch(warehouseRow: any, batchIndex: number): void {
        if (!warehouseRow?.batches?.length) {
            return;
        }
        if (warehouseRow.batches.length <= 1) {
            this.resetBatch(warehouseRow, batchIndex);
            return;
        }
        warehouseRow.batches.splice(batchIndex, 1);
        this.syncSelectedBatchNumbers();
        this.cdr.detectChanges();
    }

    /**
     * Clears the only remaining batch row instead of removing it.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @param {number} batchIndex Batch index
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public resetBatch(warehouseRow: any, batchIndex: number): void {
        if (!warehouseRow?.batches?.[batchIndex]) {
            return;
        }
        warehouseRow.batches[batchIndex] = this.createEmptyBatch();
        this.syncSelectedBatchNumbers();
        this.cdr.detectChanges();
    }

    /**
     * Sum of batch opening quantities for one warehouse.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @return {*}  {number}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public getWarehouseBatchOpeningQtyTotal(warehouseRow: any): number {
        return (warehouseRow?.batches ?? []).reduce((total, batch) => {
            return total + (Number(batch?.openingQuantity) || 0);
        }, 0);
    }

    /**
     * Sum of batch opening amounts for one warehouse.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @return {*}  {number}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public getWarehouseBatchOpeningAmountTotal(warehouseRow: any): number {
        return (warehouseRow?.batches ?? []).reduce((total, batch) => {
            return total + this.parseOpeningAmount(batch?.openingAmount);
        }, 0);
    }

    /**
     * True when batch qty total exceeds warehouse opening qty.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @return {*}  {boolean}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public isWarehouseBatchQtyExceeded(warehouseRow: any): boolean {
        if (!warehouseRow?.isShowBatch) {
            return false;
        }
        return this.getWarehouseBatchOpeningQtyTotal(warehouseRow) > (Number(warehouseRow?.openingQuantity) || 0);
    }

    /**
     * True when batch amount total exceeds warehouse opening amount.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @return {*}  {boolean}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public isWarehouseBatchAmountExceeded(warehouseRow: any): boolean {
        if (!warehouseRow?.isShowBatch) {
            return false;
        }
        return this.getWarehouseBatchOpeningAmountTotal(warehouseRow) > this.parseOpeningAmount(warehouseRow?.openingAmount);
    }

    /**
     * Sets warehouse opening qty from batch qty total.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public applyBatchQtyToWarehouseOpening(warehouseRow: any): void {
        if (!warehouseRow) {
            return;
        }
        warehouseRow.openingQuantity = this.getWarehouseBatchOpeningQtyTotal(warehouseRow);
        this.cdr.detectChanges();
    }

    /**
     * Sets warehouse opening amount from batch amount total.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public applyBatchAmountToWarehouseOpening(warehouseRow: any): void {
        if (!warehouseRow) {
            return;
        }
        warehouseRow.openingAmount = this.getWarehouseBatchOpeningAmountTotal(warehouseRow);
        this.cdr.detectChanges();
    }

    /**
     * Variant total quantity across warehouses (UI only).
     *
     * @return {*}  {number}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public getVariantTotalQty(): number {
        return this.warehouseBalance.reduce((total, warehouse) => {
            return total + (Number(warehouse?.openingQuantity) || 0);
        }, 0);
    }

    /**
     * Variant total amount across warehouses (UI only).
     *
     * @return {*}  {number}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public getVariantTotalAmount(): number {
        return this.warehouseBalance.reduce((total, warehouse) => {
            return total + this.parseOpeningAmount(warehouse?.openingAmount);
        }, 0);
    }

    /**
     * Batch availability options for one row.
     *
     * @param {*} batch Current batch row
     * @return {*}  {IOption[]}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public getBatchAvailabilityOptions(batch: any, warehouseUniqueName: string = ""): IOption[] {
        const warehouseKey = String(warehouseUniqueName ?? "").trim();
        const options = this.batchAvailabilityByWarehouse[warehouseKey] ?? [];
        const currentValue = String(batch?.batchNumber ?? "").trim();
        return options.filter(option => {
            const optionValue = String(option?.value ?? "").trim();
            return optionValue && (optionValue === currentValue || !this.selectedBatchNumbers.includes(optionValue));
        });
    }

    /**
     * Search batches from availability API with warehouse filter (same as voucher batch select).
     *
     * @param {string} [query=""] Search text
     * @param {string} [warehouseUniqueName=""] Selected warehouse unique name
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public searchBatchAvailability(query: string = "", warehouseUniqueName: string = ""): void {
        const warehouseKey = String(warehouseUniqueName ?? "").trim();
        this.inventoryService.getBatchAvailability({
            uniqueName: "",
            isVariant: false,
            page: 1,
            count: API_BULK_FETCH_LIMIT,
            sort: "asc",
            sortBy: "expiry",
            q: query ?? "",
            noStock: true,
            excludeBatchUniqueName: "",
            warehouseUniqueName: warehouseKey
        }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.batchAvailabilityByWarehouse[warehouseKey] = mapAvailabilityBatches(response);
            this.syncSelectedBatchNumbers();
            this.cdr.detectChanges();
        });
    }

    /**
     * Apply a selected availability batch to the row.
     *
     * @param {*} batch Batch row
     * @param {*} event Selected dropdown option
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public onBatchAvailabilitySelected(batch: any, event: any, warehouseUniqueName: string = ""): void {
        if (event?.additional) {
            this.applyAvailabilityBatchToRow(batch, event.additional, warehouseUniqueName);
        } else if (event?.value) {
            batch.uniqueName = event.value;
            batch.batchNumber = event.value;
            batch.name = batch.name ? batch.name : event.label;
            batch.warehouseUniqueName = warehouseUniqueName || batch.warehouseUniqueName;
        }
        this.syncSelectedBatchNumbers();
        this.cdr.detectChanges();
    }

    /**
     * Whether batch number/name are required for the row.
     *
     * @param {*} batch Batch row
     * @return {*}  {boolean}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public isBatchNameRequired(batch: any): boolean {
        return Number(batch?.openingQuantity) > 0 || Number(batch?.openingAmount) > 0;
    }

    /**
     * Closes without saving.
     *
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public cancel(): void {
        this.dialogRef.close();
    }

    /**
     * Applies warehouse balance back to the parent.
     *
     * @memberof VariantOpeningBalanceDialogComponent
     */
    /**
     * Warehouse is required only when the row has batch data or opening qty/amount.
     *
     * @param {*} warehouseRow Warehouse balance row
     * @return {*}  {boolean}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    public isWarehouseSelectionRequired(warehouseRow: any): boolean {
        const hasOpening = Number(warehouseRow?.openingQuantity) > 0 || this.parseOpeningAmount(warehouseRow?.openingAmount) > 0;
        const hasBatches = (warehouseRow?.batches ?? []).some(batch => this.hasBatchContent(batch));
        return hasOpening || hasBatches;
    }

    public apply(): void {
        this.isApplySubmitted = true;
        const hasMissingWarehouse = this.warehouseBalance.some(warehouse =>
            this.isWarehouseSelectionRequired(warehouse) && !warehouse?.warehouse?.uniqueName
        );
        if (hasMissingWarehouse) {
            this.cdr.detectChanges();
            return;
        }
        this.dialogRef.close({
            warehouseBalance: cloneDeep(this.warehouseBalance)
        });
    }

    /**
     * Normalize incoming warehouse rows and ensure defaults.
     *
     * @private
     * @param {any[]} [rows]
     * @return {*}  {any[]}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private normalizeIncomingWarehouses(rows?: any[]): any[] {
        const source = Array.isArray(rows) ? cloneDeep(rows) : [];
        return source
            .filter(row =>
                Number(row?.openingQuantity) > 0
                || this.parseOpeningAmount(row?.openingAmount) > 0
                || (row?.batches ?? []).some(batch => this.hasBatchContent(batch))
            )
            .map(row => {
                const warehouseUniqueName = row?.warehouse?.uniqueName;
                const batches = (Array.isArray(row.batches) ? row.batches : [])
                    .map(batch => this.normalizeBatch(batch, warehouseUniqueName))
                    .filter(batch => this.hasBatchContent(batch));
                const hasBatchData = batches.length > 0;
                return {
                    warehouse: {
                        name: row?.warehouse?.name,
                        uniqueName: warehouseUniqueName
                    },
                    stockUnit: row?.stockUnit?.uniqueName ? { ...row.stockUnit } : { ...this.stockUnit },
                    openingQuantity: Number(row?.openingQuantity) || 0,
                    openingAmount: row?.openingAmount ?? 0,
                    isShowBatch: hasBatchData,
                    batches: hasBatchData ? batches : []
                };
            });
    }

    /**
     * Empty warehouse card with track-by-batch on by default.
     *
     * @private
     * @return {*}  {*}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private createEmptyWarehouseRow(): any {
        return {
            warehouse: {
                name: undefined,
                uniqueName: undefined
            },
            stockUnit: { ...this.stockUnit },
            openingQuantity: 0,
            openingAmount: 0,
            isShowBatch: true,
            batches: [this.createEmptyBatch()]
        };
    }

    /**
     * Empty batch row.
     *
     * @private
     * @return {*}  {*}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private createEmptyBatch(): any {
        return {
            uniqueName: undefined,
            batchNumber: "",
            name: "",
            manufacturingDate: null,
            expiryDate: null,
            openingQuantity: null,
            openingAmount: null
        };
    }

    /**
     * Normalize a batch for the datepicker.
     *
     * @private
     * @param {*} batch
     * @return {*}  {*}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private normalizeBatch(batch: any, warehouseUniqueName: string = ""): any {
        return {
            uniqueName: batch?.uniqueName,
            batchNumber: batch?.batchNumber ?? "",
            name: batch?.name ?? "",
            manufacturingDate: this.parseBatchDate(batch?.manufacturingDate),
            expiryDate: this.parseBatchDate(batch?.expiryDate),
            openingQuantity: batch?.openingQuantity ?? null,
            openingAmount: batch?.openingAmount ?? null,
            warehouseUniqueName: batch?.warehouse?.uniqueName
                || batch?.warehouseUniqueName
                || warehouseUniqueName
        };
    }

    /**
     * True when a batch row has any entered content.
     *
     * @private
     * @param {*} batch
     * @return {*}  {boolean}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private hasBatchContent(batch: any): boolean {
        return !!(
            String(batch?.batchNumber ?? "").trim()
            || String(batch?.name ?? "").trim()
            || batch?.manufacturingDate
            || batch?.expiryDate
            || Number(batch?.openingQuantity)
            || this.parseOpeningAmount(batch?.openingAmount)
        );
    }

    /**
     * Sync selected batch numbers for dropdown filtering.
     *
     * @private
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private syncSelectedBatchNumbers(): void {
        const uniqueNames = new Set<string>();
        this.warehouseBalance.forEach(warehouse => {
            (warehouse?.batches ?? []).forEach(batch => {
                const value = String(batch?.batchNumber ?? "").trim();
                if (value) {
                    uniqueNames.add(value);
                }
            });
        });
        this.selectedBatchNumbers = Array.from(uniqueNames);
    }

    /**
     * Apply availability batch fields onto a row.
     *
     * @private
     * @param {*} batch
     * @param {BatchReportItem} item
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private applyAvailabilityBatchToRow(batch: any, item: BatchReportItem, warehouseUniqueName: string = ""): void {
        batch.batchNumber = item.batchNumber ?? "";
        batch.name = !batch.name && item.name ? item.name : batch.name;
        batch.manufacturingDate = !batch.manufacturingDate && this.parseBatchDate(item.manufacturingDate)
            ? this.parseBatchDate(item.manufacturingDate)
            : batch.manufacturingDate;
        batch.expiryDate = !batch.expiryDate && this.parseBatchDate(item.expiryDate)
            ? this.parseBatchDate(item.expiryDate)
            : batch.expiryDate;
        batch.openingQuantity = !batch.openingQuantity && item.openingQuantity ? item.openingQuantity : batch.openingQuantity;
        batch.openingAmount = !batch.openingAmount && item.openingAmount ? item.openingAmount : batch.openingAmount;
        batch.uniqueName = !batch.uniqueName && item.uniqueName ? item.uniqueName : batch.uniqueName;
        batch.warehouseUniqueName = item?.warehouse?.uniqueName || warehouseUniqueName || batch.warehouseUniqueName;
    }

    /**
     * Parse amount masks to number.
     *
     * @private
     * @param {*} value
     * @return {*}  {number}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private parseOpeningAmount(value: any): number {
        return Number(String(value ?? "").toString().replace(/,/g, "")) || 0;
    }

    /**
     * Parse API date for datepicker.
     *
     * @private
     * @param {*} value
     * @return {*}  {(Date | null)}
     * @memberof VariantOpeningBalanceDialogComponent
     */
    private parseBatchDate(value: any): Date | null {
        if (!value) {
            return null;
        }
        if (value instanceof Date) {
            return value;
        }
        if (typeof value === "object") {
            const fromObject = dayjs(value);
            return fromObject.isValid() ? fromObject.toDate() : null;
        }
        const parsed = dayjs(value, GIDDH_DATE_FORMAT, true);
        return parsed.isValid() ? parsed.toDate() : null;
    }
}
