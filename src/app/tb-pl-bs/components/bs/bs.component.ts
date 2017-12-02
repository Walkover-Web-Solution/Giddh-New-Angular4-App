import { Store } from '@ngrx/store';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CompanyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { ProfitLossData, ProfitLossRequest, BalanceSheetData } from '../../../models/api-models/tb-pl-bs';
import * as _ from '../../../lodash-optimized';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BsGridComponent } from './bs-grid/bs-grid.component';
import { createSelector } from 'reselect';
import { ChildGroup, Account } from '../../../models/api-models/Search';

@Component({
  selector: 'bs',
  template: `
    <tb-pl-bs-filter
      #filter
      [selectedCompany]="selectedCompany"
      (onPropertyChanged)="filterData($event)"
      [showLoader]="showLoader | async"
      (expandAll)="expandAll = $event"
      [BsExportXLS]="true"
      (plBsExportXLSEvent)="exportXLS($event)"
    ></tb-pl-bs-filter>
    <div *ngIf="(showLoader | async)">
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
    <div *ngIf="!(showLoader | async)">
      <bs-grid #bsGrid
      [search]="filter.search"
      [expandAll]="expandAll"
        [bsData]="data$ | async"
      ></bs-grid>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BsComponent implements OnInit, AfterViewInit, OnDestroy {
  public showLoader: Observable<boolean>;
  public data$: Observable<ProfitLossData>;
  public request: ProfitLossRequest;
  public expandAll: boolean;
  @ViewChild('bsGrid') public bsGrid: BsGridComponent;
  public get selectedCompany(): CompanyResponse {
    return this._selectedCompany;
  }

  // set company and fetch data...
  @Input()
  public set selectedCompany(value: CompanyResponse) {
    this._selectedCompany = value;
    if (value) {
      let index = this.findIndex(value.activeFinancialYear, value.financialYears);
      this.request = {
        refresh: false,
        fy: index,
        from: value.activeFinancialYear.financialYearStarts,
        to: value.activeFinancialYear.financialYearEnds
      };
      this.filterData(this.request);
    }
  }

  private _selectedCompany: CompanyResponse;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, private cd: ChangeDetectorRef) {
    this.showLoader = this.store.select(p => p.tlPl.bs.showLoader).takeUntil(this.destroyed$);
    this.data$ = this.store.select(createSelector((p: AppState) => p.tlPl.bs.data, (p: BalanceSheetData) => {
      let data = _.cloneDeep(p) as BalanceSheetData;
      if (data.liabilities) {
        data.liabilities.forEach(q => { q.isVisible = true; });
      }
      if (data.assets) {
        data.assets.forEach(q => { q.isVisible = true; });
      }
      if (data.liabilities) {
        this.InitData(data.liabilities);
        data.liabilities.forEach(g => { g.isVisible = true; g.isCreated = true; });
      }
      if (data.assets) {
        this.InitData(data.assets);
        data.assets.forEach(g => { g.isVisible = true; g.isCreated = true; });
      }
      return data;
    })).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // console.log('hello Tb Component');
  }
  public InitData(d: ChildGroup[]) {
    _.each(d, (grp: ChildGroup) => {
      grp.isVisible = false;
      grp.isCreated = false;
      grp.isIncludedInSearch = true;
      _.each(grp.accounts, (acc: Account) => {
        acc.isIncludedInSearch = true;
        acc.isCreated = false;
        acc.isVisible = false;
      });
      if (grp.childGroups) {
        this.InitData(grp.childGroups);
      }
    });
  }
  public ngAfterViewInit() {
    this.cd.detectChanges();
  }
  public filterData(request: ProfitLossRequest) {
    request.from = request.from;
    request.to = request.to;
    request.fy = request.fy;
    this.store.dispatch(this.tlPlActions.GetBalanceSheet(_.cloneDeep(request)));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public exportXLS(event) {
    //
  }
  public findIndex(activeFY, financialYears) {
    let tempFYIndex = 0;
    _.each(financialYears, (fy: any, index: number) => {
      if (fy.uniqueName === activeFY.uniqueName) {
        if (index === 0) {
          tempFYIndex = index;
        } else {
          tempFYIndex = index * -1;
        }
      }
    });
    return tempFYIndex;
  }
}
