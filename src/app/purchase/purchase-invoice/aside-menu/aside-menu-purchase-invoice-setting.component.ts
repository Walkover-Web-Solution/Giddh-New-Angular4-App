import { Component, EventEmitter, Output, OnInit, trigger, state, style, animate, transition } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { FIXED_CATEGORY_OF_GROUPS } from '../sales.module';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';
import { AccountRequest } from '../../models/api-models/Account';
import { AccountsAction } from '../../services/actions/accounts.actions';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';
import { AppState } from '../../../store/roots';

@Component({
  selector: 'aside-menu-account',
  styles: [`
  :host{
    position: fixed;
    left: auto;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    z-index: 1045;
  }
  .aside-height{
      background-color: #d4d4d5;
      padding: 20px;
      height: 100%;
      width: 400px
      right: 0;
      float:right;
    }
  `],
  templateUrl: './aside-menu-purchase-invoice-setting.component.html'
})
export class AsideMenuPurchaseInvoiceSettingComponent implements OnInit {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
  ) {
  }

  public ngOnInit() {
    // get groups list
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }
}
