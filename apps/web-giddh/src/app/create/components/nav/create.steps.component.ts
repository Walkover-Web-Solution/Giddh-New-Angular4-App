import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'create-invoice-steps',
    templateUrl: './create.steps.component.html',
    styleUrls: ['./create.steps.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class CreateInvoiceStepsComponent implements OnInit, OnDestroy {

    public stage: string = 'one';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
    ) {
        //
    }

    public setStep(id: string) {
        if (this.stage === id) {
            return;
        }
        this.stage = id;
        if (id === 'one') {
            this._router.navigate(['/create-invoice/invoice']);
        }
    }

    public ngOnInit() {
        this._route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params['templateId']) {
                this.stage = 'two';
            } else {
                this.stage = 'one';
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
