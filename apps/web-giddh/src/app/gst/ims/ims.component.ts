import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnDestroy, OnInit, signal, TemplateRef, viewChild } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { distinctUntilChanged, filter, take } from 'rxjs/operators';
import { GstReconcileActions } from '../../actions/gst-reconcile/gst-reconcile.actions';
import { ASIDE_PANE_CONFIG, PAGE_SIZE_OPTIONS, RestrictedModules } from '../../app.constant';
import {
    ImsAction,
    ImsActionStatus,
    ImsInvoice,
    ImsItcReductionRequired,
    ImsPortalStatus,
    ImsReferenceRow,
    ImsSaveResponse,
    ImsStatus,
    ImsSummary
} from '../../models/api-models/Ims';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { GstReconcileService } from '../../services/gst-reconcile.service';
import { ImsService } from '../../services/ims.service';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { ToasterService } from '../../services/toaster.service';
import { AppState } from '../../store';
import {
    GstReport,
    IMS_IN_PROGRESS_STATUS_CODES,
    IMS_ITC_SECTIONS,
    IMS_SUCCESS_STATUS_CODES
} from '../constants/gst.constant';

/** Default IMS page size (frontend guide: count defaults to 20) */
const IMS_PAGE_SIZE = 20;

/** Summary count box; status null is the total */
interface ImsSummaryRow {
    status: ImsStatus | null;
    count: number;
    /** Global summary-box classes: bordered white count box for the total (like the inventory Group Count), status colours matching the badges */
    boxClass: string;
}

/** Value of the "All" status filter option. Not empty: the dropdown is re-created on every reload with an empty value, so an empty "All" value would never emit */
const IMS_STATUS_FILTER_ALL = 'ALL';

/** Option of the status filter dropdown */
interface ImsStatusFilterOption {
    label: string;
    value: ImsStatus | typeof IMS_STATUS_FILTER_ALL;
}

/** Summary count field of each IMS status */
const IMS_SUMMARY_KEYS: Record<ImsStatus, 'accepted' | 'rejected' | 'pending' | 'noAction'> = {
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    PENDING: 'pending',
    NO_ACTION: 'noAction'
};

/** Statuses in summary and filter order */
const IMS_STATUSES: ImsStatus[] = ['ACCEPTED', 'REJECTED', 'PENDING', 'NO_ACTION'];

/** Action chosen in the bulk bar or by a row retry */
type ImsBulkAction = ImsActionStatus | 'RESET';

@Component({
    selector: 'gst-ims',
    templateUrl: './ims.component.html',
    styleUrls: ['./ims.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ImsComponent implements OnInit, OnDestroy {
    private readonly store = inject<Store<AppState>>(Store);
    private readonly gstReconcileActions = inject(GstReconcileActions);
    private readonly gstReconcileService = inject(GstReconcileService);
    private readonly imsService = inject(ImsService);
    private readonly toaster = inject(ToasterService);
    private readonly router = inject(Router);
    private readonly dialog = inject(MatDialog);
    private readonly destroyRef = inject(DestroyRef);
    private readonly generalService = inject(GeneralService);
    private readonly config = inject<IServiceConfigArgs>(ServiceConfig);

    /** GSP OTP dialog template */
    private readonly connectDialog = viewChild.required<TemplateRef<unknown>>('connectDialog');
    /** Discard-changes confirmation for the OTP dialog */
    private readonly cancelConfirmationDialog = viewChild.required<TemplateRef<unknown>>('cancelConfirmationDialog');
    /** ITC details dialog for Accept on ITC sections */
    private readonly acceptDialog = viewChild.required<TemplateRef<unknown>>('acceptDialog');
    /** Reset confirmation dialog */
    private readonly resetConfirmDialog = viewChild.required<TemplateRef<unknown>>('resetConfirmDialog');
    /** Upload history aside */
    private readonly historyDialog = viewChild.required<TemplateRef<unknown>>('historyDialog');

    /** GST locale data (passed whole to the shared OTP dialog) */
    public localeData = signal<Record<string, unknown>>({});
    /** IMS strings from the GST locale file */
    public imsLocale = signal<Record<string, string>>({});
    /** Common locale data */
    public commonLocaleData = signal<Record<string, string>>({});
    /** GSTR filing strings reused by the header and summary (authenticate, overall summary, no result) */
    public readonly filingLocale = computed(() => this.localeData()?.filing as Record<string, string> | undefined);

    /** Image path for the GSTR header icons */
    public readonly imgPath = this.config.IMG_PATH;
    /** Restricted modules enum for the plan message */
    public readonly restrictedModules = RestrictedModules;

    /** Returns the GST report enum for the template */
    public readonly gstReport = GstReport;
    /** Page size options */
    public readonly pageSizeOptions = PAGE_SIZE_OPTIONS;
    /** Table columns */
    public readonly displayedColumns: string[] = ['select', 'section', 'supplier', 'document', 'taxableValue', 'tax', 'imsStatus'];
    /** History table columns */
    public readonly historyColumns: string[] = ['referenceId', 'date', 'status'];

    /** Active GSTIN chosen in the tax sidebar */
    public readonly gstin = toSignal(this.store.pipe(select(state => state.gstR.activeCompanyGst)), { initialValue: '' });
    /** True when the active GSP has a portal session */
    public readonly isConnected = toSignal(this.store.pipe(select(state => state.gstR.gstAuthenticated)), { initialValue: false });
    /** True while the GSP session is being checked */
    public readonly isSessionLoading = toSignal(this.store.pipe(select(state => state.gstR.getGspSessionInProgress)), { initialValue: false });
    /** True when the active company plan restricts tax filing (same check as the GSTR header) */
    public readonly isTaxFilingRestricted = toSignal(
        this.store.pipe(select(state => !!state.session.activeCompany?.subscription?.planDetails?.restrictedModules?.hasOwnProperty(RestrictedModules.TaxFilling))),
        { initialValue: false }
    );
    /** True for a consolidated branch */
    private readonly isConsolidatedBranch = toSignal(this.store.pipe(select(state => !!state.branchConsolidated?.isBranchConsolidated)), { initialValue: false });
    /** True when the GSP can be authenticated here: company or consolidated branch on voucher API v2 (same rule as the GSTR header) */
    public readonly canAuthenticate = computed(() =>
        (this.generalService.currentOrganizationType !== OrganizationType.Branch || this.isConsolidatedBranch()) && this.generalService.voucherApiVersion === 2
    );
    /** False when the company has no GSTIN on any address */
    public hasTaxNumbers = signal<boolean>(true);

    /** First day of the selected month */
    public selectedMonth = signal<Date>(dayjs().startOf('month').toDate());
    /** True when the user changed the month */
    public customMonthSelected = signal<boolean>(false);
    /** Selected month label, for example November 2026 */
    public readonly monthLabel = computed(() => this.selectedMonth().toLocaleString('en-us', { month: 'long', year: 'numeric' }));
    /** Period sent to the API as MM-yyyy */
    public readonly monthYear = computed(() => dayjs(this.selectedMonth()).format('MM-YYYY'));
    /** Return period sent to the status API as MMyyyy */
    private readonly returnPeriod = computed(() => dayjs(this.selectedMonth()).format('MMYYYY'));

    /** Selected status filter, null for all */
    public statusFilter = signal<ImsStatus | null>(null);
    /** Current page (1-based) */
    public page = signal<number>(1);
    /** Page size */
    public count = signal<number>(IMS_PAGE_SIZE);

    /** Invoices of the current page */
    public invoices = signal<ImsInvoice[]>([]);
    /** Period summary */
    public summary = signal<ImsSummary | null>(null);
    /** Summary count boxes: the total, then one per status */
    public readonly summaryRows = computed<ImsSummaryRow[]>(() => {
        const summary = this.summary();
        if (!summary) {
            return [];
        }
        return [
            { status: null, count: summary.total, boxClass: 'count-box mat-app-background' },
            { status: 'ACCEPTED', count: summary.accepted, boxClass: 'border-none opening-box' },
            { status: 'REJECTED', count: summary.rejected, boxClass: 'border-none due-box' },
            { status: 'PENDING', count: summary.pending, boxClass: 'border-none sales-purchase' },
            { status: 'NO_ACTION', count: summary.noAction, boxClass: 'border-none payment-receipt' }
        ];
    });
    /** Status filter dropdown options: All, then each status */
    public readonly statusFilterOptions = computed<ImsStatusFilterOption[]>(() => [
        { label: this.commonLocaleData()?.app_all, value: IMS_STATUS_FILTER_ALL },
        ...IMS_STATUSES.map(status => ({ label: this.statusLabel(status), value: status }))
    ]);
    /** Label of the selected status filter */
    public readonly statusFilterLabel = computed(() => {
        const status = this.statusFilter();
        return status ? this.statusLabel(status) : this.commonLocaleData()?.app_all;
    });
    /** Total invoices for the current filter */
    public totalResults = signal<number>(0);
    /** ITC disclaimer returned by the API */
    public note = signal<string>('');
    /** True while the cached list loads */
    public isLoading = signal<boolean>(false);
    /** True while data is pulled from the portal */
    public isRefreshing = signal<boolean>(false);
    /** True when the period has no stored snapshot yet */
    public isEmptySnapshot = signal<boolean>(false);
    /** Message of the last failed list call */
    public loadError = signal<string>('');

    /** Selected invoice keys on the current page */
    public selectedKeys = signal<ReadonlySet<string>>(new Set());
    /** Selected invoices on the current page */
    public readonly selectedRows = computed(() => this.invoices().filter(row => this.selectedKeys().has(this.invoiceKey(row))));
    /** True when every row on the page is selected */
    public readonly isAllSelected = computed(() => this.invoices().length > 0 && this.selectedRows().length === this.invoices().length);

    /** True while a save request is being sent */
    public isSaving = signal<boolean>(false);
    /** True while a save request is being sent (blocks new actions) */
    public readonly isSaveInProgress = computed(() => this.isSaving());
    /** Reference whose status is being checked from the history aside */
    public checkingReferenceId = signal<string>('');

    /** Rows waiting for ITC details in the accept dialog */
    public acceptRows = signal<ImsInvoice[]>([]);
    /** Rows waiting for reset confirmation */
    public resetRows = signal<ImsInvoice[]>([]);
    /** ITC details applied to ITC-section rows on Accept */
    public readonly acceptForm = new FormGroup({
        itcRedReq: new FormControl<ImsItcReductionRequired>('N', { nonNullable: true }),
        remarks: new FormControl<string>('', { nonNullable: true })
    });

    /** Upload history rows */
    public historyRows = signal<ImsReferenceRow[]>([]);
    /** True while the history loads */
    public isHistoryLoading = signal<boolean>(false);

    /** Open dialog references */
    public connectDialogRef: MatDialogRef<unknown> | null = null;
    public cancelConfirmationDialogRef: MatDialogRef<unknown> | null = null;
    public acceptDialogRef: MatDialogRef<unknown> | null = null;
    public resetConfirmDialogRef: MatDialogRef<unknown> | null = null;
    public historyDialogRef: MatDialogRef<unknown> | null = null;

    /**
     * Loads tax numbers, checks the GSP session for the active GSTIN and loads invoices once connected.
     *
     * @memberof ImsComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');

        this.gstReconcileService.getTaxDetails().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(response => {
            if (response?.status === 'success') {
                this.hasTaxNumbers.set(response.body?.length > 0);
            } else {
                this.toaster.showSnackBar('error', response?.message);
            }
        });

        this.store.pipe(
            select(state => state.gstR.activeCompanyGst),
            filter(gstin => !!gstin),
            distinctUntilChanged(),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(gstin => {
            this.store.dispatch(this.gstReconcileActions.GetGSPSession(gstin));
        });

        this.store.pipe(
            select(state => state.gstR.gstAuthenticated),
            distinctUntilChanged(),
            filter(isConnected => isConnected),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(() => {
            this.connectDialogRef?.close();
            this.loadInvoices(false);
        });
    }

    /**
     * Removes the GST sidebar body class.
     *
     * @memberof ImsComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('gst-sidebar-open');
    }

    /**
     * Stores the GST locale and its IMS strings.
     *
     * @param {Record<string, unknown>} data GST locale data
     * @memberof ImsComponent
     */
    public setLocaleData(data: Record<string, unknown>): void {
        this.localeData.set(data);
        this.imsLocale.set(data?.ims as Record<string, string>);
    }

    /**
     * Handles navigation events of the tax sidebar (GSTR links).
     *
     * @memberof ImsComponent
     */
    public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }

    /**
     * Opens the plan purchase page from the restricted-module message.
     *
     * @param {string} subscriptionId Subscription to upgrade
     * @memberof ImsComponent
     */
    public buyPlan(subscriptionId: string): void {
        this.router.navigate(['/pages/user-details/subscription/buy-plan/' + subscriptionId]);
    }

    /**
     * Loads IMS invoices for the selected period, filter and page.
     *
     * @param {boolean} refresh True to pull fresh data from the GST portal first
     * @memberof ImsComponent
     */
    public loadInvoices(refresh: boolean): void {
        const gstin = this.gstin();
        if (!gstin || !this.isConnected()) {
            return;
        }
        this.isLoading.set(!refresh);
        this.isRefreshing.set(refresh);
        this.loadError.set('');
        this.selectedKeys.set(new Set());

        this.imsService.getInvoices({
            gstin,
            monthYear: this.monthYear(),
            refresh,
            status: this.statusFilter() ?? undefined,
            page: this.page(),
            count: this.count()
        }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(response => {
            this.isLoading.set(false);
            this.isRefreshing.set(false);
            if (response?.status === 'success') {
                const body = response.body;
                this.isEmptySnapshot.set(false);
                this.invoices.set(body.invoices);
                this.summary.set(body.summary);
                this.totalResults.set(body.totalResults);
                this.note.set(body.note);
                return;
            }
            this.invoices.set([]);
            this.summary.set(null);
            this.totalResults.set(0);
            if (response?.code === 'error.ims.data.notFound') {
                this.isEmptySnapshot.set(true);
                return;
            }
            this.loadError.set(response?.message);
            this.toaster.showSnackBar('error', response?.message);
            if (refresh) {
                this.recheckSession();
            }
        });
    }

    /**
     * Selects a month from the period picker.
     *
     * @param {Date} date Any day of the selected month
     * @memberof ImsComponent
     */
    public setMonth(date: Date): void {
        this.customMonthSelected.set(true);
        this.selectedMonth.set(dayjs(date).startOf('month').toDate());
        this.resetListPosition();
        this.loadInvoices(false);
    }

    /**
     * Resets the period to the current month.
     *
     * @memberof ImsComponent
     */
    public clearMonth(): void {
        this.customMonthSelected.set(false);
        this.selectedMonth.set(dayjs().startOf('month').toDate());
        this.resetListPosition();
        this.loadInvoices(false);
    }

    /**
     * Applies the option chosen in the status filter dropdown.
     *
     * @param {ImsStatusFilterOption} option Selected option; "All" clears the filter
     * @memberof ImsComponent
     */
    public selectStatusFilter(option: ImsStatusFilterOption): void {
        const value = option?.value;
        this.setStatusFilter(!value || value === IMS_STATUS_FILTER_ALL ? null : value);
    }

    /**
     * Filters the list by IMS status.
     *
     * @param {(ImsStatus | null)} status Status to show, null for all
     * @memberof ImsComponent
     */
    public setStatusFilter(status: ImsStatus | null): void {
        if (this.statusFilter() === status) {
            return;
        }
        this.statusFilter.set(status);
        this.page.set(1);
        this.loadInvoices(false);
    }

    /**
     * Handles paginator changes.
     *
     * @param {PageEvent} event Paginator event
     * @memberof ImsComponent
     */
    public pageChanged(event: PageEvent): void {
        this.page.set(this.count() !== event.pageSize ? 1 : event.pageIndex + 1);
        this.count.set(event.pageSize);
        this.loadInvoices(false);
    }

    /**
     * Returns the key used to select and match an invoice.
     *
     * @param {ImsInvoice} row Invoice
     * @returns {string}
     * @memberof ImsComponent
     */
    public invoiceKey(row: ImsInvoice): string {
        return row.hash || `${row.section}|${row.supplierGstin}|${row.docNumber}|${row.docDate}`;
    }

    /**
     * Toggles the selection of one invoice.
     *
     * @param {ImsInvoice} row Invoice
     * @memberof ImsComponent
     */
    public toggleRow(row: ImsInvoice): void {
        const key = this.invoiceKey(row);
        const keys = new Set(this.selectedKeys());
        if (keys.has(key)) {
            keys.delete(key);
        } else {
            keys.add(key);
        }
        this.selectedKeys.set(keys);
    }

    /**
     * Selects or clears every invoice on the page.
     *
     * @param {boolean} checked True to select all
     * @memberof ImsComponent
     */
    public toggleAll(checked: boolean): void {
        this.selectedKeys.set(checked ? new Set(this.invoices().map(row => this.invoiceKey(row))) : new Set());
    }

    /**
     * Returns the label of an IMS status.
     *
     * @param {ImsStatus} status IMS status
     * @returns {string}
     * @memberof ImsComponent
     */
    public statusLabel(status: ImsStatus): string {
        return this.imsLocale()?.[status.toLowerCase()];
    }

    /**
     * Returns the tax total of an invoice.
     *
     * @param {ImsInvoice} row Invoice
     * @returns {number}
     * @memberof ImsComponent
     */
    public taxTotal(row: ImsInvoice): number {
        return row.igst + row.cgst + row.sgst + row.cess;
    }

    /**
     * Starts an Accept / Reject / Pending / Reset for the given rows (selected rows by default).
     * Accept on ITC sections opens the ITC dialog first; Reset asks for confirmation.
     *
     * @param {ImsBulkAction} action Action to apply
     * @param {ImsInvoice[]} [rows=this.selectedRows()] Invoices to act on
     * @memberof ImsComponent
     */
    public applyAction(action: ImsBulkAction, rows: ImsInvoice[] = this.selectedRows()): void {
        if (!rows.length) {
            this.toaster.showSnackBar('error', this.imsLocale()?.select_invoices);
            return;
        }
        if (this.isSaveInProgress()) {
            this.toaster.showSnackBar('warning', this.imsLocale()?.save_in_progress);
            return;
        }
        if (action === 'RESET') {
            this.resetRows.set(rows);
            this.resetConfirmDialogRef = this.dialog.open(this.resetConfirmDialog(), { width: '630px' });
            return;
        }
        if (action === 'ACCEPTED' && rows.some(row => this.hasItcFields(row))) {
            const itcRow = rows.find(row => this.hasItcFields(row));
            this.acceptForm.reset({ itcRedReq: itcRow.itcRedReq ?? 'N', remarks: itcRow.remarks ?? '' });
            this.acceptRows.set(rows);
            this.acceptDialogRef = this.dialog.open(this.acceptDialog(), { width: '630px', ariaLabelledBy: 'ims-accept-dialog-title' });
            return;
        }
        this.submitActions(rows, action, null);
    }

    /**
     * Confirms the accept dialog. Remarks are required when ITC reduction is not required.
     *
     * @memberof ImsComponent
     */
    public confirmAccept(): void {
        const { itcRedReq, remarks } = this.acceptForm.getRawValue();
        const remarksControl = this.acceptForm.controls.remarks;
        remarksControl.setValidators(itcRedReq === 'N' ? [Validators.required] : []);
        remarksControl.updateValueAndValidity();
        if (this.acceptForm.invalid || (itcRedReq === 'N' && !remarks.trim())) {
            remarksControl.markAsTouched();
            this.toaster.showSnackBar('error', this.imsLocale()?.remarks_required);
            return;
        }
        this.acceptDialogRef?.close();
        this.submitActions(this.acceptRows(), 'ACCEPTED', { itcRedReq, remarks: remarks.trim() });
    }

    /**
     * Confirms reset of the selected rows.
     *
     * @memberof ImsComponent
     */
    public confirmReset(): void {
        this.resetConfirmDialogRef?.close();
        this.submitActions(this.resetRows(), null, null);
    }

    /**
     * Returns true when an invoice section carries ITC fields.
     *
     * @param {ImsInvoice} row Invoice
     * @returns {boolean}
     * @memberof ImsComponent
     */
    public hasItcFields(row: ImsInvoice): boolean {
        return IMS_ITC_SECTIONS.includes(row.section);
    }

    /**
     * Opens the GSP OTP dialog.
     *
     * @memberof ImsComponent
     */
    public openConnectDialog(): void {
        this.connectDialogRef = this.dialog.open(this.connectDialog(), { ...ASIDE_PANE_CONFIG, autoFocus: false });
    }

    /**
     * Opens the confirmation shown when the OTP dialog is closed with changes.
     *
     * @memberof ImsComponent
     */
    public openCancelConfirmationDialog(): void {
        this.cancelConfirmationDialogRef = this.dialog.open(this.cancelConfirmationDialog(), { width: '630px' });
    }

    /**
     * Opens the upload history aside and loads reference ids for the period.
     *
     * @memberof ImsComponent
     */
    public openHistory(): void {
        this.historyRows.set([]);
        this.isHistoryLoading.set(true);
        this.historyDialogRef = this.dialog.open(this.historyDialog(), { ...ASIDE_PANE_CONFIG, autoFocus: false });
        this.imsService.getReferenceIds(this.gstin(), this.monthYear()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(response => {
            this.isHistoryLoading.set(false);
            if (response?.status === 'success') {
                this.historyRows.set(response.body);
            } else {
                this.toaster.showSnackBar('error', response?.message);
            }
        });
    }

    /**
     * Checks the portal status of a history reference with a single save-ims-status call (no polling)
     * and shows the result. A processed or failed result reloads the list so the statuses are current.
     *
     * @param {string} referenceId Reference id
     * @memberof ImsComponent
     */
    public checkReferenceStatus(referenceId: string): void {
        this.checkingReferenceId.set(referenceId);
        this.imsService.getSaveStatus({ referenceId, gstin: this.gstin(), retPeriod: this.returnPeriod() })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(response => {
                this.checkingReferenceId.set('');
                if (response?.status !== 'success') {
                    this.toaster.showSnackBar('error', response?.message);
                    return;
                }
                const portalStatus = this.readPortalStatus(response.body);
                const statusCode = portalStatus.status_cd || response.body?.gstErrorCode;
                if (!statusCode || IMS_IN_PROGRESS_STATUS_CODES.includes(statusCode)) {
                    this.toaster.showSnackBar('warning', this.imsLocale()?.poll_stopped);
                    return;
                }
                if (IMS_SUCCESS_STATUS_CODES.includes(statusCode)) {
                    this.toaster.showSnackBar('success', this.imsLocale()?.save_success);
                } else {
                    const errorCode = portalStatus.err_cd ? `${portalStatus.err_cd}: ` : '';
                    this.toaster.showSnackBar('error', errorCode + (portalStatus.err_msg || this.imsLocale()?.save_failed));
                }
                this.loadInvoices(false);
            });
    }

    /**
     * Returns the "[COUNT] selected" text.
     *
     * @returns {string}
     * @memberof ImsComponent
     */
    public selectedText(): string {
        return this.imsLocale()?.selected_count?.replace('[COUNT]', String(this.selectedRows().length));
    }

    /**
     * Returns the reset confirmation text.
     *
     * @returns {string}
     * @memberof ImsComponent
     */
    public resetConfirmText(): string {
        return this.imsLocale()?.reset_confirm?.replace('[COUNT]', String(this.resetRows().length));
    }

    /**
     * Sends the actions to the portal once (no status polling). On success the saved rows and
     * summary counts are updated in place; the portal result can be checked later from History.
     *
     * @private
     * @param {ImsInvoice[]} rows Invoices to act on
     * @param {(ImsActionStatus | null)} status Status to save, null to reset
     * @param {({ itcRedReq: ImsItcReductionRequired; remarks: string } | null)} itc ITC details for ITC sections on Accept
     * @memberof ImsComponent
     */
    private submitActions(rows: ImsInvoice[], status: ImsActionStatus | null, itc: { itcRedReq: ImsItcReductionRequired; remarks: string } | null): void {
        const actions = rows.map(row => this.buildAction(row, status, itc));
        this.isSaving.set(true);
        this.imsService.saveActions(
            { gstin: this.gstin(), monthYear: this.monthYear(), reset: status === null },
            { actions }
        ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(response => {
            this.isSaving.set(false);
            if (response?.status !== 'success') {
                this.toaster.showSnackBar('error', response?.message);
                this.recheckSession();
                return;
            }
            const portalStatus = this.readPortalStatus(response.body);
            if (portalStatus.err_cd || portalStatus.err_msg) {
                const errorCode = portalStatus.err_cd ? `${portalStatus.err_cd}: ` : '';
                this.toaster.showSnackBar('error', errorCode + (portalStatus.err_msg || this.imsLocale()?.save_failed));
                return;
            }
            this.selectedKeys.set(new Set());
            this.updateSavedRows(rows, status ?? 'NO_ACTION', itc);
            this.toaster.showSnackBar('success', this.imsLocale()?.save_success);
        });
    }

    /**
     * Shows the saved status on the saved rows and moves their counts in the summary boxes.
     *
     * @private
     * @param {ImsInvoice[]} rows Saved invoices
     * @param {ImsStatus} status Saved status (NO_ACTION after a reset)
     * @param {({ itcRedReq: ImsItcReductionRequired; remarks: string } | null)} itc ITC details sent on Accept
     * @memberof ImsComponent
     */
    private updateSavedRows(rows: ImsInvoice[], status: ImsStatus, itc: { itcRedReq: ImsItcReductionRequired; remarks: string } | null): void {
        const savedKeys = new Set(rows.map(row => this.invoiceKey(row)));
        const summary = this.summary();
        const counts = summary ? { ...summary } : null;
        this.invoices.update(invoices => invoices.map(row => {
            if (!savedKeys.has(this.invoiceKey(row))) {
                return row;
            }
            if (counts && row.imsStatus !== status) {
                counts[IMS_SUMMARY_KEYS[row.imsStatus]] = Math.max(0, counts[IMS_SUMMARY_KEYS[row.imsStatus]] - 1);
                counts[IMS_SUMMARY_KEYS[status]] += 1;
            }
            const updated: ImsInvoice = { ...row, imsStatus: status };
            if (status === 'ACCEPTED' && itc && this.hasItcFields(row)) {
                updated.itcRedReq = itc.itcRedReq;
                updated.remarks = itc.remarks;
            }
            return updated;
        }));
        if (counts) {
            this.summary.set(counts);
        }
    }

    /**
     * Builds one save action. ITC fields are sent only for ITC sections on Accept.
     *
     * @private
     * @param {ImsInvoice} row Invoice
     * @param {(ImsActionStatus | null)} status Status to save, null to reset
     * @param {({ itcRedReq: ImsItcReductionRequired; remarks: string } | null)} itc ITC details
     * @returns {ImsAction}
     * @memberof ImsComponent
     */
    private buildAction(row: ImsInvoice, status: ImsActionStatus | null, itc: { itcRedReq: ImsItcReductionRequired; remarks: string } | null): ImsAction {
        const action: ImsAction = {
            section: row.section,
            supplierGstin: row.supplierGstin,
            docNumber: row.docNumber,
            docDate: row.docDate
        };
        if (row.hash) {
            action.hash = row.hash;
        }
        if (status) {
            action.status = status;
        }
        if (status === 'ACCEPTED' && itc && this.hasItcFields(row)) {
            action.itcRedReq = itc.itcRedReq;
            if (itc.remarks) {
                action.remarks = itc.remarks;
            }
        }
        return action;
    }

    /**
     * Reads the portal status JSON from a save or status response (gstResponseString, data, or the body itself).
     *
     * @private
     * @param {ImsSaveResponse} body Save or status response body
     * @returns {ImsPortalStatus}
     * @memberof ImsComponent
     */
    private readPortalStatus(body: ImsSaveResponse): ImsPortalStatus {
        if (body?.gstResponseString) {
            return JSON.parse(body.gstResponseString) as ImsPortalStatus;
        }
        // Recorded save-ims-status shape: status_cd / err_cnt / proc_cnt directly on the body
        return body?.data ?? body ?? {};
    }

    /**
     * Re-checks the GSP session after a failed portal call so an expired session shows "Not connected".
     *
     * @private
     * @memberof ImsComponent
     */
    private recheckSession(): void {
        this.store.pipe(select(state => state.gstR.activeCompanyGst), take(1)).subscribe(gstin => {
            if (gstin) {
                this.store.dispatch(this.gstReconcileActions.GetGSPSession(gstin));
            }
        });
    }

    /**
     * Moves the list back to page 1 and clears the selection.
     *
     * @private
     * @memberof ImsComponent
     */
    private resetListPosition(): void {
        this.page.set(1);
        this.selectedKeys.set(new Set());
    }
}
