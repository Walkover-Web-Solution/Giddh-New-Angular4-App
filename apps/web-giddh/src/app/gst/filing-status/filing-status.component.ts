import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { ReplaySubject, takeUntil } from "rxjs";
import { Router } from "@angular/router";
import { ToasterService } from "../../services/toaster.service";
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from "../../app.constant";
import { GIDDH_DATE_FORMAT, GIDDH_DATE_FORMAT_MM_DD_YYYY, GIDDH_NEW_DATE_FORMAT_UI } from "../../shared/helpers/defaultDateFormat";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { GeneralService } from "../../services/general.service";
import * as dayjs from "dayjs";
import { saveAs } from 'file-saver';
import { GstReconcileService } from "../../services/gst-reconcile.service";
import { Store, select } from "@ngrx/store";
import { AppState } from "../../store";

export interface PeriodicElement {
    referenceId: string;
    status: string
}

const ELEMENT_DATA: PeriodicElement[] = [
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Hydrogen' },
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Helium' },
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Lithium' },
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Beryllium' },
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Boron' },
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Carbon' },
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Nitrogen' },
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Oxygen' },
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Fluorine' },
    { referenceId: "dsssddd-5454451-1h-ff5-df15-g5", status: 'Neon' },
];

@Component({
    selector: 'filing-status',
    templateUrl: './filing-status.component.html',
    styleUrls: ['./filing-status.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FilingStatusComponent implements OnInit, OnDestroy {
    // /** Directive to get reference of element */
    // @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;

    /** This will hold the value out/in to open/close setting sidebar popup */
    public asideGstSidebarMenuState: string = 'in';
    /** This will use for destroy */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    // /* This will store selected date range to use in api */
    // public selectedDateRange: any;
    // /* This will store selected date range to show on UI */
    // public selectedDateRangeUi: any;
    // /* This will store available date ranges */
    // public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    // /* Selected range label */
    // public selectedRangeLabel: any = "";
    // /** Date format type */
    // public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    // /* This will store the x/y position of the field to show datepicker under it */
    // public dateFieldPosition: any = { x: 0, y: 0 };
    // /** Modal reference */
    // public modalRef: BsModalRef;
    /** Holds Date range from  */
    public from: string = '01-06-2023';
    /** Holds Date range to  */
    public to: string = '30-06-2023';
    /** True if api call in progress */
    public isLoading: boolean = false;
    /**Holds Page count in single page for Pagination */
    private pageCount = PAGINATION_LIMIT;
    /** Holds Pagination Data */
    private pagination: any = {
        "page": 1,
        "count": this.pageCount,
        "totalPages": 1,
        "totalItems": 1,
    }
    /** Holds Active GSTIN Number */
    public activeCompanyGstNumber: string = '';
    public displayedColumns: string[] = ['referenceId', 'status'];
    public dataSource = ELEMENT_DATA;

    constructor(private generalService: GeneralService, private store: Store<AppState>, private gstAction: GstReconcileService, private toasty: ToasterService, private router: Router, private changeDetection: ChangeDetectorRef, private modalService: BsModalService) {
      
        this.store.pipe(select(appState => appState.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(response => {
            console.log("activeCompanyGstNumber response", response.toString(), typeof (response));
            if (response && this.activeCompanyGstNumber !== response) {
                this.activeCompanyGstNumber = response;
                console.log("activeCompanyGstNumber", this.activeCompanyGstNumber);

            }
        });
    }

    /**
     * Lifecycle hook runs when component is initialized
     *
     * @memberof FilingStatusComponent
     */
    public ngOnInit(): void {       
        document.querySelector('body').classList.add('gst-sidebar-open');
        // this.setDataPickerDateRange();
        console.log("GSTIN - ", this.activeCompanyGstNumber);
        if (this.activeCompanyGstNumber !== '') {
            this.gstAction.getFilingStatusReferenceIdList({
                "from": this.from,
                "to": this.to,
                "page": this.pagination.page,
                "count": this.pagination.count,
                "gstin": this.activeCompanyGstNumber,
                "gsp": 'TAXPRO'
            }).pipe(takeUntil(this.destroyed$)).subscribe((res: any) => {
                console.log("RESPONSE: ", res);
            })
        }
    }

    /**
    * Handles GST Sidebar Navigation
    *
    * @memberof FilingStatusComponent
    */
    public handleNavigation(): void {
        this.router.navigate(['pages', 'gstfiling']);
    }

    // /**
    // *To show the datepicker
    // *
    // * @param {*} element
    // * @memberof FilingStatusComponent
    // */
    // public showGiddhDatepicker(element: any): void {
    //     if (element) {
    //         this.dateFieldPosition = this.generalService.getPosition(element.target);
    //     }
    //     this.modalRef = this.modalService.show(
    //         this.datepickerTemplate,
    //         Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
    //     );
    // }

    // /**
    //  * This will hide the datepicker
    //  *
    //  * @memberof FilingStatusComponent
    //  */
    // public hideGiddhDatepicker(): void {
    //     this.modalRef.hide();
    // }

    // /**
    //  * Call back function for date/range selection in datepicker
    //  *
    //  * @param {*} value
    //  * @memberof FilingStatusComponent
    //  */
    // public dateSelectedCallback(value?: any): void {
    //     if (value && value.event === "cancel") {
    //         this.hideGiddhDatepicker();
    //         return;
    //     }
    //     this.selectedRangeLabel = "";

    //     if (value && value.name) {
    //         this.selectedRangeLabel = value.name;
    //     }
    //     this.hideGiddhDatepicker();
    //     if (value && value.startDate && value.endDate) {
    //         this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
    //         this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
    //         this.from = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
    //         this.to = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
    //         console.log("value", value);
    //     }
    // }

    // /**
    //  * Set the initial date range from query params
    //  *
    //  * @private
    //  * @memberof SalesRegisterExpandComponent
    //  */
    // private setDataPickerDateRange(): void {
    //     let dateRange = { fromDate: '', toDate: '' };
    //     dateRange = this.generalService.dateConversionToSetComponentDatePicker(this.from, this.to);
    //     this.selectedDateRange = { startDate: dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY), endDate: dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY) };
    //     this.selectedDateRangeUi = dayjs(dateRange.fromDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateRange.toDate, GIDDH_DATE_FORMAT_MM_DD_YYYY).format(GIDDH_NEW_DATE_FORMAT_UI);
    // }

    /**
     *  Reset Date filter
     *
     * @memberof FilingStatusComponent
     */
    public resetAdvanceSearch(): void {

    }

    /**
     * Get GST Filing Status form API
     *
     * @param {string} referenceId
     * @memberof FilingStatusComponent
     */
    public getGstFilingStatus(referenceId: string): void {
        console.log("referenceId", referenceId);
        this.toasty.showSnackBar("success", "Response Success for Reference ID - " + referenceId);
        var blob = new Blob([referenceId], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `${referenceId}.txt`);
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
