import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { EwayBillLogin } from 'apps/web-giddh/src/app/models/api-models/Invoice';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { InvoiceActions } from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-eWayBill-credentials-modal',
    templateUrl: './eWayBillCredentials.component.html',
    styleUrls: [`./eWayBillCredentials.component.scss`]
})

export class EWayBillCredentialsComponent implements OnInit {
    @Output() public closeModelEvent: EventEmitter<boolean> = new EventEmitter(true);
    @ViewChild('ewayBillform', { static: true }) public loginForm: NgForm;
    public ewayBillLogForm: EwayBillLogin = new EwayBillLogin();
    public togglePassword: boolean = true;
    public isUserAdeedInProcess$: Observable<boolean>;
    public isEwaybillUserCreationSuccess$: Observable<boolean>;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions) {
        this.isUserAdeedInProcess$ = this.store.pipe(select(p => p.ewaybillstate.isEwaybillAddnewUserInProcess), takeUntil(this.destroyed$));
        this.isEwaybillUserCreationSuccess$ = this.store.pipe(select(p => p.ewaybillstate.isEwaybillUserCreationSuccess), takeUntil(this.destroyed$));

    }
    public ngOnInit(): void {
        this.isEwaybillUserCreationSuccess$.subscribe(p => {
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
        this.store.dispatch(this.invoiceActions.LoginEwaybillUser(form?.value));
    }
    public showPassword() {
        this.togglePassword = this.togglePassword ? false : true;
    }
}
