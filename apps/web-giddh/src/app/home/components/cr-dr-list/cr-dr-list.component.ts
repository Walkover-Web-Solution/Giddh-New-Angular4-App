import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import { Store} from "@ngrx/store";
import {AppState} from "../../../store";
import {ContactService} from "../../../services/contact.service";
import {takeUntil} from "rxjs/operators";
import {createSelector} from "reselect";
import * as moment from 'moment/moment';

@Component({
  selector: 'cr-dr-list',
  templateUrl: 'cr-dr-list.component.html',
  styleUrls: ['./cr-dr-list.component.scss', '../../home.component.scss'],
})

export class CrDrComponent implements OnInit, OnDestroy {
  public universalDate$: Observable<any>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public datePickerOptions: any;
  public moment = moment;
  public toDate: string;
  public fromDate: string;
  public crAccounts: any[] = [];
  public drAccounts: any[] = [];
  public showRecords: number = 5;
  public dueDate: any;

  constructor(private store: Store<AppState>, private _contactService: ContactService) {
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.store.select(createSelector([(states: AppState) => states.session.applicationDate], (dateObj: Date[]) => {
      if (dateObj) {
        let universalDate = _.cloneDeep(dateObj);
        this.datePickerOptions = {
          ...this.datePickerOptions, startDate: moment(universalDate[0], 'DD-MM-YYYY').toDate(),
          endDate: moment(universalDate[1], 'DD-MM-YYYY').toDate()
        };
        this.fromDate = moment(universalDate[0]).format('DD-MM-YYYY');
        this.toDate = moment(universalDate[1]).format('DD-MM-YYYY');

        this.dueDate = new Date(moment(universalDate[1]).format('YYYY-MM-DD'));
        this.getAccountsReport();
      }
    })).pipe(takeUntil(this.destroyed$)).subscribe();
  }

  private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string, sortBy: string = '', order: string = 'asc') {
    this.drAccounts = [];
    this.crAccounts = [];
    pageNumber = pageNumber ? pageNumber : 1;
    refresh = refresh ? refresh : 'false';

    this._contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order).subscribe((res) => {
      if (res.status === 'success') {
        if(groupUniqueName === "sundrydebtors") {
          this.drAccounts = res.body.results;
        }
        if(groupUniqueName === "sundrycreditors") {
          this.crAccounts = res.body.results;
        }
      }
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public getAccountsReport() {
    this.getAccounts(this.fromDate, this.toDate, 'sundrydebtors', null, null, 'true', this.showRecords, '', 'closingBalance', 'desc');
    this.getAccounts(this.fromDate, this.toDate, 'sundrycreditors', null, null, 'true', this.showRecords, '', 'closingBalance', 'desc');
  }

  public changeShowRecords(showRecords) {
    this.showRecords = showRecords;
    this.getAccountsReport();
  }

  public getFilterDate(dates: any) {
    if (dates !== null) {
      this.dueDate = new Date(dates[1].split("-").reverse().join("-"));
      this.fromDate = dates[0];
      this.toDate = dates[1];
      this.getAccountsReport();
    }
  }
}
