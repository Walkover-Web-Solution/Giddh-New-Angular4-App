import {
    ChangeDetectionStrategy,
    Component,
    inject,
    OnDestroy,
    OnInit,
    signal,
    computed,
    ViewChild,
    TemplateRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { cloneDeep } from '../lodash-optimized';
import * as dayjs from 'dayjs';
import { BankReconciliationService } from './utility/bank-reconciliation.service';
import {
    ReconciliationView,
    ReconciliationFileType,
    ReconciliationUploadResponse,
    ReconciliationListItem,
    MappingRowModel,
    ReconciliationMapping
} from './utility/bank-reconciliation.model';
import { GeneralService } from '../services/general.service';
import { ToasterService } from '../services/toaster.service';
import { SearchService } from '../services/search.service';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../app.constant';
import { TranslateDirectiveModule } from '../theme/translate/translate.directive.module';
import { HamburgerMenuModule } from '../shared/header/components/hamburger-menu/hamburger-menu.module';
import { FormFieldsModule } from '../theme/form-fields/form-fields.module';
import { GiddhDatepickerModule } from '../theme/giddh-datepicker/giddh-datepicker.module';
import { DatepickerWrapperModule } from '../shared/datepicker-wrapper/datepicker.wrapper.module';
import { GiddhPageLoaderModule } from '../shared/giddh-page-loader/giddh-page-loader.module';
import { ColumnMappingTableComponent } from '../shared/column-mapping-table/column-mapping-table.component';

@Component({
    selector: 'app-bank-reconciliation',
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatPaginatorModule,
        MatMenuModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatDialogModule,
        ColumnMappingTableComponent,
        TranslateDirectiveModule,
        HamburgerMenuModule,
        FormFieldsModule,
        GiddhDatepickerModule,
        DatepickerWrapperModule,
        GiddhPageLoaderModule,
    ],
    templateUrl: './bank-reconciliation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BankReconciliationComponent implements OnInit, OnDestroy {
    private readonly reconciliationService = inject(BankReconciliationService);
    private readonly generalService = inject(GeneralService);
    private readonly toasterService = inject(ToasterService);
    private readonly searchService = inject(SearchService);
    private readonly fb = inject(FormBuilder);
    private readonly store = inject<Store<AppState>>(Store);
    private readonly dialog = inject(MatDialog);

    /** Locale data for translations */
    protected localeData = signal<any>({});

    /** Common locale data for shared translations */
    protected commonLocaleData = signal<any>({});

    /** Current view state */
    protected currentView = signal<ReconciliationView>(ReconciliationView.Upload);

    /** Expose enum to template */
    protected readonly reconciliationView = ReconciliationView;

    /** Expose file type enum to template */
    protected readonly reconciliationFileType = ReconciliationFileType;

    /** True when an API call is in progress */
    protected isLoading = signal(false);

    /** True when the initial listing API is loading */
    protected isListLoading = signal(true);

    /** Selected file reference */
    protected selectedFile = signal<File | null>(null);

    /** Selected file name for display */
    protected selectedFileName = signal<string>('');

    /** Detected file type (pdf/xlsx/xls/csv) */
    protected fileType = signal<string>('');

    /** Password for protected PDF files */
    protected password = signal<string>('');

    /** Whether debit and credit amounts are in the same column (Excel/CSV only) */
    protected sameDebitCreditColumn = signal<boolean>(false);

    /** Selected account unique name */
    protected accountUniqueName = signal<string>('');

    /** Selected account label for display */
    protected accountLabel = signal<string>('');

    /** Reactive form for upload date range */
    protected dateRangeForm: FormGroup = this.fb.group({ from: [null], to: [null] });

    /** Available account options for dropdown */
    protected accountOptions = signal<Array<{ label: string; value: string }>>([]);

    /** Upload API response stored for mapping step */
    protected uploadResponse = signal<ReconciliationUploadResponse | null>(null);

    /** Mapping rows built from the upload response headers */
    protected mappingRows = signal<MappingRowModel[]>([]);

    /** Giddh field options (available for mapping) */
    protected giddhFieldOptions = signal<Array<{ label: string; value: string }>>([]);

    /** Sample data rows from the uploaded file for preview in the mapping view */
    protected previewRows = signal<Array<{ columnNumber: string; columnValue: string }[]>>([]);

    /** Reconciliation list items */
    protected listItems = signal<ReconciliationListItem[]>([]);

    /** Computed: whether any list items exist */
    protected hasListData = computed(() => this.listItems().length > 0);

    /** Columns for the mat-table */
    protected readonly displayedColumns: string[] = [
        'date', 'actionBy', 'uploadedFile', 'reconciledFile', 'expiry', 'status'
    ];

    /** Pagination state for listing */
    protected paginationRequest = signal({
        page: 1,
        count: PAGINATION_LIMIT,
        totalItems: 0,
        from: '',
        to: ''
    });

    /** Page size options for mat-paginator */
    protected readonly pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;

    /** Computed page index for mat-paginator (0-based) */
    protected pageIndex = computed(() => this.paginationRequest().page - 1);

    /** True when date filter is active */
    protected showClearFilter = signal(false);

    /** Selected date range for listing filter */
    protected selectedDateRange = signal<any>(null);

    /** Date range label shown in the datepicker input */
    protected selectedDateRangeUi = signal<string>('');

    /** Selected range label */
    protected selectedRangeLabel = signal<string>('');

    /** Available date range presets */
    protected readonly datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;

    /** Mat-menu trigger for universal datepicker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger })
    protected universalDatepickerTrigger: MatMenuTrigger;

    /** Template ref for the upload form dialog */
    @ViewChild('uploadDialogTemplate')
    private uploadDialogTemplate: TemplateRef<unknown>;

    /** Reference to the currently open upload dialog */
    private uploadDialogRef: MatDialogRef<unknown> | null = null;

    /** Parent group names for account filtering */
    private readonly PARENT_GROUP_NAMES = "shareholdersfunds, noncurrentliabilities, currentliabilities, fixedassets, noncurrentassets, currentassets, revenuefromoperations, otherincome, operatingcost, indirectexpenses";

    /** Subject to unsubscribe all observables */
    private readonly destroyed$ = new Subject<void>();

    /** Sentinel label used to mark a column as explicitly unmapped; excluded from the final reconciliation payload */
    public unmapHeader: string = "Don't Map";

    private readonly FIELD_ALIASES: Record<string, string[]> = {
        transactiondate: [
            'transactiondate', 'transaction date', 'txn date', 'txndate',
            'date', 'value date', 'posting date', 'post date',
            'entry date', 'effective date', 'transaction dt',
            'date of transaction', 'tran date'
        ],

        description: [
            'description', 'narration', 'remarks', 'details',
            'transaction details', 'transaction description',
            'particulars', 'narration details', 'transaction remarks',
            'info', 'reference details', 'payment details',
            'transaction info', 'remarks description'
        ],

        debitamount: [
            'debitamount', 'debit amount', 'debit',
            'withdrawal', 'withdrawal amount',
            'dr', 'dr amount', 'debit amt',
            'outflow', 'money out', 'paid',
            'payment', 'debit value', 'withdrawn',
            'debit (inr)', 'debit(rs)', 'dr amt'
        ],

        creditamount: [
            'creditamount', 'credit amount', 'credit',
            'deposit', 'deposit amount',
            'cr', 'cr amount', 'credit amt',
            'inflow', 'money in', 'received',
            'receipt', 'credit value', 'credited',
            'credit (inr)', 'credit(rs)', 'cr amt'
        ]
    };

    /**
     * Initializes the component and loads the reconciliation list
     *
     * @memberof BankReconciliationComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$))
            .subscribe(dateObj => {
                if (dateObj) {
                    const universalDate = cloneDeep(dateObj);
                    this.selectedDateRange.set({ startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) });
                    this.selectedDateRangeUi.set(
                        dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + ' - ' + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI)
                    );
                    this.paginationRequest.update(r => ({
                        ...r,
                        page: 1,
                        from: dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT),
                        to: dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT)
                    }));
                    this.loadList();
                }
            });
        this.loadAccounts();
    }

    /**
     * Handles translation completion event
     *
     * @param {*} event - Translation event data
     * @memberof BankReconciliationComponent
     */
    protected translationComplete(event: any): void {
        if (event) {
            this.localeData.set(event.localeData ?? this.localeData());
        }
    }

    /**
     * Loads the reconciliation listing from the API
     *
     * @private
     * @memberof BankReconciliationComponent
     */
    private loadList(): void {
        this.isListLoading.set(true);
        const req = this.paginationRequest();
        this.reconciliationService.getAll(req.page, req.count, req.from, req.to)
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    if (response?.status === 'success' && response.body) {
                        this.listItems.set(response.body.items ?? []);
                        this.paginationRequest.update(r => ({ ...r, totalItems: response.body.totalItems }));
                        if (this.currentView() === ReconciliationView.Upload && response.body.totalItems > 0) {
                            this.currentView.set(ReconciliationView.List);
                        }
                    } else {
                        this.listItems.set([]);
                    }
                    this.isListLoading.set(false);
                },
                error: () => {
                    this.listItems.set([]);
                    this.isListLoading.set(false);
                }
            });
    }

    /**
     * Loads accounts for the account selection dropdown
     *
     * @param {string} [search=''] - Search query to filter accounts
     * @memberof BankReconciliationComponent
     */
    protected loadAccounts(search: string = ''): void {
        this.searchService.searchAccountV3({
            page: 1,
            withStocks: false,
            count: 20,
            branchUniqueName: '',
            q: search,
            group: this.PARENT_GROUP_NAMES
        }).pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    if (response?.status === 'success' && response?.body?.results) {
                        this.accountOptions.set(
                            response.body.results.map((acc: any) => ({
                                label: acc.name,
                                value: acc.uniqueName
                            }))
                        );
                    }
                }
            });
    }

    /**
     * Handles file selection from the file input element
     *
     * @param {Event} event - The file input change event
     * @memberof BankReconciliationComponent
     */
    protected onFileChange(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input?.files?.item(0);
        if (!file) return;

        const ext = this.getFileExtension(file.name);
        const validExtensions = [
            ReconciliationFileType.PDF,
            ReconciliationFileType.XLSX,
            ReconciliationFileType.XLS,
            ReconciliationFileType.CSV
        ];

        if (!validExtensions.includes(ext as ReconciliationFileType)) {
            this.toasterService.showSnackBar('error', this.localeData()?.invalid_file_type);
            this.resetFileSelection();
            return;
        }

        const isSpreadsheetFile = [
            ReconciliationFileType.XLSX,
            ReconciliationFileType.XLS,
            ReconciliationFileType.CSV
        ].includes(ext as ReconciliationFileType);

        if (!isSpreadsheetFile) {
            this.sameDebitCreditColumn.set(false);
        }

        this.selectedFile.set(file);
        this.selectedFileName.set(file.name);
        this.fileType.set(ext);
        this.password.set('');
    }

    /**
     * Handles the upload button click — calls the upload API
     *
     * @memberof BankReconciliationComponent
     */
    protected onUpload(): void {
        const file = this.selectedFile();
        if (!file) return;

        this.isLoading.set(true);
        const { from, to } = this.dateRangeForm.value;
        const fromStr = from ? dayjs(from).format(GIDDH_DATE_FORMAT) : '';
        const toStr = to ? dayjs(to).format(GIDDH_DATE_FORMAT) : '';
        this.reconciliationService.upload(
            file,
            this.accountUniqueName(),
            fromStr,
            toStr,
            this.password(),
            '',
            this.sameDebitCreditColumn()
        ).pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    this.isLoading.set(false);
                    if (response?.status === 'success' && response.body) {
                        this.uploadDialogRef?.close();
                        this.uploadDialogRef = null;

                        const body = response.body;
                        this.uploadResponse.set(body);

                        if (body.accountUniqueName) {
                            this.accountUniqueName.set(body.accountUniqueName);
                        }
                        if (body.fromDate || body.toDate) {
                            this.dateRangeForm.patchValue({
                                from: body.fromDate ? dayjs(body.fromDate, GIDDH_DATE_FORMAT).toDate() : null,
                                to: body.toDate ? dayjs(body.toDate, GIDDH_DATE_FORMAT).toDate() : null
                            });
                        }

                        const ft = body.fileType?.toLowerCase();
                        if (ft === ReconciliationFileType.XLSX || ft === ReconciliationFileType.XLS || ft === ReconciliationFileType.CSV) {
                            this.buildMappingRows(body);
                            this.currentView.set(ReconciliationView.Mapping);
                            this.toasterService.showSnackBar('success', this.localeData()?.upload_success);
                        } else {
                            body.message && this.toasterService.showSnackBar('success', body.message);
                            this.resetUploadState();
                            this.loadList();
                            this.currentView.set(ReconciliationView.List);
                        }
                    } else {
                        this.toasterService.showSnackBar('error', response?.message ?? '');
                    }
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Normalizes a string for fuzzy matching by lowercasing and removing all non-alphanumeric characters
     *
     * @private
     * @param {string} value - The string to normalize
     * @returns {string} Lowercased string with only alphanumeric characters
     * @memberof BankReconciliationComponent
     */
    private normalize(value: string): string {
        return (value || '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, ''); // remove space, _, -, ()
    }

    /**
     * Finds the best matching Giddh field for a given column header using exact, alias, and partial matching strategies
     *
     * @private
     * @param {string} header - The column header from the uploaded file
     * @param {{ label: string; value: string }[]} options - Available Giddh field options to match against
     * @param {string[]} used - List of already-mapped field values to avoid duplicate assignments
     * @returns {string | null} The matched Giddh field value, or null if no match is found
     * @memberof BankReconciliationComponent
     */
    private findBestMatch(
        header: string,
        options: { label: string; value: string }[],
        used: string[]
    ): string | null {

        const normalizedHeader = this.normalize(header);

        for (const opt of options) {
            const key = this.normalize(opt.value);
            const aliases = this.FIELD_ALIASES[key] || [];

            // 1️⃣ Exact match
            if (normalizedHeader === key && !used.includes(opt.value)) {
                return opt.value;
            }

            // 2️⃣ Alias exact match
            const exactAlias = aliases.find(
                alias => this.normalize(alias) === normalizedHeader
            );
            if (exactAlias && !used.includes(opt.value)) {
                return opt.value;
            }

            // 3️⃣ Partial match (fallback)
            const partialAlias = aliases.find(alias => {
                const normAlias = this.normalize(alias);
                return (
                    normalizedHeader.includes(normAlias) ||
                    normAlias.includes(normalizedHeader)
                );
            });

            if (partialAlias && !used.includes(opt.value)) {
                return opt.value;
            }
        }

        return null;
    }

    /**
     * Builds the MappingRowModel array from upload response headers and giddhHeaders
     *
     * @private
     * @param {ReconciliationUploadResponse} body - Upload API response
     * @memberof BankReconciliationComponent
     */
    private buildMappingRows(body: ReconciliationUploadResponse): void {
        const allGiddhOptions = (body.giddhHeaders ?? []).map(h => ({
            label: h,
            value: h
        }));

        allGiddhOptions.unshift({ label: this.unmapHeader, value: this.unmapHeader });
        this.giddhFieldOptions.set(allGiddhOptions);

        const mappedFields: string[] = [];

        const rows: MappingRowModel[] = (body.headers?.items ?? []).map(col => {
            const matchedValue = this.findBestMatch(
                col.columnHeader,
                allGiddhOptions,
                mappedFields
            );

            if (matchedValue) {
                mappedFields.push(matchedValue);
            }

            return {
                columnHeader: col.columnHeader,
                columnNumber: parseInt(col.columnNumber, 10),
                selectedGiddhField: matchedValue ?? this.unmapHeader,
                availableOptions: [...allGiddhOptions]
            };
        });

        // Remove already mapped options from dropdown (except self)
        rows.forEach(row => {
            row.availableOptions = allGiddhOptions.filter(
                opt =>
                    !mappedFields.includes(opt.value) ||
                    opt.value === row.selectedGiddhField
            );
        });

        this.mappingRows.set(rows);

        // Preview (first 10 rows)
        const dataItems = (body.data?.items ?? []).slice(0, 10);
        this.previewRows.set(dataItems.map((item: any) => item.row ?? []));
    }

    /**
     * Handles Giddh field selection in the mapping table
     * Removes the selected field from other rows' available options to prevent duplicate mappings
     *
     * @param {string} selectedValue - The selected Giddh field value
     * @param {number} rowIndex - The index of the row where selection was made
     * @memberof BankReconciliationComponent
     */
    protected onGiddhFieldSelected(selectedValue: string, rowIndex: number): void {
        const currentRows = this.mappingRows();
        currentRows[rowIndex].selectedGiddhField = selectedValue;
        this.mappingRows.set(currentRows);

        const allSelected = currentRows.filter(r => r.selectedGiddhField).map(r => r.selectedGiddhField);

        this.mappingRows.update(rows =>
            rows.map((row) => {
                let options = [...(this.giddhFieldOptions())];
                options = options.filter(o => !allSelected.includes(o.value) || o.value === row.selectedGiddhField || o.value === this.unmapHeader);
                return { ...row, availableOptions: options };
            })
        );
    }

    /**
     * Submits the column mapping and triggers reconciliation processing
     *
     * @memberof BankReconciliationComponent
     */
    protected onReconcile(): void {
        const uploadResp = this.uploadResponse();
        if (!uploadResp?.requestId) return;

        const mappings: ReconciliationMapping[] = this.mappingRows()
            .filter(row => row.selectedGiddhField && row.selectedGiddhField !== this.unmapHeader)
            .map(row => ({
                columnHeader: row.columnHeader,
                columnNumber: row.columnNumber,
                mappedColumn: row.selectedGiddhField
            }));

        this.isLoading.set(true);
        this.reconciliationService.process({ requestId: uploadResp.requestId, mappings, accountUniqueName: this.accountUniqueName() })
            .pipe(takeUntil(this.destroyed$))
            .subscribe({
                next: (response) => {
                    this.isLoading.set(false);
                    if (response?.status === 'success') {
                        const msg = (response.body as any)?.message || this.localeData()?.upload_success;
                        this.toasterService.showSnackBar('success', msg);
                        this.resetUploadState();
                        this.loadList();
                        this.currentView.set(ReconciliationView.List);
                    } else {
                        this.toasterService.showSnackBar('error', response?.message ?? '');
                    }
                },
                error: () => {
                    this.isLoading.set(false);
                }
            });
    }

    /**
     * Cancels mapping and returns to the upload view
     *
     * @memberof BankReconciliationComponent
     */
    protected onCancelMapping(): void {
        this.resetUploadState();
        this.uploadDialogRef?.close();
        this.uploadDialogRef = null;
        if (!this.hasListData()) {
            this.currentView.set(ReconciliationView.Upload);
        } else {
            this.currentView.set(ReconciliationView.List);
        }
    }

    /**
     * Switches view to upload from the list view
     *
     * @memberof BankReconciliationComponent
     */
    protected openUploadDialog(): void {
        if (this.hasListData()) {
            this.uploadDialogRef = this.dialog.open(this.uploadDialogTemplate, {
                panelClass: "mat-dialog-md",
                maxWidth: '95vw',
                disableClose: true
            });
        } else {
            this.currentView.set(ReconciliationView.Upload);
        }
    }

    /**
     * Handles datepicker callback for listing date filter
     *
     * @param {*} value - Date range selected
     * @memberof BankReconciliationComponent
     */
    protected dateSelectedCallback(value: any): void {
        if (value?.startDate && value?.endDate) {
            this.selectedDateRange.set(value);
            const startDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            const endDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            const uiLabel = `${dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI)} - ${dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI)}`;
            this.selectedDateRangeUi.set(uiLabel);
            this.showClearFilter.set(true);
            this.paginationRequest.update(r => ({ ...r, from: startDate, to: endDate, page: 1 }));
            this.loadList();
        }
        this.universalDatepickerTrigger?.closeMenu();
    }

    /**
     * Closes the datepicker menu
     *
     * @param {boolean} isOpen - Whether the datepicker should remain open
     * @memberof BankReconciliationComponent
     */
    protected toggleGiddhDatepicker(isOpen: boolean): void {
        if (!isOpen) {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Resets the date filter and reloads the list
     *
     * @memberof BankReconciliationComponent
     */
    protected resetFilter(): void {
        this.selectedDateRange.set(null);
        this.selectedDateRangeUi.set('');
        this.selectedRangeLabel.set('');
        this.showClearFilter.set(false);
        this.paginationRequest.update(r => ({ ...r, from: '', to: '', page: 1 }));
        this.loadList();
    }

    /**
     * Handles mat-paginator page events
     *
     * @param {PageEvent} event - Paginator event with page index and page size
     * @memberof BankReconciliationComponent
     */
    protected handlePageEvent(event: PageEvent): void {
        const current = this.paginationRequest();
        if (current.count !== event.pageSize) {
            this.paginationRequest.update(r => ({ ...r, page: 1, count: event.pageSize }));
        } else {
            this.paginationRequest.update(r => ({ ...r, page: event.pageIndex + 1 }));
        }
        this.loadList();
    }

    /**
     * Returns the file extension in lowercase from a file name
     *
     * @private
     * @param {string} fileName - The file name to extract extension from
     * @returns {string} Lowercase file extension without the dot
     * @memberof BankReconciliationComponent
     */
    private getFileExtension(fileName: string): string {
        return fileName.split('.').pop()?.toLowerCase() ?? '';
    }

    /**
     * Resets the file input and upload-related state
     *
     * @private
     * @memberof BankReconciliationComponent
     */
    private resetFileSelection(): void {
        this.selectedFile.set(null);
        this.selectedFileName.set('');
        this.fileType.set('');
        this.password.set('');
    }

    /**
     * Resets all upload and mapping state after a successful reconcile or cancel
     *
     * @private
     * @memberof BankReconciliationComponent
     */
    private resetUploadState(): void {
        this.resetFileSelection();
        this.uploadResponse.set(null);
        this.mappingRows.set([]);
        this.accountUniqueName.set('');
        this.accountLabel.set('');
        this.sameDebitCreditColumn.set(false);
        this.previewRows.set([]);
        this.dateRangeForm.reset();
    }

    /**
     * Cleanup on component destruction
     *
     * @memberof BankReconciliationComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
}
