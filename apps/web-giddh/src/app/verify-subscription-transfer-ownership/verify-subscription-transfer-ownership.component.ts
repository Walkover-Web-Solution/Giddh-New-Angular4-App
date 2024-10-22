import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, ReplaySubject, takeUntil } from 'rxjs';
import { SubscriptionComponentStore } from '../subscription/utility/subscription.store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { COUNTRY_REGION_MAP } from '../app.constant';
import { GeneralService } from '../services/general.service';

@Component({
    selector: 'verify-subscription-transfer-ownership',
    templateUrl: './verify-subscription-transfer-ownership.component.html',
    styleUrls: ['./verify-subscription-transfer-ownership.component.scss'],
    providers: [SubscriptionComponentStore]
})
export class VerifySubscriptionTransferOwnershipComponent implements OnInit {
    /** Transfer confirmation reference */
    @ViewChild('transferConfirmation', { static: true }) public dialogBox: TemplateRef<any>;
    /** Reject Confirmation reference for subscription */
    @ViewChild('rejectConfirmation', { static: true }) public rejectDialog: TemplateRef<any>;
    /** This holds url to request id */
    public requestId: string = '';
    /** This holds url to login url */
    public loginUrl: string = '';
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /* it will store image path */
    public imgPath: string = '';
    /** Instance of modal */
    public modalDialogRef: any;
    /** Instance of reject modal */
    public rejectModalDialogRef: any;
    /** Hold for accepted subscription*/
    public acceptedSubscription: boolean = false;
    /** HoldsVeirfy Ownership  API success state as observable*/
    public verifyOwnershipSuccess$: Observable<any> = this.componentStore.select(state => state.verifyOwnershipSuccess);
    /** Holds Veirfy Ownership In progress API success state as observable*/
    public verifyOwnershipInProgress$: Observable<any> = this.componentStore.select(state => state.verifyOwnershipInProgress);
    /** Reject reason API success state as observable*/
    public rejectReason$: Observable<any> = this.componentStore.select(state => state.rejectReason);
    /** Instance form group of reject */
    public rejectForm: FormGroup;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};

    constructor(
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private componentStore: SubscriptionComponentStore,
        private formBuilder: FormBuilder,
        private generalService: GeneralService
    ) {
        this.loginUrl = this.generalService.getGiddhRegionUrl();
    }


    /**
   * Initializes the component
   *
   * @memberof VerifySubscriptionTransferOwnershipComponent
   */
    public ngOnInit(): void {
        this.imgPath = isElectron ? 'assets/images/' : AppUrl + APP_FOLDER + 'assets/images/';

        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.requestId) {
                this.requestId = response.requestId;
            }
        });

        this.dialogOpen();
        this.rejectForm = this.formBuilder.group({
            reason: ['']
        });

        combineLatest([
            this.verifyOwnershipSuccess$.pipe(takeUntil(this.destroyed$)),
            this.rejectReason$.pipe(takeUntil(this.destroyed$))
        ]).subscribe(([verified, reject]) => {
            if (verified && !reject?.reqId) {
                this.acceptedSubscription = true;
                this.modalDialogRef.close();
            } else if (verified && reject?.reqId) {
                this.acceptedSubscription = false;
                this.dialog?.closeAll();
            }
        });
    }

    /**
     * Open modal dialog
     *
     * @memberof VerifySubscriptionTransferOwnershipComponent
     */
    public dialogOpen(): void {
        this.modalDialogRef = this.dialog.open(this.dialogBox, {
            width: '850px',
            disableClose: true
        });
    }

    /**
     * On submit verify ownership
     *
     * @param {*} event
     * @memberof VerifySubscriptionTransferOwnershipComponent
     */
    public onSubmit(event: any, isReject: boolean = false): void {
        if (!isReject) {
            this.componentStore.verifyOwnership(this.requestId);
        } else {
            let reqObj = {
                reqId: this.requestId,
                reason: this.rejectForm.value.reason
            };
            this.componentStore.verifyOwnership(reqObj);
        }
    }

    /**
   * Closes all dialogs
   *
   * @memberof VerifySubscriptionTransferOwnershipComponent
   */
    public onReject(): void {
        this.rejectModalDialogRef = this.dialog.open(this.rejectDialog, {
            width: '850px',
            disableClose: true
        });
    }

    /**
     * Reject dialog close event
     *
     * @memberof VerifySubscriptionTransferOwnershipComponent
     */
    public closeReject(): void {
        this.rejectModalDialogRef?.close();
    }

    /**
     * Releases the memory
     *
     * @memberof VerifySubscriptionTransferOwnershipComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
