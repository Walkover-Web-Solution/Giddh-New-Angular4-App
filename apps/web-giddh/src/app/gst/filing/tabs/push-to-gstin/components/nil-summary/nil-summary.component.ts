import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { NilSummary } from '../../../../../../models/api-models/GstReconcile';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'nil-summary',
    templateUrl: './nil-summary.component.html',
    styleUrls: ['nil-summary.component.css'],
})
export class NilSummaryComponent implements OnInit, OnDestroy {
    @Input() public nilSummary: NilSummary = new NilSummary();
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public imgPath: string = '';

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor() {
        
    }

    public ngOnInit() {
        this.imgPath = isElectron ? 'assets/images/gst/' : AppUrl + APP_FOLDER + 'assets/images/gst/';
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
