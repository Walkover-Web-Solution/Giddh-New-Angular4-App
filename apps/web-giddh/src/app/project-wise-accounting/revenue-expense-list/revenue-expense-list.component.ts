import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../../app.constant';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../../shared/helpers/defaultDateFormat';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, ReplaySubject, takeUntil, filter, tap } from 'rxjs';
import { ProjectAccountingComponentStore } from '../project-wise-accounting.store';
import { projectType } from '../project-wise-accounting';

@Component({
    selector: 'revenue-expense-list.',
    styleUrls: ['./revenue-expense-list.component.scss'],
    templateUrl: './revenue-expense-list.component.html',
    providers: [ProjectAccountingComponentStore]
})
export class RevenueExpenseListComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: TemplateRef<any>;
    /** This will store selected date ranges */
    public selectedDateRange: any;
    /** This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /** Selected range label */
    public selectedRangeLabel: any = "";
    /** This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /** This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /** Instance of bootstrap modal */
    public getProjectRequest: any = {
        companyUniqueName: '',
        projectUniqueName: '',
        branchUniqueName: ''
    };
    public activeCompany: any;
    public modalRef: BsModalRef;
    public activeTableRowIndex: number = null;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public dataSource: any;
    private isApiCallInProgress = false; // Flag to prevent multiple API calls
    displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'action'];
    /** Selected from date */
    public fromDate: string;
    /** Selected to date */
    public toDate: string;
    /** Selected from date */
    public page: number = 1;
    /** Selected to date */
    public count: number = 10;
    public selecteAccount = [
        {
            label: 'Option 1',
            value: 1
        },
        {
            label: 'Option 2',
            value: 2
        },
        {
            label: 'Option 3',
            value: 3
        }
    ]
    public selectedTab = [
        {
            label: 'Tab 1',
            value: 1
        },
        {
            label: 'Tab 2',
            value: 2
        },
        {
            label: 'Tab 3',
            value: 3
        }
    ]
    public selectedProject = [
        {
            label: 'Project 1',
            value: 1
        },
        {
            label: 'Project 2',
            value: 2
        },
        {
            label: 'Project 3',
            value: 3
        }
    ]
    constructor(
        private generalService: GeneralService,
        private modalService: BsModalService,
        private route: ActivatedRoute,
        private componentStore: ProjectAccountingComponentStore
    ) { }

    public ngOnInit() {
        console.log(this.dataSource);
        // this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(query => {
        //     this.getProjectRequest.projectUniqueName = query.uniqueName
        //     this.getProjectEntry();
        // });
        // this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)).subscribe(activeCompany => {
        //     if (activeCompany) {
        //         this.activeCompany = activeCompany;
        //         this.getProjectRequest.companyUniqueName = activeCompany.uniqueName
        //         this.getProjectRequest.branchUniqueName = this.generalService.currentBranchUniqueName ?? this.activeCompany.uniqueName,
        //         this.getProjectEntry();
        //     }
        // });

        combineLatest([
            this.route.params.pipe(takeUntil(this.destroyed$)), // Route parameters
            this.componentStore.activeCompany$.pipe(takeUntil(this.destroyed$)) // Active company data
        ])
            .pipe(
                filter(([params, activeCompany]) => !!(params.uniqueName && activeCompany)), // Ensure both values are available
                tap(([params, activeCompany]) => {
                    // Update the project request object
                    this.getProjectRequest.projectUniqueName = params.uniqueName;
                    this.getProjectRequest.companyUniqueName = activeCompany.uniqueName;
                    this.getProjectRequest.branchUniqueName =
                        this.generalService.currentBranchUniqueName ?? activeCompany.uniqueName;
                }),
                takeUntil(this.destroyed$) // Clean up on component destruction
            )
            .subscribe(() => {
                // Call the API only if dataSource is empty and no API call is in progress
                if (!this.dataSource?.length && !this.isApiCallInProgress) {
                    this.getProject();
                }
            });

        // Listen for project details changes and update the dataSource
        this.componentStore.projectDetails$
            .pipe(takeUntil(this.destroyed$))
            .subscribe(entryList => {
                if (entryList) {
                    this.dataSource = entryList;
                    this.isApiCallInProgress = false; // Reset the API call flag once data is received
                }
            });

        this.componentStore.entrySearch$.pipe(takeUntil(this.destroyed$))
            .subscribe(entrySearch => {
                if (entrySearch) {
                    console.log("entrySearch", entrySearch);

                }
            });

        this.componentStore.universalDate$.subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
        });

    }
    public getProject(): void {
        console.log("getProject");
        this.isApiCallInProgress = true; // Mark API call as in progress
        this.componentStore.getProjectById(this.getProjectRequest);
        this.getProjectEntry();
    }

    public getProjectEntry(): void {
        console.log("getProjectEntry");
        let entryRequest = this.getProjectRequest
        entryRequest.from = this.fromDate;
        entryRequest.to = this.toDate;
        entryRequest.page = this.page;
        entryRequest.count = this.count;
        this.componentStore.searchEntry(entryRequest);
    }

    public getProjectAccount(): void {
        console.log("getProjectAccount");
        this.componentStore.getProjectById(this.getProjectRequest);
    }

    public ngOnDestroy() {

    }
    /**
     *To show the datepicker
    *
    * @param {*} element
    * @memberof AuditLogsFormComponent
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
     * This will hide the datepicker
     *
     * @memberof AuditLogsFormComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
        }
    }

    public selectProject(event: any) {

    }
}
