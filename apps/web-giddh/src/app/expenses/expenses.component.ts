import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter, TemplateRef, } from '@angular/core';
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
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


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
  public unaiversalFrom: string;
  public unaiversalTo: string;
  public modalRef: BsModalRef;
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
  }


  constructor(private store: Store<AppState>,
    private _expenceActions: ExpencesAction,
    private _route: Router,
    private _toasty: ToasterService,
    private route: ActivatedRoute,
    private modalService: BsModalService,
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
        this.unaiversalFrom = moment(universalDate[0]).format(GIDDH_DATE_FORMAT);
        this.unaiversalTo = moment(universalDate[1]).format(GIDDH_DATE_FORMAT);

        this.datePickerOptions = {
          ...this.datePickerOptions,
          startDate: moment(universalDate[0], 'DD-MM-YYYY').toDate(),
          endDate: moment(universalDate[1], 'DD-MM-YYYY').toDate()
        };
        if (this.unaiversalFrom && this.unaiversalTo) {
          this.pettycashRequest.from = this.unaiversalFrom;
          this.pettycashRequest.to = this.unaiversalTo;
          this.pettycashRequest.page = 1;
          this.selectedDate.dateFrom = this.pettycashRequest.from;
          this.selectedDate.dateTo = this.pettycashRequest.to;
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
  public selectedDetailedRowInput(item: ExpenseResults) {
    this.selectedRowItem = item;
  }
  public closeDetailedMode(e) {
    this.isSelectedRow = !e;
  }

  // public getPettyCashReports(SalesDetailedfilter: CommonPaginatedRequest) {
  //   this.store.dispatch(this._expenceActions.GetPettycashReportRequest(SalesDetailedfilter));
  // }
  public openModal(filterModal: TemplateRef<any>) {
    this.modalRef = this.modalService.show(filterModal, { class: 'modal-md' });
  }
  public bsValueChange(event: any) {
    if (event) {
      this.pettycashRequest.from = moment(event.picker.startDate._d).format(GIDDH_DATE_FORMAT);
      this.pettycashRequest.to = moment(event.picker.endDate._d).format(GIDDH_DATE_FORMAT);
      this.selectedDate.dateFrom = this.pettycashRequest.from;
      this.selectedDate.dateTo = this.pettycashRequest.to;
    }
  }
  public clearFilter() {
    this.selectedDate.dateFrom = this.unaiversalFrom;
    this.selectedDate.dateTo = this.unaiversalTo;

    this.datePickerOptions = {
      ...this.datePickerOptions, startDate: this.unaiversalFrom,
      endDate: this.unaiversalTo
    };

  }
}
