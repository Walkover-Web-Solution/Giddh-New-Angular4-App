import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubscriptionRequest } from '../../../models/api-models/Company';
import { IOption } from '../../../theme/ng-select/ng-select';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';

@Component({
    selector: 'add-company',
    styleUrls: ['./add-company.component.scss'],
    templateUrl: './add-company.component.html'
})

export class AddCompanyComponent implements OnInit {
    /* This will emit true/false if added or not */
    @Output() public addCompany = new EventEmitter<boolean>();
    /* This will accept active company data */
    @Input() public activeCompany: any;
    /* This will accept all associated company data */
    @Input() public allAssociatedCompanies: any[] = [];
    /* This will contain all active company data based on criteria */
    public associatedCompanies: any[] = [];
    /* This will contain list of all active company data which we will show in dropdown */
    public associatedCompaniesOption: IOption[] = [];
    /* This will contain selected company uniquename */
    public selectedCompany: any = '';
    /* This will hold plan data to assign to company */
    public subscriptionRequestObj: SubscriptionRequest = {
        planUniqueName: '',
        subscriptionId: '',
        userUniqueName: '',
        licenceKey: ''
    };

    constructor(private store: Store<AppState>, private settingsProfileActions: SettingsProfileActions) {

    }

    /**
     * Initializes the component
     *
     * @memberof AddCompanyComponent
     */
    public ngOnInit(): void {
        if (this.allAssociatedCompanies && this.allAssociatedCompanies.length > 0) {
            this.allAssociatedCompanies.forEach(company => {
                // country should be same and should not have same plan
                if (this.activeCompany.subscription.planDetails.countries.includes(company.country) && this.activeCompany.subscription.planDetails.uniqueName !== company.subscription.planDetails.uniqueName) {
                    this.associatedCompanies[company.uniqueName] = company;
                    this.associatedCompaniesOption.push({ label: company.name, value: company.uniqueName });
                }
            });
        }
    }

    /**
     * This will initiate the update plan
     *
     * @memberof AddCompanyComponent
     */
    public addCompanyInNewPlan(): void {
        this.subscriptionRequestObj = {
            planUniqueName: '',
            subscriptionId: this.activeCompany.subscription.subscriptionId,
            userUniqueName: this.associatedCompanies[this.selectedCompany].createdBy.uniqueName,
            licenceKey: ''
        };
        this.patchProfile({ subscriptionRequest: this.subscriptionRequestObj, callNewPlanApi: true, moveCompany: this.selectedCompany });
    }

    /**
     * This will dispatch the update plan api and will close popup
     *
     * @param {*} obj
     * @memberof AddCompanyComponent
     */
    public patchProfile(obj): void {
        this.store.dispatch(this.settingsProfileActions.PatchProfile(obj));
        this.addCompany.emit(true);
    }

    /**
     * This will close the popup
     *
     * @memberof AddCompanyComponent
     */
    public closePopup(): void {
        this.addCompany.emit(false);
    }
}
