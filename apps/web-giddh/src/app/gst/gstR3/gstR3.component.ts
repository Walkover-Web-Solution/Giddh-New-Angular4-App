import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Gstr3bOverviewResult, GstOverViewRequest, GstDatePeriod } from '../../models/api-models/GstReconcile';
import { takeUntil } from 'rxjs/operators';
import { Store, select, createSelector } from '@ngrx/store';
import { AppState } from '../../store';
import { Route, Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from '../../services/toaster.service';
import { GstReconcileActions } from '../../actions/gst-reconcile/GstReconcile.actions';

@Component({
  selector: 'file-gstr3',
  templateUrl: './gstR3.component.html',
  styleUrls: ['gstR3.component.css'],
})
export class FileGstR3Component implements OnInit, OnDestroy {
  
  public gstr3BData: Gstr3bOverviewResult;
  public currentPeriod: GstDatePeriod = null;
  public selectedGstr: string = null;
  public gstNumber: string = null;
  public activeCompanyGstNumber: string = '';
  private gstr3BOverviewDataFetchedSuccessfully$: Observable<boolean>;
  private gstr3BOverviewDataFetchedInProgress$: Observable<boolean>;
  private gstr3BOverviewData$: Observable<Gstr3bOverviewResult>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

constructor(
   private store: Store<AppState>,
    private router: Router,
    private _toasty: ToasterService,
     private _gstAction: GstReconcileActions,
     private activatedRoute: ActivatedRoute
) {
    //
    this.gstr3BOverviewDataFetchedSuccessfully$ = this.store.pipe(select(p=> p.gstR.gstr3BOverViewDataFetchedSuccessfully, takeUntil(this.destroyed$)));
    this.gstr3BOverviewData$ = this.store.pipe(select(p=> p.gstR.gstr3BOverViewDate) ,takeUntil(this.destroyed$));
     this.store.pipe(select(createSelector([((s: AppState) => s.session.companies), ((s: AppState) => s.session.companyUniqueName)],
      (companies, uniqueName) => {
        return companies.find(d => d.uniqueName === uniqueName);
      }))
    ).subscribe(activeCompany => {
      if (activeCompany) {
        if (activeCompany.gstDetails && activeCompany.gstDetails.length) {
          let defaultGst = activeCompany.gstDetails.find(f => !!(f.addressList.find(a => a.isDefault)));
          if (defaultGst) {
            this.activeCompanyGstNumber = defaultGst.gstNumber;
          } else {
            this.activeCompanyGstNumber = activeCompany.gstDetails[0].gstNumber;
          }
          this.store.dispatch(this._gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
        }
      }
    });
  }
  public ngOnInit(): void {

        this.activatedRoute.queryParams.pipe(takeUntil(this.destroyed$)).subscribe(params => {
      this.currentPeriod = {
        from: params['from'],
        to: params['to']
      };
      this.store.dispatch(this._gstAction.SetSelectedPeriod(this.currentPeriod));
      this.selectedGstr = params['return_type'];
    });

this.store.pipe(select(s => s.gstR.activeCompanyGst), takeUntil(this.destroyed$)).subscribe(result => {
      this.activeCompanyGstNumber = result;

      let request: GstOverViewRequest = new GstOverViewRequest();
      request.from = this.currentPeriod.from;
      request.to = this.currentPeriod.to;
      request.gstin = this.activeCompanyGstNumber;

       this.gstr3BOverviewDataFetchedSuccessfully$.pipe(takeUntil(this.destroyed$)).subscribe(bool=> {
      if(!bool) {
         this.store.dispatch(this._gstAction.GetOverView('gstr3b', request));
      }
    });
});
   
this.store.pipe(select(p=> p.gstR.gstr3BOverViewDate) ,takeUntil(this.destroyed$)).subscribe((response: Gstr3bOverviewResult)=> {
  
  this.gstr3BData = response;
  console.log(this.gstr3BData);
});

  }

   public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
