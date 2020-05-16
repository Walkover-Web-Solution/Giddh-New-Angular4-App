import { Component, EventEmitter, OnInit, Output, ViewChild, ElementRef } from '@angular/core';
import { settingsPageTabs } from "../../../helpers/pageTabs";
import { Location } from '@angular/common';

@Component({
    selector: 'aside-setting',
    templateUrl: './aside-setting.component.html',
    styleUrls: [`./aside-setting.component.scss`],
})

export class AsideSettingComponent implements OnInit {
    @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChild('searchField') public searchField: ElementRef;

    public imgPath: string = '';
    public settingsPageTabs: any[] = [];
    public search: any = "";
    public filteredSettingsPageTabs: any[] = [];

    constructor(private location: Location) {

    }

    /**
     * Initializes the component
     *
     * @memberof AsideSettingComponent
     */
    public ngOnInit(): void {
        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        if (settingsPageTabs) {
            let loop = 0;
            Object.keys(settingsPageTabs[0]).forEach(key => {
                this.settingsPageTabs[loop] = [];
                this.settingsPageTabs[loop] = settingsPageTabs[0][key];
                loop++;
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

        if(search && search.trim()) {
            let loop = 0;
            this.settingsPageTabs.forEach((section) => {
                section.forEach(tab => {
                    if(tab.label.toLowerCase().includes(search.trim().toLowerCase())) {
                        if(this.filteredSettingsPageTabs[loop] === undefined) {
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
        this.location.back();
    }
}