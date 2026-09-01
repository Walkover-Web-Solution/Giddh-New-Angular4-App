import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
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
    /** True when opened with ?module=dsc to show DSC bridge/extension downloads instead of the file download */
    public isDscModule: boolean = false;
    /** Giddh DSC browser extension store link */
    public dscExtensionUrl: string = '';
    /** Giddh DSC bridge installer for Windows */
    public dscWindowsAppUrl: string = '';
    /** Giddh DSC bridge installer for macOS */
    public dscMacAppUrl: string = '';

    constructor(@Inject(ServiceConfig) private serviceConfig, private route: ActivatedRoute, private generalService: GeneralService, private location: Location, private router: Router) {
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
            this.isDscModule = response?.module === 'dsc';
            if (this.isDscModule) {
                this.setDscDownloadUrls();
            }
            if (response && response.url) {
                this.downloadUrl = response.url;
            }
        });
    }

    /**
     * Builds the DSC bridge installer and browser extension download links
     * based on the current environment.
     *
     * @private
     * @memberof DownloadComponent
     */
    private setDscDownloadUrls(): void {
        this.dscWindowsAppUrl = 'https://s3-ap-south-1.amazonaws.com/hello-electron-app/prod/windows/latest/GiddhDSCBridge-Setup.exe';
        this.dscMacAppUrl = 'https://s3-ap-south-1.amazonaws.com/hello-electron-app/prod/macos/latest/GiddhDSCBridge.dmg';
        this.dscExtensionUrl = 'https://chromewebstore.google.com/detail/giddh-dsc-bridge/pbnmboohmdoknhpflpmeocccojkkjgng';
    }

    /**
     * Navigates back to the previous location; redirects to home when no
     * previous location exists in the browser history.
     *
     * @memberof DownloadComponent
     */
    public goToPreviousPage(): void {
        if (window.history.length > 1) {
            this.location.back();
        } else {
            this.router.navigate(['/pages/home']);
        }
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
