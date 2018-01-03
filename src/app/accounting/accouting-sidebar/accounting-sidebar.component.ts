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
import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList, transition, ElementRef, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { createSelector } from 'reselect';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import * as moment from 'moment';
import { FlyAccountsActions } from 'app/actions/fly-accounts.actions';
import { LedgerVM, BlankLedgerVM } from 'app/ledger/ledger.vm';


@Component({
  templateUrl: './accounting-sidebar.component.html',
  styleUrls: ['../accounting.component.css']
})

export class AccountingSidebarComponent {
  
  public flyAccounts: ReplaySubject<boolean> = new ReplaySubject<boolean>();
  public isGroupToggle: boolean;
  public accountSearch:string = '';

  constructor() {

  }

    /**
   * setAccount in particular, on accountList click
   */
  public setAccount(acc) {
    // let idx = this.selectedIdx;
    // let accModel = {
    //   name: acc.Name,
    //   UniqueName: acc.UniqueName,
    //   groupUniqueName: acc.groupUniqueName
    // }
    // this.showLedgerAccountList = false;
    // this.journalObj.transactions[idx].particular = accModel.name;
    // this.journalObj.transactions[idx].selectedAccount = accModel;
    // setTimeout(() => {
    //   this.selectedParticular.focus();
    //   this.showLedgerAccountList = false;
    // }, 100);
  }
  
}