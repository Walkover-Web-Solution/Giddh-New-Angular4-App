import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'create-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CreateInvoiceComponent implements OnInit, OnDestroy {

  public imgPath: string = '';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  public ngOnInit() {
    console.log ('CreateInvoiceComponent loaded');
    this.imgPath = isElectron ? 'assets/images/templates/' : AppUrl + APP_FOLDER + 'assets/images/templates/';
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
