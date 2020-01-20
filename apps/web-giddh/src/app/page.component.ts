import { CompanyActions } from './actions/company.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from './store/roots';
import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
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
export class PageComponent implements AfterViewInit, OnInit, OnDestroy {
    // tslint:disable-next-line:no-empty
    public sideMenu: { isopen: boolean } = { isopen: true };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private comapnyActions: CompanyActions, private store: Store<AppState>,
        private router: Router, private activatedRoute: ActivatedRoute, private location: Location,
        private _generalService: GeneralService, private generalActions: GeneralActions) {
    }

    public ngOnInit() {
        // this.store.dispatch(this.comapnyActions.RefreshCompanies());
    }

    public ngAfterViewInit() {
        this._generalService.SetIAmLoaded(true);
        // if (this.location.path() === '/pages') {
        //   this.router.navigate(['/pages', 'home']);
        // }
    }

    public sidebarStatusChange(event) {

        this.sideMenu.isopen = event;
        this.store.dispatch(this.generalActions.setSideMenuBarState(event));
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
