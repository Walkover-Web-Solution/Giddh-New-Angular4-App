import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../store';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { TaxResponse } from '../../models/api-models/Company';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IOption } from '../../theme/ng-select/ng-select';
import { ToasterService } from '../../services/toaster.service';
import { IForceClear } from '../../models/api-models/Sales';
import { SettingsTriggersActions } from '../../actions/settings/triggers/settings.triggers.actions';
import { SearchService } from '../../services/search.service';
import { GroupService } from '../../services/group.service';
import { API_COUNT_LIMIT } from '../../app.constant';

const entityType = [
    { label: 'Group', value: 'group' },
    { label: 'Account', value: 'account' }
];

const actionType = [
    { label: 'Webhook', value: 'webhook' }
];

const filterType = [
    { label: 'Amount Greater Than', value: 'amountGreaterThan' },
    { label: 'Amount Less Than', value: 'amountSmallerThan' },
    { label: 'Amount Equals', value: 'amountEquals' },
    { label: 'Description Equals', value: 'descriptionEquals' },
    { label: 'Add', value: 'add' },
    { label: 'Update', value: 'update' },
    { label: 'Delete', value: 'delete' }
];

const scopeList = [
    // G0-1393--Invoive and Entry not implemented from API
    //{label: 'Invoice', value: 'invoice'},
    //{label: 'Entry', value: 'entry'},
    { label: 'Closing Balance', value: 'closing balance' }
];

const taxDuration = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Quarterly', value: 'QUARTERLY' },
    { label: 'Half-Yearly', value: 'HALFYEARLY' },
    { label: 'Yearly', value: 'YEARLY' }
];

@Component({
    selector: 'setting-trigger',
    templateUrl: './setting.trigger.component.html',
    styleUrls: [`./setting.trigger.component.scss`]
})

export class SettingTriggerComponent implements OnInit, OnDestroy {

    @ViewChild('triggerConfirmationModel', { static: true }) public triggerConfirmationModel: ModalDirective;

    public availableTriggers: any[] = [];
    public newTriggerObj: any = {};
    public moment = moment;
    public days: IOption[] = [];
    public records = []; // This array is just for generating dynamic ngModel
    public taxToEdit = []; // It is for edit toogle
    public showFromDatePicker: boolean = false;
    public showDatePickerInTable: boolean = false;
    public selectedTax: string;
    public confirmationMessage: string;
    public confirmationFor: string;
    public selectedTaxForDelete: string;
    public accounts: IOption[];
    public groups: IOption[];
    public triggerToEdit = []; // It is for edit toogle
    public entityList: IOption[] = entityType;
    public filterList: IOption[] = filterType;
    public actionList: IOption[] = actionType;
    public scopeList: IOption[] = scopeList;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public forceClearEntityList$: Observable<IForceClear> = observableOf({ status: false });
    public forceClearFilterList$: Observable<IForceClear> = observableOf({ status: false });
    public entityOptions$: Observable<IOption[]>;

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

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public isLoading: boolean = false;

    constructor(
        private groupService: GroupService,
        private store: Store<AppState>,
        private _settingsTriggersActions: SettingsTriggersActions,
        private searchService: SearchService,
        private _toaster: ToasterService
    ) {
        for (let i = 1; i <= 31; i++) {
            let day = i.toString();
            this.days.push({ label: day, value: day });
        }
        this.store.dispatch(this._settingsTriggersActions.GetTriggers());
    }

    public ngOnInit() {
        // default value assinged bcz currently there is only single option
        this.newTriggerObj.action = 'webhook';
        this.newTriggerObj.scope = 'closing balance';
        this.store.pipe(select(p => p.settings.triggers), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o) {
                this.forceClear$ = observableOf({ status: true });
                this.availableTriggers = _.cloneDeep(o);
            }
        });

        this.loadDefaultAccountsSuggestions();
        this.loadDefaultGroupsSuggestions();

        this.store.pipe(select(p => p.general.groupswithaccounts), takeUntil(this.destroyed$)).subscribe((groups) => {
            if (groups) {
                let groupsRes: IOption[] = [];
                groups.map(d => {
                    groupsRes.push({ label: `${d.name} - (${d.uniqueName})`, value: d.uniqueName });
                });
                this.groups = _.cloneDeep(groupsRes);
            }
        });

        this.store.pipe(select(state => state.settings.isGetAllTriggersInProcess), takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = response;
        });
    }

    public onSubmit(data) {
        let dataToSave = _.cloneDeep(data);
        dataToSave.action = 'webhook';
        if (!dataToSave.name) {
            this._toaster.errorToast('Please enter trigger name.', 'Validation');
            return;
        }
        if (!dataToSave.entity) {
            this._toaster.errorToast('Please select entity type.', 'Validation');
            return;
        }
        if (!dataToSave.entityUniqueName) {
            this._toaster.errorToast('Please select an entity.', 'Validation');
            return;
        }
        if (!dataToSave.scope) {
            this._toaster.errorToast('Please select a scope.', 'Validation');
            return;
        }
        if (!dataToSave.filter) {
            this._toaster.errorToast('Please select a filter.', 'Validation');
            return;
        }
        if (!dataToSave.action) {
            this._toaster.errorToast('Please select an action.', 'Validation');
            return;
        }
        if (!dataToSave.value && this.newTriggerObj.scope !== 'closing balance') {
            this._toaster.errorToast('Please enter value.', 'Validation');
            return;
        } else {
            delete dataToSave['value'];
        }
        if (!dataToSave.url) {
            this._toaster.errorToast('Please enter URL.', 'Validation');
            return;
        }
        this.store.dispatch(this._settingsTriggersActions.CreateTrigger(dataToSave));
    }

    public deleteTax(taxToDelete) {
        this.newTriggerObj = taxToDelete;
        this.selectedTax = this.availableTriggers.find((tax) => tax.uniqueName === taxToDelete.uniqueName).name;
        this.confirmationMessage = `Are you sure you want to delete ${this.selectedTax}?`;
        this.confirmationFor = 'delete';
        this.triggerConfirmationModel.show();
    }

    public updateTrigger(taxIndex: number) {
        let selectedTrigger = _.cloneDeep(this.availableTriggers[taxIndex]);
        this.newTriggerObj = selectedTrigger;
        this.confirmationMessage = `Are you sure want to update ${selectedTrigger.name}?`;
        this.confirmationFor = 'edit';
        this.triggerConfirmationModel.show();
    }

    public onCancel() {
        this.newTriggerObj = new TaxResponse();
    }

    public userConfirmation(userResponse: boolean) {
        this.triggerConfirmationModel.hide();
        if (userResponse) {
            if (this.confirmationFor === 'delete') {
                this.store.dispatch(this._settingsTriggersActions.DeleteTrigger(this.newTriggerObj.uniqueName));
            } else if (this.confirmationFor === 'edit') {
                _.each(this.newTriggerObj.taxDetail, (tax) => {
                    tax.date = moment(tax.date).format(GIDDH_DATE_FORMAT);
                });
                this.store.dispatch(this._settingsTriggersActions.UpdateTrigger(this.newTriggerObj));
            }
        }
    }

    public addMoreDateAndPercentage(taxIndex: number) {
        let taxes = _.cloneDeep(this.availableTriggers);
        taxes[taxIndex].taxDetail.push({ date: null, taxValue: null });
        this.availableTriggers = taxes;
    }

    public removeDateAndPercentage(parentIndex: number, childIndex: number) {
        let taxes = _.cloneDeep(this.availableTriggers);
        taxes[parentIndex].taxDetail.splice(childIndex, 1);
        this.availableTriggers = taxes;
    }

    public customAccountFilter(term: string, item: IOption) {
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1);
    }

    public customDateSorting(a: IOption, b: IOption) {
        return (parseInt(a.label) - parseInt(b.label));
    }

    public onEntityTypeSelected(ev) {
        this.forceClearEntityList$ = observableOf({ status: true });
        if (ev.value === 'account') {
            this.entityOptions$ = observableOf(this.accounts);
        } else if (ev.value === 'group') {
            this.entityOptions$ = observableOf(this.groups);
        }
    }

    public onResetEntityType() {
        this.newTriggerObj.entityType = '';
        this.forceClearEntityList$ = observableOf({ status: true });
    }

    /**
     * onSelectScope
     */
    public onSelectScope(event) {
        if (event.value === 'closing balance') {
            this.onSelectClosingBalance();
            if ((this.newTriggerObj.filter === 'amountGreaterThan') || (this.newTriggerObj.filter === 'amountSmallerThan')) {
                return;
            } else {
                this.forceClearFilterList$ = observableOf({ status: true });
            }
        } else {
            this.filterList = filterType;
        }
    }

    public onSelectClosingBalance() {
        this.filterList = [
            { label: 'Amount Greater Than', value: 'amountGreaterThan' },
            { label: 'Amount Less Than', value: 'amountSmallerThan' },
        ];
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof SettingTriggerComponent
     */
    public onAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.accountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultAccountSuggestions && this.defaultAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject = {
                q: encodeURIComponent(query),
                page
            }
            this.searchService.searchAccountV2(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: `${result.name} - (${result.uniqueName})`
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
                    this.entityOptions$ = observableOf(this.accounts);
                    this.accountsSearchResultsPaginationData.page = data.body.page;
                    this.accountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultAccountPaginationData.page = data.body.page;
                        this.defaultAccountPaginationData.totalPages = data.body.totalPages;
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
     * Search query change handler for group
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof AdvanceSearchModelComponent
     */
    public onGroupSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.groupsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultGroupScrollApiCall &&
            (query || (this.defaultGroupSuggestions && this.defaultGroupSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                count: API_COUNT_LIMIT,
                onlyTop: true
            }
            this.groupService.searchGroups(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: `${result.name} (${result.uniqueName})`
                        }
                    }) || [];
                    if (page === 1) {
                        this.groups = searchResults;
                    } else {
                        this.groups = [
                            ...this.groups,
                            ...searchResults
                        ];
                    }
                    this.entityOptions$ = observableOf(this.groups);
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
            this.groups = [...this.defaultGroupSuggestions];
            this.groupsSearchResultsPaginationData.page = this.defaultGroupPaginationData.page;
            this.groupsSearchResultsPaginationData.totalPages = this.defaultGroupPaginationData.totalPages;
            this.preventDefaultGroupScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultGroupScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Scroll end handler
     *
     * @returns null
     * @memberof SettingTriggerComponent
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
                                value: result.uniqueName,
                                label: `${result.name} - (${result.uniqueName})`
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
     * Scroll end handler for group dropdown
     *
     * @returns null
     * @memberof AdvanceSearchModelComponent
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
                                value: result.uniqueName,
                                label: `${result.name} - (${result.uniqueName})`
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
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof SettingTriggerComponent
     */
    private loadDefaultAccountsSuggestions(): void {
        this.onAccountSearchQueryChanged('', 1, (response) => {
            this.defaultAccountSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: `${result.name} - (${result.uniqueName})`
                }
            }) || [];
            this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
            this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
            this.accounts = [...this.defaultAccountSuggestions];
        });
    }

    /**
     * Loads the default group list for advance search
     *
     * @private
     * @memberof SettingTriggerComponent
     */
    private loadDefaultGroupsSuggestions(): void {
        this.onGroupSearchQueryChanged('', 1, (response) => {
            this.defaultGroupSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: `${result.name} - (${result.uniqueName})`
                }
            }) || [];
            this.defaultGroupPaginationData.page = this.groupsSearchResultsPaginationData.page;
            this.defaultGroupPaginationData.totalPages = this.groupsSearchResultsPaginationData.totalPages;
            this.groups = [...this.defaultGroupSuggestions];
        });
    }

    /**
     * Releases memory
     *
     * @memberof SettingTriggerComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
