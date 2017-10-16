import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { CompanyActions } from '../services/actions/company.actions';
import { AppState } from '../store/roots';
import { StateDetailsRequest } from '../models/api-models/Company';
import { Store } from '@ngrx/store';

@Component({
  template: '<router-outlet></router-outlet>'
})
export class PermissionComponent implements OnInit {
  constructor(private router: Router, private store: Store<AppState>, private companyActions: CompanyActions) {
    this.router.events.subscribe((event: NavigationStart) => {
      if (event.url === '/permissions' || event.url === '/pages/permissions' || event.url === '/pages/permissions/') {
        this.router.navigate(['/pages', 'permissions', 'list']);
      }
    });
  }
  public ngOnInit(): void {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'permissions';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }
}
