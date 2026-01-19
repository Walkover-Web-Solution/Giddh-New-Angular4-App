import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { GeneralActions } from '../actions/general/general.actions';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { includes } from '../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'page',
    standalone:false,
    template: `
    <div id="main" [ngClass]="{'subscription-page': isSubscriptionPage}">
      <giddh-loader></giddh-loader>
      <app-header (menuStateChange)="sidebarStatusChange($event)"></app-header>
      <layout-main [sideMenu]="sideMenu">
        <router-outlet></router-outlet>
      </layout-main>
    </div>`
})

/**
 * PageComponent component
 * Handles page functionality and user interactions
 */
export class PageComponent implements AfterViewInit, OnDestroy {
    public sideMenu: { isopen: boolean } = { isopen: true };
    /**True if it is subscription page */
    public isSubscriptionPage: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService,
        private generalActions: GeneralActions,
        private router: Router
    ) {
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            /**
             * Handles if functionality
             */
            if (event instanceof NavigationEnd) {
                /**
                 * Handles if functionality
                 */
                if (this.router.url.includes("/pages/user-details/subscription")) {
                    this.isSubscriptionPage = true;
                } else {
                    this.isSubscriptionPage = false;
                }
            }
        });
    }

    /**
     * Handles ngAfterViewInit functionality
     */
    public ngAfterViewInit() {
        this.generalService.SetIAmLoaded(true);
    }

    /**
     * Handles ngOnDestroy functionality
     */
    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Handles sidebarStatusChange functionality
     */
    public sidebarStatusChange(event: boolean) {
        this.sideMenu.isopen = event;
        this.store.dispatch(this.generalActions.setSideMenuBarState(event));
    }
}
