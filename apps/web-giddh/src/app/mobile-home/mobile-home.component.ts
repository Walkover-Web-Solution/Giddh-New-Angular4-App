import { HostListener, Inject, Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Subject, ReplaySubject, Observable } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../store';
import { GeneralService } from '../services/general.service';
import { CommandKService } from '../services/commandk.service';
import { takeUntil, debounceTime } from 'rxjs/operators';
import { remove } from '../lodash-optimized';
import { Router } from '@angular/router';
import { BACKSPACE } from '@angular/cdk/keycodes';
import { LoginActions } from '../actions/login.action';
import { AuthService } from '../theme/ng-social-login-module/index';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CommandKRequest } from '../models/api-models/Common';
import { BsDropdownConfig, BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { DOCUMENT } from '@angular/common';

@Component({
    selector: 'mobile-home',
    templateUrl: './mobile-home.component.html',
    styleUrls: ['./mobile-home.component.scss'],
    providers: [
        {
            provide: BsDropdownConfig, useValue: { insideClick: true },
        }
    ],
})

export class MobileHomeComponent implements OnInit, OnDestroy, AfterViewInit {
    /* This will hold the object of search field */
    @ViewChild('searchElement', { static: true }) public searchElement: ElementRef;
    /* This will hold the object of mobile home view element */
    @ViewChild('mobileHomeView', { static: true }) public mobileHomeView: ElementRef;

    /* This will make sure if load more is possible */
    public allowLoadMore: boolean = false;
    /* This will check if api call is in progress */
    public isLoading: boolean = false;
    /* This will store the company unique name */
    public activeCompanyUniqueName: any = '';
    /* Object to send filters to api call */
    public commandKRequestParams: CommandKRequest = {
        page: 1,
        q: '',
        group: '',
        totalPages: 1,
        isMobile: true
    };
    /* This will have list of menus/groups/accounts */
    public searchedItems: any[] = [];
    /* This will have list of searched groups */
    public listOfSelectedGroups: any[] = [];
    /* This will hold if results are available or not */
    public noResultsFound: boolean = false;
    /* This will hold if results have menus in it */
    public hasMenus: boolean = false;
    /* This will hold if results have accounts in it */
    public hasAccounts: boolean = false;
    /* This will hold if results have groups in it */
    public hasGroups: boolean = false;
    /* This will hold side nav open status */
    public sideNavOpen: boolean = false;
    /* This will hold company initials */
    public companyInitials: any = '';
    /* This will hold the search string */
    public searchString: any = "";
    /* This will hold if user logged in via social account */
    public isLoggedInWithSocialAccount$: Observable<boolean>;
    /* This will hold the image path */
    public imgPath: string = '';
    /* Observable for load more */
    public scrollSubject$: Subject<any> = new Subject();
    /* Observable for search */
    private searchSubject: Subject<string> = new Subject();
    /* Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(@Inject(DOCUMENT) document, private store: Store<AppState>, private generalService: GeneralService, private commandKService: CommandKService, private cdref: ChangeDetectorRef, private router: Router, private loginAction: LoginActions, private socialAuthService: AuthService, private breakPointObservar: BreakpointObserver) {
        document.querySelector('body').classList.add('mobile-home');
        this.isLoggedInWithSocialAccount$ = this.store.pipe(select(state => state.login.isLoggedInWithSocialAccount, takeUntil(this.destroyed$)));
    }

    /**
     * Initializes the component
     *
     * @memberof MobileHomeComponent
     */
    public ngOnInit(): void {
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (!result.matches) {
                this.router.navigate(["/pages/home"]);
            }
        });

        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        // listen on input for search
        this.searchSubject.pipe(debounceTime(300), takeUntil(this.destroyed$)).subscribe(term => {
            this.commandKRequestParams.page = 1;
            this.commandKRequestParams.q = term;
            this.searchCommandK(true);
            this.cdref.markForCheck();
        });

        this.searchSubject.next("");

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompanyUniqueName = activeCompany.uniqueName;
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

        this.scrollSubject$.pipe(debounceTime(25), takeUntil(this.destroyed$)).subscribe((response) => {
            this.onScroll(response);
        });
    }

    @HostListener('window:scroll', ['$event'])
    public onWindowScroll(event: any): void {
        if (window.pageYOffset > 100) {
            let element = document.getElementById('navbar');
            element.classList.add('sticky');
        } else {
            let element = document.getElementById('navbar');
            element.classList.remove('sticky');
        }
    }

    /**
     * This function gets called after view initializes and will set focus in search box
     *
     * @memberof MobileHomeComponent
     */
    public ngAfterViewInit(): void {
        setTimeout(() => {
            this.focusInSearchBox();
        }, 0);
    }

    /**
     * This function open mobile side bar
     *
     * @memberof MobileHomeComponent
     */
    public openMobileSidebar(): void {
        document.querySelector('body').classList.add('mobile-sidebar-open');
        // setTimeout(() => {
        this.sideNavOpen = true;
        // }, 100);
    }

    /**
     * This function close mobile side bar
     *
     * @memberof MobileHomeComponent
     */
    public closeMobileSidebar(mobileSideNav: BsDropdownDirective): void {
        if (mobileSideNav) {
            mobileSideNav.hide();
        }
        this.sideNavOpen = false;
        document.querySelector('body').classList.remove('mobile-sidebar-open');
    }

    /**
     * Releases all the observables to avoid memory leaks
     *
     * @memberof MobileHomeComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('mobile-home');
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('mobile-sidebar-open');
    }

    /**
     * This will call the command k api
     *
     * @param {boolean} resetItems
     * @returns {(void | boolean)}
     * @memberof MobileHomeComponent
     */
    public searchCommandK(resetItems: boolean): void | boolean {
        if (this.isLoading) {
            return false;
        }

        if (resetItems) {
            this.hasMenus = false;
            this.hasGroups = false;
            this.hasAccounts = false;
            this.searchedItems = [];
        }

        this.isLoading = true;

        if (this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
            let lastGroup = this.generalService.getLastElement(this.listOfSelectedGroups);
            this.commandKRequestParams.group = lastGroup.uniqueName;
        } else {
            this.commandKRequestParams.group = "";
        }

        this.commandKService.searchCommandK(this.commandKRequestParams, this.activeCompanyUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.isLoading = false;

            if (res && res.body && res.body.results && res.body.results.length > 0) {
                let length = (this.searchedItems) ? this.searchedItems.length : 0;
                res.body.results.forEach((key, index) => {
                    key.loop = length + index;
                    this.searchedItems.push(key);

                    if (key.type === "MENU") {
                        this.hasMenus = true;
                    } else if (key.type === "GROUP") {
                        this.hasGroups = true;
                    } else if (key.type === "ACCOUNT") {
                        this.hasAccounts = true;
                    }
                });
                this.noResultsFound = false;
                this.allowLoadMore = true;
                this.commandKRequestParams.totalPages = res.body.totalPages;
                this.cdref.detectChanges();
            } else {
                if (this.searchedItems.length === 0) {
                    this.noResultsFound = true;
                    this.allowLoadMore = false;
                }
                this.cdref.detectChanges();
            }
        });
    }

    /**
     * This function will remove the selected groups in decending order
     * if we press backspace in search box
     * @param {*} [item]
     * @memberof MobileHomeComponent
     */
    public removeItemFromSelectedGroups(item?: any): void {
        if (item) {
            this.listOfSelectedGroups = remove(this.listOfSelectedGroups, o => item.uniqueName !== o.uniqueName);
        } else {
            this.listOfSelectedGroups.pop();
        }
    }

    /**
     * This function puts the focus in search box
     *
     * @param {KeyboardEvent} [e]
     * @memberof MobileHomeComponent
     */
    public focusInSearchBox(e?: KeyboardEvent): void {
        if (this.searchElement) {
            this.searchElement.nativeElement.focus();
        }
    }

    /**
     * This function returns the uniquename of item
     *
     * @param {*} index
     * @param {*} item
     * @returns uniqueName
     * @memberof MobileHomeComponent
     */
    public trackByFn(index, item: any): any {
        return item.uniqueName; // unique id corresponding to the item
    }

    /**
     * This function will load more records on scroll
     *
     * @param {*} direction
     * @memberof MobileHomeComponent
     */
    public onScroll(direction: string): void {
        if (direction === "bottom" && this.allowLoadMore && !this.isLoading) {
            if (this.commandKRequestParams.page + 1 <= this.commandKRequestParams.totalPages) {
                this.commandKRequestParams.page++;
                this.searchCommandK(false);
            }
        }
    }

    /**
     * This function will init search on keyup of search box
     *
     * @param {KeyboardEvent} e
     * @param {string} term
     * @returns {void}
     * @memberof MobileHomeComponent
     */
    public initSearch(e: KeyboardEvent, term: string): void {
        term = term.trim();
        this.searchSubject.next(term);
    }

    /**
     * This function will get called if any item get selected
     *
     * @param {*} item
     * @memberof MobileHomeComponent
     */
    public itemSelected(item: any): void {
        document.querySelector('body').classList.add('add-animation');
        if (item && item.type === 'MENU') {
            item.uniqueName = item.route;

            if (item.additional && item.additional.tab) {
                if (item.uniqueName.includes('?')) {
                    item.uniqueName = item.uniqueName.split('?')[0];
                }
                this.router.navigate([item.uniqueName], {
                    queryParams: {
                        tab: item.additional.tab,
                        tabIndex: item.additional.tabIndex
                    }
                });
            } else {
                this.router.navigate([item.uniqueName]);
            }
        } else if (item.type === 'GROUP') {
            this.commandKRequestParams.q = "";
            if (!this.listOfSelectedGroups || this.listOfSelectedGroups.length === 0) {
                this.listOfSelectedGroups = [];
            }
            this.listOfSelectedGroups.push(item);
            this.searchString = "";
            this.searchElement.nativeElement.value = null;

            this.focusInSearchBox();
            this.searchCommandK(true);
        } else {
            let url = `ledger/${item.uniqueName}`;
            this.router.navigate([url]);
        }
    }

    /**
     * This will clear the search string
     *
     * @memberof MobileHomeComponent
     */
    public clearSearch(): void {
        this.searchString = "";
        this.searchElement.nativeElement.value = null;
        this.searchSubject.next("");
        this.listOfSelectedGroups = [];
    }

    /**
     * This function will get called if we remove search string or group
     *
     * @param {*} e
     * @memberof MobileHomeComponent
     */
    public handleKeydown(e: any): void {
        let key = e.which || e.keyCode;

        if (key === BACKSPACE && !this.searchElement?.nativeElement.value && this.listOfSelectedGroups && this.listOfSelectedGroups.length > 0) {
            this.removeItemFromSelectedGroups();
        }
    }

    /**
     * This is used to load more records on scroll event
     *
     * @param {*} event
     * @memberof MobileHomeComponent
     */
    public loadMoreModules(event: any): void {
        if (event.deltaY < 0) {
            this.scrollSubject$.next("top");
        } else {
            if (this.mobileHomeView?.nativeElement.offsetHeight + this.mobileHomeView?.nativeElement.scrollTop >= (this.mobileHomeView?.nativeElement.scrollHeight - 200)) {
                this.scrollSubject$.next("bottom");
            }
        }
    }

    /**
     * This is used for clearing the session of user
     *
     * @memberof MobileHomeComponent
     */
    public logout(): void {
        if (isElectron) {
            this.store.dispatch(this.loginAction.ClearSession());
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
     * This will scroll to top
     *
     * @param {HTMLElement} element
     * @memberof MobileHomeComponent
     */
    public navigate(element: HTMLElement): void {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
