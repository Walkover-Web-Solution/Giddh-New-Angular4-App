import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, takeUntil } from 'rxjs';
import { SubscriptionComponentStore } from '../utility/subscription.store';

@Component({
    selector: 'transfer-dialog',
    templateUrl: './transfer-dialog.component.html',
    styleUrls: ['./transfer-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [SubscriptionComponentStore]
})
export class TransferDialogComponent implements OnInit {
    /** Holds Store Transfer Subscription Success state observable*/
    public readonly transferSubscriptionSuccess$ = this.subscriptionComponentStore.select(state => state.transferSubscriptionSuccess);
    /** Instance of transfer form */
    public transferForm: FormGroup;
    /** This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;

    constructor(
        private subscriptionComponentStore: SubscriptionComponentStore,
        @Inject(MAT_DIALOG_DATA) public subscriptionId,
        public dialogRef: MatDialogRef<any>,
        private formBuilder: FormBuilder
    ) {
    }

    /**
      * Lifecycle hook for component initialization
      *
      * @memberof TransferDialogComponent
      */
    public ngOnInit(): void {
        this.initForm();

        this.transferSubscriptionSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.dialogRef.close(true);
            }
        }); 
    }

    /**
    * Initialize for Form group
    *
    * @memberof TransferDialogComponent
    */
    private initForm(): void {
        this.transferForm = this.formBuilder.group({
            name: ['', Validators.required],
            lastName: [''],
            email: ['', [Validators.required, Validators.pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)]]
        });
    }

    /**
     * Tranfer Subscription
     *
     * @memberof TransferDialogComponent
     */
    public onSubmit(): void {
        this.isFormSubmitted = false;
        if (this.transferForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        this.subscriptionComponentStore.transferSubscription({ model: this.transferForm.value, params: this.subscriptionId });
    }

    /**
     * Hook cycle for component destroyed
     *
     * @memberof TransferDialogComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
