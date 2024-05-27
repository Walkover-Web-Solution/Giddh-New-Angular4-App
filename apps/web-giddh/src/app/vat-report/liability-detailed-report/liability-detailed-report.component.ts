import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppState } from '../../store';
import { Store } from '@ngrx/store';
import { VatService } from '../../services/vat.service';
import { ToasterService } from '../../services/toaster.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VatDetailedReportRequest } from '../../models/api-models/Vat';
import { ReplaySubject, delay, takeUntil } from 'rxjs';
import { PAGINATION_LIMIT } from '../../app.constant';

@Component({
    selector: 'app-liability-detailed-report',
    templateUrl: './liability-detailed-report.component.html',
    styleUrls: ['./liability-detailed-report.component.scss']
})
export class LiabilityDetailedReportComponent implements OnInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public vatLiabilityDetailedReport: any = {};
    public vatLiabilityReportRequest: VatDetailedReportRequest = {
        from: '',
        to: '',
        taxNumber: '',
        page: 1,
        count: PAGINATION_LIMIT,
        section: '',
        currencyCode: 'BWP'
    };
    public isLoading: boolean = false;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /* This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** Hold table display columns */
    public displayedColumns: string[] = ['date', 'type', 'rate', 'reference', 'accountName', 'description', 'period', 'exclusive', 'inclusive', 'vat'];
    /** Holds Current Currency Map Amount Decimal currency wise for Zimbabwe report */
    public vatReportCurrencyMap: string[];
    /** Holds Currency List for Zimbabwe Amount exchange rate */
    public vatReportCurrencyList: any[] = [
        { code: 'BWP', symbol: 'P' },
        { code: 'USD', symbol: '$' },
        { code: 'GBP', symbol: '£' },
        { code: 'INR', symbol: '₹' },
        { code: 'EUR', symbol: '€' }
    ];
    /** Holds Current Currency Symbol for Zimbabwe report */
    public vatReportCurrencySymbol: string = this.vatReportCurrencyList[0].symbol;

    constructor(
        private store: Store<AppState>,
        private vatService: VatService,
        private toaster: ToasterService,
        public route: ActivatedRoute,
        private router: Router
    ) {
    }

    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');

        this.route.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.vatLiabilityReportRequest.from = params['from'];
            this.vatLiabilityReportRequest.to = params['to'];
            this.vatLiabilityReportRequest.taxNumber = params['taxNumber'];
            this.vatLiabilityReportRequest.currencyCode = params['currencyCode'];
            this.vatLiabilityReportRequest.section = params['section'];

            this.getVatLiabilityReport();
        });
    }

    /**
     * VAT Obligations API Call
     *
     * @memberof LiabilityDetailedReportComponent
     */
    public getVatLiabilityReport(): void {
        console.log("getVatLiabilityReport", this.vatLiabilityReportRequest);

        this.isLoading = true;
        this.vatService.getVatLiabilityReport(this.vatLiabilityReportRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.isLoading = false;
            if (response && response.status === "success" && response.body?.sections) {
                this.vatLiabilityDetailedReport = response.body;

                this.vatLiabilityReportRequest.currencyCode = response.body?.currency?.code;
                this.vatReportCurrencySymbol = this.vatReportCurrencyList.filter(item => item.code === response.body?.currency?.code).map(item => item.symbol).join();
                this.vatReportCurrencyMap = response.body?.currencyList;

            } else if (response?.body?.message) {
                this.toaster.showSnackBar('error', response?.body?.message);
            } else if (response?.message) {
                this.toaster.showSnackBar('error', response?.message);
            }
        });
    }

    /**
     * This function will change the page of vat report
     *
     * @param {*} event
     * @memberof VatReportTransactionsComponent
     */
    public pageChanged(event: any): void {
        if (this.vatLiabilityReportRequest.page !== event.page) {
            this.vatLiabilityDetailedReport.results = [];
            this.vatLiabilityReportRequest.page = event.page;
            this.getVatLiabilityReport();
        }
    }

    /**
    * Lifecycle hook for destroy
    *
    * @memberof LiabilityDetailedReportComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body').classList.remove('gst-sidebar-open');
        this.asideGstSidebarMenuState === 'out'
    }

}
