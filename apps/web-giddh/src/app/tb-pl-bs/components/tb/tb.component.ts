import { takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CompanyResponse } from '../../../models/api-models/Company';
import { AppState } from '../../../store/roots';
import { TBPlBsActions } from '../../../actions/tl-pl.actions';
import { AccountDetails, TrialBalanceRequest } from '../../../models/api-models/tb-pl-bs';
import { Observable, ReplaySubject } from 'rxjs';
import { TbGridComponent } from './tb-grid/tb-grid.component';
import { createSelector } from 'reselect';
import { Account, ChildGroup } from '../../../models/api-models/Search';
import { ToasterService } from '../../../services/toaster.service';
import { cloneDeep, each } from '../../../lodash-optimized';

@Component({
    selector: 'tb',
    templateUrl: './tb.component.html'
})

export class TbComponent implements OnInit, AfterViewInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    public showLoader: Observable<boolean>;
    public data$: Observable<AccountDetails>;
    public request: TrialBalanceRequest;
    public expandAll: boolean;
    public search: string;
    public from: string;
    public to: string;
    @ViewChild('tbGrid', { static: true }) public tbGrid: TbGridComponent;
    @Input() public isV2: boolean = false;
    @Input() public isDateSelected: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private _selectedCompany: CompanyResponse;

    constructor(private store: Store<AppState>, private cd: ChangeDetectorRef, public tlPlActions: TBPlBsActions, private _toaster: ToasterService) {
        this.showLoader = this.store.pipe(select(p => p.tlPl.tb.showLoader), takeUntil(this.destroyed$));
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
        }
    }

    public ngOnInit() {
        this.data$ = this.store.pipe(select(createSelector((p: AppState) => p.tlPl.tb.data, (p: AccountDetails) => {
            let d = cloneDeep(p) as AccountDetails;
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
        })), takeUntil(this.destroyed$));
        this.data$.subscribe(p => {
            this.cd.markForCheck();
        });
    }

    public InitData(d: ChildGroup[]) {
        each(d, (grp: ChildGroup) => {
            grp.isVisible = false;
            grp.isCreated = false;
            grp.isIncludedInSearch = true;
            each(grp.accounts, (acc: Account) => {
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

    public filterData(request: TrialBalanceRequest) {
        this.from = request.from;
        this.to = request.to;
        this.isDateSelected = request && request.selectedDateOption === '1';
        if (this.isV2) {
            this.store.dispatch(this.tlPlActions.GetV2TrialBalance(cloneDeep(request)));
        } else {
            this.store.dispatch(this.tlPlActions.GetTrialBalance(cloneDeep(request)));
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public expandAllEvent(event: boolean) {
        setTimeout(() => {
            this.expandAll = event;
            this.cd.detectChanges();
        }, 1);
    }

    public searchChanged(event: string) {
        this.search = event;
        this.cd.detectChanges();
    }
}
