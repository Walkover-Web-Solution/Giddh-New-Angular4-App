import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    SimpleChanges,
    TemplateRef,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { NavigationEnd, NavigationStart, RouteConfigLoadEnd, Router } from '@angular/router';
import { createSelector, select, Store } from '@ngrx/store';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, of as observableOf, ReplaySubject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CompanyActions } from '../../actions/company.actions';
import { GeneralActions } from '../../actions/general/general.actions';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { LoginActions } from '../../actions/login.action';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { clone, cloneDeep, find, slice } from '../../lodash-optimized';
import { AccountResponse } from '../../models/api-models/Account';
import { ActiveFinancialYear, CompanyResponse, Organization, OrganizationDetails } from '../../models/api-models/Company';
import { UserDetails } from '../../models/api-models/loginModels';
import { CompAidataModel } from '../../models/db';
import { DEFAULT_AC, DEFAULT_MENUS, NAVIGATION_ITEM_LIST } from '../../models/defaultMenus';
import { ICompAidata, IUlist } from '../../models/interfaces/ulist.interface';
import { OrganizationType } from '../../models/user-login-state';
import { CompanyService } from '../../services/companyService.service';
import { DbService } from '../../services/db.service';
import { GeneralService } from '../../services/general.service';
import { LocaleService } from '../../services/locale.service';
import { AppState } from '../../store';
import { AuthService } from '../../theme/ng-social-login-module';
import { AllItem, AllItems } from '../helpers/allItems';

@Component({
    selector: 'primary-sidebar',
    templateUrl: './primary-sidebar.component.html',
    styleUrls: ['./primary-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrimarySidebarComponent implements OnInit, OnChanges, OnDestroy {
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** update IndexDb flags observable **/
    public updateIndexDbSuccess$: Observable<boolean>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Search query to search branch */
    public searchBranchQuery: string;
    /** Stores the active ledger account details */
    public activeAccount$: Observable<AccountResponse>;
    /* This will show sidebar is open */
    /** Stores the active company details */
    public selectedCompanyDetails: CompanyResponse;
    /** Current organization type */
    public currentOrganizationType: OrganizationType;

    /** store current selected company */
    public selectedCompany: Observable<CompanyResponse>;
    /** Stores the current financial year data */
    public activeFinancialYear: ActiveFinancialYear;

    /** Stores the details of the current branch */
    public currentBranch: any;
    /** Avatar image */
    public userAvatar: string;
    /** True if CMD+K modal is opened */
    public navigationModalVisible: boolean = false;
    /** True if mobile screen size */
    public isMobileSite: boolean;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Active company details for indexedDB */
    private activeCompanyForDb: ICompAidata;
    /** Stores the navigation modal event subscriptions */
    private subscriptions: Subscription[] = [];
    /** Modal instance */
    public modelRef: BsModalRef;
    /** Current ledger name */
    public selectedLedgerName: string;
    /** True, if ledger account is selected */
    public isLedgerAccSelected: boolean = false;
    /** Holds the navigated accounts */
    public accountItemsFromIndexDB: any[] = DEFAULT_AC;
    /** Stores the list of menu and accounts navigated */
    private smartCombinedList$: Observable<any>;
    /** Company name initials (upto 2 characters) */
    public companyInitials: any = '';
    /** Branch alias/name initials (upto 2 characters) */
    public branchInitials: any = '';
    /** Stores the list of all the companies for a user */
    public companies$: Observable<CompanyResponse[]>;
    /** Stores filtered list of companies */
    public companyListForFilter: CompanyResponse[] = [];
    /** True, if login is made with social account */
    public isLoggedInWithSocialAccount$: Observable<boolean>;
    /** User name of logged in user */
    public userName: string;
    /** User email of logged in user */
    public userEmail: string;
    /** User full name of logged in user */
    public userFullName: string;
    /** User details of logged in user */
    public user$: Observable<UserDetails>;
    /** Stores the hovered index for company in company switch dropdown */
    public hoveredIndx: number;
    /** Stores the total company list */
    public companyList: CompanyResponse[] = [];
    /** Stores all the menu items to be shown */
    public allItems: AllItems[] = [];
    /** True, if sidebar needs to be shown */
    @Input() public isOpen: boolean = false;
    /** API menu items, required to show permissible items only in the menu */
    @Input() public apiMenuItems: Array<any> = [];
    /** Event to carry out new company onboarding */
    @Output() public newCompany: EventEmitter<void> = new EventEmitter();
    /** Stores the instance of branch dropdown */
    @ViewChild('subBranchDropdown', { static: false }) public subBranchDropdown: BsDropdownDirective;
    /** Stores the instance of CMD+K dropdown */
    @ViewChild('navigationModal', { static: true }) public navigationModal: TemplateRef<any>; // CMD + K
    /** Stores the instance of company detail dropdown */
    @ViewChild('companyDetailsDropDownWeb', { static: true }) public companyDetailsDropDownWeb: BsDropdownDirective;
    /** Stores the dropdown instances as querylist */
    @ViewChildren('dropdown') itemDropdown: QueryList<BsDropdownDirective>;
    /** Search company name */
    public searchCmp: string = '';
    /** Holds if company refresh is in progress */
    public isCompanyRefreshInProcess$: Observable<boolean>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This holds the active locale */
    public activeLocale: string = "";

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private companyService: CompanyService,
        private companyActions: CompanyActions,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private router: Router,
        private generalActions: GeneralActions,
        private dbService: DbService,
        private settingsBranchAction: SettingsBranchActions,
        private loginAction: LoginActions,
        private socialAuthService: AuthService,
        private groupWithAction: GroupWithAccountsAction,
        private localeService: LocaleService
    ) {
        // Reset old stored application date
        this.store.dispatch(this.companyActions.ResetApplicationDate());
        this.activeAccount$ = this.store.pipe(select(appStore => appStore.ledger.account), takeUntil(this.destroyed$));
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.isLoggedInWithSocialAccount$ = this.store.pipe(select(appStore => appStore.login.isLoggedInWithSocialAccount), takeUntil(this.destroyed$));
        this.isCompanyRefreshInProcess$ = this.store.pipe(select(state => state.session.isRefreshing), takeUntil(this.destroyed$));
        this.store.pipe(select(appStore => appStore.session.currentOrganizationDetails), takeUntil(this.destroyed$)).subscribe((organization: Organization) => {
            if (organization && organization.details && organization.details.branchDetails) {
                this.generalService.currentBranchUniqueName = organization.details.branchDetails.uniqueName;
                this.generalService.currentOrganizationType = organization.type;
                this.currentOrganizationType = organization.type;
                if (this.generalService.currentBranchUniqueName) {
                    this.currentCompanyBranches$.pipe(take(1)).subscribe(response => {
                        if (response) {
                            this.currentBranch = response.find(branch => (branch.uniqueName === this.generalService.currentBranchUniqueName));
                            if (!this.activeCompanyForDb) {
                                this.activeCompanyForDb = new CompAidataModel();
                            }
                            this.activeCompanyForDb.name = this.currentBranch ? this.currentBranch.name : '';
                            this.activeCompanyForDb.uniqueName = this.currentBranch ? this.currentBranch.uniqueName : ''
                        }
                    });
                }
            } else {
                this.generalService.currentOrganizationType = OrganizationType.Company;
                this.currentOrganizationType = OrganizationType.Company;
            }
        });
    }

    /**
     * Returns true, if route with query params is activated
     *
     * @param {string} routeUrl Route URL without params
     * @returns {boolean} True, if passed route is activated
     * @memberof PrimarySidebarComponent
     */
    public isRouteWithParamsActive(routeUrl: string): boolean {
        const queryParamsIndex = this.router.url.indexOf('?');
        const baseUrl = queryParamsIndex === -1 ? this.router.url :
            this.router.url.slice(0, queryParamsIndex);
        // For Trial balance module, strict comparison should be done
        return this.router.url.includes('trial-balance-and-profit-loss') ? false : decodeURI(baseUrl) === decodeURI(routeUrl);
    }

    // CMD + G functionality
    @HostListener('document:keydown', ['$event'])
    public handleKeyboardUpEvent(event: KeyboardEvent) {
        if ((event.metaKey || event.ctrlKey) && (event.which === 75 || event.which === 71) && !this.navigationModalVisible) {
            event.preventDefault();
            event.stopPropagation();
            if (this.companyList.length > 0) {
                this.showNavigationModal();
            }
        }
    }

    /**
     * Re-creates the menu items list on change of permissible items obtained
     * from API
     *
     * @param {SimpleChanges} changes Changed properties
     * @memberof PrimarySidebarComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if ('apiMenuItems' in changes && changes.apiMenuItems.previousValue !== changes.apiMenuItems.currentValue && changes.apiMenuItems.currentValue.length && this.localeData?.page_heading) {
            this.allItems = this.generalService.getVisibleMenuItems("sidebar", changes.apiMenuItems.currentValue, this.localeData?.items);
        }
    }

    /**
     * Initializes the component
     *
     * @memberof PrimarySidebarComponent
     */
    public ngOnInit(): void {
        this.smartCombinedList$ = this.store.pipe(select(appStore => appStore.general.smartCombinedList), takeUntil(this.destroyed$));
        this.updateIndexDbSuccess$ = this.store.pipe(select(appStore => appStore.general.updateIndexDbComplete), takeUntil(this.destroyed$))
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
            if (selectedCmp && selectedCmp?.uniqueName === this.generalService.companyUniqueName) {
                this.selectedCompany = observableOf(selectedCmp);
                this.selectedCompanyDetails = selectedCmp;
                this.companyInitials = this.generalService.getInitialsFromString(selectedCmp.name);
                this.branchInitials = this.generalService.getInitialsFromString(this.currentBranch?.alias || this.currentBranch?.name);
                this.activeFinancialYear = selectedCmp.activeFinancialYear;
                this.store.dispatch(this.companyActions.setActiveFinancialYear(this.activeFinancialYear));

                this.activeCompanyForDb = new CompAidataModel();
                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    this.activeCompanyForDb.name = this.currentBranch ? this.currentBranch.name : '';
                    this.activeCompanyForDb.uniqueName = this.generalService.currentBranchUniqueName;
                } else {
                    this.activeCompanyForDb.name = selectedCmp.name;
                    this.activeCompanyForDb.uniqueName = selectedCmp.uniqueName;
                }
                if (this.generalService.companyUniqueName) {
                    this.dbService.getAllItems(this.activeCompanyForDb.uniqueName, 'accounts').subscribe(accountList => {
                        if (accountList?.length) {
                            if (window.innerWidth > 1440 && window.innerHeight > 717) {
                                this.accountItemsFromIndexDB = accountList.slice(0, 7);
                            } else {
                                this.accountItemsFromIndexDB = accountList.slice(0, 5);
                            }
                        } else {
                            this.accountItemsFromIndexDB = DEFAULT_AC;
                        }
                        this.changeDetectorRef.detectChanges();
                    });
                }
            }
        });
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response;
                if (this.generalService.currentBranchUniqueName) {
                    this.currentBranch = response.find(branch =>
                        (this.generalService.currentBranchUniqueName === branch.uniqueName)) || {};
                    this.branchInitials = this.generalService.getInitialsFromString(this.currentBranch?.alias || this.currentBranch?.name);
                    if (!this.activeCompanyForDb) {
                        this.activeCompanyForDb = new CompAidataModel();
                    }

                    this.activeCompanyForDb.name = this.currentBranch ? this.currentBranch.name : '';
                    this.activeCompanyForDb.uniqueName = this.currentBranch ? this.currentBranch.uniqueName : ''
                } else {
                    this.currentBranch = '';
                }
            }
        });
        this.store.pipe(select((state: AppState) => state.session.companies), takeUntil(this.destroyed$)).subscribe(companies => {
            if (!companies || companies.length === 0) {
                return;
            }

            let orderedCompanies = _.orderBy(companies, 'name');
            this.companyList = orderedCompanies;
            this.companyListForFilter = orderedCompanies;
            this.companies$ = observableOf(orderedCompanies);
            this.store.dispatch(this.companyActions.setTotalNumberofCompanies(orderedCompanies.length));
        });
        this.user$ = this.store.pipe(select(createSelector([(state: AppState) => state.session.user], (user) => {
            if (user && user.user && user.user.name && user.user.name.length > 1) {
                let name = user.user.name;
                if (user.user.name.match(/\s/g)) {
                    this.userFullName = name;
                    let formattedName = name.split(' ');
                    this.userName = formattedName[0][0] + formattedName[1][0];
                } else {
                    this.userName = user.user.name[0] + user.user.name[1];
                    this.userFullName = name;
                }
                return user.user;
            }
        })), takeUntil(this.destroyed$));
        this.user$.pipe(take(1)).subscribe((u) => {
            if (u) {
                let userEmail = u.email;
                this.userEmail = clone(userEmail);
                let name = u.name;
                if (u.name.match(/\s/g)) {
                    this.userFullName = name;
                    let formattedName = name.split(' ');
                    this.userName = formattedName[0][0] + formattedName[1][0];
                } else {
                    this.userName = u.name[0] + u.name[1];
                    this.userFullName = name;
                }
            }
        });
        this.smartCombinedList$.subscribe(smartList => {
            if (smartList && smartList.length) {
                if (this.activeCompanyForDb && this.activeCompanyForDb.uniqueName) {
                    this.dbService.getItemDetails(this.activeCompanyForDb.uniqueName).toPromise().then(dbResult => {
                        this.findListFromDb(dbResult);
                    });
                }
            }
        });
        this.updateIndexDbSuccess$.subscribe(res => {
            if (res) {
                if (this.activeCompanyForDb && this.activeCompanyForDb.uniqueName) {
                    this.dbService.getItemDetails(this.activeCompanyForDb.uniqueName).toPromise().then(dbResult => {
                        this.findListFromDb(dbResult);
                        this.generalActions.updateUiFromDb();
                    });
                }
            }
        });

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd) {
                const queryParamsIndex = this.router.url.indexOf('?');
                const baseUrl = queryParamsIndex === -1 ? this.router.url :
                    this.router.url.slice(0, queryParamsIndex);
                this.allItems.forEach(item => item.isActive = (item.link === decodeURI(baseUrl) || item?.items?.some((subItem: AllItem) => {
                    if (subItem.link === decodeURI(baseUrl)) {
                        return true;
                    }
                })));
                this.openActiveItem();

                this.changeDetectorRef.detectChanges();
            }

            if (event instanceof NavigationStart) {
                if (this.companyDetailsDropDownWeb.isOpen) {
                    this.companyDetailsDropDownWeb.hide();
                }
            }
        });

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if(this.activeLocale && this.activeLocale !== response?.value) {
                this.localeService.getLocale('all-items', response?.value).subscribe(response => {
                    this.localeData = response;
                    this.translationComplete(true);
                });
            }
            this.activeLocale = response?.value;
        });
    }

    /**
     * Releases the occupied memory
     *
     * @memberof PrimarySidebarComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Switches to branch mode
     *
     * @param {string} branchUniqueName Branch uniqueName
     * @memberof PrimarySidebarComponent
     */
    public switchToBranch(branchUniqueName: string, event: any): void {
        event.stopPropagation();
        if (branchUniqueName === this.generalService.currentBranchUniqueName) {
            return;
        }
        this.currentCompanyBranches$.pipe(take(1)).subscribe(response => {
            if (response) {
                this.currentBranch = response.find(branch => branch.uniqueName === branchUniqueName);
            }
        });
        event.preventDefault();
        this.subBranchDropdown.isOpen = false;

        const details = {
            branchDetails: {
                uniqueName: branchUniqueName
            }
        };
        this.setOrganizationDetails(OrganizationType.Branch, details);
        this.companyService.getStateDetails(this.generalService.companyUniqueName).pipe(take(1)).subscribe(response => {
            if (response && response.body) {
                this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                    this.generalService.finalNavigate(response.body.lastState);
                });
            }
        });
    }

    /**
     * Company filtering method
     *
     * @param {*} ev Modal change event
     * @memberof PrimarySidebarComponent
     */
    public filterCompanyList(ev): void {
        let companies: CompanyResponse[] = [];
        this.companies$?.pipe(take(1)).subscribe(cmps => companies = cmps);

        this.companyListForFilter = companies?.filter((cmp) => {
            if (!cmp.alias) {
                return cmp.name.toLowerCase().includes(ev.toLowerCase());
            } else {
                return cmp.name.toLowerCase().includes(ev.toLowerCase()) || cmp.alias.toLowerCase().includes(ev.toLowerCase());
            }
        });
    }

    /**
     * Filters the branches based on text provided
     *
     * @param {string} branchName Branch name query entered by the user
     * @memberof PrimarySidebarComponent
     */
    public filterBranch(branchName: string): void {
        let branches = [];
        this.currentCompanyBranches$.pipe(take(1)).subscribe(response => {
            branches = response || [];
        });
        if (branchName) {
            this.currentCompanyBranches = branches.filter(branch => {
                if (!branch.alias) {
                    return branch.name.toLowerCase().includes(branchName.toLowerCase());
                } else {
                    return branch.alias.toLowerCase().includes(branchName.toLowerCase());
                }
            });
        } else {
            this.currentCompanyBranches = branches;
        }
    }

    /**
     * This will stop the body scroll if company dropdown is open
     *
    * @memberof PrimarySidebarComponent
     */
    public toggleBodyScroll(): void {
        if (this.subBranchDropdown?.isOpen && !this.isMobileSite) {
            document.querySelector('body').classList.add('prevent-body-scroll');
        } else {
            document.querySelector('body').classList.remove('prevent-body-scroll');
        }
    }

    /**
     * Displays the CMD+K modal
     *
     * @memberof PrimarySidebarComponent
     */
    public showNavigationModal(): void {
        this.navigationModalVisible = true;
        const _combine = combineLatest([
            this.modalService.onShow,
            this.modalService.onShown,
            this.modalService.onHide,
            this.modalService.onHidden
        ]).pipe(takeUntil(this.destroyed$)).subscribe(() => this.changeDetection.markForCheck());

        this.subscriptions.push(
            this.modalService.onHidden.pipe(takeUntil(this.destroyed$)).subscribe((reason: string) => {
                this.navigationModalVisible = false;
                this.unsubscribe();
            })
        );

        this.subscriptions.push(_combine);
        let config: ModalOptions = { class: 'universal_modal', show: true, keyboard: true, animated: false };
        this.modelRef = this.modalService.show(this.navigationModal, config);
    }

    /**
     * New group creation handler for CMD+K
     *
     * @param {*} e Create new group event
     * @memberof PrimarySidebarComponent
     */
    public handleNewTeamCreationEmitter(e: any): void {
        this.modelRef.hide();
        this.showManageGroupsModal();
    }

    /**
     * Prepares list of accounts and menus
     *
     * @param {IUlist[]} data Data with which list needs to be created
     * @memberof PrimarySidebarComponent
     */
    public prepareSmartList(data: IUlist[]): void {
        // hardcoded aiData
        // '/pages/trial-balance-and-profit-loss'
        let menuList: IUlist[] = [];
        let groupList: IUlist[] = [];
        let acList: IUlist[] = DEFAULT_AC;
        let defaultMenu = cloneDeep(DEFAULT_MENUS);

        // parse and push default menu to menulist for sidebar menu for initial usage
        if (defaultMenu && defaultMenu.length > 0) {
            defaultMenu.forEach(item => {
                let newItem: IUlist = {
                    name: item.name,
                    uniqueName: item.uniqueName,
                    additional: item.additional,
                    type: 'MENU',
                    time: +new Date(),
                    pIndex: item.pIndex,
                    isRemoved: item.isRemoved
                };
                menuList.push(newItem);
            });
        }

        let combined = cloneDeep([...menuList, ...acList]);
        this.store.dispatch(this.generalActions.setSmartList(combined));
        if (!this.activeCompanyForDb) {
            this.activeCompanyForDb = new CompAidataModel();
        }
        this.activeCompanyForDb.aidata = {
            menus: menuList,
            groups: groupList,
            accounts: acList
        };

        // due to some issue
        // this.selectedPage = menuList[0].name;
        this.dbService.insertFreshData(this.activeCompanyForDb);
    }

    /**
     * Finds the item list from DB
     *
     * @param {ICompAidata} dbResult Current DB result
     * @returns
     * @memberof PrimarySidebarComponent
     */
    public findListFromDb(dbResult: ICompAidata): void {
        if (!this.activeCompanyForDb) {
            return;
        }
        if (!this.activeCompanyForDb.uniqueName) {
            return;
        }
        if (dbResult) {
            if (window.innerWidth > 1440 && window.innerHeight > 717) {
                this.accountItemsFromIndexDB = (dbResult && dbResult.aidata) ? slice(dbResult.aidata.accounts, 0, 7) : [];
            } else {
                this.accountItemsFromIndexDB = (dbResult && dbResult.aidata) ? slice(dbResult.aidata.accounts, 0, 5) : [];
            }
        } else {
            let data: IUlist[];
            this.smartCombinedList$.pipe(take(1)).subscribe(listResult => {
                data = listResult;
            });
            // make entry with smart list data
            this.prepareSmartList(data);

            // slice default menus and account on small screen
            if (!(window.innerWidth > 1440 && window.innerHeight > 717)) {
                this.accountItemsFromIndexDB = slice(this.accountItemsFromIndexDB, 0, 5);
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Displays the manage group modal / master modal
     *
     * @memberof PrimarySidebarComponent
     */
    public showManageGroupsModal(): void {
        this.store.dispatch(this.groupWithAction.OpenAddAndManageFromOutside(''));
    }

    /**
     * Creates a new group entry
     *
     * @param {IUlist} item
     * @memberof PrimarySidebarComponent
     */
    public makeGroupEntryInDB(item: IUlist): void {
        // save data to db
        item.time = +new Date();
        this.doEntryInDb('groups', item);
    }

    /**
     * Item selection handler for CMD+K
     *
     * @param {IUlist} item Selected item
     * @param {{ next: IUlist, previous: IUlist }} [fromInvalidState=null] Current and previous states
     * @param {boolean} [isCtrlClicked] True, if CTRL is clicked
     * @memberof PrimarySidebarComponent
     */
    public onItemSelected(item: IUlist, fromInvalidState: { next: IUlist, previous: IUlist } = null, isCtrlClicked?: boolean): void {
        if (this.modelRef) {
            this.modelRef.hide();
        }

        setTimeout(() => {
            if (item && item.type === 'MENU') {
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
            } else {
                // direct account scenario
                let url = `ledger/${item.uniqueName}`;
                // if (!this.isLedgerAccSelected) {
                //   this.navigateToUser = true;
                // }
                if (!isCtrlClicked) {
                    this.router.navigate([url]); // added link in routerLink
                }
            }
            // save data to db
            item.time = +new Date();
            let entity = (item.type) === 'MENU' ? 'menus' : 'accounts';
            this.doEntryInDb(entity, item, fromInvalidState);
        }, 200);
    }

    /**
     * Loads company branches
     *
     * @memberof PrimarySidebarComponent
     */
    public loadCompanyBranches(): void {
        if (this.generalService.companyUniqueName) {
            // Avoid API call if new user is onboarded
            this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
        }
    }

    /**
     * Switches to company view from branch view
     *
     * @memberof PrimarySidebarComponent
     */
    public goToCompany(): void {
        if (!localStorage.getItem('isNewArchitecture')) {
            /* New architecture displays more items in menu panel in company mode
               as accounts are not visible hence to detect the environment for current customer
               in PROD we are using local storage to reset the index DB once and replace it with new items
            */
            this.dbService.clearAllData();
            localStorage.setItem('isNewArchitecture', String(true));
        }
        this.activeCompanyForDb.uniqueName = this.generalService.companyUniqueName;
        this.activeCompanyForDb.name = this.selectedCompanyDetails.name;
        if (this.subBranchDropdown) {
            this.subBranchDropdown.isOpen = false;
        }
        const details = {
            branchDetails: {
                uniqueName: ''
            }
        };
        this.setOrganizationDetails(OrganizationType.Company, details);
        this.toggleBodyScroll();
        this.changeCompany(this.selectedCompanyDetails.uniqueName, false);
    }

    /**
     * Change company callback method
     *
     * @param {string} selectedCompanyUniqueName Selected company unique name
     * @param {boolean} [fetchLastState] True, if last state of the company needs to be fetched
     * @memberof PrimarySidebarComponent
     */
    public changeCompany(selectedCompanyUniqueName: string, fetchLastState?: boolean) {
        if (this.subBranchDropdown) {
            this.subBranchDropdown.isOpen = false;
        }
        this.generalService.companyUniqueName = selectedCompanyUniqueName;
        const details = {
            branchDetails: {
                uniqueName: ''
            }
        };
        this.setOrganizationDetails(OrganizationType.Company, details);
        this.toggleBodyScroll();
        this.store.dispatch(this.loginAction.ChangeCompany(selectedCompanyUniqueName, fetchLastState));
    }

    /**
     * Makes selected account entry in DB
     *
     * @param {*} event Select account event
     * @param {*} acc Account selected
     * @returns
     * @memberof PrimarySidebarComponent
     */
    public analyzeAccounts(event: any, acc): void {
        if (event.shiftKey || event.ctrlKey || event.metaKey) { // if user pressing combination of shift+click, ctrl+click or cmd+click(mac)
            this.onItemSelected(acc, null, true);
            return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (this.subBranchDropdown) {
            this.subBranchDropdown.hide();
        }
        this.onItemSelected(acc);
    }

    /**
     * Logs out the user
     *
     * @memberof PrimarySidebarComponent
     */
    public logout(): void {
        /** Reset the current organization type on logout as we
         * don't know receive switched branch from API in last state (state API)
        */
        const details = {
            branchDetails: {
                uniqueName: ''
            }
        };
        this.setOrganizationDetails(OrganizationType.Company, details);
        localStorage.removeItem('isNewArchitecture');
        if (isElectron) {
            this.store.dispatch(this.loginAction.ClearSession());
        } else if (isCordova) {
            (window as any).plugins.googleplus.logout(
                (msg) => {
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
     * redirect to route and save page entry into db
     * @param event event
     * @param pageName page router url
     * @param queryParamsObj additional data
     */
    public analyzeMenus(event: any, pageName: string, queryParamsObj?: any): void {
        this.isLedgerAccSelected = false;
        if (event) {
            if (event.shiftKey || event.ctrlKey || event.metaKey) { // if user pressing combination of shift+click, ctrl+click or cmd+click(mac)
                return;
            }
            event.preventDefault();
            event.stopPropagation();
        }
        // this.companyDropdown.isOpen = false;
        if (this.subBranchDropdown) {
            this.subBranchDropdown.hide();
        }
        if (this.companyDetailsDropDownWeb) {
            this.companyDetailsDropDownWeb.hide();
        }

        this.toggleBodyScroll();

        // entry in db with confirmation
        let menu: any = {};
        menu.time = +new Date();

        let o: IUlist = find(NAVIGATION_ITEM_LIST, (item) => {
            if (queryParamsObj) {
                if (item.additional) {
                    return item.uniqueName.toLowerCase() === pageName.toLowerCase() && item.additional.tabIndex === queryParamsObj.tabIndex;
                }
            } else {
                return item.uniqueName.toLocaleLowerCase() === pageName.toLowerCase();
            }
        });
        if (o) {
            menu = { ...menu, ...o };
        } else {
            try {
                menu.name = pageName.split('/pages/')[1].toLowerCase();
                if (!menu.name) {
                    menu.name = pageName.split('/')[1].toLowerCase();
                }
            } catch (error) {
                menu.name = pageName.toLowerCase();
            }
            menu.name = this.getReadableNameFromUrl(menu.name);
            menu.uniqueName = pageName.toLowerCase();
            menu.type = 'MENU';

            if (queryParamsObj) {
                menu.additional = queryParamsObj;
            }
        }
        if (menu.additional) {
            this.router.navigate([pageName], { queryParams: menu.additional });
        } else {
            this.router.navigate([pageName]);
        }
    }

    /**
     * Mouse enter call back on company
     *
     * @param {number} index Index of company entered
     * @memberof PrimarySidebarComponent
     */
    public mouseEnteredOnCompanyName(index: number): void {
        this.hoveredIndx = index;
    }

    /**
     * Menu item click handler
     *
     * @param {AllItem} item Selected item
     * @memberof PrimarySidebarComponent
     */
    public handleItemClick(item: AllItem): void {
        if (item.label === this.commonLocaleData?.app_master) {
            this.store.dispatch(this.groupWithAction.OpenAddAndManageFromOutside(''));
        }
    }

    /**
     * Opens new company modal
     *
     * @memberof PrimarySidebarComponent
     */
    public createNewCompany(): void {
        this.newCompany.emit();
    }

    /**
     * Track by for menu items
     *
     * @param {number} index Index of current item
     * @param {AllItem} item Item instance
     * @returns {string} Item unique link
     * @memberof PrimarySidebarComponent
     */
    public trackItems(index: number, item: AllItem): string {
        return item.link;
    }
    /**
     * Returns the readable format name of menu item
     *
     * @private
     * @param {*} url Url of menu item
     * @returns
     * @memberof PrimarySidebarComponent
     */
    private getReadableNameFromUrl(url): string {
        let name = '';
        switch (url) {
            case 'SETTINGS?TAB=PERMISSION&TABINDEX=5':
                name = this.localeData?.settings_permission;
                break;
            case 'user-details/profile':
                name = this.localeData?.user_details;
                break;
            case 'inventory-in-out':
                name = this.localeData?.inventory_inout;
                break;
            case 'import/select-type':
                name = this.localeData?.import_data;
                break;
            default:
                name = url;
        }
        return name;
    }

    /**
     * Unsubscribes from all the listeners
     *
     * @private
     * @memberof PrimarySidebarComponent
     */
    private unsubscribe(): void {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
    }

    /**
     * Do entry in DB method for create/update operation on entry
     *
     * @private
     * @param {string} entity Company uniquename
     * @param {IUlist} item New item whose entry needs to be done
     * @param {{ next: IUlist, previous: IUlist }} [fromInvalidState=null] Current and previous states
     * @memberof PrimarySidebarComponent
     */
    private doEntryInDb(entity: string, item: IUlist, fromInvalidState: { next: IUlist, previous: IUlist } = null): void {
        if (entity === 'menus') {
            //this.selectedPage = item.name;
            this.isLedgerAccSelected = false;
        } else if (entity === 'accounts') {
            this.isLedgerAccSelected = true;
            this.selectedLedgerName = item.uniqueName;
            //this.selectedPage = 'ledger - ' + item.name;
        }

        if (this.activeCompanyForDb && this.activeCompanyForDb.uniqueName) {
            let isSmallScreen: boolean = !(window.innerWidth > 1440 && window.innerHeight > 717);
            let branches = [];
            this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
                branches = response || [];
            });
            this.dbService.addItem(this.activeCompanyForDb.uniqueName, entity, item, fromInvalidState, isSmallScreen,
                this.currentOrganizationType === OrganizationType.Company && branches.length > 1).then((res) => {
                    this.findListFromDb(res);
                }, (err: any) => {
                    console.log('%c Error: %c ' + err + '', 'background: #c00; color: #ccc', 'color: #333');
                });
        }
    }

    /**
    * Sets the organization details
    *
    * @private
    * @param {OrganizationType} type Type of the organization
    * @param {OrganizationDetails} branchDetails Branch details of an organization
    * @memberof PrimarySidebarComponent
    */
    private setOrganizationDetails(type: OrganizationType, branchDetails: OrganizationDetails): void {
        const organization: Organization = {
            type, // Mode to which user is switched to
            uniqueName: this.selectedCompanyDetails ? this.selectedCompanyDetails.uniqueName : '',
            details: branchDetails
        };
        this.store.dispatch(this.companyActions.setCompanyBranch(organization));
    }

    /**
     * Refreshes the company list
     *
     * @param {Event} event
     * @memberof PrimarySidebarComponent
     */
    public refreshCompanies(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.store.dispatch(this.companyActions.RefreshCompanies());
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof PrimarySidebarComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.allItems = this.generalService.getVisibleMenuItems("sidebar", this.apiMenuItems, this.localeData?.items);
        }
    }

    /**
     * Opens the active item and closes the rest
     *
     * @param {*} [itemIndex] Current item index
     * @memberof PrimarySidebarComponent
     */
    public openActiveItem(itemIndex?: any): void {
        if (itemIndex !== undefined) {
            this.itemDropdown?.forEach((dropdown: BsDropdownDirective, index: number) => {
                if (index !== itemIndex) {
                    dropdown.hide();
                }
            });
        } else {
            if (this.isOpen) {
                const activeItemIndex = this.allItems.findIndex(item => item.isActive);
                this.itemDropdown?.forEach((dropdown: BsDropdownDirective, index: number) => {
                    if (index === activeItemIndex) {
                        dropdown.show();
                    } else {
                        dropdown.hide();
                    }
                });
            }
        }
    }
}
