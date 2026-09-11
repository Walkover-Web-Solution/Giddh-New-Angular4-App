import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, computed, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { forkJoin } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormFieldsModule } from "../../../theme/form-fields/form-fields.module";
import { TranslateDirectiveModule } from "../../../theme/translate/translate.directive.module";
import { GiddhPageLoaderModule } from "../../../shared/giddh-page-loader/giddh-page-loader.module";
import { InventoryService } from "../../../services/inventory.service";
import { ToasterService } from "../../../services/toaster.service";
import {
    BatchManagementSettings,
    BusinessDocumentStatus,
    BusinessDocumentType,
    InventoryLookupOption,
    InventorySettingsResponse,
    InventorySettingsUpdateRequest,
    InventoryStatusCategory,
    InventoryStatusFlow,
    InventoryStatusFlowUpdate,
    VoucherAutomationSettings
} from "../../../models/api-models/InventorySettings";

interface InventorySettingsLocale {
    title: string;
    subtitle: string;
    voucher_automation: string;
    auto_create_opposite: string;
    auto_create_opposite_description: string;
    inventory_via_business_document: string;
    inventory_via_business_document_description: string;
    auto_generate_dc: string;
    auto_generate_dc_description: string;
    auto_generate_rc: string;
    auto_generate_rc_description: string;
    batch_management: string;
    enable_batch_management: string;
    enable_batch_management_description: string;
    batch_number_format: string;
    batch_allocation_method: string;
    expiry_alert_days: string;
    mandatory_batch: string;
    allow_negative_batch_stock: string;
    delivery_challan_status_flow: string;
    receipt_note_status_flow: string;
    status_flow_description: string;
    open_statuses: string;
    in_progress_statuses: string;
    completed_statuses: string;
    default_status: string;
    auto_close_when: string;
    allow_skip_stages: string;
    auto_close_after_days: string;
    select: string;
    cancel: string;
    save_settings: string;
    settings_updated: string;
    load_error: string;
}

type StatusFlowForm = FormGroup<{
    open: FormControl<string[]>;
    inProgress: FormControl<string[]>;
    completed: FormControl<string[]>;
    defaultOnCreate: FormControl<string>;
    autoCloseWhen: FormControl<string>;
    allowSkipStages: FormControl<boolean>;
    autoCloseAfterDays: FormControl<number>;
}>;

@Component({
    selector: "inventory-settings",
    templateUrl: "./inventory-settings.component.html",
    styleUrls: ["./inventory-settings.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        FormFieldsModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule
    ]
})
export class InventorySettingsComponent implements OnInit {
    /** Inventory API service. */
    private readonly inventoryService = inject(InventoryService);
    /** Toast notification service. */
    private readonly toaster = inject(ToasterService);
    /** Component destruction reference. */
    private readonly destroyRef = inject(DestroyRef);
    /** Supported configurable status categories. */
    public readonly statusCategories = InventoryStatusCategory;
    /** Localized labels for this page. */
    public readonly localeData = signal<InventorySettingsLocale>({} as InventorySettingsLocale);
    /** True while initial settings are loading. */
    public readonly isLoading = signal<boolean>(true);
    /** True while settings are being saved. */
    public readonly isSaving = signal<boolean>(false);
    /** Lookup values returned with inventory settings. */
    public readonly lookups = signal<InventorySettingsResponse["lookups"]>({
        autoCloseWhen: [],
        batchNumberFormat: [],
        batchAllocationMethod: []
    });
    /** Status options grouped by their default category. */
    public readonly statusOptions = signal<Record<InventoryStatusCategory, InventoryLookupOption[]>>({
        [InventoryStatusCategory.Open]: [],
        [InventoryStatusCategory.InProgress]: [],
        [InventoryStatusCategory.Completed]: []
    });
    /** All status options available for default status selection. */
    public readonly allStatusOptions = computed<InventoryLookupOption[]>(() => [
        ...this.statusOptions()[InventoryStatusCategory.Open],
        ...this.statusOptions()[InventoryStatusCategory.InProgress],
        ...this.statusOptions()[InventoryStatusCategory.Completed]
    ]);
    /** Last settings response used by the cancel action. */
    private readonly originalSettings = signal<InventorySettingsResponse | null>(null);
    /** Strongly typed inventory settings form. */
    public readonly settingsForm = new FormGroup({
        voucherAutomation: new FormGroup({
            autoCreateOppositeOnDcRc: new FormControl(false, { nonNullable: true }),
            inventoryViaBusinessDocument: new FormControl(false, { nonNullable: true }),
            autoGenerateDcOnInvoice: new FormControl(false, { nonNullable: true }),
            autoGenerateRcOnBill: new FormControl(false, { nonNullable: true })
        }),
        batchManagement: new FormGroup({
            enabled: new FormControl(false, { nonNullable: true }),
            numberFormat: new FormControl("", { nonNullable: true }),
            allocationMethod: new FormControl("", { nonNullable: true }),
            expiryAlertDays: new FormControl(0, { nonNullable: true }),
            mandatoryBatchOnOutward: new FormControl(false, { nonNullable: true }),
            allowNegativeBatchStock: new FormControl(false, { nonNullable: true })
        }),
        deliveryChallanStatusFlow: this.createStatusFlowForm(),
        receiptNoteStatusFlow: this.createStatusFlowForm()
    });

    /**
     * Loads inventory settings and business document statuses.
     *
     * @memberof InventorySettingsComponent
     */
    public ngOnInit(): void {
        this.loadSettings();
    }

    /**
     * Stores translated page labels.
     *
     * @param {InventorySettingsLocale} translations Page translations
     * @memberof InventorySettingsComponent
     */
    public setLocaleData(translations: InventorySettingsLocale): void {
        this.localeData.set(translations);
    }

    /**
     * Returns options for a status category.
     *
     * @param {InventoryStatusCategory} category Status category
     * @returns {InventoryLookupOption[]} Matching status options
     * @memberof InventorySettingsComponent
     */
    public getStatusOptions(category: InventoryStatusCategory): InventoryLookupOption[] {
        return this.statusOptions()[category];
    }

    /**
     * Restores the last settings loaded from the API.
     *
     * @memberof InventorySettingsComponent
     */
    public cancelChanges(): void {
        const settings = this.originalSettings();
        if (settings) {
            this.patchForm(settings);
            this.settingsForm.markAsPristine();
        }
    }

    /**
     * Saves the current inventory settings.
     *
     * @memberof InventorySettingsComponent
     */
    public saveSettings(): void {
        if (this.settingsForm.invalid || this.isSaving()) {
            return;
        }
        const payload = this.buildUpdatePayload();
        this.isSaving.set(true);
        this.inventoryService.updateInventorySettings(payload)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((response) => {
                this.isSaving.set(false);
                if (response?.status === "success") {
                    this.captureCurrentSettings();
                    this.settingsForm.markAsPristine();
                    this.toaster.showSnackBar("success", this.localeData().settings_updated);
                } else {
                    this.toaster.showSnackBar("error", response?.message);
                }
            });
    }

    /**
     * Creates a typed status flow form.
     *
     * @returns {StatusFlowForm} Status flow form
     * @memberof InventorySettingsComponent
     */
    private createStatusFlowForm(): StatusFlowForm {
        return new FormGroup({
            open: new FormControl<string[]>([], { nonNullable: true }),
            inProgress: new FormControl<string[]>([], { nonNullable: true }),
            completed: new FormControl<string[]>([], { nonNullable: true }),
            defaultOnCreate: new FormControl("", { nonNullable: true }),
            autoCloseWhen: new FormControl("", { nonNullable: true }),
            allowSkipStages: new FormControl(false, { nonNullable: true }),
            autoCloseAfterDays: new FormControl(0, { nonNullable: true })
        });
    }

    /**
     * Loads settings and status options in parallel.
     *
     * @memberof InventorySettingsComponent
     */
    private loadSettings(): void {
        this.isLoading.set(true);
        forkJoin({
            settings: this.inventoryService.getInventorySettings(),
            statuses: this.inventoryService.getBusinessDocumentStatuses(BusinessDocumentType.DeliveryChallan)
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ settings, statuses }) => {
            this.isLoading.set(false);
            if (settings?.status !== "success" || !settings.body) {
                this.toaster.showSnackBar("error", settings?.message || this.localeData().load_error);
                return;
            }
            this.originalSettings.set(settings.body);
            this.lookups.set(settings.body.lookups);
            this.patchForm(settings.body);
            if (statuses?.status === "success") {
                this.setStatusOptions(statuses.body ?? []);
            } else {
                this.toaster.showSnackBar("error", statuses?.message);
            }
        });
    }

    /**
     * Converts API statuses into grouped dropdown options.
     *
     * @param {BusinessDocumentStatus[]} statuses Business document statuses
     * @memberof InventorySettingsComponent
     */
    private setStatusOptions(statuses: BusinessDocumentStatus[]): void {
        const grouped: Record<InventoryStatusCategory, InventoryLookupOption[]> = {
            [InventoryStatusCategory.Open]: [],
            [InventoryStatusCategory.InProgress]: [],
            [InventoryStatusCategory.Completed]: []
        };
        statuses.forEach((status) => {
            if (Object.values(InventoryStatusCategory).includes(status.defaultStatusCategory)) {
                grouped[status.defaultStatusCategory].push({
                    value: status.statusCode,
                    label: status.statusName
                });
            }
        });
        this.statusOptions.set(grouped);
    }

    /**
     * Prefills the settings form from an API response.
     *
     * @param {InventorySettingsResponse} settings Inventory settings
     * @memberof InventorySettingsComponent
     */
    private patchForm(settings: InventorySettingsResponse): void {
        this.settingsForm.controls.voucherAutomation.patchValue({
            ...settings.voucherAutomation,
            inventoryViaBusinessDocument: settings.voucherAutomation.inventoryViaBusinessDocument ?? false
        });
        this.settingsForm.controls.batchManagement.patchValue(settings.batchManagement);
        this.patchStatusFlow(this.settingsForm.controls.deliveryChallanStatusFlow, settings.deliveryChallanStatusFlow);
        this.patchStatusFlow(this.settingsForm.controls.receiptNoteStatusFlow, settings.receiptNoteStatusFlow);
    }

    /**
     * Prefills a status flow form.
     *
     * @param {StatusFlowForm} form Status flow form
     * @param {InventoryStatusFlow} flow Status flow API value
     * @memberof InventorySettingsComponent
     */
    private patchStatusFlow(form: StatusFlowForm, flow: InventoryStatusFlow): void {
        form.patchValue({
            open: flow.stages.OPEN ?? [],
            inProgress: flow.stages.IN_PROGRESS ?? [],
            completed: flow.stages.COMPLETED ?? [],
            defaultOnCreate: flow.defaultOnCreate,
            autoCloseWhen: flow.autoCloseWhen,
            allowSkipStages: flow.allowSkipStages,
            autoCloseAfterDays: flow.autoCloseAfterDays
        });
    }

    /**
     * Builds the update API payload from the form.
     *
     * @returns {InventorySettingsUpdateRequest} Update request
     * @memberof InventorySettingsComponent
     */
    private buildUpdatePayload(): InventorySettingsUpdateRequest {
        const value = this.settingsForm.getRawValue();
        return {
            voucherAutomation: value.voucherAutomation as VoucherAutomationSettings,
            batchManagement: value.batchManagement as BatchManagementSettings,
            deliveryChallanStatusFlow: this.buildStatusFlowPayload(value.deliveryChallanStatusFlow),
            receiptNoteStatusFlow: this.buildStatusFlowPayload(value.receiptNoteStatusFlow)
        };
    }

    /**
     * Flattens categorized statuses into the update API format.
     *
     * @param {ReturnType<StatusFlowForm["getRawValue"]>} flow Categorized form value
     * @returns {InventoryStatusFlowUpdate} Status flow update value
     * @memberof InventorySettingsComponent
     */
    private buildStatusFlowPayload(flow: ReturnType<StatusFlowForm["getRawValue"]>): InventoryStatusFlowUpdate {
        return {
            stages: [...flow.open, ...flow.inProgress, ...flow.completed],
            defaultOnCreate: flow.defaultOnCreate,
            autoCloseWhen: flow.autoCloseWhen,
            allowSkipStages: flow.allowSkipStages,
            autoCloseAfterDays: flow.autoCloseAfterDays
        };
    }

    /**
     * Stores the saved form state for subsequent cancel actions.
     *
     * @memberof InventorySettingsComponent
     */
    private captureCurrentSettings(): void {
        const current = this.originalSettings();
        const value = this.settingsForm.getRawValue();
        if (!current) {
            return;
        }
        this.originalSettings.set({
            ...current,
            voucherAutomation: value.voucherAutomation,
            batchManagement: value.batchManagement,
            deliveryChallanStatusFlow: {
                stages: {
                    OPEN: value.deliveryChallanStatusFlow.open,
                    IN_PROGRESS: value.deliveryChallanStatusFlow.inProgress,
                    COMPLETED: value.deliveryChallanStatusFlow.completed
                },
                defaultOnCreate: value.deliveryChallanStatusFlow.defaultOnCreate,
                autoCloseWhen: value.deliveryChallanStatusFlow.autoCloseWhen,
                allowSkipStages: value.deliveryChallanStatusFlow.allowSkipStages,
                autoCloseAfterDays: value.deliveryChallanStatusFlow.autoCloseAfterDays
            },
            receiptNoteStatusFlow: {
                stages: {
                    OPEN: value.receiptNoteStatusFlow.open,
                    IN_PROGRESS: value.receiptNoteStatusFlow.inProgress,
                    COMPLETED: value.receiptNoteStatusFlow.completed
                },
                defaultOnCreate: value.receiptNoteStatusFlow.defaultOnCreate,
                autoCloseWhen: value.receiptNoteStatusFlow.autoCloseWhen,
                allowSkipStages: value.receiptNoteStatusFlow.allowSkipStages,
                autoCloseAfterDays: value.receiptNoteStatusFlow.autoCloseAfterDays
            }
        });
    }
}
