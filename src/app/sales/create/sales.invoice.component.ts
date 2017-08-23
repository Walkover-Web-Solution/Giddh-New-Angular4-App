import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, trigger, state, style, transition, animate, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { InvoiceActions } from '../../services/actions/invoice/invoice.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { InvoiceFormClass } from '../../models/api-models/Sales';
import { InvoiceState } from '../../store/Invoice/invoice.reducer';
import { InvoiceService } from '../../services/invoice.service';
import { Observable } from 'rxjs/Observable';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AccountService } from '../../services/account.service';
import { INameUniqueName } from '../../models/interfaces/nameUniqueName.interface';
import { ElementViewContainerRef } from '../../shared/helpers/directives/element.viewchild.directive';

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
  // private below
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private accountService: AccountService
  ) {}

  public ngOnInit() {

    this.invFormData = new InvoiceFormClass();

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
        console.log ('bank acount', this.bankAccounts$);
      }
    });
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
  }

  public toggleAccountAsidePane(event): void {
    event.preventDefault();
    this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
  }

}
