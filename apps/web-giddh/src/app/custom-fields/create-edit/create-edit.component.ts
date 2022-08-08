import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { cloneDeep } from "../../lodash-optimized";
import { CustomFieldsService } from "../../services/custom-fields.service";
import { ToasterService } from "../../services/toaster.service";
import { FieldModules, FieldTypes } from "../custom-fields.constant";

@Component({
    selector: "create-edit",
    templateUrl: "./create-edit.component.html",
    styleUrls: ["./create-edit.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomFieldsCreateEditComponent implements OnInit, OnDestroy {
    /** Instance of custom field create/edit form */
    @ViewChild('customFieldCreateEditForm', { static: false }) public customFieldCreateEditForm: NgForm;
    /** Object for custom field request */
    public customFieldRequest: any = {
        fieldName: null,
        fieldType: {
            name: null,
            type: null
        },
        fieldInfo: null,
        isMandatory: null,
        dataRange: {
            min: null,
            max: null
        },
        multipleOptions: false,
        modules: null,
        status: true
    };
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** List custom row data type  */
    public fieldTypes: any[] = [];
    /** Available field modules list */
    public fieldModules: any[] = [];
    /** Conditionally visible fields in form */
    public visibleFields: any = {
        fieldInfo: true,
        fieldLimit: true,
        fieldOptions: false
    }
    /** Custom field unique name in edit mode */
    public customFieldUniqueName: string = "";
    /** Selected modules */
    public selectedModules: any[] = [];
    /** True if loader is visible */
    public showLoader: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private toasterService: ToasterService,
        private changeDetector: ChangeDetectorRef,
        private customFieldsService: CustomFieldsService,
        private route: ActivatedRoute,
        private router: Router
    ) {

    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof CustomFieldsCreateEditComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params?.customFieldUniqueName) {
                this.customFieldUniqueName = params?.customFieldUniqueName;
                this.getCustomField(params?.customFieldUniqueName);
            }
        });
    }

    /**
     * Lifecycle hook for destroy
     *
     * @memberof CustomFieldsCreateEditComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Get custom field data
     *
     * @param {string} customFieldUniqueName
     * @returns {void}
     * @memberof CustomFieldsCreateEditComponent
     */
    public getCustomField(customFieldUniqueName: string): void {
        if (!customFieldUniqueName) {
            return;
        }

        this.toggleLoader(true);
        this.customFieldsService.get(customFieldUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                if (response.status === 'success') {
                    this.customFieldRequest = cloneDeep(response.body);
                    this.selectFieldType({ label: this.customFieldRequest.fieldType?.name, value: this.customFieldRequest.fieldType?.type });
                    this.selectedModules = this.customFieldRequest?.modules?.map(module => module.uniqueName);
                } else if (response.message) {
                    this.toasterService.errorToast(response.message);
                }
                this.toggleLoader(false);
            }
            this.changeDetector.detectChanges();
        });
    }

    /**
     * Callback for translation response complete
     *
     * @param {boolean} event
     * @memberof CustomFieldsCreateEditComponent
     */
    public translationComplete(event: boolean): void {
        if (event) {
            this.fieldTypes = [
                { label: this.commonLocaleData?.app_datatype_list?.string, value: FieldTypes.String },
                { label: this.commonLocaleData?.app_datatype_list?.number, value: FieldTypes.Number },
                { label: this.commonLocaleData?.app_datatype_list?.boolean, value: FieldTypes.Boolean },
                { label: this.commonLocaleData?.app_datatype_list?.barcode, value: FieldTypes.Barcode }
            ];

            this.fieldModules = [
                { name: this.localeData?.modules?.account, uniqueName: FieldModules.Account }
            ];
        }
    }

    /**
     * Callback for selection of field type
     *
     * @param {*} field
     * @memberof CustomFieldsCreateEditComponent
     */
    public selectFieldType(field: any): void {
        const fieldType = field?.value;
        if (fieldType === FieldTypes.String || fieldType === FieldTypes.Number || fieldType === FieldTypes.Barcode) {
            this.visibleFields = {
                fieldInfo: true,
                fieldLimit: true,
                fieldOptions: false
            }
        } else if (fieldType === FieldTypes.Boolean) {
            this.visibleFields = {
                fieldInfo: false,
                fieldLimit: false,
                fieldOptions: false
            }
        }
        this.customFieldRequest.fieldType = { name: field?.label, type: field?.value };
    }

    /**
     * Creates custom field
     *
     * @param {NgForm} customFieldCreateEditForm
     * @returns {void}
     * @memberof CustomFieldsCreateEditComponent
     */
    public createCustomField(customFieldCreateEditForm: NgForm): void {
        if (customFieldCreateEditForm.invalid) {
            return;
        }
        this.toggleLoader(true);

        this.customFieldsService.create([this.customFieldRequest]).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.showSnackBar("success", this.localeData?.custom_field_created);
                this.redirectToGetAllPage();
            } else {
                this.toasterService.showSnackBar("error", response?.message);
            }
            this.toggleLoader(false);
        });
    }

    /**
     * Updates custom field
     *
     * @param {NgForm} customFieldCreateEditForm
     * @returns {void}
     * @memberof CustomFieldsCreateEditComponent
     */
    public updateCustomField(customFieldCreateEditForm: NgForm): void {
        if (customFieldCreateEditForm.invalid) {
            return;
        }
        this.toggleLoader(true);

        this.customFieldsService.update(this.customFieldRequest, this.customFieldUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.toasterService.showSnackBar("success", this.localeData?.custom_field_updated);
                this.redirectToGetAllPage();
            } else {
                this.toasterService.showSnackBar("error", response?.message);
            }
            this.toggleLoader(false);
        });
    }

    /**
     * Redirects to get all custom fields page
     *
     * @memberof CustomFieldsCreateEditComponent
     */
    public redirectToGetAllPage(): void {
        this.router.navigate(["/pages/custom-fields/list"]);
    }

    /**
     * Toggles the modules selection
     *
     * @param {*} selectedModule
     * @memberof CustomFieldsCreateEditComponent
     */
    public setModules(selectedModule: any): void {
        if (!this.customFieldRequest.modules?.length) {
            this.customFieldRequest.modules = [];
        }

        let isModuleSelected = this.customFieldRequest.modules?.filter(module => module.uniqueName === selectedModule?.uniqueName);
        if (isModuleSelected?.length > 0) {
            this.customFieldRequest.modules = this.customFieldRequest.modules?.filter(module => module.uniqueName !== selectedModule?.uniqueName);
        } else {
            this.customFieldRequest.modules.push(selectedModule);
        }
    }

    /**
     * Resets the form
     *
     * @param {NgForm} customFieldCreateEditForm
     * @memberof CustomFieldsCreateEditComponent
     */
    public resetForm(customFieldCreateEditForm: NgForm): void {
        customFieldCreateEditForm?.reset();

        this.customFieldRequest = {
            fieldName: null,
            fieldType: {
                name: null,
                type: null
            },
            fieldInfo: null,
            isMandatory: null,
            dataRange: {
                min: null,
                max: null
            },
            multipleOptions: false,
            modules: null,
            status: true
        };
    }

    /**
     * Toggle loader
     *
     * @private
     * @param {boolean} showLoader
     * @memberof StockCreateEditComponent
     */
    private toggleLoader(showLoader: boolean): void {
        this.showLoader = showLoader;
        this.changeDetector.detectChanges();
    }
}