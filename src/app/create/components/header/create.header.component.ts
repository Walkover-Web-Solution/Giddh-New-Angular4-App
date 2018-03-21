import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'create-invoice-header',
  templateUrl: './create.header.component.html',
  styleUrls: ['./create.header.component.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class CreateInvoiceHeaderComponent implements OnInit, OnDestroy {

  public imgPath: string = '';
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {
    //
  }

  public ngOnInit() {
    this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
