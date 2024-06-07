import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from '../services/general.service';
import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { SettingsProfileActions } from '../actions/settings/profile/settings.profile.action';
import { Observable, ReplaySubject } from 'rxjs';
import { GeneralActions } from '../actions/general/general.actions';
import { animate, state, style, transition, trigger } from '@angular/animations';


@Component({
    selector: 'onboarding-component',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss'],
    animations: [
        trigger("slideInOut", [
            state("in", style({
                transform: "translate3d(0, 0, 0)",
            })),
            state("out", style({
                transform: "translate3d(100%, 0, 0)",
            })),
            transition("in => out", animate("400ms ease-in-out")),
            transition("out => in", animate("400ms ease-in-out")),
        ]),
    ],
})

export class OnboardingComponent implements OnInit, AfterViewInit, OnDestroy {
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
    /** Account update modal state */
    public accountAsideMenuState: string = "out";
    /** Account group unique name */
    public selectedGroupForCreateAcc: string = "";
    /** Holds account details */
    public accountDetails: any;
    /** Observable for create account success*/
    private createAccountIsSuccess$: Observable<boolean>;
    /** Holds true if current company country is plaid supported country */
    public isPlaidSupportedCountry: boolean;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2 = 2;

    constructor(
        private _router: Router, private _generalService: GeneralService,
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private generalActions: GeneralActions
    ) {
        this.createAccountIsSuccess$ = this.store.pipe(select(state => state.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.voucherApiVersion = this._generalService.voucherApiVersion;
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.store.pipe(select(s => s.session.currentCompanyCurrency), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.companyCountry = res.country;
                this.isPlaidSupportedCountry = this._generalService.checkCompanySupportPlaid(res.country);
            }
        });

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (this.accountAsideMenuState === "in") {
                    this.toggleAccountAsidePane();
                }
            }
        });

        this.initInventorySettingObj();
    }

    public ngAfterViewInit() {
        this._generalService.IAmLoaded.next(true);
    }

    /**
    * Toggle's fixed class in body
    *
    * @memberof OnboardingComponent
    */
    public toggleBodyClass() {
        if (this.accountAsideMenuState === "in") {
            document.querySelector("body").classList.add("fixed");
        } else {
            document.querySelector("body").classList.remove("fixed");
        }
    }

    /**
     * Toggle's account update modal
     *
     * @memberof OnboardingComponent
     */

    public toggleAccountAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === "out" ? "in" : "out";
        this.selectedGroupForCreateAcc = "bankaccounts";
        this.toggleBodyClass();
    }

    public selectConfigureBank() {
        if (this.companyCountry) {
            this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/integration/payment'));
            this._router.navigate(['pages/settings/integration/payment'], { replaceUrl: true });


        } else {
            this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/integration'));
            this._router.navigate(['pages/settings/integration'], { replaceUrl: true });

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
        this.toggleAccountAsidePane();
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
