import { BreakpointObserver } from "@angular/cdk/layout";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { cloneDeep } from "apps/web-giddh/src/app/lodash-optimized";
import { GroupService } from "apps/web-giddh/src/app/services/group.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { IOption } from "apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";

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
    public dataTypeList: IOption[] = [];
    /** To check API call in progress */
    public isGetCustomInProgress: boolean = true;
    /** To check API call in progress */
    public isSaveCustomInProgress: boolean = false;
    /** To get any custom field in edit mode index */
    public isEnabledIndex: number = null;
    /** To get  custom fields length */
    public updateModeLength: number = 0;
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

    constructor(
        private formBuilder: FormBuilder,
        private groupService: GroupService,
        private toasterService: ToasterService,
        private modalService: BsModalService,
        private breakPointObservar: BreakpointObserver,
        private changeDetectorRef: ChangeDetectorRef
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
        this.getCompanyCustomField();
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
        this.groupService.getCompanyCustomField().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isEnabledIndex = null;
            if (response) {
                if (response.status === 'success') {
                    this.renderCustomField(response.body);
                    this.updateModeLength = response.body.length;
                } else if (response.message) {
                    this.toasterService.errorToast(response.message);
                }
            }
            this.isGetCustomInProgress = false;

        });
    }

    /**
     * To open confirmation model
     *
     * @param {TemplateRef<any>} template
     * @memberof CustomFieldsComponent
     */
    public openModal(template: TemplateRef<any>, index: number): void {
        this.modalRef = this.modalService.show(template);
        this.selectedRowIndex = index;
    }

    /**
     * To submit custom field data
     *
     * @param {string} operationType To check operation type
     * @param {*} type API call operation type
     * @param {*} value
     * @memberof CustomFieldsComponent
     */
    public submitCustomFields(value: any, operationType?: string): void {
        this.isSaveCustomInProgress = true;
        this.groupService.createCompanyCustomField(value.customField).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.customFieldForm.get('customField').reset();
                    let customFieldResponse = response.body;
                    this.updateModeLength = customFieldResponse.length;
                    this.renderCustomField(customFieldResponse);
                    if (operationType === 'create') {
                        this.toasterService.successToast(this.localeData?.custom_field_created);
                    } else if (operationType === 'delete') {
                        this.toasterService.successToast(this.localeData?.custom_field_deleted);
                    } else {
                        this.toasterService.successToast(this.localeData?.custom_field_updated);
                    }
                } else {
                    this.toasterService.errorToast(response.message);
                    this.getCompanyCustomField();
                }
                this.isEnabledIndex = null;
                this.isSaveCustomInProgress = false;
                if (this.modalRef) {
                    this.modalRef.hide()
                }
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
                item.isEditMode = true;
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
            key: [null, Validators.compose([Validators.required])],
            dataType: [null, Validators.compose([Validators.required])],
            valueLength: [null, Validators.compose([Validators.required])],
            isEditMode: [false],
            uniqueName: [null],
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
            if (row.length > 0) {
                row.removeAt(index);
            }
            let requestObject = {
                customField: row.value
            }
            this.submitCustomFields(requestObject, 'delete');
        }
    }

    /**
     * To edit custom field row
     *
     * @param {number} index
     * @memberof CustomFieldsComponent
     */
    public editCustomfield(index: number): void {
        const row = this.customFieldForm.get('customField') as FormArray;
        this.isEnabledIndex = index;
        row.controls[index].get('isEditMode').setValue(false);
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
        if (event.value === 'BOOLEAN') {
            row.controls[index].get('valueLength').clearValidators();
        } else {
            if (event.value === 'NUMERIC') {
                row.controls[index].get('valueLength').setValidators([Validators.required, Validators.max(30)]);
            } else if (event.value === 'STRING') {
                row.controls[index].get('valueLength').setValidators([Validators.required, Validators.max(150)]);
            }
        }
        row.controls[index].get('valueLength').setValue(null);
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
            if (row.controls[index] && row.controls[index].get('key') && row.controls[index].get('key').value && row.controls[index].get('key').value.length > 50) {
                this.toasterService.errorToast(this.localeData?.name_length_validation);
                this.isCustomFormValid = false;
            }
        } else {
            if (row.controls[index].get('dataType').value === 'NUMERIC' && row.controls[index].get('valueLength').value > 30) {
                this.toasterService.warningToast(this.localeData?.number_length_validation);
                this.isCustomFormValid = false;

            } else if (row.controls[index].get('dataType').value === 'STRING' && row.controls[index].get('valueLength').value > 150) {
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
            this.dataTypeList = [
                { label: this.commonLocaleData?.app_datatype_list?.string, value: "STRING" },
                { label: this.commonLocaleData?.app_datatype_list?.number, value: "NUMERIC" },
                { label: this.commonLocaleData?.app_datatype_list?.boolean, value: "BOOLEAN" }
            ];
        }
    }
}