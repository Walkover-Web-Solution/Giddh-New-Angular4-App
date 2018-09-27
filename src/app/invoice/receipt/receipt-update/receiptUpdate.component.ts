import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../../store';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { Voucher } from '../../../models/api-models/recipt';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-receipt-update',
  templateUrl: 'receiptUpdate.component.html'
})

export class ReceiptUpdateComponent implements OnInit, OnDestroy {
  public voucher$: Observable<Voucher>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>) {
    this.voucher$ = this.store.pipe(select((state: AppState) => state.receipt.voucher), takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
