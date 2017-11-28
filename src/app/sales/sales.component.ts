import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../actions/company.actions';

@Component({
  styles: [`
    .grey-bg{
      background-color: #f4f5f8;
      padding: 20px;
    }
  `],
  templateUrl: './sales.component.html'
})
export class SalesComponent implements OnInit {
  constructor(
    private router: Router,
    private store: Store<AppState>,
    private companyActions: CompanyActions
  ) {}

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'sales';
    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }
}
