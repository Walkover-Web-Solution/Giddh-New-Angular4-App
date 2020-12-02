import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WindowRef } from '../shared/helpers/window.object';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { GeneralService } from '../services/general.service';
import { take, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { StateDetailsRequest } from 'apps/web-giddh/src/app/models/api-models/Company';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';
import { ReplaySubject } from 'rxjs';
import { GeneralActions } from '../actions/general/general.actions';

@Component({
    selector: 'onboarding-component',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss']

})

export class OnboardingComponent implements OnInit, AfterViewInit {
    @ViewChild('talkSalesModal', {static: true}) public talkSalesModal: ModalDirective;
    @ViewChild('supportTab', {static: true}) public supportTab: TabsetComponent;
    public sideMenu: { isopen: boolean } = { isopen: true };
    public loadAPI: Promise<any>;
    public CompanySettingsObj: any = {};
    // public selectedPlans: CreateCompanyUsersPlan;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public imgPath: string = '';
    public companyCountry: string;

    constructor(
        private _router: Router, private _window: WindowRef, private _generalService: GeneralService,
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private companyActions: CompanyActions,
        private generalActions: GeneralActions
    ) {
        this._window.nativeWindow.superformIds = ['Jkvq'];
    }

    public ngOnInit() {
        this.imgPath =  (isElectron||isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
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
        if (isElectron) {
            (window as any).require("electron").shell.openExternal('https://calendly.com/sales-accounting-software/talk-to-sale');
        }else if (isCordova) {
            // todo: scheduleNow in cordova
        } else {
            this.openScheduleCalendlyModel();  // to show calendly block
        }
        return false;
    }

    public openScheduleModal() {
        this._generalService.invokeEvent.next("openschedulemodal");
    }

    public sidebarStatusChange(event) {
        this.sideMenu.isopen = event;
        this.store.dispatch(this.generalActions.setSideMenuBarState(event));
    }

    public closeModal() {
        this.talkSalesModal.hide();
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
    public openScheduleCalendlyModel() {
        this.store.dispatch(this.generalActions.isOpenCalendlyModel(true));
    }
}
