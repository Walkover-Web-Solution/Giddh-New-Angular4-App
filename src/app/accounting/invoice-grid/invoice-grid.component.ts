import { TallyModuleService } from './../tally-service';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { CreatedBy } from './../../models/api-models/Invoice';
import { IParticular, LedgerRequest } from './../../models/api-models/Ledger';
import { setTimeout } from 'timers';
import { VsForDirective } from './../../theme/ng2-vs-for/ng2-vs-for';
import { ToasterService } from './../../services/toaster.service';
import { KeyboardService } from './../keyboard.service';
import { LedgerActions } from './../../actions/ledger/ledger.actions';
import { IOption } from './../../theme/ng-select/option.interface';
import { AccountService } from './../../services/account.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList, transition, ElementRef, AfterViewInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ComponentFactoryResolver } from '@angular/core';
import { Location } from '@angular/common';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import * as _ from 'app/lodash-optimized';
import * as moment from 'moment';
import { FlyAccountsActions } from 'app/actions/fly-accounts.actions';
import { LedgerVM, BlankLedgerVM } from 'app/ledger/ledger.vm';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';
import { SalesActions } from 'app/actions/sales/sales.action';
import { AccountResponse } from '../../models/api-models/Account';
import { IFlattenAccountsResultItem } from '../../models/interfaces/flattenAccountsResultItem.interface';
import { QuickAccountComponent } from '../../theme/quick-account-component/quickAccount.component';
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';

const TransactionsType = [
  { label: 'By', value: 'Debit' },
  { label: 'To', value: 'Credit' },
];

const CustomShortcode = [
  { code: 'F9', route: 'purchase' }
];

@Component({
  selector: 'account-as-invoice',
  templateUrl: './invoice-grid.component.html',
  styleUrls: ['./invoice-grid.component.css', '../accounting.component.css']
})

export class AccountAsInvoiceComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  @Input() public openDatePicker: boolean;
  @Input() public openCreateAccountPopup: boolean;
  @Input() public newSelectedAccount: AccountResponse;
  @Output() public showAccountList: EventEmitter<boolean> = new EventEmitter();
  @Output() public showStockList: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('quickAccountComponent') public quickAccountComponent: ElementViewContainerRef;
  @ViewChild('quickAccountModal') public quickAccountModal: ModalDirective;

  @ViewChildren(VsForDirective) public columnView: QueryList<VsForDirective>;
  @ViewChild('particular') public accountField: any;
  @ViewChild('dateField') public dateField: ElementRef;
  @ViewChild('manageGroupsAccountsModal') public manageGroupsAccountsModal: ModalDirective;

  // public showAccountList: boolean = true;
  public TransactionType: 'by' | 'to' = 'by';
  public data: any = new BlankLedgerVM();
  public totalCreditAmount: number = 0;
  public totalDebitAmount: number = 0;
  public showConfirmationBox: boolean = false;
  public moment = moment;
  public accountSearch: string = '';
  public stockSearch: string;
  public selectedRowIdx: any;
  public isSelectedRow: boolean;
  public selectedInput: any;
  public entryDate: any;
  public navigateURL: any = CustomShortcode;
  public showInvoiceDate: boolean = false;
  // public purchaseType: string = 'invoice';
  public groupUniqueName: string = 'purchases';
  public filterByGrp: boolean = false;
  // public showStockList: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public selectedAcc: object;
  public accountType: string;
  public accountsTransaction = [];
  public stocksTransaction = [];
  public selectedAccIdx: any;
  public creditorAcc: any = {};
  public debtorAcc: any = {};
  public stockTotal = null;
  public accountsTotal = null;
  public arrowInput: { key: number };
  public gridType: string = 'invoice';
  public isPartyACFocused: boolean = false;
  public displayDay: string = '';
  public dateMask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public keyUpDownEvent: KeyboardEvent;
  public filterByText: string = '';
  public inputForList: IOption[];
  public flattenAccounts: IOption[];
  public stockList: IOption[];
  public showLedgerAccountList: boolean = false;
  public selectedField: 'account' | 'stock' | 'partyAcc';
  public currentSelectedValue: string = '';
  public invoiceNoHeading: string = 'Supplier Invoice No';
  public isSalesInvoiceSelected: boolean = false; // need to hide `invoice no.` field in sales

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _accountService: AccountService,
    private _ledgerActions: LedgerActions,
    private store: Store<AppState>,
    private _keyboardService: KeyboardService,
    private flyAccountActions: FlyAccountsActions,
    private _toaster: ToasterService,
    private _router: Router,
    private _salesActions: SalesActions,
    private _tallyModuleService: TallyModuleService,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {
    // this.data.transactions.inventory = [];
    this._keyboardService.keyInformation.subscribe((key) => {
      this.watchKeyboardEvent(key);
    });
      // this.store.dispatch(this._salesActions.getFlattenAcOfPurchase({groupUniqueNames: ['purchases']}));

    this._tallyModuleService.selectedPageInfo.distinctUntilChanged((p, q) => {
      if (p && q) {
        return (_.isEqual(p, q));
      }
      if ((p && !q) || (!p && q)) {
        return false;
      }
      return true;
     }).subscribe((d) => {
      if (d && d.gridType === 'invoice') {
        this.data.voucherType = d.page;
        this.gridType = d.gridType;
        setTimeout(() => {
          this.dateField.nativeElement.focus();
        }, 50);
        if (d.page === 'Debit note' || d.page === 'Credit note') {
          this.invoiceNoHeading = 'Original invoice number';
        } else {
          this.invoiceNoHeading = 'Supplier Invoice No';
        }
        if (d.page === 'Sales') {
          this.isSalesInvoiceSelected = true;
        } else {
          this.isSalesInvoiceSelected = false;
        }
      } else if (d && this.data.transactions) {
        this.gridType = d.gridType;
        this.data.transactions = this.prepareDataForVoucher();
        this._tallyModuleService.requestData.next(this.data);
      }
    });

    this._tallyModuleService.requestData.distinctUntilChanged((p, q) => {
      if (p && q) {
        return (_.isEqual(p, q));
      }
      if ((p && !q) || (!p && q)) {
        return false;
      }
      return true;
     }).subscribe((data) => {
      if (data) {
        this.data = _.cloneDeep(data);
        if (this.gridType === 'invoice') {
          this.prepareDataForInvoice(this.data);
        }
      }
    });

  }

  public ngOnInit() {

    this.store.select(p => p.ledger.ledgerCreateSuccess).takeUntil(this.destroyed$).subscribe((s: boolean) => {
      if (s) {
        this._toaster.successToast('Entry created successfully', 'Success');
        this.refreshEntry();
        this.data.description = '';
        this.dateField.nativeElement.focus();
      }
    });
    this.entryDate = moment().format(GIDDH_DATE_FORMAT);
    // this.refreshEntry();
    // this.data.transactions[this.data.transactions.length - 1].inventory.push(this.initInventory());

    this._tallyModuleService.filteredAccounts.subscribe((accounts) => {
      if (accounts) {
        let accList: IOption[] = [];
        accounts.forEach((acc: IFlattenAccountsResultItem) => {
          accList.push({ label: `${acc.name} (${acc.uniqueName})`, value: acc.uniqueName, additional: acc });
        });
        this.flattenAccounts = accList;
        this.inputForList = _.cloneDeep(this.flattenAccounts);
      }
    });

  }

  public ngOnChanges(c: SimpleChanges) {
    if ('openDatePicker' in c && c.openDatePicker.currentValue !== c.openDatePicker.previousValue) {
      this.dateField.nativeElement.focus();
    }
    if ('newSelectedAccount' in c && c.newSelectedAccount.currentValue !== c.newSelectedAccount.previousValue) {
      this.setAccount(c.newSelectedAccount.currentValue);
    }
    if ('openCreateAccountPopup' in c && c.openCreateAccountPopup.currentValue !== c.openCreateAccountPopup.previousValue) {
      if (c.openCreateAccountPopup.currentValue) {
        this.showQuickAccountModal();
      } else {
        this.hideQuickAccountModal();
      }
    }
  }

  /**
   * addNewRow() to push new object
   */
  public addNewRow(type) {
    let entryObj = {
      amount: null,
      particular: '',
      applyApplicableTaxes: false,
      isInclusiveTax: false,
      type: 'by',
      taxes: [],
      total: null,
      discounts: [],
      inventory: {},
      selectedAccount: {
        name: '',
        uniqueName: ''
      }
    };

    if (type === 'stock') {
      let stockEntry = entryObj;
      stockEntry.inventory = this.initInventory();
      this.stocksTransaction.push(stockEntry);
    } else if (type === 'account') {
      this.accountsTransaction.push(entryObj);
    }
  }

  /**
   * initInventory
   */
  public initInventory() {
    return {
      unit: {
        stockUnitCode: '',
        code: '',
        rate: null,
      },
      quantity: null,
      stock: {
        uniqueName: '',
        name: '',
      },
      amount: null
    };
  }

  /**
   * selectRow() on entryObj focus/blur
   */
  public selectRow(type: boolean, stkIdx) {
    this.isSelectedRow = type;
    this.selectedRowIdx = stkIdx;
    // this.selectedAccIdx = accIdx;
  }

  /**
   * selectAccountRow() on entryObj focus/blur
   */
  public selectAccountRow(type: boolean, idx) {
    // this.isSelectedRow = type;
    // this.selectedAccIdx = idx;
    // this.selectedRowIdx = null;
  }

  /**
   * getFlattenGrpAccounts
   */
  public getFlattenGrpAccounts(groupUniqueName, filter) {
    // this.showAccountList.emit(true);
    this.groupUniqueName = groupUniqueName ? groupUniqueName : this.groupUniqueName;
    this.filterByGrp = filter;
    this.showStockList.emit(false);
  }

  /**
   * selectEntryType() to validate Type i.e BY/TO
   */
  public selectEntryType(transactionObj, val, idx) {
    if (val.length === 2 && (val.toLowerCase() !== 'to' && val.toLowerCase() !== 'by')) {
      this._toaster.errorToast("Spell error, you can only use 'To/By'");
      transactionObj.type = 'DEBIT';
    } else {
      transactionObj.type = val;
    }
  }

  public onStockItemBlur(ev, elem) {
    this.selectedInput = elem;
    this.showLedgerAccountList = false;
    // if (!this.stockSearch) {
    //   this.searchStock('');
    //   this.stockSearch = '';
    // }
  }

  public onAccountFocus(indx: number) {
    this.showConfirmationBox = false;
    // this.selectedField = 'account';
    this.selectedAccIdx = indx;
    // this.showLedgerAccountList = true;

    this.inputForList = _.cloneDeep(this.flattenAccounts);
    this.selectedField = 'account';
    // this.selectedParticular = elem;
    // this.selectRow(true, indx);
    // this.filterAccount(trxnType);
    setTimeout(() => {
      this.showLedgerAccountList = true;
    }, 200);
  }

  public onAccountBlur(ele) {
    this.selectedInput = ele;
    this.showLedgerAccountList = false;
    // if (ev.target.value === 0) {
    //   ev.target.focus();
    //   ev.preventDefault();
    // }
  }

  /**
   * setAccount` in particular, on accountList click
   */
  public setAccount(acc) {
    let idx = this.selectedAccIdx;
    if (acc) {
      if (this.accountType === 'creditor') {
        setTimeout(() => {
          this.creditorAcc = acc;
        }, 200);
        return this.accountType = null;
      } else if (this.accountType === 'debitor') {
        this.debtorAcc = acc;
      }

      if (this.selectedAccIdx > -1) {
        let accModel = {
          name: acc.name,
          UniqueName: acc.uniqueName,
          groupUniqueName: acc.parentGroups[acc.parentGroups.length - 1],
          account: acc.name
        };
        this.accountsTransaction[idx].particular = accModel.UniqueName;
        this.accountsTransaction[idx].selectedAccount = accModel;
        this.accountsTransaction[idx].stocks = acc.stocks;
      }

      setTimeout(() => {
        // this.selectedInput.focus();
        this.showAccountList.emit(false);
      }, 50);
    } else {
      this.accountsTransaction.splice(idx, 1);
      if (!idx) {
        this.addNewRow('account');
      }
    }
  }

  /**
   * searchAccount in accountList
   */
  public searchAccount(str) {
    this.filterByText = str;
    // this.accountSearch = str;
  }

  /**
   * searchStock
   */
  public searchStock(str) {
    // this.stockSearch = str;
    this.filterByText = str;
  }

  /**
   * addNewStock
   */
  public addNewStock(amount, transactionObj, idx) {
    let lastIdx = this.stocksTransaction.length - 1;
    if (amount) {
      transactionObj.amount = Number(amount);
    }
    if (amount && !transactionObj.inventory.stock && !transactionObj.inventory.stock.name) {
      this._toaster.errorToast("Stock can't be blank");
      return;
    }
    if (idx === lastIdx) {
      this.addNewRow('stock');
    }
    //
  }

  /**
   * openConfirmBox() to save entry
   */
  public openConfirmBox(submitBtnEle: HTMLButtonElement) {
    this.showConfirmationBox = true;
    if (this.data.description) {
      this.data.description = this.data.description.replace(/(?:\r\n|\r|\n)/g, '');
    }
    setTimeout(() => {
      submitBtnEle.focus();
    }, 100);
  }

  /**
   * refreshEntry
   */
  public refreshEntry() {
    this.stocksTransaction = [];
    this.accountsTransaction = [];
    this.showConfirmationBox = false;
    this.showAccountList.emit(false);
    this.totalCreditAmount = 0;
    this.totalDebitAmount = 0;
    this.addNewRow('stock');
    this.addNewRow('account');
    this.data.entryDate = moment().format(GIDDH_DATE_FORMAT);
    this.entryDate = moment().format(GIDDH_DATE_FORMAT);
    this.creditorAcc = {};
    this.debtorAcc = {};
    this.stockTotal = null;
    this.accountsTotal = null;
    this.data.description = '';
  }

  /**
   * after init
   */
  public ngAfterViewInit() {
    //
  }

  /**
   * ngOnDestroy() on component destroy
   */
  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * setInvoiceDate
   */
  public setInvoiceDate(date) {
    this.showInvoiceDate = !this.showInvoiceDate;
  }

  /**
   * watchMenuEvent
   */
  public watchKeyboardEvent(event) {
    if (event) {
      let navigateTo = _.find(this.navigateURL, (o: any) => o.code === event.key);
      if (navigateTo) {
        this._router.navigate(['accounting', navigateTo.route]);
      }
    }
  }

  /**
   * removeBlankTransaction
   */
  public removeBlankTransaction(transactions) {
    _.forEach(transactions, function(obj: any, idx) {
        if (obj && !obj.particular) {
          transactions = _.without(transactions, obj);
        }
      });
    return transactions;
  }

  /**
   * validateTransaction
   */
  public validateTransaction(transactions) {
    let transactionArr = this.removeBlankTransaction(transactions);
    return transactionArr;
  }

  /**
   * onSelectStock
   */
  public onSelectStock(item) {
    if (item) {
      let idx = this.selectedRowIdx;
      let entryItem = _.cloneDeep(item);
      this.prepareEntry(entryItem, idx);
      setTimeout(() => {
        // this.selectedInput.focus();
        this.showStockList.emit(false);
      }, 50);
    } else {
      this.stocksTransaction.splice(this.selectedRowIdx);
      if (!this.selectedRowIdx) {
        this.addNewRow('stock');
      }
    }
  }

  /**
   * prepareEntry
   */
  public prepareEntry(item, stkIdx) {
    let defaultUnit = {
      stockUnitCode: item.stockUnit.name,
      code: item.stockUnit.code,
      rate: 0
    };
    if (item.accountStockDetails.unitRates.length) {
      this.stocksTransaction[stkIdx].inventory.unit = item.accountStockDetails.unitRates[0];
      this.stocksTransaction[stkIdx].inventory.unit.code = item.accountStockDetails.unitRates[0].stockUnitCode;
      this.stocksTransaction[stkIdx].inventory.unit.stockUnitCode = item.stockUnit.name;

    } else if (!item.accountStockDetails.unitRates.length) {
      this.stocksTransaction[stkIdx].inventory.unit = defaultUnit;
    }
    this.stocksTransaction[stkIdx].particular = item.accountStockDetails.accountUniqueName;
    this.stocksTransaction[stkIdx].inventory.stock = { name: item.name, uniqueName: item.uniqueName};
    this.stocksTransaction[stkIdx].selectedAccount.uniqueName = item.accountStockDetails.accountUniqueName;
    this.stocksTransaction[stkIdx].selectedAccount.name = item.accountStockDetails.name;
  }

  /**
   * calculateAmount
   */
  public changeQuantity(idx, val) {
    let i = this.selectedRowIdx;
    this.stocksTransaction[i].inventory.quantity = Number(val);
    this.stocksTransaction[i].inventory.amount = Number((this.stocksTransaction[i].inventory.unit.rate * this.stocksTransaction[i].inventory.quantity).toFixed(2));
    this.stocksTransaction[i].amount = this.stocksTransaction[i].inventory.amount;
    this.amountChanged(idx);
  }

  /**
   * changePrice
   */
  public changePrice(idx, val) {
    let i = this.selectedRowIdx;
    this.stocksTransaction[i].inventory.unit.rate = Number(_.cloneDeep(val));
    this.stocksTransaction[i].inventory.amount = Number((this.stocksTransaction[i].inventory.unit.rate * this.stocksTransaction[i].inventory.quantity).toFixed(2));
    this.stocksTransaction[i].amount = this.stocksTransaction[i].inventory.amount;
    this.amountChanged(idx);
  }

  /**
   * amountChanged
   */
  public amountChanged(idx) {
    let i = this.selectedRowIdx;
    if (this.stocksTransaction[i] && this.stocksTransaction[idx].inventory.stock && this.stocksTransaction[i].inventory.quantity) {
      if (this.stocksTransaction[i].inventory.quantity) {
        this.stocksTransaction[i].inventory.unit.rate = Number((this.stocksTransaction[i].inventory.amount / this.stocksTransaction[i].inventory.quantity).toFixed(2));
      }
    }
    this.stocksTransaction[i].amount = this.stocksTransaction[i].inventory.amount;
    let stockTotal = _.sumBy(this.stocksTransaction, (o: any) => Number(o.inventory.amount));
    this.stockTotal = stockTotal;
  }

  public calculateRate(idx, val) {
    if (val) {
      this.accountsTransaction[idx].amount = Number( this.stockTotal * val / 100);
    }
    this.calculateAmount();
  }

  public changeTotal(idx, val) {
    if (val) {
      this.accountsTransaction[idx].rate =  null;
    }
    this.calculateAmount();
  }

  /**
   * calculateAmount
   */
  public calculateAmount() {
    let Total = _.sumBy(this.accountsTransaction,  (o) => Number(o.amount));
    this.accountsTotal = Total;
  }

  /**
   * changeStock
   */
  public changeStock(idx, val) {
    let i = this.selectedRowIdx;
    if (!val) {
      if (this.stocksTransaction[i].inventory && this.stocksTransaction[i].inventory.length) {
        this.stocksTransaction[i].inventory.splice(idx, 1);
      }
      // this.showStockList.emit(false);
      // if (!this.data.transactions.length) {
      //   this.addNewRow('stock');
      // }
      this.amountChanged(idx);
    }
  }

  /**
   * saveEntry
   */
  public saveEntry() {
    if (!this.creditorAcc.uniqueName) {
      return this._toaster.errorToast("Party A/c Name can't be blank.");
    }
    let data = _.cloneDeep(this.data);

    // let idx = 0;
    data.transactions = this.prepareDataForVoucher();
    data = this._tallyModuleService.prepareRequestForAPI(data);
    data.transactions = this.validateTransaction(data.transactions);

    let accUniqueName: string = this.creditorAcc.uniqueName;

    _.forEach(data.transactions, (element: any)  => {
        element.type = (element.type === 'by') ? 'debit' : 'credit';
      });
    this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
    // data.transactions = this.validateTransaction(data.transactions, 'stock');
    // let accountsTransaction = this.validateTransaction(this.accountsTransaction, 'account');

    // if (!data.transactions.length) {
    //   return this._toaster.errorToast('Atleast 1 stock entry required.');
    // }

    // let transactions = _.concat(data.transactions, accountsTransaction);
    // console.log(transactions);

    // if (this.totalCreditAmount === this.totalDebitAmount) {
    //   let accUniqueName: string = this.creditorAcc.uniqueName;
    //   this.store.dispatch(this._ledgerActions.CreateBlankLedger(data, accUniqueName));
    //   this.showStockList.next(false);
    // } else {
    //   this._toaster.errorToast('Total credit amount and Total debit amount should be equal.', 'Error');
    // }
  }

  public prepareDataForInvoice(data) {
    let stocksTransaction = [];
    let accountsTransaction = [];
    let filterData = this._tallyModuleService.prepareRequestForAPI(data);

    if (filterData.transactions.length) {
      _.forEach(filterData.transactions, function(o, i) {
        if (o.inventory && o.inventory.amount) {
             stocksTransaction.push(o);
        } else {
          o.inventory = {};
          accountsTransaction.push(o);
        }
      });
      this.accountsTransaction = accountsTransaction;
      this.stocksTransaction = stocksTransaction;

      if (!stocksTransaction.length) {
        this.addNewRow('stock');
      }
      if (!accountsTransaction.length) {
        this.addNewRow('account');
      }
    }
  }

  public prepareDataForVoucher() {
   let transactions = _.concat(_.cloneDeep(this.accountsTransaction), _.cloneDeep(this.stocksTransaction));
  //  let result = _.chain(transactions).groupBy('particular').value();
   transactions = _.orderBy(transactions, 'type');
   _.forEach(transactions, function(obj, idx) {
     let inventoryArr = [];
     if (obj.inventory && obj.inventory.amount) {
        inventoryArr.push(obj.inventory);
        obj.inventory = inventoryArr;
      } else {
        obj.inventory = inventoryArr;
      }
    });
  //  console.log(transactions);
   return transactions;
  }

  // public detectKey(ev) {
  //   if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13) {
  //    this.arrowInput = { key: ev.keyCode };
  //   }
  // }

  public detectKey(ev) {
    this.keyUpDownEvent = ev;
    // if (ev.keyCode === 27) {
    //  this.deleteRow(this.selectedRowIdx);
    // }
    // if (ev.keyCode === 40 || ev.keyCode === 38 || ev.keyCode === 13) {
    //  this.arrowInput = { key: ev.keyCode };
    // }
  }

   /**
  * hideListItems
  */
 public hideListItems() {
   if (!this.isPartyACFocused) {
    this.showStockList.emit(false);
    this.showAccountList.emit(false);
   }
 }

  public dateEntered() {
    const date = moment(this.entryDate, 'DD-MM-YYYY');
    if (moment(date).format('dddd') !== 'Invalid date') {
      this.displayDay =  moment(date).format('dddd');
    } else {
      this.displayDay = '';
    }
  }

  public onStockFocus(indx: number) {
    this.showConfirmationBox = false;
    this.selectRow(true, indx);
    this.selectedField = 'stock';
    this.getFlattenGrpofAccounts(this.groupUniqueName);
  }

  /**
   * getFlattenGrpofAccounts
   */
  public getFlattenGrpofAccounts(parentGrpUnqName, q?: string) {
    const reqArray = parentGrpUnqName ? [parentGrpUnqName] : [];
    this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: reqArray }, '', q).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        this.sortStockItems(data.body.results);
      } else {
        // this.noResult = true;
      }
    });
  }

  /**
   * sortStockItems
   */
  public sortStockItems(ItemArr) {
    let stockAccountArr: IOption[] = [];
    _.forEach(ItemArr, (obj: any) => {
      if (obj.stocks) {
        _.forEach(obj.stocks, (stock: any) => {
          stock.accountStockDetails.name = obj.name;
          stockAccountArr.push({
            label: `${stock.name} (${stock.uniqueName})`,
            value: stock.uniqueName,
            additional: stock
          });
        });
      }
    });
    // console.log(stockAccountArr, 'stocks');
    this.stockList = stockAccountArr;
    this.inputForList = _.cloneDeep(this.stockList);
    setTimeout(() => {
      this.showLedgerAccountList = true;
    }, 200);
  }

  public onItemSelected(ev: IOption) {
    if (this.selectedField === 'account') {
      this.setAccount(ev.additional);
    } else if (this.selectedField === 'stock') {
      this.onSelectStock(ev.additional);
    } else if (this.selectedField === 'partyAcc') {
      this.setAccount(ev.additional);
    }
    setTimeout(() => {
      this.currentSelectedValue = '';
      this.showLedgerAccountList = false;
    }, 200);
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
    componentInstance.isQuickAccountCreatedSuccessfully$.subscribe((status: boolean) => {
      if (status) {
        this.refreshAccountListData();
      }
    });
  }

  public showQuickAccountModal() {
    this.loadQuickAccountComponent();
    this.quickAccountModal.show();
  }

  public hideQuickAccountModal() {
    this.quickAccountModal.hide();
  }

  public onPartyAccFocus() {
    this.showConfirmationBox = false;
    this.getFlattenGrpAccounts(null, false);
    this.accountType = 'creditor';
    this.isPartyACFocused = true;
    this.selectedField = 'partyAcc';
    setTimeout(() => {
      this.currentSelectedValue = '';
      this.showLedgerAccountList = true;
    }, 200);
  }

  public onPartyAccBlur() {
    // this.showAccountList.emit(false);
    // selectedInput=creditor;
    // isPartyACFocused = false;
    setTimeout(() => {
      this.currentSelectedValue = '';
      this.showLedgerAccountList = false;
    }, 200);
  }

  private deleteRow(idx: number) {
    this.stocksTransaction.splice(idx, 1);
    if (!idx) {
      this.addNewRow('stock');
    }
  }

  private addNewAccount(val, lastIdx) {
    if (val && lastIdx) {
      this.addNewRow('account');
    }
  }

  private refreshAccountListData() {
    this.store.select(p => p.session.companyUniqueName).subscribe(a => {
      if (a && a !== '') {
        this._accountService.GetFlattenAccounts('', '', '').takeUntil(this.destroyed$).subscribe(data => {
        if (data.status === 'success') {
          this._tallyModuleService.setFlattenAccounts(data.body.results);
        }
      });
      }
    });
  }
}
