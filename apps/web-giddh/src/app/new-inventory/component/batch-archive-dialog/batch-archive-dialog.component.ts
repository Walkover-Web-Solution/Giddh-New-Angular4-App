import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { IOption } from "../../../app.constant";
import { BatchReportItem } from "../../../models/interfaces/batch-report.interface";
import { InventoryService } from "../../../services/inventory.service";
import { mapAvailabilityBatches } from "../batch-report/batch-report.helper";

export const BATCH_UNASSIGNED_ACTION = "UNASSIGNED";

@Component({
    selector: "batch-archive-dialog",
    templateUrl: "./batch-archive-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BatchArchiveDialogComponent implements OnInit, OnDestroy {
    /** RxJS teardown signal fired on destroy. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Locale data from the parent report. */
    public localeData: any = {};
    /** Common locale data from the parent report. */
    public commonLocaleData: any = {};
    /** Selected transfer target (`UNASSIGNED` or a batch unique name). */
    public selectedBatch: FormControl = new FormControl(BATCH_UNASSIGNED_ACTION);
    /** Display label for the selected option. */
    public selectedBatchLabel: string = "";
    /** Dropdown options including the static Unassigned row. */
    public batchOptions: IOption[] = [];
    /** True after availability has returned so the dropdown mounts with options. */
    public hasLoadedBatches: boolean = false;
    /** True while availability is loading. */
    public isLoading: boolean = false;
    /** Static Unassigned option value. */
    public unassignedAction: string = BATCH_UNASSIGNED_ACTION;

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: { batch: BatchReportItem; localeData?: any; commonLocaleData?: any },
        private dialogRef: MatDialogRef<BatchArchiveDialogComponent>,
        private inventoryService: InventoryService,
        private cdr: ChangeDetectorRef
    ) {
        this.localeData = dialogData?.localeData ?? {};
        this.commonLocaleData = dialogData?.commonLocaleData ?? {};
        this.selectedBatchLabel = this.commonLocaleData?.app_unassigned ?? BATCH_UNASSIGNED_ACTION;
        this.batchOptions = [this.getUnassignedOption()];
    }

    /**
     * Loads transfer targets for the current stock or variant.
     *
     * @memberof BatchArchiveDialogComponent
     */
    public ngOnInit(): void {
        this.loadAvailableBatches();
    }

    /**
     * Option selected in the dropdown.
     *
     * @param {IOption} option Selected option
     * @memberof BatchArchiveDialogComponent
     */
    public selectBatch(option?: IOption): void {
        this.selectedBatchLabel = option?.label ?? "";
        this.selectedBatch.patchValue(option?.value ?? BATCH_UNASSIGNED_ACTION);
    }

    /**
     * Close without transferring.
     *
     * @memberof BatchArchiveDialogComponent
     */
    public closeDialog(): void {
        this.dialogRef.close();
    }

    /**
     * Return UNASSIGNED or TRANSFER payload to the parent.
     *
     * @memberof BatchArchiveDialogComponent
     */
    public submit(): void {
        const uniqueName = this.selectedBatch.value;
        if (uniqueName === BATCH_UNASSIGNED_ACTION) {
            this.dialogRef.close({ action: BATCH_UNASSIGNED_ACTION, archiveOnly: true });
            return;
        }
        this.dialogRef.close({ action: "TRANSFER", uniqueName });
    }

    /**
     * Fetch batches that can receive the transfer.
     *
     * @private
     * @memberof BatchArchiveDialogComponent
     */
    private getUnassignedOption(): IOption {
        return { label: this.commonLocaleData?.app_unassigned ?? BATCH_UNASSIGNED_ACTION, value: BATCH_UNASSIGNED_ACTION };
    }

    /**
     * Fetch batches that can receive the transfer.
     *
     * @private
     * @memberof BatchArchiveDialogComponent
     */
    private loadAvailableBatches(): void {
        const batch = this.dialogData?.batch;
        const isVariant = !!(batch?.belongsToVariant || batch?.isVariant);
        const uniqueName = isVariant
            ? (batch?.variant?.uniqueName ?? batch?.stock?.uniqueName ?? "")
            : (batch?.stock?.uniqueName ?? "");
        this.batchOptions = [this.getUnassignedOption()];
        if (!uniqueName) {
            this.hasLoadedBatches = true;
            return;
        }
        this.isLoading = true;
        this.inventoryService.getBatchAvailability({ uniqueName, isVariant, page: 1, count: 50, excludeBatchUniqueName: batch?.uniqueName })
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                this.isLoading = false;
                const mapped = response?.status === "success"
                    ? mapAvailabilityBatches(response, batch?.uniqueName)
                    : [];
                this.batchOptions = [this.getUnassignedOption(), ...mapped];
                this.hasLoadedBatches = true;
                this.cdr.detectChanges();
            }, () => {
                this.isLoading = false;
                this.hasLoadedBatches = true;
                this.cdr.detectChanges();
            });
    }

    /**
     * Releases subscriptions.
     *
     * @memberof BatchArchiveDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
