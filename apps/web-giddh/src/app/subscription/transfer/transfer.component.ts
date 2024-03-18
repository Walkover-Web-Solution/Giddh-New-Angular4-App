import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { SubscriptionComponentStore } from '../utility/subscription.store';

@Component({
    selector: 'transfer',
    templateUrl: './transfer.component.html',
    styleUrls: ['./transfer.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SubscriptionComponentStore]
})
export class TransferComponent implements OnInit {
    /** Holds Store Change Plan Success state observable*/
    public readonly transferSubscriptionSuccess$ = this.subscriptionComponentStore.select(state => state.transferSubscriptionSuccess);
    /** Holds Plan Unique Name form control */
    public transferForm: FormGroup;
    /** This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(
        private readonly subscriptionComponentStore: SubscriptionComponentStore,
        @Inject(MAT_DIALOG_DATA) public subscriptionId,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder) {
        this.initForm();
    }

    /**
      * Lifecycle hook for component initialization
      *
      * @memberof TransferComponent
      */
    public ngOnInit(): void {
        console.log(this.subscriptionId);
        this.transferSubscriptionSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.dialogRef.close(true);
            }
        });
    }

    /**
    * Initialize User Information Form group
    *
    * @memberof TransferComponent
    */
    private initForm(): void {
        this.transferForm = this.formBuilder.group({
            name: ['', Validators.required],
            lastName: [''],
            email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]],
        });
    }

    /**
     * Tranfer Subscription
     *
     * @memberof TransferComponent
     */
    public onSubmit(): void {
        this.subscriptionComponentStore.transferSubscription({ model: this.transferForm.value, params: this.subscriptionId });
    }

}
