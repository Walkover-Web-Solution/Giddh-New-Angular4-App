import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../store';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { ToasterService } from '../../../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { combineLatest as observableCombineLatest, Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { ActionPettycashRequest, ExpenseResults, PettyCashReportResponse } from '../../../models/api-models/Expences';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';
import { ExpenseService } from '../../../services/expences.service';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';
import * as moment from 'moment/moment';

@Component({
    selector: 'app-rejected-list',
    templateUrl: './rejected-list.component.html',
    styleUrls: ['./rejected-list.component.scss'],
})

export class RejectedListComponent implements OnInit, OnChanges {
    /* This will hold local JSON data */
    @Input() public localeData: any = {};
    /* This will hold common JSON data */
    @Input() public commonLocaleData: any = {};
    public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();

    public RejectedItems: ExpenseResults[] = [];
    public totalRejectedResponse: PettyCashReportResponse;
    public expensesItems$: Observable<ExpenseResults[]>;
    public pettycashRejectedReportResponse$: Observable<PettyCashReportResponse>;
    public getPettycashRejectedReportInprocess$: Observable<boolean>;
    public getPettycashRejectedReportSuccess$: Observable<boolean>;
    public universalDate$: Observable<any>;
    public todaySelected: boolean = false;
    public todaySelected$: Observable<boolean> = observableOf(false);
    public actionPettycashRequest: ActionPettycashRequest = new ActionPettycashRequest();
    @Input() public isClearFilter: boolean = false;
    @Output() public isFilteredSelected: EventEmitter<boolean> = new EventEmitter();

    constructor(private store: Store<AppState>,
        private _expenceActions: ExpencesAction,
        private _toasty: ToasterService,
        private _cdRf: ChangeDetectorRef,
        private expenseService: ExpenseService) {
        this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));
        this.todaySelected$ = this.store.pipe(select(p => p.session.todaySelected), takeUntil(this.destroyed$));
        this.pettycashRejectedReportResponse$ = this.store.pipe(select(p => p.expense.pettycashRejectedReport), takeUntil(this.destroyed$));
        this.getPettycashRejectedReportInprocess$ = this.store.pipe(select(p => p.expense.getPettycashRejectedReportInprocess), takeUntil(this.destroyed$));
        this.getPettycashRejectedReportSuccess$ = this.store.pipe(select(p => p.expense.getPettycashRejectedReportSuccess), takeUntil(this.destroyed$));

        observableCombineLatest([this.universalDate$, this.todaySelected$]).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
            if (!Array.isArray(resp[0])) {
                return;
            }
            let dateObj = resp[0];
            this.todaySelected = resp[1];
            if (dateObj && !this.todaySelected) {
                let universalDate = _.cloneDeep(dateObj);
                let from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
                let to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
                if (from && to) {
                    this.pettycashRequest.from = from;
                    this.pettycashRequest.to = to;
                    this.pettycashRequest.page = 1;
                    this.pettycashRequest.status = 'rejected';
                }
            }
        });
    }

    public ngOnInit() {
        this.pettycashRejectedReportResponse$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res) {
                this.totalRejectedResponse = res;
                this.RejectedItems = res.results;
                setTimeout(() => {
                    this.detectChanges();
                }, 400);
            }
        });

    }

    public getPettyCashRejectedReports(SalesDetailedfilter: CommonPaginatedRequest) {
        SalesDetailedfilter.status = 'rejected';
        SalesDetailedfilter.sort = this.pettycashRequest.sort;
        SalesDetailedfilter.sortBy = this.pettycashRequest.sortBy;
        this.store.dispatch(this._expenceActions.GetPettycashRejectedReportRequest(SalesDetailedfilter));

    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes['isClearFilter']) {
            if (changes['isClearFilter'].currentValue) {
                this.clearFilter();
            }
        }
    }

    public clearFilter() {
        this.pettycashRequest.sort = '';
        this.pettycashRequest.sortBy = '';
        this.pettycashRequest.page = 1;
    }

    public revertActionClicked(item: ExpenseResults) {
        this.actionPettycashRequest.actionType = 'revert';
        this.actionPettycashRequest.uniqueName = item.uniqueName;
        this.expenseService.actionPettycashReports(this.actionPettycashRequest, {}).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res.status === 'success') {
                this._toasty.successToast(res.body);
                this.getPettyCashRejectedReports(this.pettycashRequest);
                this.getPettyCashPendingReports(this.pettycashRequest);
            } else {
                this._toasty.successToast(res.message);
            }
        });
    }

    public getPettyCashPendingReports(SalesDetailedfilter: CommonPaginatedRequest) {
        SalesDetailedfilter.status = 'pending';
        this.store.dispatch(this._expenceActions.GetPettycashReportRequest(SalesDetailedfilter));
    }

    public deleteActionClicked(item: ExpenseResults) {
        this.actionPettycashRequest.actionType = 'delete';
        this.actionPettycashRequest.uniqueName = item.uniqueName;
        this.expenseService.actionPettycashReports(this.actionPettycashRequest, {}).pipe(takeUntil(this.destroyed$)).subscribe(res => {
            if (res.status === 'success') {
                this._toasty.successToast(res.body);
                this.getPettyCashRejectedReports(this.pettycashRequest);
            } else {
                this._toasty.successToast(res.message);
            }
        });
    }

    public sort(ord: 'asc' | 'desc' = 'asc', key: string) {
        this.pettycashRequest.sortBy = key;
        this.pettycashRequest.sort = ord;
        this.getPettyCashRejectedReports(this.pettycashRequest);
    }

    public pageChanged(ev: any): void {
        if (ev.page === this.pettycashRequest.page) {
            return;
        }
        this.pettycashRequest.page = ev.page;
        this.getPettyCashPendingReports(this.pettycashRequest);
    }

    detectChanges() {
        if (!this._cdRf['destroyed']) {
            this._cdRf.detectChanges();
        }
    }

    /**
     * This will replace the search field title
     *
     * @param {string} title
     * @returns {string}
     * @memberof RejectedListComponent
     */
    public replaceTitle(title: string): string {
        if (this.localeData && this.localeData?.search_field) {
            return this.localeData?.search_field.replace("[FIELD]", title);
        } else {
            return title;
        }
    }

    /**
     * Releases memory
     *
     * @memberof RejectedListComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
