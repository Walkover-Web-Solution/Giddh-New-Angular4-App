import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'generate-voucher-confirmation-modal',
    templateUrl: './generate-voucher-confirm-modal.component.html',
    styleUrls: ['./generate-voucher-confirm-modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenerateVoucherConfirmationModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) {
    }

    /**
     * This will close the dialog and will send response
     *
     * @param {boolean} response
     * @memberof GenerateVoucherConfirmationModalComponent
     */
    public sendResponse(response: boolean): void {
        this.dialogRef.close(response);
    }
}
