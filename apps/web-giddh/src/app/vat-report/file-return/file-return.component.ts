import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { VatService } from '../../services/vat.service';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { VatReportRequest } from '../../models/api-models/Vat';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { ToasterService } from '../../services/toaster.service';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';
import { ConfirmationModalConfiguration } from '../../theme/confirmation-modal/confirmation-modal.interface';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'file-return',
    styleUrls: ['./file-return.component.scss'],
    templateUrl: './file-return.component.html',
})
export class FileReturnComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if API Call is in progress */
    public isLoading: boolean;
    /** Holds table data for VAT Report */
    public vatReport: any[] = [];
    /** Hold table displayed columns */
    public ukDisplayedColumns: string[] = ['number', 'name', 'aed_amt'];
    /** Holds Active Company Info from store */
    public activeCompany: any;
    /** File Return confirmation popup configuration */
    public fileReturnConfirmationConfiguration: ConfirmationModalConfiguration;

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData: any,
        public dialogRef: MatDialogRef<any>,
        private vatService: VatService,
        private store: Store<AppState>,
        private toaster: ToasterService,
        public dialog: MatDialog,
        private generalService: GeneralService
    ) {
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && !this.activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
        this.localeData = inputData.localeData;
        this.commonLocaleData = inputData.commonLocaleData;
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof FileReturnComponent
    */
    public ngOnInit(): void {
        this.getReport();
    }

    /**
    * Get Vat Report and store response to 'vatReport' to display
    *
    * @private
    * @memberof FileReturnComponent
    */
    private getReport(): void {
        let vatReportRequest = new VatReportRequest();
        vatReportRequest.from = this.inputData.start;
        vatReportRequest.to = this.inputData.end;
        vatReportRequest.taxNumber = this.inputData.taxNumber;
        vatReportRequest.branchUniqueName = this.inputData.branchUniqueName;

        this.isLoading = true;
        this.vatService.getCountryWiseVatReport(vatReportRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.isLoading = false;
            if (res.status === 'success' && res.body?.sections) {
                this.vatReport = res.body?.sections;
            } else {
                if (res?.message) {
                    this.toaster.showSnackBar('error', res.message);
                }
                this.dialogRef.close(res);
            }
        });
    }

    /**
    * Submit VAT Return API Call
    *
    * @memberof FileReturnComponent
    */
    public submitVatReturn(): void {
        let model = {
            taxNumber: this.inputData.taxNumber,
            periodKey: this.inputData.periodKey,
            from: this.inputData.start,
            to: this.inputData.end,
            branchUniqueName: this.inputData.branchUniqueName
        };

        this.fileReturnConfirmationConfiguration = this.generalService.fileReturnConfiguration(this.localeData, this.commonLocaleData);
        let confirnationDialogRef = this.dialog.open(NewConfirmationModalComponent, {
            width: '630px',
            data: {
                configuration: this.fileReturnConfirmationConfiguration
            }
        });

        confirnationDialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response === this.localeData?.submit_file_return) {
                this.vatService.fileVatReturn(this.inputData.companyUniqueName, model).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
                    if (res.status === 'success') {
                        if (res?.body) {
                            this.toaster.showSnackBar('success', res.body);
                        }
                    } else {
                        if (res?.errors) {
                            let errorMessage = '';
                            res.errors.forEach(error => errorMessage += error.message + '\n');
                            this.toaster.showSnackBar('error', errorMessage);
                        } else if (res?.message) {
                            this.toaster.showSnackBar('error', res.message);
                        }
                    }
                    this.dialogRef.close(res);
                });
            } else {
                confirnationDialogRef.close()
            }
        });

    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof FileReturnComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
