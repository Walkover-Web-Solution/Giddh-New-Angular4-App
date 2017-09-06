import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, trigger, state, style, transition, animate, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceFormClass, SalesEntryClass, SalesTransactionItemClass } from '../../models/api-models/Sales';
import { InvoiceState } from '../../store/Invoice/invoice.reducer';
import { InvoiceService } from '../../services/invoice.service';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AccountService } from '../../services/account.service';
import { INameUniqueName } from '../../models/interfaces/nameUniqueName.interface';
import { ElementViewContainerRef } from '../../shared/helpers/directives/element.viewchild.directive';
import { SalesActions } from '../../services/actions/sales/sales.action';
import { AccountResponse } from '../../models/api-models/Account';
import { CompanyActions } from '../../services/actions/company.actions';
import { TaxResponse } from '../../models/api-models/Company';
import { TaxControlData } from '../../shared/theme/index';
import { LedgerActions } from '../../services/actions/ledger/ledger.actions';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
const THEAD_ARR = ['Sno.', 'Date', 'Product/Service', 'HSN/SAC', 'Qty.', 'Unit', 'Rate', 'Discount', 'Taxable', 'Tax', 'Total'];

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
  public invFormData: InvoiceFormClass;
  public accounts$: Observable<INameUniqueName[]>;
  public bankAccounts$: Observable<INameUniqueName[]>;
  public accountAsideMenuState: string = 'out';
  public theadArr: string[] = THEAD_ARR;
  public activeGroupUniqueName$: Observable<string>;
  public companyTaxesList$: Observable<TaxResponse[]>;
  public selectedTaxes: string[] = [];
  public showTaxBox: boolean = false;
  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  private selectedAccountDetails$: Observable<AccountResponse>;

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
  }

  public ngOnInit() {

    // get accounts and select only accounts which belong in sundrydebtors category
    this.accountService.GetFlattenAccounts('', '').takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let accounts: INameUniqueName[] = [];
        let bankaccounts: INameUniqueName[] = [];
        _.forEach(data.body.results, (item) => {
          // creating account list only of sundrydebtors category
          if (_.find(item.parentGroups, (o) => o.uniqueName === 'sundrydebtors')) {
            accounts.push({ name: item.name, uniqueName: item.uniqueName });
          }
          // creating bank account list
          if (_.find(item.parentGroups, (o) => o.uniqueName === 'bankaccounts')) {
            bankaccounts.push({ name: item.name, uniqueName: item.uniqueName });
          }
        });
        // accounts.unshift({ name: '+ Add Customer', uniqueName: 'addnewcustomer'});
        this.accounts$ = Observable.of(accounts);
        this.bankAccounts$ = Observable.of(bankaccounts);
      }
    });

    // get account details and set it to local var
    this.selectedAccountDetails$ = this.store.select(state => state.sales.acDtl).takeUntil(this.destroyed$);
    this.selectedAccountDetails$.subscribe(o => {
      if (o) {
        this.assignValuesInForm(o);
      }
    });

    // get tax list and assign values to local vars
    this.store.select(p => p.company.taxes).takeUntil(this.destroyed$).subscribe((o: TaxResponse[]) => {
      if (o) {
        this.companyTaxesList$ = Observable.of(o);
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

  public assignValuesInForm(data: AccountResponse) {
    console.log ('assignValuesInForm', data);
    // toggle all collapse
    this.isGenDtlCollapsed = false;
    this.isMlngAddrCollapsed = false;
    this.isOthrDtlCollapsed = false;

    // auto fill all the details
    this.invFormData.account.attentionTo = data.attentionTo;
    this.invFormData.account.billingDetails.address = [data.address];
    this.invFormData.account.shippingDetails.address = [data.address];
    this.invFormData.country.countryName = data.country.countryName;
  }

  public onSubmitInvoiceForm(f: NgForm) {
    console.log (f, 'onSubmitInvoiceForm');
    console.log (this.invFormData, 'actual class object');
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
    // let transItem: SalesTransactionItemClass = {
    //   discount: null,
    //   description: 'Fresh entry desc',
    //   amount: 0,
    //   accountUniqueName: null,
    //   accountName: 'Fresh',
    //   hsnNumber: null,
    //   sacNumber: null,
    //   quantity: null,
    //   stockUnit: null,
    //   rate: null,
    // };
    // let entryItem: SalesEntryClass = {
    //   uniqueName: null,
    //   transactions: [transItem]
    // };
    // this.invFormData.entries.push(entryItem);
  }

  public taxAmountEvent($event) {
    console.log ('taxAmountEvent', $event);
  }

  public selectedTaxEvent(arr: string[]) {
    console.log ('selectedTaxEvent', arr);
    this.selectedTaxes = arr;
  }

  public selectedDiscountEvent(arr: any[]) {
    console.log ('selectedDiscountEvent', arr);
  }

}
