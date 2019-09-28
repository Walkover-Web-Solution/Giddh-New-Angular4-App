import { Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../store';
import { ToasterService } from '../services/toaster.service';
import { Store, select } from '@ngrx/store';
import { ExpencesAction } from '../actions/expences/expence.action';
import { CommonPaginatedRequest } from '../models/api-models/Invoice';
import { ReplaySubject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../shared/helpers/defaultDateFormat';
import { createSelector } from 'reselect';


@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
})

export class ExpensesComponent implements OnInit {
  public universalDate: Date[];
  public universalDate$: Observable<any>;
  public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
    private _expenceActions: ExpencesAction,
    private _route: Router,
    private _toasty: ToasterService,
    private _cdRf: ChangeDetectorRef) {
    this.universalDate$ = this.store.pipe(select(p => p.session.applicationDate), takeUntil(this.destroyed$));

    // this.pettycashRequest.from = '';
    // this.pettycashRequest.to = '';


  }

  public ngOnInit() {
    this.universalDate$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
      let ss = a;
      this.pettycashRequest.from = moment(a[0]).format(GIDDH_DATE_FORMAT);
      this.pettycashRequest.to = moment(a[1]).format(GIDDH_DATE_FORMAT);
    });

    this.getPettyCashReports(this.pettycashRequest);
  }

  public getPettyCashReports(SalesDetailedfilter) {
    this.store.dispatch(this._expenceActions.GetPettycashReportRequest(SalesDetailedfilter));
  }
}
