import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject, take, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatMenuTrigger } from '@angular/material/menu';
import { SubscriptionComponentStore } from '../utility/subscription.store';
import { ConfirmModalComponent } from '../../theme/new-confirm-modal/confirm-modal.component';
import { PaymentMethodDialogComponentStore } from './utility/payment-method-dialog.store';
import { GeneralService } from '../../services/general.service';

export interface PaymentProviderRequest {
    paymentProvider: string;
    subscriptionId: string;
}

@Component({
    selector: 'payment-method-dialog',
    templateUrl: './payment-method-dialog.component.html',
    styleUrls: ['./payment-method-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [PaymentMethodDialogComponentStore, SubscriptionComponentStore]
})
export class PaymentMethodDialogComponent implements OnInit {
    /** Instance of company list */
    @ViewChild('companyList', { static: false }) public companyList: ElementRef;
    /** Mat menu instance reference */
    @ViewChild(MatMenuTrigger) menu: MatMenuTrigger;
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Store Company list API success state as observable*/
    public paymentMethodList$ = this.componentStore.select(state => state.providerList);
    /** Holds Store Company list API success state as observable*/
    // public paymentMethodListInProgress$ = this.componentStore.select(state => state.paymentMethodListInProgress);
    /** Holds Store Save payment provider company API success state as observable*/
    public saveProviderSuccess$ = this.componentStore.select(state => state.saveProviderSuccess);
    /** Holds Object for Get All Company API Request */
    public paymentProviderRequest: PaymentProviderRequest;
    /** True, if  custom searching  is performed */
    public showClearFilter: boolean = false;
    /** Instance for company list form */
    public paymentMethodForm: FormGroup;
    public paymentProviderList: any[] = [];
    public paymentProvideLabel: string = "";
    /** This will use for open window */
    private openedWindow: Window | null = null;
    public paymentMethodList: any[] = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public inputData,
        private changeDetection: ChangeDetectorRef,
        public dialog: MatDialog,
        private fb: FormBuilder,
        private router: Router,
        private componentStore: PaymentMethodDialogComponentStore,
        private subscriptionComponentStore: SubscriptionComponentStore,
        private generalService: GeneralService,
        public dialogRef: MatDialogRef<any>
    ) {
    }

    /**
     * Hook cycle for component initialization.
     *
     * @memberof CompanyListDialogComponent
     */
    public ngOnInit(): void {
        this.localeData = this.inputData?.localeData;
        this.commonLocaleData = this.inputData?.commonLocaleData;
        this.paymentProviderList = [{ label: this.localeData?.gocardless , value:"GOCARDLESS"}]
        this.dialogRef.updatePosition({ top: '0px', right: '0px' });
        document.body?.classList?.add("subscription-sidebar");
        this.initForm();
        console.log(this.inputData);
        this.paymentMethodForm.get('subscriptionId')?.patchValue(this.inputData.rowData?.subscriptionId);
        this.getPaymentMethods();

        // this.companyList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
        //     if (response) {
        //         this.dataSource = new MatTableDataSource<any>(response?.results);
        //     } else {
        //         this.dataSource = new MatTableDataSource<any>([]);
        //     }
        // });

        this.saveProviderSuccess$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            console.log(response);
            if (response?.redirectLink) {
                this.openWindow(response.redirectLink);
            }
        });

        if (this.router.url === '/pages/user-details/subscription') {
            window.addEventListener('message', event => {
                if (event?.data && typeof event?.data === "string" && event?.data === "GOCARDLESS") {
                    this.getPaymentMethods();
                }
            });
        }

        this.paymentMethodList$.pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response) {
                console.log('payment', response);
                this.paymentMethodList = response;
            }
            this.changeDetection.detectChanges();
        });

    }

    /**
* This will be open window by url
*
* @param {string} url
* @memberof BuyPlanComponent
*/
    public openWindow(url: string): void {
        const width = 700;
        const height = 900;

        this.openedWindow = this.generalService.openCenteredWindow(url, '', width, height);
    }

    public getPaymentMethods(): void {
        this.componentStore.getPaymentMethodListBySubscriptionId(this.inputData.rowData?.subscriptionId);
    }

    /**
     * This will be use for form intialization
     *
     * @memberof CompanyListDialogComponent
     */
    public initForm(): void {
        this.paymentMethodForm = this.fb.group({
            paymentProvider: ['', Validators.required],
            subscriptionId: ['']
        });
    }

    public savePaymentProvider(): void {
        this.componentStore.savePaymentMethod(this.paymentMethodForm.value);
        console.log(this.paymentMethodForm);
    }

    /**
     * Clears the filter and resets the form .
     *
     * @memberof CompanyListDialogComponent
     */
    public resetForm(): void {
        this.initPaymentMethodListRequest();
        this.paymentMethodForm.get('paymentProvider').setValue("");
        this.paymentProvideLabel = '';
        this.paymentMethodForm.reset();
    }


    /**
     * Initialize get all payment method API request object
     *
     * @memberof CompanyListDialogComponent
     */
    private initPaymentMethodListRequest(): void {
        // this.paymentProviderRequest = {
        //     page: 1,
        //     count: this.paymentProviderRequest?.count ?? PAGINATION_LIMIT,
        //     query: '',
        //     sort: 'asc',
        //     sortBy: 'NAME'
        // };
    }

    /**
     * Retrieves the list of all companies in the CompanyListDialogComponent.
     *
     * @memberof CompanyListDialogComponent
     */
    public getAllCompaniesList(): void {
        // let request = {
        //     subscriptionId: this.inputData.rowData?.subscriptionId,
        //     model: this.companyListForm.value,
        //     params: this.companyListRequest
        // };
        // this.componentStore.getCompanyListBySubscriptionId(request);
    }

    /**
     * Navigates to the page for creating a new company within the subscription in the CompanyListDialogComponent.
     *
     * @memberof CompanyListDialogComponent
     */
    public createCompanyInSubscription(): void {
        this.router.navigate(['/pages/new-company/' + this.inputData.rowData?.subscriptionId]);
    }




    /**
     * Archives or unarchives a company in the CompanyListDialogComponent.
     *
     * @param data - The data of the company to be archived or unarchived.
     * @param type - The type of action, whether to archive or unarchive.
     * @memberof CompanyListDialogComponent
     */
    public archiveCompany(data: any, type: string): void {
        let request = {
            companyUniqueName: data.uniqueName,
            status: { archiveStatus: type }
        };
        this.openConfirmationDialog(request);
    }

    /**
     * Open confirmation dialog for archive company
     *
     * @private
     * @param {*} request
     * @memberof CompanyListDialogComponent
     */
    private openConfirmationDialog(request: any): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            width: '540px',
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.confirm_archive_message,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no
            }
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                // this.componentStore.archiveCompany(request);
            }
        });
    }

    /**
     * Lifecycle hook that is called when the component is destroyed.
     * Removes "subscription-sidebar" class from body, and completes the subject indicating component destruction.
     *
     * @memberof CompanyListDialogComponent
     */
    public ngOnDestroy(): void {
        document.body?.classList?.remove("subscription-sidebar");
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

}
