import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnChanges, OnDestroy, OnInit, QueryList, SimpleChanges, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, NavigationEnd, RouteConfigLoadEnd, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { firstValueFrom, Observable, ReplaySubject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyActions } from '../../actions/company.actions';
import { GeneralActions } from '../../actions/general/general.actions';
import { GroupWithAccountsAction } from '../../actions/groupwithaccounts.actions';
import { clone, cloneDeep, each, filter, find, forEach, includes, isEmpty, isEqual, isNull, isUndefined, map, orderBy, remove, slice, some, sortBy, uniq } from '../../lodash-optimized';
import { CompanyResponse, Organization } from '../../models/api-models/Company';
import { SalesActions } from '../../actions/sales/sales.action';
import { AccountResponse, AccountResponseV2, AddAccountRequest } from '../../models/api-models/Account';
import { CompAidataModel } from '../../models/db';
import { ICompAidata, IUlist } from '../../models/interfaces/ulist.interface';
import { OrganizationType } from '../../models/user-login-state';
import { DbService } from '../../services/db.service';
import { GeneralService } from '../../services/general.service';
import { LocaleService } from '../../services/locale.service';
import { AppState } from '../../store';
import { AllItem, AllItems } from '../helpers/allItems';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { ASIDE_PANE_CONFIG } from '../../app.constant';

@Component({
    selector: 'primary-sidebar',
    templateUrl: './primary-sidebar.component.html',
    styleUrls: ['./primary-sidebar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
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
    /** Stores the active ledger account details */
    public activeAccount: AccountResponse;
    /** Stores the active company details */
    public selectedCompanyDetails: CompanyResponse;
    /** Current organization type */
    public currentOrganizationType: OrganizationType;
    /** Stores the details of the current branch */
    public currentBranch: any;
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Active company details for indexedDB */
    private activeCompanyForDb: ICompAidata;
    /** Stores the navigation modal event subscriptions */
    private subscriptions: Subscription[] = [];
    /** Current ledger name */
    public selectedLedgerName: string;
    /** True, if ledger account is selected */
    public isLedgerAccSelected: boolean = false;
    /** Holds the navigated accounts */
    public accountItemsFromIndexDB: any[] = [];
    /** Company name initials (upto 2 characters) */
    public companyInitials: any = '';
    /** Stores the total company list */
    public companyList: CompanyResponse[] = [];
    /** Stores all the menu items to be shown */
    public allItems: AllItems[] = [];
    /** True, if sidebar needs to be shown */
    @Input() public isOpen: boolean = false;
    /** True, if sidebar needs to be shown */
    @Input() public isGoToBranch: boolean = false;
    /** API menu items, required to show permissible items only in the menu */
    @Input() public apiMenuItems: Array<any> = [];
    /** True, if sidebar needs to be expanded */
    @Input() public isSidebarExpanded: boolean = false;
    /** True if command dialog is open */
    @Input() public showCommandDialog: boolean = false;
    /** Stores the instance of CMD+K dropdown */
    @ViewChild('navigationModal', { static: true }) public navigationModal: TemplateRef<any>; // CMD + K
    /** Holds the template reference of generic aside menu account */
    @ViewChild('genericAsideMenuAccountTemplate', { static: true }) public genericAsideMenuAccountTemplate: TemplateRef<any>;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This holds the active locale */
    public activeLocale: string = "";
    /** This will open company branch switch dropdown */
    public showCompanyBranchSwitch: boolean = false;
    /** This will holds true if we added ledger item in local db once */
    public isItemAdded: boolean = false;
    /** This will hold group unique name from CMD+k for creating account */
    public selectedGroupForCreateAccount: any = '';
    /* Observable for create account success */
    private createAccountIsSuccess$: Observable<boolean>;
    /* This will hold the active route url */
    public isActiveRoute: string;
    /** True if account has unsaved changes */
    public hasUnsavedChanges: boolean = false;
    public commandkDialogRef: MatDialogRef<any>;
    /** Holds true if company has no branch */
    public isCompanyWithoutBranch: boolean = false;
    /** True if consolidated branch */
    public isConsolidatedBranch: boolean;
    /** Holds generic aside menu account dialog Ref */
    public genericAsideMenuAccountDialogRef: MatDialogRef<any>;
    /** Hold current url */
    private currentUrl: string = "";
    /** Hold previous url */
    private previousUrl: string = "";
    /** Holds active company unique name */
    public ledgerAccount$: Observable<AccountResponse | AccountResponseV2>;
    /** Holds current url queryParams */
    public queryParams: any = {};
    /** DataSource for the tree */
    public dataSource = new ArrayDataSource([]);
    /** Function to check if a node has children */
    public hasChild = (_: number, node: any) => node.expandable;
    /** Handle cdk tree control */
    public treeControl = new FlatTreeControl<any>(
        node => node.level,
        node => node.expandable
    );

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private generalService: GeneralService,
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private router: Router,
        private generalActions: GeneralActions,
        private dbService: DbService,
        private groupWithAction: GroupWithAccountsAction,
        private localeService: LocaleService,
        private salesAction: SalesActions,
        public dialog: MatDialog,
        private activateRoute: ActivatedRoute
    ) {
        this.activeAccount$ = this.store.pipe(select(appStore => appStore.ledger.account), takeUntil(this.destroyed$));
        this.ledgerAccount$ = this.store.pipe(select(state => state.groupwithaccounts.activeAccount), takeUntil(this.destroyed$));
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
        this.createAccountIsSuccess$ = this.store.pipe(select(state => state.sales.createAccountSuccess), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.groupwithaccounts.hasUnsavedChanges), takeUntil(this.destroyed$)).subscribe(response => {
            this.hasUnsavedChanges = response;
        });
    }

    // CMD + G functionality
    @HostListener('document:keydown', ['$event'])
    public handleKeyboardUpEvent(event: KeyboardEvent) {
        if ((event.metaKey || event.ctrlKey) && (event.which === 75 || event.which === 71)) {
            event.preventDefault();
            event.stopPropagation();
            if (this.companyList?.length > 0) {
                if (this.commandkDialogRef && this.dialog.getDialogById(this.commandkDialogRef.id)) {
                    this.commandkDialogRef.close()
                }
                this.showNavigationModal()
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
        if (changes?.isGoToBranch?.currentValue) {
            this.openCompanyBranchDropdown();
        }
        if ('apiMenuItems' in changes && changes.apiMenuItems.previousValue !== changes.apiMenuItems.currentValue && changes.apiMenuItems.currentValue.length && this.localeData?.page_heading) {
            this.getVisibleMenuItems();
        }

         // Additional check: Try to load menu items if we have apiMenuItems but no allItems yet
        if ('apiMenuItems' in changes && changes.apiMenuItems.currentValue.length && (!this.allItems || this.allItems.length === 0)) {
            setTimeout(() => {
                if (this.localeData?.page_heading && this.apiMenuItems.length > 0) {
                    this.getVisibleMenuItems();
                }
            }, 100);
        }

        if ('showCommandDialog' in changes && changes.showCommandDialog.previousValue !== changes.showCommandDialog.currentValue && changes.showCommandDialog.currentValue) {
            this.showNavigationModal();
        }
    }

    /**
     * Get clean current url
     *
     * @private
     * @return {*}  {string}
     * @memberof PrimarySidebarComponent
     */
    private getCleanCurrentUrl(): string {
        const urlTree = this.router.parseUrl(this.router.url);
        delete urlTree.queryParams['redirectUrl']; // remove redirectUrl param
        return this.router.serializeUrl(urlTree);
    }

    /**
     * Initializes the component
     *
     * @memberof PrimarySidebarComponent
     */
    public ngOnInit(): void {

        /**Subscribe to queryParams */
        this.activateRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((queryParams: any) => {
            this.queryParams = queryParams?.tabIndex;
        })
        /** If this is true, it means we are in branch consolidated mode.  */
        this.store.pipe(select(select => select.branchConsolidated), takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.isConsolidatedBranch = response.isBranchConsolidated;
            }
        });
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
                    this.dbService.getAllItems(this.activeCompanyForDb?.uniqueName, 'accounts').subscribe(accountList => {
                        if (accountList?.length) {
                            if (window.innerWidth > 1440 && window.innerHeight > 717) {
                                this.accountItemsFromIndexDB = accountList.slice(0, 7);
                            } else {
                                this.accountItemsFromIndexDB = accountList.slice(0, 5);
                            }
                        }
                        this.changeDetectorRef.detectChanges();
                    });
                }
            }
        });
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.isCompanyWithoutBranch = response?.length === 1;
                this.currentCompanyBranches = response;
                if (this.generalService.currentBranchUniqueName) {
                    this.currentBranch = response.find(branch => (this.generalService.currentBranchUniqueName === branch?.uniqueName)) || {};
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

            let orderedCompanies = orderBy(companies, 'name');
            this.companyList = orderedCompanies;
        });
        this.updateIndexDbSuccess$.subscribe(res => {
            if (res) {
                if (this.activeCompanyForDb && this.activeCompanyForDb.uniqueName) {
                    firstValueFrom(this.dbService.getItemDetails(this.activeCompanyForDb.uniqueName)).then(dbResult => {
                        this.findListFromDb(dbResult);
                        this.generalActions.updateUiFromDb();
                    });
                }
            }
        });

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationEnd || event instanceof RouteConfigLoadEnd) {
                this.previousUrl = this.currentUrl; // store old before updating
                this.currentUrl = this.getCleanCurrentUrl(); // always clean
                // Use the clean currentUrl for baseUrl instead of parsing router.url again
                const baseUrl = this.currentUrl;
                this.isActiveRoute = baseUrl;
                (Array.isArray(this.allItems) ? this.allItems : []).forEach(item => item.isActive = (item.link === decodeURI(baseUrl) || item?.items?.some((subItem: AllItem) => {
                    if (subItem.link === decodeURI(baseUrl) || subItem?.additionalRoutes?.includes(decodeURI(baseUrl))) {
                        return true;
                    }
                })));

                this.changeDetectorRef.detectChanges();
            }
        });

        this.store.pipe(select(state => state.session.currentLocale), takeUntil(this.destroyed$)).subscribe(response => {
            if (this.activeLocale && this.activeLocale !== response?.value) {
                this.localeService.getLocale('sidebar-menu', response?.value).subscribe(response => {
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
                if (account) {
                    this.activeAccount = account;
                }
                if (account && !this.isItemAdded) {
                    this.isItemAdded = true;
                    // save data to db
                    let item: any = {};
                    item.time = +new Date();
                    item.route = this.router.url;
                    item.parentGroups = account.parentGroups;
                    item.uniqueName = account?.uniqueName;
                    item.name = account.name;
                    this.doEntryInDb('accounts', item);
                }
            });

            this.ledgerAccount$.pipe(takeUntil(this.destroyed$)).subscribe(account => {
                if (account && account.uniqueName === this.activeAccount?.uniqueName) {
                    let item: any = {};
                    item.uniqueName = account?.uniqueName;
                    item.name = account.name;
                    this.doEntryInDb('accounts', item);
                }
            });
        }

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((accountDetails) => {
            if (accountDetails) {
                this.genericAsideMenuAccountDialogRef?.close();
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
    * Opens the CMD+K dialog
    *
    * @memberof PrimarySidebarComponent
    */
    public showNavigationModal(): void {
        this.commandkDialogRef = this.dialog.open(this.navigationModal, {
                    width: '630px',
                    height: '600'
                });
    }

    /**
     * New group creation handler for CMD+K
     *
     * @param {*} e Create new group event
     * @memberof PrimarySidebarComponent
     */
    public handleNewTeamCreationEmitter(e: any): void {
        if (e[0] === "group") {
            this.genericAsideMenuAccountDialogRef?.close();
            this.showManageGroupsModal(e[1]?.name);
        } else if (e[0] === "account") {
            this.selectedGroupForCreateAccount = e[1]?.uniqueName;
            this.openAccountAsidePane();
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
        if (!this.activeCompanyForDb?.uniqueName) {
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
                accounts: []
            };
            this.dbService.insertFreshData(this.activeCompanyForDb);
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Displays the manage group modal / master modal
     *
     * @memberof PrimarySidebarComponent
     */
    public showManageGroupsModal(search: any = ""): void {
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

        setTimeout(() => {
            if (item && item.type === 'MENU') {
                if (item.additional && item.additional.tab) {
                    if (item.uniqueName.includes('?')) {
                        // Clean URL by removing query parameters
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
                // Get the redirect URL and clean it if it contains query parameters
                let redirectUrl = this.previousUrl || this.currentUrl || '/';
                // If redirectUrl contains query parameters, extract only the base path
                if (redirectUrl.includes('?')) {
                    redirectUrl = redirectUrl.split('?')[0];
                }
                this.router.navigate([url], {
                    queryParams: { redirectUrl: encodeURIComponent(redirectUrl) }
                });
            }
            // save data to db
            item.time = +new Date();
            let entity = (item.type) === 'MENU' ? 'menus' : 'accounts';
            this.doEntryInDb(entity, item, fromInvalidState);
            this.closeAccountAsidePane(true);
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
            this.selectedLedgerName = item?.uniqueName;
        }

        if (this.activeCompanyForDb && this.activeCompanyForDb.uniqueName) {
            // First ensure company exists in DB
            firstValueFrom(this.dbService.getItemDetails(this.activeCompanyForDb.uniqueName)).then(dbResult => {
                if (!dbResult) {
                    // Create fresh data structure if company doesn't exist
                    this.activeCompanyForDb.aidata = {
                        menus: [],
                        groups: [],
                        accounts: []
                    };
                    return firstValueFrom(this.dbService.insertFreshData(this.activeCompanyForDb)).then(() => {
                        // Convert Promise<number> to Promise<void>
                        return Promise.resolve();
                    });
                }
                return Promise.resolve();
            }).then(() => {
                // Now add the item
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
            this.getVisibleMenuItems();
        }
    }

    /**
     * Get visible menu items
     *
     * @private
     * @memberof PrimarySidebarComponent
     */
    private getVisibleMenuItems(): void {
        this.allItems = this.generalService.getVisibleMenuItems("sidebar", this.apiMenuItems, this.localeData?.items);
        const flattenedItems: AllItems[] = [];
        this.allItems?.filter(item => !item.hide)?.forEach((menu, index) => {
            menu['expandable'] = menu?.items?.length > 0;
            menu['level'] = 0;
            menu['isExpanded'] = false;
            const childMenus = menu?.items;
            delete menu['items'];
            flattenedItems.push(menu);

            childMenus?.forEach(item => {
                if (item?.additional?.queryParams?.voucherVersion) {
                    delete item?.additional?.queryParams?.voucherVersion;
                }
                const childMenu = {
                    expandable: false, // Set static false due to only one level of menu
                    level: 1,
                    isExpanded: false,
                    ...item
                } as unknown as AllItems;
                flattenedItems.push(childMenu);
            });
        });
        this.allItems = flattenedItems;
        this.dataSource = new ArrayDataSource(this.allItems);
        this.changeDetectorRef.detectChanges();
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
     * Open account aside pane dialog
     *
     * @memberof PrimarySidebarComponent
     */
    public openAccountAsidePane(): void {
        this.genericAsideMenuAccountDialogRef = this.dialog.open(this.genericAsideMenuAccountTemplate, ASIDE_PANE_CONFIG)
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

    /**
     * Closes account dialog
     *
     * @param {*} event
     * @memberof PrimarySidebarComponent
     */
    public closeAccountAsidePane(event: any): void {
        if (event) {
            this.genericAsideMenuAccountDialogRef?.close();
        }
    }

    /**
     * Shows Primary bar accounts and menu items when clicked outside primary sidebar
     *
     * @memberof PrimarySidebarComponent
     */
    public hidePrimarySidebarCompanyList(): void {
        if (this.showCompanyBranchSwitch) {
            this.showCompanyBranchSwitch = false;
        }
    }

    /**
    * Close the Cmd + K Dialog on close Event
    *
    * @memberof PrimarySidebarComponent
    */
    public closeEvent(): void {
        setTimeout(() => {
            this.commandkDialogRef.close();
        }, 600);
    }

    /**
     * Get parent node of given node
     *
     * @param node Node to get parent of
     * @returns Parent node of given node
     * @memberof PrimarySidebarComponent
     */
    public getParentNode(node: any): any {
        const nodeIndex = this.allItems.indexOf(node);
        for (let i = nodeIndex - 1; i >= 0; i--) {
          if (this.allItems[i].level === node.level - 1) {
            return this.allItems[i];
          }
        }
        return null;
      }

    /**
     * Check if node should be rendered based on parent expansion state
     *
     * @param node Node to check
     * @returns True if node should be rendered, false otherwise
     * @memberof PrimarySidebarComponent
     */
    public shouldRender(node: any): boolean {
        let parent = this.getParentNode(node);
        while (parent) {
            if (!parent.isExpanded) {
                return false;
            }
            parent = this.getParentNode(parent);
        }
        return true;
    }

     /**
      * Toggle node expansion with accordion behavior
      * Only one parent node can be expanded at a time
      *
      * @param node Node to toggle
      * @memberof PrimarySidebarComponent
      */
      public toggleNode(node: any): void {
        if (node.expandable || (node?.level === 0)) {
          if (node.isExpanded) {
            node.isExpanded = false;
          } else {
            (Array.isArray(this.allItems) ? this.allItems : []).forEach(item => {
              if (item.level === 0 && item !== node) {
                item.isExpanded = false;
              }
            });
            node.isExpanded = node.expandable;
          }
          this.dataSource = new ArrayDataSource(this.allItems);
        }
      }

      /**
      * Check if node is expanded
      *
      * @param node Node to check
      * @returns True if node is expanded, false otherwise
      * @memberof PrimarySidebarComponent
      */
      public isExpanded(node: any): boolean {
        return node.isExpanded || false;
      }
}
