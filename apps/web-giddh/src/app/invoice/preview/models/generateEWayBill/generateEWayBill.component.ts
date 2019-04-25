import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { InvoiceService }  from 'apps/web-giddh/src/app/services/invoice.service';
import { SelectedInvoices }  from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { Observable, ReplaySubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState }  from 'apps/web-giddh/src/app/store';
import { takeUntil } from 'rxjs/operators';
import { InvoiceActions }  from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';

@Component({
  selector: 'app-generate-ewaybill-modal',
  templateUrl: './generateEWayBill.component.html',
  styleUrls: [`./generateEWayBill.component.scss`]
})

export class GenerateEWayBillComponent implements OnInit {
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Input() public ChildSelectedInvoicesList: any[];
  public isLoggedInUserEwayBill$: Observable<boolean>;
  public invoiceList: SelectedInvoices[] = [];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private router: Router, private _invoiceService: InvoiceService, private invoiceActions: InvoiceActions, private store: Store<AppState>) {
    //
    this.isLoggedInUserEwayBill$ = this.store.select(p => p.ewaybillstate.isUserLoggedInEwaybillSuccess).pipe(takeUntil(this.destroyed$));

  }

  public ngOnInit(): void {
    this.isLoggedInUserEwayBill$.subscribe(p => {
      if (!p) {
        this.store.dispatch(this.invoiceActions.isLoggedInUserEwayBill());
      }
    });
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }

  public createEWayBill() {
    this.router.navigate(['pages', 'invoice', 'ewaybill', 'create']);
  }
}
