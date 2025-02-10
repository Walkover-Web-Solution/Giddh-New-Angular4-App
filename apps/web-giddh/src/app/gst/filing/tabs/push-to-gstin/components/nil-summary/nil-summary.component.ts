import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { NilSummary } from '../../../../../../models/api-models/GstReconcile';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

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

    constructor(@Inject(ServiceConfig) private serviceConfig ) {}

    public ngOnInit() {
        this.imgPath = isElectron ? 'assets/images/gst/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/gst/';
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
