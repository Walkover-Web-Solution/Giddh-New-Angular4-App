import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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
    /* This will hold the email of user */
    public userEmail: any;

    constructor(private store: Store<AppState>, private loginAction: LoginActions, private socialAuthService: AuthService, private generalService: GeneralService) {

    }

    /**
     * Initializes the component
     *
     * @memberof MobileHomeSidebarComponent
     */
    public ngOnInit(): void {
        this.store.pipe(select(state => state.company && state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if(activeCompany) {
                this.selectedCompany = cloneDeep(activeCompany);
                let selectedCompanyArray = activeCompany.name.split(" ");
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
        });

        this.store.pipe(select((state: AppState) => state.session.user), takeUntil(this.destroyed$)).subscribe(user => {
            if(user && user.user && user.user.email) {
                this.userEmail = user.user.email;
            }
        });

        this.isLoggedInWithSocialAccount$ = this.store.pipe(select(state => state.login.isLoggedInWithSocialAccount), takeUntil(this.destroyed$));
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
    public logout(): void {
        this.closeMobileSidebar.emit(true);
        if (isElectron) {
            this.store.dispatch(this.loginAction.ClearSession());
        } else if (isCordova) {
            (window as any).plugins.googleplus.logout(
                (success) => {
                    this.store.dispatch(this.loginAction.ClearSession());
                },
                (error) => {
                    this.store.dispatch(this.loginAction.ClearSession());
                }
            );
        } else {
            // check if logged in via social accounts
            this.isLoggedInWithSocialAccount$.subscribe((val) => {
                if (val) {
                    this.socialAuthService.signOut().then(() => {
                        this.store.dispatch(this.loginAction.ClearSession());
                        this.store.dispatch(this.loginAction.socialLogoutAttempt());
                    }).catch((err) => {
                        this.store.dispatch(this.loginAction.ClearSession());
                        this.store.dispatch(this.loginAction.socialLogoutAttempt());
                    });
                } else {
                    this.store.dispatch(this.loginAction.ClearSession());
                }
            });
        }
    }

    /**
     * Close nav on click
     *
     * @memberof MobileHomeSidebarComponent
     */
    public closeModel(): void {
        setTimeout(() => {
            this.closeMobileSidebar.emit(true);
        }, 50);
    }
}
