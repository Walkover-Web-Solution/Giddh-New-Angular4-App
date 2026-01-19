import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { HSNSummary } from '../../../../../../models/api-models/GstReconcile';
import { GstReport } from 'apps/web-giddh/src/app/gst/constants/gst.constant';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';

/**
 * Handles Component functionality
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'hsn-summary',
    templateUrl: './hsn-summary.component.html',
    styleUrls: ['hsn-summary.component.css'],
    standalone: false
})
/**
 * HsnSummaryComponent component
 * Handles hsnsummary functionality and user interactions
 */
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
    /** Holds the displayed columns */
    public displayedColumns: string[] = [
        'hsn_sc',
        'desc',
        'qty',
        'uqc',
        'txval',
        'rt',
        'iamt',
        'camt',
        'samt',
        'csamt',
        'val'
    ];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(@Inject(ServiceConfig) private serviceConfig) { }
    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        /**
         * Handles if functionality
         */
        if (this.selectedGst !== GstReport.Gstr1) {
            this.displayedColumns = this.displayedColumns?.filter(column => column !== 'rt');
        }
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
