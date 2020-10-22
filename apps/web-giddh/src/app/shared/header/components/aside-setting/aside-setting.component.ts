import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { settingsPageTabs } from "../../../helpers/pageTabs";
import { Location } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { Router } from '@angular/router';
import { AppState } from 'apps/web-giddh/src/app/store';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { Organization } from 'apps/web-giddh/src/app/models/api-models/Company';
import { OrganizationType } from 'apps/web-giddh/src/app/models/user-login-state';

@Component({
    selector: 'aside-setting',
    templateUrl: './aside-setting.component.html',
    styleUrls: [`./aside-setting.component.scss`],
})

export class AsideSettingComponent implements OnInit {
    /* Event emitter for close sidebar popup event */
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChild('searchField', {static: true}) public searchField: ElementRef;

    public imgPath: string = '';
    public settingsPageTabs: any[] = [];
    public search: any = "";
    public filteredSettingsPageTabs: any[] = [];
    public isMobileScreen: boolean = true;

    constructor(private location: Location, private breakPointObservar: BreakpointObserver, private generalService: GeneralService, private router: Router, private store: Store<AppState>) {

    }

    /**
     * Initializes the component
     *
     * @memberof AsideSettingComponent
     */
    public ngOnInit(): void {
        this.breakPointObservar.observe([
            '(max-width:767px)'
        ]).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        if (settingsPageTabs) {
            let loop = 0;
            let organizationIndex = 0;
            this.store.pipe(select(appStore => appStore.session.currentOrganizationDetails), take(1)).subscribe((organization: Organization) => {
                if (organization.type === OrganizationType.Branch) {
                    organizationIndex = 1;
                } else if (organization.type === OrganizationType.Company) {
                    organizationIndex = 0;
                }
                Object.keys(settingsPageTabs[organizationIndex]).forEach(key => {
                    this.settingsPageTabs[loop] = [];
                    this.settingsPageTabs[loop] = [...settingsPageTabs[organizationIndex][key]];
                    loop++;
                });
            });
            this.filteredSettingsPageTabs = this.settingsPageTabs;
        }

        this.searchField.nativeElement.focus();
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
     * This will search from the available menu items
     *
     * @param {*} search
     * @memberof AsideSettingComponent
     */
    public searchMenu(search: any): void {
        this.filteredSettingsPageTabs = [];

        if (search && search.trim()) {
            let loop = 0;
            this.settingsPageTabs.forEach((section) => {
                section.forEach(tab => {
                    if (tab.label.toLowerCase().includes(search.trim().toLowerCase())) {
                        if (this.filteredSettingsPageTabs[loop] === undefined) {
                            this.filteredSettingsPageTabs[loop] = [];
                        }

                        this.filteredSettingsPageTabs[loop].push(tab);
                    }
                });
                loop++;
            });
        } else {
            this.filteredSettingsPageTabs = this.settingsPageTabs;
        }
    }

    /**
     * This will navigate the user to previous page
     *
     * @memberof AsideSettingComponent
     */
    public goToPreviousPage(): void {
        if(this.generalService.getSessionStorage("previousPage")) {
            this.router.navigateByUrl(this.generalService.getSessionStorage("previousPage"));
        } else {
            this.location.back();
        }
    }

    /**
     * This will close the settings popup if clicked outside and is mobile screen
     *
     * @param {*} [event]
     * @memberof AsideSettingComponent
     */
    public closeAsidePaneIfMobile(event?): void {
        if(this.isMobileScreen && event && event.target.className !== "icon-bar") {
            this.closeAsideEvent.emit(event);
        }
    }
}
