import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DownloadsService } from '../../../services/downloads.service';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { DownloadsJsonComponent } from '../downloads-json/downloads-json.component';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GeneralService } from '../../../services/general.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { DownloadData, DownloadsRequest } from '../../../models/api-models/downloads';
import { cloneDeep } from '../../../lodash-optimized';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../../../app.constant';

/** Hold information of Download  */
const ELEMENT_DATA: DownloadData[] = [];
@Component({
    selector: 'downloads',
    templateUrl: './downloads.component.html',
    styleUrls: ['./downloads.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DownloadsComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /* it will store image path */
    public imgPath: string = '';
    /** True if api call in progress */
    public isLoading: boolean = true;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Selected from date */
    public selectedFromDate: Date;
    /** Selected to date */
    public selectedToDate: Date;
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /** Universal date observer */
    public universalDate$: Observable<any>;
    /** This will store selected date range to use in api */
    public selectedDateRange: any;
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store modal reference */
    public modalRef: BsModalRef;
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store universalDate */
    public universalDate: any;
    /** To show clear filter */
    public showClearFilter: boolean = false;
    /** This will use for table heading */
    public displayedColumns: string[] = ['requestedDate', 'user', 'services', 'filter', 'download', 'expiry'];
    /** Hold the data of downloads */
    public dataSource = ELEMENT_DATA;
    /** This will use for download object */
    public downloadRequest: DownloadsRequest = {
        count: PAGINATION_LIMIT,
        page: 1,
        totalItems: 0,
        from: "",
        to: "",
    };
    /** This will use for to date static*/
    public toDate: string;
    /** This will use for from date static*/
    public fromDate: string;

    constructor(public dialog: MatDialog, private downloadsService: DownloadsService, private changeDetection: ChangeDetectorRef, private generalService: GeneralService, private modalService: BsModalService, private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof DownloadsComponent
     */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';
        document.querySelector('body')?.classList?.add('download-page');
        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.downloadRequest.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.downloadRequest.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
    }

    /**
     *Opens the Sidebar popup
     *
     * @param {*} row
     * @memberof DownloadsComponent
     */
    public openDialog(row: any): void {
        const dialogRef = this.dialog.open(DownloadsJsonComponent, {
            data: row?.filters,
            panelClass: 'download-json-panel'
        });
    }

    /**
     *This function will be called when get the Downloads
     *
     * @param {boolean} [resetPage]
     * @memberof DownloadsComponent
     */
    public getDownloads(resetPage?: boolean): void {
        if (resetPage) {
            this.downloadRequest.page = 1;
        }
        this.isLoading = true;
        this.downloadsService.getDownloads(this.downloadRequest).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.isLoading = false;
            if (response && response.status === 'success') {
                response.body?.items?.forEach((result: any) => {
                    result.date = moment(result.date, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                    let today = moment().format(GIDDH_DATE_FORMAT);
                    if (result.expireAt >= today) {
                        result.expireAt = moment(result.expireAt, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                    } else {
                        result.expireAt = this.localeData?.expired;
                    }
                });
                this.dataSource = response.body.items;
                this.downloadRequest.totalItems = response.body.totalItems;
                this.downloadRequest.totalPages = response.body.totalPages;
                this.downloadRequest.count = response.body.count;
            } else {
                this.dataSource = [];
                this.downloadRequest.totalItems = 0;
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
    * This function will change the page of activity logs
    *
    * @param {*} event
    * @memberof DownloadsComponent
    */
    public pageChanged(event: any): void {
        if (this.downloadRequest.page !== event.page) {
            this.downloadRequest.page = event.page;
            this.getDownloads();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} [value]
     * @param {*} [from]
     * @return {*}  {void}
     * @memberof DownloadsComponent
     */
    public dateSelectedCallback(value?: any, from?: any): void {
        if (value && value.event === "cancel") {
            this.hideGiddhDatepicker();
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.hideGiddhDatepicker();
        if (value && value.startDate && value.endDate) {
            this.showClearFilter = true;
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
            this.downloadRequest.from = this.fromDate;
            this.downloadRequest.to = this.toDate;
            this.getDownloads(true);
        }
    }

    /**
    * This will hide the datepicker
    *
    * @memberof DownloadsComponent
    */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof DownloadsComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this.generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
     * To reset applied filter
     *
     * @memberof DownloadsComponent
     */
    public resetFilter(): void {
        this.showClearFilter = false;
        //Reset Date with universal date
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.downloadRequest.from = moment(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.downloadRequest.to = moment(dateObj[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: moment(universalDate[0]), endDate: moment(universalDate[1]) };
                this.selectedDateRangeUi = moment(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
        this.getDownloads(true);
        this.changeDetection.detectChanges();
    }

    /**
     * Releases the memory
     *
     * @memberof DownloadsComponent
    */
    public ngOnDestroy(): void {
        this.resetFilter();
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body')?.classList?.remove('download-page');
    }

    /**
   * Callback for translation response complete
   *
   * @param {boolean} event
   * @memberof CustomFieldsListComponent
   */
    public translationComplete(event: boolean): void {
        if (event) {
            this.getDownloads(true);
        }
    }
}
