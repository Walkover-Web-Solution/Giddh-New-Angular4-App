import { ScrollDispatcher } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { PAGINATION_LIMIT } from "apps/web-giddh/src/app/app.constant";
import { CreateDiscount } from "apps/web-giddh/src/app/models/api-models/Inventory";
import { SalesEntryClass, SalesTransactionItemClass } from "apps/web-giddh/src/app/models/api-models/Sales";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { SettingsDiscountService } from "apps/web-giddh/src/app/services/settings.discount.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { ConfirmModalComponent } from "apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component";
import { ReplaySubject, Subject, debounceTime, take, takeUntil } from "rxjs";

/** Inteface for create payload for getAllDiscount API */
export interface CustomerVendorDiscountBasic {
    group: string;
    page: number;
    count: number;
    query: string;
}

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
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Pagination limit */
    public paginationLimit: number = PAGINATION_LIMIT;
    /** Holds Pagination Information of (Account & Group) and Stocks  */
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
    /** Holds User Search Input */
    public userSearch: FormControl = new FormControl();
    /** Holds User Search Input */
    public stockSearch: FormControl = new FormControl();
    /** Holds Default and Temprorary Accounts/Groups */
    public userList: any[] = [];
    /** Holds Only Temprorary Accounts/Groups */
    public tempUserList: any[] = [];
    /** Holds Currently selected Accounts/Groups */
    public currentUser: any = null;
    /** Holds Currently selected Accounts's/Groups's  Stocks*/
    public currentUserStocks: any = null;
    /** List of discounts */
    public discountsList: any[] = [];
    /** Search Input form group for Search Account/Groups and Stock/Variants */
    public searchForm: UntypedFormGroup = new UntypedFormGroup({
        userSearch: new FormControl(),
        stockSearch: new FormControl()
    });
    /** Main Form for Discount */
    public discountForm: UntypedFormGroup;
    /** Holds list of variant of all stock which do not apply discount */
    public variantsWithoutDiscount: any[] = [];

    constructor(
        private dialog: MatDialog,
        private inventoryService: InventoryService,
        private route: ActivatedRoute,
        private toaster: ToasterService,
        private settingsDiscountService: SettingsDiscountService,
        private formBuilder: UntypedFormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private scrollDispatcher: ScrollDispatcher
    ) { }

    /**
     * Lifecycle hook for init component
     *
     * @memberof CustomerWiseComponent
     */
    public ngOnInit(): void {
        this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.groupUniqueName = params.type === 'customer-wise' ? 'sundrydebtors' : 'sundrycreditors';
            if (this.groupUniqueName) {
                this.userList = [];
                this.tempUserList = [];
                this.currentUserStocks = null;
                this.variantsWithoutDiscount = [];
                this.initDiscountMainForm();
                this.getCustomerVendorDiscountUserList();
            }
        });

        this.searchForm.get("userSearch").valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(queryString => {
            this.getCustomerVendorDiscountUserList(queryString);
        });

        this.searchForm.get("stockSearch").valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(queryString => {
            this.getAllDiscount(this.currentUser, queryString);
        });
        this.getDiscounts();
        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event && (event?.getDataLength() - event?.getRenderedRange().end) < 10 && !this.isLoading && (this.pagination.user.totalPages >= this.pagination.user.page)) {
                this.pagination.user.page++;
                this.getCustomerVendorDiscountUserList();
            }
        });
    }

    /**
     * Get Default Customer or Vendor Discount List
     *
     * @private
     * @param {string} [query='']
     * @memberof CustomerWiseComponent
     */
    private getCustomerVendorDiscountUserList(query: string = ''): void {
        let model: CustomerVendorDiscountBasic = {
            page: this.pagination.user.page,
            count: this.paginationLimit,
            group: this.groupUniqueName,
            query: query
        };
        this.userList = [];
        this.userList = [...this.userList];
        this.isLoading = true;
        this.inventoryService.getCustomerVendorDiscountUserList(model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.isLoading = false;
            if (response && response?.body?.results?.length) {
                if (this.tempUserList?.length) {
                    this.userList = [...this.userList, ...this.tempUserList];
                } else {
                    this.userList = [...this.userList, ...response.body.results];
                }
            } else {
                this.userList = [];
                this.userList = [...this.userList];
            }
        });
    }

    /**
     * Initiate Discount main form, which have fields 
     * customerVendorAccountUniqueName, 
     * customerVendorGroupUniqueName, 
     * discountInfo
     *
     * @private
     * @memberof CustomerWiseComponent
     */
    private initDiscountMainForm(): void {
        this.discountForm = this.formBuilder.group({
            customerVendorAccountUniqueName: [''],
            customerVendorGroupUniqueName: [''],
            discountInfo: this.formBuilder.array([])
        });
    }

    /**
     *  This function set discount value and return formgroup, which have fields
     *  stockName,
     *  stockUniqueName,
     *  units,
     *  variants
     *
     * @private
     * @param {*} discount
     * @return {*}  {UntypedFormGroup}
     * @memberof CustomerWiseComponent
     */
    private initDiscountForm(discount: any): UntypedFormGroup {
        return this.formBuilder.group({
            stockName: [discount?.stock?.name],
            stockUniqueName: [discount?.stock?.uniqueName, Validators.required],
            isTempStock: [discount?.isTempStock],
            units: [discount?.units],
            variants: this.formBuilder.array([])
        });
    }

    /**
     * This function set Discount > Stock >  Variants value and return formgroup, which all fields related to individual variants
     *
     * @private
     * @param {*} variant
     * @return {*}  {UntypedFormGroup}
     * @memberof CustomerWiseComponent
     */
    private initVariantForm(variant: any): UntypedFormGroup {
        return this.formBuilder.group({
            price: [variant?.price, Validators.required],
            quantity: [variant?.defaultQuantity, Validators.required],
            discountExclusive: [variant?.discountExclusive ?? false, Validators.required], // to ask rishi ji
            stockUnitUniqueName: [variant?.stockUnitUniqueName, Validators.required],
            variantUnitName: [variant?.variantUnitName],
            variantUniqueName: [variant?.uniqueName, Validators.required],
            variantName: [variant?.name],
            discountInfo: [variant?.discountInfo],
            isTemproraryVariant: [variant?.isTemproraryVariant],
            discounts: this.formBuilder.array([])
        });
    }

    private initDiscountValuesForm(discount: any): UntypedFormGroup {
        return this, this.formBuilder.group({
            type: [discount?.type ?? 'FIX_AMOUNT'],
            value: [discount?.value ?? 21], // ?? 11 I added hard code in future will remove it !!!
            uniqueName: [discount?.uniqueName],
        })
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

    /**
     * This function trigger when user from default or temprorary user list is selected
     *
     * @param {*} userData
     * @memberof CustomerWiseComponent
     */
    public selectUser(userData: any): void {
        if (this.currentUser?.uniqueName !== userData?.uniqueName) {
            this.variantsWithoutDiscount = [];
            this.currentUser = userData;
            let isTempUser = this.checkTemporaryUser(userData);
            if (isTempUser === -1) {
                this.getAllDiscount(userData);
            }
        }
    }

    /**
     * It Call Get all discount API which have discount on variants,
     * and  store the value "discountForm" form group
     *
     * @private
     * @param {*} userData
     * @param {string} [query='']
     * @memberof CustomerWiseComponent
     */
    private getAllDiscount(userData: any, query: string = ''): void {
        let model = {
            page: this.pagination.stock.page,
            count: this.paginationLimit,
            uniqueName: userData?.uniqueName,
            query: query
        };
        this.isLoading = true;
        this.inventoryService.getAllDiscount(model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response?.body?.results?.length) {
                this.initDiscountMainForm();
                if (userData?.type === 'ACCOUNT') {
                    this.discountForm.get('customerVendorAccountUniqueName').patchValue(userData?.uniqueName);
                } else {
                    this.discountForm.get('customerVendorGroupUniqueName').patchValue(userData?.uniqueName);
                }

                this.pagination.stock.page = response?.body?.page;
                this.pagination.stock.totalPages = response?.body?.totalPages;

                const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;

                response?.body?.results.forEach((res, index) => {
                    this.variantsWithoutDiscount.push([]);
                    if (res?.hasVariants) {
                        let allVariants = res.variants?.filter(variant => !variant.discounts)?.map(variant => {
                            return {
                                label: variant?.name,
                                value: variant?.uniqueName
                            };
                        });
                        this.variantsWithoutDiscount[index] = allVariants;
                    }

                    res?.units.map(unit => {
                        unit.value = unit?.uniqueName;
                        unit.label = unit?.name;
                    });
                    res['isTempStock'] = false;

                    discounts.push(this.initDiscountForm(res));

                    let variants = (this.discountForm.get('discountInfo') as FormArray).at(index).get('variants') as UntypedFormArray;

                    res?.variants.forEach((variant, variantIndex) => {
                        if (variant?.discounts?.length) {
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
                            variant.variantUnitName = variantUnitName;
                            variant.isTemproraryVariant = false;
                            let discounts;
                            const discountData = [];
                            discounts = [];
                            variant?.discounts.forEach(item => {
                                discountData.push(this.getDiscountDataByUniqueName(item.uniqueName));
                                discounts.push({ type: item.type, value: item.value, uniqueName: item.uniqueName });
                            })
                            variant.discountInfo = discountData;

                            variants.push(this.initVariantForm(variant));
                            discounts.forEach(item => {
                                (variants.at(variantIndex).get('discounts') as UntypedFormArray).push(this.initDiscountValuesForm({ type: item.type, value: item.value, uniqueName: item.uniqueName }))
                            });

                            const variantControl = (((this.discountForm.get('discountInfo') as FormArray).at(index).get('variants') as UntypedFormArray).at(variantIndex) as FormGroup).controls;
                            const formStatus = ((this.discountForm.get('discountInfo') as FormArray).at(index) as UntypedFormArray);
                            variantControl.price.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(priceValue => {
                                console.log("variantControl.Invaild", formStatus.invalid);
                                if (!formStatus.invalid) {
                                    const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                                    let variant = { price: priceValue };
                                    variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                                    this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                                }
                            });
                            variantControl.quantity.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(quantityValue => {
                                if (!formStatus.invalid) {
                                    const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                                    let variant = { quantity: quantityValue };
                                    variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                                    this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                                }
                            });
                            variantControl.discountExclusive.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(discountExclusiveValue => {
                                if (!formStatus.invalid) {
                                    const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                                    let variant = { discountExclusive: discountExclusiveValue };
                                    variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                                    this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                                }
                            });
                            variantControl.stockUnitUniqueName.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(stockUnitUniqueNameValue => {
                                if (!formStatus.invalid) {
                                    const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                                    let variant = { stockUnitUniqueName: stockUnitUniqueNameValue };
                                    variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                                    this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                                }
                            });
                            console.log("this.variantsWithoutDiscount", this.variantsWithoutDiscount);
                        }
                    });
                });
                console.log("discount form ", this.discountForm);

                this.currentUserStocks = response?.body?.results;
            } else {
                this.currentUserStocks = null;
            }
            this.isLoading = false;
        });
    }

    /**
     * This function take variant object,
     * and add discount unique name or discount value and type to that object
     *
     * @private
     * @param {*} variantObject
     * @param {*} variantControl
     * @return {*}  {*}
     * @memberof CustomerWiseComponent
     */
    private getDiscountValueOrUniqueName(variantObject, variantControl): any {
        let discounts = variantControl.discounts.value;
        console.log("getDiscountValueOrUniqueName", discounts);

        variantObject['discounts'] = [];
        discounts.forEach(item => {
            let discountObject = {};
            if (item.uniqueName) {
                discountObject['uniqueName'] = item.uniqueName;
                discountObject['value'] = null;
                discountObject['type'] = null;
            } else {
                discountObject['uniqueName'] = null;
                discountObject['value'] = item.value;
                discountObject['type'] = item.type;
            }
            variantObject['discounts'].push(discountObject)
        });
        return variantObject;
    }

    /**
     * This function take discount unique name,
     * and match with all discount value and return matched object which have all details related to that discount  
     *
     * @private
     * @param {string} discountUniqueName
     * @return {*}  {*}
     * @memberof CustomerWiseComponent
     */
    private getDiscountDataByUniqueName(discountUniqueName: string): any {
        if (this.discountsList.length) {
            const index = this.discountsList.findIndex(item => item['uniqueName'] === discountUniqueName);
            return this.discountsList[index];
        }
    }

    /**
     * Open confirmation popup when user delete User, Stock or Variant,
     * and if user click "Yes" than call delete function
     *
     * @param {string} uniqueName
     * @param {('user' | 'stock' | 'variant')} type
     * @param {number} [stockFormArrayIndex]
     * @param {number} [variantFormArrayIndex]
     * @param {string} [variantName]
     * @memberof CustomerWiseComponent
     */
    public confirmationPopup(uniqueName: string, type: 'user' | 'stock' | 'variant', stockFormArrayIndex?: number, variantFormArrayIndex?: number, variantName?: string, isTemp?: boolean): void {
        let dialogRef = this.dialog.open(ConfirmModalComponent, {
            data: {
                title: this.commonLocaleData?.app_confirmation,
                body: this.localeData?.delete_message,
                ok: this.commonLocaleData?.app_yes,
                cancel: this.commonLocaleData?.app_no,
                permanentlyDeleteMessage: this.commonLocaleData?.app_permanently_delete_message
            },
            width: '600px'
        });

        dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
            if (response) {
                this.deleteItem(uniqueName, type, stockFormArrayIndex, variantFormArrayIndex, variantName, isTemp);
            }
        });
    }

    /**
     * It will used to remove temprorary(users without discount) user added by user
     *
     * @param {number} stockFormArrayIndex
     * @memberof CustomerWiseComponent
     */
    public removeTemporaryVariant(stockFormArrayIndex: number): void {
        this.variantsWithoutDiscount[stockFormArrayIndex].variantUniqueName = null;
        this.variantsWithoutDiscount[stockFormArrayIndex].variantName = null;
    }

    /**
     * It is used to delete Customer/Vendoer, Stock and Variant
     *
     * @private
     * @param {string} uniqueName
     * @param {string} type
     * @param {number} [stockFormArrayIndex]
     * @param {number} [variantFormArrayIndex]
     * @param {string} [variantName]
     * @memberof CustomerWiseComponent
     */
    private deleteItem(uniqueName: string, type: string, stockFormArrayIndex?: number, variantFormArrayIndex?: number, variantName?: string, isTemp?: boolean): void {
        const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;
        const stock = discounts.at(stockFormArrayIndex).get('variants') as UntypedFormArray;
        let model = {
            userUniqueName: this.currentUser.uniqueName,
            variantUniqueName: '',
            stockUniqueName: ''
        };

        if (type === 'stock') {
            model.stockUniqueName = uniqueName;
            // discounts.removeAt(stockFormArrayIndex);
            // if(discounts.length === 0) this.currentUserStocks = null;
            // this.variantsWithoutDiscount.splice(stockFormArrayIndex, 1);
        } else {
            model.variantUniqueName = uniqueName;
            // this.variantsWithoutDiscount[stockFormArrayIndex].variantUniqueName = uniqueName;
            // this.variantsWithoutDiscount[stockFormArrayIndex].variantName = variantName;
        }

        let index = this.checkTemporaryUser(uniqueName);
        if (index === -1 && !isTemp) {
            this.inventoryService.deleteDiscountRecord(model).pipe(take(1)).subscribe((response) => {
                if (response && response?.status === "success") {
                    console.log("deleteDiscountRecord", response);
                    
                    if (type === 'variant') {
                        var variant = stock.at(variantFormArrayIndex)?.value;

                        variant = {
                            label: variant?.variantName,
                            value: variant?.variantUniqueName
                        };
                        /** To add deleted variant info in "variantsWithoutDiscount" array  */
                        this.variantsWithoutDiscount.at(stockFormArrayIndex).push(variant);

                        stock.removeAt(variantFormArrayIndex);
                        console.log("this.variantsWithoutDiscount", this.variantsWithoutDiscount);
                    }
                } else {
                    this.toaster.errorToast(response?.body);
                }
            });
        } else {
            if(type === "user"){
                this.tempUserList.splice(index, 1);
                //Delete Temporary User from User List
                let indexInUserListArray = this.checkUserList(uniqueName);
                this.userList.splice(indexInUserListArray, 1);
            }

            if(type === 'variant'){
                var variant = stock.at(variantFormArrayIndex)?.value;
                variant = {
                    label: variant?.variantName,
                    value: variant?.variantUniqueName
                };
                /** To add deleted variant info in "variantsWithoutDiscount" array  */
                this.variantsWithoutDiscount.at(stockFormArrayIndex).push(variant);
                stock.removeAt(variantFormArrayIndex);
            }

            if(type === 'stock'){
                discounts.removeAt(stockFormArrayIndex);
                if(discounts.length === 0) this.currentUserStocks = null;
                this.variantsWithoutDiscount.splice(stockFormArrayIndex, 1);
            }
        }
    }

    /**
     * This will trigger when user select variant from dropdown,
     * and add variant with blank values in discountForm 
     *
     * @param {*} event
     * @param {number} stockFormArrayIndex
     * @memberof CustomerWiseComponent
     */
    public selectVariant(event: any, stockFormArrayIndex: number): void {
        if (event && event.value && event.label) {
            this.variantsWithoutDiscount.push([]);
            let variants = (this.discountForm.get('discountInfo') as FormArray).at(stockFormArrayIndex).get('variants') as UntypedFormArray;
            let variantObj = {
                price: null,
                quantity: 1,
                discountExclusive: false,
                stockUnitUniqueName: 'nos', // hard code will remove it
                variantUnitName: '',
                uniqueName: event.value,
                name: event.label,
                discountInfo: '',
                isTemproraryVariant: true
            };
            variants.push(this.initVariantForm(variantObj));

            this.variantsWithoutDiscount[stockFormArrayIndex] = this.variantsWithoutDiscount[stockFormArrayIndex].filter(variant => variant.value !== event.value);
            this.changeDetectorRef.detectChanges();
        }
    }

    /**
     * This will trigger when user select Variant unit from dropdown,
     * and set selected value to respective variant formcontrol
     *
     * @param {*} event
     * @param {number} stockFormArrayIndex
     * @param {number} variantFormArrayIndex
     * @memberof CustomerWiseComponent
     */
    public selectVariantUnit(event: any, stockFormArrayIndex: number, variantFormArrayIndex: number): void {
        if (event && event.value && event.label) {
            const variantFormGroup = ((((this.discountForm.get('discountInfo') as FormArray).at(stockFormArrayIndex) as FormGroup).get('variants') as FormArray).at(variantFormArrayIndex) as FormArray);
            variantFormGroup.controls['stockUnitUniqueName'].setValue(event.value);
            variantFormGroup.controls['variantUnitName'].setValue(event.label);
        }
    }

    /**
     * Check User is temprorary (user without discount)
     *
     * @private
     * @param {*} value
     * @return {*}  {number}
     * @memberof CustomerWiseComponent
     */
    private checkTemporaryUser(value): number {
        return this.tempUserList.findIndex(element => element.uniqueName === value);
    }

    /**
     * It check user is in user list or not
     *
     * @private
     * @param {*} value
     * @return {*}  {number}
     * @memberof CustomerWiseComponent
     */
    private checkUserList(value): number {
        return this.userList.findIndex(element => element.uniqueName === value);
    }

    /**
     * Save Discount 
     *
     * @param {number} stockFormArrayIndex
     * @memberof CustomerWiseComponent
     */
    public saveDiscount(stockFormArrayIndex: number): void {

        if (!((this.discountForm.get('discountInfo') as FormArray).at(stockFormArrayIndex) as UntypedFormArray).invalid) {
            const discountFormValues = this.discountForm.value;
            discountFormValues.discountInfo = discountFormValues.discountInfo[stockFormArrayIndex];
            const stockUniqueName = discountFormValues.discountInfo.stockUniqueName;
            const variantDesiredKeys = ['price', 'quantity', 'discountExclusive', 'stockUnitUniqueName', 'variantUniqueName', 'discounts'];
            let filteredData = discountFormValues.discountInfo.variants.map(obj => this.filterKeys(obj, variantDesiredKeys));
            discountFormValues.discountInfo = [];
            filteredData.forEach(item => {
                discountFormValues.discountInfo.push(item);
            })
            this.isLoading = true;
            this.inventoryService.createDiscount(stockUniqueName, discountFormValues).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                this.isLoading = false;
                if (response && response?.status === 'success') {
                    console.log("createDiscount res", response);
                  const discountForm = (this.discountForm.get('discountInfo') as FormArray).at(stockFormArrayIndex) as UntypedFormArray;
                  discountForm.get('isTempStock').patchValue(false);

                  discountForm.controls.forEach( item => {
                        console.log("item ---- ",item);
                  });

                    this.toaster.successToast(response?.body);
                } else {
                    this.toaster.errorToast(response?.message)
                }
            });
        } else {
            this.toaster.errorToast("Invaild Form, Please fill all fields");
            console.log("Discount form ", this.discountForm.value);
        }

    }

    /**
     * This will call patch API to update individual variant field
     *
     * @private
     * @param {string} stockUniqueName
     * @param {string} variantUniqueName
     * @param {*} variant
     * @memberof CustomerWiseComponent
     */
    private updateDiscount(stockUniqueName: string, variantUniqueName: string, variant): void {
        // if(!((this.discountForm.get('discountInfo') as FormArray).at(stockFormArrayIndex) as UntypedFormArray).invalid){ return}
        const model: CreateDiscount = {
            customerVendorAccountUniqueName: this.discountForm.get('customerVendorAccountUniqueName').value,
            customerVendorGroupUniqueName: this.discountForm.get('customerVendorGroupUniqueName').value,
            discountInfo: []
        }
        model.discountInfo.push(variant);
        this.inventoryService.updateDiscount(stockUniqueName, variantUniqueName, model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            console.log("updateDiscount response", response);
            if (response?.status === 'success') {
                this.toaster.successToast(response?.body);
            } else {
                this.toaster.errorToast(response?.body);
            }
        });
    }

    /**
     * Filter Unwanted keys
     *
     * @private
     * @param {*} obj
     * @param {*} keysToKeep
     * @return {*}  {*}
     * @memberof CustomerWiseComponent
     */
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
     * It will open Dailog and show list of User or Stock to add new User or Stock
     *
     * @param {('users' | 'stocks')} type
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

    /**
     * It trigger when user select (Account or  Group) or  Stock 
     *
     * @param {*} event
     * @param {('users' | 'stocks')} type
     * @memberof CustomerWiseComponent
     */
    public onItemSelected(event: any, type: 'users' | 'stocks'): void {
        if (type === 'users') {
            if ((this.checkTemporaryUser(event?.uniqueName) === -1) && (this.checkUserList(event?.uniqueName) === -1)) {
                this.currentUser = event;
                this.userList.push(event);
                this.userList = [...this.userList];
                this.tempUserList.push(event);
                this.initDiscountMainForm();
                this.currentUserStocks = null;
                this.variantsWithoutDiscount = [];
                this.dialogRef.close();
            } else {
                let type = event?.type === 'ACCOUNT' ? 'Account' : 'Group';
                this.toaster.errorToast("This " + type + " Already Added !");
            }
        } else {
            this.inventoryService.getStockDetails(event?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                if (response && response?.body) {
                    const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;
                    let stockIndex = discounts.length;
                    this.variantsWithoutDiscount.push([]);
                    if (this.currentUser.type === 'ACCOUNT') {
                        this.discountForm.get('customerVendorAccountUniqueName').patchValue(this.currentUser.uniqueName);
                    } else {
                        this.discountForm.get('customerVendorGroupUniqueName').patchValue(this.currentUser.uniqueName);
                    }
                    const units = response?.body?.stockUnits?.map(unit => {
                        unit.value = unit?.uniqueName;
                        unit.label = unit?.name;
                        return unit;
                    });

                    discounts.push(this.initDiscountForm({
                        stock: { name: event?.name, uniqueName: event?.uniqueName, isTempStock: true },
                        units: units ?? []
                    }));

                    let variants = (this.discountForm.get('discountInfo') as FormArray).at(stockIndex).get('variants') as UntypedFormArray;
                    response.body?.variants.forEach((variant, variantIndex) => {
                        variants.push(this.initVariantForm({ name: variant?.name, uniqueName: variant?.uniqueName, isTemproraryVariant: true }));
                        (variants.at(variantIndex).get('discounts') as UntypedFormArray).push(this.initDiscountValuesForm({ type: null, value: null, uniqueName: null }))
                    });
                    this.currentUserStocks = event;
                    console.log("variantsWithoutDiscount ", this.variantsWithoutDiscount);
                    console.log("new discountForm ", this.discountForm.value);
                }
            });
            this.dialogRef.close();
        }
    }

    /**
     * Handle page change event for list of Default Stock and Variants 
     *
     * @param {*} event
     * @memberof CustomerWiseComponent
     */
    public pageChanged(event: any): void {
        if (event && this.pagination.stock.page !== event.page) {
            this.pagination.stock.page = event.page;
            this.getAllDiscount(this.currentUser);
        }
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