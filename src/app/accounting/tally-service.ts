import { Subject } from 'rxjs/Subject';
import { Store } from '@ngrx/store';
import { AppState } from './../store/roots';
import { SessionState } from './../store/authentication/authentication.reducer';
import { Injectable, HostListener } from '@angular/core';
import { createSelector } from 'reselect';

export interface IPageInfo {
  page: string;
  gridType: string;
}

@Injectable()
export class TallyModuleService {

  public selectedPageInfo: Subject<IPageInfo> = new Subject();
  public transactionObj: object = {};

  public onSelectedPage(info: IPageInfo) {
    this.selectedPageInfo.next(info);
  }

  /**
   * prepareTransactions
   */
  public prepareTransactions(transactionObj) {
    //
  }
}
