import { Store } from '@ngrx/store';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
      <pl-grid #plGrid
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
    this.showLoader = this.store.select(p => p.tlPl.pl.showLoader).takeUntil(this.destroyed$);
    this.data$ = this.store.select(p => _.cloneDeep(p.tlPl.pl.data)).takeUntil(this.destroyed$);
  }

  public ngOnInit() {
    console.log('hello Tb Component');
  }
  public expandAllEmit(v) {
    if (this.plGrid) {
      this.plGrid.expandAll = v;
    }
  }
  public ngAfterViewInit() {
    //
  }
  public filterData(request: ProfitLossRequest) {
    request.fromDate = null;
    request.toDate = null;
    this.store.dispatch(this.tlPlActions.GetProfitLoss(_.cloneDeep(request)));
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
