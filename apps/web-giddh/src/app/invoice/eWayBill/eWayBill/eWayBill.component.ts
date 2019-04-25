import { Component, OnInit } from '@angular/core';
import { InvoiceActions }  from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { InvoiceService }  from 'apps/web-giddh/src/app/services/invoice.service';
import { ActivatedRoute } from '@angular/router';
import { AppState }  from 'apps/web-giddh/src/app/store';
import { Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IEwayBillAllList }  from 'apps/web-giddh/src/app/models/api-models/Invoice';

@Component({
  selector: 'app-ewaybill-component',
  templateUrl: './eWayBill.component.html',
  styleUrls: [`./eWayBill.component.scss`]
})

export class EWayBillComponent implements OnInit {
public isGetAllEwaybillRequestInProcess$: Observable<boolean>;
public isGetAllEwaybillRequestSuccess$: Observable<boolean>;
public EwaybillLists: IEwayBillAllList;

private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions,
    private _invoiceService: InvoiceService,
    private _activatedRoute: ActivatedRoute,
  ) {

    this.isGetAllEwaybillRequestInProcess$ = this.store.select(p => p.ewaybillstate.isGetAllEwaybillRequestInProcess).pipe(takeUntil(this.destroyed$));
    this.isGetAllEwaybillRequestSuccess$ = this.store.select(p => p.ewaybillstate.isGetAllEwaybillRequestSuccess).pipe(takeUntil(this.destroyed$));
    this.store.dispatch(this.invoiceActions.getALLEwaybillList());
  }
  public ngOnInit(): void {
    // getALLEwaybillList();
 this.store.select(p => p.ewaybillstate.EwayBillList).pipe(takeUntil(this.destroyed$)).subscribe((o: IEwayBillAllList) => {
      if (o) {
        this.EwaybillLists = _.cloneDeep(o);
        console.log('EwaybillLists', this.EwaybillLists); // totalItems
  }
});
}

}
