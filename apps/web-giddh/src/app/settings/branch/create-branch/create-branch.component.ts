import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { combineLatest, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GeneralActions } from '../../../actions/general/general.actions';
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
import { WarehouseActions } from '../../warehouse/action/warehouse.action';
import { PageLeaveUtilityService } from '../../../services/page-leave-utility.service';
import { MatSelect } from '@angular/material/select';
import { OrganizationType } from '../../../models/user-login-state';
import { cloneDeep } from '../../../lodash-optimized';
import { InventoryService } from '../../../services/inventory.service';

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
    /** Hold Mat Select Reference */
    @ViewChild('trigger') trigger: MatSelect;
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
    public branchForm: UntypedFormGroup;
    /** Search Address Control */
    public addressQuery: UntypedFormControl = new FormControl('');
    /** Holds Addresses list used to reset */
    public addressesConstantList: any[] = [];
    /** Stores all the addresses within a company */
    public addresses: any;
    /** True, if new address is in progress in the side menu */
    public isAddressChangeInProgress: boolean = false;
    /** Stores the current organization uniqueName */
    public currentOrganizationUniqueName: string;
    /** Holds image root path */
    public imgPath: string = '';
    /** Unsubscribes from all the listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold profile JSON data */
    public profileLocaleData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if need to hide link entity */
    public hideLinkEntity: boolean = true;
    /** directive to get reference of element */
    @ViewChild('asideAccountAsidePane', { static: true }) public asideAccountAsidePane: any;
    /** Returns true if form is dirty else false */
    public get showPageLeaveConfirmation(): boolean {
        return this.branchForm?.dirty;
    }
    /** Holds Create Address Dialog Reference */
    public asideAccountAsidePaneRef: MatDialogRef<any>;
    /** True, if organization type is company and it has more than one branch (i.e. in addition to HO) */
    public isCompany: boolean;
    /** This will use for instance of branches Dropdown */
    public branchesDropdown: FormControl;
    /** This will use for instance of branches Dropdown */
    public nativeSelectFormControl: FormControl;
    /** Hold all branches */
    public allBranches: any[] = [];
    /**Hold branches */
    public branches: any[] = [];

    constructor(
        private commonService: CommonService,
        private companyService: CompanyService,
        private formBuilder: UntypedFormBuilder,
        private generalActions: GeneralActions,
        private generalService: GeneralService,
        private router: Router,
        private store: Store<AppState>,
        private settingsProfileService: SettingsProfileService,
        private settingsUtilityService: SettingsUtilityService,
        private toastService: ToasterService,
        private warehouseActions: WarehouseActions,
        private settingsBranchActions: SettingsBranchActions,
        public dialog: MatDialog,
        private pageLeaveUtilityService: PageLeaveUtilityService,
        private inventoryService: InventoryService
    ) {
        this.branchesDropdown = new FormControl('');
        this.branchForm = this.formBuilder.group({
            alias: ['', [Validators.required, Validators.maxLength(50)]],
            parentBranchUniqueName:[''],
            name: [''],
            address: ['']
        });
    }

    /**
 * This will be used to get branches
 *
 * @param {boolean} [apiCall=true]
 * @memberof ReportFiltersComponent
 */
    public getBranches(apiCall: boolean = true): void {
        if (!this.isCompany) {
            let currentBranch = this.allBranches?.filter(branch => branch?.uniqueName === this.generalService.currentBranchUniqueName);
        }

        this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;



    }

    /**
  *This will be used to get branch wise warehouses
  *
  * @memberof ReportFiltersComponent
  */
    public getBranchWiseWarehouse(): void {
        this.inventoryService.getLinkedStocks().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.body) {
                this.allBranches = response.body.results?.filter(branch => branch?.isCompany !== true);
                this.branches = response.body.results?.filter(branch => branch?.isCompany !== true);
                this.isCompany = this.generalService.currentOrganizationType !== OrganizationType.Branch;
            }
            this.getBranches(false);
            // this.changeDetection.detectChanges();
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
                        countryCode: response.countryV2 ? response.countryV2.alpha2CountryCode?.toLowerCase() : '',
                        currencyCode: response.countryV2 && response.countryV2?.currency ? response.countryV2.currency.code : '',
                        currencyName: response.countryV2 && response.countryV2?.currency ? response.countryV2.currency.symbol : ''
                    }
                }
                this.branchForm.get('name')?.patchValue(this.companyDetails.name);
                if (!this.addressConfiguration?.stateList?.length) {
                    this.loadStates(this.companyDetails.country.countryCode.toUpperCase());
                    this.loadTaxDetails(this.companyDetails.country.countryCode.toUpperCase());
                }
            }
        });
        this.getBranchWiseWarehouse();
        this.branchesDropdown.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(search => {
            let branchesClone = cloneDeep(this.allBranches);
            if (search) {
                branchesClone = this.allBranches?.filter(branch => (branch.alias?.toLowerCase()?.indexOf(search?.toLowerCase()) > -1));
            }
            this.branches = branchesClone;
        });

        this.currentOrganizationUniqueName = this.generalService.currentBranchUniqueName || this.generalService.companyUniqueName;
        this.loadAddresses('GET', { count: 0 });
        this.store.dispatch(this.generalActions.setAppTitle('/pages/settings/branch'));

        this.imgPath = isElectron ? 'assets/images/branch-image.svg' : AppUrl + APP_FOLDER + 'assets/images/branch-image.svg';

        this.branchForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (this.showPageLeaveConfirmation) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }
        });
        this.addressQuery.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(query => {
            if (query && query.length) {
                this.addresses = this.addressesConstantList?.filter(address => address.label.toUpperCase().indexOf(query.toUpperCase()) > -1);
            }
            if (query === '') {
                this.addresses = this.addressesConstantList;
            }
        });
    }

    /**
     * Opens the create address side menu
     *
     * @memberof CreateBranchComponent
     */
    public openCreateAddressAside(): void {
        this.closeAddressAsidePane();
    }

    /**
     * Toggles the side menu pane
     *
     * @param {*} [event] Toggle Event
     * @memberof CreateBranchComponent
     */
    public closeAddressAsidePane(event?: any): void {
        if (event) {
            event.preventDefault();
        }

        this.asideAccountAsidePaneRef?.close();
        this.isAddressChangeInProgress = false;
    }

    /**
     * Handles the final multiple selection
     *
     * @param {Array<any>} selectedAddresses Selected address unique name
     * @memberof CreateBranchComponent
     */
    public handleFinalSelection(selectedAddresses: Array<any>): void {
        this.addresses.forEach(address => {
            if (!selectedAddresses?.includes(address?.uniqueName)) {
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
                if (address?.value !== option?.value) {
                    address.isDefault = false;
                }
            });
        }
        option.isDefault = !option.isDefault;
        if (option.isDefault && ((this.branchForm.get('address')?.value === '') || (this.branchForm.get('address')?.value.findIndex(i => i.uniqueName === option.uniqueName) === -1))) {
            this.branchForm.get('address')?.patchValue([...this.branchForm.get('address')?.value, option]);
        }
    }

    /**
     * Form submit handler
     *
     * @memberof CreateBranchComponent
     */
    public handleFormSubmit(): void {
        const formValue = this.branchForm?.value;
        const requestObj = {
            name: formValue.name,
            alias: formValue.alias,
            parentBranchUniqueName: formValue.parentBranchUniqueName,
            linkAddresses: []
        };
        console.log(requestObj);
        if (formValue.address?.length) {
            requestObj.linkAddresses = formValue.address.map(filteredAddress => ({
                uniqueName: filteredAddress?.uniqueName,
                isDefault: filteredAddress.isDefault
            }));
        }

        this.settingsProfileService.createNewBranch(requestObj).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.toastService.successToast(this.localeData?.branch_created);
                    this.branchForm.reset();
                    this.branchForm.markAsPristine();
                    this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
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
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        this.branchForm.markAsPristine();
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
                if (result.stateList?.length) {
                    Object.keys(result.stateList).forEach(key => {
                        this.addressConfiguration.stateList.push({
                            label: result.stateList[key].code + ' - ' + result.stateList[key].name,
                            value: result.stateList[key].code,
                            code: result.stateList[key].stateGstCode,
                            stateName: result.stateList[key].name
                        });
                    });
                }
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
                this.addresses.push({
                    ...response.body,
                    label: response.body.name,
                    value: response.body?.uniqueName
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
                    value: result?.uniqueName
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
        this.loadLinkedEntities(() => {
            this.openCreateBranchDialog();
        });
    }

    /**
     * Open Create branch dialog
     *
     * @private
     * @memberof CreateBranchComponent
     */
    private openCreateBranchDialog(): void {
        this.asideAccountAsidePaneRef = this.dialog.open(this.asideAccountAsidePane, {
            width: '760px',
            height: '100vh !important',
            disableClose: true,
            position: {
                right: '0',
                top: '0'
            }
        });
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
                        value: address?.uniqueName
                    }));
                this.checkLinkEntity();
                this.addressesConstantList = this.addresses;
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
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
    }

    /**
     * Checks if we need to hide link entity
     *
     * @memberof CreateBranchComponent
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

    /**
     * Handle Remove Item from Mat Chip and
     * remove item form linkedEntity
     *
     * @param {*} element
     * @memberof CreateBranchComponent
     */
    public removeItem(element: any): void {
        this.branchForm.get('address')?.patchValue(this.branchForm.get('address').value.filter(address => address !== element));

        this.addresses = this.addresses.map(address => {
            if (address?.uniqueName === element?.uniqueName) {
                address.isDefault = false;
            }
            return address;
        });
    }

    /**
     * Selects entity
     *
     * @param {*} option Selected entity
     * @memberof CreateBranchComponent
     */
    public selectEntity(option: any): void {
        if (option?.isDefault) {
            option.isDefault = false;
        }
    }
}
