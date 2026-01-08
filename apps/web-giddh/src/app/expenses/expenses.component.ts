import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppState } from '../store';
import { select, Store } from '@ngrx/store';
import { CommonPaginatedRequest } from '../models/api-models/Invoice';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as dayjs from 'dayjs';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { ExpenseResults, PettyCashReportResponse } from '../models/api-models/Expences';
import { MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { GeneralService } from '../services/general.service';
import { PendingListComponent } from './components/pending-list/pending-list.component';
import { RejectedListComponent } from './components/rejected-list/rejected-list.component';
import { GIDDH_DATE_RANGE_PICKER_RANGES, PAGINATION_LIMIT } from '../app.constant';
import { ExpenseService } from '../services/expences.service';
import { ToasterService } from '../services/toaster.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

/** Enum for expense tab names */
export enum EExpenseTabName {
    PENDING = 'pending',
    REJECTED = 'rejected'
}

@Component({
    selector: 'app-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss'],
})
export class ExpensesComponent implements OnInit, OnDestroy {
    public universalDate$: Observable<any>;
    public todaySelected: boolean = false;
    public isSelectedRow: boolean = false;
    public selectedRowItem: ExpenseResults = new ExpenseResults();
    public todaySelected$: Observable<boolean> = observableOf(false);
    public universalFrom: string;
    public universalTo: string;
    public isClearFilter: boolean = false;
    public isFilterSelected: boolean = false;
    /** Holds current selected tab */
    public currentSelectedTab: string = EExpenseTabName.PENDING;
    /** Holds expense tab name enum */
    public readonly EExpenseTabName = EExpenseTabName;
    public activeTab: string;
    public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public routerSub: any;
    /** Instance of pending list component */
    @ViewChild('pendingListComponent', { read: PendingListComponent, static: false }) public pendingListComponent: PendingListComponent;
    /** Instance of rejected list component */
    @ViewChild('rejectedListComponent', { read: RejectedListComponent, static: false }) public rejectedListComponent: RejectedListComponent;
    /** This will hold sort params of pending tab */
    public pendingTabSortOptions: any = {
        sort: "",
        sortBy: ""
    };
    /** This will hold sort params of rejected tab */
    public rejectedTabSortOptions: any = {
        sort: "",
        sortBy: ""
    };
    /** Date format type */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Instance of universal datepicker menu trigger */
    @ViewChild('universalDatepickerTrigger', { read: MatMenuTrigger }) public universalDatepickerTrigger: MatMenuTrigger;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
/* This will store available date ranges */
    public datePickerOptions: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* dayjs object */
    public dayjs = dayjs;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Petty cash pending report response */
    public pettyCashPendingReportResponse: PettyCashReportResponse;
    /** True if petty cash pending report is loading */
    public isPettyCashPendingReportLoading: boolean = false;
    /** Petty cash rejected report response */
    public pettyCashRejectedReportResponse: PettyCashReportResponse;
    /** True if petty cash rejected report is loading */
    public isPettyCashRejectedReportLoading: boolean = false;
    /** The index of the active tab. */
    public selectedTabIndex: number = 0;

    constructor(
        private store: Store<AppState>,
        private route: ActivatedRoute,
        private cdRf: ChangeDetectorRef,
        private generalService: GeneralService,
        private router: Router,
        private expenseService: ExpenseService,
        private toasterService: ToasterService
    ) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.pipe(select(p => p.session.todaySelected), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.pettycashRequest.count = PAGINATION_LIMIT;
        this.getActiveTab();

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if (params['type'] && this.activeTab !== params['type']) {
                this.activeTab = params['type'];
            }
        });

        this.router.events.pipe(takeUntil(this.destroyed$)).subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.getActiveTab();
            }
        });

        this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(dateObj => {
            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);

                setTimeout(() => {
                    this.store.pipe(select(state => state.session.todaySelected), take(1)).subscribe(response => {
                        this.todaySelected = response;

                        if (universalDate && !this.todaySelected) {
                            this.universalFrom = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.universalTo = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);

                            this.selectedDateRange = { startDate: dayjs(dateObj[0]), endDate: dayjs(dateObj[1]) };
                            this.selectedDateRangeUi = dayjs(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                            this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);

                            this.pettycashRequest.from = this.universalFrom;
                            this.pettycashRequest.to = this.universalTo;
                        } else {
                            this.pettycashRequest.from = "";
                            this.pettycashRequest.to = "";
                        }

                        this.pettycashRequest.page = 1;
                        if (this.pendingListComponent) {
                            this.pettycashRequest.sort = this.pendingListComponent.pettycashRequest.sort;
                            this.pettycashRequest.sortBy = this.pendingListComponent.pettycashRequest.sortBy;
                        }
                       

                        if (this.rejectedListComponent) {
                            this.pettycashRequest.sort = this.rejectedListComponent.pettycashRequest.sort;
                            this.pettycashRequest.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
                        }
                        if (this.selectedTabIndex === 0) {
                            this.getPettyCashPendingReports(this.pettycashRequest);
                        } else {
                            this.getPettyCashRejectedReports(this.pettycashRequest);
                        }

                        this.detectChanges();
                    });
                }, 100);
            }
        });
    }

    public selectedRowToggle(e) {
        this.isSelectedRow = e;
    }

    public selectedRowInput(item: ExpenseResults) {
        if (this.currentSelectedTab === EExpenseTabName.REJECTED && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
            this.rejectedTabSortOptions.sort = this.rejectedListComponent.pettycashRequest.sort;
            this.rejectedTabSortOptions.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
        } else if (this.currentSelectedTab === EExpenseTabName.PENDING && this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
            this.pendingTabSortOptions.sort = this.pendingListComponent.pettycashRequest.sort;
            this.pendingTabSortOptions.sortBy = this.pendingListComponent.pettycashRequest.sortBy;
        }
        this.selectedRowItem = item;
    }

    public selectedDetailedRowInput(item: ExpenseResults) {
        this.selectedRowItem = item;
    }

    public isFilteredSelected(isSelect: boolean) {
        this.isFilterSelected = isSelect;
    }

    public closeDetailedMode(e) {
        this.isSelectedRow = !e;

        setTimeout(() => {
            if (this.currentSelectedTab === EExpenseTabName.PENDING && this.pendingListComponent && this.pendingListComponent.pettycashRequest && this.pendingTabSortOptions) {
                this.pendingListComponent.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                this.pendingListComponent.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
            } else if (this.currentSelectedTab === EExpenseTabName.REJECTED && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest && this.rejectedTabSortOptions) {
                this.rejectedListComponent.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                this.rejectedListComponent.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
            }
        }, 500);
    }

    /**
     * This will refresh the pending item
     *
     * @param {boolean} event
     * @memberof ExpensesComponent
     */
    public refreshPendingItem(event: boolean): void {
        if (event) {
            if (this.pendingTabSortOptions) {
                this.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                this.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
            }
            if (this.rejectedTabSortOptions) {
                this.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                this.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
            }
            if (this.currentSelectedTab === EExpenseTabName.PENDING) {
                this.getPettyCashPendingReports(this.pettycashRequest);
            } else {
                this.getPettyCashRejectedReports(this.pettycashRequest);
            }

            setTimeout(() => {
                if (this.currentSelectedTab === EExpenseTabName.PENDING && this.pendingListComponent && this.pendingListComponent.pettycashRequest && this.pendingTabSortOptions) {
                    this.pendingListComponent.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                    this.pendingListComponent.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
                } else if (this.currentSelectedTab === EExpenseTabName.REJECTED && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest && this.rejectedTabSortOptions) {
                    this.rejectedListComponent.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                    this.rejectedListComponent.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
                }

                this.detectChanges();
            }, 600);
        }
    }

    public getPettyCashPendingReports(request: CommonPaginatedRequest) {
        request.status = EExpenseTabName.PENDING;
        request.from = this.pettycashRequest.from;
        request.to = this.pettycashRequest.to;
        this.isPettyCashPendingReportLoading = true;
        this.expenseService.getPettycashReports(request).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if(response?.status === "success") {
                this.pettyCashPendingReportResponse = response?.body;
            } else {
                this.toasterService.clearAllToaster();
                this.toasterService.errorToast(response?.message);
            }
            this.isPettyCashPendingReportLoading = false;
        });
    }

    public getPettyCashRejectedReports(request: CommonPaginatedRequest) {
        request.status = EExpenseTabName.REJECTED;
        request.from = this.pettycashRequest.from;
        request.to = this.pettycashRequest.to;
        this.isPettyCashRejectedReportLoading = true;
        this.expenseService.getPettycashRejectedReports(request).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if(response?.status === "success") {
                this.pettyCashRejectedReportResponse = response?.body;
            } else {
                this.toasterService.clearAllToaster();
                this.toasterService.errorToast(response?.message);
            }
            this.isPettyCashRejectedReportLoading = false;
        });
    }

    public clearFilter() {
        this.universalDate$.subscribe(res => {
            if (res) {
                this.universalFrom = dayjs(res[0]).format(GIDDH_DATE_FORMAT);
                this.universalTo = dayjs(res[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = _.cloneDeep(res);

                if (universalDate && !this.todaySelected) {
                    this.selectedDateRange = { startDate: dayjs(res[0]), endDate: dayjs(res[1]) };
                    this.selectedDateRangeUi = dayjs(res[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(res[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.fromDate = dayjs(universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.toDate = dayjs(universalDate[1]).format(GIDDH_DATE_FORMAT);
                    this.pettycashRequest.from = this.universalFrom;
                    this.pettycashRequest.to = this.universalTo;
                } else {
                    this.pettycashRequest.from = "";
                    this.pettycashRequest.to = "";
                }

                this.pettycashRequest.sortBy = '';
                this.pettycashRequest.sort = '';
                this.pettycashRequest.page = 1;
                this.isFilterSelected = false;

                this.getPettyCashPendingReports(this.pettycashRequest);
                this.getPettyCashRejectedReports(this.pettycashRequest);
            }
        });
    }

    /**
     * Callback for tab change event
     *
     * @param {MatTabChangeEvent} event
     * @memberof ExpensesComponent
     */
    public tabChanged(event: MatTabChangeEvent): void {
        let tab = (event?.index === 0) ? EExpenseTabName.PENDING : EExpenseTabName.REJECTED;
        let tabIndex = (event?.index === 0) ? 0 : 1;

        this.router.navigate(['pages', 'expenses-manager'], { queryParams: { tab: tab, tabIndex: tabIndex } } );

        if (tab === EExpenseTabName.PENDING && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
            this.rejectedTabSortOptions.sort = this.rejectedListComponent.pettycashRequest.sort;
            this.rejectedTabSortOptions.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
        } else if (tab === EExpenseTabName.REJECTED && this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
            this.pendingTabSortOptions.sort = this.pendingListComponent.pettycashRequest.sort;
            this.pendingTabSortOptions.sortBy = this.pendingListComponent.pettycashRequest.sortBy;
        }
        this.currentSelectedTab = tab;

        setTimeout(() => {
            if (tab === EExpenseTabName.PENDING && this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
                this.pendingListComponent.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                this.pendingListComponent.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
                this.getPettyCashPendingReports(this.pettycashRequest);
            } else if (tab === EExpenseTabName.REJECTED && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
                this.rejectedListComponent.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                this.rejectedListComponent.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
                this.getPettyCashRejectedReports(this.pettycashRequest);
            }
        }, 20);
    }

    detectChanges() {
        if (!this.cdRf['destroyed']) {
            this.cdRf.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getActiveTab() {
        if (this.route.snapshot.queryParams.tab) {
            this.currentSelectedTab = this.route.snapshot.queryParams.tab;
            if (this.currentSelectedTab === EExpenseTabName.PENDING) {
                this.selectedTabIndex = 0;
            } else {
                this.selectedTabIndex = 1;
            }
        }
    }

    /**
     * This will show the datepicker
     *
     * @param {boolean} isOpen
     * @memberof ExpensesComponent
     */
    public toggleGiddhDatepicker(isOpen: boolean = true): void {
        if (isOpen) {
            this.universalDatepickerTrigger?.openMenu();
        } else {
            this.universalDatepickerTrigger?.closeMenu();
        }
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ExpensesComponent
     */
    public dateSelectedCallback(value?: any): void {
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
            this.selectedDateRange = { startDate: dayjs(value.startDate), endDate: dayjs(value.endDate) };
            this.selectedDateRangeUi = dayjs(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = dayjs(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = dayjs(value.endDate).format(GIDDH_DATE_FORMAT);
            this.pettycashRequest.from = this.fromDate;
            this.pettycashRequest.to = this.toDate;
            this.isFilterSelected = true;

            if (this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
                this.pettycashRequest.sort = this.pendingListComponent.pettycashRequest.sort;
                this.pettycashRequest.sortBy = this.pendingListComponent.pettycashRequest.sortBy;
            }
            this.getPettyCashPendingReports(this.pettycashRequest);

            if (this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
                this.pettycashRequest.sort = this.rejectedListComponent.pettycashRequest.sort;
                this.pettycashRequest.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
            }
            this.getPettyCashRejectedReports(this.pettycashRequest);
        }
    }

    /**
     * This will get report date to set in datepicker if today is selected
     *
     * @param {*} event
     * @memberof ExpensesComponent
     */
    public reportDates(event: any): void {
        if(this.todaySelected && event) {
            this.selectedDateRange = { startDate: dayjs(event[0], GIDDH_DATE_FORMAT), endDate: dayjs(event[1], GIDDH_DATE_FORMAT) };
            this.selectedDateRangeUi = dayjs(event[0], GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + dayjs(event[1], GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
        }
    }

    /**
     * This will show the next item from the list in preview. If current item is the last item,
     * then it will show the first item from the list, if all items are processed, it will exit the preview mode
     *
     * @param {*} event
     * @memberof ExpensesComponent
     */
    public previewNextItem(event: any): void {
        if(event) {
            let nextItemIndex;
            this.pettyCashPendingReportResponse?.results?.forEach((item, index) => {
                if(item?.uniqueName === this.selectedRowItem?.uniqueName) {
                    nextItemIndex = index + 1;
                }
            });

            if(this.pettyCashPendingReportResponse?.results?.length > 1) {
                if(nextItemIndex && this.pettyCashPendingReportResponse?.results[nextItemIndex]) {
                    this.selectedRowItem = this.pettyCashPendingReportResponse?.results[nextItemIndex];
                } else {
                    this.selectedRowItem = this.pettyCashPendingReportResponse?.results[0];
                }
            } else {
                this.closeDetailedMode(true);
            }

            this.refreshPendingItem(true);
        }
    }
}
