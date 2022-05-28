import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivityLogsService } from '../services/activity-logs.service';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../app.constant';
import { takeUntil } from 'rxjs/operators';
import { ActivityLogsJsonComponent } from './components/activity-logs-json/activity-logs-json.component';
import * as moment from 'moment';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { GeneralService } from '../services/general.service';
import { Router } from '@angular/router';
import { IOption } from '../theme/ng-virtual-select/sh-options.interface';
import { LogsService } from '../services/logs.service';
import { CompanyService } from '../services/companyService.service';
import { select, Store } from '@ngrx/store';
import { AppState } from '../store';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivityCompareJsonComponent } from './components/activity-compare-json/activity-compare-json.component';
import { ActivityHistoryLogsJsonComponent } from './components/activity-history-logs-json/activity-history-logs-json.component';
import { ToasterService } from '../services/toaster.service';
/** This will use for interface */
export interface GetActivityLogs {
    name: any;
    time: any;
    ip: any;
    entity: any;
    operation: any;
}
/** Hold information of activity logs */
const ELEMENT_DATA: GetActivityLogs[] = [];
@Component({
    selector: 'activity-logs',
    templateUrl: './activity-logs.component.html',
    styleUrls: [`./activity-logs.component.scss`],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityLogsComponent implements OnInit, OnDestroy {
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will use for table heading */
    public displayedColumns: string[] = ['name', 'time', 'ip', 'entity', 'operation'];
    /** Hold the data of activity logs */
    public dataSource = ELEMENT_DATA;
    /** This will use for activity logs object */
    public activityObj = {
        count: PAGINATION_LIMIT,
        page: 1,
        totalItems: 0,
        entity: "",
        operation: "",
        userUniqueNames: [],
        fromDate: "",
        toDate: "",
        entityId: "",
        isChecked: false,
    }
    /** Activity log form's company entity type list */
    public entities: IOption[] = [];
    /** Activity log form's company operations list */
    public filters: any[] = [];
    /** Activity log form's company operations list */
    public users: IOption[] = [];
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
    public showDateReport: boolean = false;
    /** Holds label of selected values */
    public activityObjLabels: any = {
        entity: "",
        operation: "",
        user: ""
    };

    constructor(
        public activityService: ActivityLogsService,
        public dialog: MatDialog,
        private generalService: GeneralService,
        private router: Router,
        private changeDetection: ChangeDetectorRef,
        private ActivityLogsService: LogsService,
        private companyService: CompanyService,
        private modalService: BsModalService,
        private toaster: ToasterService,
        private store: Store<AppState>) {
        this.universalDate$ = this.store.pipe(select(state => state.session.applicationDate), takeUntil(this.destroyed$));
    }

    /**
     * This function will use for on initialization
     *
     * @memberof ActivityLogsComponent
     */
    public ngOnInit(): void {
        if (this.generalService.voucherApiVersion === 1) {
            this.router.navigate(['/pages/home']);
        }
        this.getFormFilter();
        this.companyService.getComapnyUsers().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let users: IOption[] = [];
                data.body.map((item) => {
                    users.push({ label: item.userName, value: item.userUniqueName, additional: item });
                });
                this.users = users;
            } else {
            }
        });
        /** Universal date observer */
        this.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                this.universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.activityObj.fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.activityObj.toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });
    }

    /**
     * This function will use for get log details 
     *
     * @param {*} element
     * @memberof ActivityLogsComponent
     */
    public getLogsDetails(event: any, element: any): void {
        event.stopPropagation();
        event.preventDefault();
        this.dialog.open(ActivityLogsJsonComponent, {
            data: element?.details,
            panelClass: 'logs-sidebar'
        });
    }


    /**
    * This function will change the page of activity logs
    *
    * @param {*} event
    * @memberof ActivityLogsComponent
    */
    public pageChanged(event: any): void {
        if (this.activityObj.page !== event.page) {
            this.activityObj.page = event.page;
            this.getActivityLogs();
        }
    }

    /**
     * This function will be called when get the activity log
     *
     * @memberof ActivityLogsComponent
     */
    public getActivityLogs(resetPage?: boolean): void {
        if (resetPage) {
            this.activityObj.page = 1;
        }
        this.isLoading = true;
        this.activityService.getActivityLogs(this.activityObj).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.isLoading = false;
            if (response && response.status === 'success') {
                response.body?.results?.forEach((result, index) => {
                    if (result) {
                        result.index = index;
                        result.timeonly = moment(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format("HH:mm:ss");
                        result.time = moment(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                    }
                });
                this.dataSource = response.body.results;
                this.activityObj.totalItems = response.body.totalItems;
            } else {
                this.dataSource = [];
                this.activityObj.totalItems = 0;
            }
            this.changeDetection.detectChanges();
        });
    }

    /**
     * To select entity type
     *
     * @param {IOption} event Selected item object
     * @memberof ActivityLogsComponent
     */
    public selecteUserType(event: IOption): void {
        if (event && event.value) {
            this.activityObj.userUniqueNames = [];
            this.activityObj.userUniqueNames.push(event.value);
        }
    }

    /**
     * To get activity log form filter
     *
     * @memberof ActivityLogsComponent
     */
    public getFormFilter(): void {
        this.ActivityLogsService.getAuditLogFormFilters().pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response.status === 'success') {
                this.entities = [];
                this.filters = [];
                this.filters[''] = [
                    { label: this.commonLocaleData?.app_create, value: "CREATE" },
                    { label: this.commonLocaleData?.app_update, value: "UPDATE" },
                    { label: this.commonLocaleData?.app_delete, value: "DELETE" }
                ];
                response.body.forEach(res => {
                    this.entities.push(res.entity);
                    this.filters[res.entity?.value] = [];
                    this.filters[res.entity?.value] = res.operations;
                });
            }
        });
        this.changeDetection.detectChanges();
    }

    /**
     * To reset applied filter
     *
     * @memberof ActivityLogsComponent
     */
    public resetFilter(): void {
        this.activityObj.entity = '';
        this.activityObj.operation = '';
        this.activityObj.userUniqueNames = [];
        this.showDateReport = false;
        this.activityObjLabels = {
            entity: "",
            operation: "",
            user: ""
        };
        this.selectedDateRange = { startDate: moment(this.universalDate[0]), endDate: moment(this.universalDate[1]) };
        this.selectedDateRangeUi = moment(this.universalDate[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(this.universalDate[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
        this.activityObj.fromDate = moment(this.universalDate[0]).format(GIDDH_DATE_FORMAT);
        this.activityObj.toDate = moment(this.universalDate[1]).format(GIDDH_DATE_FORMAT);
        this.getActivityLogs(true);
        this.changeDetection.detectChanges();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ActivityLogsComponent
     */
    public dateSelectedCallback(value?: any): void {
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
            this.showDateReport = true;
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.activityObj.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.activityObj.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    /**
    * This will hide the datepicker
    *
    * @memberof ActivityLogsComponent
    */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     *To show the datepicker
     *
     * @param {*} element
     * @memberof ActivityLogsComponent
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
     * To check is entry expanded
     *
     * @param {*} entry Transaction object
     * @memberof ActivityLogsComponent
     */
    public getHistory(event: any, row: any): void {
        event.stopPropagation();
        event.preventDefault();

        if (!row.hasHistory) {
            let activityObj = { entityId: row.entityId, entity: row.entity, count: 200 };
            row.hasHistory = true;
            this.activityService.getActivityLogs(activityObj).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.isLoading = false;
                if (response && response.status === 'success') {
                    if (response.body?.results.length > 1) {
                        response.body?.results?.forEach((result, index) => {
                            if (result) {
                                result.index = index;
                                result.timeonly = moment(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format("HH:mm:ss");
                                result.time = moment(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                            }
                        });
                        row.history = response.body.results;
                        row.isExpanded = !row.isExpanded;
                    } else {
                        this.toaster.showSnackBar('info', this.localeData?.no_history)
                        row.history = [];
                        row.isExpanded = false;
                    }
                } else {
                    row.history = [];
                }
                this.changeDetection.detectChanges();
            });
        } else if (row.history?.length) {
            row.isExpanded = !row.isExpanded;
        }
    }

    /**
     * This function will use for selected items
     *
     * @param {MatCheckboxChange} event
     * @param {*} rowHistory
     * @param {*} details
     * @memberof ActivityLogsComponent
     */
    public selectedItems(event: MatCheckboxChange, rowHistory: any, details: any): void {
        if (!rowHistory.selectedItems) {
            rowHistory.selectedItems = [];
        }
        if (event.checked) {
            details.isChecked = true;
            rowHistory.selectedItems.push(details);
            if (rowHistory.selectedItems.length > 2) {
                const firstElement = rowHistory.selectedItems[0];
                rowHistory.selectedItems = rowHistory.selectedItems.slice(1);
                firstElement.isChecked = false;
            }
        } else {
            rowHistory.selectedItems.pop(details);
            details.isChecked = false;
        }
        this.changeDetection.detectChanges();
    }

    /**
     *This function will use for compare json key values
     *
     * @param {*} rowHistory
     * @param {*} details
     * @param {*} event
     * @memberof ActivityLogsComponent
     */
    public compareHistoryJson(rowHistory: any, details: any, event: any): void {
        event.stopPropagation();
        event.preventDefault();
        let data;
        if (rowHistory.selectedItems[0]?.index === details.index) {
            data = [rowHistory.selectedItems[0]?.details, rowHistory.selectedItems[1]?.details];
        } else {
            data = [rowHistory.selectedItems[1]?.details, rowHistory.selectedItems[0]?.details];
        }
        this.dialog.open(ActivityCompareJsonComponent, {
            data: data,
            panelClass: 'json-sidebar'
        });
    }

    /**
     *This function will use for component destroy
     *
     * @memberof ActivityLogsComponent
     */
    public ngOnDestroy(): void {
        this.resetFilter();
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
