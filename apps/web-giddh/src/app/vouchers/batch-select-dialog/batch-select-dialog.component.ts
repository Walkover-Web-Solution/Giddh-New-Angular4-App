import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { Observable, of, ReplaySubject, Subject } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, switchMap, take, takeUntil } from "rxjs/operators";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";
import { ASIDE_PANE_CONFIG } from "../../app.constant";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_WITH_SPACE } from "../../shared/helpers/defaultDateFormat";
import { BatchReportItem } from "../../models/interfaces/batch-report.interface";
import { BatchSelectDialogData, BatchSelectDialogResult, VoucherSelectedBatch } from "../../models/interfaces/batch.interface";
import { InventoryService } from "../../services/inventory.service";
import { ToasterService } from "../../services/toaster.service";
import { BatchCreateEditComponent } from "../../new-inventory/component/batch-create-edit/batch-create-edit.component";
import { FormFieldsModule } from "../../theme/form-fields/form-fields.module";
import { GiddhPageLoaderModule } from "../../shared/giddh-page-loader/giddh-page-loader.module";

dayjs.extend(customParseFormat);

interface BatchSelectRow extends VoucherSelectedBatch {
    selected: boolean;
}

@Component({
    selector: "batch-select-dialog",
    templateUrl: "./batch-select-dialog.component.html",
    styleUrls: ["./batch-select-dialog.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDialogModule,
        FormFieldsModule,
        GiddhPageLoaderModule,
        BatchCreateEditComponent
    ]
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
    /** Debounced search text for the availability API. */
    private searchQuery$: Subject<string> = new Subject();
    /** True after the user has typed a search. */
    private hasUserSearched: boolean = false;

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
        this.searchQuery$.pipe(
            debounceTime(400),
            distinctUntilChanged(),
            switchMap(query => this.fetchAvailability(query)),
            takeUntil(this.destroyed$)
        ).subscribe(({ query, response }) => this.applyAvailability(query, response));
        this.loadBatches("");
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
     * Search batches from the availability API.
     *
     * @memberof BatchSelectDialogComponent
     */
    public applySearch(): void {
        const query = this.searchTerm?.trim() ?? "";
        if (!this.hasUserSearched && !query) {
            return;
        }
        this.hasUserSearched = true;
        this.searchQuery$.next(query);
    }

    /**
     * Select a batch by typing its code and pressing Enter.
     *
     * @memberof BatchSelectDialogComponent
     */
    public addByCode(): void {
        const code = (this.quickAddCode || this.searchTerm)?.trim();
        if (!code) {
            return;
        }
        const match = this.findExactBatch(code);
        if (match) {
            this.selectExactBatch(match);
            return;
        }
        this.fetchAvailability(code).pipe(take(1), takeUntil(this.destroyed$)).subscribe(({ query, response }) => {
            this.applyAvailability(query, response);
            const row = this.findExactBatch(code);
            if (!row) {
                this.toasterService.showSnackBar("warning", this.localeData?.batch_not_found);
                return;
            }
            this.selectExactBatch(row);
        });
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
                this.loadBatches(this.searchTerm?.trim() ?? "");
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
     * Fetch availability for the current stock or variant.
     *
     * @private
     * @param {string} [query]
     * @memberof BatchSelectDialogComponent
     */
    private loadBatches(query: string = ""): void {
        this.fetchAvailability(query).pipe(take(1), takeUntil(this.destroyed$)).subscribe(({ query: searchQuery, response }) => {
            this.applyAvailability(searchQuery, response);
        });
    }

    /**
     * Call the availability API. Selected batches stay in memory for apply.
     *
     * @private
     * @param {string} [query]
     * @return {*}  {Observable<{ query: string; response: any }>}
     * @memberof BatchSelectDialogComponent
     */
    private fetchAvailability(query: string = ""): Observable<{ query: string; response: any }> {
        const isVariant = !!(this.dialogData?.variantUniqueName);
        const uniqueName = isVariant ? this.dialogData.variantUniqueName : this.dialogData?.stockUniqueName;
        if (!uniqueName) {
            this.rows = [];
            this.filteredRows = [];
            this.cdr.markForCheck();
            return of({ query, response: { status: "error" } });
        }

        this.isLoading = true;
        this.cdr.markForCheck();
        return this.inventoryService.getBatchAvailability({
            uniqueName,
            isVariant,
            page: 1,
            count: 50,
            sort: "asc",
            sortBy: "expiry",
            q: query
        }).pipe(
            catchError(() => of({ status: "error" })),
            switchMap(response => of({ query, response }))
        );
    }

    /**
     * Map API results, keep current selections, and pin selected rows when search is empty.
     *
     * @private
     * @param {string} query
     * @param {*} response
     * @memberof BatchSelectDialogComponent
     */
    private applyAvailability(query: string, response: any): void {
        this.isLoading = false;
        const selected = this.getSelectedBatchesForMerge();
        const apiResponse = response?.status === "success" ? response : { body: { results: [] } };
        const apiRows = this.mapApiRows(apiResponse, selected);
        const mergedRows = this.mergeMissingSelected(apiRows, selected);
        const displayRows = query ? apiRows : this.pinSelectedToTop(mergedRows, selected);
        this.rows = mergedRows;
        this.filteredRows = displayRows;
        this.cdr.markForCheck();
    }

    /**
     * Selected batches to keep across API searches.
     *
     * @private
     * @return {*}  {VoucherSelectedBatch[]}
     * @memberof BatchSelectDialogComponent
     */
    private getSelectedBatchesForMerge(): VoucherSelectedBatch[] {
        const current = this.rows
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
        return current.length ? current : (this.dialogData?.selectedBatches ?? []);
    }

    /**
     * Find a batch by exact batch number.
     *
     * @private
     * @param {string} code
     * @return {*}  {(BatchSelectRow | undefined)}
     * @memberof BatchSelectDialogComponent
     */
    private findExactBatch(code: string): BatchSelectRow | undefined {
        const exact = code.toLowerCase();
        return this.filteredRows.find(item => (item.batchNumber ?? "").toLowerCase() === exact)
            ?? this.rows.find(item => (item.batchNumber ?? "").toLowerCase() === exact);
    }

    /**
     * Select the matched batch and reset the search field.
     *
     * @private
     * @param {BatchSelectRow} row
     * @memberof BatchSelectDialogComponent
     */
    private selectExactBatch(row: BatchSelectRow): void {
        if (!row.selected) {
            this.toggleRow(row, true);
        }
        this.quickAddCode = "";
        this.searchTerm = "";
        this.loadBatches("");
    }

    /**
     * Map availability API results and restore quantities for selected batches.
     *
     * @private
     * @param {*} response
     * @param {VoucherSelectedBatch[]} selected
     * @return {*}  {BatchSelectRow[]}
     * @memberof BatchSelectDialogComponent
     */
    private mapApiRows(response: any, selected: VoucherSelectedBatch[]): BatchSelectRow[] {
        const body = response?.body ?? response;
        const results: BatchReportItem[] = Array.isArray(body) ? body : (body?.results ?? []);
        const selectedMap = new Map((selected ?? []).map(item => [item.uniqueName, item]));

        return (Array.isArray(results) ? results : []).reduce((list: BatchSelectRow[], item) => {
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
    }

    /**
     * Keep selected batches that are not in the current API page so apply still has them.
     *
     * @private
     * @param {BatchSelectRow[]} apiRows
     * @param {VoucherSelectedBatch[]} selected
     * @return {*}  {BatchSelectRow[]}
     * @memberof BatchSelectDialogComponent
     */
    private mergeMissingSelected(apiRows: BatchSelectRow[], selected: VoucherSelectedBatch[]): BatchSelectRow[] {
        const rows = [...apiRows];
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
        return rows;
    }

    /**
     * Puts currently selected batches at the top when search is empty.
     *
     * @private
     * @param {BatchSelectRow[]} rows
     * @param {VoucherSelectedBatch[]} selected
     * @return {*}  {BatchSelectRow[]}
     * @memberof BatchSelectDialogComponent
     */
    private pinSelectedToTop(rows: BatchSelectRow[], selected: VoucherSelectedBatch[]): BatchSelectRow[] {
        const selectedNames = new Set((selected ?? []).map(item => item?.uniqueName).filter(Boolean));
        if (!selectedNames.size) {
            return rows;
        }
        const pinned: BatchSelectRow[] = [];
        const rest: BatchSelectRow[] = [];
        rows.forEach(row => {
            if (selectedNames.has(row.uniqueName)) {
                pinned.push(row);
            } else {
                rest.push(row);
            }
        });
        return [...pinned, ...rest];
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
        this.searchQuery$.complete();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
