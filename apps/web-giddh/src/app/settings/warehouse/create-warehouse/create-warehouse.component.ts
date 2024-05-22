import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
import { PageLeaveUtilityService } from '../../../services/page-leave-utility.service';

@Component({
    selector: 'create-warehouse',
    templateUrl: './create-warehouse.component.html',
    styleUrls: ['./create-warehouse.component.scss']
})

export class CreateWarehouseComponent implements OnInit, OnDestroy {
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
    public warehouseForm: UntypedFormGroup;
    /** Stores the addresses */
    public addresses: any = {
        addressToShow: null,
        address: null
    };
    /** True, if address change is in progress */
    public isAddressChangeInProgress: boolean = false;
    /** Stores the current organization uniqueName */
    public currentOrganizationUniqueName: string;
    /** Holds image root path */
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
    /*-- mat-dialog --*/
    @ViewChild('asideAccountAsidePane', { static: true }) public asideAccountAsidePane: any;
    /** Returns true if form is dirty else false */
    public get showPageLeaveConfirmation(): boolean {
        return this.warehouseForm?.dirty;
    };
    /** Holds Create Account Asidepane Dialog Ref */
    public asideAccountAsidePaneDialogRef: MatDialogRef<any>;

    constructor(
        private commonService: CommonService,
        private companyService: CompanyService,
        private formBuilder: UntypedFormBuilder,
        private generalService: GeneralService,
        private router: Router,
        private store: Store<AppState>,
        private settingsProfileService: SettingsProfileService,
        private settingsUtilityService: SettingsUtilityService,
        private toastService: ToasterService,
        private warehouseActions: WarehouseActions,
        private settingsBranchActions: SettingsBranchActions,
        public dialog: MatDialog,
        private pageLeaveUtilityService: PageLeaveUtilityService
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

        this.warehouseForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (this.showPageLeaveConfirmation) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }
        });
    }

    /**
     * Handles final selection of addresses
     *
     * @param {Array<any>} selectedAddresses Selected address unique names
     * @memberof CreateWarehouseComponent
     */
    public handleFinalSelection(selectedAddresses: Array<any>): void {
        this.addresses?.addressToShow?.forEach(address => {
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
            this.addresses?.addressToShow?.forEach(address => {
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
            linkAddresses: this.addresses?.addressToShow?.filter(address => this.warehouseForm?.value.address?.includes(address?.uniqueName))?.map(filteredAddress => ({
                uniqueName: filteredAddress?.uniqueName,
                isDefault: filteredAddress.isDefault
            }))
        };
        this.settingsProfileService.createNewWarehouse(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.toastService.successToast(this.localeData?.warehouse_created);
                    this.warehouseForm.reset();
                    this.warehouseForm.markAsPristine();
                    this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
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
        this.addresses?.addressToShow?.forEach(address => {
            if (address) {
                address.isDefault = false;
            }
        });
        this.warehouseForm.reset();
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        this.warehouseForm.markAsPristine();
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
                this.addressConfiguration.countyList = [];

                if (result.stateList) {
                    Object.keys(result.stateList).forEach(key => {
                        this.addressConfiguration.stateList.push({
                            label: result.stateList[key].code + ' - ' + result.stateList[key].name,
                            value: result.stateList[key].code,
                            code: result.stateList[key].stateGstCode,
                            stateName: result.stateList[key].name
                        });
                    });
                }

                if (result.countyList) {
                    this.addressConfiguration.countyList = result.countyList?.map(county => {
                        return { label: county.name, value: county.code };
                    });
                }
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
        const linkEntity = addressDetails.addressDetails.linkedEntities?.filter(entity => (addressDetails.formValue.linkedEntity?.includes(entity?.uniqueName))).map(filteredEntity => ({
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
                this.closeAddressAsidePane();
                this.addresses?.addressToShow?.push({
                    ...response.body,
                    label: response.body.name,
                    value: response.body?.uniqueName
                });
                this.toastService.successToast(this.localeData?.address_created);
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
    public handleShortcutPress() {
        this.loadLinkedEntities(() => {
            this.asideAccountAsidePaneDialogRef = this.dialog.open(this.asideAccountAsidePane, {
                width: '760px',
                height: '100vh !important',
                position: {
                    right: '0',
                    top: '0'
                }
            });
        });
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
                const modifiedAddresses = this.settingsUtilityService.getFormattedCompanyAddresses(response.body.results).map(address => (
                    {
                        ...address,
                        isDefault: false,
                        label: address.name,
                        value: address?.uniqueName
                    }));
                this.addresses.addressToShow = modifiedAddresses;
                this.addresses.address = modifiedAddresses;
                this.checkLinkEntity();
            }
        });
    }

    /**
     * Toggles address aside pane
     *
     * @param {*} [event] Toggle event
     * @memberof CreateWarehouseComponent
     */
    public closeAddressAsidePane(event?: any): void {
        this.isAddressChangeInProgress = false;
        this.asideAccountAsidePaneDialogRef.close();
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
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
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

        if (this.addresses?.addressToShow?.length > 1) {
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

    /**
     * Handle Addresses Search
     *
     * @param {*} event
     * @memberof CreateWarehouseComponent
     */
    public onSearchQueryChanged(event: any): void {
        if (event) {
            this.addresses.addressToShow = this.addresses?.addressToShow?.filter(address => address.label.toUpperCase().indexOf(event.toUpperCase()) > -1);
        }
    }

    /**
     * Handle Addresses Search Clear
     *
     * @memberof CreateWarehouseComponent
     */
    public onSearchClear(): void {
            this.addresses.addressToShow = this.addresses.address;
    }
}
