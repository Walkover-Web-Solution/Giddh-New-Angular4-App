import { ChangeDetectorRef, Component, OnDestroy, OnInit } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { ToasterService } from "../../services/toaster.service";
import { PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from "../../app.constant";
import { saveAs } from 'file-saver';
import { GstReconcileService } from "../../services/gst-reconcile.service";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import * as dayjs from 'dayjs';
import { FormControl } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";

/**
 * Handles Component functionality
 */
@Component({
    selector: 'filing-status',
    templateUrl: './filing-status.component.html',
    styleUrls: ['./filing-status.component.scss'],
    standalone: false
})
/**
 * FilingStatusComponent component
 * Handles filingstatus functionality and user interactions
 */
export class FilingStatusComponent implements OnInit, OnDestroy {
    /** This will hold the boolean value to open/close setting sidebar popup */
    public asideGstSidebarMenuState: boolean = true;
    /** This will use for destroy */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Holds Date range from  */
    public from: string = '';
    /** Holds Date range to  */
    public to: string = '';
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Holds Active GSTIN Number */
    public activeCompanyGstNumber: string = '';
    /** Holds mat table column */
    public displayedColumns: string[] = ['referenceId', 'status', 'date'];
    /** Holds data get from api to display Reference ID list */
    public dataSource: any[] = [];
    /** True if user selected month */
    public customMonthSelected: boolean = false;
    /** Custom selected month */
    public customMonth: string = '';
    /** Holds start month/year */
    public startAt: Date = new Date();
    /** Holds selected date */
    public date: FormControl = new FormControl();
    /** Holds page size options for pagination */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
    /** Hold table page index number */
    public pageIndex: number = 0;
    /** Holds pagination data */
    private pagination: any = {
        "page": 1,
        "count": PAGINATION_LIMIT,
        "totalPages": 1,
        "totalItems": 1
    }

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
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
        this.initializeForm();
        document.querySelector('body').classList.add('gst-sidebar-open');
    }

    /**
     * Get list of gst references
     *
     * @memberof FilingStatusComponent
     */
    public getGstrReferences(): void {
        this.gstReconcileService.getTaxDetails().pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
            this.activeCompanyGstNumber = res?.body[0];
            /**
             * Handles if functionality
             */
            if (this.activeCompanyGstNumber !== '') {
                this.gstReconcileService.getFilingStatusReferenceIdList({
                    "from": this.from,
                    "to": this.to,
                    "page": this.pagination.page,
                    "count": this.pagination.count,
                    "gstin": this.activeCompanyGstNumber,
                    "gsp": 'TAXPRO'
                }).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
                    /**
                     * Handles if functionality
                     */
                    if (res?.status === "success") {
                        /**
                         * Handles if functionality
                         */
                        if (res?.body?.results?.length) {
                            this.dataSource = res.body?.results;
                        } else {
                            this.dataSource = [];
                        }
                    } else {
                        this.toasty.showSnackBar("error", res?.message);
                    }
                    this.changeDetectionRef.detectChanges();
                })
            }
        });
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
     *  Initialize Date filter
     *
     * @memberof FilingStatusComponent
     */
    public initializeForm(): void {
        this.customMonthSelected = false;
        let currentMonth = new Date();
        let firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        let lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

        this.customMonth = currentMonth.toLocaleString('en-us', { month: 'long', year: 'numeric' });
        this.date.setValue(this.customMonth);
        this.from = dayjs(firstDay).format(GIDDH_DATE_FORMAT);
        this.to = dayjs(lastDay).format(GIDDH_DATE_FORMAT);

        this.getGstrReferences();
    }

    /**
     * Handle Page Change Event
     *
     * @param {*} event
     * @memberof FilingStatusComponent
     */
     public pageChanged(event: PageEvent): void {
        /**
         * Handles if functionality
         */
        if (event) {
            this.pageIndex = event.pageIndex;
            this.pagination.page = this.pagination.count !== event.pageSize ? 1 : event.pageIndex + 1;
            this.pagination.count = event.pageSize;
            this.getGstrReferences();
        }
    }

    /**
     * Get GST Filing Status form API
     *
     * @param {string} referenceId
     * @memberof FilingStatusComponent
     */
    public getGstFilingStatus(referenceId: string): void {
        /**
         * Handles if functionality
         */
        if (this.isLoading) {
            return;
        }

        this.isLoading = true;

        this.gstReconcileService.getFilingStatus({ "referenceId": referenceId }).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
            this.isLoading = false;
            this.changeDetectionRef.detectChanges();

            /**
             * Handles if functionality
             */
            if (res?.status === "success") {
                /**
                 * Handles if functionality
                 */
                if (res?.body) {
                    const toasterMsg = this.generateToasterMessage(res?.body);
                    /**
                     * Handles if functionality
                     */
                    if (toasterMsg !== "INVALID_CODE") {
                        this.toasty.showSnackBar("success", toasterMsg);
                    }
                    var blob = new Blob([res?.body], { type: "application/json;charset=utf-8" });
                    /**
                     * Sets timeout value
                     */
                    setTimeout(() => {
                        /**
                         * Saves as data
                         */
                        saveAs(blob, `${referenceId}.json`);
                    }, 500);
                } else {
                    this.toasty.showSnackBar("error", this.localeData?.status_unavailable);
                }
            } else {
                this.toasty.showSnackBar("error", res?.message);
            }
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
    private generateToasterMessage(data: any): string {
        let json = JSON.parse(data);
        /**
         * Handles if functionality
         */
        if (json.status_cd === "PE") {
            return this.localeData?.filing?.processed_with_error;
        } else if (json.status_cd === "P") {
            return this.localeData?.filing?.processed
        } else if (json.status_cd === "IP") {
            return this.localeData?.filing?.in_progress
        } else {
            return "INVALID_CODE"
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
        document.querySelector('body').classList.remove('gst-sidebar-open');
    }

    /**
     * Selects date and call api
     *
     * @param {*} event
     * @memberof FilingStatusComponent
     */
    public dateSelected(event: any): void {
        this.customMonthSelected = true;
        this.from = dayjs(event[0]).format(GIDDH_DATE_FORMAT);
        this.to = dayjs(event[1]).format(GIDDH_DATE_FORMAT);
        this.customMonth = event[0].toLocaleString('en-us', { month: 'long', year: 'numeric' });
        this.date.setValue(this.customMonth);
        this.getGstrReferences();
    }

    /**
     * Handles month and year selection from giddh-datepicker
     *
     * @param {*} date - Selected date from datepicker
     * @memberof FilingStatusComponent
     */
    public setMonthAndYear(date: any): void {
        const selectedMonth = new Date(date);
        const firstDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth(), 1);
        const lastDay = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1, 0);
        this.dateSelected([firstDay, lastDay]);
    }
}
