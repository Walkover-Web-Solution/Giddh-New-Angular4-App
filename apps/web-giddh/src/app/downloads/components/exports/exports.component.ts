import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ChangeDetectionStrategy, TemplateRef, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DownloadsService } from '../../../services/downloads.service';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../../shared/helpers/defaultDateFormat';
import { takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject } from 'rxjs';
import * as dayjs from 'dayjs';
import * as isSameOrAfter from 'dayjs/plugin/isSameOrAfter' // load on demand
dayjs.extend(isSameOrAfter) // use plugin
import { MatMenuTrigger } from '@angular/material/menu';
import { GeneralService } from '../../../services/general.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { DownloadData, DownloadsRequest } from '../../../models/api-models/downloads';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGE_SIZE_OPTIONS, PAGINATION_LIMIT } from '../../../app.constant';
import { PageEvent } from '@angular/material/paginator';
import { ExportsJsonComponent } from '../exports-json/exports-json.component';
import { download } from '@giddh-workspaces/utils';
import { exportTypeEnum } from '../../../new-inventory/inventory.enum';
import { ServiceConfig } from '../../../services/service.config';
import { Configuration } from '../../../app.constant';
import { cloneDeep } from '../../../lodash-optimized';

/** Hold information of Download  */
const ELEMENT_DATA: DownloadData[] = [];

@Component({
    selector: 'exports',
    templateUrl: './exports.component.html',
    styleUrls: ['./exports.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})

export class ExportsComponent implements OnInit, OnDestroy {
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
    /** Angular Material menu trigger for datepicker */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
/** This will store universalDate */
    public universalDate: any;
    /** To show clear filter */
    public showClearFilter: boolean = false;
    /** This will use for table heading */
    public displayedColumns: string[] = ['requestedDate', 'user', 'services', 'filter', 'download', 'expiry'];
    /** Hold the data of downloads */
    public dataSource = ELEMENT_DATA;
    /** Holds available page size options */
    public pageSizeOptions: number[] = PAGE_SIZE_OPTIONS;
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
    /** Instance of is electron variable */
    public isElectron: any = Configuration.isElectron;
    /** Instance for export data in inventory */
    public exportType: any = [
        exportTypeEnum.ItemWise,
        exportTypeEnum.VariantWise,
        exportTypeEnum.GroupWise,
        exportTypeEnum.TransactionWise
    ];

    constructor(@Inject(ServiceConfig) private serviceConfig,  public dialog: MatDialog, private downloadsService: DownloadsService, private changeDetection: ChangeDetectorRef, private generalService: GeneralService, private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     *
     * @memberof ExportsComponent
     */
    public ngOnInit(): void {
        this.imgPath = this.serviceConfig.IMG_PATH;
        document.querySelector('body')?.classList?.add('download-page');
        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.downloadRequest.from = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.downloadRequest.to = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                this.getDownloads();
            }
        });
    }

    /**
     *Opens the Sidebar popup
     *
     * @param {*} row
     * @memberof ExportsComponent
     */
    public openDialog(row: any): void {
        let dataReq;
        if (this.exportType.includes(row?.type)) {
            dataReq = row?.inventoryReportsExportFilter;
        } else {
            dataReq = row?.filters;
        }

        this.dialog.open(ExportsJsonComponent, {
            data: dataReq,
            panelClass: 'download-json-panel',
            role: 'alertdialog',
            ariaLabel: 'Export Json Dialog'
        });
    }

    /**
     *This function will be called when get the Downloads
     *
     * @param {boolean} [resetPage]
     * @memberof ExportsComponent
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
                    result.date = dayjs(result.date, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                    result.expireAt = dayjs(result.expireAt, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                });
                this.dataSource = response.body?.items;
                this.downloadRequest.totalItems = response.body?.totalItems;
                this.downloadRequest.totalPages = response.body?.totalPages;
                this.downloadRequest.count = response.body?.count;
            } else {
                this.dataSource = [];
                this.downloadRequest.totalItems = 0;
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
     * Handles pagination events and updates API parameters
     *
     * @param {PageEvent} event - Contains pagination details
     * @memberof ExportsComponent
     */
    public handlePageEvent(event: PageEvent): void {
        this.downloadRequest.page = this.downloadRequest.count !== event.pageSize? 1 : event.pageIndex + 1;
        this.downloadRequest.count = event.pageSize;
        this.getDownloads();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} [value]
     * @param {*} [from]
     * @return {*}  {void}
     * @memberof ExportsComponent
     */
    public dateSelectedCallback(value?: any, from?: any): void {
        if (value && value.event === "cancel") {
            this.toggleGiddhDatepicker(false);
            return;
        }
        this.selectedRangeLabel = "";

        if (value && value.name) {
            this.selectedRangeLabel = value.name;
        }
        this.toggleGiddhDatepicker(false);
        if (value && value.startDate && value.endDate) {
            this.showClearFilter = true;
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.downloadRequest.from = this.fromDate;
            this.downloadRequest.to = this.toDate;
            this.getDownloads(true);
        }
    }

    /**
    * This will hide the datepicker
    *
    * @memberof ExportsComponent
    */

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof ExportsComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * To reset applied filter
     *
     * @memberof ExportsComponent
     */
    public resetFilter(): void {
        this.showClearFilter = false;
        //Reset Date with universal date
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.downloadRequest.from = dayjs(dateObj[0]).format(GIDDH_DATE_FORMAT);
                this.downloadRequest.to = dayjs(dateObj[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(universalDate[0]), endDate: dayjs(universalDate[1]) };
                this.selectedDateRangeUi = dayjs(universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
            }
        });
        this.getDownloads(true);
        this.changeDetection.detectChanges();
    }

    /**
     * Releases the memory
     *
     * @memberof ExportsComponent
    */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
        document.querySelector('body')?.classList?.remove('download-page');
    }

    /**
     * Download export file
     *
     * @param {*} url
     * @memberof ExportsComponent
     */
    public downloadFile(url: any): void {
        if (url) {
            let fileName = url.substring(url.lastIndexOf('/') + 1);
            return download(fileName, url, "");
        }
    }
}
