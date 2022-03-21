import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { ReplaySubject } from 'rxjs';
import { GeneralActions } from 'apps/web-giddh/src/app/actions/general/general.actions';
import { takeUntil, take } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector: 'hamburger-menu',
    templateUrl: './hamburger-menu.component.html',
    styleUrls: ['hamburger-menu.component.scss']
})

export class HamburgerMenuComponent implements OnInit, OnDestroy {
    @Input() public pageHeading: string = '';

    /* This will show sidebar is open */
    public sideMenu: { isopen: boolean } = { isopen: true };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True, when mobile screen size is detected */
    public isMobileView: boolean = false;

    constructor(private store: Store<AppState>, private generalActions: GeneralActions, private breakPointObservar: BreakpointObserver) {

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
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileView = result?.matches;
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

        let openMenu = false;

        if(!openSideMenu && document.getElementsByClassName("sidebar-collapse")?.length > 0) {
            openMenu = true;
        }

        this.store.dispatch(this.generalActions.openSideMenu(openSideMenu));

        if(openMenu) {
            if (this.sideMenu) {
                this.sideMenu.isopen = true;
            }
            this.store.dispatch(this.generalActions.openSideMenu(true));
        }
    }
}
