import { Component, OnDestroy, OnInit } from '@angular/core';
import { TaxAuthorityComponentStore } from '../../utility/tax-authority.store';
import { Observable, ReplaySubject, from, takeUntil } from 'rxjs';
import { SalesTaxReport, SalesTaxReportRequest } from '../../utility/tax-authority.const';
import { Tax } from 'apps/web-giddh/src/app/models/api-models/Purchase';
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
    public displayedColumns: any = ['tax_authority_name', 'taxable_amount', 'sub_total', 'non_taxable_amount', 'taxable_amount', 'tax_total'];
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** Loading Observable */
    public isLoading$: Observable<any> = this.componentStore.isLoading$;
    /** Tax Authority Wise Report Observable */
    public taxAuthorityWiseReport$: Observable<any> = this.componentStore.taxAuthorityWiseReport$;
    // /** Holds API Request Object */
    // private apiRequestParams: SalesTaxReportRequest = {
    //     to: '31-12-2026', // ===== REMOVE THIS STATIC CODE =====
    //     from: '01-01-2024',
    //     taxNumber: '123456789'
    // };
    public salesTaxReportForm: FormGroup;
    /** Holds True if get all tax number api isinprogress*/
    public isTaxApiInProgress: boolean = false;
    /** Holds Active company details */
    public activeCompany: any = null;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };

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
        this.initTaxAuthorityReport();
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
            }
        });

        this.salesTaxReportForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe( res => {
            if (res) {
                console.log("Res :", res);
            } else{
                console.log("faltu :", res);

            }
        });
    }

    /**
    * Get Tax Authority API Call
    *
    * @memberof TaxAuthorityComponent
    */
    public getTaxAuthority(): void {
        console.log("taxNumber", this.getFormControl('taxNumber').value);
        
        if (this.getFormControl('taxNumber').value) {
            const model: any = {
                reportType: SalesTaxReport.TaxAuthorityWise,
                params: this.salesTaxReportForm.value
            };
            this.componentStore.getReportTaxAuthorityWise(model);
        }
    }

    /**
    * Export Tax Authority API Call
    *
    * @memberof TaxAuthorityComponent
    */
    public exportTaxAuthority(): void {
        // const model: any = {
        //     reportType: SalesTaxReport.TaxAuthorityWise,
        //     params: this.apiRequestParams
        // };
        // this.componentStore.getReportTaxAuthorityWise(model);
    }


    /**
    * This will use for init main formgroup
    *
    * @private
    * @memberof TaxAuthorityComponent
    */
    private initTaxAuthorityReport(): void {
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
    * @memberof TaxAuthorityComponent
    */
    public getFormControl(control: string): any {
        return this.salesTaxReportForm.get(control);
    }

    public downloadVatReport() {
        // this.componentStore.downloadVatReport(this.salesTaxReportForm.value).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
        //     if (res?.status === "success") {
        //         let blob = this.generalService.base64ToBlob(res.body, 'application/xls', 512);
        //         return saveAs(blob, `SalesTaxReport.xlsx`);
        //     } else {
        // this.toasty.clearAllToaster();
        // this.toasty.errorToast(res?.message);
        //     }
        // });
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof TaxAuthorityComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }
}
