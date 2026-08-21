import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from './toaster.service';
import { DscService } from './dsc.service';
import { DscPinDialogComponent, DscPinDialogData } from '../vouchers/dsc-pin-dialog/dsc-pin-dialog.component';

/**
 * Service that opens the DSC PIN dialog and orchestrates the signed-invoice download flow.
 * Centralises bridge availability checks so the same flow can be reused from the voucher list,
 * voucher create page, or any future voucher page.
 */
@Injectable({
    providedIn: 'root'
})
export class DscSignDialogService {
    constructor(
        private dialog: MatDialog,
        private dscService: DscService,
        private toasterService: ToasterService
    ) { }

    /**
     * Opens the DSC PIN dialog for the given voucher and starts the signed PDF download flow.
     *
     * @param {DscPinDialogData} data Voucher details, voucher type and locale data
     * @memberof DscSignDialogService
     */
    public openDownloadSignedInvoiceDialog(data: DscPinDialogData): void {
        if (!this.dscService.isBridgeAvailable()) {
            this.toasterService.showSnackBar('warning', data.localeData?.dsc_pin_dialog?.bridge_not_found);
            return;
        }

        this.dialog.open(DscPinDialogComponent, {
            data,
            panelClass: ['mat-dialog-sm'],
            disableClose: true
        });
    }
}
