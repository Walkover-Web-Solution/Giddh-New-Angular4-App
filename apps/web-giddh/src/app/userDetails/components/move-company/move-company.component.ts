import { Component, OnInit, Input } from '@angular/core';
import { SubscriptionsUser } from '../../../models/api-models/Subscriptions';
import { IOption } from '../../../theme/ng-select/ng-select';

@Component({
    selector: 'move-company',
    styleUrls: ['./move-company.component.scss'],
    templateUrl: './move-company.component.html'
})

export class MoveCompanyComponent implements OnInit {
    @Input() public subscriptions: SubscriptionsUser[] = [];
    @Input() public moveSelectedCompany: any;
    public availablePlans: any[] = [];
    public availablePlansOption: IOption[] = [];
    public selectedPlan: any;

    constructor() {

    }

    public ngOnInit() {
        if(this.subscriptions && this.subscriptions.length > 0) {
            this.subscriptions.forEach(plan => {
                if(plan.subscriptionId && plan.planDetails && plan.planDetails.companiesLimit > plan.totalCompanies) {                    
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
        console.log(this.availablePlans[this.selectedPlan]);
    }
}
