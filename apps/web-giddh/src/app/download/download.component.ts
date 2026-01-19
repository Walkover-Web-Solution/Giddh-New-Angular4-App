import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from '../services/general.service';
import { ServiceConfig } from '../services/service.config';
import { Configuration } from '../app.constant';
import { environment } from '../../environments/environment.generated';

/**
 * Handles Component functionality
 */
@Component({
selector: 'download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss'],
    standalone: false
})

/**
 * DownloadComponent component
 * Handles download functionality and user interactions
 */
export class DownloadComponent implements OnInit, OnDestroy {
    /** This holds url to download */
    public downloadUrl: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* it will store image path */
    public imgPath: string = '';
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* Hold giddh logo source */
    public giddhLogoSrc: string = '';
    /* Hold giddh domain url */
    public giddhDomainUrl: string = '';

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(@Inject(ServiceConfig) private serviceConfig, private route: ActivatedRoute, private generalService: GeneralService) {
    }

    /**
     * Initializes the component
     *
     * @memberof DownloadBulkInvoiceComponent
     */
    public ngOnInit(): void {
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
        const whiteLabel = this.generalService.getDecodedWhiteLabel();
        this.giddhLogoSrc = whiteLabel?.giddhWhiteLabel?.logo || this.imgPath + 'giddh-white-logo.svg';
        this.giddhDomainUrl = this.serviceConfig.AppUrl ||  'https://books.giddh.com/';

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            /**
             * Handles if functionality
             */
            if (response && response.url) {
                this.downloadUrl = response.url;
            }
        });
    }

    /**
     * Releases the memory
     *
     * @memberof DownloadBulkInvoiceComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
