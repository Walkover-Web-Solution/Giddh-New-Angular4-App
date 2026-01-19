import { takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { AppState } from '../../../store/roots';
import { Store, select } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import * as dayjs from 'dayjs';
import { SearchRequest } from '../../../models/api-models/Search';
import { SearchActions } from '../../../actions/search.actions';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { DROPDOWN_ITEMS_COUNT_LIMIT, BranchHierarchyType, GIDDH_DATE_RANGE_PICKER_RANGES, IOption } from '../../../app.constant';
import { GeneralService } from '../../../services/general.service';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OrganizationType } from '../../../models/user-login-state';
import { GroupService } from '../../../services/group.service';
import { cloneDeep, concat, find, map } from '../../../lodash-optimized';
import { DatepickerMethodsHelper } from '../../../shared/helpers/datepicker-methods.helper';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'search-sidebar',
    // tslint:disable-next-line:component-max-inline-declarations
    standalone: false,templateUrl: './search.sidebar.component.html',
    styleUrls: ['./search.sidebar.component.scss'],
})
/**
 * SearchSidebarComponent component
 * Handles searchsidebar functionality and user interactions
 */
export class SearchSidebarComponent implements OnInit, OnChanges, OnDestroy {

    @Input() public pageChangeEvent: any = null;
    @Input() public filterEventQuery: any = null;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};

    /** Emits the current selected branch */
    @Output() public currentBranchChanged: EventEmitter<string> = new EventEmitter();

    public showFromDatePicker: boolean;
    public showToDatePicker: boolean;
    public toDate: string;
    public fromDate: string;
    public dayjs = dayjs;
    public groupName: string;
    public groupUniqueName: string;
    public dataSource = [];
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private paginationPageNumber: number;
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Directive to get reference of datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger') public universalDatepickerTrigger: MatMenuTrigger;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* Universal date observer */
    public universalDate$: Observable<any>;
/** Stores the search results pagination details for group dropdown */
    public groupsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for group dropdown */
    public defaultGroupSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for group dropdown */
    public preventDefaultGroupScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for group dropdown */
    public defaultGroupPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the value of groups */
    public searchedGroups: IOption[];
    /** Stores the current organization type */
    public currentOrganizationType: OrganizationType;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;

    /**
     * TypeScript public modifiers
     */
    constructor(
        private store: Store<AppState>,
        public searchActions: SearchActions,
        private generalService: GeneralService,
        private groupService: GroupService,
        private settingsBranchAction: SettingsBranchActions
    ) { }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.currentOrganizationType = this.generalService.currentOrganizationType;
        this.fromDate = dayjs().add(-1, 'month').format(GIDDH_DATE_FORMAT);
        this.toDate = dayjs().format(GIDDH_DATE_FORMAT);
        this.loadDefaultGroupsSuggestions();

        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj) => {
            /**
             * Handles if functionality
             */
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);

                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
        this.store.pipe(
            /**
             * Handles select functionality
             */
            select(appState => appState.session.activeCompany), takeUntil(this.destroyed$)
        ).subscribe(activeCompany => {
            this.activeCompany = activeCompany;
        });
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
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
                        this.currentBranch = cloneDeep(response.find(branch => branch?.uniqueName === currentBranchUniqueName)) || this.currentBranch;
                    } else {
                        currentBranchUniqueName = this.activeCompany ? this.activeCompany.uniqueName : '';
                        this.currentBranch = {
                            name: this.activeCompany ? this.activeCompany.name : '',
                            alias: this.activeCompany ? this.activeCompany.nameAlias:'',
                            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
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
    }

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: any) {
        /**
         * Handles if functionality
         */
        if ('pageChangeEvent' in changes && changes['pageChangeEvent'].currentValue) {
            /**
             * Handles if functionality
             */
            if (changes['pageChangeEvent'].firstChange || (!changes['pageChangeEvent'].previousValue || changes['pageChangeEvent'].currentValue.page !== changes['pageChangeEvent'].previousValue.page)) {
                let page = changes.pageChangeEvent.currentValue.page;
                this.paginationPageNumber = page;
                /**
                 * Handles if functionality
                 */
                if (this.filterEventQuery) {
                    this.getClosingBalance(false, null, this.paginationPageNumber, this.filterEventQuery);
                } else {
                    this.getClosingBalance(false, null, page);
                }

            }
        }

        /**
         * Handles if functionality
         */
        if ('filterEventQuery' in changes && changes['filterEventQuery'].currentValue) {
            /**
             * Handles if functionality
             */
            if (changes['filterEventQuery'].firstChange || (!changes['filterEventQuery'].previousValue || changes['filterEventQuery'].currentValue !== changes['filterEventQuery'].previousValue)) {
                this.getClosingBalance(false, null, this.paginationPageNumber, changes['filterEventQuery'].currentValue);
            }
        }
    }

    /**
     * Retrieves closingbalance data
     */
    public getClosingBalance(isRefresh: boolean, event: any, page?: number, searchReqBody?: any) {
        let searchRequest: SearchRequest = {
            groupName: this.groupUniqueName,
            refresh: isRefresh,
            toDate: this.toDate,
            fromDate: this.fromDate,
            page: page ? page : 1,
            branchUniqueName: this.currentBranch?.uniqueName
        };
        this.store.dispatch(this.searchActions.GetStocksReport(searchRequest, searchReqBody));
        /**
         * Handles if functionality
         */
        if (event) {
            event.target.blur();
        }
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles selectgroup event
     */
    public onSelectGroup(group: IOption) {
        this.groupName = group.label;
        this.groupUniqueName = group?.value;
    }

    /**
     * Handles selectedDate functionality
     */
    public selectedDate(value: any) {
        this.fromDate = dayjs(value.picker.startDate).format(GIDDH_DATE_FORMAT);
        this.toDate = dayjs(value.picker.endDate).format(GIDDH_DATE_FORMAT);
    }

    /**
     * This will toggle the datepicker
     *
     * @param {boolean} isOpen Set to true to open the datepicker, false to close it
     * @memberof SearchSidebarComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean): void {
        /**
         * Handles if functionality
         */
        if (this.universalDatepickerTrigger) {
            /**
             * Handles if functionality
             */
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
     * @memberof SearchSidebarComponent
     */
    public dateSelectedCallback(value?: any): void {
        DatepickerMethodsHelper.dateSelectedCallback(value, this, this.universalDatepickerTrigger);
    }

    /**
     * Branch change handler
     *
     * @memberof SearchSidebarComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.currentBranchChanged.emit(selectedEntity?.value);
        this.loadDefaultGroupsSuggestions();
    }

    /**
     * Search query change handler for group
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof SearchSidebarComponent
     */
    public onGroupSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.groupsSearchResultsPaginationData.query = query;
        /**
         * Handles if functionality
         */
        if (!this.preventDefaultGroupScrollApiCall &&
            (query || (this.defaultGroupSuggestions && this.defaultGroupSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                count: DROPDOWN_ITEMS_COUNT_LIMIT,
                branchUniqueName: this.currentBranch?.uniqueName
            };
            this.groupService.searchGroups(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                /**
                 * Handles if functionality
                 */
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    /**
                     * Handles if functionality
                     */
                    if (page === 1) {
                        this.searchedGroups = searchResults;
                    } else {
                        this.searchedGroups = [
                            ...this.searchedGroups,
                            ...searchResults
                        ];
                    }
                    this.groupsSearchResultsPaginationData.page = data.body.page;
                    this.groupsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    /**
                     * Handles if functionality
                     */
                    if (successCallback) {
                        /**
                         * Handles successCallback functionality
                         */
                        successCallback(data.body.results);
                    } else {
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.searchedGroups = [...this.defaultGroupSuggestions];
            this.groupsSearchResultsPaginationData.page = this.defaultGroupPaginationData.page;
            this.groupsSearchResultsPaginationData.totalPages = this.defaultGroupPaginationData.totalPages;
            this.preventDefaultGroupScrollApiCall = true;
            /**
             * Sets timeout value
             */
            setTimeout(() => {
                this.preventDefaultGroupScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for group dropdown
     *
     * @returns null
     * @memberof SearchSidebarComponent
     */
    public handleGroupScrollEnd(): void {
        /**
         * Handles if functionality
         */
        if (this.groupsSearchResultsPaginationData.page < this.groupsSearchResultsPaginationData.totalPages) {
            this.onGroupSearchQueryChanged(
                this.groupsSearchResultsPaginationData.query,
                this.groupsSearchResultsPaginationData.page + 1,
                (response) => {
                    /**
                     * Handles if functionality
                     */
                    if (!this.groupsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultGroupSuggestions = this.defaultGroupSuggestions.concat(...results);
                        this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
                        this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Loads the default group list for advance search
     *
     * @private
     * @memberof SearchSidebarComponent
     */
    private loadDefaultGroupsSuggestions(): void {
        this.onGroupSearchQueryChanged('', 1, (response) => {
            this.defaultGroupSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
            this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
            this.searchedGroups = [...this.defaultGroupSuggestions];
        });
    }
}
