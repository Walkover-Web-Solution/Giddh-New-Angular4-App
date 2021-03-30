import { Component, OnInit, Input, ViewChild, ChangeDetectorRef, TemplateRef, ComponentFactoryResolver, HostListener, ChangeDetectionStrategy, Output, EventEmitter, SimpleChanges, OnChanges } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from '../../theme/ng-social-login-module/index';
import { Store, select, createSelector } from "@ngrx/store";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";
import { ModalDirective, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, of as observableOf, ReplaySubject, Subscription } from 'rxjs';
import { takeUntil, take } from "rxjs/operators";
import { CompanyActions } from "../../actions/company.actions";
import { GeneralActions } from "../../actions/general/general.actions";
import { AccountResponse } from "../../models/api-models/Account";
import { CompanyResponse, Organization, OrganizationDetails, ActiveFinancialYear } from "../../models/api-models/Company";
import { CompAidataModel } from "../../models/db";
import { OrganizationType } from "../../models/user-login-state";
import { CompanyService } from "../../services/companyService.service";
import { GeneralService } from "../../services/general.service";
import { AppState } from "../../store";
import { ICompAidata, IUlist } from '../../models/interfaces/ulist.interface';
import { ManageGroupsAccountsComponent } from '../header/components';
import { ElementViewContainerRef } from '../helpers/directives/elementViewChild/element.viewchild.directive';
import { LedgerActions } from '../../actions/ledger/ledger.actions';
import { AccountsAction } from '../../actions/accounts.actions';
import { DbService } from '../../services/db.service';
import { DEFAULT_AC, DEFAULT_MENUS, NAVIGATION_ITEM_LIST } from '../../models/defaultMenus';
import { clone, cloneDeep, find, orderBy, slice } from '../../lodash-optimized';
import { SettingsBranchActions } from "../../actions/settings/branch/settings.branch.action";
import { LoginActions } from "../../actions/login.action";
import { UserDetails } from "../../models/api-models/loginModels";
import { AllItem, AllItems, ALL_ITEMS } from "../helpers/allItems";
import { GroupWithAccountsAction } from "../../actions/groupwithaccounts.actions";

@Component({
    selector: 'primary-sidebar',
    templateUrl: './primary-sidebar.component.html',
    styleUrls: ['./primary-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class PrimarySidebarComponent implements OnInit, OnChanges {
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** update IndexDb flags observable **/
    public updateIndexDbSuccess$: Observable<boolean>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Search query to search branch */
    public searchBranchQuery: string;
    /** Current organization type */
    public activeAccount$: Observable<AccountResponse>;
    /* This will show sidebar is open */
    /** Stores the active company details */
    public selectedCompanyDetails: CompanyResponse;
    /** Current organization type */
    public currentOrganizationType: OrganizationType;

    /** store current selected company */
    public selectedCompany: Observable<CompanyResponse>;
    public activeFinancialYear: ActiveFinancialYear;

    /** Stores the details of the current branch */
    public currentBranch: any;
    public userAvatar: string;
    public navigationModalVisible: boolean = false;
    public isMobileSite: boolean;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1)
    private activeCompanyForDb: ICompAidata;
    private subscriptions: Subscription[] = [];
    public modelRef: BsModalRef;
    public selectedLedgerName: string;
    public isLedgerAccSelected: boolean = false;
    public menuItemsFromIndexDB: any[] = DEFAULT_MENUS;
    public accountItemsFromIndexDB: any[] = DEFAULT_AC;
    private smartCombinedList$: Observable<any>;
    public companyInitials: any = '';
    public branchInitials: any = '';
    public seletedCompanywithBranch: string = '';
    public companies$: Observable<CompanyResponse[]>;
    public companyListForFilter: CompanyResponse[] = [];
    public isLoggedInWithSocialAccount$: Observable<boolean>;
    public userName: string;
    public userEmail: string;
    public userFullName: string;
    public user$: Observable<UserDetails>;
    public hoveredIndx: number;
    public companyList: CompanyResponse[] = [];
    public allItems: AllItems[] = [];

    @Input() public isOpen: boolean = false;
    /** API menu items, required to show permissible items only in the menu */
    @Input() public apiMenuItems: Array<any> = [];
    @Output() public newCompany: EventEmitter<void> = new EventEmitter();
    @ViewChild('subBranchDropdown', { static: false }) public subBranchDropdown: BsDropdownDirective;
    @ViewChild('navigationModal', { static: true }) public navigationModal: TemplateRef<any>; // CMD + K
    @ViewChild('manageGroupsAccountsModal', { static: true }) public manageGroupsAccountsModal: ModalDirective;
    @ViewChild('addmanage', { static: false }) public addmanage: ElementViewContainerRef;
    @ViewChild('companyDetailsDropDownWeb', {static: true}) public companyDetailsDropDownWeb: BsDropdownDirective;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private companyService: CompanyService,
        private companyActions: CompanyActions,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private router: Router,
        private componentFactoryResolver: ComponentFactoryResolver,
        private generalActions: GeneralActions,
        private ledgerAction: LedgerActions,
        private accountsAction: AccountsAction,
        private dbService: DbService,
        private settingsBranchAction: SettingsBranchActions,
        private loginAction: LoginActions,
        private socialAuthService: AuthService,
        private groupWithAction: GroupWithAccountsAction
    ) {
        // Reset old stored application date
        this.store.dispatch(this.companyActions.ResetApplicationDate());
        this.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.isLoggedInWithSocialAccount$ = this.store.pipe(select(p => p.login.isLoggedInWithSocialAccount), takeUntil(this.destroyed$));
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
        if ('apiMenuItems' in changes && changes.apiMenuItems.previousValue !== changes.apiMenuItems.currentValue && changes.apiMenuItems.currentValue.length) {
            this.allItems = this.generalService.getVisibleMenuItems(changes.apiMenuItems.currentValue, ALL_ITEMS, this.generalService.currentOrganizationType === OrganizationType.Branch);
        }
    }

    public ngOnInit(): void {
        this.smartCombinedList$ = this.store.pipe(select(s => s.general.smartCombinedList), takeUntil(this.destroyed$));
        this.updateIndexDbSuccess$ = this.store.pipe(select(p => p.general.updateIndexDbComplete), takeUntil(this.destroyed$))
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
            if (selectedCmp) {
                this.selectedCompany = observableOf(selectedCmp);
                this.selectedCompanyDetails = selectedCmp;
                this.companyInitials = this.generalService.getInitialsFromString(selectedCmp.name);
                this.branchInitials = this.generalService.getInitialsFromString(this.currentBranch?.name);
                this.activeFinancialYear = selectedCmp.activeFinancialYear;
                this.store.dispatch(this.companyActions.setActiveFinancialYear(this.activeFinancialYear));
                if (selectedCmp.alias) {
                    this.seletedCompanywithBranch = selectedCmp.name + ' (' + selectedCmp.alias + ')';
                } else {
                    this.seletedCompanywithBranch = selectedCmp.name;
                }

                this.activeCompanyForDb = new CompAidataModel();
                if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
                    this.activeCompanyForDb.name = this.currentBranch ? this.currentBranch.name : '';
                    this.activeCompanyForDb.uniqueName = this.generalService.currentBranchUniqueName;
                } else {
                    this.activeCompanyForDb.name = selectedCmp.name;
                    this.activeCompanyForDb.uniqueName = selectedCmp.uniqueName;
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
        if (this.activeCompanyForDb?.uniqueName) {
            this.dbService.getAllItems(this.activeCompanyForDb.uniqueName, 'accounts').subscribe(accountList => {
                if (accountList?.length) {
                    if (window.innerWidth > 1440 && window.innerHeight > 717) {
                        this.accountItemsFromIndexDB = accountList.slice(0, 7);
                    } else {
                        this.accountItemsFromIndexDB = accountList.slice(0, 5);
                    }
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }

    /**
     * Switches to branch mode
     *
     * @param {string} branchUniqueName Branch uniqueName
     * @memberof HeaderComponent
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
                if (screen.width <= 767 || isCordova) {
                    window.location.href = '/pages/mobile-home';
                } else if (isElectron) {
                    this.router.navigate([response.body.lastState]);
                    setTimeout(() => {
                        window.location.reload();
                    }, 200);
                } else {
                    window.location.href = response.body.lastState;
                }
            }
        });
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
     * This will stop the body scroll if company dropdown is open
     *
    * @memberof HeaderComponent
     */
    public toggleBodyScroll(): void {
        if (this.subBranchDropdown.isOpen && !this.isMobileSite) {
            document.querySelector('body').classList.add('prevent-body-scroll');
        } else {
            document.querySelector('body').classList.remove('prevent-body-scroll');
        }
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
            this.modalService.onHidden.pipe(takeUntil(this.destroyed$)).subscribe((reason: string) => {
                this.navigationModalVisible = false;
                this.unsubscribe();
            })
        );

        this.subscriptions.push(_combine);
        let config: ModalOptions = { class: 'universal_modal', show: true, keyboard: true, animated: false };
        this.modelRef = this.modalService.show(this.navigationModal, config);
    }

    public handleNewTeamCreationEmitter(e: any) {
        this.modelRef.hide();
        this.showManageGroupsModal();
    }

    public prepareSmartList(data: IUlist[]) {
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

    public findListFromDb(dbResult: ICompAidata) {
        if (!this.activeCompanyForDb) {
            return;
        }
        if (!this.activeCompanyForDb.uniqueName) {
            return;
        }
        if (dbResult) {

            this.menuItemsFromIndexDB = (dbResult && dbResult.aidata) ? dbResult.aidata.menus : [];

            // slice menus
            if (window.innerWidth > 1440 && window.innerHeight > 717) {
                this.menuItemsFromIndexDB = slice(this.menuItemsFromIndexDB, 0, 10);
                this.accountItemsFromIndexDB = (dbResult && dbResult.aidata) ? slice(dbResult.aidata.accounts, 0, 7) : [];
            } else {
                this.menuItemsFromIndexDB = slice(this.menuItemsFromIndexDB, 0, 8);
                this.accountItemsFromIndexDB = (dbResult && dbResult.aidata) ? slice(dbResult.aidata.accounts, 0, 5) : [];
            }

            // sortby name
            this.menuItemsFromIndexDB = orderBy(this.menuItemsFromIndexDB, ['name'], ['asc']);
        } else {
            let data: IUlist[];
            this.smartCombinedList$.pipe(take(1)).subscribe(listResult => {
                data = listResult;
            });
            // make entry with smart list data
            this.prepareSmartList(data);

            // slice default menus and account on small screen
            if (!(window.innerWidth > 1440 && window.innerHeight > 717)) {
                this.menuItemsFromIndexDB = this.currentOrganizationType === OrganizationType.Company ? slice(this.menuItemsFromIndexDB, 0, 10) : slice(this.menuItemsFromIndexDB, 0, 8);
                this.accountItemsFromIndexDB = slice(this.accountItemsFromIndexDB, 0, 5);
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    public showManageGroupsModal() {
        this.loadAddManageComponent();
        this.manageGroupsAccountsModal.show();
    }

    public hideManageGroupsModal() {
        this.store.pipe(select(c => c.session.lastState), take(1)).subscribe((s: string) => {
            if (s && (s.indexOf('ledger/') > -1 || s.indexOf('settings') > -1)) {
                this.store.dispatch(this.generalActions.addAndManageClosed());
                if (this.selectedLedgerName) {
                    this.store.dispatch(this.ledgerAction.GetLedgerAccount(this.selectedLedgerName));
                    this.store.dispatch(this.accountsAction.getAccountDetails(this.selectedLedgerName));
                }
            }
        });

        this.manageGroupsAccountsModal.hide();
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
            this.dbService.addItem(this.activeCompanyForDb.uniqueName, entity, item, fromInvalidState, isSmallScreen,
                this.currentOrganizationType === OrganizationType.Company && branches.length > 1).then((res) => {
                    this.findListFromDb(res);
                }, (err: any) => {
                    console.log('%c Error: %c ' + err + '', 'background: #c00; color: #ccc', 'color: #333');
                });
        }
    }

    public makeGroupEntryInDB(item: IUlist) {
        // save data to db
        item.time = +new Date();
        this.doEntryInDb('groups', item);
    }

    public onItemSelected(item: IUlist, fromInvalidState: { next: IUlist, previous: IUlist } = null, isCtrlClicked?: boolean) {
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
            (componentRef.instance as ManageGroupsAccountsComponent).headerRect = (componentRef.instance as ManageGroupsAccountsComponent).header.nativeElement.getBoundingClientRect();
            (componentRef.instance as ManageGroupsAccountsComponent).myModelRect = (componentRef.instance as ManageGroupsAccountsComponent).myModel.nativeElement.getBoundingClientRect();
        }));
    }

    private unsubscribe() {
        this.subscriptions.forEach((subscription: Subscription) => {
            subscription.unsubscribe();
        });
        this.subscriptions = [];
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
     * Switches to company view from branch view
     *
     * @memberof HeaderComponent
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
        this.subBranchDropdown.isOpen = false;
        const details = {
            branchDetails: {
                uniqueName: ''
            }
        };
        this.setOrganizationDetails(OrganizationType.Company, details);
        this.toggleBodyScroll();
        this.changeCompany(this.selectedCompanyDetails.uniqueName, false);
    }

    public changeCompany(selectedCompanyUniqueName: string, fetchLastState?: boolean) {
        this.subBranchDropdown.isOpen = false;
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

    public logout() {
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
     * @param e event
     * @param pageName page router url
     * @param queryParamsObj additional data
     */
    public analyzeMenus(e: any, pageName: string, queryParamsObj?: any) {
        this.isLedgerAccSelected = false;
        if (e) {
            if (e.shiftKey || e.ctrlKey || e.metaKey) { // if user pressing combination of shift+click, ctrl+click or cmd+click(mac)
                return;
            }
            e.preventDefault();
            e.stopPropagation();
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
        this.doEntryInDb('menus', menu);

        if (menu.additional) {
            this.router.navigate([pageName], { queryParams: menu.additional });
        } else {
            this.router.navigate([pageName]);
        }
    }

    public mouseEnteredOnCompanyName(i: number) {
        this.hoveredIndx = i;
    }

    public handleItemClick(item: AllItem): void {
        if (item.label === 'Master') {
            this.store.dispatch(this.groupWithAction.OpenAddAndManageFromOutside(''));
        }
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

    /**
     * Opens new company modal
     *
     * @memberof HeaderComponent
     */
     public createNewCompany(): void {
        this.newCompany.emit();
     }
}
