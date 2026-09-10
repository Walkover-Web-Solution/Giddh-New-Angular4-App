import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, Optional, computed, signal } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { select, Store } from "@ngrx/store";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DROPDOWN_ITEMS_COUNT_LIMIT, IOption } from "../../../app.constant";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { InventoryReportRequest } from "../../../models/api-models/Inventory";
import { BatchDetails, BatchReportItem, BatchSaveRequest } from "../../../models/interfaces/batch-report.interface";
import { GeneralService } from "../../../services/general.service";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import { AppState } from "../../../store";
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
    /** Universal from date used by stock/variant report APIs. */
    private fromDate: string = "";
    /** Universal to date used by stock/variant report APIs. */
    private toDate: string = "";

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
        private toaster: ToasterService,
        private generalService: GeneralService,
        private store: Store<AppState>,
        @Optional() private dialogRef: MatDialogRef<BatchCreateEditComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) private dialogData: { batchUniqueName?: string; batch?: BatchReportItem | BatchDetails }
    ) {
        this.batchForm = this.formBuilder.group({
            batchNumber: ["", Validators.required],
            name: ["", Validators.required],
            stockUniqueName: ["", Validators.required],
            variantUniqueName: ["", Validators.required],
            warehouseUniqueName: ["", Validators.required],
            openingQuantity: ["", Validators.required],
            rate: ["", Validators.required],
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

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                this.fromDate = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                this.loadStocks();
                if (this.batchForm.get("stockUniqueName")?.value) {
                    this.loadVariants();
                }
            }
        });

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
     * Load stock options from the item-wise report API.
     *
     * @param {string} [query] Optional client-side filter text
     * @memberof BatchCreateEditComponent
     */
    public loadStocks(query: string = ""): void {
        const stockReportRequest = new InventoryReportRequest();
        const queryParams = { from: this.fromDate, to: this.toDate, count: DROPDOWN_ITEMS_COUNT_LIMIT, page: 1, sort: "", sortBy: "" };
        this.inventoryService.getItemWiseReport(queryParams, stockReportRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                if (response?.status === "success") {
                    const unique = new Map<string, IOption>();
                    (response.body?.results ?? []).forEach((row: any) => {
                        const uniqueName = row?.stock?.uniqueName;
                        if (uniqueName && !unique.has(uniqueName)) {
                            unique.set(uniqueName, { label: row?.stock?.name ?? uniqueName, value: uniqueName });
                        }
                    });
                    let options = Array.from(unique.values());
                    if (query) {
                        options = options.filter(option => option.label?.toLowerCase()?.includes(query.toLowerCase()));
                    }
                    this.stocks.set(this.ensureSelectedOption(options, this.batchForm.get("stockUniqueName")?.value, this.stockLabel()));
                }
            });
    }

    /**
     * Load variants for the selected stock from the variant-wise report API.
     *
     * @param {string} [query] Optional client-side filter text
     * @memberof BatchCreateEditComponent
     */
    public loadVariants(query: string = ""): void {
        const stockUniqueName = this.batchForm.get("stockUniqueName")?.value;
        if (!stockUniqueName) {
            this.variants.set([]);
            return;
        }
        const stockReportRequest = new InventoryReportRequest();
        stockReportRequest.stockUniqueNames = [stockUniqueName];
        const queryParams = { from: this.fromDate, to: this.toDate, count: DROPDOWN_ITEMS_COUNT_LIMIT, page: 1, sort: "", sortBy: "" };
        this.inventoryService.getVariantWiseReport(queryParams, stockReportRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(response => {
                if (response?.status === "success") {
                    const unique = new Map<string, IOption>();
                    (response.body?.results ?? []).forEach((row: any) => {
                        const uniqueName = row?.variant?.uniqueName;
                        if (uniqueName && !unique.has(uniqueName)) {
                            unique.set(uniqueName, { label: row?.variant?.name ?? uniqueName, value: uniqueName });
                        }
                    });
                    let options = Array.from(unique.values());
                    if (query) {
                        options = options.filter(option => option.label?.toLowerCase()?.includes(query.toLowerCase()));
                    }
                    this.variants.set(this.ensureSelectedOption(options, this.batchForm.get("variantUniqueName")?.value, this.variantLabel()));
                }
            });
    }

    /**
     * Stock selected — reset variant and load variants.
     *
     * @param {IOption} option Selected stock
     * @memberof BatchCreateEditComponent
     */
    public selectStock(option?: IOption): void {
        if (this.isUpdateMode()) {
            return;
        }
        const nextValue = option?.value ?? null;
        const previousValue = this.batchForm.get("stockUniqueName")?.value;
        this.stockLabel.set(option?.label ?? "");
        this.batchForm.get("stockUniqueName")?.patchValue(nextValue);
        if (previousValue !== nextValue) {
            this.batchForm.get("variantUniqueName")?.patchValue(null);
            this.variantLabel.set("");
        }
        this.loadVariants();
    }

    /**
     * Variant selected.
     *
     * @param {IOption} option Selected variant
     * @memberof BatchCreateEditComponent
     */
    public selectVariant(option?: IOption): void {
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
            stock: { uniqueName: formValue.stockUniqueName },
            variant: { uniqueName: formValue.variantUniqueName },
            warehouse: { uniqueName: formValue.warehouseUniqueName },
            openingQuantity: Number(formValue.openingQuantity),
            rate: Number(formValue.rate),
            manufacturingDate: this.formatDate(formValue.manufacturingDate),
            expiryDate: this.formatDate(formValue.expiryDate)
        };
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
                if (!this.isUpdateMode() && warehouses?.length === 1 && !this.batchForm.get("warehouseUniqueName")?.value) {
                    this.selectWarehouse(warehouses[0]);
                }
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
        const warehouseEntry = (details as BatchDetails)?.warehouses?.[0];
        const warehouseRef = warehouseEntry?.warehouse ?? (details as BatchDetails)?.warehouse ?? (details as BatchReportItem)?.warehouse;
        const openingQuantity = details?.openingQuantity ?? warehouseEntry?.openingQuantity;
        const openingAmount = (details as BatchDetails)?.openingAmount ?? warehouseEntry?.openingAmount;
        const rate = details?.rate ?? warehouseEntry?.rate
            ?? (openingQuantity ? (openingAmount ?? 0) / openingQuantity : null);
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
            rate: rate ?? "",
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
     * Format a datepicker value as `DD-MM-YYYY`.
     *
     * @private
     * @param {*} value Datepicker value
     * @return {*}  {string}
     * @memberof BatchCreateEditComponent
     */
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
