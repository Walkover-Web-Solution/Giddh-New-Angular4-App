import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyActions } from '../../actions/company.actions';
import { SettingsBranchActions } from '../../actions/settings/branch/settings.branch.action';

import { RESTRICTED_BRANCH_ROUTES } from '../../app.constant';
import { Organization, OrganizationDetails } from '../../models/api-models/Company';
import { OrganizationType } from '../../models/user-login-state';
import { GeneralService } from '../../services/general.service';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { AppState } from '../../store';

@Component({
    selector: 'mobile-search-branch',
    templateUrl: './mobile-search-branch.component.html',
    styleUrls: ['./mobile-search-branch.component.scss'],
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

    /** Subject to unsubscribe from all the subscription */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /** @ignore */
    constructor(
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
            }
        })
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
        const details = {
            branchDetails: {
                uniqueName: branchUniqueName
            }
        };
        this.setOrganizationDetails(OrganizationType.Branch, details);
        if (!RESTRICTED_BRANCH_ROUTES.includes(this.router.url)) {
            window.location.reload();
        } else {
            window.location.href = '/pages/home';
        }
    }

    /**
     * This will get the current company data
     *
     * @memberof MobileSearchBranchComponent
     */
    public getCurrentCompanyData(): void {
        this.settingsProfileService.GetProfileInfo().subscribe((response: any) => {
            if (response && response.status === "success" && response.body) {
                this.activeCompany = response.body;
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
            this.currentCompanyBranches = branches.filter(branch => {
                if (!branch.alias) {
                    return branch.name.toLowerCase().includes(branchName.toLowerCase());
                } else {
                    return branch.name.toLowerCase().includes(branchName.toLowerCase()) || branch.alias.toLowerCase().includes(branchName.toLowerCase());
                }
            });
        } else {
            this.currentCompanyBranches = branches;
        }
    }

    /**
     * Loads company branches
     *
     * @memberof MobileSearchBranchComponent
     */
    public loadCompanyBranches(): void {
        if (this.generalService.companyUniqueName) {
            // Avoid API call if new user is onboarded
            this.store.dispatch(this.settingsBranchAction.GetALLBranches({from: '', to: ''}));
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
            uniqueName: this.activeCompany ? this.activeCompany.uniqueName : '',
            details: branchDetails
        };
        this.store.dispatch(this.companyActions.setCompanyBranch(organization));
    }
}
