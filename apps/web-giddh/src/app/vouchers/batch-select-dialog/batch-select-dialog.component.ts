import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { ASIDE_PANE_CONFIG } from "../../app.constant";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_WITH_SPACE } from "../../shared/helpers/defaultDateFormat";
import { BatchReportItem } from "../../models/interfaces/batch-report.interface";
import { InventoryService } from "../../services/inventory.service";
import { ToasterService } from "../../services/toaster.service";
import { BatchCreateEditComponent } from "../../new-inventory/component/batch-create-edit/batch-create-edit.component";

dayjs.extend(customParseFormat);

export interface VoucherSelectedBatch {
    uniqueName: string;
    name?: string;
    batchNumber?: string;
    quantity: number;
    rate?: number;
    availableQuantity?: number;
    expiryDate?: string;
}

export interface BatchSelectDialogData {
    stockName: string;
    stockUniqueName: string;
    variantUniqueName?: string;
    variantName?: string;
    hasVariants?: boolean;
    inventoryType?: string;
    warehouseName?: string;
    warehouseUniqueName?: string;
    unitCode?: string;
    lineQuantity: number;
    selectedBatches: VoucherSelectedBatch[];
    currencySymbol?: string;
    localeData?: any;
    commonLocaleData?: any;
}

export interface BatchSelectDialogResult {
    batches: VoucherSelectedBatch[];
    allocatedQuantity: number;
    overrideLineQuantity?: boolean;
}

interface BatchSelectRow extends VoucherSelectedBatch {
    selected: boolean;
}

@Component({
    selector: "batch-select-dialog",
    templateUrl: "./batch-select-dialog.component.html",
    styleUrls: ["./batch-select-dialog.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BatchSelectDialogComponent implements OnInit, OnDestroy {
    /** RxJS teardown signal fired on destroy. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Locale data from the parent voucher screen. */
    public localeData: any = {};
    /** Common locale data from the parent voucher screen. */
    public commonLocaleData: any = {};
    /** All availability rows for the current stock or variant. */
    public rows: BatchSelectRow[] = [];
    /** Rows after search. */
    public filteredRows: BatchSelectRow[] = [];
    /** Search text for batch number. */
    public searchTerm: string = "";
    /** Quick-add input value. */
    public quickAddCode: string = "";
    /** True while the quick-add field is visible. */
    public showQuickAdd: boolean = false;
    /** True while availability is loading. */
    public isLoading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: BatchSelectDialogData,
        private dialogRef: MatDialogRef<BatchSelectDialogComponent, BatchSelectDialogResult | undefined>,
        private dialog: MatDialog,
        private inventoryService: InventoryService,
        private toasterService: ToasterService,
        private cdr: ChangeDetectorRef
    ) {
        this.localeData = dialogData?.localeData ?? {};
        this.commonLocaleData = dialogData?.commonLocaleData ?? {};
    }

    /**
     * Loads available batches for the current stock or variant.
     *
     * @memberof BatchSelectDialogComponent
     */
    public ngOnInit(): void {
        this.loadBatches();
    }

    /**
     * Total quantity allocated across selected batches.
     *
     * @readonly
     * @type {number}
     * @memberof BatchSelectDialogComponent
     */
    public get allocatedQuantity(): number {
        return this.rows.reduce((total, row) => total + (row.selected ? Number(row.quantity) || 0 : 0), 0);
    }

    /**
     * Count of selected batches.
     *
     * @readonly
     * @type {number}
     * @memberof BatchSelectDialogComponent
     */
    public get selectedCount(): number {
        return this.rows.filter(row => row.selected && Number(row.quantity) > 0).length;
    }

    /**
     * Amount of selected batches (qty * rate).
     *
     * @readonly
     * @type {number}
     * @memberof BatchSelectDialogComponent
     */
    public get selectedAmount(): number {
        return this.rows.reduce((total, row) => {
            if (!row.selected) {
                return total;
            }
            return total + (Number(row.quantity) || 0) * (Number(row.rate) || 0);
        }, 0);
    }

    /**
     * Quantity allocated above the line quantity.
     *
     * @readonly
     * @type {number}
     * @memberof BatchSelectDialogComponent
     */
    public get overflowQuantity(): number {
        return Math.max(this.allocatedQuantity - (Number(this.dialogData?.lineQuantity) || 0), 0);
    }

    /**
     * Allocation percent capped at 100 for the progress fill.
     *
     * @readonly
     * @type {number}
     * @memberof BatchSelectDialogComponent
     */
    public get allocationPercent(): number {
        const lineQuantity = Number(this.dialogData?.lineQuantity) || 0;
        if (!lineQuantity) {
            return this.allocatedQuantity > 0 ? 100 : 0;
        }
        return Math.min((this.allocatedQuantity / lineQuantity) * 100, 100);
    }

    /**
     * First selected batch that will go negative.
     *
     * @readonly
     * @type {BatchSelectRow}
     * @memberof BatchSelectDialogComponent
     */
    public get negativeStockRow(): BatchSelectRow | null {
        return this.rows.find(row => row.selected && this.getNegativeQuantity(row) > 0) ?? null;
    }

    /**
     * Header subtitle: product, warehouse and unit.
     *
     * @readonly
     * @type {string}
     * @memberof BatchSelectDialogComponent
     */
    public get subtitle(): string {
        return [this.dialogData?.stockName, this.dialogData?.warehouseName, this.dialogData?.unitCode ? `unit: ${this.dialogData.unitCode}` : ""]
            .filter(Boolean)
            .join(" · ");
    }

    /**
     * Toggle a batch and seed quantity when it is selected.
     *
     * @param {BatchSelectRow} row
     * @param {boolean} selected
     * @memberof BatchSelectDialogComponent
     */
    public toggleRow(row: BatchSelectRow, selected: boolean): void {
        row.selected = selected;
        if (!selected) {
            row.quantity = 0;
        } else if (!Number(row.quantity)) {
            row.quantity = this.getDefaultQuantity(row);
        }
        this.cdr.markForCheck();
    }

    /**
     * Keep the checkbox in sync when quantity is typed.
     *
     * @param {BatchSelectRow} row
     * @memberof BatchSelectDialogComponent
     */
    public onQuantityChange(row: BatchSelectRow): void {
        const quantity = Number(row.quantity);
        row.quantity = quantity > 0 ? quantity : 0;
        row.selected = row.quantity > 0;
        this.cdr.markForCheck();
    }

    /**
     * Filter the list by batch number or name.
     *
     * @memberof BatchSelectDialogComponent
     */
    public applySearch(): void {
        const term = this.searchTerm?.trim().toLowerCase();
        this.filteredRows = term
            ? this.rows.filter(row =>
                (row.batchNumber ?? "").toLowerCase().includes(term) ||
                (row.name ?? "").toLowerCase().includes(term)
            )
            : [...this.rows];
        this.cdr.markForCheck();
    }

    /**
     * Select a batch by typing its code and pressing Enter.
     *
     * @memberof BatchSelectDialogComponent
     */
    public addByCode(): void {
        const code = (this.quickAddCode || this.searchTerm)?.trim().toLowerCase();
        if (!code) {
            return;
        }
        const row = this.rows.find(item => (item.batchNumber ?? "").toLowerCase() === code);
        if (!row) {
            this.toasterService.showSnackBar("warning", this.localeData?.batch_not_found);
            return;
        }
        if (!row.selected) {
            this.toggleRow(row, true);
        }
        this.quickAddCode = "";
        this.searchTerm = "";
        this.applySearch();
    }

    /**
     * Open create-batch aside on top of this dialog, then refresh availability.
     *
     * @memberof BatchSelectDialogComponent
     */
    public openCreateBatch(): void {
        const dialogRef = this.dialog.open(BatchCreateEditComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                inventoryType: this.dialogData?.inventoryType || "PRODUCT",
                batch: {
                    stock: {
                        uniqueName: this.dialogData?.stockUniqueName,
                        name: this.dialogData?.stockName
                    },
                    variant: this.dialogData?.variantUniqueName
                        ? { uniqueName: this.dialogData.variantUniqueName, name: this.dialogData.variantName }
                        : undefined,
                    warehouse: this.dialogData?.warehouseUniqueName
                        ? { uniqueName: this.dialogData.warehouseUniqueName, name: this.dialogData.warehouseName }
                        : undefined
                }
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(saved => {
            if (saved) {
                this.loadBatches();
            }
        });
    }

    /**
     * Clear every selected batch.
     *
     * @memberof BatchSelectDialogComponent
     */
    public clearSelection(): void {
        this.rows.forEach(row => {
            row.selected = false;
            row.quantity = 0;
        });
        this.cdr.markForCheck();
    }

    /**
     * Close without applying.
     *
     * @memberof BatchSelectDialogComponent
     */
    public closeDialog(): void {
        this.dialogRef.close();
    }

    /**
     * Apply the current selection to the voucher line.
     *
     * @param {boolean} [overrideLineQuantity=false]
     * @memberof BatchSelectDialogComponent
     */
    public apply(overrideLineQuantity: boolean = false): void {
        const batches = this.rows
            .filter(row => row.selected && Number(row.quantity) > 0)
            .map(row => ({
                uniqueName: row.uniqueName,
                name: row.name,
                batchNumber: row.batchNumber,
                quantity: Number(row.quantity) || 0,
                rate: Number(row.rate) || 0,
                availableQuantity: Number(row.availableQuantity) || 0,
                expiryDate: row.expiryDate
            }));

        this.dialogRef.close({
            batches,
            allocatedQuantity: this.allocatedQuantity,
            overrideLineQuantity
        });
    }

    /**
     * Format an expiry date for the list.
     *
     * @param {string} [value]
     * @return {*}  {string}
     * @memberof BatchSelectDialogComponent
     */
    public formatExpiry(value?: string): string {
        const parsed = this.parseDate(value);
        return parsed ? parsed.format(GIDDH_DATE_FORMAT_WITH_SPACE) : "";
    }

    /**
     * Expiry color state: expired, within 30 days, or later.
     *
     * @param {string} [value]
     * @return {('expired' | 'warning' | 'ok' | '')}
     * @memberof BatchSelectDialogComponent
     */
    public getExpiryStatus(value?: string): "expired" | "warning" | "ok" | "" {
        const parsed = this.parseDate(value);
        if (!parsed) {
            return "";
        }
        const days = parsed.startOf("day").diff(dayjs().startOf("day"), "day");
        if (days < 0) {
            return "expired";
        }
        if (days <= 30) {
            return "warning";
        }
        return "ok";
    }

    /**
     * Quantity that will take the batch below zero.
     *
     * @param {BatchSelectRow} row
     * @return {*}  {number}
     * @memberof BatchSelectDialogComponent
     */
    public getNegativeQuantity(row: BatchSelectRow): number {
        return Math.max((Number(row.quantity) || 0) - (Number(row.availableQuantity) || 0), 0);
    }

    /**
     * Replace placeholders in a locale string.
     *
     * @param {string} [text]
     * @param {Record<string, string | number>} values
     * @return {*}  {string}
     * @memberof BatchSelectDialogComponent
     */
    public interpolate(text: string | undefined, values: Record<string, string | number>): string {
        return Object.keys(values).reduce((result, key) => result.replace(`[${key}]`, String(values[key])), text ?? "");
    }

    /**
     * Fetch availability and merge any already selected batches.
     *
     * @private
     * @memberof BatchSelectDialogComponent
     */
    private loadBatches(): void {
        const isVariant = !!(this.dialogData?.variantUniqueName);
        const uniqueName = isVariant ? this.dialogData.variantUniqueName : this.dialogData?.stockUniqueName;
        if (!uniqueName) {
            this.rows = [];
            this.filteredRows = [];
            return;
        }

        this.isLoading = true;
        this.inventoryService.getBatchAvailability({ uniqueName, isVariant, page: 1, count: 50 })
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    this.isLoading = false;
                    this.rows = response?.status === "success"
                        ? this.mapRows(response, this.dialogData?.selectedBatches ?? [])
                        : this.mapRows({ body: { results: [] } }, this.dialogData?.selectedBatches ?? []);
                    this.applySearch();
                    this.cdr.markForCheck();
                },
                error: () => {
                    this.isLoading = false;
                    this.rows = this.mapRows({ body: { results: [] } }, this.dialogData?.selectedBatches ?? []);
                    this.applySearch();
                    this.cdr.markForCheck();
                }
            });
    }

    /**
     * Map availability results and keep previously selected rows.
     *
     * @private
     * @param {*} response
     * @param {VoucherSelectedBatch[]} selected
     * @return {*}  {BatchSelectRow[]}
     * @memberof BatchSelectDialogComponent
     */
    private mapRows(response: any, selected: VoucherSelectedBatch[]): BatchSelectRow[] {
        const body = response?.body ?? response;
        const results: BatchReportItem[] = Array.isArray(body) ? body : (body?.results ?? []);
        const selectedMap = new Map((selected ?? []).map(item => [item.uniqueName, item]));

        const rows = (Array.isArray(results) ? results : []).reduce((list: BatchSelectRow[], item) => {
            if (!item?.uniqueName) {
                return list;
            }
            const existing = selectedMap.get(item.uniqueName);
            list.push({
                uniqueName: item.uniqueName,
                name: item.name,
                batchNumber: item.batchNumber,
                expiryDate: item.expiryDate,
                availableQuantity: Number(item.availableQuantity) || 0,
                rate: Number(item.rate) || 0,
                selected: !!existing,
                quantity: existing ? Number(existing.quantity) || 0 : 0
            });
            return list;
        }, []);

        (selected ?? []).forEach(item => {
            if (item?.uniqueName && !rows.some(row => row.uniqueName === item.uniqueName)) {
                rows.push({
                    uniqueName: item.uniqueName,
                    name: item.name,
                    batchNumber: item.batchNumber,
                    expiryDate: item.expiryDate,
                    availableQuantity: Number(item.availableQuantity) || 0,
                    rate: Number(item.rate) || 0,
                    selected: true,
                    quantity: Number(item.quantity) || 0
                });
            }
        });

        return rows.sort((left, right) => {
            const leftDate = this.parseDate(left.expiryDate);
            const rightDate = this.parseDate(right.expiryDate);
            if (!leftDate && !rightDate) {
                return 0;
            }
            if (!leftDate) {
                return 1;
            }
            if (!rightDate) {
                return -1;
            }
            return leftDate.valueOf() - rightDate.valueOf();
        });
    }

    /**
     * Default quantity when a batch is checked.
     *
     * @private
     * @param {BatchSelectRow} row
     * @return {*}  {number}
     * @memberof BatchSelectDialogComponent
     */
    private getDefaultQuantity(row: BatchSelectRow): number {
        const remaining = Math.max((Number(this.dialogData?.lineQuantity) || 0) - this.allocatedQuantity, 0);
        const available = Number(row.availableQuantity) || 0;
        if (remaining > 0) {
            return available > 0 ? Math.min(remaining, available) : remaining;
        }
        return available > 0 ? available : 1;
    }

    /**
     * Parse API expiry dates in either display or ISO format.
     *
     * @private
     * @param {string} [value]
     * @return {*}  {dayjs.Dayjs | null}
     * @memberof BatchSelectDialogComponent
     */
    private parseDate(value?: string): ReturnType<typeof dayjs> | null {
        if (!value) {
            return null;
        }
        const formatted = dayjs(value, GIDDH_DATE_FORMAT);
        if (formatted.isValid()) {
            return formatted;
        }
        const iso = dayjs(value);
        return iso.isValid() ? iso : null;
    }

    /**
     * Releases subscriptions.
     *
     * @memberof BatchSelectDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
