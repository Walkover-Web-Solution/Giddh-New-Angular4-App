import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionsUser } from '../../../models/api-models/Subscriptions';
import { IOption } from '../../../theme/ng-select/ng-select';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { SubscriptionRequest } from '../../../models/api-models/Company';

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

    constructor(private store: Store<AppState>, private settingsProfileActions: SettingsProfileActions) {

    }

    public ngOnInit() {
        console.log(this.moveSelectedCompany);
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

    public moveCompanyInNewPlan() {
        this.subscriptionRequestObj = {
            planUniqueName: this.selectedPlan,
            subscriptionId: '',
            userUniqueName: this.moveSelectedCompany.createdBy.uniqueName,
            licenceKey: ''
        };
        this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true, moveCompany: this.moveSelectedCompany.uniqueName });
    }

    public patchProfile(obj): void {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
        this.moveCompany.emit(true);
    }

    public closePopup() {
        this.moveCompany.emit(false);
    }
}
