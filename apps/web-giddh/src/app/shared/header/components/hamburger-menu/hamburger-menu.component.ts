import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ReplaySubject } from 'rxjs';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'hamburger-menu',
    templateUrl: './hamburger-menu.component.html',
    styleUrls: ['hamburger-menu.component.scss']
})

export class HamburgerMenuComponent implements OnInit, OnDestroy {
    /* This inputs the heading which is needed to show */
    @Input() public pageHeading: string = '';

    /* This will show sidebar is open */
    public sideMenu: { isopen: boolean } = { isopen: true };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private generalActions: GeneralActions) {

    }

    /**
     * Initializes the component
     *
     * @memberof HamburgerMenuComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.general.openSideMenu), takeUntil(this.destroyed$)).subscribe(response => {
            this.sideMenu.isopen = response;
        });
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
