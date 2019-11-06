import { Component, OnInit, TemplateRef, ChangeDetectorRef, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
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

export class FilterListComponent implements OnInit, OnChanges {

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

  public pettyCashReportsResponse$: Observable<PettyCashReportResponse>;
  public getPettycashReportInprocess$: Observable<boolean>;
  public expensesDetailedItems: ExpenseResults[];
  public expensesDetailedItems$: Observable<ExpenseResults[]>;
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  @Input() public selectedRowItem: string;
  @Output() public selectedDetailedRowInput: EventEmitter<ExpenseResults> = new EventEmitter();

  public selectedItem: ExpenseResults;


  constructor(private store: Store<AppState>,
    private _expenceActions: ExpencesAction,
    private expenseService: ExpenseService,
    private _route: Router,
    private route: ActivatedRoute,
    private _toasty: ToasterService,
    private _cdRf: ChangeDetectorRef) {
    this.pettyCashReportsResponse$ = this.store.select(p => p.expense.pettycashReport).pipe(takeUntil(this.destroyed$));
    this.getPettycashReportInprocess$ = this.store.select(p => p.expense.getPettycashReportInprocess).pipe(takeUntil(this.destroyed$));
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
  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedRowItem']) {
      this.selectedItem = changes['selectedRowItem'].currentValue;
    }

  }
  public rowClicked(item: ExpenseResults) {
    this.selectedItem = item;
    this.selectedDetailedRowInput.emit(item);
    // this.store.dispatch(this._expenceActions.getPettycashEntryRequest(item.uniqueName));
  }
}
