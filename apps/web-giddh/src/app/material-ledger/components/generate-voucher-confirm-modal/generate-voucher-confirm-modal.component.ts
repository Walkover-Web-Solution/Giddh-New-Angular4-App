import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'generate-voucher-confirmation-modal',
    templateUrl: './generate-voucher-confirm-modal.component.html',
    styleUrls: ['./generate-voucher-confirm-modal.component.scss']
})

export class GenerateVoucherConfirmationModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        public dialogRef: MatDialogRef<any>) {
    }

    public sendResponse(response: boolean) {
        this.dialogRef.close(response);
    }
}
