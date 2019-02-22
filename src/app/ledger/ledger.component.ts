import { BehaviorSubject, combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, shareReplay, take, takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, HostListener, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { BlankLedgerVM, LedgerVM, TransactionVM } from './ledger.vm';
import { LedgerActions } from '../actions/ledger/ledger.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { DownloadLedgerRequest, IELedgerResponse, TransactionsRequest, TransactionsResponse } from '../models/api-models/Ledger';
import { ITransactionItem } from '../models/interfaces/ledger.interface';
import * as moment from 'moment/moment';
import { cloneDeep, filter, find, orderBy, uniq } from '../lodash-optimized';
import * as uuid from 'uuid';
import { LedgerService } from '../services/ledger.service';
import { saveAs } from 'file-saver';
import { AccountService } from '../services/account.service';
import { GroupService } from '../services/group.service';
import { ToasterService } from '../services/toaster.service';
import { GroupsWithAccountsResponse } from '../models/api-models/GroupsWithAccounts';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ModalDirective, PaginationComponent } from 'ngx-bootstrap';
import { base64ToBlob } from '../shared/helpers/helperFunctions';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { UpdateLedgerEntryPanelComponent } from './components/updateLedgerEntryPanel/updateLedgerEntryPanel.component';
import { GeneralActions } from '../actions/general/general.actions';
import { AccountResponse } from '../models/api-models/Account';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { IOption } from '../theme/ng-virtual-select/sh-options.interface';
import { NewLedgerEntryPanelComponent } from './components/newLedgerEntryPanel/newLedgerEntryPanel.component';
import { ShSelectComponent } from 'app/theme/ng-virtual-select/sh-select.component';
import { createSelector } from 'reselect';
import { LoginActions } from 'app/actions/login.action';
import { ShareLedgerComponent } from 'app/ledger/components/shareLedger/shareLedger.component';
import { QuickAccountComponent } from 'app/theme/quick-account-component/quickAccount.component';
import { AdvanceSearchRequest } from '../models/interfaces/AdvanceSearchRequest';
import { InvoiceActions } from '../actions/invoice/invoice.actions';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { Configuration } from 'app/app.constant';
import { LEDGER_API } from '../services/apiurls/ledger.api';
import { LoaderService } from '../loader/loader.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { IFlattenAccountsResultItem } from '../models/interfaces/flattenAccountsResultItem.interface';
import { SettingsDiscountActions } from '../actions/settings/discount/settings.discount.action';
import { GIDDH_DATE_FORMAT } from 'app/shared/helpers/defaultDateFormat';
import { BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

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

  // @ViewChild('advanceSearchComp') public advanceSearchComp: AdvanceSearchModelComponent;

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
  @ViewChild('newLedPanel') public newLedPanelCtrl: NewLedgerEntryPanelComponent;
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
  public ledgerTxnBalance$: Observable<any> = observableOf({});
  public isAdvanceSearchImplemented: boolean = false;
  public invoiceList: any[] = [];
  public keydownClassAdded: boolean = false;
  public isSelectOpen: boolean;
  public giddhDateFormat: string = GIDDH_DATE_FORMAT;
  public profileObj: any;

  // public accountBaseCurrency: string;
  // public showMultiCurrency: boolean;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private subscribeCount: number = 0;
  private accountUniquename: any;

  constructor(private store: Store<AppState>, private _ledgerActions: LedgerActions, private route: ActivatedRoute,
              private _ledgerService: LedgerService, private _accountService: AccountService, private _groupService: GroupService,
              private _router: Router, private _toaster: ToasterService, private _companyActions: CompanyActions,
              private componentFactoryResolver: ComponentFactoryResolver, private _generalActions: GeneralActions, private _loginActions: LoginActions,
              private invoiceActions: InvoiceActions, private _loaderService: LoaderService, private _settingsDiscountAction: SettingsDiscountActions) {
    this.lc = new LedgerVM();
    this.advanceSearchRequest = new AdvanceSearchRequest();
    this.trxRequest = new TransactionsRequest();
    this.lc.activeAccount$ = this.store.select(p => p.ledger.account).pipe(takeUntil(this.destroyed$));
    this.accountInprogress$ = this.store.select(p => p.ledger.accountInprogress).pipe(takeUntil(this.destroyed$));
    this.lc.transactionData$ = this.store.select(p => p.ledger.transactionsResponse).pipe(takeUntil(this.destroyed$), shareReplay(1));
    this.isLedgerCreateSuccess$ = this.store.select(p => p.ledger.ledgerCreateSuccess).pipe(takeUntil(this.destroyed$));
    this.lc.groupsArray$ = this.store.select(p => p.general.groupswithaccounts).pipe(takeUntil(this.destroyed$));
    this.lc.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).pipe(takeUntil(this.destroyed$));
    this.todaySelected$ = this.store.select(p => p.session.todaySelected).pipe(takeUntil(this.destroyed$));
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    this.isTransactionRequestInProcess$ = this.store.select(p => p.ledger.transactionInprogress).pipe(takeUntil(this.destroyed$));
    this.ledgerBulkActionSuccess$ = this.store.select(p => p.ledger.ledgerBulkActionSuccess).pipe(takeUntil(this.destroyed$));
    this.store.dispatch(this._generalActions.getFlattenAccount());
    this.store.dispatch(this._ledgerActions.GetDiscountAccounts());
    this.store.dispatch(this._settingsDiscountAction.GetDiscount());
    // get company taxes
    this.store.dispatch(this._companyActions.getTax());
    // reset redirect state from login action
    this.store.dispatch(this._loginActions.ResetRedirectToledger());
    this.sessionKey$ = this.store.select(p => p.session.user.session.id).pipe(takeUntil(this.destroyed$));
    this.companyName$ = this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$));
    this.createStockSuccess$ = this.store.select(s => s.inventory.createStockSuccess).pipe(takeUntil(this.destroyed$));
    this.isCompanyCreated$ = this.store.select(s => s.session.isCompanyCreated).pipe(takeUntil(this.destroyed$));
    this.failedBulkEntries$ = this.store.select(p => p.ledger.ledgerBulkActionFailedEntries).pipe(takeUntil(this.destroyed$));
    this.ledgerTxnBalance$ = this.store.select(p => p.ledger.ledgerTransactionsBalance).pipe(takeUntil(this.destroyed$));
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
    // }
  }

  public selectAccount(e: IOption, txn: TransactionVM) {
    if (!e.value) {
      // if there's no selected account set selectedAccount to null
      txn.selectedAccount = null;
      this.lc.currentBlankTxn = null;
      txn.amount = 0;
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
              rate: 0
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
                  rate: 0
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
          // reset taxes and discount on selected account change
          // txn.tax = 0;
          // txn.taxes = [];
          // txn.discount = 0;
          // txn.discounts = [];
          // txn.currency = e.additional.currency;
          // if (e.additional.currency && (this.accountBaseCurrency !== e.additional.currency)) {
          //   this.showMultiCurrency = true;
          // } else {
          //   this.showMultiCurrency = false;
          // }
          return;
        }
      });
    });
    // check if selected account category allows to show taxationDiscountBox in newEntry popup
    this.lc.showTaxationDiscountBox = this.getCategoryNameFromAccountUniqueName(txn);
    this.newLedPanelCtrl.detactChanges();
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
    this.fileUploadOptions = {concurrency: 0};

    observableCombineLatest(this.universalDate$, this.route.params, this.todaySelected$).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
      if (!resp[0] && !resp[2]) {
        return;
      }

      this.subscribeCount++;

      this.hideEledgerWrap();
      let dateObj = resp[0];
      let params = resp[1];
      this.todaySelected = resp[2];
      if (dateObj && !this.todaySelected) {
        let universalDate = _.cloneDeep(dateObj);
        this.datePickerOptions.startDate = moment(universalDate[0], 'DD-MM-YYYY').toDate();
        this.datePickerOptions.endDate = moment(universalDate[1], 'DD-MM-YYYY').toDate();

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
      }
      if (params['accountUniqueName']) {
        // this.advanceSearchComp.resetAdvanceSearchModal();
        this.lc.accountUnq = params['accountUniqueName'];
        this.needToShowLoader = true;
        // this.showLoader = false; // need to enable loder
        // if (this.ledgerSearchTerms) {
        //   this.ledgerSearchTerms.nativeElement.value = '';
        // }
        this.searchText = '';
        this.searchTermStream.next('');
        this.resetBlankTransaction();

        // set state details
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'ledger/' + this.lc.accountUnq;
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
        this.isCompanyCreated$.subscribe(s => {
          if (!s) {
            this.store.dispatch(this._ledgerActions.GetLedgerAccount(this.lc.accountUnq));
          }
        });
        this.store.dispatch(this._ledgerActions.setAccountForEdit(this.lc.accountUnq));
        // init transaction request and call for transaction data
        // this.advanceSearchRequest = new AdvanceSearchRequest();
        this.initTrxRequest(params['accountUniqueName']);
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

    this.lc.transactionData$.subscribe((lt: any) => {
      if (lt) {
        if (lt.closingBalanceForBank) {
          this.reconcileClosingBalanceForBank = lt.closingBalanceForBank;
          this.reconcileClosingBalanceForBank.type = this.reconcileClosingBalanceForBank.type === 'CREDIT' ? 'Cr' : 'Dr';
        }

        let checkedEntriesName: string[] = uniq([
          ...lt.debitTransactions.filter(f => f.isChecked).map(dt => dt.entryUniqueName),
          ...lt.creditTransactions.filter(f => f.isChecked).map(ct => ct.entryUniqueName),
        ]);

        checkedEntriesName.forEach(f => {
          let duplicate = this.checkedTrxWhileHovering.some(s => s === f);
          if (!duplicate) {
            this.checkedTrxWhileHovering.push(f);
          }
        });

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
        }, 400);
      }
    });

    this.ledgerTxnBalance$.subscribe((txnBalance: any) => {
      if (txnBalance) {
        this.lc.calculateReckonging(txnBalance);
      }
    });

    this.isLedgerCreateSuccess$.subscribe(s => {
      if (s) {
        this._toaster.successToast('Entry created successfully', 'Success');
        this.lc.showNewLedgerPanel = false;
        this.lc.showTaxationDiscountBox = false;
        // this.store.dispatch(this._ledgerActions.GetLedgerBalance(this.trxRequest));
        this.initTrxRequest(this.lc.accountUnq);
        this.resetBlankTransaction();

        // Después del éxito de la entrada. llamar para transacciones bancarias
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

    observableCombineLatest(this.lc.activeAccount$, this.lc.flattenAccountListStream$).subscribe(data => {
      if (data[0] && data[1]) {
        let stockListFormFlattenAccount: IFlattenAccountsResultItem;
        if (data[1]) {
          stockListFormFlattenAccount = data[1].find((acc) => acc.uniqueName === this.lc.accountUnq);
        }
        let accountDetails: AccountResponse = data[0];
        let parentOfAccount = accountDetails.parentGroups[0];
        // check if account is stockable
        let isStockableAccount = parentOfAccount ?
          (parentOfAccount.uniqueName === 'revenuefromoperations' || parentOfAccount.uniqueName === 'otherincome' ||
            parentOfAccount.uniqueName === 'operatingcost' || parentOfAccount.uniqueName === 'indirectexpenses') : false;
        let accountsArray: IOption[] = [];
        if (isStockableAccount) {
          // stocks from ledger account
          data[1].map(acc => {
            // normal entry
            accountsArray.push({value: uuid.v4(), label: acc.name, additional: acc});
            // accountDetails.stocks.map(as => { // As discussed with Gaurav sir, we need to pick stocks form flatten account's response
            if (stockListFormFlattenAccount && stockListFormFlattenAccount.stocks) {
              stockListFormFlattenAccount.stocks.map(as => {
                // stock entry
                accountsArray.push({
                  value: uuid.v4(),
                  label: `${acc.name}` + ` (${as.name})`,
                  additional: Object.assign({}, acc, {stock: as})
                });
              });
            }
          });
        } else {
          // stocks from account itself
          data[1].map(acc => {
            if (acc.stocks) {
              // normal entry
              accountsArray.push({value: uuid.v4(), label: acc.name, additional: acc});

              // stock entry
              acc.stocks.map(as => {
                accountsArray.push({
                  value: uuid.v4(),
                  // label: acc.name + '(' + as.uniqueName + ')',
                  label: `${acc.name}` + ` (${as.name})`,
                  additional: Object.assign({}, acc, {stock: as})
                });
              });
            } else {
              accountsArray.push({value: uuid.v4(), label: acc.name, additional: acc});
            }
          });
        }
        this.lc.flattenAccountList = observableOf(orderBy(accountsArray, 'label'));
      }
    });

    this.lc.activeAccount$.subscribe(acc => {
      if (acc) {
        // need to clear selected entries when account changes
        this.entryUniqueNamesForBulkAction = [];
        this.needToShowLoader = true;
        this.lc.getUnderstandingText(acc.accountType, acc.name);
        this.accountUniquename = acc.uniqueName;
        this.getInvoiveLists({accountUniqueName: acc.uniqueName, status: 'unpaid'});
        // this.store.dispatch(this._ledgerActions.GetUnpaidInvoiceListAction({accountUniqueName: acc.uniqueName, status: 'unpaid'}));
      }
    });

    // search
    // Observable.fromEvent(this.ledgerSearchTerms.nativeElement, 'input')
    //   .debounceTime(700)
    //   .distinctUntilChanged()
    //   .map((e: any) => e.target.value)
    //   .subscribe(term => {
    //     this.trxRequest.q = term;
    //     this.trxRequest.page = 0;
    //     this.getTransactionData();
    //   });

    this.searchTermStream.pipe(
      debounceTime(700),
      distinctUntilChanged())
      .subscribe(term => {
        // this.advanceSearchRequest.q = term;
        // this.advanceSearchRequest.page = 0;
        this.trxRequest.q = term;
        this.trxRequest.page = 0;
        this.needToShowLoader = false;
        this.getTransactionData();
      });

    // get A/c details
    this.lc.activeAccount$.subscribe((data: AccountResponse) => {
      if (data) {
        if (data.yodleeAdded) {
          this.getBankTransactions();
        }
        if (data.parentGroups && data.parentGroups.length) {
          let findCashOrBankIndx = data.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts');
          if (findCashOrBankIndx !== -1) {
            this.isBankOrCashAccount = true;
          } else {
            this.isBankOrCashAccount = false;
          }
        }
        // if (data.currency) {
        //   this.accountBaseCurrency = data.currency;
        // }
      } else {
        this.hideEledgerWrap();
      }
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

    this.store.pipe(select(s => s.settings.profile), takeUntil(this.destroyed$)).subscribe(s => {
      this.profileObj = s;
    });
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
    // console.log('txn selected');
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
      this.getInvoiveLists({accountUniqueName: this.accountUniquename, status: 'unpaid'});
    }
  }

  public saveBankTransaction() {
    // Api llama para mover la transacción bancaria al libro mayor
    let blankTransactionObj: BlankLedgerVM = this.lc.prepareBankLedgerRequestObject();
    blankTransactionObj.invoicesToBePaid = this.selectedInvoiceList;
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
    // console.log('parent list is..', this.selectedInvoiceList);
  }

  public getTransactionData() {
    // this.isAdvanceSearchImplemented = false;
    // this.advanceSearchComp.resetAdvanceSearchModal();
    // this.advanceSearchRequest = null;
    this.isAdvanceSearchImplemented = false;
    this.closingBalanceBeforeReconcile = null;
    this.store.dispatch(this._ledgerActions.GetLedgerBalance(this.trxRequest));
    this.store.dispatch(this._ledgerActions.GetTransactions(this.trxRequest));
    // if (!this.todaySelected) {
    //   this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName,
    //     moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY'), moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY'),
    //     this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q));
    // } else {
    //   this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName, '', '', this.advanceSearchRequest.page, this.advanceSearchRequest.count ));
    // }
  }

  public toggleTransactionType(event: string) {
    let allTrx: TransactionVM[] = filter(this.lc.blankLedger.transactions, bl => bl.type === event);
    let unAccountedTrx = find(allTrx, a => !a.selectedAccount);

    if (unAccountedTrx) {
      this.selectBlankTxn(unAccountedTrx);

      this.dropDowns.filter(dd => dd.idEl === unAccountedTrx.id).forEach(dd => {
        setTimeout(() => {
          dd.show(null);
        }, 0);
      });
    } else {
      let newTrx = this.lc.addNewTransaction(event);
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
        {
          id: uuid.v4(),
          amount: 0,
          tax: 0,
          total: 0,
          particular: '',
          type: 'DEBIT',
          taxes: [],
          discount: 0,
          discounts: [
            this.lc.staticDefaultDiscount()
          ],
          selectedAccount: null,
          applyApplicableTaxes: true,
          isInclusiveTax: true,
          isChecked: false
        },
        {
          id: uuid.v4(),
          amount: 0,
          particular: '',
          tax: 0,
          total: 0,
          type: 'CREDIT',
          taxes: [],
          discount: 0,
          discounts: [
            this.lc.staticDefaultDiscount()
          ],
          selectedAccount: null,
          applyApplicableTaxes: true,
          isInclusiveTax: true,
          isChecked: false
        }],
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
      invoicesToBePaid: []
    };
    this.hideNewLedgerEntryPopup();
  }

  public showNewLedgerEntryPopup(trx: TransactionVM) {
    this.selectBlankTxn(trx);
    this.lc.showNewLedgerPanel = true;
  }

  public onSelectHide(navigator) {
    navigator.setEnabled(true);
    // To Prevent Race condition
    setTimeout(() => this.isSelectOpen = false, 500);
  }

  public onEnter(select, txn) {
    if (!this.isSelectOpen) {
      this.isSelectOpen = true;
      select.show();
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

  public hideNewLedgerEntryPopup() {
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
    let blankTransactionObj: BlankLedgerVM = this.lc.prepareBlankLedgerRequestObject();
    if (blankTransactionObj.transactions.length > 0) {

      let isThereAnyTaxEntry = blankTransactionObj.transactions.some(s => s.taxes.length > 0);

      if (isThereAnyTaxEntry) {
        if (this.profileObj && this.profileObj.gstDetails && this.profileObj.gstDetails.length) {
          let isThereAnyGstDetails = this.profileObj.gstDetails.some(gst => gst.gstNumber);
          if (!isThereAnyGstDetails) {
            this._toaster.errorToast('Please add GSTIN details in Settings before applying taxes', 'Error');
            this._loaderService.hide();
            return;
          }
        } else {
          this._toaster.errorToast('Please add GSTIN details in Settings before applying taxes', 'Error');
          this._loaderService.hide();
          return;
        }
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
    this.store.select(createSelector([(st: AppState) => st.ledger.isAdvanceSearchApplied], (yesOrNo: boolean) => {
      // if (yesOrNo) {
      // this.advanceSearchComp.onSearch();
      // } else {
      this.getTransactionData();
      // }
    })).subscribe();
    // this.trxRequest = new TransactionsRequest();
    // this.trxRequest.accountUniqueName = this.lc.accountUnq;
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

    parent = activeAccount.parentGroups[0].uniqueName;
    parentGroup = find(groupWithAccountsList, (p: any) => p.uniqueName === parent);
    if (parentGroup.category === 'income' || parentGroup.category === 'expenses' || parentGroup.category === 'assets') {
      return true;
    } else {
      if (txn.selectedAccount) {
        parent = txn.selectedAccount.parentGroups[0].uniqueName;
        parentGroup = find(groupWithAccountsList, (p: any) => p.uniqueName === parent);
        return parentGroup.category === 'income' || parentGroup.category === 'expenses' || parentGroup.category === 'assets';
      }
    }
    return false;
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
    componentInstance.closeUpdateLedgerModal.subscribe(() => {
      this.hideUpdateLedgerModal();
    });

    this.updateLedgerModal.onHidden.pipe(take(1)).subscribe(() => {
      if (this.showUpdateLedgerForm) {
        this.hideUpdateLedgerModal();
      }
      this.entryManipulated();
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
  public closeAdvanceSearchPopup(isCancel) {
    this.advanceSearchModel.hide();
    if (!isCancel) {
      this.getAdvanceSearchTxn();
      // this.getTransactionData();
    }
    // this.advanceSearchRequest = _.cloneDeep(advanceSearchRequest);
  }

  public getReconciliation() {
    this.lc.transactionData$.pipe(take(1)).subscribe((val) => {
      if (val) {
        this.closingBalanceBeforeReconcile = val.closingBalance;
        this.closingBalanceBeforeReconcile.type = this.closingBalanceBeforeReconcile.type === 'CREDIT' ? 'Cr' : 'Dr';
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
    // this.lc.blankLedger.transactions.map(bt => {
    //   if (bt.type === key) {
    //     bt.isChecked = ev.target.checked;
    //   }
    //   return bt;
    // });
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
    } else {
      // console.log('entryUniqueName not found');
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
        data: {entries: _.cloneDeep(this.entryUniqueNamesForBulkAction).join()},
        headers: {'Session-Id': sessionKey},
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
    this.store.dispatch(this._ledgerActions.GenerateBulkLedgerInvoice({combined: isCombined}, [{accountUniqueName: this.lc.accountUnq, entries: _.cloneDeep(this.entryUniqueNamesForBulkAction)}], 'ledger'));
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

  // region asidemenu toggle
  public toggleBodyClass() {
    if (this.asideMenuState === 'in') {
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

  public getAdvanceSearchTxn() {
    this.isAdvanceSearchImplemented = true;
    if (!this.todaySelected) {
      this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName,
        moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY'), moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY'),
        this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q));
    } else {
      this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName, moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY'), moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY'), this.advanceSearchRequest.page, this.advanceSearchRequest.count));
    }
  }

  public getInvoiveLists(request) {
    this.invoiceList = [];
    this._ledgerService.GetInvoiceList(request).subscribe((res: any) => {
      _.map(res.body.invoiceList, (o) => {
        this.invoiceList.push({label: o.invoiceNumber, value: o.invoiceNumber, isSelected: false});
      });
      _.uniqBy(this.invoiceList, 'value');
    });
  }

  @HostListener('window:scroll')
  public onScrollEvent() {
    this.datepickers.hide();
  }
  public keydownPressed(e) {
    // if ( e.code === 'ArrowDown') {
    //  this.keydownClassAdded = true;
    // } else if (e.code === 'Enter') {
    // this.keydownClassAdded = true;
    // this.toggleAsidePane();
    // } else {
    //    this.keydownClassAdded = false;
    // }

  }
}
