import { Observable, ReplaySubject } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import * as dayjs from 'dayjs';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ToasterService } from '../../services/toaster.service';
import { takeUntil } from "rxjs/operators";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../store";
import { IOption } from "../../theme/ng-virtual-select/sh-options.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GIDDH_DATE_FORMAT } from "../../shared/helpers/defaultDateFormat";
import { TallySyncService } from "../../services/tally-sync.service";
import { TallySyncData, DownloadTallyErrorLogRequest } from "../../models/api-models/tally-sync";
import { saveAs } from 'file-saver';
import { CompanyResponse } from '../../models/api-models/Company';
import { GeneralService } from '../../services/general.service';
import { CommonPaginatedRequest } from '../../models/api-models/Invoice';
import { PAGINATION_LIMIT } from '../../app.constant';

@Component({
    selector: 'app-completed-preview',
    templateUrl: './completed.component.html',
    styleUrls: ['./completed.component.scss'],
})
export class CompletedComponent implements OnInit, OnDestroy {
    public universalDate$: Observable<any>;
    public bsConfig: Partial<BsDatepickerConfig> = {
        showWeekNumbers: false,
        dateInputFormat: GIDDH_DATE_FORMAT,
        rangeInputFormat: GIDDH_DATE_FORMAT,
        containerClass: 'theme-green myDpClass'
    };
    public CompanyList: IOption[] = [];
    public dayjs = dayjs;
    public maxDate = new Date(new Date().setDate(new Date().getDate() - 1));
    public startDate: string;
    public endDate: string;
    public filter: any = {};
    public filterForm: FormGroup;
    public completedData: TallySyncData[] = [];
    public MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    public timeInterval: IOption[] = [
        {
            value: '00:00:00-02:00:00',
            label: '00:00 am - 02:00 am'
        },
        {
            value: '02:00:00-04:00:00',
            label: '02:00 am - 04:00 am'
        },
        {
            value: '04:00:00-06:00:00',
            label: '04:00 am - 06:00 am'
        },
        {
            value: '06:00:00-08:00:00',
            label: '06:00 am - 08:00 am'
        },
        {
            value: '08:00:00-10:00:00',
            label: '08:00 am - 10:00 am'
        },
        {
            value: '10:00:00-12:00:00',
            label: '10:00 am - 12:00 pm'
        },
        {
            value: '12:00:00-14:00:00',
            label: '12:00 pm - 02:00 pm'
        },
        {
            value: '14:00:00-16:00:00',
            label: '02:00 pm - 04:00 pm'
        },
        {
            value: '16:00:00-18:00:00',
            label: '04:00 pm - 06:00 pm'
        },
        {
            value: '18:00:00-20:00:00',
            label: '06:00 pm - 08:00 pm'
        },
        {
            value: '20:00:00-22:00:00',
            label: '08:00 pm - 10:00 pm'
        },
        {
            value: '22:00:00-24:00:00',
            label: '10:00 pm - 12:00 pm'
        }
    ];

    public companies$: Observable<CompanyResponse[]>;
    public downloadTallyErrorLogRequest: DownloadTallyErrorLogRequest = {
        date: '',
        hour: null,
        type: ''
    };
    public paginationRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    public completedtallySyncDataResponse: any;
    /** Observable to store the branches of current company */
    public currentCompanyBranches$: Observable<any>;
    /** Stores the branch list of a company */
    public currentCompanyBranches: Array<any>;
    /** Stores the current branch */
    public currentBranch: any = { name: '', uniqueName: '' };
    /** Stores the current company */
    public activeCompany: any;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if api call in progress */
    public isLoading: boolean = false;

    constructor(
        private store: Store<AppState>,
        private toaster: ToasterService,
        private fb: FormBuilder,
        private tallysyncService: TallySyncService,
        private generalService: GeneralService
    ) {

        this.filterForm = this.fb.group({
            filterCompany: [''],
            filterTimeInterval: [''],
            filterDate: ['', Validators.required],
            branchUniqueName: ['']
        });
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.companies$ = this.store.pipe(select(p => p.session.companies), takeUntil(this.destroyed$));
        // set financial years based on company financial year
        this.store.pipe(select(state => state.session.activeCompany), takeUntil(this.destroyed$)).subscribe(activeCompany => {
            if (activeCompany) {
                this.activeCompany = activeCompany;
                this.filterForm.get('filterCompany')?.patchValue(activeCompany.uniqueName);
            }
        });
    }

    public ngOnInit() {
        // set current company date
        this.paginationRequest.sortBy = '';
        this.paginationRequest.page = 1;
        this.paginationRequest.count = PAGINATION_LIMIT;

        this.companies$.subscribe(a => {
            if (a) {
                a.forEach((element) => {
                    this.CompanyList.push({ value: element?.uniqueName, label: element.name });
                })
            }
        });
        // set initial Data
        this.filterForm.get('filterDate')?.patchValue(dayjs(this.maxDate).format('D-MMM-YYYY'));
        this.filterForm.get('filterTimeInterval')?.patchValue(this.timeInterval[5]?.value);
        this.filter.timeRange = this.timeInterval[5]?.value;
        this.filter.startDate = dayjs(this.maxDate).format(GIDDH_DATE_FORMAT);
        this.getReport();
    }

    public getReport() {
        if (this.filterForm.invalid) {
            this.toaster.errorToast(this.localeData?.filter_criteria);
            return;
        }
        this.isLoading = true;
        // api call here
        this.filter.from = this.filter.startDate + ' ' + this.filter.timeRange.split('-')[0];
        this.filter.to = this.filter.startDate + ' ' + this.filter.timeRange.split('-')[1];
        this.paginationRequest.from = this.filter.from;
        this.paginationRequest.to = this.filter.to;
        this.paginationRequest.branchUniqueName = this.filterForm.get('branchUniqueName')?.value;
        this.tallysyncService.getCompletedSync(this.paginationRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res && res.results && res.results.length > 0) {
                this.completedtallySyncDataResponse = res;
                this.completedData = res.results;
                this.completedData.forEach((element) => {
                    if (element.updatedAt) {
                        let preparedDateString = this.prepareDate(element.updatedAt)[0];
                        element['dateString'] = this.prepareCovertedDate(preparedDateString);
                    }
                    if (element.createdAt) {
                        element['hour'] = this.getHours(element.createdAt);
                        element['dateDDMMYY'] = this.prepareDate(element.createdAt)[1];
                    }
                    //completed
                    let tallyGroups = (element.totalSavedGroups * 100) / element.totalTallyGroups;
                    let tallyAccounts = (element.totalSavedAccounts * 100) / element.totalTallyAccounts;
                    let tallyEntries = (element.totalSavedEntries * 100) / element.totalTallyEntries;
                    let tallyVouchers = (element.totalSavedVouchers * 100) / element.totalTallyVouchers;
                    element['groupsPercent'] = (isNaN(tallyGroups) ? 0 : tallyGroups).toFixed(2) + '%';
                    element['accountsPercent'] = (isNaN(tallyAccounts) ? 0 : tallyAccounts).toFixed(2) + '%';
                    element['entriesPercent'] = (isNaN(tallyEntries) ? 0 : tallyEntries).toFixed(2) + '%';
                    element['vouchersPercent'] = (isNaN(tallyVouchers) ? 0 : tallyVouchers).toFixed(2) + '%';

                    //error
                    let tallyErrorGroups = (element.tallyErrorGroups * 100) / element.totalTallyGroups;
                    let tallyErrorAccounts = (element.tallyErrorAccounts * 100) / element.totalTallyAccounts;
                    let tallyErrorEntries = (element.tallyErrorEntries * 100) / element.totalTallyEntries;
                    let tallyErrorVouchers = (element.tallyErrorVouchers * 100) / element.totalTallyVouchers;
                    element['groupsErrorPercent'] = (isNaN(tallyErrorGroups) ? 0 : tallyErrorGroups).toFixed(2) + '%';
                    element['accountsErrorPercent'] = (isNaN(tallyErrorAccounts) ? 0 : tallyErrorAccounts).toFixed(2) + '%';
                    element['entriesErrorPercent'] = (isNaN(tallyErrorEntries) ? 0 : tallyErrorEntries).toFixed(2) + '%';
                    element['vouchersErrorPercent'] = (isNaN(tallyErrorVouchers) ? 0 : tallyErrorVouchers).toFixed(2) + '%';
                })
            }
            this.isLoading = false;
        });
    }

    /**
     * Download error log
     *
     * @param {TallySyncData} row
     * @memberof CompletedComponent
     */
    public downloadLog(row: TallySyncData) {
        this.downloadTallyErrorLogRequest.date = row['dateDDMMYY'] ? row['dateDDMMYY'] : '';
        this.downloadTallyErrorLogRequest.hour = row['hour'] ? row['hour'] : null;
        this.downloadTallyErrorLogRequest.type = row['type'];
        this.tallysyncService.getErrorLog(row.company?.uniqueName, this.downloadTallyErrorLogRequest).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
            if (res?.status === 'success') {
                let blobData = this.generalService.base64ToBlob(res.body, 'application/xlsx', 512);
                return saveAs(blobData, `${row.company.name}-error-log.xlsx`);
            } else {
                this.toaster.errorToast(res?.message);
            }
        })
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

    public getHours(dateArray: any) {
        let hour;
        if (dateArray?.length > 2) {
            hour = dateArray[3] + 1;
        }
        return hour;
    }

    public onDDElementCompanySelect(event: IOption) {
        this.filter.company = event?.value;
    }

    public onValueChange(event: Date): void {
        this.filter.startDate = dayjs(event).format(GIDDH_DATE_FORMAT);
    }

    public onDDElementTimeRangeSelect(event: IOption): void {
        this.filter.timeRange = event?.value;
    }

    public pageChanged(event) {
        this.paginationRequest.page = event.page;
        this.getReport();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * Branch change handler
     *
     * @memberof CompletedComponent
     */
    public handleBranchChange(selectedEntity: any): void {
        this.currentBranch.name = selectedEntity.label;
        this.paginationRequest.branchUniqueName = this.filterForm.get('branchUniqueName')?.value;
    }
}
