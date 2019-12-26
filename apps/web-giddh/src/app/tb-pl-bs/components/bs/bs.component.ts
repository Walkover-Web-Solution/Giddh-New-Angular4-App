import { takeUntil } from 'rxjs/operators';
import { select, Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import { CompanyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { BalanceSheetData, ProfitLossRequest } from '../../../models/api-models/tb-pl-bs';
import * as _ from '../../../lodash-optimized';
import { Observable, ReplaySubject } from 'rxjs';
import { BsGridComponent } from './bs-grid/bs-grid.component';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { ToasterService } from '../../../services/toaster.service';

@Component({
    selector: 'bs',
    template: `
    <tb-pl-bs-filter
      #filter
      [selectedCompany]="selectedCompany"
      (onPropertyChanged)="filterData($event)"
      [showLoader]="showLoader | async"
      [showLabels]="true"
      (seachChange)="searchChanged($event)"
      (expandAll)="expandAllEvent($event)"
      [BsExportXLS]="true"
      (plBsExportXLSEvent)="exportXLS($event)"
    ></tb-pl-bs-filter>
    <div *ngIf="(showLoader | async)">
      <!-- loader -->
      <div class="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h1>loading balance sheet</h1>
      </div>
    </div>
    <div *ngIf="(!(showLoader | async) && data)" style="width: 70%;margin:auto">
      <bs-grid #bsGrid
               [search]="search"
               [from]="from"
               [to]="to"
               (searchChange)="searchChanged($event)"
               [expandAll]="expandAll"
               [bsData]="data"
      ></bs-grid>
    </div>
    <div *ngIf="(!(showLoader | async) && !(data))" style="display: flex; height: 60vh; align-items: center; justify-content: center; font-size: 31px; color: #babec1;">
      <div class="d-flex">
        <h2>No Data Available For This Filter</h2>
      </div>
    </div>
  `,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BsComponent implements AfterViewInit, OnDestroy, OnChanges {

    public get selectedCompany(): CompanyResponse {
        return this._selectedCompany;
    }

    // set company and fetch data...
    @Input()
    public set selectedCompany(value: CompanyResponse) {
        this._selectedCompany = value;
        if (value && value.activeFinancialYear && value.financialYears && !this.isDateSelected) {
            let index = this.findIndex(value.activeFinancialYear, value.financialYears);
            this.request = {
                refresh: false,
                fy: index,
                from: value.activeFinancialYear.financialYearStarts,
                to: value.activeFinancialYear.financialYearEnds
            };
            // this.filterData(this.request);
        }
    }

    public showLoader: Observable<boolean>;
    public data: BalanceSheetData;
    public request: ProfitLossRequest;
    public expandAll: boolean;
    public search: string;
    public from: string;
    public to: string;
    @Input() public isDateSelected: boolean = false;

    @ViewChild('bsGrid') public bsGrid: BsGridComponent;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    private _selectedCompany: CompanyResponse;

    constructor(private store: Store<AppState>, public tlPlActions: TBPlBsActions, private cd: ChangeDetectorRef, private _toaster: ToasterService) {
        this.showLoader = this.store.select(p => p.tlPl.bs.showLoader).pipe(takeUntil(this.destroyed$));
        this.store.pipe(select(s => s.tlPl.bs.data), takeUntil(this.destroyed$)).subscribe((p) => {
            if (p) {
                let data = _.cloneDeep(p) as BalanceSheetData;
                if (data && data.message) {
                    setTimeout(() => {
                        this._toaster.clearAllToaster();
                        this._toaster.infoToast(data.message);
                    }, 100);
                }
                if (data && data.liabilities) {
                    this.InitData(data.liabilities);
                    data.liabilities.forEach(g => {
                        g.isVisible = true;
                        g.isCreated = true;
                        g.isIncludedInSearch = true;
                    });
                }
                if (data && data.assets) {
                    this.InitData(data.assets);
                    data.assets.forEach(g => {
                        g.isVisible = true;
                        g.isCreated = true;
                        g.isIncludedInSearch = true;
                    });
                }
                this.data = data;
            } else {
                this.data = null;
            }
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
        this.cd.detectChanges();
    }

    public ngOnChanges(changes: SimpleChanges) {
        // if (changes.groupDetail && !changes.groupDetail.firstChange && changes.groupDetail.currentValue !== changes.groupDetail.previousValue) {
        //   this.cd.detectChanges();
        // }
    }

    public filterData(request: ProfitLossRequest) {
        this.from = request.from;
        this.to = request.to;
        this.isDateSelected = request && request.selectedDateOption === '1';
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
