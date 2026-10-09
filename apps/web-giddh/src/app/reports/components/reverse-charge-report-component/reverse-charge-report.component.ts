import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, NgZone, ChangeDetectionStrategy } from '@angular/core';
import { Angular21ChangeDetectionService } from '../../../services/angular21-change-detection.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ReverseChargeReportGetRequest, ReverseChargeReportPostRequest } from '../../../models/api-models/ReverseCharge';
import { BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../../app.constant';
import { Observable, ReplaySubject } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { debounceTime, distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { ToasterService } from '../../../services/toaster.service';
import { ReverseChargeService } from '../../../services/reversecharge.service';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';
import { GeneralService } from '../../../services/general.service';
import { Router } from '@angular/router';
import { FormControl } from "@angular/forms";
import { cloneDeep, find, map, remove } from '../../../lodash-optimized';

@Component({
    selector: 'reverse-charge-report',
    templateUrl: './reverse-charge-report.component.html',
    styleUrls: ['./reverse-charge-report.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.Default
})

export class ReverseChargeReport implements OnInit, OnDestroy {
    /* This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
    public showEntryDate = true;
    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds page size options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    public reverseChargeReportGetRequest: ReverseChargeReportGetRequest = {
        from: '',
        to: '',
        sort: '',
        sortBy: '',
        page: 1,
        count: PAGINATION_LIMIT
    };
    public reverseChargeReportPostRequest: ReverseChargeReportPostRequest = {
        supplierName: '',
        invoiceNumber: '',
        supplierCountry: '',
        voucherType: ''
    };
    public isLoading: boolean = false;
    public reverseChargeReportResults: any = {};
    /** MatTableDataSource for proper Angular Material integration */
    public dataSource = new MatTableDataSource([]);
    /** Reference to MatTable for manual refresh */
    @ViewChild(MatTable) table: MatTable<any>;
    public timeout: any;
    public universalDate: any[] = [];
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Directive to get reference of datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected range label */
    public selectedRangeLabel: any = "";
/** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** True if today selected */
    public todaySelected: boolean = false;
    /** Holds display columns for mat table */
    public displayedColumns: string[] = [
        'index',
        'entryDate',
        'suppliersName',
        'voucherType',
        'invoiceNumber',
        'supplierInvoiceDate',
        'supplierCountry',
        'taxableValue',
        'taxRate',
        'taxAmount'
    ];
    /** True, if name search field is to be shown in the filters */
    public showNameSearch: boolean;
    /** Holds searched name form control */
    public searchedName: FormControl<string | null> = new FormControl<string | null>(null);
    /** True, if Invoice No search field is to be shown in the filters */
    public showInvoiceNoSearch: boolean;
    /** Holds searched Invoice No form control */
    public searchedInvoiceNo: FormControl<string | null> = new FormControl<string | null>(null);
    /** True, if Country search field is to be shown in the filters */
    public showCountrySearch: boolean;
    /** Holds searched Country form control */
    public searchedCountry: FormControl<string | null> = new FormControl<string | null>(null);
    /** Holds Id of active search input field */
    public activeSearchField: any = null;
    /** True if searching is in progress */
    public isSearching: boolean = false;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** TrackBy function for table performance optimization */
    public trackByFn = this.changeDetectionService.trackByFn;

    constructor(
        private store: Store<AppState>,
        private toasty: ToasterService,
        private cdRef: ChangeDetectorRef,
        private reverseChargeService: ReverseChargeService,
        private settingsBranchAction: SettingsBranchActions,
        private generalService: GeneralService,
        private router: Router,
        private ngZone: NgZone,
        private changeDetectionService: Angular21ChangeDetectionService
    ) {
    }

    /**
     * This function will initialize the component
     *
     * @memberof ReverseChargeReport
     */
    public ngOnInit(): void {
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(state => state.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                this.universalDate = cloneDeep(dateObj);

                setTimeout(() => {
                    this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                        this.todaySelected = response;
                        if (this.universalDate && !this.todaySelected) {
                            this.selectedDateRange = { startDate: dayjs(this.universalDate[0]), endDate: dayjs(this.universalDate[1]) };
                            this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);

                            this.reverseChargeReportGetRequest.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.reverseChargeReportGetRequest.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
                        } else {
                            this.universalDate = [];
                            this.reverseChargeReportGetRequest.from = "";
                            this.reverseChargeReportGetRequest.to = "";
                        }

                        this.getReverseChargeReport(false);
                    });
                }, 100);
            }
        });

        this.store.pipe(
            select(state => state.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.name,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch,
                    consolidatedBranch: branch?.consolidatedBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.name : '',
                    name: this.activeCompany ? this.activeCompany.name : '',
                    value: this.activeCompany ? this.activeCompany.uniqueName : '',
                    isCompany: true
                });
                let currentBranchUniqueName;
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                        };
                    }
                    this.reverseChargeReportGetRequest.branchUniqueName = this.currentBranch?.uniqueName;
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });

        this.searchedName.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search || search === '') {
                this.reverseChargeReportPostRequest.supplierName = search;
                this.isSearching = true;
                this.isSearchApplied();
                this.getReverseChargeReport(true);
                this.changeDetectionService.triggerChangeDetection(this.cdRef, this.ngZone);
            }
        });

        this.searchedInvoiceNo.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search || search === '') {
                this.reverseChargeReportPostRequest.invoiceNumber = search;
                this.isSearching = true;
                this.isSearchApplied();
                this.getReverseChargeReport(true);
                this.changeDetectionService.triggerChangeDetection(this.cdRef, this.ngZone);
            }
        });

        this.searchedCountry.valueChanges.pipe(debounceTime(700), distinctUntilChanged(), takeUntil(this.destroyed$)).subscribe(search => {
            if (search || search === '') {
                this.reverseChargeReportPostRequest.supplierCountry = search;
                this.isSearching = true;
                this.isSearchApplied();
                this.getReverseChargeReport(true);
                this.changeDetectionService.triggerChangeDetection(this.cdRef, this.ngZone);
            }
        });
    }

    /**
     * This function will destroy the subscribers
     *
     * @memberof ReverseChargeReport
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState = false;
    }

    /**
 * Handle page change
 *
 * @param {*} event
 * @memberof ReverseChargeReport
 */
    public pageChanged(event: any): void {
        if (event) {
            this.reverseChargeReportResults.results = [];
            this.reverseChargeReportGetRequest.page = event.pageIndex + 1;
            this.reverseChargeReportGetRequest.count = event.pageSize;
            this.getReverseChargeReport(false);
        }
    }



    /**
     * This function will get the data of vat detailed report
     *
     * @param {boolean} resetPage
     * @memberof ReverseChargeReport
     */
    public getReverseChargeReport(resetPage: boolean): void {
        if (this.activeCompany) {
            this.isLoading = true;

            if (resetPage) {
                this.reverseChargeReportGetRequest.page = 1;
            }

            this.reverseChargeReportResults = [];

            this.reverseChargeService.getReverseChargeReport(this.activeCompany.uniqueName, this.reverseChargeReportGetRequest, this.reverseChargeReportPostRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                if (res?.status === 'success') {
                    this.reverseChargeReportResults = res.body;
                    // Update MatTableDataSource for proper Angular Material integration
                    this.dataSource.data = res.body?.items || [];
                    if (this.todaySelected) {
                        this.selectedDateRange = { startDate: dayjs(this.reverseChargeReportResults?.from, GIDDH_DATE_FORMAT), endDate: dayjs(this.reverseChargeReportResults?.to, GIDDH_DATE_FORMAT) };
                        this.selectedDateRangeUi = dayjs(this.reverseChargeReportResults?.from, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.reverseChargeReportResults?.to, GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
                    }
                    this.changeDetectionService.updateDataSourceWithChangeDetection(
                        this.dataSource, this.reverseChargeReportResults?.items || [],
                        this.cdRef, this.ngZone, this.table
                    );
                } else {
                    this.toasty.errorToast(res.message);
                    this.changeDetectionService.safeChangeDetection(this.cdRef, this.ngZone);
                }
                this.isLoading = false;
            }, error => {
                this.isLoading = false;
                this.toasty.errorToast('Error loading reverse charge report');
                this.changeDetectionService.safeChangeDetection(this.cdRef, this.ngZone);
            });
        }
    }

    /**
     * This will initialize the search
     *
     * @memberof ReverseChargeReport
     */
    public columnSearch(): void {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
            this.getReverseChargeReport(true);
        }, 700);
    }

    /**
     * This will filter the report by voucher type
     *
     * @param {string} voucherType
     * @memberof ReverseChargeReport
     */
    public changeVoucherType(voucherType: string): void {
        this.reverseChargeReportPostRequest.voucherType = voucherType;
        this.getReverseChargeReport(true);
    }

    /**
     * This function is used to check if date filters are applied
     *
     * @returns {boolean}
     * @memberof ReverseChargeReport
     */
    public isDateFilterApplied(): boolean {
        if ((this.isSearchApplied() ||
            this.reverseChargeReportGetRequest.from && this.reverseChargeReportGetRequest.from !== dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT))
            || (this.reverseChargeReportGetRequest.to && this.reverseChargeReportGetRequest.to !== dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT))
        ) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * This function is used to check if date filters are applied
     *
     * @private
     * @return {*}  {boolean}
     * @memberof ReverseChargeReport
     */
    private isSearchApplied(): boolean {
        if (this.reverseChargeReportPostRequest.invoiceNumber || this.reverseChargeReportPostRequest.supplierCountry || this.reverseChargeReportPostRequest.supplierName || this.reverseChargeReportPostRequest.voucherType) {
            this.isSearching = true;
            return true;
        } else {
            this.isSearching = false;
            return false;
        }
    }

    /**
     * This function is used to reset filters
     *
     * @memberof ReverseChargeReport
     */
    public resetFilters(): void {
        this.reverseChargeReportPostRequest = {
            supplierName: '',
            invoiceNumber: '',
            supplierCountry: '',
            voucherType: ''
        };

        this.reverseChargeReportGetRequest.sort = "";
        this.reverseChargeReportGetRequest.sortBy = "";
        this.reverseChargeReportGetRequest.from = "";
        this.reverseChargeReportGetRequest.to = "";
        this.showNameSearch = false;
        this.showInvoiceNoSearch = false;
        this.showCountrySearch = false;
        this.searchedName.setValue(null);
        this.searchedInvoiceNo.setValue(null);
        this.searchedCountry.setValue(null);
        this.isSearching = false;
        if (!this.todaySelected) {
            this.selectedDateRange = { startDate: dayjs(this.universalDate[0]), endDate: dayjs(this.universalDate[1]) };
            this.selectedDateRangeUi = dayjs(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.reverseChargeReportGetRequest.from = dayjs(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
            this.reverseChargeReportGetRequest.to = dayjs(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        }
        this.getReverseChargeReport(true);
    }

    /**
     * This will toggle the datepicker
     *
     * @param {boolean} isOpen Set to true to open the datepicker, false to close it
     * @memberof ReverseChargeReport
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        if (this.universalDatepickerTrigger) {
            if (isOpen) {
                this.universalDatepickerTrigger.openMenu();
            } else {
                this.universalDatepickerTrigger.closeMenu();
            }
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value Selected date range object
     * @memberof ReverseChargeReport
     */
    public dateSelectedCallback(value?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.reverseChargeReportGetRequest.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.reverseChargeReportGetRequest.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.getReverseChargeReport(true);
        }
    }

    /**
     * Branch change handler
     *
     * @memberof ReverseChargeReport
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity?.label;
        this.reverseChargeReportGetRequest.branchUniqueName = selectedEntity?.value;
        this.getReverseChargeReport(true);
    }

    /**
     * Handles GST Sidebar Navigation
     *
     * @memberof ReverseChargeReport
     */
    public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }

    /**
     * Toogles the search field
     *
     * @param {string} fieldName Field name to toggle
     * @memberof ReverseChargeReport
     */
    public toggleSearch(fieldName: string): void {
        if (fieldName === "name") {
            this.showNameSearch = true;
        } else if (fieldName === "invoiceNo") {
            this.showInvoiceNoSearch = true;
        } else if (fieldName === "country") {
            this.showCountrySearch = true;
        }
    }

    /**
     * Click outside handler for Name field search
     *
     * @param {*} event Click outside event
     * @param {*} element Focused element
     * @param {string} searchedFieldName Name of the field through which search is to be performed
     * @return {*}  {void}
     * @memberof ReverseChargeReport
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        if (searchedFieldName === "name") {
            if (this.searchedName.value !== null && this.searchedName.value !== '') {
                return;
            }
        } else if (searchedFieldName === 'invoiceNo') {
            if (this.searchedInvoiceNo.value !== null && this.searchedInvoiceNo.value !== '') {
                return;
            }
        } else if (searchedFieldName === 'country') {
            if (this.searchedCountry.value !== null && this.searchedCountry.value !== '') {
                return;
            }
        }

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            if (searchedFieldName === "name") {
                this.showNameSearch = false;
            } else if (searchedFieldName === 'invoiceNo') {
                this.showInvoiceNoSearch = false;
            } else if (searchedFieldName === 'country') {
                this.showCountrySearch = false;
            }
        }
    }

    /**
     *  Handle Mat table sort event
     *
     * @param {*} event
     * @memberof ReverseChargeReport
     */
    public sortChange(event: any): void {
        if (event) {
            this.reverseChargeReportGetRequest.sort = event.direction ? event.direction : 'asc';
            this.reverseChargeReportGetRequest.sortBy = event.active;
            this.getReverseChargeReport(true);
        }
    }
}
