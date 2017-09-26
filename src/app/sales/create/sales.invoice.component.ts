import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, trigger, state, style, transition, animate, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceFormClass, SalesEntryClass, SalesTransactionItemClass, IStockUnit, FakeDiscountItem } from '../../models/api-models/Sales';
import { InvoiceState } from '../../store/Invoice/invoice.reducer';
import { InvoiceService } from '../../services/invoice.service';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AccountService } from '../../services/account.service';
import { INameUniqueName } from '../../models/interfaces/nameUniqueName.interface';
import { ElementViewContainerRef } from '../../shared/helpers/directives/element.viewchild.directive';
import { SalesActions } from '../../services/actions/sales/sales.action';
import { AccountResponseV2 } from '../../models/api-models/Account';
import { CompanyActions } from '../../services/actions/company.actions';
import { TaxResponse } from '../../models/api-models/Company';
import { TaxControlData } from '../../shared/theme/index';
import { LedgerActions } from '../../services/actions/ledger/ledger.actions';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { StockUnits } from '../../inventory/components/custom-stock-components/stock-unit';
import { BaseResponse } from '../../models/api-models/BaseResponse';
import { Select2OptionData } from '../../shared/theme/select2/select2.interface';
import * as uuid from 'uuid';
import { IContentCommon, ICommonItemOfTransaction, IInvoiceTax } from '../../models/api-models/Invoice';
const STOCK_OPT_FIELDS = ['Qty.', 'Unit', 'Rate'];
const THEAD_ARR = [
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
  },
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
  },
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

  public isGenDtlCollapsed: boolean = true;
  public isMlngAddrCollapsed: boolean = true;
  public isOthrDtlCollapsed: boolean = true;
  public typeaheadNoResultsOfCustomer: boolean = false;
  public typeaheadNoResultsOfSalesAccount: boolean = false;
  public invFormData: InvoiceFormClass;
  public accounts$: Observable<INameUniqueName[]>;
  public bankAccounts$: Observable<INameUniqueName[]>;
  public salesAccounts$: Observable<Select2OptionData[]>;
  public accountAsideMenuState: string = 'out';
  public theadArr: IContentCommon[] = THEAD_ARR;
  public activeGroupUniqueName$: Observable<string>;
  public companyTaxesList$: Observable<TaxResponse[]>;
  public selectedTaxes: string[] = [];
  public showTaxBox: boolean = false;
  public stockList: IStockUnit[] = [];
  public isStockTxn: boolean = false;
  public accountsOptions: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Select Accounts',
    allowClear: true,
    // maximumSelectionLength: 1,
    templateSelection: (data) => data.text,
    templateResult: (data: any) => {
      if (data.text === 'Searching…') {
        return;
      }
      if (!data.additional.stock) {
        return $(`<a href="javascript:void(0)" class="account-list-item" style="border-bottom: 1px solid #000;"><span class="account-list-item" style="display: block;font-size:14px">${data.text}</span><span class="account-list-item" style="display: block;font-size:12px">${data.additional.uniqueName}</span></a>`);
      } else {
        return $(`<a href="javascript:void(0)" class="account-list-item" style="border-bottom: 1px solid #000;"><span class="account-list-item" style="display: block;font-size:14px">${data.text}</span><span class="account-list-item" style="display: block;font-size:12px">${data.additional.uniqueName}</span><span class="account-list-item" style="display: block;font-size:11px">Stock: ${data.additional.stock.name}</span></a>`);
      }
    }
  };
  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private selectedAccountDetails$: Observable<AccountResponseV2>;

  constructor(
    private store: Store<AppState>,
    private accountService: AccountService,
    private salesAction: SalesActions,
    private companyActions: CompanyActions,
    private ledgerActions: LedgerActions
  ) {
    this.invFormData = new InvoiceFormClass();
    this.store.dispatch(this.companyActions.getTax());
    this.store.dispatch(this.ledgerActions.GetDiscountAccounts());
    this.stockList = StockUnits;
  }

  public ngOnInit() {

    // get accounts and select only accounts which belong in sundrydebtors category
    this.accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: INameUniqueName[] = [];
        let bankaccounts: INameUniqueName[] = [];
        let accountsArray: Select2OptionData[] = [];
        _.forEach(data.body.results, (item) => {
          // creating account list only of sundrydebtors category
          if (_.find(item.parentGroups, (o) => o.uniqueName === 'sundrydebtors')) {
            accounts.push({ name: item.name, uniqueName: item.uniqueName });
          }
          // creating bank account list
          if (_.find(item.parentGroups, (o) => o.uniqueName === 'bankaccounts')) {
            bankaccounts.push({ name: item.name, uniqueName: item.uniqueName });
          }

          // creating account list
          if (item.stocks) {
            item.stocks.map(as => {
              accountsArray.push({
                id: uuid.v4(),
                text: item.name,
                additional: Object.assign({}, item, { stock: as })
              });
            });
            accountsArray.push({ id: uuid.v4(), text: item.name, additional: item });
          } else {
            accountsArray.push({ id: uuid.v4(), text: item.name, additional: item });
          }
        });
        // accounts.unshift({ name: '+ Add Customer', uniqueName: 'addnewcustomer'});
        this.accounts$ = Observable.of(accounts);
        this.bankAccounts$ = Observable.of(bankaccounts);
        this.salesAccounts$ = Observable.of(_.orderBy(accountsArray, 'text'));
        console.log ('accountsArray', accountsArray);
      }
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
        _.map(this.theadArr, (item: IContentCommon) => {
          // show tax label
          if (item.label === 'Tax') {
            item.display = true;
          }
          return item;
        });
        this.showTaxBox = true;
      }
    });

    // get discount list

    // this.store.select(p => p.ledger.discountAccountsList).takeUntil(this.destroyed$).subscribe((o: IFlattenGroupsAccountsDetail) => {
    //   if (o) {
    //     this.discountItem$ = Observable.of(o);
    //   }
    // });

  }

  public assignValuesInForm(data: AccountResponseV2) {
    console.log ('assignValuesInForm', data);
    // toggle all collapse
    this.isGenDtlCollapsed = false;
    this.isMlngAddrCollapsed = false;
    this.isOthrDtlCollapsed = false;

    // auto fill all the details
    this.invFormData.account.attentionTo = data.attentionTo;
    this.invFormData.invoiceDetails.invoiceDate = moment().format('DD-MM-YYYY');
    this.invFormData.country.countryName = data.country.countryName;
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

  public onSubmitInvoiceForm(f: NgForm) {
    console.log (f, 'onSubmitInvoiceForm');
    console.log (this.invFormData, 'actual class object');
  }

  public noResultsForSalesAccount(e: boolean): void {
    this.typeaheadNoResultsOfSalesAccount = e;
  }

  public onSelectSalesAccount(e: any, txn: SalesTransactionItemClass): void {
    if (e.value) {
      let selectedAcc: any = null;
      this.salesAccounts$.take(1).subscribe(data => {
        data.map(item => {
          if (item.id === e.value) {
            selectedAcc = item;
          }
        });
      });
      if (selectedAcc) {
        this.accountService.GetAccountDetailsV2(selectedAcc.additional.uniqueName).takeUntil(this.destroyed$).subscribe((data: BaseResponse<AccountResponseV2, string>) => {
          if (data.status === 'success') {
            let o = _.cloneDeep(data.body);
            console.log ('set data in tr', o);
            txn.accountName = o.name;
            txn.accountUniqueName = o.uniqueName;
            txn.hsnNumber = o.hsnNumber;
            txn.sacNumber = o.sacNumber;
            txn.description = 'Entry generated by sales module';
            if (o.stocks && selectedAcc.additional.stock) {
              txn.stockUnit = selectedAcc.additional.stock.stockUnit.code;
              // 'KGS' not printing values due to mismatching spells.
              this.isStockTxn = true;
            } else {
              this.isStockTxn = false;
              txn.stockUnit = null;
            }
            // toggle stock related fields
            this.toggleStockFields();
            return txn;
          }
        });
      }
    } else {
      this.isStockTxn = false;
      this.toggleStockFields();
    }
  }

  public toggleStockFields() {
    _.map(this.theadArr, (item: IContentCommon) => {
      // show labels related to stock entry
      if (_.indexOf(STOCK_OPT_FIELDS, item.label) !== -1 ) {
        item.display = this.isStockTxn;
      }
      // hide amount label
      if (item.label === 'Amount') {
        item.display = !this.isStockTxn;
      }
      return item;
    });
  }

  public noResultsForCustomer(e: boolean): void {
    this.typeaheadNoResultsOfCustomer = e;
  }

  public onSelectCustomer(e: TypeaheadMatch): void {
    console.log('Selected value: ', e.value, e.item);
    this.getAccountDetails(e.item.uniqueName);
  }

  public getAccountDetails(accountUniqueName: string) {
    this.store.dispatch(this.salesAction.getAccountDetailsForSales(accountUniqueName));
  }

  public toggleAccountAsidePane(event): void {
    if (event) {
      event.preventDefault();
    }
    this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
  }

  public addBlankRowInTransaction() {
    // logic to add new blank row
  }

  public taxAmountEvent(tax, txn: SalesTransactionItemClass, entry: SalesEntryClass) {
    txn.total = txn.getTransactionTotal(tax, entry);
  }

  public selectedTaxEvent(arr: string[], entry: SalesEntryClass) {
    this.selectedTaxes = arr;
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

  public selectedDiscountEvent(arr: FakeDiscountItem[], txn: SalesTransactionItemClass) {
    this.invFormData.entries[0].discounts = [];
    // modified values according to api model
    _.forEach(arr, (item: FakeDiscountItem) => {
      let o: ICommonItemOfTransaction = {
        amount: item.amount,
        accountName: item.name,
        accountUniqueName: item.particular
      };
      this.invFormData.entries[0].discounts.push(o);
    });

    // call taxableValue method
    txn.setAmount(this.invFormData.entries[0]);
  }

}
