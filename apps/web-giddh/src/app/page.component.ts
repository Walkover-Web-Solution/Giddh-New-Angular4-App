import { AppState } from './store/roots';
import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { GeneralService } from './services/general.service';
import { GeneralActions } from './actions/general/general.actions';

@Component({
    selector: 'page',
    template: `
    <div id="main">
      <giddh-loader></giddh-loader>
      <app-header (menuStateChange)="sidebarStatusChange($event)"></app-header>
      <layout-main [sideMenu]="sideMenu">
        <router-outlet ></router-outlet>
      </layout-main>
    </div>`
})

export class PageComponent implements AfterViewInit {
    public sideMenu: { isopen: boolean } = { isopen: true };

    constructor(private store: Store<AppState>, private _generalService: GeneralService, private generalActions: GeneralActions) {

    }

    public ngAfterViewInit() {
        this._generalService.SetIAmLoaded(true);
    }

    public sidebarStatusChange(event) {
        this.sideMenu.isopen = event;
        this.store.dispatch(this.generalActions.setSideMenuBarState(event));
    }
}
