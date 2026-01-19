import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { Component, Inject, OnDestroy, OnInit, Optional, ViewChild } from '@angular/core';
import { AppState } from '../../store';
import { Observable, of, ReplaySubject } from 'rxjs';
import * as dayjs from 'dayjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TemplateRef } from '@angular/core';
import { SettingsLinkedAccountsService } from '../../services/settings.linked.accounts.service';
import { SettingsLinkedAccountsActions } from '../../actions/settings/linked-accounts/settings.linked.accounts.action';
import { IEbankAccount } from '../../models/api-models/SettingsLinkedAccounts';
import { BankAccountsResponse } from '../../models/api-models/Dashboard';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IServiceConfigArgs, ServiceConfig } from '../../services/service.config';
import { GeneralService } from '../../services/general.service';
import { GIDDH_DATE_FORMAT } from '../../shared/helpers/defaultDateFormat';
import { SearchService } from '../../services/search.service';
import { cloneDeep } from '../../lodash-optimized';
import { Router } from '@angular/router';
import { IOption } from '../../app.constant';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'setting-linked-accounts',
    templateUrl: './setting.linked.accounts.component.html',
    styleUrls: ['./setting.linked.accounts.component.scss'],
    standalone: false
})
/**
 * SettingLinkedAccountsComponent component
 * Handles settinglinkedaccounts functionality and user interactions
 */
export class SettingLinkedAccountsComponent implements OnInit, OnDestroy {

    @ViewChild('connectBankTemplate', { static: true }) public connectBankTemplate: TemplateRef<any>;
    @ViewChild('confirmationTemplate', { static: true }) public confirmationTemplate: TemplateRef<any>;
    /** Dialog reference for connect bank modal */
    private connectBankDialogRef: MatDialogRef<any>;
    /** Dialog reference for confirmation modal */
    private confirmationDialogRef: MatDialogRef<any>;
    @ViewChild('yodleeFormHTML', { static: true }) public yodleeFormHTML: HTMLFormElement;
    @ViewChild('yodleeIframe', { static: true }) public yodleeIframe: HTMLIFrameElement;

    public iframeSource: string = null;
    public ebankAccounts: BankAccountsResponse[] = [];
    public accounts: IOption[];
    public confirmationMessage: string;
    public dateToUpdate: string;
    public yodleeForm: UntypedFormGroup;
    public companyUniqueName: string;
    public selectedProvider: string;
    public isRefreshWithCredentials: boolean = true;
    public providerAccountId: string = null;
    public needReloadingLinkedAccounts$: Observable<boolean> = of(false);
    public selectedBank: any = null;
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

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private selectedAccount: IEbankAccount;
    private actionToPerform: string;
    private dataToUpdate: object;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private _settingsLinkedAccountsService: SettingsLinkedAccountsService,
        private settingsLinkedAccountsActions: SettingsLinkedAccountsActions,
        private _fb: UntypedFormBuilder,
        @Optional() @Inject(ServiceConfig) private config: IServiceConfigArgs,
        private _generalService: GeneralService,
        private searchService: SearchService,
        private router: Router,
        private dialog: MatDialog
    ) {
        this.companyUniqueName = this._generalService.companyUniqueName;
        this.needReloadingLinkedAccounts$ = this.store.pipe(select(s => s.settings.linkedAccounts.needReloadingLinkedAccounts), takeUntil(this.destroyed$));
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        /** Temporarily redirecting to home until we fix the working of this module */
        this.router.navigate(['/pages/home']);

        this.yodleeForm = this._fb.group({
            rsession: ['', [Validators.required]],
            app: ['', [Validators.required]],
            redirectReq: [true, [Validators.required]],
            token: ['', Validators.required],
            extraParams: ['', Validators.required]
        });

        this.store.pipe(select(p => p.settings), takeUntil(this.destroyed$)).subscribe((o) => {
            /**
             * Handles if functionality
             */
            if (o.linkedAccounts && o.linkedAccounts.bankAccounts) {
                this.ebankAccounts = cloneDeep(o.linkedAccounts.bankAccounts);
            }
        });

        this.store.pipe(select(p => p.settings.linkedAccounts.needReloadingLinkedAccounts), takeUntil(this.destroyed$)).subscribe((o) => {
            /**
             * Handles if functionality
             */
            if (this.isRefreshWithCredentials) {
                this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
            }
        });

        this.store.pipe(select(p => p.settings.linkedAccounts.iframeSource), takeUntil(this.destroyed$)).subscribe((source) => {
            /**
             * Handles if functionality
             */
            if (source) {
                this.connectBankDialogRef = this.dialog.open(this.connectBankTemplate, {
                    panelClass: 'mat-dialog-md',
                    disableClose: true
                });
            }
        });

        this.loadDefaultAccountsSuggestions();

        this.needReloadingLinkedAccounts$.subscribe(a => {
            /**
             * Handles if functionality
             */
            if (a) {
                this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
            }
        });
    }

    /**
     * Retrieves initialebankinfo data
     */
    public getInitialEbankInfo() {
        this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
    }

    /**
     * Opens the connect bank modal dialog
     *
     * @param {*} selectedProvider - Selected provider
     * @param {*} providerAccountId - Provider account ID
     * @memberof SettingLinkedAccountsComponent
     */
    public connectBank(selectedProvider?, providerAccountId?) {
        // get token info
        /**
         * Handles if functionality
         */
        if (selectedProvider) {
            this.selectedProvider = selectedProvider;
            this.isRefreshWithCredentials = false;
            this.providerAccountId = providerAccountId;
        }
        this.connectBankDialogRef = this.dialog.open(this.connectBankTemplate, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });
    }

    /**
     * yodleeBank
     */
    public yodleeBank() {
        this._settingsLinkedAccountsService.GetYodleeToken().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            /**
             * Handles if functionality
             */
            if (data?.status === 'success') {
                /**
                 * Handles if functionality
                 */
                if (data?.body?.user) {
                    let token = cloneDeep(data.body.user?.accessTokens[0]);
                    this.yodleeForm?.patchValue({
                        rsession: data.body.rsession,
                        app: token.appId,
                        redirectReq: true,
                        token: token?.value,
                        extraParams: ['callback=' + this.config.appUrl + 'app/yodlee-success.html?companyUniqueName=' + this.companyUniqueName]
                    });
                    this.yodleeFormHTML?.nativeElement.submit();
                    this.connectBankDialogRef = this.dialog.open(this.connectBankTemplate, {
                        panelClass: 'mat-dialog-md',
                        disableClose: true
                    });
                }
            }
        });
    }

    /**
     * Closes the connect bank modal dialog
     *
     * @memberof SettingLinkedAccountsComponent
     */
    public closeModal() {
        this.connectBankDialogRef?.close();
        this.iframeSource = undefined;
        this.selectedProvider = null;
        this.isRefreshWithCredentials = true;
        this.providerAccountId = null;
        this.store.dispatch(this.settingsLinkedAccountsActions.GetAllAccounts());
    }

    /**
     * Closes confirmationmodal
     */
    public closeConfirmationModal(isUserAgree: boolean) {
        /**
         * Handles if functionality
         */
        if (isUserAgree) {
            let accountId = this.selectedAccount.itemAccountId;
            let accountUniqueName = '';
            /**
             * Handles if functionality
             */
            if (this.selectedAccount.giddhAccount && this.selectedAccount.giddhAccount.uniqueName) {
                accountUniqueName = this.selectedAccount.giddhAccount.uniqueName;
            }
            /**
             * Handles switch functionality
             */
            switch (this.actionToPerform) {
                case 'DeleteAddedBank':
                    let deleteWithAccountId = true;
                    /**
                     * Handles if functionality
                     */
                    if (this.selectedBank?.status !== 'ALREADY_ADDED') {
                        /**
                         * Handles accountId functionality
                         */
                        accountId = (this.selectedAccount && this.selectedAccount.providerAccount) ? this.selectedAccount.providerAccount.providerAccountId : 0;
                        deleteWithAccountId = false;
                    }
                    /**
                     * Handles if functionality
                     */
                    if (accountId) {
                        this.store.dispatch(this.settingsLinkedAccountsActions.DeleteBankAccount(accountId, deleteWithAccountId));
                    }
                    break;
                case 'UpdateDate':
                    this.store.dispatch(this.settingsLinkedAccountsActions.UpdateDate(this.dateToUpdate, accountId));
                    break;
                case 'LinkAccount':
                    this.store.dispatch(this.settingsLinkedAccountsActions.LinkBankAccount(this.dataToUpdate, accountId));
                    break;
                case 'UnlinkAccount':
                    this.store.dispatch(this.settingsLinkedAccountsActions.UnlinkBankAccount(accountId, accountUniqueName));
                    break;
            }
        }

        this.confirmationDialogRef?.close();
        this.selectedAccount = null;
        this.actionToPerform = null;
    }

    /**
     * Handles refreshaccounts event
     */
    public onRefreshAccounts() {
        this.store.dispatch(this.settingsLinkedAccountsActions.RefreshAllAccounts());
    }

    /**
     * Handles reconnectaccount event
     */
    public onReconnectAccount(account) {
        this.store.dispatch(this.settingsLinkedAccountsActions.ReconnectAccount(account.loginId));
    }

    /**
     * Handles deleteaddedbank event
     */
    public onDeleteAddedBank(bankName, account, bank) {
        /**
         * Handles if functionality
         */
        if (bankName && account) {
            this.selectedBank = cloneDeep(bank);
            this.selectedAccount = cloneDeep(account);
            let message = this.localeData?.delete_bank_message;
            message = message?.replace("[BANK]", bankName);
            this.confirmationMessage = message;
            this.actionToPerform = 'DeleteAddedBank';
            this.confirmationDialogRef = this.dialog.open(this.confirmationTemplate, {
                panelClass: 'mat-dialog-md',
                disableClose: true
            });
        }
    }

    /**
     * Handles refreshtoken event
     */
    public onRefreshToken(account, isUpdateAccount) {
        /**
         * Handles if functionality
         */
        if (isUpdateAccount) {
            /**
             * Handles if functionality
             */
            if (!this.providerAccountId && account) {
                this.providerAccountId = account.providerAccountId;
                delete account['providerAccountId'];
            }
            this.store.dispatch(this.settingsLinkedAccountsActions.RefreshBankAccount(this.providerAccountId, account));
            return;
        }
        /**
         * Handles if functionality
         */
        if (account && account.providerAccount) {
            this.store.dispatch(this.settingsLinkedAccountsActions.RefreshBankAccount(account.providerAccount.providerAccountId, {}));
        }
    }

    /**
     * Handles accountselect event
     */
    public onAccountSelect(account, data) {
        /**
         * Handles if functionality
         */
        if (data && data.value) {
            // Link bank account
            this.dataToUpdate = {
                itemAccountId: account.itemAccountId,
                uniqueName: data.value
            };

            this.selectedAccount = cloneDeep(account);
            let message = this.localeData?.link_account_message;
            message = message?.replace("[ACCOUNT]", data.value);
            this.confirmationMessage = message;
            this.actionToPerform = 'LinkAccount';
            this.confirmationDialogRef = this.dialog.open(this.confirmationTemplate, {
                panelClass: 'mat-dialog-md',
                disableClose: true
            });
        }
    }

    /**
     * Handles unlinkbankaccount event
     */
    public onUnlinkBankAccount(account) {
        this.selectedAccount = cloneDeep(account);
        let message = this.localeData?.unlink_account_message;
        message = message?.replace("[ACCOUNT]", account.giddhAccount.name);
        this.confirmationMessage = message;
        this.actionToPerform = 'UnlinkAccount';
        this.confirmationDialogRef = this.dialog.open(this.confirmationTemplate, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });
    }

    /**
     * Handles updatedate event
     */
    public onUpdateDate(date, account) {
        this.dateToUpdate = dayjs(date).format(GIDDH_DATE_FORMAT);
        this.selectedAccount = cloneDeep(account);
        let message = this.localeData?.get_ledger_entries;
        message = message?.replace("[DATE]", this.dateToUpdate);
        this.confirmationMessage = message;
        this.actionToPerform = 'UpdateDate';
        this.confirmationDialogRef = this.dialog.open(this.confirmationTemplate, {
            panelClass: 'mat-dialog-md',
            disableClose: true
        });
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {boolean} withStocks True, if search should include stocks in results
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof SettingLinkedAccountsComponent
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
                            label: `${result.name} (${result?.uniqueName})`
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
     * @memberof SettingLinkedAccountsComponent
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
                                label: `${result.name} (${result?.uniqueName})`
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
     * Loads the default account search suggestion when module is loaded
     *
     * @private
     * @memberof SettingLinkedAccountsComponent
     */
    private loadDefaultAccountsSuggestions(): void {
        this.onAccountSearchQueryChanged('', 1, (response) => {
            this.defaultAccountSuggestions = response.map(result => {
                return {
                    value: result?.uniqueName,
                    label: `${result.name} (${result?.uniqueName})`
                }
            }) || [];
            this.defaultAccountPaginationData.page = this.accountsSearchResultsPaginationData.page;
            this.defaultAccountPaginationData.totalPages = this.accountsSearchResultsPaginationData.totalPages;
            this.accounts = [...this.defaultAccountSuggestions];
        });
    }

}
