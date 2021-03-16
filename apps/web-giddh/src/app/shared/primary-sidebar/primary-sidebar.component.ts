import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { BsDropdownDirective } from "ngx-bootstrap/dropdown";
import { Observable, ReplaySubject } from "rxjs";
import { takeUntil, take } from "rxjs/operators";
import { CompanyActions } from "../../actions/company.actions";
import { GeneralActions } from "../../actions/general/general.actions";
import { AccountResponse } from "../../models/api-models/Account";
import { CompanyResponse, Organization, OrganizationDetails } from "../../models/api-models/Company";
import { CompAidataModel } from "../../models/db";
import { ICompAidata } from "../../models/interfaces/ulist.interface";
import { OrganizationType } from "../../models/user-login-state";
import { CompanyService } from "../../services/companyService.service";
import { GeneralService } from "../../services/general.service";
import { AppState } from "../../store";


@Component({
    selector: 'primary-sidebar',
    templateUrl: './primary-sidebar.component.html',
    styleUrls: ['./primary-sidebar.component.scss'],

})

export class PrimarySidebarComponent implements OnInit {
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
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
    /** Stores the details of the current branch */
    public currentBranch: any;
    public isMobileSite: boolean;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1)


    @Input() public isOpen: boolean = false;
    @ViewChild('dropdown', { static: true }) public companyDropdown: BsDropdownDirective;

    constructor(
        private generalService: GeneralService,
        private store: Store<AppState>,
        private activeCompanyForDb: ICompAidata,
        private companyService: CompanyService,
        private companyActions: CompanyActions,
        private router: Router
    ) {
        // Reset old stored application date
        this.store.dispatch(this.companyActions.ResetApplicationDate());
        this.activeAccount$ = this.store.pipe(select(p => p.ledger.account), takeUntil(this.destroyed$));
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
        this.companyDropdown.isOpen = false;
        //this.toggleBodyScroll();
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
        if (this.companyDropdown.isOpen && !this.isMobileSite) {
            document.querySelector('body').classList.add('prevent-body-scroll');
        } else {
            document.querySelector('body').classList.remove('prevent-body-scroll');
        }
    }
    public ngOnInit(): void {


    }

}
