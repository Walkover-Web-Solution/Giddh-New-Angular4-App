import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VatService } from '../../services/vat.service';
import { ReplaySubject, takeUntil } from 'rxjs';

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


    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData: any,
        public dialogRef: MatDialogRef<any>,
        private vatService: VatService
    ) { }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof ViewReturnComponent
     */
    public ngOnInit() {
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
        this.vatService.viewVatReturn(this.inputData.companyUniqueName, model).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            this.isLoading = false;
            if (res?.status === 'success') {
                // this.dialogRef.close(res);
            }
            else {
                this.dialogRef.close(res);
            }
        });
    }
}
