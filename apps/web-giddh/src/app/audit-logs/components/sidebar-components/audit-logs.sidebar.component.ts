import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { map as lodashMap } from '../../../lodash-optimized';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { flatten, omit, union } from '../../../lodash-optimized';
import { LogsRequest } from '../../../models/api-models/Logs';
import { CompanyService } from '../../../services/companyService.service';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../store';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { AuditLogsSidebarVM } from './Vm';
import { GroupService } from '../../../services/group.service';
import { SearchService } from '../../../services/search.service';
import { API_COUNT_LIMIT } from '../../../app.constant';
import { IForceClear } from '../../../models/api-models/Sales';

@Component({
    selector: 'audit-logs-sidebar',
    templateUrl: './audit-logs.sidebar.component.html',
    styleUrls: ['audit-logs.sidebar.component.scss']
})
export class AuditLogsSidebarComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    @Input() public localeData: any = {};
    /** This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public vm: AuditLogsSidebarVM;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
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
    /** To clear filter by sh-select options   */
    public forceClearFilterBy$: Observable<IForceClear> = observableOf({ status: false });
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

    constructor(
        private store: Store<AppState>,
        private companyService: CompanyService,
        private auditLogsActions: AuditLogsActions,
        private groupService: GroupService,
        private searchService: SearchService
    ) {

    }

    public ngOnInit() {
        this.vm = new AuditLogsSidebarVM(this.localeData, this.commonLocaleData);
        this.vm.getLogsInprocess$ = this.store.pipe(select(p => p.auditlog.getLogInProcess), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.vm.selectedCompany = observableOf(activeCompany);
            }
        });

        this.vm.user$ = this.store.pipe(select(state => {
            if (state.session.user) {
                return state.session.user.user;
            }
        }), takeUntil(this.destroyed$));

        this.companyService.getComapnyUsers().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data?.status === 'success') {
                let users: IOption[] = [];
                data.body.map((d) => {
                    users.push({ label: d.userName, value: d.userUniqueName, additional: d });
                });
                this.vm.canManageCompany = true;
                this.vm.users$ = observableOf(users);
            } else {
                this.vm.canManageCompany = false;
            }
        });

        this.resetFilters();
        this.loadDefaultAccountsSuggestions();
        this.loadDefaultGroupsSuggestions();
    }

    public flattenGroup(rawList: any[], parents: any[] = []) {
        let listofUN;
        listofUN = lodashMap(rawList, (listItem) => {
            let newParents;
            let result;
            newParents = union([], parents);
            newParents.push({
                name: listItem.name,
                uniqueName: listItem?.uniqueName
            });
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            listItem.parentGroups = newParents;
            if (listItem.groups?.length > 0) {
                result = this.flattenGroup(listItem.groups, newParents);
                result.push(omit(listItem, 'groups'));
            } else {
                result = omit(listItem, 'groups');
            }
            return result;
        });
        return flatten(listofUN);
    }

    public ngOnDestroy() {
        this.resetFilters();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public selectAccount(v) {
        this.vm.selectedAccountUnq = v.value || '';
    }

    public clearDate(model: string) {
        this.vm[model] = '';
    }

    public setToday(model: string) {
        this.vm[model] = new Date();
    }

    public selectGroup(v) {
        this.vm.selectedGroupUnq = v.value || '';
    }

    public selectUser(v) {
        this.vm.selectedUserUnq = v.value || '';
    }

    public getLogfilters() {
        let reqBody: LogsRequest = new LogsRequest();
        reqBody.operation = this.vm.selectedOperation === 'All' ? '' : this.vm.selectedOperation;
        reqBody.entity = this.vm.selectedEntity === 'All' ? '' : this.vm.selectedEntity;
        reqBody.userUniqueName = this.vm.selectedUserUnq;
        reqBody.accountUniqueName = this.vm.selectedAccountUnq;
        reqBody.groupUniqueName = this.vm.selectedGroupUnq;

        if (this.vm.selectedDateOption === '0') {
            reqBody.fromDate = null;
            reqBody.toDate = null;
            if (this.vm.logOrEntry === 'logDate') {
                reqBody.logDate = this.vm.selectedLogDate ? dayjs(this.vm.selectedLogDate).format(GIDDH_DATE_FORMAT) : '';
                reqBody.entryDate = null;
            } else if (this.vm.logOrEntry === 'entryDate') {
                reqBody.entryDate = this.vm.selectedLogDate ? dayjs(this.vm.selectedLogDate).format(GIDDH_DATE_FORMAT) : '';
                reqBody.logDate = null;
            }
        } else {
            reqBody.logDate = null;
            reqBody.entryDate = null;
            reqBody.fromDate = this.vm.selectedFromDate ? dayjs(this.vm.selectedFromDate).format(GIDDH_DATE_FORMAT) : '';
            reqBody.toDate = this.vm.selectedToDate ? dayjs(this.vm.selectedToDate).format(GIDDH_DATE_FORMAT) : '';
        }
        this.store.dispatch(this.auditLogsActions.GetLogs(reqBody, 1));
    }

    public customUserFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase()?.indexOf(term) > -1 || item.value.toLocaleLowerCase()?.indexOf(term) > -1 ||
            (item.additional && item.additional.userEmail && item.additional.userEmail.toLocaleLowerCase()?.indexOf(term) > -1));
    }

    public resetFilters() {
        this.vm.reset();
        this.resetFilterBy();
        this.resetEntity();
        this.resetGroup();
        this.resetAccount();
        this.resetUser();
        this.resetOperation();
        this.store.dispatch(this.auditLogsActions.ResetLogs());
    }

    /**
     * Resets filter by
     *
     * @memberof AuditLogsSidebarComponent
     */
    public resetFilterBy(): void {
        this.forceClearFilterBy$ = observableOf({ status: true });

        setTimeout(() => {
            this.forceClearFilterBy$ = observableOf({ status: false });
            this.vm.selectedDateOption = "0";
        }, 100);
    }

    /**
     * Resets entity
     *
     * @memberof AuditLogsSidebarComponent
     */
    public resetEntity(): void {
        this.forceClearEntity$ = observableOf({ status: true });
        this.vm.selectedEntity = "";

        setTimeout(() => {
            this.forceClearEntity$ = observableOf({ status: false });
        }, 500);
    }

    /**
     * Resets group
     *
     * @memberof AuditLogsSidebarComponent
     */
    public resetGroup(): void {
        this.forceClearGroup$ = observableOf({ status: true });
        this.vm.selectedGroupUnq = "";

        setTimeout(() => {
            this.forceClearGroup$ = observableOf({ status: false });
        }, 500);
    }

    /**
     * Resets account
     *
     * @memberof AuditLogsSidebarComponent
     */
    public resetAccount(): void {
        this.forceClearAccount$ = observableOf({ status: true });
        this.vm.selectedAccountUnq = "";

        setTimeout(() => {
            this.forceClearAccount$ = observableOf({ status: false });
        }, 500);
    }

    /**
     * Resets user
     *
     * @memberof AuditLogsSidebarComponent
     */
    public resetUser(): void {
        this.forceClearUser$ = observableOf({ status: true });
        this.vm.selectedUserUnq = "";

        setTimeout(() => {
            this.forceClearUser$ = observableOf({ status: false });
        }, 500);
    }

    /**
     * Resets operation
     *
     * @memberof AuditLogsSidebarComponent
     */
    public resetOperation(): void {
        this.forceClearOperations$ = observableOf({ status: true });
        this.vm.selectedOperation = "";

        setTimeout(() => {
            this.forceClearOperations$ = observableOf({ status: false });
        }, 500);
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AuditLogsSidebarComponent
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
                    this.vm.accounts$ = observableOf(this.accounts);
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
     * @memberof AuditLogsSidebarComponent
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
     * @memberof AuditLogsSidebarComponent
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
                    this.vm.groups$ = observableOf(this.searchedGroups);
                    this.groupsSearchResultsPaginationData.page = data.body.page;
                    this.groupsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
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
            setTimeout(() => {
                this.preventDefaultGroupScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler for group dropdown
     *
     * @returns null
     * @memberof AuditLogsSidebarComponent
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
     * @memberof AuditLogsSidebarComponent
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
     * @memberof AuditLogsSidebarComponent
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
