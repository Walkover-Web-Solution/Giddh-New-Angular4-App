import { A11yModule } from "@angular/cdk/a11y";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { IOption } from "../../../app.constant";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { BatchReportItem } from "../../../models/interfaces/batch-report.interface";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { GiddhDatepickerModule } from "../../../theme/giddh-datepicker/giddh-datepicker.module";
import { mapAvailabilityBatches } from "../batch-report/batch-report.helper";
import { cloneDeep } from "../../../lodash-optimized";
import { API_BULK_FETCH_LIMIT } from "../../../app.constant";

dayjs.extend(customParseFormat);

export interface StockOpeningBatchDialogData {
    stockName?: string;
    stockUniqueName?: string;
    variantName?: string;
    variantUniqueName?: string;
    warehouseName?: string;
    warehouseUniqueName?: string;
    openingAmount?: number | string;
    openingQuantity?: number | string;
    stockUnit?: { name?: string; code?: string; uniqueName?: string };
    stockUnits?: IOption[];
    batches?: any[];
    localeData?: any;
    commonLocaleData?: any;
    currencySymbol?: string;
    inputMaskFormat?: string;
}

export interface StockOpeningBatchDialogResult {
    batches: any[];
    openingAmount: number;
    openingQuantity: number;
    stockUnit?: { name?: string; code?: string; uniqueName?: string };
}

@Component({
    selector: "stock-opening-batch-dialog",
    templateUrl: "./stock-opening-batch-dialog.component.html",
    styleUrls: ["./stock-opening-batch-dialog.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        A11yModule,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatDialogModule,
        MatTooltipModule,
        FormFieldsModule,
        GiddhDatepickerModule
    ]
})
export class StockOpeningBatchDialogComponent implements OnInit, OnDestroy {
    /** RxJS teardown. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Parent locale strings. */
    public localeData: any = {};
    /** Common locale strings. */
    public commonLocaleData: any = {};
    /** Opening batch rows. */
    public batches: any[] = [];
    /** Warehouse opening amount. */
    public openingAmount: any = 0;
    /** Warehouse opening quantity. */
    public openingQuantity: any = 0;
    /** Selected stock unit. */
    public stockUnit: { name?: string; code?: string; uniqueName?: string } = {};
    /** Availability dropdown options. */
    public allBatchAvailabilityOptions: IOption[] = [];
    /** Batch numbers already used on other rows. */
    public selectedBatchNumbers: string[] = [];
    /** Company currency symbol. */
    public currencySymbol: string = "";
    /** Amount mask. */
    public inputMaskFormat: string = "";

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: StockOpeningBatchDialogData,
        private dialogRef: MatDialogRef<StockOpeningBatchDialogComponent, StockOpeningBatchDialogResult | undefined>,
        private inventoryService: InventoryService,
        private toasterService: ToasterService,
        private cdr: ChangeDetectorRef
    ) {
        this.localeData = dialogData?.localeData ?? {};
        this.commonLocaleData = dialogData?.commonLocaleData ?? {};
        this.currencySymbol = dialogData?.currencySymbol ?? "";
        this.inputMaskFormat = dialogData?.inputMaskFormat ?? "";
        this.openingAmount = dialogData?.openingAmount ?? 0;
        this.openingQuantity = dialogData?.openingQuantity ?? 0;
        this.stockUnit = { ...(dialogData?.stockUnit ?? {}) };
        this.batches = this.normalizeIncomingBatches(dialogData?.batches);
        if (!this.batches.length) {
            this.batches.push(this.createEmptyBatch());
        }
    }

    /**
     * Loads existing batch numbers for the dropdown.
     *
     * @memberof StockOpeningBatchDialogComponent
     */
    public ngOnInit(): void {
        this.searchBatchAvailability("");
        this.syncSelectedBatchNumbers();
    }

    /**
     * Dropdown options for one row, hiding numbers used on other rows.
     *
     * @param {*} batch
     * @return {*}  {IOption[]}
     * @memberof StockOpeningBatchDialogComponent
     */
    public getBatchAvailabilityOptions(batch: any): IOption[] {
        const current = String(batch?.batchNumber ?? "").trim();
        return this.allBatchAvailabilityOptions.filter(option => {
            const optionValue = String(option?.value ?? "").trim();
            return optionValue && (optionValue === current || !this.selectedBatchNumbers.includes(optionValue));
        });
    }

    /**
     * Search availability with `noStock=true`, same as stock create/edit.
     *
     * @param {string} [query]
     * @memberof StockOpeningBatchDialogComponent
     */
    public searchBatchAvailability(query: string = ""): void {
        this.inventoryService.getBatchAvailability({
            uniqueName: "",
            isVariant: false,
            page: 1,
            count: API_BULK_FETCH_LIMIT,
            sort: "asc",
            sortBy: "expiry",
            q: query ?? "",
            noStock: true,
            excludeBatchUniqueName: ""
        }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.allBatchAvailabilityOptions = mapAvailabilityBatches(response);
            this.syncSelectedBatchNumbers();
            this.cdr.markForCheck();
        });
    }

    /**
     * Apply an existing batch or a custom batch number.
     *
     * @param {*} batch
     * @param {*} event
     * @memberof StockOpeningBatchDialogComponent
     */
    public onBatchAvailabilitySelected(batch: any, event: any): void {
        if (event?.additional) {
            this.applyAvailabilityBatchToRow(batch, event.additional);
            this.syncSelectedBatchNumbers();
            this.cdr.markForCheck();
            return;
        }
        const customBatchNumber = event?.value;
        if (customBatchNumber) {
            batch.uniqueName = customBatchNumber;
            batch.batchNumber = customBatchNumber;
            batch.name = batch.name ? batch.name : event.label;
            this.syncSelectedBatchNumbers();
            this.cdr.markForCheck();
        }
    }

    /**
     * Add another empty batch row.
     *
     * @memberof StockOpeningBatchDialogComponent
     */
    public addBatchRow(): void {
        this.batches.push(this.createEmptyBatch());
        this.cdr.markForCheck();
    }

    /**
     * Remove a batch row, or reset when it is the last one.
     *
     * @param {number} index
     * @memberof StockOpeningBatchDialogComponent
     */
    public removeBatchRow(index: number): void {
        if (this.batches.length <= 1) {
            this.resetBatchRow(index);
            return;
        }
        this.batches.splice(index, 1);
        this.syncSelectedBatchNumbers();
        this.cdr.markForCheck();
    }

    /**
     * Clear the only remaining row.
     *
     * @param {number} index
     * @memberof StockOpeningBatchDialogComponent
     */
    public resetBatchRow(index: number): void {
        if (!this.batches[index]) {
            return;
        }
        this.batches.splice(index, 1, this.createEmptyBatch());
        this.syncSelectedBatchNumbers();
        this.cdr.markForCheck();
    }

    /**
     * True when opening qty is more than zero and number/name are required.
     *
     * @param {*} batch
     * @return {*}  {boolean}
     * @memberof StockOpeningBatchDialogComponent
     */
    public isBatchNameRequired(batch: any): boolean {
        return Number(batch?.openingQuantity) > 0 || this.parseOpeningAmount(batch?.openingAmount) > 0;
    }

    /**
     * Sum of batch opening quantities.
     *
     * @return {*}  {number}
     * @memberof StockOpeningBatchDialogComponent
     */
    public getBatchOpeningQtyTotal(): number {
        return this.batches.reduce((total, batch) => total + (Number(batch?.openingQuantity) || 0), 0);
    }

    /**
     * Sum of batch opening amounts.
     *
     * @return {*}  {number}
     * @memberof StockOpeningBatchDialogComponent
     */
    public getBatchOpeningAmountTotal(): number {
        return this.batches.reduce((total, batch) => total + this.parseOpeningAmount(batch?.openingAmount), 0);
    }

    /**
     * True when batch qty total exceeds warehouse opening qty.
     *
     * @return {*}  {boolean}
     * @memberof StockOpeningBatchDialogComponent
     */
    public isBatchQtyExceeded(): boolean {
        return this.getBatchOpeningQtyTotal() > (Number(this.openingQuantity) || 0);
    }

    /**
     * True when batch amount total exceeds warehouse opening amount.
     *
     * @return {*}  {boolean}
     * @memberof StockOpeningBatchDialogComponent
     */
    public isBatchAmountExceeded(): boolean {
        return this.getBatchOpeningAmountTotal() > this.parseOpeningAmount(this.openingAmount);
    }

    /**
     * Copy batch qty total into warehouse opening qty.
     *
     * @memberof StockOpeningBatchDialogComponent
     */
    public applyBatchQtyToOpening(): void {
        this.openingQuantity = this.getBatchOpeningQtyTotal();
        this.cdr.markForCheck();
    }

    /**
     * Copy batch amount total into warehouse opening amount.
     *
     * @memberof StockOpeningBatchDialogComponent
     */
    public applyBatchAmountToOpening(): void {
        this.openingAmount = this.getBatchOpeningAmountTotal();
        this.cdr.markForCheck();
    }

    /**
     * Apply selected unit from the dropdown.
     *
     * @param {IOption} event
     * @memberof StockOpeningBatchDialogComponent
     */
    public onUnitSelected(event: IOption): void {
        if (!event) {
            return;
        }
        this.stockUnit = {
            uniqueName: event.value,
            name: event.additional?.name || event.label,
            code: event.additional?.code || this.stockUnit?.code
        };
        this.cdr.markForCheck();
    }

    /**
     * Display label for the currently selected warehouse unit.
     *
     * @return {*}  {string}
     * @memberof StockOpeningBatchDialogComponent
     */
    public getSelectedUnitLabel(): string {
        const units = this.dialogData?.stockUnits || [];
        const matched = units.find(unit =>
            unit?.value === this.stockUnit?.uniqueName || unit?.additional?.code === this.stockUnit?.code
        );
        return matched?.label || this.stockUnit?.code || this.stockUnit?.name || "";
    }

    /**
     * Close without saving.
     *
     * @memberof StockOpeningBatchDialogComponent
     */
    public closeDialog(): void {
        this.dialogRef.close();
    }

    /**
     * Validate and return opening batches plus warehouse opening values.
     *
     * @memberof StockOpeningBatchDialogComponent
     */
    public save(): void {
        const invalid = this.batches.some(batch => this.isBatchNameRequired(batch) && !this.isCompleteBatch(batch));
        if (invalid) {
            this.toasterService.showSnackBar("error", this.localeData?.batch_required_fields);
            return;
        }
        this.dialogRef.close({
            batches: this.mapBatchesForResult(),
            openingAmount: this.parseOpeningAmount(this.openingAmount),
            openingQuantity: Number(this.openingQuantity) || 0,
            stockUnit: this.stockUnit
        });
    }

    /**
     * Releases subscriptions.
     *
     * @memberof StockOpeningBatchDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * True when both batch number and name are filled.
     *
     * @private
     * @param {*} batch
     * @return {*}  {boolean}
     * @memberof StockOpeningBatchDialogComponent
     */
    private isCompleteBatch(batch: any): boolean {
        return !!(String(batch?.batchNumber ?? "").trim() && String(batch?.name ?? "").trim());
    }

    /**
     * Empty opening-batch row.
     *
     * @private
     * @return {*}  {*}
     * @memberof StockOpeningBatchDialogComponent
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
     * Existing warehouse batches into datepicker-ready rows.
     *
     * @private
     * @param {any[]} [batches]
     * @return {*}  {any[]}
     * @memberof StockOpeningBatchDialogComponent
     */
    private normalizeIncomingBatches(batches?: any[]): any[] {
        return cloneDeep(Array.isArray(batches) ? batches : [])
            .filter(batch => batch?.uniqueName || String(batch?.batchNumber ?? "").trim())
            .map(batch => ({
                uniqueName: batch.uniqueName,
                batchNumber: batch.batchNumber ?? "",
                name: batch.name ?? "",
                manufacturingDate: this.parseBatchDate(batch.manufacturingDate),
                expiryDate: this.parseBatchDate(batch.expiryDate),
                openingQuantity: batch.openingQuantity ?? batch.quantity ?? null,
                openingAmount: batch.openingAmount ?? null
            }));
    }

    /**
     * Payload batches: complete rows only.
     *
     * @private
     * @return {*}  {any[]}
     * @memberof StockOpeningBatchDialogComponent
     */
    private mapBatchesForResult(): any[] {
        return this.batches
            .filter(batch => this.isCompleteBatch(batch))
            .map(batch => {
                const quantity = Number(batch.openingQuantity) || 0;
                const mapped: any = {
                    uniqueName: batch.uniqueName,
                    name: String(batch.name).trim(),
                    batchNumber: String(batch.batchNumber).trim(),
                    quantity,
                    openingQuantity: quantity,
                    openingAmount: this.parseOpeningAmount(batch.openingAmount)
                };
                const manufacturingDate = this.formatBatchDate(batch.manufacturingDate);
                const expiryDate = this.formatBatchDate(batch.expiryDate);
                if (manufacturingDate) {
                    mapped.manufacturingDate = manufacturingDate;
                }
                if (expiryDate) {
                    mapped.expiryDate = expiryDate;
                }
                return mapped;
            });
    }

    /**
     * Fill a row from an availability result, same as stock create/edit.
     *
     * @private
     * @param {*} batch
     * @param {BatchReportItem} item
     * @memberof StockOpeningBatchDialogComponent
     */
    private applyAvailabilityBatchToRow(batch: any, item: BatchReportItem): void {
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
    }

    /**
     * Track batch numbers already used on rows.
     *
     * @private
     * @memberof StockOpeningBatchDialogComponent
     */
    private syncSelectedBatchNumbers(): void {
        this.selectedBatchNumbers = this.batches
            .map(batch => String(batch?.batchNumber ?? "").trim())
            .filter(Boolean);
    }

    /**
     * Parse a masked opening amount into a number.
     *
     * @param {*} value
     * @return {*}  {number}
     * @memberof StockOpeningBatchDialogComponent
     */
    public parseOpeningAmount(value: any): number {
        return Number(String(value ?? "").toString().replace(/,/g, "")) || 0;
    }

    /**
     * Format a datepicker value as `DD-MM-YYYY`.
     *
     * @private
     * @param {*} value
     * @return {*}  {string}
     * @memberof StockOpeningBatchDialogComponent
     */
    private formatBatchDate(value: any): string {
        if (!value) {
            return "";
        }
        if (typeof value === "object") {
            return dayjs(value).format(GIDDH_DATE_FORMAT);
        }
        return value;
    }

    /**
     * Parse an API date string into a Date for the datepicker.
     *
     * @private
     * @param {string} value
     * @return {*}  {(Date | null)}
     * @memberof StockOpeningBatchDialogComponent
     */
    private parseBatchDate(value: string | Date): Date | null {
        if (!value) {
            return null;
        }
        if (value instanceof Date) {
            return value;
        }
        const parsed = dayjs(value, GIDDH_DATE_FORMAT, true);
        return parsed.isValid() ? parsed.toDate() : null;
    }
}
