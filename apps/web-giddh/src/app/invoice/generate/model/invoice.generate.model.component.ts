import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store/roots';
import { ReplaySubject } from 'rxjs';

@Component({
    selector: 'invoice-generate-model',
    templateUrl: './invoice.generate.model.component.html'
})

export class InvoiceGenerateModelComponent implements OnDestroy, OnInit {
    @Output() public closeEvent: EventEmitter<string> = new EventEmitter<string>();
    @Input() public isGenerateInvoice: boolean = true;
    public goAhead: boolean = false;
    public hasErr: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private store: Store<AppState>
    ) {
    }

    public ngOnInit() {
        this.store.pipe(select(p => p.receipt.voucher), 
            distinctUntilChanged(), takeUntil(this.destroyed$))
            .subscribe((o: any) => {
                this.hasErr = false;
                if (o && o.voucherDetails) {
                    this.goAhead = true;
                }
            });
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
