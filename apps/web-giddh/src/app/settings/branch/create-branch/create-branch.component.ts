import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralActions } from '../../../actions/general/general.actions';
import { OnboardingFormRequest } from '../../../models/api-models/Common';
import { CommonService } from '../../../services/common.service';
import { CompanyService } from '../../../services/companyService.service';
import { GeneralService } from '../../../services/general.service';
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

export class CreateBranchComponent implements OnInit, OnDestroy {
    /** Aside menu pane status */
    public addressAsideMenuState: string = 'out';
    /** Stores the current company details */
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
    /** Branch form */
    public branchForm: FormGroup;
    /** Stores all the addresses within a company */
    public addresses: Array<any>;
    /** True, if new address is in progress in the side menu */
    public isAddressChangeInProgress: boolean = false;
    /** Stores the current organization uniqueName */
    public currentOrganizationUniqueName: string;

    public imgPath: string = '';

    /** Unsubscribes from all the listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold profile JSON data */
    public profileLocaleData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private commonService: CommonService,
        private companyService: CompanyService,
        private formBuilder: FormBuilder,
        private generalActions: GeneralActions,
        private generalService: GeneralService,
        private router: Router,
        private store: Store<AppState>,
        private settingsProfileService: SettingsProfileService,
        private settingsUtilityService: SettingsUtilityService,
        private toastService: ToasterService
    ) {
        this.branchForm = this.formBuilder.group({
            alias: ['', [Validators.required, Validators.maxLength(50)]],
            name: [''],
            address: ['']
        });
    }

    /**
     * Initializes the component
     *
     * @memberof CreateBranchComponent
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
                        countryCode: response.countryV2 ? response.countryV2.alpha2CountryCode.toLowerCase() : '',
                        currencyCode: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.code : '',
                        currencyName: response.countryV2 && response.countryV2.currency ? response.countryV2.currency.symbol : ''
                    }
                }
                this.branchForm.get('name')?.patchValue(this.companyDetails.name);
                if (!this.addressConfiguration?.stateList?.length) {
                    this.loadStates(this.companyDetails.country.countryCode.toUpperCase());
                    this.loadTaxDetails(this.companyDetails.country.countryCode.toUpperCase());
                }
            }
        });

        this.currentOrganizationUniqueName = this.generalService.currentBranchUniqueName || this.generalService.companyUniqueName;
        this.loadAddresses('GET', { count: 0 });
        this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/branch'));

        this.imgPath = isElectron ? 'assets/images/branch-image.svg' : AppUrl + APP_FOLDER + 'assets/images/branch-image.svg';
    }

    /**
     * Toggles the aside menu
     *
     * @memberof CreateBranchComponent
     */
    public toggleAsidePane(): void {
        this.addressAsideMenuState = this.addressAsideMenuState === 'out' ? 'in' : 'out';
        this.toggleBodyClass();
    }

    /**
     * Opens the create address side menu
     *
     * @memberof CreateBranchComponent
     */
    public openCreateAddressAside(): void {
        this.toggleAddressAsidePane();
    }

    /**
     * Toggles the side menu pane
     *
     * @param {*} [event] Toggle Event
     * @memberof CreateBranchComponent
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
     * Adds fixed body class when aside menu is opened
     *
     * @memberof CreateBranchComponent
     */
    public toggleBodyClass(): void {
        if (this.addressAsideMenuState === 'in') {
            document.querySelector('body').classList.add('fixed');
        } else {
            document.querySelector('body').classList.remove('fixed');
        }
    }

    /**
     * Handles the final multiple selection
     *
     * @param {Array<any>} selectedAddresses Selected address unique name
     * @memberof CreateBranchComponent
     */
    public handleFinalSelection(selectedAddresses: Array<any>): void {
        this.addresses.forEach(address => {
            if (!selectedAddresses?.includes(address.uniqueName)) {
                address.isDefault = false;
            }
        });
    }

    /**
     * Handles the address selecion operation
     *
     * @param {*} option Address option selected
     * @memberof CreateBranchComponent
     */
    public selectAddress(option: any): void {
        if (option.isDefault) {
            option.isDefault = false;
        }
    }

    /**
     * Handles the set default operation
     *
     * @param {*} option Address selected
     * @param {*} event Selection event
     * @memberof CreateBranchComponent
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
            this.branchForm.get('address')?.patchValue([
                ...(this.branchForm.get('address').value || []),
                option.value
            ]);
        }
    }

    /**
     * Form submit handler
     *
     * @memberof CreateBranchComponent
     */
    public handleFormSubmit(): void {
        const requestObj = {
            name: this.branchForm.value.name,
            alias: this.branchForm.value.alias,
            linkAddresses: this.addresses?.filter(address => this.branchForm.value.address?.includes(address.uniqueName))?.map(filteredAddress => ({
                uniqueName: filteredAddress.uniqueName,
                isDefault: filteredAddress.isDefault
            }))
        };
        this.settingsProfileService.createNewBranch(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.toastService.successToast(this.localeData?.branch_created);
                    this.branchForm.reset();
                    this.router.navigate(['/pages/settings/branch']);
                } else {
                    this.toastService.errorToast(response.message);
                }
            }
        });
    }

    /**
     * Clears the address default value on form clear
     *
     * @memberof CreateBranchComponent
     */
    public handleFormClear(): void {
        this.addresses.forEach(address => {
            if (address) {
                address.isDefault = false;
            }
        });
    }

    /**
     * Add new address
     *
     * @memberof CreateBranchComponent
     */
    public addNewAddress(): void {
        this.addressAsideMenuState = 'in';
    }

    /**
     * Loads the default list of states
     *
     * @param {string} countryCode Country code
     * @memberof CreateBranchComponent
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
     * Creates new address with provided address details
     *
     * @param {*} addressDetails Address details
     * @memberof CreateBranchComponent
     */
    public createNewAddress(addressDetails: any): void {
        this.isAddressChangeInProgress = true;
        const chosenState = addressDetails.addressDetails.stateList.find(selectedState => selectedState.value === addressDetails.formValue.state);
        const linkEntity = addressDetails.addressDetails.linkedEntities?.filter(entity => (addressDetails.formValue.linkedEntity?.includes(entity.uniqueName))).map(filteredEntity => ({
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
            pincode: addressDetails.formValue.pincode,
            linkEntity
        };

        this.settingsProfileService.createNewAddress(requestObj).pipe(takeUntil(this.destroyed$)).subscribe((response: any) => {
            if (response?.status === 'success' && response?.body) {
                this.toggleAddressAsidePane();
                this.addresses.push({
                    ...response.body,
                    label: response.body.name,
                    value: response.body.uniqueName
                })
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
     * Loads the Tax details (such as tax type, tax validations, etc.)
     *
     * @param {string} countryCode Country code
     * @memberof CreateBranchComponent
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
     * Loads all the company linked entities
     *
     * @param {Function} successCallback Success callback to carry out further operations
     * @memberof CreateBranchComponent
     */
    public loadLinkedEntities(successCallback: Function): void {
        this.settingsProfileService.getAllLinkedEntities().pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
     * Handles the Alt+C shortcut
     *
     * @memberof CreateBranchComponent
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
     * Loads all the addresses within a company
     *
     * @private
     * @param {string} method Method to call the API ('GET' for fetching all the address and 'POST' for searching among address)
     * @param {*} [params] Request payload
     * @memberof CreateBranchComponent
     */
    private loadAddresses(method: string, params?: any): void {
        this.settingsProfileService.getCompanyAddresses(method, params).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
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
     * Releases memory
     *
     * @memberof CreateBranchComponent
     */
    public ngOnDestroy(): void {
        document.querySelector('body').classList.remove('setting-sidebar-open');
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
