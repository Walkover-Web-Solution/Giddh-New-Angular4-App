import { Component, OnInit, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { ExpencesAction } from '../../../actions/expences/expence.action';
import { ExpenseService } from '../../../services/expences.service';
import { ToasterService } from '../../../services/toaster.service';
import { Observable, ReplaySubject } from 'rxjs';
import { PettyCashReportResponse, ExpenseResults } from '../../../models/api-models/Expences';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.scss'],
})

export class FilterListComponent implements OnInit {

  filterItems = [
    { filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: 'icon-cash', card: 'icon-atm-card', imgIcon: '', multiple: '' },
    { filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: '', imgIcon: 'icon-image', multiple: '' },
    { filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: 'icon-cash', card: '', imgIcon: '', multiple: '' },
    { filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: 'icon-atm-card', imgIcon: 'icon-image', multiple: '' },
    { filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: 'icon-atm-card', imgIcon: '', multiple: '' },
    { filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: 'icon-cash', card: '', imgIcon: '', multiple: 'icon-folder-group' },
    { filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: 'icon-atm-card', imgIcon: 'icon-image', multiple: '' },
    { filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: 'icon-cash', card: 'icon-atm-card', imgIcon: '', multiple: '' },
    { filterDate: '03 Oct 2018', clientName: 'Pratik Piplode', ACType: 'Stationery A/c', amount: 15200.00, cash: '', card: 'icon-atm-card', imgIcon: 'icon-image', multiple: '' },
  ];
  public monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  public modalRef: BsModalRef;
  public message: string;
  public pettyCashReportsResponse$: Observable<PettyCashReportResponse>;
  public getPettycashReportInprocess$: Observable<boolean>;
  public expensesDetailedItems: ExpenseResults[];
  public expensesDetailedItems$: Observable<ExpenseResults[]>;
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>,
    // private modalService: BsModalService,
    private _expenceActions: ExpencesAction,
    private expenseService: ExpenseService,
    private _route: Router,
    private route: ActivatedRoute,
    private _toasty: ToasterService,
    private _cdRf: ChangeDetectorRef) {
    this.pettyCashReportsResponse$ = this.store.select(p => p.expense.pettycashReport).pipe(takeUntil(this.destroyed$));
    this.getPettycashReportInprocess$ = this.store.select(p => p.expense.getPettycashReportInprocess).pipe(takeUntil(this.destroyed$));
  }

  // openModal(filterModal: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(filterModal, { class: 'modal-md' });
  // }

  confirm(): void {
    this.message = 'Confirmed!';
    this.modalRef.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.modalRef.hide();
  }

  public ngOnInit() {
    this.pettyCashReportsResponse$.pipe(takeUntil(this.destroyed$)).subscribe(res => {
      if (res) {
        this.expensesDetailedItems = res.results;
      }
      if (this.expensesDetailedItems.length > 0) {
        _.map(this.expensesDetailedItems, (resp: ExpenseResults) => {
          resp.entryDate = this.getDateToDMY(resp.entryDate);
        })
      }
      console.log('this.expensesDetailedItems', this.expensesDetailedItems);
    });
  }
  public getDateToDMY(selecteddate) {
    let date = selecteddate.split('-');
    if (date.length === 3) {
      let month = this.monthNames[parseInt(date[1]) - 1].substr(0, 3);
      let year = date[2].substr(0, 4);
      return date[0] + ' ' + month + ' ' + year;
    } else {
      return selecteddate;
    }

  }
}
