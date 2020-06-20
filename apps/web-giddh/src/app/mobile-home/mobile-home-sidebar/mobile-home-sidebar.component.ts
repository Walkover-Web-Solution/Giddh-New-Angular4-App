import { Component, OnInit, NgModule, OnDestroy, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { ReplaySubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralService } from '../../services/general.service';
import { CompanyResponse } from '../../models/api-models/Company';
import { cloneDeep } from '../../lodash-optimized';
import { LoginActions } from '../../actions/login.action';
import { AuthService } from '../../theme/ng-social-login-module/index';

@Component({
    selector: 'mobile-home-sidebar',
    templateUrl: './mobile-home-sidebar.component.html',
    styleUrls: ['./mobile-home-sidebar.component.scss']
})
export class MobileHomeSidebarComponent implements OnInit, OnDestroy {

    /* This will close sidebar */
    @Output() public closeMobileSidebar: EventEmitter<boolean> = new EventEmitter();
    /* This will hold selected company */
    public selectedCompany: CompanyResponse = null;
    /* This will hold company initials */
    public companyInitials: any = '';
    /* Observe logged in status of social account login */
    public isLoggedInWithSocialAccount$: Observable<boolean>;
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private _store: Store<AppState>,
        private _loginAction: LoginActions,
        private _socialAuthService: AuthService,
        private _generalService: GeneralService
    ) { }

    public ngOnInit() {
        this._store.pipe(
            select((state: AppState) => state.session.companies),
            takeUntil(this.destroyed$)
        ).subscribe(companies => {
            if (companies) {
                let selectedCmp = companies.find(cmp => {
                    if (cmp && cmp.uniqueName) {
                        return cmp.uniqueName === this._generalService.companyUniqueName;
                    } else {
                        return false;
                    }
                });

                if (selectedCmp) {
                    this.selectedCompany = cloneDeep(selectedCmp);
                    let selectedCompanyArray = selectedCmp.name.split(" ");
                    let companyInitials = [];
                    for (let loop = 0; loop < selectedCompanyArray.length; loop++) {
                        if (loop <= 1) {
                            companyInitials.push(selectedCompanyArray[loop][0]);
                        } else {
                            break;
                        }
                    }
                    this.companyInitials = companyInitials.join(" ");
                }
            }
        });

        this.isLoggedInWithSocialAccount$ = this._store.select(state => state.login.isLoggedInWithSocialAccount).pipe(takeUntil(this.destroyed$));
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof MobileHomeSidebarComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('mobile-sidebar-open');
    }

    /**
     * Logged out user
     *
     * @memberof MobileHomeSidebarComponent
     */
    public logout() {
        if (isElectron) {
            this._store.dispatch(this._loginAction.ClearSession());
        } else if (isCordova) {
            (window as any).plugins.googleplus.logout(
                (msg) => {
                    this._store.dispatch(this._loginAction.ClearSession());
                }
            );
        } else {
            // check if logged in via social accounts
            this.isLoggedInWithSocialAccount$.subscribe((val) => {
                if (val) {
                    this._socialAuthService.signOut().then(() => {
                        this._store.dispatch(this._loginAction.ClearSession());
                        this._store.dispatch(this._loginAction.socialLogoutAttempt());
                    }).catch((err) => {
                        this._store.dispatch(this._loginAction.ClearSession());
                        this._store.dispatch(this._loginAction.socialLogoutAttempt());
                    });
                } else {
                    this._store.dispatch(this._loginAction.ClearSession());
                }
            });
        }
    }
}
