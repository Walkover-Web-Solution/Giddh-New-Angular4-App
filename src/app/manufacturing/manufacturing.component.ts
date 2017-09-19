import { Component, OnInit } from '@angular/core';
import { CompanyActions } from '../services/actions/company.actions';
import { AppState } from '../store/roots';
import { Store } from '@ngrx/store';
import { StateDetailsRequest } from '../models/api-models/Company';

@Component({
  template: '<router-outlet></router-outlet>'
})

export class ManufacturingComponent implements OnInit {
  constructor(private store: Store<AppState>, private companyActions: CompanyActions) {
    //
  }
  public ngOnInit(): void {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'manufacturing';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }

}
