import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { Store, select } from '@ngrx/store';
import { ExpencesAction } from '../actions/expences/expence.action';
import { CommonPaginatedRequest } from '../models/api-models/Invoice';
import { ReplaySubject, Observable, of as observableOf, combineLatest as observableCombineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { createSelector } from 'reselect';
import { ExpenseResults } from '../models/api-models/Expences';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})

export class ExpensesComponent implements OnInit {
  public universalDate: Date[];
  public universalDate$: Observable<any>;
  public todaySelected: boolean = false;
  public isSelectedRow: boolean = false;
  public selectedRowItem: ExpenseResults = new ExpenseResults();
  public todaySelected$: Observable<boolean> = observableOf(false);
  public from: string;
  public to: string;
  public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


  constructor(private store: Store<AppState>,
    private _expenceActions: ExpencesAction,
    private _route: Router,
    private _toasty: ToasterService,
    private route: ActivatedRoute,
    private _cdRf: ChangeDetectorRef) {

    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    this.todaySelected$ = this.store.select(p => p.session.todaySelected).pipe(takeUntil(this.destroyed$));



  }

  public ngOnInit() {
    observableCombineLatest(this.universalDate$, this.route.params, this.todaySelected$).pipe(takeUntil(this.destroyed$)).subscribe((resp: any[]) => {
      if (!Array.isArray(resp[0])) {
        return;
      }
      let dateObj = resp[0];
      let params = resp[1];
      this.todaySelected = resp[2];
      if (dateObj && !this.todaySelected) {
        let universalDate = _.cloneDeep(dateObj);
        this.from = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
        this.to = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);
        if (this.from && this.to) {
          this.pettycashRequest.from = this.from;
          this.pettycashRequest.to = this.to;
          this.getPettyCashReports(this.pettycashRequest);
        }
      }
    });
  }
  public selectedRowToggle(e) {
    this.isSelectedRow = e;
  }
  public selectedRowInput(item: ExpenseResults) {
    this.selectedRowItem = item;
  }
  public closeDetailedMode(e) {
    this.isSelectedRow = !e;
  }

  public getPettyCashReports(SalesDetailedfilter: CommonPaginatedRequest) {
    this.store.dispatch(this._expenceActions.GetPettycashReportRequest(SalesDetailedfilter));
  }
}
