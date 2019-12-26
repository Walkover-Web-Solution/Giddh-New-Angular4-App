import { takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as _ from '../../../lodash-optimized';
import { CompanyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { AccountDetails, TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { Observable, ReplaySubject } from 'rxjs';
import { TbGridComponent } from './tb-grid/tb-grid.component';
import { createSelector } from 'reselect';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { ToasterService } from '../../../services/toaster.service';

@Component({
    selector: 'tb',
    template: `
    <tb-pl-bs-filter
      #filter
      [selectedCompany]="selectedCompany"
      [showLoader]="showLoader | async"
      [showLabels]="true"
      (seachChange)="searchChanged($event)"
      (onPropertyChanged)="filterData($event)"
      (expandAll)="expandAllEvent($event)"
      (tbExportCsvEvent)="exportCsv($event)"
      (tbExportPdfEvent)="exportPdf($event)"
      (tbExportXLSEvent)="exportXLS($event)"
      [tbExportCsv]="true"
      [tbExportPdf]="true"
      [tbExportXLS]="true"
    ></tb-pl-bs-filter>
    <div *ngIf="(showLoader | async)">
      <!-- loader -->
      <div class="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <h1>loading trial balance</h1>
      </div>
    </div>
    <div *ngIf="(data$ | async) && !(showLoader | async)">
      <tb-grid #tbGrid
               [search]="search"
               [from]="from"
               [to]="to"
               (searchChange)="searchChanged($event)"
               [expandAll]="expandAll"
               [data$]="data$  | async"
      ></tb-grid>
    </div>
    <div *ngIf="(!(showLoader | async) && !(data$ | async))" style="display: flex; height: 60vh; align-items: center; justify-content: center; font-size: 31px; color: #babec1;">
      <div class="d-flex">
        <h2>No Data Available For This Filter</h2>
      </div>
    </div>
  `
})
export class TbComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    public showLoader: Observable<boolean>;
    public data$: Observable<AccountDetails>;
    public request: TrialBalanceRequest;
    public expandAll: boolean;
    public search: string;
    public from: string;
    public to: string;
    @ViewChild('tbGrid') public tbGrid: TbGridComponent;
    @Input() public isV2: boolean = false;
    @Input() public isDateSelected: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private _selectedCompany: CompanyResponse;

    constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, public tlPlActions: TBPlBsActions, private _toaster: ToasterService) {
        this.showLoader = this.store.select(p => p.tlPl.tb.showLoader).pipe(takeUntil(this.destroyed$));
    }

    public get selectedCompany(): CompanyResponse {
        return this._selectedCompany;
    }

    // set company and fetch data...
    @Input()
    public set selectedCompany(value: CompanyResponse) {
        this._selectedCompany = value;
        if (value && value.activeFinancialYear && !this.isDateSelected) {
            this.request = {
                refresh: false,
                from: value.activeFinancialYear.financialYearStarts,
                to: this.selectedCompany.activeFinancialYear.financialYearEnds
            };
            // this.filterData(this.request);
        }
    }

    public ngOnInit() {
        this.data$ = this.store.select(createSelector((p: AppState) => p.tlPl.tb.data, (p: AccountDetails) => {
            let d = _.cloneDeep(p) as AccountDetails;
            if (d) {
                if (d.message) {
                    setTimeout(() => {
                        this._toaster.clearAllToaster();
                        this._toaster.infoToast(d.message);
                    }, 100);
                }
                this.InitData(d.groupDetails);
                d.groupDetails.forEach(g => {
                    g.isVisible = true;
                    g.isCreated = true;
                });
            }
            return d;
        })).pipe(takeUntil(this.destroyed$));
        this.data$.subscribe(p => {
            this.cd.markForCheck();
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
        // if ('isV2' in changes && changes['isV2'].currentValue !== changes['isV2'].previousValue) {
        //   if (changes['isV2'].currentValue) {
        //     this.store.dispatch(this.tlPlActions.GetV2TrialBalance(_.cloneDeep(this.request)));
        //   } else {
        //     this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(this.request)));
        //   }
        // }
    }

    public filterData(request: TrialBalanceRequest) {
        this.from = request.from;
        this.to = request.to;
        this.isDateSelected = request && request.selectedDateOption === '1';
        if (this.isV2) {
            this.store.dispatch(this.tlPlActions.GetV2TrialBalance(_.cloneDeep(request)));
        } else {
            this.store.dispatch(this.tlPlActions.GetTrialBalance(_.cloneDeep(request)));
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
