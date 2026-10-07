import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { cloneDeep } from "../../lodash-optimized";
import { ReplaySubject, take, takeUntil } from "rxjs";
import { ASIDE_PANE_CONFIG } from "../../app.constant";
import { BatchSelectDialogResult, VoucherSelectedBatch } from "../../models/interfaces/batch-report.interface";
import { VoucherService } from "../../services/voucher.service";
import { ToasterService } from "../../services/toaster.service";
import { giddhRoundOff } from "../../shared/helpers/helperFunctions";
import { BatchSelectDialogComponent } from "../batch-select-dialog/batch-select-dialog.component";
import { VoucherTypeEnum } from "../utility/vouchers.const";

export interface MarkReturnDialogData {
    voucherUniqueName: string;
    voucherType: string;
    localeData: any;
    commonLocaleData: any;
    event?: string;
}

export interface MarkReturnRow {
    sourceItemId: number;
    stock: { name: string; uniqueName: string };
    variant: { name: string; uniqueName: string };
    stockUnit: { name: string; code: string; uniqueName: string };
    warehouse?: { name: string; uniqueName: string };
    quantity: number;
    invoicedQuantity: number;
    returnableQuantity: number;
    creditableQuantity: number;
    returnQty: number;
    /** Credit note quantity (sent in creditNote.items when createCn is on) */
    cnQty: number;
    /** Checked = mark as return → Receipt Note (items payload) */
    selected: boolean;
    /** Optional Create CN for this selected return item */
    createCn: boolean;
    showCreateCn: boolean;
    /** Document batches available for return (quantity cap per batch). */
    availableBatches: VoucherSelectedBatch[];
    /** Selected return allocation per batch. */
    batches: VoucherSelectedBatch[];
}

@Component({
    selector: "app-mark-return-dialog",
    templateUrl: "./mark-return-dialog.component.html",
    styleUrls: ["./mark-return-dialog.component.scss"],
    standalone: false
})
export class MarkReturnDialogComponent implements OnInit, OnDestroy {
    /** Locale data */
    public localeData: any = {};
    /** Common locale data */
    public commonLocaleData: any = {};
    /** Rows mapped from API */
    public rows: MarkReturnRow[] = [];
    /** Displayed table columns */
    public displayedColumns: string[] = ["select", "item", "totalQty", "invoicedQty", "returnQty", "action", "cnQty"];
    /** True while GET resolutions is loading */
    public isLoading: boolean = true;
    /** True while POST event is in progress */
    public isSubmitting: boolean = false;
    /** Event name */
    public eventName: string = "RETURN";
    /** True when source voucher is receipt note (DN + Debit Note labels) */
    public isReceiptNote: boolean = false;
    /** Destroy subject */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: MarkReturnDialogData,
        private dialogRef: MatDialogRef<MarkReturnDialogComponent>,
        private dialog: MatDialog,
        private voucherService: VoucherService,
        private toaster: ToasterService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.localeData = data?.localeData || {};
        this.commonLocaleData = data?.commonLocaleData || {};
        this.eventName = data?.event || "RETURN";
        this.isReceiptNote = data?.voucherType === VoucherTypeEnum.receiptNote;
    }

    /**
     * Hint text based on source voucher type
     *
     * @readonly
     * @type {string}
     * @memberof MarkReturnDialogComponent
     */
    public get returnDialogHint(): string {
        return this.isReceiptNote
            ? this.localeData?.return_dialog_hint_receipt_note
            : this.localeData?.return_dialog_hint;
    }

    /**
     * Create Credit/Debit Note column label
     *
     * @readonly
     * @type {string}
     * @memberof MarkReturnDialogComponent
     */
    public get createNoteLabel(): string {
        return this.isReceiptNote ? this.localeData?.create_dn : this.localeData?.create_cn;
    }

    /**
     * CN/DN quantity column label
     *
     * @readonly
     * @type {string}
     * @memberof MarkReturnDialogComponent
     */
    public get noteQtyLabel(): string {
        return this.isReceiptNote ? this.localeData?.dn_qty : this.localeData?.cn_qty;
    }

    /**
     * True when any row has document batches (batch-wise return mode).
     *
     * @readonly
     * @type {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public get hasBatchRows(): boolean {
        return this.rows.some((row) => this.rowHasBatches(row));
    }

    /**
     * Initializes dialog and loads event resolutions
     *
     * @memberof MarkReturnDialogComponent
     */
    public ngOnInit(): void {
        this.loadEventResolutions();
    }

    /**
     * Cleanup
     *
     * @memberof MarkReturnDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Loads event-resolutions for RETURN
     *
     * @private
     * @memberof MarkReturnDialogComponent
     */
    private loadEventResolutions(): void {
        this.isLoading = true;
        this.voucherService
            .getInventoryEventResolutions(this.data.voucherType, this.data.voucherUniqueName, this.eventName)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    // HandleCatch never completes, so do not rely on finalize to clear the loader
                    this.isLoading = false;
                    this.changeDetectorRef.detectChanges();
                    if (response?.status === "success" && response?.body) {
                        this.rows = (response.body.items || []).map((item: any) => this.mapItemToRow(item));
                        this.updateDisplayedColumns();
                    } else {
                        this.showApiError(response);
                        this.dialogRef.close();
                    }
                },
                error: (error) => {
                    this.isLoading = false;
                    this.changeDetectorRef.detectChanges();
                    this.showApiError(error);
                    this.dialogRef.close();
                }
            });
    }

    /**
     * Maps API item to editable table row
     *
     * @private
     * @param {*} item
     * @return {*}  {MarkReturnRow}
     * @memberof MarkReturnDialogComponent
     */
    private mapItemToRow(item: any): MarkReturnRow {
        const returnableQuantity = Number(item.returnableQuantity ?? 0);
        const creditableQuantity = Number(item.creditableQuantity ?? 0);
        const availableBatches = this.mapApiBatches(item.batches);
        const batches = cloneDeep(availableBatches);
        const returnQty = availableBatches.length
            ? this.getBatchesQuantity(batches)
            : returnableQuantity;

        return {
            sourceItemId: item.sourceItemId,
            stock: item.stock,
            variant: item.variant,
            stockUnit: item.stockUnit,
            warehouse: item.warehouse,
            quantity: Number(item.quantity ?? 0),
            invoicedQuantity: Number(item.invoicedQuantity ?? 0),
            returnableQuantity,
            creditableQuantity,
            returnQty,
            cnQty: creditableQuantity,
            selected: returnableQuantity > 0,
            createCn: false,
            showCreateCn: creditableQuantity > 0,
            availableBatches,
            batches
        };
    }

    /**
     * Maps API batches to voucher selected-batch shape.
     *
     * @private
     * @param {*} batches
     * @return {*}  {VoucherSelectedBatch[]}
     * @memberof MarkReturnDialogComponent
     */
    private mapApiBatches(batches: any): VoucherSelectedBatch[] {
        if (!Array.isArray(batches)) {
            return [];
        }
        return batches
            .filter((batch) => !!batch?.uniqueName)
            .map((batch) => {
                const quantity = Number(batch.quantity ?? 0);
                return {
                    uniqueName: batch.uniqueName,
                    name: batch.name,
                    batchNumber: batch.batchNumber,
                    quantity,
                    availableQuantity: quantity,
                    expiryDate: batch.expiryDate,
                    manufacturingDate: batch.manufacturingDate || batch.createdAt,
                    warehouse: batch.warehouse
                };
            });
    }

    /**
     * Sum of selected batch quantities.
     *
     * @private
     * @param {VoucherSelectedBatch[]} batches
     * @return {*}  {number}
     * @memberof MarkReturnDialogComponent
     */
    private getBatchesQuantity(batches: VoucherSelectedBatch[]): number {
        return giddhRoundOff(
            (batches ?? []).reduce((total, batch) => total + (Number(batch.quantity) || 0), 0),
            4
        );
    }

    /**
     * True when row uses batch-wise return qty.
     *
     * @param {MarkReturnRow} row
     * @return {*}  {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public rowHasBatches(row: MarkReturnRow): boolean {
        return Array.isArray(row?.availableBatches) && row.availableBatches.length > 0;
    }

    /**
     * True when at least one row can create a credit/debit note.
     *
     * @readonly
     * @type {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public get hasCreateNoteRows(): boolean {
        return this.rows.some((row) => row.showCreateCn);
    }

    /**
     * Sets table columns for batch vs plain return qty mode.
     *
     * @private
     * @memberof MarkReturnDialogComponent
     */
    private updateDisplayedColumns(): void {
        const columns = this.hasBatchRows
            ? ["select", "item", "totalQty", "invoicedQty", "batch"]
            : ["select", "item", "totalQty", "invoicedQty", "returnQty"];
        if (this.hasCreateNoteRows) {
            columns.push("action", "cnQty");
        }
        this.displayedColumns = columns;
    }

    /**
     * True when all selectable rows are selected
     *
     * @readonly
     * @type {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public get isAllSelected(): boolean {
        const selectable = this.rows.filter((row) => this.isRowSelectable(row));
        return selectable.length > 0 && selectable.every((row) => row.selected);
    }

    /**
     * True when some but not all selectable rows are selected
     *
     * @readonly
     * @type {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public get isSomeSelected(): boolean {
        const selectable = this.rows.filter((row) => this.isRowSelectable(row));
        const selectedCount = selectable.filter((row) => row.selected).length;
        return selectedCount > 0 && selectedCount < selectable.length;
    }

    /**
     * Selected rows count
     *
     * @readonly
     * @type {number}
     * @memberof MarkReturnDialogComponent
     */
    public get selectedCount(): number {
        return this.rows.filter((row) => row.selected).length;
    }

    /**
     * Whether row can be selected for return (RN)
     *
     * @param {MarkReturnRow} row
     * @return {*}  {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public isRowSelectable(row: MarkReturnRow): boolean {
        return row.returnableQuantity > 0;
    }

    /**
     * Toggle select all returnable rows
     *
     * @param {boolean} checked
     * @memberof MarkReturnDialogComponent
     */
    public toggleSelectAll(checked: boolean): void {
        this.rows.forEach((row) => {
            if (this.isRowSelectable(row)) {
                row.selected = checked;
                if (!checked) {
                    row.createCn = false;
                }
            }
        });
    }

    /**
     * Clears Create CN when row is unchecked
     *
     * @param {MarkReturnRow} row
     * @memberof MarkReturnDialogComponent
     */
    public onRowSelectionChange(row: MarkReturnRow): void {
        if (!row.selected) {
            row.createCn = false;
        }
    }

    /**
     * Whether CN qty input is editable
     *
     * @param {MarkReturnRow} row
     * @return {*}  {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public isCnQtyEditable(row: MarkReturnRow): boolean {
        return row.selected && row.createCn && row.showCreateCn && row.creditableQuantity > 0;
    }

    /**
     * Normalizes return qty without clamping over the returnable limit
     *
     * @param {MarkReturnRow} row
     * @memberof MarkReturnDialogComponent
     */
    public onReturnQtyChange(row: MarkReturnRow): void {
        let qty = Number(row.returnQty);
        if (isNaN(qty) || qty < 0) {
            qty = 0;
        }
        row.returnQty = giddhRoundOff(qty, 4);
        if (row.returnQty > 0) {
            row.selected = true;
        }
    }

    /**
     * Normalizes credit/debit note qty without clamping over the creditable limit
     *
     * @param {MarkReturnRow} row
     * @memberof MarkReturnDialogComponent
     */
    public onCnQtyChange(row: MarkReturnRow): void {
        let qty = Number(row.cnQty);
        if (isNaN(qty) || qty < 0) {
            qty = 0;
        }
        row.cnQty = giddhRoundOff(qty, 4);
    }

    /**
     * Opens batch select dialog to allocate return qty per batch.
     *
     * @param {MarkReturnRow} row
     * @param {Event} [event]
     * @memberof MarkReturnDialogComponent
     */
    public openBatchSelectDialog(row: MarkReturnRow, event?: Event): void {
        event?.preventDefault();
        event?.stopPropagation();
        if (!this.rowHasBatches(row) || !row.selected || !this.isRowSelectable(row)) {
            return;
        }

        const dialogRef = this.dialog.open(BatchSelectDialogComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                stockName: row.stock?.name,
                stockUniqueName: row.stock?.uniqueName,
                variantUniqueName: row.variant?.uniqueName,
                variantName: row.variant?.name,
                hasVariants: !!row.variant?.uniqueName,
                warehouseName: row.warehouse?.name,
                warehouseUniqueName: row.warehouse?.uniqueName,
                unitCode: row.stockUnit?.code || row.stockUnit?.name,
                lineQuantity: row.returnableQuantity,
                selectedBatches: cloneDeep(row.batches ?? []),
                fixedBatches: cloneDeep(row.availableBatches ?? []),
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData,
                isInbound: true
            }
        });

        dialogRef.afterClosed().pipe(take(1), takeUntil(this.destroyed$)).subscribe((result?: BatchSelectDialogResult) => {
            if (!result) {
                return;
            }
            row.batches = result.batches ?? [];
            row.returnQty = this.getBatchesQuantity(row.batches);
            if (row.returnQty > 0) {
                row.selected = true;
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * True when return qty exceeds returnable quantity or batch caps
     *
     * @param {MarkReturnRow} row
     * @return {*}  {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public isReturnQtyInvalid(row: MarkReturnRow): boolean {
        if (this.rowHasBatches(row)) {
            if (this.hasInvalidBatchAllocation(row)) {
                return true;
            }
            return Number(row.returnQty) > Math.max(row.returnableQuantity, 0);
        }
        return Number(row.returnQty) > Math.max(row.returnableQuantity, 0);
    }

    /**
     * True when any selected batch qty exceeds its document available qty.
     *
     * @private
     * @param {MarkReturnRow} row
     * @return {*}  {boolean}
     * @memberof MarkReturnDialogComponent
     */
    private hasInvalidBatchAllocation(row: MarkReturnRow): boolean {
        const availableByUniqueName = new Map(
            (row.availableBatches ?? []).map((batch) => [batch.uniqueName, Number(batch.availableQuantity) || 0])
        );
        return (row.batches ?? []).some((batch) => {
            const maxQty = availableByUniqueName.get(batch.uniqueName) ?? 0;
            return Number(batch.quantity) > maxQty;
        });
    }

    /**
     * True when CN/DN qty exceeds creditable quantity
     *
     * @param {MarkReturnRow} row
     * @return {*}  {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public isCnQtyInvalid(row: MarkReturnRow): boolean {
        if (!this.isCnQtyEditable(row)) {
            return false;
        }
        return Number(row.cnQty) > Math.max(row.creditableQuantity, 0);
    }

    /**
     * Return qty overflow message
     *
     * @param {MarkReturnRow} row
     * @return {*}  {string}
     * @memberof MarkReturnDialogComponent
     */
    public getReturnQtyError(row: MarkReturnRow): string {
        return (this.localeData?.return_qty_exceeds ?? "")
            .replace("[RETURN_QTY]", String(row.returnQty))
            .replace("[RETURNABLE_QTY]", String(row.returnableQuantity));
    }

    /**
     * CN/DN qty overflow message
     *
     * @param {MarkReturnRow} row
     * @return {*}  {string}
     * @memberof MarkReturnDialogComponent
     */
    public getNoteQtyError(row: MarkReturnRow): string {
        const messageKey = this.isReceiptNote ? "dn_qty_exceeds" : "cn_qty_exceeds";
        return (this.localeData?.[messageKey] ?? "")
            .replace("[QTY]", String(row.cnQty))
            .replace("[AVAILABLE_QTY]", String(row.creditableQuantity));
    }

    /**
     * True when any row has invalid qty
     *
     * @readonly
     * @type {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public get hasInvalidQty(): boolean {
        return this.rows.some((row) => this.isReturnQtyInvalid(row) || this.isCnQtyInvalid(row));
    }

    /**
     * Whether proceed is allowed
     *
     * @readonly
     * @type {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public get canProceed(): boolean {
        return !this.hasInvalidQty && this.rows.some((row) => row.selected && Number(row.returnQty) > 0);
    }

    /**
     * Builds payload and submits return event
     *
     * @memberof MarkReturnDialogComponent
     */
    public proceed(): void {
        if (!this.canProceed || this.isSubmitting || this.hasInvalidQty) {
            return;
        }

        const selectedRows = this.rows.filter((row) => row.selected && Number(row.returnQty) > 0);

        if (!selectedRows.length) {
            this.toaster.warningToast(this.localeData?.select_return_items);
            return;
        }

        const mapReturnItem = (row: MarkReturnRow) => {
            const item: any = {
                sourceItemId: row.sourceItemId,
                stock: { uniqueName: row.stock?.uniqueName },
                variant: { uniqueName: row.variant?.uniqueName },
                quantity: Number(row.returnQty)
            };
            if (this.rowHasBatches(row) && row.batches?.length) {
                item.batches = row.batches
                    .filter((batch) => Number(batch.quantity) > 0)
                    .map((batch) => ({
                        uniqueName: batch.uniqueName,
                        quantity: Number(batch.quantity)
                    }));
            }
            return item;
        };

        const mapCnItem = (row: MarkReturnRow) => ({
            sourceItemId: row.sourceItemId,
            stock: { uniqueName: row.stock?.uniqueName },
            variant: { uniqueName: row.variant?.uniqueName },
            quantity: Number(row.cnQty)
        });

        const payload: any = {
            event: this.eventName,
            items: selectedRows.map(mapReturnItem)
        };

        const noteRows = selectedRows.filter(
            (row) => row.createCn && row.showCreateCn && Number(row.cnQty) > 0
        );
        if (noteRows.length) {
            const noteKey = this.isReceiptNote ? "debitNote" : "creditNote";
            payload[noteKey] = {
                items: noteRows.map(mapCnItem)
            };
        }

        this.isSubmitting = true;
        this.changeDetectorRef.detectChanges();
        this.voucherService
            .executeInventoryDocumentEvent(this.data.voucherType, this.data.voucherUniqueName, payload)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    // HandleCatch never completes, so do not rely on finalize to clear the loader
                    this.isSubmitting = false;
                    this.changeDetectorRef.detectChanges();
                    if (response?.status === "success") {
                        this.toaster.successToast(
                            (typeof response?.body === "string" ? response.body : null)
                                || response?.message
                                || this.localeData?.return_success
                        );
                        this.dialogRef.close(true);
                    } else {
                        this.showApiError(response);
                    }
                },
                error: (error) => {
                    this.isSubmitting = false;
                    this.changeDetectorRef.detectChanges();
                    this.showApiError(error);
                }
            });
    }

    /**
     * Shows API/validation error above dialog (ngx-toastr)
     *
     * @private
     * @param {*} response
     * @memberof MarkReturnDialogComponent
     */
    private showApiError(response: any): void {
        const message =
            response?.message
            || response?.error?.message
            || (typeof response?.error === "string" ? response.error : null)
            || this.commonLocaleData?.app_something_went_wrong;
        this.toaster.errorToast(message);
    }

    /**
     * Closes dialog
     *
     * @memberof MarkReturnDialogComponent
     */
    public cancel(): void {
        this.dialogRef.close(false);
    }

    /**
     * Formats qty with unit
     *
     * @param {number} qty
     * @param {MarkReturnRow} row
     * @return {*}  {string}
     * @memberof MarkReturnDialogComponent
     */
    public formatQty(qty: number, row: MarkReturnRow): string {
        const unit = row.stockUnit?.code || row.stockUnit?.name || "";
        return `${giddhRoundOff(Number(qty || 0), 2)} ${unit}`.trim();
    }
}
