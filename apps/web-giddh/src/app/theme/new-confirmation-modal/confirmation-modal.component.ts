import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

@Component({
    selector: 'new-confirmation-modal',
    templateUrl: './confirmation-modal.component.html',
    styleUrls: ['./confirmation-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewConfirmationModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) {
    }

    /**
     * This will close the dialog and will send response
     *
     * @param {*} response
     * @memberof NewConfirmationModalComponent
     */
    public sendResponse(response: any): void {
        this.dialogRef.close(response);
    }
}
