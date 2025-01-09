import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { AppState } from 'apps/web-giddh/src/app/store';
import { InvoiceActions } from 'apps/web-giddh/src/app/actions/invoice/invoice.actions';
import { Observable, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'e-way-bill-credentials-dialog',
    templateUrl: './e-way-bill-credentials.component.html',
    styleUrls: [`./e-way-bill-credentials.component.scss`]
})

export class EWayBillCredentialsComponent implements OnInit {
    /** Form group for Credentials e-Way Bill form */
    public eWayBillCredentialsForm: FormGroup;
    /** Flag to toggle password visibility */
    public togglePassword: boolean = true;
    /** Observable indicating if user addition is in process */
    public isUserAddedInProcess$: Observable<boolean>;
    /** Observable indicating if e-Way Bill user creation was successful */
    public isEwaybillUserCreationSuccess$: Observable<boolean>;
    /** Subject for managing component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>, private dialogRef: MatDialogRef<any>,
        private invoiceActions: InvoiceActions, private formBuilder: FormBuilder) {
        this.isUserAddedInProcess$ = this.store.pipe(select(p => p.ewaybillstate.isEwaybillAddnewUserInProcess), takeUntil(this.destroyed$));
        this.isEwaybillUserCreationSuccess$ = this.store.pipe(select(p => p.ewaybillstate.isEwaybillUserCreationSuccess), takeUntil(this.destroyed$));
    }

    /**
     * Initializes the component
     * 
     * @memberof EWayBillCredentialsComponent
     */
    public ngOnInit(): void {
        this.initEWayBillCredentialsForm();
        this.isEwaybillUserCreationSuccess$.subscribe(response => {
            if (response) {
                this.onCancel();
                this.eWayBillCredentialsForm.reset();
            }
        });
    }

    /**
     * Initializes voucher form
     *
     * @private
     * @memberof EWayBillCredentialsComponent
     */
    private initEWayBillCredentialsForm(): void {
        this.eWayBillCredentialsForm = this.formBuilder.group({
            userName: [null, Validators.required],
            password: [null, Validators.required],
            gstIn: [null, Validators.required]
        });
    }

    /**
     * Emits an event to close the modal when the cancel action is triggered
     *
     * @memberof EWayBillCredentialsComponent
     */
    public onCancel(): void {
        this.dialogRef.close();
    }

    /**
     * Dispatches an action to log in the e-Way Bill user with the form data
     *
     * @memberof EWayBillCredentialsComponent
     */
    public onSubmit(): void {
        if (this.eWayBillCredentialsForm?.valid) {
            this.store.dispatch(this.invoiceActions.LoginEwaybillUser(this.eWayBillCredentialsForm?.value));
        }
    }

    /**
     * Toggles the visibility of the password field
     *
     * @memberof EWayBillCredentialsComponent
     */
    public showPassword(): void {
        this.togglePassword = !this.togglePassword;
    }
}
