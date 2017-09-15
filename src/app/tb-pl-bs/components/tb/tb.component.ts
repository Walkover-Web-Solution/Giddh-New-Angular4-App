import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { ComapnyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../services/actions/tl-pl.actions';
import { AccountDetails, TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { TbGridComponent } from './tb-grid/tb-grid.component';

@Component({
  selector: 'tb',
  template: `
    <tb-pl-bs-filter
      #filter
      [selectedCompany]="selectedCompany"
      [showLoader]="showLoader | async"
      [showLabels]="true"
      (onPropertyChanged)="filterData($event)"
      (expandAll)="expandAllEmit($event)"
      (tbExportCsvEvent)="exportCsv($event)"
      (tbExportPdfEvent)="exportPdf($event)"
      (tbExportXLSEvent)="exportXLS($event)"
      [tbExportCsv]="true"
      [tbExportPdf]="true"
      [tbExportXLS]="true"
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
    <div *ngIf="(data$ | async)">
      <tb-grid #tbGrid
      [search]="filter.search"
        [expandAll]="false"
        [data$]="data$  | async"
      ></tb-grid>
    </div>
  `
})
export class TbComponent implements OnInit, AfterViewInit, OnDestroy {
  public showLoader: Observable<boolean>;
  public data$: Observable<AccountDetails>;
  public request: TrialBalanceRequest;
  @ViewChild('tbGrid') public tbGrid: TbGridComponent;
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
        from: this.selectedCompany.activeFinancialYear.financialYearStarts,
        to: this.selectedCompany.activeFinancialYear.financialYearEnds
      };
      this.filterData(this.request);
    }
  }

  private _selectedCompany: ComapnyResponse;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, public tlPlActions: TBPlBsActions) {
    this.showLoader = this.store.select(p => p.tlPl.tb.showLoader).takeUntil(this.destroyed$);
    this.data$ = this.store.select(p => {
      let d = _.cloneDeep(p.tlPl.tb.data);
      if (d) {
        _.each(d.groupDetails, (grp: any) => {
          grp.isVisible = true;
          _.each(grp.accounts, (acc: any) => {
            acc.isVisible = true;
          });
        });
      }
      return d;
    }).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    // console.log('hello Tb Component');
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public filterData(request: TrialBalanceRequest) {
    this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(request)));
  }
  public expandAllEmit(v) {
    if (this.tbGrid) {
      this.tbGrid.expandAll = v;
    }
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
  public exportCsv($event) {
    //
  }
  public exportPdf($event) {
    //
  }
  public exportXLS($event) {
    //
  }
}
