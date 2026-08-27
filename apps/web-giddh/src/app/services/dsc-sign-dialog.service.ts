import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { select, Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { AppState } from '../store';
import { ToasterService } from './toaster.service';
import { DscService } from './dsc.service';
import { LocaleService } from './locale.service';
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
        private toasterService: ToasterService,
        private localeService: LocaleService,
        private store: Store<AppState>
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
        if (!this.dscService.isBridgeAvailable()) {
            console.info('[DSC Dialog Service] Bridge not available - showing warning');
            this.store.pipe(select((state) => state.session.currentLocale), take(1)).subscribe((locale) => {
                this.localeService.getLocale('vouchers/dsc-pin-dialog', locale?.value).subscribe((localeData: any) => {
                    this.toasterService.showSnackBar('warning', localeData?.bridge_not_found);
                });
            });
            return;
        }

        console.info('[DSC Dialog Service] Bridge available - opening dialog');
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
