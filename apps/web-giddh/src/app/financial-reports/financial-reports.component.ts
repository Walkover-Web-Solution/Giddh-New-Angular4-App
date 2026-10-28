import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTabGroup, MatTabChangeEvent } from '@angular/material/tabs';
import { ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyResponse } from '../models/api-models/Company';
import { OrganizationType } from '../models/user-login-state';
import { GeneralService } from '../services/general.service';
import { SettingsProfileService } from '../services/settings.profile.service';
import { environment } from '../../environments/environment.generated';

@Component({
    selector: 'financial-reports',
    templateUrl: './financial-reports.component.html',
    styleUrls: ['./financial-reports.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinancialReportsComponent implements OnInit, OnDestroy {
    public selectedCompany: CompanyResponse;
    public CanTBLoad: boolean = true;
    public CanPLLoad: boolean = false;
    public CanBSLoad: boolean = false;
    public CanNewTBLoadOnThisEnv: boolean = false;
    public isWalkoverCompany: boolean = false;
    /** This will hold active tab */
    public activeTab: string = 'trial-balance';
    /** This will hold active tab index */
    public activeTabIndex: number = 0;
    /** True, when tabs are navigated with the help of routing, done to prevent redundant routing as
     * tab changed event is triggered on setting any tab as active which leads to a second navigation to the
     * same route which cancels the previous route with route ID and doesn't highlight the menu item
     */
    public preventTabChangeWithRoute: boolean;
    @ViewChild('staticTabsTBPL', { static: true }) public staticTabs: MatTabGroup;
    /** Selected tab index for Material tabs */
    public selectedTabIndex: number = 0;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private settingsProfileService: SettingsProfileService,
        private generalService: GeneralService) {
    }

    public ngOnInit() {
        if (!environment.production) {
            this.CanNewTBLoadOnThisEnv = true;
        } else {
            this.CanNewTBLoadOnThisEnv = false;
        }

        // Company profile for report metadata; CSV addresses stored separately (do not mutate company addresses)
        this.settingsProfileService.GetProfileInfo().pipe(take(1), takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === 'success' && response.body) {
                this.generalService.activeCompany = response.body;
                this.selectedCompany = response.body;
                this.loadOrganizationAddressesForCsvExport(response.body.addresses);
            }
        });

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe((val) => {
            if (val && val.tab && val.tabIndex) {
                this.activeTab = val.tab;
                this.activeTabIndex = val.tabIndex;
                this.preventTabChangeWithRoute = true;
                this.selectTab(Number(val.tabIndex));
            }
        });
    }

    /**
     * Loads address details into csvExportAddresses only:
     * company mode → company addresses; branch mode → branch-linked addresses.
     *
     * @private
     * @param {any[]} [companyAddresses] Addresses from company profile (company mode)
     * @memberof FinancialReportsComponent
     */
    private loadOrganizationAddressesForCsvExport(companyAddresses?: any[]): void {
        if (this.generalService.currentOrganizationType === OrganizationType.Branch) {
            this.settingsProfileService.getBranchInfo().pipe(take(1), takeUntil(this.destroyed$)).subscribe((response: any) => {
                if (response?.status === 'success' && response.body?.addresses) {
                    this.generalService.csvExportAddresses = response.body.addresses;
                }
            });
            return;
        }

        this.generalService.csvExportAddresses = companyAddresses ?? [];
    }

    /**
     * Selects a tab by index using Angular Material tabs API
     *
     * @param {number} id - The index of the tab to select (0-based)
     * @memberof FinancialReportsComponent
     */
    public selectTab(id: number) {
        if (this.staticTabs) {
            this.staticTabs.selectedIndex = id;
            this.selectedTabIndex = id;
            this.CanTBLoad = id === 0;
            this.CanPLLoad = id === 1;
            this.CanBSLoad = id === 2;
        }
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof FinancialReportsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will navigate to selected tab
     *
     * @param {string} tab
     * @param {number} tabIndex
     * @memberof FinancialReportsComponent
     */
    public tabChanged(tab: string, tabIndex: number): void {
        if (!this.preventTabChangeWithRoute) {
            this.router.navigate(['/pages/trial-balance-and-profit-loss'], { queryParams: { tab, tabIndex } });
        }
    }

    /**
     * Handles Material tab change events
     *
     * @param {MatTabChangeEvent} event
     * @memberof FinancialReportsComponent
     */
    public onTabChanged(event: MatTabChangeEvent): void {
        const tabNames = ['trial-balance', 'profit-loss', 'balance-sheet'];
        const tabName = tabNames[event.index];

        if (tabName) {
            this.preventTabChangeWithRoute = false;
            this.selectedTabIndex = event.index;

            // Update the loading flags based on selected tab
            this.CanTBLoad = (event.index === 0);
            this.CanPLLoad = (event.index === 1);
            this.CanBSLoad = (event.index === 2);

            this.tabChanged(tabName, event.index);
        }
    }
}
