import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { Store, select } from '@ngrx/store';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AppState } from '../../store';
import * as moment from 'moment/moment';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { IOption } from '../../theme/ng-select/ng-select';
import { ToasterService } from '../../services/toaster.service';
import { IForceClear } from '../../models/api-models/Sales';
import { SettingsTriggersActions } from '../../actions/settings/triggers/settings.triggers.actions';
import { SearchService } from '../../services/search.service';
import { GroupService } from '../../services/group.service';
import { API_COUNT_LIMIT } from '../../app.constant';
import { cloneDeep, each } from '../../lodash-optimized';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'setting-trigger',
    templateUrl: './setting.trigger.component.html',
    styleUrls: [`./setting.trigger.component.scss`]
})

export class SettingTriggerComponent implements OnInit, OnDestroy {

    @ViewChild('triggerConfirmationModel', { static: true }) public triggerConfirmationModel: ModalDirective;
    /** Stores the form instance */
    @ViewChild('createTriggerForm', {static: true}) public createTriggerForm: NgForm;

    public availableTriggers: any[] = [];
    public newTriggerObj: any = {
        name: null,
        action: null,
        entity: null,
        entityUniqueName: null,
        filter: null,
        scope: null,
        url: null,
        description: null
    };
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
    public entityList: IOption[] = [];
    public filterList: IOption[] = [];
    public actionList: IOption[] = [];
    public scopeList: IOption[] = [];
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
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private groupService: GroupService,
        private store: Store<AppState>,
        private _settingsTriggersActions: SettingsTriggersActions,
        private searchService: SearchService,
        private _toaster: ToasterService
    ) {

    }

    public ngOnInit() {
        for (let i = 1; i <= 31; i++) {
            let day = i.toString();
            this.days.push({ label: day, value: day });
        }
        this.store.dispatch(this._settingsTriggersActions.GetTriggers());

        // default value assinged bcz currently there is only single option
        this.newTriggerObj.action = 'webhook';
        this.newTriggerObj.scope = 'closing balance';
        this.store.pipe(select(p => p.settings.triggers), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o) {
                this.availableTriggers = cloneDeep(o);
                if (this.newTriggerObj.entity) {
                    this.resetNewFormModel();
                    this.resetNewFormFields();
                }
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
                this.groups = cloneDeep(groupsRes);
            }
        });

        this.store.pipe(select(state => state.settings.isGetAllTriggersInProcess), takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = response;
        });
    }

    public onSubmit(data) {
        let dataToSave = cloneDeep(data);
        dataToSave.action = 'webhook';
        if (!dataToSave.name) {
            this._toaster.errorToast(this.localeData?.validations?.trigger_name, 'Validation');
            return;
        }
        if (!dataToSave.entity) {
            this._toaster.errorToast(this.localeData?.validations?.entity_type, 'Validation');
            return;
        }
        if (!dataToSave.entityUniqueName) {
            this._toaster.errorToast(this.localeData?.validations?.entity, 'Validation');
            return;
        }
        if (!dataToSave.scope) {
            this._toaster.errorToast(this.localeData?.validations?.scope, 'Validation');
            return;
        }
        if (!dataToSave.filter) {
            this._toaster.errorToast(this.localeData?.validations?.filter, 'Validation');
            return;
        }
        if (!dataToSave.action) {
            this._toaster.errorToast(this.localeData?.validations?.action, 'Validation');
            return;
        }
        if (!dataToSave.value && this.newTriggerObj.scope !== 'closing balance') {
            this._toaster.errorToast(this.localeData?.validations?.enter_value, 'Validation');
            return;
        } else {
            delete dataToSave['value'];
        }
        if (!dataToSave.url) {
            this._toaster.errorToast(this.localeData?.validations?.enter_url, 'Validation');
            return;
        }
        this.store.dispatch(this._settingsTriggersActions.CreateTrigger(dataToSave));
    }

    public deleteTax(taxToDelete) {
        this.newTriggerObj = taxToDelete;
        this.selectedTax = this.availableTriggers.find((tax) => tax.uniqueName === taxToDelete.uniqueName).name;
        let message = this.localeData?.delete_tax;
        message = message?.replace("[SELECTED_TAX]", this.selectedTax);
        this.confirmationMessage = message;
        this.confirmationFor = 'delete';
        this.triggerConfirmationModel.show();
    }

    public updateTrigger(taxIndex: number) {
        let selectedTrigger = cloneDeep(this.availableTriggers[taxIndex]);
        this.newTriggerObj = selectedTrigger;
        let message = this.localeData?.update_trigger;
        message = message?.replace("[TRIGGER_NAME]", selectedTrigger.name);
        this.confirmationMessage = message;
        this.confirmationFor = 'edit';
        this.triggerConfirmationModel.show();
    }

    public onCancel() {
        this.resetNewFormModel();
    }

    public userConfirmation(userResponse: boolean) {
        this.triggerConfirmationModel.hide();
        if (userResponse) {
            if (this.confirmationFor === 'delete') {
                this.store.dispatch(this._settingsTriggersActions.DeleteTrigger(this.newTriggerObj.uniqueName));
            } else if (this.confirmationFor === 'edit') {
                each(this.newTriggerObj.taxDetail, (tax) => {
                    tax.date = moment(tax.date).format(GIDDH_DATE_FORMAT);
                });
                this.store.dispatch(this._settingsTriggersActions.UpdateTrigger(this.newTriggerObj));
            }
        }
    }

    public onEntityTypeSelected(ev) {
        if (ev.value === 'account') {
            this.entityOptions$ = observableOf(this.accounts);
        } else if (ev.value === 'group') {
            this.entityOptions$ = observableOf(this.groups);
        }
        this.onResetEntityType();
    }

    public onResetEntityType() {
        this.newTriggerObj.entityUniqueName = null;
        this.forceClearEntityList$ = observableOf({ status: true });
    }

    /**
     * onSelectScope
     */
    public onSelectScope(event) {
        if (!event.value) {
            return;
        }
        if (event.value === 'closing balance') {
            this.onSelectClosingBalance();
            if ((this.newTriggerObj.filter === 'amountGreaterThan') || (this.newTriggerObj.filter === 'amountSmallerThan')) {
                return;
            } else {
                this.newTriggerObj.filter = null;
                this.forceClearFilterList$ = observableOf({ status: true });
            }
        } else {
            this.filterList = [
                { label: this.localeData?.filter_types?.amount_greater_than, value: 'amountGreaterThan' },
                { label: this.localeData?.filter_types?.amount_less_than, value: 'amountSmallerThan' },
                { label: this.localeData?.filter_types?.amount_equals, value: 'amountEquals' },
                { label: this.localeData?.filter_types?.description_equals, value: 'descriptionEquals' },
                { label: this.localeData?.filter_types?.add, value: 'add' },
                { label: this.localeData?.filter_types?.update, value: 'update' },
                { label: this.localeData?.filter_types?.delete, value: 'delete' }
            ];
        }
    }

    public onSelectClosingBalance() {
        this.filterList = [
            { label: this.localeData?.filter_types?.amount_greater_than, value: 'amountGreaterThan' },
            { label: this.localeData?.filter_types?.amount_less_than, value: 'amountSmallerThan' },
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

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof SettingTriggerComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.entityList = [
                { label: this.localeData?.entity_types?.group, value: 'group' },
                { label: this.localeData?.entity_types?.account, value: 'account' }
            ];

            this.actionList = [
                { label: this.localeData?.webhook, value: 'webhook' }
            ];

            this.filterList = [
                { label: this.localeData?.filter_types?.amount_greater_than, value: 'amountGreaterThan' },
                { label: this.localeData?.filter_types?.amount_less_than, value: 'amountSmallerThan' },
                { label: this.localeData?.filter_types?.amount_equals, value: 'amountEquals' },
                { label: this.localeData?.filter_types?.description_equals, value: 'descriptionEquals' },
                { label: this.localeData?.filter_types?.add, value: 'add' },
                { label: this.localeData?.filter_types?.update, value: 'update' },
                { label: this.localeData?.filter_types?.delete, value: 'delete' }
            ];

            this.scopeList = [
                { label: this.localeData?.scope_list?.closing_balance, value: 'closing balance' }
            ];
        }
    }

    /**
     * Reset new trigger form model
     *
     * @private
     * @memberof SettingTriggerComponent
     */
    private resetNewFormModel(): void {
        this.newTriggerObj = {
            name: '',
            action: '',
            entity: '',
            entityUniqueName: '',
            filter: '',
            scope: '',
            url: '',
            description: ''
        };
    }

    /**
     * Resets new trigger form fields
     *
     * @private
     * @memberof SettingTriggerComponent
     */
    private resetNewFormFields(): void {
        this.forceClearFilterList$ = observableOf({ status: true });
        this.forceClear$ = observableOf({ status: true });
        this.createTriggerForm?.reset();
        this.onResetEntityType();
    }
}
