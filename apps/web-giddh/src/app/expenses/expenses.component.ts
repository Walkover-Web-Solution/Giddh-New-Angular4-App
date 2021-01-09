import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild, } from '@angular/core';
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
import { CurrentPage } from '../models/api-models/Common';
import { GeneralActions } from '../actions/general/general.actions';
import { GeneralService } from '../services/general.service';
import { PendingListComponent } from './components/pending-list/pending-list.component';
import { RejectedListComponent } from './components/rejected-list/rejected-list.component';
import { GIDDH_DATE_RANGE_PICKER_RANGES } from '../app.constant';

@Component({
    selector: 'app-expenses',
    templateUrl: './expenses.component.html',
    styleUrls: ['./expenses.component.scss'],
})

export class ExpensesComponent implements OnInit, OnDestroy {
    @ViewChild('tabset', {static: true}) tabset: TabsetComponent;

    public universalDate: Date[];
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
    public datePickerOptions: any = {
        hideOnEsc: true,
        // parentEl: '#dateRangePickerParent',
        locale: {
            applyClass: 'btn-green',
            applyLabel: 'Go',
            fromLabel: 'From',
            format: 'D-MMM-YY',
            toLabel: 'To',
            cancelLabel: 'Cancel',
            customRangeLabel: 'Custom range'
        },
        ranges: {
            'This Month to Date': [
                moment().startOf('month'),
                moment()
            ],
            'This Quarter to Date': [
                moment().quarter(moment().quarter()).startOf('quarter'),
                moment()
            ],
            'This Financial Year to Date': [
                moment().startOf('year').subtract(9, 'year'),
                moment()
            ],
            'This Year to Date': [
                moment().startOf('year'),
                moment()
            ],
            'Last Month': [
                moment().subtract(1, 'month').startOf('month'),
                moment().subtract(1, 'month').endOf('month')
            ],
            'Last Quater': [
                moment().quarter(moment().quarter()).subtract(1, 'quarter').startOf('quarter'),
                moment().quarter(moment().quarter()).subtract(1, 'quarter').endOf('quarter')
            ],
            'Last Financial Year': [
                moment().startOf('year').subtract(10, 'year'),
                moment().endOf('year').subtract(10, 'year')
            ],
            'Last Year': [
                moment().startOf('year').subtract(1, 'year'),
                moment().endOf('year').subtract(1, 'year')
            ]
        },
        startDate: moment().subtract(30, 'days'),
        endDate: moment()
    };
    public selectedDate = {
        dateFrom: '',
        dateTo: ''
    };
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

    constructor(private store: Store<AppState>,
        private _expenceActions: ExpencesAction,
        private route: ActivatedRoute,
        private modalService: BsModalService,
        private companyActions: CompanyActions,
        private _cdRf: ChangeDetectorRef,
        private _generalActions: GeneralActions,
        private _generalService: GeneralService,
        private router: Router) {

        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.pipe(select(p => p.session.todaySelected), takeUntil(this.destroyed$));
        this.store.dispatch(this.companyActions.getTax());
    }

    public ngOnInit() {
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

        observableCombineLatest(this.universalDate$, this.route.params, this.todaySelected$).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            if (!Array.isArray(resp[0])) {
                return;
            }
            let dateObj = resp[0];
            this.todaySelected = resp[2];

            if (dateObj) {
                let universalDate = _.cloneDeep(dateObj);
                this.universalFrom = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.universalTo = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);

                this.selectedDateRange = { startDate: moment(dateObj[0]), endDate: moment(dateObj[1]) };
                this.selectedDateRangeUi = moment(dateObj[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(dateObj[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);

                this.datePickerOptions = {
                    ...this.datePickerOptions,
                    startDate: moment(universalDate[0], GIDDH_DATE_FORMAT).toDate(),
                    endDate: moment(universalDate[1], GIDDH_DATE_FORMAT).toDate(),
                    chosenLabel: universalDate[2]
                };

                if (this.universalFrom && this.universalTo) {
                    this.pettycashRequest.from = this.universalFrom;
                    this.pettycashRequest.to = this.universalTo;
                    this.pettycashRequest.page = 1;
                    this.selectedDate.dateFrom = this.pettycashRequest.from;
                    this.selectedDate.dateTo = this.pettycashRequest.to;

                    if(this.pendingListComponent) {
                        this.pettycashRequest.sort = this.pendingListComponent.pettycashRequest.sort;
                        this.pettycashRequest.sortBy = this.pendingListComponent.pettycashRequest.sortBy;
                    }
                    this.getPettyCashPendingReports(this.pettycashRequest);

                    if(this.rejectedListComponent) {
                        this.pettycashRequest.sort = this.rejectedListComponent.pettycashRequest.sort;
                        this.pettycashRequest.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
                    }
                    this.getPettyCashRejectedReports(this.pettycashRequest);
                }
            }
        });

        this.saveLastState('');
    }

    public selectedRowToggle(e) {
        this.isSelectedRow = e;
    }

    public selectedRowInput(item: ExpenseResults) {
        if(this.currentSelectedTab === "rejected" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
            this.rejectedTabSortOptions.sort = this.rejectedListComponent.pettycashRequest.sort;
            this.rejectedTabSortOptions.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
        } else if(this.currentSelectedTab === "pending" && this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
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
            if(this.currentSelectedTab == "pending" && this.pendingListComponent && this.pendingListComponent.pettycashRequest && this.pendingTabSortOptions) {
                this.pendingListComponent.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                this.pendingListComponent.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
            } else if(this.currentSelectedTab === "rejected" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest && this.rejectedTabSortOptions) {
                this.rejectedListComponent.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                this.rejectedListComponent.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
            }
        }, 500);
    }

    public refreshPendingItem(e) {
        if (e) {
            if(this.pendingTabSortOptions) {
                this.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                this.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
            }
            this.getPettyCashPendingReports(this.pettycashRequest);

            if(this.rejectedTabSortOptions) {
                this.pettycashRequest.sort = this.rejectedTabSortOptions.sort;
                this.pettycashRequest.sortBy = this.rejectedTabSortOptions.sortBy;
            }
            this.getPettyCashRejectedReports(this.pettycashRequest);

            setTimeout(() => {
                if(this.currentSelectedTab == "pending" && this.pendingListComponent && this.pendingListComponent.pettycashRequest && this.pendingTabSortOptions) {
                    this.pendingListComponent.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                    this.pendingListComponent.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
                } else if(this.currentSelectedTab === "rejected" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest && this.rejectedTabSortOptions) {
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

    public bsValueChange(event: any) {
        if (event) {
            this.pettycashRequest.from = moment(event.picker.startDate._d).format(GIDDH_DATE_FORMAT);
            this.pettycashRequest.to = moment(event.picker.endDate._d).format(GIDDH_DATE_FORMAT);
            this.selectedDate.dateFrom = this.pettycashRequest.from;
            this.selectedDate.dateTo = this.pettycashRequest.to;
            this.isFilterSelected = true;

            if(this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
                this.pettycashRequest.sort = this.pendingListComponent.pettycashRequest.sort;
                this.pettycashRequest.sortBy = this.pendingListComponent.pettycashRequest.sortBy;
            }
            this.getPettyCashPendingReports(this.pettycashRequest);

            if(this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
                this.pettycashRequest.sort = this.rejectedListComponent.pettycashRequest.sort;
                this.pettycashRequest.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
            }
            this.getPettyCashRejectedReports(this.pettycashRequest);
        }
    }

    public clearFilter() {
        this.universalDate$.subscribe(res => {
            if (res) {
                this.universalFrom = moment(res[0]).format(GIDDH_DATE_FORMAT);
                this.universalTo = moment(res[1]).format(GIDDH_DATE_FORMAT);
                let universalDate = _.cloneDeep(res);
                this.selectedDateRange = { startDate: moment(res[0]), endDate: moment(res[1]) };
                this.selectedDateRangeUi = moment(res[0]).format(GIDDH_NEW_DATE_FORMAT_UI) + " - " + moment(res[1]).format(GIDDH_NEW_DATE_FORMAT_UI);
                this.fromDate = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                this.toDate = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
            }
            this.datePickerOptions = {
                ...this.datePickerOptions, startDate: res[0],
                endDate: res[1],
                chosenLabel: res[2]
            };
        });
        this.pettycashRequest.from = this.universalFrom;
        this.pettycashRequest.to = this.universalTo;
        this.pettycashRequest.sortBy = '';
        this.pettycashRequest.sort = '';
        this.pettycashRequest.page = 1;
        this.isFilterSelected = false;

        this.getPettyCashPendingReports(this.pettycashRequest);
        this.getPettyCashRejectedReports(this.pettycashRequest);
    }

    public tabChanged(tab: string, e) {
        this.setCurrentPageTitle(this._generalService.capitalizeFirstLetter(tab));
        if (e && !e.target) {
            this.saveLastState(tab);
        }

        if(tab === "pending" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
            this.rejectedTabSortOptions.sort = this.rejectedListComponent.pettycashRequest.sort;
            this.rejectedTabSortOptions.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
        } else if(tab === "rejected" && this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
            this.pendingTabSortOptions.sort = this.pendingListComponent.pettycashRequest.sort;
            this.pendingTabSortOptions.sortBy = this.pendingListComponent.pettycashRequest.sortBy;
        }

        this.currentSelectedTab = tab;

        setTimeout(() => {
            if(tab == "pending" && this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
                this.pendingListComponent.pettycashRequest.sort = this.pendingTabSortOptions.sort;
                this.pendingListComponent.pettycashRequest.sortBy = this.pendingTabSortOptions.sortBy;
            } else if(tab === "rejected" && this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
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

    public setCurrentPageTitle(title) {
        let currentPageObj = new CurrentPage();
        currentPageObj.name = "Petty Cash Management > " + title;
        currentPageObj.url = this.router.url;
        this.store.dispatch(this._generalActions.setPageTitle(currentPageObj));
    }

    public getActiveTab() {
        if (this.route.snapshot.queryParams.tab) {
            this.setCurrentPageTitle(this._generalService.capitalizeFirstLetter(this.route.snapshot.queryParams.tab));
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
        if(value && value.event === "cancel") {
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
            this.selectedDate.dateFrom = this.pettycashRequest.from;
            this.selectedDate.dateTo = this.pettycashRequest.to;
            this.isFilterSelected = true;

            if(this.pendingListComponent && this.pendingListComponent.pettycashRequest) {
                this.pettycashRequest.sort = this.pendingListComponent.pettycashRequest.sort;
                this.pettycashRequest.sortBy = this.pendingListComponent.pettycashRequest.sortBy;
            }
            this.getPettyCashPendingReports(this.pettycashRequest);

            if(this.rejectedListComponent && this.rejectedListComponent.pettycashRequest) {
                this.pettycashRequest.sort = this.rejectedListComponent.pettycashRequest.sort;
                this.pettycashRequest.sortBy = this.rejectedListComponent.pettycashRequest.sortBy;
            }
            this.getPettyCashRejectedReports(this.pettycashRequest);
        }
    }
}
