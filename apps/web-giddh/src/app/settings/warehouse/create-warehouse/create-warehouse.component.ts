import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { OnboardingFormRequest } from '../../../models/api-models/Common';
import { CommonService } from '../../../services/common.service';
import { CompanyService } from '../../../services/companyService.service';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { SettingsAsideConfiguration, SettingsAsideFormType } from '../../constants/settings.constant';
import { SettingsUtilityService } from '../../services/settings-utility.service';

@Component({
    selector: 'create-warehouse',
    templateUrl: './create-warehouse.component.html',
    styleUrls: ['./create-warehouse.component.scss'],
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

export class CreateWarehouseComponent implements OnInit {

    /** Address aside menu state */
    public addressAsideMenuState: string = 'out';
    /** Stores the comapny details */
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
    /** Warehouse form */
    public warehouseForm: FormGroup;
    /** Stores the addresses */
    public addresses: Array<any>;
    /** True, if address change is in progress */
    public isAddressChangeInProgress: boolean = false;
    /** Unsubscribe from listener */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private commonService: CommonService,
        private companyService: CompanyService,
        private formBuilder: FormBuilder,
        private router: Router,
        private store: Store<AppState>,
        private settingsProfileService: SettingsProfileService,
        private settingsUtilityService: SettingsUtilityService,
        private toastService: ToasterService
    ) {
        this.warehouseForm = this.formBuilder.group({
            name: ['', Validators.required],
            address: [''],
            // linkedEntity: [[]]
        });
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
                this.warehouseForm.get('name').patchValue(this.companyDetails.country.name);
                if (!this.addressConfiguration.stateList.length) {
                    this.loadStates(this.companyDetails.country.countryCode.toUpperCase());
                    this.loadTaxDetails(this.companyDetails.country.countryCode.toUpperCase());
                }
            }
        });
    }

    /**
     * Initializes the component
     *
     * @memberof CreateWarehouseComponent
     */
    public ngOnInit(): void {
        this.loadLinkedEntities();
        this.loadAddresses('GET');
        this.warehouseForm = this.formBuilder.group({
            name: ['', Validators.required],
            linkedEntity: [[]],
            address: ['']
        });
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
                this.warehouseForm.get('name').patchValue(this.companyDetails.country.name);
                if (!this.addressConfiguration.stateList.length) {
                    this.loadStates(this.companyDetails.country.countryCode.toUpperCase());
                    this.loadTaxDetails(this.companyDetails.country.countryCode.toUpperCase());
                }
            }
        });
    }

    /**
     * Toggles aside component
     *
     * @memberof CreateWarehouseComponent
     */
    public toggleAsidePane(): void {
        this.addressAsideMenuState = this.addressAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * Handles final selection of addresses
     *
     * @param {Array<any>} selectedAddresses Selected address unique names
     * @memberof CreateWarehouseComponent
     */
    public handleFinalSelection(selectedAddresses: Array<any>): void {
        this.addresses.forEach(address => {
            if (!selectedAddresses.includes(address.uniqueName)) {
                address.isDefault = false;
            }
        });
    }

    /**
     * Address selection handler
     *
     * @param {*} option Address selected
     * @memberof CreateWarehouseComponent
     */
    public selectAddress(option: any): void {
        if (option.isDefault) {
            option.isDefault = false;
        }
    }

    /**
     * Sets default handler
     *
     * @param {*} option Selected option
     * @param {*} event Event
     * @memberof CreateWarehouseComponent
     */
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
            this.warehouseForm.get('address').patchValue([
                ...this.warehouseForm.get('address').value,
                option.value
            ]);
        }
    }

    /**
     * Handles form submit
     *
     * @memberof CreateWarehouseComponent
     */
    public handleFormSubmit(): void {
        // const linkEntity = this.addressConfiguration.linkedEntities.filter(entity => (this.warehouseForm.value.linkedEntity.includes(entity.uniqueName))).map(filteredEntity => ({
        //     uniqueName: filteredEntity.uniqueName,
        //     isDefault: filteredEntity.isDefault,
        //     entity: filteredEntity.entity
        // }));
        const requestObj = {
            name: this.warehouseForm.value.name,
            linkAddresses: this.addresses.filter(address => this.warehouseForm.value.address.includes(address.uniqueName)).map(filteredAddress => ({
                uniqueName: filteredAddress.uniqueName,
                isDefault: filteredAddress.isDefault
            })),
            // linkEntity
        };
        this.settingsProfileService.createNewWarehouse(requestObj).subscribe(response => {
            if (response && response.status === 'success') {
                this.toastService.successToast('Warehouse created successfully');
                this.warehouseForm.reset();
                this.router.navigate(['/pages/settings/warehouse']);
            }
        });
    }

    /**
     * Displays the add address side pane
     *
     * @memberof CreateWarehouseComponent
     */
    public addNewAddress(): void {
        this.addressAsideMenuState = 'in';
    }

    /**
     * Loads the default states by country
     *
     * @param {string} countryCode Country code
     * @memberof CreateWarehouseComponent
     */
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

    /**
     * Creates new address
     *
     * @param {*} addressDetails Address details
     * @memberof CreateWarehouseComponent
     */
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
                this.toggleAddressAsidePane();
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

    /**
     * Loads the tax details of a country (tax name, tax validation, etc.)
     *
     * @param {string} countryCode Country code
     * @memberof CreateWarehouseComponent
     */
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

    /**
     * Loads all the entities within a company
     *
     * @param {Function} [successCallback] Callback to carry out further operations
     * @memberof CreateWarehouseComponent
     */
    public loadLinkedEntities(successCallback?: Function): void {
        this.settingsProfileService.getAllLinkedEntities().subscribe(response => {
            if (response && response.body && response.status === 'success') {
                this.addressConfiguration.linkedEntities = response.body.map(result => ({
                    ...result,
                    isDefault: false,
                    label: result.alias,
                    value: result.uniqueName
                }));
                if (successCallback) {
                    successCallback();
                }
            }
        });
    }

    /**
     * Shortcut (Alt+C) handler
     *
     * @memberof CreateWarehouseComponent
     */
    public handleShortcutPress(): void {
        if (this.addressAsideMenuState === 'out') {
            this.loadLinkedEntities(() => {
                this.toggleAsidePane();
            });
        } else {
            this.toggleAsidePane();
        }
    }

    /**
     * Loads the addresses
     *
     * @private
     * @param {string} method API call method ('GET' for fetching and 'POST' for searching)
     * @param {*} [params] Request payload
     * @memberof CreateWarehouseComponent
     */
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

    /**
     * Opens create address aside menu
     *
     * @memberof CreateWarehouseComponent
     */
    public openCreateAddressAside(): void {
        this.toggleAddressAsidePane();
    }

    /**
     * Toggles address aside pane
     *
     * @param {*} [event] Toggle event
     * @memberof CreateWarehouseComponent
     */
    public toggleAddressAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }
        this.addressAsideMenuState = this.addressAsideMenuState === 'out' ? 'in' : 'out';
        this.isAddressChangeInProgress = false;
        this.toggleBodyClass();
    }

    /**
     * Toggles the fixed body class
     *
     * @memberof CreateWarehouseComponent
     */
    public toggleBodyClass(): void {
        if (this.addressAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * Select entity handler
     *
     * @param {*} option Option selected
     * @memberof CreateWarehouseComponent
     */
    public selectEntity(option: any): void {
        if (option.isDefault) {
            option.isDefault = false;
        }
    }
    /**
     * Unsubscribe from all listeners
     *
     * @memberof CreateAddressComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('fixed');
    }

}
