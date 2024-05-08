import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { IOption } from '../../../theme/ng-select/ng-select';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { SubscriptionRequest } from '../../../models/api-models/Company';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { UntypedFormControl } from '@angular/forms';
import { SubscriptionComponentStore } from '../../../subscription/utility/subscription.store';

@Component({
    selector: 'move-company',
    styleUrls: ['./move-company.component.scss'],
    templateUrl: './move-company.component.html',
    providers: [SubscriptionComponentStore]
})

export class MoveCompanyComponent implements OnInit, OnDestroy {
    /* Emit move company response */
    @Output() public moveCompany = new EventEmitter<boolean>();
    /* Hold subscriptions data */
    @Input() public subscriptions: any[] = [];
    /* Hold move selected company*/
    @Input() public moveSelectedCompany: any;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* Hold available plans data */
    public availablePlans: any[] = [];
    /* Hold available plan options data */
    public availablePlansOption: IOption[] = [];
    /* Hold selected plan data */
    public selectedPlan: any;
    /* Hold subscription api request */
    public subscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Control for the MatSelect filter keyword */
    public searchPlan: UntypedFormControl = new UntypedFormControl();
    /** True if api call in progress */
    public isLoading: boolean = true;
    /** True if api call in progress */
    @Input() public subscriptionMove: boolean;
    /** Holds Store Subscription list observable*/
    public subscriptionList$ = this.componentStore.select(state => state.subscriptionList);
    /** Holds all plan list used to reset all all roles after filtered allRoles Varible */
    public availablePlansOptionList: any[] = [];

    constructor(
        private store: Store<AppState>,
        private settingsProfileActions: SettingsProfileActions,
        private componentStore: SubscriptionComponentStore,
        private settingsProfileService: SettingsProfileService
    ) {
    }

    /**
     * Initializes the component
     *
     * @memberof MoveCompanyComponent
     */
    public ngOnInit(): void {
        if (this.moveSelectedCompany) {
            this.getCompanyDetails();
        }
        if (this.subscriptionMove) {
            this.componentStore.getAllSubscriptions(null);
            this.subscriptionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response) {
                    this.subscriptions = response?.body?.results;
                } else {
                    this.subscriptions = [];
                }
            });
        }
    }



    /**
     * This will initiate the update plan
     *
     * @memberof MoveCompanyComponent
     */
    public moveCompanyInNewPlan(): void {
        this.subscriptionRequestObj = {
            planUniqueName: '',
            subscriptionId: this.availablePlans[this.selectedPlan].subscriptionId,
            userUniqueName: this.moveSelectedCompany?.createdBy?.uniqueName,
            licenceKey: ''
        };
        this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true, moveCompany: this.moveSelectedCompany?.uniqueName });
    }

    /**
     * This will dispatch the update plan api and will close popup
     *
     * @param {*} obj
     * @memberof MoveCompanyComponent
     */
    public patchProfile(obj: any): void {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
        this.moveCompany.emit(true);
    }

    /**
     * This will close the popup
     *
     * @memberof MoveCompanyComponent
     */
    public closePopup(): void {
        this.moveCompany.emit(false);
    }

    /**
     * This will get the company details
     *
     * @memberof MoveCompanyComponent
     */
    public getCompanyDetails(): void {
        this.settingsProfileService.getCompanyDetails(this.moveSelectedCompany?.uniqueName ? this.moveSelectedCompany?.uniqueName : (this.moveSelectedCompany?.companies && this.moveSelectedCompany?.companies[0]?.uniqueName ? this.moveSelectedCompany?.companies[0]?.uniqueName : this.moveSelectedCompany?.companiesList[0]?.uniqueName)).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response && response.status === "success" && response.body) {
                this.moveSelectedCompany = response.body;
                if (this.subscriptions && this.subscriptions.length > 0) {
                    this.subscriptions.forEach(subscription => {
                        if (this.subscriptionMove) {
                            if (subscription.subscriptionId && this.moveSelectedCompany?.subscriptionId !== subscription.subscriptionId && subscription.companies?.length > subscription?.totalCompanies && this.availablePlans[subscription?.subscription?.uniqueName] === undefined &&
                                subscription.planCountries?.find(country => country?.countryName === this.moveSelectedCompany.country ? this.moveSelectedCompany.country : this.moveSelectedCompany.country?.countryName)
                            ) {
                                this.availablePlansOption.push({ label: subscription.plan?.name, value: subscription.plan?.uniqueName });
                                if (this.availablePlans[subscription.plan?.uniqueName] === undefined) {
                                    this.availablePlans[subscription.plan?.uniqueName] = [];
                                }
                                this.availablePlans[subscription.plan?.uniqueName] = subscription;
                            }
                        } else {
                            if (subscription.subscriptionId && subscription.planDetails?.companiesLimit > subscription.totalCompanies && this.moveSelectedCompany?.subscription?.subscriptionId !== subscription.subscriptionId && this.availablePlans[subscription.planDetails?.uniqueName] === undefined && subscription.planDetails.countries.includes(this.moveSelectedCompany.country)) {
                                this.availablePlansOption.push({ label: subscription.planDetails?.name, value: subscription.planDetails?.uniqueName });
                                if (this.availablePlans[subscription.planDetails?.uniqueName] === undefined) {
                                    this.availablePlans[subscription.planDetails?.uniqueName] = [];
                                }
                                this.availablePlans[subscription.planDetails?.uniqueName] = subscription;
                                this.availablePlansOptionList = this.availablePlansOption;
                            }
                        }
                    });
                }
            }
            this.isLoading = false;
        });
    }

    /**
    * Releases memory
    *
    * @memberof MoveCompanyComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * This will return move plan text
     *
     * @returns {string}
     * @memberof MoveCompanyComponent
     */
    public getMovePlanText(): string {
        let text = this.localeData?.subscription?.move_plan_note ? this.localeData?.subscription?.move_plan_note : this.localeData?.move_plan_note;
        text = text?.replace("[COMPANY_NAME]", this.moveSelectedCompany?.name ? this.moveSelectedCompany?.name : (this.moveSelectedCompany?.companies && this.moveSelectedCompany?.companies[0]?.name ? this.moveSelectedCompany?.companies[0]?.name : this.moveSelectedCompany?.companiesList[0]?.name))?.replace("[PLAN_NAME]", this.moveSelectedCompany?.subscription?.planDetails?.name ? this.moveSelectedCompany?.subscription?.planDetails?.name : this.moveSelectedCompany?.plan?.name);
        return text;
    }

      /**
     * Handle Role search Query
     *
     * @param {*} event
     * @memberof MoveCompanyComponent
     */
      public onSearchQueryChange(event: any): void {
        if (event) {
            this.availablePlansOption = this.availablePlansOption?.filter(role => role.label.toUpperCase().indexOf(event.toUpperCase()) > -1);
        }
    }

    /**
     * Handle Role Search Clear
     *
     * @memberof MoveCompanyComponent
     */
    public onSearchClear(): void {
            this.availablePlansOption = this.availablePlansOptionList;
            this.availablePlansOption = this.availablePlansOption;
            ;
    }
}
