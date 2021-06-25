import { Component, EventEmitter, OnInit, Output, HostListener, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'apps/web-giddh/src/app/services/authentication.service';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'aside-help-support',
    templateUrl: './aside-help-support.component.html',
    styleUrls: [`./aside-help-support.component.scss`],
})

export class AsideHelpSupportComponent implements OnInit, OnDestroy {
    public imgPath: string = '';
    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /* This will hold the value of current mobile apk version */
    public apkVersion: string;
    /** Version of lated mac app  */
    public macAppVersion: string;
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if oncehub SOE script loaded */
    public soeLoaded: boolean = false;

    constructor(private authService: AuthenticationService) {

    }

    /**
     * Initialize the component
     *
     * @memberof AsideHelpSupportComponent
     */
    public ngOnInit() {
        this.getElectronAppVersion();
        this.getElectronMacAppVersion();
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        if (window['SOE'] === undefined) {
            this.soeLoaded = true;
            /* For Schedule now */
            let scriptTag = document.createElement('script');
            scriptTag.src = 'https://cdn.oncehub.com/mergedjs/so.js';
            scriptTag.type = 'text/javascript';
            scriptTag.defer = true;
            document.body.appendChild(scriptTag);
            /* For Schedule now */
        }
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
     * This will initialize the function to show calendly
     *
     * @param {*} event
     * @memberof AsideHelpSupportComponent
     */
    public scheduleNow(event): void {
        if(!this.soeLoaded) {
            window['SOE'].prototype.toggleLightBox('giddhbooks');
        }
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
     * This will detect the ESCAPE keypress and will close the popup
     *
     * @param {KeyboardEvent} event
     * @memberof AsideHelpSupportComponent
     */
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.closeAsidePane();
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
     * Releases memory
     *
     * @memberof AsideHelpSupportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
