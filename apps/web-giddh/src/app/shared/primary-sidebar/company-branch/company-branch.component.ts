import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyActions } from '../../../actions/company.actions';
import { InvoiceActions } from '../../../actions/invoice/invoice.actions';
import { LoginActions } from '../../../actions/login.action';
import { orderBy } from '../../../lodash-optimized';
import { BranchFilterRequest, CompanyResponse, Organization, OrganizationDetails } from '../../../models/api-models/Company';
import { OrganizationType } from '../../../models/user-login-state';
import { CompanyService } from '../../../services/company.service';
import { GeneralService } from '../../../services/general.service';
import { SettingsBranchService } from '../../../services/settings.branch.service';
import { AppState } from '../../../store';
import { WarehouseActions } from '../../../settings/warehouse/action/warehouse.action';
import { PageLeaveUtilityService } from '../../../services/page-leave-utility.service';
import { CommonActions } from '../../../actions/common.actions';

@Component({
    selector: 'company-branch',
    templateUrl: './company-branch.component.html',
    styleUrls: ['./company-branch.component.scss'],
})

export class CompanyBranchComponent implements OnInit, OnDestroy, OnChanges {
    /** Instance of tabset */
    @ViewChild('staticTabs', { static: false }) staticTabs: TabsetComponent;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** True, if sidebar needs to be shown */
    @Input() public isGoToBranch: boolean = false;
    /** Stores the list of all the companies for a user */
    public companies$: Observable<CompanyResponse[]>;
    /** Stores the total company list */
    public companyList: CompanyResponse[] = [];
    /** Stores filtered list of companies */
    public companyListForFilter: CompanyResponse[] = [];
    /** Subject to unsubscribe from listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Stores the active company details */
    public activeCompany: CompanyResponse;
    /** This will hold all company data and branches of the company */
    public companyBranches: any = {};
    /** Search company name */
    public searchCompany: string = '';
    /** Search branch name */
    public searchBranch: string = '';
    /** Holds if company refresh is in progress */
    public isCompanyRefreshInProcess$: Observable<boolean>;
    /** True if branch list refresh in process */
    public branchRefreshInProcess: boolean = false;
    /** This holds active tab */
    public activeTab: string = 'company';
    /** This will hold branches list */
    public branchList: any[] = [];
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** This holds current branch unique name */
    public currentBranchUniqueName: string = "";

    constructor(
        private store: Store<AppState>,
        private companyActions: CompanyActions,
        private generalService: GeneralService,
        private loginAction: LoginActions,
        private settingsBranchService: SettingsBranchService,
        private changeDetectorRef: ChangeDetectorRef,
        private companyService: CompanyService,
        private router: Router,
        private invoiceAction: InvoiceActions,
        private warehouseAction: WarehouseActions,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private commonAction: CommonActions
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof CompanyBranchComponent
     */
    public ngOnInit(): void {
        this.isCompanyRefreshInProcess$ = this.store.pipe(select(state => state.session.isRefreshing), takeUntil(this.destroyed$));
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));

        this.store.pipe(select((state: AppState) => state.session.companies), takeUntil(this.destroyed$)).subscribe(companies => {
            if (!companies || companies?.length === 0) {
                return;
            }

            let orderedCompanies = orderBy(companies, 'name');
            this.companyList = orderedCompanies;
            this.companyListForFilter = orderedCompanies;
            this.companies$ = observableOf(orderedCompanies);

            if (this.searchCompany) {
                this.filterCompanyList(this.searchCompany);
            }
        });

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(selectedCmp => {
            if (selectedCmp && selectedCmp?.uniqueName === this.generalService.companyUniqueName) {
                this.activeCompany = selectedCmp;

                if (!this.companyBranches?.branches) {
                    this.companyBranches = selectedCmp;
                }

                this.currentCompanyBranches$.subscribe(response => {
                    if (response && response.length) {
                        let unarchivedBranches = response.filter(branch => branch.isArchived === false);
                        this.branchList = unarchivedBranches?.sort(this.generalService.sortBranches);
                        this.currentCompanyBranches = this.branchList;
                        if (this.companyBranches) {
                            this.companyBranches.branches = this.branchList;
                            this.companyBranches.branchCount = response?.length
                            this.companyBranches.unarchivedBranchCount = this.branchList?.length;
                        }
                        this.changeDetectorRef.detectChanges();
                    }
                });
            }
        });

        this.store.pipe(select(appStore => appStore.session.currentOrganizationDetails), takeUntil(this.destroyed$)).subscribe((organization: Organization) => {
            this.currentBranchUniqueName = "";

            if (organization && organization.details && organization.details.branchDetails) {
                this.currentBranchUniqueName = organization.details.branchDetails.uniqueName;
            }
        });
    }

    /**
     * This hook will call on component changes
     *
     * @param {SimpleChanges} changes
     * @memberof CompanyBranchComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.isGoToBranch?.currentValue) {
            this.getCompanyBranches(this.companyBranches, false);
            this.tabChanged('branch');
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Releases the occupied memory
     *
     * @memberof CompanyBranchComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Company filtering method
     *
     * @param {*} ev Modal change event
     * @memberof CompanyBranchComponent
     */
    public filterCompanyList(event: any): void {
        let companies: CompanyResponse[] = [];
        this.companies$?.pipe(take(1)).subscribe(cmps => companies = cmps);

        this.companyListForFilter = companies?.filter((cmp) => {
            if (!cmp?.alias) {
                return cmp?.name?.toLowerCase().includes(event?.toLowerCase());
            } else {
                return cmp?.name?.toLowerCase().includes(event?.toLowerCase()) || cmp?.alias?.toLowerCase().includes(event?.toLowerCase());
            }
        });
    }

    /**
     * Change company callback method
     *
     * @param {any} any Selected company
     * @param {boolean} [fetchLastState] True, if last state of the company needs to be fetched
     * @memberof CompanyBranchComponent
     */
    public changeCompany(company: any, selectBranchUniqueName: string, fetchLastState?: boolean) {
        let hasUnsavedChanges: boolean = false;
        this.store.pipe(select(state => state.common.hasUnsavedChanges), take(1)).subscribe(response => hasUnsavedChanges = response);

        if (hasUnsavedChanges) {
            this.pageLeaveUtilityService.confirmPageLeave((action) => {
                if (action) {
                    this.store.dispatch(this.commonAction.bypassUnsavedChanges(true));
                    this.switchCompany(company, selectBranchUniqueName, fetchLastState);
                } else {
                    this.store.dispatch(this.commonAction.bypassUnsavedChanges(false));
                }
            }, false);
            return;
        }
        this.switchCompany(company, selectBranchUniqueName, fetchLastState);
    }

    /**
     * Switches company
     *
     * @private
     * @param {*} company
     * @param {string} selectBranchUniqueName
     * @param {boolean} [fetchLastState]
     * @memberof CompanyBranchComponent
     */
    private switchCompany(company: any, selectBranchUniqueName: string, fetchLastState?: boolean): void {
        this.store.dispatch(this.companyActions.resetActiveCompanyData());
        this.store.dispatch(this.warehouseAction.resetWarehouseResponse());
        this.generalService.companyUniqueName = company?.uniqueName;
        this.generalService.voucherApiVersion = company?.voucherVersion;
        const details = {
            branchDetails: {
                uniqueName: selectBranchUniqueName
            }
        };

        if (selectBranchUniqueName) {
            this.setOrganizationDetails(OrganizationType.Branch, details);
        } else {
            this.setOrganizationDetails(OrganizationType.Company, details);
        }

        this.store.dispatch(this.loginAction.ChangeCompany(company?.uniqueName, fetchLastState));
    }

    /**
    * Sets the organization details
    *
    * @private
    * @param {OrganizationType} type Type of the organization
    * @param {OrganizationDetails} branchDetails Branch details of an organization
    * @memberof CompanyBranchComponent
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
     * Refreshes the company list
     *
     * @param {Event} event
     * @memberof CompanyBranchComponent
     */
    public refreshCompanies(event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.companyListForFilter = [];
        this.store.dispatch(this.companyActions.RefreshCompanies());
    }

    /**
     * This will get branches of company
     *
     * @param {*} company
     * @memberof CompanyBranchComponent
     */
    public getCompanyBranches(company: any, reloadBranches?: boolean): void {
        if (!company.branches || reloadBranches) {
            company.branches = [];
            this.branchRefreshInProcess = true;
            let branchFilterRequest: BranchFilterRequest = { from: '', to: '', companyUniqueName: company?.uniqueName };
            this.settingsBranchService.GetAllBranches(branchFilterRequest).subscribe(response => {
                if (response?.status === "success") {
                    let unarchivedBranches = response?.body?.filter(branch => branch.isArchived === false);
                    this.branchList = unarchivedBranches?.sort(this.generalService.sortBranches);
                    company.branches = this.branchList;
                    this.companyBranches = company;
                    this.companyBranches.branchCount = response?.body?.length;
                    this.companyBranches.unarchivedBranchCount = this.branchList?.length;
                    this.branchRefreshInProcess = false;

                    if (this.searchBranch) {
                        this.filterBranchList(this.searchBranch);
                    }

                    this.changeDetectorRef.detectChanges();
                    if (!reloadBranches && this.companyBranches.branchCount > 1) {
                        this.showAllBranches(company);
                    }
                } else {
                    this.branchList = [];
                    company.branches = this.branchList;
                    this.companyBranches = company;
                    this.companyBranches.branchCount = this.branchList?.length;
                    this.companyBranches.unarchivedBranchCount = this.branchList?.length;
                    this.branchRefreshInProcess = false;

                    this.changeDetectorRef.detectChanges();
                }
            });
        } else {
            this.branchList = company?.branches;
            this.companyBranches = company;
        }
    }

    /**
     * This will show all branches of company in branch tab
     *
     * @memberof CompanyBranchComponent
     */
    public showAllBranches(company: any): void {
        this.companyBranches.branchCount = company?.branchCount;
        if (company?.branchCount > 1) {
            setTimeout(() => {
                if (this.staticTabs && this.staticTabs.tabs[1]) {
                    this.staticTabs.tabs[1].active = true;
                }
            }, 20);
        } else {
            if (company?.uniqueName !== this.activeCompany?.uniqueName) {
                this.changeCompany(company, '', false);
            }
        }
    }

    /**
     * Callback for select tab event
     *
     * @param {string} tabName
     * @memberof CompanyBranchComponent
     */
    public tabChanged(tabName: string): void {
        this.activeTab = tabName;
        this.searchBranch = "";
        this.filterBranchList(this.searchBranch);

        if (tabName === "company") {
            const unarchivedBranchCount = this.companyBranches?.unarchivedBranchCount;
            const branchCount = this.companyBranches?.branchCount;

            this.companyBranches = this.activeCompany;
            this.companyBranches.branchCount = branchCount;
            this.companyBranches.unarchivedBranchCount = unarchivedBranchCount;
            this.companyBranches.branches = this.currentCompanyBranches;
            this.branchList = this.currentCompanyBranches;
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * This will filter branches
     *
     * @param {*} event
     * @memberof CompanyBranchComponent
     */
    public filterBranchList(event: any): void {
        if (this.companyBranches) {
            this.companyBranches.branches = this.branchList?.filter((branch) => {
                if (!branch.name) {
                    return branch.name?.toLowerCase().includes(event?.toLowerCase());
                } else {
                    return branch.name?.toLowerCase().includes(event?.toLowerCase()) || branch.name?.toLowerCase().includes(event?.toLowerCase());
                }
            });
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * Switches to branch mode
     *
     * @param {any} company Company object
     * @param {string} branchUniqueName Branch uniqueName
     * @memberof CompanyBranchComponent
     */
    public changeBranch(company: any, branchUniqueName: string, event: any, branch?: any): void {
        event.stopPropagation();
        event.preventDefault();

        let hasUnsavedChanges: boolean = false;
        this.store.pipe(select(state => state.common.hasUnsavedChanges), take(1)).subscribe(response => hasUnsavedChanges = response);

        if (hasUnsavedChanges) {
            this.pageLeaveUtilityService.confirmPageLeave((action) => {
                if (action) {
                    this.store.dispatch(this.commonAction.bypassUnsavedChanges(true));
                    this.switchBranch(company, branch, event);
                } else {
                    this.store.dispatch(this.commonAction.bypassUnsavedChanges(false));
                }
            }, false);
            return;
        }

        this.switchBranch(company, branch, event);
    }

    /**
     * Switches branch
     *
     * @private
     * @param {*} company
     * @param {string} branchUniqueName
     * @param {*} event
     * @memberof CompanyBranchComponent
     */
    private switchBranch(company: any, branch: any, event: any): void {
        console.log(company, branch);
        this.store.dispatch(this.warehouseAction.resetWarehouseResponse());
        if (this.activeCompany?.uniqueName !== company?.uniqueName) {
            this.changeCompany(company, branch?.uniqueName, false);
        } else if (branch?.uniqueName !== this.generalService.currentBranchUniqueName) {
            const details = {
                branchDetails: {
                    uniqueName: branch?.uniqueName
                }
            };
            if (branch && !branch.parenBranch && branch.consolidatedBranch) {
                this.setOrganizationDetails(OrganizationType.Company, details);
            } else {
                this.generalService.currentBranchUniqueName = branch?.uniqueName;
                this.setOrganizationDetails(OrganizationType.Branch, details);
            }
            this.store.dispatch(this.invoiceAction.getInvoiceSetting());
            this.companyService.getStateDetails(this.generalService.companyUniqueName).pipe(take(1)).subscribe(response => {
                if (response && response.body) {
                    this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
                        this.generalService.finalNavigate(response.body.lastState);
                    });
                }
            });
        }
    }

    /**
     * This will unset viewing company
     *
     * @memberof CompanyBranchComponent
     */
    public unsetViewingCompany(): void {
        setTimeout(() => {
            this.searchBranch = "";
            this.changeDetectorRef.detectChanges();
        }, 50);
    }

    /**
     * This will route to create branch page
     *
     * @memberof CompanyBranchComponent
     */
    public createBranch(): void {
        this.router.navigate(['/pages/settings/create-branch']);
    }
}
