import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { IForceClear } from '../../../models/api-models/Sales';
import { SearchService } from '../../../services/search.service';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

@Component({
    selector: 'petty-cash-approve-confirm-dialog',
    templateUrl: './approve-petty-cash-entry-confirm-dialog.component.html'
})
export class ApprovePettyCashEntryConfirmDialogComponent implements OnInit {
    /** Show/hide option to choose expense category */
    @Input() public showCategoryOption: boolean = false;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    @Input() selectedEntryForApprove: any;
    @Input() approveEntryRequestInProcess: boolean;
    /** This holds Entry object */
    @Input() public pettyCashEntry: any = null;
    /** This holds Entry against object */
    @Input() public entryAgainstObject: any = null;
    @Output() approveEntry: EventEmitter<any> = new EventEmitter<any>();
    /** This will hold creator name */
    public byCreator: string = '';
    /** Entry type */
    public pettyCashEntryType: any;
    /** Is cash or bank entry */
    public cashOrBankEntry: any;
    /** True if we need to show red border around the field */
    public showEntryAgainstRequired: boolean = false;
    /** This will clear the select value in sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** Stores the search results pagination details for debtor dropdown */
    public debtorAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for debtor dropdown */
    public defaultDebtorAccountSuggestions: Array<IOption> = [];
    /** Stores the default search results pagination details for debtor dropdown */
    public defaultDebtorAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the search results pagination details for cash/bank dropdown */
    public cashBankAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for cash/bank dropdown */
    public defaultCashBankAccountSuggestions: Array<IOption> = [];
    /** Stores the default search results pagination details for cash/bank dropdown */
    public defaultCashBankAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the search results pagination details for creditor dropdown */
    public creditorAccountsSearchResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Default search suggestion list to be shown for search for creditor dropdown */
    public defaultCreditorAccountSuggestions: Array<IOption> = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for debtor dropdown */
    public preventDefaultDebtorScrollApiCall: boolean = false;
    /** Debtor accounts */
    public debtorsAccountsOptions: IOption[] = [];
    /** Creditor accounts */
    public creditorsAccountsOptions: IOption[] = [];
    /** Cash/Bank accounts */
    public cashAndBankAccountsOptions: IOption[] = [];
    /** True, if API call should be prevented on default scroll caused by scroll in list for cash/bank dropdown */
    public preventDefaultCashBankScrollApiCall: boolean = false;
    /** True, if API call should be prevented on default scroll caused by scroll in list for creditor dropdown */
    public preventDefaultCreditorScrollApiCall: boolean = false;
    /** Stores the default search results pagination details for creditor dropdown */
    public defaultCreditorAccountPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };

    constructor(
        private searchService: SearchService
    ) {
    }

    /**
     * Initializes the component
     *
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public ngOnInit(): void {
        if (this.showCategoryOption) {
            if (this.selectedEntryForApprove?.baseAccount?.uniqueName && !this.selectedEntryForApprove?.particular?.uniqueName) {
                this.selectedEntryForApprove.particular = this.selectedEntryForApprove.baseAccount;
            }
            this.prepareEntryAgainstObject(this.selectedEntryForApprove);
        }
        this.buildCreatorString();
    }

    /**
     * This will build the creator name string
     *
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public buildCreatorString(): void {
        if (this.selectedEntryForApprove && this.selectedEntryForApprove.createdBy) {
            this.byCreator = this.localeData?.by_creator;
            this.byCreator = this.byCreator.replace("[CREATOR_NAME]", this.selectedEntryForApprove.createdBy.name);
        } else {
            this.byCreator = "";
        }
    }

    /**
     * Prepares the entry
     *
     * @private
     * @param {*} res Petty cash details
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    private prepareEntryAgainstObject(res: any): void {
        this.cashOrBankEntry = res?.particular ? this.isCashBankAccount(res.particular) : false;
        this.pettyCashEntryType = res?.entryType;
        if (res?.entryType === 'sales') {
            this.entryAgainstObject.base = this.cashOrBankEntry ? 'Receipt Mode' : 'Debtor Name';
            this.entryAgainstObject.against = this.cashOrBankEntry ? 'Entry against Debtor' : 'Cash Sales';
            if (this.cashOrBankEntry) {
                this.loadDefaultCashBankAccountsSuggestions();
            } else {
                this.loadDefaultDebtorAccountsSuggestions();
            }
        } else if (res?.entryType === 'expense') {
            this.entryAgainstObject.base = this.cashOrBankEntry ? 'Payment Mode' : 'Creditor Name';
            this.entryAgainstObject.against = this.cashOrBankEntry ? 'Entry against Creditors' : 'Cash Expenses';
            if (this.cashOrBankEntry) {
                this.loadDefaultCashBankAccountsSuggestions();
            } else {
                this.loadDefaultCreditorAccountsSuggestions();
            }
        } else {
            // deposit
            this.entryAgainstObject.base = 'Deposit To';
            this.entryAgainstObject.against = null;
            this.loadDefaultCashBankAccountsSuggestions();
        }

        this.entryAgainstObject.model = res?.particular?.uniqueName;
        this.entryAgainstObject.name = res?.particular?.name;
    }

    /**
     * Loads the default debtor account search suggestion when module is loaded
     *
     * @private
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    private loadDefaultDebtorAccountsSuggestions(): void {
        this.onDebtorAccountSearchQueryChanged('', 1, (response) => {
            this.defaultDebtorAccountSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultDebtorAccountPaginationData.page = this.debtorAccountsSearchResultsPaginationData.page;
            this.defaultDebtorAccountPaginationData.totalPages = this.debtorAccountsSearchResultsPaginationData.totalPages;
            this.debtorsAccountsOptions = [...this.defaultDebtorAccountSuggestions];
        });
    }

    /**
     * Loads the default creditor account search suggestion when module is loaded
     *
     * @private
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    private loadDefaultCreditorAccountsSuggestions(): void {
        this.onCreditorAccountSearchQueryChanged('', 1, (response) => {
            this.defaultCreditorAccountSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultCreditorAccountPaginationData.page = this.creditorAccountsSearchResultsPaginationData.page;
            this.defaultCreditorAccountPaginationData.totalPages = this.creditorAccountsSearchResultsPaginationData.totalPages;
            this.creditorsAccountsOptions = [...this.defaultCreditorAccountSuggestions];
        });
    }

    /**
     * Returns true, if the account belongs to cash or bank account
     *
     * @private
     * @param {any} particular Account unique name
     * @returns {boolean} Promise to carry out further operations
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    private isCashBankAccount(particular: any): boolean {
        if (particular) {
            return particular.parentGroups.some(parent => parent.uniqueName === 'bankaccounts' || parent.uniqueName === 'cash');
        }
        return false;
    }

    /**
     * Loads the default creditor account search suggestion when module is loaded
     *
     * @private
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    private loadDefaultCashBankAccountsSuggestions(): void {
        this.onCashBankAccountSearchQueryChanged('', 1, (response) => {
            this.defaultCreditorAccountSuggestions = response.map(result => {
                return {
                    value: result.uniqueName,
                    label: result.name
                }
            }) || [];
            this.defaultCreditorAccountPaginationData.page = this.creditorAccountsSearchResultsPaginationData.page;
            this.defaultCreditorAccountPaginationData.totalPages = this.creditorAccountsSearchResultsPaginationData.totalPages;
            this.creditorsAccountsOptions = [...this.defaultCreditorAccountSuggestions];
        });
    }

    /**
     * Callback for selection of entry against
     *
     * @param {IOption} option
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public onSelectEntryAgainstAccount(option: IOption): void {
        if (option && option.value) {
            this.showEntryAgainstRequired = false;
            this.pettyCashEntry.particular.uniqueName = option.value;
            this.pettyCashEntry.particular.name = option.label;
            this.selectedEntryForApprove.baseAccount.uniqueName = option.value;
            this.selectedEntryForApprove.baseAccount.name = option.label;
        }
    }

    /**
     * This will clear the selected entry object
     *
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public onClearEntryAgainstAccount(): void {
        this.showEntryAgainstRequired = false;
        this.pettyCashEntry.particular.uniqueName = "";
        this.pettyCashEntry.particular.name = "";
        this.selectedEntryForApprove.baseAccount.uniqueName = "";
        this.selectedEntryForApprove.baseAccount.name = "";
        this.entryAgainstObject.model = "";
        this.forceClear$ = observableOf({ status: true });
    }

    /**
     * Handle account scroll end
     *
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public handleAccountScrollEnd(): void {
        if (this.pettyCashEntryType === 'sales') {
            if (this.cashOrBankEntry) {
                this.handleCashBankScrollEnd();
            } else {
                this.handleDebtorScrollEnd();
            }
        } else if (this.pettyCashEntryType === 'expense') {
            if (this.cashOrBankEntry) {
                this.handleCashBankScrollEnd();
            } else {
                this.handleCreditorScrollEnd();
            }
        } else {
            this.handleCashBankScrollEnd();
        }
    }

    /**
     * Scroll end handler for debtor
     *
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public handleDebtorScrollEnd(): void {
        if (this.debtorAccountsSearchResultsPaginationData.page < this.debtorAccountsSearchResultsPaginationData.totalPages) {
            this.onDebtorAccountSearchQueryChanged(
                this.debtorAccountsSearchResultsPaginationData.query,
                this.debtorAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.debtorAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultDebtorAccountSuggestions = this.defaultDebtorAccountSuggestions.concat(...results);
                        this.defaultDebtorAccountPaginationData.page = this.debtorAccountsSearchResultsPaginationData.page;
                        this.defaultDebtorAccountPaginationData.totalPages = this.debtorAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Scroll end handler for cash/bank
     *
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public handleCashBankScrollEnd(): void {
        if (this.cashBankAccountsSearchResultsPaginationData.page < this.cashBankAccountsSearchResultsPaginationData.totalPages) {
            this.onCashBankAccountSearchQueryChanged(
                this.cashBankAccountsSearchResultsPaginationData.query,
                this.cashBankAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.cashBankAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultCashBankAccountSuggestions = this.defaultCashBankAccountSuggestions.concat(...results);
                        this.defaultCashBankAccountPaginationData.page = this.cashBankAccountsSearchResultsPaginationData.page;
                        this.defaultCashBankAccountPaginationData.totalPages = this.cashBankAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Scroll end handler for creditor
     *
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public handleCreditorScrollEnd(): void {
        if (this.creditorAccountsSearchResultsPaginationData.page < this.creditorAccountsSearchResultsPaginationData.totalPages) {
            this.onDebtorAccountSearchQueryChanged(
                this.creditorAccountsSearchResultsPaginationData.query,
                this.creditorAccountsSearchResultsPaginationData.page + 1,
                (response) => {
                    if (!this.creditorAccountsSearchResultsPaginationData.query) {
                        const results = response.map(result => {
                            return {
                                value: result.uniqueName,
                                label: result.name
                            }
                        }) || [];
                        this.defaultCreditorAccountSuggestions = this.defaultCreditorAccountSuggestions.concat(...results);
                        this.defaultDebtorAccountPaginationData.page = this.creditorAccountsSearchResultsPaginationData.page;
                        this.defaultDebtorAccountPaginationData.totalPages = this.creditorAccountsSearchResultsPaginationData.totalPages;
                    }
                });
        }
    }

    /**
     * Account search query handler
     *
     * @param {string} query
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public onAccountSearchQueryChanged(query: string): void {
        if (this.pettyCashEntryType === 'sales') {
            if (this.cashOrBankEntry) {
                this.onCashBankAccountSearchQueryChanged(query);
            } else {
                this.onDebtorAccountSearchQueryChanged(query);
            }
        } else if (this.pettyCashEntryType === 'expense') {
            if (this.cashOrBankEntry) {
                this.onCashBankAccountSearchQueryChanged(query);
            } else {
                this.onCreditorAccountSearchQueryChanged(query);
            }
        } else {
            this.onCashBankAccountSearchQueryChanged(query);
        }
    }

    /**
     * Search query change handler for debtor dropdown
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public onDebtorAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.debtorAccountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultDebtorScrollApiCall &&
            (query || (this.defaultDebtorAccountSuggestions && this.defaultDebtorAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: 'sundrydebtors'
            }
            this.searchService.searchAccountV2(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.debtorsAccountsOptions = searchResults;
                    } else {
                        this.debtorsAccountsOptions = [
                            ...this.debtorsAccountsOptions,
                            ...searchResults
                        ];
                    }
                    this.entryAgainstObject.dropDownOption = [...this.debtorsAccountsOptions];
                    this.debtorAccountsSearchResultsPaginationData.page = data.body.page;
                    this.debtorAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultDebtorAccountPaginationData.page = this.debtorAccountsSearchResultsPaginationData.page;
                        this.defaultDebtorAccountPaginationData.totalPages = this.debtorAccountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.debtorsAccountsOptions = [...this.defaultDebtorAccountSuggestions];
            this.debtorAccountsSearchResultsPaginationData.page = this.defaultDebtorAccountPaginationData.page;
            this.debtorAccountsSearchResultsPaginationData.totalPages = this.defaultDebtorAccountPaginationData.totalPages;
            this.preventDefaultDebtorScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultDebtorScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Search query change handler for cash/bank dropdown
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public onCashBankAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.cashBankAccountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultCashBankScrollApiCall &&
            (query || (this.defaultCashBankAccountSuggestions && this.defaultCashBankAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: encodeURIComponent('cash, bankaccounts')
            }
            this.searchService.searchAccountV2(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.cashAndBankAccountsOptions = searchResults;
                    } else {
                        this.cashAndBankAccountsOptions = [
                            ...this.cashAndBankAccountsOptions,
                            ...searchResults
                        ];
                    }
                    this.entryAgainstObject.dropDownOption = [...this.cashAndBankAccountsOptions];
                    this.cashBankAccountsSearchResultsPaginationData.page = data.body.page;
                    this.cashBankAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultCashBankAccountPaginationData.page = this.cashBankAccountsSearchResultsPaginationData.page;
                        this.defaultCashBankAccountPaginationData.totalPages = this.cashBankAccountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.cashAndBankAccountsOptions = [...this.defaultCashBankAccountSuggestions];
            this.cashBankAccountsSearchResultsPaginationData.page = this.defaultCashBankAccountPaginationData.page;
            this.cashBankAccountsSearchResultsPaginationData.totalPages = this.defaultCashBankAccountPaginationData.totalPages;
            this.preventDefaultCashBankScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultCashBankScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Search query change handler for creditor dropdown
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public onCreditorAccountSearchQueryChanged(query: string, page: number = 1, successCallback?: Function): void {
        this.creditorAccountsSearchResultsPaginationData.query = query;
        if (!this.preventDefaultCreditorScrollApiCall &&
            (query || (this.defaultCreditorAccountSuggestions && this.defaultCreditorAccountSuggestions.length === 0) || successCallback)) {
            // Call the API when either query is provided, default suggestions are not present or success callback is provided
            const requestObject: any = {
                q: encodeURIComponent(query),
                page,
                group: 'sundrycreditors'
            }
            this.searchService.searchAccountV2(requestObject).subscribe(data => {
                if (data && data.body && data.body.results) {
                    const searchResults = data.body.results.map(result => {
                        return {
                            value: result.uniqueName,
                            label: result.name
                        }
                    }) || [];
                    if (page === 1) {
                        this.creditorsAccountsOptions = searchResults;
                    } else {
                        this.creditorsAccountsOptions = [
                            ...this.creditorsAccountsOptions,
                            ...searchResults
                        ];
                    }
                    this.entryAgainstObject.dropDownOption = [...this.creditorsAccountsOptions];
                    this.creditorAccountsSearchResultsPaginationData.page = data.body.page;
                    this.creditorAccountsSearchResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultCreditorAccountPaginationData.page = this.creditorAccountsSearchResultsPaginationData.page;
                        this.defaultCreditorAccountPaginationData.totalPages = this.creditorAccountsSearchResultsPaginationData.totalPages;
                    }
                }
            });
        } else {
            this.creditorsAccountsOptions = [...this.defaultCreditorAccountSuggestions];
            this.creditorAccountsSearchResultsPaginationData.page = this.defaultCreditorAccountPaginationData.page;
            this.creditorAccountsSearchResultsPaginationData.totalPages = this.defaultCreditorAccountPaginationData.totalPages;
            this.preventDefaultCreditorScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultCreditorScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Confirms entry approval
     *
     * @returns {void}
     * @memberof ApprovePettyCashEntryConfirmDialogComponent
     */
    public confirmApproveEntry(): void {
        if (this.entryAgainstObject.base && !this.entryAgainstObject.model) {
            this.showEntryAgainstRequired = true;
            return;
        }
        if (this.showCategoryOption) {
            this.approveEntry.emit(this.selectedEntryForApprove);
        } else {
            this.approveEntry.emit(true);
        }
    }
}
