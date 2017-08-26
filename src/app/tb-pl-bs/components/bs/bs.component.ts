import { Store } from '@ngrx/store';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ComapnyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../services/actions/tl-pl.actions';
import { ProfitLossData, ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BsGridComponent } from './bs-grid/bs-grid.component';

@Component({
  selector: 'bs',
  template: `
    <tb-pl-bs-filter
      #filter
      [selectedCompany]="selectedCompany"
      (onPropertyChanged)="filterData($event)"
      [showLoader]="showLoader | async"
      (expandAll)="expandAllEmit($event)"
    ></tb-pl-bs-filter>
    <div *ngIf="!(data$ | async)">
         <!-- loader -->
         <div class="loader" >
           <span></span>
           <span></span>
           <span></span>
           <span></span>
           <span></span>
          <h1>loading ledger</h1>
        </div>
    </div>
    <div *ngIf="(data$ | async)">
      <bs-grid #bsGrid
      [search]="filter.search"
        [bsData]="data$ | async"
      ></bs-grid>
    </div>
  `
})
export class BsComponent implements OnInit, AfterViewInit, OnDestroy {
  public showLoader: Observable<boolean>;
  public data$: Observable<ProfitLossData>;
  public request: ProfitLossRequest;
  @ViewChild('bsGrid') public bsGrid: BsGridComponent;
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
        fy: 0
      };
      this.filterData(this.request);
    }
  }

  private _selectedCompany: ComapnyResponse;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions) {
    this.showLoader = this.store.select(p => p.tlPl.bs.showLoader).takeUntil(this.destroyed$);
    this.data$ = this.store.select(p => _.cloneDeep(p.tlPl.bs.data)).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    console.log('hello Tb Component');
  }
  public expandAllEmit(v) {
    if (this.bsGrid) {
      this.bsGrid.expandAll = v;
    }
  }
  public ngAfterViewInit() {
    //
  }
  public filterData(request: ProfitLossRequest) {
    request.fromDate = this.selectedCompany.financialYears[request.fy].financialYearStarts;
    request.toDate = this.selectedCompany.financialYears[request.fy].financialYearEnds;
    this.store.dispatch(this.tlPlActions.GetBalanceSheet(_.cloneDeep(request)));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
