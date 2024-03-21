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
    @Output() public moveCompany = new EventEmitter<boolean>();
    @Input() public subscriptions: any[] = [];
    @Input() public moveSelectedCompany: any;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public availablePlans: any[] = [];
    public availablePlansOption: IOption[] = [];
    public selectedPlan: any;
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

    constructor(private store: Store<AppState>, private settingsProfileActions: SettingsProfileActions,
        private componentStore: SubscriptionComponentStore,
        private settingsProfileService: SettingsProfileService) {
    }

    /**
     * Initializes the component
     *
     * @memberof MoveCompanyComponent
     */
    public ngOnInit(): void {
        console.log(this.subscriptions, this.moveSelectedCompany);
        if (this.moveSelectedCompany) {
            this.getCompanyDetails();
        }
        if (this.subscriptionMove) {
            this.componentStore.getAllSubscriptions(null);
            this.subscriptionList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
                console.log(response);
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
        this.settingsProfileService.getCompanyDetails(this.moveSelectedCompany?.uniqueName ? this.moveSelectedCompany?.uniqueName : this.moveSelectedCompany.companies[0]?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response && response.status === "success" && response.body) {
                this.moveSelectedCompany = response.body;
                if (this.subscriptions && this.subscriptions.length > 0) {
                    this.subscriptions.forEach(plan => {
                        if (this.subscriptionMove) {
                            if (plan.subscriptionId && this.moveSelectedCompany?.subscriptionId !== plan.subscriptionId && plan.companies?.length > plan?.totalCompanies && this.availablePlans[plan?.plan?.uniqueName] === undefined &&
                                plan.planCountries?.find(country => country?.countryName === this.moveSelectedCompany.country)
                            ) {
                                console.log('called');
                                this.availablePlansOption.push({ label: plan.plan?.name, value: plan.plan?.uniqueName });
                                if (this.availablePlans[plan.plan?.uniqueName] === undefined) {
                                    this.availablePlans[plan.plan?.uniqueName] = [];
                                }
                                this.availablePlans[plan.plan?.uniqueName] = plan;
                                console.log(this.availablePlans, plan);
                            }
                        } else {
                            if (plan.subscriptionId && plan.planDetails?.companiesLimit > plan.totalCompanies && this.moveSelectedCompany?.subscription?.subscriptionId !== plan.subscriptionId && this.availablePlans[plan.planDetails?.uniqueName] === undefined && plan.planDetails.countries.includes(this.moveSelectedCompany.country)) {
                                this.availablePlansOption.push({ label: plan.planDetails?.name, value: plan.planDetails?.uniqueName });
                                if (this.availablePlans[plan.planDetails?.uniqueName] === undefined) {
                                    this.availablePlans[plan.planDetails?.uniqueName] = [];
                                }
                                this.availablePlans[plan.planDetails?.uniqueName] = plan;
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
        text = text?.replace("[COMPANY_NAME]", this.moveSelectedCompany?.name ? this.moveSelectedCompany?.name : this.moveSelectedCompany?.companies[0].name)?.replace("[PLAN_NAME]", this.moveSelectedCompany?.subscription?.planDetails?.name ? this.moveSelectedCompany?.subscription?.planDetails?.name : this.moveSelectedCompany?.plan?.name);
        return text;
    }
}
