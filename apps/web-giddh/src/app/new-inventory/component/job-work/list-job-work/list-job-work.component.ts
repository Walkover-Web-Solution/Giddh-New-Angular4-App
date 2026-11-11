import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { GIDDH_DATE_RANGE_PICKER_RANGES, IOption, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import { JobWorkListRequest } from 'apps/web-giddh/src/app/models/api-models/JobWork';
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
    public challanDetails: unknown;
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

    public dateSelectedCallback(event?: { startDate?: dayjs.Dayjs | string; endDate?: dayjs.Dayjs | string; selectedLabel?: string }): void {
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
                body: this.localeData.record_return,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });
        dialogRef.afterClosed().pipe(take(1)).subscribe(action => {
            if (!action) {
                return;
            }
            this.jobWorkService.action({
                action: 'RETURN',
                uniqueName,
                date: dayjs().format(GIDDH_DATE_FORMAT),
                warehouseUniqueName: row.warehouseUniqueName || '',
                isFinal: false,
                items: [
                    {
                        lineRole: 'OUTPUT',
                        stockUniqueName: row.finishedStockUniqueName || row.outputStockUniqueName || row.stockUniqueName || '',
                        variantUniqueName: row.finishedVariantUniqueName || '',
                        quantity: Number(row.remainingQuantity || row.quantity || 0),
                        batches: []
                    }
                ]
            }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
                if (response?.status === 'success') {
                    this.toasterService.successToast(this.localeData.return_recorded);
                    this.getReport();
                } else {
                    this.toasterService.errorToast(response?.message);
                }
            });
        });
    }

    public viewLinkedChallan(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        this.jobWorkService.getChallan(uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === 'success') {
                this.challanDetails = response.body;
                this.dialog.open(this.challanDialog, { width: '640px' });
                this.changeDetectionRef.detectChanges();
            } else {
                this.toasterService.errorToast(response?.message);
            }
        });
    }

    public markScrap(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        this.jobWorkService.action({
            action: 'MARK_SCRAP',
            uniqueName,
            date: dayjs().format(GIDDH_DATE_FORMAT),
            warehouseUniqueName: row.warehouseUniqueName || '',
            scraps: []
        }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === 'success') {
                this.toasterService.successToast(this.localeData.scrap_marked);
                this.getReport();
            } else {
                this.toasterService.errorToast(response?.message);
            }
        });
    }

    public makeAdjustment(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        this.jobWorkService.action({
            action: 'ADJUST',
            uniqueName,
            increaseAssetValue: row.increaseAssetValue !== false,
            claimItc: !!row.claimItc,
            expenses: row.expenses || []
        }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === 'success') {
                this.toasterService.successToast(this.localeData.adjustment_saved);
                this.getReport();
            } else {
                this.toasterService.errorToast(response?.message);
            }
        });
    }

    public printJobWork(row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        this.jobWorkService.action({ action: 'PRINT', uniqueName }).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === 'success') {
                this.challanDetails = response.body;
                this.dialog.open(this.challanDialog, { width: '640px' });
                this.changeDetectionRef.detectChanges();
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
        if (normalized === 'IN_TRANSIT' || normalized === 'DISPATCHED') {
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
