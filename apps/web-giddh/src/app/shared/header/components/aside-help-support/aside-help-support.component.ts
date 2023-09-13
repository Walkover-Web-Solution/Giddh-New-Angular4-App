import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
import { AuthenticationService } from 'apps/web-giddh/src/app/services/authentication.service';
import { AppState } from 'apps/web-giddh/src/app/store';
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

    constructor(
        private authService: AuthenticationService,
        private generalActions: GeneralActions,
        private store: Store<AppState>
    ) {

    }

    /**
     * Initialize the component
     *
     * @memberof AsideHelpSupportComponent
     */
    public ngOnInit() {
        this.getElectronAppVersion();
        this.getElectronMacAppVersion();
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
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
     * Releases memory
     *
     * @memberof AsideHelpSupportComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
