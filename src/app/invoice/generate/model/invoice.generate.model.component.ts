import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from 'lodash';

@Component({
    selector: 'invoice-generate-model',
    templateUrl: './invoice.generate.model.component.html'
})

export class InvoiceGenerateModelComponent implements OnDestroy, OnInit {
    @Output() public closeEvent: EventEmitter<string> = new EventEmitter<string>();
    public goAhead: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    constructor(
        private store: Store<AppState>,
    ) {}

    public ngOnInit() {
      this.store.select(p => p.invoice)
        .takeUntil(this.destroyed$)
        .distinctUntilChanged()
        .subscribe((o: any) => {
          if (o && o.invoiceData && o.invoiceTemplateConditions) {
            this.goAhead = true;
          }
        }
      );
    }

    public ngOnDestroy() {
      this.destroyed$.next(true);
      this.destroyed$.complete();
    }

    public closePopupEvent(e) {
      this.closeEvent.emit(e);
    }
}
