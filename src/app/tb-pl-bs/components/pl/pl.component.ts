import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CompanyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { GetCogsResponse, ProfitLossData, ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';
import * as _ from '../../../lodash-optimized';
import { Observable, ReplaySubject } from 'rxjs';
import { PlGridComponent } from './pl-grid/pl-grid.component';
import { createSelector } from 'reselect';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { ToasterService } from '../../../services/toaster.service';

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
      [showLabels]="true"
    ></tb-pl-bs-filter>
    <div *ngIf="(showLoader | async)">
      <div class="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h1>loading profit & loss </h1>
      </div>
    </div>
    <div *ngIf="!(showLoader | async)" style="width: 70%;margin: auto;">
      <pl-grid #plGrid
               [search]="search"
               (searchChange)="searchChanged($event)"
               [expandAll]="expandAll"
               [plData]="data$ | async"
               [cogsData]="cogsData"
      ></pl-grid>
    </div>
  `
})
export class PlComponent implements OnInit, AfterViewInit, OnDestroy {
  public showLoader: Observable<boolean>;
  public data$: Observable<ProfitLossData>;
  public cogsData: ChildGroup;
  public request: ProfitLossRequest;
  public expandAll: boolean;
  @Input() public isDateSelected: boolean = false;

  public search: string;
  @ViewChild('plGrid') public plGrid: PlGridComponent;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, private cd: ChangeDetectorRef, private _toaster: ToasterService) {
    this.showLoader = this.store.select(p => p.tlPl.pl.showLoader).pipe(takeUntil(this.destroyed$));
  }

  private _selectedCompany: CompanyResponse;

  public get selectedCompany(): CompanyResponse {
    return this._selectedCompany;
  }

  // set company and fetch data...
  @Input()
  public set selectedCompany(value: CompanyResponse) {
    this._selectedCompany = value;
    if (value && !this.isDateSelected) {

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

  public ngOnInit() {
    // console.log('hello Tb Component');
    this.data$ = this.store.select(createSelector([(p: AppState) => p.tlPl.pl.data],
      (p: ProfitLossData) => {
        let data = _.cloneDeep(p) as ProfitLossData;
        let cogs;
        if (data && data.incomeStatment && data.incomeStatment.costOfGoodsSold) {
          cogs = _.cloneDeep(data.incomeStatment.costOfGoodsSold) as GetCogsResponse;
        } else {
          cogs = null;
        }

        if (data && data.message) {
          setTimeout(() => {
            this._toaster.clearAllToaster();
            this._toaster.infoToast(data.message);
          }, 100);
        }

        if (cogs) {
          let cogsGrp: ChildGroup = new ChildGroup();
          cogsGrp.isCreated = true;
          cogsGrp.isVisible = true;
          cogsGrp.isIncludedInSearch = true;
          cogsGrp.isOpen = false;
          cogsGrp.level1 = false;
          cogsGrp.uniqueName = 'cogs';
          cogsGrp.groupName = 'Less: Cost of Goods Sold';
          cogsGrp.closingBalance = {
            amount: cogs.cogs,
            type: 'DEBIT'
          };
          cogsGrp.accounts = [];
          cogsGrp.childGroups = [];

          Object.keys(cogs).filter(f => ['openingInventory', 'closingInventory', 'purchasesStockAmount', 'manufacturingExpenses'].includes(f)).forEach(f => {
            let cg = new ChildGroup();
            cg.isCreated = false;
            cg.isVisible = false;
            cg.isIncludedInSearch = true;
            cg.isOpen = false;
            cg.uniqueName = f;
            cg.groupName = f.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
            cg.category = f === 'closingInventory' ? 'expenses' : 'income';
            cg.closingBalance = {
              amount: cogs[f],
              type: 'CREDIT'
            };
            cg.accounts = [];
            cg.childGroups = [];
            cogsGrp.childGroups.push(cg);
          });

          this.cogsData = cogsGrp;
        }

        if (data && data.expArr) {
          this.InitData(data.expArr);
          data.expArr.forEach(g => {
            g.isVisible = true;
            g.isCreated = true;
            g.isIncludedInSearch = true;
            g.isOpen = true;
            g.childGroups.forEach(c => {
              c.isVisible = true;
              c.isCreated = true;
              c.isIncludedInSearch = true;
            });
          });
        }
        if (data && data.incArr) {
          this.InitData(data.incArr);
          data.incArr.forEach(g => {
            g.isVisible = true;
            g.isCreated = true;
            g.isIncludedInSearch = true;
            g.isOpen = true;
            g.childGroups.forEach(c => {
              c.isVisible = true;
              c.isCreated = true;
              c.isIncludedInSearch = true;
            });
          });
        }
        return data;
      })
    ).pipe(takeUntil(this.destroyed$));
    this.data$.subscribe(p => {
      this.cd.detectChanges();
    });
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
    request.refresh = request.refresh;
    if (request && request.selectedDateOption === '1') {
      this.isDateSelected = true;
    } else {
      this.isDateSelected = false;
    }
    if (!request.tagName) {
      delete request.tagName;
    }
    this.store.dispatch(this.tlPlActions.GetProfitLoss(_.cloneDeep(request)));
    // this.store.dispatch(this.tlPlActions.GetCogs({from: request.from, to: request.to}));
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
