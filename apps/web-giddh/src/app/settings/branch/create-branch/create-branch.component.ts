import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralActions } from '../../../actions/general/general.actions';
import { OnboardingFormRequest } from '../../../models/api-models/Common';
import { CommonService } from '../../../services/common.service';
import { CompanyService } from '../../../services/companyService.service';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { SettingsAsideConfiguration, SettingsAsideFormType } from '../../constants/settings.constant';
import { SettingsUtilityService } from '../../services/settings-utility.service';
@Component({
    selector: 'create-branch',
    templateUrl: './create-branch.component.html',
    styleUrls: ['./create-branch.component.scss'],
    animations: [
        trigger('slideInOut', [
            state('in', style({
                transform: 'translate3d(0, 0, 0)'
            })),
            state('out', style({
                transform: 'translate3d(100%, 0, 0)'
            })),
            transition('in => out', animate('400ms ease-in-out')),
            transition('out => in', animate('400ms ease-in-out'))
        ]),
    ]
})

export class CreateBranchComponent implements OnInit {

    public accountAsideMenuState: string = 'out';
    public companyDetails: any = {
        name: '',
        businessType: '',
        country: {
            countryName: '',
            countryCode: '',
            currencyCode: '',
            currencyName: ''
        },
    };
    /** Stores the address configuration */
    public addressConfiguration: SettingsAsideConfiguration = {
        type: SettingsAsideFormType.CreateAddress,
        stateList: [],
        tax: {
            name: '',
            validation: []
        },
        linkedEntities: []
    };
    public branchForm: FormGroup;
    public addresses: Array<any>;
    public isAddressChangeInProgress: boolean = false;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private commonService: CommonService,
        private companyService: CompanyService,
        private formBuilder: FormBuilder,
        private generalActions: GeneralActions,
        private store: Store<AppState>,
        private settingsProfileService: SettingsProfileService,
        private settingsUtilityService: SettingsUtilityService,
        private toastService: ToasterService
    ) {
        this.store.select(appState => appState.settings.profile).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.name) {
                this.companyDetails = {
                    name: response.name,
                    businessType: response.businessType,
                    country: {
                        countryName: response.countryV2 ? response.countryV2.countryName : '',
                        countryCode: response.countryV2 ? response.countryV2.alpha2CountryCode.toLowerCase() : '',
                        currencyCode: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.code : '',
                        currencyName: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.symbol : ''
                    }
                }
                if (!this.addressConfiguration.stateList.length) {
                    this.loadStates(this.companyDetails.country.countryCode.toUpperCase());
                    this.loadTaxDetails(this.companyDetails.country.countryCode.toUpperCase());
                }
            }
        });
    }

    public ngOnInit(): void {
        this.loadAddresses('GET');
        this.branchForm = this.formBuilder.group({
            alias: ['', Validators.required],
            name: ['', Validators.required],
            address: ['']
        });
        this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/branch'));
    }

    public toggleAsidePane(): void {
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    public openCreateAddressAside() {
        this.toggleAccountAsidePane();
    }

    public toggleAccountAsidePane(event?): void {
        if (event) {
            event.preventDefault();
        }
        this.accountAsideMenuState = this.accountAsideMenuState === 'out' ? 'in' : 'out';

        this.toggleBodyClass();
    }

    public toggleBodyClass(): void {
        if (this.accountAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    public handleFinalSelection(selectedAddresses: Array<any>): void {
        this.addresses.forEach(address => {
            if (!selectedAddresses.includes(address.uniqueName)) {
                address.isDefault = false;
            }
        });
    }

    public selectAddress(option: any): void {
        if (option.isDefault) {
            option.isDefault = false;
        }
    }

    public setDefault(option: any, event: any): void {
        event.stopPropagation();
        event.preventDefault();
        if (!option.isDefault) {
            this.addresses.forEach(address => {
                if (address.value !== option.value) {
                    address.isDefault = false;
                }
            });
        }
        option.isDefault = !option.isDefault;
        if (option.isDefault) {
            this.branchForm.get('address').patchValue([
                ...this.branchForm.get('address').value,
                option.value
            ]);
        }
    }

    public handleFormSubmit(): void {
        const requestObj = {
            name: this.branchForm.value.name,
            alias: this.branchForm.value.alias,
            linkAddresses: this.addresses.map(address => ({
                uniqueName: address.uniqueName,
                isDefault: address.isDefault
            }))
        }
        this.settingsProfileService.createNewBranch(requestObj).subscribe(response => {
            if (response && response.status === 'success') {
                this.toastService.successToast('Branch created successfully');
                this.branchForm.reset();
            }
        });
    }

    public addNewAddress() {
        this.accountAsideMenuState = 'in';
    }

    public loadStates(countryCode: string): void {
        this.companyService.getAllStates({ country: countryCode }).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                const result = response.body;
                this.addressConfiguration.stateList = [];
                Object.keys(result.stateList).forEach(key => {
                    this.addressConfiguration.stateList.push({
                        label: result.stateList[key].code + ' - ' + result.stateList[key].name,
                        value: result.stateList[key].code,
                        code: result.stateList[key].stateGstCode,
                        stateName: result.stateList[key].name
                    });
                });
            }
        });
    }

    public createNewAddress(addressDetails: any): void {
        this.isAddressChangeInProgress = true;
        const chosenState = addressDetails.addressDetails.stateList.find(selectedState => selectedState.value === addressDetails.formValue.state);
        const linkEntity = addressDetails.addressDetails.linkedEntities.filter(entity => (addressDetails.formValue.linkedEntity.includes(entity.uniqueName))).map(filteredEntity => ({
            uniqueName: filteredEntity.uniqueName,
            isDefault: filteredEntity.isDefault,
            entity: filteredEntity.entity
        }));
        const requestObj = {
            taxNumber: addressDetails.formValue.taxNumber,
            stateCode: addressDetails.formValue.state,
            stateName: chosenState ? chosenState.stateName : '',
            address: addressDetails.formValue.address,
            name: addressDetails.formValue.name,
            linkEntity
        };

        this.settingsProfileService.createNewAddress(requestObj).subscribe((response: any) => {
            if (response.status === 'success' && response.body) {
                this.toggleAccountAsidePane();
                this.addresses.push({
                    ...response.body,
                    label: response.body.name,
                    value: response.body.uniqueName
                })
                this.toastService.successToast('Address created successfully');
            }
            this.isAddressChangeInProgress = false;
        }, () => {
            this.isAddressChangeInProgress = false;
        });
    }

    public loadTaxDetails(countryCode: string): void {
        let onboardingFormRequest = new OnboardingFormRequest();
        onboardingFormRequest.formName = 'onboarding';
        onboardingFormRequest.country = countryCode;
        this.commonService.getOnboardingForm(onboardingFormRequest).subscribe((response: any) => {
            if (response && response.status === 'success') {
                if (response.body && response.body.fields && response.body.fields.length > 0) {
                    const taxField = response.body.fields.find(field => field && field.name === 'taxName');
                    // Tax field found, support for the country taxation
                    this.addressConfiguration.tax.name = taxField ? taxField.label : '';
                    this.addressConfiguration.tax.validation = taxField ? taxField.regex : [];
                }
            }
        });
    }

    public loadLinkedEntities(successCallback: Function): void {
        this.settingsProfileService.getAllLinkedEntities().subscribe(response => {
            if (response && response.body && response.status === 'success') {
                this.addressConfiguration.linkedEntities = response.body.results.map(result => ({
                    ...result,
                    isDefault: false,
                    label: result.alias,
                    value: result.uniqueName
                }));
            }
            if (successCallback) {
                successCallback();
            }
        });
    }

    public handleShortcutPress(): void {
        if (this.accountAsideMenuState === 'out') {
            this.loadLinkedEntities(() => {
                this.toggleAsidePane();
            });
        } else {
            this.toggleAsidePane();
        }
    }

    private loadAddresses(method: string, params?: any): void {
        this.settingsProfileService.getCompanyAddresses(method, params).subscribe((response) => {
            if (response && response.body && response.status === 'success') {
                this.addresses = this.settingsUtilityService.getFormattedCompanyAddresses(response.body.results).map(address => (
                    {
                        ...address,
                        isDefault: false,
                        label: address.name,
                        value: address.uniqueName
                    }));
            }
        });
    }

}
