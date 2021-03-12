import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
@Component({
    selector: 'primary-sidebar',
    templateUrl: './primary-sidebar.component.html',
    styleUrls: ['./primary-sidebar.component.scss'],

})

export class PrimarySidebarComponent implements OnInit {

    /* This will show sidebar is open */
    public sideMenu: { isopen: boolean } = { isopen: true };
    constructor(private store: Store<AppState>, private generalActions: GeneralActions) {

    }
    public ngOnInit(): void {


    }
    /**
     * This will toggle the side menu
     *
     * @param {boolean} openSideMenu
     * @memberof HamburgerMenuComponent
     */
    public sideBarStateChange(openSideMenu: boolean): void {
        if (this.sideMenu) {
            this.sideMenu.isopen = openSideMenu;
        }
        this.store.dispatch(this.generalActions.openSideMenu(openSideMenu));
    }
}
