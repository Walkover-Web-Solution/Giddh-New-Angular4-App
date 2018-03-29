import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'create-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
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
