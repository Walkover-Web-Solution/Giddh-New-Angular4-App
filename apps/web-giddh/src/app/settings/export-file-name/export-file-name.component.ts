import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { SettingsProfileService } from '../../services/settings.profile.service';
import { TributeConfig } from '../../shared/helpers/directives/tributeMention/tributeType';
import { ToasterService } from '../../services/toaster.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IOption } from '../../app.constant';

interface ExportSettingType {
    exportName: string;
    format: string;
    originalFormat?: string;
    suggestedFileFormat?: string;
    supportedVariableMap?: any;
    supportedVariableList?: IOption[];
}

@Component({
    selector: 'export-file-name',
    templateUrl: './export-file-name.component.html',
    styleUrls: ['./export-file-name.component.scss']
})

export class ExportFileNameComponent implements OnInit, OnDestroy {

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    /* tribute config for file name */
    public tributeConfig: TributeConfig = {
        trigger: '{',
        suggestionPrefix: '{',
        suggestionSuffix: '}',
    };
    /** isLoading */
    public isLoading: boolean = false;

    /** Get module export setting array */
    get moduleExportSettingArray(): FormArray {
        return this.exportModuleSettingForm.get('moduleExportSetting') as FormArray;
    }

    /** Export module setting form */
    public exportModuleSettingForm: FormGroup;
    constructor(
        private settingsProfileService: SettingsProfileService,
        private toastService: ToasterService,
        private formBuilder: FormBuilder
    ) {
    }

    /**
     * Initialize component
     * 
     * @returns void
     * @memberof ExportFileNameComponent
     */
    public ngOnInit(): void {
        this.getAllModuleExportSetting();
        this.exportModuleSettingForm = this.formBuilder.group({
            moduleExportSetting: this.formBuilder.array([]) // Initialize as empty FormArray
        });
    }

    /** 
     * Initialize export module setting form
     * @param exportSetting 
     * @param showSuggestedFileFormat if need to show suggested file format
     * @returns FormGroup
     * @memberof ExportFileNameComponent
     */
    public initExportModuleSettingForm(exportSetting?: any, showSuggestedFileFormat: boolean = false): FormGroup {
        return this.formBuilder.group({
            exportName: [exportSetting?.exportName ?? '', Validators.required],
            format: [exportSetting?.format ?? '', Validators.required],
            originalFormat: [exportSetting?.format ?? ''],
            suggestedFileFormat: [showSuggestedFileFormat ? this.getFileFormat(this.initExportModuleSettingForm(exportSetting)) : ''],
            supportedVariableMap: [exportSetting?.supportedVariableMap ?? ''],
            supportedVariableList: [exportSetting?.supportedVariableList ?? ''],
        });
    }

    /**
     * Get all module export setting
     * 
     * @returns void
     * @memberof ExportFileNameComponent
     */
    public getAllModuleExportSetting(): void {
        this.isLoading = true;
        this.settingsProfileService.getModuleExportSetting().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response.status === 'success') {
                this.moduleExportSettingArray.clear();
                response.body.forEach((item: ExportSettingType) => {
                    item.supportedVariableList = Object.keys(item.supportedVariableMap).map((key) => {
                        return {
                            label: key,
                            value: key
                        };
                    });
                    item.originalFormat = item.format;
                    this.moduleExportSettingArray.push(this.initExportModuleSettingForm(item, true));
                });
            } else {
                this.toastService.showSnackBar("error", response.message);
            }
            this.isLoading = false;
        });
    }

    /**
     * Get file format
     * 
     * @param module 
     * @returns string
     * @memberof ExportFileNameComponent
     */
    public getFileFormat(module: FormGroup): string {
        let fileNameFormat = module.get('format')?.value;
        Object.keys(module.get('supportedVariableMap')?.value).forEach((key) => {
            if (fileNameFormat.includes(`{${key}}`)) {
                fileNameFormat = fileNameFormat.replaceAll(`{${key}}`, module.get('supportedVariableMap')?.value[key]);
            }
        });
        module.get('suggestedFileFormat')?.setValue(fileNameFormat);
        return fileNameFormat;
    }

    /**
     * Update module export setting
     * 
     * @returns void
     * @memberof ExportFileNameComponent
     */
    public updateModuleExportSetting(): void {
        const updateRequest: ExportSettingType[] = this.moduleExportSettingArray.controls.filter((control: FormGroup) => {
            return control.get('format')?.value !== control.get('originalFormat')?.value;
        }).map((control: FormGroup) => {
            return {
                exportName: control.get('exportName')?.value,
                format: control.get('format')?.value
            };
        });
        if (updateRequest.length > 0) {
            this.settingsProfileService.updateModuleExportSetting({ exportFormatList: updateRequest }).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response.status === 'success') {
                    this.toastService.showSnackBar("success", response.body);
                    this.moduleExportSettingArray.controls.filter((control: FormGroup) => {
                        return control.get('format')?.value !== control.get('originalFormat')?.value;
                    }).forEach((control: FormGroup) => {
                        control.get('originalFormat')?.setValue(control.get('format')?.value);
                    });
                } else {
                    this.toastService.showSnackBar("error", response.message);
                }
            });
        }
    }

    /**
     * Releases memory
     *
     * @memberof ExportFileNameComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
