import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ComapnyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../services/actions/tl-pl.actions';
import { TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import * as _ from 'lodash';

@Component({
  selector: 'pl',
  template: `
    <tb-pl-bs-filter #filter [selectedCompany]="selectedCompany"
                     (onPropertyChanged)="filterData($event)"></tb-pl-bs-filter>
    <pl-grid [expandAll]="filter.expandAll"></pl-grid>
  `
})
export class PlComponent implements OnInit, AfterViewInit {

  public get selectedCompany(): ComapnyResponse {
    return this._selectedCompany;
  }

  // set company and fetch data...
  @Input()
  public set selectedCompany(value: ComapnyResponse) {
    this._selectedCompany = value;
    if (value) {
      this.request = {
        refresh: false,
        fromDate: this.selectedCompany.activeFinancialYear.financialYearStarts,
        toDate: this.selectedCompany.activeFinancialYear.financialYearEnds
      };
      this.filterData(this.request);
    }
  }

  public request: TrialBalanceRequest;
  private _selectedCompany: ComapnyResponse;

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, public tlPlActions: TBPlBsActions) {
  }

  public ngOnInit() {
    console.log('hello Tb Component');
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public filterData(request: TrialBalanceRequest) {
    this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(request)));

  }
}
