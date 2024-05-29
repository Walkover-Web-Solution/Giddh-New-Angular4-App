import { takeUntil } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { IOption } from '../../theme/ng-select/ng-select';
import { CreateDiscountRequest, IDiscountList } from '../../models/api-models/SettingsDiscount';
import { Observable, of, ReplaySubject } from 'rxjs';
import { AppState } from '../../store';
import { Store, select } from '@ngrx/store';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SalesService } from '../../services/sales.service';
import { SettingsDiscountService } from '../../services/settings.discount.service';
import { ToasterService } from '../../services/toaster.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'setting-discount',
    templateUrl: './discount.component.html',
    styleUrls: ['./discount.component.scss']
})

export class DiscountComponent implements OnInit, OnDestroy {
    /** Holds Delete Discount Confirmation Dialog Template Ref */
    @ViewChild('discountConfirmationDialog', { static: true }) public discountConfirmationDialog: TemplateRef<any>;
    /** Holds Create New Account Dialog Template Ref */
    @ViewChild('createNew', { static: true }) public createNew: TemplateRef<any>;
    /** Holds Discount Type Input Field Element Ref */
    @ViewChild('discountTypeField', { static: true }) public discountTypeField: any;
    /** Holds Translated Discount Type List */
    public discountTypeList: IOption[] = []
    /** Holds Linked Account List */
    public accounts: IOption[];
    /** Holds Create Request */
    public createRequest: CreateDiscountRequest = new CreateDiscountRequest();
    /** Holds Delete Request */
    public deleteRequest: string = null;
    /** Holds Discount list */
    public discountList: IDiscountList[] = [];
    /** Observable for create/update/delete api call in progress */
    public isLoading$: Observable<boolean>;
    /** Observable for create account api call is success */
    private createAccountIsSuccess$: Observable<boolean>;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold local JSON data */
    public localeData: any = {};
    /** This will hold common JSON data */
    public commonLocaleData: any = {};
    /** True if get all discounts api call in progress */
    public isLoading: boolean = false;
    /** Holds Mat Table Display columns */
    public displayedColumns: string[] = ['number', 'name', 'action'];
    /** Holds Discount Confirmation Dialog Ref */
    public discountConfirmationDialogRef: MatDialogRef<any>;
    /** Holds Create New Account Dialog Ref */
    public createNewAccountDialogRef: MatDialogRef<any>

    constructor(
        private salesService: SalesService,
        private store: Store<AppState>,
        private settingsDiscountService: SettingsDiscountService,
        private toaster: ToasterService,
        public dialog: MatDialog
    ) {
        this.createAccountIsSuccess$ = this.store.pipe(select(s => s.groupwithaccounts.createAccountIsSuccess), takeUntil(this.destroyed$));
    }

    /**
     * Lifecycle hook for initialization
     *
     * @memberof DiscountComponent
     */
    public ngOnInit(): void {
        this.getDiscountAccounts();
        this.getDiscounts();

        this.createAccountIsSuccess$.pipe(takeUntil(this.destroyed$)).subscribe((response: boolean) => {
            if (response) {
                this.createNewAccountDialogRef.close();
                this.getDiscountAccounts();
            }
        });
    }

    /**
     * Open Creat Account Aside Pane
     *
     * @memberof DiscountComponent
     */
    public openAccountAsidePane(event: any): void {
        if(event) {
            this.createNewAccountDialogRef = this.dialog.open(this.createNew, {
                width: '768px',
                position: {
                    right: '0',
                    top: '0'
                }
            });
        }
    }

    /**
     * Create / Update Discount API Call
     *
     * @memberof DiscountComponent
     */
    public submit() {
        if (this.createRequest.discountUniqueName) {
            this.isLoading$ = of(true);
            this.settingsDiscountService.UpdateDiscount(this.createRequest, this.createRequest.discountUniqueName).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.showToaster(this.commonLocaleData?.app_messages?.discount_updated, response);
                this.isLoading$ = of(false);
            });
        } else {
            this.isLoading$ = of(true);
            this.settingsDiscountService.CreateDiscount(this.createRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
                this.showToaster(this.commonLocaleData?.app_messages?.discount_created, response);
                this.isLoading$ = of(false);
            });
        }
    }

    /**
     * Set discount details in input feilds to update 
     *
     * @param {IDiscountList} data
     * @memberof DiscountComponent
     */
    public editDiscount(data: IDiscountList) {
        this.createRequest.type = data.discountType;
        this.createRequest.name = data.name;
        this.createRequest.discountValue = data.discountValue;
        this.createRequest.accountUniqueName = data.linkAccount?.uniqueName;
        this.createRequest.discountUniqueName = data.uniqueName;
        this.discountTypeField?.selectField?.nativeElement.focus();
    }

    /**
     * Open delete discount confirmation dialog
     *
     * @param {string} uniqueName
     * @memberof DiscountComponent
     */
    public showDeleteDiscountDialog(uniqueName: string): void {
        this.deleteRequest = uniqueName;
        this.discountConfirmationDialogRef = this.dialog.open(this.discountConfirmationDialog, {
            panelClass: 'modal-dialog',
        });
    }

    /**
     * Close delete discount confirmation dialog
     *
     * @memberof DiscountComponent
     */
    public hideDeleteDiscountModal() {
        this.deleteRequest = null;
        this.discountConfirmationDialogRef.close();
    }

    /**
     * Delete Discount API Call
     *
     * @memberof DiscountComponent
     */
    public deleteDiscount() {
        this.isLoading$ = of(true);
        this.settingsDiscountService.DeleteDiscount(this.deleteRequest).pipe(takeUntil(this.destroyed$)).subscribe(response => {
            this.discountConfirmationDialogRef.close();
            this.showToaster(this.commonLocaleData?.app_messages?.discount_deleted, response);
            this.isLoading$ = of(false);
        });
    }

    /**
     * Fetches the discount accounts
     *
     * @memberof DiscountComponent
     */
    public getDiscountAccounts(): void {
        this.salesService.getAccountsWithCurrency('discount').pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.body?.results) {
                this.accounts = response.body.results.map(discount => {
                    return { label: discount.name, value: discount?.uniqueName };
                });
            } else {
                this.accounts = [];
            }
        });
    }

    /**
     * Callback for translation response complete
     *
     * @param {*} event
     * @memberof DiscountComponent
     */
    public translationComplete(event: any): void {
        if (event) {
            this.discountTypeList = [
                { label: this.localeData?.discount_types?.as_per_value, value: 'FIX_AMOUNT' },
                { label: this.localeData?.discount_types?.as_per_percent, value: 'PERCENTAGE' }
            ];
        }
    }

    /**
     * Fetching list of discounts
     *
     * @private
     * @memberof DiscountComponent
     */
    private getDiscounts(): void {
        this.isLoading = true;
        this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success") {
                this.discountList = response?.body;
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
            this.createRequest = new CreateDiscountRequest();
            this.deleteRequest = null;
            this.getDiscounts();
            this.toaster.successToast(successMessage, this.commonLocaleData?.app_success);
        } else {
            this.toaster.errorToast(response?.message, response?.code);
        }
    }

    /**
     * Get label by value for Dropdown Field
     *
     * @param {*} source
     * @param {string} value
     * @returns {string}
     * @memberof DiscountComponent
     */
    public getDropdownLabelByValue(source: any, value: string): string {
        if (value?.length && source?.length) {
            let filteredArray = source?.filter(item => item.value === value);
            return filteredArray?.length ? filteredArray[0].label : "";
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
