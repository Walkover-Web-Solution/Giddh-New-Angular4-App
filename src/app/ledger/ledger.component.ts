import { AdvanceSearchModelComponent } from './components/advance-search/advance-search.component';
import { Store } from '@ngrx/store';
import { AppState } from '../store';
import { animate, Component, ComponentFactoryResolver, ElementRef, EventEmitter, OnDestroy, OnInit, QueryList, state, style, transition, trigger, ViewChild, ViewChildren } from '@angular/core';
import { BlankLedgerVM, LedgerVM, TransactionVM } from './ledger.vm';
import { LedgerActions } from '../actions/ledger/ledger.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { ActivatedRoute, Router } from '@angular/router';
import { DownloadLedgerRequest, IELedgerResponse, TransactionsResponse } from '../models/api-models/Ledger';
import { Observable } from 'rxjs/Observable';
import { ITransactionItem } from '../models/interfaces/ledger.interface';
import * as moment from 'moment/moment';
import { cloneDeep, filter, find, orderBy } from '../lodash-optimized';
import * as uuid from 'uuid';
import { LedgerService } from '../services/ledger.service';
import { saveAs } from 'file-saver';
import { AccountService } from '../services/account.service';
import { GroupService } from '../services/group.service';
import { ToasterService } from '../services/toaster.service';
import { GroupsWithAccountsResponse } from '../models/api-models/GroupsWithAccounts';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ModalDirective } from 'ngx-bootstrap';
import { base64ToBlob } from '../shared/helpers/helperFunctions';
import { ElementViewContainerRef } from '../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { UpdateLedgerEntryPanelComponent } from './components/updateLedgerEntryPanel/updateLedgerEntryPanel.component';
import { GeneralActions } from '../actions/general/general.actions';
import { AccountResponse } from '../models/api-models/Account';
import { BaseResponse } from '../models/api-models/BaseResponse';
import { IOption } from '../theme/ng-virtual-select/sh-options.interface';
import { NewLedgerEntryPanelComponent } from './components/newLedgerEntryPanel/newLedgerEntryPanel.component';
import { PaginationComponent } from 'ngx-bootstrap/pagination/pagination.component';
import { ShSelectComponent } from 'app/theme/ng-virtual-select/sh-select.component';
import { setTimeout } from 'timers';
import { createSelector } from 'reselect';
import { LoginActions } from 'app/actions/login.action';
import { ShareLedgerComponent } from 'app/ledger/components/shareLedger/shareLedger.component';
import { QuickAccountComponent } from 'app/theme/quick-account-component/quickAccount.component';
import { Subject } from 'rxjs/Subject';
import { AdvanceSearchModel, AdvanceSearchRequest } from '../models/interfaces/AdvanceSearchRequest';
import { InvoiceActions } from '../actions/invoice/invoice.actions';
import { UploaderOptions, UploadInput, UploadOutput } from 'ngx-uploader';
import { Configuration } from 'app/app.constant';
import { LEDGER_API } from '../services/apiurls/ledger.api';
import { LoaderService } from '../loader/loader.service';

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
  @ViewChild('advanceSearchComp') public advanceSearchComp: AdvanceSearchModelComponent;

  @ViewChildren(ShSelectComponent) public dropDowns: QueryList<ShSelectComponent>;
  public lc: LedgerVM;
  public accountInprogress$: Observable<boolean>;
  public universalDate$: Observable<any>;
  public datePickerOptions: any = {
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
  // public trxRequest: TransactionsRequest;
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
  public uploadInput: EventEmitter<UploadInput>;
  public fileUploadOptions: UploaderOptions;
  public isFileUploading: boolean = false;
  public closingBalanceBeforeReconcile: { amount: number, type: string };
  public reconcileClosingBalanceForBank: { amount: number, type: string };
  // aside menu properties
  public asideMenuState: string = 'out';
  public createStockSuccess$: Observable<boolean>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private entryUniqueNamesForBulkAction: string[] = [];

  constructor(private store: Store<AppState>, private _ledgerActions: LedgerActions, private route: ActivatedRoute,
              private _ledgerService: LedgerService, private _accountService: AccountService, private _groupService: GroupService,
              private _router: Router, private _toaster: ToasterService, private _companyActions: CompanyActions,
              private componentFactoryResolver: ComponentFactoryResolver, private _generalActions: GeneralActions, private _loginActions: LoginActions,
              private invoiceActions: InvoiceActions, private _loaderService: LoaderService) {
    this.lc = new LedgerVM();
    this.advanceSearchRequest = new AdvanceSearchRequest();
    this.lc.activeAccount$ = this.store.select(p => p.ledger.account).takeUntil(this.destroyed$);
    this.accountInprogress$ = this.store.select(p => p.ledger.accountInprogress).takeUntil(this.destroyed$);
    this.lc.transactionData$ = this.store.select(p => p.ledger.transactionsResponse).takeUntil(this.destroyed$).shareReplay();
    this.isLedgerCreateSuccess$ = this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$);
    this.lc.groupsArray$ = this.store.select(p => p.general.groupswithaccounts).takeUntil(this.destroyed$);
    this.lc.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).takeUntil(this.destroyed$);
    this.universalDate$ = this.store.select(p => p.session.applicationDate).takeUntil(this.destroyed$);
    this.isTransactionRequestInProcess$ = this.store.select(p => p.ledger.transactionInprogress).takeUntil(this.destroyed$);
    this.ledgerBulkActionSuccess$ = this.store.select(p => p.ledger.ledgerBulkActionSuccess).takeUntil(this.destroyed$);
    this.store.dispatch(this._generalActions.getFlattenAccount());
    this.store.dispatch(this._ledgerActions.GetDiscountAccounts());
    // get company taxes
    this.store.dispatch(this._companyActions.getTax());
    // reset redirect state from login action
    this.store.dispatch(this._loginActions.ResetRedirectToledger());
    this.sessionKey$ = this.store.select(p => p.session.user.session.id).takeUntil(this.destroyed$);
    this.companyName$ = this.store.select(p => p.session.companyUniqueName).takeUntil(this.destroyed$);
    this.createStockSuccess$ = this.store.select(s => s.inventory.createStockSuccess).takeUntil(this.destroyed$);
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
    let from = moment(value.picker.startDate, 'DD-MM-YYYY').toDate();
    let to = moment(value.picker.endDate, 'DD-MM-YYYY').toDate();

    // if ((this.advanceSearchRequest.dataToSend.bsRangeValue[0] !== from) || (this.advanceSearchRequest.dataToSend.bsRangeValue[1] !== to)) {

    this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
      page: 0,
      dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
        bsRangeValue: [from, to]
      })
    });

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
      txn.discounts = [];
      return;
    }

    this.lc.flattenAccountList.take(1).subscribe(data => {
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
    this.advanceSearchRequest.page = event.page;
    // this.lc.currentPage = event.page;
    this.getTransactionData();
  }

  public ngOnInit() {

    this.uploadInput = new EventEmitter<UploadInput>();
    this.fileUploadOptions = {concurrency: 0};

    Observable.combineLatest(this.universalDate$, this.route.params).subscribe((resp: any[]) => {
      this.hideEledgerWrap();
      let dateObj = resp[0];
      let params = resp[1];
      if (dateObj) {
        let universalDate = _.cloneDeep(dateObj);
        this.datePickerOptions.startDate = moment(universalDate[0], 'DD-MM-YYYY').toDate();
        this.datePickerOptions.endDate = moment(universalDate[1], 'DD-MM-YYYY').toDate();
        this.advanceSearchRequest = Object.assign({}, this.advanceSearchRequest, {
          dataToSend: Object.assign({}, this.advanceSearchRequest.dataToSend, {
            bsRangeValue: [moment(universalDate[0], 'DD-MM-YYYY').toDate(), moment(universalDate[1], 'DD-MM-YYYY').toDate()]
          })
        });
        // this.advanceSearchRequest.to = universalDate[1];
        this.advanceSearchRequest.page = 0;
      }
      if (params['accountUniqueName']) {
        // this.advanceSearchComp.resetAdvanceSearchModal();
        this.lc.accountUnq = params['accountUniqueName'];
        this.showLoader = false; // need to enable loder
        // this.ledgerSearchTerms.nativeElement.value = '';
        this.resetBlankTransaction();
        // this.datePickerOptions = {
        //   locale: {
        //     applyClass: 'btn-green',
        //     applyLabel: 'Go',
        //     fromLabel: 'From',
        //     format: 'D-MMM-YY',
        //     toLabel: 'To',
        //     cancelLabel: 'Cancel',
        //     customRangeLabel: 'Custom range'
        //   },
        //   ranges: {
        //     'Last 1 Day': [
        //       moment().subtract(1, 'days'),
        //       moment()
        //     ],
        //     'Last 7 Days': [
        //       moment().subtract(6, 'days'),
        //       moment()
        //     ],
        //     'Last 30 Days': [
        //       moment().subtract(29, 'days'),
        //       moment()
        //     ],
        //     'Last 6 Months': [
        //       moment().subtract(6, 'months'),
        //       moment()
        //     ],
        //     'Last 1 Year': [
        //       moment().subtract(12, 'months'),
        //       moment()
        //     ]
        //   },
        //   startDate: this.advanceSearchRequest.dataToSend.bsRangeValue[0] ? moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0], 'DD-MM-YYYY').toDate() : moment().subtract(30, 'days'),
        //   endDate: this.advanceSearchRequest.dataToSend.bsRangeValue[1] ? moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1], 'DD-MM-YYYY').toDate() : moment()
        // };
        // set state details
        let companyUniqueName = null;
        this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'ledger/' + this.lc.accountUnq;
        this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
        this.store.dispatch(this._ledgerActions.GetLedgerAccount(this.lc.accountUnq));
        this.store.dispatch(this._ledgerActions.setAccountForEdit(this.lc.accountUnq));
        // init transaction request and call for transaction data
        // this.advanceSearchRequest = new AdvanceSearchRequest();
        this.initTrxRequest(params['accountUniqueName']);
      }
    });

    this.isTransactionRequestInProcess$.subscribe(s => {
      if (!s && this.showLoader) {
        this.showLoader = false;
      }
    });

    this.lc.transactionData$.subscribe((lt: any) => {
      if (lt) {
        if (lt.closingBalanceForBank) {
          this.reconcileClosingBalanceForBank = lt.closingBalanceForBank;
          this.reconcileClosingBalanceForBank.type = this.reconcileClosingBalanceForBank.type === 'CREDIT' ? 'Cr' : 'Dr';
        }
        this.lc.currentPage = lt.page;
        this.lc.calculateReckonging(lt);
        setTimeout(() => {
          this.loadPaginationComponent(lt);
        }, 400);
      }
    });
    this.isLedgerCreateSuccess$.subscribe(s => {
      if (s) {
        this._toaster.successToast('Entry created successfully', 'Success');
        this.lc.showNewLedgerPanel = false;
        this.lc.showTaxationDiscountBox = false;
        this.initTrxRequest(this.lc.accountUnq);
        this.resetBlankTransaction();

        // Después del éxito de la entrada. llamar para transacciones bancarias
        this.lc.activeAccount$.subscribe((data: AccountResponse) => {
          if (data && data.yodleeAdded) {
            this.getBankTransactions();
          } else {
            this.hideEledgerWrap();
          }
        });
      }
    });

    Observable.combineLatest(this.lc.activeAccount$, this.lc.flattenAccountListStream$).subscribe(data => {
      if (data[0] && data[1]) {
        let accountDetails: AccountResponse = data[0];
        let parentOfAccount = accountDetails.parentGroups[0];
        // check if account is stockable
        let isStockableAccount = parentOfAccount ?
          (parentOfAccount.uniqueName === 'revenuefromoperations' || parentOfAccount.uniqueName === 'otherincome' ||
            parentOfAccount.uniqueName === 'operatingcost' || parentOfAccount.uniqueName === 'indirectexpenses') : false;
        let accountsArray: IOption[] = [];
        if (isStockableAccount && accountDetails.stocks && accountDetails.stocks.length > 0) {
          // stocks from ledger account
          data[1].map(acc => {
            // normal entry
            accountsArray.push({value: uuid.v4(), label: acc.name, additional: acc});
            accountDetails.stocks.map(as => {
              // stock entry
              accountsArray.push({
                value: uuid.v4(),
                label: acc.name + '(' + as.uniqueName + ')',
                additional: Object.assign({}, acc, {stock: as})
              });
            });
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
                  label: acc.name + '(' + as.uniqueName + ')',
                  additional: Object.assign({}, acc, {stock: as})
                });
              });
            } else {
              accountsArray.push({value: uuid.v4(), label: acc.name, additional: acc});
            }
          });
        }
        this.lc.flattenAccountList = Observable.of(orderBy(accountsArray, 'label'));
      }
    });

    this.lc.activeAccount$.subscribe(acc => {
      if (acc) {
        this.lc.getUnderstandingText(acc.accountType, acc.name);
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

    this.searchTermStream
      .debounceTime(700)
      .distinctUntilChanged()
      .subscribe(term => {
        this.advanceSearchRequest.q = term;
        this.advanceSearchRequest.page = 0;
        this.getTransactionData();
      });

    // get A/c details
    this.lc.activeAccount$.subscribe((data: AccountResponse) => {
      if (data) {
        if (data.yodleeAdded) {
          this.getBankTransactions();
        }
        if (data.parentGroups && data.parentGroups.length) {
          let findCashOrBankIndx = data.parentGroups.findIndex((grp) => grp.uniqueName === 'bankaccounts' || grp.uniqueName === 'cash');
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
    })).debounceTime(300).subscribe();

    this.ledgerBulkActionSuccess$.subscribe((yes: boolean) => {
      if (yes) {
        this.entryUniqueNamesForBulkAction = [];
        this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName,
          moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY'), moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY'),
          this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q));
      }
    });

    this.createStockSuccess$.subscribe(s => {
      if (s) {
        this.store.dispatch(this._generalActions.getFlattenAccount());
      }
    });

  }

  public initTrxRequest(accountUnq: string) {
    // this.advanceSearchRequest = this.advanceSearchRequest || new AdvanceSearchRequest();
    this.advanceSearchRequest.page = 0;
    this.advanceSearchRequest.count = 15;
    this.advanceSearchRequest.accountUniqueName = accountUnq;
    // this.advanceSearchRequest.from = this.advanceSearchRequest.from || moment(this.datePickerOptions.startDate).format('DD-MM-YYYY');
    // this.advanceSearchRequest.to = this.advanceSearchRequest.to || moment(this.datePickerOptions.endDate).format('DD-MM-YYYY');
    this.advanceSearchRequest.dataToSend = this.advanceSearchRequest.dataToSend || new AdvanceSearchModel();
    this.getTransactionData();
  }

  public getBankTransactions() {
    // && this.advanceSearchRequest.from
    if (this.advanceSearchRequest.accountUniqueName) {
      this._ledgerService.GetBankTranscationsForLedger(this.advanceSearchRequest.accountUniqueName, this.advanceSearchRequest.from).subscribe((res: BaseResponse<IELedgerResponse[], string>) => {
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

  public saveBankTransaction() {
    // Api llama para mover la transacción bancaria al libro mayor
    let blankTransactionObj: BlankLedgerVM = this.lc.prepareBankLedgerRequestObject();
    if (blankTransactionObj.transactions.length > 0) {
      this.store.dispatch(this._ledgerActions.CreateBlankLedger(cloneDeep(blankTransactionObj), this.lc.accountUnq));
    } else {
      this._toaster.errorToast('There must be at least a transaction to make an entry.', 'Error');
    }
  }

  public getTransactionData() {
    // this.isAdvanceSearchImplemented = false;
    // this.advanceSearchComp.resetAdvanceSearchModal();
    // this.advanceSearchRequest = null;
    this.closingBalanceBeforeReconcile = null;
    this.store.dispatch(this._ledgerActions.doAdvanceSearch(_.cloneDeep(this.advanceSearchRequest.dataToSend), this.advanceSearchRequest.accountUniqueName,
      moment(this.advanceSearchRequest.dataToSend.bsRangeValue[0]).format('DD-MM-YYYY'), moment(this.advanceSearchRequest.dataToSend.bsRangeValue[1]).format('DD-MM-YYYY'),
      this.advanceSearchRequest.page, this.advanceSearchRequest.count, this.advanceSearchRequest.q));
    // this.store.dispatch(this._ledgerActions.GetTransactions(cloneDeep(this.advanceSearchRequest)));
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

  public downloadInvoice(invoiceName: string, e: Event) {
    e.stopPropagation();
    let activeAccount = null;
    this.lc.activeAccount$.take(1).subscribe(p => activeAccount = p);
    let downloadRequest = new DownloadLedgerRequest();
    downloadRequest.invoiceNumber = [invoiceName];

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
          discounts: [],
          selectedAccount: null,
          applyApplicableTaxes: true,
          isInclusiveTax: true
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
          discounts: [],
          selectedAccount: null,
          applyApplicableTaxes: true,
          isInclusiveTax: true
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
      compoundTotal: 0
    };
    this.hideNewLedgerEntryPopup();
  }

  public showNewLedgerEntryPopup(trx: TransactionVM) {
    this.selectBlankTxn(trx);
    this.lc.showNewLedgerPanel = true;
  }

  public hideNewLedgerEntryPopup() {
    this.lc.showNewLedgerPanel = false;
  }

  public showUpdateLedgerModal(txn: ITransactionItem) {
    let transactions: TransactionsResponse = null;
    this.store.select(t => t.ledger.transactionsResponse).take(1).subscribe(trx => transactions = trx);

    if (transactions) {
      if (txn.isBaseAccount) {
        // store the trx values in store
        this.store.dispatch(this._ledgerActions.setAccountForEdit(txn.particular.uniqueName));
      } else {
        // find trx from transactions array and store it in store
        let debitTrx: ITransactionItem[] = transactions.debitTransactions.filter(f => f.entryUniqueName === txn.entryUniqueName);
        let creditTrx: ITransactionItem[] = transactions.creditTransactions.filter(f => f.entryUniqueName === txn.entryUniqueName);
        let finalTrx: ITransactionItem[] = [...debitTrx, ...creditTrx];
        let baseAccount: ITransactionItem = finalTrx.find(f => f.isBaseAccount);
        if (baseAccount) {
          this.store.dispatch(this._ledgerActions.setAccountForEdit(baseAccount.particular.uniqueName));
        } else {
          // re activate account from url params
          this.store.dispatch(this._ledgerActions.setAccountForEdit(this.lc.accountUnq));
        }
      }
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
    let blankTransactionObj: BlankLedgerVM = this.lc.prepareBlankLedgerRequestObject();
    if (blankTransactionObj.transactions.length > 0) {
      this.store.dispatch(this._ledgerActions.CreateBlankLedger(cloneDeep(blankTransactionObj), this.lc.accountUnq));
    } else {
      this._toaster.errorToast('There must be at least a transaction to make an entry.', 'Error');
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
    this.lc.activeAccount$.take(1).subscribe(a => activeAccount = a);
    this.lc.groupsArray$.take(1).subscribe(a => groupWithAccountsList = a);

    let parent;
    let parentGroup: GroupsWithAccountsResponse;

    parent = activeAccount.parentGroups[0].uniqueName;
    parentGroup = find(groupWithAccountsList, (p: any) => p.uniqueName === parent);
    if (parentGroup.category === 'income' || parentGroup.category === 'expenses') {
      return true;
    } else {
      if (txn.selectedAccount) {
        parent = txn.selectedAccount.parentGroups[0].uniqueName;
        parentGroup = find(groupWithAccountsList, (p: any) => p.uniqueName === parent);
        return parentGroup.category === 'income' || parentGroup.category === 'expenses';
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
      // this.store.dispatch(this._ledgerActions.resetLedgerTrxDetails());
      componentRef.destroy();
      this.entryManipulated();
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
    this.searchTermStream.next(term);
  }

  /**
   * closeAdvanceSearchPopup
   */
  public closeAdvanceSearchPopup(isCancel) {
    this.advanceSearchModel.hide();
    if (!isCancel) {
      this.getTransactionData();
    }
    // this.advanceSearchRequest = _.cloneDeep(advanceSearchRequest);
  }

  public getReconciliation() {
    this.lc.transactionData$.take(2).subscribe((val) => {
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

  public performBulkAction(actionType: string) {
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
      default:
        this._toaster.warningToast('Please select a valid action.', 'Warning');
    }
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
      console.log('entryUniqueName not found');
    }
  }

  public onCancelBulkActionConfirmation() {
    this.bulkActionConfirmationModal.hide();
  }

  public onConfirmationBulkActionConfirmation() {
    this.store.dispatch(this._ledgerActions.DeleteMultipleLedgerEntries(this.lc.accountUnq, _.cloneDeep(this.entryUniqueNamesForBulkAction)));
    this.bulkActionConfirmationModal.hide();
  }

  public onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      let sessionKey = null;
      let companyUniqueName = null;
      this.sessionKey$.take(1).subscribe(a => sessionKey = a);
      this.companyName$.take(1).subscribe(a => companyUniqueName = a);
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
    this.store.dispatch(this.invoiceActions.GenerateBulkInvoice({combined: isCombined}, [{accountUniqueName: this.lc.accountUnq, entries: _.cloneDeep(this.entryUniqueNamesForBulkAction)}], 'ledger'));
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

  // endregion
}
