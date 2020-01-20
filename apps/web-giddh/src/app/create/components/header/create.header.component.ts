import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { Meta } from '@angular/platform-browser';

@Component({
    selector: 'create-invoice-header',
    templateUrl: './create.header.component.html',
    styleUrls: ['./create.header.component.scss'],
    encapsulation: ViewEncapsulation.Emulated
})
export class CreateInvoiceHeaderComponent implements OnInit, OnDestroy {

    public imgPath: string = '';
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private meta: Meta) {
        this.meta.updateTag({ name: 'description', content: 'Forget about the painful and tedious ways to create custom invoice. Giddh offers the best accounting software to create your own invoice online easily for small businesses. You can create invoice bill online anytime and anywhere. 24/7 Customer Support! Start your free trial today!' });
        //
    }

    public ngOnInit() {
        this.imgPath = (isElectron||isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
