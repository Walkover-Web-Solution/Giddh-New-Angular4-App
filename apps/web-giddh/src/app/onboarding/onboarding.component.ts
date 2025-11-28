import { AfterViewInit, Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import { take, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { Observable, ReplaySubject } from 'rxjs';
import { GeneralActions } from '../actions/general/general.actions';
import { OnboardingComponentStore } from './utility/onboarding.store';
import { ASIDE_PANE_CONFIG, SYNC_TALLY_HELP_DOC_URL } from '../app.constant';
import { ServiceConfig } from '../services/service.config';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
    selector: 'onboarding-component',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss'],
    providers: [OnboardingComponentStore]
})

export class OnboardingComponent implements OnInit, AfterViewInit, OnDestroy {
    /** Template reference for aside menu */
    @ViewChild('asideMenuTemplate') public asideMenuTemplate: TemplateRef<any>;
    /** Reference for aside menu dialog */
    public asideMenuDialogRef: MatDialogRef<any>;
    public sideMenu: { isopen: boolean } = { isopen: true };
    public loadAPI: Promise<any>;
    public CompanySettingsObj: any = {};
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public imgPath: string = '';
    public companyCountry: string;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Account group unique name */
    public selectedGroupForCreateAcc: string = "";
    /** Holds account details */
    public accountDetails: any;
    /** Observable for create account success*/
    private createAccountIsSuccess$: Observable<boolean>;
    /** Holds true if current company country is plaid supported country */
    public isPlaidSupportedCountry: boolean;
    /** Holds true if current company country is gocardless supported country */
    public isGoCardlessSupportedCountry: boolean = false;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: number;
    /** Holds help documentation url for syncing with Tally */
    public syncWithTallyHelpDocUrl: string = "";

    constructor(
        private router: Router,
        private generalService: GeneralService,
        private store: Store<AppState>,
        @Inject(ServiceConfig) private serviceConfig,
        private settingsProfileActions: SettingsProfileActions,
        private generalActions: GeneralActions,
        private componentStore: OnboardingComponentStore,
        private dialog: MatDialog
    ) {
        this.syncWithTallyHelpDocUrl = SYNC_TALLY_HELP_DOC_URL;
        this.createAccountIsSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.imgPath = isElectron ? 'assets/images/' : (this.serviceConfig.AppUrl || AppUrl) + APP_FOLDER + 'assets/images/';

        this.store.pipe(select(s => s.session.currentCompanyCurrency), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.companyCountry = res.country;
                this.isPlaidSupportedCountry = this.generalService.checkCompanySupportPlaid(res.country);
            }
        });

        this.componentStore.companyProfile$.pipe(takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile && profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                this.isGoCardlessSupportedCountry = this.generalService.checkCompanySupportGoCardless(profile.countryV2.alpha2CountryCode);
            }
        });

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.asideMenuDialogRef?.close();
            }
        });

        this.initInventorySettingObj();
    }

    public ngAfterViewInit() {
        this.generalService.IAmLoaded.next(true);
    }

    /**
     * Opens aside menu dialog
     *
     * @memberof OnboardingComponent
     */

    public openAccountAsidePaneDialog(): void {
        this.asideMenuDialogRef = this.dialog.open(this.asideMenuTemplate, ASIDE_PANE_CONFIG);
        this.asideMenuDialogRef.afterOpened().subscribe(() => {
            this.selectedGroupForCreateAcc = "bankaccounts";
        });
    }

    public selectConfigureBank() {
        if (this.companyCountry) {
            this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/integration/payment'));
            this.router.navigate(['pages/settings/integration/payment'], { replaceUrl: true });


        } else {
            this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/integration'));
            this.router.navigate(['pages/settings/integration'], { replaceUrl: true });

        }
    }

    public scheduleNow() {
        this.store.dispatch(this.generalActions.isOpenCalendlyModel(true));
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

    public openCreateAccountAsidepan(): void {
        this.openAccountAsidePaneDialog();
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
