import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from '../services/general.service';
import { ServiceConfig } from '../services/service.config';

@Component({
selector: 'download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss'],
    standalone: false
})

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
    public brandLogoUrl: string = '';

    constructor(@Inject(ServiceConfig) private serviceConfig, private route: ActivatedRoute, private generalService: GeneralService) {
    }

    /**
     * Initializes the component
     *
     * @memberof DownloadBulkInvoiceComponent
     */
    public ngOnInit(): void {
        this.imgPath = this.serviceConfig.IMG_PATH;
        this.brandLogoUrl = this.serviceConfig.LOGOS.light;

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
