import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HSNSummary } from '../../../../../../models/api-models/GstReconcile';
import { GstReport } from 'apps/web-giddh/src/app/gst/constants/gst.constant';

@Component({
    // tslint:disable-next-line:component-selector
    selector: 'hsn-summary',
    templateUrl: './hsn-summary.component.html',
    styleUrls: ['hsn-summary.component.css'],
})
export class HsnSummaryComponent implements OnInit, OnDestroy {

    @Input() public hsnSummary: HSNSummary = new HSNSummary();
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* This will hold selected GST */
    @Input() public selectedGst: string = '';
    /* This variable holds the instance of the report */
    public get GstReport() {
        return GstReport;
    }
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
