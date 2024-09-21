import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { PaymentMethodDialogComponentStore } from './utility/payment-method-dialog.store';
import { GeneralService } from '../../services/general.service';


@Component({
    selector: 'payment-method-dialog',
    templateUrl: './payment-method-dialog.component.html',
    styleUrls: ['./payment-method-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PaymentMethodDialogComponentStore]
})
export class PaymentMethodDialogComponent implements OnInit {
    /** Instance of payment method */
    @ViewChild('paymentMethod', { static: false }) public paymentMethod: ElementRef;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Store Payment method list API success state as observable*/
    public paymentMethodList$ = this.componentStore.select(state => state.providerList);
    /** Holds Store Provider list API success state as observable*/
    public providerListInProgress$ = this.componentStore.select(state => state.providerListInProgress);
    /** Holds Store Save payment provider company API success state as observable*/
    public saveProviderSuccess$ = this.componentStore.select(state => state.saveProviderSuccess);
    /** Holds Store Delete payment  API success state as observable*/
    public deletePaymentSuccess$ = this.componentStore.select(state => state.deletePaymentSuccess);
    /** Holds Store Set default payment  API success state as observable*/
    public setDetaultPaymentMethodIsSuccess$ = this.componentStore.select(state => state.setDetaultPaymentMethodIsSuccess);
    /** True if form is submitted to show error if available */
    public isFormSubmitted: boolean = false;
    /** Instance for payment method form */
    public paymentMethodForm: FormGroup;
    /** Hold payment provider list */
    public paymentProviderList: any[] = [];
    /** Hold selected payment method label form */
    public paymentProvideLabel: string = "";
    /** This will use for open window */
    private openedWindow: Window | null = null;
    /** Hold payment method list*/
    public paymentMethodList: any[] = [];
    /** True if api is in progress */
    public isLoading: boolean = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private changeDetection: ChangeDetectorRef,
        public dialog: MatDialog,
        private formBuilder: FormBuilder,
        private router: Router,
        private componentStore: PaymentMethodDialogComponentStore,
        private generalService: GeneralService,
        public dialogRef: MatDialogRef<any>
    ) {
    }

    /**
     * Hook cycle for component initialization.
     *
     * @memberof PaymentMethodDialogComponent
     */
    public ngOnInit(): void {
        document.body?.classList?.add("subscription-sidebar");
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        this.localeData = this.inputData?.localeData;
        this.commonLocaleData = this.inputData?.commonLocaleData;
        this.paymentProviderList = [{ label: this.localeData?.gocardless, value: "GOCARDLESS" }]
        this.initForm();
        this.getPaymentMethods();
        this.saveProviderSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.redirectLink) {
                this.openWindow(response.redirectLink);
            }
        });

        this.deletePaymentSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getPaymentMethods();
            }
        });

        this.setDetaultPaymentMethodIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                this.getPaymentMethods();
            }
        });

        window.addEventListener('message', event => {
            if (this.router.url === '/pages/user-details/subscription') {
                if (event?.data && typeof event?.data === "string" && event?.data === "GOCARDLESS") {
                    this.isLoading = true;
                    this.resetForm();
                    this.getPaymentMethods();
                    this.changeDetection.detectChanges();
                }
            }
        });

        this.paymentMethodList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                setTimeout(() => {
                    this.isLoading = false;
                    this.paymentMethodList = response;
                    this.changeDetection.detectChanges();
                }, 700);
            }
        });
    }

    /**
    * This will be open window by url
    *
    * @param {string} url
    * @memberof PaymentMethodDialogComponent
    */
    public openWindow(url: string): void {
        const width = 700;
        const height = 900;
        this.openedWindow = this.generalService.openCenteredWindow(url, '', width, height);
    }

    /**
     * Set default payment method
     *
     * @param {*} payment
     * @memberof PaymentMethodDialogComponent
     */
    public setPaymentDefault(payment: any): void {
        this.componentStore.setDefaultPaymentMethod(payment?.uniqueName);
    }

    /**
     * Delete payment method
     *
     * @param {*} payment
     * @memberof PaymentMethodDialogComponent
     */
    public deletePaymentMethod(payment: any): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '540px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.confirm_payment_delete_message,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.componentStore.deletePaymentMethod(payment?.uniqueName);
            }
        });
    }

    /**
     * Get the payment methods
     *
     * @memberof PaymentMethodDialogComponent
     */
    public getPaymentMethods(): void {
        this.isLoading = true;
        this.componentStore.getPaymentMethodListBySubscriptionId(this.inputData.rowData?.subscriptionId);
    }

    /**
     * This will be use for form intialization
     *
     * @memberof PaymentMethodDialogComponent
     */
    public initForm(): void {
        this.paymentMethodForm = this.formBuilder.group({
            paymentProvider: ['', Validators.required],
            subscriptionId: ['']
        });
    }

    /**
     * Save payment provider
     *
     * @return {*}  {void}
     * @memberof PaymentMethodDialogComponent
     */
    public savePaymentProvider(): void {
        this.isFormSubmitted = false;
        this.paymentMethodForm.get('subscriptionId')?.patchValue(this.inputData.rowData?.subscriptionId);
        if (this.paymentMethodForm.invalid) {
            this.isFormSubmitted = true;
            return;
        }
        this.componentStore.savePaymentMethod(this.paymentMethodForm.value);
    }

    /**
     * Clears the filter and resets the form .
     *
     * @memberof PaymentMethodDialogComponent
     */
    public resetForm(): void {
        this.paymentMethodForm.get('paymentProvider').setValue("");
        this.paymentProvideLabel = '';
        this.paymentMethodForm.reset();
    }


    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Removes "subscription-sidebar" class from body, and completes the subject indicating component destruction.
     *
     * @memberof PaymentMethodDialogComponent
     */
    public ngOnDestroy(): void {
        document.body?.classList?.remove("subscription-sidebar");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
