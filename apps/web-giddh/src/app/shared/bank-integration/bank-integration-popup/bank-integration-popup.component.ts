import { Component, OnInit, Inject, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject, Subscription } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IOption } from '../../../app.constant';

@Component({
    selector: 'bank-integration-popup',
    styleUrls: ['./bank-integration-popup.component.scss'],
    templateUrl: './bank-integration-popup.component.html',
    standalone: false
})

export class BankIntegrationDialogComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Track subscriptions manually for Angular 21 compatibility */
    private subscriptions: Subscription[] = [];
    /** Flag to track component destruction state */
    private isDestroying = false;

    constructor(@Inject(MAT_DIALOG_DATA) public inputData, public dialogRef: MatDialogRef<any>
    ) { }

    /**
     * Initializes the component
     *
     * @memberof BankIntegrationDialogComponent
     */
    public ngOnInit(): void {
        this.commonLocaleData = this.inputData?.commonLocaleData;
        this.localeData = this.inputData?.localeData;
    }

    /**
     * This will use for close dialog
     *
     * @memberof BankIntegrationDialogComponent
     */
    public closeDialog(): void {
        this.dialogRef.close('close');
    }

    /**
     *This will be use for link bank account
     *
     * @memberof BankIntegrationDialogComponent
     */
    public linkBank(): void {
        this.dialogRef.close('link');
    }

    /**
     * This will be use for integrate new bank account
     *
     * @memberof BankIntegrationDialogComponent
     */
    public integrateBank(): void {
        this.dialogRef.close('integrate');
    }

    /**
    * Releases memory
    *
    * @memberof BankIntegrationDialogComponent
    */
    public ngOnDestroy(): void {
        this.isDestroying = true;

        // Clean up all tracked subscriptions first
        this.subscriptions.forEach((subscription, index) => {
            try {
                if (subscription && !subscription.closed) {
                    subscription.unsubscribe();
                }
            } catch (error) {
                console.warn(`Error unsubscribing subscription ${index}:`, error);
            }
        });
        this.subscriptions = [];

        // Safely complete the destroyed$ subject
        try {
            if (this.destroyed$ && !this.destroyed$.closed) {
                this.destroyed$.next(true);
                this.destroyed$.complete();
            }
        } catch (error) {
            console.warn('Error completing destroyed$ subject:', error);
        }
    }

    /**
     * Helper method to track subscriptions for Angular 21 compatibility
     */
    protected addSubscription(subscription: Subscription): void {
        if (subscription && !subscription.closed) {
            this.subscriptions.push(subscription);
        }
    }


}
