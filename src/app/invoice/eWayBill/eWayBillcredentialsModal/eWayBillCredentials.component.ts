import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EwayBillLogin } from 'app/models/api-models/Invoice';
import { Store } from '@ngrx/store';
import { AppState } from 'app/store';
import { InvoiceActions } from 'app/actions/invoice/invoice.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isConstructorDeclaration } from 'typescript';

@Component({
  selector: 'app-eWayBill-credentials-modal',
  templateUrl: './eWayBillCredentials.component.html',
  styleUrls: [`./eWayBillCredentials.component.scss`]
})

export class EWayBillCredentialsComponent implements OnInit {
  @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
  @ViewChild('ewayBillform') public loginForm: NgForm;
public ewayBillLogForm: EwayBillLogin = new EwayBillLogin();
public togglePassword: boolean = true;
 public isUserAdeedInProcess$: Observable<boolean>;
  public isUserAddedSuccessfully$: Observable<boolean>;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
constructor(
    private store: Store<AppState>,
    private invoiceActions: InvoiceActions) {
  this.isUserAdeedInProcess$ = this.store.select(p => p.ewaybillstate.isEwaybillAddnewUserInProcess).pipe(takeUntil(this.destroyed$));
 this.isUserAddedSuccessfully$ = this.store.select(p => p.ewaybillstate.isEwaybillUserCreationSuccess).pipe(takeUntil(this.destroyed$));

    }
  public ngOnInit(): void {
    //
   console.log('isUserAdeedInProcess', this.isUserAdeedInProcess$.subscribe(s => console.log('state', s)));
   this.isUserAddedSuccessfully$.subscribe(p => {
     if (p) {
      this.onCancel();
      this.loginForm.reset();
     }
     });
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
