import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, takeUntil } from 'rxjs';
import { GeneralService } from '../../services/general.service';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { VatService } from '../../services/vat.service';
import { ToasterService } from '../../services/toaster.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import * as saveAs from 'file-saver';

@Component({
    selector: 'liability-report-component',
    templateUrl: './liability-report.component.html',
    styleUrls: ['./liability-report.component.scss']
})

export class LiabilityReportComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds Obligations Fromgroup  */
    public liabilityReportForm: UntypedFormGroup
    /** Holds Obligations table data */
    public tableDataSource: any[] = [];
    /** Holds Obligations table columns */
    public displayedColumns = ['start', 'end', 'due', 'status', 'action'];
    /** True if API Call is in progress */
    public isLoading: boolean;
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** Holds Current Currency Symbol for Zimbabwe report */
    public vatReportCurrencySymbol: string = 'P';
    /** True, if API is in progress */
    public isTaxApiInProgress: boolean;
    /** Holds Table Data  */
    public vatLiabilityOverviewReport: any[];
    public activeCompany: any = null;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };

    constructor(
        private formBuilder: UntypedFormBuilder,
        private store: Store<AppState>,
        private generalService: GeneralService,
        private vatService: VatService,
        private toaster: ToasterService,
        public dialog: MatDialog,
        private route: Router
    ) { }

    /**
    * Lifecycle hook for initialization
    *
    * @memberof LiabilityReportComponent
    */
    public ngOnInit(): void {

        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany && this.activeCompany?.uniqueName !== activeCompany.uniqueName) {
                this.activeCompany = activeCompany;
            }
        });
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.initLiabilityReport();
    }

    /**
    * VAT Obligations API Call
    *
    * @memberof LiabilityReportComponent
    */
    public getVatLiabilityReport(): void {
        if (this.getFormControl('taxNumber').value) {
            this.isLoading = true;
            this.vatService.getVatLiabilityReport(this.liabilityReportForm.value).pipe(takeUntil(this.destroyed$)).subscribe(response => {

                this.isLoading = false;
                if (response && response.status === "success" && response.body?.sections) {
                    this.vatLiabilityOverviewReport = response.body.sections
                } else if (response?.message) {
                    this.toaster.showSnackBar('error', response?.message);
                }
            });
        }
    }

    /**
     * Redirect to liability detailed report list page
     *
     * @param {*} report
     * @memberof LiabilityReportComponent
     */
    public viewDetailedReport(report): void {
        if (report) {
            let formValue = this.liabilityReportForm.value;
            let section = report?.section === "Input VAT Total" ? 'inputVat' : 'outputVat';

            this.route.navigate(['pages', 'vat-report', 'liability-report', 'detailed'], { queryParams: { from: formValue.from, to: formValue.to, taxNumber: formValue.taxNumber, currencyCode: formValue.currencyCode, section: section } });
        }
    }

    /**
    * Handle Dropdown callback for Tax Number and save value to form
    *
    * @param {*} event
    * @memberof LiabilityReportComponent
    */
    public taxNumberSelected(event: any): void {
        if (event?.value) {
            this.getFormControl('taxNumber').setValue(event.value);
            this.getVatLiabilityReport();
        }
    }

    /**
    * Handle Dropdown callback for Branch and save value to form
    *
    * @param {*} event
    * @memberof LiabilityReportComponent
    */
    public branchSelected(event: any): void {
        if (event?.value) {
            this.getFormControl('branchUniqueName').setValue(event.value);
        }
    }

    /**
    * This will use for init main formgroup
    *
    * @private
    * @memberof LiabilityReportComponent
    */
    private initLiabilityReport(): void {
        this.liabilityReportForm = this.formBuilder.group({
            branchUniqueName: [''],
            currencyCode: ['BWP'],
            taxNumber: [''],
            from: [''],
            to: ['']
        });
    }

    /**
    * Used to get and set form control value
    *
    * @param {string} control
    * @returns {*}
    * @memberof LiabilityReportComponent
    */
    public getFormControl(control: string): any {
        return this.liabilityReportForm.get(control)
    }

    /**
    * Handles GST Sidebar Navigation
    *
    * @memberof LiabilityReportComponent
    */
    public handleNavigation(): void {
        this.route.navigate(['pages', 'gstfiling']);
    }

    /**
     * Handle Currency change dropdown and call VAT Report API
     *
     * @param {*} event
     * @memberof LiabilityReportComponent
     */
    public onCurrencyChange(event: any): void {
        if (event) {
            this.getFormControl('currencyCode').patchValue(event.value);
            this.getVatLiabilityReport();
        }
    }

    /**
     * Export Liability report based on currency and tax number
     *
     * @memberof LiabilityReportComponent
     */
    public downloadVatLiabilityReport(): void {
        this.liabilityReportForm.value
        let vatReportRequest = this.liabilityReportForm.value;

        delete vatReportRequest.section;
        delete vatReportRequest.page;
        delete vatReportRequest.count;

        this.vatService.downloadVatLiabilityReport(vatReportRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === "success") {
                let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
                return saveAs(blob, 'VatLiabilityReport.xlsx');
            } else {
                this.toaster.showSnackBar('error', res?.message);
            }
        });
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof LiabilityReportComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }
}
