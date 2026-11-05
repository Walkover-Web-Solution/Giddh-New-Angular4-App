import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DscPinDialogComponent, DscPinDialogData } from '../vouchers/dsc-pin-dialog/dsc-pin-dialog.component';

/**
 * Service that opens the DSC PIN dialog and orchestrates the signed-invoice download flow.
 * The dialog itself handles bridge/native-host availability, so callers simply open it.
 */
@Injectable({
    providedIn: 'root'
})
export class DscSignDialogService {
    constructor(
        private dialog: MatDialog
    ) { }

    /**
     * Opens the DSC PIN dialog for the given voucher and starts the signed PDF download flow.
     * Opens immediately without waiting for the certificate/token read - the dialog itself
     * shows a loading state while certificates are read (which can take a while on a
     * slow/locked hardware reader).
     *
     * @param {DscPinDialogData} data Voucher details and voucher type
     * @memberof DscSignDialogService
     */
    public openDownloadSignedInvoiceDialog(data: DscPinDialogData): void {
        console.info('[DSC Dialog Service] openDownloadSignedInvoiceDialog called');
        this.openDialog(data);
    }

    /**
     * Opens the DSC PIN dialog with the provided data.
     *
     * @private
     * @param {DscPinDialogData} data Dialog data
     * @memberof DscSignDialogService
     */
    private openDialog(data: DscPinDialogData): void {
        this.dialog.open(DscPinDialogComponent, {
            data,
            panelClass: ['mat-dialog-sm'],
            disableClose: true
        });
    }
}
