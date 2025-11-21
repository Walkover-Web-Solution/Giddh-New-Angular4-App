import { take, takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IOption } from '../../app.constant';
import { CreateDiscountRequest, IDiscountList } from '../../models/api-models/SettingsDiscount';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { SalesService } from '../../services/sales.service';
import { SettingsDiscountService } from '../../services/settings.discount.service';
import { ToasterService } from '../../services/toaster.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateDiscountComponent } from '../../theme/create-discount/create-discount.component';
import { ASIDE_PANE_CONFIG } from '../../app.constant';
import { GeneralService } from '../../services/general.service';
import { CreateCompanyAuthKeyRequest, ICompanyAuthKey } from '../../models/api-models/SettingsCompanyAuthKey';
import { CompanyAuthKeyService } from '../../services/settings.company-auth-key.service';

@Component({
    selector: 'setting-company-auth-key',
    templateUrl: './company-auth-key.component.html',
    styleUrls: ['./company-auth-key.component.scss']
})

export class CompanyAuthKeyComponent implements OnInit, OnDestroy {
    /** Holds Delete Discount Confirmation Dialog Template Ref */
    @ViewChild('companyAuthKeyConfirmationDialog', { static: true }) public companyAuthKeyConfirmationDialog: TemplateRef<any>;
    /** Holds Create New Account Dialog Template Ref */
    @ViewChild('createNew', { static: true }) public createNew: TemplateRef<any>;
    /** Holds Translated Discount Type List */
    public discountTypeList: IOption[] = []
    /** Holds Linked Account List */
    public accounts: IOption[];
    /** Holds Create Request */
    public createRequest: CreateCompanyAuthKeyRequest = new CreateCompanyAuthKeyRequest();
    /** Holds Delete Request */
    public deleteRequest: string = null;
    /** Holds Discount list */
    public companyAuthKeyList: ICompanyAuthKey[] = [];
    /** Observable for create/update/delete api call in progress */
    public isLoading$: Observable<boolean>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if get all discounts api call in progress */
    public isLoading: boolean = false;
    /** Holds Mat Table Display columns */
    public displayedColumns: string[] = ['number', 'authKey', 'userName','roleName','emailId','from','to','action'];
    /** Holds Discount Confirmation Dialog Ref */
    public companyAuthKeyConfirmationDialogRef: MatDialogRef<any>;
    /** Holds Create New Account Dialog Ref */
    public createNewCompanyAuthKeyDialogRef: MatDialogRef<any>;
    /** Holds Create/Update discount Dialog Ref */
    public createUpdateDiscountRef: MatDialogRef<any>;
    /** Voucher API Version */
    public voucherApiVersion: number;

    constructor(
        private companyAuthKeyService: CompanyAuthKeyService,
        private toaster: ToasterService,
        public dialog: MatDialog,
        private generalService: GeneralService
    ) {
    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof DiscountComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.getCompanyAuthKeyRoles();
        this.getCompanyAuthKeys();

    }

    /**
     * Open Create Account Aside Pane
     *
     * @memberof DiscountComponent
     */
    public openAccountAsidePane(event: any): void {
        if (event) {
            this.createNewCompanyAuthKeyDialogRef = this.dialog.open(this.createNew, ASIDE_PANE_CONFIG);
        }
    }

     /**
     * Open Create/Update Discount Aside Pane
     *
     * @memberof DiscountComponent
     */
    public openCreateEditCompanyAuthKeyAsidePane(authKeyInfo?: CreateCompanyAuthKeyRequest): void {
        this.createNewCompanyAuthKeyDialogRef = this.dialog.open(this.createNew, {
            data: authKeyInfo ?? null,
            ...ASIDE_PANE_CONFIG
        });

        this.createNewCompanyAuthKeyDialogRef.afterClosed().subscribe(response => {
            if (response) {
                this.getCompanyAuthKeys();
            }
        });
    }


     /**
     * Open Create/Update Discount Aside Pane
     *
     * @memberof DiscountComponent
     */
     public closeCreateEditDiscountAsidePane(): void {
        this.createUpdateDiscountRef?.close();
        this.createRequest.roleName = null;
        this.createRequest.allowedCidrs = null;
        this.createRequest.allowedIps = null;
        this.createRequest.from = null;
        this.createRequest.to = null;
        this.createRequest.duration = null;
        this.createRequest.reGenerateAuthKey = null;
    }


    /**
     * Open delete discount confirmation dialog
     *
     * @param {string} uniqueName
     * @memberof DiscountComponent
     */
    public showDeleteAuthKeyDialog(uniqueName: string): void {
        this.deleteRequest = uniqueName;
        this.companyAuthKeyConfirmationDialogRef = this.dialog.open(this.companyAuthKeyConfirmationDialog, {
            panelClass: 'modal-dialog'
        });
    }

    /**
     * Close delete discount confirmation dialog
     *
     * @memberof DiscountComponent
     */
    public hideDeleteDiscountModal() {
        this.deleteRequest = null;
        this.companyAuthKeyConfirmationDialogRef?.close();
    }

    /**
     * Delete Discount API Call
     *
     * @memberof DiscountComponent
     */
    public deleteDiscount() {
        this.isLoading$ = of(true);
        this.companyAuthKeyService.DeleteAuthKey(this.deleteRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.companyAuthKeyConfirmationDialogRef?.close();
            this.showToaster(this.commonLocaleData?.app_messages?.discount_deleted, response);
            this.isLoading$ = of(false);
        });
    }

    /**
     * Fetches the discount accounts
     *
     * @memberof DiscountComponent
     */
    public getCompanyAuthKeyRoles(): void {
        // this.salesService.getAccountsWithCurrency('discount').pipe(takeUntil(this.destroyed$)).subscribe(response => {
        //     if (response?.body?.results) {
        //         this.accounts = response.body.results.map(discount => {
        //             return { label: discount.name, value: discount?.uniqueName };
        //         });
        //     } else {
        //         this.accounts = [];
        //     }
        // });
    }

    /**
     * Fetching list of discounts
     *
     * @private
     * @memberof DiscountComponent
     */
    private getCompanyAuthKeys(): void {
        this.isLoading = true;
        this.companyAuthKeyService.GetAllAuthKeys().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.companyAuthKeyList = response?.body;
            }
            this.isLoading = false;
        });
    }

    /**
     * This will show toaster for success/error message and will get all discounts if success response received
     *
     * @private
     * @param {string} successMessage
     * @param {*} response
     * @memberof DiscountComponent
     */
    private showToaster(successMessage: string, response: any): void {
        this.toaster.clearAllToaster();
        if (response?.status === "success") {
            this.createRequest = new CreateCompanyAuthKeyRequest();
            this.deleteRequest = null;
            this.getCompanyAuthKeys();
            this.toaster.successToast(successMessage, this.commonLocaleData?.app_success);
        } else {
            this.toaster.errorToast(response?.message, response?.code);
        }
    }

    /**
     * Unsubscribes from all the listeners
     *
     * @memberof DiscountComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
