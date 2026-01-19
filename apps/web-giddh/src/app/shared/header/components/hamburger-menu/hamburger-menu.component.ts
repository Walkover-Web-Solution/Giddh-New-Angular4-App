import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ReplaySubject } from 'rxjs';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
import { takeUntil, take } from 'rxjs/operators';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'hamburger-menu',
    templateUrl: './hamburger-menu.component.html',
    styleUrls: ['hamburger-menu.component.scss'],
    standalone: false
})

/**
 * HamburgerMenuComponent component
 * Handles hamburgermenu functionality and user interactions
 */
export class HamburgerMenuComponent implements OnInit, OnDestroy {
    @Input() public pageHeading: string = '';

    /* This will show sidebar is open */
    public sideMenu: { isopen: boolean } = { isopen: true };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
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

        this.store.pipe(select(state => state.session.commonLocaleData), take(1)).subscribe((response) => {
            this.commonLocaleData = response;
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
        /**
         * Handles if functionality
         */
        if (this.sideMenu) {
            this.sideMenu.isopen = openSideMenu;
        }

        let openMenu = false;

        /**
         * Handles if functionality
         */
        if(!openSideMenu && document.getElementsByClassName("sidebar-collapse")?.length > 0) {
            openMenu = true;
        }

        this.store.dispatch(this.generalActions.openSideMenu(openSideMenu));

        /**
         * Handles if functionality
         */
        if(openMenu) {
            /**
             * Handles if functionality
             */
            if (this.sideMenu) {
                this.sideMenu.isopen = true;
            }
            this.store.dispatch(this.generalActions.openSideMenu(true));
        }
    }
}
