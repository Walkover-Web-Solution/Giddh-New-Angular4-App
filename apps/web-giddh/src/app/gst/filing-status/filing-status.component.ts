import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { ToasterService } from "../../services/toaster.service";
import { PAGINATION_LIMIT } from "../../app.constant";
import { saveAs } from 'file-saver';
import { GstReconcileService } from "../../services/gst-reconcile.service";

const GSP = 'TAXPRO'
@Component({
    selector: 'filing-status',
    templateUrl: './filing-status.component.html',
    styleUrls: ['./filing-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FilingStatusComponent implements OnInit, OnDestroy {
    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** This will use for destroy */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds Date range from  */
    public from: string = '01-10-2023';
    /** Holds Date range to  */
    public to: string = '31-10-2023';
    /** True if api call in progress */
    public isLoading: boolean = false;
    /**Holds Page count in single page for Pagination */
    private pageCount = PAGINATION_LIMIT;
    /** Holds Pagination Data */
    private pagination: any = {
        "page": 2,
        "count": this.pageCount,
        "totalPages": 1,
        "totalItems": 1,
    }
    /** Holds Active GSTIN Number */
    public activeCompanyGstNumber: string = '';
    /** Holds mat table column */
    public displayedColumns: string[] = ['referenceId', 'status'];
    /** Holds data get from api to display Reference ID list */
    public dataSource: any[] = [];

    constructor(
        private gstReconcileService: GstReconcileService,
        private toasty: ToasterService,
        private router: Router,
        private changeDetectionRef: ChangeDetectorRef
    ) { }

    /**
     * Lifecycle hook runs when component is initialized
     *
     * @memberof FilingStatusComponent
     */
    public ngOnInit(): void {
        document.querySelector('body').classList.add('gst-sidebar-open');
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
            this.activeCompanyGstNumber = res?.body[0];
            if (this.activeCompanyGstNumber !== '') {
                this.gstReconcileService.getFilingStatusReferenceIdList({
                    "from": this.from,
                    "to": this.to,
                    "page": this.pagination.page,
                    "count": this.pagination.count,
                    "gstin": this.activeCompanyGstNumber,
                    "gsp": GSP
                }).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
                    if (res?.body?.results?.length) {
                        this.dataSource = res.body?.results;
                    } else {
                        this.dataSource = [];
                    }
                    this.changeDetectionRef.detectChanges();
                })
            }
        })
    }

    /**
    * Handles GST Sidebar Navigation
    *
    * @memberof FilingStatusComponent
    */
    public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }


    /**
     *  Reset Date filter
     *
     * @memberof FilingStatusComponent
     */
    public resetAdvanceSearch(): void {
        this.isLoading = false;
        this.gstReconcileService.getFilingStatusReferenceIdList({
            "from": this.from,
            "to": this.to,
            "page": 1,
            "count": this.pagination.count,
            "gstin": this.activeCompanyGstNumber,
            "gsp": GSP
        }).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
            if (res?.body?.results?.length) {
                this.dataSource = res.body?.results;
            } else {
                this.dataSource = [];
            }
            this.changeDetectionRef.detectChanges();
        })
    }

    /**
     * Handle Page Change Event
     *
     * @param {*} event
     * @memberof FilingStatusComponent
     */
    public pageChanged(event: any): void {
        if (event.page !== this.pagination.page) {
            this.pagination.page = event.page;

            this.gstReconcileService.getFilingStatusReferenceIdList({
                "from": this.from,
                "to": this.to,
                "page": this.pagination.page,
                "count": this.pagination.count,
                "gstin": this.activeCompanyGstNumber,
                "gsp": GSP
            }).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
                if (res?.body?.results?.length) {
                    this.dataSource = res.body?.results;
                } else {
                    this.dataSource = [];
                }
                this.changeDetectionRef.detectChanges();
            })
        }
    }

    /**
     * Get GST Filing Status form API
     *
     * @param {string} referenceId
     * @memberof FilingStatusComponent
     */
    public getGstFilingStatus(referenceId: string): void {
        this.isLoading = true;

        this.gstReconcileService.getFilingStatus({
            "referenceId": referenceId,
        }).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
            this.isLoading = false;
            this.changeDetectionRef.detectChanges();
            const toasterMsg = this.generateToasterMessage(res?.body);
            if (toasterMsg !== "INVAILD_CODE") {
                this.toasty.showSnackBar("success", toasterMsg);
            }
            var blob = new Blob([res?.body], { type: "application/json;charset=utf-8" });
            setTimeout(() => {
                saveAs(blob, `${referenceId}.json`);
            }, 2500)
        })
    }

    /**
     * Generate Toaster Message from json string and return status
     *
     * @private
     * @param {*} data
     * @return {*} 
     * @memberof FilingStatusComponent
     */
    private generateToasterMessage(data: any) {
        let json = JSON.parse(data);
        if (json.status_cd === "PE") {
            return this.localeData?.filing?.processed_with_error;
        } else if (json.status_cd === "P") {
            return this.localeData?.filing?.processed
        } else if (json.status_cd === "IP") {
            return this.localeData?.filing?.in_progress
        } else {
            return "INVAILD_CODE"
        }
    }

    /**
     * Lifecycle hook runs when component is destroyed
     *
     * @memberof FilingStatusComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        this.asideGstSidebarMenuState = 'out';
        document.querySelector('body').classList.remove('gst-sidebar-open');
    }

}
