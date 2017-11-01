import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CompanyResponse, StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../services/actions/company.actions';

@Component({
  selector: 'tb-pl-bs',
  templateUrl: './tb-pl-bs.component.html'
})
export class TbPlBsComponent implements OnInit, AfterViewInit {

  public selectedCompany: CompanyResponse;

  constructor(private store: Store<AppState>, private companyActions: CompanyActions) {
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

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }

  public ngAfterViewInit() {
    //
  }
}
