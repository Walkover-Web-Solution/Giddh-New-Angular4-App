import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

export interface DownloadCsvOptions {
    includeParentGroup: boolean;
    includeMobileNumber: boolean;
    includeEmailId: boolean;
    includeState: boolean;
    includeTaxNumber: boolean;
}

@Component({
    selector: 'download-csv-options-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, MatDialogModule, MatSlideToggleModule, MatButtonModule],
    templateUrl: './download-csv-options-dialog.component.html'
})
export class DownloadCsvOptionsDialogComponent {
    public options: DownloadCsvOptions = {
        includeParentGroup: false,
        includeMobileNumber: false,
        includeEmailId: false,
        includeState: false,
        includeTaxNumber: false
    };
    /** Locale data passed by the parent component */
    public localeData: any = {};
    /** Common locale data passed by the parent component */
    public commonLocaleData: any = {};

    constructor(
        private dialogRef: MatDialogRef<DownloadCsvOptionsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public inputData: { localeData?: any; commonLocaleData?: any }
    ) {
        this.localeData = this.inputData?.localeData ?? {};
        this.commonLocaleData = this.inputData?.commonLocaleData ?? {};
    }

    public onCancel(): void {
        this.dialogRef.close();
    }

    public onDownload(): void {
        this.dialogRef.close(this.options);
    }
}
