import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { ASIDE_PANE_CONFIG, IOption } from "../../../app.constant";
import { BatchReportItem } from "../../../models/interfaces/batch-report.interface";
import { OrganizationType } from "../../../models/user-login-state";
import { GeneralService } from "../../../services/general.service";
import { InventoryService } from "../../../services/inventory.service";
import { BatchCreateEditComponent } from "../batch-create-edit/batch-create-edit.component";
import { mapAvailabilityBatches } from "../batch-report/batch-report.helper";

@Component({
    selector: "batch-transfer-dialog",
    templateUrl: "./batch-transfer-dialog.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class BatchTransferDialogComponent implements OnInit, OnDestroy {
    /** RxJS teardown signal fired on destroy. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Locale data from the parent report. */
    public localeData: any = {};
    /** Common locale data from the parent report. */
    public commonLocaleData: any = {};
    /** Transfer form. */
    public transferForm: FormGroup;
    /** True after a submit attempt with an invalid form. */
    public isFormSubmitted: boolean = false;
    /** True while availability or warehouses are loading. */
    public isLoading: boolean = false;
    /** Target batch options from availability. */
    public batchOptions: IOption[] = [];
    /** Warehouse options. */
    public warehouseOptions: IOption[] = [];
    /** Display label for the selected target batch. */
    public batchLabel: string = "";
    /** Display label for the selected warehouse. */
    public warehouseLabel: string = "";
    /** True after availability has returned so the batch dropdown mounts with options. */
    public hasLoadedBatches: boolean = false;
    /** Max quantity that can leave the origin batch. */
    public maxQuantity: number = 0;

    /**
     * Validation message when quantity exceeds the origin batch.
     *
     * @readonly
     * @type {string}
     * @memberof BatchTransferDialogComponent
     */
    public get quantityExceedsMessage(): string {
        return (this.localeData?.quantity_exceeds_available ?? "").replace("[QTY]", String(this.maxQuantity));
    }

    /**
     * True when the entered quantity is above the origin batch available qty.
     *
     * @readonly
     * @type {boolean}
     * @memberof BatchTransferDialogComponent
     */
    public get isQuantityExceedsMax(): boolean {
        const quantity = Number(this.transferForm.get("quantity")?.value);
        return this.transferForm.get("quantity")?.hasError("max") || (!isNaN(quantity) && quantity > this.maxQuantity);
    }

    /**
     * True when availability loaded and no other batch exists for this stock/variant.
     *
     * @readonly
     * @type {boolean}
     * @memberof BatchTransferDialogComponent
     */
    public get hasNoTargetBatches(): boolean {
        return this.hasLoadedBatches && !this.batchOptions?.length;
    }

    constructor(
        @Inject(MAT_DIALOG_DATA) public dialogData: { batch: BatchReportItem; localeData?: any; commonLocaleData?: any },
        private dialogRef: MatDialogRef<BatchTransferDialogComponent>,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private inventoryService: InventoryService,
        private generalService: GeneralService,
        private cdr: ChangeDetectorRef
    ) {
        this.localeData = dialogData?.localeData ?? {};
        this.commonLocaleData = dialogData?.commonLocaleData ?? {};
        this.maxQuantity = Number(dialogData?.batch?.availableQuantity) || 0;
        this.transferForm = this.formBuilder.group({
            toBatchUniqueName: ["", Validators.required],
            warehouseUniqueName: ["", Validators.required],
            quantity: ["", [Validators.required, Validators.min(0.0001), Validators.max(this.maxQuantity)]]
        });
    }

    /**
     * Loads target batches and warehouses.
     *
     * @memberof BatchTransferDialogComponent
     */
    public ngOnInit(): void {
        this.loadAvailableBatches();
        this.loadWarehouses();
    }

    /**
     * Target batch selected.
     *
     * @param {IOption} option Selected batch
     * @memberof BatchTransferDialogComponent
     */
    public selectBatch(option?: IOption): void {
        this.batchLabel = option?.label ?? "";
        this.transferForm.get("toBatchUniqueName")?.patchValue(option?.value ?? "");
    }

    /**
     * Warehouse selected.
     *
     * @param {IOption} option Selected warehouse
     * @memberof BatchTransferDialogComponent
     */
    public selectWarehouse(option?: IOption): void {
        this.warehouseLabel = option?.label ?? "";
        this.transferForm.get("warehouseUniqueName")?.patchValue(option?.value ?? "");
    }

    /**
     * Open create-batch aside so a target batch can be created for this stock/variant.
     *
     * @memberof BatchTransferDialogComponent
     */
    public openCreateBatch(): void {
        const batch = this.dialogData?.batch;
        const dialogRef = this.dialog.open(BatchCreateEditComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                batch: {
                    stock: batch?.stock,
                    variant: batch?.variant,
                    warehouse: batch?.warehouse
                }
            }
        });
        dialogRef.afterClosed().pipe(take(1), takeUntil(this.destroyed$)).subscribe(saved => {
            if (saved) {
                this.loadAvailableBatches();
            }
        });
    }

    /**
     * Close without transferring.
     *
     * @memberof BatchTransferDialogComponent
     */
    public closeDialog(): void {
        this.dialogRef.close();
    }

    /**
     * Return the transfer payload when the form is valid.
     *
     * @memberof BatchTransferDialogComponent
     */
    public submit(): void {
        this.isFormSubmitted = true;
        if (this.hasNoTargetBatches || this.transferForm.invalid) {
            return;
        }
        const formValue = this.transferForm.value;
        this.dialogRef.close({
            fromBatchUniqueName: this.dialogData?.batch?.uniqueName,
            toBatchUniqueName: formValue.toBatchUniqueName,
            warehouseUniqueName: formValue.warehouseUniqueName,
            quantity: Number(formValue.quantity)
        });
    }

    /**
     * Fetch target batches from availability (excludes Unassigned and the origin batch).
     *
     * @private
     * @memberof BatchTransferDialogComponent
     */
    private loadAvailableBatches(): void {
        const batch = this.dialogData?.batch;
        const isVariant = !!(batch?.belongsToVariant || batch?.isVariant);
        const uniqueName = isVariant
            ? (batch?.variant?.uniqueName ?? batch?.stock?.uniqueName ?? "")
            : (batch?.stock?.uniqueName ?? "");
        if (!uniqueName) {
            this.hasLoadedBatches = true;
            this.cdr.detectChanges();
            return;
        }
        this.isLoading = true;
        this.inventoryService.getBatchAvailability({ uniqueName, isVariant, page: 1, count: 50, excludeBatchUniqueName: batch?.uniqueName })
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    this.isLoading = false;
                    this.batchOptions = response?.status === "success"
                        ? mapAvailabilityBatches(response)
                        : [];
                    this.hasLoadedBatches = true;
                    if (this.batchOptions.length === 1 && !this.transferForm.get("toBatchUniqueName")?.value) {
                        this.selectBatch(this.batchOptions[0]);
                    }
                    this.cdr.detectChanges();
                },
                error: () => {
                    this.isLoading = false;
                    this.hasLoadedBatches = true;
                    this.cdr.detectChanges();
                }
            });
    }

    /**
     * Load warehouses from linked stocks.
     *
     * @private
     * @memberof BatchTransferDialogComponent
     */
    private loadWarehouses(): void {
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (!response?.body) {
                return;
            }
            const branches = response.body?.results?.filter((branch: any) => branch?.isCompany !== true) ?? [];
            const isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
            const warehouses = (isCompany
                ? branches.flatMap((branch: any) => branch?.warehouses ?? [])
                : (branches.find((branch: any) => branch?.uniqueName === this.generalService.currentBranchUniqueName)?.warehouses ?? [])
            ).map((warehouse: any) => ({ label: warehouse?.name, value: warehouse?.uniqueName }));
            this.warehouseOptions = warehouses;
            const originWarehouse = this.dialogData?.batch?.warehouse?.uniqueName;
            if (originWarehouse) {
                const selected = warehouses.find(warehouse => warehouse.value === originWarehouse);
                if (selected) {
                    this.selectWarehouse(selected);
                }
            } else if (warehouses.length === 1) {
                this.selectWarehouse(warehouses[0]);
            }
            this.cdr.detectChanges();
        });
    }

    /**
     * Releases subscriptions.
     *
     * @memberof BatchTransferDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
