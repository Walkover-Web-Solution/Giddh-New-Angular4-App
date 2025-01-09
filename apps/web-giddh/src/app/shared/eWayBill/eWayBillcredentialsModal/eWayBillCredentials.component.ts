import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
    // @ViewChild('ewayBillform', { static: true }) public loginForm: NgForm;
    // public ewayBillLogForm: EwayBillLogin = new EwayBillLogin();
    /** Form group for Credentials e-Way Bill form */
    public eWayBillCredentialsForm: FormGroup;
    /** Flag to toggle password visibility */
    public togglePassword: boolean = true;
    /** Observable indicating if user addition is in process */
    public isUserAdeedInProcess$: Observable<boolean>;
    /** Observable indicating if e-Way Bill user creation was successful */
    public isEwaybillUserCreationSuccess$: Observable<boolean>;
    /** Subject for managing component destruction */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private store: Store<AppState>,
        private invoiceActions: InvoiceActions, private formBuilder: FormBuilder) {
        this.isUserAdeedInProcess$ = this.store.pipe(select(p => p.ewaybillstate.isEwaybillAddnewUserInProcess), takeUntil(this.destroyed$));
        this.isEwaybillUserCreationSuccess$ = this.store.pipe(select(p => p.ewaybillstate.isEwaybillUserCreationSuccess), takeUntil(this.destroyed$));

    }
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
    public onCancel() {
        this.closeModelEvent.emit(true);
    }

    /**
     * Dispatches an action to log in the e-Way Bill user with the form data
     *
     * @memberof EWayBillCredentialsComponent
     */
    public onSubmit() {
        this.store.dispatch(this.invoiceActions.LoginEwaybillUser(this.eWayBillCredentialsForm?.value));
    }

    /**
     * Toggles the visibility of the password field
     *
     * @memberof EWayBillCredentialsComponent
     */
    public showPassword() {
        this.togglePassword = this.togglePassword ? false : true;
    }
}
