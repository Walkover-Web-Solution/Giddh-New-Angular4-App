import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { ComapnyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../services/actions/tl-pl.actions';
import { AccountDetails, TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'tb',
  template: `
    <tb-pl-bs-filter
      #filter
      [selectedCompany]="selectedCompany"
      [showLoader]="showLoader | async"
      [showLabels]="true"
      (onPropertyChanged)="filterData($event)"
    ></tb-pl-bs-filter>
    <tb-grid
      [expandAll]="filter.expandAll"
      [showLoader]="showLoader | async"
      [data$]="data$"
    ></tb-grid>
  `
})
export class TbComponent implements OnInit, AfterViewInit, OnDestroy {
  public showLoader: Observable<boolean>;
  public data$: Observable<AccountDetails>;
  public request: TrialBalanceRequest;

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

  private _selectedCompany: ComapnyResponse;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, public tlPlActions: TBPlBsActions) {
    this.showLoader = this.store.select(p => p.tlPl.tb.showLoader).takeUntil(this.destroyed$);
    this.data$ = this.store.select(p => _.cloneDeep(p.tlPl.tb.data)).takeUntil(this.destroyed$);
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

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
