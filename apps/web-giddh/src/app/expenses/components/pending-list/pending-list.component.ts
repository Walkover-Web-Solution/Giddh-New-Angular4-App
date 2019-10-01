import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output, } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { ToasterService } from '../../../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject, Observable, combineLatest as observableCombineLatest, of as observableOf } from 'rxjs';
import { ExpenseResults, PettyCashReportResponse, ActionPettycashRequest, ExpenseActionRequest } from '../../../models/api-models/Expences';
import { ExpenseService } from '../../../services/expences.service';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';
import * as moment from 'moment/moment';
import { GIDDH_DATE_FORMAT } from '../../../shared/helpers/defaultDateFormat';


@Component({
  selector: 'app-pending-list',
  templateUrl: './pending-list.component.html',
  styleUrls: ['./pending-list.component.scss'],
})

export class PendingListComponent implements OnInit {

  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public expensesItems: ExpenseResults[];
  public expensesItems$: Observable<ExpenseResults[]>;
  public pettyCashReportsResponse$: Observable<PettyCashReportResponse>;
  public getPettycashReportInprocess$: Observable<boolean>;
  public getPettycashReportSuccess$: Observable<boolean>;
  public universalDate$: Observable<any>;
  public todaySelected: boolean = false;
  public todaySelected$: Observable<boolean> = observableOf(false);
  public from: string;
  public to: string;

  public isRowExpand: boolean = false;
  public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();
  @Output() public selectedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();
  @Output() public selectedRowToggle: EventEmitter<boolean> = new EventEmitter();
  public actionPettyCashRequestBody: ExpenseActionRequest = new ExpenseActionRequest();


  public expensesItem = [
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Stationery A/c', dotWarning: 'dot-warning', dotPrimary: '', dotSuccess: '', amount: 1400, payment: 'ICICI A/c',
    //   card: '', cash: 'icon-cash', File: 'attach file', FileIcon: 'icon-file-path', ImgeIcon: '', ImgePath: '', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: '', status: "pending"
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Fuel A/c', dotWarning: '', dotPrimary: 'dot-primary', dotSuccess: '', amount: 1400, payment: 'Cash A/c',
    //   card: '', cash: 'icon-cash', File: '', FileIcon: '', ImgeIcon: 'icon-image', ImgePath: 'sampleimage.jpg', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: '', status: "pending"
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Stationery A/c', dotWarning: 'dot-warning', dotPrimary: '', dotSuccess: '', amount: 1400, payment: 'SBI A/c',
    //   card: 'icon-atm-card', cash: '', File: '', FileIcon: '', ImgeIcon: '', ImgePath: '', multipleIcon: 'icon-folder-group', multiple: 'Multiple', description: 'Dummy text sample test', Action: '', status: "pending"
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Fuel A/c', dotWarning: '', dotPrimary: 'dot-primary', dotSuccess: '', amount: 1400, payment: 'Cash A/c',
    //   card: '', cash: 'icon-cash', File: 'attach file', FileIcon: 'icon-file-path', ImgeIcon: '', ImgePath: '', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: '', status: "pending"
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Others', dotWarning: '', dotPrimary: 'dot-primary', dotSuccess: '', amount: 1400, payment: 'ICICI A/c',
    //   card: 'icon-atm-card', cash: '', File: '', FileIcon: '', ImgeIcon: 'icon-image', ImgePath: 'sampleimage.jpg', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: '', status: "pending"
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Money Request', dotWarning: '', dotPrimary: '', dotSuccess: 'dot-success', amount: 1400, payment: 'Cash A/c',
    //   card: '', cash: 'icon-cash', File: '', FileIcon: '', ImgeIcon: '', ImgePath: '', multipleIcon: 'icon-folder-group', multiple: 'Multiple', description: 'Dummy text sample test', Action: '', status: "pending"
    // },
    {
      entryDate: "02-09-2019",
      uniqueName: "zkn1569595169090",
      createdBy: {
        name: "Arpit Ajmera",
        uniqueName: "arpit@walkover.in"
      },
      currencySymbol: "₹",
      amount: 200,
      baseAccount: {
        name: "Cash",
        uniqueName: "cash"
      },
      particularAccount: {
        name: "Purchases",
        uniqueName: "purchases"
      },
      fileNames: null,
      description: "Newi idfdf sdsd",
      status: "pending",
      statusMessage: null
    },
    {
      entryDate: "02-09-2019",
      uniqueName: "zkn1569595169090",
      createdBy: {
        name: "Arpit Ajmera",
        uniqueName: "arpit@walkover.in"
      },
      currencySymbol: "₹",
      amount: 200,
      baseAccount: {
        name: "Cash",
        uniqueName: "cash"
      },
      particularAccount: {
        name: "Purchases",
        uniqueName: "purchases"
      },
      fileNames: null,
      description: "Newi idfdf sdsd",
      status: "pending",
      statusMessage: null
    },
    {
      entryDate: "02-09-2019",
      uniqueName: "zkn1569595169090",
      createdBy: {
        name: "Arpit Ajmera",
        uniqueName: "arpit@walkover.in"
      },
      currencySymbol: "₹",
      amount: 200,
      baseAccount: {
        name: "Cash",
        uniqueName: "cash"
      },
      particularAccount: {
        name: "Purchases",
        uniqueName: "purchases"
      },
      fileNames: null,
      description: "Newi idfdf sdsd",
      status: "pending",
      statusMessage: null
    }
  ];

  constructor(private store: Store<AppState>,
    private _expenceActions: ExpencesAction,
    private expenseService: ExpenseService,
    private _route: Router,
    private route: ActivatedRoute,
    private _toasty: ToasterService,
    private _cdRf: ChangeDetectorRef) {
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
    this.todaySelected$ = this.store.select(p => p.session.todaySelected).pipe(takeUntil(this.destroyed$));
    this.pettyCashReportsResponse$ = this.store.select(p => p.expense.pettycashReport).pipe(takeUntil(this.destroyed$));
    this.getPettycashReportInprocess$ = this.store.select(p => p.expense.getPettycashReportInprocess).pipe(takeUntil(this.destroyed$));
    this.getPettycashReportSuccess$ = this.store.select(p => p.expense.getPettycashReportSuccess).pipe(takeUntil(this.destroyed$));
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
          this.pettycashRequest.status = 'pending';
          this.getPettyCashPendingReports(this.pettycashRequest);
        }
      }
    });
  }

  public ngOnInit() {

    this.pettyCashReportsResponse$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        this.expensesItems = res.results;
      }
    });
  }
  public approvedActionClicked(item: ExpenseResults) {
    let actionType: ActionPettycashRequest = {
      actionType: 'approve',
      uniqueName: item.uniqueName
    };
    this.expenseService.actionPettycashReports(actionType, this.actionPettyCashRequestBody).subscribe(res => {
      if (res.status === 'success') {
        this._toasty.successToast('reverted successfully');
      } else {
        this._toasty.successToast(res.message);
      }
    });
  }
  public getPettyCashPendingReports(SalesDetailedfilter: CommonPaginatedRequest) {
    this.store.dispatch(this._expenceActions.GetPettycashReportRequest(SalesDetailedfilter));
  }
  public rowClicked(item: ExpenseResults) {
    this.isRowExpand = true;
    this.selectedRowInput.emit(item);
    this.selectedRowToggle.emit(true);


  }

}
