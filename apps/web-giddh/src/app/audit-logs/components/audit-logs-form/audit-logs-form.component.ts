import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { API_COUNT_LIMIT } from '../../../app.constant';
import { cloneDeep, flatten, map, omit, union } from '../../../lodash-optimized';
import { GetAuditLogsRequest } from '../../../models/api-models/Logs';
import { IForceClear } from '../../../models/api-models/Sales';
import { CompanyService } from '../../../services/companyService.service';
import { GroupService } from '../../../services/group.service';
import { LogsService } from '../../../services/logs.service';
import { SearchService } from '../../../services/search.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { AuditLogsSidebarVM } from './Vm';

@Component({
    selector: 'audit-logs-form',
    templateUrl: './audit-logs-form.component.html',
    styleUrls: ['audit-logs-form.component.scss']
})
export class AuditLogsFormComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** Audit log form object */
    public auditLogFormVM: AuditLogsSidebarVM;
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /** dayjs object */
    public dayjs = dayjs;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** Active company details */
    public activeCompany: any;
    /** Audit log filter form data */
    public auditLogFilterForm: any[] = [];
    /** To clear entity sh-select options   */
    public forceClearEntity$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear operations sh-select options   */
    public forceClearOperations$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear account sh-select options   */
    public forceClearAccount$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear group sh-select options   */
    public forceClearGroup$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear user sh-select options   */
    public forceClearUser$: Observable<IForceClear> = observableOf({ status: false });
    /** Active company unique name */
    public activeCompanyUniqueName$: Observable<string>;
    /** Stores the search results pagination details */
    public accountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search */
    public defaultAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Stores the default search results pagination details */
    public defaultAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the list of accounts */
    public accounts: IOption[];
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
    /** To destroy observers */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** From date value of parent datepicker */
    @Input() public fromDate: string;
    /** To date value of parent datepicker */
    @Input() public toDate: string;
    /** Entity sh-selct refence */
    @ViewChild('selectEntity') public shSelectEntityReference: ShSelectComponent;

    constructor(private store: Store<AppState>,
        private companyService: CompanyService,
        private auditLogsActions: AuditLogsActions,
        private auditLogsService: LogsService,
        private groupService: GroupService,
        private searchService: SearchService
    ) {
        
    }

    /**
     * Component lifecycle hook
     *
     * @memberof AuditLogsFormComponent
     */
    public ngOnInit(): void {
        this.auditLogFormVM = new AuditLogsSidebarVM(this.localeData, this.commonLocaleData);
        this.auditLogFormVM.getLogsInprocess$ = this.store.pipe(select(state => state.auditlog.getLogInProcess), takeUntil(this.destroyed$));
        this.auditLogFormVM.user$ = this.store.pipe(select(state => { if (state.session.user) { return state.session.user.user; } }), take(1));
        this.companyService.getComapnyUsers().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let users: IOption[] = [];
                data.body.map((item) => {
                    users.push({ label: item.userName, value: item.userUniqueName, additional: item });
                });
                this.auditLogFormVM.canManageCompany = true;
                this.auditLogFormVM.users$ = observableOf(users);
            } else {
                this.auditLogFormVM.canManageCompany = false;
            }
        });

        // To get audit log form filter
        this.getFormFilter();
        this.auditLogFormVM.reset();
        this.loadDefaultAccountsSuggestions();
        this.loadDefaultGroupsSuggestions();
    }

    /**
     * To filter flatten groups
     *
     * @param {any[]} rawList Row list to filter
     * @param {any[]} [parents=[]] Parent list
     * @returns
     * @memberof AuditLogsFormComponent
     */
    public flattenGroup(rawList: any[], parents: any[] = []): any {
        let listOfFlattenGroup;
        listOfFlattenGroup = map(rawList, (listItem) => {
            let newParents;
            let result;
            newParents = union([], parents);
            newParents.push({
                name: listItem.name,
                uniqueName: listItem?.uniqueName
            });
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            listItem.parentGroups = newParents;
            if (listItem.groups.length > 0) {
                result = this.flattenGroup(listItem.groups, newParents);
                result.push(omit(listItem, 'groups'));
            } else {
                result = omit(listItem, 'groups');
            }
            return result;
        });
        return flatten(listOfFlattenGroup);
    }

    /**
     *Component lifecycle hook
     *
     * @memberof AuditLogsFormComponent
     */
    public ngOnDestroy(): void {
        this.auditLogFormVM.reset();
        this.store.dispatch(this.auditLogsActions.ResetLogs());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * API call to get filtered audit logs
     *
     * @memberof AuditLogsFormComponent
     */
    public getLogFilters(): void {
        let getAuditLogsRequest: GetAuditLogsRequest = new GetAuditLogsRequest();
        getAuditLogsRequest = cloneDeep(this.prepareAuditLogFormRequest());
        this.store.dispatch(this.auditLogsActions.getAuditLogs(getAuditLogsRequest));
    }

    /**
     * Generate  custom users filter
     *
     * @param {string} term term to filter with
     * @param {IOption} item term to filter for
     * @returns
     * @memberof AuditLogsFormComponent
     */
    public customUserFilter(term: string, item: IOption): any {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 ||
            (item.additional && item.additional.userEmail && item.additional.userEmail.toLocaleLowerCase().indexOf(term) > -1));
    }

    /**
     * To reset audit log form
     *
     * @memberof AuditLogsFormComponent
     */
    public resetFilters(): void {
        this.auditLogFormVM.reset();
        this.resetAuditLogForm();
        this.store.dispatch(this.auditLogsActions.ResetLogs());
    }


    /**
     * To get audit log form filter
     *
     * @memberof AuditLogsFormComponent
     */
    public getFormFilter(): void {
        this.auditLogsService.getAuditLogFormFilters().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                if (response.body) {
                    this.auditLogFilterForm = response.body;
                    this.auditLogFormVM.filters = [];
                    this.auditLogFormVM.entities = [];
                    this.auditLogFilterForm.forEach(element => {
                        this.auditLogFormVM.entities.push(element.entity);
                    });
                }
                this.focusOnEntity();
            }
        });
    }

    /**
     * To prepare operation dropdown data according to selected entity type
     *
     * @param {any} selectEntity  Selected entity type
     * @memberof AuditLogsFormComponent
     */
    public prepareOperationFormData(selectEntity: any): void {
        if (selectEntity?.filter) {
            this.getOperationsFilterData(selectEntity.filter);
        } else {
            this.auditLogFormVM.filters = [];
        }
    }


    /**
     * To get operations dropdown data according to select entity type
     *
     * @param {string} entityType Selected entity type
     * @memberof AuditLogsFormComponent
     */
    public getOperationsFilterData(entityType: string): any {
        this.auditLogFormVM.filters = [];
        if (entityType) {
            let selectedEntityObject = this.auditLogFilterForm?.filter(element => {
                if (element.entity.label.toLocaleLowerCase() === entityType.toLocaleLowerCase()) {
                    return element;
                }
            });
            if (selectedEntityObject && selectedEntityObject.length) {
                this.auditLogFormVM.filters = cloneDeep(selectedEntityObject[0].operations)
            }

        }
    }

    /**
     * To reset form values
     *
     * @memberof AuditLogsFormComponent
     */
    public resetAuditLogForm(): void {
        this.forceClearEntity$ = observableOf({ status: true });
        this.forceClearGroup$ = observableOf({ status: true });
        this.forceClearAccount$ = observableOf({ status: true });
        this.forceClearUser$ = observableOf({ status: true });
        this.forceClearOperations$ = observableOf({ status: true });
    }

    /**
     * To select entity type
     *
     * @param {IOption} event Selected item object
     * @memberof AuditLogsFormComponent
     */
    public selectedEntityType(event: IOption): void {
        if (event && event.value) {
            this.getOperationsFilterData(event.value);
        }
    }

    /**
     * To prepare get audit log request model
     *
     * @returns {GetAuditLogsRequest} Audit log request model
     * @memberof AuditLogsFormComponent
     */
    public prepareAuditLogFormRequest(): GetAuditLogsRequest {
        let getAuditLogsRequest: GetAuditLogsRequest = new GetAuditLogsRequest();
        getAuditLogsRequest.userUniqueNames = [];
        getAuditLogsRequest.accountUniqueNames = [];
        getAuditLogsRequest.groupUniqueNames = [];
        getAuditLogsRequest.entity = this.auditLogFormVM.selectedEntity;
        getAuditLogsRequest.operation = this.auditLogFormVM.selectedOperation;
        getAuditLogsRequest.fromDate = this.fromDate;
        getAuditLogsRequest.toDate = this.toDate;
        getAuditLogsRequest.userUniqueNames.push(this.auditLogFormVM.selectedUserUniqueName);
        getAuditLogsRequest.accountUniqueNames.push(this.auditLogFormVM.selectedAccountUniqueName);
        getAuditLogsRequest.groupUniqueNames.push(this.auditLogFormVM.selectedGroupUniqueName);
        return getAuditLogsRequest;
    }

    /**
     * To auto focus on entity dropdown
     *
     * @memberof AuditLogsFormComponent
     */
    public focusOnEntity(): void {
        if (this.shSelectEntityReference) {
            setTimeout(() => {
                if (this.shSelectEntityReference) {
                    this.shSelectEntityReference.show('');
                }
            }, 1000);
        }
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AuditLogsFormComponent
     */
    public onAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.accountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.accounts = searchResults;
                    } else {
                        this.accounts = [
                            ...this.accounts,
                            ...searchResults
                        ];
                    }
                    this.auditLogFormVM.accounts$ = observableOf(this.accounts);
                    this.accountsSearchResultsPaginationData.page = data.body.page;
                    this.accountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.accounts = [...this.defaultAccountSuggestions];
            this.accountsSearchResultsPaginationData.page = this.defaultAccountPaginationData.page;
            this.accountsSearchResultsPaginationData.totalPages = this.defaultAccountPaginationData.totalPages;
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler
     *
     * @returns null
     * @memberof AuditLogsFormComponent
     */
    public handleScrollEnd(): void {
        if (this.accountsSearchResultsPaginationData.page < this.accountsSearchResultsPaginationData.totalPages) {
            this.onAccountSearchQueryChanged(
                this.accountsSearchResultsPaginationData.query,
                this.accountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.accountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result?.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultAccountSuggestions = this.defaultAccountSuggestions.concat(...results);
                        this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
                        this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Search query change handler for group
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AuditLogsFormComponent
     */
    public onGroupSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.groupsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultGroupScrollApiCall &&
            (query || (this.defaultGroupSuggestions && this.defaultGroupSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                count: API_COUNT_LIMIT
            }
            this.groupService.searchGroups(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result?.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.searchedGroups = searchResults;
                    } else {
                        this.searchedGroups = [
                            ...this.searchedGroups,
                            ...searchResults
                        ];
                    }
                    this.auditLogFormVM.groups$ = observableOf(this.searchedGroups);
                    this.groupsSearchResultsPaginationData.page = data.body.page;
                    this.groupsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    }
                }
            });
        } else {
            this.searchedGroups = [...this.defaultGroupSuggestions];
            this.groupsSearchResultsPaginationData.page = this.defaultGroupPaginationData.page;
            this.groupsSearchResultsPaginationData.totalPages = this.defaultGroupPaginationData.totalPages;
            this.preventDefaultGroupScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultGroupScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for group dropdown
     *
     * @returns null
     * @memberof AuditLogsFormComponent
     */
    public handleGroupScrollEnd(): void {
        if (this.groupsSearchResultsPaginationData.page < this.groupsSearchResultsPaginationData.totalPages) {
            this.onGroupSearchQueryChanged(
                this.groupsSearchResultsPaginationData.query,
                this.groupsSearchResultsPaginationData.page + 1,
                (response) => {
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
     * @memberof AuditLogsFormComponent
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

    /**
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof AuditLogsFormComponent
     */
    private loadDefaultAccountsSuggestions(): void {
        this.onAccountSearchQueryChanged('', 1, (response) => {
            this.defaultAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
            this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
            this.accounts = [...this.defaultAccountSuggestions];
        });
    }
}
