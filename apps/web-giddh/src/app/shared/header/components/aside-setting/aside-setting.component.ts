import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { NavigationEnd, Router } from '@angular/router';
import { AppState } from 'apps/web-giddh/src/app/store';
import { select, Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { Organization } from 'apps/web-giddh/src/app/models/api-models/Company';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { ReplaySubject } from 'rxjs';
import { LocaleService } from 'apps/web-giddh/src/app/services/locale.service';

@Component({
    selector: 'aside-setting',
    templateUrl: './aside-setting.component.html',
    styleUrls: [`./aside-setting.component.scss`],
})

export class AsideSettingComponent implements OnInit, OnDestroy {
    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

    public imgPath: string = '';
    public settingsPageTabs: any[] = [];
    public search: any = "";
    public filteredSettingsPageTabs: any[] = [];
    public isMobileScreen: boolean = true;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This holds the active locale */
    public activeLocale: string = "";
    /** True if we should show heading */
    public showSettingHeading: boolean = false;

    constructor(private breakPointObservar: BreakpointObserver, private generalService: GeneralService, private router: Router, private store: Store<AppState>, private localeService: LocaleService) {

    }

    /**
     * Initializes the component
     *
     * @memberof AsideSettingComponent
     */
    public ngOnInit(): void {
        this.breakPointObservar.observe([
            '(max-width:767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if(this.activeLocale && this.activeLocale !== response?.value) {
                this.localeService.getLocale('aside-setting', response?.value).subscribe(response => {
                    this.localeData = response;
                    this.translationComplete(true);
                });
            }
            this.activeLocale = response?.value;
        });

        this.showHideSettingsHeading(this.router.url);

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.showHideSettingsHeading(event.url);
            }
        });
    }

    /**
     * This will close the aside panel
     *
     * @param {*} [event]
     * @memberof AsideSettingComponent
     */
    public closeAsidePane(event?): void {
        this.closeAsideEvent.emit(event);
    }

    /**
     * This will navigate the user to previous page
     *
     * @memberof AsideSettingComponent
     */
    public goToPreviousPage(): void {
        if (this.generalService.getSessionStorage("previousPage") && !this.router.url.includes("/dummy")) {
            this.router.navigateByUrl(this.generalService.getSessionStorage("previousPage"));
        } else {
            this.router.navigate(['/pages/home']);
        }
    }

    /**
     * This will close the settings popup if clicked outside and is mobile screen
     *
     * @param {*} [event]
     * @memberof AsideSettingComponent
     */
    public closeAsidePaneIfMobile(event?: any): void {
        if (this.isMobileScreen && event && event.target.className !== "icon-bar") {
            this.closeAsideEvent.emit(event);
        } else if (!this.isMobileScreen && event && event.target.className !== "icon-settings-cog" && !this.router.url.includes("/pages/settings") && !this.router.url.includes("/pages/user-details") && !this.router.url.includes("/pages/invoice/preview/settings/sales")) {
            this.closeAsideEvent.emit(event);
        }
    }

    /**
     * Releases the memory
     *
     * @memberof AsideSettingComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof AsideSettingComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            let settingsPageTabs = this.localeData?.tabs;

            if (settingsPageTabs) {
                let loop = 0;
                let organizationIndex = 0;
                this.store.pipe(select(appStore => appStore.session.currentOrganizationDetails), take(1)).subscribe((organization: Organization) => {
                    if (organization) {
                        if (organization.type === OrganizationType.Branch) {
                            organizationIndex = 1;
                        } else if (organization.type === OrganizationType.Company || !organization.type) {
                            organizationIndex = 0;
                        }
                    }
                    Object.keys(settingsPageTabs[organizationIndex]).forEach(key => {
                        this.settingsPageTabs[loop] = [];
                        this.settingsPageTabs[loop] = [...settingsPageTabs[organizationIndex][key]];
                        loop++;
                    });
                });
                this.filteredSettingsPageTabs = this.settingsPageTabs;
            }
        }
    }

    /**
     * This will show/hide settings heading
     *
     * @param {string} url
     * @memberof AsideSettingComponent
     */
    public showHideSettingsHeading(url: string): void {
        if(!url.includes("/pages/settings") && !url.includes("/pages/user-details")) {
            this.showSettingHeading = true;
        } else {
            this.showSettingHeading = false;
        }
    }

    /**
     * Returns true if page url matches the navigation url
     *
     * @param {string} tabLink
     * @returns {boolean}
     * @memberof AsideSettingComponent
     */
    public isActiveLink(tabLink: string): boolean {
        if(this.router.url.includes(tabLink)) {
            return true;
        } else {
            return false;
        }
    }
}
