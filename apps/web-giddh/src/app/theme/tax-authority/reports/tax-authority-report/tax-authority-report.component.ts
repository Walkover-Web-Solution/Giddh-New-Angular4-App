import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaxAuthorityComponentStore } from '../../utility/tax-authority.store';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { SalesTaxReport } from '../../utility/tax-authority.const';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppState } from 'apps/web-giddh/src/app/store';
import { Store, select } from '@ngrx/store';
import { saveAs } from "file-saver";
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';


@Component({
    selector: 'tax-authority-report',
    templateUrl: './tax-authority-report.component.html',
    styleUrls: ['./tax-authority-report.component.scss'],
    providers: [TaxAuthorityComponentStore]
})
export class TaxAuthorityReportComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds table columns */
    public displayedColumns: any = ['tax_authority_name', 'tax_amount', 'sub_total', 'non_taxable_amount', 'taxable_amount', 'tax_collected'];
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** Loading Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Tax Authority Wise Report Observable */
    public taxAuthorityWiseReport$: Observable<any> = this.componentStore.taxAuthorityWiseReport$;
    /** Holds Form group */
    public salesTaxReportForm: FormGroup;
    /** Holds True if get all tax number api isinprogress*/
    public isTaxApiInProgress: boolean = false;
    /** Holds Active company details */
    public activeCompany: any = null;

    constructor(
        private componentStore: TaxAuthorityComponentStore,
        private formBuilder: FormBuilder,
        private store: Store<AppState>,
        private generalService: GeneralService
    ) { }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof TaxAuthorityReportComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.initSalesTaxReportForm();
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        // Subscribe Export Report Success Observable
        this.componentStore.exportTaxAuthorityWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.downloadReport(response);
            }
        });
    }

    /**
    * Get Tax Authority API Call
    *
    * @memberof TaxAuthorityReportComponent
    */
    public getSalesTaxReport(): void {
        const formValue = this.salesTaxReportForm.value;
        if (formValue.taxNumber && formValue.from && formValue.to) {
            const model: any = {
                reportType: SalesTaxReport.TaxAuthorityWise,
                params: formValue,
                isExport: false
            };
            this.componentStore.getSalesTaxReport(model);
        }
    }

    /**
    * Export Tax Authority API Call
    *
    * @memberof TaxAuthorityReportComponent
    */
    public exportTaxAuthority(): void {
        const formValue = this.salesTaxReportForm.value;
        const model: any = {
            reportType: SalesTaxReport.TaxAuthorityWise,
            params: formValue,
            isExport: true
        };
        this.componentStore.exportSalesTaxReport(model);
    }


    /**
    * This will use for init main formgroup
    *
    * @private
    * @memberof TaxAuthorityReportComponent
    */
    private initSalesTaxReportForm(): void {
        this.salesTaxReportForm = this.formBuilder.group({
            branchUniqueName: [''],
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
    * @memberof TaxAuthorityReportComponent
    */
    public getFormControl(control: string): any {
        return this.salesTaxReportForm.get(control);
    }

    /**
     * Download Excel Report
     *
     * @param {*} response
     * @returns {void}
     * @memberof TaxAuthorityReportComponent
     */
    public downloadReport(response: any): void {
        let blob = this.generalService.base64ToBlob(response, 'application/xls', 512);
        return saveAs(blob, `Sales Tax Report - Tax Authority wise.csv`);
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof TaxAuthorityReportComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }
}
