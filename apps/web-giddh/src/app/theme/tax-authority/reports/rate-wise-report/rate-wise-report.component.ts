import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { TaxAuthorityComponentStore } from '../../utility/tax-authority.store';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { SalesTaxReport } from '../../utility/tax-authority.const';
import { saveAs } from "file-saver";
import { ActivatedRoute } from '@angular/router';
import { PAGE_SIZE_OPTIONS } from 'apps/web-giddh/src/app/app.constant';
import { IPagination } from 'apps/web-giddh/src/app/models/interfaces/paginated-response.interface';

@Component({
    selector: 'rate-wise-report',
    templateUrl: './rate-wise-report.component.html',
    styleUrls: ['./rate-wise-report.component.scss'],
    providers: [TaxAuthorityComponentStore]
})
export class RateWiseReportComponent implements OnInit, OnDestroy {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds table columns */
    public displayedColumns: string[] = ['tax_name', 'total_sales', 'taxable_amount', 'tax_percentage', 'tax_collected'];
     /** Holds page size options */
     public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
     /** Hold table page index number*/
     public pageIndex: number = 0;
     /** Holds pagination request  */
     public pagination: IPagination = {
         page: 1,
         count: this.pageSizeOptions[0],
         totalItems: null,
         totalPages: null
     };
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** Loading Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Tax Wise Report Observable */
    public taxWiseReport$: Observable<any> = this.componentStore.taxWiseReport$;
    /** Holds Form group */
    public salesTaxReportForm: FormGroup;
    /** Holds True if get all tax number api isinprogress*/
    public isTaxApiInProgress: boolean = false;
    /** Holds Active company details */
    public activeCompany: any = null;

    constructor(
        private componentStore: TaxAuthorityComponentStore,
        private formBuilder: FormBuilder,
        private generalService: GeneralService,
        private activateRoute: ActivatedRoute
    ) { }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof RateWiseReportComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.initSalesTaxReportForm();
        this.activateRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(queryParams => {
            if (queryParams?.uniqueName) {
                this.getFormControl('taxAuthorityUniqueName').patchValue(queryParams.uniqueName ?? '');
            }
        });
        
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        // Subscribe Export Report Success Observable
        this.componentStore.exportTaxWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.downloadReport(response);
            }
        });

        // Subscribe Sales Report List Observable
        this.componentStore.taxWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.pagination.page = response?.page;
                this.pagination.totalItems = response?.totalItems;
                this.pagination.totalPages = response?.totalPages;
            }
        });
    }

    /**
    * Get Tax Authority API Call
    *
    * @memberof RateWiseReportComponent
    */
    public getSalesTaxReport(): void {
        const formValue = this.salesTaxReportForm.value;
        if (formValue.taxNumber && formValue.from && formValue.to) {
            const model: any = {
                reportType: SalesTaxReport.TaxWise,
                params: { ...formValue, page: this.pagination.page, count: this.pagination.count },
                isExport: false
            };
            this.componentStore.getSalesTaxReport(model);
        }
    }

    /**
    * Export Tax Authority API Call
    *
    * @memberof RateWiseReportComponent
    */
    public exportTaxAuthority(): void {
        const formValue = this.salesTaxReportForm.value;
        const model: any = {
            reportType: SalesTaxReport.TaxWise,
            params: formValue,
            isExport: true
        };
        this.componentStore.exportSalesTaxReport(model);
    }


    /**
    * This will use for init main formgroup
    *
    * @private
    * @memberof RateWiseReportComponent
    */
    private initSalesTaxReportForm(): void {
        this.salesTaxReportForm = this.formBuilder.group({
            taxAuthorityUniqueName: [''],
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
    * @memberof RateWiseReportComponent
    */
    public getFormControl(control: string): any {
        return this.salesTaxReportForm.get(control);
    }

    /**
     * Download Excel Report
     *
     * @param {*} response
     * @returns {void}
     * @memberof RateWiseReportComponent
     */
    public downloadReport(response: any): void {
        let blob = this.generalService.base64ToBlob(response, 'application/xls', 512);
        return saveAs(blob, `Sales Tax Report - Rate wise.csv`);
    }

    /**
    * This will use for page change
    *
    * @param {*} event
    * @memberof AccountWiseReportComponent
    */
    public handlePageChange(event: any): void {
        if (event) {
            this.pageIndex = event.pageIndex;
            this.pagination.count = event.pageSize;
            this.pagination.page = event.pageIndex + 1;
            this.getSalesTaxReport();
        }
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof RateWiseReportComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out';
    }
}
