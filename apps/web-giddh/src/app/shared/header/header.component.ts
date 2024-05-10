import { Observable, of as observableOf, ReplaySubject, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from './../helpers/defaultDateFormat';
import { ManageGroupsAccountsComponent } from './components';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, ElementRef, EventEmitter, HostListener, NgZone, OnDestroy, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ModalDirective, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AppState } from '../../store';
import { LoginActions } from '../../actions/login.action';
import { CompanyActions } from '../../actions/company.actions';
import { CommonActions } from '../../actions/common.actions';
import { CompanyCountry, CompanyCreateRequest, CompanyResponse, StatesRequest, Organization, StateDetailsRequest, OrganizationDetails } from '../../models/api-models/Company';
import { UserDetails } from '../../models/api-models/loginModels';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { NavigationEnd, NavigationError, NavigationStart, RouteConfigLoadEnd, Router } from '@angular/router';
import { ElementViewContainerRef } from '../helpers/directives/elementViewChild/element.viewchild.directive';
import { GeneralActions } from '../../actions/general/general.actions';
import { createSelector } from 'reselect';
import * as dayjs from 'dayjs';
import { AuthenticationService } from '../../services/authentication.service';
import { ICompAidata, IUlist } from '../../models/interfaces/ulist.interface';
import { clone, cloneDeep, slice, find } from '../../lodash-optimized';
import { DbService } from '../../services/db.service';
import { CompAidataModel } from '../../models/db';
import { AccountResponse, AddAccountRequest } from 'apps/web-giddh/src/app/models/api-models/Account';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { DEFAULT_AC, NAVIGATION_ITEM_LIST, reassignNavigationalArray } from '../../models/default-menus';
import { userLoginStateEnum, OrganizationType } from '../../models/user-login-state';
import { SubscriptionsUser } from '../../models/api-models/Subscriptions';
import { environment } from 'apps/web-giddh/src/environments/environment';
import { CurrentPage, OnboardingFormRequest } from '../../models/api-models/Common';
import { CALENDLY_URL, GIDDH_DATE_RANGE_PICKER_RANGES, ROUTES_WITH_HEADER_BACK_BUTTON, VAT_SUPPORTED_COUNTRIES } from '../../app.constant';
import { CommonService } from '../../services/common.service';
import { Location } from '@angular/common';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { CompanyService } from '../../services/company.service';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { SettingsProfileActions } from '../../actions/settings/profile/settings.profile.action';
import { LedgerActions } from '../../actions/ledger/ledger.actions';
import { LocaleService } from '../../services/locale.service';
import { SettingsFinancialYearActions } from '../../actions/settings/financial-year/financial-year.action';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { AuthService } from '../../theme/ng-social-login-module';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SalesActions } from '../../actions/sales/sales.action';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
    public userIsSuperUser: boolean = true; // Protect permission module
    public session$: Observable<userLoginStateEnum>;
    public accountSearchValue: string = '';
    public companyDomains: string[] = ['walkover.in', 'giddh.com', 'muneem.co', 'msg91.com'];
    public dayjs = dayjs;
    public imgPath: string = '';
    public subscribedPlan: SubscriptionsUser;
    public isLedgerAccSelected: boolean = false;
    /* This will hold the help popup dialog ref */
    public asideHelpSupportDialogRef: MatDialogRef<any>;
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideSettingMenuState: string = 'out';
    /*This will check if page has not tabs*/
    public pageHasTabs: boolean = false;

    @Output() public menuStateChange: EventEmitter<boolean> = new EventEmitter();

    @ViewChild('companyadd', { static: true }) public companyadd: ElementViewContainerRef;
    @ViewChild('companynewadd', { static: true }) public companynewadd: ElementViewContainerRef;
    @ViewChild('addmanage', { static: true }) public addmanage: ElementViewContainerRef;
    @ViewChild('manageGroupsAccountsModal', { static: true }) public manageGroupsAccountsModal: ModalDirective;
    @ViewChild('addCompanyModal', { static: true }) public addCompanyModal: ModalDirective;
    @ViewChild('navigationModal', { static: true }) public navigationModal: TemplateRef<any>; // CMD + K
    @ViewChild('dateRangePickerCmp', { static: true }) public dateRangePickerCmp: ElementRef;
    @ViewChild('dropdown', { static: true }) public companyDropdown: BsDropdownDirective;
    /** Switch branch dropdown */
    @ViewChild('subBranchDropdown', { static: false }) public subBranchDropdown: BsDropdownDirective;
    @ViewChild('supportTab', { static: true }) public supportTab: TabsetComponent;
    @ViewChild('searchCmpTextBox', { static: true }) public searchCmpTextBox: ElementRef;
    @ViewChild('expiredPlan', { static: true }) public expiredPlan: ModalDirective;
    @ViewChild('expiredPlanModel', { static: true }) public expiredPlanModel: TemplateRef<any>;
    @ViewChild('crossedTxLimitModel', { static: true }) public crossedTxLimitModel: TemplateRef<any>;
    @ViewChild('companyDetailsDropDownWeb', { static: true }) public companyDetailsDropDownWeb: BsDropdownDirective;
    /** All modules popover instance */
    @ViewChild('allModulesPopover', { static: true }) public allModulesPopover: PopoverDirective;
    /** Instance of mat dialog */
    @ViewChild('asideHelpSupportMenuStateRef', { static: true }) public asideHelpSupportMenuStateRef: TemplateRef<any>;
    /** Instance of menu trigger */
    @ViewChild(MatMenuTrigger) public trigger: MatMenuTrigger;

    public hideAsDesignChanges: boolean = false;
    public title: Observable<string>;
    public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
    public noGroups: boolean;
    public sideMenu: { isopen: boolean, isExpanded: boolean } = { isopen: false, isExpanded: false };
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
    public isMobileSite: boolean;
    public currentCompanyPlanAmount: any;
    public companyCountry: CompanyCountry = {
        baseCurrency: '',
        country: ''
    };
    public currentState: any = '';
    public forceOpenNavigation: boolean = false;
    /** True, if GST side menu is opened in responsive mode */
    public isGstSideMenuOpened: boolean = false;
    /** VAT supported countries to show the Vat Report section in all modules */
    public vatSupportedCountries = VAT_SUPPORTED_COUNTRIES;
    @ViewChild('datepickerTemplate', { static: true }) public datepickerTemplate: TemplateRef<any>;

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
    /** Hold plan version  */
    public planVersion: number;

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
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This holds the active locale */
    public activeLocale: string = "";
    /** True if sidebar is expanded */
    public isSidebarExpanded: boolean = false;
    /** This will hold if setting icon is disabled */
    public isSettingsIconDisabled: boolean = false;
    /* This will hold if resolution is 768 consider as ipad screen */
    public isIpadScreen: boolean = false;
    /** True if sidebar is forcely expanded */
    public sidebarForcelyExpanded: boolean = false;
    /** True if calendly model is activated */
    public isCalendlyModelActivate: boolean = false;
    /** Calendly url */
    public calendlyUrl: any = '';
    /* True if it is redirect to go to branch mode */
    public isGoToBranch: boolean = false;
    /** Stores the voucher API version of current company */
    public voucherApiVersion: 1 | 2;
    /** This will show/hide account sidepan */
    public accountAsideMenuState: string = 'out'
    /** This will hold group unique name from CMD+k for creating account */
    public selectedGroupForCreateAccount: any = '';
    /** Cmd + k Dailog Reference */
    public commandkDialogRef: MatDialogRef<any>;
    /** True, if login is made with social account */
    public isLoggedInWithSocialAccount$: Observable<boolean>;
    /* True if we need to show Depreciation Message */
    public showDepreciationMessage: boolean = false;
    /* True if we need to show header according to has subscription permission */
    public hasSubscriptionPermission: boolean = false;
    /** True if it's a subscription page */
    public isSubscriptionPage: boolean = false;

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
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private groupWithAccountsAction: GroupWithAccountsAction,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private zone: NgZone,
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
        private ledgerAction: LedgerActions,
        public location: Location,
        private localeService: LocaleService,
        private settingsFinancialYearActions: SettingsFinancialYearActions,
        private sanitizer: DomSanitizer,
        public dialog: MatDialog,
        private socialAuthService: AuthService,
        private salesAction: SalesActions
    ) {
        this.calendlyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(CALENDLY_URL);
        // Reset old stored application date
        this.store.dispatch(this.companyActions.ResetApplicationDate());
        this.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));

        // SETTING CURRENT PAGE ON INIT
        this.setCurrentPage();
        this.checkIfPageHasTabs();

        // SETTING CURRENT PAGE ON ROUTE CHANGE
        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationStart) {
                if ((event.url.includes("/pages/settings") || event.url.includes("/gstfiling") || event.url.includes("/pages/user-details") || event.url.includes("/billing-detail")) && !this.generalService.getSessionStorage("previousPage")) {
                    this.generalService.setSessionStorage("previousPage", this.currentPageUrl);
                }

                if (!event.url.includes("/pages/settings") && !event.url.includes("/gstfiling") && !event.url.includes("/pages/user-details") && !event.url.includes("/billing-detail") && this.generalService.getSessionStorage("previousPage")) {
                    this.generalService.removeSessionStorage("previousPage");
                }
                if (this.subBranchDropdown) {
                    this.subBranchDropdown.hide();
                }
                this.addClassInBodyIfPageHasTabs();
            }
            if (event instanceof NavigationEnd) {
                if (!this.router.url.includes("/pages/settings") && !this.router.url.includes("/pages/user-details") && !this.router.url.includes("/billing-detail")) {
                    this.currentPageUrl = this.router.url;
                }

                if (this.router.url.includes("/pages/subscription")) {
                    this.isSubscriptionPage = true;
                } else {
                    this.isSubscriptionPage = false;
                }

                this.setCurrentPage();
                this.addClassInBodyIfPageHasTabs();
                this.checkIfPageHasTabs();

                if (this.router.url.includes("/ledger")) {
                    this.currentState = this.router.url;
                    this.setCurrentAccountNameInHeading();
                }

                if (!this.lastSessionRenewalTime || (this.lastSessionRenewalTime && this.lastSessionRenewalTime.diff(dayjs(), 'hours') >= 2)) {
                    this.checkAndRenewUserSession();
                }

                this.toggleSidebarPane(false, false);
                this.saveLastState();
            }
            if (event instanceof NavigationStart) {
                this.navigationEnd = false;
            }
            if (event instanceof NavigationError || event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd) {
                this.navigationEnd = true;
            }

            setTimeout(() => {
                if (this.isElectron) {
                    this.toggleSidebarPane(false, false);
                }
            }, 100);
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
                            this.currentBranch = response.find(branch => (branch?.uniqueName === this.generalService.currentBranchUniqueName));
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

        this.currentCompanyBranches$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && this.currentOrganizationType === OrganizationType.Branch) {
                const unarchivedBranches = response.filter(branch => !branch.isArchived);
                if (!unarchivedBranches?.length) {
                    const type = OrganizationType.Company;
                    const organization: Organization = {
                        type,
                        uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
                        details: {
                            branchDetails: {
                                uniqueName: ''
                            }
                        }
                    };
                    this.store.dispatch(this.companyActions.setCompanyBranch(organization));
                    this.store.dispatch(this.loginAction.ChangeCompany(this.activeCompany?.uniqueName, false));
                }
            }
        });

        this.store.pipe(select(state => state.settings.updateProfileSuccess), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getCurrentCompanyData();
            }
        });

        this.store.pipe(select((state: AppState) => state.session.companies), takeUntil(this.destroyed$)).subscribe(companies => {
            if (!companies || companies?.length === 0) {
                return;
            }

            let orderedCompanies = _.orderBy(companies, 'name');
            this.companyList = orderedCompanies;
            this.companyListForFilter = orderedCompanies;
            this.companies$ = observableOf(orderedCompanies);
            this.store.dispatch(this.companyActions.setTotalNumberofCompanies(this.companyList?.length));
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
            if (selectedCmp) {
                this.selectedCompany = observableOf(selectedCmp);
                this.selectedCompanyDetails = selectedCmp;
                this.generalService.voucherApiVersion = selectedCmp.voucherVersion;
                // for voucher company message
                this.voucherApiVersion = this.generalService.voucherApiVersion;
                if (this.voucherApiVersion === 1) {
                    this.showDepreciationMessage = true;
                    document.querySelector("body")?.classList?.add("depreciation-message");
                } else {
                    this.showDepreciationMessage = false;
                    document.querySelector("body")?.classList?.remove("depreciation-message");
                }
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

        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response;
                if (this.generalService.currentBranchUniqueName) {
                    this.currentBranch = response.find(branch =>
                        (this.generalService.currentBranchUniqueName === branch?.uniqueName)) || {};

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

        this.store.pipe(select(state => state.settings.freePlanSubscribed), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.store.dispatch(this.settingsProfileAction.handleFreePlanSubscribed(false));
                this.getCurrentCompanyData();
            }
        });

        this.store.pipe(select(state => state.general.isCalendlyModelOpen), takeUntil(this.destroyed$)).subscribe(response => {
            this.isCalendlyModelActivate = response;
        });

        this.loadCompanyBranches();
    }

    public ngOnInit() {
        this.store.dispatch(this.settingsFinancialYearActions.GetAllFinancialYears());
        this.isLoggedInWithSocialAccount$ = this.store.pipe(select(state => state.login.isLoggedInWithSocialAccount), takeUntil(this.destroyed$));
        this.store.pipe(select(appStore => appStore.general.menuItems), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                let branches = [];
                this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(data => {
                    branches = data || [];
                });
                reassignNavigationalArray(this.isMobileSite, this.generalService.currentOrganizationType === OrganizationType.Company && branches?.length > 1, response);
                this.apiMenuItems = response;
                this.changeDetection.detectChanges();
            }
        });

        this.getCurrentCompanyData();
        this._breakpointObserver.observe([
            '(max-width: 768px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isIpadScreen = result?.breakpoints['(max-width: 768px)'];
        });

        //this.sideBarStateChange(true);
        this.store.pipe(select(state => state.general.openSideMenu), takeUntil(this.destroyed$)).subscribe(response => {
            this.sideBarStateChange(response);

            if (response) {
                this.expandSidebar(true);
            } else {
                this.collapseSidebar(true);
            }
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
                let userEmailDomain = userEmail?.replace(/.*@/, '');
                this.userIsCompanyUser = userEmailDomain && this.companyDomains?.indexOf(userEmailDomain) !== -1;
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
        this.manageGroupsAccountsModal?.onHidden.pipe(takeUntil(this.destroyed$)).subscribe(e => {
            this.store.dispatch(this.groupWithAccountsAction.resetAddAndMangePopup());
        });

        // region subscribe to last state for showing title of page this.selectedPage
        this.store.pipe(select(s => s.session.lastState), take(1)).subscribe(s => {
            this.isLedgerAccSelected = false;
            const lastState = s?.toLowerCase();

            let lastStateHaveParams: boolean = lastState.includes('?');
            if (lastStateHaveParams) {
                let tempParams = lastState.substr(lastState.lastIndexOf('?'));
                let urlParams = new URLSearchParams(tempParams);
                let queryParams: any = {};
                urlParams.forEach((val, key) => {
                    queryParams[key] = val;
                });

                let route = NAVIGATION_ITEM_LIST.find((page) => {
                    if (!page?.additional) {
                        return;
                    }
                    return (page?.uniqueName.substring(7, page?.uniqueName?.length)?.indexOf(lastState?.replace(tempParams, '')) > -1
                        && page.additional.tabIndex === Number(queryParams.tabindex));
                });

                if (route) {
                    return;
                }
            } else {
                if (lastState.includes('ledger/')) {
                    let isDestroyed: Subject<boolean> = new Subject<boolean>();
                    isDestroyed.next(false);
                    this.activeAccount$.pipe(takeUntil(isDestroyed)).subscribe(acc => {
                        if (acc) {
                            this.isLedgerAccSelected = true;
                            const lastStateArray = lastState.split('/');
                            this.selectedLedgerName = lastStateArray[lastStateArray?.length - 1];
                            isDestroyed.next(true);
                            isDestroyed.complete();
                            return this.navigateToUser = false;
                        }
                    });
                }
            }
        });
        // endregion

        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

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
                this.manageGroupsAccountsModal?.show();
            } else {
                this.manageGroupsAccountsModal?.hide();
            }
        });

        this.store.pipe(select(s => s.general.headerTitle)).pipe(takeUntil(this.destroyed$)).subscribe(menu => {
            if (menu) {
                let menuItem: IUlist = NAVIGATION_ITEM_LIST.find(item => {
                    if (menu.additional && item.additional) {
                        return item?.uniqueName?.toLowerCase() === menu.uniqueName?.toLowerCase() && item.additional.tabIndex === menu.additional.tabIndex;
                    }
                    return item?.uniqueName.toLocaleLowerCase() === menu.uniqueName?.toLowerCase();
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
            this._dbService.getAllItems(this.activeCompanyForDb?.uniqueName, 'accounts').subscribe(accountList => {
                if (accountList?.length) {
                    if (window.innerWidth > 1440 && window.innerHeight > 717) {
                        this.accountItemsFromIndexDB = accountList.slice(0, 7);
                    } else {
                        this.accountItemsFromIndexDB = accountList.slice(0, 5);
                    }
                }
            });
        }

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if (this.activeLocale && this.activeLocale !== response?.value) {
                this.localeService.getLocale('header', response?.value).subscribe(response => {
                    this.localeData = response;
                });
            }
            this.activeLocale = response?.value;
        });

        this.store.pipe(select(state => state.session.commonLocaleData), takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                this.commonLocaleData = response;

                if (this.isTodaysDateSelected) {
                    this.selectedDateRangeUi = this.commonLocaleData?.app_today;
                }
            }
        });
    }

    /**
     * This will get the current company data
     *
     * @memberof HeaderComponent
     */
    public getCurrentCompanyData(): void {
        this.settingsProfileService.GetProfileInfo().pipe(take(1)).subscribe((response: any) => {
            if (response && response.status === "success" && response.body) {
                this.planVersion = response.body.planVersion;
                this.store.dispatch(this.settingsProfileAction.handleCompanyProfileResponse(response));
                let res = response.body;
                this.store.dispatch(this.companyActions.setActiveCompanyData(res));

                if (res?.countryV2 !== null && res?.countryV2 !== undefined) {
                    this.getStates(res?.countryV2.alpha2CountryCode);
                    this.store.dispatch(this.commonActions.resetOnboardingForm());
                }
                if (res.subscription) {
                    if (res?.baseCurrency) {

                        this.companyCountry.baseCurrency = res?.baseCurrency;
                        this.companyCountry.country = res.country;
                        this.store.dispatch(this.companyActions.setCurrentCompanyCurrency(this.companyCountry));
                    }

                    this.currentCompanyPlanAmount = res.subscription.planDetails.amount;
                    this.subscribedPlan = res.subscription;

                    if (this.subscribedPlan?.expiry) {
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
        /* TO SHOW NOTIFICATIONS */
        if (window['Headway'] === undefined) {
            let scriptTag = document.createElement('script');
            scriptTag.src = 'https://cdn.headwayapp.co/widget.js';
            scriptTag.type = 'text/javascript';
            scriptTag.defer = true;
            document.body.appendChild(scriptTag);
        } else {
            window['Headway'].init();
        }
        /* TO SHOW NOTIFICATIONS */

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
                    window.location.href = (environment.production) ? `https://stage.giddh.com/login` : `https://test.giddh.com/login`;
                }
            } else if (s === userLoginStateEnum.newUserLoggedIn) {

                this.zone.run(() => {
                    this.store.pipe(select(state => state.session.user), take(1)).subscribe(response => this.hasSubscriptionPermission = response?.user?.hasSubscriptionPermission);
                    if (this.hasSubscriptionPermission) {
                        this.router.navigate(['/pages/subscription']);
                    } else {
                        this.router.navigate(['/pages/subscription/buy-plan']);
                    }
                });
            } else if (s === userLoginStateEnum.userLoggedIn) {
                if (this.generalService.getUtmParameter("companyUniqueName")) {
                    this.store.dispatch(this.companyActions.resetActiveCompanyData());
                    this.generalService.companyUniqueName = this.generalService.getUtmParameter("companyUniqueName");
                    this.generalService.voucherApiVersion = Number(this.generalService.getUtmParameter("voucherApiVersion")) === 1 ? 1 : 2;
                    const branchDetails = {
                        branchDetails: {
                            uniqueName: ""
                        }
                    };
                    const type = OrganizationType.Company;
                    const organization: Organization = {
                        type,
                        uniqueName: this.generalService.getUtmParameter("companyUniqueName"),
                        details: branchDetails
                    };
                    this.store.dispatch(this.companyActions.setCompanyBranch(organization));
                    this.store.dispatch(this.loginAction.ChangeCompany(this.generalService.getUtmParameter("companyUniqueName"), true));
                    this.generalService.removeLocalStorageParameter("companyUniqueName");
                    this.generalService.removeLocalStorageParameter("voucherApiVersion");
                }
            }
        });

        this.store.dispatch(this.loginAction.FetchUserDetails());

        // Get universal date
        this.store.pipe(select(createSelector([(state: AppState) => state.session.applicationDate], (dateObj: Date[]) => {
            if (dateObj && dateObj.length) {
                this.isTodaysDateSelected = !dateObj[3];  //entry-setting API date response in case of today fromDate/toDate will be null
                if (this.isTodaysDateSelected) {
                    let today = cloneDeep([dayjs(), dayjs()]);
                    this.selectedDateRange = { startDate: dayjs(today[0]), endDate: dayjs(today[1]) };
                    this.selectedDateRangeUi = this.commonLocaleData?.app_today;
                } else {
                    this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                    this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.isDateRangeSelected = true;
                }

                this.store.pipe(select(state => state.settings?.financialYears), takeUntil(this.destroyed$)).subscribe(response => {
                    if (response?.financialYears?.length > 0) {
                        let activeFinancialYear = {
                            uniqueName: response.financialYears[response.financialYears.length - 1]?.uniqueName,
                            isLocked: response.financialYears[response.financialYears.length - 1]?.isLocked,
                            financialYearStarts: dayjs(response.financialYears[response.financialYears.length - 1]?.financialYearStarts, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT),
                            financialYearEnds: dayjs(response.financialYears[response.financialYears.length - 1]?.financialYearEnds, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT)
                        };

                        if (!this.isTodaysDateSelected) {
                            response.financialYears.forEach(key => {
                                if (this.selectedDateRange?.endDate >= dayjs(key.financialYearStarts, GIDDH_DATE_FORMAT) && this.selectedDateRange?.endDate <= dayjs(key.financialYearEnds, GIDDH_DATE_FORMAT)) {
                                    activeFinancialYear = {
                                        uniqueName: key?.uniqueName,
                                        isLocked: key.isLocked,
                                        financialYearStarts: dayjs(key.financialYearStarts, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT),
                                        financialYearEnds: dayjs(key.financialYearEnds, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT)
                                    };
                                }
                            });
                        }

                        if (this.selectedCompanyDetails) {
                            this.selectedCompanyDetails.activeFinancialYear = activeFinancialYear;
                            this.store.dispatch(this.commonActions.setActiveFinancialYear(this.selectedCompanyDetails));
                        }
                    }
                });
            }
        })), takeUntil(this.destroyed$)).subscribe();
    }

    public ngAfterViewChecked() {
        this.changeDetection.detectChanges();
    }

    /**
     * This will toggle the help popup
     *
     * @param {boolean} show
     * @memberof HeaderComponent
     */
    public toggleHelpSupportPane(event: boolean): void {
        if (event) {
            if (this.asideHelpSupportDialogRef?.id && this.dialog.getDialogById(this.asideHelpSupportDialogRef?.id)) {
                this.asideHelpSupportDialogRef?.close();
            } else {
                this.asideHelpSupportDialogRef = this.dialog.open(this.asideHelpSupportMenuStateRef, {
                    width: '1000px',
                    hasBackdrop: false,
                    position: {
                        right: '0',
                        top: '0'
                    }
                });
            }
        } else {
            this.asideHelpSupportDialogRef?.close();
        }
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
            if (show) {
                this.asideHelpSupportDialogRef?.close();
            }
            this.asideSettingMenuState = (show) ? 'in' : 'out';

            if (this.asideSettingMenuState === "in") {
                document.querySelector('body')?.classList?.add('aside-setting');
            } else {
                document.querySelector('body')?.classList?.remove('aside-setting');
            }

            if (this.asideSettingMenuState === "in") {
                document.querySelector('body').classList.add('mobile-setting-sidebar');
            } else {
                document.querySelector('body').classList.remove('mobile-setting-sidebar');
            }
        }, ((this.asideSettingMenuState === 'out') ? 100 : 0));
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
                    return item?.uniqueName?.toLowerCase() === pageName?.toLowerCase() && item.additional.tabIndex === queryParamsObj.tabIndex;
                }
            } else {
                return item?.uniqueName.toLocaleLowerCase() === pageName?.toLowerCase();
            }
        });
        if (o) {
            menu = { ...menu, ...o };
        } else {
            try {
                menu.name = pageName.split('/pages/')[1]?.toLowerCase();
                if (!menu.name) {
                    menu.name = pageName.split('/')[1]?.toLowerCase();
                }
            } catch (error) {
                menu.name = pageName?.toLowerCase();
            }
            menu.name = this.getReadableNameFromUrl(menu.name);
            menu.uniqueName = pageName?.toLowerCase();
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

    public findListFromDb(dbResult: ICompAidata) {
        if (!this.activeCompanyForDb) {
            return;
        }
        if (!this.activeCompanyForDb?.uniqueName) {
            return;
        }
        if (dbResult) {
            // slice menus
            if (window.innerWidth > 1440 && window.innerHeight > 717) {
                this.accountItemsFromIndexDB = (dbResult && dbResult?.aidata) ? slice(dbResult.aidata.accounts, 0, 7) : [];
            } else {
                this.accountItemsFromIndexDB = (dbResult && dbResult?.aidata) ? slice(dbResult.aidata.accounts, 0, 5) : [];
            }
        } else {
            // slice default menus and account on small screen
            if (!(window.innerWidth > 1440 && window.innerHeight > 717)) {
                this.accountItemsFromIndexDB = slice(this.accountItemsFromIndexDB, 0, 5);
            }
        }
    }

    public showManageGroupsModal(search: any = "") {
        this.toggleHelpSupportPane(false);
        this.store.dispatch(this.groupWithAccountsAction.OpenAddAndManageFromOutside(search));
    }

    public hideManageGroupsModal() {
        this.store.pipe(select(c => c.session.lastState), take(1)).subscribe((s: string) => {
            if (s && (s.indexOf('ledger/') > -1 || s.indexOf('settings') > -1) && this.selectedLedgerName) {
                this.store.dispatch(this.ledgerAction.GetLedgerAccount(this.selectedLedgerName));
            }
        });

        this.manageGroupsAccountsModal.hide();
    }



    public onHide() {
        this.store.dispatch(this.companyActions.ResetCompanyPopup());
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
        this.isGoToBranch = false;
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
        let excludeElements = ['icon-bar', 'hamburger-menu', 'refresh-manually', 'icon-down-new'];
        let elementClass = e?.target?.className?.toString();
        let validElement = true;

        excludeElements.forEach(className => {
            if (elementClass?.indexOf(className) > -1) {
                validElement = false;
            }
        });

        if (validElement && this.isMobileSite) {
            this.sideMenu.isopen = false;
            this.menuStateChange.emit(false);
        }

        if (validElement && !this.isMobileSite && (this.router.url.includes("/pages/settings") || this.router.url.includes("/pages/user-details") || document.getElementsByClassName("voucher-preview-edit")?.length > 0)) {
            this.collapseSidebar(true);
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

    /**
     * This will use for navigae to subitem link
     *
     * @param {*} event
     * @memberof HeaderComponent
     */
    public navigateToSubItemLink(event: any): void {
        if (event) {
            this.trigger?.closeMenu();
            if (this.voucherApiVersion === 2) {
                if (event === 'receiptnote') {
                    this.router.navigate(['/pages/inventory/v2/branch-transfer/receipt-note/create']);
                } else if (event === 'deliverychallan') {
                    this.router.navigate(['/pages/inventory/v2/branch-transfer/delivery-challan/create']);
                } else {
                    this.router.navigate(['/pages' + event]);
                }
            } else {
                if (event === 'deliverychallan' || event === 'receiptnote') {
                    this.router.navigate(['/pages/inventory/report/' + event]);
                } else {
                    this.router.navigate(['/pages' + event]);
                }
            }
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public filterCompanyList(ev) {
        let companies: CompanyResponse[] = [];
        this.companies$?.pipe(take(1)).subscribe(cmps => companies = cmps);

        this.companyListForFilter = companies?.filter((cmp) => {
            if (!cmp?.alias) {
                return cmp?.name?.toLowerCase().includes(ev?.toLowerCase());
            } else {
                return cmp?.name?.toLowerCase().includes(ev?.toLowerCase()) || cmp?.alias?.toLowerCase().includes(ev?.toLowerCase());
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
            this.currentCompanyBranches = branches?.filter(branch => {
                if (!branch?.alias) {
                    return branch?.name?.toLowerCase().includes(branchName?.toLowerCase());
                } else {
                    return branch?.alias.toLowerCase().includes(branchName?.toLowerCase());
                }
            });
        } else {
            this.currentCompanyBranches = branches;
        }
    }

    public closeUserMenu(ev) {
        ev.isopen = false;
        this.companyMenu.isopen = false;
    }

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
        if (this.planVersion === 2 || this.subscribedPlan?.status === 'expired') {
            this.router.navigate(['/pages/subscription/view-subscription/' + this.subscribedPlan?.subscriptionId]);
        } else {
            this.router.navigate(['/pages', 'user-details'], {
                queryParams: {
                    tab: 'subscriptions',
                    tabIndex: 3,
                    showPlans: true
                }
            });
        }
    }

    /**
     * This will use for go to branch mode
     *
     * @memberof HeaderComponent
     */
    public gotToBranchTab(): void {
        this.trigger?.closeMenu();
        this.expandSidebar(false);
        this.isGoToBranch = true;
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
            this.isLedgerAccSelected = false;
        } else if (entity === 'accounts') {
            this.isLedgerAccSelected = true;
            this.selectedLedgerName = item.uniqueName;
        }

        if (this.activeCompanyForDb && this.activeCompanyForDb.uniqueName) {
            let isSmallScreen: boolean = !(window.innerWidth > 1440 && window.innerHeight > 717);
            let branches = [];
            this.store.pipe(select(appStore => appStore.settings.branches), take(1)).subscribe(response => {
                branches = response || [];
            });
            this._dbService.addItem(this.activeCompanyForDb.uniqueName, entity, item, fromInvalidState, isSmallScreen,
                this.currentOrganizationType === OrganizationType.Company && branches?.length > 1).then((res) => {
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

    public getStates(countryCode) {
        if (countryCode !== undefined && countryCode !== null && countryCode !== "") {
            let statesRequest = new StatesRequest();
            statesRequest.country = countryCode;
            this.store.dispatch(this._generalActions.getAllState(statesRequest));
        }
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
                if (page?.uniqueName === decodeURI(currentUrl)) {
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
                    this.selectedPage = this.localeData?.ledger_heading + acc.name;
                }
                return this.navigateToUser = false;
            }
        });
    }

    /**
     * To show schedule now model
     *
     * @memberof HeaderComponent
     */
    public openScheduleModel() {
        this.store.dispatch(this._generalActions.isOpenCalendlyModel(true));
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
        this.toggleHelpSupportPane(false);

        setTimeout(() => {
            if (document.getElementsByClassName("setting-data") && document.getElementsByClassName("setting-data")?.length > 0) {
                document.querySelector('body').classList.add('on-setting-page');
                document.querySelector('body').classList.remove('page-has-tabs');
                document.querySelector('body').classList.remove('on-user-page');
            } else if (document.getElementsByClassName("user-detail-page") && document.getElementsByClassName("user-detail-page")?.length > 0
            ) {
                document.querySelector('body').classList.add('on-user-page');
                document.querySelector('body').classList.remove('page-has-tabs');
                document.querySelector('body').classList.remove('on-setting-page');
                document.querySelector('body').classList.remove('mobile-setting-sidebar');
            } else if (
                document.getElementsByTagName("tabset") &&
                document.getElementsByTagName("tabset").length > 0 &&
                !this.router.url.includes("/vendor")) {
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

            if (document.getElementsByClassName("gst-sidebar-open")?.length > 0 || document.getElementsByClassName("setting-sidebar-open")?.length > 0) {
                this.collapseSidebar(true);
            } else {
                if (this.sideMenu.isopen) {
                    this.sideMenu.isExpanded = true;
                    this.expandSidebar(true);
                }
            }
        }, 500);

    }

    /**
    * This will expand sidebar
    *
    * @memberof HeaderComponent
    */
    public expandSidebar(forceExpand: boolean = false): void {
        if (forceExpand) {
            this.sideBarStateChange(true);
            this.sidebarForcelyExpanded = true;
        }
        this.isSidebarExpanded = true;
        this.generalService.expandSidebar();
    }

    /**
    * This will collpase sidebar
    *
    * @memberof HeaderComponent
    */
    public collapseSidebar(forceCollapse: boolean = false, closeOnHover: boolean = false): void {
        this.isGoToBranch = false;
        if (closeOnHover && this.sidebarForcelyExpanded && (this.router.url.includes("/pages/settings") || this.router.url.includes("/pages/user-details"))) {
            return;
        }

        if (closeOnHover && this.isSidebarExpanded && (document.getElementsByClassName("gst-sidebar-open")?.length > 0 || document.getElementsByClassName("setting-sidebar-open")?.length > 0)) {
            forceCollapse = true;
        }

        if (forceCollapse) {
            this.sideMenu.isExpanded = false;
        } else {
            if (!this.sideMenu.isopen) {
                this.sideMenu.isExpanded = false;
            } else {
                this.sideMenu.isExpanded = true;
            }
        }

        if (!this.sideMenu.isExpanded || forceCollapse) {
            this.sidebarForcelyExpanded = false;
            this.isSidebarExpanded = false;
            this.generalService.collapseSidebar();
        }
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
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        if (value && value.startDate && value.endDate) {
            this.hideGiddhDatepicker();
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            let dates = {
                fromDate: this.fromDate,
                toDate: this.toDate,
            };
            this.isTodaysDateSelected = false;
            this.store.dispatch(this.companyActions.SetApplicationDate(dates));
        } else {
            this.isTodaysDateSelected = true;
            let today = cloneDeep([dayjs(), dayjs()]);

            this.selectedDateRange = { startDate: dayjs(today[0]), endDate: dayjs(today[1]) };
            this.selectedDateRangeUi = this.commonLocaleData?.app_today;

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
     * Loads company branches
     *
     * @memberof HeaderComponent
     */
    public loadCompanyBranches(): void {
        if (this.generalService.companyUniqueName) {
            // Avoid API call if new user is onboarded
            this.store.dispatch(this.settingsBranchAction.GetALLBranches({ from: '', to: '' }));
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
        if (window['Headway'] !== undefined) {
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
        if (window['Headway'] !== undefined) {
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
            if (page?.uniqueName === decodeURI(currentUrl) && page.hasTabs === true) {
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
            if (user && user.session) {
                let sessionExpiresAt: any = dayjs(user.session.expiresAt, GIDDH_DATE_FORMAT + " h:m:s");

                if (sessionExpiresAt.diff(dayjs(), 'hours') < 24) {
                    this.lastSessionRenewalTime = dayjs();
                    this.store.dispatch(this.loginAction.renewSession());
                } else {
                    this.lastSessionRenewalTime = dayjs();
                }
            }
        });
    }

    /**
     * This will return plan end note
     *
     * @returns {string}
     * @memberof HeaderComponent
     */
    public getSubscriptionEndNote(): string {
        let text = this.localeData?.subscription_end_note;
        if (this.planVersion === 2) {
            text = text?.replace("[PLAN_DURATION]", this.subscribedPlan?.duration)?.replace("[PLAN_DURATION_UNIT]", '')?.replace("[PLAN_NAME]", this.subscribedPlan?.planDetails?.name)?.replace("[EXPIRY_DATE]", this.subscribedPlan?.expiry);
        } else {
            text = text?.replace("[PLAN_DURATION]", this.subscribedPlan?.planDetails?.duration)?.replace("[PLAN_DURATION_UNIT]", this.subscribedPlan?.planDetails?.durationUnit)?.replace("[PLAN_NAME]", this.subscribedPlan?.planDetails?.name)?.replace("[EXPIRY_DATE]", this.subscribedPlan?.expiry);
        }
        return text;
    }

    /**
     * This will return plan ended note
     *
     * @returns {string}
     * @memberof HeaderComponent
     */
    public getSubscriptionEndedNote(): string {
        let text = this.localeData?.subscription_ended_note;
        text = text?.replace("[PLAN_DURATION]", this.subscribedPlan?.planDetails?.duration)?.replace("[PLAN_DURATION_UNIT]", this.subscribedPlan?.planDetails?.durationUnit)?.replace("[PLAN_NAME]", this.subscribedPlan?.planDetails?.name)?.replace("[EXPIRY_DATE]", this.subscribedPlan?.expiry);
        return text;
    }

    /**
     * This will return plan transactions ended note
     *
     * @returns {string}
     * @memberof HeaderComponent
     */
    public getSubscriptionTransactionEndedNote(): string {
        let text = this.localeData?.subscription_transaction_limit_ended;
        text = text?.replace("[PLAN_NAME]", this.subscribedPlan?.planDetails?.name)?.replace("[PLAN_START_DATE]", this.subscribedPlan?.startedAt);
        return text;
    }

    /**
     * This will return plan expired note
     *
     * @returns {string}
     * @memberof HeaderComponent
     */
    public getPlanExpiredNote(): string {
        let text = this.localeData?.plan_expired_note;
        text = text?.replace("[PLAN_DURATION]", this.subscribedPlan?.planDetails?.duration)?.replace("[PLAN_DURATION_UNIT]", this.subscribedPlan?.planDetails?.durationUnit?.toLowerCase())?.replace("[PLAN_NAME]", this.subscribedPlan?.planDetails?.name)?.replace("[EXPIRY_DATE]", this.subscribedPlan?.expiry);
        return text;
    }

    /**
     * This will return transaction limit crossed note
     *
     * @returns {string}
     * @memberof HeaderComponent
     */
    public getTransactionLimitCrossedNote(): string {
        let text = this.localeData?.transaction_limit_crossed;
        text = text?.replace("[PLAN_NAME]", this.subscribedPlan?.planDetails?.name)?.replace("[PLAN_START_DATE]", this.subscribedPlan?.startedAt);
        return text;
    }

    /**
     * This will show/hide gst menu icon
     *
     * @returns {string}
     * @memberof HeaderComponent
     */
    public showGstIcon(): boolean {
        return (this.currentPageUrl?.indexOf('pages/gstfiling') > -1 ||
            this.currentPageUrl?.indexOf('pages/reports/reverse-charge') > -1 ||
            this.currentPageUrl?.indexOf('pages/invoice/ewaybill') > -1 ||
            this.currentPageUrl?.indexOf('pages/settings/addresses') > -1);
    }

    /**
     * Opens the GST side menu in responsive mode
     *
     * @memberof HeaderComponent
     */
    public openGstSideMenu(): void {
        this.isGstSideMenuOpened = !this.isGstSideMenuOpened;
        this.store.dispatch(this._generalActions.openGstSideMenu(this.isGstSideMenuOpened));
    }

    /**
    * This toggle's settings sidebar
    *
    * @param {boolean} isMobileSidebar
    * @memberof HeaderComponent
    */
    public toggleSidebar(isMobileSidebar: boolean): void {
        if (this.asideSettingMenuState === "in") {
            this.toggleSidebarPane(false, isMobileSidebar);
        } else {
            this.toggleSidebarPane(true, isMobileSidebar);
        }
    }

    /**
     * Hides calendly model
     *
     * @memberof HeaderComponent
     */
    public hideScheduleCalendlyModel(): void {
        this.store.dispatch(this._generalActions.isOpenCalendlyModel(false));
    }

    /**
     * Saves last state
     *
     * @private
     * @memberof HeaderComponent
     */
    private saveLastState(): void {
        let companyUniqueName = null;
        let lastState = this.router.url;
        lastState = lastState?.replace("/pages", "pages");
        this.store.pipe(select(state => state.session.companyUniqueName), take(1)).subscribe(response => companyUniqueName = response);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = decodeURI(lastState);
        if (lastState !== '/pages/subscription/buy-plan') {
            this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
        }
    }

    /**
    * Displays the CMD+K modal
    *
    * @memberof HeaderComponent
    */
    public showNavigationModal(): void {
        this.commandkDialogRef = this.dialog.open(this.navigationModal, {
            width: '630px',
            height: '600'
        });
    }

    /**
    * Close the Cmd + K Dialog on close Event
    *
    * @memberof HeaderComponent
    */
    public closeEvent(): void {
        setTimeout(() => {
            this.commandkDialogRef.close();
        }, 600);
    }

    /**
     * Item selection handler for CMD+K
     *
     * @param {IUlist} item Selected item
     * @param {{ next: IUlist, previous: IUlist }} [fromInvalidState=null] Current and previous states
     * @param {boolean} [isCtrlClicked] True, if CTRL is clicked
     * @memberof HeaderComponent
     */
    public onItemSelected(item: IUlist, fromInvalidState: { next: IUlist, previous: IUlist } = null, isCtrlClicked?: boolean): void {
        if (this.modelRef) {
            this.modelRef.hide();
        }

        setTimeout(() => {
            if (item && item.type === 'MENU') {
                if (item.additional && item.additional.tab) {
                    if (item.uniqueName.includes('?')) {
                        item.uniqueName = item.uniqueName?.split('?')[0];
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
    * Creates a new group entry
    *
    * @param {IUlist} item
    * @memberof HeaderComponent
    */
    public makeGroupEntryInDB(item: IUlist): void {
        // save data to db
        item.time = +new Date();
        this.doEntryInDb('groups', item);
    }

    /**
     * Logs out the user
     *
     * @memberof HeaderComponent
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
            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
            details: branchDetails
        };
        this.store.dispatch(this.companyActions.setCompanyBranch(organization));
    }

    /**
     * New group creation handler for CMD+K
     *
     * @param {*} e Create new group event
     * @memberof HeaderComponent
     */
    public handleNewTeamCreationEmitter(e: any): void {
        this.modelRef?.hide();
        if (e[0] === "group") {
            if (this.accountAsideMenuState === "in") {
                this.toggleAccountAsidePane();
            }
            this.showManageGroupsModal(e[1]?.name);
        } else if (e[0] === "account") {
            this.selectedGroupForCreateAccount = e[1]?.uniqueName;
            if (this.accountAsideMenuState === "out") {
                this.toggleAccountAsidePane();
            } else {
                this.toggleAccountAsidePane();
                setTimeout(() => {
                    this.toggleAccountAsidePane();
                    this.changeDetection.detectChanges();
                }, 50);
            }
        }
    }

    /**
     * This will toggle create account sidepan
     *
     * @param {*} [event]
     * @memberof HeaderComponent
     */
    public toggleAccountAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';

        this.toggleBodyClass();
    }

    /**
     * This will toggle fixed class on body
     *
     * @memberof HeaderComponent
     */
    public toggleBodyClass() {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body')?.classList?.add('fixed');
            if (document.getElementsByClassName("gst-sidebar-open")?.length > 0) {
                document.querySelector(".nav-left-bar").classList.add("create-account");
            }
            document.querySelector(".sidebar-slide-right")?.classList?.add("z-index-990");
        } else {
            document.querySelector('body')?.classList?.remove('fixed');
            document.querySelector(".nav-left-bar").classList.remove("create-account");
            document.querySelector(".sidebar-slide-right")?.classList?.remove("z-index-990");
        }
    }

    /**
     * Closes account modal
     *
     * @param {*} event
     * @memberof HeaderComponent
     */
    public closeAccountModal(event: any): void {
        if (event) {
            this.accountAsideMenuState = 'out';
            this.toggleBodyClass();
        }
    }

    /**
     * This will save new account
     *
     * @param {AddAccountRequest} item
     * @memberof HeaderComponent
     */
    public addNewAccount(item: AddAccountRequest) {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }


    /**
     *
     *
     * @memberof HeaderComponent
     */
    public removeDepreciationMessage(): void {
        document.body?.classList?.remove("depreciation-message");
        this.showDepreciationMessage = false;
    }
}
