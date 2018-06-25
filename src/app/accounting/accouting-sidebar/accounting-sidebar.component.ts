import { TallyModuleService, IPageInfo } from './../tally-service';
import { GIDDH_DATE_FORMAT } from './../../shared/helpers/defaultDateFormat';
import { CreatedBy } from './../../models/api-models/Invoice';
import { IParticular, LedgerRequest } from './../../models/api-models/Ledger';
import { setTimeout } from 'timers';
import { VsForDirective } from './../../theme/ng2-vs-for/ng2-vs-for';
import { ToasterService } from './../../services/toaster.service';
import { KeyboardService } from './../keyboard.service';
import { LedgerActions } from './../../actions/ledger/ledger.actions';
import { IOption } from './../../theme/ng-select/option.interface';
import { AccountService } from './../../services/account.service';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/roots';
import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList, transition, ElementRef, Input, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import * as _ from 'app/lodash-optimized';
import * as moment from 'moment';
import { FlyAccountsActions } from 'app/actions/fly-accounts.actions';
import { LedgerVM, BlankLedgerVM } from 'app/ledger/ledger.vm';

@Component({
  selector: 'accounting-sidebar',
  templateUrl: './accounting-sidebar.component.html',
  styleUrls: ['./accounting-sidebar.component.css']
})

export class AccountingSidebarComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public AccountListOpen: boolean;

  public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public isGroupToggle: boolean;
  public accountSearch: string = '';
  public grpUniqueName: string = '';
  public showAccountList: boolean = true;
  public selectedVoucher: string = null;
  public selectedGrid: string = null;
  public destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private _tallyModuleService: TallyModuleService) {
    //
  }

  public ngOnInit() {
    this._tallyModuleService.flattenAccounts.subscribe((accounts) => {
      if (accounts) {
        this.setSelectedPage('Journal', 'voucher', 'purchases');
      }
    });

    this._tallyModuleService.selectedPageInfo.distinctUntilChanged((p, q) => {
      if (p && q) {
        return (_.isEqual(p, q));
      }
      if ((p && !q) || (!p && q)) {
        return false;
      }
      return true;
     }).subscribe((pageInfo: IPageInfo) => {
      // && pageInfo.page !== this.selectedVoucher && pageInfo.gridType !== this.selectedGrid
      if (pageInfo) {
        this.selectedVoucher = pageInfo.page;
        this.selectedGrid = pageInfo.gridType;
      }
    });
  }

  public ngOnChanges(s) {
    if (s.AccountListOpen) {
      this.showAccountList = !this.showAccountList;
    }
  }

  public setSelectedPage(pageName: string, grid: string, grpUnqName: string) {
    this._tallyModuleService.setVoucher({
      page: pageName,
      uniqueName: grpUnqName,
      gridType: grid
    });
    this.selectedVoucher = pageName;
    this.selectedGrid = grid;
  }

  public ngOnDestroy() {
      this.destroyed$.next(true);
      this.destroyed$.complete();
  }

}
