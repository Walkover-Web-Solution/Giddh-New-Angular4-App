import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'transfer',
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransferComponent implements OnInit {
    /** This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public transferForm: UntypedFormGroup;

    constructor(@Inject(MAT_DIALOG_DATA) public inputData, private changeDetection: ChangeDetectorRef, private fb: UntypedFormBuilder,
        public dialogRef: MatDialogRef<any>) {
    }

    public ngOnInit(): void {
        console.log(this.inputData);
        this.initForm();

    }

    public initForm(): void {
        this.transferForm = this.fb.group({
            name: ['',],
            lastname: [''],
            email: ["", [Validators.email]],
        });
    }

    public onSubmit(): void {
        this.dialogRef.close();

    }

    public onCancel(): void {
        this.dialogRef.close();
        this.transferForm.reset();
    }

}
