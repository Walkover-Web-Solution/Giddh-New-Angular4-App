import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VatService } from '../../services/vat.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { VatReportRequest } from '../../models/api-models/Vat';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';

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


    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData: any,
        public dialogRef: MatDialogRef<any>,
        private vatService: VatService,
        private store: Store<AppState>
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
    public ngOnInit() {
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
        this.vatService.getUKVatReport(vatReportRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.isLoading = false;
            if (res.status === 'success' && res.body?.sections) {
                this.vatReport = res.body?.sections;
            } else {
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

        this.vatService.fileVatReturn(this.inputData.companyUniqueName, model).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res) {
                this.dialogRef.close(res);
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
