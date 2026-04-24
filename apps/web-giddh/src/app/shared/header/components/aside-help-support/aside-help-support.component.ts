import { Component, EventEmitter, OnInit, Output, OnDestroy, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
import { AuthenticationService } from 'apps/web-giddh/src/app/services/authentication.service';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { AppState } from 'apps/web-giddh/src/app/store';
import { environment } from 'apps/web-giddh/src/environments/environment.generated';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'aside-help-support',
    templateUrl: './aside-help-support.component.html',
    styleUrls: [`./aside-help-support.component.scss`],
    standalone: false
})

export class AsideHelpSupportComponent implements OnInit, OnDestroy {
    public imgPath: string = '';
    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /* This will hold the value of current mobile apk version */
    public apkVersion: string;
    /** Version of lated mac app  */
    public macAppVersion: string;
    /** Windows app download URL */
    public windowsDownloadUrl: string;
    /** Mac app download URL */
    public macDownloadUrl: string;
    /** Holds Giddh help documentation url */
    public helpDocUrl: string = '';
    /** Holds Giddh support phone number */
    public supportPhoneNumber: string = '';
    /** Holds Giddh support email */
    public supportEmail: string = '';
    /** Android app URL */
    public androidAppUrl: string = '';
    /** iOS app URL */
    public iosAppUrl: string = '';
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private authService: AuthenticationService,
        @Inject(ServiceConfig) public serviceConfig,
        private generalActions: GeneralActions,
        private store: Store<AppState>,
        public generalService: GeneralService
    ) { }

    /**
     * Initialize the component
     *
     * @memberof AsideHelpSupportComponent
     */
    public ngOnInit() {
        this.setDownloadUrls();
        this.getElectronAppVersion();
        this.getElectronMacAppVersion();
        this.helpDocUrl = this.serviceConfig.HELP_DOC_URL ?? '';
        this.androidAppUrl = this.serviceConfig.ANDROID_APP_URL ?? '';
        this.iosAppUrl = this.serviceConfig.IOS_APP_URL ?? '';
        this.imgPath = this.serviceConfig.IMG_PATH;
        this.supportPhoneNumber = this.serviceConfig.SUPPORT_PHONE ?? '';
        this.supportEmail = this.serviceConfig.SUPPORT_EMAIL ?? '';
    }

    /**
    * This will close the popup
    *
    * @param {*} [event]
    * @memberof AsideHelpSupportComponent
    */
    public closeAsidePane(event?): void {
        this.closeAsideEvent.emit(event);
    }

    /**
     * This will open schedule now window
     *
     * @param {*} event
     * @memberof AsideHelpSupportComponent
     */
    public scheduleNow(event): void {
        this.store.dispatch(this.generalActions.isOpenCalendlyModel(true));
        this.closeAsidePane(event);
    }

    /**
     * This will fetch the updated app version
     *
     * @private
     * @memberof AsideSettingComponent
     */
    private getElectronAppVersion(): void {
        this.authService.GetElectronAppVersion().pipe(takeUntil(this.destroyed$)).subscribe((res: string) => {
            if (res && typeof res === 'string') {
                let version = res.split('files')[0];
                let versNum = version.split(' ')[1];
                this.apkVersion = versNum;
            }
        });
    }

    /**
     * To get latest version of mac app
     *
     * @private
     * @memberof AsideHelpSupportComponent
     */
    private getElectronMacAppVersion(): void {
        this.authService.getElectronMacAppVersion().pipe(takeUntil(this.destroyed$)).subscribe((res: string) => {
            if (res && typeof res === 'string') {
                let version = res.split('files')[0];
                let versNum = version.split(' ')[1];
                this.macAppVersion = versNum;
            }
        });
    }

    /**
     * Sets download URLs based on environment
     *
     * @private
     * @memberof AsideHelpSupportComponent
     */
    private setDownloadUrls(): void {
        const isProduction = environment.PRODUCTION_ENV;
        const envPath = isProduction ? 'prod' : 'test';
        const fileName = isProduction ? 'giddh-setup' : 'giddh-test-setup';
        
        this.windowsDownloadUrl = `https://s3-ap-south-1.amazonaws.com/app-giddh-test/${envPath}/windows/latest/${fileName}.exe`;
        this.macDownloadUrl = `https://s3-ap-south-1.amazonaws.com/app-giddh-test/${envPath}/mac/latest/${fileName}.dmg`;
    }

    /**
     * Releases memory
     *
     * @memberof AsideHelpSupportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
