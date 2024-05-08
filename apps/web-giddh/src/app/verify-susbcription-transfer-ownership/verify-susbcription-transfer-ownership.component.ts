import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { SubscriptionComponentStore } from '../subscription/utility/subscription.store';

@Component({
    selector: 'verify-susbcription-transfer-ownership',
    templateUrl: './verify-susbcription-transfer-ownership.component.html',
    styleUrls: ['./verify-susbcription-transfer-ownership.component.scss'],
    providers: [SubscriptionComponentStore]
})
export class VerifySusbcriptionTransferOwnershipComponent implements OnInit {
    /** Template reference for subscription transfer ownership model */
    @ViewChild('transferConfirmation', { static: true }) public dialogBox: TemplateRef<any>;
    /** This holds url to request id */
    public requestId: string = '';
    /** This holds url to login url */
    public loginUrl: string = 'https://giddh.com/login';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* it will store image path */
    public imgPath: string = '';
    /** Instance of modal */
    public modalDialogRef: any;
    /** Hold for accepted subscription*/
    public acceptedSubscription: boolean = false;
    /** HoldsVeirfy Ownership  API success state as observable*/
    public verifyOwnershipSuccess$ = this.componentStore.select(state => state.verifyOwnershipSuccess);
    /** Holds Veirfy Ownership In progress API success state as observable*/
    public verifyOwnershipInProgress$ = this.componentStore.select(state => state.verifyOwnershipInProgress);

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private componentStore: SubscriptionComponentStore) { }


    /**
   * Initializes the component
   *
   * @memberof VerifySusbcriptionTransferOwnershipComponent
   */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.requestId) {
                this.requestId = response.requestId;
            }
        });

        this.dialogOpen();

        this.verifyOwnershipSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.acceptedSubscription = true;
                this.modalDialogRef.close();
            }
        });
    }

    /**
     * Open modal dialog
     *
     * @memberof VerifySusbcriptionTransferOwnershipComponent
     */
    public dialogOpen(): void {
        this.modalDialogRef = this.dialog.open(this.dialogBox, {
            width: '850px'
        });
    }

    /**
     * On close dialog success
     *
     * @param {*} event
     * @memberof VerifySusbcriptionTransferOwnershipComponent
     */
    public onSuccess(event: any): void {
        if (event) {
            this.componentStore.verifyOwnership(this.requestId);
        }
    }

    /**
   * Closes all dialogs
   *
   * @memberof VerifySusbcriptionTransferOwnershipComponent
   */
    public closeAllDialogs(): void {
        this.modalDialogRef.close();
    }

    /**
     * Releases the memory
     *
     * @memberof VerifySusbcriptionTransferOwnershipComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
