import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { B2CSSummary } from '../../../../../../models/api-models/GstReconcile';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { Configuration } from 'apps/web-giddh/src/app/app.constant';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';

/**
 * Handles Component functionality
 */
@Component({
    // tslint:disable-next-line:component-selector
    selector: 'b2cs-summary',
    templateUrl: './b2cs-summary.component.html',
    styleUrls: ['./b2cs-summary.component.css'],
    standalone: false
})
/**
 * B2csSummaryComponent component
 * Handles b2cssummary functionality and user interactions
 */
export class B2csSummaryComponent implements OnInit, OnDestroy {
    @Input() public brcsSummary: B2CSSummary[] = [];
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public imgPath: string = '';

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
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
