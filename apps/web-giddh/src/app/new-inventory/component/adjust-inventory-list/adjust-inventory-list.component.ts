import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { AdjustInventoryListComponentStore } from './utility/adjust-inventory-list.store';
import { debounceTime, distinctUntilChanged, ReplaySubject, take, takeUntil } from 'rxjs';
import { AdjustInventoryListResponse, InventorytAdjustReportQueryRequest } from '../../../models/api-models/Inventory';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationModalConfiguration } from '../../../theme/confirmation-modal/confirmation-modal.interface';
import { MatDialog } from '@angular/material/dialog';
import { NewConfirmationModalComponent } from '../../../theme/new-confirmation-modal/confirmation-modal.component';
import { OrganizationType } from '../../../models/user-login-state';
import { cloneDeep } from '../../../lodash-optimized';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';

@Component({
    selector: 'adjust-inventory-list',
    templateUrl: './adjust-inventory-list.component.html',
    styleUrls: ['./adjust-inventory-list.component.scss'],
    providers: [AdjustInventoryListComponentStore]
})

export class AdjustInventoryListComponent implements OnInit, OnDestroy {
    /** Holds Paginator Reference */
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    /** Holds Datepicker Reference */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for table display columns */
    public displayedColumns: string[] = ['DATE', 'referenceNo', 'name', 'reason', 'status', 'ADJUSTED_BY', 'adjustmentMethod', 'TYPE', 'action'];
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
    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs: any = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will use for subscription pagination logs object */
    public adjustInventoryListRequest: InventorytAdjustReportQueryRequest;
    /** Hold table page index number*/
    public pageIndex: number = 0;
    /** Holds page size options */
    public pageSizeOptions: any[] = [20,
        50,
        100];
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

    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService,
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
        this.getAllAdjustReports(true);

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.type) {
                this.inventoryType = params?.type.toLowerCase();
            }
        });

        /** Universal date */
        this.componentStore.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.adjustInventoryListRequest.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.adjustInventoryListRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getAllAdjustReports(false);
            }
        });

        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });

        /** Get Adjust inventory List */
        this.adjustInventoryList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.adjustInventoryList = response?.body?.results;
                this.dataSource = new MatTableDataSource<any>(response?.body?.results);
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
            if (response) {
                this.getAllAdjustReports(true);
            }
        });

        /** Get branch list  */
        this.componentStore.branchList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response.map(branch => ({
                    label: branch.alias,
                    value: branch?.uniqueName,
                    name: branch.name,
                    parentBranch: branch.parentBranch
                }));
                this.currentCompanyBranches.unshift({
                    label: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
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
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName));
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias || this.activeCompany.name : '',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : ''
                        };
                    }
                }
            } else {
                if (this.generalService.companyUniqueName) {
                    // Avoid API call if new user is onboarded
                    this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
                }
            }
        });

        /** Control value changes */

        this.adjustInventoryListForm?.controls['referenceNo'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'refNo';
                this.getAllAdjustReports(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showReferenceNo = false;
            }
        });

        this.adjustInventoryListForm?.controls['name'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'entityName';
                this.getAllAdjustReports(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showName = false;
            }
        });

        this.adjustInventoryListForm?.controls['reason'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'reason';
                this.getAllAdjustReports(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showReason = false;
            }
        });

        this.adjustInventoryListForm?.controls['status'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'requestStatus';
                this.getAllAdjustReports(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showStatus = false;
            }
        });

        this.adjustInventoryListForm?.controls['adjustmentMethod'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'adjustmentMethod';
                this.getAllAdjustReports(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showAdjustmentMethod = false;
            }
        });

        this.adjustInventoryListForm?.controls['adjustedBy'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'adjustedBy';
                this.getAllAdjustReports(true);
            }
            if (searchedText === null || searchedText === "") {
                this.showClearFilter = false;
                this.showAdjustedBy = false;
            }
        });

        this.adjustInventoryListForm?.controls['entity'].valueChanges.pipe(
            debounceTime(700),
            distinctUntilChanged(),
            takeUntil(this.destroyed$),
        ).subscribe(searchedText => {
            if (searchedText !== null && searchedText !== undefined) {
                this.showClearFilter = true;
                this.adjustInventoryListRequest.q = searchedText;
                this.adjustInventoryListRequest.searchBy = 'entity';
                this.getAllAdjustReports(true);
            }
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
        if (resetPage) {
            this.adjustInventoryListRequest.page = 1;
        }
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
     * This method will be use for show datepicker
     *
     * @param {*} element
     * @memberof AdjustInventoryListComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
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
    public handlePageChange(event: any): void {
        this.pageIndex = event.pageIndex;
        this.adjustInventoryListRequest.count = event.pageSize;
        this.adjustInventoryListRequest.page = event.pageIndex + 1;
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
        if (controlName) {
            const controlValue = this.adjustInventoryListForm?.controls[controlName].value;
            if (controlValue !== null && controlValue !== '') {
                return;
            }
        }

        if (this.generalService.childOf(event?.target, element)) {
            return;
        } else {
            const visibilityProp = visibilityMap[searchedFieldName];
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
        if (fieldName === 'Reason') {
            this.showReason = true;
        }
        if (fieldName === 'Reference No') {
            this.showReferenceNo = true;
        }
        if (fieldName === 'Stock Name') {
            this.showName = true;
        }
        if (fieldName === 'Request Status') {
            this.showStatus = true;
        }
        if (fieldName === 'Adjustment Method') {
            this.showAdjustmentMethod = true;
        }
        if (fieldName === 'Adjusted By') {
            this.showAdjustedBy = true;
        }
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

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response === 'Yes') {
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
