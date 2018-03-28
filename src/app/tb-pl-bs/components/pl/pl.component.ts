import { Store } from '@ngrx/store';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CompanyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { ProfitLossData, ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';
import * as _ from '../../../lodash-optimized';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PlGridComponent } from './pl-grid/pl-grid.component';
import { createSelector } from 'reselect';
import { ChildGroup, Account } from '../../../models/api-models/Search';
@Component({
  selector: 'pl',
  template: `
    <tb-pl-bs-filter
      #filter
      [selectedCompany]="selectedCompany"
      (onPropertyChanged)="filterData($event)"
      [showLoader]="showLoader | async"
      (seachChange)="searchChanged($event)"
      (expandAll)="expandAllEvent($event)"
      [tbExportCsv]="false"
      [tbExportPdf]="false"
      [tbExportXLS]="false"
      [plBsExportXLS]="true"
      (plBsExportXLSEvent)="exportXLS($event)"
    ></tb-pl-bs-filter>
    <div *ngIf="(showLoader | async)">
         <div class="loader" >
           <span></span>
           <span></span>
           <span></span>
           <span></span>
           <span></span>
          <h1>loading profit & loss </h1>
        </div>
    </div>
    <div *ngIf="!(showLoader | async)">
      <pl-grid #plGrid
      [search]="search"
      [expandAll]="expandAll"
        [plData]="data$ | async"
      ></pl-grid>
    </div>
  `
})
export class PlComponent implements OnInit, AfterViewInit, OnDestroy {
  public showLoader: Observable<boolean>;
  public data$: Observable<ProfitLossData>;
  public request: ProfitLossRequest;
  public expandAll: boolean;
  public search: string;
  @ViewChild('plGrid') public plGrid: PlGridComponent;
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
    this.showLoader = this.store.select(p => p.tlPl.pl.showLoader).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // console.log('hello Tb Component');
    this.data$ = this.store.select(createSelector((p: AppState) => p.tlPl.pl.data, (p: ProfitLossData) => {
      let data = _.cloneDeep(p) as ProfitLossData;
      if (data.expArr) {
        this.InitData(data.expArr);
        data.expArr.forEach(g => { g.isVisible = true; g.isCreated = true; g.isIncludedInSearch = true; });
      }
      if (data.incArr) {
        this.InitData(data.incArr);
        data.incArr.forEach(g => { g.isVisible = true; g.isCreated = true; g.isIncludedInSearch = true; });
      }
      return data;
    })
    ).takeUntil(this.destroyed$);
    this.data$.subscribe(p => {
      this.cd.detectChanges();
    });
  }
  public InitData(d: ChildGroup[]) {
    _.each(d, (grp: ChildGroup) => {
      grp.isVisible = true;
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
    //
    this.cd.detectChanges();
  }
  public exportXLS(event) {
    //
  }
  public filterData(request: ProfitLossRequest) {
    // debugger;
    request.from = request.from;
    request.to = request.to;
    request.fy = request.fy;
    request.refresh = request.refresh;
    this.store.dispatch(this.tlPlActions.GetProfitLoss(_.cloneDeep(request)));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
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
  public expandAllEvent(event: boolean) {
    this.cd.checkNoChanges();
    this.expandAll = !this.expandAll;
    setTimeout(() => {
      this.expandAll = event;
      this.cd.detectChanges();
    }, 1);
  }
  public searchChanged(event: string) {
    // this.cd.checkNoChanges();
    this.search = event;
    this.cd.detectChanges();
    // setTimeout(() => {
    //   this.search = event;
    // }, 1);
  }
}
