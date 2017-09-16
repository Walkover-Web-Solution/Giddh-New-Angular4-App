import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from '../store/roots';
import {
  Component,
  OnInit
} from '@angular/core';
import { StateDetailsRequest } from '../models/api-models/Company';
import { CompanyActions } from '../services/actions/company.actions';

@Component({
  selector: 'audit-logs',
  templateUrl: './audit-logs.component.html'
})
export class AuditLogsComponent implements OnInit {
  constructor(private store: Store<AppState>, private companyActions: CompanyActions) {
  }

  public ngOnInit() {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).take(1).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'audit-logs';

    this.store.dispatch(this.companyActions.SetStateDetails(stateDetailsRequest));
  }
}
