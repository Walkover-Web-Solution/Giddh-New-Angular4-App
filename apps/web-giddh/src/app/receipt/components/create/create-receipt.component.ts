import { animate, state, style, transition, trigger } from "@angular/animations";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { select, Store } from "@ngrx/store";
import * as moment from "moment";
import { UploaderOptions, UploadInput, UploadOutput } from "ngx-uploader";
import { Observable, of as observableOf, ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { CommonActions } from "../../../actions/common.actions";
import { CompanyActions } from "../../../actions/company.actions";
import { InvoiceActions } from "../../../actions/invoice/invoice.actions";
import { SalesActions } from "../../../actions/sales/sales.action";
import { Configuration, SearchResultText, SubVoucher } from "../../../app.constant";
import { cloneDeep, find, orderBy, uniqBy } from "../../../lodash-optimized";
import { AccountResponseV2, AddAccountRequest, UpdateAccountRequest } from "../../../models/api-models/Account";
import { OnboardingFormRequest } from "../../../models/api-models/Common";
import { TaxResponse } from "../../../models/api-models/Company";
import { AccountDetailsClass, IForceClear, Receipt, StateCode } from "../../../models/api-models/Sales";
import { LEDGER_API } from "../../../services/apiurls/ledger.api";
import { LedgerService } from "../../../services/ledger.service";
import { SalesService } from "../../../services/sales.service";
import { SearchService } from "../../../services/search.service";
import { ToasterService } from "../../../services/toaster.service";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { giddhRoundOff } from "../../../shared/helpers/helperFunctions";
import { AppState } from "../../../store";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";
import { SalesShSelectComponent } from "../../../theme/sales-ng-virtual-select/sh-select.component";

@Component({
    selector: 'create-receipt',
    templateUrl: './create-receipt.component.html',
    styleUrls: ['./create-receipt.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateReceiptComponent implements OnInit, OnDestroy {
    @ViewChild('customerNameDropDown', { static: false }) public customerNameDropDown: SalesShSelectComponent;
    /** Billing state instance */
    @ViewChild('billingState', { static: true }) billingState: ElementRef;
    /** Shipping state instance */
    @ViewChild('shippingState', { static: true }) shippingState: ElementRef;
    /** Instance of send email modal */
    @ViewChild('sendEmailModal', { static: false }) public sendEmailModal: any;
    @ViewChild('sendPrintModal', { static: false }) public sendPrintModal: any;
    public customerAccounts$: Observable<IOption[]>;
    public receiptFormData: Receipt;
    public typeAheadNoResultsOfCustomer: boolean = false;
    /** Stores the search results pagination details for customer */
    public searchCustomerResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** Stores the default search results pagination details for customer */
    public defaultCustomerResultsPaginationData = {
        page: 0,
        totalPages: 0,
        query: ''
    };
    /** True, if API call should be prevented on default scroll caused by scroll in list */
    public preventDefaultScrollApiCall: boolean = false;
    /** Default search suggestion list to be shown for searching customer */
    public defaultCustomerSuggestions: Array<IOption> = [];
    public selectedGrpUniqueNameForAddEditAccountModal: string = '';
    /** Stores the search results */
    public searchResults: Array<IOption> = [];
    private sundryDebtorsAcList: IOption[] = [];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** No results found label for dynamic search */
    public noResultsFoundLabel = SearchResultText.NewSearch;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public fileUploadOptions: UploaderOptions;
    public uploadInput: EventEmitter<UploadInput>;
    public isFileUploading: boolean = false;
    public selectedFileName: string = '';
    public file: any = null;
    /** This will handle if focus should go in customer/vendor dropdown */
    public allowFocus: boolean = true;
    public isUpdateMode: boolean = false;
    public activeCompany: any = {};
    public bankAccounts$: Observable<IOption[]>;
    public bankAccounts: IOption[] = [];
    /** control for the MatSelect filter keyword */
    public searchBankAccount: FormControl = new FormControl();
    public inputMaskFormat: string = '';
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public accountAsideMenuState: string = 'out';
    public selectedCustomerForDetails: string = null;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public companyTaxesList$: Observable<TaxResponse[]>;
    public companyTaxesList: TaxResponse[] = [];
    public totalForTax: number = 0;
    /** Allowed taxes list contains the unique name of all
     * tax types within a company and count upto which they are allowed
     */
    public allowedSelectionOfAType: any = { type: [], count: 1 };
    /** This will hold account addresses */
    public accountAddressList: any[] = [];
    public autoFillShipping: boolean = true;
    public customerCountryName: string = '';
    /** Stores the customer country code */
    public customerCountryCode: string = '';
    /** Force clear for billing-shipping dropdown */
    public billingShippingForceClearReactive$: Observable<IForceClear> = observableOf({ status: false });
    public statesSource: IOption[] = [];
    /** This will hold states list with respect to country */
    public countryStates: any[] = [];
    /* This will hold company's country states */
    public companyStatesSource: IOption[] = [];
    /** True, if the Giddh supports the taxation of the country (not supported now: UK, US, Nepal, Australia) */
    public shouldShowTrnGstField: boolean = false;
    public formFields: any[] = [];
    /** This will hold onboarding api form request */
    public onboardingFormRequest: OnboardingFormRequest = { formName: '', country: '' };
    public showGSTINNo: boolean;
    public showTRNNo: boolean;
    public companyCurrency: string;
    /* This will hold the company country name */
    public companyCountryName: string = '';
    public isMulticurrencyAccount = false;
    public companyCurrencyName: string;
    public customerCurrencyCode: string;
    //Multi-currency changes
    public exchangeRate = 1;
    public originalExchangeRate = 1;
    /** Stores the previous exchange rate of previous debtor */
    public previousExchangeRate = 1;
    public baseCurrencySymbol: string = '';
    public depositCurrSymbol: string = '';
    public companyCountryCode: string = '';
    public isAdvanceReceipt: boolean = false;
    public universalDate: any;
    public showSwitchCurrency: boolean = false;
    public reverseExchangeRate: number;
    public originalReverseExchangeRate: number;
    public editCurrencyInputField: boolean = false;
    public showCurrencyValue: boolean = false;
    public autoSaveIcon: boolean = false;
    public editPencilIcon: boolean = true;
    public totals: any = { subTotal: 0, taxTotal: 0, grandTotal: 0, grandTotalMultiCurrency: 0 };
    public giddhBalanceDecimalPlaces: number = 2;
    public receiptResponse: any;
    private dialogRef: any;
    /** Holds images folder path */
    public imgPath: string = '';

    constructor(
        private searchService: SearchService,
        private changeDetectionRef: ChangeDetectorRef,
        private salesAction: SalesActions,
        private store: Store<AppState>,
        private salesService: SalesService,
        private toaster: ToasterService,
        private companyActions: CompanyActions,
        private commonActions: CommonActions,
        private ledgerService: LedgerService,
        private dialog: MatDialog,
        private invoiceActions: InvoiceActions
    ) {
        this.receiptFormData = new Receipt();
        this.receiptFormData.type = "receipt";

        this.sessionKey$ = this.store.pipe(select(state => state.session.user.session.id), takeUntil(this.destroyed$));
        this.companyName$ = this.store.pipe(select(state => state.session.companyUniqueName), takeUntil(this.destroyed$));
        this.companyTaxesList$ = this.store.pipe(select(state => state.company?.taxes), takeUntil(this.destroyed$));
        this.companyTaxesList$.subscribe(companyTaxesList => {
            if (companyTaxesList) {
                this.companyTaxesList = companyTaxesList;
                companyTaxesList.forEach((tax) => {
                    if (!this.allowedSelectionOfAType.type.includes(tax.taxType)) {
                        this.allowedSelectionOfAType.type.push(tax.taxType);
                    }
                });
            } else {
                this.companyTaxesList = [];
                this.allowedSelectionOfAType.type = [];
            }
        })

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                this.inputMaskFormat = activeCompany.balanceDisplayFormat ? activeCompany.balanceDisplayFormat.toLowerCase() : '';
            }
        });

        this.store.pipe(select(state => state.groupwithaccounts.newlyCreatedAccount), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.accountAsideMenuState === 'in') {
                let item: IOption = {
                    label: response.name,
                    value: response.uniqueName
                };
                this.onSelectCustomer(item);
            }
        });

        this.store.pipe(select(state => state.sales.createAccountSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.accountAsideMenuState === 'in') {
                this.toggleAccountAsidePane();
            }
        });

        this.store.pipe(select(state => state.sales.updatedAccountDetails), takeUntil(this.destroyed$)).subscribe(response => {
            if(response) {
                if (this.accountAsideMenuState === 'in') {
                    this.toggleAccountAsidePane();
                }
                this.assignAccountDetailsValuesInForm(response);
            }
        });

        this.store.pipe(select(state => state.common.onboardingform), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                if (res.fields) {
                    this.formFields = [];
                    Object.keys(res.fields).forEach(key => {
                        if (res.fields[key]) {
                            this.formFields[res.fields[key].name] = [];
                            this.formFields[res.fields[key].name] = res.fields[key];
                        }
                    });
                }
                if (this.formFields && this.formFields['taxName']) {
                    this.shouldShowTrnGstField = true;
                } else {
                    this.shouldShowTrnGstField = false;
                }
            }
        });

        this.store.pipe(select(state => state.sales.acDtl), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.assignAccountDetailsValuesInForm(response);
            }
        });

        // get user country from his profile
        this.store.pipe(select(state => state.settings.profile), takeUntil(this.destroyed$)).subscribe(async (profile) => {
            this.companyCountryName = profile.country;
            this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
            await this.prepareCompanyCountryAndCurrencyFromProfile(profile);
        });

        // listen for universal date
        this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$)).subscribe((dateObj: Date[]) => {
            if (dateObj) {
                try {
                    this.universalDate = moment(dateObj[1]).toDate();
                    this.receiptFormData.date = this.universalDate;
                } catch (e) {
                    this.universalDate = new Date();
                }
            }
        });
    }

    public ngOnInit(): void {
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.loadDefaultSearchSuggestions();
        this.loadBankCashAccounts('');
        this.store.dispatch(this.companyActions.getTax());

        this.uploadInput = new EventEmitter<UploadInput>();
        this.fileUploadOptions = { concurrency: 0 };

        // listen for search field value changes
        this.searchBankAccount.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(() => {
            this.filterBankAccounts();
        });
    }

    public ngOnDestroy(): void {
        this.destroyed$.complete();
        this.destroyed$.next();
    }

    public customMoveGroupFilter(term: string, item: IOption): boolean {
        let newItem = { ...item };
        if (!newItem.additional) {
            newItem.additional = { email: '', mobileNo: '' };
        } else {
            newItem.additional.email = newItem.additional.email || '';
            newItem.additional.mobileNo = newItem.additional.mobileNo || '';
        }
        return (item.label.toLocaleLowerCase().indexOf(term) > -1 || item.value.toLocaleLowerCase().indexOf(term) > -1 || item.additional.email.toLocaleLowerCase().indexOf(term) > -1 || item.additional.mobileNo.toLocaleLowerCase().indexOf(term) > -1);
    }

    public noResultsForCustomer(event: boolean): void {
        this.typeAheadNoResultsOfCustomer = event;
    }

    /**
     * Scroll to bottom handler
     *
     * @param {string} searchType Search type
     * @memberof ProformaInvoiceComponent
     */
    public handleScrollEnd(searchType: string): void {
        const query = this.searchCustomerResultsPaginationData.query;
        const page = this.searchCustomerResultsPaginationData.page;
        if (this.searchCustomerResultsPaginationData.page < this.searchCustomerResultsPaginationData.totalPages) {
            this.onSearchQueryChanged(
                query,
                page + 1,
                searchType,
                (response) => {
                    if (!query) {
                        const results = response.map(result => {
                            return {
                                value: result.stock ? `${result.uniqueName}#${result.stock?.uniqueName}` : result.uniqueName,
                                label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                                additional: result
                            }
                        }) || [];

                        this.defaultCustomerSuggestions = this.defaultCustomerSuggestions.concat(...results);
                        this.defaultCustomerResultsPaginationData.page = this.searchCustomerResultsPaginationData.page;
                        this.defaultCustomerResultsPaginationData.totalPages = this.searchCustomerResultsPaginationData.totalPages;
                        this.searchResults = [...this.defaultCustomerSuggestions];
                        this.assignSearchResultToList(searchType);
                        this.makeCustomerList();
                    }
                });
        }
    }

    /**
     * Search query change handler
     *
     * @param {string} query Search query
     * @param {number} [page=1] Page to request
     * @param {string} searchType Type of search to make
     * @param {Function} successCallback Callback to carry out further operation
     * @memberof ProformaInvoiceComponent
     */
    public onSearchQueryChanged(query: string, page: number = 1, searchType: string, successCallback?: Function): void {
        if (!this.preventDefaultScrollApiCall &&
            (query || (this.defaultCustomerSuggestions && this.defaultCustomerSuggestions.length === 0) || successCallback)) {
            this.searchCustomerResultsPaginationData.query = query;

            const requestObject = this.getSearchRequestObject(query, page);
            this.searchAccount(requestObject).pipe(takeUntil(this.destroyed$)).subscribe(data => {
                if (data && data.body && data.body.results) {
                    this.prepareSearchLists(data.body.results, page, searchType);
                    this.makeCustomerList();
                    this.noResultsFoundLabel = SearchResultText.NotFound;
                    this.changeDetectionRef.detectChanges();
                    this.searchCustomerResultsPaginationData.page = data.body.page;
                    this.searchCustomerResultsPaginationData.totalPages = data.body.totalPages;
                    if (successCallback) {
                        successCallback(data.body.results);
                    } else {
                        this.defaultCustomerResultsPaginationData.page = data.body.page;
                        this.defaultCustomerResultsPaginationData.totalPages = data.body.totalPages;
                    }
                }
            });
        } else {
            this.searchResults = [...this.defaultCustomerSuggestions];
            this.searchCustomerResultsPaginationData.page = this.defaultCustomerResultsPaginationData.page;
            this.searchCustomerResultsPaginationData.totalPages = this.defaultCustomerResultsPaginationData.totalPages;
            this.assignSearchResultToList(searchType);
            this.makeCustomerList();
            this.preventDefaultScrollApiCall = true;
            setTimeout(() => {
                this.preventDefaultScrollApiCall = false;
            }, 500);
        }
    }

    /**
     * Returns the search request object
     *
     * @param {string} query Query to be searched
     * @param {number} [page=1] Page for which search is to be made
     * @returns {*} Search request object
     * @memberof ProformaInvoiceComponent
     */
    public getSearchRequestObject(query: string, page: number = 1): any {
        let withStocks: boolean;
        let group: string;
        this.searchCustomerResultsPaginationData.query = query;
        group = 'sundrydebtors';
        this.selectedGrpUniqueNameForAddEditAccountModal = 'sundrydebtors';
        const requestObject = {
            q: encodeURIComponent(query),
            page,
            group: encodeURIComponent(group)
        };
        if (withStocks) {
            requestObject['withStocks'] = withStocks;
        }
        return requestObject;
    }

    /**
     * Searches account
     *
     * @param {*} requestObject Request object
     * @returns {Observable<any>} Observable to carry out further operation
     * @memberof ProformaInvoiceComponent
     */
    public searchAccount(requestObject: any): Observable<any> {
        return this.searchService.searchAccount(requestObject);
    }

    /**
     * Assigns the search results based on invoice type and search type
     *
     * @private
     * @param {string} searchType Search type made by the user
     * @memberof ProformaInvoiceComponent
     */
    private assignSearchResultToList(searchType: string): void {
        this.sundryDebtorsAcList = this.searchResults;
    }

    public makeCustomerList() {
        this.customerAccounts$ = observableOf(orderBy(this.sundryDebtorsAcList, 'label'));
        this.selectedGrpUniqueNameForAddEditAccountModal = 'sundrydebtors';
    }

    /**
     * Prepares the search list when the data is received
     *
     * @param {*} results Search results
     * @param {number} [currentPage=1] Current page requested
     * @param {string} searchType Search type of the searched item
     * @memberof ProformaInvoiceComponent
     */
    public prepareSearchLists(results: any, currentPage: number = 1, searchType: string): void {
        const searchResults = results.map(result => {
            return {
                value: result.stock ? `${result.uniqueName}#${result.stock?.uniqueName}` : result.uniqueName,
                label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                additional: result
            };
        }) || [];
        if (currentPage === 1) {
            this.searchResults = searchResults;
        } else {
            const results = [
                ...this.searchResults,
                ...searchResults
            ];
            this.searchResults = uniqBy(results, 'value');
        }
        this.assignSearchResultToList(searchType);
    }

    /**
     * Resets the previous search result
     *
     * @param {boolean} shouldShowDefaultList True, if default list should be shown
     * @param {string} searchType Search type made by the user
     * @memberof ProformaInvoiceComponent
     */
    public resetPreviousSearchResults(shouldShowDefaultList: boolean = false, searchType?: string): void {
        if (shouldShowDefaultList && searchType) {
            this.searchResults = [...this.defaultCustomerSuggestions];
            this.searchCustomerResultsPaginationData = {
                page: 0,
                totalPages: 0,
                query: ''
            };
            this.noResultsFoundLabel = SearchResultText.NotFound;
        } else {
            this.searchResults = [];
            this.defaultCustomerSuggestions = [];
            this.searchCustomerResultsPaginationData = {
                page: 0,
                totalPages: 0,
                query: ''
            };
            this.defaultCustomerResultsPaginationData = {
                page: 0,
                totalPages: 0,
                query: ''
            };
            this.noResultsFoundLabel = SearchResultText.NewSearch;
        }
    }

    public onSelectCustomer(item: IOption): void {
        this.typeAheadNoResultsOfCustomer = false;
        if (item.value) {
            this.receiptFormData.account.name = item.label;
            this.getAccountDetails(item.value);
        }
    }

    public getAccountDetails(accountUniqueName: string): void {
        this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
    }

    public resetCustomerName(event: any): void {
        if (event) {
            if (!event.target?.value) {
                this.receiptFormData.account = new AccountDetailsClass();
                this.accountAddressList = [];
            }
        } else {
            this.receiptFormData.account = new AccountDetailsClass();
            this.accountAddressList = [];
        }
    }

    public addNewAccount(): void {
        this.allowFocus = false;
        this.selectedCustomerForDetails = null;
        this.toggleAccountAsidePane();
    }

    public onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            let sessionKey = null;
            let companyUniqueName = null;
            this.sessionKey$.pipe(take(1)).subscribe(key => sessionKey = key);
            this.companyName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
            const event: UploadInput = {
                type: 'uploadAll',
                url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
                method: 'POST',
                fieldName: 'file',
                data: { company: companyUniqueName },
                headers: { 'Session-Id': sessionKey },
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
        } else if (output.type === 'done') {
            if (output.file.response.status === 'success') {
                this.isFileUploading = false;
                this.receiptFormData.attachedFiles = [output.file.response.body?.uniqueName];
                this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
            } else {
                this.isFileUploading = false;
                this.receiptFormData.attachedFiles = [];
                this.toaster.showSnackBar("error", output.file.response.message);
            }
        }
    }

    public onFileChange(event: any) {
        this.file = (event.files as FileList).item(0);
        if (this.file) {
            this.selectedFileName = this.file.name;
        } else {
            this.selectedFileName = '';
        }
    }

    /**
     * Loads the default search suggestion for customer and item when voucher module is loaded and
     * when voucher is changed
     *
     * @private
     * @memberof ProformaInvoiceComponent
     */
    private loadDefaultSearchSuggestions(): void {
        this.onSearchQueryChanged('', 1, 'customer', (response) => {
            let selectedAccountDetails;
            if (this.isUpdateMode) {
                if (selectedAccountDetails) {
                    response.unshift({
                        name: selectedAccountDetails.name,
                        uniqueName: selectedAccountDetails.uniqueName
                    });
                }
            }
            const results = response.map(result => {
                return {
                    value: result.stock ? `${result.uniqueName}#${result.stock?.uniqueName}` : result.uniqueName,
                    label: result.stock ? `${result.name} (${result.stock.name})` : result.name,
                    additional: result
                }
            }) || [];
            this.defaultCustomerSuggestions = uniqBy(results, 'value');
            this.noResultsFoundLabel = SearchResultText.NotFound;
            this.searchResults = [
                ...this.defaultCustomerSuggestions
            ];
            this.assignSearchResultToList('customer');
            this.makeCustomerList();
            this.focusInCustomerName();
        });
    }

    private focusInCustomerName() {
        setTimeout(() => {
            let firstElementToFocus: any = document.getElementsByClassName('firstElementToFocus');
            if (firstElementToFocus[0]) {
                firstElementToFocus[0].focus();
                if (this.customerNameDropDown && !this.isUpdateMode) {
                    this.customerNameDropDown.show();
                }
            }
        }, 200);
    }

    /**
     * Loads bank and cash account of given currency
     *
     * @private
     * @param {string} customerCurrency Currency of the customer selected
     * @memberof ProformaInvoiceComponent
     */
    private loadBankCashAccounts(customerCurrency: string): void {
        this.salesService.getAccountsWithCurrency('cash, bankaccounts', `${customerCurrency}, ${this.activeCompany?.baseCurrency}`).pipe(takeUntil(this.destroyed$)).subscribe(data => {
            this.bankAccounts = this.updateBankAccountObject(data);
            this.bankAccounts$ = observableOf(this.bankAccounts);
        });
    }

    /**
     * Creates the bank/cash account list from API data
     *
     * @param {*} data Data of bank/cash account from API response
     * @returns
     * @memberof ProformaInvoiceComponent
     */
    public updateBankAccountObject(data: any): any {
        let bankAccounts: IOption[] = [];
        if (data && data.body && data.body.results) {
            data.body.results.forEach(account => {
                bankAccounts.push({ label: account.name, value: account.uniqueName, additional: account });
            });
        }
        return orderBy(bankAccounts, 'label');
    }

    private filterBankAccounts(): any {
        let bankAccounts: IOption[] = [];
        this.bankAccounts$.subscribe(response => {
            if (response) {
                response.forEach(account => {
                    if (account?.label?.toLowerCase()?.indexOf(this.searchBankAccount?.value?.toLowerCase()) > -1) {
                        bankAccounts.push({ label: account.label, value: account.value, additional: account });
                    }
                });

                bankAccounts = orderBy(bankAccounts, 'label');
                this.bankAccounts = bankAccounts;
            }
        });
    }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleBodyClass() {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('.invoice-modal-content')?.classList?.add('aside-account-create');
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('.invoice-modal-content')?.classList?.remove('aside-account-create');
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public addNewSidebarAccount(item: AddAccountRequest) {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }

    public updateSidebarAccount(item: UpdateAccountRequest) {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item));
    }

    public addAccountFromShortcut() {
        if (!this.receiptFormData.account.uniqueName) {
            this.selectedCustomerForDetails = null;
            this.toggleAccountAsidePane();
        }
    }

    public getCustomerDetails() {
        this.selectedCustomerForDetails = this.receiptFormData.account.uniqueName;
        this.toggleAccountAsidePane();
    }

    public autoFillShippingDetails() {
        // auto fill shipping address
        if (this.autoFillShipping) {
            this.receiptFormData.account.shippingDetails = cloneDeep(this.receiptFormData.account.billingDetails);
            if (this.shippingState && this.shippingState.nativeElement) {
                this.shippingState.nativeElement.classList.remove('error-box');
            }
        }
    }

    public fillShippingBillingDetails($event: any, isBilling) {
        let stateName = $event.label;
        let stateCode = $event.value;

        if (isBilling) {
            // update account details address if it's billing details
            if (this.billingState && this.billingState.nativeElement) {
                this.billingState.nativeElement.classList.remove('error-box');
            }
            this.receiptFormData.account.billingDetails.state.name = stateName;
            this.receiptFormData.account.billingDetails.stateName = stateName;
            this.receiptFormData.account.billingDetails.stateCode = stateCode;
        } else {
            if (this.shippingState && this.shippingState.nativeElement) {
                this.shippingState.nativeElement.classList.remove('error-box');
            }
            // if it's not billing address then only update shipping details
            // check if it's not auto fill shipping address from billing address then and then only update shipping details
            if (!this.autoFillShipping) {
                this.receiptFormData.account.shippingDetails.stateName = stateName;
                this.receiptFormData.account.shippingDetails.stateCode = stateCode;
                this.receiptFormData.account.shippingDetails.state.name = stateName;
            }
        }
    }

    /**
     * Returns the promise once the state list is successfully
     * fetched to carry outn further operations
     *
     * @private
     * @param {*} countryCode Country code for the user
     * @param {boolean} isCompanyStates
     * @returns Promise to carry out further operations
     * @memberof ProformaInvoiceComponent
     */
    private getUpdatedStateCodes(countryCode: any, isCompanyStates?: boolean): Promise<any> {
        return new Promise((resolve: Function) => {
            if (countryCode) {
                if (this.countryStates[countryCode]) {
                    if (!isCompanyStates) {
                        this.statesSource = this.countryStates[countryCode];
                    } else {
                        this.companyStatesSource = this.countryStates[countryCode];
                    }
                    resolve();
                } else {
                    this.salesService.getStateCode(countryCode).pipe(takeUntil(this.destroyed$)).subscribe(resp => {
                        if (!isCompanyStates) {
                            this.statesSource = this.modifyStateResp((resp.body) ? resp.body.stateList : [], countryCode);
                        } else {
                            this.companyStatesSource = this.modifyStateResp((resp.body) ? resp.body.stateList : [], countryCode);
                        }
                        resolve();
                    }, () => {
                        resolve();
                    });
                }
            } else {
                resolve();
            }
        });
    }

    private modifyStateResp(stateList: StateCode[], countryCode: string): any {
        let stateListRet: IOption[] = [];
        stateList.forEach(stateR => {
            stateListRet.push({
                label: stateR.name,
                value: stateR.code ? stateR.code : stateR.stateGstCode,
                additional: { stateGstCode: stateR.stateGstCode ? stateR.stateGstCode : stateR.code }
            });
        });

        this.countryStates[countryCode] = stateListRet;

        return stateListRet;
    }

    /**
     * To fetch regex call for onboarding countries (gulf)
     *
     * @param {string} countryCode
     * @memberof ProformaInvoiceComponent
     */
    public getOnboardingForm(countryCode: string): void {
        if (this.onboardingFormRequest.country !== countryCode) {
            this.onboardingFormRequest.formName = 'onboarding';
            this.onboardingFormRequest.country = countryCode;
            this.store.dispatch(this.commonActions.GetOnboardingForm(this.onboardingFormRequest));
        }
    }

    private showGstAndTrnUsingCountryName(name: string): void {
        if (this.activeCompany?.country === name) {
            if (name === 'India') {
                this.showGSTINNo = true;
                this.showTRNNo = false;
                this.getOnboardingForm('IN')
            } else if (name === 'United Arab Emirates') {
                this.showGSTINNo = false;
                this.showTRNNo = true;
                this.getOnboardingForm('AE')
            }
        } else {
            this.showGSTINNo = false;
            this.showTRNNo = false;
        }
    }

    public assignAccountDetailsValuesInForm(data: AccountResponseV2): void {
        this.accountAddressList = data.addresses;
        this.customerCountryName = data.country.countryName;
        this.customerCountryCode = data?.country?.countryCode || 'IN';
        this.initializeAccountCurrencyDetails(data);
        this.showGstAndTrnUsingCountryName(this.customerCountryName);
        this.prepareSearchLists([{
            name: data.name,
            uniqueName: data.uniqueName
        }], 1, "customer");
        this.makeCustomerList();
        this.loadBankCashAccounts(data.currency);

        this.getUpdatedStateCodes(data.country.countryCode).then(() => {
            if (data.addresses && data.addresses.length) {
                data.addresses = [find(data.addresses, (tax) => tax.isDefault)];
            }
            // auto fill all the details
            this.receiptFormData.account = new AccountDetailsClass(data);
            this.receiptFormData.account.currencyCode = this.receiptFormData.account.currency.code;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * Initializes acounnt currency details
     *
     * @param {AccountResponseV2} item Account details
     * @memberof ProformaInvoiceComponent
     */
    public initializeAccountCurrencyDetails(item: AccountResponseV2): void {
        // If currency of item is null or undefined then treat it to be equivalent of company currency
        item.currency = item.currency || this.companyCurrency;
        this.isMulticurrencyAccount = item.currency !== this.companyCurrency;
        if (item.addresses && item.addresses.length > 0) {
            item.addresses.forEach(address => {
                if (address && address.isDefault) {
                    const defaultAddress: any = address;
                    this.receiptFormData.account.billingDetails.pincode = defaultAddress.pincode;
                    this.receiptFormData.account.shippingDetails.pincode = defaultAddress.pincode;
                }
            });
        }
        if (this.isMulticurrencyAccount) {
            this.customerCurrencyCode = item.currency;
            this.companyCurrencyName = item.currency;
        } else {
            this.customerCurrencyCode = this.companyCurrency;
        }

        if (item && item.currency && item.currency !== this.companyCurrency) {
            this.getCurrencyRate(this.companyCurrency, item.currency,
                moment(this.receiptFormData.date).format(GIDDH_DATE_FORMAT));
        } else {
            this.previousExchangeRate = this.exchangeRate;
            this.originalExchangeRate = 1;
            this.exchangeRate = 1;
            //this.recalculateEntriesTotal();
        }

        if (this.isMulticurrencyAccount) {
            this.bankAccounts$ = observableOf([]);
        }
    }

    private async prepareCompanyCountryAndCurrencyFromProfile(profile) {
        if (profile) {
            this.customerCountryName = profile.country;
            this.showGstAndTrnUsingCountryName(profile.country);

            this.companyCurrency = profile.baseCurrency || 'INR';
            this.baseCurrencySymbol = profile.baseCurrencySymbol;
            this.depositCurrSymbol = this.baseCurrencySymbol;
            this.companyCurrencyName = profile.baseCurrency;

            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
            if (profile.countryCode) {
                this.companyCountryCode = profile.countryCode;
            } else if (profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                this.companyCountryCode = profile.countryV2.alpha2CountryCode;
            }
            if (!this.isUpdateMode) {
                await this.getUpdatedStateCodes(this.companyCountryCode);
                await this.getUpdatedStateCodes(this.companyCountryCode, true);
            }
        } else {
            this.customerCountryName = '';
            this.showGstAndTrnUsingCountryName('');
            this.companyCurrency = 'INR';
        }
    }

    /**
     * Fetches the currency exchange rate between two countries
     *
     * @param {*} to Converted to currency symbol
     * @param {*} from Converted from currency symbol
     * @param {string} [date=moment().format(GIDDH_DATE_FORMAT)] Date on which currency rate is required, default is today's date
     * @memberof ProformaInvoiceComponent
     */
    public getCurrencyRate(to, from, date = moment().format(GIDDH_DATE_FORMAT)): void {
        if (from && to) {
            this.ledgerService.GetCurrencyRateNewApi(from, to, date).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                let rate = response.body;
                if (rate) {
                    this.previousExchangeRate = this.exchangeRate;
                    this.originalExchangeRate = rate;
                    this.exchangeRate = rate;
                    if (from !== to) {
                        // Multi currency case
                        //this.recalculateEntriesTotal();
                    }
                }
            }, (error => {

            }));
        }
    }

    /**
     * This will fill the selected address
     *
     * @param {*} data
     * @param {*} address
     * @memberof ProformaInvoiceComponent
     */
    public selectAddress(data: any, address: any): void {
        if (data && address) {
            data.address[0] = address.address;
            if (!data.state) {
                data.state = {};
            }

            data.state.code = (address.state) ? address.state.code : "";
            data.stateCode = data.state.code;
            data.state.name = (address.state) ? address.state.name : "";
            data.stateName = data.state.name;
            data.gstNumber = address.gstNumber;
            data.pincode = address.pincode;
            this.autoFillShippingDetails();
        }
    }

    public sendEmail(request: string | { email: string, invoiceType: string[] }): void {
        request = request as { email: string, invoiceType: string[] };
        this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.receiptResponse?.account?.uniqueName, {
            emailId: request.email.split(','),
            voucherNumber: [this.receiptResponse?.number],
            voucherType: this.receiptResponse?.type,
            typeOfInvoice: request.invoiceType ? request.invoiceType : []
        }));
        this.cancelEmailModal();
    }

    public cancelEmailModal(): void {
        this.dialogRef.close();
    }

    public resetForm(formObj: NgForm): void {
        if (formObj) {
            formObj.form.reset();
        }
        this.receiptFormData = new Receipt();
        this.receiptFormData.type = "receipt";
        this.receiptFormData.date = this.universalDate;
        this.forceClear$ = observableOf({ status: true });
        this.allowFocus = true;
        this.focusInCustomerName();
        this.isMulticurrencyAccount = false;
        this.accountAddressList = [];
    }

    public switchCurrencyImg(switchCurrency: boolean): void {
        this.showSwitchCurrency = switchCurrency;
        if (switchCurrency) {
            this.reverseExchangeRate = this.exchangeRate ? 1 / this.exchangeRate : 0;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
        } else {
            this.exchangeRate = this.reverseExchangeRate ? 1 / this.reverseExchangeRate : 0;
            this.originalExchangeRate = this.exchangeRate;
        }
    }

    public saveCancelExchangeRate(toSave: boolean): void {
        if (toSave) {
            if (this.showSwitchCurrency) {
                this.exchangeRate = this.reverseExchangeRate ? 1 / this.reverseExchangeRate : 0;
            } else {
                this.originalExchangeRate = this.exchangeRate;
            }
            this.autoSaveIcon = !this.autoSaveIcon;
            this.showCurrencyValue = !this.showCurrencyValue;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
            this.calculateTotals();
        } else {
            this.showCurrencyValue = !this.showCurrencyValue;
            this.autoSaveIcon = !this.autoSaveIcon;
            this.exchangeRate = this.originalExchangeRate;
            this.reverseExchangeRate = this.originalReverseExchangeRate;
        }
    }

    public createReceipt(formObj: NgForm, templateRef?: TemplateRef<any>): void {
        if (this.receiptFormData.date) {
            this.receiptFormData.date = moment(this.receiptFormData.date).format(GIDDH_DATE_FORMAT);
            this.receiptFormData.entries[0].date = this.receiptFormData.date;
        }

        if (this.receiptFormData.entries[0].chequeClearanceDate) {
            this.receiptFormData.entries[0].chequeClearanceDate = moment(this.receiptFormData.entries[0].chequeClearanceDate).format(GIDDH_DATE_FORMAT);
        }

        if (this.isAdvanceReceipt) {
            this.receiptFormData.subVoucher = SubVoucher.AdvanceReceipt;
        }

        let selectedTaxes = [];
        this.receiptFormData.entries[0].taxes.filter(tax => tax.isChecked).forEach(tax => {
            selectedTaxes.push({uniqueName: tax.uniqueName});
        });

        this.receiptFormData.entries[0].taxes = selectedTaxes;

        this.salesService.generateGenericItem(this.receiptFormData, true).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === "success") {
                    this.toaster.showSnackBar("success", "Receipt created successfully.");
                    this.resetForm(formObj);

                    this.receiptResponse = response.body;

                    if(templateRef) {
                        this.dialogRef = this.dialog.open(templateRef, {
                            width: '500px'
                        });
                    }
                } else {
                    this.toaster.showSnackBar("error", response.message);
                }
            } else {
                this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
            }
        });
    }

    public calculateTotals(): void {
        this.totals.subTotal = this.receiptFormData.entries[0].transactions[0].amount.amountForAccount;
        if(isNaN(this.totals.subTotal)) {
            this.totals.subTotal = 0;
        }

        this.totals.grandTotal = giddhRoundOff(this.totals.subTotal, this.giddhBalanceDecimalPlaces);
        if(this.isMulticurrencyAccount) {
            this.totals.grandTotalMultiCurrency = giddhRoundOff(this.totals.grandTotal * this.exchangeRate, this.giddhBalanceDecimalPlaces);
        }
    }

    public calculateTax(): void {
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;
        this.receiptFormData.entries[0].taxes.filter(tax => tax.isChecked).forEach(tax => {
            if (tax.type === 'gstcess') {
                cessPercentage += tax.amount;
            } else {
                taxPercentage += tax.amount;
            }
        });

        const taxSum = (taxPercentage * this.totals.subTotal) / (100 + taxPercentage);
        const cessSum = (cessPercentage * this.totals.subTotal) / (100 + cessPercentage);

        this.totals.taxTotal = giddhRoundOff(taxSum + cessSum, this.giddhBalanceDecimalPlaces);
        if(isNaN(this.totals.taxTotal)) {
            this.totals.taxTotal = 0;
        }
    }

    public cancelPrintModal(): void {
        this.dialogRef.close();
    }
}