import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionsUser } from '../../../models/api-models/Subscriptions';
import { IOption } from '../../../theme/ng-select/ng-select';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { SubscriptionRequest } from '../../../models/api-models/Company';
import { SettingsProfileService } from '../../../services/settings.profile.service';

@Component({
    selector: 'move-company',
    styleUrls: ['./move-company.component.scss'],
    templateUrl: './move-company.component.html'
})

export class MoveCompanyComponent implements OnInit {
    @Output() public moveCompany = new EventEmitter<boolean>();
    @Input() public subscriptions: SubscriptionsUser[] = [];
    @Input() public moveSelectedCompany: any;
    public availablePlans: any[] = [];
    public availablePlansOption: IOption[] = [];
    public selectedPlan: any;
    public subscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };

    constructor(private store: Store<AppState>, private settingsProfileActions: SettingsProfileActions, private settingsProfileService: SettingsProfileService) {

    }

    /**
     * Initializes the component
     *
     * @memberof MoveCompanyComponent
     */
    public ngOnInit(): void {
        if(this.moveSelectedCompany) {
            this.getCompanyDetails();
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
            userUniqueName: this.moveSelectedCompany.createdBy.uniqueName,
            licenceKey: ''
        };
        this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true, moveCompany: this.moveSelectedCompany.uniqueName });
    }

    /**
     * This will dispatch the update plan api and will close popup
     *
     * @param {*} obj
     * @memberof MoveCompanyComponent
     */
    public patchProfile(obj): void {
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
        this.settingsProfileService.getCompanyDetails(this.moveSelectedCompany.uniqueName).subscribe((response: any) => {
            if (response && response.status === "success" && response.body) {
                this.moveSelectedCompany = response.body;

                if(this.subscriptions && this.subscriptions.length > 0) {
                    this.subscriptions.forEach(plan => {
                        if(plan.subscriptionId && plan.planDetails && plan.planDetails.companiesLimit > plan.totalCompanies && this.moveSelectedCompany && this.moveSelectedCompany.subscription && this.moveSelectedCompany.subscription.planDetails && this.moveSelectedCompany.subscription.planDetails.uniqueName !== plan.planDetails.uniqueName && this.availablePlans[plan.planDetails.uniqueName] === undefined && plan.planDetails.countries.includes(this.moveSelectedCompany.country)) {
                            this.availablePlansOption.push({label: plan.planDetails.name, value: plan.planDetails.uniqueName});
        
                            if(this.availablePlans[plan.planDetails.uniqueName] === undefined) {
                                this.availablePlans[plan.planDetails.uniqueName] = [];
                            }
        
                            this.availablePlans[plan.planDetails.uniqueName] = plan;
                        }
                    });
                }
            }
        });
    }
}
