import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, Optional, computed, signal } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { of, ReplaySubject } from "rxjs";
import { catchError, takeUntil } from "rxjs/operators";
import { DROPDOWN_ITEMS_COUNT_LIMIT, IOption } from "../../../app.constant";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { BatchDetails, BatchReportItem, BatchSaveRequest } from "../../../models/interfaces/batch-report.interface";
import { GeneralService } from "../../../services/general.service";
import { InventoryService } from "../../../services/inventory.service";
import { LedgerService } from "../../../services/ledger.service";
import { ToasterService } from "../../../services/toaster.service";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { GiddhDatepickerModule } from "../../../theme/giddh-datepicker/giddh-datepicker.module";
import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";
import * as dayjs from "dayjs";
import * as customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

@Component({
    selector: "batch-create-edit",
    templateUrl: "./batch-create-edit.component.html",
    styleUrls: ["./batch-create-edit.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        FormFieldsModule,
        GiddhDatepickerModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule
    ]
})
export class BatchCreateEditComponent implements OnInit, OnDestroy {
    /** RxJS teardown signal fired on destroy. */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Locale data from translation directive. */
    public readonly localeData = signal<any>({});
    /** Common locale data from translation directive. */
    public readonly commonLocaleData = signal<any>({});
    /** Create / update form. */
    public batchForm: FormGroup;
    /** True while loading details or saving. */
    public readonly isLoading = signal(false);
    /** True after a save attempt with an invalid form. */
    public readonly isFormSubmitted = signal(false);
    /** True when editing an existing batch. */
    public readonly isUpdateMode = signal(false);
    /** True when stock is fixed by the parent (voucher Select Batches). */
    public readonly isStockLocked = signal(false);
    /** True when the batch is already used on an entry or voucher. */
    public readonly isLinked = signal(false);
    /** Batch unique name in edit mode. */
    public batchUniqueName: string = "";
    /** Stock dropdown options. */
    public readonly stocks = signal<IOption[]>([]);
    /** Variant dropdown options. */
    public readonly variants = signal<IOption[]>([]);
    /** Warehouse dropdown options. */
    public readonly warehouses = signal<IOption[]>([]);
    /** Display label for the selected stock. */
    public readonly stockLabel = signal("");
    /** Display label for the selected variant. */
    public readonly variantLabel = signal("");
    /** Display label for the selected warehouse. */
    public readonly warehouseLabel = signal("");
    /** Manufacturing date value mirrored from the form (for computed min/expiry checks). */
    private readonly manufacturingDateValue = signal<any>(null);
    /** Expiry date value mirrored from the form (for computed date-range checks). */
    private readonly expiryDateValue = signal<any>(null);

    /**
     * Minimum selectable expiry date (manufacturing date).
     *
     * @readonly
     * @type {Date | null}
     * @memberof BatchCreateEditComponent
     */
    public readonly expiryMinDate = computed(() => this.toDayjs(this.manufacturingDateValue())?.toDate() ?? null);

    /**
     * True when manufacturing date is after expiry date.
     *
     * @readonly
     * @type {boolean}
     * @memberof BatchCreateEditComponent
     */
    public readonly isDateRangeInvalid = computed(() => {
        const manufacturing = this.toDayjs(this.manufacturingDateValue());
        const expiry = this.toDayjs(this.expiryDateValue());
        if (!manufacturing || !expiry) {
            return false;
        }
        return manufacturing.isAfter(expiry);
    });

    constructor(
        private formBuilder: FormBuilder,
        private inventoryService: InventoryService,
        private ledgerService: LedgerService,
        private toaster: ToasterService,
        private generalService: GeneralService,
        @Optional() private dialogRef: MatDialogRef<BatchCreateEditComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: { batchUniqueName?: string; batch?: BatchReportItem | BatchDetails; inventoryType?: string; lockStock?: boolean }
    ) {
        this.batchForm = this.formBuilder.group({
            batchNumber: ["", Validators.required],
            name: ["", Validators.required],
            stockUniqueName: [""],
            variantUniqueName: [""],
            warehouseUniqueName: [""],
            openingQuantity: [""],
            openingAmount: [""],
            manufacturingDate: [null],
            expiryDate: [null]
        }, { validators: this.manufacturingExpiryRangeValidator });
    }

    /**
     * Initializes route params and dropdown data.
     *
     * @memberof BatchCreateEditComponent
     */
    public ngOnInit(): void {
        this.batchUniqueName = this.dialogData?.batchUniqueName || "";
        this.isUpdateMode.set(!!this.batchUniqueName);
        this.isStockLocked.set(!!this.dialogData?.lockStock);

        if (!this.isStockLocked()) {
            this.loadStocks();
            if (this.batchForm.get("stockUniqueName")?.value) {
                this.loadVariants();
            }
        }
        this.loadWarehouses();
        if (this.dialogData?.batch) {
            this.applyFormFromDetails(this.dialogData.batch);
        }
        if (this.isUpdateMode()) {
            this.getBatchDetails();
        }

        this.batchForm.get("manufacturingDate")?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            this.manufacturingDateValue.set(value);
        });
        this.batchForm.get("expiryDate")?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            this.expiryDateValue.set(value);
        });
    }

    /**
     * Load stock options from the stocks V2 API.
     *
     * @param {string} [query] Optional search text
     * @memberof BatchCreateEditComponent
     */
    public loadStocks(query: string = ""): void {
        if (this.isStockLocked()) {
            return;
        }
        this.inventoryService.getStocksV2({
            inventoryType: this.dialogData?.inventoryType,
            page: 1,
            q: query ?? "",
            count: DROPDOWN_ITEMS_COUNT_LIMIT
        }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                const options = (response.body?.results ?? [])
                    .map((stock: any) => ({
                        label: stock?.name ?? stock?.uniqueName,
                        value: stock?.uniqueName
                    }))
                    .filter(option => option.value);
                this.stocks.set(this.ensureSelectedOption(options, this.batchForm.get("stockUniqueName")?.value, this.stockLabel()));
            }
        });
    }

    /**
     * Load variants for the selected stock.
     *
     * @memberof BatchCreateEditComponent
     */
    public loadVariants(): void {
        const stockUniqueName = this.batchForm.get("stockUniqueName")?.value;
        if (!stockUniqueName) {
            this.variants.set([]);
            return;
        }
        this.ledgerService.loadStockVariants(stockUniqueName).pipe(
            catchError(() => of([])),
            takeUntil(this.destroyed$)
        ).subscribe((variants) => {
            let options = (Array.isArray(variants) ? variants : [])
                .map((variant: any) => ({
                    label: variant?.name ?? variant?.uniqueName,
                    value: variant?.uniqueName
                }))
                .filter(option => option.value);
            this.variants.set(this.ensureSelectedOption(options, this.batchForm.get("variantUniqueName")?.value, this.variantLabel()));
            this.selectSingleOptionIfEmpty(this.variants(), "variantUniqueName", option => this.selectVariant(option));
        });
    }

    /**
     * Stock selected — reset variant and load variants.
     *
     * @param {IOption} option Selected stock
     * @memberof BatchCreateEditComponent
     */
    public selectStock(option?: IOption): void {
        if (this.isLinked() || this.isStockLocked()) {
            return;
        }
        this.stockLabel.set(option?.label ?? "");
        this.batchForm.get("stockUniqueName")?.patchValue(option?.value ?? null);
        this.batchForm.get("variantUniqueName")?.patchValue(null);
        this.variantLabel.set("");
        this.loadVariants();
    }

    /**
     * Variant selected.
     *
     * @param {IOption} option Selected variant
     * @memberof BatchCreateEditComponent
     */
    public selectVariant(option?: IOption): void {
        if (this.isLinked()) {
            return;
        }
        this.variantLabel.set(option?.label ?? "");
        this.batchForm.get("variantUniqueName")?.patchValue(option?.value ?? null);
    }

    /**
     * Warehouse selected.
     *
     * @param {IOption} option Selected warehouse
     * @memberof BatchCreateEditComponent
     */
    public selectWarehouse(option?: IOption): void {
        if (this.isLinked()) {
            return;
        }
        this.warehouseLabel.set(option?.label ?? "");
        this.batchForm.get("warehouseUniqueName")?.patchValue(option?.value ?? null);
    }

    /**
     * Create or update the batch.
     *
     * @memberof BatchCreateEditComponent
     */
    public save(): void {
        this.isFormSubmitted.set(true);
        if (this.isDateRangeInvalid() || this.batchForm.hasError("invalidDateRange")) {
            this.toaster.showSnackBar("error", this.localeData()?.invalid_date_range);
            return;
        }
        if (this.batchForm.invalid) {
            return;
        }
        const formValue = this.batchForm.value;
        const payload: BatchSaveRequest = {
            batchNumber: formValue.batchNumber,
            name: formValue.name,
            openingQuantity: this.parseOptionalNumber(formValue.openingQuantity),
            openingAmount: this.parseOptionalNumber(String(formValue.openingAmount ?? "").replace(/,/g, "")),
            manufacturingDate: this.formatDate(formValue.manufacturingDate),
            expiryDate: this.formatDate(formValue.expiryDate)
        };
        if (formValue.stockUniqueName) {
            payload.stock = { uniqueName: formValue.stockUniqueName };
        }
        if (formValue.variantUniqueName) {
            payload.variant = { uniqueName: formValue.variantUniqueName };
        }
        if (formValue.warehouseUniqueName) {
            payload.warehouse = { uniqueName: formValue.warehouseUniqueName };
        }
        this.isLoading.set(true);
        const request$ = this.isUpdateMode()
            ? this.inventoryService.updateBatch(this.batchUniqueName, payload)
            : this.inventoryService.createBatch(payload);
        request$.pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                if (response?.status === "success") {
                    this.toaster.showSnackBar("success", this.isUpdateMode() ? this.localeData()?.batch_updated : this.localeData()?.batch_created);
                    this.closeDialog(true);
                } else {
                    this.toaster.errorToast(response?.message);
                }
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    /**
     * Close the aside dialog.
     *
     * @param {boolean} [saved=false] True when the batch was saved
     * @memberof BatchCreateEditComponent
     */
    public closeDialog(saved: boolean = false): void {
        this.dialogRef?.close(saved);
    }

    /**
     * Load warehouses from linked stocks (same source as aging report).
     *
     * @private
     * @memberof BatchCreateEditComponent
     */
    private loadWarehouses(): void {
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body) {
                const branches = response.body?.results?.filter((branch: any) => branch?.isCompany !== true) ?? [];
                const currentBranch = branches.find((branch: any) => branch?.uniqueName === this.generalService.currentBranchUniqueName);
                const warehouses = this.ensureSelectedOption(
                    (currentBranch?.warehouses ?? branches.flatMap((branch: any) => branch?.warehouses ?? []))
                        .map((warehouse: any) => ({ label: warehouse?.name, value: warehouse?.uniqueName })),
                    this.batchForm.get("warehouseUniqueName")?.value,
                    this.warehouseLabel()
                );
                this.warehouses.set(warehouses);
                this.selectSingleOptionIfEmpty(warehouses, "warehouseUniqueName", option => this.selectWarehouse(option));
            }
        });
    }

    /**
     * Fetch batch details for edit mode.
     *
     * @private
     * @memberof BatchCreateEditComponent
     */
    private getBatchDetails(): void {
        if (!this.dialogData?.batch) {
            this.isLoading.set(true);
        }
        this.inventoryService.getBatch(this.batchUniqueName).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response) => {
                this.isLoading.set(false);
                const details = this.extractBatchDetails(response);
                if (details) {
                    this.applyFormFromDetails(details);
                } else if (response?.message) {
                    this.toaster.errorToast(response.message);
                }
            },
            error: () => {
                this.isLoading.set(false);
            }
        });
    }

    /**
     * Accept both `{ status, body }` and a raw batch payload.
     *
     * @private
     * @param {*} response GET batch response
     * @return {*}  {(BatchDetails | null)}
     * @memberof BatchCreateEditComponent
     */
    private extractBatchDetails(response: any): BatchDetails | null {
        if (!response || response.status === "error") {
            return null;
        }
        const details = response.status === "success" ? response.body : (response.body ?? response);
        if (details?.uniqueName || details?.batchNumber || details?.name) {
            return details;
        }
        return null;
    }

    /**
     * Patch the form and dropdown labels from a list row or GET payload.
     *
     * @private
     * @param {(BatchReportItem | BatchDetails)} details Batch data
     * @memberof BatchCreateEditComponent
     */
    private applyFormFromDetails(details: BatchReportItem | BatchDetails): void {
        this.isLinked.set(!!(this.isUpdateMode() && details?.linkedEntities?.length));
        const warehouseEntry = (details as BatchDetails)?.warehouses?.[0];
        const warehouseRef = warehouseEntry?.warehouse ?? (details as BatchDetails)?.warehouse ?? (details as BatchReportItem)?.warehouse;
        const openingQuantity = details?.openingQuantity ?? warehouseEntry?.openingQuantity;
        const openingAmount = (details as BatchDetails)?.openingAmount ?? warehouseEntry?.openingAmount;
        this.stockLabel.set(details?.stock?.name ?? this.stockLabel());
        this.variantLabel.set(details?.variant?.name ?? this.variantLabel());
        this.warehouseLabel.set(warehouseRef?.name ?? this.warehouseLabel());
        const manufacturingDate = this.parseDate(details?.manufacturingDate);
        const expiryDate = this.parseDate(details?.expiryDate);
        this.batchForm.patchValue({
            batchNumber: details?.batchNumber ?? "",
            name: details?.name ?? "",
            stockUniqueName: details?.stock?.uniqueName ?? "",
            variantUniqueName: details?.variant?.uniqueName ?? "",
            warehouseUniqueName: warehouseRef?.uniqueName ?? this.batchForm.get("warehouseUniqueName")?.value ?? "",
            openingQuantity: openingQuantity ?? "",
            openingAmount: openingAmount ?? "",
            manufacturingDate,
            expiryDate
        }, { emitEvent: false });
        this.manufacturingDateValue.set(manufacturingDate);
        this.expiryDateValue.set(expiryDate);
        this.stocks.update(options => this.ensureSelectedOption(options ?? [], details?.stock?.uniqueName, this.stockLabel()));
        this.variants.update(options => this.ensureSelectedOption(options ?? [], details?.variant?.uniqueName, this.variantLabel()));
        if (warehouseRef?.uniqueName) {
            this.warehouses.update(options => this.ensureSelectedOption(options ?? [], warehouseRef.uniqueName, this.warehouseLabel()));
        }
        if (details?.stock?.uniqueName) {
            this.loadVariants();
        }
    }

    /**
     * Keep the currently selected option visible while async lists load.
     *
     * @private
     * @param {IOption[]} options Existing options
     * @param {string} uniqueName Selected unique name
     * @param {string} label Selected label
     * @return {*}  {IOption[]}
     * @memberof BatchCreateEditComponent
     */
    private ensureSelectedOption(options: IOption[], uniqueName: string, label: string): IOption[] {
        if (!uniqueName || options.some(option => option.value === uniqueName)) {
            return options;
        }
        return [{ label: label || uniqueName, value: uniqueName }, ...options];
    }

    /**
     * Select the only dropdown option when none is chosen yet.
     *
     * @private
     * @param {IOption[]} options Dropdown options
     * @param {string} controlName Form control name
     * @param {(option: IOption) => void} selectFn Selection handler
     * @memberof BatchCreateEditComponent
     */
    private selectSingleOptionIfEmpty(options: IOption[], controlName: string, selectFn: (option: IOption) => void): void {
        if (options?.length === 1 && !this.batchForm.get(controlName)?.value) {
            selectFn(options[0]);
        }
    }

    /**
     * Format a datepicker value as `DD-MM-YYYY`.
     *
     * @private
     * @param {*} value Datepicker value
     * @return {*}  {string}
     * @memberof BatchCreateEditComponent
     */
    /**
     * Parse opening amount input into a number.
     *
     * @private
     * @param {*} value Opening amount value
     * @return {*}  {number}
     * @memberof BatchCreateEditComponent
     */
    /**
     * Convert a numeric input to a number, or null when empty or zero.
     *
     * @private
     * @param {*} value Quantity or amount
     * @return {*}  {(number | null)}
     * @memberof BatchCreateEditComponent
     */
    private parseOptionalNumber(value: any): number | null {
        if (value === null || value === undefined || value === "") {
            return null;
        }
        const parsed = Number(value);
        return Number.isFinite(parsed) && parsed !== 0 ? parsed : null;
    }

    private formatDate(value: any): string {
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
     * @param {string} value Date string
     * @return {*}  {(Date | null)}
     * @memberof BatchCreateEditComponent
     */
    private parseDate(value: string): Date | null {
        if (!value) {
            return null;
        }
        const parsed = dayjs(value, GIDDH_DATE_FORMAT, true);
        return parsed.isValid() ? parsed.toDate() : null;
    }

    /**
     * Parse a datepicker/API value into a dayjs instance.
     *
     * @private
     * @param {*} value Date value
     * @return {*}  {*}
     * @memberof BatchCreateEditComponent
     */
    private toDayjs(value: any): any {
        if (!value) {
            return null;
        }
        const parsed = typeof value === "object" ? dayjs(value) : dayjs(value, GIDDH_DATE_FORMAT);
        return parsed.isValid() ? parsed.startOf("day") : null;
    }

    /**
     * Form validator: manufacturing date must be on or before expiry date.
     *
     * @private
     * @param {AbstractControl} group Form group
     * @return {*}  {ValidationErrors}
     * @memberof BatchCreateEditComponent
     */
    private manufacturingExpiryRangeValidator = (group: AbstractControl): ValidationErrors | null => {
        const manufacturing = this.toDayjs(group.get("manufacturingDate")?.value);
        const expiry = this.toDayjs(group.get("expiryDate")?.value);
        if (!manufacturing || !expiry) {
            return null;
        }
        return manufacturing.isAfter(expiry) ? { invalidDateRange: true } : null;
    };

    /**
     * Releases subscriptions.
     *
     * @memberof BatchCreateEditComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
