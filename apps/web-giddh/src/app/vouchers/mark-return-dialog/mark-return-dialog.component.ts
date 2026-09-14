import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { finalize, ReplaySubject, takeUntil } from "rxjs";
import { VoucherService } from "../../services/voucher.service";
import { ToasterService } from "../../services/toaster.service";
import { giddhRoundOff } from "../../shared/helpers/helperFunctions";

export interface MarkReturnDialogData {
    voucherUniqueName: string;
    voucherType: string;
    localeData: any;
    commonLocaleData: any;
    event?: string;
}

export interface MarkReturnRow {
    stock: { name: string; uniqueName: string };
    variant: { name: string; uniqueName: string };
    stockUnit: { name: string; code: string; uniqueName: string };
    warehouse?: { name: string; uniqueName: string };
    quantity: number;
    invoicedQuantity: number;
    returnableQuantity: number;
    creditableQuantity: number;
    returnQty: number;
    /** Checked = mark as return → Receipt Note (items payload) */
    selected: boolean;
    /** Optional Create CN for this selected return item */
    createCn: boolean;
    showCreateCn: boolean;
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
    public displayedColumns: string[] = ["select", "item", "totalQty", "invoicedQty", "returnQty", "action"];
    /** True while GET resolutions is loading */
    public isLoading: boolean = true;
    /** True while POST event is in progress */
    public isSubmitting: boolean = false;
    /** Event name */
    public eventName: string = "RETURN";
    /** Destroy subject */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: MarkReturnDialogData,
        private dialogRef: MatDialogRef<MarkReturnDialogComponent>,
        private voucherService: VoucherService,
        private toaster: ToasterService,
        private changeDetectorRef: ChangeDetectorRef
    ) {
        this.localeData = data?.localeData || {};
        this.commonLocaleData = data?.commonLocaleData || {};
        this.eventName = data?.event || "RETURN";
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
            .pipe(
                takeUntil(this.destroyed$),
                finalize(() => {
                    this.isLoading = false;
                    this.changeDetectorRef.detectChanges();
                })
            )
            .subscribe({
                next: (response) => {
                    if (response?.status === "success" && response?.body) {
                        this.rows = (response.body.items || []).map((item: any) => this.mapItemToRow(item));
                    } else {
                        this.showApiError(response);
                        this.dialogRef.close();
                    }
                },
                error: (error) => {
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

        return {
            stock: item.stock,
            variant: item.variant,
            stockUnit: item.stockUnit,
            warehouse: item.warehouse,
            quantity: Number(item.quantity ?? 0),
            invoicedQuantity: Number(item.invoicedQuantity ?? 0),
            returnableQuantity,
            creditableQuantity,
            returnQty: returnableQuantity,
            selected: returnableQuantity > 0,
            createCn: false,
            showCreateCn: creditableQuantity > 0
        };
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
     * Clamp return qty within returnable limit
     *
     * @param {MarkReturnRow} row
     * @memberof MarkReturnDialogComponent
     */
    public onReturnQtyChange(row: MarkReturnRow): void {
        const maxQty = Math.max(row.returnableQuantity, 0);
        let qty = Number(row.returnQty);
        if (isNaN(qty) || qty < 0) {
            qty = 0;
        }
        if (qty > maxQty) {
            qty = maxQty;
        }
        row.returnQty = giddhRoundOff(qty, 4);
        if (row.returnQty > 0) {
            row.selected = true;
        }
    }

    /**
     * Whether proceed is allowed
     *
     * @readonly
     * @type {boolean}
     * @memberof MarkReturnDialogComponent
     */
    public get canProceed(): boolean {
        return this.rows.some((row) => row.selected && Number(row.returnQty) > 0);
    }

    /**
     * Builds payload and submits return event
     *
     * @memberof MarkReturnDialogComponent
     */
    public proceed(): void {
        if (!this.canProceed || this.isSubmitting) {
            return;
        }

        const selectedRows = this.rows.filter((row) => row.selected && Number(row.returnQty) > 0);

        if (!selectedRows.length) {
            this.toaster.warningToast(this.localeData?.select_return_items || "Select at least one item to return");
            return;
        }

        const mapItem = (row: MarkReturnRow) => ({
            stock: { uniqueName: row.stock?.uniqueName },
            variant: { uniqueName: row.variant?.uniqueName },
            quantity: Number(row.returnQty)
        });

        const payload: any = {
            event: this.eventName,
            items: selectedRows.map(mapItem)
        };

        const creditNoteRows = selectedRows.filter((row) => row.createCn && row.showCreateCn);
        if (creditNoteRows.length) {
            payload.creditNote = {
                items: creditNoteRows.map(mapItem)
            };
        }

        this.isSubmitting = true;
        this.changeDetectorRef.detectChanges();
        this.voucherService
            .executeInventoryDocumentEvent(this.data.voucherType, this.data.voucherUniqueName, payload)
            .pipe(
                takeUntil(this.destroyed$),
                finalize(() => {
                    this.isSubmitting = false;
                    this.changeDetectorRef.detectChanges();
                })
            )
            .subscribe({
                next: (response) => {
                    if (response?.status === "success") {
                        this.toaster.successToast(
                            (typeof response?.body === "string" ? response.body : null)
                                || response?.message
                                || this.localeData?.return_success
                                || "Return processed successfully"
                        );
                        this.dialogRef.close(true);
                    } else {
                        this.showApiError(response);
                    }
                },
                error: (error) => {
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
            || this.commonLocaleData?.app_something_went_wrong
            || "Something went wrong";
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
