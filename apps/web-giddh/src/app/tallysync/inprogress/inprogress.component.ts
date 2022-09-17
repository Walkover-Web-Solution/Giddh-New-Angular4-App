import { Component, OnDestroy, OnInit } from "@angular/core";
import { ToasterService } from "../../services/toaster.service";
import { TallySyncService } from "../../services/tally-sync.service";
import { TallySyncData, DownloadTallyErrorLogRequest } from "../../models/api-models/tally-sync";
import { saveAs } from "file-saver";
import { GeneralService } from '../../services/general.service';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { PAGINATION_LIMIT } from '../../app.constant';
import { takeUntil } from "rxjs/operators";
import { ReplaySubject } from "rxjs";
@Component({
    selector: "app-inprogress-preview",
    templateUrl: "./inprogress.component.html",
    styleUrls: ["./inprogress.component.scss"]
})
export class InprogressComponent implements OnInit, OnDestroy {
    public imgPath: string = "";
    public progressData: TallySyncData[];
    public progressDataResponse: any;
    public isPageLoaded = false;
    public MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];
    public downloadTallyErrorLogRequest: DownloadTallyErrorLogRequest = {
        date: '',
        hour: null,
        type: ''
    };
    public paginationRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Subject to release subscription memory */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if api call in progress */
    public isLoading: boolean = false;

    constructor(
        private toaster: ToasterService,
        private tallysyncService: TallySyncService,
        private generalService: GeneralService
    ) { }

    public ngOnInit() {
        this.isPageLoaded = true;

        this.paginationRequest.page = 1;
        this.paginationRequest.count = PAGINATION_LIMIT;

        this.getCurrentData();
        setInterval(() => {
            if (this.isPageLoaded) {
                this.getCurrentData();
            }
        }, 30000);
        this.imgPath = isElectron ? "assets/images/" : AppUrl + APP_FOLDER + "assets/images/";
    }

    public ngOnDestroy() {
        this.isPageLoaded = false;
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getCurrentData() {
        this.isLoading = true;
        this.tallysyncService.getInProgressSync(this.paginationRequest).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res && res.results && res.results.length > 0) {
                this.progressDataResponse = res;
                this.progressData = res.results;
                this.progressData.forEach(element => {
                    if (element.updatedAt) {
                        let preparedDateString = this.prepareDate(element.updatedAt)[0];
                        element['dateString'] = this.prepareCovertedDate(preparedDateString);
                    }
                    if (element.createdAt) {
                        element['hour'] = this.getHours(element.createdAt);
                        element['dateDDMMYY'] = this.prepareDate(element.createdAt)[1];
                    }
                    //completed
                    let tallyGroups =
                        (element.totalSavedGroups * 100) /
                        element.totalTallyGroups;
                    let tallyAccounts =
                        (element.totalSavedAccounts * 100) /
                        element.totalTallyAccounts;
                    let tallyEntries =
                        (element.totalSavedEntries * 100) /
                        element.totalTallyEntries;
                    let tallyVouchers =
                        (element.totalSavedVouchers * 100) /
                        element.totalTallyVouchers;

                    element["groupsPercent"] =
                        (isNaN(tallyGroups) ? 0 : tallyGroups).toFixed(2) + "%";
                    element["accountsPercent"] =
                        (isNaN(tallyAccounts) ? 0 : tallyAccounts).toFixed(2) +
                        "%";
                    element["entriesPercent"] =
                        (isNaN(tallyEntries) ? 0 : tallyEntries).toFixed(2) +
                        "%";
                    element["vouchersPercent"] =
                        (isNaN(tallyVouchers) ? 0 : tallyVouchers).toFixed(2) +
                        "%";    

                    //error
                    let tallyErrorGroups =
                        (element.tallyErrorGroups * 100) /
                        element.totalTallyGroups;
                    let tallyErrorAccounts =
                        (element.tallyErrorAccounts * 100) /
                        element.totalTallyAccounts;
                    let tallyErrorEntries =
                        (element.tallyErrorEntries * 100) /
                        element.totalTallyEntries;
                    let tallyErrorVouchers =
                        (element.tallyErrorVouchers * 100) /
                        element.totalTallyVouchers;

                    element["groupsErrorPercent"] =
                        (isNaN(tallyErrorGroups)
                            ? 0
                            : tallyErrorGroups
                        ).toFixed(2) + "%";
                    element["accountsErrorPercent"] =
                        (isNaN(tallyErrorAccounts)
                            ? 0
                            : tallyErrorAccounts
                        ).toFixed(2) + "%";
                    element["entriesErrorPercent"] =
                        (isNaN(tallyErrorEntries)
                            ? 0
                            : tallyErrorEntries
                        ).toFixed(2) + "%";
                    element["vouchersErrorPercent"] =
                        (isNaN(tallyErrorVouchers)
                            ? 0
                            : tallyErrorVouchers
                        ).toFixed(2) + "%";    
                });
            }
            this.isLoading = false;
        });
    }

    // download
    public downloadLog(row: TallySyncData) {
        this.downloadTallyErrorLogRequest.date = row['dateDDMMYY'] ? row['dateDDMMYY'] : '';
        this.downloadTallyErrorLogRequest.hour = row['hour'] ? row['hour'] : null;
        this.downloadTallyErrorLogRequest.type = row['type'];
        this.tallysyncService.getErrorLog(row.company?.uniqueName, this.downloadTallyErrorLogRequest)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(res => {
                if (res.status === "success") {
                    let blobData = this.generalService.base64ToBlob(res.body, "application/xlsx", 512);
                    return saveAs(
                        blobData,
                        `${row.company.name}-error-log.xlsx`
                    );
                } else {
                    this.toaster.errorToast(res.message);
                }
            });
    }

    /**
     *
     *
     * @param {*} dateArray  like [2020, 1, 27, 11, 11, 8, 533]
     * @returns  array index 0 like 27 Jan 2020 @ 05:11:08 for display only
     *  1 index like dd-mm-yyy for API
     *  1 index like hour for API
     * @memberof CompletedComponent
     */
    public prepareDate(dateArray: any) {
        let date = []
        if (dateArray[5] < 10) {
            dateArray[5] = '0' + dateArray[5];
        }
        date[0] = dateArray[2] + ' ' + this.MONTHS[(dateArray[1] - 1)] + ' ' + dateArray[0] + ' @ ' + dateArray[3] + ':' + dateArray[4] + ':' + dateArray[5];
        date[1] = dateArray[2] + '-' + dateArray[1] + '-' + dateArray[0];
        return date;
    }


    public pageChanged(event) {
        this.paginationRequest.page = event.page;
        this.getCurrentData();
    }

    /**
   * Prepare date for html render format
   *
   * @param {string} UTCtoLocalTime  UTC time string
   * @returns format date
   * @memberof CompletedComponent
   */
    public prepareCovertedDate(UTCtoLocalTime: string) {
        let UTCtoLocalTimeZoneDate = this.generalService.ConvertUTCTimeToLocalTime(UTCtoLocalTime);
        let dateArray = UTCtoLocalTimeZoneDate.toString().split(' '); // ["Mon", "Jan", "27", "2020", "05:11:08", "GMT+0530", "(India", "Standard", "Time)"]
        return dateArray[2] + ' ' + dateArray[1] + ' ' + dateArray[3] + ' @ ' + dateArray[4];
    }

    /**
     * to get hour from createdAt array for API
     *
     * @param {*} dateArray
     * @returns
     * @memberof InprogressComponent
     */
    public getHours(dateArray: any) {
        let hour;
        if (dateArray.length > 2) {
            hour = dateArray[3] + 1;
        }
        return hour;
    }
}
