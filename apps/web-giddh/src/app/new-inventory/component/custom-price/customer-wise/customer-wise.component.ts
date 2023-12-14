import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { SettingsDiscountService } from "apps/web-giddh/src/app/services/settings.discount.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { ConfirmModalComponent } from "apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component";
import { ReplaySubject, Subject, debounceTime, take, takeUntil } from "rxjs";
export interface PeriodicElement {
    name: string;
    price: string;
    radio: string;
    discount: string;
    quantity: string;
    delete: string;
}

export interface CustomerVendorDiscountBasic {
    group: string;
    page: number;
    count: number;
}

const ELEMENT_DATA: any[] = [
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' },
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' },
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' },
    { name: 'Variant', price: '1.0079', radio: 'H', discount: '', quantity: '', delete: '' }
];

@Component({
    selector: "customer-wise",
    templateUrl: "./customer-wise.component.html",
    styleUrls: ["./customer-wise.component.scss"]
})
export class CustomerWiseComponent implements OnInit, OnDestroy {
    /** Instance of Mat Dialog for Add Inventory */
    @ViewChild("addSearchModal") public addSearchModal: TemplateRef<any>;
    /* Table Columns */
    displayedColumns: string[] = ['name', 'price', 'radio', 'discount', 'quantity', 'delete'];
    dataSource = ELEMENT_DATA;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    public pagination = {
        user: {
            page: 1,
            totalPages: null,
        },
        stock: {
            page: 1,
            totalPages: null,
        }
    }
    /** Holds Mat Dailog Reference*/
    public dialogRef: MatDialogRef<any>;
    /* Observable to unsubscribe all the store listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Group uniques name from Params */
    private groupUniqueName: 'sundrydebtors' | 'sundrycreditors';
    /** Holds show loader status */
    public isLoading: boolean = false;
    public apiData: any;
    private userSearchSubject: Subject<string> = new Subject();
    private stockSearchSubject: Subject<string> = new Subject();
    /** Holds User Search Input */
    public userSearch: FormControl = new FormControl();
    /** Holds User Search Input */
    public stockSearch: FormControl = new FormControl();
    public userList: any[] = [];
    public tempUserList: any[] = [];
    public currentUser: any = null;
    public currentUserStocks: any = null;
    public stockData: any[] = [];
    /** List of discounts */
    public discountsList: any[] = [];
    public isDiscountPopupOpen = false;

    public searchForm = new FormGroup({
        userSearch: new FormControl(),
        stockSearch: new FormControl()
    })

    public discountForm: UntypedFormGroup;

    constructor(
        private dialog: MatDialog,
        private _inventoryService: InventoryService,
        private route: ActivatedRoute,
        private toaster: ToasterService,
        private settingsDiscountService: SettingsDiscountService,
        private formBuilder: UntypedFormBuilder
    ) { }

    /**
     * Lifecycle hook for init component
     *
     * @memberof CustomerWiseComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {

            this.isLoading = true;
            this.groupUniqueName = params.type === 'customer-wise' ? 'sundrydebtors' : 'sundrycreditors';
            setTimeout(() => {
                this.isLoading = false;
            }, 200)

            if (this.groupUniqueName) {
                this.discountForm = this.formBuilder.group({
                    customerVendorAccountUniqueName: [''],
                    customerVendorGroupUniqueName: [''],
                    discountInfo: this.formBuilder.array([])
                });


                let model: CustomerVendorDiscountBasic = {
                    page: 1,
                    count: this.paginationLimit,
                    group: this.groupUniqueName
                }

                this._inventoryService.getCustomerVendorDiscountUserList(model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                    if (response && response?.body?.results?.length) {
                        this.userList = response.body.results;
                        if (this.tempUserList?.length) {
                            this.userList = [...this.userList, ...this.tempUserList];
                        }
                    }
                });
            }
        });
        this.searchForm.get("userSearch").valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(selectedValue => {
            console.log(selectedValue);
        });
        this.searchForm.get("stockSearch").valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(selectedValue => {
            console.log(selectedValue);
        });
    }


    private initDiscountForm(discount: any): UntypedFormGroup {
        // console.log("initDiscountForm",discount);        
        return this.formBuilder.group({
            stock: [discount?.stock?.uniqueName],
            units: [discount?.units],
            variants: this.formBuilder.array([])
        });
    }

    private initVariantForm(variant: any): UntypedFormGroup {
        // console.log("initVariantForm",variant);
        return this.formBuilder.group({
            type: [''],
            discountValue: [200],
            price: [variant?.price],
            quantity: [variant?.defaultQuantity],
            inclusiveExclusive: [variant?.discountExclusive],
            stockUnitUniqueName: [variant?.stockUnitUniqueName],
            variantUniqueName: [variant?.variantUniqueName],
            variantName: [variant?.variantName],
            discountUniqueName: [variant?.discountUniqueName]
        });
    }

    /**
     * Get list of discounts
     *
     * @private
     * @memberof CustomerWiseComponent
     */
    private getDiscounts(): void {
        this.settingsDiscountService.GetDiscounts().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response?.status === "success" && response?.body?.length > 0) {
                this.discountsList = response?.body;
                // console.log("discount", response);

            }
        });
    }

    public selectUser(userData: any): void {
        // console.log("selectUser", userData);
        this.currentUser = {};
        this.currentUser = userData;
        let model = {
            page: 1,
            count: this.paginationLimit,
            uniqueName: userData?.uniqueName
        }
        let isTempUser = this.checkTemporaryUser(userData);
        if (isTempUser === -1) {
            this._inventoryService.getAllDiscount(model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                // console.log("response", response);

                //response?.body?.length THIS IS TEMPORY CODE IT WILL CHANGE AFTER API CHANGE (PAGINATED DATA WILL COME IN FUTURE)
                if (response && response?.body?.length) {
                    // console.log("getAllDiscount",response);
                    if (userData?.type === 'ACCOUNT') {
                        this.discountForm.get('customerVendorAccountUniqueName').patchValue(userData?.uniqueName);
                    } else {
                        this.discountForm.get('customerVendorGroupUniqueName').patchValue(userData?.uniqueName);
                    }
                    const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;

                    response?.body.forEach((res, index) => {
                        discounts.push(this.initDiscountForm(res));

                        let variants = (this.discountForm.get('discountInfo') as FormArray).at(index).get('variants') as UntypedFormArray;

                        res?.variants.forEach((variant) => {
                            variants.push(this.initVariantForm(variant));
                        })

                    });

                    console.log("this.discountForm", this.discountForm);
                    this.currentUserStocks = response?.body;

                    this.getDiscounts();
                }
            });
        }
    }

    public confirmationPopup(value: string, type: 'user' | 'stock' | 'variant'): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_delete,
                body: this.localeData?.delete_message,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.commonLocaleData?.app_permanently_delete_message
            },
            width: '600px'
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.deleteItem(value, type);
            } else {
                console.log("Cancel Deleted");
            }
        });
    }

    private deleteItem(value: string, type: string): void {
        let model = {
            userUniqueName: '',
            variantUniqueName: '',
            stockUniqueName: ''
        };

        if (type === 'user') {
            model.userUniqueName = value;
        } else if (type === 'stock') {
            model.stockUniqueName = value;
        } else {
            model.variantUniqueName = value;
        }

        let index = this.checkTemporaryUser(value);
        if (index === -1) {
            this._inventoryService.deleteDiscountRecord(model).pipe(take(1)).subscribe((response) => {
                if (response) {
                    console.log("Delete");
                    console.log(response);
                }
            });
        } else {
            this.tempUserList.splice(index, 1);
            //Delete Temporary User from User List
            let indexInUserListArray = this.checkUserList(value);
            this.userList.splice(indexInUserListArray, 1);
        }
    }

    private checkTemporaryUser(value): number {
        return this.tempUserList.findIndex(element => element.uniqueName === value);
    }
    private checkUserList(value): number {
        return this.userList.findIndex(element => element.uniqueName === value);
    }

    /**
     * Open Add search modal
     *
     * @memberof CustomerWiseComponent
     */
    public openSearchModal(type: 'users' | 'stocks'): void {
        this.apiData = {
            type: type,
            group: this.groupUniqueName,
            page: 1,
            count: this.paginationLimit
        }
        this.dialogRef = this.dialog.open(this.addSearchModal, {
            width: '580px'
        });
    }

    public consoleData(data: any): void {
        console.log(data);
    }

    public onItemSelected(event: any, type: 'users' | 'stocks'): void {
        console.log("onItemSelected", event, "type ", type);
        if (type === 'users') {
            if ((this.checkTemporaryUser(event?.uniqueName) === -1) && (this.checkUserList(event?.uniqueName) === -1)) {
                this.currentUser = event;
                this.userList.push(event);
                this.tempUserList.push(event);
                this.dialogRef.close();
            } else {
                let type = event?.type === 'ACCOUNT' ? 'Account' : 'Group';
                this.toaster.errorToast("This " + type + " Already Added !")
            }
        }
        else {
            this.dialogRef.close();
            if (event.hasVariants) {
                this._inventoryService.getStockVariants(event.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                    if (response) {
                        console.log("getStockVariants", response);
                    }
                })
            }
        }
    }

    public pageChanged(event: any, type: 'user' | 'stock') {
        console.log("pageChanged: ", event, " -- ", type);

    }

    /**
     * Lifecycle hook for destroy component
     *
     * @memberof CustomerWiseComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}