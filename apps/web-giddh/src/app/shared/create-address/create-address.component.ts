import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, of as observableOf, ReplaySubject, takeUntil } from 'rxjs';
import { IForceClear } from '../../models/api-models/Sales';
import { ToasterService } from '../../services/toaster.service';
import { PageLeaveUtilityService } from '../../services/page-leave-utility.service';
import { SettingsAsideConfiguration, SettingsAsideFormType } from '../../settings/constants/settings.constant';

function validateFieldWithPatterns(patterns: Array<string>) {
    return (field: UntypedFormControl): { [key: string]: any } => {
        return !field?.value || patterns.some(pattern => new RegExp(pattern).test(field?.value)) ? null : {
            validateFieldWithPatterns: {
                valid: false
            }
        }
    }
}

@Component({
    selector: 'create-address',
    templateUrl: './create-address.component.html',
    styleUrls: ['./create-address.component.scss'],
})
export class CreateAddressComponent implements OnInit, OnDestroy {
    /** Emits when aside menu is closed */
    @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();
    /** Emits when save operation is performed */
    @Output() public saveAddress: EventEmitter<any> = new EventEmitter();
    /** Emits when update operation is performed */
    @Output() public updateAddress: EventEmitter<any> = new EventEmitter();
    /** Address form */
    public addressForm: UntypedFormGroup;
    /** Force clears the sh-select dropdown */
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    /** Unsubscribes from the subscribers */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Address configuration */
    @Input() public addressConfiguration: SettingsAsideConfiguration;
    /** Stores the address to be updated */
    @Input() public addressToUpdate: any = null;
    /** Stores the branch to be updated */
    @Input() public branchToUpdate: any;
    /** Stores the address to be updated */
    @Input() public warehouseToUpdate: any;
    /** Company name */
    @Input() public companyName: string;
    /** True, if any API is in progress */
    @Input() public showLoader: boolean;
    /** Stores the current organization uniqueName
     * (required for checking the entity same as the organization in create-address link-entity field) */
    @Input() public currentOrganizationUniqueName: string;
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /** True if we need to hide link entity field */
    @Input() public hideLinkEntity: boolean = true;
    /** True, if aside pane needs to be closed */
    @Input() public closeSidePane: boolean;
    /** List of entities which can be archived */
    public entityArchived: string[] = ["BRANCH", "WAREHOUSE"];
    /** Holds Selected Entity */
    public selectedEntity: any[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private toasterService: ToasterService,
        private pageLeaveUtilityService: PageLeaveUtilityService
    ) {
    }

    /**
     * Initializes component
     *
     * @memberof CreateAddressComponent
     */
    public ngOnInit(): void {
        this.setFormData();
    }

    /**
     * On Change of input properties
     *
     * @memberof CreateAddressComponent
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes?.addressConfiguration && changes.addressConfiguration.currentValue !== changes.addressConfiguration.previousValue && (this.addressConfiguration?.stateList?.length || this.addressConfiguration?.countyList?.length || this.addressConfiguration?.
            linkedEntities)) {
            this.setFormData();            
        }
    }

    /**
     * Set form data get from input
     *
     * @private
     * @memberof CreateAddressComponent
     */
    private setFormData(): void {
        if (this.addressConfiguration.type === SettingsAsideFormType.CreateAddress || this.addressConfiguration.type === SettingsAsideFormType.CreateBranchAddress) {
            this.addressConfiguration.linkedEntities = this.addressConfiguration.linkedEntities?.filter(address => (!address.entity?.includes(this.entityArchived)) || (address.entity?.includes(this.entityArchived) && !address.isArchived));

            const taxValidatorPatterns = this.addressConfiguration.tax.name ? this.addressConfiguration.tax.validation : [];
            this.addressForm = this.formBuilder.group({
                name: ['', [Validators.required, Validators.maxLength(100)]],
                taxNumber: ['', (taxValidatorPatterns && taxValidatorPatterns.length) ? validateFieldWithPatterns(taxValidatorPatterns) : null],
                state: ['', !this.addressConfiguration.countyList?.length ? Validators.required : null],
                stateLabel: [''],
                county: ['', this.addressConfiguration.countyList?.length ? Validators.required : null],
                address: [''],
                linkedEntity: [[]],
                pincode: []
            });
            if (this.currentOrganizationUniqueName && this.addressConfiguration && this.addressConfiguration.linkedEntities
                && this.addressConfiguration.linkedEntities.some(entity => entity?.uniqueName === this.currentOrganizationUniqueName)) {
                // This will by default show the current organization unique name as selected linked entity
                const currentOrganizationUniqueNameObj = this.addressConfiguration.linkedEntities?.filter(i => i?.uniqueName === this.currentOrganizationUniqueName);
                this.addressForm.get('linkedEntity')?.patchValue(currentOrganizationUniqueNameObj);
            }
        } else if (this.addressConfiguration.type === SettingsAsideFormType.EditAddress) {
            if (this.addressToUpdate) {
                const taxValidatorPatterns = this.addressConfiguration.tax.name ? this.addressConfiguration.tax.validation : [];
                this.addressForm = this.formBuilder.group({
                    name: [this.addressToUpdate.name, [Validators.required, Validators.maxLength(100)]],
                    taxNumber: [this.addressToUpdate.taxNumber, (taxValidatorPatterns && taxValidatorPatterns.length) ? validateFieldWithPatterns(taxValidatorPatterns) : null],
                    state: [{ value: this.addressToUpdate.stateCode, disabled: !!this.addressToUpdate.taxNumber && this.addressConfiguration.tax && this.addressConfiguration.tax.name === 'GSTIN' }, !this.addressConfiguration.countyList?.length ? Validators.required : null],
                    stateLabel: [this.addressToUpdate?.stateName && this.addressToUpdate?.stateCode ? this.addressToUpdate?.stateCode + ' - ' + this.addressToUpdate?.stateName : ''],
                    county: [this.addressToUpdate.county?.code, this.addressConfiguration.countyList?.length ? Validators.required : null],
                    address: [this.addressToUpdate.address, this.addressToUpdate.taxNumber && this.addressConfiguration.tax && this.addressConfiguration.tax.name === 'GSTIN' ? [Validators.required] : []],
                    linkedEntity: [this.addressConfiguration.linkedEntities?.filter((item) => {
                        return item?.uniqueName ===
                            this.addressToUpdate.linkedEntities?.filter(i => i?.uniqueName === item?.uniqueName)[0]?.uniqueName
                    })],
                    pincode: [this.addressToUpdate.pincode]
                });
                const linkedEntity = [...this.addressToUpdate.linkedEntities];
                while (linkedEntity?.length) {
                    // Update the default entity status in UPDATE mode
                    const entity = linkedEntity.pop();
                    const entityIndex = this.addressConfiguration.linkedEntities?.findIndex(linkEntity => linkEntity?.uniqueName === entity?.uniqueName);
                    if (entityIndex > -1) {
                        this.addressConfiguration.linkedEntities[entityIndex].isDefault = entity.isDefault;
                    }
                }
            }
        } else if (this.addressConfiguration.type === SettingsAsideFormType.EditBranch) {
            if (this.branchToUpdate) {
                this.addressForm = this.formBuilder.group({
                    name: [this.branchToUpdate.name, [Validators.required, Validators.maxLength(100)]],
                    alias: [this.branchToUpdate.alias, [Validators.required, Validators.maxLength(50)]],
                    linkedEntity: [this.addressConfiguration.linkedEntities?.filter((item) => {
                        return item?.uniqueName ===
                            this.branchToUpdate.linkedEntities?.filter(i => i?.uniqueName === item?.uniqueName)[0]?.uniqueName
                    })]
                });

                const linkedEntity = [...this.branchToUpdate.linkedEntities];
                while (linkedEntity?.length) {
                    // Update the default entity status in UPDATE mode
                    const entity = linkedEntity.pop();
                    const entityIndex = this.addressConfiguration.linkedEntities?.findIndex(linkEntity => linkEntity?.uniqueName === entity?.uniqueName);
                    if (entityIndex > -1) {
                        this.addressConfiguration.linkedEntities[entityIndex].isDefault = entity.isDefault;
                    }
                }
            }
        } else if (this.addressConfiguration.type === SettingsAsideFormType.EditWarehouse) {
            if (this.warehouseToUpdate) {
                this.addressForm = this.formBuilder.group({
                    name: [this.warehouseToUpdate.name, [Validators.required, Validators.maxLength(100)]],
                    linkedEntity: [this.addressConfiguration.linkedEntities?.filter((item) => {
                        return item?.uniqueName ===
                            this.warehouseToUpdate.linkedEntities?.filter(i => i?.uniqueName === item?.uniqueName)[0]?.uniqueName
                    })]
                });
                const linkedEntity = [...this.warehouseToUpdate.linkedEntities];
                while (linkedEntity?.length) {
                    // Update the default entity status in UPDATE mode
                    const entity = linkedEntity.pop();
                    const entityIndex = this.addressConfiguration.linkedEntities?.findIndex(linkEntity => linkEntity?.uniqueName === entity?.uniqueName);
                    if (entityIndex > -1) {
                        this.addressConfiguration.linkedEntities[entityIndex].isDefault = entity.isDefault;
                    }
                }
            }
        }

        if (this.addressConfiguration.type === SettingsAsideFormType.CreateAddress && this.hideLinkEntity) {
            this.addressConfiguration?.linkedEntities?.forEach(option => {
                this.addressForm.get('linkedEntity')?.patchValue([
                    ...this.addressForm.get('linkedEntity')?.value,
                    option?.value
                ]);
            });
        }


        if (this.addressConfiguration.tax && this.addressConfiguration.tax.name && this.addressConfiguration.tax.name === 'GSTIN') {
            const taxField = this.addressForm.get('taxNumber');
            taxField?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
                if (taxField.valid && taxField?.value) {
                    this.addressForm.get('address').setValidators([Validators.required]);
                } else {
                    this.addressForm.get('address').setValidators(null);
                }
                this.addressForm.get('address').updateValueAndValidity();
            });
        }

        this.addressForm?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(result => {
            if (this.addressForm?.dirty) {
                this.pageLeaveUtilityService.addBrowserConfirmationDialog();
            }
        });
        this.addressForm?.get('taxNumber')?.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(value => {
            if (value !== null && value !== undefined && this.addressConfiguration.tax && this.addressConfiguration.tax.name === 'GSTIN') {
                this.getStateCode(value);
            }
        });
    }

    /**
     * Closes the aside menu pane
     *
     * @param {*} event
     * @memberof CreateAddressComponent
     */
    public closeAsidePane(event: any): void {
        if (this.addressForm?.dirty) {
            document.querySelector("create-address")?.classList?.add("page-leave-confirmation-showing");
            this.pageLeaveUtilityService.confirmPageLeave((action) => {
                document.querySelector("create-address")?.classList?.remove("page-leave-confirmation-showing");
                if (action) {
                    this.closeAsideEvent.emit(event);
                }
            });
            return;
        } else {
            this.closeAsideEvent.emit(event);
        }
    }

    /**
     * Unsubscribe from all listeners
     *
     * @memberof CreateAddressComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
        document.querySelector('body').classList.remove('fixed');
    }

    /**
     * Submit form handler
     *
     * @memberof CreateAddressComponent
     */
    public handleFormSubmit(): void {
        const tempAddressFormData = this.addressForm.get('linkedEntity')?.value;

        if (Array.isArray(this.addressForm.get('linkedEntity')?.value)) {
            let value = this.addressForm?.get('linkedEntity')?.value?.map(item => {
                return item = item.uniqueName;
            });
            this.addressForm.get('linkedEntity').patchValue(value);
        }

        if (this.addressConfiguration.type === SettingsAsideFormType.EditAddress || this.addressConfiguration.type === SettingsAsideFormType.CreateAddress) {
            const taxField = this.addressForm.get('taxNumber');
            if (taxField?.value && taxField.valid && this.addressConfiguration.tax && this.addressConfiguration.tax.name === 'GSTIN') {
                // Tax is valid and has value then address is mandatory for GST taxes
                const addresssValue = (this.addressForm.get('address')?.value || '')?.trim();
                this.addressForm.get('address').setValue(addresssValue);
                if (!addresssValue) {
                    return;
                }
            }
        }
        this.addressForm.get('taxNumber').patchValue(this.addressForm.get('taxNumber')?.value?.trim());
        if (this.addressConfiguration.type === SettingsAsideFormType.CreateAddress) {
            this.saveAddress.emit({
                formValue: this.addressForm.getRawValue(),
                addressDetails: this.addressConfiguration
            });
        } else if (this.addressConfiguration.type === SettingsAsideFormType.EditAddress || this.addressConfiguration.type === SettingsAsideFormType.EditBranch ||
            this.addressConfiguration.type === SettingsAsideFormType.EditWarehouse) {
            this.updateAddress.emit({
                formValue: this.addressForm.getRawValue(),
                addressDetails: this.addressConfiguration
            });
        }
        this.addressForm.get('linkedEntity').patchValue(tempAddressFormData);
    }

    /**
     * Sets the state based on GST number provided
     *
     * @private
     * @param {string} taxValue
     * @memberof CreateAddressComponent
     */
    private getStateCode(taxValue: string): void {
        let gstVal: string = taxValue?.trim();
        if (gstVal?.length) {
            if (gstVal.length >= 2) {
                let currentState = this.addressConfiguration.stateList.find(state => state.code === gstVal.substring(0, 2));
                if (currentState) {
                    this.addressForm?.get('stateLabel')?.patchValue(currentState?.label);
                    this.addressForm.get('state')?.patchValue(currentState?.value);
                } else {
                    this.addressForm.get('state')?.patchValue(null);
                    this.addressForm?.get('stateLabel')?.patchValue('');
                    if (this.addressConfiguration?.tax?.name && !this.addressForm.get('taxNumber')?.valid) {
                        let message = this.commonLocaleData?.app_invalid_tax_name;
                        message = message?.replace("[TAX_NAME]", this.addressConfiguration.tax.name);
                        this.toasterService.errorToast(message);
                    }
                }
            } else {
                this.addressForm.get('state')?.patchValue(null);
                this.addressForm?.get('stateLabel')?.patchValue('');
            }
        } else {
            this.addressForm.get('state')?.patchValue(null);
            this.addressForm?.get('stateLabel')?.patchValue('');
        }
    }

    /**
     * Handles the default address operation
     *
     * @param {*} option Address option selected
     * @param {*} event Event
     * @memberof CreateAddressComponent
     */
    public setDefault(option: any, event: any): void {
        event.stopPropagation();
        event.preventDefault();
        if (!option.isDefault) {
            this.addressConfiguration.linkedEntities.forEach(entity => {
                if (entity?.value !== option?.value) {
                    entity.isDefault = false;
                }
            });
        }
        option.isDefault = !option.isDefault;
        if (option.isDefault) {
            this.addressForm.get('linkedEntity')?.patchValue([...this.addressForm.get('linkedEntity')?.value, option]);
        }
    }

    /**
     * Selects entity
     *
     * @param {*} option Selected entity
     * @memberof CreateAddressComponent
     */
    public selectEntity(option: any): void {
        if (option?.isDefault) {
            option.isDefault = false;
        }
    }

    /**
     * Handle Remove Item from Mat Chip and 
     * remove item form linkedEntity
     *
     * @param {*} element
     * @memberof CreateAddressComponent
     */
    public removeItem(element: any): void {
        this.addressForm.get('linkedEntity')?.patchValue(this.addressForm.get('linkedEntity').value.filter(i => i !== element));
    }

    /**
     * Handles the final selected entity
     *
     * @param {Array<any>} selectedEntities Unique names of selection
     * @memberof CreateAddressComponent
     */
    public handleFinalSelection(selectedEntities: Array<any>): void {
        this.addressConfiguration.linkedEntities.forEach(entity => {
            if (!selectedEntities?.includes(entity?.uniqueName)) {
                entity.isDefault = false;
            }
        });
    }

    /**
     * Returns the information save text
     *
     * @param {*} companyName
     * @returns {string}
     * @memberof CreateAddressComponent
     */
    public getInformationSaveText(companyName: any): string {
        let text = this.localeData?.all_information_save;
        text = text?.replace("[COMPANY_NAME]", companyName);
        return text;
    }

    /**
     * Returns enter tax text
     *
     * @param {*} taxName
     * @returns {string}
     * @memberof CreateAddressComponent
     */
    public getEnterTaxText(taxName: any): string {
        let text = this.localeData?.enter_tax;
        text = text?.replace("[TAX_NAME]", taxName);
        return text;
    }

    /**
     * Returns the branch of company text
     *
     * @param {*} companyName
     * @returns {string}
     * @memberof CreateAddressComponent
     */
    public getBranchOfText(companyName: any): string {
        let text = this.localeData?.branch_of_company;
        text = text?.replace("[COMPANY_NAME]", companyName);
        return text;
    }

    /**
     * Removes browser confirmation dialog and set form has undirty on clear in create mode
     *
     * @memberof CreateAddressComponent
     */
    public clearForm(): void {
        this.selectedEntity = [];
        if (this.addressConfiguration.type === 'createAddress' || this.addressConfiguration.type === 'createBranchAddress') {
            this.pageLeaveUtilityService.removeBrowserConfirmationDialog();
            this.addressForm.markAsPristine();
        }
    }
}
