import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyActions } from '../../actions/company.actions';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';
import { Organization, OrganizationDetails } from '../../models/api-models/Company';
import { OrganizationType } from '../../models/user-login-state';
import { CompanyService } from '../../services/companyService.service';
import { GeneralService } from '../../services/general.service';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { AppState } from '../../store';

@Component({
    selector: 'mobile-search-branch',
    templateUrl: './search-branch.component.html',
    styleUrls: ['./search-branch.component.scss'],
})
export class MobileSearchBranchComponent implements OnInit, OnDestroy {

    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Search query to search branch */
    public searchBranchQuery: string;
    /** Current organization type */
    public currentOrganizationType: OrganizationType;
    /** Holds the active company information */
    public activeCompany: any;
    /** Stores the details of the current branch */
    public currentBranch: any;

    /** Subject to unsubscribe from all the subscription */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    /** @ignore */
    constructor(
        private companyService: CompanyService,
        private companyActions: CompanyActions,
        private generalService: GeneralService,
        private router: Router,
        private settingsProfileService: SettingsProfileService,
        private store: Store<AppState>,
        private settingsBranchAction: SettingsBranchActions,
    ) {

    }

    /**
     * Initializes the component
     *
     * @memberof MobileSearchBranchComponent
     */
    public ngOnInit(): void {
        this.currentCompanyBranches$ = this.store.pipe(select(appStore => appStore.settings.branches), takeUntil(this.destroyed$));
        this.currentCompanyBranches$.subscribe(response => {
            if (response && response.length) {
                this.currentCompanyBranches = response;
                if (this.generalService.currentBranchUniqueName) {
                    this.currentBranch = response.find(branch =>
                        (this.generalService.currentBranchUniqueName === branch?.uniqueName)) || {};
                } else {
                    this.currentBranch = '';
                }
            }
        });
        this.store.pipe(select(appStore => appStore.session.currentOrganizationDetails), takeUntil(this.destroyed$)).subscribe((organization: Organization) => {
            if (organization && organization.details && organization.details.branchDetails) {
                this.generalService.currentBranchUniqueName = organization.details.branchDetails?.uniqueName;
                this.generalService.currentOrganizationType = organization.type;
                this.currentOrganizationType = organization.type;
                if (this.generalService.currentBranchUniqueName) {
                    this.currentCompanyBranches$.pipe(take(1)).subscribe(response => {
                        if (response) {
                            this.currentBranch = response.find(branch => (branch?.uniqueName === this.generalService.currentBranchUniqueName));
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
     * Unsubscribes from all the listeners
     *
     * @memberof MobileSearchBranchComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Switches to branch mode
     *
     * @param {string} branchUniqueName Branch uniqueName
     * @memberof MobileSearchBranchComponent
     */
    public switchToBranch(branchUniqueName: string, event: any): void {
        event.stopPropagation();
        event.preventDefault();
        if (branchUniqueName === this.generalService.currentBranchUniqueName) {
            return;
        }
        const details = {
            branchDetails: {
                uniqueName: branchUniqueName
            }
        };
        this.setOrganizationDetails(OrganizationType.Branch, details);
        this.companyService.getStateDetails(this.generalService.companyUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                if (screen.width <= 767) {
                    window.location.href = '/pages/mobile/home';
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
     * @memberof MobileSearchBranchComponent
     */
    public filterBranch(branchName: string): void {
        let branches = [];
        this.currentCompanyBranches$.pipe(take(1)).subscribe(response => {
            branches = response || [];
        });
        if (branchName) {
            this.currentCompanyBranches = branches?.filter(branch => {
                if (branch) {
                    if (!branch.alias) {
                        return branch.name.toLowerCase().includes(branchName.toLowerCase());
                    } else {
                        return branch.name.toLowerCase().includes(branchName.toLowerCase()) || branch.alias.toLowerCase().includes(branchName.toLowerCase());
                    }
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
     * @memberof MobileSearchBranchComponent
     */
    private setOrganizationDetails(type: OrganizationType, branchDetails: OrganizationDetails): void {
        const organization: Organization = {
            type, // Mode to which user is switched to
            uniqueName: this.activeCompany ? this.activeCompany?.uniqueName : '',
            details: branchDetails
        };
        this.store.dispatch(this.companyActions.setCompanyBranch(organization));
    }
}
