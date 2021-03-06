import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import { take, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';
import { ReplaySubject } from 'rxjs';
import { GeneralActions } from '../actions/general/general.actions';
import { SUPPORT_TEAM_NUMBERS } from '../app.constant';

@Component({
    selector: 'onboarding-component',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss']
})

export class OnboardingComponent implements OnInit, AfterViewInit, OnDestroy {
    public sideMenu: { isopen: boolean } = { isopen: true };
    public loadAPI: Promise<any>;
    public CompanySettingsObj: any = {};
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public imgPath: string = '';
    public companyCountry: string;
    /** This will hold displayed support team number */
    public supportTeamNumber: any = [];
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private _router: Router, private _generalService: GeneralService,
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private companyActions: CompanyActions,
        private generalActions: GeneralActions
    ) {
        
    }

    public ngOnInit() {
        this.supportTeamNumber = SUPPORT_TEAM_NUMBERS[Math.floor(Math.random() * SUPPORT_TEAM_NUMBERS.length)];
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = 'pages/onboarding';
        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));

        this.store.pipe(select(s => s.session.currentCompanyCurrency), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.companyCountry = res.country;
            }
        });

        this.initInventorySettingObj();
    }

    public ngAfterViewInit() {
        this._generalService.IAmLoaded.next(true);
    }

    public selectConfigureBank() {
        if (this.companyCountry) {
            if (this.companyCountry.toLowerCase() === 'india') {
                this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/integration/payment'));
                this._router.navigate(['pages/settings/integration/payment'], { replaceUrl: true });
            } else {
                this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/integration/email'));
                this._router.navigate(['pages/settings/integration/email'], { replaceUrl: true });
            }

        } else {
            this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/integration'));
            this._router.navigate(['pages/settings/integration'], { replaceUrl: true });

        }
    }

    public scheduleNow() {
        if (window['SOE'] !== undefined) {
            window['SOE'].prototype.toggleLightBox('giddhbooks');
        }
    }

    public sidebarStatusChange(event) {
        this.sideMenu.isopen = event;
        this.store.dispatch(this.generalActions.setSideMenuBarState(event));
    }

    public initInventorySettingObj() {
        this.store.dispatch(this.settingsProfileActions.GetInventoryInfo());
        this.store.pipe(select(p => p.settings.inventory), takeUntil(this.destroyed$)).subscribe((o) => {
            if (o.profileRequest || 1 === 1) {
                let inventorySetting = _.cloneDeep(o);
                this.CompanySettingsObj = inventorySetting;
            }
        });
    }

    public updateInventorySetting(data) {
        let dataToSaveNew = _.cloneDeep(this.CompanySettingsObj);
        dataToSaveNew.companyInventorySettings = { manageInventory: data };
        this.store.dispatch(this.settingsProfileActions.UpdateInventory(dataToSaveNew));
    }

    /**
     * Releases memory
     *
     * @memberof OnboardingComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
