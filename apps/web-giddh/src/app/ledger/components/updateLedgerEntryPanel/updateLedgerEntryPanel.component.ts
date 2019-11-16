import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { take, takeUntil } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { LedgerService } from '../../../services/ledger.service';
import { DownloadLedgerRequest, LedgerResponse } from '../../../models/api-models/Ledger';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { ToasterService } from '../../../services/toaster.service';
import { LEDGER_API } from '../../../services/apiurls/ledger.api';
import { BsDatepickerDirective, ModalDirective } from 'ngx-bootstrap';
import { AccountService } from '../../../services/account.service';
import { ILedgerTransactionItem } from '../../../models/interfaces/ledger.interface';
import { cloneDeep, filter, last, orderBy } from '../../../lodash-optimized';
import { LedgerActions } from '../../../actions/ledger/ledger.actions';
import { UpdateLedgerVm } from './updateLedger.vm';
import { UpdateLedgerDiscountComponent } from '../updateLedgerDiscount/updateLedgerDiscount.component';
import { AccountResponse } from '../../../models/api-models/Account';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ShSelectComponent } from '../../../theme/ng-virtual-select/sh-select.component';
import { IFlattenAccountsResultItem } from '../../../models/interfaces/flattenAccountsResultItem.interface';
import { base64ToBlob, giddhRoundOff } from '../../../shared/helpers/helperFunctions';
import { saveAs } from 'file-saver';
import { LoaderService } from '../../../loader/loader.service';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
import { createSelector } from 'reselect';
import { TagRequest } from '../../../models/api-models/settingsTags';
import { SettingsTagActions } from '../../../actions/settings/tag/settings.tag.actions';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import * as moment from 'moment/moment';
import { TaxControlComponent } from '../../../theme/tax-control/tax-control.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SalesOtherTaxesCalculationMethodEnum, SalesOtherTaxesModal } from '../../../models/api-models/Sales';
import { ResizedEvent } from 'angular-resize-event';
import { ICurrencyResponse, TaxResponse } from '../../../models/api-models/Company';

@Component({
    selector: 'update-ledger-entry-panel',
    templateUrl: './updateLedgerEntryPanel.component.html',
    styleUrls: ['./updateLedgerEntryPanel.component.css'],
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
export class UpdateLedgerEntryPanelComponent implements OnInit, AfterViewInit, OnDestroy {
    public vm: UpdateLedgerVm;
    @Output() public closeUpdateLedgerModal: EventEmitter<boolean> = new EventEmitter();
    @Output() public showQuickAccountModalFromUpdateLedger: EventEmitter<boolean> = new EventEmitter();
    @Output() public toggleOtherTaxesAsideMenu: EventEmitter<UpdateLedgerVm> = new EventEmitter();

    @ViewChild('deleteAttachedFileModal') public deleteAttachedFileModal: ModalDirective;
    @ViewChild('deleteEntryModal') public deleteEntryModal: ModalDirective;
    @ViewChild('discount') public discountComponent: UpdateLedgerDiscountComponent;
    @ViewChild('tax') public taxControll: TaxControlComponent;
    @ViewChild('updateBaseAccount') public updateBaseAccount: ModalDirective;
    @ViewChild(BsDatepickerDirective) public datepickers: BsDatepickerDirective;
    public tags$: Observable<TagRequest[]>;
    public sessionKey$: Observable<string>;
    public companyName$: Observable<string>;
    public isFileUploading: boolean = false;
    public accountUniqueName: string;
    public entryUniqueName$: Observable<string>;
    public editAccUniqueName$: Observable<string>;
    public entryUniqueName: string;
    public uploadInput: EventEmitter<UploadInput>;
    public fileUploadOptions: UploaderOptions;
    public isDeleteTrxEntrySuccess$: Observable<boolean>;
    public isTxnUpdateInProcess$: Observable<boolean>;
    public isTxnUpdateSuccess$: Observable<boolean>;
    public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
    public selectedLedgerStream$: Observable<LedgerResponse>;
    public companyProfile$: Observable<any>;
    public activeAccount$: Observable<AccountResponse>;
    public activeAccount: AccountResponse;
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public showAdvanced: boolean;
    public currentAccountApplicableTaxes: string[] = [];

    public baseCurrency: string = null;
    public isChangeAcc: boolean = false;
    public firstBaseAccountSelected: string;
    public existingTaxTxn: any[] = [];
    public baseAccount$: Observable<any> = observableOf(null);
    public baseAcc: string;
    public baseAccountChanged: boolean = false;
    public changedAccountUniq: any = null;
    public invoiceList: any[] = [];
    public openDropDown: boolean = false;
    public totalAmount: any;
    public baseAccountName$: Observable<string> = observableOf(null);
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    public profileObj: any;
    public keydownClassAdded: boolean = false;
    public tcsOrTds: 'tcs' | 'tds' = 'tcs';
    public totalTdElementWidth: number = 0;
    public multiCurrencyAccDetails: IFlattenAccountsResultItem = null;

    constructor(private store: Store<AppState>, private _ledgerService: LedgerService,
                private _toasty: ToasterService, private _accountService: AccountService,
                private _ledgerAction: LedgerActions, private _loaderService: LoaderService,
                private _settingsTagActions: SettingsTagActions, private _cdr: ChangeDetectorRef) {
        this.vm = new UpdateLedgerVm();

        this.entryUniqueName$ = this.store.select(p => p.ledger.selectedTxnForEditUniqueName).pipe(takeUntil(this.destroyed$));
        this.editAccUniqueName$ = this.store.select(p => p.ledger.selectedAccForEditUniqueName).pipe(takeUntil(this.destroyed$));
        this.selectedLedgerStream$ = this.store.select(p => p.ledger.transactionDetails).pipe(takeUntil(this.destroyed$));
        this.companyProfile$ = this.store.select(p => p.settings.profile).pipe(takeUntil(this.destroyed$));
        this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
        this.vm.companyTaxesList$ = this.store.select(p => p.company.taxes).pipe(takeUntil(this.destroyed$));
        this.sessionKey$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
        this.companyName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
        this.isDeleteTrxEntrySuccess$ = this.store.select(p => p.ledger.isDeleteTrxEntrySuccessfull).pipe(takeUntil(this.destroyed$));
        this.isTxnUpdateInProcess$ = this.store.select(p => p.ledger.isTxnUpdateInProcess).pipe(takeUntil(this.destroyed$));
        this.isTxnUpdateSuccess$ = this.store.select(p => p.ledger.isTxnUpdateSuccess).pipe(takeUntil(this.destroyed$));
        this.closeUpdateLedgerModal.pipe(takeUntil(this.destroyed$));
        this.vm.currencyList$ = this.store.pipe(select(s => s.session.currencies), takeUntil(this.destroyed$));
        this.store.dispatch(this._settingsTagActions.GetALLTags());
    }

    Shown: boolean = true;
    isHide: boolean = false;
    condition: boolean = true;
    condition2: boolean = false;

    toggleShow() {
        this.condition = !this.condition;
        this.condition2 = !this.condition;
        this.Shown = !this.Shown;
        this.isHide = !this.isHide;
    }

    public ngOnInit() {

        this.showAdvanced = false;
        this.vm.selectedLedger = new LedgerResponse();
        this.vm.selectedLedger.otherTaxModal = new SalesOtherTaxesModal();
        // this.totalAmount = this.vm.totalAmount;
        this.tags$ = this.store.pipe(select(createSelector([(st: AppState) => st.settings.tags], (tags) => {
            if (tags && tags.length) {
                _.map(tags, (tag) => {
                    tag.label = tag.name;
                    tag.value = tag.name;
                });
                return _.orderBy(tags, 'name');
            }
        })), takeUntil(this.destroyed$));

        // get entry name and ledger account uniquename
        observableCombineLatest(this.entryUniqueName$, this.editAccUniqueName$).subscribe((resp: any[]) => {
            if (resp[0] && resp[1]) {
                this.entryUniqueName = resp[0];
                this.accountUniqueName = resp[1];
                this.store.dispatch(this._ledgerAction.getLedgerTrxDetails(this.accountUniqueName, this.entryUniqueName));
                // this.firstBaseAccountSelected = this.accountUniqueName;
            }
        });

        // emit upload event
        this.uploadInput = new EventEmitter<UploadInput>();
        // set file upload options
        this.fileUploadOptions = {concurrency: 0};

        // get flatten_accounts list && get transactions list && get ledger account list
        observableCombineLatest(this.flattenAccountListStream$, this.selectedLedgerStream$, this._accountService.GetAccountDetailsV2(this.accountUniqueName), this.companyProfile$)
            .subscribe((resp: any[]) => {
                if (resp[0] && resp[1] && resp[2].status === 'success' && resp[3]) {

                    //#region flatten group list assign process

                    this.vm.flatternAccountList = resp[0];
                    this.activeAccount$ = observableOf(resp[2].body);
                    this.activeAccount = cloneDeep(resp[2].body);
                    this.profileObj = resp[3];
                    this.vm.giddhBalanceDecimalPlaces = resp[3].balanceDecimalPlaces;
                    this.vm.inputMaskFormat = this.profileObj.balanceDisplayFormat ? this.profileObj.balanceDisplayFormat.toLowerCase() : '';

                    // set account details for multi currency account
                    this.multiCurrencyAccDetails = cloneDeep(this.vm.flatternAccountList.find(f => f.uniqueName === resp[1].particular.uniqueName));
                    this.vm.isMultiCurrencyAvailable = !!(this.multiCurrencyAccDetails.currency && this.multiCurrencyAccDetails.currency !== this.profileObj.baseCurrency);

                    this.vm.foreignCurrencyDetails = {code: this.profileObj.baseCurrency, symbol: this.profileObj.baseCurrencySymbol};

                    if (this.vm.isMultiCurrencyAvailable) {
                        let currencies: ICurrencyResponse[] = [];
                        let multiCurrencyAccCurrency: ICurrencyResponse;

                        this.vm.currencyList$.pipe(take(1)).subscribe(res => currencies = res);
                        multiCurrencyAccCurrency = currencies.find(f => f.code === this.multiCurrencyAccDetails.currency);
                        this.vm.baseCurrencyDetails = {code: multiCurrencyAccCurrency.code, symbol: multiCurrencyAccCurrency.symbol};
                    } else {
                        this.vm.baseCurrencyDetails = this.vm.foreignCurrencyDetails;
                    }
                    this.vm.selectedCurrency = this.profileObj.baseCurrency !== resp[1].total.code ? 0 : 1;
                    this.vm.selectedCurrencyForDisplay = this.vm.selectedCurrency;
                    this.assignPrefixAndSuffixForCurrency();
                    // end multi currency assign

                    let stockListFormFlattenAccount: IFlattenAccountsResultItem;
                    if (resp[0]) {
                        stockListFormFlattenAccount = resp[0].find((acc) => acc.uniqueName === resp[2].body.uniqueName);
                    }

                    let accountDetails: AccountResponse = resp[2].body;

                    if (accountDetails && accountDetails.currency && this.vm.isMultiCurrencyAvailable) {
                        this.baseCurrency = accountDetails.currency;
                    }

                    // check if current account category is type 'income' or 'expenses'
                    let parentAcc = accountDetails.parentGroups[0].uniqueName;
                    let incomeAccArray = ['revenuefromoperations', 'otherincome'];
                    let expensesAccArray = ['operatingcost', 'indirectexpenses'];
                    let incomeAndExpensesAccArray = [...incomeAccArray, ...expensesAccArray];

                    if (incomeAndExpensesAccArray.indexOf(parentAcc) > -1) {
                        let appTaxes = [];
                        accountDetails.applicableTaxes.forEach(app => appTaxes.push(app.uniqueName));
                        this.currentAccountApplicableTaxes = appTaxes;
                    }
                    //    this.vm.getUnderstandingText(accountDetails.accountType, accountDetails.name);

                    this.vm.getUnderstandingText(resp[1].particularType, resp[1].particular.name);

                    // check if account is stockable
                    let isStockableAccount = accountDetails.uniqueName !== 'roundoff' ? incomeAndExpensesAccArray.includes(parentAcc) : false;
                    // (parentOfAccount.uniqueName === 'revenuefromoperations' || parentOfAccount.uniqueName === 'otherincome' ||
                    //   parentOfAccount.uniqueName === 'operatingcost' || parentOfAccount.uniqueName === 'indirectexpenses') : false;

                    let accountsArray: IOption[] = [];
                    let accountsForBaseAccountArray: IOption[] = [];
                    if (isStockableAccount) {
                        // stocks from ledger account
                        resp[0].map(acc => {
                            // normal entry
                            accountsArray.push({value: acc.uniqueName, label: acc.name, additional: acc});

                            // normal merge account entry
                            if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                                let mergeAccs = acc.mergedAccounts.split(',');
                                mergeAccs.map(m => m.trim()).forEach(ma => {
                                    accountsArray.push({
                                        value: ma,
                                        label: ma,
                                        additional: acc
                                    });
                                });
                            }

                            // check if taxable or roundoff account then don't assign stocks
                            let notRoundOff = acc.uniqueName === 'roundoff';
                            let isTaxAccount = acc.uNameStr.indexOf('dutiestaxes') > -1;
                            if (!isTaxAccount && !notRoundOff && stockListFormFlattenAccount && stockListFormFlattenAccount.stocks) {
                                stockListFormFlattenAccount.stocks.map(as => {
                                    // stock entry
                                    accountsArray.push({
                                        value: `${acc.uniqueName}#${as.uniqueName}`,
                                        label: acc.name + '(' + as.uniqueName + ')',
                                        additional: Object.assign({}, acc, {stock: as})
                                    });
                                    // normal merge account entry
                                    if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                                        let mergeAccs = acc.mergedAccounts.split(',');
                                        mergeAccs.map(m => m.trim()).forEach(ma => {
                                            accountsArray.push({
                                                value: `${ma}#${as.uniqueName}`,
                                                label: ma + '(' + as.uniqueName + ')',
                                                additional: Object.assign({}, acc, {stock: as})
                                            });
                                        });
                                    }
                                });
                            }

                            // add current account entry in base account array
                            accountsForBaseAccountArray.push({value: acc.uniqueName, label: acc.name, additional: acc});
                        });
                        // accountsArray = uniqBy(accountsArray, 'value');
                    } else {
                        resp[0].map(acc => {
                            if (acc.stocks) {
                                acc.stocks.map(as => {
                                    accountsArray.push({
                                        value: `${acc.uniqueName}#${as.uniqueName}`,
                                        label: `${acc.name} (${as.uniqueName})`,
                                        additional: Object.assign({}, acc, {stock: as})
                                    });
                                });
                                accountsArray.push({value: acc.uniqueName, label: acc.name, additional: acc});
                            } else {
                                accountsArray.push({value: acc.uniqueName, label: acc.name, additional: acc});

                                // add current account entry in base account array
                                accountsForBaseAccountArray.push({value: acc.uniqueName, label: acc.name, additional: acc});
                            }
                            // normal merge account entry
                            if (acc.mergedAccounts && acc.mergedAccounts !== '') {
                                let mergeAccs = acc.mergedAccounts.split(',');
                                mergeAccs.map(m => m.trim()).forEach(ma => {
                                    accountsArray.push({
                                        value: ma,
                                        label: ma,
                                        additional: acc
                                    });
                                });
                            }
                        });
                        // accountsArray = uniqBy(accountsArray, 'value');
                    }
                    this.vm.flatternAccountList4Select = observableOf(orderBy(accountsArray, 'text'));
                    this.vm.flatternAccountList4BaseAccount = orderBy(accountsForBaseAccountArray, 'text');
                    //#endregion
                    //#region transaction assignment process
                    this.vm.selectedLedger = resp[1];
                    this.vm.selectedLedger.exchangeRateForDisplay = giddhRoundOff(this.vm.selectedLedger.exchangeRate, this.vm.giddhBalanceDecimalPlaces);
                    // this.vm.selectedLedger.exchangeRate = giddhRoundOff(this.vm.selectedLedger.exchangeRate, 4);

                    // divide actual amount with exchangeRate because currently we are getting actualAmount in company currency
                    this.vm.selectedLedger.actualAmount = giddhRoundOff(this.vm.selectedLedger.actualAmount / this.vm.selectedLedger.exchangeRate, this.vm.giddhBalanceDecimalPlaces);

                    // other taxes assigning process
                    let companyTaxes: TaxResponse[] = [];
                    this.vm.companyTaxesList$.pipe(take(1)).subscribe(taxes => companyTaxes = taxes);

                    let otherTaxesModal = new SalesOtherTaxesModal();
                    otherTaxesModal.itemLabel = resp[1].particular.name;

                    let tax: TaxResponse;
                    if (resp[1].tcsTaxes && resp[1].tcsTaxes.length) {
                        tax = companyTaxes.find(f => f.uniqueName === resp[1].tcsTaxes[0]);
                        this.vm.selectedLedger.otherTaxType = 'tcs';
                    } else if (resp[1].tdsTaxes && resp[1].tdsTaxes.length) {
                        tax = companyTaxes.find(f => f.uniqueName === resp[1].tdsTaxes[0]);
                        this.vm.selectedLedger.otherTaxType = 'tds';
                    }

                    if (tax) {
                        otherTaxesModal.appliedOtherTax = {name: tax.name, uniqueName: tax.uniqueName};
                    }

                    // otherTaxesModal.appliedOtherTax = (resp[1].tcsTaxes.length ? resp[1].tcsTaxes : resp[1].tdsTaxes) || [];
                    otherTaxesModal.tcsCalculationMethod = resp[1].tcsCalculationMethod || SalesOtherTaxesCalculationMethodEnum.OnTaxableAmount;

                    this.vm.selectedLedger.isOtherTaxesApplicable = !!(tax);
                    this.vm.selectedLedger.otherTaxModal = otherTaxesModal;

                    this.baseAccount$ = observableOf(resp[1].particular);
                    this.baseAccountName$ = resp[1].particular.uniqueName;
                    this.baseAcc = resp[1].particular.uniqueName;
                    this.firstBaseAccountSelected = resp[1].particular.uniqueName;

                    this.vm.selectedLedger.transactions.map(t => {

                        if (this.vm.selectedLedger.discounts.length > 0 && !t.isTax && t.particular.uniqueName !== 'roundoff') {
                            let category = this.vm.getCategoryNameFromAccount(t.particular.uniqueName);
                            if (this.vm.isValidCategory(category)) {
                                t.amount = this.vm.selectedLedger.actualAmount;
                            }
                        }

                        // if (!this.isMultiCurrencyAvailable) {
                        //   this.isMultiCurrencyAvailable = !!t.convertedAmountCurrency;
                        // }

                        if (t.inventory) {
                            let findStocks = accountsArray.find(f => f.value === t.particular.uniqueName + '#' + t.inventory.stock.uniqueName);
                            if (findStocks) {
                                let findUnitRates = findStocks.additional.stock;
                                if (findUnitRates && findUnitRates.accountStockDetails && findUnitRates.accountStockDetails.unitRates.length) {
                                    let tempUnitRates = findUnitRates.accountStockDetails.unitRates;
                                    tempUnitRates.map(tmp => tmp.code = tmp.stockUnitCode);
                                    t.unitRate = tempUnitRates;
                                } else {
                                    t.unitRate = [{
                                        code: t.inventory.unit.code,
                                        rate: t.inventory.rate,
                                        stockUnitCode: t.inventory.unit.code
                                    }];
                                }
                            } else {
                                t.unitRate = [{
                                    code: t.inventory.unit.code,
                                    rate: t.inventory.rate,
                                    stockUnitCode: t.inventory.unit.code
                                }];
                            }
                            t.particular.uniqueName = `${t.particular.uniqueName}#${t.inventory.stock.uniqueName}`;
                        }
                    });
                    this.vm.isInvoiceGeneratedAlready = this.vm.selectedLedger.voucherGenerated;

                    // check if entry allows to show discount and taxes box
                    // first check with opened lager
                    if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(resp[2].body)) {
                        this.vm.showNewEntryPanel = true;
                    } else {
                        // now check if we transactions array have any income/expense/fixed assets entry
                        let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                        this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
                    }

                    this.vm.reInitilizeDiscount(resp[1]);

                    this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('CREDIT'));
                    this.vm.selectedLedger.transactions.push(this.vm.blankTransactionItem('DEBIT'));

                    if (this.vm.stockTrxEntry) {
                        this.vm.inventoryPriceChanged(this.vm.stockTrxEntry.inventory.rate);
                    }
                    this.existingTaxTxn = _.filter(this.vm.selectedLedger.transactions, (o) => o.isTax);
                    //#endregion
                }

                setTimeout(() => {
                    this.vm.getEntryTotal();
                    this.vm.generatePanelAmount();
                    this.vm.generateGrandTotal();
                    this.vm.generateCompoundTotal();
                }, 500);
            });

        // check if delete entry is success
        this.isDeleteTrxEntrySuccess$.subscribe(del => {
            if (del) {
                this.store.dispatch(this._ledgerAction.resetDeleteTrxEntryModal());
                this.closeUpdateLedgerModal.emit(true);
                this.baseAccountChanged = false;
            }
        });

        // check if update entry is success
        this.isTxnUpdateSuccess$.subscribe(upd => {
            if (upd) {
                this.store.dispatch(this._ledgerAction.ResetUpdateLedger());
                this.baseAccountChanged = false;
                // this.closeUpdateLedgerModal.emit(true);
            }
        });
    }

    public ngAfterViewInit() {
        this.vm.discountComponent = this.discountComponent;
    }

    public addBlankTrx(type: string = 'DEBIT', txn: ILedgerTransactionItem, event: Event) {
        // let isMultiCurrencyAvailable: boolean = false;
        // if (txn.selectedAccount && txn.selectedAccount.currency) {
        //   this.activeAccount$.pipe(take(1)).subscribe((acc) => {
        //     if (acc.currency !== txn.selectedAccount.currency) {
        //       // this.isMultiCurrencyAvailable = true;
        //       isMultiCurrencyAvailable = true;
        //       this.baseCurrency = acc.currency;
        //     }
        //   });
        // }
        if (Number(txn.amount) === 0) {
            txn.amount = undefined;
        }
        let lastTxn = last(filter(this.vm.selectedLedger.transactions, p => p.type === type));
        if (txn.particular.uniqueName && lastTxn.particular.uniqueName) {
            let blankTrxnRow = this.vm.blankTransactionItem(type);
            this.vm.selectedLedger.transactions.push(blankTrxnRow);
        }
    }

    public onUploadOutputUpdate(output: UploadOutput): void {
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
                data: {company: companyUniqueName},
                headers: {'Session-Id': sessionKey},
            };
            this.uploadInput.emit(event);
        } else if (output.type === 'start') {
            this.isFileUploading = true;
            this._loaderService.show();
        } else if (output.type === 'done') {
            this._loaderService.hide();
            if (output.file.response.status === 'success') {
                // this.isFileUploading = false;
                this.vm.selectedLedger.attachedFile = output.file.response.body.uniqueName;
                this.vm.selectedLedger.attachedFileName = output.file.response.body.name;
                this._toasty.successToast('file uploaded successfully');
            } else {
                this.isFileUploading = false;
                this.vm.selectedLedger.attachedFile = '';
                this.vm.selectedLedger.attachedFileName = '';
                this._toasty.errorToast(output.file.response.message);
            }
        }
    }

    public onResized(event: ResizedEvent) {
        this.totalTdElementWidth = event.newWidth + 10;
    }

    public selectAccount(e: IOption, txn: ILedgerTransactionItem, selectCmp: ShSelectComponent) {
        if (!e.value) {
            // if there's no selected account set selectedAccount to null
            txn.selectedAccount = null;
            txn.inventory = null;
            txn.particular.name = undefined;

            // check if need to showEntryPanel
            // first check with opened lager
            if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
                this.vm.showNewEntryPanel = true;
            } else {
                // now check if we transactions array have any income/expense/fixed assets entry
                let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
            }

            return;
        } else {
            if (!txn.isUpdated) {
                if (this.vm.selectedLedger.taxes.length && !txn.isTax) {
                    txn.isUpdated = true;
                }
            }
            // check if txn.selectedAccount is aleready set so it means account name is changed without firing deselect event
            if (txn.selectedAccount) {
                // check if discount is added and update component as needed
                this.vm.discountArray.map(d => {
                    if (d.particular === txn.selectedAccount.uniqueName) {
                        d.amount = 0;
                    }
                });
            }
            // if ther's stock entry
            if (e.additional.stock) {
                // check if we aleready have stock entry
                if (this.vm.isThereStockEntry(e.value)) {
                    selectCmp.clear();
                    txn.particular.uniqueName = null;
                    txn.particular.name = null;
                    txn.selectedAccount = null;
                    this._toasty.warningToast('you can\'t add multiple stock entry');
                    return;
                } else {
                    // add unitArrys in txn for stock entry
                    txn.selectedAccount = e.additional;
                    let rate = 0;
                    let unitCode = '';
                    let unitName = '';
                    let stockName = '';
                    let stockUniqueName = '';
                    let unitArray = [];
                    let defaultUnit = {
                        stockUnitCode: e.additional.stock.stockUnit.name,
                        code: e.additional.stock.stockUnit.code,
                        rate: 0
                    };
                    if (e.additional.stock.accountStockDetails && e.additional.stock.accountStockDetails.unitRates) {
                        let cond = e.additional.stock.accountStockDetails.unitRates.find(p => p.stockUnitCode === e.additional.stock.stockUnit.code);
                        if (cond) {
                            defaultUnit.rate = cond.rate;
                            rate = defaultUnit.rate;
                        }
                        unitArray = unitArray.concat(e.additional.stock.accountStockDetails.unitRates.map(p => {
                            return {
                                stockUnitCode: p.stockUnitCode,
                                code: p.stockUnitCode,
                                rate: p.rate
                            };
                        }));
                        if (unitArray.findIndex(p => p.code === defaultUnit.code) === -1) {
                            unitArray.push(defaultUnit);
                        }
                    } else {
                        unitArray.push(defaultUnit);
                    }
                    txn.unitRate = unitArray;
                    stockName = e.additional.stock.name;
                    stockUniqueName = e.additional.stock.uniqueName;
                    unitName = e.additional.stock.stockUnit.name;
                    unitCode = e.additional.stock.stockUnit.code;

                    if (stockName && stockUniqueName) {
                        txn.inventory = {
                            stock: {
                                name: stockName,
                                uniqueName: stockUniqueName,
                            },
                            quantity: 1,
                            unit: {
                                stockUnitCode: unitCode,
                                code: unitCode,
                                rate
                            },
                            amount: 0,
                            rate
                        };
                    }
                    if (rate > 0 && txn.amount === 0) {
                        txn.amount = rate;
                    }
                }
            } else {
                // directly assign additional property
                txn.selectedAccount = e.additional;
            }

            // check if need to showEntryPanel
            // first check with opened lager
            if (this.vm.checkDiscountTaxesAllowedOnOpenedLedger(this.activeAccount)) {
                this.vm.showNewEntryPanel = true;
            } else {
                // now check if we transactions array have any income/expense/fixed assets entry
                let incomeExpenseEntryLength = this.vm.isThereIncomeOrExpenseEntry();
                this.vm.showNewEntryPanel = incomeExpenseEntryLength === 1;
            }

            // commented for now after discussion with @shubhendra and @aditya soni

            // if multi-currency is not available then check if selected account allows multi-currency
            // if (!this.vm.isMultiCurrencyAvailable) {
            //   this.vm.isMultiCurrencyAvailable = e.additional.currency && e.additional.currency !== this.profileObj.baseCurrency;
            //
            //   this.vm.foreignCurrencyDetails = {code: this.profileObj.baseCurrency, symbol: this.profileObj.baseCurrencySymbol};
            //
            //   if (this.vm.isMultiCurrencyAvailable) {
            //     let currencies: ICurrencyResponse[] = [];
            //     let multiCurrencyAccCurrency: ICurrencyResponse;
            //
            //     this.vm.currencyList$.pipe(take(1)).subscribe(res => currencies = res);
            //     multiCurrencyAccCurrency = currencies.find(f => f.code === e.additional.currency);
            //     this.vm.baseCurrencyDetails = {code: multiCurrencyAccCurrency.code, symbol: multiCurrencyAccCurrency.symbol};
            //
            //     let rate = await this.getCurrencyRate();
            //     this.vm.selectedLedger = {...this.vm.selectedLedger, exchangeRate: rate ? rate.body : 1};
            //
            //   } else {
            //     this.vm.baseCurrencyDetails = this.vm.foreignCurrencyDetails;
            //   }
            //   this.vm.selectedCurrency = 0;
            //   this.vm.selectedCurrencyForDisplay = this.vm.selectedCurrency;
            //   this.assignPrefixAndSuffixForCurrency();
            // }

            this.vm.onTxnAmountChange(txn);
        }
    }

    public onTxnAmountChange(txn: ILedgerTransactionItem) {
        if (!txn.selectedAccount) {
            this.vm.flatternAccountList4Select.pipe(take(1)).subscribe((accounts) => {
                if (accounts && accounts.length) {
                    let selectedAcc = accounts.find(acc => acc.value === txn.particular.uniqueName);
                    if (selectedAcc) {
                        txn.selectedAccount = selectedAcc.additional;
                    }
                }
            });
        }

        txn.convertedAmount = this.vm.calculateConversionRate(txn.amount);
        txn.isUpdated = true;
        this.vm.onTxnAmountChange(txn);
    }

    public showDeleteAttachedFileModal() {
        this.deleteAttachedFileModal.show();
    }

    public hideDeleteAttachedFileModal() {
        this.deleteAttachedFileModal.hide();
    }

    public showDeleteEntryModal() {
        this.deleteEntryModal.show();
    }

    public hideDeleteEntryModal() {
        this.deleteEntryModal.hide();
    }

    public deleteTrxEntry() {
        let uniqueName = this.vm.selectedLedger.particular.uniqueName;
        this.store.dispatch(this._ledgerAction.deleteTrxEntry(uniqueName, this.entryUniqueName));
        this.hideDeleteEntryModal();
    }

    public deleteAttachedFile() {
        this.vm.selectedLedger.attachedFile = '';
        this.vm.selectedLedger.attachedFileName = '';
        this.hideDeleteAttachedFileModal();
    }

    public saveLedgerTransaction() {
        // due to date picker of Tx entry date format need to change
        if (this.vm.selectedLedger.entryDate) {
            if (!moment(this.vm.selectedLedger.entryDate, 'DD-MM-YYYY').isValid()) {
                this._toasty.errorToast('Invalid Date Selected.Please Select Valid Date');
                this._loaderService.hide();
                return;
            } else {
                this.vm.selectedLedger.entryDate = moment(this.vm.selectedLedger.entryDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
            }
        }

        // due to date picker of Tx chequeClearance date format need to change
        if (this.vm.selectedLedger.chequeClearanceDate) {
            if (!moment(this.vm.selectedLedger.chequeClearanceDate, 'DD-MM-YYYY').isValid()) {
                this._toasty.errorToast('Invalid Date Selected In Cheque Clearance Date.Please Select Valid Date');
                this._loaderService.hide();
                return;
            } else {
                this.vm.selectedLedger.chequeClearanceDate = moment(this.vm.selectedLedger.chequeClearanceDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
            }
        }

        let requestObj: LedgerResponse = this.vm.prepare4Submit();
        requestObj.valuesInAccountCurrency = this.vm.selectedCurrency === 0;
        requestObj.exchangeRate = (this.vm.selectedCurrencyForDisplay !== this.vm.selectedCurrency) ? (1 / this.vm.selectedLedger.exchangeRate) : this.vm.selectedLedger.exchangeRate;

        requestObj.transactions = requestObj.transactions.filter(f => !f.isDiscount);
        requestObj.transactions = requestObj.transactions.filter(tx => !tx.isTax);

        if (this.tcsOrTds === 'tds') {
            delete requestObj['tcsCalculationMethod'];
        }
        delete requestObj['tdsTaxes'];
        delete requestObj['tcsTaxes'];

        if (this.baseAccountChanged) {
            this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.firstBaseAccountSelected, this.entryUniqueName + '?newAccountUniqueName=' + this.changedAccountUniq));
        } else {
            this.store.dispatch(this._ledgerAction.updateTxnEntry(requestObj, this.firstBaseAccountSelected, this.entryUniqueName));
        }
    }

    public ngOnDestroy(): void {
        this.vm.resetVM();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public downloadAttachedFile(fileName: string, e: Event) {
        e.stopPropagation();
        this._ledgerService.DownloadAttachement(fileName).subscribe(d => {
            if (d.status === 'success') {
                let blob = base64ToBlob(d.body.uploadedFile, `image/${d.body.fileType}`, 512);
                return saveAs(blob, d.body.name);
            } else {
                this._toasty.errorToast(d.message);
            }
        });
    }

    public downloadInvoice(invoiceName: string, voucherType: string, e: Event) {
        e.stopPropagation();
        let downloadRequest = new DownloadLedgerRequest();
        downloadRequest.invoiceNumber = [invoiceName];
        downloadRequest.voucherType = voucherType;

        this._ledgerService.DownloadInvoice(downloadRequest, this.activeAccount.uniqueName).subscribe(d => {
            if (d.status === 'success') {
                let blob = base64ToBlob(d.body, 'application/pdf', 512);
                return saveAs(blob, `${this.activeAccount.name} - ${invoiceName}.pdf`);
            } else {
                this._toasty.errorToast(d.message);
            }
        });
    }

    public showQuickAccountModal() {
        this.showQuickAccountModalFromUpdateLedger.emit(true);
    }

    public changeBaseAccount(acc) {
        this.openDropDown = false;
        if (!acc) {
            this._toasty.errorToast('Account not changed');
            this.hideBaseAccountModal();
            return;
        }
        if (acc === this.baseAcc) {
            this._toasty.errorToast('Account not changed');
            this.hideBaseAccountModal();
            return;
        }
        this.changedAccountUniq = acc.value;
        this.baseAccountChanged = true;
        this.saveLedgerTransaction();
        this.hideBaseAccountModal();
    }

    public openBaseAccountModal() {
        if (this.vm.selectedLedger.voucherGenerated) {
            this._toasty.errorToast('You are not permitted to change base account. Voucher is already Generated');
            return;
        }
        this.updateBaseAccount.show();
        //
    }

    public hideBaseAccountModal() {
        this.updateBaseAccount.hide();
        //
    }

    public getInvoiveListsData(e: any) {
        if (e.value === 'rcpt') {
            this.invoiceList = [];
            this._ledgerService.GetInvoiceList({accountUniqueName: this.accountUniqueName, status: 'unpaid'}).subscribe((res: any) => {
                _.map(res.body.invoiceList, (o) => {
                    this.invoiceList.push({label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false});
                });
            });
        } else {
            this.invoiceList = [];
        }
    }

    public getInvoiveLists() {
        if (this.vm.selectedLedger.voucher.shortCode === 'rcpt') {
            this.invoiceList = [];
            this._ledgerService.GetInvoiceList({accountUniqueName: this.accountUniqueName, status: 'unpaid'}).subscribe((res: any) => {
                _.map(res.body.invoiceList, (o) => {
                    this.invoiceList.push({label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false});
                });
            });
        } else {
            this.invoiceList = [];
        }
    }

    public selectInvoice(invoiceNo, ev) {
        invoiceNo.isSelected = ev.target.checked;
        if (ev.target.checked) {
            this.vm.selectedLedger.invoicesToBePaid.push(invoiceNo.label);
        } else {
            let indx = this.vm.selectedLedger.invoicesToBePaid.indexOf(invoiceNo.label);
            this.vm.selectedLedger.invoicesToBePaid.splice(indx, 1);
        }
    }

    public openHeaderDropDown() {
        if (!this.vm.selectedLedger.voucherGenerated) {
            this.openDropDown = true;
        } else {
            this.openDropDown = false;
            this._toasty.errorToast('You are not permitted to change base account. Voucher is already Generated');
            return;
        }
    }

    public keydownPressed(e) {
        if (e.code === 'ArrowDown') {
            this.keydownClassAdded = true;
        } else if (e.code === 'Enter' && this.keydownClassAdded) {
            this.keydownClassAdded = true;
            this.toggleAsidePaneOpen();
        } else {
            this.keydownClassAdded = false;
        }

    }

    public toggleAsidePaneOpen() {
        if (document.getElementById('createNewId')) {
            document.getElementById('createNewId').click();
            this.keydownClassAdded = false;
        }
        if (document.getElementById('createNewId2')) {
            document.getElementById('createNewId2').click();
            this.keydownClassAdded = false;
        }
    }

    public hideDiscountTax(): void {
        if (this.discountComponent) {
            this.discountComponent.discountMenu = false;
        }
        if (this.taxControll) {
            this.taxControll.showTaxPopup = false;
        }
    }

    public hideDiscount(): void {
        if (this.discountComponent) {
            this.discountComponent.change();
            this.discountComponent.discountMenu = false;
        }
    }

    public hideTax(): void {
        if (this.taxControll) {
            this.taxControll.change();
            this.taxControll.showTaxPopup = false;
        }
    }

    public async toggleCurrency() {
        this.vm.selectedCurrencyForDisplay = this.vm.selectedCurrencyForDisplay === 1 ? 0 : 1;
        let rate = 0;
        if (Number(this.vm.selectedLedger.exchangeRateForDisplay)) {
            rate = 1 / this.vm.selectedLedger.exchangeRate;
        }
        this.vm.selectedLedger = {...this.vm.selectedLedger, exchangeRate: rate, exchangeRateForDisplay: giddhRoundOff(rate, this.vm.giddhBalanceDecimalPlaces)};
    }

    public exchangeRateChanged() {
        this.vm.selectedLedger.exchangeRate = Number(this.vm.selectedLedger.exchangeRateForDisplay) || 0;
        this.vm.inventoryAmountChanged();
    }

    private assignPrefixAndSuffixForCurrency() {
        this.vm.isPrefixAppliedForCurrency = this.vm.isPrefixAppliedForCurrency = !(['AED'].includes(this.vm.selectedCurrency === 0 ? this.vm.baseCurrencyDetails.code : this.vm.foreignCurrencyDetails.code));
        this.vm.selectedPrefixForCurrency = this.vm.isPrefixAppliedForCurrency ? this.vm.selectedCurrency === 0 ? this.vm.baseCurrencyDetails.symbol : this.vm.foreignCurrencyDetails.symbol : '';
        this.vm.selectedSuffixForCurrency = this.vm.isPrefixAppliedForCurrency ? '' : this.vm.selectedCurrency === 0 ? this.vm.baseCurrencyDetails.symbol : this.vm.foreignCurrencyDetails.symbol;
    }

    private getCurrencyRate() {
        let from = this.vm.selectedCurrency === 0 ? this.vm.baseCurrencyDetails.code : this.vm.foreignCurrencyDetails.code;
        let to = this.vm.selectedCurrency === 0 ? this.vm.foreignCurrencyDetails.code : this.vm.baseCurrencyDetails.code;
        let date = moment().format('DD-MM-YYYY');
        return this._ledgerService.GetCurrencyRateNewApi(from, to, date).toPromise();
    }
}
