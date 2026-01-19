import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { AdjustInventoryListComponentStore } from './utility/adjust-inventory-list.store';
import { ReplaySubject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AdjustInventoryListResponse, InventorytAdjustReportQueryRequest } from '../../../models/api-models/Inventory';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ConfirmationModalConfiguration } from '../../../theme/confirmation-modal/confirmation-modal.interface';
import { MatDialog } from '@angular/material/dialog';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';
import { OrganizationType } from '../../../models/user-login-state';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { MatMenuTrigger } from '@angular/material/menu';
import { cloneDeep, find, map, set } from '../../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'adjust-inventory-list',

    templateUrl: './adjust-inventory-list.component.html',
    standalone: false,
    styleUrls: ['./adjust-inventory-list.component.scss'],
    providers: [AdjustInventoryListComponentStore]
})

/**
 * AdjustInventoryListComponent component
 * Handles adjustinventorylist functionality and user interactions
 */
export class AdjustInventoryListComponent implements OnInit, OnDestroy {
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { static: false }) public universalDatepickerTrigger: MatMenuTrigger;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for table display columns */
    public displayedColumns: string[] = ['date', 'referenceNo', 'name', 'reason', 'status', 'adjustedBy', 'adjustmentMethod', 'type'];
    /** Hold the data of inventory list */
    public dataSource: any;
    /** True if translations loaded */
    public translationLoaded: boolean = false;
    /** Holds Store adjust inventory list observable*/
    public adjustInventoryList$ = this.componentStore.select(state => state.adjustInventoryList);
    /** Holds Store adjust inventory list in progress API success state as observable*/
    public adjustInventoryInProgress$ = this.componentStore.select(state => state.adjustInventoryListInProgress);
    /* This will hold list of inventory adjust list*/
    public adjustInventoryList: AdjustInventoryListResponse[] = [];
    /* dayjs object */
    public dayjs: any = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /** This will use for subscription pagination logs object */
    public adjustInventoryListRequest: InventorytAdjustReportQueryRequest;
    /** Hold table page index number */
    public pageIndex: number = 0;
    /** Holds page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /* Hold list searching value */
    public inlineSearch: any = '';
    /** Form Group for Adjust Inventory form */
    public adjustInventoryListForm: FormGroup;
    /** True, if custom date filter is selected or custom searching or sorting is performed */
    public showClearFilter: boolean = false;
    /* True if show Reason show */
    public showReason: boolean = false;
    /* True if show Reference No show */
    public showReferenceNo: boolean = false;
    /* True if show Adjusted by show */
    public showAdjustedBy: boolean = false;
    /* True if show type by show */
    public showType: boolean = false;
    /* True if show Adjustment method show */
    public showAdjustmentMethod: boolean = false;
    /* True if show Status by show */
    public showStatus: boolean = false;
    /* True if show Stock/Group Name show */
    public showName: boolean = false;
    /** Inventory adjust confirmation popup configuration */
    public inventoryAdjustConfirmationConfiguration: ConfirmationModalConfiguration;
    /* False if data is not found */
    public showData: boolean = true;
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** This will hold local JSON data */
    public activeCompany: any;
    /** Holds Inventory Type */
    public inventoryType: string;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private generalService: GeneralService,
        private changeDetection: ChangeDetectorRef,
        private readonly componentStore: AdjustInventoryListComponentStore,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private store: Store<AppState>,
        private settingsBranchAction: SettingsBranchActions
    ) {
        this.adjustInventoryListRequest = new InventorytAdjustReportQueryRequest();
        this.currentOrganizationType = this.generalService.currentOrganizationType;
    }

    /**
     *This hook wil be use for component initialization
     *
     * @memberof AdjustInventoryListComponent
     */
    public ngOnInit(): void {
        this.initForm();

        // Combine both route params and universal date observables to prevent duplicate API calls
        /**
         * Handles combineLatest functionality
         */
        combineLatest([this.route.params, this.componentStore.universalDate$]).pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(500),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$)
        ).subscribe(([params, dateObj]) => {
            // Skip initial emission with both null values
            /**
             * Handles if functionality
             */
            if (!params && !dateObj) {
                return;
            }

            // Handle route params change
            /**
             * Handles if functionality
             */
            if (params?.type) {
                this.inventoryType = params.type.toLowerCase();
            }

            // Handle universal date change
            /**
             * Handles if functionality
             */
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.adjustInventoryListRequest.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.adjustInventoryListRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
            this.getAllAdjustReports(false);
        });

        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });

        this.componentStore.organisationMode$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length > 1;
                /**
                 * Handles if functionality
                 */
                if (!this.isCompany) {
                    /**
                     * Handles if functionality
                     */
                    if (!this.displayedColumns.includes('action')) {
                        this.displayedColumns.push('action');
                    }
                }
            }
        });

        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        /** Get Adjust inventory List */
        this.adjustInventoryList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.adjustInventoryList = response?.body?.results;
                this.dataSource = new MatTableDataSource<any>(response?.body?.results);
                /**
                 * Handles if functionality
                 */
                if (this.dataSource?.filteredData?.length || this.adjustInventoryListForm?.controls['referenceNo']?.value ||
                    this.adjustInventoryListForm?.controls['name']?.value ||
                    this.adjustInventoryListForm?.controls['status']?.value ||
                    this.adjustInventoryListForm?.controls['reason']?.value ||
                    this.adjustInventoryListForm?.controls['adjustmentMethod']?.value
                    ||
                    this.adjustInventoryListForm?.controls['adjustedBy']?.value ||
                    this.adjustInventoryListForm?.controls['entity']?.value) {
                    this.showData = true;
                } else {
                    this.showData = false;
                }
                this.dataSource.paginator = this.paginator;
                this.adjustInventoryListRequest.totalItems = response?.body?.totalItems;
            } else {
                this.dataSource = new MatTableDataSource<any>([]);
                this.adjustInventoryList = [];
                this.showData = false;
                this.adjustInventoryListRequest.totalItems = 0;
            }
        });

        /** Delete adjust inventory success */
        this.componentStore.deleteAdjustInventoryIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.adjustInventoryListRequest.page = this.generalService.adjustPageIndex(this.adjustInventoryListRequest.totalItems, this.adjustInventoryListRequest.page, this.adjustInventoryListRequest.count);
                this.getAllAdjustReports(true);
            }
        });

        /** Get branch list  */
        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
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
                /**
                 * Handles if functionality
                 */
                if (!this.currentBranch?.uniqueName) {
                    // Assign the current branch only when it is not selected. This check is necessary as
                    // opening the branch switcher would reset the current selected branch as this subscription is run everytime
                    // branches are loaded
                    /**
                     * Handles if functionality
                     */
                    if (this.currentOrganizationType === OrganizationType.Branch) {
                        currentBranchUniqueName = this.generalService.currentBranchUniqueName;
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : ''
                        };
                    }
                }
            } else {
                /**
                 * Handles if functionality
                 */
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '', hierarchyType: BranchHierarchyType.Flatten }));
                }
            }
        });

        /** Control value changes */

        this.adjustInventoryListForm?.controls['referenceNo'].valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            /**
             * Handles if functionality
             */
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'refNo';
                this.getAllAdjustReports(true);
            }
            /**
             * Handles if functionality
             */
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showReferenceNo = false;
            }
        });

        this.adjustInventoryListForm?.controls['name'].valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            /**
             * Handles if functionality
             */
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'entityName';
                this.getAllAdjustReports(true);
            }
            /**
             * Handles if functionality
             */
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showName = false;
            }
        });

        this.adjustInventoryListForm?.controls['reason'].valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            /**
             * Handles if functionality
             */
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'reason';
                this.getAllAdjustReports(true);
            }
            /**
             * Handles if functionality
             */
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showReason = false;
            }
        });

        this.adjustInventoryListForm?.controls['status'].valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            /**
             * Handles if functionality
             */
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'requestStatus';
                this.getAllAdjustReports(true);
            }
            /**
             * Handles if functionality
             */
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showStatus = false;
            }
        });

        this.adjustInventoryListForm?.controls['adjustmentMethod'].valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            /**
             * Handles if functionality
             */
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'adjustmentMethod';
                this.getAllAdjustReports(true);
            }
            /**
             * Handles if functionality
             */
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showAdjustmentMethod = false;
            }
        });

        this.adjustInventoryListForm?.controls['adjustedBy'].valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            /**
             * Handles if functionality
             */
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'adjustedBy';
                this.getAllAdjustReports(true);
            }
            /**
             * Handles if functionality
             */
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showAdjustedBy = false;
            }
        });

        this.adjustInventoryListForm?.controls['entity'].valueChanges.pipe(
            /**
             * Handles debounceTime functionality
             */
            debounceTime(700),
            /**
             * Handles distinctUntilChanged functionality
             */
            distinctUntilChanged(),
            /**
             * Handles takeUntil functionality
             */
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            /**
             * Handles if functionality
             */
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'entity';
                this.getAllAdjustReports(true);
            }
            /**
             * Handles if functionality
             */
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showType = false;
            }
        });

    }

    /**
     * Clears the filters and resets the form in the AdjustInventoryListComponent.
     *
     * @memberof AdjustInventoryListComponent
     */
    public clearFilter(): void {
        this.showClearFilter = false;
        this.showName = false;
        this.showReason = false;
        this.showReferenceNo = false;
        this.showAdjustedBy = false;
        this.showType = false;
        this.showStatus = false;
        this.showAdjustmentMethod = false;
        this.adjustInventoryListRequest = new InventorytAdjustReportQueryRequest();
        this.adjustInventoryListForm.reset();
        this.inlineSearch = '';
        this.getAllAdjustReports(true);
    }

    /**
     * This will use for init adjust inventrory form
     *
     * @memberof AdjustInventoryListComponent
     */
    public initForm(): void {
        this.adjustInventoryListForm = this.formBuilder.group({
            referenceNo: null,
            name: null,
            reason: null,
            status: null,
            adjustmentMethod: null,
            adjustedBy: null,
            entity: null
        });
    }

    /**
     * This will be use for get all inventory adjust report
     *
     * @param {boolean} resetPage
     * @memberof AdjustInventoryListComponent
     */
    public getAllAdjustReports(resetPage: boolean): void {
        /**
         * Handles if functionality
         */
        if (resetPage) {
            this.adjustInventoryListRequest.page = 1;
        }
        this.adjustInventoryListRequest.inventoryType = this.inventoryType.toUpperCase();
        this.componentStore.getAllAdjustInventoryReport(this.adjustInventoryListRequest);
    }

    /**
    * This will be use for table sorting
    *
    * @param {*} event
    * @memberof AdjustInventoryListComponent
    */
    public sortChange(event: any): void {
        this.adjustInventoryListRequest.sort = event?.direction ? event?.direction : 'asc';
        this.adjustInventoryListRequest.sortBy = event?.active;
        this.adjustInventoryListRequest.page = 1;
        this.getAllAdjustReports(false);
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof AdjustInventoryListComponent
     */
    public dateSelectedCallback(value?: any): void {
        /**
         * Handles if functionality
         */
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        /**
         * Handles if functionality
         */
        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        /**
         * Handles if functionality
         */
        if (value && value.startDate && value.endDate) {
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.adjustInventoryListRequest.from = this.fromDate;
            this.adjustInventoryListRequest.to = this.toDate;
        }
        this.getAllAdjustReports(false);
        this.changeDetection.detectChanges();
    }


    /**
     * Toggles the datepicker menu
     *
     * @param {boolean} isOpen - Whether to open or close the datepicker
     * @memberof AdjustInventoryListComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        /**
         * Handles if functionality
         */
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * This method will be use for route to create adjust inventory
     *
     * @memberof AdjustInventoryListComponent
     */
    public addInventory(): void {
        this.router.navigate([`/pages/inventory/v2/${this.inventoryType}/adjust/create`]);
    }

    /**
    * Callback for translation response complete
    *
    * @param {*} event
    * @memberof AdjustInventoryListComponent
    */
    public translationComplete(event: any): void {
        /**
         * Handles if functionality
         */
        if (event) {
            this.translationLoaded = true;
            this.changeDetection.detectChanges();
        }
    }

    /**
    * Returns the search field text
    *
    * @param {*} title
    * @returns {string}
    * @memberof AdjustInventoryListComponent
    */
    public getSearchFieldText(title: any): string {
        let searchField = this.localeData?.search_field;
        searchField = searchField?.replace("[FIELD]", title);
        return searchField;
    }

    /**
     * Handle page change
     *
     * @param {*} event
     * @memberof AdjustInventoryListComponent
     */
    public handlePageChange(event: PageEvent): void {
        this.pageIndex = event.pageIndex;
        this.adjustInventoryListRequest.page = this.adjustInventoryListRequest.count !== event.pageSize ? 1 : event.pageIndex + 1;
        this.adjustInventoryListRequest.count = event.pageSize;
        this.getAllAdjustReports(false);
    }

    /**
     * Handles clicks outside the specified element for filtering in the AdjustInventoryListComponent.
     *
     * @param event - The event triggered by the click.
     * @param element - The element outside of which the click occurred.
     * @param searchedFieldName - The name of the field being searched for.
     * @memberof AdjustInventoryListComponent
     */
    public handleClickOutside(event: any, element: any, searchedFieldName: string): void {
        const formControlsMap: { [key: string]: string } = {
            'Stock Name': 'name',
            'Reason': 'reason',
            'Request Status': 'status',
            'Reference No': 'referenceNo',
            'Adjustment Method': 'adjustmentMethod',
            'Adjusted By': 'adjustedBy',
            'Type': 'entity'
        };

        const visibilityMap: { [key: string]: string } = {
            'Stock Name': 'showName',
            'Reason': 'showReason',
            'Request Status': 'showStatus',
            'Reference No': 'showReferenceNo',
            'Adjustment Method': 'showAdjustmentMethod',
            'Adjusted By': 'showAdjustedBy',
            'Type': 'showType'
        };

        const controlName = formControlsMap[searchedFieldName];
        /**
         * Handles if functionality
         */
        if (controlName) {
            const controlValue = this.adjustInventoryListForm?.controls[controlName].value;
            /**
             * Handles if functionality
             */
            if (controlValue !== null && controlValue !== '') {
                return;
            }
        }

        /**
         * Handles if functionality
         */
        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            const visibilityProp = visibilityMap[searchedFieldName];
            /**
             * Handles if functionality
             */
            if (visibilityProp) {
                this[visibilityProp] = false;
            }
        }
    }

    /**
     * This will be use for toggle search field
     *
     * @param {string} fieldName
     * @param {*} el
     * @memberof AdjustInventoryListComponent
     */
    public toggleSearch(fieldName: string): void {
        /**
         * Handles if functionality
         */
        if (fieldName === 'Reason') {
            this.showReason = true;
        }
        /**
         * Handles if functionality
         */
        if (fieldName === 'Reference No') {
            this.showReferenceNo = true;
        }
        /**
         * Handles if functionality
         */
        if (fieldName === 'Stock Name') {
            this.showName = true;
        }
        /**
         * Handles if functionality
         */
        if (fieldName === 'Request Status') {
            this.showStatus = true;
        }
        /**
         * Handles if functionality
         */
        if (fieldName === 'Adjustment Method') {
            this.showAdjustmentMethod = true;
        }
        /**
         * Handles if functionality
         */
        if (fieldName === 'Adjusted By') {
            this.showAdjustedBy = true;
        }
        /**
         * Handles if functionality
         */
        if (fieldName === 'Type') {
            this.showType = true;
        }
    }

    /**
     * This will be use for edit adjust inventory routing
     *
     * @param {*} item
     * @memberof AdjustInventoryListComponent
     */
    public editInventoryAdjust(item: any): void {
        this.router.navigate([`/pages/inventory/v2/${this.inventoryType}/adjust/${item?.refNo}`]);
    }

    /**
     * This will be use for show delete inventory adjust confirmation modal
     *
     * @param {*} item
     * @memberof AdjustInventoryListComponent
     */
    public showdeleteInventoryAdjustAdjust(item: any): void {
        this.inventoryAdjustConfirmationConfiguration = this.generalService.deleteInventoryAdjustAdjustConfiguration(this.localeData, this.commonLocaleData);

        let dialogRef = this.dialog.open(NewConfirmationModalComponent, {
                    width: '630px',
                    data: {
                configuration: this.inventoryAdjustConfirmationConfiguration
                }
        });

        dialogRef.afterClosed().subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response === this.commonLocaleData?.app_yes) {
                this.componentStore.deleteInventoryAdjust(item?.refNo);
            }
        });
    }

    /**
     * This will be use for handle branch change
     *
     * @param {*} selectedEntity
     * @memberof AdjustInventoryListComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        /**
         * Handles if functionality
         */
        if (selectedEntity?.value) {
            this.currentBranch.uniqueName = selectedEntity.value;
            this.currentBranch.name = selectedEntity.label;
            this.adjustInventoryListRequest.branchUniqueName = selectedEntity.value;
            this.getAllAdjustReports(true);
        }
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     *
     * @memberof AdjustInventoryListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
