import { Component, EventEmitter, OnInit, Output, OnDestroy, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
import { AuthenticationService } from 'apps/web-giddh/src/app/services/authentication.service';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ReplaySubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Configuration } from '../../../../app.constant';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'aside-help-support',
    standalone: false,
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
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private authService: AuthenticationService,
        @Inject(ServiceConfig) private serviceConfig,
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
        this.imgPath = Configuration.isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || environment.AppUrl) + environment.APP_FOLDER + 'assets/images/';
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
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
