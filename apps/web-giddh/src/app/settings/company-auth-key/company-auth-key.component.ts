import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IOption } from '../../app.constant';
import { Observable, of, ReplaySubject } from 'rxjs';
import { ToasterService } from '../../services/toaster.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ASIDE_PANE_CONFIG } from '../../app.constant';
import { GeneralService } from '../../services/general.service';
import { CreateCompanyAuthKeyRequest, ICompanyAuthKey } from '../../models/api-models/SettingsCompanyAuthKey';
import { CompanyAuthKeyService } from '../../services/settings.company-auth-key.service';
import { ClipboardService } from 'ngx-clipboard';
import { NewConfirmationModalComponent } from '../../theme/new-confirmation-modal/confirmation-modal.component';

@Component({
    selector: 'setting-company-auth-key',
    templateUrl: './company-auth-key.component.html',
    styleUrls: ['./company-auth-key.component.scss']
})

export class CompanyAuthKeyComponent implements OnInit, OnDestroy {
 /** Holds Create New Account Dialog Template Ref */
    @ViewChild('createNew', { static: true }) public createNew: TemplateRef<any>;
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
    public displayedColumns: string[] = ['number', 'entity','authKey', 'userName', 'roleName', 'action'];
    /** Holds create new company auth key dialog ref */
    public createNewCompanyAuthKeyDialogRef: MatDialogRef<any>;
    /** Voucher API Version */
    public voucherApiVersion: number = 1 | 2

    constructor(
        private companyAuthKeyService: CompanyAuthKeyService,
        private toaster: ToasterService,
        public dialog: MatDialog,
        private generalService: GeneralService,
        private clipboardService: ClipboardService
    ) {
    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof DiscountComponent
     */
    public ngOnInit(): void {
        this.voucherApiVersion = this.generalService.voucherApiVersion;
        this.getCompanyAuthKeys();

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
     * Copy Auth Key
     *
     * @memberof DiscountComponent
     */
    public copyAuthKey(row: any): void {
        this.getAuthKey(row.uniqueName);
    }

    /**
   * Gets auth key by role unique name
   *
   * @private
   * @param {string} roleUser
   * @memberof CreateCompanyAuthKeyComponent
   */
    private getAuthKey(roleUser: string): void {
        this.companyAuthKeyService.GetAuthKey(roleUser).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.clipboardService.copyFromContent(response.body);
                this.toaster.showSnackBar("success", 'Auth key copied successfully');
            } else {
                if (response?.message) {
                    this.toaster.showSnackBar("error", response?.message);
                }
            }
        });
    }

    /**
     * Open delete discount confirmation dialog
     *
     * @param {string} uniqueName
     * @memberof DiscountComponent
     */
    public showDeleteAuthKeyDialog(uniqueName: string): void {
        this.deleteRequest = uniqueName;
        const dialogRef = this.dialog.open(NewConfirmationModalComponent, {
            panelClass: ['mat-dialog-sm'],
            disableClose: true,
            data: {
                configuration: this.generalService.deleteConfiguration(
                    'Are you sure you want to delete this company auth key?',
                    this.commonLocaleData
                )
            }
        });
        dialogRef.afterClosed().subscribe(response => {
            if (response === this.commonLocaleData?.app_yes) {
                this.companyAuthKeyService.DeleteAuthKey(this.deleteRequest).pipe(takeUntil(this.destroyed$)).subscribe(res => {
                    if(res?.status === "success"){
                        this.showToaster('success', res?.body);
                    }else{
                        this.showToaster('error', res?.body ?? res?.message);
                    }
                    this.isLoading$ = of(false);
                });
            }
        });
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
            } else {
                if(response?.message){
                    this.toaster.showSnackBar("error", response?.message);
                }
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
