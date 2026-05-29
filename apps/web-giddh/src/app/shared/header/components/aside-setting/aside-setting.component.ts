import { Component, EventEmitter, OnInit, Output, OnDestroy, Inject, HostListener, ChangeDetectorRef, NgZone } from '@angular/core';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { AppState } from 'apps/web-giddh/src/app/store';
import { select, Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyResponse, Organization } from 'apps/web-giddh/src/app/models/api-models/Company';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';
import { Observable, ReplaySubject } from 'rxjs';
import { LocaleService } from 'apps/web-giddh/src/app/services/locale.service';
import { ServiceConfig } from 'apps/web-giddh/src/app/services/service.config';

/** Settings tab links that are only available on Giddh-owned domains */
const GIDDH_DOMAIN_ONLY_SETTINGS_LINKS: readonly string[] = [
    '/pages/settings/tally',
    '/pages/settings/shopify'
];

@Component({
    selector: 'aside-setting',
    templateUrl: './aside-setting.component.html',
    styleUrls: [`./aside-setting.component.scss`],
    standalone: false
})

export class AsideSettingComponent implements OnInit, OnDestroy {
    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    public imgPath: string = '';
    public settingsPageTabs: any[] = [];
    public search: any = "";
    public filteredSettingsPageTabs: any[] = [];
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
    /** This contains router url */
    public routerUrl: string = "";
    /** Hold selected active company */
    public selectedCompany: CompanyResponse = null;
    /** Hold true if tag menu is open */
    public isTagMenuOpened: boolean = false;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Holds array of company uniqueNames which ICICI allowed companies */
    public iciciAllowedCompanies: any[] = [];
    /** Holds true if current company country is plaid supported country */
    public isPlaidSupportedCountry: boolean;
    /** Holds true if current company country is gocardless supported country */
    public isGocardlessSupportedCountry: boolean;
    /** True if we should set language */
    public setLanguage: boolean = false;
    /** True if current organization is company */
    public isCompany: boolean = false;
    /** Observable for branch list */
    public branchList$: Observable<any>;

    constructor(@Inject(ServiceConfig) private serviceConfig, private generalService: GeneralService, private router: Router, private store: Store<AppState>, private localeService: LocaleService, private changeDetectorRef: ChangeDetectorRef, private ngZone: NgZone) {
    }

    /**
     * Initializes the component
     *
     * @memberof AsideSettingComponent
     */
    public ngOnInit(): void {
        this.iciciAllowedCompanies = this.serviceConfig.ICICI_SUPPORTED_COMPANIES;
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
        this.imgPath = this.serviceConfig.IMG_PATH;

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if (this.activeLocale && this.activeLocale !== response?.value) {
                this.setLanguage = true;
                this.localeService.getLocale('aside-setting', response?.value).subscribe(response => {
                    this.localeData = response;
                    this.translationComplete(true);
                });
            }
            this.activeLocale = response?.value;
        });

        this.store.select(state => state.settings.branches).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch && response?.length > 1;
            }
        });

        this.store.pipe(select(prof => prof.settings.profile), takeUntil(this.destroyed$)).subscribe((profile) => {
            if (profile && profile.countryV2 && profile.countryV2.alpha2CountryCode) {
                this.isGocardlessSupportedCountry = this.generalService.checkCompanySupportGoCardless(profile.countryV2.alpha2CountryCode);
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && this.localeData && !this.setLanguage) {
                this.selectedCompany = activeCompany;
                this.translationComplete(true);
            }
        });

        this.showHideSettingsHeading(this.router.url);

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if ((!isElectron && event instanceof NavigationEnd) || (isElectron && (event instanceof NavigationStart || event instanceof NavigationEnd))) {
                this.showHideSettingsHeading(event.url);
                this.routerUrl = event.url?.split('?')[0];
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
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        setTimeout(() => {
            this.closeAsideEvent.emit(true);
        }, 0);
    }

    /**
     * Handles navigation and ensures aside panel closes immediately
     *
     * @param {*} event
     * @param {string} link
     * @memberof AsideSettingComponent
     */
    public handleNavigation(event: any, link: string): void {
        // Prevent event bubbling and default behavior
        if (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }

        // Immediately close the aside panel
        this.closeAsideEvent.emit(true);

        // Navigate immediately without delay
        this.router.navigate([link]);
    }

    /**
     * HostListener to handle clicks on navigation items
     *
     * @param {*} event
     * @memberof AsideSettingComponent
     */
    @HostListener('click', ['$event'])
    public onHostClick(event: any): void {
        // Handle regular navigation items with data-link attribute
        const navigationTarget = event.target.closest('.navigation-item');
        if (navigationTarget && navigationTarget.dataset.link) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            // Immediately close the aside panel
            this.closeAsideEvent.emit(true);

            // Navigate within NgZone to ensure proper change detection
            this.ngZone.run(() => {
                this.router.navigate([navigationTarget.dataset.link]).then(() => {
                    // Force change detection after navigation completes
                    setTimeout(() => {
                        this.changeDetectorRef.detectChanges();
                    }, 50);
                });
            });
            return;
        }

        // Don't interfere with mat-menu triggers (tags menu)
        if (event.target.closest('[matMenuTriggerFor]')) {
            return;
        }
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
        if (event?.target?.className !== "icon-settings-cog" && !this.router.url.includes("/pages/settings") && !this.router.url.includes("/pages/invoice/preview/settings/sales") && !this.router.url.includes("/pages/vouchers/preview/sales/settings")) {
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
                        } else if ((organization.type === OrganizationType.Company || this.isConsolidatedBranch) || !organization.type) {
                            organizationIndex = 0;
                        }
                    }
                    const isGiddhDomain = this.generalService.isGiddhDomain();
                    Object.keys(settingsPageTabs[organizationIndex]).forEach(key => {
                        this.settingsPageTabs[loop] = [];
                        const items = [...settingsPageTabs[organizationIndex][key]];
                        this.settingsPageTabs[loop] = isGiddhDomain
                            ? items
                            : items.filter((item: any) => !GIDDH_DOMAIN_ONLY_SETTINGS_LINKS.includes(item?.link));
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
        if (!url.includes("/pages/settings")) {
            this.showSettingHeading = true;
        } else {
            this.showSettingHeading = false;
        }
    }

    /**
     * This will add/remove class tag menu
     *
     * @param {boolean} menuStatus
     * @memberof AsideSettingComponent
     */
    public toggleTagMenu(menuStatus: boolean): void {
        this.isTagMenuOpened = menuStatus;
        if (menuStatus) {
            document.querySelector("body")?.classList?.add("tags-menu-open");
        } else {
            setTimeout(() => {
                document.querySelector("body")?.classList?.remove("tags-menu-open");
            }, 500);
        }
    }
}
