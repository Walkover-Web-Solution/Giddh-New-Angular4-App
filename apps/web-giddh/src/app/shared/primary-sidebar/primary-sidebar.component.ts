import { animate, state, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { NavigationEnd, NavigationStart, RouteConfigLoadEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { combineLatest, Observable, ReplaySubject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyActions } from '../../actions/company.actions';
import { GeneralActions } from '../../actions/general/general.actions';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { slice } from '../../lodash-optimized';
import { CompanyResponse, Organization } from '../../models/api-models/Company';
import { SalesActions } from '../../actions/sales/sales.action';
import { AccountResponse, AddAccountRequest } from '../../models/api-models/Account';
import { CompAidataModel } from '../../models/db';
import { DEFAULT_AC } from '../../models/defaultMenus';
import { ICompAidata, IUlist } from '../../models/interfaces/ulist.interface';
import { OrganizationType } from '../../models/user-login-state';
import { DbService } from '../../services/db.service';
import { GeneralService } from '../../services/general.service';
import { LocaleService } from '../../services/locale.service';
import { AppState } from '../../store';
import { AllItem, AllItems } from '../helpers/allItems';

@Component({
    selector: 'primary-sidebar',
    templateUrl: './primary-sidebar.component.html',
    styleUrls: ['./primary-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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

export class PrimarySidebarComponent implements OnInit, OnChanges, OnDestroy {
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** update IndexDb flags observable **/
    public updateIndexDbSuccess$: Observable<boolean>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the active ledger account details */
    public activeAccount$: Observable<AccountResponse>;
    /** Stores the active company details */
    public selectedCompanyDetails: CompanyResponse;
    /** Current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the details of the current branch */
    public currentBranch: any;
    /** True if CMD+K modal is opened */
    public navigationModalVisible: boolean = false;
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
    /** Company name initials (upto 2 characters) */
    public companyInitials: any = '';
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
    /** Stores the instance of CMD+K dropdown */
    @ViewChild('navigationModal', { static: true }) public navigationModal: TemplateRef<any>; // CMD + K
    /** Stores the instance of company detail dropdown */
    @ViewChild('companyDetailsDropDownWeb', { static: true }) public companyDetailsDropDownWeb: BsDropdownDirective;
    /** Stores the dropdown instances as querylist */
    @ViewChildren('dropdown') itemDropdown: QueryList<BsDropdownDirective>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This holds the active locale */
    public activeLocale: string = "";
    /** This will holds true if we added ledger item in local db once */
    public isItemAdded: boolean = false;
    /** This will open company branch switch dropdown */
    public showCompanyBranchSwitch: boolean = false;
    /** This will show/hide account sidepan */
    public accountAsideMenuState: string = 'out';
    /** This will hold group unique name from CMD+k for creating account */
    public selectedGroupForCreateAccount: any = '';
    /* Observable for create account success */
    private createAccountIsSuccess$: Observable<boolean>;
    /* This will hold the active route url */
    public isActiveRoute: string;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private modalService: BsModalService,
        private changeDetection: ChangeDetectorRef,
        private router: Router,
        private generalActions: GeneralActions,
        private dbService: DbService,
        private groupWithAction: GroupWithAccountsAction,
        private localeService: LocaleService,
        private salesAction: SalesActions
    ) {
        this.activeAccount$ = this.store.pipe(select(appStore => appStore.ledger.account), takeUntil(this.destroyed$));
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
        this.createAccountIsSuccess$ = this.store.pipe(select(state => state.sales.createAccountSuccess), takeUntil(this.destroyed$));
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
            if (this.companyList?.length > 0) {
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
            this.allItems?.map(items => {
                items?.items?.map(item => {
                    if (item?.additional?.voucherVersion) {
                        delete item?.additional?.voucherVersion;
                    }
                    return item;
                });
            });
        }
    }

    /**
     * Initializes the component
     *
     * @memberof PrimarySidebarComponent
     */
    public ngOnInit(): void {
        // Reset old stored application date
        this.store.dispatch(this.companyActions.ResetApplicationDate());
        this.updateIndexDbSuccess$ = this.store.pipe(select(appStore => appStore.general.updateIndexDbComplete), takeUntil(this.destroyed$))
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
            if (selectedCmp && selectedCmp?.uniqueName === this.generalService.companyUniqueName) {
                this.selectedCompanyDetails = selectedCmp;
                this.companyInitials = this.generalService.getInitialsFromString(selectedCmp.name);

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
                    this.currentBranch = response.find(branch => (this.generalService.currentBranchUniqueName === branch.uniqueName)) || {};
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
            if (!companies || companies?.length === 0) {
                return;
            }

            let orderedCompanies = _.orderBy(companies, 'name');
            this.companyList = orderedCompanies;
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
                this.isActiveRoute = baseUrl;
                this.allItems.forEach(item => item.isActive = (item.link === decodeURI(baseUrl) || item?.items?.some((subItem: AllItem) => {
                    if (subItem.link === decodeURI(baseUrl) || subItem?.additionalRoutes?.includes(decodeURI(baseUrl))) {
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
            if (this.activeLocale && this.activeLocale !== response?.value) {
                this.localeService.getLocale('all-items', response?.value).subscribe(response => {
                    this.localeData = response;
                    this.translationComplete(true);
                });
            }
            this.activeLocale = response?.value;
        });
        // if invalid menu item clicked then navigate to default route and remove invalid entry from db
        this.generalService.invalidMenuClicked.pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data) {
                this.onItemSelected(data.next, data);
            }
        });

        if (this.router.url.includes("/ledger")) {
            this.activeAccount$.pipe(takeUntil(this.destroyed$)).subscribe(account => {
                if (account && !this.isItemAdded) {
                    this.isItemAdded = true;
                    // save data to db
                    let item: any = {};
                    item.time = +new Date();
                    item.route = this.router.url;
                    item.parentGroups = account.parentGroups;
                    item.uniqueName = account.uniqueName;
                    item.name = account.name;
                    this.doEntryInDb('accounts', item);
                }
            });
        }

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((accountDetails) => {
            if (accountDetails && this.accountAsideMenuState === 'in') {
                this.toggleAccountAsidePane();
            }
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
        if (e[0] === "group") {
            this.showManageGroupsModal(e[1]?.name);
        } else if (e[0] === "account") {
            this.selectedGroupForCreateAccount = e[1]?.uniqueName;
            this.toggleAccountAsidePane();
        }
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
                this.accountItemsFromIndexDB = (dbResult && dbResult?.aidata) ? slice(dbResult.aidata.accounts, 0, 7) : [];
            } else {
                this.accountItemsFromIndexDB = (dbResult && dbResult?.aidata) ? slice(dbResult.aidata.accounts, 0, 5) : [];
            }
        } else {
            if (!this.activeCompanyForDb) {
                this.activeCompanyForDb = new CompAidataModel();
            }
            this.activeCompanyForDb.aidata = {
                menus: [],
                groups: [],
                accounts: DEFAULT_AC
            };
            this.dbService.insertFreshData(this.activeCompanyForDb);
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
    public showManageGroupsModal(search: any = ""): void {
        if (search) {
            this.store.dispatch(this.groupWithAction.getGroupWithAccounts());
        }
        this.store.dispatch(this.groupWithAction.OpenAddAndManageFromOutside(search));
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
        this.onItemSelected(acc);
    }

    /**
     * Menu item click handler
     *
     * @param {AllItem} item Selected item
     * @memberof PrimarySidebarComponent
     */
    public handleItemClick(item: AllItem): void {
        if (item?.label === this.commonLocaleData?.app_master) {
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
            this.dbService.addItem(this.activeCompanyForDb.uniqueName, entity, item, fromInvalidState, isSmallScreen,
                this.currentOrganizationType === OrganizationType.Company && branches?.length > 1).then((res) => {
                    this.findListFromDb(res);
                }, (err: any) => {
                    console.log('%c Error: %c ' + err + '', 'background: #c00; color: #ccc', 'color: #333');
                });
        }
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

    /**
     * It will show/hide company branch switch dropdown
     *
     *
     * @memberof PrimarySidebarComponent
     */
    public openCompanyBranchDropdown(): void {
        this.showCompanyBranchSwitch = !this.showCompanyBranchSwitch;
    }

    /**
     * This will toggle create account sidepan
     *
     * @param {*} [event]
     * @memberof PrimarySidebarComponent
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
     * @memberof PrimarySidebarComponent
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
     * This will save new account
     *
     * @param {AddAccountRequest} item
     * @memberof PrimarySidebarComponent
     */
    public addNewAccount(item: AddAccountRequest) {
        this.store.dispatch(this.salesAction.addAccountDetailsForSales(item));
    }
}
