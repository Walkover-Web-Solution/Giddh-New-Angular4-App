import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CompanyResponse, StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';
import { ReplaySubject } from 'rxjs';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'tb-pl-bs',
  templateUrl: './tb-pl-bs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TbPlBsComponent implements OnInit, AfterViewInit {

  public selectedCompany: CompanyResponse;
  public CanTBLoad: boolean = true;
  public CanPLLoad: boolean = false;
  public CanBSLoad: boolean = false;

  @ViewChild('staticTabsTBPL') public staticTabs: TabsetComponent;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private companyActions: CompanyActions, private cd: ChangeDetectorRef, private _route: ActivatedRoute) {
    this.store.select(p => p.session.companies && p.session.companies.find(q => q.uniqueName === p.session.companyUniqueName)).subscribe(p => {
      this.selectedCompany = p;
    });
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'trial-balance-and-profit-loss';

    this._route.queryParams.takeUntil(this.destroyed$).subscribe((val) => {
      if (val && val.tab && val.tabIndex) {
        this.selectTab(val.tabIndex);
      }
    });

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }

  public ngAfterViewInit() {
    //
  }

  public selectTab(id: number) {
    this.staticTabs.tabs[id].active = true;
  }
}
