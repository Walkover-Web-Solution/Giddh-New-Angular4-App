import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VatService } from '../../services/vat.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store';
import { ToasterService } from '../../services/toaster.service';
import { GeneralService } from '../../services/general.service';

@Component({
    selector: 'view-return',
    styleUrls: ['./view-return.component.scss'],
    templateUrl: './view-return.component.html',
})
export class ViewReturnComponent implements OnInit {
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
    /** Holds client ip address */
    public clientIp: string = "";


    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData: any,
        public dialogRef: MatDialogRef<any>,
        private vatService: VatService,
        private store: Store<AppState>,
        private toaster: ToasterService,
        private generalService: GeneralService
    ) {
        this.localeData = inputData.localeData;
        this.commonLocaleData = inputData.commonLocaleData;
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && !this.activeCompany) {
                this.activeCompany = activeCompany;
            }
        });
    }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof ViewReturnComponent
    */
    public ngOnInit(): void {
        this.generalService.getClientIp().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.ipAddress) {
                this.clientIp = response.ipAddress;
            }
        });
        this.viewVatReturn();
    }

    /**
    * View VAT Return API Call
    *
    * @private
    * @memberof ViewReturnComponent
    */
    private viewVatReturn(): void {
        let model = {
            taxNumber: this.inputData.taxNumber,
            periodKey: this.inputData.periodKey,
            from: this.inputData.start,
            to: this.inputData.end,
        };

        this.isLoading = true;
        this.vatService.viewVatReturn(this.inputData.companyUniqueName, model, this.clientIp).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.isLoading = false;
            if (res?.status === 'success' && res.body?.sections) {
                this.vatReport = res.body?.sections;
            }
            else {
                if (res.message) {
                    this.toaster.showSnackBar('error', res.message);
                }
                this.dialogRef.close();
            }
        });
    }
}
