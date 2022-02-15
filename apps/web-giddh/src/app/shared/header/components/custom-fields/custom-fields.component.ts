import { BreakpointObserver } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { select, Store } from "@ngrx/store";
import { cloneDeep } from "apps/web-giddh/src/app/lodash-optimized";
import { CompanyResponse } from "apps/web-giddh/src/app/models/api-models/Company";
import { CustomFieldsService } from "apps/web-giddh/src/app/services/custom-fields.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { AppState } from "apps/web-giddh/src/app/store";
import { IOption } from "apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { FieldTypes } from "./custom-fields.constant";

@Component({
    selector: 'custom-fields',
    templateUrl: './custom-fields.component.html',
    styleUrls: [`./custom-fields.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomFieldsComponent implements OnInit, OnDestroy {
    /** Add custom field form reference */
    public customFieldForm: FormGroup;
    /** List custom row data type  */
    public fieldTypes: IOption[] = [];
    /** To check API call in progress */
    public isGetCustomInProgress: boolean = true;
    /** To check API call in progress */
    public isSaveCustomInProgress: boolean = false;
    /** To get any custom field in edit mode index */
    public isEnabledIndex: number = null;
    /** Index to delete row in custom field */
    public selectedRowIndex: number = null;
    /** To check form value validation */
    public isCustomFormValid: boolean = true;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** model reference */
    public modalRef: BsModalRef;
    /** This will store if device is mobile or not */
    public isMobileScreen: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Custom fields request */
    public customFieldsRequest: any = {
        page: 1,
        count: 20,
        companyUniqueName: '',
        moduleUniqueName: 'account'
    };
    /** Active company details */
    public activeCompany: CompanyResponse;
    /** Available field types list */
    public availableFieldTypes: any = FieldTypes;

    constructor(
        private formBuilder: FormBuilder,
        private toasterService: ToasterService,
        private modalService: BsModalService,
        private breakPointObservar: BreakpointObserver,
        private changeDetectorRef: ChangeDetectorRef,
        private store: Store<AppState>,
        private customFieldsService: CustomFieldsService
    ) {

    }

    /**
     * On Initialization of component
     *
     * @memberof CustomFieldsComponent
     */
    public ngOnInit(): void {
        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });

        this.customFieldForm = this.createCustomFieldForm();
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                if (this.activeCompany?.uniqueName !== activeCompany?.uniqueName) {
                    this.customFieldsRequest.companyUniqueName = activeCompany?.uniqueName;
                    this.getCompanyCustomField();
                }
                this.activeCompany = activeCompany;
            }
        });
    }

    /**
     * Releases the memory
     *
     * @memberof CustomFieldsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * To create and initialize custom field form
     *
     * @returns {FormGroup}
     * @memberof CustomFieldsComponent
     */
    public createCustomFieldForm(): FormGroup {
        return this.formBuilder.group({
            customField: this.formBuilder.array([
                this.initNewCustomField(null)
            ])
        });
    }

    /**
     * API call to get custom field data
     *
     * @memberof CustomFieldsComponent
     */
    public getCompanyCustomField(): void {
        this.isGetCustomInProgress = true;
        this.customFieldsService.list(this.customFieldsRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isEnabledIndex = null;
            if (response) {
                if (response.status === 'success') {
                    this.renderCustomField(response.body?.results);
                } else if (response.message) {
                    this.toasterService.errorToast(response.message);
                }
            }
            this.isGetCustomInProgress = false;
            this.changeDetectorRef.detectChanges();
        });
    }

    /**
     * To open confirmation model
     *
     * @param {TemplateRef<any>} template
     * @memberof CustomFieldsComponent
     */
    public openModal(template: TemplateRef<any>, index: number): void {
        this.modalRef = this.modalService.show(template, { class: 'delete-custom-field-modal' });
        this.selectedRowIndex = index;

        setTimeout(() => {
            document.querySelector(".delete-custom-field-modal")?.parentElement.classList?.add("delete-custom-field-modal-container");
        }, 50);
    }

    /**
     * To submit custom field data
     *
     * @param {string} operationType To check operation type
     * @param {*} value
     * @memberof CustomFieldsComponent
     */
    public saveCustomFields(value: any): void {
        this.isSaveCustomInProgress = true;
        let newCustomFields = value.customField?.filter(field => !field.uniqueName);
        this.customFieldsService.create(newCustomFields, this.activeCompany?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.customFieldForm.get('customField').reset();
                    this.toasterService.successToast(this.localeData?.custom_field_created);
                    this.getCompanyCustomField();
                } else {
                    this.toasterService.errorToast(response.message);
                }
                this.isEnabledIndex = null;
                this.isSaveCustomInProgress = false;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    /**
     * To render custom field data
     *
     * @param {*} response
     * @memberof CustomFieldsComponent
     */
    public renderCustomField(response: any): void {
        let res: any[] = response;
        this.customFieldForm = this.createCustomFieldForm();
        const customRow = this.customFieldForm.get('customField') as FormArray;
        if (res.length) {
            res.map(item => {
                customRow.push(this.initNewCustomField(item));
            });
            this.removeCustomFieldRow(0, false);
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * To initialize custom field form row
     *
     * @returns {FormGroup}
     * @memberof CustomFieldsComponent
     */
    public initNewCustomField(item: any): FormGroup {
        let initCustomForm = this.formBuilder.group({
            fieldName: [null, Validators.compose([Validators.required])],
            fieldType: this.formBuilder.group({
                name: null,
                type: null
            }),
            dataRange: this.formBuilder.group({
                min: 0,
                max: null
            }),
            uniqueName: [null],
            modules: this.formBuilder.array([
                this.formBuilder.group({
                    name: 'Account',
                    uniqueName: 'account'
                })
            ])
        });
        if (item) {
            initCustomForm?.patchValue(item);
        }
        return initCustomForm;
    }

    /**
    * To add new custom field row
    *
    * @returns {*}
    * @memberof CustomFieldsComponent
    */
    public addNewCustomFieldRow(): any {
        const customRow = this.customFieldForm.get('customField') as FormArray;
        if (this.customFieldForm.valid) {
            customRow.push(this.initNewCustomField(null));
        } else {
            this.toasterService.warningToast(this.localeData?.fill_mandatory_fields);
        }
        return;
    }

    /**
     * To remove custom field form row
     *
     * @param {boolean} isUpdate To check for API call
     * @param {number} index index number
     * @memberof CustomFieldsComponent
     */
    public removeCustomFieldRow(index: number, isUpdate: boolean): void {
        if (!isUpdate) {
            const row = this.customFieldForm.get('customField') as FormArray;
            if (row.length > 0) {
                row.removeAt(index);
            }
        } else {
            const row = cloneDeep(this.customFieldForm.get('customField') as FormArray);
            const customFieldUniqueName = row?.value[index]?.uniqueName;

            this.customFieldsService.delete(customFieldUniqueName, this.activeCompany?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                if (response?.status === "success") {
                    this.toasterService.successToast(this.localeData?.custom_field_deleted);
                    this.getCompanyCustomField();

                    this.modalRef?.hide()
                } else {
                    this.toasterService.errorToast(response?.message);
                }
            });
        }
    }

    /**
     * To edit custom field row
     *
     * @param {number} index
     * @memberof CustomFieldsComponent
     */
    public editCustomfield(index: number): void {
        this.isEnabledIndex = index;
        this.checkValidation('name', index);
        if(this.isCustomFormValid) {
            this.checkValidation('length', index);
        }
    }

    /**
     * To add remoive validation according to custom field type
     *
     * @param {*} event
     * @param {number} index
     * @memberof CustomFieldsComponent
     */
    public customFieldTypeSelected(event: any, index: number) {
        const row = this.customFieldForm.get('customField') as FormArray;
        if (event.value === FieldTypes.Boolean) {
            row.controls[index].get('dataRange').get('min').setValue(null);
            row.controls[index].get('dataRange').clearValidators();
        } else if (event.value === FieldTypes.Number) {
            row.controls[index].get('dataRange').get('min').setValue(0);
            row.controls[index].get('dataRange').get('max').setValidators([Validators.required, Validators.max(30)]);
        } else if (event.value === FieldTypes.String || event.value === FieldTypes.Barcode) {
            row.controls[index].get('dataRange').get('min').setValue(1);
            row.controls[index].get('dataRange').get('max').setValidators([Validators.required, Validators.max(150)]);
        }
        row.controls[index].get('dataRange').get('max').setValue(null);
    }

    /**
     * To show check custom field validation
     *
     * @param {string} type
     * @param {number} index
     * @memberof CustomFieldsComponent
     */
    public checkValidation(type: string, index: number): void {
        const row = this.customFieldForm.get('customField') as FormArray;
        this.isCustomFormValid = true;
        if (type === 'name') {
            if (row.controls[index] && row.controls[index].get('fieldName') && row.controls[index].get('fieldName').value && row.controls[index].get('fieldName').value.length > 100) {
                this.toasterService.errorToast(this.localeData?.name_length_validation);
                this.isCustomFormValid = false;
            }
        } else if (type === 'length') {
            if(!row.controls[index].get('fieldType').value.type) {
                this.toasterService.warningToast(this.localeData?.fill_mandatory_fields);
                this.isCustomFormValid = false;
            } else if (row.controls[index].get('fieldType').value.type === FieldTypes.Number && row.controls[index].get('dataRange').value.max > 30) {
                this.toasterService.warningToast(this.localeData?.number_length_validation);
                this.isCustomFormValid = false;
            } else if ((row.controls[index].get('fieldType').value.type === FieldTypes.String || row.controls[index].get('fieldType').value.type === FieldTypes.Barcode) && row.controls[index].get('dataRange').value.max > 150) {
                this.toasterService.warningToast(this.localeData?.string_length_validation);
                this.isCustomFormValid = false;
            }
        }
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof CustomFieldsComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.fieldTypes = [
                { label: this.commonLocaleData?.app_datatype_list?.string, value: FieldTypes.String },
                { label: this.commonLocaleData?.app_datatype_list?.number, value: FieldTypes.Number },
                { label: this.commonLocaleData?.app_datatype_list?.boolean, value: FieldTypes.Boolean },
                { label: this.commonLocaleData?.app_datatype_list?.barcode, value: FieldTypes.Barcode }
            ];
        }
    }

    public updateCustomFields(row: any): void {
        this.isSaveCustomInProgress = true;
        const apiObservable = this.customFieldsService.update(row.customField[this.isEnabledIndex], row.customField[this.isEnabledIndex]?.uniqueName, this.activeCompany?.uniqueName);
        apiObservable.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.customFieldForm.get('customField').reset();
                    this.toasterService.successToast(this.localeData?.custom_field_updated);
                    this.isEnabledIndex = null;
                    this.getCompanyCustomField();
                } else {
                    this.toasterService.errorToast(response.message);
                }
                this.isSaveCustomInProgress = false;
                this.changeDetectorRef.detectChanges();
            }
        });
    }
}