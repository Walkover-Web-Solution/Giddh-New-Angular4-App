import { AfterViewInit, Component } from '@angular/core';
import { GeneralService } from '../services/general.service';
import { GeneralActions } from '../actions/general/general.actions';
import { AppState } from '../store';
import { Store } from '@ngrx/store';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'page',
    template: `
    <div id="main" [ngClass]="{'subscription-page': isSubscriptionPage}">
      <giddh-loader></giddh-loader>
      <app-header (menuStateChange)="sidebarStatusChange($event)"></app-header>
      <layout-main [sideMenu]="sideMenu">
        <router-outlet></router-outlet>
      </layout-main>
    </div>`
})

export class PageComponent implements AfterViewInit {
    public sideMenu: { isopen: boolean } = { isopen: true };
    /**True if it is subscription page */
    public isSubscriptionPage: boolean = false;

    constructor(
        private store: Store<AppState>,
        private generalService: GeneralService,
        private generalActions: GeneralActions,
        private router: Router
    ) {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (this.router.url.includes("/pages/subscription")) {
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

    public sidebarStatusChange(event) {
        this.sideMenu.isopen = event;
        this.store.dispatch(this.generalActions.setSideMenuBarState(event));
    }
}
