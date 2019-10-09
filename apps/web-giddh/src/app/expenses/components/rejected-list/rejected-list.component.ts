import { Component, OnInit, ChangeDetectorRef, OnChanges, Input, SimpleChanges, } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { ToasterService } from '../../../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject, Observable, combineLatest as observableCombineLatest, of as observableOf } from 'rxjs';
import { ExpenseResults, PettyCashReportResponse, ActionPettycashRequest } from '../../../models/api-models/Expences';
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
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();

  public RejectedItems: ExpenseResults[] = [];
  public totalRejectedResponse: PettyCashReportResponse;
  public expensesItems$: Observable<ExpenseResults[]>;
  public pettycashRejectedReportResponse$: Observable<PettyCashReportResponse>;
  public getPettycashReportInprocess$: Observable<boolean>;
  public getPettycashReportSuccess$: Observable<boolean>;
  public universalDate$: Observable<any>;
  public todaySelected: boolean = false;
  public todaySelected$: Observable<boolean> = observableOf(false);
  public key: string = 'entry_date';
  public order: string = 'asc';
  public actionPettycashRequest: ActionPettycashRequest = new ActionPettycashRequest();
  @Input() public dateFrom: string;
  @Input() public dateTo: string;
  @Input() public isClearFilter: boolean = false;

  constructor(private store: Store<AppState>,
    private _expenceActions: ExpencesAction,
    private _route: Router,
    private _toasty: ToasterService,
    private _cdRf: ChangeDetectorRef,
    private expenseService: ExpenseService) {
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    this.todaySelected$ = this.store.select(p => p.session.todaySelected).pipe(takeUntil(this.destroyed$));
    this.pettycashRejectedReportResponse$ = this.store.select(p => p.expense.pettycashRejectedReport).pipe(takeUntil(this.destroyed$));
    this.getPettycashReportInprocess$ = this.store.select(p => p.expense.getPettycashReportInprocess).pipe(takeUntil(this.destroyed$));
    this.getPettycashReportSuccess$ = this.store.select(p => p.expense.getPettycashReportSuccess).pipe(takeUntil(this.destroyed$));

    observableCombineLatest(this.universalDate$, this.todaySelected$).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
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
          if (from && to) {
            this.getPettyCashRejectedReports(this.pettycashRequest);
          }
        }
      }
    });
  }

  public ngOnInit() {
    // console.log('rejected Dtaes', this.dateFrom, this.dateTo);
    // this.expenseService.getPettycashReports(this.pettycashRequest).subscribe(res => {
    //   console.log('rejected item', res);
    // });

  }
  public getPettyCashRejectedReports(SalesDetailedfilter: CommonPaginatedRequest) {
    this.expenseService.getPettycashReports(SalesDetailedfilter).subscribe(res => {
      if (res.status === 'success') {
        this.totalRejectedResponse = res.body;
        this.RejectedItems = res.body.results;
      }
    });
  }
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['dateFrom']) {
      this.pettycashRequest.from = changes['dateFrom'].currentValue;
    } else if (changes['dateTo']) {
      this.pettycashRequest.to = changes['dateTo'].currentValue;
    } else if (changes['isClearFilter']) {
      if (changes['isClearFilter'].currentValue) {
        this.pettycashRequest.sort = '';
        this.pettycashRequest.sortBy = '';
        this.pettycashRequest.page = 1;
      }
    }
    if (this.pettycashRequest.from && this.pettycashRequest.to) {
      this.getPettyCashRejectedReports(this.pettycashRequest);
    }
  }
  public revertActionClicked(item: ExpenseResults) {
    this.actionPettycashRequest.actionType = 'revert';
    this.actionPettycashRequest.uniqueName = item.uniqueName;
    this.expenseService.actionPettycashReports(this.actionPettycashRequest, {}).subscribe(res => {
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
    this.actionPettycashRequest.uniqueName = item.uniqueName;;
    this.expenseService.actionPettycashReports(this.actionPettycashRequest, {}).subscribe(res => {
      if (res.status === 'success') {
        this._toasty.successToast(res.body);
        this.getPettyCashRejectedReports(this.pettycashRequest);
      } else {
        this._toasty.successToast(res.message);
      }
    });
  }
  public sort(key: string, ord: 'asc' | 'desc' = 'asc') {
    this.pettycashRequest.sortBy = key;
    this.pettycashRequest.sort = ord;
    this.key = key;
    this.order = ord;
    this.getPettyCashRejectedReports(this.pettycashRequest);
  }
}
