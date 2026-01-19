import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { AuditLogsSearchBase } from '../../base/audit-logs-search-base';
import { select, Store } from '@ngrx/store';
import * as dayjs from 'dayjs';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuditLogsActions } from '../../../actions/audit-logs/audit-logs.actions';
import { LogsRequest } from '../../../models/api-models/Logs';
import { CompanyService } from '../../../services/company.service';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { AppState } from '../../../store';
import { AuditLogsSidebarVM } from './Vm';
import { GroupService } from '../../../services/group.service';
import { SearchService } from '../../../services/search.service';
import { DROPDOWN_ITEMS_COUNT_LIMIT, IOption } from '../../../app.constant';
import { IForceClear } from '../../../models/api-models/Sales';
import { concat, flatten, map, omit, set, union } from '../../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'audit-logs-sidebar',
    templateUrl: './audit-logs.sidebar.component.html',
    styleUrls: ['audit-logs.sidebar.component.scss'],
    standalone: false
})
/**
 * AuditLogsSidebarComponent component
 * Handles auditlogssidebar functionality and user interactions
 */
export class AuditLogsSidebarComponent extends AuditLogsSearchBase implements OnInit, OnDestroy {
    @Input() public localeData: any = {};
    @Input() public commonLocaleData: any = {};
    public vm: AuditLogsSidebarVM;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public forceClearFilterBy$: Observable<IForceClear> = observableOf({ status: false });
    public forceClearEntity$: Observable<IForceClear> = observableOf({ status: false });
    public forceClearOperations$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear account sh-select options   */
    public forceClearAccount$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear group sh-select options   */
    public forceClearGroup$: Observable<IForceClear> = observableOf({ status: false });
    /** To clear user sh-select options   */
    public forceClearUser$: Observable<IForceClear> = observableOf({ status: false });

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private companyService: CompanyService,
        private auditLogsActions: AuditLogsActions,
        private groupService: GroupService,
        private searchService: SearchService
    ) {
        /**
         * Handles super functionality
         */
        super();
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.vm = new AuditLogsSidebarVM(this.localeData, this.commonLocaleData);
        this.vm.getLogsInprocess$ = this.store.pipe(select(p => p.auditlog.getLogInProcess), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            /**
             * Handles if functionality
             */
            if (activeCompany) {
                this.vm.selectedCompany = observableOf(activeCompany);
            }
        });

        this.vm.user$ = this.store.pipe(select(state => {
            /**
             * Handles if functionality
             */
            if (state.session.user) {
                return state.session.user.user;
            }
        }), takeUntil(this.destroyed$));

        this.companyService.getComapnyUsers().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            /**
             * Handles if functionality
             */
            if (data?.status === 'success') {
                let users: IOption[] = [];
                data.body?.map((d) => {
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

    /**
     * Handles flattenGroup functionality
     */
    public flattenGroup(rawList: any[], parents: any[] = []) {
        let listofUN;
        listofUN = map(rawList, (listItem) => {
            let newParents;
            let result;
            newParents = union([], parents);
            newParents.push({
                name: listItem.name,
                uniqueName: listItem?.uniqueName
            });
            listItem = Object.assign({}, listItem, { parentGroups: [] });
            listItem.parentGroups = newParents;
            /**
             * Handles if functionality
             */
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

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.resetFilters();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles selectAccount functionality
     */
    public selectAccount(v) {
        this.vm.selectedAccountUnq = v?.value || '';
    }

    /**
     * Handles clearDate functionality
     */
    public clearDate(model: string) {
        this.vm[model] = '';
    }

    /**
     * Sets today value
     */
    public setToday(model: string) {
        this.vm[model] = new Date();
    }

    /**
     * Handles selectGroup functionality
     */
    public selectGroup(v) {
        this.vm.selectedGroupUnq = v?.value || '';
    }

    /**
     * Handles selectUser functionality
     */
    public selectUser(v) {
        this.vm.selectedUserUnq = v?.value || '';
    }

    /**
     * Retrieves logfilters data
     */
    public getLogfilters() {
        let reqBody: LogsRequest = new LogsRequest();
        reqBody.operation = this.vm.selectedOperation === 'All' ? '' : this.vm.selectedOperation;
        reqBody.entity = this.vm.selectedEntity === 'All' ? '' : this.vm.selectedEntity;
        reqBody.userUniqueName = this.vm.selectedUserUnq;
        reqBody.accountUniqueName = this.vm.selectedAccountUnq;
        reqBody.groupUniqueName = this.vm.selectedGroupUnq;

        /**
         * Handles if functionality
         */
        if (this.vm.selectedDateOption === '0') {
            reqBody.fromDate = null;
            reqBody.toDate = null;
            /**
             * Handles if functionality
             */
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

    /**
     * Resets filters to default state
     */
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

        /**
         * Sets timeout value
         */
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

        /**
         * Sets timeout value
         */
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

        /**
         * Sets timeout value
         */
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

        /**
         * Sets timeout value
         */
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

        /**
         * Sets timeout value
         */
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

        /**
         * Sets timeout value
         */
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
        /**
         * Handles if functionality
         */
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
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
                    /**
                     * Handles if functionality
                     */
                    if (successCallback) {
                        /**
                         * Handles successCallback functionality
                         */
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
            /**
             * Sets timeout value
             */
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
        /**
         * Handles if functionality
         */
        if (this.accountsSearchResultsPaginationData.page < this.accountsSearchResultsPaginationData.totalPages) {
            this.onAccountSearchQueryChanged(
                this.accountsSearchResultsPaginationData.query,
                this.accountsSearchResultsPaginationData.page + 1,
                (response) => {
                    /**
                     * Handles if functionality
                     */
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
        /**
         * Handles if functionality
         */
        if (!this.preventDefaultGroupScrollApiCall &&
            (query || (this.defaultGroupSuggestions && this.defaultGroupSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                count: DROPDOWN_ITEMS_COUNT_LIMIT
            }
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
                    this.vm.groups$ = observableOf(this.searchedGroups);
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
     * @memberof AuditLogsSidebarComponent
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
