import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IFlattenGroupsAccountsDetail } from '../../models/interfaces/flattenGroupsAccountsDetail.interface';
import { FIXED_CATEGORY_OF_GROUPS } from '../sales.module';
import { AccountRequest } from '../../models/api-models/Account';
import { AccountsAction } from '../../services/actions/accounts.actions';
import { AppState } from '../../../store/roots';
import { InvoicePurchaseActions } from '../../../actions/purchase-invoice/purchase-invoice.action';

@Component({
  selector: 'aside-menu-account',
  styles: [`
    :host {
      position: fixed;
      left: auto;
      top: 0;
      right: 0;
      bottom: 0;
      width: 480px;
      z-index: 1045;
    }

    #close {
      display: none;
    }

    :host.in #close {
      display: block;
      position: fixed;
      left: -41px;
      top: 0;
      z-index: 5;
      border: 0;
      border-radius: 0;
    }

    :host .container-fluid {
      padding-left: 0;
      padding-right: 0;
    }

    :host .aside-pane {
      width: 480px;
      padding:0;
      background: #fff;
    }
  `],
  templateUrl: './aside-menu-purchase-invoice-setting.component.html'
})
export class AsideMenuPurchaseInvoiceSettingComponent implements OnInit {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  public jioGstForm: any = {};

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private invoicePurchaseActions: InvoicePurchaseActions,
  ) {
  }

  public ngOnInit() {
    // get groups list
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }

  /**
   * save
   */
  public save(form) {
    this.store.dispatch(this.invoicePurchaseActions.SaveJioGst(form));
    //
  }
}
