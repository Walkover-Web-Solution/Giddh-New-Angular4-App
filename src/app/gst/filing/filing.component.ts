import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppState } from 'app/store';
import { select, Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Observable, of, ReplaySubject } from 'rxjs';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';
import { TabsetComponent } from 'ngx-bootstrap';
import { GstDatePeriod } from '../../models/api-models/GstReconcile';
import { createSelector } from 'reselect';

@Component({
  selector: 'filing',
  templateUrl: 'filing.component.html',
  styleUrls: ['filing.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FilingComponent implements OnInit, OnDestroy {
  @ViewChild('staticTabs') public staticTabs: TabsetComponent;
  public currentPeriod: GstDatePeriod = null;
  public selectedGst: string = null;
  public gstNumber: string = null;
  public activeCompanyGstNumber: string = '';
  public selectedTab: string = '1. Overview';
  public gstAuthenticated$: Observable<boolean>;
  public isTransactionSummary: boolean = false;
  public showTaxPro: boolean = false;
  public fileReturn: {} = {isAuthenticate: false};
  public selectedTabId: number = null;
  public gstFileSuccess$: Observable<boolean> = of(false);
  public fileReturnSucces: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _cdr: ChangeDetectorRef, private _route: Router, private activatedRoute: ActivatedRoute, private store: Store<AppState>, private _gstAction: GstReconcileActions) {
    this.gstAuthenticated$ = this.store.select(p => p.gstR.gstAuthenticated).pipe(takeUntil(this.destroyed$));
    this.gstFileSuccess$ = this.store.select(p => p.gstR.gstReturnFileSuccess).pipe(takeUntil(this.destroyed$));
    this.gstFileSuccess$.subscribe(a => this.fileReturnSucces = a);

    this.store.pipe(select(createSelector([((s: AppState) => s.session.companies), ((s: AppState) => s.session.companyUniqueName)],
      (companies, uniqueName) => {
        return companies.find(d => d.uniqueName === uniqueName);
      }))
    ).subscribe(activeCompany => {
      if (activeCompany) {
        if (activeCompany.gstDetails[0]) {
          this.activeCompanyGstNumber = activeCompany.gstDetails[0].gstNumber;
          this.store.dispatch(this._gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
        }
      }
    });
  }

  public ngOnInit() {
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.currentPeriod = {
        from: params['from'],
        to: params['to']
      };
      this.selectedGst = params['return_type'];
      this.selectedTabId = Number(params['tab']);

      // this._cdr.detach();
      // setTimeout(() => {
      //   this._cdr.reattach();
      //   if (!this._cdr['destroyed']) {
      //     this._cdr.detectChanges();
      //   }
      if (this.selectedTabId > -1) {
        this.selectTabFromUrl();
      }
      // }, 20);
    });

    this.store.pipe(select(s => s.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(result => {
      this.activeCompanyGstNumber = result;
    });
  }

  public selectTab(e, val, tabHeading) {
    // this._cdr.detach();
    this.selectedTab = tabHeading;
    // setTimeout(() => {
    //   this._cdr.reattach();
    //   if (!this._cdr['destroyed']) {
    //     this._cdr.detectChanges();
    //   }
    // }, 200);
    this.isTransactionSummary = this.selectedTab !== '1. Overview';
    this.showTaxPro = val;
    this.fileReturnSucces = false;
    this._route.navigate(['pages', 'gstfiling', 'filing-return'], {queryParams: {return_type: this.selectedGst, from: this.currentPeriod.from, to: this.currentPeriod.to, tab: this.selectedTabId}});
  }

  public selectTabFromUrl() {
    this.staticTabs.tabs[this.selectedTabId].active = true;
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
