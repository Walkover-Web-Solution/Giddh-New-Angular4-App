import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AppState } from '../store';
import { select, Store } from '@ngrx/store';
import { ExpencesAction } from '../actions/expences/expence.action';
import { CommonPaginatedRequest } from '../models/api-models/Invoice';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT, GIDDH_NEW_DATE_FORMAT_UI } from '../shared/helpers/defaultDateFormat';
import { ExpenseResults } from '../models/api-models/Expences';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { CompanyActions } from '../actions/company.actions';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { StateDetailsRequest } from '../models/api-models/Company';
import { GeneralService } from '../services/general.service';
import { PendingListComponent } from './components/pending-list/pending-list.component';
import { RejectedListComponent } from './components/rejected-list/rejected-list.component';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
    selector: 'app-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss'],
})

export class ExpensesComponent implements OnInit, OnDestroy {
    @ViewChild('tabset', { static: true }) tabset: TabsetComponent;

    public universalDate$: Observable<any>;
    public todaySelected: boolean = false;
    public isSelectedRow: boolean = false;
    public selectedRowItem: ExpenseResults = new ExpenseResults();
    public todaySelected$: Observable<boolean> = observableOf(false);
    public universalFrom: string;
    public universalTo: string;
    public modalRef: BsModalRef;
    public isClearFilter: boolean = false;
    public isFilterSelected: boolean = false;
    public currentSelectedTab: string = 'pending';
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
    /** directive to get reference of element */
    @ViewChild('datepickerTemplate') public datepickerTemplate: ElementRef;
    /* This will store selected date range to use in api */
    public selectedDateRange: any;
    /* This will store selected date range to show on UI */
    public selectedDateRangeUi: any;
    /* This will store available date ranges */
    public datePickerOption: any = GIDDH_DATE_RANGE_PICKER_RANGES;
    /* Moment object */
    public moment = moment;
    /* Selected from date */
    public fromDate: string;
    /* Selected to date */
    public toDate: string;
    /* Selected range label */
    public selectedRangeLabel: any = "";
    /* This will store the x/y position of the field to show datepicker under it */
    public dateFieldPosition: any = { x: 0, y: 0 };
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** This will store screen size */
    public isMobileScreen: boolean = false;

    constructor(private store: Store<AppState>,
        private _expenceActions: ExpencesAction,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private companyActions: CompanyActions,
        private _cdRf: ChangeDetectorRef,
        private _generalService: GeneralService,
        private router: Router,
        private breakPointObservar: BreakpointObserver) {

        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.pipe(select(p => p.session.todaySelected), takeUntil(this.destroyed$));

        this.breakPointObservar.observe([
            '(max-width: 767px)'
        ]).pipe(takeUntil(this.destroyed$)).subscribe(result => {
            this.isMobileScreen = result.matches;
        });
    }

    public ngOnInit() {
        this.store.dispatch(this.companyActions.getTax());
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
                            this.universalFrom = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.universalTo = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);

                            this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                            this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                            this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                            this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);

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
                        this.getPettyCashPendingReports(this.pettycashRequest);

                        if (this.rejectedListComponent) {
                            this.pettycashRequest.sort = this.rejectedListComponent.pettycashRequest.sort;
                            this.pettycashRequest.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
                        }
                        this.getPettyCashRejectedReports(this.pettycashRequest);
                    });
                }, 100);
            }
        });

        this.saveLastState('');
    }

    public selectedRowToggle(e) {
        this.isSelectedRow = e;
    }

    public selectedRowInput(item: ExpenseResults) {
        if (this.currentSelectedTab === "rejected" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
            this.rejectedTabSortOptions.sort = this.rejectedListComponent.pettycashRequest.sort;
            this.rejectedTabSortOptions.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
        } else if (this.currentSelectedTab === "pending" && this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
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
            if (this.currentSelectedTab == "pending" && this.pendingListComponent && this.pendingListComponent.pettycashRequest && this.pendingTabSortOptions) {
                this.pendingListComponent.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                this.pendingListComponent.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
            } else if (this.currentSelectedTab === "rejected" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest && this.rejectedTabSortOptions) {
                this.rejectedListComponent.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                this.rejectedListComponent.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
            }
        }, 500);
    }

    public refreshPendingItem(e) {
        if (e) {
            if (this.pendingTabSortOptions) {
                this.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                this.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
            }
            this.getPettyCashPendingReports(this.pettycashRequest);

            if (this.rejectedTabSortOptions) {
                this.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                this.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
            }
            this.getPettyCashRejectedReports(this.pettycashRequest);

            setTimeout(() => {
                if (this.currentSelectedTab == "pending" && this.pendingListComponent && this.pendingListComponent.pettycashRequest && this.pendingTabSortOptions) {
                    this.pendingListComponent.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                    this.pendingListComponent.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
                } else if (this.currentSelectedTab === "rejected" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest && this.rejectedTabSortOptions) {
                    this.rejectedListComponent.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                    this.rejectedListComponent.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
                }

                this.detectChanges();
            }, 600);
        }
    }

    public getPettyCashPendingReports(request: CommonPaginatedRequest) {
        request.status = 'pending';
        this.store.dispatch(this._expenceActions.GetPettycashReportRequest(request));
    }

    public getPettyCashRejectedReports(request: CommonPaginatedRequest) {
        request.status = 'rejected';
        this.store.dispatch(this._expenceActions.GetPettycashRejectedReportRequest(request));
    }

    public openModal(filterModal: TemplateRef<any>) {
        this.modalRef = this.modalService.show(filterModal, { class: 'modal-md' });
    }

    public clearFilter() {
        this.universalDate$.subscribe(res => {
            if (res) {
                this.universalFrom = moment(res[0]).format(GIDDH_DATE_FORMAT);
                this.universalTo = moment(res[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = _.cloneDeep(res);

                if (universalDate && !this.todaySelected) {
                    this.selectedDateRange = { startDate: moment(res[0]), endDate: moment(res[1]) };
                    this.selectedDateRangeUi = moment(res[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(res[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                    this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                    this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
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

    public tabChanged(tab: string, e) {
        if (e && !e.target) {
            this.saveLastState(tab);
        }

        if (tab === "pending" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
            this.rejectedTabSortOptions.sort = this.rejectedListComponent.pettycashRequest.sort;
            this.rejectedTabSortOptions.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
        } else if (tab === "rejected" && this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
            this.pendingTabSortOptions.sort = this.pendingListComponent.pettycashRequest.sort;
            this.pendingTabSortOptions.sortBy = this.pendingListComponent.pettycashRequest.sortBy;
        }

        this.currentSelectedTab = tab;

        setTimeout(() => {
            if (tab == "pending" && this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
                this.pendingListComponent.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                this.pendingListComponent.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
            } else if (tab === "rejected" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
                this.rejectedListComponent.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                this.rejectedListComponent.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
            }
        }, 20);
    }

    private saveLastState(state: string) {
        let companyUniqueName = null;
        this.store.pipe(select(c => c.session.companyUniqueName), take(1)).subscribe(s => companyUniqueName = s);
        let stateDetailsRequest = new StateDetailsRequest();
        stateDetailsRequest.companyUniqueName = companyUniqueName;
        stateDetailsRequest.lastState = `pages/expenses-manager${state ? +'/' + state : ''}`;

        this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
    }

    detectChanges() {
        if (!this._cdRf['destroyed']) {
            this._cdRf.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public getActiveTab() {
        if (this.route.snapshot.queryParams.tab) {
            this.currentSelectedTab = this.route.snapshot.queryParams.tab;
            if (this.currentSelectedTab === "pending") {
                this.tabset.tabs[0].active = true;
            } else {
                this.tabset.tabs[1].active = true;
            }
        }
    }

    /**
     * To show the datepicker
     *
     * @param {*} element
     * @memberof ExpensesComponent
     */
    public showGiddhDatepicker(element: any): void {
        if (element) {
            this.dateFieldPosition = this._generalService.getPosition(element.target);
        }
        this.modalRef = this.modalService.show(
            this.datepickerTemplate,
            Object.assign({}, { class: 'modal-lg giddh-datepicker-modal', backdrop: false, ignoreBackdropClick: false })
        );
    }

    /**
     * This will hide the datepicker
     *
     * @memberof ExpensesComponent
     */
    public hideGiddhDatepicker(): void {
        this.modalRef.hide();
    }

    /**
     * Call back function for date/range selection in datepicker
     *
     * @param {*} value
     * @memberof ExpensesComponent
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
            this.selectedDateRange = { startDate: moment(value.startDate), endDate: moment(value.endDate) };
            this.selectedDateRangeUi = moment(value.startDate).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(value.endDate).format(GIDDH_NEW_DATE_FORMAT_UI);
            this.fromDate = moment(value.startDate).format(GIDDH_DATE_FORMAT);
            this.toDate = moment(value.endDate).format(GIDDH_DATE_FORMAT);
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
     * This will return page heading based on active tab
     *
     * @memberof ExpensesComponent
     */
    public getPageHeading(): string {
        if (this.currentSelectedTab === 'pending') {
            return this.localeData?.pending;
        }
        else if (this.currentSelectedTab === 'rejected') {
            return this.localeData?.rejected;
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
            this.selectedDateRange = { startDate: moment(event[0], GIDDH_DATE_FORMAT), endDate: moment(event[1], GIDDH_DATE_FORMAT) };
            this.selectedDateRangeUi = moment(event[0], GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(event[1], GIDDH_DATE_FORMAT).format(GIDDH_NEW_DATE_FORMAT_UI);
        }
    }
}
