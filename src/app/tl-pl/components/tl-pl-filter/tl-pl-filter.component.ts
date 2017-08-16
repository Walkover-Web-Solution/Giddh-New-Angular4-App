import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import * as moment from 'moment';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { TlPlActions } from '../../../services/actions/tl-pl.actions';
import { TrialBalanceRequest } from '../../../models/api-models/tl-pl';
import { AppState } from '../../../store/roots';
import * as _ from 'lodash';
import { ComapnyResponse } from '../../../models/api-models/Company';

@Component({
  selector: 'tl-pl-filter',  // <home></home>
  templateUrl: './tl-pl-filter.component.html'
})
export class TlPlFilterComponent implements OnInit, OnDestroy {
  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate$: Observable<Date>;
  public fromDate$: Observable<Date>;
  public today: Date = new Date();
  public selectedDateOption: string = '1';
  public selectedFinancialYearOption: string = '';
  public financialOptions = [];
  // public financialYears:
  public options: Select2Options = {
    multiple: false,
    width: '200px',
    placeholder: 'Select Option',
    allowClear: true
  };
  public dateOptions: any[] = [{ text: 'Date Range', id: 1 }, { text: 'Financial Year', id: 0 }];
  public set toDate(value: Date) {
    this.store.dispatch(this.tlPlActions.SetDate(this.convertToDate(this.request.fromDate), value));
  }

  public set fromDate(value: Date) {
    this.store.dispatch(this.tlPlActions.SetDate(value, this.convertToDate(this.request.toDate)));
  }

  // public fromDate: Date;
  public moment = moment;
  public request: TrialBalanceRequest = {};
  private selectedCompany: ComapnyResponse;

  /**
   * TypeScript public modifiers
   */
  constructor(private fb: FormBuilder, private store: Store<AppState>, public tlPlActions: TlPlActions) {
    this.store.select(p => p.company.companies && p.company.companies.find(q => q.uniqueName === p.session.companyUniqueName)).subscribe(p => {
      this.selectedCompany = p;
      if (p) {
        this.financialOptions = p.financialYears.map(q => {
          return { text: q.uniqueName, id: q.uniqueName };
        });
        this.selectedFinancialYearOption = this.selectedCompany.activeFinancialYear.uniqueName;
        this.request = {
          refresh: false,
          fromDate: this.selectedCompany.activeFinancialYear.financialYearStarts,
          toDate: this.selectedCompany.activeFinancialYear.financialYearEnds
        };
        // this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(this.request)));
      }
    });
    this.toDate$ = this.store.select(p => p.tlPl.toDate);
    this.fromDate$ = this.store.select(p => p.tlPl.fromDate);
    this.toDate$.subscribe(p => this.request.toDate = this.convertToString(p));
    this.fromDate$.subscribe(p => this.request.fromDate = this.convertToString(p));
  }

  public ngOnInit() {
    //
  }

  public ngOnDestroy() {
    //
  }
  public selectDateOption(v) {
    this.selectedDateOption = v.value || '';
  }
  public selectFinancialYearOption(v) {
    this.selectedFinancialYearOption = v.value || '';
    debugger;
    let financialYear = this.selectedCompany.financialYears.find(p => p.uniqueName === this.selectedFinancialYearOption);
    this.toDate = moment(financialYear.financialYearEnds, 'DD-MM-YYYY').toDate();
    this.fromDate = moment(financialYear.financialYearStarts, 'DD-MM-YYYY').toDate();
    this.store.dispatch(this.tlPlActions.SetDate(this.fromDate, this.toDate));
    // this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(this.request)));

  }
  public filterData() {
    debugger;
    this.store.dispatch(this.tlPlActions.SetDate(this.fromDate, this.toDate));
    this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(this.request)));
  }

  public convertToDate(str: string, format: string = 'DD-MM-YYYY'): Date {
    return this.moment(str, format).toDate();
  }

  public convertToString(date: Date, format: string = 'DD-MM-YYYY'): string {
    return moment(date).format(format);
  }

}
