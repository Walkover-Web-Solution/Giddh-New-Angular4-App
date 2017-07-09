import { Store } from '@ngrx/store';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as moment from 'moment';
import { AppState } from '../../../store/roots';

@Component({
  selector: 'audit-logs-grid',  // <home></home>
  templateUrl: './audit-logs-grid.component.html'
})
export class AuditLogsGridComponent implements OnInit, OnDestroy {

  public showFromDatePicker: boolean;
  public showToDatePicker: boolean;
  public toDate: Date;
  public fromDate: Date;
  public moment = moment;
  public groupName: string;
  public searchLoader$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>) {
    //
  }

  public ngOnInit() {
    //

  }

  public ngOnDestroy() {
    //
  }
}
