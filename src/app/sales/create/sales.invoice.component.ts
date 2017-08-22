import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
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

@Component({
  styleUrls: ['./sales.invoice.component.scss'],
  templateUrl: './sales.invoice.component.html',
  selector: 'sales-invoice',
})

export class SalesInvoiceComponent implements OnInit {
  public isGenDtlCollapsed: boolean = true;
  public isMlngAddrCollapsed: boolean = true;
  public isOthrDtlCollapsed: boolean = true;
  public typeaheadNoResultsOfCustomer: boolean = false;
  public invFormData: InvoiceFormClass;
  public accounts$: Observable<INameUniqueName[]>;
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
        _.forEach(data.body.results, (item) => {
          let res = _.find(item.parentGroups, (o) => o.uniqueName === 'sundrydebtors');
          if (res) {
            accounts.push({ name: item.name, uniqueName: item.uniqueName });
          }
        });
        // accounts.unshift({ name: '+ Add Customer', uniqueName: 'addnewcustomer'});
        this.accounts$ = Observable.of(accounts);
      }
    });

    // this.store.select(p => p.invoice.generate.invoiceData)
    //   .takeUntil(this.destroyed$)
    //   .distinctUntilChanged()
    //   .subscribe((o: PreviewAndGenerateInvoiceResponse) => {
    //     if (o) {
    //       this.invFormData = _.cloneDeep(o);
    //     }else {
    //       this.invFormData = new PreviewAndGenerateInvoiceResponse();
    //     }
    //   }
    // );
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

  public showAddNewCustomerPanel(event): void {
    event.preventDefault();
    // event.stopPropagation();
    console.log('open add new customer pane');
  }

}
