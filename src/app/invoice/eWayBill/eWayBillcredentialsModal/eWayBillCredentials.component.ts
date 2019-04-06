import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EwayBillLogin } from 'app/models/api-models/Invoice';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';

@Component({
  selector: 'app-eWayBill-credentials-modal',
  templateUrl: './eWayBillCredentials.component.html',
  styleUrls: [`./eWayBillCredentials.component.scss`]
})

export class EWayBillCredentialsComponent implements OnInit {
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
public ewayBillLogForm: EwayBillLogin = new EwayBillLogin();
public togglePassword: boolean = true;

constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions) {
    }
  public ngOnInit(): void {
    //
  }

  public onCancel() {
    this.closeModelEvent.emit(true);
  }
  public onSubmit(form: NgForm) {
  this.store.dispatch(this.invoiceActions.LoginEwaybillUser(form.value));
  }
  public showPassword() {
     this.togglePassword = this.togglePassword ? false : true;
  }
}
