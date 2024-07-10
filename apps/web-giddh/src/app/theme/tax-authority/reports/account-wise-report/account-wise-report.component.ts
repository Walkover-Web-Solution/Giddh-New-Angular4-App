import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { TaxAuthorityComponentStore } from '../../utility/tax-authority.store';
import { GeneralService } from 'apps/web-giddh/src/app/services/general.service';
import { ActivatedRoute } from '@angular/router';
import { saveAs } from "file-saver";
import { SalesTaxReport } from '../../utility/tax-authority.const';
import { IPagination } from 'apps/web-giddh/src/app/models/interfaces/paginated-response.interface';
import { PAGE_SIZE_OPTIONS } from 'apps/web-giddh/src/app/app.constant';


@Component({
    selector: 'account-wise-report',
    templateUrl: './account-wise-report.component.html',
    styleUrls: ['./account-wise-report.component.scss'],
    providers: [TaxAuthorityComponentStore]
})
export class AccountWiseReportComponent implements OnInit {
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds table columns */
    public displayedColumns: any = ['customer_name', 'total_sales', 'taxable_amount', 'tax_collected'];
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
    /** Account Wise Report Observable */
    public accountWiseReport$: Observable<any> = this.componentStore.accountWiseReport$;
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
     * @memberof AccountWiseReportComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.initSalesTaxReportForm();
        this.activateRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(queryParams => {
            if (queryParams?.taxAuthorityUniqueName || queryParams?.taxUniqueName) {
                this.getFormControl('taxAuthorityUniqueName').patchValue(queryParams?.taxAuthorityUniqueName ?? '');
                this.getFormControl('taxUniqueName').patchValue(queryParams?.taxUniqueName ?? '');
            }
        });
        
        this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        // Subscribe Export Report Success Observable
        this.componentStore.exportAccountWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.downloadReport(response);
            }
        });

        // Subscribe Sales Report List Observable
        this.componentStore.accountWiseReport$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
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
    * @memberof AccountWiseReportComponent
    */
    public getSalesTaxReport(): void {
        const formValue = this.salesTaxReportForm.value;
        if (formValue.taxNumber && formValue.from && formValue.to) {
            const model: any = {
                reportType: SalesTaxReport.AccountWise,
                params: { ...formValue, page: this.pagination.page, count: this.pagination.count },
                isExport: false
            };
            this.componentStore.getSalesTaxReport(model);
        }
    }

    /**
    * Export Tax Authority API Call
    *
    * @memberof AccountWiseReportComponent
    */
    public exportTaxAuthority(): void {
        const formValue = this.salesTaxReportForm.value;
        const model: any = {
            reportType: SalesTaxReport.AccountWise,
            params: formValue,
            isExport: true
        };
        this.componentStore.exportSalesTaxReport(model);
    }


    /**
    * This will use for init main formgroup
    *
    * @private
    * @memberof AccountWiseReportComponent
    */
    private initSalesTaxReportForm(): void {
        this.salesTaxReportForm = this.formBuilder.group({
            taxAuthorityUniqueName: [''],
            branchUniqueName: [''],
            taxUniqueName: [''],
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
    * @memberof AccountWiseReportComponent
    */
    public getFormControl(control: string): any {
        return this.salesTaxReportForm.get(control);
    }

    /**
     * Download Excel Report
     *
     * @param {*} response
     * @returns {void}
     * @memberof AccountWiseReportComponent
     */
    public downloadReport(response: any): void {
        let blob = this.generalService.base64ToBlob(response, 'application/xls', 512);
        return saveAs(blob, `Sales Tax Report - Account wise.csv`);
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
    * @memberof AccountWiseReportComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out';
    }

}
