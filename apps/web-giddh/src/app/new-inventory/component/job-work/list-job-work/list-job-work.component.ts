import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { GIDDH_DATE_RANGE_PICKER_RANGES, IOption, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import {
    JobWorkActionRequest,
    JobWorkBatch,
    JobWorkExpenseLine,
    JobWorkLinkedChallan,
    JobWorkListRequest,
    JobWorkScrapLine,
    ScrapRetainedBy
} from 'apps/web-giddh/src/app/models/api-models/JobWork';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { JobWorkService } from 'apps/web-giddh/src/app/services/job-work.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { WarehouseActions } from 'apps/web-giddh/src/app/settings/warehouse/action/warehouse.action';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { JobWorkListFilterSnapshot, JobWorkListStateService } from '../job-work-list-state.service';

@Component({
    selector: 'list-job-work',
    templateUrl: './list-job-work.component.html',
    styleUrls: ['./list-job-work.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class ListJobWorkComponent implements OnInit, OnDestroy {
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
    @ViewChild('challanDialog') public challanDialog: TemplateRef<any>;
    @ViewChild('advanceFilterDialog') public advanceFilterDialog: TemplateRef<any>;

    public localeData: Record<string, string> = {};
    public commonLocaleData: Record<string, string> = {};
    public displayedColumns: string[] = [
        'date',
        'jobWorkNo',
        'jobworker',
        'type',
        'outputStock',
        'qty',
        'charges',
        'itc',
        'returnDue',
        'status',
        'action'
    ];
    /** Linked challan document-item columns (View Linked Challan dialog). */
    public linkedChallanItemColumns: string[] = [
        'type',
        'stock',
        'variant',
        'batch',
        'quantity',
        'rate',
        'amount'
    ];
    public dataSource: any[] = [];
    public selectedDateRange: any;
    public selectedDateRangeUi = '';
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    public selectedRangeLabel = '';
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    public searchRequest: JobWorkListRequest = {
        from: '',
        to: '',
        status: '',
        jobWorkType: '',
        accountUniqueName: '',
        warehouseUniqueName: '',
        q: '',
        onlyOverdue: false,
        onlyItcClaimed: false,
        page: 1,
        count: PAGINATION_LIMIT,
        sort: 'desc',
        sortBy: 'date'
    };
    public totalItems = 0;
    public totalPages = 1;
    public currentPage = 1;
    public isReportLoading = false;
    public isCompany = false;
    public isConsolidatedBranch = false;
    public statusOptions: Array<{ label: string; value: string }> = [];
    public typeOptions: Array<{ label: string; value: string }> = [];
    public selectedStatusLabel = '';
    public selectedTypeLabel = '';
    public summary = {
        totalCharges: 0,
        goodsWithJobworker: 0,
        overdueReturns: 0
    };
    /** Linked delivery challans shown in View Linked Challan dialog. */
    public linkedChallans: JobWorkLinkedChallan[] = [];
    public columnSearchForm: FormGroup;
    public showJobWorkNoSearch = false;
    public showJobworkerSearch = false;
    public showOutputStockSearch = false;
    public showClearFilter = false;
    public warehouses: IOption[] = [];
    public selectedWarehouseName = '';
    public advanceOnlyOverdue = false;
    public advanceOnlyItcClaimed = false;
    private destroyed$ = new ReplaySubject<boolean>(1);
    /** Keeps restored list dates until the user picks a new range. */
    private filtersRestoredActive = false;

    constructor(
        private readonly store: Store<AppState>,
        private readonly changeDetectionRef: ChangeDetectorRef,
        private readonly generalService: GeneralService,
        private readonly jobWorkService: JobWorkService,
        private readonly toasterService: ToasterService,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly formBuilder: FormBuilder,
        private readonly warehouseAction: WarehouseActions,
        private readonly jobWorkListState: JobWorkListStateService
    ) {
        this.columnSearchForm = this.formBuilder.group({
            jobWorkNo: [''],
            jobworker: [''],
            outputStock: ['']
        });
    }

    public ngOnInit(): void {
        this.isCompany = this.generalService.currentOrganizationType === OrganizationType.Company;
        this.store.pipe(select(state => state.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            this.isConsolidatedBranch = !!response?.isBranchConsolidated;
            this.changeDetectionRef.detectChanges();
        });

        this.getWarehouses();
        this.bindColumnSearch();

        const restored = this.restoreFilterSnapshot();

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (!dateObj) {
                return;
            }
            if (this.filtersRestoredActive) {
                return;
            }
            this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
            this.selectedDateRangeUi =
                dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + ' - ' + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.searchRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
            this.searchRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
            this.getReport();
        });

        if (restored) {
            this.getReport();
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public localeDataFn(event: Record<string, string>): void {
        this.localeData = event || {};
        this.statusOptions = [
            { label: this.localeData.all, value: '' },
            { label: 'Open', value: 'OPEN' },
            { label: 'In Transit', value: 'IN_TRANSIT' },
            { label: 'Dispatched', value: 'DISPATCHED' },
            { label: 'In Process', value: 'IN_PROCESS' },
            { label: 'Partially Received', value: 'PARTIALLY_RECEIVED' },
            { label: 'Overdue', value: 'OVERDUE' },
            { label: 'Completed', value: 'COMPLETED' },
            { label: 'Cancelled', value: 'CANCELLED' }
        ];
        this.typeOptions = [
            { label: this.localeData.all, value: '' },
            { label: this.localeData.send, value: 'SEND' },
            { label: this.localeData.receive, value: 'RECEIVE' }
        ];
        this.selectedStatusLabel = this.statusOptions.find(option => option.value === this.searchRequest.status)?.label
            || this.localeData.all;
        this.selectedTypeLabel = this.typeOptions.find(option => option.value === this.searchRequest.jobWorkType)?.label
            || this.localeData.all;
        this.changeDetectionRef.detectChanges();
    }

    public dateSelectedCallback(event?: { startDate?: string | ReturnType<typeof dayjs>; endDate?: string | ReturnType<typeof dayjs>; selectedLabel?: string }): void {
        if (event?.startDate && event?.endDate) {
            this.filtersRestoredActive = false;
            this.selectedRangeLabel = event?.selectedLabel || '';
            this.selectedDateRange = { startDate: dayjs(event.startDate), endDate: dayjs(event.endDate) };
            this.selectedDateRangeUi =
                dayjs(event.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) +
                ' - ' +
                dayjs(event.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.searchRequest.from = dayjs(event.startDate).format(GIDDH_DATE_FORMAT);
            this.searchRequest.to = dayjs(event.endDate).format(GIDDH_DATE_FORMAT);
            this.searchRequest.page = 1;
            this.getReport();
        }
        this.universalDatepickerTrigger?.closeMenu();
    }

    public getReport(): void {
        if (!this.searchRequest.from || !this.searchRequest.to) {
            return;
        }
        this.isReportLoading = true;
        this.updateShowClearFilter();
        this.jobWorkService.list(this.searchRequest).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response) => {
                this.isReportLoading = false;
                if (response?.status === 'success') {
                    const body = (response.body || {}) as {
                        items?: unknown[];
                        totalItems?: number;
                        totalPages?: number;
                        page?: number;
                        totalJobWorkCharges?: number;
                        goodsWithJobworker?: number;
                        overdueReturns?: number;
                    };
                    this.dataSource = Array.isArray(body.items) ? body.items : [];
                    this.totalItems = body.totalItems ?? this.dataSource.length;
                    this.totalPages = body.totalPages ?? 1;
                    this.currentPage = body.page ?? this.searchRequest.page ?? 1;
                    this.summary.totalCharges = body.totalJobWorkCharges ?? 0;
                    this.summary.goodsWithJobworker = body.goodsWithJobworker ?? 0;
                    this.summary.overdueReturns = body.overdueReturns ?? 0;
                } else {
                    this.dataSource = [];
                    this.toasterService.errorToast(response?.message);
                }
                this.changeDetectionRef.detectChanges();
            },
            error: () => {
                this.isReportLoading = false;
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    public handlePageEvent(event: PageEvent): void {
        this.searchRequest.page = event.pageIndex + 1;
        this.searchRequest.count = event.pageSize;
        this.getReport();
    }

    public onStatusChange(event: { label: string; value: string }): void {
        this.searchRequest.status = event?.value || '';
        this.selectedStatusLabel = event?.label || this.localeData.all;
        this.searchRequest.page = 1;
        this.getReport();
    }

    public onTypeChange(event: { label: string; value: string }): void {
        this.searchRequest.jobWorkType = (event?.value || '') as any;
        this.selectedTypeLabel = event?.label || this.localeData.all;
        this.searchRequest.page = 1;
        this.getReport();
    }

    public get shouldShowTable(): boolean {
        const hasColumnSearch = !!(
            this.showJobWorkNoSearch ||
            this.showJobworkerSearch ||
            this.showOutputStockSearch ||
            this.columnSearchForm?.controls?.jobWorkNo?.value ||
            this.columnSearchForm?.controls?.jobworker?.value ||
            this.columnSearchForm?.controls?.outputStock?.value
        );
        return !!(this.dataSource?.length || hasColumnSearch);
    }

    public openAdvanceFilterDialog(): void {
        this.advanceOnlyOverdue = !!this.searchRequest.onlyOverdue;
        this.advanceOnlyItcClaimed = !!this.searchRequest.onlyItcClaimed;
        this.dialog.open(this.advanceFilterDialog, {
            panelClass: ['mat-dialog'],
            width: '420px',
            autoFocus: false
        });
    }

    public applyAdvanceFilter(): void {
        this.searchRequest.onlyOverdue = this.advanceOnlyOverdue;
        this.searchRequest.onlyItcClaimed = this.advanceOnlyItcClaimed;
        this.searchRequest.page = 1;
        this.getReport();
    }

    public clearFilters(): void {
        this.searchRequest.status = '';
        this.searchRequest.jobWorkType = '';
        this.searchRequest.accountUniqueName = '';
        this.searchRequest.warehouseUniqueName = '';
        this.searchRequest.q = '';
        this.searchRequest.onlyOverdue = false;
        this.searchRequest.onlyItcClaimed = false;
        this.searchRequest.page = 1;
        this.selectedStatusLabel = this.localeData.all;
        this.selectedTypeLabel = this.localeData.all;
        this.selectedWarehouseName = '';
        this.advanceOnlyOverdue = false;
        this.advanceOnlyItcClaimed = false;
        this.columnSearchForm.reset({ jobWorkNo: '', jobworker: '', outputStock: '' }, { emitEvent: false });
        this.showJobWorkNoSearch = false;
        this.showJobworkerSearch = false;
        this.showOutputStockSearch = false;
        this.filtersRestoredActive = false;
        this.jobWorkListState.clear();
        this.getReport();
    }

    public toggleSearch(fieldName: string): void {
        this.showJobWorkNoSearch = fieldName === 'jobWorkNo';
        this.showJobworkerSearch = fieldName === 'jobworker';
        this.showOutputStockSearch = fieldName === 'outputStock';
        this.changeDetectionRef.detectChanges();
    }

    public getSearchFieldText(title: string): string {
        return (this.localeData?.search_field || 'Search [FIELD]')?.replace('[FIELD]', title);
    }

    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        const controlName = searchedFieldName === 'jobWorkNo'
            ? 'jobWorkNo'
            : searchedFieldName === 'jobworker'
                ? 'jobworker'
                : 'outputStock';
        const value = this.columnSearchForm?.controls[controlName]?.value;
        if (value !== null && value !== '') {
            return;
        }
        if (this.generalService.childOf(event?.target, element)) {
            return;
        }
        if (searchedFieldName === 'jobWorkNo') {
            this.showJobWorkNoSearch = false;
        } else if (searchedFieldName === 'jobworker') {
            this.showJobworkerSearch = false;
        } else if (searchedFieldName === 'outputStock') {
            this.showOutputStockSearch = false;
        }
        this.changeDetectionRef.detectChanges();
    }

    public onAdvanceWarehouseSelected(event: IOption): void {
        this.searchRequest.warehouseUniqueName = event?.value || '';
        this.selectedWarehouseName = event?.label || '';
    }

    public goToCreate(): void {
        this.jobWorkListState.save(this.buildFilterSnapshot());
        this.router.navigate(['/pages/inventory/v2/job-work/create'], {
            state: { fromJobWorkList: true }
        });
    }

    public goToEdit(row: any): void {
        const uniqueName = row?.uniqueName || row?.jobWorkUniqueName;
        if (uniqueName) {
            this.jobWorkListState.save(this.buildFilterSnapshot());
            this.router.navigate(['/pages/inventory/v2/job-work/edit', uniqueName], {
                state: { fromJobWorkList: true }
            });
        }
    }

    public getRowUniqueName(row: any): string {
        return row?.uniqueName || row?.jobWorkUniqueName || '';
    }

    public getItcLabel(row: any): string {
        if (row?.itcStatus === 'CLAIMED' || row?.claimItc === true) {
            return this.localeData.claimed;
        }
        if (row?.itcStatus === 'NOT_CLAIMED' || row?.claimItc === false) {
            return this.localeData.not_claimed;
        }
        return this.commonLocaleData?.app_not_applicable || 'N/A';
    }

    /**
     * Shows an em dash when list API omits a display value.
     *
     * @param {unknown} value
     * @returns {string}
     * @memberof ListJobWorkComponent
     */
    public displayValue(value: unknown): string {
        if (value === null || value === undefined || value === '') {
            return '—';
        }
        return String(value);
    }

    public recordReturn(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '585px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData.confirm_record_return,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(action => {
            if (!action) {
                return;
            }
            // List row lacks stock/variant/batches; load order GET then build RETURN items.
            this.jobWorkService.get(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((orderResponse) => {
                if (orderResponse?.status !== 'success' || !orderResponse.body) {
                    this.toasterService.errorToast(orderResponse?.message);
                    return;
                }
                const body = orderResponse.body as Record<string, unknown>;
                const items = this.buildReturnActionItems(body);
                if (!items.length) {
                    this.toasterService.errorToast(this.localeData.return_items_missing);
                    return;
                }
                const payload: JobWorkActionRequest = {
                    action: 'RETURN',
                    uniqueName,
                    date: dayjs().format(GIDDH_DATE_FORMAT),
                    warehouseUniqueName: this.getWarehouseUniqueNameFromOrder(body, row),
                    isFinal: false,
                    items
                };
                this.jobWorkService.action(payload).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                    if (response?.status === 'success') {
                        this.toasterService.successToast(this.localeData.return_recorded);
                        this.getReport();
                    } else {
                        this.toasterService.errorToast(response?.message);
                    }
                });
            });
        });
    }

    /**
     * Builds RETURN action `items` from order GET `documentItems` (OUTPUT + INPUT).
     *
     * @private
     * @param {Record<string, unknown>} body
     * @returns {NonNullable<JobWorkActionRequest['items']>}
     * @memberof ListJobWorkComponent
     */
    private buildReturnActionItems(body: Record<string, unknown>): NonNullable<JobWorkActionRequest['items']> {
        const documentItems = (body['documentItems'] as Array<Record<string, unknown>>) || [];
        return documentItems
            .filter(item => item['lineRole'] === 'OUTPUT' || item['lineRole'] === 'INPUT')
            .map(item => this.mapDocumentItemToReturnActionItem(item))
            .filter(item => !!item.stockUniqueName);
    }

    /**
     * Maps one GET `documentItems` row into a RETURN action line.
     *
     * @private
     * @param {Record<string, unknown>} item
     * @returns {NonNullable<JobWorkActionRequest['items']>[number]}
     * @memberof ListJobWorkComponent
     */
    private mapDocumentItemToReturnActionItem(
        item: Record<string, unknown>
    ): NonNullable<JobWorkActionRequest['items']>[number] {
        const stock = item['stock'] as { uniqueName?: string } | undefined;
        const variant = item['variant'] as { uniqueName?: string } | undefined;
        return {
            lineRole: item['lineRole'] as 'OUTPUT' | 'INPUT',
            stockUniqueName: stock?.uniqueName || (item['stockUniqueName'] as string) || '',
            variantUniqueName: variant?.uniqueName || (item['variantUniqueName'] as string) || '',
            quantity: Number(item['quantity']) || 0,
            batches: this.mapActionBatches(item['batches'])
        };
    }

    /**
     * Resolves warehouse uniqueName from order GET body, then list row fallback.
     *
     * @private
     * @param {Record<string, unknown>} body
     * @param {*} row
     * @returns {string}
     * @memberof ListJobWorkComponent
     */
    private getWarehouseUniqueNameFromOrder(body: Record<string, unknown>, row: any): string {
        const warehouse = body['warehouse'] as { uniqueName?: string } | undefined;
        return warehouse?.uniqueName
            || (body['warehouseUniqueName'] as string)
            || row?.warehouse?.uniqueName
            || row?.warehouseUniqueName
            || '';
    }

    /**
     * Maps API batches for action payloads.
     *
     * @private
     * @param {unknown} batches
     * @returns {JobWorkBatch[]}
     * @memberof ListJobWorkComponent
     */
    private mapActionBatches(batches: unknown): JobWorkBatch[] {
        if (!Array.isArray(batches)) {
            return [];
        }
        return batches.map((batch: Record<string, unknown>) => ({
            uniqueName: (batch['uniqueName'] as string) || '',
            name: (batch['name'] as string) || '',
            quantity: Number(batch['quantity']) || 0
        }));
    }

    /**
     * Builds MARK_SCRAP `scraps` from order GET (`documentItems` SCRAP, else `jobWorkDetails.scraps`).
     *
     * @private
     * @param {Record<string, unknown>} body
     * @returns {JobWorkScrapLine[]}
     * @memberof ListJobWorkComponent
     */
    private buildMarkScrapActionItems(body: Record<string, unknown>): JobWorkScrapLine[] {
        const details = (body['jobWorkDetails'] || {}) as Record<string, unknown>;
        const defaultRetainedBy = (details['scrapRetainedBy'] as ScrapRetainedBy)
            || (body['scrapRetainedBy'] as ScrapRetainedBy)
            || 'COMPANY';
        const detailScraps = (details['scraps'] as Array<Record<string, unknown>>) || [];
        const documentItems = (body['documentItems'] as Array<Record<string, unknown>>) || [];
        const scrapItems = documentItems.filter(item => item['lineRole'] === 'SCRAP');

        if (scrapItems.length) {
            return scrapItems
                .map(item => this.mapDocumentItemToScrapActionItem(item, detailScraps, defaultRetainedBy))
                .filter(item => !!item.stockUniqueName);
        }

        return detailScraps
            .map(row => this.mapDetailScrapToScrapActionItem(row, defaultRetainedBy))
            .filter(item => !!item.stockUniqueName);
    }

    /**
     * Maps a SCRAP `documentItems` row into MARK_SCRAP scrap payload.
     *
     * @private
     * @param {Record<string, unknown>} item
     * @param {Array<Record<string, unknown>>} detailScraps
     * @param {ScrapRetainedBy} defaultRetainedBy
     * @returns {JobWorkScrapLine}
     * @memberof ListJobWorkComponent
     */
    private mapDocumentItemToScrapActionItem(
        item: Record<string, unknown>,
        detailScraps: Array<Record<string, unknown>>,
        defaultRetainedBy: ScrapRetainedBy
    ): JobWorkScrapLine {
        const stock = item['stock'] as { uniqueName?: string } | undefined;
        const variant = item['variant'] as { uniqueName?: string } | undefined;
        const stockUniqueName = stock?.uniqueName || (item['stockUniqueName'] as string) || '';
        const variantUniqueName = variant?.uniqueName || (item['variantUniqueName'] as string) || '';
        const detailScrap = detailScraps.find(row => {
            const detailStock = (row['stockUniqueName'] as string) || '';
            const detailVariant = (row['variantUniqueName'] as string) || '';
            if (detailStock !== stockUniqueName) {
                return false;
            }
            if (detailVariant && variantUniqueName) {
                return detailVariant === variantUniqueName;
            }
            return !detailVariant && !variantUniqueName;
        });

        return {
            stockUniqueName,
            variantUniqueName,
            quantity: Number(item['quantity']) || Number(detailScrap?.['quantity']) || 0,
            batches: this.mapActionBatches(item['batches'] ?? detailScrap?.['batches']),
            retainedBy: (item['retainedBy'] as ScrapRetainedBy)
                || (detailScrap?.['retainedBy'] as ScrapRetainedBy)
                || defaultRetainedBy
        };
    }

    /**
     * Maps a flat `jobWorkDetails.scraps` row into MARK_SCRAP scrap payload.
     *
     * @private
     * @param {Record<string, unknown>} row
     * @param {ScrapRetainedBy} defaultRetainedBy
     * @returns {JobWorkScrapLine}
     * @memberof ListJobWorkComponent
     */
    private mapDetailScrapToScrapActionItem(
        row: Record<string, unknown>,
        defaultRetainedBy: ScrapRetainedBy
    ): JobWorkScrapLine {
        return {
            stockUniqueName: (row['stockUniqueName'] as string) || '',
            variantUniqueName: (row['variantUniqueName'] as string) || '',
            quantity: Number(row['quantity']) || 0,
            batches: this.mapActionBatches(row['batches']),
            retainedBy: (row['retainedBy'] as ScrapRetainedBy) || defaultRetainedBy
        };
    }

    public viewLinkedChallan(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        this.jobWorkService.getChallan(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === 'success') {
                this.linkedChallans = this.normalizeLinkedChallans(response.body);
                this.dialog.open(this.challanDialog, {
                    width: '760px',
                    maxWidth: '95vw',
                    autoFocus: false,
                    panelClass: 'linked-challan-dialog-panel'
                });
                this.changeDetectionRef.detectChanges();
            } else {
                this.toasterService.errorToast(response?.message);
            }
        });
    }

    /**
     * Normalizes challan GET body to an array (API returns `body: JobWorkLinkedChallan[]`).
     *
     * @private
     * @param {unknown} body
     * @returns {JobWorkLinkedChallan[]}
     * @memberof ListJobWorkComponent
     */
    private normalizeLinkedChallans(body: unknown): JobWorkLinkedChallan[] {
        if (Array.isArray(body)) {
            return body as JobWorkLinkedChallan[];
        }
        if (body && typeof body === 'object') {
            return [body as JobWorkLinkedChallan];
        }
        return [];
    }

    /**
     * Formats batch labels for a challan line.
     *
     * @param {JobWorkLinkedChallan['documentItems'][number]} item
     * @returns {string}
     * @memberof ListJobWorkComponent
     */
    public getChallanItemBatchesLabel(
        item: NonNullable<JobWorkLinkedChallan['documentItems']>[number]
    ): string {
        if (Array.isArray(item?.batches) && item.batches.length) {
            return item.batches
                .map(batch => {
                    const name = batch?.name || batch?.uniqueName || '';
                    const quantity = batch?.quantity;
                    return quantity != null ? `${name} (${quantity})` : name;
                })
                .filter(Boolean)
                .join(', ');
        }
        return item?.batch?.name || item?.batch?.uniqueName || '—';
    }

    public markScrap(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        // List row lacks scrap lines/warehouse; load order GET then build MARK_SCRAP scraps.
        this.jobWorkService.get(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((orderResponse) => {
            if (orderResponse?.status !== 'success' || !orderResponse.body) {
                this.toasterService.errorToast(orderResponse?.message);
                return;
            }
            const body = orderResponse.body as Record<string, unknown>;
            const scraps = this.buildMarkScrapActionItems(body);
            if (!scraps.length) {
                this.toasterService.errorToast(this.localeData.scrap_items_missing);
                return;
            }
            const payload: JobWorkActionRequest = {
                action: 'MARK_SCRAP',
                uniqueName,
                date: dayjs().format(GIDDH_DATE_FORMAT),
                warehouseUniqueName: this.getWarehouseUniqueNameFromOrder(body, row),
                scraps
            };
            this.jobWorkService.action(payload).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response?.status === 'success') {
                    this.toasterService.successToast(this.localeData.scrap_marked);
                    this.getReport();
                } else {
                    this.toasterService.errorToast(response?.message);
                }
            });
        });
    }

    public makeAdjustment(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        // List row lacks expenses/flags; load order GET then build ADJUST payload.
        this.jobWorkService.get(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((orderResponse) => {
            if (orderResponse?.status !== 'success' || !orderResponse.body) {
                this.toasterService.errorToast(orderResponse?.message);
                return;
            }
            const body = orderResponse.body as Record<string, unknown>;
            const details = (body['jobWorkDetails'] || {}) as Record<string, unknown>;
            const increaseAssetValue = (details['increaseAssetValue'] ?? body['increaseAssetValue'] ?? row?.increaseAssetValue) !== false;
            const claimItcValue = details['claimItc'] ?? body['claimItc'] ?? row?.claimItc;
            const claimItc = claimItcValue === undefined || claimItcValue === null
                ? increaseAssetValue
                : !!claimItcValue;
            const expenses = this.buildAdjustActionExpenses(body);
            if (!expenses.length) {
                this.toasterService.errorToast(this.localeData.expense_items_missing);
                return;
            }
            const payload: JobWorkActionRequest = {
                action: 'ADJUST',
                uniqueName,
                increaseAssetValue,
                claimItc,
                expenses
            };
            this.jobWorkService.action(payload).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response?.status === 'success') {
                    this.toasterService.successToast(this.localeData.adjustment_saved);
                    this.getReport();
                } else {
                    this.toasterService.errorToast(response?.message);
                }
            });
        });
    }

    /**
     * Builds ADJUST action `expenses` from order GET (`jobWorkDetails.expenses` or root `expenses`).
     *
     * @private
     * @param {Record<string, unknown>} body
     * @returns {JobWorkExpenseLine[]}
     * @memberof ListJobWorkComponent
     */
    private buildAdjustActionExpenses(body: Record<string, unknown>): JobWorkExpenseLine[] {
        const details = (body['jobWorkDetails'] || {}) as Record<string, unknown>;
        const detailExpenses = (details['expenses'] as Array<Record<string, unknown>>) || [];
        const rootExpenses = (body['expenses'] as Array<Record<string, unknown>>) || [];
        const source = detailExpenses.length ? detailExpenses : rootExpenses;
        return source
            .map(row => this.mapExpenseToAdjustActionItem(row))
            .filter(row => !!row.fromAccountUniqueName && !!row.toAccountUniqueName && !!row.amount);
    }

    /**
     * Maps one expense API row into ADJUST action expense payload.
     *
     * @private
     * @param {Record<string, unknown>} row
     * @returns {JobWorkExpenseLine}
     * @memberof ListJobWorkComponent
     */
    private mapExpenseToAdjustActionItem(row: Record<string, unknown>): JobWorkExpenseLine {
        const fromAccount = row['fromAccount'] as { uniqueName?: string } | undefined;
        const toAccount = row['toAccount'] as { uniqueName?: string } | undefined;
        return {
            fromAccountUniqueName: fromAccount?.uniqueName
                || (row['fromAccountUniqueName'] as string)
                || '',
            toAccountUniqueName: toAccount?.uniqueName
                || (row['toAccountUniqueName'] as string)
                || '',
            tax: (row['tax'] as string) || '',
            amount: Number(row['amount']) || 0,
            taxAmount: Number(row['taxAmount']) || 0
        };
    }

    public printJobWork(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        this.jobWorkService.action({ action: 'PRINT', uniqueName }).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === 'success') {
                const body = response.body as string | { fileUrl?: string; downloadUrl?: string; url?: string } | null;
                const fileUrl = typeof body === 'string'
                    ? body
                    : (body?.fileUrl || body?.downloadUrl || body?.url || '');
                if (fileUrl) {
                    window.open(fileUrl, '_blank');
                } else {
                    this.toasterService.successToast(this.commonLocaleData?.app_success);
                }
            } else {
                this.toasterService.errorToast(response?.message);
            }
        });
    }

    public cancelJobWork(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '585px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData.confirm_cancel_job_work,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(action => {
            if (!action) {
                return;
            }
            this.jobWorkService.action({
                action: 'CANCEL',
                uniqueNames: [uniqueName],
                reason: this.localeData.cancel_reason
            }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
                if (response?.status === 'success') {
                    this.toasterService.successToast(this.localeData.job_work_cancelled);
                    this.getReport();
                } else {
                    this.toasterService.errorToast(response?.message);
                }
            });
        });
    }

    public deleteJobWork(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        const dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '585px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData.confirm_delete_job_work,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(action => {
            if (!action) {
                return;
            }
            this.jobWorkService.action({
                action: 'DELETE',
                uniqueNames: [uniqueName]
            }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
                if (response?.status === 'success') {
                    this.toasterService.successToast(this.localeData.job_work_deleted);
                    this.getReport();
                } else {
                    this.toasterService.errorToast(response?.message);
                }
            });
        });
    }

    public statusClass(status: string): string {
        const normalized = (status || '').toUpperCase();
        if (normalized === 'COMPLETED') {
            return 'status-completed';
        }
        if (normalized === 'OVERDUE') {
            return 'status-overdue';
        }
        if (normalized === 'CANCELLED') {
            return 'status-cancelled';
        }
        if (normalized === 'PARTIALLY_RECEIVED') {
            return 'status-partial';
        }
        if (normalized === 'IN_TRANSIT' || normalized === 'DISPATCHED' || normalized === 'SHIPPED') {
            return 'status-transit';
        }
        if (normalized === 'IN_PROCESS') {
            return 'status-process';
        }
        return 'status-open';
    }

    private getWarehouses(): void {
        this.store.dispatch(this.warehouseAction.fetchAllWarehouses({ page: 1, count: 0 }));
        this.store.pipe(select(state => state.warehouse.warehouses), takeUntil(this.destroyed$)).subscribe((warehouses) => {
            const response = warehouses as unknown as { results?: Array<{ name: string; uniqueName: string }> };
            if (!response?.results?.length) {
                return;
            }
            this.warehouses = response.results.map(warehouse => ({
                label: warehouse.name,
                value: warehouse.uniqueName
            }));
            this.changeDetectionRef.detectChanges();
        });
    }

    private bindColumnSearch(): void {
        this.columnSearchForm.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
            takeUntil(this.destroyed$)
        ).subscribe((value: { jobWorkNo?: string; jobworker?: string; outputStock?: string }) => {
            const q = (value?.jobWorkNo || value?.jobworker || value?.outputStock || '').trim();
            this.searchRequest.q = q;
            this.searchRequest.page = 1;
            this.getReport();
        });
    }

    private updateShowClearFilter(): void {
        this.showClearFilter = !!(
            this.searchRequest.status ||
            this.searchRequest.jobWorkType ||
            this.searchRequest.accountUniqueName ||
            this.searchRequest.warehouseUniqueName ||
            this.searchRequest.q ||
            this.searchRequest.onlyOverdue ||
            this.searchRequest.onlyItcClaimed ||
            this.columnSearchForm?.controls?.jobWorkNo?.value ||
            this.columnSearchForm?.controls?.jobworker?.value ||
            this.columnSearchForm?.controls?.outputStock?.value
        );
    }

    /**
     * Builds a snapshot of the current list filters for create/edit navigation.
     *
     * @returns {JobWorkListFilterSnapshot}
     * @memberof ListJobWorkComponent
     */
    private buildFilterSnapshot(): JobWorkListFilterSnapshot {
        const columnSearch = this.columnSearchForm.getRawValue() as {
            jobWorkNo?: string;
            jobworker?: string;
            outputStock?: string;
        };
        return {
            searchRequest: { ...this.searchRequest },
            selectedStatusLabel: this.selectedStatusLabel,
            selectedTypeLabel: this.selectedTypeLabel,
            selectedWarehouseName: this.selectedWarehouseName,
            selectedDateRangeUi: this.selectedDateRangeUi,
            selectedRangeLabel: this.selectedRangeLabel,
            columnSearch: {
                jobWorkNo: columnSearch?.jobWorkNo || '',
                jobworker: columnSearch?.jobworker || '',
                outputStock: columnSearch?.outputStock || ''
            }
        };
    }

    /**
     * Restores list filters saved before navigating to create/edit.
     *
     * @returns {boolean} True when a snapshot was applied.
     * @memberof ListJobWorkComponent
     */
    private restoreFilterSnapshot(): boolean {
        const snapshot = this.jobWorkListState.get();
        if (!snapshot) {
            return false;
        }

        this.searchRequest = { ...snapshot.searchRequest };
        this.selectedStatusLabel = snapshot.selectedStatusLabel;
        this.selectedTypeLabel = snapshot.selectedTypeLabel;
        this.selectedWarehouseName = snapshot.selectedWarehouseName;
        this.selectedDateRangeUi = snapshot.selectedDateRangeUi;
        this.selectedRangeLabel = snapshot.selectedRangeLabel;
        this.advanceOnlyOverdue = !!snapshot.searchRequest.onlyOverdue;
        this.advanceOnlyItcClaimed = !!snapshot.searchRequest.onlyItcClaimed;
        this.columnSearchForm.reset({
            jobWorkNo: snapshot.columnSearch.jobWorkNo,
            jobworker: snapshot.columnSearch.jobworker,
            outputStock: snapshot.columnSearch.outputStock
        }, { emitEvent: false });

        if (snapshot.searchRequest.from && snapshot.searchRequest.to) {
            this.selectedDateRange = {
                startDate: dayjs(snapshot.searchRequest.from, GIDDH_DATE_FORMAT),
                endDate: dayjs(snapshot.searchRequest.to, GIDDH_DATE_FORMAT)
            };
        }

        this.showJobWorkNoSearch = !!snapshot.columnSearch.jobWorkNo;
        this.showJobworkerSearch = !!snapshot.columnSearch.jobworker;
        this.showOutputStockSearch = !!snapshot.columnSearch.outputStock;
        this.filtersRestoredActive = true;
        this.updateShowClearFilter();
        return true;
    }
}
