import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
    selector: 'invoice-generate-model',
    templateUrl: './invoice.generate.model.component.html'
})

export class InvoiceGenerateModelComponent implements OnDestroy, OnInit {
    @Output() public closeEvent: EventEmitter<string> = new EventEmitter<string>();
    public goAhead: boolean = false;
    public hasErr: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(
        private store: Store<AppState>,
    ) {}

    public ngOnInit() {
      this.store.select(p => p.invoice)
        .takeUntil(this.destroyed$)
        .distinctUntilChanged()
        .subscribe((o: any) => {
          this.hasErr = false;
          if (o && o.invoiceData && o.invoiceTemplateConditions) {
            this.goAhead = true;
          }else {
            // this.hasErr = true;
          }
        }
      );
    }

    public ngOnDestroy() {
      this.hasErr = false;
      this.goAhead = false;
      this.destroyed$.next(true);
      this.destroyed$.complete();
    }

    public closePopupEvent(e) {
      this.closeEvent.emit(e);
    }
}
