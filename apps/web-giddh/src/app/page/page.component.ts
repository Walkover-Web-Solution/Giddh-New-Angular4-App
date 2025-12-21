import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { GeneralActions } from '../actions/general/general.actions';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { includes } from '../lodash-optimized';

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

export class PageComponent implements AfterViewInit, OnDestroy {
    public sideMenu: { isopen: boolean } = { isopen: true };
    /**True if it is subscription page */
    public isSubscriptionPage: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;

    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService,
        private generalActions: GeneralActions,
        private router: Router
    ) {
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.router.url.includes("/pages/user-details/subscription")) {
                    this.isSubscriptionPage = true;
                } else {
                    this.isSubscriptionPage = false;
                }
            }
        });
    }

    public ngAfterViewInit() {
        this.generalService.SetIAmLoaded(true);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public sidebarStatusChange(event: boolean) {
        this.sideMenu.isopen = event;
        this.store.dispatch(this.generalActions.setSideMenuBarState(event));
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
