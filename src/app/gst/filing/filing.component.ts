import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from 'app/store';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { CompanyResponse } from 'app/models/api-models/Company';
import { CompanyActions } from 'app/actions/company.actions';
import { ReplaySubject } from 'rxjs';
import { GstReconcileActions } from 'app/actions/gst-reconcile/GstReconcile.actions';

@Component({
  selector: 'filing',
  templateUrl: 'filing.component.html',
  styleUrls: ['filing.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class FilingComponent implements OnInit {
  public currentPeriod: string = null;
  public selectedGst: string = null;
  public gstNumber: string = null;
  public activeCompanyUniqueName: string = '';
  public activeCompanyGstNumber: string = '';
  public selectedTab: string = '';
  public companies: CompanyResponse[];

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _route: Router, private activatedRoute: ActivatedRoute, private store: Store<AppState>, private companyActions: CompanyActions, private gstAction: GstReconcileActions) {

    this.store.select(p => p.session.companyUniqueName).pipe(takeUntil(this.destroyed$)).subscribe((c) => {
      if (c) {
        this.activeCompanyUniqueName = _.cloneDeep(c);
      }
    });
    this.store.select(p => p.session.companies).pipe(take(1)).subscribe((c) => {
      if (c.length) {
        let companies = this.companies = _.cloneDeep(c);
        if (this.activeCompanyUniqueName) {
          let activeCompany: any = companies.find((o: CompanyResponse) => o.uniqueName === this.activeCompanyUniqueName);
          if (activeCompany && activeCompany.gstDetails[0]) {
            this.activeCompanyGstNumber = activeCompany.gstDetails[0].gstNumber;
            console.log('activeCompanyGstNumber', this.activeCompanyGstNumber);
            this.store.dispatch(this.gstAction.SetActiveCompanyGstin(this.activeCompanyGstNumber));
          } else {
            // this.toasty.errorToast('GST number not found.');
          }
        }
      } else {
        this.store.dispatch(this.companyActions.RefreshCompanies());
      }
    });
  }

  public ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.currentPeriod = params['period'];
      this.selectedGst = params['selectedGst'];
    });
  }

  public initReconcile(e) {
    this.selectedTab = e.heading;
    console.log(e);
  }
}
