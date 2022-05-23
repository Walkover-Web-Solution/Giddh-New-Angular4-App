
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ActivityLogsService } from '../services/activity-logs.service';
import { PAGINATION_LIMIT } from '../app.constant';
import { takeUntil } from 'rxjs/operators';
import { ActivityLogsJsonComponent } from './components/activity-logs-json/activity-logs-json.component';
import * as moment from 'moment';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { GeneralService } from '../services/general.service';
import { Router } from '@angular/router';
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
    styleUrls: [`./activity-logs.component.scss`]
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
    /** Hold acitivity logs data  */
    public activityLogs: any = {
        totalPages: 0,
    };
    /** This will use for activity logs object */
    public activityObj = {
        count: PAGINATION_LIMIT,
        page: 1,
    }

    constructor(public activityService: ActivityLogsService,
         public dialog: MatDialog,
          private generalService: GeneralService,
        private router: Router) { }

    /**
     * This function will use for on initialization
     *
     * @memberof ActivityLogsComponent
     */
    public ngOnInit(): void {
        if (this.generalService.voucherApiVersion === 1) {
            this.router.navigate(['/pages/home']);
        }
        this.getActivityLogs();
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
    public getActivityLogs(): void {
        this.isLoading = true;
        this.activityService.GetActivityLogs(this.activityObj).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.isLoading = false;
            if (response && response.status === 'success') {
                response.body?.results?.forEach(result => {
                    result.timeonly = moment(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format("HH:mm:ss");
                    result.time = moment(result.time, GIDDH_DATE_FORMAT + " HH:mm:ss").format(GIDDH_DATE_FORMAT);
                });
                this.dataSource = response.body.results;
                this.activityLogs.totalPages = response.body.totalPages;
            } else {
                this.dataSource = [];
                this.activityLogs.totalPages = 0;
            }
        });
    }

    /**
     * This function will use for open dialog 
     *
     * @param {*} element
     * @memberof ActivityLogsComponent
     */
    public openDialog(element: any): void {
        this.dialog.open(ActivityLogsJsonComponent, {
            data: element?.details,
            panelClass: 'logs-sidebar'
        });
    }

    /**
     *This function will use for component destroy
     *
     * @memberof ActivityLogsComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
