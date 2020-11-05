import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
import { AuthenticationService } from 'apps/web-giddh/src/app/services/authentication.service';
@Component({
    selector: 'aside-help-support',
    templateUrl: './aside-help-support.component.html',
    styleUrls: [`./aside-help-support.component.scss`],
})

export class AsideHelpSupportComponent implements OnInit {
    public imgPath: string = '';
    //Event emitter to close the Aside panel
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    /* This will hold the value of current mobile apk version */
    public apkVersion: string;
    /** Version of lated mac app  */
    public macApkVersion: string;

    constructor(private store: Store<AppState>, private generalActions: GeneralActions, private authService: AuthenticationService) {

    }

    /**
     * Initialize the component
     *
     * @memberof AsideHelpSupportComponent
     */
    public ngOnInit() {
        this.getElectronAppVersion();
        this.getElectronMacAppVersion();
        this.imgPath = (isElectron||isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
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
     * @returns
     * @memberof AsideHelpSupportComponent
     */
    public scheduleNow(event): boolean {
        this.closeAsidePane(event);

        if (isElectron) {
            (window as any).require("electron").shell.openExternal('https://calendly.com/sales-accounting-software/talk-to-sale');
        } else if (isCordova) {
            window.open("https://calendly.com/sales-accounting-software/talk-to-sale", "_blank");
        } else {
            this.openScheduleCalendlyModel();
        }
        return false;
    }

    /**
     * This will open the calendly modal
     *
     * @memberof AsideHelpSupportComponent
     */
    public openScheduleCalendlyModel(): void {
        this.store.dispatch(this.generalActions.isOpenCalendlyModel(true));
    }

    /**
     * This will fetch the updated app version
     *
     * @private
     * @memberof AsideSettingComponent
     */
    private getElectronAppVersion(): void {
        this.authService.GetElectronAppVersion().subscribe((res: string) => {
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
        this.authService.GetElectronMacAppVersion().subscribe((res: string) => {
            if (res && typeof res === 'string') {
                let version = res.split('files')[0];
                let versNum = version.split(' ')[1];
                this.macApkVersion = versNum;
            }
        });
    }
}
