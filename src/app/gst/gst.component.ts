/**
 * Created by kunalsaxena on 9/1/17.
 */
import { Component, OnInit } from '@angular/core';
import { CompanyActions } from '../actions/company.actions';
import { AppState } from '../store/roots';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';
import { StateDetailsRequest } from '../models/api-models/Company';
import { Router } from '@angular/router';
import * as moment from 'moment/moment';

@Component({
  templateUrl: './gst.component.html',
  styleUrls: ['./gst.component.css']
})
export class GstComponent implements OnInit {
  public showCalendar: boolean = false;
  public selectedPeriod: string = null;
  public period: string = null;
  constructor(private store: Store<AppState>, private _companyActions: CompanyActions, private _route: Router) {
    //
  }
  public ngOnInit(): void {
    let companyUniqueName = null;
    this.store.select(c => c.session.companyUniqueName).pipe(take(1)).subscribe(s => companyUniqueName = s);
    let stateDetailsRequest = new StateDetailsRequest();
    stateDetailsRequest.companyUniqueName = companyUniqueName;
    stateDetailsRequest.lastState = 'gst';

    this.store.dispatch(this._companyActions.SetStateDetails(stateDetailsRequest));
  }

  /**
   * periodChanged
   */
  public periodChanged(ev) {
    this.selectedPeriod = moment(ev).format('MMMM-YYYY');
    this.showCalendar = false;
    this._route.navigate(['pages', 'gstfiling', 'filing-return',  moment(ev).format('MM-YYYY')]);
  }

}
