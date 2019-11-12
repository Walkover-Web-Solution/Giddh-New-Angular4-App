import {ChangeDetectorRef, Component, ComponentFactoryResolver, OnChanges, OnDestroy, OnInit} from '@angular/core';
import {Observable, of as observableOf, ReplaySubject} from "rxjs";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../../store";
import {ToasterService} from "../../../services/toaster.service";
import {ActivatedRoute, Router} from "@angular/router";
import {CompanyService} from "../../../services/companyService.service";
import {DashboardService} from "../../../services/dashboard.service";
import {ContactService} from "../../../services/contact.service";
import {SettingsIntegrationActions} from "../../../actions/settings/settings.integration.action";
import {CompanyActions} from "../../../actions/company.actions";
import {GroupWithAccountsAction} from "../../../actions/groupwithaccounts.actions";
import {GeneralService} from "../../../services/general.service";
import {GeneralActions} from "../../../actions/general/general.actions";
import {BreakpointObserver} from "@angular/cdk/layout";
import {takeUntil} from "rxjs/operators";
import {createSelector} from "reselect";
import * as moment from 'moment/moment';

@Component({
  selector: 'bank-accounts',
  templateUrl: 'bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss', '../../home.component.scss'],

})

export class BankAccountsComponent implements OnInit, OnDestroy {
  public universalDate$: Observable<any>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  public datePickerOptions: any;
  public moment = moment;
  public toDate: string;
  public fromDate: string;
  public bankAccounts: any[] = [];

  constructor(private store: Store<AppState>, private _contactService: ContactService) {
    this.universalDate$ = this.store.select(p => p.session.applicationDate).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.store.select(createSelector([(states: AppState) => states.session.applicationDate], (dateObj: Date[]) => {
      if (dateObj) {
        let universalDate = _.cloneDeep(dateObj);
        this.datePickerOptions = {
          ...this.datePickerOptions, startDate: moment(universalDate[0], 'DD-MM-YYYY').toDate(),
          endDate: moment(universalDate[1], 'DD-MM-YYYY').toDate()
        };
        this.fromDate = moment(universalDate[0]).format('DD-MM-YYYY');
        this.toDate = moment(universalDate[1]).format('DD-MM-YYYY');
        this.getAccounts(this.fromDate, this.toDate, 'bankaccounts', null, null, 'true', 20, '', 'closingBalance', 'desc');
      }
    })).pipe(takeUntil(this.destroyed$)).subscribe();
  }

  private getAccounts(fromDate: string, toDate: string, groupUniqueName: string, pageNumber?: number, requestedFrom?: string, refresh?: string, count: number = 20, query?: string, sortBy: string = '', order: string = 'asc') {
    pageNumber = pageNumber ? pageNumber : 1;
    refresh = refresh ? refresh : 'false';
    this._contactService.GetContacts(fromDate, toDate, groupUniqueName, pageNumber, refresh, count, query, sortBy, order).subscribe((res) => {
      if (res.status === 'success') {
          this.bankAccounts = res.body.results;
      }
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
