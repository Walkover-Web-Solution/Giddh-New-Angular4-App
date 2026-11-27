import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { SettingsBranchActions } from 'apps/web-giddh/src/app/actions/settings/branch/settings.branch.action';
import { ASIDE_PANE_CONFIG, BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, IOption, isSelectedAllOption, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from 'apps/web-giddh/src/app/app.constant';
import {
    JobWorkBatch,
    JobWorkLinkedChallan,
    JobWorkListRequest
} from 'apps/web-giddh/src/app/models/api-models/JobWork';
import {
    BatchSelectDialogResult,
    VoucherSelectedBatch
} from 'apps/web-giddh/src/app/models/interfaces/batch-report.interface';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { JobWorkService } from 'apps/web-giddh/src/app/services/job-work.service';
import { SearchService } from 'apps/web-giddh/src/app/services/search.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { WarehouseActions } from 'apps/web-giddh/src/app/settings/warehouse/action/warehouse.action';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ConfirmModalComponent } from 'apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component';
import { cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { BatchSelectDialogComponent } from 'apps/web-giddh/src/app/vouchers/batch-select-dialog/batch-select-dialog.component';
import * as dayjs from 'dayjs';
import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import {
    JobWorkActionDialogComponent,
    JobWorkActionDialogMode
} from '../job-work-action-dialog/job-work-action-dialog.component';
import { JobWorkListFilterSnapshot, JobWorkListStateService } from '../job-work-list-state.service';

type LinkedChallanDocumentItem = NonNullable<JobWorkLinkedChallan['documentItems']>[number];

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
    /** Linked challan item columns */
    public linkedChallanItemColumns: string[] = ['type', 'item', 'batch', 'quantity', 'rate', 'amount'];
    public dataSource: any[] = [];
    /** Batch tracking enabled */
    public batchTrackingEnabled = false;
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
        accountUniqueNames: [],
        warehouseUniqueNames: [],
        stockUniqueNames: [],
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
    /** True when org is Company and has more than one branch (same as Manufacturing list). */
    public isCompany = false;
    public isConsolidatedBranch = false;
    /** Active organization type from session. */
    public currentOrganizationType: OrganizationType;
    /** Company + branch options used to decide company mode. */
    public currentCompanyBranches: Array<{ label: string; value: string; name?: string; parentBranch?: unknown; isCompany?: boolean }> = [];
    /** Currently selected branch for company/consolidated filters. */
    public currentBranch: { name?: string; alias?: string; uniqueName?: string } = {};
    /** Selected branch label shown in dropdown. */
    public selectedBranchName = '';
    /** Active company from session. */
    public activeCompany: {
        name?: string;
        uniqueName?: string;
        nameAlias?: string;
        baseCurrency?: string;
        baseCurrencySymbol?: string;
    } | null = null;
    public statusOptions: Array<{ label: string; value: string }> = [];
    public typeOptions: Array<{ label: string; value: string }> = [];
    public selectedStatusLabel = '';
    public selectedTypeLabel = '';
    public summary: {
        totalCharges: number | undefined;
        goodsWithJobworker: number | undefined;
        overdueReturns: number | undefined;
    } = {
        totalCharges: undefined,
        goodsWithJobworker: undefined,
        overdueReturns: undefined
    };
    /** Linked delivery challans shown in View Linked Challan dialog. */
    public linkedChallans: JobWorkLinkedChallan[] = [];
    /** Column search: Job Work No. (shared `q` with the other two). */
    public jobWorkNoInput: FormControl<string | null> = new FormControl<string | null>(null);
    /** Column search: Jobworker Name (shared `q`). */
    public jobworkerInput: FormControl<string | null> = new FormControl<string | null>(null);
    /** Column search: Output Stock (shared `q`). */
    public outputStockInput: FormControl<string | null> = new FormControl<string | null>(null);
    public showJobWorkNoSearch = false;
    public showJobworkerSearch = false;
    public showOutputStockSearch = false;
    public showClearFilter = false;
    public warehouses: IOption[] = [];
    /** Advance Filter warehouse values */
    public selectedWarehouseUniqueNames: string[] = [];
    /** Advance Filter jobworker account values */
    public selectedAccountUniqueNames: string[] = [];
    /** Advance Filter stock values */
    public selectedStockUniqueNames: string[] = [];
    /** Jobworker options for Advance Filter */
    public advanceAccountOptions: IOption[] = [];
    /** Stock options for Advance Filter */
    public advanceStockOptions: IOption[] = [];
    public advanceOnlyOverdue = false;
    public advanceOnlyItcClaimed = false;
    /** Jobworker account search page */
    private advanceAccountPage = 1;
    /** Jobworker account total pages */
    private advanceAccountTotalPages = 1;
    /** Jobworker account search query */
    private advanceAccountQuery = '';
    /** Stock search page */
    private advanceStockPage = 1;
    /** Stock total pages */
    private advanceStockTotalPages = 1;
    /** Stock search query */
    private advanceStockQuery = '';
    private destroyed$ = new ReplaySubject<boolean>(1);
    /** Keeps restored list dates until the user picks a new range. */
    private filtersRestoredActive = false;

    constructor(
        private readonly store: Store<AppState>,
        private readonly changeDetectionRef: ChangeDetectorRef,
        private readonly generalService: GeneralService,
        private readonly jobWorkService: JobWorkService,
        private readonly searchService: SearchService,
        private readonly inventoryService: InventoryService,
        private readonly toasterService: ToasterService,
        private readonly router: Router,
        private readonly dialog: MatDialog,
        private readonly warehouseAction: WarehouseActions,
        private readonly settingsBranchAction: SettingsBranchActions,
        private readonly jobWorkListState: JobWorkListStateService
    ) {}

    public ngOnInit(): void {
        this.currentOrganizationType = this.generalService.currentOrganizationType;

        this.store.pipe(
            select(state => state.inventory.inventorySettings),
            takeUntil(this.destroyed$)
        ).subscribe(settings => {
            if (settings) {
                this.batchTrackingEnabled = !!settings?.batchManagement?.enabled;
                this.changeDetectionRef.detectChanges();
            }
        });

        this.store.pipe(select(state => state.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = !!response.isBranchConsolidated;
                this.changeDetectionRef.detectChanges();
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (!activeCompany || this.activeCompany) {
                return;
            }
            this.activeCompany = activeCompany;

            this.store.pipe(select(state => state.settings.branches), takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.length) {
                    this.currentCompanyBranches = response.map(branch => ({
                        label: branch?.name,
                        value: branch?.uniqueName,
                        name: branch?.name,
                        parentBranch: branch?.parentBranch
                    }));
                    // this.currentCompanyBranches.unshift({
                    //     label: this.activeCompany?.name || '',
                    //     name: this.activeCompany?.name || '',
                    //     value: this.activeCompany?.uniqueName || '',
                    //     isCompany: true
                    // });
                    // Same as Manufacturing list: company mode only when org is Company and multi-branch.
                    this.isCompany = this.currentOrganizationType === OrganizationType.Company
                        && this.currentCompanyBranches.length > 2;

                    if (!this.currentBranch?.uniqueName) {
                        if (this.currentOrganizationType === OrganizationType.Branch) {
                            const currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                            this.currentBranch = cloneDeep(
                                response.find(branch => branch?.uniqueName === currentBranchUniqueName)
                            ) || this.currentBranch;
                            this.selectedBranchName = this.currentBranch?.name || '';
                            this.searchRequest.branchUniqueName = this.currentBranch?.uniqueName || '';
                        } else {
                            this.currentBranch = {
                                name: this.activeCompany?.name || '',
                                alias: this.activeCompany?.nameAlias || '',
                                uniqueName: this.activeCompany?.uniqueName || ''
                            };
                            this.handleBranchChange({
                                label: this.currentBranch.name,
                                value: this.currentBranch.uniqueName
                            });
                        }
                    }
                    this.changeDetectionRef.detectChanges();
                } else if (this.generalService.companyUniqueName) {
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({
                        from: '',
                        to: '',
                        hierarchyType: BranchHierarchyType.Flatten
                    }));
                }
            });
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
            { label: 'Dispatched', value: 'DISPATCHED' },
            { label: 'Partially Returned', value: 'PARTIALLY_RETURNED' },
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
        const request = this.buildListRequest();
        this.jobWorkService.list(request).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response) => {
                this.isReportLoading = false;
                if (response?.status === 'success') {
                    const body = (response.body || {}) as {
                        items?: unknown[];
                        totalItems?: number;
                        totalPages?: number;
                        page?: number;
                    };
                    this.dataSource = Array.isArray(body.items) ? body.items : [];
                    this.totalItems = body.totalItems ?? this.dataSource.length;
                    this.totalPages = body.totalPages ?? 1;
                    this.currentPage = body.page ?? this.searchRequest.page ?? 1;
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
        this.loadSummary(request);
    }

    /**
     * Loads totals cards with the same filters as the list request.
     *
     * @param {JobWorkListRequest} request
     * @memberof ListJobWorkComponent
     */
    private loadSummary(request: JobWorkListRequest): void {
        this.jobWorkService.summary(request).pipe(takeUntil(this.destroyed$)).subscribe({
            next: (response) => {
                if (response?.status === 'success') {
                    const body = response.body || {};
                    this.summary.totalCharges = body.totalCharges;
                    this.summary.goodsWithJobworker = body.goodsWithJobworker;
                    this.summary.overdueReturns = body.overdueReturns;
                } else {
                    this.toasterService.errorToast(response?.message);
                }
                this.changeDetectionRef.detectChanges();
            },
            error: () => {
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
            this.jobWorkNoInput.value ||
            this.jobworkerInput.value ||
            this.outputStockInput.value
        );
        return !!(this.dataSource?.length || hasColumnSearch);
    }

    /**
     * Opens Advance Filter dialog and seeds account/stock options.
     *
     * @memberof ListJobWorkComponent
     */
    public openAdvanceFilterDialog(): void {
        this.advanceOnlyOverdue = !!this.searchRequest.onlyOverdue;
        this.advanceOnlyItcClaimed = !!this.searchRequest.onlyItcClaimed;
        this.selectedWarehouseUniqueNames = [...(this.searchRequest.warehouseUniqueNames || [])];
        this.selectedAccountUniqueNames = [...(this.searchRequest.accountUniqueNames || [])];
        this.selectedStockUniqueNames = [...(this.searchRequest.stockUniqueNames || [])];
        this.searchAdvanceAccounts('', 1);
        this.searchAdvanceStocks('', 1);
        this.dialog.open(this.advanceFilterDialog, {
            panelClass: ['mat-dialog'],
            width: '480px',
            autoFocus: false
        });
    }

    /**
     * Applies Advance Filter selections to the list request.
     *
     * @memberof ListJobWorkComponent
     */
    public applyAdvanceFilter(): void {
        this.searchRequest.warehouseUniqueNames = [...(this.selectedWarehouseUniqueNames || [])];
        this.searchRequest.accountUniqueNames = [...(this.selectedAccountUniqueNames || [])];
        this.searchRequest.stockUniqueNames = [...(this.selectedStockUniqueNames || [])];
        this.searchRequest.onlyOverdue = this.advanceOnlyOverdue;
        this.searchRequest.onlyItcClaimed = this.advanceOnlyItcClaimed;
        this.searchRequest.page = 1;
        this.getReport();
    }

    /**
     * Clears list filters while keeping the selected branch.
     *
     * @memberof ListJobWorkComponent
     */
    public clearFilters(): void {
        this.searchRequest.status = '';
        this.searchRequest.jobWorkType = '';
        this.searchRequest.accountUniqueNames = [];
        this.searchRequest.warehouseUniqueNames = [];
        this.searchRequest.stockUniqueNames = [];
        this.searchRequest.q = '';
        this.searchRequest.onlyOverdue = false;
        this.searchRequest.onlyItcClaimed = false;
        this.searchRequest.page = 1;
        this.selectedStatusLabel = this.localeData.all;
        this.selectedTypeLabel = this.localeData.all;
        this.selectedWarehouseUniqueNames = [];
        this.selectedAccountUniqueNames = [];
        this.selectedStockUniqueNames = [];
        this.advanceAccountOptions = [];
        this.advanceStockOptions = [];
        this.advanceOnlyOverdue = false;
        this.advanceOnlyItcClaimed = false;
        this.jobWorkNoInput.patchValue(null, { emitEvent: false });
        this.jobworkerInput.patchValue(null, { emitEvent: false });
        this.outputStockInput.patchValue(null, { emitEvent: false });
        this.showJobWorkNoSearch = false;
        this.showJobworkerSearch = false;
        this.showOutputStockSearch = false;
        this.filtersRestoredActive = false;
        this.jobWorkListState.clear();
        // Keep the selected branch; do not reset the dropdown to company/options[0].
        this.getReport();
    }

    /**
     * Branch change callback (company/consolidated mode).
     *
     * @param {{ label?: string; value?: string }} selectedEntity
     * @memberof ListJobWorkComponent
     */
    public handleBranchChange(selectedEntity: { label?: string; value?: string }): void {
        this.currentBranch = {
            ...this.currentBranch,
            name: selectedEntity?.label || '',
            uniqueName: selectedEntity?.value || ''
        };
        this.selectedBranchName = selectedEntity?.label || '';
        this.searchRequest.branchUniqueName = selectedEntity?.value || '';
        this.searchRequest.warehouseUniqueNames = [];
        this.selectedWarehouseUniqueNames = [];
        this.searchRequest.page = 1;
        this.getReport();
    }

    /**
     * Opens a column search input (voucher-list pattern).
     *
     * @param {*} event
     * @param {string} fieldName
     * @memberof ListJobWorkComponent
     */
    public toggleSearch(event: any, fieldName: string): void {
        if (fieldName === 'jobWorkNo') {
            this.showJobWorkNoSearch = true;
        } else if (fieldName === 'jobworker') {
            this.showJobworkerSearch = true;
        } else if (fieldName === 'outputStock') {
            this.showOutputStockSearch = true;
        }
        event?.stopPropagation?.();
        this.changeDetectionRef.detectChanges();
    }

    public getSearchFieldText(title: string): string {
        return (this.localeData?.search_field || 'Search [FIELD]')?.replace('[FIELD]', title);
    }

    /**
     * Hides an empty column search when clicking outside it.
     *
     * @param {*} event
     * @param {*} element
     * @param {string} searchedFieldName
     * @memberof ListJobWorkComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === 'jobWorkNo') {
            if (this.jobWorkNoInput.value !== null && this.jobWorkNoInput.value !== '') {
                return;
            }
        } else if (searchedFieldName === 'jobworker') {
            if (this.jobworkerInput.value !== null && this.jobworkerInput.value !== '') {
                return;
            }
        } else if (searchedFieldName === 'outputStock') {
            if (this.outputStockInput.value !== null && this.outputStockInput.value !== '') {
                return;
            }
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

    /**
     * Searches jobworker accounts for Advance Filter (`account-search-v2`).
     *
     * @param {string} query
     * @param {number} [page=1]
     * @memberof ListJobWorkComponent
     */
    public searchAdvanceAccounts(query: string, page: number = 1): void {
        this.advanceAccountQuery = query || '';
        this.advanceAccountPage = page;
        this.searchService.searchAccountV2({
            q: encodeURIComponent(this.advanceAccountQuery),
            page,
            group: encodeURIComponent('sundrycreditors,sundrydebtors')
        }).pipe(takeUntil(this.destroyed$)).subscribe((data) => {
            if (!data?.body?.results) {
                return;
            }
            const results = data.body.results.map((result: { uniqueName: string; name: string }) => ({
                value: result.uniqueName,
                label: `${result.name} (${result.uniqueName})`
            }));
            this.advanceAccountOptions = page === 1
                ? results
                : [...this.advanceAccountOptions, ...results];
            this.advanceAccountTotalPages = data.body.totalPages || 1;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Loads next jobworker page for Advance Filter.
     *
     * @memberof ListJobWorkComponent
     */
    public advanceAccountScrollEnd(): void {
        if (this.advanceAccountPage < this.advanceAccountTotalPages) {
            this.searchAdvanceAccounts(this.advanceAccountQuery, this.advanceAccountPage + 1);
        }
    }

    /**
     * Searches stocks for Advance Filter (`stocks/v2`).
     *
     * @param {string} query
     * @param {number} [page=1]
     * @memberof ListJobWorkComponent
     */
    public searchAdvanceStocks(query: string, page: number = 1): void {
        this.advanceStockQuery = query || '';
        this.advanceStockPage = page;
        this.inventoryService.getStocksV2({
            inventoryType: '',
            page,
            q: this.advanceStockQuery
        }).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status !== 'success' || !response.body?.results) {
                return;
            }
            const results = response.body.results.map((stock: { uniqueName?: string; name?: string }) => ({
                value: stock.uniqueName || '',
                label: stock.name || stock.uniqueName || ''
            })).filter((option: IOption) => !!option.value);
            this.advanceStockOptions = page === 1
                ? results
                : [...this.advanceStockOptions, ...results];
            this.advanceStockTotalPages = response.body.totalPages || 1;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Loads next stock page for Advance Filter.
     *
     * @memberof ListJobWorkComponent
     */
    public advanceStockScrollEnd(): void {
        if (this.advanceStockPage < this.advanceStockTotalPages) {
            this.searchAdvanceStocks(this.advanceStockQuery, this.advanceStockPage + 1);
        }
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

    /**
     * Opens Record Return Received action dialog.
     *
     * @param {*} row
     * @memberof ListJobWorkComponent
     */
    public recordReturn(row: any): void {
        this.openActionDialog('RETURN', row);
    }

    /**
     * Loads and shows View Linked Challan dialog.
     *
     * @param {*} row
     * @memberof ListJobWorkComponent
     */
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
     * Returns batches for a linked-challan line.
     *
     * @param {LinkedChallanDocumentItem} item
     * @returns {VoucherSelectedBatch[]}
     * @memberof ListJobWorkComponent
     */
    public getChallanItemBatches(item: LinkedChallanDocumentItem): VoucherSelectedBatch[] {
        if (Array.isArray(item?.batches) && item.batches.length) {
            return item.batches as VoucherSelectedBatch[];
        }
        if (item?.batch?.uniqueName || item?.batch?.name) {
            return [{
                uniqueName: item.batch.uniqueName || '',
                name: item.batch.name || '',
                quantity: Number(item.quantity) || 0
            } as VoucherSelectedBatch];
        }
        return [];
    }

    /**
     * Returns unit code/name for a linked-challan line.
     *
     * @param {LinkedChallanDocumentItem} item
     * @returns {string}
     * @memberof ListJobWorkComponent
     */
    public getChallanItemUnit(item: LinkedChallanDocumentItem): string {
        return item?.stockUnit?.code || item?.stockUnit?.name || '';
    }

    /**
     * Opens batch select for a linked-challan line using fixed document batches.
     *
     * @param {JobWorkLinkedChallan} challan
     * @param {LinkedChallanDocumentItem} item
     * @param {Event} [event]
     * @memberof ListJobWorkComponent
     */
    public openLinkedChallanBatchDialog(
        challan: JobWorkLinkedChallan,
        item: LinkedChallanDocumentItem,
        event?: Event
    ): void {
        event?.preventDefault();
        event?.stopPropagation();
        const preBatches = this.toFixedChallanBatches(this.getChallanItemBatches(item));
        if (!this.batchTrackingEnabled || !item?.stock?.uniqueName || !preBatches.length) {
            return;
        }
        this.dialog.open(BatchSelectDialogComponent, {
            ...ASIDE_PANE_CONFIG,
            data: {
                stockName: item.stock?.name || item.stock?.uniqueName,
                stockUniqueName: item.stock?.uniqueName,
                variantUniqueName: item.variant?.uniqueName || '',
                variantName: item.variant?.name || '',
                hasVariants: !!item.variant?.uniqueName,
                inventoryType: item.stock?.inventoryType || 'PRODUCT',
                warehouseName: challan.warehouse?.name || '',
                warehouseUniqueName: challan.warehouse?.uniqueName || '',
                unitCode: this.getChallanItemUnit(item),
                lineQuantity: Number(item.quantity) || 0,
                selectedBatches: cloneDeep(preBatches),
                fixedBatches: cloneDeep(preBatches),
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData,
                isInbound: true
            }
        }).afterClosed().pipe(take(1), takeUntil(this.destroyed$)).subscribe((result?: BatchSelectDialogResult) => {
            if (!result) {
                return;
            }
            item.batches = (result.batches ?? []) as JobWorkBatch[];
            if (result.overrideLineQuantity) {
                item.quantity = result.allocatedQuantity;
            }
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Maps challan batches for fixedBatches dialog mode.
     *
     * @private
     * @param {VoucherSelectedBatch[]} batches
     * @returns {VoucherSelectedBatch[]}
     * @memberof ListJobWorkComponent
     */
    private toFixedChallanBatches(batches: VoucherSelectedBatch[]): VoucherSelectedBatch[] {
        return (batches || [])
            .filter(batch => !!batch?.uniqueName || !!batch?.name)
            .map(batch => {
                const quantity = Number(batch.quantity) || 0;
                return {
                    ...batch,
                    uniqueName: batch.uniqueName || '',
                    name: batch.name || batch.batchNumber || '',
                    batchNumber: batch.batchNumber || batch.name || '',
                    quantity,
                    availableQuantity: Number(batch.availableQuantity) || quantity
                };
            });
    }

    /**
     * Opens Mark Scrap / Wastage action dialog.
     *
     * @param {*} row
     * @memberof ListJobWorkComponent
     */
    public markScrap(row: any): void {
        this.openActionDialog('MARK_SCRAP', row);
    }

    /**
     * Opens Make Adjustment action dialog.
     *
     * @param {*} row
     * @memberof ListJobWorkComponent
     */
    public makeAdjustment(row: any): void {
        this.openActionDialog('ADJUST', row);
    }

    /**
     * Opens the action dialog for RETURN / MARK_SCRAP / ADJUST (no confirmation modal).
     *
     * @private
     * @param {JobWorkActionDialogMode} action
     * @param {*} row
     * @memberof ListJobWorkComponent
     */
    private openActionDialog(action: JobWorkActionDialogMode, row: any): void {
        const uniqueName = this.getRowUniqueName(row);
        if (!uniqueName) {
            return;
        }
        const dialogRef = this.dialog.open(JobWorkActionDialogComponent, {
            panelClass: ['job-work-action-dialog-panel'],
            autoFocus: false,
            disableClose: true,
            width: '860px',
            maxWidth: '95vw',
            data: {
                action,
                uniqueName,
                row,
                localeData: this.localeData,
                commonLocaleData: this.commonLocaleData
            }
        });
        dialogRef.afterClosed().pipe(takeUntil(this.destroyed$)).subscribe((success) => {
            if (success) {
                this.getReport();
            }
        });
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
        if (normalized === 'PARTIALLY_RETURNED' || normalized === 'PARTIALLY_RECEIVED') {
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

    /**
     * Binds column searches like voucher list: each feeds `q` and clears the others.
     *
     * @memberof ListJobWorkComponent
     */
    private bindColumnSearch(): void {
        this.jobWorkNoInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((search) => {
            if (search || search === '') {
                this.jobworkerInput.patchValue(null, { emitEvent: false });
                this.outputStockInput.patchValue(null, { emitEvent: false });
                this.showJobworkerSearch = false;
                this.showOutputStockSearch = false;
                this.searchRequest.q = search || '';
                this.searchRequest.page = 1;
                this.getReport();
                this.changeDetectionRef.detectChanges();
            }
        });

        this.jobworkerInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((search) => {
            if (search || search === '') {
                this.jobWorkNoInput.patchValue(null, { emitEvent: false });
                this.outputStockInput.patchValue(null, { emitEvent: false });
                this.showJobWorkNoSearch = false;
                this.showOutputStockSearch = false;
                this.searchRequest.q = search || '';
                this.searchRequest.page = 1;
                this.getReport();
                this.changeDetectionRef.detectChanges();
            }
        });

        this.outputStockInput.valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$)
        ).subscribe((search) => {
            if (search || search === '') {
                this.jobWorkNoInput.patchValue(null, { emitEvent: false });
                this.jobworkerInput.patchValue(null, { emitEvent: false });
                this.showJobWorkNoSearch = false;
                this.showJobworkerSearch = false;
                this.searchRequest.q = search || '';
                this.searchRequest.page = 1;
                this.getReport();
                this.changeDetectionRef.detectChanges();
            }
        });
    }

    private updateShowClearFilter(): void {
        this.showClearFilter = !!(
            this.searchRequest.status ||
            this.searchRequest.jobWorkType ||
            this.hasConcreteFilterValues(this.searchRequest.accountUniqueNames) ||
            this.hasConcreteFilterValues(this.searchRequest.warehouseUniqueNames) ||
            this.hasConcreteFilterValues(this.searchRequest.stockUniqueNames) ||
            this.searchRequest.q ||
            this.searchRequest.onlyOverdue ||
            this.searchRequest.onlyItcClaimed ||
            this.jobWorkNoInput.value ||
            this.jobworkerInput.value ||
            this.outputStockInput.value
        );
    }

    /**
     * Builds the list API payload. All-sentinel multi-select values become `[]`
     * and their field names are collected in `selectAllFields`.
     *
     * @returns {JobWorkListRequest}
     * @memberof ListJobWorkComponent
     */
    private buildListRequest(): JobWorkListRequest {
        return this.generalService.replaceSelectedAllOptions({
            ...this.searchRequest,
            warehouseUniqueNames: [...(this.searchRequest.warehouseUniqueNames || [])],
            accountUniqueNames: [...(this.searchRequest.accountUniqueNames || [])],
            stockUniqueNames: [...(this.searchRequest.stockUniqueNames || [])]
        }, true);
    }

    /**
     * Returns true when the multi-select has concrete values (not empty / not All).
     *
     * @param {string[] | undefined} values
     * @returns {boolean}
     * @memberof ListJobWorkComponent
     */
    private hasConcreteFilterValues(values: string[] | undefined): boolean {
        return !!values?.length && !isSelectedAllOption(values);
    }

    /**
     * Builds a snapshot of the current list filters for create/edit navigation.
     *
     * @returns {JobWorkListFilterSnapshot}
     * @memberof ListJobWorkComponent
     */
    private buildFilterSnapshot(): JobWorkListFilterSnapshot {
        return {
            searchRequest: {
                ...this.searchRequest,
                accountUniqueNames: [...(this.searchRequest.accountUniqueNames || [])],
                warehouseUniqueNames: [...(this.searchRequest.warehouseUniqueNames || [])],
                stockUniqueNames: [...(this.searchRequest.stockUniqueNames || [])]
            },
            selectedStatusLabel: this.selectedStatusLabel,
            selectedTypeLabel: this.selectedTypeLabel,
            selectedWarehouseUniqueNames: [...(this.selectedWarehouseUniqueNames || [])],
            selectedAccountUniqueNames: [...(this.selectedAccountUniqueNames || [])],
            selectedStockUniqueNames: [...(this.selectedStockUniqueNames || [])],
            selectedBranchName: this.selectedBranchName,
            selectedDateRangeUi: this.selectedDateRangeUi,
            selectedRangeLabel: this.selectedRangeLabel,
            columnSearch: {
                jobWorkNo: this.jobWorkNoInput.value || '',
                jobworker: this.jobworkerInput.value || '',
                outputStock: this.outputStockInput.value || ''
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

        this.searchRequest = {
            ...snapshot.searchRequest,
            accountUniqueNames: [...(snapshot.searchRequest.accountUniqueNames || [])],
            warehouseUniqueNames: [...(snapshot.searchRequest.warehouseUniqueNames || [])],
            stockUniqueNames: [...(snapshot.searchRequest.stockUniqueNames || [])]
        };
        this.selectedStatusLabel = snapshot.selectedStatusLabel;
        this.selectedTypeLabel = snapshot.selectedTypeLabel;
        this.selectedWarehouseUniqueNames = [...(snapshot.selectedWarehouseUniqueNames || [])];
        this.selectedAccountUniqueNames = [...(snapshot.selectedAccountUniqueNames || [])];
        this.selectedStockUniqueNames = [...(snapshot.selectedStockUniqueNames || [])];
        this.selectedBranchName = snapshot.selectedBranchName || '';
        if (snapshot.searchRequest.branchUniqueName) {
            this.currentBranch = {
                ...this.currentBranch,
                uniqueName: snapshot.searchRequest.branchUniqueName,
                name: snapshot.selectedBranchName || this.currentBranch?.name
            };
        }
        this.selectedDateRangeUi = snapshot.selectedDateRangeUi;
        this.selectedRangeLabel = snapshot.selectedRangeLabel;
        this.advanceOnlyOverdue = !!snapshot.searchRequest.onlyOverdue;
        this.advanceOnlyItcClaimed = !!snapshot.searchRequest.onlyItcClaimed;
        this.jobWorkNoInput.patchValue(snapshot.columnSearch.jobWorkNo || null, { emitEvent: false });
        this.jobworkerInput.patchValue(snapshot.columnSearch.jobworker || null, { emitEvent: false });
        this.outputStockInput.patchValue(snapshot.columnSearch.outputStock || null, { emitEvent: false });

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
