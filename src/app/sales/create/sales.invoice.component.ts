import { animate, Component, OnInit, state, style, transition, trigger, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
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
import { ElementViewContainerRef } from '../../shared/helpers/directives/elementViewChild/element.viewchild.directive';
import { SalesActions } from '../../actions/sales/sales.action';
import { AccountResponseV2 } from '../../models/api-models/Account';
import { CompanyActions } from '../../actions/company.actions';
import { CompanyResponse, TaxResponse } from '../../models/api-models/Company';
import { LedgerActions } from '../../actions/ledger/ledger.actions';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { ICommonItemOfTransaction, IContentCommon, IInvoiceTax } from '../../models/api-models/Invoice';
import { SalesService } from '../../services/sales.service';
import { ToasterService } from '../../services/toaster.service';
import { ModalDirective } from 'ngx-bootstrap';
import { contriesWithCodes } from '../../shared/helpers/countryWithCodes';
import { CompanyService } from '../../services/companyService.service';
import { IOption } from '../../theme/ng-select/option.interface';
import { SelectComponent } from '../../theme/ng-select/select.component';
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { IFlattenAccountsResultItem } from 'app/models/interfaces/flattenAccountsResultItem.interface';
import { orderBy } from '../../lodash-optimized';
import * as uuid from 'uuid';
import { GeneralActions } from 'app/actions/general/general.actions';
const STOCK_OPT_FIELDS = ['Qty.', 'Unit', 'Rate'];

const THEAD_ARR_1 = [
  {
    display: true,
    label: 'S.No'
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
    label: 'Taxable'
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

export class SalesInvoiceComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild(ElementViewContainerRef) public elementViewContainerRef: ElementViewContainerRef;
  @ViewChild('createGroupModal') public createGroupModal: ModalDirective;
  @ViewChild('createAcModal') public createAcModal: ModalDirective;

  public isGenDtlCollapsed: boolean = true;
  public isMlngAddrCollapsed: boolean = true;
  public isOthrDtlCollapsed: boolean = true;
  public typeaheadNoResultsOfCustomer: boolean = false;
  public typeaheadNoResultsOfSalesAccount: boolean = false;
  public invFormData: InvoiceFormClass;
  public accounts$: Observable<IOption[]>;
  public bankAccounts$: Observable<IOption[]>;
  public salesAccounts$: Observable<IOption[]> = Observable.of(null);
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
  public giddhDateFormat: string = GIDDH_DATE_FORMAT;
  public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
  public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
  public createAccountIsSuccess$: Observable<boolean>;
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
    private _companyService: CompanyService,
    private _generalActions: GeneralActions
  ) {

    this.invFormData = new InvoiceFormClass();
    this.companyUniqueName$ = this.store.select(s => s.session.companyUniqueName).takeUntil(this.destroyed$);
    this.activeAccount$ = this.store.select(p => p.groupwithaccounts.activeAccount).takeUntil(this.destroyed$);
    this.store.dispatch(this.salesAction.resetAccountDetailsForSales());
    this.store.dispatch(this.companyActions.getTax());
    this.store.dispatch(this.ledgerActions.GetDiscountAccounts());
    this.newlyCreatedAc$ = this.store.select(p => p.groupwithaccounts.newlyCreatedAccount).takeUntil(this.destroyed$);
    this.newlyCreatedStockAc$ = this.store.select(p => p.sales.newlyCreatedStockAc).takeUntil(this.destroyed$);
    this.flattenAccountListStream$ = this.store.select(p => p.general.flattenAccounts).takeUntil(this.destroyed$);
    this.selectedAccountDetails$ = this.store.select(p => p.sales.acDtl).takeUntil(this.destroyed$);
    this.createAccountIsSuccess$ = this.store.select(p => p.groupwithaccounts.createAccountIsSuccess).takeUntil(this.destroyed$);
    // bind countries
    contriesWithCodes.map(c => {
      this.countrySource.push({ value: c.countryName, label: `${c.countryflag} - ${c.countryName}` });
    });

    // bind state sources
   this.store.select(p => p.general.states).takeUntil(this.destroyed$).subscribe((states) => {
      let arr: IOption[] = [];
        if (states) {
          states.map(d => {
            arr.push({ label: `${d.code} - ${d.name}`, value: d.code });
          });
        }
        this.statesSource$ = Observable.of(arr);
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public ngAfterViewInit() {
    //
  }

  public ngOnInit() {
    // get selected company for autofill country
    this.companyUniqueName$.takeUntil(this.destroyed$).distinctUntilChanged().subscribe((company) => {
      this.store.select(p => p.session.companies).takeUntil(this.destroyed$).subscribe((companies: CompanyResponse[]) => {
        this.activeCompany = _.find(companies, (c: CompanyResponse) => c.uniqueName === company);
        if (this.activeCompany && this.activeCompany.country) {
          this.invFormData.country.countryName = this.activeCompany.country;
        }
      });
    });

    // get account details and set it to local var
    this.selectedAccountDetails$.subscribe(o => {
      if (o) {
        this.assignValuesInForm(o);
      }
    });

    // get tax list and assign values to local vars
    this.store.select(p => p.company.taxes).takeUntil(this.destroyed$).subscribe((o: TaxResponse[]) => {
      if (o) {
        this.showTaxBox = false;
        this.companyTaxesList$ = Observable.of(o);
        _.map(this.theadArrReadOnly, (item: IContentCommon) => {
          // show tax label
          if (item.label === 'Tax') {
            item.display = true;
          }
          return item;
        });
      }else {
        this.companyTaxesList$ = Observable.of([]);
      }
      setTimeout(() => {
        this.showTaxBox = true;
      }, 500);
    });

    // listen for new add account utils
    this.newlyCreatedAc$.takeUntil(this.destroyed$).subscribe((o: INameUniqueName) => {
      if (o && this.accountAsideMenuState === 'in') {
        let item: IOption = {
          label: o.name,
          value: o.uniqueName
        };
        this.invFormData.customerName = item.label;
        this.onSelectCustomer(item);
      }
    });

    this.createAccountIsSuccess$.takeUntil(this.destroyed$).subscribe((o) => {
      if (o && this.accountAsideMenuState === 'in') {
        this.toggleAccountAsidePane();
      }
    });

    // all flatten accounts
    this.flattenAccountListStream$.subscribe((data: IFlattenAccountsResultItem[]) => {

      let accountsArray: IOption[] = [];
      let accounts: IOption[] = [];
      let bankaccounts: IOption[] = [];

      _.forEach(data, (item) => {
        if (_.find(item.parentGroups, (o) => o.uniqueName === 'sundrydebtors')) {
          accounts.push({ label: item.name, value: item.uniqueName });
        }
        // creating bank account list
        if (_.find(item.parentGroups, (o) => o.uniqueName === 'bankaccounts' || o.uniqueName === 'cash' )) {
          bankaccounts.push({ label: item.name, value: item.uniqueName });
        }

        if (_.find(item.parentGroups, (o) => o.uniqueName === 'otherincome' || o.uniqueName === 'revenuefromoperations')) {
          if (item.stocks) {
            // normal entry
            accountsArray.push({ value: uuid.v4(), label: item.name, additional: item });

            // stock entry
            item.stocks.map(as => {
              accountsArray.push({
                value: uuid.v4(),
                label: `${item.name} (${as.name})`,
                additional: Object.assign({}, item, { stock: as })
              });
            });
          } else {
            accountsArray.push({ value: uuid.v4(), label: item.name, additional: item });
          }
        }
      });
      this.salesAccounts$ = Observable.of(orderBy(accountsArray, 'label'));
      this.accounts$ = Observable.of(orderBy(accounts, 'label'));
      this.bankAccounts$ = Observable.of(orderBy(bankaccounts, 'label'));

      // listen for newly added stock and assign value
      this.newlyCreatedStockAc$.take(1).subscribe((o: any) => {
        if (o) {
          let result: IOption = _.find(accountsArray, (item: IOption) => item.additional.uniqueName === o.linkedAc && item.additional && item.additional.stock && item.additional.stock.uniqueName === o.uniqueName);
          if (result && !_.isUndefined(this.entryIdx)) {
            this.invFormData.entries[this.entryIdx].transactions[0].fakeAccForSelect2 = result.value;
            this.onSelectSalesAccount(result, this.invFormData.entries[this.entryIdx].transactions[0]);
          }
        }
      });

    });
  }

  public getAllFlattenAc() {
    // call to get flatten account from store
    this.store.dispatch(this._generalActions.getFlattenAccount());
    // this.store.dispatch(this.salesAction.storeSalesFlattenAc(_.orderBy(accountsArray, 'text')));
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

    // set dates
    // this.invFormData.invoiceDetails.invoiceDate = new Date();
    // this.invFormData.invoiceDetails.dueDate = new Date().setDate(new Date().getDate() + 10 );
    // fill address conditionally
    if (data.addresses.length > 0) {
      let str = _.isNull(data.addresses[0].address) ? '' : data.addresses[0].address;
      // set billing
      this.invFormData.account.billingDetails.address = [];
      this.invFormData.account.billingDetails.address.push(str);
      this.invFormData.account.billingDetails.stateCode = data.addresses[0].stateCode;
      this.invFormData.account.billingDetails.gstNumber = data.addresses[0].gstNumber;
      // set shipping
      this.invFormData.account.shippingDetails.address = [];
      this.invFormData.account.shippingDetails.address.push(str);
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
    this.invFormData = new InvoiceFormClass();
    this.typeaheadNoResultsOfCustomer = false;
    // toggle all collapse
    this.isGenDtlCollapsed = true;
    this.isMlngAddrCollapsed = true;
    this.isOthrDtlCollapsed = true;
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

  public convertDateForAPI(val: any): string {
    if (val) {
      try {
        return moment(val).format(GIDDH_DATE_FORMAT);
      } catch (error) {
        return '';
      }
    }else {
      return '';
    }
  }

  public onSubmitInvoiceForm(f?: NgForm) {
    let data: InvoiceFormClass = _.cloneDeep(this.invFormData);
    let txnErr: boolean;
    // before submit request making some validation rules
    // check for account uniquename
    if (data.account && !data.account.uniqueName) {
      if (this.typeaheadNoResultsOfCustomer) {
        this._toasty.warningToast('Need to select Bank/Cash A/c or Customer Name');
      }else {
        this._toasty.warningToast('Customer Name can\'t be empty');
      }
      return;
    }

    // replace /n to br in case of message
    if (data.other.message2 && data.other.message2.length > 0) {
      data.other.message2 = data.other.message2.replace(/\n/g, '<br />');
    }

    // replace /n to br for (shipping and billing)
    if (data.account.shippingDetails.address && data.account.shippingDetails.address.length && data.account.shippingDetails.address[0].length > 0) {
      data.account.shippingDetails.address[0] = data.account.shippingDetails.address[0].replace(/\n/g, '<br />');
    }
    if (data.account.billingDetails.address && data.account.billingDetails.address.length && data.account.billingDetails.address[0].length > 0) {
      data.account.billingDetails.address[0] = data.account.billingDetails.address[0].replace(/\n/g, '<br />');
    }

    // convert date object
    data.invoiceDetails.invoiceDate = this.convertDateForAPI(data.invoiceDetails.invoiceDate);
    data.invoiceDetails.dueDate = this.convertDateForAPI(data.invoiceDetails.dueDate);
    data.other.shippingDate = this.convertDateForAPI(data.other.shippingDate);

    // check for valid entries and transactions
    if ( data.entries) {
      _.forEach(data.entries, (entry) => {
        _.forEach(entry.transactions, (txn: SalesTransactionItemClass) => {
          // convert date object
          txn.date = this.convertDateForAPI(txn.date);
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
      invoice : data,
      updateAccountDetails: this.updateAccount
    };

    if (this.dueAmount && this.dueAmount > 0) {
      obj.paymentAction = {
        action: 'paid',
        amount: this.dueAmount
      };
    }

    this.salesService.generateSales(obj).takeUntil(this.destroyed$).subscribe((response: BaseResponse<InvoiceFormClass, GenerateSalesRequest>) => {
      if (response.status === 'success') {
        // reset form and other
        this.resetInvoiceForm(f);
        if (typeof response.body === 'string') {
          this._toasty.successToast(response.body);
        } else {
          try {
            this._toasty.successToast(`Ledger created successfully with uniquename: ${response.body.uniqueName}. Invoice generated successfully with invoice number: ${response.body.invoiceDetails.invoiceNumber}`);
          } catch (error) {
            this._toasty.successToast('Invoice Generated Successfully');
          }
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

  public onSelectSalesAccount(selectedAcc: any, txn: SalesTransactionItemClass, entryIdx?: number): void {
    if (selectedAcc.value && selectedAcc.additional.uniqueName) {
      this.salesAccounts$.take(1).subscribe(idata => {
        idata.map(fa => {
          if (fa.value === selectedAcc.value) {
            this.showTaxBox = false;
            txn.applicableTaxes = [];
            this.accountService.GetAccountDetailsV2(selectedAcc.additional.uniqueName).takeUntil(this.destroyed$).subscribe((data: BaseResponse<AccountResponseV2, string>) => {
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
                if (o.stocks && selectedAcc.additional && selectedAcc.additional.stock) {
                  txn.stockUnit = selectedAcc.additional.stock.stockUnit.code;
                  // set rate auto
                  txn.rate = null;
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
                  // reset fields
                  txn.rate = null;
                  txn.quantity = null;
                  txn.amount = null;
                  txn.taxableValue = null;
                }
                // toggle stock related fields
                this.toggleStockFields(txn);
                return txn;
              }else {
                txn.isStockTxn = false;
                this.toggleStockFields(txn);
              }
            });
          } else {
            txn.isStockTxn = false;
            this.toggleStockFields(txn);
          }
        });
      });
    }else {
      txn.isStockTxn = false;
      this.toggleStockFields(txn);
      // txn.amount = 0;
      // txn.accountName = null;
      // txn.accountUniqueName = null;
      // txn.hsnOrSac = 'sac';
      // txn.total = 0;
      // txn.sacNumber = null;
      // txn.taxableValue = 0;
      // txn.applicableTaxes = [];
      this.resetTxn(entryIdx);
    }
  }

  public resetTxn(entryIdx: number) {
    if (this.invFormData.entries.length > 0 ) {
      let invFormData = _.cloneDeep(this.invFormData);
      let entry: SalesEntryClass = new SalesEntryClass();
      invFormData.entries.splice(entryIdx, 1, entry);
      this.invFormData = invFormData;
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

  public onSelectCustomer(item: IOption): void {
    this.typeaheadNoResultsOfCustomer = false;
    if (item.value) {
      this.invFormData.customerName = item.label;
      this.getAccountDetails(item.value);
    }
  }

  public onSelectBankCash(item: IOption) {
    if (item.value) {
      this.invFormData.account.name = item.label;
      this.getAccountDetails(item.value);
    }
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
    if (this.invFormData.entries.length > 0 ) {
      // lodash remove method
      let invFormData = _.cloneDeep(this.invFormData);
      invFormData.entries.splice(entryIdx, 1);
      this.invFormData = invFormData;
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
        data.map((item: any) => {
          if ( _.indexOf(arr, item.uniqueName) !== -1 && item.accounts.length > 0 ) {
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
