import { IOption } from 'app/theme/ng-virtual-select/sh-options.interface';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppState } from '../../store/roots';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import * as _ from '../../lodash-optimized';
import * as moment from 'moment/moment';
import { ToasterService } from '../../services/toaster.service';
import { CompanyActions } from '../../actions/company.actions';
import { GIDDH_DATE_FORMAT } from 'app/shared/helpers/defaultDateFormat';
import { createSelector } from 'reselect';

@Component({
  selector: 'setting-tags',
  templateUrl: './tags.component.html'
})
export class TagsComponent implements OnInit {

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private router: Router,
    private store: Store<AppState>,
    private _companyActions: CompanyActions,
    private _toasty: ToasterService
  ) { }

  public ngOnInit() {
    //
  }

}
