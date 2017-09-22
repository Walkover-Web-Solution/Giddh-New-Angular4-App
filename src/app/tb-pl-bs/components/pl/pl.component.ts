import { Store } from '@ngrx/store';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ComapnyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../services/actions/tl-pl.actions';
import { ProfitLossData, ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';
import * as _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { PlGridComponent } from './pl-grid/pl-grid.component';

@Component({
  selector: 'pl',
  template: `
    <tb-pl-bs-filter
      #filter
      [selectedCompany]="selectedCompany"
      (onPropertyChanged)="filterData($event)"
      [showLoader]="showLoader | async"
      (expandAll)="expandAllEmit($event)"
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
          <h1>loading ledger</h1>
        </div>
    </div>
    <div *ngIf="(data$ | async).expArr && !(showLoader | async)">
      <pl-grid #plGrid
      [search]="filter.search"
        [plData]="data$ | async"
      ></pl-grid>
    </div>
  `
})
export class PlComponent implements OnInit, AfterViewInit, OnDestroy {
  public showLoader: Observable<boolean>;
  public data$: Observable<ProfitLossData>;
  public request: ProfitLossRequest;
  @ViewChild('plGrid') public plGrid: PlGridComponent;
  public get selectedCompany(): ComapnyResponse {
    return this._selectedCompany;
  }

  // set company and fetch data...
  @Input()
  public set selectedCompany(value: ComapnyResponse) {
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

  private _selectedCompany: ComapnyResponse;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, private cd: ChangeDetectorRef) {
    this.showLoader = this.store.select(p => p.tlPl.pl.showLoader).takeUntil(this.destroyed$);
    this.data$ = this.store.select(p =>
      _.cloneDeep(p.tlPl.pl.data)
    ).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // console.log('hello Tb Component');
    this.data$.subscribe(p => {
      this.cd.detectChanges();
    });
  }
  public expandAllEmit(v) {
    if (this.plGrid) {
      this.plGrid.expandAll = v;
    }
  }
  public ngAfterViewInit() {
    //
    this.cd.detectChanges();
  }
  public exportXLS(event) {
    //
  }
  public filterData(request: ProfitLossRequest) {
    request.from = request.from;
    request.to = request.to;
    request.fy = request.fy;
    //
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
}
