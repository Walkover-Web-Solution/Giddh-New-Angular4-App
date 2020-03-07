import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { LoginActions } from 'apps/web-giddh/src/app/actions/login.action';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
import { ShareLedgerComponent } from 'apps/web-giddh/src/app/ledger/components/shareLedger/shareLedger.component';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { ShSelectComponent } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-select.component';
import { QuickAccountComponent } from 'apps/web-giddh/src/app/theme/quick-account-component/quickAccount.component';
import { saveAs } from 'file-saver';
import * as moment from 'moment/moment';
import { ModalDirective, PaginationComponent } from 'ngx-bootstrap';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { createSelector } from 'reselect';
import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, Subject, } from 'rxjs';
import { debounceTime, distinctUntilChanged, shareReplay, take, takeUntil } from 'rxjs/operators';
import * as uuid from 'uuid';

import { CompanyActions } from '../actions/company.actions';
import { GeneralActions } from '../actions/general/general.actions';
import { LedgerActions } from '../actions/ledger/ledger.actions';
import { SettingsDiscountActions } from '../actions/settings/discount/settings.discount.action';
import { SettingsTagActions } from '../actions/settings/tag/settings.tag.actions';
import { LoaderService } from '../loader/loader.service';
import { cloneDeep, filter, find, orderBy, uniq } from '../lodash-optimized';
import { AccountResponse } from '../models/api-models/Account';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { ICurrencyResponse, StateDetailsRequest, TaxResponse } from '../models/api-models/Company';
import { GroupsWithAccountsResponse } from '../models/api-models/GroupsWithAccounts';
import { DownloadLedgerRequest, IELedgerResponse, TransactionsRequest, TransactionsResponse, } from '../models/api-models/Ledger';
import { SalesOtherTaxesModal } from '../models/api-models/Sales';
import { AdvanceSearchRequest } from '../models/interfaces/AdvanceSearchRequest';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { ITransactionItem } from '../models/interfaces/ledger.interface';
import { LEDGER_API } from '../services/apiurls/ledger.api';
import { GeneralService } from '../services/general.service';
import { LedgerService } from '../services/ledger.service';
import { ToasterService } from '../services/toaster.service';
import { WarehouseActions } from '../settings/warehouse/action/warehouse.action';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { base64ToBlob, giddhRoundOff } from '../shared/helpers/helperFunctions';
import { AppState } from '../store';
import { IOption } from '../theme/ng-virtual-select/sh-options.interface';
import { AdvanceSearchModelComponent } from './components/advance-search/advance-search.component';
import { NewLedgerEntryPanelComponent } from './components/newLedgerEntryPanel/newLedgerEntryPanel.component';
import { UpdateLedgerEntryPanelComponent } from './components/updateLedgerEntryPanel/updateLedgerEntryPanel.component';
import { BlankLedgerVM, LedgerVM, TransactionVM } from './ledger.vm';

@Component({
    selector: 'ledger',
    templateUrl: './ledger.component.html',
    styleUrls: ['./ledger.component.scss'],
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
    ]
})
export class LedgerComponent implements OnInit, OnDestroy {
    @ViewChild('updateledgercomponent') public updateledgercomponent: ElementViewContainerRef;
    @ViewChild('quickAccountComponent') public quickAccountComponent: ElementViewContainerRef;
    @ViewChild('paginationChild') public paginationChild: ElementViewContainerRef;
    @ViewChild('sharLedger') public sharLedger: ShareLedgerComponent;
    @ViewChild(BsDatepickerDirective) public datepickers: BsDatepickerDirective;

    @ViewChild('advanceSearchComp') public advanceSearchComp: AdvanceSearchModelComponent;

    @ViewChildren(ShSelectComponent) public dropDowns: QueryList<ShSelectComponent>;
    public lc: LedgerVM;
    public selectedInvoiceList: string[] = [];
    public accountInprogress$: Observable<boolean>;
    public universalDate$: Observable<any>;
    public datePickerOptions: any = {
        hideOnEsc: true,
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'Last 1 Day': [
                moment().subtract(1, 'days'),
                moment()
            ],
            'Last 7 Days': [
                moment().subtract(6, 'days'),
                moment()
            ],
            'Last 30 Days': [
                moment().subtract(29, 'days'),
                moment()
            ],
            'Last 6 Months': [
                moment().subtract(6, 'months'),
                moment()
            ],
            'Last 1 Year': [
                moment().subtract(12, 'months'),
                moment()
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    public trxRequest: TransactionsRequest;
    public advanceSearchRequest: AdvanceSearchRequest;
    public isLedgerCreateSuccess$: Observable<boolean>;
    public needToReCalculate: BehaviorSubject<boolean> = new BehaviorSubject(false);
    @ViewChild('newLedPanel') public newLedgerComponent: NewLedgerEntryPanelComponent;
    @ViewChild('updateLedgerModal') public updateLedgerModal: ModalDirective;
    @ViewChild('exportLedgerModal') public exportLedgerModal: ModalDirective;
    @ViewChild('shareLedgerModal') public shareLedgerModal: ModalDirective;
    @ViewChild('advanceSearchModel') public advanceSearchModel: ModalDirective;
    @ViewChild('quickAccountModal') public quickAccountModal: ModalDirective;
    @ViewChild('bulkActionConfirmationModal') public bulkActionConfirmationModal: ModalDirective;
    @ViewChild('bulkActionGenerateVoucherModal') public bulkActionGenerateVoucherModal: ModalDirective;
    @ViewChild('ledgerSearchTerms') public ledgerSearchTerms: ElementRef;
    public showUpdateLedgerForm: boolean = false;
    public isTransactionRequestInProcess$: Observable<boolean>;
    public ledgerBulkActionSuccess$: Observable<boolean>;
    public searchTermStream: Subject<string> = new Subject();
    public showLoader: boolean = false;
    public eLedgType: string;
    public eDrBalAmnt: number;
    public eCrBalAmnt: number;
    public isBankOrCashAccount: boolean;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public failedBulkEntries$: Observable<string[]>;
    public uploadInput: EventEmitter<UploadInput>;
    public fileUploadOptions: UploaderOptions;
    public isFileUploading: boolean = false;
    public closingBalanceBeforeReconcile: { amount: number, type: string };
    public reconcileClosingBalanceForBank: { amount: number, type: string };
    // aside menu properties
    public asideMenuState: string = 'out';
    public createStockSuccess$: Observable<boolean>;
    public needToShowLoader: boolean = true;
    public entryUniqueNamesForBulkAction: string[] = [];
    public searchText: string = '';
    public isCompanyCreated$: Observable<boolean>;
    public debitSelectAll: boolean = false;
    public creditSelectAll: boolean = false;
    public isBankTransactionLoading: boolean = false;
    public todaySelected: boolean = false;
    public todaySelected$: Observable<boolean> = observableOf(false);
    public selectedTrxWhileHovering: string;
    public checkedTrxWhileHovering: string[] = [];
    public ledgerTxnBalance: any = {};
    public isAdvanceSearchImplemented: boolean = false;
    public invoiceList: any[] = [];
    public keydownClassAdded: boolean = false;
    public isSelectOpen: boolean;
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public profileObj: any;
    public createAccountIsSuccess$: Observable<boolean>;
    public companyTaxesList: TaxResponse[] = [];
    public selectedTxnAccUniqueName: string = '';
    public tcsOrTds: 'tcs' | 'tds' = 'tcs';
    public asideMenuStateForOtherTaxes: string = 'out';
    public tdsTcsTaxTypes: string[] = ['tcsrc', 'tcspay'];
    public updateLedgerComponentInstance: UpdateLedgerEntryPanelComponent;
    public isLedgerAccountAllowsMultiCurrency: boolean = false;
    public baseCurrencyDetails: ICurrencyResponse;
    public foreignCurrencyDetails: ICurrencyResponse;
    public currencyTogglerModel: boolean = false;
    public selectedCurrency: 0 | 1 = 0;
    public isPrefixAppliedForCurrency: boolean = true;
    public selectedPrefixForCurrency: string;
    public selectedSuffixForCurrency: string;
    public inputMaskFormat: string;
    public giddhBalanceDecimalPlaces: number = 2;
    public activeAccountParentGroupsUniqueName: string = '';
    /** True, if RCM taxable amount needs to be displayed in create new ledger component as per criteria */
    public shouldShowRcmTaxableAmount: boolean;
    /** True, if ITC section needs to be displayed in create new ledger component as per criteria  */
    public shouldShowItcSection: boolean;
    /** True if company country will UAE and accounts involve Debtors/ Cash / bank / Sales */
    public isTouristSchemeApplicable: boolean;
    public allowParentGroup = ['sales', 'cash', 'sundrydebtors', 'bankaccounts'];


    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private accountUniquename: any;

    constructor(
        private store: Store<AppState>,
        private _ledgerActions: LedgerActions,
        private route: ActivatedRoute,
        private _ledgerService: LedgerService,
        private _toaster: ToasterService,
        private _companyActions: CompanyActions,
        private _settingsTagActions: SettingsTagActions,
        private componentFactoryResolver: ComponentFactoryResolver,
        private _generalActions: GeneralActions,
        private generalService: GeneralService,
        private _loginActions: LoginActions,
        private _loaderService: LoaderService,
        private _settingsDiscountAction: SettingsDiscountActions,
        private warehouseActions: WarehouseActions,
        private _cdRf: ChangeDetectorRef
    ) {

        this.lc = new LedgerVM();
        this.advanceSearchRequest = new AdvanceSearchRequest();
        this.trxRequest = new TransactionsRequest();
        this.lc.activeAccount$ = this.store.select(p => p.ledger.account).pipe(takeUntil(this.destroyed$));
        this.accountInprogress$ = this.store.select(p => p.ledger.accountInprogress).pipe(takeUntil(this.destroyed$));
        this.createAccountIsSuccess$ = this.store.select(s => s.groupwithaccounts.createAccountIsSuccess);
        this.lc.transactionData$ = this.store.select(p => p.ledger.transactionsResponse).pipe(takeUntil(this.destroyed$), shareReplay(1));
        this.isLedgerCreateSuccess$ = this.store.select(p => p.ledger.ledgerCreateSuccess).pipe(takeUntil(this.destroyed$));
        this.lc.groupsArray$ = this.store.select(p => p.general.groupswithaccounts).pipe(takeUntil(this.destroyed$));
        this.lc.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
        this.lc.companyProfile$ = this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.select(p => p.session.todaySelected).pipe(takeUntil(this.destroyed$));
        this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
        this.isTransactionRequestInProcess$ = this.store.select(p => p.ledger.transactionInprogress).pipe(takeUntil(this.destroyed$));
        this.ledgerBulkActionSuccess$ = this.store.select(p => p.ledger.ledgerBulkActionSuccess).pipe(takeUntil(this.destroyed$));
        this.store.dispatch(this._generalActions.getFlattenAccount());
        this.store.dispatch(this._ledgerActions.GetDiscountAccounts());
        this.store.dispatch(this._settingsDiscountAction.GetDiscount());
        this.store.dispatch(this._settingsTagActions.GetALLTags());
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, count: 0 }));
        // get company taxes
        this.store.dispatch(this._companyActions.getTax());
        // reset redirect state from login action
        this.store.dispatch(this._loginActions.ResetRedirectToledger());
        this.sessionKey$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
        this.companyName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.createStockSuccess$ = this.store.select(s => s.inventory.createStockSuccess).pipe(takeUntil(this.destroyed$));
        this.isCompanyCreated$ = this.store.select(s => s.session.isCompanyCreated).pipe(takeUntil(this.destroyed$));
        this.failedBulkEntries$ = this.store.select(p => p.ledger.ledgerBulkActionFailedEntries).pipe(takeUntil(this.destroyed$));
    }

    Shown: boolean = true;
    isHide: boolean = false;
    condition: boolean = true;
    condition2: boolean = false;

    toggleShow() {
        this.condition = this.condition ? false : true;
        this.condition2 = this.condition ? false : true;
        this.Shown = this.Shown ? false : true;
        this.isHide = this.isHide ? false : true;
    }

    public selectCompoundEntry(txn: ITransactionItem) {
        this.lc.currentBlankTxn = null;
        this.lc.currentTxn = txn;
        this.lc.selectedTxnUniqueName = txn.entryUniqueName;
    }

    public selectBlankTxn(txn: TransactionVM) {
        this.lc.currentTxn = null;
        this.lc.currentBlankTxn = txn;
        this.lc.selectedTxnUniqueName = txn ? txn.id : null;
    }

    public selectedDate(value: any) {
        this.needToShowLoader = false;
        let from = moment(value.picker.startDate, 'DD-MM-YYYY').toDate();
        let to = moment(value.picker.endDate, 'DD-MM-YYYY').toDate();

        // if ((this.advanceSearchRequest.dataToSend.bsRangeValue[0] !== from) || (this.advanceSearchRequest.dataToSend.bsRangeValue[1] !== to)) {

        this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
            page: 0,
            dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                bsRangeValue: [from, to]
            })
        });
        this.trxRequest.from = moment(value.picker.startDate).format('DD-MM-YYYY');
        this.trxRequest.to = moment(value.picker.endDate).format('DD-MM-YYYY');
        this.todaySelected = true;
        this.getTransactionData();
        // Después del éxito de la entrada. llamar para transacciones bancarias
        this.lc.activeAccount$.subscribe((data: AccountResponse) => {
            if (data && data.yodleeAdded) {
                this.getBankTransactions();
            } else {
                this.hideEledgerWrap();
            }
        });
        // setTimeout(()=>{this._cdRf.detectChanges()} , 500);
    }

    public selectAccount(e: IOption, txn: TransactionVM) {
        this.keydownClassAdded = false;
        this.selectedTxnAccUniqueName = '';
        if (!e.value) {
            // if there's no selected account set selectedAccount to null
            txn.selectedAccount = null;
            this.lc.currentBlankTxn = null;
            txn.amount = 0;
            txn.total = 0;
            // reset taxes and discount on selected account change
            txn.tax = 0;
            txn.taxes = [];
            txn.discount = 0;
            txn.discounts = [
                this.lc.staticDefaultDiscount()
            ];
            return;
        }

        this.lc.flattenAccountList.pipe(take(1)).subscribe(data => {
            data.map(fa => {
                // change (e.value[0]) to e.value to use in single select for ledger transaction entry
                if (fa.value === e.value) {
                    txn.selectedAccount = fa.additional;
                    let rate = 0;
                    let unitCode = '';
                    let unitName = '';
                    let stockName = '';
                    let stockUniqueName = '';
                    let unitArray = [];

                    //#region unit rates logic
                    if (fa.additional && fa.additional.stock) {
                        let defaultUnit = {
                            stockUnitCode: fa.additional.stock.stockUnit.name,
                            code: fa.additional.stock.stockUnit.code,
                            rate: 0,
                            name: fa.additional.stock.stockUnit.name
                        };
                        if (fa.additional.stock.accountStockDetails && fa.additional.stock.accountStockDetails.unitRates) {
                            let cond = fa.additional.stock.accountStockDetails.unitRates.find(p => p.stockUnitCode === fa.additional.stock.stockUnit.code);
                            if (cond) {
                                defaultUnit.rate = cond.rate;
                                rate = defaultUnit.rate;
                            }

                            unitArray = unitArray.concat(fa.additional.stock.accountStockDetails.unitRates.map(p => {
                                return {
                                    stockUnitCode: p.stockUnitCode,
                                    code: p.stockUnitCode,
                                    rate: 0,
                                    name: p.stockUnitName
                                };
                            }));
                            if (unitArray.findIndex(p => p.code === defaultUnit.code) === -1) {
                                unitArray.push(defaultUnit);
                            }
                        } else {
                            unitArray.push(defaultUnit);
                        }

                        txn.unitRate = unitArray;
                        stockName = fa.additional.stock.name;
                        stockUniqueName = fa.additional.stock.uniqueName;
                        unitName = fa.additional.stock.stockUnit.name;
                        unitCode = fa.additional.stock.stockUnit.code;
                    }
                    if (stockName && stockUniqueName) {
                        txn.inventory = {
                            stock: {
                                name: stockName,
                                uniqueName: stockUniqueName
                            },
                            quantity: 1,
                            unit: {
                                stockUnitCode: unitCode,
                                code: unitCode,
                                rate
                            }
                        };
                    }
                    if (rate > 0 && txn.amount === 0) {
                        txn.amount = rate;
                    }
                    //#endregion

                    // region check multi currency allowed for selected account
                    // if (fa.additional.currency) {
                    //   if (!this.isLedgerAccountAllowsMultiCurrency) {
                    //     // means ledger account and company currencies are same
                    //     // now check if the selected account currency is different than company currency
                    //     if (this.lc.activeAccount.currency !== fa.additional.currency) {
                    //       this.isLedgerAccountAllowsMultiCurrency = true;
                    //
                    //       this.foreignCurrencyDetails = {code: this.profileObj.baseCurrency, symbol: this.profileObj.baseCurrencySymbol};
                    //       let accCurrency = this.lc.currencies.find(f => f.code === fa.additional.currency);
                    //       this.baseCurrencyDetails = {code: accCurrency.code, symbol: accCurrency.symbol};
                    //       this.getCurrencyRate();
                    //
                    //       this.selectedCurrency = 0;
                    //       this.assignPrefixAndSuffixForCurrency();
                    //     }
                    //   }
                    // }
                    // endregion
                    return;
                }
            });
        });
        // check if selected account category allows to show taxationDiscountBox in newEntry popup
        txn.showTaxationDiscountBox = this.getCategoryNameFromAccountUniqueName(txn);
        this.handleRcmVisibility(txn);
        this.handleTaxableAmountVisibility(txn);
        this.newLedgerComponent.calculateTotal();
        this.newLedgerComponent.detectChanges();
        this.selectedTxnAccUniqueName = txn.selectedAccount.uniqueName;
    }

    public hideEledgerWrap() {
        this.lc.showEledger = false;
    }

    public pageChanged(event: any): void {
        // this.advanceSearchRequest.page = event.page;
        this.trxRequest.page = event.page;
        // this.lc.currentPage = event.page;
        this.getTransactionData();
    }

    public ngOnInit() {
        this.uploadInput = new EventEmitter<UploadInput>();
        this.fileUploadOptions = { concurrency: 0 };
        this.shouldShowItcSection = false;
        this.shouldShowRcmTaxableAmount = false;

        observableCombineLatest(this.universalDate$, this.route.params, this.todaySelected$).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            if (!Array.isArray(resp[0])) {
                return;
            }

            this.hideEledgerWrap();
            let dateObj = resp[0];
            let params = resp[1];
            this.todaySelected = resp[2];

            // check if params have from and to, this means ledger has been opened from other account-details-component
            if (params['from'] && params['to']) {
                let from = params['from'];
                let to = params['to'];

                this.datePickerOptions = {
                    ...this.datePickerOptions,
                    startDate: moment(from, 'DD-MM-YYYY').toDate(),
                    endDate: moment(to, 'DD-MM-YYYY').toDate(),
                    chosenLabel: undefined  // Let the library handle the highlighted filter label for range picker
                };

                this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                    dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                        bsRangeValue: [moment(from, 'DD-MM-YYYY').toDate(), moment(to, 'DD-MM-YYYY').toDate()]
                    })
                });
                this.advanceSearchRequest.to = to;
                this.advanceSearchRequest.page = 0;

                this.trxRequest.from = from;
                this.trxRequest.to = to;
                this.trxRequest.page = 0;
            } else {
                // means ledger is opened normally
                if (dateObj && !this.todaySelected) {
                    let universalDate = _.cloneDeep(dateObj);

                    this.datePickerOptions = {
                        ...this.datePickerOptions,
                        startDate: moment(universalDate[0], 'DD-MM-YYYY').toDate(),
                        endDate: moment(universalDate[1], 'DD-MM-YYYY').toDate(),
                        chosenLabel: universalDate[2]
                    };
                    this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                        dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                            bsRangeValue: [moment(universalDate[0], 'DD-MM-YYYY').toDate(), moment(universalDate[1], 'DD-MM-YYYY').toDate()]
                        })
                    });
                    this.advanceSearchRequest.to = universalDate[1];
                    this.advanceSearchRequest.page = 0;

                    this.trxRequest.from = moment(universalDate[0]).format('DD-MM-YYYY');
                    this.trxRequest.to = moment(universalDate[1]).format('DD-MM-YYYY');
                    this.trxRequest.page = 0;
                } else {
                    // date picker start and end date set to today when app date is selected as today
                    this.datePickerOptions = {
                        ...this.datePickerOptions,
                        startDate: moment().toDate(),
                        endDate: moment().toDate(),
                        chosenLabel: undefined  // Let the library handle the highlighted filter label for range picker
                    };
                    // set advance search bsRangeValue to blank, because we are depending api to give us from and to date
                    this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
                        dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
                            bsRangeValue: []
                        })
                    });
                    this.advanceSearchRequest.page = 0;
                    this.trxRequest.page = 0;

                    // set request from and to, '' because we are depending on api to give us from and to date
                    this.advanceSearchRequest.to = '';
                    this.trxRequest.from = '';
                    this.trxRequest.to = '';
                }
            }

            this.currencyTogglerModel = false;

            if (params['accountUniqueName']) {
                // this.advanceSearchComp.resetAdvanceSearchModal();
                this.lc.accountUnq = params['accountUniqueName'];
                this.needToShowLoader = true;
                this.searchText = '';
                // this.searchTermStream.next('');
                this.resetBlankTransaction();

                // set state details
                let companyUniqueName = null;
                this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
                let stateDetailsRequest = new StateDetailsRequest();
                stateDetailsRequest.companyUniqueName = companyUniqueName;
                stateDetailsRequest.lastState = 'ledger/' + this.lc.accountUnq;
                this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
                this.isCompanyCreated$.pipe(take(1)).subscribe(s => {
                    if (!s) {
                        this.store.dispatch(this._ledgerActions.GetLedgerAccount(this.lc.accountUnq));
                        if (this.trxRequest && this.trxRequest.q) {
                            this.trxRequest.q = null;
                        }
                        this.initTrxRequest(params['accountUniqueName']);
                    }
                });
                this.store.dispatch(this._ledgerActions.setAccountForEdit(this.lc.accountUnq));
                // init transaction request and call for transaction data
                // this.advanceSearchRequest = new AdvanceSearchRequest();

            }
        });

        this.isTransactionRequestInProcess$.subscribe((s: boolean) => {
            if (this.needToShowLoader) {
                this.showLoader = _.clone(s);
            } else {
                this.showLoader = false;
            }
            // if (!s && this.showLoader) {
            //   this.showLoader = false;
            // }
        });

        this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.lc.currencies = res;
            }
        });

        this.lc.transactionData$.subscribe((lt: any) => {
            if (lt) {
                // set date picker to and from date, as what we got from api
                if (lt.from && lt.to) {
                    this.datePickerOptions = {
                        ...this.datePickerOptions,
                        startDate: moment(lt.from, 'DD-MM-YYYY').toDate(),
                        endDate: moment(lt.to, 'DD-MM-YYYY').toDate(),
                        chosenLabel: undefined  // Let the library handle the highlighted filter label for range picker
                    };
                }

                if (lt.closingBalance) {
                    this.closingBalanceBeforeReconcile = lt.closingBalance;
                    this.closingBalanceBeforeReconcile.type = this.closingBalanceBeforeReconcile.type === 'CREDIT' ? 'Cr' : 'Dr';
                }
                if (lt.closingBalanceForBank) {
                    this.reconcileClosingBalanceForBank = lt.closingBalanceForBank;
                    this.reconcileClosingBalanceForBank.type = this.reconcileClosingBalanceForBank.type === 'CREDIT' ? 'Cr' : 'Dr';
                }

                let checkedEntriesName: string[] = uniq([
                    ...lt.debitTransactions.filter(f => f.isChecked).map(dt => dt.entryUniqueName),
                    ...lt.creditTransactions.filter(f => f.isChecked).map(ct => ct.entryUniqueName),
                ]);

                if (checkedEntriesName.length) {
                    checkedEntriesName.forEach(f => {
                        let duplicate = this.checkedTrxWhileHovering.some(s => s === f);
                        if (!duplicate) {
                            this.checkedTrxWhileHovering.push(f);
                        }
                    });
                } else {
                    this.checkedTrxWhileHovering = [];
                }

                let failedEntries: string[] = [];
                this.failedBulkEntries$.pipe(take(1)).subscribe(ent => failedEntries = ent);

                if (failedEntries.length > 0) {
                    this.store.dispatch(this._ledgerActions.SelectGivenEntries(failedEntries));
                }
                this.lc.currentPage = lt.page;
                // commented due to new API
                if (this.isAdvanceSearchImplemented) {
                    this.lc.calculateReckonging(lt);
                }
                setTimeout(() => {
                    this.loadPaginationComponent(lt);
                    if (!this._cdRf['destroyed']) {
                        this._cdRf.detectChanges();
                    }
                }, 400);
            }
        });

        this.store.pipe(
            select(p => p.ledger.ledgerTransactionsBalance),
            takeUntil(this.destroyed$)
        ).subscribe((txnBalance: any) => {
            if (txnBalance) {
                this.ledgerTxnBalance = txnBalance;
                this.lc.calculateReckonging(txnBalance);
                this._cdRf.detectChanges();
            }
        });

        this.isLedgerCreateSuccess$.subscribe(s => {
            if (s) {
                this._toaster.successToast('Entry created successfully', 'Success');
                this.lc.showNewLedgerPanel = false;

                this.getTransactionData();
                // this.getCurrencyRate();
                this.resetBlankTransaction();

                // After the success of the entrance call for bank transactions
                this.lc.activeAccount$.subscribe((data: AccountResponse) => {
                    this._loaderService.show();
                    if (data && data.yodleeAdded) {
                        this.getBankTransactions();
                    } else {
                        this.hideEledgerWrap();
                    }
                });
            }
        });

        observableCombineLatest(this.lc.activeAccount$, this.lc.flattenAccountListStream$, this.lc.companyProfile$).subscribe(data => {

            if (data[0] && data[1] && data[2]) {
                let profile = cloneDeep(data[2]);
                this.lc.activeAccount = data[0];
                this.profileObj = profile;
                this.giddhBalanceDecimalPlaces = profile.balanceDecimalPlaces;
                this.entryUniqueNamesForBulkAction = [];
                this.needToShowLoader = true;
                this.inputMaskFormat = profile.balanceDisplayFormat ? profile.balanceDisplayFormat.toLowerCase() : '';

                let stockListFormFlattenAccount: IFlattenAccountsResultItem;
                if (data[1]) {
                    stockListFormFlattenAccount = data[1].find((acc) => acc.uniqueName === this.lc.accountUnq);
                }

                let accountDetails: AccountResponse = data[0];
                let parentOfAccount = accountDetails.parentGroups[0];

                this.lc.getUnderstandingText(accountDetails.accountType, accountDetails.name);
                this.accountUniquename = accountDetails.uniqueName;

                if (this.advanceSearchComp) {
                    this.advanceSearchComp.resetAdvanceSearchModal();
                }

                if (accountDetails.yodleeAdded) {
                    this.getBankTransactions();
                } else {
                    this.hideEledgerWrap();
                }

                this.isBankOrCashAccount = accountDetails.parentGroups.some((grp) => grp.uniqueName === 'bankaccounts');
                this.isLedgerAccountAllowsMultiCurrency = accountDetails.currency && accountDetails.currency !== profile.baseCurrency;

                this.foreignCurrencyDetails = { code: profile.baseCurrency, symbol: profile.baseCurrencySymbol };
                if (this.isLedgerAccountAllowsMultiCurrency) {
                    this.baseCurrencyDetails = { code: accountDetails.currency, symbol: accountDetails.currencySymbol };
                    this.getCurrencyRate();
                } else {
                    this.baseCurrencyDetails = this.foreignCurrencyDetails;
                }
                this.selectedCurrency = 0;
                this.assignPrefixAndSuffixForCurrency();

                // assign multi currency details to new ledger component
                this.lc.blankLedger.selectedCurrencyToDisplay = this.selectedCurrency;
                this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
                this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);

                // tcs tds identification
                if (['revenuefromoperations', 'otherincome', 'operatingcost', 'indirectexpenses', 'currentassets', 'noncurrentassets', 'fixedassets'].includes(parentOfAccount.uniqueName)) {
                    this.tcsOrTds = ['indirectexpenses', 'operatingcost'].includes(parentOfAccount.uniqueName) ? 'tds' : 'tcs';

                    // for tcs and tds identification
                    if (this.tcsOrTds === 'tcs') {
                        this.tdsTcsTaxTypes = ['tcspay', 'tcsrc'];
                    } else {
                        this.tdsTcsTaxTypes = ['tdspay', 'tdsrc'];
                    }
                }

                // check if account is stockable
                let isStockableAccount = parentOfAccount ?
                    (parentOfAccount.uniqueName === 'revenuefromoperations' || parentOfAccount.uniqueName === 'otherincome' ||
                        parentOfAccount.uniqueName === 'operatingcost' || parentOfAccount.uniqueName === 'indirectexpenses') : false;
                let accountsArray: IOption[] = [];
                if (isStockableAccount) {
                    // stocks from ledger account
                    data[1].map(acc => {
                        // normal entry
                        accountsArray.push({ value: uuid.v4(), label: acc.name, additional: acc });
                        // check if taxable or roundoff account then don't assign stocks
                        let notRoundOff = acc.uniqueName === 'roundoff';
                        let isTaxAccount = acc.uNameStr.indexOf('dutiestaxes') > -1;
                        // accountDetails.stocks.map(as => { // As discussed with Gaurav sir, we need to pick stocks form flatten account's response
                        if (!isTaxAccount && !notRoundOff && stockListFormFlattenAccount && stockListFormFlattenAccount.stocks) {
                            stockListFormFlattenAccount.stocks.map(as => {
                                // stock entry
                                accountsArray.push({
                                    value: uuid.v4(),
                                    label: `${acc.name}` + ` (${as.name})`,
                                    additional: Object.assign({}, acc, { stock: as })
                                });
                            });
                        }
                    });
                } else {
                    // stocks from account itself
                    data[1].map(acc => {
                        if (acc.stocks) {
                            // normal entry
                            accountsArray.push({ value: uuid.v4(), label: acc.name, additional: acc });
                            // stock entry
                            acc.stocks.map(as => {
                                accountsArray.push({
                                    value: uuid.v4(),
                                    // label: acc.name + '(' + as.uniqueName + ')',
                                    label: `${acc.name}` + ` (${as.name})`,
                                    additional: Object.assign({}, acc, { stock: as })
                                });
                            });
                        } else {
                            accountsArray.push({ value: uuid.v4(), label: acc.name, additional: acc });
                        }
                    });
                }
                this.lc.flattenAccountList = observableOf(orderBy(accountsArray, 'label'));
            }
        });

        this.searchTermStream.pipe(
            debounceTime(700),
            distinctUntilChanged())
            .subscribe(term => {
                this.trxRequest.q = term;
                this.trxRequest.page = 0;
                this.needToShowLoader = false;
                this.getTransactionData();
            });

        this.store.select(createSelector([(st: AppState) => st.general.addAndManageClosed], (yesOrNo: boolean) => {
            if (yesOrNo) {
                this.getTransactionData();
            }
        })).pipe(debounceTime(300)).subscribe();

        this.ledgerBulkActionSuccess$.subscribe((yes: boolean) => {
            if (yes) {
                this.entryUniqueNamesForBulkAction = [];
                this.getTransactionData();
                // this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName,
                //   moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY'), moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY'),
                //   this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q));
            }
        });

        this.createStockSuccess$.subscribe(s => {
            if (s) {
                this.store.dispatch(this._generalActions.getFlattenAccount());
            }
        });

        this.store.pipe(select(s => s.company.taxes), takeUntil(this.destroyed$)).subscribe(res => {
            this.companyTaxesList = res || [];
        });
    }

    private assignPrefixAndSuffixForCurrency() {
        this.isPrefixAppliedForCurrency = this.isPrefixAppliedForCurrency = !(['AED'].includes(this.selectedCurrency === 0 ? this.baseCurrencyDetails.code : this.foreignCurrencyDetails.code));
        this.selectedPrefixForCurrency = this.isPrefixAppliedForCurrency ? this.selectedCurrency === 0 ? this.baseCurrencyDetails.symbol : this.foreignCurrencyDetails.symbol : '';
        this.selectedSuffixForCurrency = this.isPrefixAppliedForCurrency ? '' : this.selectedCurrency === 0 ? this.baseCurrencyDetails.symbol : this.foreignCurrencyDetails.symbol;
    }

    public initTrxRequest(accountUnq: string) {
        this._loaderService.show();
        // this.advanceSearchRequest = this.advanceSearchRequest || new AdvanceSearchRequest();
        // this.advanceSearchRequest.page = 0;
        // this.advanceSearchRequest.count = 15;
        this.advanceSearchRequest.accountUniqueName = accountUnq;
        // this.advanceSearchRequest.from = this.advanceSearchRequest.from || moment(this.datePickerOptions.startDate).format('DD-MM-YYYY');
        // this.advanceSearchRequest.to = this.advanceSearchRequest.to || moment(this.datePickerOptions.endDate).format('DD-MM-YYYY');
        // this.advanceSearchRequest.dataToSend = this.advanceSearchRequest.dataToSend || new AdvanceSearchModel();
        this.trxRequest.accountUniqueName = accountUnq;
        // always send accountCurrency true when requesting for first time
        this.trxRequest.accountCurrency = true;
        this.getTransactionData();
    }

    public getBankTransactions() {
        // && this.advanceSearchRequest.from
        if (this.trxRequest.accountUniqueName) {
            this.isBankTransactionLoading = true;
            this._ledgerService.GetBankTranscationsForLedger(this.trxRequest.accountUniqueName, this.trxRequest.from).subscribe((res: BaseResponse<IELedgerResponse[], string>) => {
                this.isBankTransactionLoading = false;
                if (res.status === 'success') {
                    this.lc.getReadyBankTransactionsForUI(res.body);
                }
            });
        }
        // else {
        //   this._toaster.warningToast('Something went wrong please reload page');
        // }
    }

    public selectBankTxn(txn: TransactionVM) {
        this.lc.currentTxn = null;
        this.lc.currentBlankTxn = txn;
        this.lc.selectedBankTxnUniqueName = txn.id;
    }

    public showBankLedgerPopup(txn: TransactionVM, item: BlankLedgerVM) {
        this.selectBankTxn(txn);
        this.lc.currentBankEntry = item;
        this.lc.showBankLedgerPanel = true;
    }

    public hideBankLedgerPopup(e?: boolean) {
        // cuando se emita falso en caso de éxito del mapa de cuenta
        if (!e) {
            this.getBankTransactions();
            this.getTransactionData();
        }
        this.lc.showBankLedgerPanel = false;
        this.lc.currentBlankTxn = null;
        this.lc.selectedBankTxnUniqueName = null;
    }

    public clickUnpaidInvoiceList(e?: boolean) {
        if (e) {
            if (this.accountUniquename === 'cash' || this.accountUniquename === 'bankaccounts' && this.selectedTxnAccUniqueName) {
                this.getInvoiveLists({ accountUniqueName: this.selectedTxnAccUniqueName, status: 'unpaid' });
            } else {
                this.getInvoiveLists({ accountUniqueName: this.accountUniquename, status: 'unpaid' });
            }
        }
    }

    public saveBankTransaction() {
        // Api llama para mover la transacción bancaria al libro mayor
        let blankTransactionObj: BlankLedgerVM = this.lc.prepareBankLedgerRequestObject();
        blankTransactionObj.invoicesToBePaid = this.selectedInvoiceList;
        delete blankTransactionObj['voucherType'];
        if (blankTransactionObj.transactions.length > 0) {
            this.store.dispatch(this._ledgerActions.CreateBlankLedger(cloneDeep(blankTransactionObj), this.lc.accountUnq));
            // let transactonId = blankTransactionObj.transactionId;
            // this.isLedgerCreateSuccess$.subscribe(s => {
            //   if (s && transactonId) {
            //     this.deleteBankTxn(transactonId);
            //   }
            // });
        } else {
            this._toaster.errorToast('There must be at least a transaction to make an entry.', 'Error');
        }
    }

    public getselectedInvoice(event: string[]) {
        this.selectedInvoiceList = event;
    }

    public getTransactionData() {
        this.isAdvanceSearchImplemented = false;
        this.closingBalanceBeforeReconcile = null;
        this.store.dispatch(this._ledgerActions.GetLedgerBalance(this.trxRequest));
        this.store.dispatch(this._ledgerActions.GetTransactions(this.trxRequest));
    }

    public getCurrencyRate(mode: string = null) {
        let from: string;
        let to: string;
        if (mode === 'blankLedger') {
            from = (this.lc.blankLedger.selectedCurrencyToDisplay === 0 ? this.lc.blankLedger.baseCurrencyToDisplay.code : this.lc.blankLedger.foreignCurrencyToDisplay.code);
            to = (this.lc.blankLedger.selectedCurrencyToDisplay === 0 ? this.lc.blankLedger.foreignCurrencyToDisplay.code : this.lc.blankLedger.baseCurrencyToDisplay.code);
        } else {
            from = this.selectedCurrency === 0 ? this.baseCurrencyDetails.code : this.foreignCurrencyDetails.code;
            to = this.selectedCurrency === 0 ? this.foreignCurrencyDetails.code : this.baseCurrencyDetails.code;
        }
        let date = moment().format('DD-MM-YYYY');
        this._ledgerService.GetCurrencyRateNewApi(from, to, date).subscribe(response => {
            let rate = response.body;
            if (rate) {
                this.lc.blankLedger = { ...this.lc.blankLedger, exchangeRate: rate, exchangeRateForDisplay: giddhRoundOff(rate, this.giddhBalanceDecimalPlaces) };
            }
        }, (error => {
            this.lc.blankLedger = { ...this.lc.blankLedger, exchangeRate: 1, exchangeRateForDisplay: 1 };
        }));
    }

    public toggleTransactionType(event: any) {
        let allTrx: TransactionVM[] = filter(this.lc.blankLedger.transactions, bl => bl.type === event.type);
        let unAccountedTrx = find(allTrx, a => !a.selectedAccount);

        if (unAccountedTrx) {
            this.selectBlankTxn(unAccountedTrx);

            this.dropDowns.filter(dd => dd.idEl === unAccountedTrx.id).forEach(dd => {
                setTimeout(() => {
                    dd.show(null);
                }, 0);
            });
        } else {
            const currentlyAddedTransaction = this.lc.currentBlankTxn;
            if (currentlyAddedTransaction.inventory) {
                // Add the warehouse selected for an item
                currentlyAddedTransaction.inventory['warehouse'] = { name: '', uniqueName: event.warehouse };
            }
            let newTrx = this.lc.addNewTransaction(event.type);
            this.lc.blankLedger.transactions.push(newTrx);
            this.selectBlankTxn(newTrx);
            setTimeout(() => {
                this.dropDowns.filter(dd => dd.idEl === newTrx.id).forEach(dd => {
                    dd.show(null);
                });
            }, 0);
        }
    }

    public downloadAttachedFile(fileName: string, e: Event) {
        e.stopPropagation();
        this._ledgerService.DownloadAttachement(fileName).subscribe(d => {
            if (d.status === 'success') {
                let blob = base64ToBlob(d.body.uploadedFile, `image/${d.body.fileType}`, 512);
                return saveAs(blob, d.body.name);
            } else {
                this._toaster.errorToast(d.message);
            }
        });
    }

    public downloadInvoice(invoiceName: string, voucherType: string, e: Event) {
        e.stopPropagation();
        let activeAccount = null;
        this.lc.activeAccount$.pipe(take(1)).subscribe(p => activeAccount = p);
        let downloadRequest = new DownloadLedgerRequest();
        downloadRequest.invoiceNumber = [invoiceName];
        downloadRequest.voucherType = voucherType;

        this._ledgerService.DownloadInvoice(downloadRequest, this.lc.accountUnq).subscribe(d => {
            if (d.status === 'success') {
                let blob = base64ToBlob(d.body, 'application/pdf', 512);
                return saveAs(blob, `${activeAccount.name} - ${invoiceName}.pdf`);
            } else {
                this._toaster.errorToast(d.message);
            }
        });
    }

    public resetBlankTransaction() {
        this.lc.blankLedger = {
            transactions: [
                this.lc.addNewTransaction('DEBIT'),
                this.lc.addNewTransaction('CREDIT')
            ],
            voucherType: null,
            entryDate: this.datePickerOptions.endDate ? moment(this.datePickerOptions.endDate).format('DD-MM-YYYY') : moment().format('DD-MM-YYYY'),
            unconfirmedEntry: false,
            attachedFile: '',
            attachedFileName: '',
            tag: null,
            description: '',
            generateInvoice: false,
            chequeNumber: '',
            chequeClearanceDate: '',
            invoiceNumberAgainstVoucher: '',
            compoundTotal: 0,
            convertedCompoundTotal: 0,
            invoicesToBePaid: [],
            otherTaxModal: new SalesOtherTaxesModal(),
            otherTaxesSum: 0,
            tdsTcsTaxesSum: 0,
            otherTaxType: 'tcs',
            exchangeRate: 1,
            exchangeRateForDisplay: 1,
            valuesInAccountCurrency: (this.selectedCurrency === 0),
            selectedCurrencyToDisplay: this.selectedCurrency,
            baseCurrencyToDisplay: cloneDeep(this.baseCurrencyDetails),
            foreignCurrencyToDisplay: cloneDeep(this.foreignCurrencyDetails)
        };
        this.shouldShowRcmTaxableAmount = false;
        this.shouldShowItcSection = false;
        if (this.isLedgerAccountAllowsMultiCurrency) {
            this.getCurrencyRate('blankLedger');
        }
        this.hideNewLedgerEntryPopup();
    }

    public showNewLedgerEntryPopup(trx: TransactionVM) {
        this.selectBlankTxn(trx);
        this.lc.showNewLedgerPanel = true;
    }

    public onSelectHide() {
        // To Prevent Race condition
        setTimeout(() => this.isSelectOpen = false, 500);
    }

    public onEnter(se, txn) {
        if (!this.isSelectOpen) {
            this.isSelectOpen = true;
            se.show();
            this.showNewLedgerEntryPopup(txn);
        }
    }

    public onRightArrow(navigator, result) {
        if (result.currentHorizontal) {
            navigator.addVertical(result.currentHorizontal);
            navigator.nextVertical();
        }
    }

    public onLeftArrow(navigator, result) {
        navigator.removeVertical();
        if (navigator.currentVertical && navigator.currentVertical.attributes.getNamedItem('vr-item')) {
            navigator.currentVertical.focus();
        } else {
            navigator.nextVertical();
        }
    }

    public initNavigator(navigator, el) {
        navigator.setVertical(el);
        navigator.nextHorizontal();
    }

    public hideNewLedgerEntryPopup(event?) {
        if (event) {
            let classList = event.path.map(m => {
                return m.classList;
            });

            if (classList && classList instanceof Array) {
                let notClose = classList.some((cls: DOMTokenList) => {
                    if (!cls) {
                        return;
                    }
                    return cls.contains('chkclrbsdp') || cls.contains('currencyToggler');
                });

                if (notClose) {
                    return;
                }
            }
        }
        this.lc.showNewLedgerPanel = false;
    }

    public showUpdateLedgerModal(txn: ITransactionItem) {
        let transactions: TransactionsResponse = null;
        this.store.select(t => t.ledger.transactionsResponse).pipe(take(1)).subscribe(trx => transactions = trx);
        if (transactions) {
            // if (txn.isBaseAccount) {
            //   // store the trx values in store
            //   this.store.dispatch(this._ledgerActions.setAccountForEdit(txn.particular.uniqueName));
            // } else {
            //   // find trx from transactions array and store it in store
            //   let debitTrx: ITransactionItem[] = transactions.debitTransactions.filter(f => f.entryUniqueName === txn.entryUniqueName);
            //   let creditTrx: ITransactionItem[] = transactions.creditTransactions.filter(f => f.entryUniqueName === txn.entryUniqueName);
            //   let finalTrx: ITransactionItem[] = [...debitTrx, ...creditTrx];
            //   let baseAccount: ITransactionItem = finalTrx.find(f => f.isBaseAccount);
            //   if (baseAccount) {
            //     this.store.dispatch(this._ledgerActions.setAccountForEdit(baseAccount.particular.uniqueName));
            //   } else {
            //     // re activate account from url params
            //     this.store.dispatch(this._ledgerActions.setAccountForEdit(this.lc.accountUnq));
            //   }
            // }
            this.store.dispatch(this._ledgerActions.setAccountForEdit(this.lc.accountUnq));
        }
        this.showUpdateLedgerForm = true;
        this.store.dispatch(this._ledgerActions.setTxnForEdit(txn.entryUniqueName));
        this.lc.selectedTxnUniqueName = txn.entryUniqueName;
        this.loadUpdateLedgerComponent();
        this.updateLedgerModal.show();
    }

    public hideUpdateLedgerModal() {
        this.showUpdateLedgerForm = false;
        this.updateLedgerModal.hide();
        this._loaderService.show();
    }

    public showShareLedgerModal() {
        this.sharLedger.clear();
        this.shareLedgerModal.show();
        this.sharLedger.checkAccountSharedWith();
    }

    public hideShareLedgerModal() {
        this.shareLedgerModal.hide();
    }

    public showExportLedgerModal() {
        this.exportLedgerModal.show();
    }

    public hideExportLedgerModal() {
        this.exportLedgerModal.hide();
    }

    public saveBlankTransaction() {
        this._loaderService.show();

        if (this.lc.blankLedger.entryDate) {
            if (!moment(this.lc.blankLedger.entryDate, 'DD-MM-YYYY').isValid()) {
                this._toaster.errorToast('Invalid Date Selected.Please Select Valid Date');
                this._loaderService.hide();
                return;
            } else {
                this.lc.blankLedger.entryDate = moment(this.lc.blankLedger.entryDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
            }
        }

        if (this.lc.blankLedger.chequeClearanceDate) {
            if (!moment(this.lc.blankLedger.chequeClearanceDate, 'DD-MM-YYYY').isValid()) {
                this._toaster.errorToast('Invalid Date Selected In Cheque Clearance Date.Please Select Valid Date');
                this._loaderService.hide();
                return;
            } else {
                this.lc.blankLedger.chequeClearanceDate = moment(this.lc.blankLedger.chequeClearanceDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
            }
        }

        let blankTransactionObj: BlankLedgerVM = this.lc.prepareBlankLedgerRequestObject();

        if (blankTransactionObj.transactions.length > 0) {
            if (blankTransactionObj.otherTaxType === 'tds') {
                delete blankTransactionObj['tcsCalculationMethod'];
            }

            this.store.dispatch(this._ledgerActions.CreateBlankLedger(cloneDeep(blankTransactionObj), this.lc.accountUnq));
        } else {
            this._toaster.errorToast('There must be at least a transaction to make an entry.', 'Error');
            this._loaderService.hide();
        }
    }

    public blankLedgerAmountClick() {
        if (this.lc.currentBlankTxn && Number(this.lc.currentBlankTxn.amount) === 0) {
            this.lc.currentBlankTxn.amount = undefined;
        }
    }

    public entryManipulated() {
        if (this.isAdvanceSearchImplemented) {
            this.getAdvanceSearchTxn();
        } else if (this.activeAccountParentGroupsUniqueName === 'bankaccounts' && this.closingBalanceBeforeReconcile) {
            this.getReconciliation();
        } else {
            this.getTransactionData();
        }
    }

    public resetAdvanceSearch() {
        this.advanceSearchComp.resetAdvanceSearchModal();
        this.getTransactionData();
    }

    public showQuickAccountModal() {
        this.loadQuickAccountComponent();
        this.quickAccountModal.show();
    }

    public hideQuickAccountModal() {
        this.quickAccountModal.hide();
    }

    public getCategoryNameFromAccountUniqueName(txn: TransactionVM): boolean {
        let activeAccount: AccountResponse;
        let groupWithAccountsList: GroupsWithAccountsResponse[];
        this.lc.activeAccount$.pipe(take(1)).subscribe(a => activeAccount = a);
        this.lc.groupsArray$.pipe(take(1)).subscribe(a => groupWithAccountsList = a);

        let parent;
        let parentGroup: GroupsWithAccountsResponse;
        let showDiscountAndTaxPopup: boolean = false;

        parent = activeAccount.parentGroups[0].uniqueName;
        parentGroup = find(groupWithAccountsList, (p: any) => p.uniqueName === parent);

        // check url account category
        if (parentGroup.category === 'income' || parentGroup.category === 'expenses' || parentGroup.category === 'assets') {
            if (parentGroup.category === 'assets') {
                showDiscountAndTaxPopup = activeAccount.parentGroups[0].uniqueName.includes('fixedassets');
            } else {
                showDiscountAndTaxPopup = true;
            }
        }

        // if url's account allows show discount and tax popup then don't check for selected account
        if (showDiscountAndTaxPopup) {
            return true;
        }

        // check selected account category
        if (txn.selectedAccount) {
            parent = txn.selectedAccount.parentGroups[0].uniqueName;
            parentGroup = find(groupWithAccountsList, (p: any) => p.uniqueName === parent);
            if (parentGroup.category === 'income' || parentGroup.category === 'expenses' || parentGroup.category === 'assets') {
                if (parentGroup.category === 'assets') {
                    showDiscountAndTaxPopup = txn.selectedAccount.uNameStr.includes('fixedassets');
                } else {
                    showDiscountAndTaxPopup = true;
                }
            }
        }

        return showDiscountAndTaxPopup;
    }

    public ngOnDestroy(): void {
        this.store.dispatch(this._ledgerActions.ResetLedger());
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public loadUpdateLedgerComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(UpdateLedgerEntryPanelComponent);
        let viewContainerRef = this.updateledgercomponent.viewContainerRef;
        viewContainerRef.remove();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        let componentInstance = componentRef.instance as UpdateLedgerEntryPanelComponent;
        componentInstance.tcsOrTds = this.tcsOrTds;
        this.updateLedgerComponentInstance = componentInstance;

        componentInstance.toggleOtherTaxesAsideMenu.subscribe(res => {
            this.toggleOtherTaxesAsidePane(res);
        });

        componentInstance.closeUpdateLedgerModal.subscribe(() => {
            this.hideUpdateLedgerModal();
        });

        this.updateLedgerModal.onHidden.pipe(take(1)).subscribe(() => {
            if (this.showUpdateLedgerForm) {
                this.hideUpdateLedgerModal();
            }
            if (this.updateLedgerComponentInstance.activeAccount$) {
                this.updateLedgerComponentInstance.activeAccount$.subscribe(res => {
                    this.activeAccountParentGroupsUniqueName = res.parentGroups[1].uniqueName;
                });
            }
            this.entryManipulated();
            this.updateLedgerComponentInstance = null;
            componentRef.destroy();
        });

        componentInstance.showQuickAccountModalFromUpdateLedger.subscribe(() => {
            this.showQuickAccountModal();
        });
    }

    public loadQuickAccountComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(QuickAccountComponent);
        let viewContainerRef = this.quickAccountComponent.viewContainerRef;
        viewContainerRef.remove();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        let componentInstance = componentRef.instance as QuickAccountComponent;
        componentInstance.closeQuickAccountModal.subscribe((a) => {
            this.hideQuickAccountModal();
            componentInstance.newAccountForm.reset();
            componentInstance.destroyed$.next(true);
            componentInstance.destroyed$.complete();
        });

    }

    public loadPaginationComponent(s) {
        if (!this.paginationChild) {
            return;
        }
        let transactionData = null;
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(PaginationComponent);
        let viewContainerRef = this.paginationChild.viewContainerRef;
        viewContainerRef.remove();

        let componentInstanceView = componentFactory.create(viewContainerRef.parentInjector);
        viewContainerRef.insert(componentInstanceView.hostView);

        let componentInstance = componentInstanceView.instance as PaginationComponent;
        componentInstance.totalItems = s.count * s.totalPages;
        componentInstance.itemsPerPage = s.count;
        componentInstance.maxSize = 5;
        componentInstance.writeValue(s.page);
        componentInstance.boundaryLinks = true;
        componentInstance.pageChanged.subscribe(e => {
            // commenting this as we will use advance search api from now
            // if (this.isAdvanceSearchImplemented) {
            // this.advanceSearchPageChanged(e);
            // return;
            // }
            this.pageChanged(e); // commenting this as we will use advance search api from now
        });
    }

    /**
     * onOpenAdvanceSearch
     */
    public onOpenAdvanceSearch() {
        this.advanceSearchModel.show();
    }

    public search(term: string): void {
        // this.ledgerSearchTerms.nativeElement.value = term;
        this.searchTermStream.next(term);
    }

    /**
     * closeAdvanceSearchPopup
     */
    public closeAdvanceSearchPopup(event) {
        this.advanceSearchModel.hide();
        if (!event.isClose) {
            this.getAdvanceSearchTxn();
            // this.getTransactionData();
            if (event.advanceSearchData) {
                if (event.advanceSearchData['dataToSend']['bsRangeValue'].length) {
                    this.datePickerOptions = {
                        ...this.datePickerOptions,
                        startDate: moment(event.advanceSearchData.dataToSend.bsRangeValue[0], 'DD-MM-YYYY').toDate(),
                        endDate: moment(event.advanceSearchData.dataToSend.bsRangeValue[1], 'DD-MM-YYYY').toDate(),
                        chosenLabel: undefined  // Let the library handle the highlighted filter label for range picker
                    };
                }

            }
        }
        // this.advanceSearchRequest = _.cloneDeep(advanceSearchRequest);
    }

    public getReconciliation() {
        this.lc.transactionData$.pipe(take(1)).subscribe((val) => {
            if (val) {
                this.closingBalanceBeforeReconcile = val.closingBalance;
                if (this.closingBalanceBeforeReconcile) {
                    this.closingBalanceBeforeReconcile.type = this.closingBalanceBeforeReconcile.type === 'CREDIT' ? 'Cr' : 'Dr';
                }
            }
        });
        let dataToSend = {
            reconcileDate: null,
            closingBalance: 0,
            ClosingBalanceType: null,
            accountUniqueName: this.lc.accountUnq
        };
        this.store.dispatch(this._ledgerActions.GetReconciliation(dataToSend));
    }

    public performBulkAction(actionType: string, fileInput?) {
        this.entryUniqueNamesForBulkAction = [];
        // if (this.lc.showEledger) {
        //   this.entryUniqueNamesForBulkAction.push(
        //     ...this.lc.bankTransactionsData.map(bt => bt.transactions)
        //       .reduce((prev, curr) => {
        //         return prev.concat(curr);
        //       }, []).filter(f => f.isChecked).map(m => m.particular)
        //   );
        // } else {
        let debitTrx: ITransactionItem[] = [];
        let creditTrx: ITransactionItem[] = [];

        this.lc.transactionData$.pipe(take(1)).subscribe(s => {
            if (s) {
                debitTrx = s.debitTransactions;
                creditTrx = s.creditTransactions;
            }
        });

        this.entryUniqueNamesForBulkAction.push(
            ...[
                ...debitTrx.filter(f => f.isChecked).map(dt => dt.entryUniqueName),
                ...creditTrx.filter(f => f.isChecked).map(ct => ct.entryUniqueName),
            ]);
        // }
        if (!this.entryUniqueNamesForBulkAction.length) {
            this._toaster.errorToast('Please select at least one entry.', 'Error');
            return;
        }
        switch (actionType) {
            case 'delete':
                this.bulkActionConfirmationModal.show();
                break;
            case 'generate':
                this.bulkActionGenerateVoucherModal.show();
                break;
            case 'upload':
                fileInput.click();
                break;
            default:
                this._toaster.warningToast('Please select a valid action.', 'Warning');
        }
    }

    public selectAllEntries(ev: any, type: 'debit' | 'credit') {
        let key = type === 'debit' ? 'DEBIT' : 'CREDIT';
        if (!ev.target.checked) {
            if (type === 'debit') {
                this.debitSelectAll = false;
            } else {
                this.creditSelectAll = false;
            }
            this.selectedTrxWhileHovering = null;
            this.checkedTrxWhileHovering = [];
        }

        this.store.dispatch(this._ledgerActions.SelectDeSelectAllEntries(type, ev.target.checked));
    }

    public selectEntryForBulkAction(ev: any, entryUniqueName: string) {
        if (entryUniqueName) {
            if (ev.target.checked) {
                this.entryUniqueNamesForBulkAction.push(entryUniqueName);
            } else {
                let itemIndx = this.entryUniqueNamesForBulkAction.findIndex((item) => item === entryUniqueName);
                this.entryUniqueNamesForBulkAction.splice(itemIndx, 1);
            }
        }
    }

    public entryHovered(uniqueName: string) {
        this.selectedTrxWhileHovering = uniqueName;
    }

    public entrySelected(ev: any, uniqueName: string) {
        if (ev.target.checked) {
            this.checkedTrxWhileHovering.push(uniqueName);
            this.store.dispatch(this._ledgerActions.SelectGivenEntries([uniqueName]));
        } else {
            let itemIndx = this.checkedTrxWhileHovering.findIndex((item) => item === uniqueName);
            this.checkedTrxWhileHovering.splice(itemIndx, 1);

            if (this.checkedTrxWhileHovering.length === 0) {
                this.creditSelectAll = false;
                this.debitSelectAll = false;
                this.selectedTrxWhileHovering = '';
            }

            this.lc.selectedTxnUniqueName = null;
            this.store.dispatch(this._ledgerActions.DeSelectGivenEntries([uniqueName]));
        }
    }

    public onCancelBulkActionConfirmation() {
        this.entryUniqueNamesForBulkAction = [];
        this.bulkActionConfirmationModal.hide();
    }

    public onConfirmationBulkActionConfirmation() {
        this.store.dispatch(this._ledgerActions.DeleteMultipleLedgerEntries(this.lc.accountUnq, _.cloneDeep(this.entryUniqueNamesForBulkAction)));
        this.entryUniqueNamesForBulkAction = [];
        this.bulkActionConfirmationModal.hide();
    }

    public onUploadOutput(output: UploadOutput): void {
        if (output.type === 'allAddedToQueue') {
            let sessionKey = null;
            let companyUniqueName = null;
            this.sessionKey$.pipe(take(1)).subscribe(a => sessionKey = a);
            this.companyName$.pipe(take(1)).subscribe(a => companyUniqueName = a);
            const event: UploadInput = {
                type: 'uploadAll',
                url: Configuration.ApiUrl + LEDGER_API.UPLOAD_FILE.replace(':companyUniqueName', companyUniqueName),
                method: 'POST',
                fieldName: 'file',
                data: { entries: _.cloneDeep(this.entryUniqueNamesForBulkAction).join() },
                headers: { 'Session-Id': sessionKey },
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
            this._loaderService.show();
        } else if (output.type === 'done') {
            this._loaderService.hide();
            if (output.file.response.status === 'success') {
                this.entryUniqueNamesForBulkAction = [];
                this.getTransactionData();
                this.isFileUploading = false;
                this._toaster.successToast('file uploaded successfully');
            } else {
                this.isFileUploading = false;
                this._toaster.errorToast(output.file.response.message);
            }
        }
    }

    public onSelectInvoiceGenerateOption(isCombined: boolean) {
        this.bulkActionGenerateVoucherModal.hide();
        this.entryUniqueNamesForBulkAction = _.uniq(this.entryUniqueNamesForBulkAction);
        this.store.dispatch(this._ledgerActions.GenerateBulkLedgerInvoice({ combined: isCombined }, [{ accountUniqueName: this.lc.accountUnq, entries: _.cloneDeep(this.entryUniqueNamesForBulkAction) }], 'ledger'));
    }

    public onCancelSelectInvoiceModal() {
        this.bulkActionGenerateVoucherModal.hide();
    }

    public openSelectFilePopup(fileInput: any) {
        if (!this.entryUniqueNamesForBulkAction.length) {
            this._toaster.errorToast('Please select at least one entry.', 'Error');
            return;
        }
        fileInput.click();
    }

    public toggleBodyClass() {
        if (this.asideMenuState === 'in' || this.asideMenuStateForOtherTaxes === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public toggleAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.asideMenuState = this.asideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public toggleOtherTaxesAsidePane(modal) {

        // if (!modalBool) {
        //   this.vm.selectedLedger.otherTaxModal = new SalesOtherTaxesModal();
        //   this.vm.selectedLedger.otherTaxesSum = 0;
        //   this.vm.selectedLedger.tdsTcsTaxesSum = 0;
        //   this.vm.selectedLedger.cessSum = 0;
        //   this.vm.selectedLedger.otherTaxModal.itemLabel = '';
        //   return;
        // }

        this.asideMenuStateForOtherTaxes = this.asideMenuStateForOtherTaxes === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public calculateOtherTaxes(modal: SalesOtherTaxesModal) {
        if (this.updateLedgerComponentInstance) {
            this.updateLedgerComponentInstance.vm.calculateOtherTaxes(modal);
        }
    }

    /**
     * deleteBankTxn
     */
    public deleteBankTxn(transactionId) {
        this._ledgerService.DeleteBankTransaction(transactionId).subscribe((res: BaseResponse<any, string>) => {
            if (res.status === 'success') {
                this._toaster.successToast('Bank transaction deleted Successfully');
            }
        });
    }

    // endregion

    public toggleCurrency(event) {
        let isThereBlankEntry = this.lc.blankLedger.transactions.some(s => s.selectedAccount);
        if (isThereBlankEntry) {
            this._toaster.errorToast('please save unfinished entry first...');
            event.preventDefault();
            return false;
        }
        this.selectedCurrency = event.target.checked ? 1 : 0;
        this.currencyTogglerModel = this.selectedCurrency === 1;
        this.assignPrefixAndSuffixForCurrency();
        this.trxRequest.accountCurrency = this.selectedCurrency !== 1;
        this.getCurrencyRate();

        // assign multi currency details to new ledger component
        this.lc.blankLedger.selectedCurrencyToDisplay = this.selectedCurrency;
        this.lc.blankLedger.baseCurrencyToDisplay = cloneDeep(this.baseCurrencyDetails);
        this.lc.blankLedger.foreignCurrencyToDisplay = cloneDeep(this.foreignCurrencyDetails);
        // If the currency toggle button is checked then it is not in account currency
        this.lc.blankLedger.valuesInAccountCurrency = !event.target.checked;

        this.getTransactionData();
    }

    public toggleCurrencyForDisplayInNewLedger(res: string) {
        this.getCurrencyRate(res);
    }

    public getAdvanceSearchTxn() {
        this.isAdvanceSearchImplemented = true;
        if (!this.todaySelected) {
            this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName,
                moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY'), moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY'),
                this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q));
        } else {
            let from = this.advanceSearchRequest.dataToSend.bsRangeValue && this.advanceSearchRequest.dataToSend.bsRangeValue[0] ? moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY') : '';
            let to = this.advanceSearchRequest.dataToSend.bsRangeValue && this.advanceSearchRequest.dataToSend.bsRangeValue[1] ? moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY') : '';
            this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend),
                this.advanceSearchRequest.accountUniqueName, from, to, this.advanceSearchRequest.page, this.advanceSearchRequest.count)
            );
        }
    }

    public getInvoiveLists(request) {
        this.invoiceList = [];
        this._ledgerService.GetInvoiceList(request).subscribe((res: any) => {
            _.map(res.body.invoiceList, (o) => {
                this.invoiceList.push({ label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false });
            });
            _.uniqBy(this.invoiceList, 'value');
        });
    }

    public keydownPressed(e) {
        if (e.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        } else if (e.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.toggleAsidePane();
        } else {
            this.keydownClassAdded = false;
        }

    }

    public getReconciledBack() {
        this.closingBalanceBeforeReconcile = null;
        this.getBankTransactions();
        this.getTransactionData();
    }

    /**
     * Handles RCM section visinility based on provided transaction details
     *
     * @private
     * @param {*} transaction Transaction details which will decide if transaction is RCM applicable
     * @memberof LedgerComponent
     */
    private handleRcmVisibility(transaction: TransactionVM): void {
        this.lc.flattenAccountListStream$.pipe(take(1)).subscribe((accounts) => {
            if (accounts) {
                let currentLedgerAccountDetails, selectedAccountDetails;
                const transactionUniqueName = (transaction.selectedAccount) ? transaction.selectedAccount.uniqueName : '';
                for (let index = 0; index < accounts.length; index++) {
                    const account = accounts[index];
                    if (account.uniqueName === this.lc.accountUnq) {
                        // Found the current ledger details
                        currentLedgerAccountDetails = _.cloneDeep(account);
                    }
                    if (account.uniqueName === transactionUniqueName) {
                        // Found the user selected particular account
                        selectedAccountDetails = _.cloneDeep(account);
                    }
                    if (currentLedgerAccountDetails && selectedAccountDetails) {
                        // Accounts found, break the loop
                        break;
                    }
                }
                const shouldShowRcmEntry = this.generalService.shouldShowRcmSection(currentLedgerAccountDetails, selectedAccountDetails);
                if (this.lc && this.lc.currentBlankTxn) {
                    this.lc.currentBlankTxn['shouldShowRcmEntry'] = shouldShowRcmEntry;
                }
            }
        });
    }

    /**
     * Handles the taxable amount and ITC section visibility based on conditions
     *
     * @private
     * @param {TransactionVM} transaction Selected transaction
     * @returns {void}
     * @memberof LedgerComponent
     */
    private handleTaxableAmountVisibility(transaction: TransactionVM): void {
        this.shouldShowRcmTaxableAmount = false;
        this.shouldShowItcSection = false;
        let currentCompany;
        this.store.pipe(select(appState => appState.session), take(1)).subscribe((sessionData) => {
            currentCompany = sessionData.companies.find((company) => company.uniqueName === sessionData.companyUniqueName).country;
        });
        if (!this.lc || !this.lc.activeAccount || !this.lc.activeAccount.parentGroups || this.lc.activeAccount.parentGroups.length < 2) {
            return;
        }
        if (!transaction.selectedAccount || !transaction.selectedAccount.parentGroups || transaction.selectedAccount.parentGroups.length < 2) {
            return;
        }
        const currentLedgerSecondParent = this.lc.activeAccount.parentGroups[1].uniqueName;
        const selectedAccountSecondParent = transaction.selectedAccount.parentGroups[1].uniqueName;
        this.checkTouristSchemeApplicable(currentLedgerSecondParent, selectedAccountSecondParent);
        if (currentLedgerSecondParent === 'reversecharge' && transaction.type === 'CREDIT') {
            // Current ledger is of reverse charge and user has entered the transaction on the right side (CREDIT) of the ledger
            if (selectedAccountSecondParent === 'dutiestaxes') {
                /* Particular account belongs to the Duties and taxes then check the country based on which
                    respective sections will be displayed */
                if (currentCompany === 'United Arab Emirates') {
                    this.shouldShowRcmTaxableAmount = true;
                }
                if (currentCompany === 'India') {
                    this.shouldShowItcSection = true;
                }
            }
        } else if (currentLedgerSecondParent === 'dutiestaxes' && transaction.type === 'DEBIT') {
            // Current ledger is of Duties and taxes and user has entered the transaction on the left side (DEBIT) of the ledger
            if (selectedAccountSecondParent === 'reversecharge') {
                /* Particular account belongs to the Reverse charge then check the country based on which
                    respective sections will be displayed */
                if (currentCompany === 'United Arab Emirates') {
                    this.shouldShowRcmTaxableAmount = true;
                }
                if (currentCompany === 'India') {
                    this.shouldShowItcSection = true;
                }
            }
        }
    }

    /**
     * To check tourist scheme applicable or not
     *
     * @param {string} [activeLedgerParentgroup] active ledger parent group unique name
     * @param {string} [selectedAccountParentGroup] selected account parent group unique name
     * @memberof LedgerComponent
     */
    public checkTouristSchemeApplicable(activeLedgerParentgroup: string, selectedAccountParentGroup: string): void {
        if (this.profileObj && this.profileObj.countryV2 && this.profileObj.countryV2.alpha2CountryCode && this.profileObj.countryV2.alpha2CountryCode === 'AE' && activeLedgerParentgroup && selectedAccountParentGroup && (this.allowParentGroup.includes(activeLedgerParentgroup)) && ( this.allowParentGroup.includes(selectedAccountParentGroup))) {
            this.isTouristSchemeApplicable = true;
        } else {
            this.isTouristSchemeApplicable = false;
        }

    }

}
