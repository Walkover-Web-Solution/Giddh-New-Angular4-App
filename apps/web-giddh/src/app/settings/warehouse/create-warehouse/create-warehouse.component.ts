import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingsBranchActions } from '../../../actions/settings/branch/settings.branch.action';
import { OnboardingFormRequest } from '../../../models/api-models/Common';
import { BranchFilterRequest } from '../../../models/api-models/Company';
import { CommonService } from '../../../services/common.service';
import { CompanyService } from '../../../services/company.service';
import { GeneralService } from '../../../services/general.service';
import { SettingsProfileService } from '../../../services/settings.profile.service';
import { ToasterService } from '../../../services/toaster.service';
import { AppState } from '../../../store';
import { SettingsAsideConfiguration, SettingsAsideFormType } from '../../constants/settings.constant';
import { SettingsUtilityService } from '../../services/settings-utility.service';
import { WarehouseActions } from '../action/warehouse.action';

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

export class CreateWarehouseComponent implements OnInit, OnDestroy {

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
    /** Stores the current organization uniqueName */
    public currentOrganizationUniqueName: string;

    public imgPath: string = '';

    /** Unsubscribe from listener */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold profile JSON data */
    public profileLocaleData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if need to hide link entity */
    public hideLinkEntity: boolean = true;

    constructor(
        private commonService: CommonService,
        private companyService: CompanyService,
        private formBuilder: FormBuilder,
        private generalService: GeneralService,
        private router: Router,
        private store: Store<AppState>,
        private settingsProfileService: SettingsProfileService,
        private settingsUtilityService: SettingsUtilityService,
        private toastService: ToasterService,
        private warehouseActions: WarehouseActions,
        private settingsBranchActions: SettingsBranchActions
    ) {
        this.warehouseForm = this.formBuilder.group({
            name: ['', Validators.required],
            address: ['']
        });
    }

    /**
     * Initializes the component
     *
     * @memberof CreateWarehouseComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('setting-sidebar-open');
        this.store.pipe(select(appState => appState.settings.profile), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.name) {
                this.companyDetails = {
                    name: response.name,
                    businessType: response.businessType,
                    country: {
                        countryName: response.countryV2 ? response.countryV2.countryName : '',
                        countryCode: response.countryV2 ? response.countryV2.alpha2CountryCode?.toLowerCase() : '',
                        currencyCode: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.code : '',
                        currencyName: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.symbol : ''
                    }
                }
                this.warehouseForm.get('name')?.patchValue(this.companyDetails.country.name);
                if (!this.addressConfiguration?.stateList?.length) {
                    this.loadStates(this.companyDetails.country.countryCode.toUpperCase());
                    this.loadTaxDetails(this.companyDetails.country.countryCode.toUpperCase());
                }
            }
        });

        this.currentOrganizationUniqueName = this.generalService.currentBranchUniqueName || this.generalService.companyUniqueName;
        this.loadLinkedEntities();
        this.loadAddresses('GET', { count: 0 });
        this.warehouseForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.maxLength(100)]],
            linkedEntity: [[]],
            address: ['']
        });
        this.store.pipe(select(appState => appState.settings.profile), takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.name) {
                this.companyDetails = {
                    name: response.name,
                    businessType: response.businessType,
                    country: {
                        countryName: response.countryV2 ? response.countryV2.countryName : '',
                        countryCode: response.countryV2 ? response.countryV2.alpha2CountryCode?.toLowerCase() : '',
                        currencyCode: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.code : '',
                        currencyName: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.symbol : ''
                    }
                }
                this.warehouseForm.get('name')?.patchValue(this.companyDetails.country.name);
                if (!this.addressConfiguration?.stateList?.length) {
                    this.loadStates(this.companyDetails.country.countryCode.toUpperCase());
                    this.loadTaxDetails(this.companyDetails.country.countryCode.toUpperCase());
                }
            }
        });

        this.imgPath = isElectron ? 'assets/images/warehouse-image.svg' : AppUrl + APP_FOLDER + 'assets/images/warehouse-image.svg';
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
            if (!selectedAddresses.includes(address?.uniqueName)) {
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
                if (address?.value !== option?.value) {
                    address.isDefault = false;
                }
            });
        }
        option.isDefault = !option.isDefault;
        if (option.isDefault) {
            this.warehouseForm.get('address')?.patchValue([
                ...(this.warehouseForm.get('address')?.value || []),
                option?.value
            ]);
        }
    }

    /**
     * Handles form submit
     *
     * @memberof CreateWarehouseComponent
     */
    public handleFormSubmit(): void {
        const requestObj = {
            name: this.warehouseForm?.value.name,
            linkAddresses: this.addresses?.filter(address => this.warehouseForm?.value.address.includes(address?.uniqueName))?.map(filteredAddress => ({
                uniqueName: filteredAddress?.uniqueName,
                isDefault: filteredAddress.isDefault
            }))
        };
        this.settingsProfileService.createNewWarehouse(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.toastService.successToast(this.localeData?.warehouse_created);
                    this.warehouseForm.reset();
                    this.router.navigate(['/pages/settings/warehouse']);
                } else {
                    this.toastService.errorToast(response.message);
                }
            }
        });
    }

    /**
     * Clears the address default value on form clear
     *
     * @memberof CreateWarehouseComponent
     */
    public handleFormClear(): void {
        this.addresses.forEach(address => {
            if (address) {
                address.isDefault = false;
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
        this.companyService.getAllStates({ country: countryCode }).pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
        const chosenState = addressDetails.addressDetails.stateList.find(selectedState => selectedState?.value === addressDetails.formValue.state);
        const linkEntity = addressDetails.addressDetails.linkedEntities?.filter(entity => (addressDetails.formValue.linkedEntity.includes(entity?.uniqueName))).map(filteredEntity => ({
            uniqueName: filteredEntity?.uniqueName,
            isDefault: filteredEntity.isDefault,
            entity: filteredEntity.entity
        }));
        const requestObj = {
            taxNumber: addressDetails.formValue.taxNumber,
            stateCode: addressDetails.formValue.state,
            stateName: chosenState ? chosenState.stateName : '',
            address: addressDetails.formValue.address,
            name: addressDetails.formValue.name,
            pincode: addressDetails.formValue.pincode,
            linkEntity
        };

        this.settingsProfileService.createNewAddress(requestObj).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === 'success' && response?.body) {
                this.toggleAddressAsidePane();
                this.addresses.push({
                    ...response.body,
                    label: response.body.name,
                    value: response.body?.uniqueName
                })
                this.toastService.successToast(this.profileLocaleData?.address_created);
            } else {
                this.toastService.errorToast(response?.message);
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
        this.commonService.getOnboardingForm(onboardingFormRequest).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
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
        this.settingsProfileService.getAllLinkedEntities().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body && response.status === 'success') {
                this.addressConfiguration.linkedEntities = response.body.map(result => ({
                    ...result,
                    isDefault: false,
                    label: result.alias,
                    value: result?.uniqueName
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
        this.settingsProfileService.getCompanyAddresses(method, params).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.body && response.status === 'success') {
                this.addresses = this.settingsUtilityService.getFormattedCompanyAddresses(response.body.results).map(address => (
                    {
                        ...address,
                        isDefault: false,
                        label: address.name,
                        value: address?.uniqueName
                    }));
                this.checkLinkEntity();
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
     * @memberof CreateWarehouseComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('fixed');
        document.querySelector('body').classList.remove('setting-sidebar-open');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Checks if we need to hide link entity
     *
     * @memberof CreateWarehouseComponent
     */
    public checkLinkEntity(): void {
        this.store.dispatch(this.warehouseActions.fetchAllWarehouses({ page: 1, query: "", count: 2 })); // count is 2 because we only have to check if there are more than 1 records
        let branchFilterRequest = new BranchFilterRequest();
        branchFilterRequest.from = "";
        branchFilterRequest.to = "";
        this.store.dispatch(this.settingsBranchActions.GetALLBranches(branchFilterRequest));

        this.hideLinkEntity = true;

        if (this.addresses?.length > 1) {
            this.hideLinkEntity = false;
        } else {
            combineLatest([this.store.pipe(select(state => state.warehouse.warehouses)), this.store.pipe(select(state => state.settings.branches))]).pipe(takeUntil(this.destroyed$)).subscribe((response: any[]) => {
                if (response && response[0] && response[1]) {
                    if (response[0]?.results?.length > 1 || response[1]?.length > 1) {
                        this.hideLinkEntity = false;
                    }
                }
            });
        }
    }
}
