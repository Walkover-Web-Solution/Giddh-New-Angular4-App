import { combineLatest, Observable, of as observableOf, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AuthService } from '../../theme/ng-social-login-module/index';
import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from './../helpers/defaultDateFormat';
import { CompanyAddNewUiComponent, ManageGroupsAccountsComponent } from './components';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, HostListener, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ModalDirective, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { AppState } from '../../store';
import { LoginActions } from '../../actions/login.action';
import { CompanyActions } from '../../actions/company.actions';
import { CommonActions } from '../../actions/common.actions';
import { ActiveFinancialYear, CompanyCountry, CompanyCreateRequest, CompanyResponse, StatesRequest, Organization, OrganizationDetails } from '../../models/api-models/Company';
import { UserDetails } from '../../models/api-models/loginModels';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { ActivatedRoute, NavigationEnd, NavigationError, NavigationStart, RouteConfigLoadEnd, Router } from '@angular/router';
import { ElementViewContainerRef } from '../helpers/directives/elementViewChild/element.viewchild.directive';
import { GeneralActions } from '../../actions/general/general.actions';
import { createSelector } from 'reselect';
import * as moment from 'moment/moment';
import { AuthenticationService } from '../../services/authentication.service';
import { ICompAidata, IUlist } from '../../models/interfaces/ulist.interface';
import { clone, cloneDeep, concat, orderBy, sortBy, map as lodashMap, slice, find } from '../../lodash-optimized';
import { DbService } from '../../services/db.service';
import { CompAidataModel } from '../../models/db';
import { AccountResponse } from 'apps/web-giddh/src/app/models/api-models/Account';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DEFAULT_AC, DEFAULT_MENUS, NAVIGATION_ITEM_LIST, reassignNavigationalArray } from '../../models/defaultMenus';
import { userLoginStateEnum, OrganizationType } from '../../models/user-login-state';
import { SubscriptionsUser } from '../../models/api-models/Subscriptions';
import { environment } from 'apps/web-giddh/src/environments/environment';
import { CurrentPage, OnboardingFormRequest } from '../../models/api-models/Common';
import { GIDDH_DATE_RANGE_PICKER_RANGES, ROUTES_WITH_HEADER_BACK_BUTTON, VAT_SUPPORTED_COUNTRIES } from '../../app.constant';
import { CommonService } from '../../services/common.service';
import { Location } from '@angular/common';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { CompanyService } from '../../services/companyService.service';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { AccountsAction } from '../../actions/accounts.actions';
import { LedgerActions } from '../../actions/ledger/ledger.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
    public userIsSuperUser: boolean = true; // Protect permission module
    public session$: Observable<userLoginStateEnum>;
    public accountSearchValue: string = '';
    public companyDomains: string[] = ['walkover.in', 'giddh.com', 'muneem.co', 'msg91.com'];
    public moment = moment;
    public imgPath: string = '';
    public subscribedPlan: SubscriptionsUser;
    public isLedgerAccSelected: boolean = false;
    /* This will hold the value out/in to open/close help popup */
    public asideHelpSupportMenuState: string = 'out';
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideSettingMenuState: string = 'out';
    /*This will check if page has not tabs*/
    public pageHasTabs: boolean = false;

    @Output() public menuStateChange: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('companyadd', {static: true}) public companyadd: ElementViewContainerRef;
    @ViewChild('companynewadd', {static: true}) public companynewadd: ElementViewContainerRef;
    @ViewChild('addmanage', {static: true}) public addmanage: ElementViewContainerRef;
    @ViewChild('manageGroupsAccountsModal', {static: true}) public manageGroupsAccountsModal: ModalDirective;
    @ViewChild('addCompanyModal', {static: true}) public addCompanyModal: ModalDirective;
    @ViewChild('addCompanyNewModal', {static: true}) public addCompanyNewModal: ModalDirective;
    @ViewChild('navigationModal', {static: true}) public navigationModal: TemplateRef<any>; // CMD + K
    @ViewChild('dateRangePickerCmp', {static: true}) public dateRangePickerCmp: ElementRef;
    @ViewChild('dropdown', {static: true}) public companyDropdown: BsDropdownDirective;
    /** Switch branch dropdown */
    @ViewChild('subBranchDropdown', {static: false}) public subBranchDropdown: BsDropdownDirective;
    @ViewChild('supportTab', {static: true}) public supportTab: TabsetComponent;
    @ViewChild('searchCmpTextBox', {static: true}) public searchCmpTextBox: ElementRef;
    @ViewChild('expiredPlan', {static: true}) public expiredPlan: ModalDirective;
    @ViewChild('expiredPlanModel', {static: true}) public expiredPlanModel: TemplateRef<any>;
    @ViewChild('crossedTxLimitModel', {static: true}) public crossedTxLimitModel: TemplateRef<any>;
    @ViewChild('companyDetailsDropDownWeb', {static: true}) public companyDetailsDropDownWeb: BsDropdownDirective;
    /** All modules popover instance */
    @ViewChild('allModulesPopover', {static: true}) public allModulesPopover: PopoverDirective;

    public hideAsDesignChanges: boolean = false;
    public title: Observable<string>;
    public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    public noGroups: boolean;
    public languages: any[] = [
        { name: 'ENGLISH', value: 'en' },
        { name: 'DUTCH', value: 'nl' }
    ];
    public activeFinancialYear: ActiveFinancialYear;
    public sideMenu: { isopen: boolean } = { isopen: false };
    public companyMenu: { isopen: boolean } = { isopen: false };
    public isAddAndManageOpenedFromOutside$: Observable<boolean>;
    public companies$: Observable<CompanyResponse[]>;
    public selectedCompany: Observable<CompanyResponse>;
    /** Stores the active company details */
    public selectedCompanyDetails: CompanyResponse;
    public selectedCompanyCountry: string;
    public markForDeleteCompany: CompanyResponse;
    public deleteCompanyBody: string;
    public user$: Observable<UserDetails>;
    public userIsCompanyUser: boolean = false;
    public userName: string;
    public userEmail: string;
    public isElectron: boolean = isElectron;
    public isCordova: boolean = isCordova;
    public isTodaysDateSelected: boolean = false;
    public isDateRangeSelected: boolean = false;
    public userFullName: string;
    public userAvatar: string;
    public navigationModalVisible: boolean = false;
    public apkVersion: string;
    public accountItemsFromIndexDB: any[] = DEFAULT_AC;
    public selectedPage: any = '';
    public selectedLedgerName: string;
    public companyList: CompanyResponse[] = [];
    public companyListForFilter: CompanyResponse[] = [];
    public loadAPI: Promise<any>;
    public hoveredIndx: number;
    public activeAccount$: Observable<AccountResponse>;
    public navigationEnd: boolean = true;
    public oldSelectedPage: string = '';
    public navigateToUser: boolean = false;
    public showOtherMenu: boolean = false;
    public isLargeWindow: boolean = false;
    public selectedPlanStatus: string;
    public isSubscribedPlanHaveAdditionalCharges: any;
    public activeCompany: any;
    public createNewCompanyUser: CompanyCreateRequest;
    public totalNumberOfcompanies$: Observable<number>;
    public totalNumberOfcompanies: number;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private subscriptions: Subscription[] = [];
    public modelRef: BsModalRef;
    public modelRefExpirePlan: BsModalRef;
    public modelRefCrossLimit: BsModalRef;

    private activeCompanyForDb: ICompAidata;
    private smartCombinedList$: Observable<any>;
    public isMobileSite: boolean;
    public currentCompanyPlanAmount: any;
    public companyCountry: CompanyCountry = {
        baseCurrency: '',
        country: ''
    };
    public currentState: any = '';
    public isCalendlyModelActivate: boolean = false;
    public forceOpenNavigation: boolean = false;
    /** VAT supported countries to show the Vat Report section in all modules */
    public vatSupportedCountries = VAT_SUPPORTED_COUNTRIES;
    @ViewChild('datepickerTemplate', {static: true}) public datepickerTemplate: ElementRef;

    /* This will store modal reference */
    public modalRef: BsModalRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* This will check if company is allowed to beta test new modules */
    public isAllowedForBetaTesting: boolean = false;
    /* This will hold value if settings sidebar is open through mobile hamburger icon */
    public isMobileSidebar: boolean = false;
    /* This will hold if resolution is less than 768 to consider as mobile screen */
    public isMobileScreen: boolean = false;
    /* This will hold current page url */
    public currentPageUrl: string = '';
    /** Stores the details of the current branch */
    public currentBranch: any;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Search query to search branch */
    public searchBranchQuery: string;
    /** Current organization type */
    public currentOrganizationType: OrganizationType;
    /** This will hold the time when last session renewal was checked or updated */
    public lastSessionRenewalTime: any;
    /** All modules data with routing shared with user */
    public allModulesList = [];
    /** Version of lated mac app  */
    public macAppVersion: string;

    /**
     * Returns whether the account section needs to be displayed or not
     *
     * @readonly
     * @type {boolean} True, if either branch is switched or company is switched and only HO is there (single branch)
     * @memberof HeaderComponent
     */
    public get shouldShowAccounts(): boolean {
        return this.currentOrganizationType === OrganizationType.Branch ||
            (this.currentOrganizationType === OrganizationType.Company && this.currentCompanyBranches && this.currentCompanyBranches.length === 1);
    }
    /** This will hold that how many days are left for subscription expiration */
    public remainingSubscriptionDays: any = false;
    /** Menu items received from API */
    public apiMenuItems: Array<any> = [];

    /**
     * Returns whether the back button in header should be displayed or not
     *
     * @readonly
     * @type {boolean}
     * @memberof HeaderComponent
     */
    public get shouldShowBackButton(): boolean {
        return this.router.url && (ROUTES_WITH_HEADER_BACK_BUTTON.includes(this.router.url));
    }

    // tslint:disable-next-line:no-empty
    constructor(
        private commonService: CommonService,
        private loginAction: LoginActions,
        private socialAuthService: AuthService,
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private zone: NgZone,
        private route: ActivatedRoute,
        private _generalActions: GeneralActions,
        private authService: AuthenticationService,
        private _dbService: DbService,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private _breakpointObserver: BreakpointObserver,
        private generalService: GeneralService,
        private commonActions: CommonActions,
        private settingsProfileService: SettingsProfileService,
        private settingsProfileAction: SettingsProfileActions,
        private companyService: CompanyService,
        private settingsBranchAction: SettingsBranchActions,
        private accountsAction: AccountsAction,
        private ledgerAction: LedgerActions,
        public location: Location
    ) {
        // Reset old stored application date
        this.store.dispatch(this.companyActions.ResetApplicationDate());
        this.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));

        // SETTING CURRENT PAGE ON INIT
        this.setCurrentPage();
        this.checkIfPageHasTabs();

        // SETTING CURRENT PAGE ON ROUTE CHANGE
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationStart) {
                if ((event.url.includes("/pages/settings") || event.url.includes("/pages/gstfiling") || event.url.includes("/pages/user-details")) && !this.generalService.getSessionStorage("previousPage")) {
                    this.generalService.setSessionStorage("previousPage", this.currentPageUrl);
                }

                if(!event.url.includes("/pages/settings") && !event.url.includes("/pages/gstfiling") && !event.url.includes("/pages/user-details") && this.generalService.getSessionStorage("previousPage")) {
                    this.generalService.removeSessionStorage("previousPage");
                }
                if (this.subBranchDropdown) {
                    this.subBranchDropdown.hide();
                }
                this.addClassInBodyIfPageHasTabs();
            }
            if (event instanceof NavigationEnd) {
                if(!this.router.url.includes("/pages/settings") && !this.router.url.includes("/pages/user-details")) {
                    this.currentPageUrl = this.router.url;
                }
                this.setCurrentPage();
                this.addClassInBodyIfPageHasTabs();
                this.checkIfPageHasTabs();

                if (this.router.url.includes("/ledger")) {
                    this.currentState = this.router.url;
                    this.setCurrentAccountNameInHeading();
                }

                if(!this.lastSessionRenewalTime || (this.lastSessionRenewalTime && this.lastSessionRenewalTime.diff(moment(), 'hours') >= 2)) {
                    this.checkAndRenewUserSession();
                }
            }
            if (event instanceof NavigationStart) {
                this.navigationEnd = false;
            }
            if (event instanceof NavigationError || event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd) {
                this.navigationEnd = true;
            }
        });

        // GETTING CURRENT PAGE
        this.store.pipe(select(s => s.general.currentPage), takeUntil(this.destroyed$)).subscribe(response => {
            this.isLedgerAccSelected = false;
            let currentPageResponse = clone(response);
            if (currentPageResponse) {
                if (currentPageResponse && currentPageResponse.url && currentPageResponse.url.includes('ledger/')) {
                    this.isLedgerAccSelected = true;
                } else {
                    this.currentState = currentPageResponse.url;
                    this.selectedPage = currentPageResponse.name;
                }
            }
        });
        this.store.pipe(select(s => s.general.isCalendlyModelOpen), takeUntil(this.destroyed$)).subscribe(response => {
            this.isCalendlyModelActivate = response;
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
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
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

        this.store.pipe(select(state => state.settings.updateProfileSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if(response) {
                this.getCurrentCompanyData();
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
            this.store.dispatch(this.companyActions.setTotalNumberofCompanies(this.companyList.length));
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
            if (selectedCmp) {
                this.selectedCompany = observableOf(selectedCmp);
                this.selectedCompanyDetails = selectedCmp;
                this.activeFinancialYear = selectedCmp.activeFinancialYear;
                this.store.dispatch(this.companyActions.setActiveFinancialYear(this.activeFinancialYear));

                this.activeCompanyForDb = new CompAidataModel();
                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    this.activeCompanyForDb.name = this.currentBranch ? this.currentBranch.name : '';
                    this.activeCompanyForDb.uniqueName = this.generalService.currentBranchUniqueName;
                } else {
                    this.activeCompanyForDb.name = selectedCmp.name;
                    this.activeCompanyForDb.uniqueName = selectedCmp.uniqueName;
                    this.selectedCompanyCountry = selectedCmp.country;
                }
            }
        });

        this.session$ = this.store.pipe(select(p => p.session.userLoginState), distinctUntilChanged(), takeUntil(this.destroyed$));

        this.isAddAndManageOpenedFromOutside$ = this.store.pipe(select(s => s.groupwithaccounts.isAddAndManageOpenedFromOutside), takeUntil(this.destroyed$));
        this.smartCombinedList$ = this.store.pipe(select(s => s.general.smartCombinedList), takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.session.createCompanyUserStoreRequestObj), takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.createNewCompanyUser = res;
            }
        });
        this.generalService.isMobileSite.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            this.isMobileSite = s;
            this.accountItemsFromIndexDB = DEFAULT_AC;
        });
        this.totalNumberOfcompanies$ = this.store.pipe(select(state => state.session.totalNumberOfcompanies), takeUntil(this.destroyed$));
        this.generalService.invokeEvent.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            if (value === 'openschedulemodal') {
                this.openScheduleCalendlyModel();
            }
            if (value === 'resetcompanysession') {
                this.removeCompanySessionData();
            }
        });

        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response;
                if (this.generalService.currentBranchUniqueName) {
                    this.currentBranch = response.find(branch =>
                        (this.generalService.currentBranchUniqueName === branch.uniqueName)) || {};
                    this.activeCompanyForDb.name = this.currentBranch ? this.currentBranch.name : '';
                    this.activeCompanyForDb.uniqueName = this.currentBranch ? this.currentBranch.uniqueName : ''
                } else {
                    this.currentBranch = '';
                }
            }
        });

        this.store.pipe(select(state => state.settings.freePlanSubscribed), takeUntil(this.destroyed$)).subscribe(response => {
            if(response) {
                this.store.dispatch(this.settingsProfileAction.handleFreePlanSubscribed(false));
                this.getCurrentCompanyData();
            }
        });
    }

    public ngOnInit() {
        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if(response) {
                this.store.dispatch(this.commonActions.getCommonLocaleData(response.value));
            } else {
                let supportedLocales = this.generalService.getSupportedLocales();
                this.store.dispatch(this.commonActions.setActiveLocale(supportedLocales[0]));
            }
        });

        this.store.pipe(select(appStore => appStore.general.menuItems), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let branches = [];
                this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(data => {
                    branches = data || [];
                });
                reassignNavigationalArray(this.isMobileSite, this.generalService.currentOrganizationType === OrganizationType.Company && branches.length > 1, response);
                this.apiMenuItems = response;
                this.changeDetection.detectChanges();
            }
        });

        this.getCurrentCompanyData();
        this._breakpointObserver.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.generalService.invokeEvent.pipe(takeUntil(this.destroyed$)).subscribe((value) => {
            if (value === 'logoutCordova') {
                this.zone.run(() => {
                    this.router.navigate(['login']);
                    this.changeDetection.detectChanges();
                });
            }
        });

        //this.sideBarStateChange(true);
        this.store.pipe(select(state => state.general.openSideMenu), takeUntil(this.destroyed$)).subscribe(response => {
            this.sideBarStateChange(response);
        });
        this.generalService.isMobileSite.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            this.isMobileSite = s;
            if (this.generalService.companyUniqueName) {
                this.store.dispatch(this._generalActions.getSideMenuItems());
            }
        });

        this.sideBarStateChange(true);
        this.getElectronAppVersion();
        this.getElectronMacAppVersion();

        this.store.dispatch(this.companyActions.GetApplicationDate());
        this.user$.pipe(take(1)).subscribe((u) => {
            if (u) {
                let userEmail = u.email;
                this.userEmail = clone(userEmail);
                let userEmailDomain = userEmail.replace(/.*@/, '');
                this.userIsCompanyUser = userEmailDomain && this.companyDomains.indexOf(userEmailDomain) !== -1;
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

        if (this.isSubscribedPlanHaveAdditionalCharges) {
            if (!this.isMobileSite) {
                this.openCrossedTxLimitModel(this.crossedTxLimitModel);
            }
        }
        this.manageGroupsAccountsModal.onHidden.pipe(takeUntil(this.destroyed$)).subscribe(e => {
            this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
        });

        this.loadCompanyBranches();

        // region subscribe to last state for showing title of page this.selectedPage
        this.store.pipe(select(s => s.session.lastState), take(1)).subscribe(s => {
            this.isLedgerAccSelected = false;
            const lastState = s.toLowerCase();

            let lastStateHaveParams: boolean = lastState.includes('?');
            if (lastStateHaveParams) {
                let tempParams = lastState.substr(lastState.lastIndexOf('?'));
                let urlParams = new URLSearchParams(tempParams);
                let queryParams: any = {};
                urlParams.forEach((val, key) => {
                    queryParams[key] = val;
                });

                let route = NAVIGATION_ITEM_LIST.find((page) => {
                    if (!page.additional) {
                        return;
                    }
                    return (page.uniqueName.substring(7, page.uniqueName.length).indexOf(lastState.replace(tempParams, '')) > -1
                        && page.additional.tabIndex === Number(queryParams.tabindex));
                });

                if (route) {
                    //this.selectedPage = route.name;
                    return;
                }
            } else {
                const lastStateName = NAVIGATION_ITEM_LIST.find((page) => page.uniqueName
                    .substring(7, page.uniqueName.length)
                    .includes(lastState.replace('pages/', '')));
                if (lastStateName) {
                    //return this.selectedPage = lastStateName.name;
                } else if (lastState.includes('ledger/')) {

                    let isDestroyed: Subject<boolean> = new Subject<boolean>();
                    isDestroyed.next(false);
                    this.activeAccount$.pipe(takeUntil(isDestroyed)).subscribe(acc => {
                        if (acc) {
                            this.isLedgerAccSelected = true;
                            this.selectedLedgerName = lastState.substr(lastState.indexOf('/') + 1);
                            //this.selectedPage = 'ledger - ' + acc.name;
                            isDestroyed.next(true);
                            isDestroyed.complete();
                            return this.navigateToUser = false;
                        }
                    });
                } else if (this.selectedPage === 'gst') {
                    //this.selectedPage = 'GST';
                }
            }
        });
        // endregion

        this.imgPath = (isElectron || isCordova) ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        // TODO : It is commented due to we have implement calendly and its under discussion to remove

        // this.generalService.talkToSalesModal.subscribe(a => {
        //     if (a) {
        //         this.openScheduleCalendlyModel();
        //     }
        // });
        // Observes when screen resolution is 1440 or less close navigation bar for few pages...
        this._breakpointObserver
            .observe(['(min-width: 1020px)'])
            .pipe(takeUntil(this.destroyed$))
            .subscribe((state: BreakpointState) => {
                this.isLargeWindow = state.matches;
                this.adjustNavigationBar();
            });

        this.isAddAndManageOpenedFromOutside$.subscribe(s => {
            if (s) {
                this.loadAddManageComponent();
                this.manageGroupsAccountsModal.show();
            }
        });

        // initial data binding for universal modal and for menu
        this.smartCombinedList$.subscribe(smartList => {
            if (smartList && smartList.length) {
                if (this.activeCompanyForDb && this.activeCompanyForDb.uniqueName) {
                    this._dbService.getItemDetails(this.activeCompanyForDb.uniqueName).toPromise().then(dbResult => {
                        this.findListFromDb(dbResult);
                    });
                }
            }
        });

        // if invalid menu item clicked then navigate to default route and remove invalid entry from db
        this.generalService.invalidMenuClicked.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data) {
                this.onItemSelected(data.next, data);
            }
        });

        this.store.pipe(select(s => s.general.headerTitle)).pipe(takeUntil(this.destroyed$)).subscribe(menu => {
            if (menu) {
                let menuItem: IUlist = NAVIGATION_ITEM_LIST.find(item => {
                    if (menu.additional && item.additional) {
                        return item.uniqueName.toLowerCase() === menu.uniqueName.toLowerCase() && item.additional.tabIndex === menu.additional.tabIndex;
                    }
                    return item.uniqueName.toLocaleLowerCase() === menu.uniqueName.toLowerCase();
                });
                if (menuItem) {
                    this.doEntryInDb('menus', menuItem);
                }
            }
        });
        this.totalNumberOfcompanies$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            this.totalNumberOfcompanies = res;
        });

        this.companyService.CurrencyList().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === 'success' && response.body) {
                this.store.dispatch(this.loginAction.SetCurrencyInStore(response.body));
            }
        });

        if (this.activeCompanyForDb?.uniqueName) {
            this._dbService.getAllItems(this.activeCompanyForDb.uniqueName, 'accounts').subscribe(accountList => {
                if (accountList?.length) {
                    if (window.innerWidth > 1440 && window.innerHeight > 717) {
                        this.accountItemsFromIndexDB = accountList.slice(0, 7);
                    } else {
                        this.accountItemsFromIndexDB = accountList.slice(0, 5);
                    }
                }
            });
        }
    }

    /**
     * This will get the current company data
     *
     * @memberof HeaderComponent
     */
    public getCurrentCompanyData(): void {
        this.settingsProfileService.GetProfileInfo().pipe(take(1)).subscribe((response: any) => {
            if (response && response.status === "success" && response.body) {
                this.store.dispatch(this.settingsProfileAction.handleCompanyProfileResponse(response));
                let res = response.body;

                this.store.dispatch(this.companyActions.setActiveCompanyData(res));

                if (res.countryV2 !== null && res.countryV2 !== undefined) {
                    this.getStates(res.countryV2.alpha2CountryCode);
                    this.store.dispatch(this.commonActions.resetOnboardingForm());
                }
                if (res.subscription) {
                    this.store.dispatch(this.companyActions.setCurrentCompanySubscriptionPlan(res.subscription));
                    if (res.baseCurrency) {

                        this.companyCountry.baseCurrency = res.baseCurrency;
                        this.companyCountry.country = res.country;
                        this.store.dispatch(this.companyActions.setCurrentCompanyCurrency(this.companyCountry));
                    }

                    this.currentCompanyPlanAmount = res.subscription.planDetails.amount;
                    this.subscribedPlan = res.subscription;

                    if(this.subscribedPlan?.expiry) {
                        let expiry = (this.subscribedPlan?.expiry)?.split("-")?.reverse()?.join("-");
                        this.remainingSubscriptionDays = Number((new Date(expiry).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                    } else {
                        this.remainingSubscriptionDays = false;
                    }

                    this.isSubscribedPlanHaveAdditionalCharges = res.subscription.additionalCharges;
                    this.selectedPlanStatus = res.subscription.status;
                }
                this.activeCompany = res;
                if (this.activeCompany && this.activeCompany.createdBy && this.activeCompany.createdBy.email) {
                    this.isAllowedForBetaTesting = this.generalService.checkIfEmailDomainAllowed(this.activeCompany.createdBy.email);
                }
                this.checkIfCompanyTcsTdsApplicable();
            }
        });
    }


    public ngAfterViewInit() {
        if (window['Headway'] === undefined) {
            /* TO SHOW NOTIFICATIONS */
            let scriptTag = document.createElement('script');
            scriptTag.src = 'https://cdn.headwayapp.co/widget.js';
            scriptTag.type = 'text/javascript';
            scriptTag.defer = true;
            document.body.appendChild(scriptTag);
            /* TO SHOW NOTIFICATIONS */
        } else {
            window['Headway'].init();
        }

        if (this.selectedPlanStatus === 'expired') {// active expired
            if (!this.isMobileSite) {
                this.openExpiredPlanModel(this.expiredPlanModel);
            }
        }

        this.session$.subscribe((s) => {
            if (s === userLoginStateEnum.notLoggedIn) {
                if (isElectron) {
                    this.router.navigate(['/login']);
                } else {
                    window.location.href = (environment.production) ? `https://stage.giddh.com/login/?action=logout` : `https://test.giddh.com/login/?action=logout`;
                }
            } else if (s === userLoginStateEnum.newUserLoggedIn) {
                // this.router.navigate(['/pages/dummy'], { skipLocationChange: true }).then(() => {
                this.zone.run(() => {
                    this.router.navigate(['/new-user']);
                });                // });
            }
        });
        if (this.route.snapshot.url.toString() === 'new-user') {
            this.showAddCompanyModal();
        }
        this.store.dispatch(this.loginAction.FetchUserDetails());

        // Get universal date
        this.store.pipe(select(createSelector([(state: AppState) => state.session.applicationDate], (dateObj: Date[]) => {
            if (dateObj && dateObj.length) {
                this.isTodaysDateSelected = !dateObj[3];  //entry-setting API date response in case of today fromDate/toDate will be null
                if (this.isTodaysDateSelected) {
                    let today = cloneDeep([moment(), moment()]);
                    this.selectedDateRange = { startDate: moment(today[0]), endDate: moment(today[1]) };
                    // this.selectedDateRangeUi = moment(today[0]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.selectedDateRangeUi = "Today";
                } else {
                    this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                    this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.isDateRangeSelected = true;
                }
            }
        })), takeUntil(this.destroyed$)).subscribe();
    }

    public ngAfterViewChecked() {
        this.changeDetection.detectChanges();
    }

    public handleNewTeamCreationEmitter(e: any) {
        this.modelRef.hide();
        this.showManageGroupsModal();
    }

    /**
     * This will toggle the fixed class on body
     *
     * @memberof HeaderComponent
     */
    public toggleBodyClass(): void {
        if (this.asideHelpSupportMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * This will toggle the help popup
     *
     * @param {boolean} show
     * @memberof HeaderComponent
     */
    public toggleHelpSupportPane(show: boolean): void {
        setTimeout(() => {
            this.asideSettingMenuState = 'out';
            document.querySelector('body').classList.remove('mobile-setting-sidebar');
            this.asideHelpSupportMenuState = (show && this.asideHelpSupportMenuState === 'out') ? 'in' : 'out';
            this.toggleBodyClass();
        }, (this.asideHelpSupportMenuState === 'out') ? 100 : 0);
    }

    /**
     * This will toggle the settings popup
     *
     * @param {boolean} show
     * @param {boolean} isMobileSidebar
     * @memberof HeaderComponent
     */
    public toggleSidebarPane(show: boolean, isMobileSidebar: boolean): void {
        setTimeout(() => {
            this.isMobileSidebar = isMobileSidebar;
            this.asideHelpSupportMenuState = 'out';
            this.asideSettingMenuState = (show && this.asideSettingMenuState === 'out') ? 'in' : 'out';
            this.toggleBodyClass();

            if (this.asideSettingMenuState === "in") {
                document.querySelector('body').classList.add('mobile-setting-sidebar');
            } else {
                document.querySelector('body').classList.remove('mobile-setting-sidebar');
            }
        }, (this.asideSettingMenuState === 'out') ? 100 : 0);
    }

    /**
     * This will close the settings popup if click outside of popup
     *
     * @memberof HeaderComponent
     */
    public closeSettingPaneOnOutsideClick(): void {
        setTimeout(() => {
            if (this.asideSettingMenuState === "in") {
                this.asideSettingMenuState = 'out';
                document.querySelector('body').classList.remove('mobile-setting-sidebar');
            }
        }, 50);
    }

    /**
     * This will close the help popup if click outside of popup
     *
     * @memberof HeaderComponent
     */
    public closeHelpPaneOnOutsideClick(): void {
        setTimeout(() => {
            if (this.asideHelpSupportMenuState === "in") {
                this.asideHelpSupportMenuState = 'out';
                document.querySelector('body').classList.remove('fixed');
            }
        }, 50);
    }

    /**
     * redirect to route and save page entry into db
     * @param e event
     * @param pageName page router url
     * @param queryParamsObj additional data
     */
    public analyzeMenus(e: any, pageName: string, queryParamsObj?: any) {
        this.oldSelectedPage = cloneDeep(this.selectedPage);
        this.isLedgerAccSelected = false;
        if (e) {
            if (e.shiftKey || e.ctrlKey || e.metaKey) { // if user pressing combination of shift+click, ctrl+click or cmd+click(mac)
                return;
            }
            e.preventDefault();
            e.stopPropagation();
        }
        this.companyDropdown.isOpen = false;
        if (this.subBranchDropdown) {
            this.subBranchDropdown.hide();
        }
        this.forceOpenNavigation = false;
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
        this.setCurrentPageTitle(menu);

        if (menu.additional) {
            this.router.navigate([pageName], { queryParams: menu.additional });
        } else {
            this.router.navigate([pageName]);
        }
    }

    public analyzeOtherMenus(name: string, additional: any = null) {
        name = `/pages/${name}`;
        this.analyzeMenus(null, name, additional);
    }

    public analyzeAccounts(e: any, acc) {
        if (e.shiftKey || e.ctrlKey || e.metaKey) { // if user pressing combination of shift+click, ctrl+click or cmd+click(mac)
            this.onItemSelected(acc, null, true);
            return;
        }
        e.preventDefault();
        e.stopPropagation();
        if (this.subBranchDropdown) {
            this.subBranchDropdown.hide();
        }
        this.onItemSelected(acc);
    }

    public prepareSmartList(data: IUlist[]) {
        // hardcoded aiData
        // '/pages/trial-balance-and-profit-loss'
        let menuList: IUlist[] = [];
        let groupList: IUlist[] = [];
        let acList: IUlist[] = DEFAULT_AC;
        let defaultMenu = cloneDeep(DEFAULT_MENUS);

        // parse and push default menu to menulist for sidebar menu for initial usage
        if(defaultMenu && defaultMenu.length > 0) {
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
        this.store.dispatch(this._generalActions.setSmartList(combined));
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
        this._dbService.insertFreshData(this.activeCompanyForDb);
    }

    public findListFromDb(dbResult: ICompAidata) {
        if (!this.activeCompanyForDb) {
            return;
        }
        if (!this.activeCompanyForDb.uniqueName) {
            return;
        }
        if (dbResult) {
            // slice menus
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
    }

    public showManageGroupsModal() {
        this.store.dispatch(this.groupWithAccountsAction.OpenAddAndManageFromOutside(''));
    }

    public hideManageGroupsModal() {
        this.store.pipe(select(c => c.session.lastState), take(1)).subscribe((s: string) => {
            if (s && (s.indexOf('ledger/') > -1 || s.indexOf('settings') > -1)) {
                this.store.dispatch(this._generalActions.addAndManageClosed());
                if (this.selectedLedgerName) {
                    this.store.dispatch(this.ledgerAction.GetLedgerAccount(this.selectedLedgerName));
                    this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedLedgerName));
                }
            }
        });

        this.manageGroupsAccountsModal.hide();
    }

    public showAddCompanyModal() {
        this.loadAddCompanyNewUiComponent();
        this.addCompanyNewModal.show();
    }

    public hideAddCompanyModal() {
        this.addCompanyNewModal.hide();
    }

    public hideCompanyModalAndShowAddAndManage() {
        this.addCompanyModal.hide();
        this.store.dispatch(this.groupWithAccountsAction.getGroupWithAccounts(''));
        this.manageGroupsAccountsModal.show();
    }

    public onHide() {
        this.store.dispatch(this.companyActions.ResetCompanyPopup());
    }

    public onShown() {
        //
    }

    public loadAddCompanyNewUiComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(CompanyAddNewUiComponent);
        let viewContainerRef = this.companynewadd.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as CompanyAddNewUiComponent).closeCompanyModal.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
            this.hideAddCompanyModal();
        });
        (componentRef.instance as CompanyAddNewUiComponent).closeCompanyModalAndShowAddManege.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
            this.hideCompanyModalAndShowAddAndManage();
        });
    }

    public loadAddManageComponent() {
        let componentFactory = this.componentFactoryResolver.resolveComponentFactory(ManageGroupsAccountsComponent);
        let viewContainerRef = this.addmanage.viewContainerRef;
        viewContainerRef.clear();
        let componentRef = viewContainerRef.createComponent(componentFactory);
        (componentRef.instance as ManageGroupsAccountsComponent).closeEvent.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
            this.hideManageGroupsModal();
            viewContainerRef.remove();
        });
        this.manageGroupsAccountsModal.onShown.pipe(takeUntil(this.destroyed$)).subscribe((a => {
            (componentRef.instance as ManageGroupsAccountsComponent).headerRect = (componentRef.instance as ManageGroupsAccountsComponent).header?.nativeElement.getBoundingClientRect();
            (componentRef.instance as ManageGroupsAccountsComponent).myModelRect = (componentRef.instance as ManageGroupsAccountsComponent).myModel?.nativeElement.getBoundingClientRect();
        }));
    }

    /**
     *  sidebar menu toggle
     *
     * @param {boolean} event to check side bar menu open or not
     * @memberof HeaderComponent
     */
    public sideBarStateChange(event: boolean) {
        if (this.sideMenu) {
            this.sideMenu.isopen = event;
        }
        if (this.companyDropdown && !this.forceOpenNavigation) {
            this.companyDropdown.isOpen = false;
        }
        if (this.companyDetailsDropDownWeb) {
            this.companyDetailsDropDownWeb.hide();
        }
        if (event) {
            document.querySelector('body').classList.add('hide-scroll-body')
        } else {
            document.querySelector('body').classList.remove('hide-scroll-body')
        }
        this.menuStateChange.emit(event);
    }

    public closeSidebarMobile(e) {
        if (e.target.className.toString() !== 'icon-bar' && this.isMobileSite) {
            this.sideMenu.isopen = false;
            this.menuStateChange.emit(false);
        }
    }

    public forceCloseSidebar(event) {
        if (event.target.parentElement.classList.contains('wrapAcList')) {
            return;
        }
        this.flyAccounts.next(false);
    }

    public closeSidebar(targetId) {
        if (targetId === 'accountSearch' || targetId === 'expandAllGroups' || targetId === 'toggleAccounts') {
            return;
        }
        this.flyAccounts.next(false);
    }

    public openDateRangePicker() {
        this.isTodaysDateSelected = false;
    }

    // public jumpToToday() {
    //     this.setApplicationDate(null);
    // }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getUserAvatar(userId) {
        // this.authService.getUserAvatar(userId).subscribe(res => {
        //   let data = res;
        //   this.userAvatar = res.entry.gphoto$thumbnail.$t;
        // });
    }

    public makeGroupEntryInDB(item: IUlist) {
        // save data to db
        item.time = +new Date();
        this.doEntryInDb('groups', item);
    }

    public onItemSelected(item: IUlist, fromInvalidState: { next: IUlist, previous: IUlist } = null, isCtrlClicked?: boolean) {
        this.oldSelectedPage = cloneDeep(this.selectedPage);
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

    public filterCompanyList(ev) {
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
     * @memberof HeaderComponent
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

    public closeUserMenu(ev) {
        // if (ev.target && ev.target.classList && !ev.target.classList.contains('c-name')) {
        //   this.companyMenu.isopen = false;
        // } else {
        //   this.companyMenu.isopen = true;
        // }
        ev.isopen = false;
        this.companyMenu.isopen = false;
    }

    // TODO : It is commented due to we have implement calendly and its under discussion to remove

    // public closeModal() {
    //     this.talkSalesModal.hide();
    //     this.generalService.talkToSalesModal.next(false);
    // }

    public openExpiredPlanModel(template: TemplateRef<any>) { // show expired plan
        if (!this.modalService.getModalsCount()) {
            this.modelRefExpirePlan = this.modalService.show(template,
                Object.assign({}, { class: 'subscription-upgrade' })
            );
        }
    }

    public openCrossedTxLimitModel(template: TemplateRef<any>) {  // show if Tx limit over
        this.modelRefCrossLimit = this.modalService.show(template);

    }

    /**
     * Navigates to user details' subscription tab
     *
     * @memberof HeaderComponent
     */
    public goToSelectPlan(): void {
        if (this.modelRefExpirePlan) {
            this.modelRefExpirePlan.hide();
        }
        if (this.modelRefCrossLimit) {
            this.modelRefCrossLimit.hide();
        }
        document.querySelector('body').classList.remove('modal-open');
        this.router.navigate(['/pages', 'user-details'], {
            queryParams: {
                tab: 'subscriptions',
                tabIndex: 3,
                showPlans: true
            }
        });
    }

    public onRight(nodes) {
        if (nodes.currentVertical) {
            if (!this.isDropdownOpen(nodes.currentVertical)) {
                nodes.currentVertical.click();
            }
        }
    }

    public onLeft(nodes, navigator) {
        navigator.remove();
        if (navigator.currentVertical) {
            if (this.isDropdownOpen(nodes.currentVertical)) {
                navigator.currentVertical.click();
            }
        }
    }

    public isDropdownOpen(node) {
        const attrs = node.attributes;
        return (attrs.getNamedItem('dropdownToggle') && attrs.getNamedItem('switch-company')
            && attrs.getNamedItem('aria-expanded') && attrs.getNamedItem('aria-expanded').nodeValue === 'true');
    }

    public scheduleNow() {
        let newwindow = window.open('https://app.intercom.io/a/meeting-scheduler/calendar/VEd2SmtLSyt2YisyTUpEYXBCRWg1YXkwQktZWmFwckF6TEtwM3J5Qm00R2dCcE5IWVZyS0JjSXF2L05BZVVWYS0tck81a21EMVZ5Z01SQWFIaG00RlozUT09--c6f3880a4ca63a84887d346889b11b56a82dd98f', 'scheduleWindow', 'height=650,width=1199,left=200,top=100`');
        if (window.focus) {
            newwindow.focus();
        }
        return false;
    }

    public mouseEnteredOnCompanyName(i: number) {
        this.hoveredIndx = i;
    }

    /**
     * Mouse leave handler for all modules label to hide the popover
     *
     * @param {*} event Mouse leave event
     * @memberof HeaderComponent
     */
    public handleAllModulesLeaveEvent(event: any): void {
        const menu = document.getElementById('other_sub_menu');
        const targetElement = event.toElement || event.relatedTarget;
        if (menu && !menu.contains(targetElement)) {
            // Hide 'All Modules' popover if the mouse points to any element other than sub menu as target
            this.allModulesPopover.hide();
        }
    }

    public onCompanyShown(sublist, navigator) {
        if (sublist.children[1]) {
            navigator.add(sublist.children[1]);
            navigator.nextVertical();
        }
    }

    public switchCompanyMenuShown() {
        if (this.searchCmpTextBox && this.searchCmpTextBox.nativeElement) {
            setTimeout(() => this.searchCmpTextBox.nativeElement.focus(), 200);
        }
    }

    private doEntryInDb(entity: string, item: IUlist, fromInvalidState: { next: IUlist, previous: IUlist } = null) {
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
            this._dbService.addItem(this.activeCompanyForDb.uniqueName, entity, item, fromInvalidState, isSmallScreen,
                this.currentOrganizationType === OrganizationType.Company && branches.length > 1).then((res) => {
                this.findListFromDb(res);
            }, (err: any) => {
                console.log('%c Error: %c ' + err + '', 'background: #c00; color: #ccc', 'color: #333');
            });
        }
    }

    private unsubscribe() {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
    }

    private adjustNavigationBar() {
        this.sideBarStateChange(this.isLargeWindow);
    }

    public showNavigationModal() {
        this.navigationModalVisible = true;
        const _combine = combineLatest([
            this.modalService.onShow,
            this.modalService.onShown,
            this.modalService.onHide,
            this.modalService.onHidden
        ]).pipe(takeUntil(this.destroyed$)).subscribe(() => this.changeDetection.markForCheck());

        this.subscriptions.push(
            this.modalService.onShow.pipe(takeUntil(this.destroyed$)).subscribe((reason: string) => {
            })
        );
        this.subscriptions.push(
            this.modalService.onShown.pipe(takeUntil(this.destroyed$)).subscribe((reason: string) => {
                //
            })
        );
        this.subscriptions.push(
            this.modalService.onHide.pipe(takeUntil(this.destroyed$)).subscribe((reason: string) => {
                //
            })
        );
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

    private getElectronAppVersion() {
        this.authService.GetElectronAppVersion().pipe(take(1)).subscribe((res: string) => {
            if (res && typeof res === 'string') {
                let version = res.split('files')[0];
                let versNum = version.split(' ')[1];
                this.apkVersion = versNum;
            }
        });
    }

    private getReadableNameFromUrl(url) {
        let name = '';
        switch (url) {
            case 'SETTINGS?TAB=PERMISSION&TABINDEX=5':
                name = 'Settings > Permission';
                break;
            case 'user-details/profile':
                name = 'User Details';
                break;
            case 'inventory-in-out':
                name = 'Inventory In/Out';
                break;
            case 'import/select-type':
                name = 'Import Data';
                break;
            default:
                name = url;
        }
        return name;
    }

    public getStates(countryCode) {
        if (countryCode !== undefined && countryCode !== null && countryCode !== "") {
            let statesRequest = new StatesRequest();
            statesRequest.country = countryCode;
            this.store.dispatch(this._generalActions.getAllState(statesRequest));
        }
    }

    public removeCompanySessionData() {
        this.generalService.createNewCompany = null;
        this.store.dispatch(this.commonActions.resetCountry());
        this.store.dispatch(this.companyActions.removeCompanyCreateSession());
    }

    public setCurrentPage() {
        let currentUrl = this.router.url;

        if (currentUrl.includes('/ledger')) {
            let currentPageObj = new CurrentPage();
            currentPageObj.name = "";
            currentPageObj.url = currentUrl;
            currentPageObj.additional = "";
            this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
        } else {
            NAVIGATION_ITEM_LIST.find((page) => {
                if (page.uniqueName === decodeURI(currentUrl)) {
                    this.setCurrentPageTitle(page);
                    return true;
                }
            });
        }
    }

    public setCurrentPageTitle(menu) {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = menu.name;
        currentPageObj.url = menu.uniqueName;
        currentPageObj.additional = menu.additional;
        this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
    }

    public setCurrentAccountNameInHeading() {
        this.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe(acc => {
            if (acc) {
                this.isLedgerAccSelected = true;
                this.selectedLedgerName = acc.uniqueName;
                if (this.isMobileSite) {
                    this.selectedPage = acc.name;
                } else {
                    this.selectedPage = 'ledger - ' + acc.name;
                }
                return this.navigateToUser = false;
            }
        });
    }

    /**
     *To hide calendly model
     *
     * @memberof HeaderComponent
     */
    public hideScheduleCalendlyModel() {
        this.store.dispatch(this._generalActions.isOpenCalendlyModel(false));
    }

    /**
     *To show calendly model
     *
     * @memberof HeaderComponent
     */
    public openScheduleCalendlyModel() {
        this.store.dispatch(this._generalActions.isOpenCalendlyModel(true));
    }

    /**
     * Opens new company modal
     *
     * @memberof HeaderComponent
     */
    public createNewCompany(): void {
        this.removeCompanySessionData();
        this.showAddCompanyModal();
    }


    /**
     * Fetches whether company country has other taxes (TCS/TDS)
     *
     * @private
     * @memberof HeaderComponent
     */
    private checkIfCompanyTcsTdsApplicable(): void {
        const request: OnboardingFormRequest = {
            country: (this.activeCompany && this.activeCompany.countryV2) ? this.activeCompany.countryV2.alpha2CountryCode : '',
            formName: 'otherTaxes'
        };
        this.commonService.getOnboardingForm(request).pipe(take(1)).subscribe((response) => {
            if (response && response.status === 'success' && response.body) {
                this.store.dispatch(this.companyActions.setCompanyTcsTdsApplicability(response.body.isTcsTdsApplicable))
            } else {
                // Set to false in error scenarios
                this.store.dispatch(this.companyActions.setCompanyTcsTdsApplicability(false));
            }
        }, () => {
            // Set to false in error scenarios
            this.store.dispatch(this.companyActions.setCompanyTcsTdsApplicability(false));
        });
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        this.toggleSidebarPane(false, false);
    }

    /**
     * This will add the page-has-tabs class to body if the page has tabs
     *
     * @memberof HeaderComponent
     */
    public addClassInBodyIfPageHasTabs(): void {
        this.toggleSidebarPane(false, false);
        this.toggleHelpSupportPane(false);
        setTimeout(() => {
            if (document.getElementsByClassName("setting-data") && document.getElementsByClassName("setting-data").length > 0) {
                this.sideBarStateChange(true);
                document.querySelector('body').classList.add('on-setting-page');
                document.querySelector('body').classList.remove('page-has-tabs');
                document.querySelector('body').classList.remove('on-user-page');
            } else if (document.getElementsByClassName("user-detail-page") && document.getElementsByClassName("user-detail-page").length > 0) {
                document.querySelector('body').classList.add('on-user-page');
                document.querySelector('body').classList.remove('page-has-tabs');
                document.querySelector('body').classList.remove('on-setting-page');
                document.querySelector('body').classList.remove('mobile-setting-sidebar');
            } else if (document.getElementsByTagName("tabset") && document.getElementsByTagName("tabset").length > 0 && !this.router.url.includes("/vendor")) {
                document.querySelector('body').classList.add('page-has-tabs');
                document.querySelector('body').classList.remove('on-setting-page');
                document.querySelector('body').classList.remove('on-user-page');
                document.querySelector('body').classList.remove('mobile-setting-sidebar');
            }
            else {
                document.querySelector('body').classList.remove('page-has-tabs');
                document.querySelector('body').classList.remove('on-setting-page');
                document.querySelector('body').classList.remove('on-user-page');
                document.querySelector('body').classList.remove('mobile-setting-sidebar');
            }
        }, 500);

        }

    /**
     * This will show the datepicker
     *
     * @memberof ProfitLossComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
            if (!this.isMobileSite && this.dateFieldPosition) {
                this.dateFieldPosition.x -= 150;
            }
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-xl giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: this.isMobileSite })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof ProfitLossComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ProfitLossComponent
     */
    public dateSelectedCallback(value?: any): void {
        if(value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        if (value && value.startDate && value.endDate) {
            this.hideGiddhDatepicker();
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            let dates = {
                fromDate: this.fromDate,
                toDate: this.toDate,
            };
            this.isTodaysDateSelected = false;
            this.store.dispatch(this.companyActions.SetApplicationDate(dates));
        } else {
            this.isTodaysDateSelected = true;
            let today = cloneDeep([moment(), moment()]);

            this.selectedDateRange = { startDate: moment(today[0]), endDate: moment(today[1]) };
            // this.selectedDateRangeUi = moment(today[0]).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.selectedDateRangeUi = "Today";
            let dates = {
                fromDate: null,
                toDate: null,
                duration: null,
                period: null,
                noOfTransactions: null
            };
            this.store.dispatch(this.companyActions.SetApplicationDate(dates));
        }
    }

    /**
     * This will navigate user to mobile home page
     *
     * @memberof HeaderComponent
     */
    public redirectToMobileHome(): void {
        this.router.navigate(['/pages/mobile-home']);
    }

    /**
     * This will stop the body scroll if company dropdown is open
     *
     * @memberof HeaderComponent
     */
    public toggleBodyScroll(): void {
        if (this.companyDropdown.isOpen && !this.isMobileSite) {
            document.querySelector('body').classList.add('prevent-body-scroll');
        } else {
            document.querySelector('body').classList.remove('prevent-body-scroll');
        }
    }

    /**
     * Navigate to all module
     *
     * @memberof HeaderComponent
     */
    public navigateToAllModules(): void {
        this.router.navigate(['/pages/all-modules']);
    }

    /**
     * Loads company branches
     *
     * @memberof HeaderComponent
     */
    public loadCompanyBranches(): void {
        if (this.generalService.companyUniqueName) {
            // Avoid API call if new user is onboarded
            this.store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
        }
    }

    /**
     * This will init the notification on window orientation change
     *
     * @param {*} event
     * @memberof HeaderComponent
     */
    @HostListener('window:orientationchange', ['$event'])
    onOrientationChange(event) {
        if(window['Headway'] !== undefined) {
            window['Headway'].init();
        }
    }

    /**
     * This will init the notification on window resize
     *
     * @param {*} event
     * @memberof HeaderComponent
     */
    @HostListener('window:resize', ['$event'])
    windowResize(event) {
        if(window['Headway'] !== undefined) {
            window['Headway'].init();
        }
    }

    /**
     * Navigates to previous page
     *
     * @memberof HeaderComponent
     */
    public navigateToPreviousRoute(): void {
        if (document.referrer) {
            this.location.back();
        } else {
            this.router.navigate(['/pages/home']);
        }
    }

    /**
     * Sets the organization details
     *
     * @private
     * @param {OrganizationType} type Type of the organization
     * @param {OrganizationDetails} branchDetails Branch details of an organization
     * @memberof HeaderComponent
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
     * To get latest version of mac app
     *
     * @private
     * @memberof HeaderComponent
     */
    private getElectronMacAppVersion(): void {
        this.authService.getElectronMacAppVersion().pipe(take(1)).subscribe((res: string) => {
            if (res && typeof res === 'string') {
                let version = res.split('files')[0];
                let versNum = version.split(' ')[1];
                this.macAppVersion = versNum;
            }
        })
    }
    /**
     * This function will check if page has tabs to show/hide page heading
     *
     * @memberof HeaderComponent
     */
    public checkIfPageHasTabs(): void | boolean {
        this.pageHasTabs = false;
        let currentUrl = this.router.url;

        NAVIGATION_ITEM_LIST.find((page) => {
            if (page.uniqueName === decodeURI(currentUrl) && page.hasTabs === true) {
                this.pageHasTabs = true;
                return true;
            }
        });
    }

    /**
     * This will check and renew user session if close to expiry
     *
     * @memberof HeaderComponent
     */
    public checkAndRenewUserSession(): void {
        this.store.pipe(select(state => state.session.user), take(1)).subscribe((user) => {
            if(user && user.session) {
                let sessionExpiresAt: any = moment(user.session.expiresAt, GIDDH_DATE_FORMAT + " h:m:s");

                if(sessionExpiresAt.diff(moment(), 'hours') < 2) {
                    this.lastSessionRenewalTime = moment();
                    this.store.dispatch(this.loginAction.renewSession());
                } else {
                    this.lastSessionRenewalTime = moment();
                }
            }
        });
    }
}
