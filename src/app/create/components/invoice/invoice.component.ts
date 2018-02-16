import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'create-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class CreateInvoiceComponent implements OnInit, OnDestroy {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public ngOnInit() {
    console.log ('CreateInvoiceComponent loaded');
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
