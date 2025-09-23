import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { KeyboardShortutModule } from '../../helpers/directives/keyboardShortcut/keyboardShortut.module';
import { TranslateDirectiveModule } from '../../../theme/translate/translate.directive.module';
import { GiddhPageLoaderModule } from '../../giddh-page-loader/giddh-page-loader.module';
import { ActionTypeEnum } from '../utility/sales-person.constant';
import { FormFieldsModule } from '../../../theme/form-fields/form-fields.module';
import { SalesPersonComponentStore } from '../utility/sales-person.store';
import { filter, ReplaySubject, takeUntil } from 'rxjs';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

@Component({
    selector: 'archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.component.scss'],
    providers: [SalesPersonComponentStore],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        KeyboardShortutModule,
        TranslateDirectiveModule,
        GiddhPageLoaderModule,
        FormFieldsModule
    ]
})
export class ArchiveSalesPersonComponent implements OnInit, OnDestroy {
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Archive form */
    public archiveForm: FormGroup = new FormGroup({
        action: new FormControl<ActionTypeEnum>(ActionTypeEnum.UNASSIGNED, [Validators.required]),
        uniqueName: new FormControl<string>(null),
        archiveOnly: new FormControl<boolean>(false)
    });
    public salesPersonList: any[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<ArchiveSalesPersonComponent>,
        private salesPersonStore: SalesPersonComponentStore
    ) { }

    /**
     * Lifecycle hook runs on component initialization
     * 
     * @memberof ArchiveSalesPersonComponent
     */
    public ngOnInit(): void {
        this.getSalesPersonList();
        this.salesPersonStore.salesPersonList$.pipe(takeUntil(this.destroyed$), filter(Boolean)).subscribe((salesPersonList: IOption[]) => {
            this.salesPersonList = [{
                label: this.inputData?.commonLocaleData?.app_unassigned,
                value: null
            }, ...salesPersonList?.filter((item: IOption) => item.value !== this.inputData?.salesPersonUniqueName) || []]; // filter out the current sales person
        });
    }

    /**
     * Submit form
     * 
     * @memberof ArchiveSalesPersonComponent
     */
    public submit(): void {
        const form = this.archiveForm.value;
        form.archiveOnly = Boolean(this.inputData?.archiveOnly);
        if (form.uniqueName) {
            form.action = ActionTypeEnum.TRANSFER;
        } else {
            form.action = ActionTypeEnum.UNASSIGNED;
            delete form.uniqueName;
        }
        this.dialogRef.close(form);
    }

    /**
     * Handle clear
     * 
     * @memberof ArchiveSalesPersonComponent
     */
    public handleClear(): void {
        this.archiveForm.get('action')?.setValue(ActionTypeEnum.UNASSIGNED);
    }

    /**
     * Get sales person list as label value
     *
     * @memberof ArchiveSalesPersonComponent
     */
    public getSalesPersonList(): void {
        this.salesPersonStore.getAllSalesPerson({ isDropdown: true, params: { page: 1, count: 200 } });
    }

    /**
     * Releases memory
     *
     * @memberof SalesPersonComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
