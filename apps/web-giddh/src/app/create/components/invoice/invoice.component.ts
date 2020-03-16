import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'create-invoice',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class CreateInvoiceComponent implements OnInit, OnDestroy {

    public imgPath: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private _router: Router) {

    }

    public ngOnInit() {
        this.imgPath = (isElectron||isCordova)  ? 'assets/images/templates/' : AppUrl + APP_FOLDER + 'assets/images/templates/';
        this._router.navigate(['/create-invoice/invoice/t001']); // Remove this line when you have multiple templates
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
