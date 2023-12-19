import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";
import { SalesEntryClass, SalesTransactionItemClass } from "apps/web-giddh/src/app/models/api-models/Sales";
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
    });

    public discountForm: UntypedFormGroup;
    public variantsWithoutDiscount: any[] = [];
    // public deletedVariantSelectedObject: any = [];

    constructor(
        private dialog: MatDialog,
        private _inventoryService: InventoryService,
        private route: ActivatedRoute,
        private toaster: ToasterService,
        private settingsDiscountService: SettingsDiscountService,
        private formBuilder: UntypedFormBuilder,
        private changeDetectorRef: ChangeDetectorRef
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
                this.initDiscountMainForm();

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
        this.getDiscounts();
    }

    private initDiscountMainForm(): void {
        this.discountForm = this.formBuilder.group({
            customerVendorAccountUniqueName: [''],
            customerVendorGroupUniqueName: [''],
            discountInfo: this.formBuilder.array([])
        });
    }

    private initDiscountForm(discount: any): UntypedFormGroup {
        // console.log("initDiscountForm",discount);        
        return this.formBuilder.group({
            stockName: [discount?.stock?.name],
            stockUniqueName: [discount?.stock?.uniqueName],
            units: [discount?.units],
            variants: this.formBuilder.array([])
        });
    }

    private initVariantForm(variant: any): UntypedFormGroup {
        // console.log("initVariantForm",variant);
        return this.formBuilder.group({
            type: [variant?.discountInfo?.discountType ?? variant?.type ?? 'FIX_AMOUNT', Validators.required],
            discountValue: [variant?.discountInfo?.discountValue ?? variant?.discountValue, Validators.required],
            price: [variant?.price, Validators.required],
            quantity: [variant?.defaultQuantity, Validators.required],
            discountExclusive: [variant?.discountExclusive, Validators.required],
            stockUnitUniqueName: [variant?.stockUnitUniqueName, Validators.required],
            variantUnitName: [variant?.variantUnitName, Validators.required],
            variantUniqueName: [variant?.variantUniqueName, Validators.required],
            variantName: [variant?.variantName],
            discountUniqueName: [variant?.discountUniqueName, Validators.required],
            discountInfo: [variant?.discountInfo]
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
                console.log("discount", response);

            }
        });
    }

    /**
     * This will calculate discount/tax/total
     *
     * @param {SalesEntryClass} entry
     * @param {SalesTransactionItemClass} trx
     * @param {SalesTransactionItemClass} fromTransactionField
     * @memberof CustomerWiseComponent
     */
    public calculateWhenTrxAltered(entry: SalesEntryClass, trx: SalesTransactionItemClass, fromTransactionField: boolean = false): void {
        console.log("calculateWhenTrxAltered", " entry", entry, " trx", trx);
    }

    public selectUser(userData: any): void {
        // console.log("selectUser", userData);
        if (this.currentUser?.uniqueName !== userData?.uniqueName) {

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
                    //response?.body?.length THIS IS TEMPORY CODE IT WILL CHANGE AFTER API CHANGE (PAGINATED DATA WILL COME IN FUTURE)
                    if (response && response?.body?.length) {
                        this.initDiscountMainForm();
                        if (userData?.type === 'ACCOUNT') {
                            this.discountForm.get('customerVendorAccountUniqueName').patchValue(userData?.uniqueName);
                        } else {
                            this.discountForm.get('customerVendorGroupUniqueName').patchValue(userData?.uniqueName);
                        }

                        const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;

                        response?.body.forEach((res, index) => {
                            this.variantsWithoutDiscount.push([]);
                            let variantObject = {};
                            if (res?.hasVariants) {
                                this._inventoryService.getStockVariants(res?.stock?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                                    if (response) {
                                        response?.body?.forEach(variant => {
                                            variantObject = {
                                                label: variant?.name,
                                                value: variant?.uniqueName
                                            }
                                            this.variantsWithoutDiscount[index].push(variantObject);
                                        });
                                    }
                                });
                            } else {
                                variantObject = {
                                    label: res?.variants[0]?.variantName,
                                    value: res?.variants[0]?.variantUniqueName
                                }
                                this.variantsWithoutDiscount[index].push(variantObject);
                            }

                            res?.units.map(unit => {
                                unit.value = unit?.uniqueName;
                                unit.label = unit?.name;
                            });

                            discounts.push(this.initDiscountForm(res));


                            let variants = (this.discountForm.get('discountInfo') as FormArray).at(index).get('variants') as UntypedFormArray;


                            res?.variants.forEach((variant) => {
                                let variantUnitName = null;
                                if (variant?.stockUnitUniqueName) {
                                    if (variantUnitName === null) {
                                        res?.units.forEach(element => {
                                            if (element?.uniqueName === variant?.stockUnitUniqueName) {
                                                variantUnitName = element?.name;
                                            }
                                        });
                                    } else {
                                        variantUnitName = res?.units[0]?.name;
                                    }
                                }
                                if (variant?.discountUniqueName) {
                                    const discountData = this.getDiscountDataByUniqueName(variant?.discountUniqueName);
                                    variant.discountInfo = discountData;
                                    variant.variantUnitName = variantUnitName;
                                }
                                variants.push(this.initVariantForm(variant));
                            });
                        });

                        this.currentUserStocks = response?.body;
                        console.log("discountForm", this.discountForm);
                        setTimeout(() => {
                            this.filterDuplicateVariant();
                        }, 1000);
                    }
                });
            }
        }
    }

    private filterDuplicateVariant(): void {
        this.currentUserStocks.forEach((item, itemIndex) => {
            if (item?.hasVariants) {
                item?.variants.forEach((variant, variantIndex) => {
                    this.variantsWithoutDiscount[itemIndex].forEach((res, i) => {
                        if (variant?.variantUniqueName === res?.value) {
                            this.variantsWithoutDiscount[itemIndex].splice(i, 1);
                        }
                    })
                });
            }
        });
        console.log("this.variantsWithoutDiscount", this.variantsWithoutDiscount);
    }

    private getDiscountDataByUniqueName(discountUniqueName: string): any {
        if (this.discountsList.length) {
            const index = this.discountsList.findIndex(item => item['uniqueName'] === discountUniqueName);
            // this.discountsList[index].isActive = true;
            return this.discountsList[index];
        }
    }


    public confirmationPopup(uniqueName: string, type: 'user' | 'stock' | 'variant', stockFormArrayIndex?: number, variantFormArrayIndex?: number,variantName?: string): void {
        console.log("Deleted CALL FOR uniqueName", uniqueName, " TYPE- ", type, " stockFormArrayIndex", stockFormArrayIndex, " variantFormArrayIndex", variantFormArrayIndex);
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
                this.deleteItem(uniqueName, type, stockFormArrayIndex, variantFormArrayIndex, variantName);
            } else {
                console.log("Cancel Deleted");
            }
        });
    }

    public removeTemporaryVariant(stockFormArrayIndex: number): void {
        this.variantsWithoutDiscount[stockFormArrayIndex].variantUniqueName = null;
        this.variantsWithoutDiscount[stockFormArrayIndex].variantName = null;
    }

    private deleteItem(uniqueName: string, type: string, stockFormArrayIndex?: number, variantFormArrayIndex?: number, variantName?: string): void {
        let model = {
            userUniqueName: '',
            variantUniqueName: '',
            stockUniqueName: ''
        };

        if (type === 'user') {
            model.userUniqueName = uniqueName;
        } else if (type === 'stock') {
            model.stockUniqueName = uniqueName;
        } else {
            model.variantUniqueName = uniqueName;
            this.variantsWithoutDiscount[stockFormArrayIndex].variantUniqueName = uniqueName;
            this.variantsWithoutDiscount[stockFormArrayIndex].variantName = '';

        }

        let index = this.checkTemporaryUser(uniqueName);
        if (index === -1) {
            // this._inventoryService.deleteDiscountRecord(model).pipe(take(1)).subscribe((response) => {
            //     if (response && response?.status === "success") {
            // console.log("deleteDiscountRecord",response);
            const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;
            var stock = discounts.at(stockFormArrayIndex).get('variants') as UntypedFormArray;

            var variant = stock.at(variantFormArrayIndex)?.value;

            variant = {
                label: variant?.variantName,
                value: variant?.variantUniqueName
            }
            /** To add deleted variant info in "variantsWithoutDiscount" array  */
            this.variantsWithoutDiscount.at(stockFormArrayIndex).push(variant);

            stock.removeAt(variantFormArrayIndex);
            console.log("variant", variant);
            console.log("this.variantsWithoutDiscount", this.variantsWithoutDiscount);

            // }
            // });
        } else {
            this.tempUserList.splice(index, 1);
            //Delete Temporary User from User List
            let indexInUserListArray = this.checkUserList(uniqueName);
            this.userList.splice(indexInUserListArray, 1);
        }
    }

    public selectVariant(event: any, stockFormArrayIndex: number): void {
        if (event && event.value && event.label) {
            console.log("selectVariant event ", event, " at ", stockFormArrayIndex);         
            let variantIndex = this.variantsWithoutDiscount[stockFormArrayIndex].findIndex((i) => i.value === event.value);
            this.variantsWithoutDiscount[stockFormArrayIndex].splice(variantIndex,1);
          
            console.log(this.variantsWithoutDiscount[stockFormArrayIndex]);
            // this.variantsWithoutDiscount[stockFormArrayIndex].variantUniqueName = event.value;
            // this.variantsWithoutDiscount[stockFormArrayIndex].variantName = event.label;

            let variants = (this.discountForm.get('discountInfo') as FormArray).at(stockFormArrayIndex).get('variants') as UntypedFormArray;
            // if (variants.value.at(variants.value.length - 1).price === null) {
            //     variants.removeAt(variants.value.length - 1);
            // }
            let variantObj = {
                type: null,
                discountValue: null,
                price: null,
                quantity: 1,
                discountExclusive: false,
                stockUnitUniqueName: 'nos',
                variantUnitName: '',
                variantUniqueName: event.value,
                variantName: event.label,
                discountUniqueName: 'y331702973018660',
                discountInfo: ''
            }
            variants.push(this.initVariantForm(variantObj));

            console.log("discount form", this.discountForm);
            setTimeout(()=>{
                this.changeDetectorRef.detectChanges();
            },100);
        }
    }

    public selectVariantUnit(event: any, stockFormArrayIndex: number, variantFormArrayIndex: number): void {
        if (event && event.value && event.label) {
            
            const variantFormGroup = ((((this.discountForm.get('discountInfo') as FormArray).at(stockFormArrayIndex) as FormGroup).get('variants') as FormArray).at(variantFormArrayIndex) as FormArray);
            variantFormGroup.controls['stockUnitUniqueName'].setValue(event.value);
            // console.log("discount",this.discountForm);
            // console.log("selectVariantUnit event ", event, " at ", stockFormArrayIndex);
        }
    }

    private checkTemporaryUser(value): number {
        return this.tempUserList.findIndex(element => element.uniqueName === value);
    }

    private checkUserList(value): number {
        return this.userList.findIndex(element => element.uniqueName === value);
    }

    public saveDiscount(stockFormArrayIndex: number): void {
        const discountFormValues = this.discountForm.value;
        discountFormValues.discountInfo = discountFormValues.discountInfo[stockFormArrayIndex];

        const stockUniqueName = discountFormValues.discountInfo.stockUniqueName;
        console.log("stockUniqueName", stockUniqueName);
        console.log("discountFormValues before ", discountFormValues);

        const variantDesiredKeys = ['type', 'discountValue', 'price', 'quantity', 'discountExclusive', 'stockUnitUniqueName', 'variantUniqueName', 'discountUniqueName'];
        let x = discountFormValues.discountInfo.variants.map(obj => this.filterKeys(obj, variantDesiredKeys));
        discountFormValues.discountInfo = [];
        x.forEach(item => {
            discountFormValues.discountInfo.push(item);
        })
        this._inventoryService.createDiscount(stockUniqueName, discountFormValues).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response) {
                console.log("createDiscount res", response);
            }
        });
    }

    private filterKeys(obj, keysToKeep): any {
        const filteredObject = {};
        keysToKeep.forEach(key => {
            if (obj.hasOwnProperty(key)) {
                filteredObject[key] = obj[key];
            }
        });
        return filteredObject;
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