import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ReplaySubject } from 'rxjs';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';

@Component({
    selector: 'hamburger-menu',
    templateUrl: './hamburger-menu.component.html',
    styleUrls: ['hamburger-menu.component.scss']
})

export class HamburgerMenuComponent implements OnInit, OnDestroy {
    @Input() public pageHeading: string = '';

    public sideMenu: { isopen: boolean } = { isopen: false };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private generalActions: GeneralActions) {

    }

    /**
     * Initializes the component
     *
     * @memberof HamburgerMenuComponent
     */
    public ngOnInit(): void {
        this.sideBarStateChange(true);
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof HamburgerMenuComponent
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
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