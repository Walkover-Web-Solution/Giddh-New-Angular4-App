import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
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
export class AsideMenuPurchaseInvoiceSettingComponent implements OnInit, OnChanges {

  @Input() public selectedService: 'JIO_GST' | 'TAX_PRO';
  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);

  public jioGstForm: any = {};
  public taxProForm: any = {};
  public otpSentSuccessFully: boolean = false;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private invoicePurchaseActions: InvoicePurchaseActions,
  ) {
    this.store.select(p => p.invoicePurchase.isTaxProOTPSentSuccessfully).subscribe((yes: boolean) => {
      if (yes) {
        this.otpSentSuccessFully = true;
      } else {
        this.otpSentSuccessFully = false;
      }
    });
  }

  public ngOnInit() {
    // get groups list
  }

  public ngOnChanges(changes) {
    if ('selectedService' in changes && changes['selectedService'].currentValue) {
      // alert('selectedService ' + changes['selectedService'].currentValue);
    }
  }

  public closeAsidePane(event) {
    this.closeAsideEvent.emit(event);
  }

  /**
   * save
   */
  public save(form, type: 'JIO_GST' | 'TAX_PRO') {
    if (type === 'JIO_GST') {
      this.store.dispatch(this.invoicePurchaseActions.SaveJioGst(form));
    } else if (type === 'TAX_PRO' && !this.otpSentSuccessFully) {
      this.store.dispatch(this.invoicePurchaseActions.SaveTaxPro(form));
    } else if (type === 'TAX_PRO' && this.otpSentSuccessFully) {
      this.store.dispatch(this.invoicePurchaseActions.SaveTaxProWithOTP(form));
    }
  }
}
