import { Component, OnInit, ChangeDetectorRef, } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { ToasterService } from '../../../services/toaster.service';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject, Observable } from 'rxjs';
import { ExpenseResults, PettyCashReportResponse } from '../../../models/api-models/Expences';
import { CommonPaginatedRequest } from '../../../models/api-models/Invoice';
import { ExpenseService } from '../../../services/expences.service';

@Component({
  selector: 'app-rejected-list',
  templateUrl: './rejected-list.component.html',
  styleUrls: ['./rejected-list.component.scss'],
})

export class RejectedListComponent implements OnInit {
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public pettycashRequest: CommonPaginatedRequest = new CommonPaginatedRequest();

  public expensesItems: ExpenseResults[];
  public expensesItems$: Observable<ExpenseResults[]>;
  public pettyCashReportsResponse$: Observable<PettyCashReportResponse>;
  public getPettycashReportInprocess$: Observable<boolean>;
  public getPettycashReportSuccess$: Observable<boolean>;
  RejectedItem = [
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Stationery A/c', dotWarning: 'dot-warning', dotPrimary: '', dotSuccess: '', amount: 1400, payment: 'ICICI A/c',
    //   card: '', cash: 'icon-cash', File: 'attach file', FileIcon: 'icon-file-path', ImgeIcon: '', ImgePath: '', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: ''
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Fuel A/c', dotWarning: '', dotPrimary: 'dot-primary', dotSuccess: '', amount: 1400, payment: 'Cash A/c',
    //   card: '', cash: 'icon-cash', File: '', FileIcon: '', ImgeIcon: 'icon-image', ImgePath: 'sampleimage.jpg', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: ''
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Stationery A/c', dotWarning: 'dot-warning', dotPrimary: '', dotSuccess: '', amount: 1400, payment: 'SBI A/c',
    //   card: 'icon-atm-card', cash: '', File: '', FileIcon: '', ImgeIcon: '', ImgePath: '', multipleIcon: 'icon-folder-group', multiple: 'Multiple', description: 'Dummy text sample test', Action: ''
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Fuel A/c', dotWarning: '', dotPrimary: 'dot-primary', dotSuccess: '', amount: 1400, payment: 'Cash A/c',
    //   card: '', cash: 'icon-cash', File: 'attach file', FileIcon: 'icon-file-path', ImgeIcon: '', ImgePath: '', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: ''
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Others', dotWarning: '', dotPrimary: 'dot-primary', dotSuccess: '', amount: 1400, payment: 'ICICI A/c',
    //   card: 'icon-atm-card', cash: '', File: '', FileIcon: '', ImgeIcon: 'icon-image', ImgePath: 'sampleimage.jpg', multipleIcon: '', multiple: '', description: 'Dummy text sample test', Action: ''
    // },
    // {
    //   date: '29-07-2019', SubmittedBy: 'Pratik Piplode', account: 'Money Request', dotWarning: '', dotPrimary: '', dotSuccess: 'dot-success', amount: 1400, payment: 'Cash A/c',
    //   card: '', cash: 'icon-cash', File: '', FileIcon: '', ImgeIcon: '', ImgePath: '', multipleIcon: 'icon-folder-group', multiple: 'Multiple', description: 'Dummy text sample test', Action: ''
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
  ]

  constructor(private store: Store<AppState>,
    private _expenceActions: ExpencesAction,
    private _route: Router,
    private _toasty: ToasterService,
    private _cdRf: ChangeDetectorRef,
    private expenseService: ExpenseService) {

    this.pettyCashReportsResponse$ = this.store.select(p => p.expense.pettycashReport).pipe(takeUntil(this.destroyed$));
    this.getPettycashReportInprocess$ = this.store.select(p => p.expense.getPettycashReportInprocess).pipe(takeUntil(this.destroyed$));
    this.getPettycashReportSuccess$ = this.store.select(p => p.expense.getPettycashReportSuccess).pipe(takeUntil(this.destroyed$));

  }

  public ngOnInit() {
    this.pettycashRequest.status = 'rejected';
    this.pettyCashReportsResponse$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        this.expensesItems = res.results;
      }
    })
  }

  // public revertActionClicked(item: ExpenseResults) {
  //   // console.log(item);
  //   let actionType = { action: 'revert' };
  //   this.expenseService.actionPettycashReports(item.uniqueName, actionType).subscribe(res => {
  //     if (res.status === 'success') {
  //       this._toasty.successToast('reverted successfully');
  //     } else {
  //       this._toasty.successToast(res.message);
  //     }
  //   });
  // }
  // public deleteActionClicked(item: ExpenseResults) {
  //   // console.log(item);
  //   let actionType = { action: 'delete' };
  //   this.expenseService.actionPettycashReports(item.uniqueName, actionType).subscribe(res => {
  //     if (res.status === 'success') {
  //       this._toasty.successToast('entry deleted successfully');
  //     } else {
  //       this._toasty.successToast(res.message);
  //     }
  //   });
  // }
}
