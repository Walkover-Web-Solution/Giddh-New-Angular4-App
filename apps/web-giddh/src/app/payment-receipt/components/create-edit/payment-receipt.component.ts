import { animate, state, style, transition, trigger } from "@angular/animations";
import { TitleCasePipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { select, Store } from "@ngrx/store";
import * as dayjs from "dayjs";
import { UploaderOptions, UploadInput, UploadOutput } from "ngx-uploader";
import { combineLatest, Observable, of as observableOf, ReplaySubject } from "rxjs";
import { auditTime, take, takeUntil } from "rxjs/operators";
import { CommonActions } from "../../../actions/common.actions";
import { CompanyActions } from "../../../actions/company.actions";
import { InvoiceActions } from "../../../actions/invoice/invoice.actions";
import { InvoiceReceiptActions } from "../../../actions/invoice/receipt/receipt.actions";
import { SalesActions } from "../../../actions/sales/sales.action";
import { Configuration, SearchResultText, SubVoucher } from "../../../app.constant";
import { cloneDeep, find, isEqual, orderBy, uniqBy } from "../../../lodash-optimized";
import { AccountResponseV2, AddAccountRequest, UpdateAccountRequest } from "../../../models/api-models/Account";
import { OnboardingFormRequest } from "../../../models/api-models/Common";
import { TaxResponse } from "../../../models/api-models/Company";
import { AccountDetailsClass, IForceClear, PaymentReceipt, PaymentReceiptTransaction, StateCode, VoucherTypeEnum } from "../../../models/api-models/Sales";
import { LEDGER_API } from "../../../services/apiurls/ledger.api";
import { GeneralService } from "../../../services/general.service";
import { LedgerService } from "../../../services/ledger.service";
import { SalesService } from "../../../services/sales.service";
import { SearchService } from "../../../services/search.service";
import { ToasterService } from "../../../services/toaster.service";
import { GIDDH_DATE_FORMAT } from "../../../shared/helpers/defaultDateFormat";
import { giddhRoundOff } from "../../../shared/helpers/helperFunctions";
import { AppState } from "../../../store";
import { ConfirmModalComponent } from "../../../theme/new-confirm-modal/confirm-modal.component";
import { IOption } from "../../../theme/ng-virtual-select/sh-options.interface";
import { SalesShSelectComponent } from "../../../theme/sales-ng-virtual-select/sh-select.component";

@Component({
    selector: 'payment-receipt',
    templateUrl: './payment-receipt.component.html',
    styleUrls: ['./payment-receipt.component.scss'],
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
export class PaymentReceiptComponent implements OnInit, OnDestroy {
    /** Customer name dropdown instance */
    @ViewChild('customerNameDropDown', { static: false }) public customerNameDropDown: SalesShSelectComponent;
    /** Billing state instance */
    @ViewChild('billingState', { static: true }) billingState: ElementRef;
    /** Shipping state instance */
    @ViewChild('shippingState', { static: true }) shippingState: ElementRef;
    /** Instance of send email modal */
    @ViewChild('sendEmailModal', { static: false }) public sendEmailModal: any;
    /** Instance of print modal */
    @ViewChild('sendPrintModal', { static: false }) public sendPrintModal: any;
    /** Observable to store list of customers */
    public customerAccounts$: Observable<IOption[]>;
    /** Form object */
    public voucherFormData: PaymentReceipt;
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
    /** Holds the group for add/edit account */
    public selectedGroupUniqueName: string = '';
    /** Stores the search results */
    public searchResults: Array<IOption> = [];
    /** Holds the list of sundry debtors */
    private sundryDebtorsAccountsList: IOption[] = [];
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** No results found label for dynamic search */
    public noResultsFoundLabel = SearchResultText.NewSearch;
    /** Observable for force clear sh-select */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** File upload options */
    public fileUploadOptions: UploaderOptions;
    /** Emitted for upload input */
    public uploadInput: EventEmitter<UploadInput>;
    /** True if file is uploading */
    public isFileUploading: boolean = false;
    /** True if is uploading */
    public isLoading: boolean = false;
    /** Holds selected file name */
    public selectedFileName: string = '';
    /** This will handle if focus should go in customer/vendor dropdown */
    public allowFocus: boolean = true;
    /** True if update mode */
    public isUpdateMode: boolean = false;
    /** Holds active company data */
    public activeCompany: any = {};
    /** Observable for bank accounts */
    public bankAccounts$: Observable<IOption[]>;
    /** List of bank account for dropdown list */
    public bankAccounts: IOption[] = [];
    /** control for the MatSelect filter keyword */
    public searchBankAccount: FormControl = new FormControl();
    /** control for the MatSelect filter keyword */
    public searchBillingStates: FormControl = new FormControl();
    /** control for the MatSelect filter keyword */
    public searchShippingStates: FormControl = new FormControl();
    /** Input mask format */
    public inputMaskFormat: string = '';
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds state of account aside menu */
    public accountAsideMenuState: string = 'out';
    /** Selected customer details */
    public selectedCustomerForDetails: string = null;
    /** Holds session key observable */
    public sessionKey$: Observable<string>;
    /** Company taxes observable */
    public companyTaxesList$: Observable<TaxResponse[]>;
    /** Holds company taxes list */
    public companyTaxesList: TaxResponse[] = [];
    /** Allowed taxes list contains the unique name of all tax types within a company and count upto which they are allowed */
    public allowedSelectionOfAType: any = { type: [], count: 1 };
    /** This will hold account addresses */
    public accountAddressList: any[] = [];
    /** True if auto fill shipping is enabled */
    public autoFillShipping: boolean = true;
    /** Holds customer country name */
    public customerCountryName: string = '';
    /** Holds customer country code */
    public customerCountryCode: string = '';
    /** Force clear for billing-shipping dropdown */
    public billingShippingForceClearReactive$: Observable<IForceClear> = observableOf({ status: false });
    /** Billing States list */
    public filteredBillingStates: IOption[] = [];
    /** Shipping States list */
    public filteredShippingStates: IOption[] = [];
    /** States list */
    public statesSource: IOption[] = [];
    /** This will hold states list with respect to country */
    public countryStates: any[] = [];
    /** True, if the Giddh supports the taxation of the country (not supported now: UK, US, Nepal, Australia) */
    public shouldShowTrnGstField: boolean = false;
    /** Holds onboarding form fields */
    public formFields: any[] = [];
    /** This will hold onboarding api form request */
    public onboardingFormRequest: OnboardingFormRequest = { formName: '', country: '' };
    /** True if we need to show GSTIN number */
    public showGstinNo: boolean;
    /** True if we need to show TRN number */
    public showTrnNo: boolean;
    /** Holds company currency */
    public companyCurrency: string;
    /* This will hold the company country name */
    public companyCountryName: string = '';
    /** Holds true if it's multi currency account */
    public isMultiCurrencyAccount = false;
    /** Holds company currency name */
    public companyCurrencyName: string;
    /** Holds exchange rate */
    public exchangeRate = 1;
    /** Original exchange rate */
    public originalExchangeRate = 1;
    /** Stores the previous exchange rate of previous debtor */
    public previousExchangeRate = 1;
    /** Holds Company country code */
    public companyCountryCode: string = '';
    /** True if it's advance receipt */
    public isAdvanceReceipt: boolean = false;
    /** Holds universal date */
    public universalDate: any;
    /** True if we need to show switch currency */
    public showSwitchCurrency: boolean = false;
    /** Holds reverse exchange rate */
    public reverseExchangeRate: number;
    /** Holds original reverse exchange rate */
    public originalReverseExchangeRate: number;
    /** True if we need to show currency value */
    public showCurrencyValue: boolean = false;
    /** True if should show autosave icon */
    public autoSaveIcon: boolean = false;
    /** Holds totals object */
    public totals: any = { subTotal: 0, taxTotal: 0, grandTotal: 0, grandTotalMultiCurrency: 0 };
    /** Holds decimal places based on settings */
    public giddhBalanceDecimalPlaces: number = 2;
    /** Holds response after saving voucher */
    public paymentReceiptResponse: any;
    /** Reference of dialog */
    private dialogRef: any;
    /** Holds images folder path */
    public imgPath: string = '';
    /** Holds true if form is valid */
    public isValidForm: boolean = true;
    /** Holds selected taxes */
    public selectedTaxes: any[] = [];
    /** Holds receipt voucher type */
    public receiptVoucherType: string = VoucherTypeEnum.receipt;
    /** Holds payment voucher type */
    public paymentVoucherType: string = VoucherTypeEnum.payment;
    /** Holds voucher data */
    public voucherDetails$: Observable<any>;
    /** Holds account data */
    private selectedAccountDetails$: Observable<AccountResponseV2>;
    /** True if we need to show loader */
    public showLoader: boolean = true;
    /** This will hold boolean based on edit form is prefilled or not */
    private isEditFormPrefilled: boolean = false;
    /** This holds boolean if tax number is valid/invalid */
    private isValidTaxNumber: boolean = false;
    /** This holds query params for edit voucher */
    public queryParams: any = {};
    /** True if voucher date is invalid */
    public isInvalidVoucherDate: boolean = false;
    /** True if cheque date is invalid */
    public isInvalidChequeDate: boolean = false;

    /** @ignore */
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
        private invoiceActions: InvoiceActions,
        private route: ActivatedRoute,
        private titleCasePipe: TitleCasePipe,
        private invoiceReceiptAction: InvoiceReceiptActions,
        private router: Router,
        private generalService: GeneralService
    ) {
        this.voucherFormData = new PaymentReceipt();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.store.dispatch(this.invoiceReceiptAction.ResetVoucherDetails());
            if (params?.voucherType) {
                this.voucherFormData.type = params.voucherType;
            }
            if (params?.uniqueName) {
                this.queryParams = params;
                this.getVoucherDetails(params);
            }
        });

        this.selectedAccountDetails$ = this.store.pipe(select(state => state.sales.acDtl), takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.pipe(select(state => state.session.user.session.id), takeUntil(this.destroyed$));
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
            if (response) {
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

        this.selectedAccountDetails$.subscribe(response => {
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
                    this.universalDate = dayjs(dateObj[1]).toDate();
                    this.voucherFormData.date = this.universalDate;
                } catch (e) {
                    this.universalDate = new Date();
                }
            }
        });

        this.voucherDetails$ = this.store.pipe(select(state => { return state.receipt.voucher as any; }), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof PaymentReceiptComponent
     */
    public ngOnInit(): void {
        if (this.generalService.voucherApiVersion === 1) {
            this.router.navigate(['pages', 'home']);
        }

        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        this.loadDefaultSearchSuggestions();
        this.loadBankCashAccounts('');

        if (this.voucherFormData.type === this.receiptVoucherType) {
            this.store.dispatch(this.companyActions.getTax());
        }

        this.uploadInput = new EventEmitter<UploadInput>();
        this.fileUploadOptions = { concurrency: 0 };

        // listen for search field value changes
        this.searchBankAccount.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            this.filterBankAccounts(search);
        });

        this.searchBillingStates.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            this.filterStates(search, true);
        });

        this.searchShippingStates.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            this.filterStates(search, false);
        });

        combineLatest([this.voucherDetails$, this.selectedAccountDetails$]).pipe(takeUntil(this.destroyed$), auditTime(700)).subscribe(response => {
            if (!this.isEditFormPrefilled && response && response[0] && response[1]) {
                this.isEditFormPrefilled = true;

                let accountDetails = response[0].account;
                if (!accountDetails?.billingDetails?.country) {
                    accountDetails.billingDetails.country = {
                        code: '',
                        name: ''
                    }
                }
                if (!accountDetails?.billingDetails?.state) {
                    accountDetails.billingDetails.state = {
                        code: '',
                        name: ''
                    }
                }

                if (!accountDetails?.shippingDetails?.country) {
                    accountDetails.shippingDetails.country = {
                        code: '',
                        name: ''
                    }
                }
                if (!accountDetails?.shippingDetails?.state) {
                    accountDetails.shippingDetails.state = {
                        code: '',
                        name: ''
                    }
                }

                this.voucherFormData.account = accountDetails;
                this.voucherFormData.attachedFiles = response[0].attachedFiles;
                this.selectedFileName = response[0].attachedFileName;
                this.voucherFormData.date = dayjs(response[0].date, GIDDH_DATE_FORMAT).toDate();

                let entryLoop = 0;
                response[0].entries.forEach(entry => {
                    let transactionLoop = 0;
                    entry.transactions.forEach(transaction => {
                        if (!this.voucherFormData.entries[entryLoop].transactions[transactionLoop]) {
                            this.voucherFormData.entries[entryLoop].transactions[transactionLoop] = new PaymentReceiptTransaction();
                        }
                        this.voucherFormData.entries[entryLoop].transactions[transactionLoop] = {
                            account: {
                                name: transaction.account.name,
                                uniqueName: transaction.account.uniqueName
                            },
                            amount: {
                                amountForAccount: transaction.amount.amountForAccount
                            }
                        };

                        if (entry.chequeClearanceDate) {
                            this.voucherFormData.entries[entryLoop].chequeClearanceDate = dayjs(entry.chequeClearanceDate, GIDDH_DATE_FORMAT).toDate();
                        }
                        this.voucherFormData.entries[entryLoop].chequeNumber = entry.chequeNumber;
                        this.voucherFormData.entries[entryLoop].date = this.voucherFormData.date;

                        entry.taxes?.forEach(entryTax => {
                            let selectedTax = this.companyTaxesList.find(tax => tax.uniqueName === entryTax.uniqueName);
                            entryTax.name = entryTax?.name || selectedTax?.name || entryTax?.uniqueName;
                            entryTax.isChecked = true;
                        });

                        this.voucherFormData.entries[entryLoop].taxes = entry.taxes;

                        transactionLoop++;
                    });
                    entryLoop++;
                });

                if (response[0].templateDetails?.other?.message2) {
                    this.voucherFormData.templateDetails = response[0].templateDetails;
                }

                this.searchBillingStates.setValue({ label: accountDetails.billingDetails?.state?.name });
                this.searchShippingStates.setValue({ label: accountDetails.shippingDetails?.state?.name });
                this.searchBankAccount.setValue({ label: this.voucherFormData.entries[0]?.transactions[0]?.account?.name });

                this.exchangeRate = response[0].exchangeRate;
                this.originalExchangeRate = this.exchangeRate;
                this.voucherFormData.exchangeRate = response[0].exchangeRate;
                this.voucherFormData.subVoucher = response[0].subVoucher;
                this.voucherFormData.updateAccountDetails = true;
                this.voucherFormData.uniqueName = response[0].uniqueName;
                this.allowFocus = false;

                this.autoFillShipping = isEqual(this.voucherFormData.account?.billingDetails, this.voucherFormData.account?.shippingDetails);

                if (this.voucherFormData.subVoucher) {
                    this.isAdvanceReceipt = true;
                }

                this.calculateTax();
                this.calculateTotals();
                this.startLoading(false);
            }
        });
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof PaymentReceiptComponent
     */
    public ngOnDestroy(): void {
        this.resetForm();
        this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
        this.store.dispatch(this.invoiceReceiptAction.ResetVoucherDetails());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Move group filter for customer list
     *
     * @param {string} term
     * @param {IOption} item
     * @returns {boolean}
     * @memberof PaymentReceiptComponent
     */
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

    /**
     * Scroll to bottom handler
     *
     * @param {string} searchType Search type
     * @memberof PaymentReceiptComponent
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
     * @memberof PaymentReceiptComponent
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
     * @memberof PaymentReceiptComponent
     */
    public getSearchRequestObject(query: string, page: number = 1): any {
        let withStocks: boolean;
        let group: string = (this.voucherFormData.type === "receipt") ? 'sundrydebtors' : 'sundrycreditors';
        this.searchCustomerResultsPaginationData.query = query;
        this.selectedGroupUniqueName = group;
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
     * @memberof PaymentReceiptComponent
     */
    public searchAccount(requestObject: any): Observable<any> {
        return this.searchService.searchAccount(requestObject);
    }

    /**
     * Assigns the search results based on invoice type and search type
     *
     * @private
     * @param {string} searchType Search type made by the user
     * @memberof PaymentReceiptComponent
     */
    private assignSearchResultToList(searchType: string): void {
        this.sundryDebtorsAccountsList = this.searchResults;
    }

    /**
     * This will create customers list
     *
     * @memberof PaymentReceiptComponent
     */
    public makeCustomerList(): void {
        this.customerAccounts$ = observableOf(orderBy(this.sundryDebtorsAccountsList, 'label'));
        this.selectedGroupUniqueName = (this.voucherFormData.type === "receipt") ? 'sundrydebtors' : 'sundrycreditors';

        if (!this.isUpdateMode) {
            this.startLoading(false);
        }
    }

    /**
     * Prepares the search list when the data is received
     *
     * @param {*} results Search results
     * @param {number} [currentPage=1] Current page requested
     * @param {string} searchType Search type of the searched item
     * @memberof PaymentReceiptComponent
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
     * @memberof PaymentReceiptComponent
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

    /**
     * Callback for select customer
     *
     * @param {IOption} item
     * @memberof PaymentReceiptComponent
     */
    public onSelectCustomer(item: IOption): void {
        if (item.value) {
            this.voucherFormData.account.name = item.label;
            this.getAccountDetails(item.value);
        }
    }

    /**
     * This will call api to get account details
     *
     * @param {string} accountUniqueName
     * @memberof PaymentReceiptComponent
     */
    public getAccountDetails(accountUniqueName: string): void {
        this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
    }

    /**
     * Reset the customer name and address list
     *
     * @param {*} event
     * @memberof PaymentReceiptComponent
     */
    public resetCustomerName(event: any): void {
        if (event) {
            if (!event.target?.value) {
                this.voucherFormData.account = new AccountDetailsClass();
                this.accountAddressList = [];
            }
        } else {
            this.voucherFormData.account = new AccountDetailsClass();
            this.accountAddressList = [];
        }
    }

    /**
     * This will open account aside pan to create new account
     *
     * @memberof PaymentReceiptComponent
     */
    public addNewAccount(): void {
        this.allowFocus = false;
        this.selectedCustomerForDetails = null;
        this.toggleAccountAsidePane();
    }

    /**
     * Callback for file upload
     *
     * @param {UploadOutput} output
     * @memberof PaymentReceiptComponent
     */
    public onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            let sessionKey = null;
            let companyUniqueName = this.activeCompany?.uniqueName;
            this.sessionKey$.pipe(take(1)).subscribe(key => sessionKey = key);
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
                this.voucherFormData.attachedFiles = [output.file.response.body?.uniqueName];
                this.toaster.showSnackBar("success", this.localeData?.file_uploaded);
            } else {
                this.isFileUploading = false;
                this.voucherFormData.attachedFiles = [];
                this.toaster.showSnackBar("error", output.file.response.message);
            }
        }
    }

    /**
     * Callback for file change
     *
     * @param {*} event
     * @memberof PaymentReceiptComponent
     */
    public onFileChange(event: any) {
        let file = (event.files as FileList).item(0);
        if (file) {
            this.selectedFileName = file.name;
        } else {
            this.selectedFileName = '';
        }
    }

    /**
     * Loads the default search suggestion for customer and item when voucher module is loaded and
     * when voucher is changed
     *
     * @private
     * @memberof PaymentReceiptComponent
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

    /**
     * This will focus in customer name field and will open the dropdown
     *
     * @private
     * @memberof PaymentReceiptComponent
     */
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
     * @memberof PaymentReceiptComponent
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
     * @memberof PaymentReceiptComponent
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

    /**
     * This will filter bank accounts
     *
     * @private
     * @param {*} search
     * @memberof PaymentReceiptComponent
     */
    private filterBankAccounts(search: any): void {
        let bankAccounts: IOption[] = [];
        this.bankAccounts$?.subscribe(response => {
            if (response) {
                response.forEach(account => {
                    if (typeof search !== "string" || account?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1) {
                        bankAccounts.push({ label: account.label, value: account.value, additional: account });
                    }
                });

                bankAccounts = orderBy(bankAccounts, 'label');
                this.bankAccounts = bankAccounts;
            }
        });
    }

    /**
     * Toggles the account aside pan
     *
     * @param {*} [event]
     * @memberof PaymentReceiptComponent
     */
    public toggleAccountAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * Toggles the fixed class on body
     *
     * @memberof PaymentReceiptComponent
     */
    public toggleBodyClass(): void {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('.invoice-modal-content')?.classList?.add('aside-account-create');
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('.invoice-modal-content')?.classList?.remove('aside-account-create');
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * This will add new account
     *
     * @param {AddAccountRequest} item
     * @memberof PaymentReceiptComponent
     */
    public addNewSidebarAccount(item: AddAccountRequest): void {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }

    /**
     * This will update the account
     *
     * @param {UpdateAccountRequest} item
     * @memberof PaymentReceiptComponent
     */
    public updateSidebarAccount(item: UpdateAccountRequest): void {
        this.store.dispatch(this.salesAction.updateAccountDetailsForSales(item));
    }

    /**
     * This will open account aside pan on the press of shortcut key
     *
     * @memberof PaymentReceiptComponent
     */
    public addAccountFromShortcut(): void {
        if (!this.voucherFormData.account.uniqueName) {
            this.selectedCustomerForDetails = null;
            this.toggleAccountAsidePane();
        }
    }

    /**
     * This will set customer uniquename and will toggle the aside pan
     *
     * @memberof PaymentReceiptComponent
     */
    public getCustomerDetails(): void {
        this.selectedCustomerForDetails = this.voucherFormData.account.uniqueName;
        this.toggleAccountAsidePane();
    }

    /**
     * This will autofill shipping details
     *
     * @memberof PaymentReceiptComponent
     */
    public autoFillShippingDetails(): void {
        if (this.autoFillShipping) {
            this.voucherFormData.account.shippingDetails = cloneDeep(this.voucherFormData.account.billingDetails);
            this.searchShippingStates.setValue(this.searchBillingStates.value);
            if (this.shippingState && this.shippingState.nativeElement) {
                this.shippingState.nativeElement.classList.remove('error-box');
            }
        }
    }

    /**
     * This will copy the billing details in shipping details
     *
     * @param {*} event
     * @param {boolean} isBilling
     * @memberof PaymentReceiptComponent
     */
    public fillShippingBillingDetails(event: any, isBilling: boolean): void {
        let selectedOption = event?.option?.value;
        let stateCode = selectedOption?.value;
        let stateName = selectedOption?.label;

        if (isBilling) {
            // update account details address if it's billing details
            if (this.billingState && this.billingState.nativeElement) {
                this.billingState.nativeElement.classList.remove('error-box');
            }
            this.voucherFormData.account.billingDetails.state.code = stateCode;
            this.voucherFormData.account.billingDetails.state.name = stateName;

            if (this.autoFillShipping) {
                this.voucherFormData.account.shippingDetails.state.code = stateCode;
                this.voucherFormData.account.shippingDetails.state.name = stateName;
                this.searchShippingStates.setValue(stateName);
            }
        } else {
            if (this.shippingState && this.shippingState.nativeElement) {
                this.shippingState.nativeElement.classList.remove('error-box');
            }
            this.voucherFormData.account.shippingDetails.state.code = stateCode;
            this.voucherFormData.account.shippingDetails.state.name = stateName;
        }
    }

    /**
     * Returns the promise once the state list is successfully
     * fetched to carry outn further operations
     *
     * @private
     * @param {*} countryCode Country code for the user
     * @returns Promise to carry out further operations
     * @memberof PaymentReceiptComponent
     */
    private getUpdatedStateCodes(countryCode: any): Promise<any> {
        return new Promise((resolve: Function) => {
            if (countryCode) {
                if (this.countryStates[countryCode]) {
                    this.statesSource = this.countryStates[countryCode];
                    this.filteredBillingStates = cloneDeep(this.statesSource);
                    this.filteredShippingStates = cloneDeep(this.statesSource);
                    resolve();
                } else {
                    this.salesService.getStateCode(countryCode).pipe(takeUntil(this.destroyed$)).subscribe(resp => {
                        this.statesSource = this.modifyStateResponse((resp.body) ? resp.body.stateList : [], countryCode);
                        this.filteredBillingStates = cloneDeep(this.statesSource);
                        this.filteredShippingStates = cloneDeep(this.statesSource);
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

    /**
     * This will modify states list response
     *
     * @private
     * @param {StateCode[]} stateList
     * @param {string} countryCode
     * @returns {*}
     * @memberof PaymentReceiptComponent
     */
    private modifyStateResponse(stateList: StateCode[], countryCode: string): any {
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
     * @memberof PaymentReceiptComponent
     */
    public getOnboardingForm(countryCode: string): void {
        if (this.onboardingFormRequest.country !== countryCode) {
            this.onboardingFormRequest.formName = 'onboarding';
            this.onboardingFormRequest.country = countryCode;
            this.store.dispatch(this.commonActions.GetOnboardingForm(this.onboardingFormRequest));
        }
    }

    /**
     * This will hide/show GSTIN/TRN based on country
     *
     * @private
     * @param {string} name
     * @memberof PaymentReceiptComponent
     */
    private showGstAndTrnUsingCountryName(name: string): void {
        if (this.activeCompany?.country === name) {
            if (name === 'India') {
                this.showGstinNo = true;
                this.showTrnNo = false;
                this.getOnboardingForm('IN')
            } else if (name === 'United Arab Emirates') {
                this.showGstinNo = false;
                this.showTrnNo = true;
                this.getOnboardingForm('AE')
            }
        } else {
            this.showGstinNo = false;
            this.showTrnNo = false;
        }
    }

    /**
     * This will assign the account details in object
     *
     * @param {AccountResponseV2} data
     * @memberof PaymentReceiptComponent
     */
    public assignAccountDetailsValuesInForm(data: AccountResponseV2): void {
        this.accountAddressList = data.addresses;
        this.customerCountryName = data.country?.countryName;
        this.customerCountryCode = data?.country?.countryCode || 'IN';
        this.initializeAccountCurrencyDetails(data);
        this.showGstAndTrnUsingCountryName(this.customerCountryName);
        this.prepareSearchLists([{
            name: data.name,
            uniqueName: data.uniqueName
        }], 1, "customer");
        this.makeCustomerList();
        this.loadBankCashAccounts(data.currency);

        this.getUpdatedStateCodes(data.country?.countryCode).then(() => {
            if (data.addresses && data.addresses.length) {
                data.addresses = [find(data.addresses, (tax) => tax.isDefault)];
            }
            // auto fill all the details
            this.voucherFormData.account = new AccountDetailsClass(data);
            this.voucherFormData.account.currencyCode = this.voucherFormData.account.currency.code;

            this.searchBillingStates.setValue({ label: this.voucherFormData.account.billingDetails?.state?.name });
            this.searchShippingStates.setValue({ label: this.voucherFormData.account.shippingDetails?.state?.name });

            setTimeout(() => {
                this.changeDetectionRef.detectChanges();
            }, 50);
        });
    }

    /**
     * Initializes acounnt currency details
     *
     * @param {AccountResponseV2} item Account details
     * @memberof PaymentReceiptComponent
     */
    public initializeAccountCurrencyDetails(item: AccountResponseV2): void {
        // If currency of item is null or undefined then treat it to be equivalent of company currency
        item.currency = item.currency || this.companyCurrency;
        this.isMultiCurrencyAccount = item.currency !== this.companyCurrency;
        if (item.addresses && item.addresses.length > 0) {
            item.addresses.forEach(address => {
                if (address && address.isDefault) {
                    const defaultAddress: any = address;
                    this.voucherFormData.account.billingDetails.pincode = defaultAddress.pincode;
                    this.voucherFormData.account.shippingDetails.pincode = defaultAddress.pincode;
                }
            });
        }
        if (this.isMultiCurrencyAccount) {
            this.companyCurrencyName = item.currency;
        }

        if (item && item.currency && item.currency !== this.companyCurrency) {
            if (this.voucherFormData.date) {
                this.getCurrencyRate(this.companyCurrency, item.currency, dayjs(this.voucherFormData.date).format(GIDDH_DATE_FORMAT));
            }
        } else {
            this.previousExchangeRate = this.exchangeRate;
            this.originalExchangeRate = 1;
            this.exchangeRate = 1;
            this.calculateTotals();
        }

        if (this.isMultiCurrencyAccount) {
            this.bankAccounts$ = observableOf([]);
        }
    }

    /**
     * This will set the details based on profile
     *
     * @private
     * @param {*} profile
     * @returns {Promise<void>}
     * @memberof PaymentReceiptComponent
     */
    private async prepareCompanyCountryAndCurrencyFromProfile(profile: any): Promise<void> {
        if (profile) {
            this.companyCurrency = profile.baseCurrency || 'INR';
            this.companyCurrencyName = profile.baseCurrency;

            this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';
            if (profile.countryCode) {
                this.companyCountryCode = profile.countryCode;
            } else if (profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                this.companyCountryCode = profile.countryV2.alpha2CountryCode;
            }
            if (!this.isUpdateMode) {
                await this.getUpdatedStateCodes(this.companyCountryCode);
            }
        } else {
            this.customerCountryName = '';
            this.companyCurrency = 'INR';
        }
    }

    /**
     * Fetches the currency exchange rate between two countries
     *
     * @param {*} to Converted to currency symbol
     * @param {*} from Converted from currency symbol
     * @param {string} [date=dayjs().format(GIDDH_DATE_FORMAT)] Date on which currency rate is required, default is today's date
     * @memberof PaymentReceiptComponent
     */
    public getCurrencyRate(to: any, from: any, date = dayjs().format(GIDDH_DATE_FORMAT)): void {
        if (from && to && !this.isUpdateMode) {
            this.ledgerService.GetCurrencyRateNewApi(from, to, date).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                let rate = response.body;
                if (rate) {
                    this.previousExchangeRate = this.exchangeRate;
                    this.originalExchangeRate = rate;
                    this.exchangeRate = rate;
                    if (from !== to) {
                        // Multi currency case
                        this.calculateTotals();
                    }
                }
            });
        }
    }

    /**
     * This will fill the selected address
     *
     * @param {*} data
     * @param {*} address
     * @param {boolean} isBillingAddress
     * @memberof PaymentReceiptComponent
     */
    public selectAddress(data: any, address: any, isBillingAddress: boolean): void {
        if (data && address) {
            data.address[0] = address.address;
            if (!data.state) {
                data.state = {};
            }

            data.state.code = (address.state) ? address.state.code : "";
            data.state.name = (address.state) ? address.state.name : "";
            data.taxNumber = address.gstNumber;
            data.pincode = address.pincode;

            if (isBillingAddress) {
                this.searchBillingStates.setValue({ label: data.state.name });
                this.autoFillShippingDetails();
            } else {
                this.searchShippingStates.setValue({ label: data.state.name });
            }
        }
    }

    /**
     * This will send email
     *
     * @param {*} event
     * @memberof PaymentReceiptComponent
     */
    public sendEmail(event: any): void {
        if (event) {
            this.store.dispatch(this.invoiceActions.SendInvoiceOnMail(this.paymentReceiptResponse?.account?.uniqueName, {
                emailId: event.email?.split(','),
                voucherNumber: [this.paymentReceiptResponse?.number],
                voucherType: this.paymentReceiptResponse?.type,
                typeOfInvoice: event.downloadCopy ? event.downloadCopy : []
            }));
        }
    }

    /**
     * This will reset form
     *
     * @param {NgForm} formObj
     * @memberof PaymentReceiptComponent
     */
    public resetForm(formObj?: NgForm): void {
        const voucherType = this.voucherFormData.type;
        if (formObj) {
            formObj.form.reset();
        }
        this.voucherFormData = new PaymentReceipt();
        this.voucherFormData.type = voucherType;
        this.voucherFormData.date = this.universalDate;
        this.forceClear$ = observableOf({ status: true });
        this.allowFocus = true;
        this.focusInCustomerName();
        this.isMultiCurrencyAccount = false;
        this.accountAddressList = [];
        this.isValidForm = true;
        this.autoFillShipping = true;
        this.totals = { subTotal: 0, taxTotal: 0, grandTotal: 0, grandTotalMultiCurrency: 0 };
        this.searchBillingStates.setValue({ label: "" });
        this.searchShippingStates.setValue({ label: "" });
        this.searchBankAccount.setValue({ label: "" });
    }

    /**
     * This will switch currency
     *
     * @param {boolean} switchCurrency
     * @memberof PaymentReceiptComponent
     */
    public switchCurrency(switchCurrency: boolean): void {
        this.showSwitchCurrency = switchCurrency;
        if (switchCurrency) {
            this.reverseExchangeRate = this.exchangeRate ? 1 / this.exchangeRate : 0;
            this.originalReverseExchangeRate = this.reverseExchangeRate;
        } else {
            this.exchangeRate = this.reverseExchangeRate ? 1 / this.reverseExchangeRate : 0;
            this.originalExchangeRate = this.exchangeRate;
        }
    }

    /**
     * This will save/cancel the input exchange rate
     *
     * @param {boolean} toSave
     * @memberof PaymentReceiptComponent
     */
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

    /**
     * This will create voucher
     *
     * @param {NgForm} formObj
     * @param {TemplateRef<any>} [templateRef]
     * @returns {void}
     * @memberof PaymentReceiptComponent
     */
    public createVoucher(formObj: NgForm, templateRef?: TemplateRef<any>): void {
        this.isValidForm = true;
        this.isLoading = false;

        if (!this.voucherFormData.account.uniqueName?.trim() || !this.voucherFormData.date || !this.voucherFormData.entries[0].transactions[0].amount
            .amountForAccount || !this.voucherFormData.entries[0].transactions[0].account.uniqueName || (this.isAdvanceReceipt && this.selectedTaxes?.length === 0)) {
            this.isValidForm = false;
            return;
        }

        this.isLoading = true;

        if (this.voucherFormData.date) {
            this.voucherFormData.date = dayjs(this.voucherFormData.date).format(GIDDH_DATE_FORMAT);
            this.voucherFormData.entries[0].date = this.voucherFormData.date;
        }

        if (this.voucherFormData.entries[0].chequeClearanceDate) {
            this.voucherFormData.entries[0].chequeClearanceDate = dayjs(this.voucherFormData.entries[0].chequeClearanceDate).format(GIDDH_DATE_FORMAT);
        }

        if (this.isAdvanceReceipt) {
            this.voucherFormData.subVoucher = SubVoucher.AdvanceReceipt;
        }

        let selectedTaxes = [];
        this.voucherFormData.entries[0].taxes.filter(tax => tax.isChecked).forEach(tax => {
            selectedTaxes.push({ uniqueName: tax.uniqueName });
        });

        this.voucherFormData.entries[0].taxes = selectedTaxes;
        this.voucherFormData.exchangeRate = this.exchangeRate;

        this.salesService.generateGenericItem(this.voucherFormData, true).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === "success") {
                    let message = this.localeData?.voucher_created;
                    message = message.replace("[VOUCHER]", this.titleCasePipe.transform(this.voucherFormData.type));
                    message = message.replace("[VOUCHER_NUMBER]", response.body?.number);
                    this.toaster.showSnackBar("success", message);
                    this.resetForm(formObj);

                    this.paymentReceiptResponse = response.body;

                    if (templateRef) {
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
            this.isLoading = false;
        });
    }

    /**
     * This will calculate totals
     *
     * @memberof PaymentReceiptComponent
     */
    public calculateTotals(): void {
        this.totals.subTotal = this.voucherFormData.entries[0].transactions[0].amount.amountForAccount;
        if (isNaN(this.totals.subTotal)) {
            this.totals.subTotal = 0;
        }

        this.totals.grandTotal = giddhRoundOff(this.totals.subTotal, this.giddhBalanceDecimalPlaces);
        if (this.isMultiCurrencyAccount) {
            this.totals.grandTotalMultiCurrency = giddhRoundOff(this.totals.grandTotal * this.exchangeRate, this.giddhBalanceDecimalPlaces);
        }
    }

    /**
     * This will calculate tax if tax is selected/changed
     *
     * @memberof PaymentReceiptComponent
     */
    public calculateTax(): void {
        let taxPercentage: number = 0;
        let cessPercentage: number = 0;
        this.selectedTaxes = [];
        this.voucherFormData.entries[0].taxes.filter(tax => tax.isChecked).forEach(tax => {
            this.selectedTaxes.push(tax);
            if (tax.type === 'gstcess') {
                cessPercentage += tax.amount;
            } else {
                taxPercentage += tax.amount;
            }
        });

        const taxSum = (taxPercentage * this.totals.subTotal) / (100 + taxPercentage);
        const cessSum = (cessPercentage * this.totals.subTotal) / (100 + cessPercentage);

        this.totals.taxTotal = giddhRoundOff(taxSum + cessSum, this.giddhBalanceDecimalPlaces);
        if (isNaN(this.totals.taxTotal)) {
            this.totals.taxTotal = 0;
        }

        setTimeout(() => {
            this.changeDetectionRef.detectChanges();
        }, 50);
    }

    /**
     * This will close print dialog
     *
     * @memberof PaymentReceiptComponent
     */
    public closePrintDialog(): void {
        this.dialogRef.close();
    }

    /**
     * This will get voucher details
     *
     * @private
     * @param {*} request
     * @memberof PaymentReceiptComponent
     */
    private getVoucherDetails(request: any): void {
        this.isUpdateMode = true;
        this.getAccountDetails(request.accountUniqueName);

        this.store.dispatch(this.invoiceReceiptAction.getVoucherDetailsV4(request.accountUniqueName, {
            voucherType: request.voucherType,
            uniqueName: request.uniqueName
        }));
    }

    /**
     * This will update voucher
     *
     * @returns {void}
     * @memberof PaymentReceiptComponent
     */
    public updateVoucher(): void {
        this.isValidForm = true;
        this.isLoading = false;

        if (!this.voucherFormData.account.uniqueName?.trim() || !this.voucherFormData.date || !this.voucherFormData.entries[0].transactions[0].amount
            .amountForAccount || !this.voucherFormData.entries[0].transactions[0].account.uniqueName || (this.isAdvanceReceipt && this.selectedTaxes?.length === 0)) {
            this.isValidForm = false;
            return;
        }

        this.isLoading = true;

        if (this.voucherFormData.date) {
            this.voucherFormData.date = dayjs(this.voucherFormData.date).format(GIDDH_DATE_FORMAT);
            this.voucherFormData.entries[0].date = this.voucherFormData.date;
        }

        if (this.voucherFormData.entries[0].chequeClearanceDate) {
            this.voucherFormData.entries[0].chequeClearanceDate = dayjs(this.voucherFormData.entries[0].chequeClearanceDate).format(GIDDH_DATE_FORMAT);
        }

        if (this.isAdvanceReceipt) {
            this.voucherFormData.subVoucher = SubVoucher.AdvanceReceipt;
        } else {
            this.voucherFormData.subVoucher = undefined;
        }

        let selectedTaxes = [];
        this.voucherFormData.entries[0].taxes.filter(tax => tax.isChecked).forEach(tax => {
            selectedTaxes.push({ uniqueName: tax.uniqueName });
        });

        this.voucherFormData.entries[0].taxes = selectedTaxes;
        this.voucherFormData.exchangeRate = this.exchangeRate;

        this.salesService.updateVoucherV4(this.voucherFormData).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === "success") {
                    let message = this.localeData?.voucher_updated;
                    message = message.replace("[VOUCHER]", this.titleCasePipe.transform(this.voucherFormData.type));
                    this.toaster.showSnackBar("success", message);

                    this.router.navigate(['/pages/voucher/' + this.voucherFormData.type + '/preview/' + this.voucherFormData.uniqueName + '/' + this.voucherFormData.account?.uniqueName]);
                } else {
                    this.toaster.showSnackBar("error", response.message);
                }
            } else {
                this.toaster.showSnackBar("error", this.commonLocaleData?.app_something_went_wrong);
            }
            this.isLoading = false;
            this.changeDetectionRef.detectChanges();
        });
    }

    /**
     * This will start/stop loader
     *
     * @private
     * @param {boolean} status
     * @memberof PaymentReceiptComponent
     */
    private startLoading(status: boolean): void {
        this.showLoader = status;
        this.changeDetectionRef.detectChanges();
    }

    /**
     * get state code using Tax number to prefill state
     *
     * @param {string} type billingDetails || shipping
     * @param {SalesShSelectComponent} statesElement state input box
     * @memberof PaymentReceiptComponent
     */
    public getStateCode(type: string, statesElement: SalesShSelectComponent): void {
        let gstVal = cloneDeep(this.voucherFormData.account[type].taxNumber).toString();
        if (gstVal && gstVal.length >= 2) {
            const selectedState = this.statesSource.find(item => item.additional?.stateGstCode === gstVal.substring(0, 2));
            if (selectedState) {
                this.voucherFormData.account[type].state.code = selectedState.value;
                statesElement.disabled = true;
            } else {
                this.checkTaxNumberValidation(gstVal);
                if (!this.isValidTaxNumber) {
                    /* Check for valid pattern such as 9918IND29061OSS through which state can't be determined
                        and clear the state only when valid number is not provided */
                    this.voucherFormData.account[type].state.code = null;
                }
                statesElement.disabled = false;
            }
        } else {
            statesElement.disabled = false;
            this.voucherFormData.account[type].state.code = null;
        }
        this.checkTaxNumberValidation(gstVal);
    }

    /**
     * To check Tax number validation using regex get by API
     *
     * @param {*} value Value to be validated
     * @param {string} fieldName Field name for which the value is validated
     * @memberof PaymentReceiptComponent
     */
    public checkTaxNumberValidation(value: any, fieldName?: string): void {
        this.isValidTaxNumber = false;
        if (value) {
            if (this.formFields['taxName'] && this.formFields['taxName']['regex'] && this.formFields['taxName']['regex'].length > 0) {
                for (let key = 0; key < this.formFields['taxName']['regex'].length; key++) {
                    let regex = new RegExp(this.formFields['taxName']['regex'][key]);
                    if (regex.test(value)) {
                        this.isValidTaxNumber = true;
                    }
                }
            } else {
                this.isValidTaxNumber = true;
            }
            if (!this.isValidTaxNumber) {
                this.startLoading(false);
                if (fieldName) {
                    let invalidTax = this.localeData?.invalid_tax_field;
                    invalidTax = invalidTax?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
                    invalidTax = invalidTax?.replace("[FIELD_NAME]", fieldName);
                    this.toaster.showSnackBar("error", invalidTax);
                } else {
                    let invalidTax = this.localeData?.invalid_tax;
                    invalidTax = invalidTax?.replace("[TAX_NAME]", this.formFields['taxName']?.label);
                    this.toaster.showSnackBar("error", invalidTax);
                }
            }
        }
    }

    /**
     * Validates the voucher date
     *
     * @memberof PaymentReceiptComponent
     */
    public validateVoucherDate(): void {
        this.isInvalidVoucherDate = false;
        if (this.voucherFormData.date && dayjs(this.voucherFormData.date).format(GIDDH_DATE_FORMAT) === "Invalid date") {
            this.isInvalidVoucherDate = true;
        }
    }

    /**
     * Validates the cheque date
     *
     * @memberof PaymentReceiptComponent
     */
    public validateChequeDate(): void {
        this.isInvalidChequeDate = false;
        if (this.voucherFormData.entries[0].chequeClearanceDate && dayjs(this.voucherFormData.entries[0].chequeClearanceDate).format(GIDDH_DATE_FORMAT) === "Invalid date") {
            this.isInvalidChequeDate = true;
        }
    }

    /**
     * This will filter states
     *
     * @private
     * @param {*} search
     * @param {boolean} [isBillingStates=true]
     * @memberof PaymentReceiptComponent
     */
    private filterStates(search: any, isBillingStates: boolean = true): void {
        let filteredStates: IOption[] = [];
        this.statesSource.forEach(state => {
            if (typeof search !== "string" || state?.label?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1) {
                filteredStates.push({ label: state.label, value: state.value, additional: state });
            }
        });

        filteredStates = orderBy(filteredStates, 'label');

        if (isBillingStates) {
            this.filteredBillingStates = filteredStates;
        } else {
            this.filteredShippingStates = filteredStates;
        }
    }

    /**
     * Opens confirmation modal to delete attachment
     *
     * @memberof PaymentReceiptComponent
     */
    public showAttachmentDeleteConfirmationModal(): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_confirm,
                body: this.localeData?.confirm_delete_file,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: ' '
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.deleteAttachment();
            }
        });
    }

    /**
     * Deletes the attached file
     *
     * @memberof PaymentReceiptComponent
     */
    public deleteAttachment(): void {
        this.ledgerService.removeAttachment(this.voucherFormData.attachedFiles[0]).subscribe((response) => {
            if (response?.status === 'success') {
                this.selectedFileName = '';
                this.voucherFormData.attachedFiles[0] = '';
                this.toaster.showSnackBar("success", response?.body);
                this.changeDetectionRef.detectChanges();
            } else {
                this.toaster.showSnackBar("error", response?.message)
            }
        });
    }

    /**
     * This will show label value in the search field
     *
     * @param {*} option
     * @returns {string}
     * @memberof PaymentReceiptComponent
     */
    public displayLabel(option: any): string {
        return option?.label;
    }

    /**
     * Select bank callback
     *
     * @param {*} event
     * @memberof PaymentReceiptComponent
     */
    public selectBank(event: any): void {
        this.voucherFormData.entries[0].transactions[0].account.uniqueName = event?.option?.value?.value;
        this.voucherFormData.entries[0].transactions[0].account.name = event?.option?.value?.label;
    }

    /**
     * Resets the value if value not selected from option
     *
     * @param {string} field
     * @memberof PaymentReceiptComponent
     */
    public resetValueIfOptionNotSelected(field: string): void {
        setTimeout(() => {
            switch (field) {
                case "billingState":
                    this.checkAndResetValue(this.searchBillingStates, this.voucherFormData.account.billingDetails.state.name);
                    break;

                case "shippingState":
                    this.checkAndResetValue(this.searchShippingStates, this.voucherFormData.account.shippingDetails.state.name);
                    break;

                case "bankAccount":
                    this.checkAndResetValue(this.searchBankAccount, this.voucherFormData.entries[0].transactions[0].account.name);
                    break;
            }
        }, 200);
    }

    /**
     * Checks and reset value
     *
     * @private
     * @param {FormControl} formControl
     * @param {*} value
     * @memberof PaymentReceiptComponent
     */
    private checkAndResetValue(formControl: FormControl, value: any): void {
        if (typeof formControl?.value !== "object" && formControl?.value !== value) {
            formControl.setValue({ label: value });
        }
    }
}