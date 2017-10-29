import { animate, Component, OnInit, state, style, transition, trigger, ViewChild } from '@angular/core';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FakeDiscountItem, GenerateSalesRequest, InvoiceFormClass, IStockUnit, SalesEntryClass, SalesTransactionItemClass } from '../../models/api-models/Sales';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AccountService } from '../../services/account.service';
import { INameUniqueName } from '../../models/interfaces/nameUniqueName.interface';
import { ElementViewContainerRef } from '../../shared/helpers/directives/element.viewchild.directive';
import { SalesActions } from '../../services/actions/sales/sales.action';
import { AccountResponseV2 } from '../../models/api-models/Account';
import { CompanyActions } from '../../services/actions/company.actions';
import { CompanyResponse, TaxResponse } from '../../models/api-models/Company';
import { LedgerActions } from '../../services/actions/ledger/ledger.actions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ICommonItemOfTransaction, IContentCommon, IInvoiceTax } from '../../models/api-models/Invoice';
import { SalesService } from '../../services/sales.service';
import { ToasterService } from '../../services/toaster.service';
import { ModalDirective } from 'ngx-bootstrap';
import { contriesWithCodes } from '../../shared/helpers/countryWithCodes';
import { CompanyService } from '../../services/companyService.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { SelectComponent } from '../../theme/ng-select/select.component';

const STOCK_OPT_FIELDS = ['Qty.', 'Unit', 'Rate'];

const THEAD_ARR_1 = [
  {
    display: true,
    label: 'Sno'
  },
  {
    display: true,
    label: 'Date'
  },
  {
    display: true,
    label: 'Product/Service'
  },
  {
    display: true,
    label: 'HSN/SAC'
  }
];
const THEAD_ARR_OPTIONAL = [
  {
    display: false,
    label: 'Qty.'
  },
  {
    display: false,
    label: 'Unit'
  },
  {
    display: false,
    label: 'Rate'
  },
  {
    display: true,
    label: 'Amount'
  }
];
const THEAD_ARR_READONLY = [
  {
    display: true,
    label: 'Discount'
  },
  {
    display: true,
    label: 'Taxable.'
  },
  {
    display: false,
    label: 'Tax'
  },
  {
    display: true,
    label: 'Total'
  },
  {
    display: true,
    label: 'Action'
  }
];

@Component({
  styleUrls: ['./sales.invoice.component.scss'],
  templateUrl: './sales.invoice.component.html',
  selector: 'sales-invoice',
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

export class SalesInvoiceComponent implements OnInit {

  @ViewChild(ElementViewContainerRef) public elementViewContainerRef: ElementViewContainerRef;
  @ViewChild('createGroupModal') public createGroupModal: ModalDirective;
  @ViewChild('createAcModal') public createAcModal: ModalDirective;

  public isGenDtlCollapsed: boolean = true;
  public isMlngAddrCollapsed: boolean = true;
  public isOthrDtlCollapsed: boolean = true;
  public typeaheadNoResultsOfCustomer: boolean = false;
  public typeaheadNoResultsOfSalesAccount: boolean = false;
  public invFormData: InvoiceFormClass;
  public accounts$: Observable<INameUniqueName[]>;
  public bankAccounts$: Observable<INameUniqueName[]>;
  public salesAccounts$: Observable<IOption[]>;
  public accountAsideMenuState: string = 'out';
  public asideMenuStateForProductService: string = 'out';
  public theadArr: IContentCommon[] = THEAD_ARR_1;
  public theadArrOpt: IContentCommon[] = THEAD_ARR_OPTIONAL;
  public theadArrReadOnly: IContentCommon[] = THEAD_ARR_READONLY;
  public activeGroupUniqueName$: Observable<string>;
  public companyTaxesList$: Observable<TaxResponse[]>;
  public selectedTaxes: string[] = [];
  public showTaxBox: boolean = false;
  public stockList: IStockUnit[] = [];
  public allKindOfTxns: boolean = false;
  public showCreateAcModal: boolean = false;
  public showCreateGroupModal: boolean = false;
  public createAcCategory: string = null;
  public newlyCreatedAc$: Observable<INameUniqueName>;
  public newlyCreatedStockAc$: Observable<INameUniqueName>;
  public countrySource: IOption[] = [];
  public statesSource$: Observable<IOption[]> = Observable.of([]);
  public activeAccount$: Observable<AccountResponseV2>;
  public autoFillShipping: boolean = true;
  public dueAmount: number;

  // modals related
  public modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: 'static',
    ignoreBackdropClick: true
  };

  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private selectedAccountDetails$: Observable<AccountResponseV2>;
  private entryIdx: number;
  private updateAccount: boolean = false;
  private companyUniqueName$: Observable<string>;
  private activeCompany: CompanyResponse;

  constructor(
    private store: Store<AppState>,
    private accountService: AccountService,
    private salesAction: SalesActions,
    private companyActions: CompanyActions,
    private ledgerActions: LedgerActions,
    private salesService: SalesService,
    private _toasty: ToasterService,
    private _companyService: CompanyService
  ) {

    this.companyUniqueName$ = this.store.select(s => s.session.companyUniqueName).takeUntil(this.destroyed$);
    this.activeAccount$ = this.store.select(p => p.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.invFormData = new InvoiceFormClass();
    this.store.dispatch(this.companyActions.getTax());
    this.store.dispatch(this.ledgerActions.GetDiscountAccounts());
    this.newlyCreatedAc$ = this.store.select(p => p.groupwithaccounts.newlyCreatedAccount).takeUntil(this.destroyed$);
    this.newlyCreatedStockAc$ = this.store.select(p => p.sales.newlyCreatedStockAc).takeUntil(this.destroyed$);
    this.salesAccounts$ = this.store.select(p => p.sales.flattenSalesAc).takeUntil(this.destroyed$);
    // get all flatten accounts
    this.getAllFlattenAc();

    // bind countries
    contriesWithCodes.map(c => {
      this.countrySource.push({ value: c.countryName, label: `${c.countryflag} - ${c.countryName}` });
    });

    // bind state sources
    this._companyService.getAllStates().subscribe((data) => {
      let arr: IOption[] = [];
      if (data) {
        data.body.map(d => {
          arr.push({ label: `${d.code} - ${d.name}`, value: d.code });
        });
      }
      this.statesSource$ = Observable.of(arr);
    });
  }

  public ngOnInit() {
    // get selected company for autofill country
    this.companyUniqueName$.takeUntil(this.destroyed$).distinctUntilChanged().subscribe((company) => {
      this.store.select(p => p.session.companies).takeUntil(this.destroyed$).subscribe((companies: CompanyResponse[]) => {
        this.activeCompany = _.find(companies, (c: CompanyResponse) => c.uniqueName === company);
        if (this.activeCompany) {
          this.invFormData.country.countryName = this.activeCompany.country;
        }
      });
    });

    // get account details and set it to local var
    this.selectedAccountDetails$ = this.store.select(p => p.sales.acDtl).takeUntil(this.destroyed$);
    this.selectedAccountDetails$.subscribe(o => {
      if (o) {
        this.assignValuesInForm(o);
      }
    });

    // get tax list and assign values to local vars
    this.store.select(p => p.company.taxes).takeUntil(this.destroyed$).subscribe((o: TaxResponse[]) => {
      if (o) {
        this.companyTaxesList$ = Observable.of(o);
        _.map(this.theadArrReadOnly, (item: IContentCommon) => {
          // show tax label
          if (item.label === 'Tax') {
            item.display = true;
          }
          return item;
        });
        this.showTaxBox = true;
      }
    });

    // listen for new add account utils
    this.newlyCreatedAc$.takeUntil(this.destroyed$).subscribe((o: INameUniqueName) => {
      if (o) {
        this.invFormData.customerName = o.name;
        this.getAccountDetails(o.uniqueName);
      }
    });

    // logic to autoComplete
    this.salesAccounts$.takeUntil(this.destroyed$).distinctUntilChanged((p, n) => {
      if (p && n && p.length < n.length) {
        return false;
      }
      return true;
    }).subscribe((arr: IOption[]) => {
      if (arr && arr.length) {
        // listen for newly added stock
        this.newlyCreatedStockAc$.takeUntil(this.destroyed$).subscribe((o: any) => {
          if (o) {
            let result: IOption = _.find(arr, (item: IOption) => item.value === o.linkedAc && item.additional && item.additional.stock && item.additional.stock.uniqueName === o.uniqueName );
            if (result && !_.isUndefined(this.entryIdx)) {
              this.invFormData.entries[this.entryIdx].transactions[0].fakeAccForSelect2 = o.linkedAc;
              this.onSelectSalesAccount(result, this.invFormData.entries[this.entryIdx].transactions[0]);
            }
          }
        });
      }
    });
  }

  public getAllFlattenAc() {
    this.accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: INameUniqueName[] = [];
        let bankaccounts: INameUniqueName[] = [];
        let accountsArray: IOption[] = [];
        _.forEach(data.body.results, (item) => {
          // creating account list only of sundrydebtors category
          if (_.find(item.parentGroups, (o) => o.uniqueName === 'sundrydebtors')) {
            accounts.push({ name: item.name, uniqueName: item.uniqueName });
          }
          // creating bank account list
          if (_.find(item.parentGroups, (o) => o.uniqueName === 'bankaccounts' || o.uniqueName === 'cash' )) {
            bankaccounts.push({ name: item.name, uniqueName: item.uniqueName });
          }
          // revenuefromoperations, otherincome
          // creating account list only from revenue and income category
          if (_.find(item.parentGroups, (o) => o.uniqueName === 'otherincome' || o.uniqueName === 'revenuefromoperations')) {
            if (item.stocks) {
              item.stocks.map(as => {
                accountsArray.push({
                  value: item.uniqueName,
                  label: item.name,
                  additional: Object.assign({}, item, { stock: as })
                });
              });
              accountsArray.push({ value: item.uniqueName, label: item.name});
            } else {
              accountsArray.push({ value: item.uniqueName, label: item.name});
            }
          }
        });
        this.accounts$ = Observable.of(accounts);
        this.bankAccounts$ = Observable.of(bankaccounts);
        this.store.dispatch(this.salesAction.storeSalesFlattenAc(_.orderBy(accountsArray, 'text')));
      }
    });
  }

  public assignValuesInForm(data: AccountResponseV2) {
    // toggle all collapse
    this.isGenDtlCollapsed = false;
    this.isMlngAddrCollapsed = false;
    this.isOthrDtlCollapsed = false;

    // auto fill all the details
    this.invFormData.account.name = data.name;
    this.invFormData.account.uniqueName = data.uniqueName;
    this.invFormData.account.attentionTo = data.attentionTo;
    this.invFormData.country.countryName = data.country.countryName;
    this.invFormData.invoiceDetails.invoiceDate = moment().format('DD-MM-YYYY');
    // fill address conditionally
    if (data.addresses.length > 0) {
      // set billing
      this.invFormData.account.billingDetails.address = [];
      this.invFormData.account.billingDetails.address.push(data.addresses[0].address);
      this.invFormData.account.billingDetails.stateCode = data.addresses[0].stateCode;
      this.invFormData.account.billingDetails.gstNumber = data.addresses[0].gstNumber;
      // set shipping
      this.invFormData.account.shippingDetails.address = [];
      this.invFormData.account.shippingDetails.address.push(data.addresses[0].address);
      this.invFormData.account.shippingDetails.stateCode = data.addresses[0].stateCode;
      this.invFormData.account.shippingDetails.gstNumber = data.addresses[0].gstNumber;
    }
  }

  public getStateCode(type: string, statesEle: SelectComponent) {
    let gstVal = _.cloneDeep(this.invFormData.account[type].gstNumber);
    if (gstVal.length >= 2) {
      this.statesSource$.take(1).subscribe(st => {
        let s = st.find(item => item.value === gstVal.substr(0, 2));
        if (s) {
          this.invFormData.account[type].stateCode = s.value;
        } else {
          this.invFormData.account[type].stateCode = null;
          this._toasty.clearAllToaster();
          this._toasty.warningToast('Invalid GSTIN.');
        }
        statesEle.disabled = true;
      });
    } else {
      statesEle.disabled = false;
      this.invFormData.account[type].stateCode = null;
    }
  }

  public resetInvoiceForm(f: NgForm) {
    f.form.reset();
  }

  public triggerSubmitInvoiceForm(f: NgForm) {
    this.updateAccount = true;
    this.onSubmitInvoiceForm(f);
  }

  public autoFillShippingDetails() {
    // auto fill shipping address
    if (this.autoFillShipping) {
      this.invFormData.account.shippingDetails = _.cloneDeep(this.invFormData.account.billingDetails);
    }
  }

  public onSubmitInvoiceForm(f?: NgForm) {

    let txnErr: boolean;
    // before submit request making some validation rules
    // check for account uniquename
    if (this.invFormData.account && !this.invFormData.account.uniqueName) {
      this._toasty.warningToast('Customer Name can\'t be empty');
      return;
    }

    // replace /n to br in case of message
    if (this.invFormData.other.message1.length > 0) {
      this.invFormData.other.message2 = this.invFormData.other.message1.replace(/\n/g, '<br />');
    }

    // check for valid entries and transactions
    if ( this.invFormData.entries) {
      _.forEach(this.invFormData.entries, (entry) => {
        _.forEach(entry.transactions, (txn) => {
          // will get errors of string and if not error then true boolean
          let txnResponse = txn.isValid();
          if (txnResponse !== true) {
            this._toasty.warningToast(txnResponse);
            txnErr = true;
            return false;
          }else {
            txnErr = false;
          }
        });
      });
    }else {
      this._toasty.warningToast('At least a single entry needed to generate sales-invoice');
      return;
    }

    // if txn has errors
    if (txnErr) {
      return false;
    }

    let obj: GenerateSalesRequest = {
      invoice : this.invFormData,
      updateAccountDetails: this.updateAccount,
      paymentAction: {
        action: 'paid',
        amount: this.dueAmount
      }
    };

    this.salesService.generateSales(obj).takeUntil(this.destroyed$).subscribe((response: BaseResponse<string, GenerateSalesRequest>) => {
      if (response.status === 'success') {
        f.form.reset();
        if (typeof response.body === 'string') {
          this._toasty.successToast(response.body);
        } else {
          this._toasty.successToast('Invoice Generated Successfully');
        }
      } else {
        this._toasty.errorToast(response.message, response.code);
      }
      this.updateAccount = false;
    });
  }

  public onNoResultsClicked(idx?: number) {
    if (_.isUndefined(idx)) {
      this.getAllFlattenAc();
    }else {
      this.entryIdx = idx;
    }
    this.asideMenuStateForProductService = this.asideMenuStateForProductService === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  public toggleBodyClass() {
    if (this.asideMenuStateForProductService === 'in' || this.accountAsideMenuState === 'in') {
      document.querySelector('body').classList.add('fixed');
    }else {
      document.querySelector('body').classList.remove('fixed');
    }
  }

  /**
   * checkForInfinity
   * @returns {number} always
   */
  public checkForInfinity(value): number {
    return (value === Infinity) ? 0 : value;
  }

  /**
   * generate total discount amount
   * @returns {number}
   */
  public generateTotalDiscount(list: ICommonItemOfTransaction[]) {
    return list.reduce((pv, cv) => {
      return cv.amount ? pv + cv.amount : pv;
    }, 0);
  }

  /**
   * generate total taxable value
   * @returns {number}
   */
  public generateTotalTaxableValue(txns: SalesTransactionItemClass[]) {
    let res: number = 0;
    _.forEach(txns, (txn: SalesTransactionItemClass) => {
      res += this.checkForInfinity(txn.taxableValue);
    });
    return res;
  }

  /**
   * generate total tax amount
   * @returns {number}
   */
  public generateTotalTaxAmount(txns: SalesTransactionItemClass[]) {
    let res: number = 0;
    _.forEach(txns, (txn: SalesTransactionItemClass) => {
      if (txn.total === 0) {
        res += 0;
      }else {
        res += this.checkForInfinity((txn.total - txn.taxableValue));
      }
    });
    return res;
  }

  /**
   * generate total amounts of entries
   * @returns {number}
   */
  public generateTotalAmount(txns: SalesTransactionItemClass[]) {
    let res: number = 0;
    _.forEach(txns, (txn: SalesTransactionItemClass) => {
      if (txn.quantity && txn.rate) {
        res += this.checkForInfinity(txn.rate) * this.checkForInfinity(txn.quantity);
      }else {
        res += Number(this.checkForInfinity(txn.amount));
      }
    });
    return res;
  }

  /**
   * generate grand total
   * @returns {number}
   */
  public generateGrandTotal(txns: SalesTransactionItemClass[]) {
    return txns.reduce((pv, cv) => {
      return cv.total ? pv + cv.total : pv;
    }, 0);
  }

  public txnChangeOccurred() {
    let DISCOUNT: number = 0;
    let TAX: number = 0;
    let AMOUNT: number = 0;
    let TAXABLE_VALUE: number = 0;
    let GRAND_TOTAL: number = 0;
    setTimeout(() => {
      _.forEach(this.invFormData.entries, (entry) => {
        // get discount
        DISCOUNT += this.generateTotalDiscount(entry.discounts);

        // get total amount of entries
        AMOUNT += this.generateTotalAmount(entry.transactions);

        // get taxable value
        TAXABLE_VALUE += this.generateTotalTaxableValue(entry.transactions);

        // generate total tax amount
        TAX += this.generateTotalTaxAmount(entry.transactions);

        // generate Grand Total
        GRAND_TOTAL += this.generateGrandTotal(entry.transactions);
      });

      this.invFormData.subTotal = AMOUNT;
      this.invFormData.totalDiscount = DISCOUNT;
      this.invFormData.totalTaxableValue = TAXABLE_VALUE;
      this.invFormData.totalTax = TAX;
      this.invFormData.grandTotal = GRAND_TOTAL;

      // due amount
      this.invFormData.balanceDue = GRAND_TOTAL;
      if (this.dueAmount) {
        this.invFormData.balanceDue = GRAND_TOTAL - this.dueAmount;
      }

    }, 700);
  }

  public onSelectSalesAccount(selectedAcc: any, txn: SalesTransactionItemClass): void {
    if (selectedAcc.value) {
      this.showTaxBox = false;
      txn.applicableTaxes = [];
      this.accountService.GetAccountDetailsV2(selectedAcc.value).takeUntil(this.destroyed$).subscribe((data: BaseResponse<AccountResponseV2, string>) => {
        if (data.status === 'success') {
          let o = _.cloneDeep(data.body);
          // assign taxes and create fluctuation
          _.forEach(o.applicableTaxes, (item) => {
            txn.applicableTaxes.push(item.uniqueName);
          });
          this.showTaxBox = true;
          txn.accountName = o.name;
          txn.accountUniqueName = o.uniqueName;
          if (o.hsnNumber) {
            txn.hsnNumber = o.hsnNumber;
            txn.hsnOrSac = 'hsn';
          }else {
            txn.hsnNumber = null;
          }
          if (o.sacNumber) {
            txn.sacNumber = o.sacNumber;
            txn.hsnOrSac = 'sac';
          }else {
            txn.sacNumber = null;
          }
          txn.description = 'Entry generated by sales module';
          if (o.stocks && selectedAcc.additional && selectedAcc.additional.stock) {
            txn.stockUnit = selectedAcc.additional.stock.stockUnit.code;
            // set rate auto
            txn.rate = 0;
            if (selectedAcc.additional.stock.accountStockDetails && selectedAcc.additional.stock.accountStockDetails.unitRates && selectedAcc.additional.stock.accountStockDetails.unitRates.length > 0 ) {
              txn.rate = selectedAcc.additional.stock.accountStockDetails.unitRates[0].rate;
            }
            let obj: IStockUnit = {
              id: selectedAcc.additional.stock.stockUnit.code,
              text: selectedAcc.additional.stock.stockUnit.name
            };
            txn.stockList = [];
            txn.stockList.push(obj);
            txn.stockDetails = _.omit(selectedAcc.additional.stock, ['accountStockDetails', 'stockUnit']);
            txn.isStockTxn = true;
          } else {
            txn.isStockTxn = false;
            txn.stockUnit = null;
            txn.stockDetails = null;
            txn.stockList = [];
          }
          // toggle stock related fields
          this.toggleStockFields(txn);
          return txn;
        }else {
          txn.isStockTxn = false;
          this.toggleStockFields(txn);
        }
      });
    }else {
      txn.isStockTxn = false;
      this.toggleStockFields(txn);
    }
  }

  public toggleStockFields(txn: SalesTransactionItemClass) {
    let breakFunc: boolean = false;
    // check if any transaction is stockTxn then return false
    if (this.invFormData.entries.length > 1) {
      _.forEach(this.invFormData.entries, (entry) => {
        let idx = _.findIndex(entry.transactions, { isStockTxn : true });
        if (idx !== -1) {
          this.allKindOfTxns = true;
          breakFunc = true;
          return false;
        }else {
          breakFunc = false;
          this.allKindOfTxns = false;
        }
      });
    }

    if (breakFunc) {
      // show all optional labels due to all kind of txn
      _.map(this.theadArrOpt, (item: IContentCommon) => {
        item.display = breakFunc;
      });
    }else {
      _.map(this.theadArrOpt, (item: IContentCommon) => {
        // show labels related to stock entry
        if (_.indexOf(STOCK_OPT_FIELDS, item.label) !== -1 ) {
          item.display = txn.isStockTxn;
        }
        // hide amount label
        if (item.label === 'Amount') {
          item.display = !txn.isStockTxn;
        }
        return item;
      });
    }
  }

  public noResultsForCustomer(e: boolean): void {
    this.typeaheadNoResultsOfCustomer = e;
  }

  public onSelectCustomer(e: TypeaheadMatch): void {
    this.getAccountDetails(e.item.uniqueName);
  }

  public getAccountDetails(accountUniqueName: string) {
    this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
  }

  public toggleAccountAsidePane(event?): void {
    if (event) {
      event.preventDefault();
    }
    this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
    this.toggleBodyClass();
  }

  public addBlankRow(txn: SalesTransactionItemClass) {
    // if transaction is valid then add new row else show toasty
    let txnResponse = txn.isValid();
    if (txnResponse !== true) {
      this._toasty.warningToast(txnResponse);
      return;
    }
    let entry: SalesEntryClass = new SalesEntryClass();
    this.invFormData.entries.push(entry);
  }

  public removeTransaction(entryIdx: number) {
    if (entryIdx > 0) {
      this.invFormData.entries.splice(entryIdx, 1);
    }else {
      this._toasty.warningToast('Unable to delete a single transaction');
    }
  }

  public taxAmountEvent(tax, txn: SalesTransactionItemClass, entry: SalesEntryClass) {
    setTimeout(() => {
      txn.total = Number(txn.getTransactionTotal(tax, entry));
      this.txnChangeOccurred();
    }, 1500);
  }

  public selectedTaxEvent(arr: string[], entry: SalesEntryClass) {
    this.selectedTaxes = arr;
    entry.taxList = arr;
    if (this.selectedTaxes.length > 0) {
      entry.taxes = [];
      this.companyTaxesList$.take(1).subscribe(data => {
        data.map(item => {
          if ( _.indexOf(arr, item.uniqueName) !== -1 ) {
            let o: IInvoiceTax = {
              accountName: item.accounts[0].name,
              accountUniqueName: item.accounts[0].uniqueName,
              rate: item.taxDetail[0].taxValue,
              amount: item.taxDetail[0].taxValue
            };
            entry.taxes.push(o);
          }
        });
      });
    }
  }

  public selectedDiscountEvent(arr: FakeDiscountItem[], txn: SalesTransactionItemClass, entry: SalesEntryClass) {
    entry.discounts = [];
    // modified values according to api model
    _.forEach(arr, (item: FakeDiscountItem) => {
      let o: ICommonItemOfTransaction = {
        amount: item.amount,
        accountName: item.name,
        accountUniqueName: item.particular
      };
      entry.discounts.push(o);
    });

    // call taxableValue method
    txn.setAmount(entry);
    this.txnChangeOccurred();
  }

  // get action type from aside window and open respective modal
  public getActionFromAside(e?: any) {
    if (e.type === 'groupModal') {
      this.showCreateGroupModal = true;
      // delay just for ng cause
      setTimeout(() => {
        this.createGroupModal.show();
      }, 1000);
    }else {
      this.showCreateAcModal = true;
      this.createAcCategory = e.type;
      // delay just for ng cause
      setTimeout(() => {
        this.createAcModal.show();
      }, 1000);
    }
  }

  public closeCreateGroupModal(e?: any) {
    this.createGroupModal.hide();
  }

  public closeCreateAcModal() {
    this.createAcModal.hide();
  }

}
