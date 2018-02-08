import { animate, Component, OnInit, state, style, transition, trigger, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {
  FakeDiscountItem, IStockUnit,
  SalesEntryClass, SalesTransactionItemClass,
  ITaxList,
  VoucherClass,
  GenericRequestForGenerateSCD,
  VOUCHER_TYPE_LIST,
  AccountDetailsClass,
  IForceClear
} from '../../models/api-models/Sales';
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
import * as uuid from 'uuid';
import { GeneralActions } from 'app/actions/general/general.actions';
import { setTimeout } from 'timers';
import { createSelector } from 'reselect';
import { forEach, map, cloneDeep } from '../../lodash-optimized';
import { EMAIL_REGEX_PATTERN } from 'app/shared/helpers/universalValidations';
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
  public invFormData: VoucherClass;
  public customerAcList$: Observable<IOption[]>;
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
  public toggleFieldForSales: boolean = true;
  public dueAmount: number;
  public giddhDateFormat: string = GIDDH_DATE_FORMAT;
  public giddhDateFormatUI: string = GIDDH_DATE_FORMAT_UI;
  public flattenAccountListStream$: Observable<IFlattenAccountsResultItem[]>;
  public createAccountIsSuccess$: Observable<boolean>;
  public forceClear$: Observable<IForceClear> = Observable.of({status: false});
  // modals related
  public modalConfig = {
    animated: true,
    keyboard: false,
    backdrop: 'static',
    ignoreBackdropClick: true
  };
  public pageList: IOption[] = VOUCHER_TYPE_LIST;
  public selectedPage: string = VOUCHER_TYPE_LIST[0].value;
  public toggleActionText: string = VOUCHER_TYPE_LIST[0].value;
  public universalDate: any;

  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private selectedAccountDetails$: Observable<AccountResponseV2>;
  private entryIdx: number;
  private updateAccount: boolean = false;
  private companyUniqueName$: Observable<string>;
  private activeCompany: CompanyResponse;
  private sundryDebtorsAcList: IOption[] = [];
  private sundryCreditorsAcList: IOption[] = [];
  private prdSerAcListForDeb: IOption[] = [];
  private prdSerAcListForCred: IOption[] = [];

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

    this.invFormData = new VoucherClass();
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
          this.invFormData.accountDetails.country.countryName = this.activeCompany.country;
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
    });

    // listen for new add account utils
    this.newlyCreatedAc$.takeUntil(this.destroyed$).subscribe((o: INameUniqueName) => {
      if (o && this.accountAsideMenuState === 'in') {
        let item: IOption = {
          label: o.name,
          value: o.uniqueName
        };
        this.invFormData.voucherDetails.customerName = item.label;
        this.onSelectCustomer(item);
      }
    });

    this.createAccountIsSuccess$.takeUntil(this.destroyed$).subscribe((o) => {
      if (o && this.accountAsideMenuState === 'in') {
        this.toggleAccountAsidePane();
      }
    });

    // all flatten A/c's
    this.flattenAccountListStream$.subscribe((data: IFlattenAccountsResultItem[]) => {

      let bankaccounts: IOption[] = [];
      this.sundryDebtorsAcList = [];
      this.sundryCreditorsAcList = [];
      this.prdSerAcListForDeb = [];
      this.prdSerAcListForCred = [];

      _.forEach(data, (item) => {

        if (_.find(item.parentGroups, (o) => o.uniqueName === 'sundrydebtors')) {
          this.sundryDebtorsAcList.push({ label: item.name, value: item.uniqueName });
        }
        if (_.find(item.parentGroups, (o) => o.uniqueName === 'sundrycreditors')) {
          this.sundryCreditorsAcList.push({ label: item.name, value: item.uniqueName });
        }
        // creating bank account list
        if (_.find(item.parentGroups, (o) => o.uniqueName === 'bankaccounts' || o.uniqueName === 'cash' )) {
          bankaccounts.push({ label: item.name, value: item.uniqueName });
        }

        if (_.find(item.parentGroups, (o) => o.uniqueName === 'otherincome' || o.uniqueName === 'revenuefromoperations')) {
          if (item.stocks) {
            // normal entry
            this.prdSerAcListForDeb.push({ value: uuid.v4(), label: item.name, additional: item });

            // stock entry
            item.stocks.map(as => {
              this.prdSerAcListForDeb.push({
                value: uuid.v4(),
                label: `${item.name} (${as.name})`,
                additional: Object.assign({}, item, { stock: as })
              });
            });
          } else {
            this.prdSerAcListForDeb.push({ value: uuid.v4(), label: item.name, additional: item });
          }
        }

        if (_.find(item.parentGroups, (o) => o.uniqueName === 'operatingcost' || o.uniqueName === 'indirectexpenses')) {
          if (item.stocks) {
            // normal entry
            this.prdSerAcListForCred.push({ value: uuid.v4(), label: item.name, additional: item });

            // stock entry
            item.stocks.map(as => {
              this.prdSerAcListForCred.push({
                value: uuid.v4(),
                label: `${item.name} (${as.name})`,
                additional: Object.assign({}, item, { stock: as })
              });
            });
          } else {
            this.prdSerAcListForCred.push({ value: uuid.v4(), label: item.name, additional: item });
          }
        }
      });
      this.makeCustomerList();
      this.bankAccounts$ = Observable.of(_.orderBy(bankaccounts, 'label'));

      // listen for newly added stock and assign value
      Observable.combineLatest(this.newlyCreatedStockAc$, this.salesAccounts$).subscribe((resp: any[]) => {
        let o = resp[0];
        let acData = resp[1];
        if (o && acData) {
          let result: IOption = _.find(acData, (item: IOption) => item.additional.uniqueName === o.linkedAc && item.additional && item.additional.stock && item.additional.stock.uniqueName === o.uniqueName);
          if (result && !_.isUndefined(this.entryIdx)) {
            this.invFormData.entries[this.entryIdx].transactions[0].fakeAccForSelect2 = result.value;
            this.onSelectSalesAccount(result, this.invFormData.entries[this.entryIdx].transactions[0]);
          }
        }
      });
    });

    // listen for universal date
    this.store.select(createSelector([(p: AppState) => p.session.applicationDate], (dateObj: Date[]) => {
      if (dateObj) {
        try {
          this.universalDate = moment(dateObj[1]).toDate();
          this.assignDates();
        } catch (e) {
          this.universalDate = new Date();
        }
      }
    })).subscribe();
  }

  public assignDates() {
    let o = cloneDeep(this.invFormData);
    let date = this.universalDate || new Date();
    o.voucherDetails.voucherDate = date;
    o.voucherDetails.dueDate = date;
    o.templateDetails.other.shippingDate = date;
    forEach(o.entries, (entry: SalesEntryClass) => {
      forEach(entry.transactions, (txn: SalesTransactionItemClass) => {
        txn.date = date;
      });
    });
    return Object.assign(this.invFormData, o);
  }

  public makeCustomerList() {
    // sales case || Credit Note
    if (this.selectedPage === VOUCHER_TYPE_LIST[0].value || this.selectedPage === VOUCHER_TYPE_LIST[1].value) {
      this.customerAcList$ = Observable.of(_.orderBy(this.sundryDebtorsAcList, 'label'));
      this.salesAccounts$ = Observable.of(_.orderBy(this.prdSerAcListForDeb, 'label'));
    }else if (this.selectedPage === VOUCHER_TYPE_LIST[2].value) {
      this.customerAcList$ = Observable.of(_.orderBy(this.sundryCreditorsAcList, 'label'));
      this.salesAccounts$ = Observable.of(_.orderBy(this.prdSerAcListForCred, 'label'));
    }
  }

  public pageChanged() {
    this.makeCustomerList();
    this.toggleFieldForSales = (this.selectedPage === VOUCHER_TYPE_LIST[2].value || this.selectedPage === VOUCHER_TYPE_LIST[1].value) ? false : true;
    this.toggleActionText = this.selectedPage;
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
    this.invFormData.accountDetails = new AccountDetailsClass(data);
  }

  public getStateCode(type: string, statesEle: SelectComponent) {
    let gstVal = _.cloneDeep(this.invFormData.accountDetails[type].gstNumber);
    if (gstVal.length >= 2) {
      this.statesSource$.take(1).subscribe(st => {
        let s = st.find(item => item.value === gstVal.substr(0, 2));
        if (s) {
          this.invFormData.accountDetails[type].stateCode = s.value;
        } else {
          this.invFormData.accountDetails[type].stateCode = null;
          this._toasty.clearAllToaster();
          this._toasty.warningToast('Invalid GSTIN.');
        }
        statesEle.disabled = true;
      });
    } else {
      statesEle.disabled = false;
      this.invFormData.accountDetails[type].stateCode = null;
    }
  }

  public resetInvoiceForm(f: NgForm) {
    f.form.reset();
    this.invFormData = new VoucherClass();
    this.typeaheadNoResultsOfCustomer = false;
    // toggle all collapse
    this.isGenDtlCollapsed = true;
    this.isMlngAddrCollapsed = true;
    this.isOthrDtlCollapsed = true;
    this.forceClear$ = Observable.of({status: true});
  }

  public triggerSubmitInvoiceForm(f: NgForm) {
    this.updateAccount = true;
    this.onSubmitInvoiceForm(f);
  }

  public autoFillShippingDetails() {
    // auto fill shipping address
    if (this.autoFillShipping) {
      this.invFormData.accountDetails.shippingDetails = _.cloneDeep(this.invFormData.accountDetails.billingDetails);
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
    let data: VoucherClass = _.cloneDeep(this.invFormData);
    let txnErr: boolean;
    // before submit request making some validation rules
    // check for account uniquename
    if (data.accountDetails) {
      if (!data.accountDetails.uniqueName) {
        if (this.typeaheadNoResultsOfCustomer) {
          this._toasty.warningToast('Need to select Bank/Cash A/c or Customer Name');
        }else {
          this._toasty.warningToast('Customer Name can\'t be empty');
        }
        return;
      }
      if (data.accountDetails.email) {
        if (!EMAIL_REGEX_PATTERN.test(data.accountDetails.email)) {
          this._toasty.warningToast('Invalid Email Address.');
          return;
        }
      }
    }

    // replace /n to br in case of message
    if (data.templateDetails.other.message2 && data.templateDetails.other.message2.length > 0) {
      data.templateDetails.other.message2 = data.templateDetails.other.message2.replace(/\n/g, '<br />');
    }

    // replace /n to br for (shipping and billing)
    if (data.accountDetails.shippingDetails.address && data.accountDetails.shippingDetails.address.length && data.accountDetails.shippingDetails.address[0].length > 0) {
      data.accountDetails.shippingDetails.address[0] = data.accountDetails.shippingDetails.address[0].replace(/\n/g, '<br />');
    }
    if (data.accountDetails.billingDetails.address && data.accountDetails.billingDetails.address.length && data.accountDetails.billingDetails.address[0].length > 0) {
      data.accountDetails.billingDetails.address[0] = data.accountDetails.billingDetails.address[0].replace(/\n/g, '<br />');
    }

    // convert date object
    data.voucherDetails.voucherDate = this.convertDateForAPI(data.voucherDetails.voucherDate);
    data.voucherDetails.dueDate = this.convertDateForAPI(data.voucherDetails.dueDate);
    data.templateDetails.other.shippingDate = this.convertDateForAPI(data.templateDetails.other.shippingDate);

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

    // set voucher type
    data.entries = data.entries.map((entry) => {
      entry.voucherType = this.pageList.find(p => p.value === this.selectedPage).label;
      return entry;
    });

    let obj: GenericRequestForGenerateSCD = {
      voucher : data,
      updateAccountDetails: this.updateAccount
    };

    if (this.dueAmount && this.dueAmount > 0) {
      obj.paymentAction = {
        action: 'paid',
        amount: this.dueAmount
      };
    }

    this.salesService.generateGenericItem(obj).takeUntil(this.destroyed$).subscribe((response: BaseResponse<any, GenericRequestForGenerateSCD>) => {
      if (response.status === 'success') {
        // reset form and other
        this.resetInvoiceForm(f);
        if (typeof response.body === 'string') {
          this._toasty.successToast(response.body);
        } else {
          try {
            this._toasty.successToast(`Entry created successfully with invoice number: ${response.body.voucherDetails.voucherNumber}`);
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

      this.invFormData.voucherDetails.subTotal = AMOUNT;
      this.invFormData.voucherDetails.totalDiscount = DISCOUNT;
      this.invFormData.voucherDetails.totalTaxableValue = TAXABLE_VALUE;
      this.invFormData.voucherDetails.gstTaxesTotal = TAX;
      this.invFormData.voucherDetails.grandTotal = GRAND_TOTAL;

      // due amount
      this.invFormData.voucherDetails.balanceDue = GRAND_TOTAL;
      if (this.dueAmount) {
        this.invFormData.voucherDetails.balanceDue = GRAND_TOTAL - this.dueAmount;
      }

    }, 700);
  }

  public onSelectSalesAccount(selectedAcc: any, txn: SalesTransactionItemClass, entryIdx?: number, entry?: any): void {
    if (selectedAcc.value && selectedAcc.additional.uniqueName) {
      this.salesAccounts$.take(1).subscribe(idata => {
        idata.map(fa => {
          if (fa.value === selectedAcc.value) {
            this.accountService.GetAccountDetailsV2(selectedAcc.additional.uniqueName).takeUntil(this.destroyed$).subscribe((data: BaseResponse<AccountResponseV2, string>) => {
              if (data.status === 'success') {
                let o = _.cloneDeep(data.body);
                txn.applicableTaxes = [];
                // assign taxes and create fluctuation
                _.forEach(o.applicableTaxes, (item) => {
                  txn.applicableTaxes.push(item.uniqueName);
                });
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
      txn.amount = null;
      txn.accountName = null;
      txn.accountUniqueName = null;
      txn.hsnOrSac = 'sac';
      txn.total = null;
      txn.sacNumber = null;
      txn.taxableValue = 0;
      txn.applicableTaxes = [];
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
      this.invFormData.voucherDetails.customerName = item.label;
      this.getAccountDetails(item.value);
    }
  }

  public onSelectBankCash(item: IOption) {
    if (item.value) {
      this.invFormData.accountDetails.name = item.label;
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
    // set default date
    forEach(this.invFormData.entries, (e) => {
      forEach(e.transactions, (t: SalesTransactionItemClass) => {
        t.date = this.universalDate || new Date();
      });
    });
  }

  public removeTransaction(entryIdx: number) {
    if (this.invFormData.entries.length > 1 ) {
      this.invFormData.entries = _.remove(this.invFormData.entries, (entry, index) => {
        return index !== entryIdx;
      });
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
    entry.taxes = [];
    if (this.selectedTaxes.length > 0) {
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
