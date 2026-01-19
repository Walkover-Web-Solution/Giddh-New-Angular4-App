import { Component, OnInit, Inject, OnDestroy, EventEmitter, Output, Input } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { IOption } from '../../../app.constant';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'bank-integration-popup',
    styleUrls: ['./bank-integration-popup.component.scss'],
    templateUrl: './bank-integration-popup.component.html',
    standalone: false
})

/**
 * BankIntegrationDialogComponent component
 * Handles bankintegrationdialog functionality and user interactions
 */
export class BankIntegrationDialogComponent implements OnInit, OnDestroy {
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
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
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
