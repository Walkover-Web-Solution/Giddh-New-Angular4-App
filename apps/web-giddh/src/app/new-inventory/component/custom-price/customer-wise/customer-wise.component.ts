import { CdkScrollable, ScrollDispatcher } from "@angular/cdk/scrolling";
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { cloneDeep } from "apps/web-giddh/src/app/lodash-optimized";
import { CreateDiscount } from "apps/web-giddh/src/app/models/api-models/Inventory";
import { InventoryService } from "apps/web-giddh/src/app/services/inventory.service";
import { SettingsDiscountService } from "apps/web-giddh/src/app/services/settings.discount.service";
import { ToasterService } from "apps/web-giddh/src/app/services/toaster.service";
import { ConfirmModalComponent } from "apps/web-giddh/src/app/theme/new-confirm-modal/confirm-modal.component";
import { ReplaySubject, debounceTime, take, takeUntil } from "rxjs";

/** Inteface for create payload for getAllDiscount API */
export interface CustomerVendorDiscountBasic {
    group: string;
    page: number;
    count: number;
    query: string;
    userType: string;
}

@Component({
    selector: "customer-wise",
    templateUrl: "./customer-wise.component.html",
    styleUrls: ["./customer-wise.component.scss"]
})
export class CustomerWiseComponent implements OnInit, OnDestroy {
    /** Instance of Mat Dialog for Add Inventory */
    @ViewChild("addSearchModal") public addSearchModal: TemplateRef<any>;
    /** Holds HTML Element Reference */
    @ViewChild('stocksContainer', { static: true }) stocksContainer: ElementRef;
    /** CDK Scrollable Reference */
    @ViewChild(CdkScrollable) cdkScrollable: CdkScrollable;
    /* This will hold local JSON data */
    public localeData: any = {};
    /* This will hold common JSON data */
    public commonLocaleData: any = {};
    /** Pagination limit, items per page */
    public paginationLimit: number = 100;
    /** Holds Pagination Information of (Account & Group) and Stocks  */
    public pagination: any;
    /** Holds Mat Dailog Reference*/
    public dialogRef: MatDialogRef<any>;
    /* Observable to unsubscribe all the store listeners */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** Holds Group uniques name from Params */
    private groupUniqueName: 'sundrydebtors' | 'sundrycreditors';
    /** Holds type of user */
    private userType: 'customer' | 'vendor';
    /** Holds show loader status  when user api call*/
    public isLoading: boolean = false;
    /** Holds show loader status when stock api call*/
    public isStockLoading: boolean = false;
    /** Holds search data */
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
    public currentUserStocks: any[] = [];
    /** List of discounts */
    public discountsList: any[] = [];
    /** Search Input form group for Search Account/Groups and Stock/Variants */
    public searchForm: UntypedFormGroup = new UntypedFormGroup({
        userSearch: new FormControl(''),
        stockSearch: new FormControl('')
    });
    /** Main Form for Discount */
    public discountForm: UntypedFormGroup;
    /** Holds list of variant of all stock which do not apply discount */
    public variantsWithoutDiscount: any[] = [];
    /** Variant object keys */
    private variantDesiredKeys: any[] = ['price', 'quantity', 'taxInclusive', 'stockUnitUniqueName', 'variantUniqueName', 'discounts'];
    /** User search string */
    public userSearchQuery: string = "";
    /** Stock search string */
    public stockSearchQuery: any = "";
    /** Holds Variants Dropdown default value */
    public variantsDropdownDefaultValue: any;
    /** Hold Filter Type Value */
    public userFilterType: 'account' | 'group' | 'all' = 'all';
    /** True if any stock or variant will be added */
    public showSaveDiscardButton: boolean = false;
    /** Holds list of stock/variant */
    public stockVariants: any[] = [];

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
            this.userType = params.type === 'customer-wise' ? 'customer' : 'vendor';
            if (this.groupUniqueName) {
                this.searchForm.reset();
                this.userList = [];
                this.tempUserList = [];
                this.currentUserStocks = [];
                this.variantsWithoutDiscount = [];
                this.userFilterType = 'all';
                this.currentUser = null;
                this.pagination = this.paginationInit();
                this.initDiscountMainForm();
                this.getCustomerVendorDiscountUserList();
            }
        });
        this.searchForm.get("userSearch").valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(queryString => {
            if (this.searchForm.get('userSearch').value !== null) {
                this.userSearchQuery = queryString;
                this.currentUser = null;
                this.currentUserStocks = [];
                this.getCustomerVendorDiscountUserList();
            }
        });

        this.searchForm.get("stockSearch").valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(queryString => {
            if (this.searchForm.get('stockSearch').value !== null) {
                this.stockSearchQuery = queryString;
                this.pagination.stock.page = 1;
                this.getAllDiscount(this.currentUser, queryString);
            }
        });

        this.getDiscounts();

        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            if (event && (event?.getDataLength() - event?.getRenderedRange().end) < 10 && !this.isLoading && (this.pagination.user.totalPages > this.pagination.user.page)) {
                this.pagination.user.page++;
                this.getCustomerVendorDiscountUserList(true);
            }
        });

    }

    /**
     * Initailise Pagination and aslo use to reset pagination
     *
     * @private
     * @return {*}  {*}
     * @memberof CustomerWiseComponent
     */
    private paginationInit(): any {
        return {
            user: {
                page: 1,
                totalPages: null,
                totalItems: null
            },
            stock: {
                page: 1,
                totalPages: null,
                totalItems: null
            }
        }
    }

    /**
     * Get Default Customer or Vendor Discount List
     *
     * @private
     * @param {string} [query='']
     * @memberof CustomerWiseComponent
     */
    private getCustomerVendorDiscountUserList(isLoadMore: boolean = false): void {
        this.isLoading = true;
        let model: CustomerVendorDiscountBasic = {
            page: this.pagination.user.page,
            count: this.paginationLimit,
            group: this.groupUniqueName,
            userType: this.userFilterType,
            query: this.userSearchQuery
        };

        if (!isLoadMore) {
            this.userList = [];
        }

        this.inventoryService.getCustomerVendorDiscountUserList(model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.isLoading = false;
            this.currentUserStocks = [];
            this.currentUser = null;
            if (response && response?.body?.results?.length) {
                this.pagination.user.page = response?.body?.page;
                this.pagination.user.totalPages = response?.body?.totalPages;
                this.pagination.user.totalItems = response?.body?.totalItems;

                if (this.tempUserList?.length && this.pagination.user.page === 1) {
                    this.userList = [...this.userList, ...this.tempUserList, ...response.body.results];
                } else {
                    this.userList = [...this.userList, ...response.body.results];
                }
                if (this.userList?.length && !isLoadMore) {
                    this.selectUser(this.userList[0]);
                }
                this.changeDetectorRef.detectChanges();
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
     *  This function set discount value and return UntypedFormGroup, which have fields
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
            hasVariants: [discount?.hasVariants],
            variants: this.formBuilder.array([])
        });
    }

    /**
     * This function set Discount > Stock >  Variants value and return UntypedFormGroup, which all fields related to individual variants
     *
     * @private
     * @param {*} variant
     * @return {*}  {UntypedFormGroup}
     * @memberof CustomerWiseComponent
     */
    private initVariantForm(variant: any): UntypedFormGroup {
        return this.formBuilder.group({
            price: [variant?.price],
            quantity: [variant?.defaultQuantity],
            taxInclusive: [variant?.taxInclusive ?? false],
            stockUnitUniqueName: [variant?.stockUnitUniqueName],
            variantUnitCode: [variant?.variantUnitCode],
            variantUniqueName: [variant?.uniqueName],
            variantName: [variant?.name],
            isTemproraryVariant: [variant?.isTemproraryVariant],
            discounts: [variant?.discounts],
            discountName: [variant?.discountName]
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
                this.discountsList = response?.body.map(item => {
                    return {
                        label: item?.name,
                        value: item?.uniqueName,
                        additional: item
                    }
                });
                this.discountsList.unshift({
                    label: this.localeData?.select_discount,
                    value: null
                });
            }
        });

    }

    /**
     * This function trigger when user from default or temprorary user list is selected
     *
     * @param {*} userData
     * @memberof CustomerWiseComponent
     */
    public selectUser(userData: any, fromDiscard: boolean = false): void {
        if (this.currentUser?.uniqueName !== userData?.uniqueName || fromDiscard) {
            this.showSaveDiscardButton = false;
            this.variantsWithoutDiscount = [];
            this.currentUser = userData;
            this.pagination = this.paginationInit();
            let isTempUser = this.checkTemporaryUser(userData);
            if (isTempUser === -1) {
                this.currentUser['isTempUser'] = false;
                this.getAllDiscount(userData, this.stockSearchQuery);
            } else {
                this.currentUser['isTempUser'] = true;
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
        this.isStockLoading = true;
        this.inventoryService.getAllDiscount(model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response && response?.body?.results?.length) {
                this.initialiseAllDiscounts(userData, cloneDeep(response));
            } else {
                this.currentUserStocks = [];
            }
            this.isStockLoading = false;
        });
    }

    /**
     * To assign values of all discounts to form
     *
     * @private
     * @param {*} userData
     * @param {*} responseData
     * @memberof CustomerWiseComponent
     */
    private initialiseAllDiscounts(userData: any, responseData: any): void {
        this.initDiscountMainForm();
        let getAllDiscountApiResponse = cloneDeep(responseData);
        if (userData?.type === 'ACCOUNT') {
            this.discountForm.get('customerVendorAccountUniqueName').patchValue(userData?.uniqueName);
        } else {
            this.discountForm.get('customerVendorGroupUniqueName').patchValue(userData?.uniqueName);
        }

        this.pagination.stock.page = responseData?.body?.page;
        this.pagination.stock.totalPages = responseData?.body?.totalPages;
        this.pagination.stock.totalItems = responseData?.body?.totalItems;

        const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;

        responseData?.body?.results.forEach((res, index) => {
            this.variantsWithoutDiscount.push([]);
            if (res?.hasVariants) {
                this.variantsWithoutDiscount[index] = res.dropDownVariants?.map(variant => {
                    return {
                        label: variant?.name,
                        value: variant?.uniqueName
                    };
                });
            }

            res['isTempStock'] = false;
            res['hasVariants'] = res?.hasVariants;

            discounts.push(this.initDiscountForm(res));

            let variants = (this.discountForm.get('discountInfo') as UntypedFormArray).at(index).get('variants') as UntypedFormArray;

            res?.variants.forEach((variant, variantIndex) => {
                if (Object.keys(variant).length > 2) {
                    let variantUnitCode = null;
                    if (variant?.stockUnitUniqueName) {
                        if (variantUnitCode === null) {
                            res?.units.forEach(element => {
                                if (element?.uniqueName === variant?.stockUnitUniqueName) {
                                    variantUnitCode = element?.code;
                                }
                            });
                        } else {
                            variantUnitCode = res?.units[0]?.code;
                        }
                    }
                    variant.variantUnitCode = variantUnitCode;
                    variant.isTemproraryVariant = false;

                    if (getAllDiscountApiResponse?.body?.results[index]?.variants[variantIndex]?.discounts[0]?.discount?.uniqueName) {
                        variant.discounts = [{ uniqueName: getAllDiscountApiResponse?.body?.results[index].variants[variantIndex]?.discounts[0]?.discount?.uniqueName }];
                        variant.discountName = getAllDiscountApiResponse?.body?.results[index].variants[variantIndex]?.discounts[0]?.discount?.name;
                    } else {
                        variant.discounts = null;
                    }
                    variants.push(this.initVariantForm(variant));
                    const variantControl = (((this.discountForm.get('discountInfo') as UntypedFormArray).at(index).get('variants') as UntypedFormArray).at(variantIndex) as UntypedFormGroup).controls;

                    variantControl.discounts.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(discountsValue => {
                        const stockUniqueName = (this.discountForm.get('discountInfo') as UntypedFormArray).at(index).get('stockUniqueName').value;
                        let variant = { discounts: discountsValue };
                        this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                    });

                    variantControl.taxInclusive.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(taxInclusiveValue => {
                        const stockUniqueName = (this.discountForm.get('discountInfo') as UntypedFormArray).at(index).get('stockUniqueName').value;
                        let variant = { taxInclusive: taxInclusiveValue };
                        this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                    });
                    variantControl.price.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(priceValue => {
                        const stockUniqueName = (this.discountForm.get('discountInfo') as UntypedFormArray).at(index).get('stockUniqueName').value;
                        let variant = { price: priceValue };
                        this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                    });
                }
            });
        });
        this.currentUserStocks = responseData?.body?.results;
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
    public confirmationPopup(uniqueName: string, type: 'user' | 'stock' | 'variant', isTemp?: boolean, stockFormArrayIndex?: number, variantFormArrayIndex?: number): void {
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
                this.deleteItem(uniqueName, type, isTemp, stockFormArrayIndex, variantFormArrayIndex);
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
    private deleteItem(uniqueName: string, type: string, isTemp?: boolean, stockFormArrayIndex?: number, variantFormArrayIndex?: number): void {
        const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;
        let model = {
            userUniqueName: this.currentUser.uniqueName,
            variantUniqueName: (type === 'variant') ? uniqueName : '',
            stockUniqueName: (type === 'stock') ? uniqueName : '',
        };

        let index = 0;

        if (type === "user") {
            index = this.checkTemporaryUser(uniqueName);
            if (index > -1) {
                isTemp = true;
            }
        }
        if (!isTemp) {
            this.inventoryService.deleteDiscountRecord(model).pipe(take(1)).subscribe((response) => {
                if (response && response?.status === "success") {
                    this.showSaveDiscardButton = false;
                    if (type === 'variant') {
                        const stock = discounts.at(stockFormArrayIndex).get('variants') as UntypedFormArray;
                        var variant = stock.at(variantFormArrayIndex)?.value;

                        variant = {
                            label: variant?.variantName,
                            value: variant?.variantUniqueName
                        };
                        /** To add deleted variant info in "variantsWithoutDiscount" array  */
                        this.variantsWithoutDiscount.at(stockFormArrayIndex).push(variant);
                        stock.removeAt(variantFormArrayIndex);
                    }
                    if (type === 'user') {
                        let indexInUserListArray = this.checkUserList(uniqueName);
                        this.userList.splice(indexInUserListArray, 1);
                        this.userList = [...this.userList];
                        this.currentUser = null;
                        this.currentUserStocks = [];
                    }
                    if (type === 'stock') {
                        discounts.removeAt(stockFormArrayIndex);
                        if (discounts.length === 0) {
                            let indexInUserListArray = this.checkUserList(this.currentUser.uniqueName);
                            this.userList.splice(indexInUserListArray, 1);
                            this.userList = [...this.userList];
                            this.currentUserStocks = [];
                            this.currentUser = null;
                        }
                        this.currentUserStocks.splice(stockFormArrayIndex, 1);
                        this.variantsWithoutDiscount.splice(stockFormArrayIndex, 1);
                    }
                    this.toaster.successToast(response?.body);
                } else {
                    this.showSaveDiscardButton = true;
                    this.toaster.errorToast(response?.body);
                }
            });
        } else {
            if (type === "user") {
                const deletedMessage = this.localeData?.remove_item_msg?.replace('[TYPE]', this.currentUser?.type);
                this.tempUserList.splice(index, 1);
                //Delete Temporary User from User List
                let indexInUserListArray = this.checkUserList(uniqueName);
                this.userList.splice(indexInUserListArray, 1);
                this.userList = [...this.userList];
                this.currentUser = null;
                this.currentUserStocks = [];
                this.toaster.successToast(deletedMessage);
            }

            if (type === 'variant') {
                const stock = discounts.at(stockFormArrayIndex).get('variants') as UntypedFormArray;
                var variant = stock.at(variantFormArrayIndex)?.value;
                variant = {
                    label: variant?.variantName,
                    value: variant?.variantUniqueName
                };
                /** To add deleted variant info in "variantsWithoutDiscount" array  */
                this.variantsWithoutDiscount.at(stockFormArrayIndex).push(variant);
                /** This code is to update value ngOnChanges in  Dropdown component */
                let stockData = cloneDeep(this.variantsWithoutDiscount);
                this.variantsWithoutDiscount = [];
                this.variantsWithoutDiscount = stockData;

                stock.removeAt(variantFormArrayIndex);
                const deletedMessage = this.localeData?.remove_item_msg?.replace('[TYPE]', type.toUpperCase());
                this.toaster.successToast(deletedMessage);
            }

            if (type === 'stock') {
                discounts.removeAt(stockFormArrayIndex);
                if (discounts.length === 0) this.currentUserStocks = [];
                this.variantsWithoutDiscount.splice(stockFormArrayIndex, 1);
                const deletedMessage = this.localeData?.remove_item_msg?.replace('[TYPE]', type.toUpperCase());
                this.toaster.successToast(deletedMessage);
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
            const matchingObject = this.stockVariants.find(item => item.uniqueName === event?.value);
            this.showSaveDiscardButton = true;
            this.variantsDropdownDefaultValue = event.label;
            setTimeout(() => {
                this.variantsDropdownDefaultValue = null;
            }, 100);
            this.variantsWithoutDiscount.push([]);
            let variants = (this.discountForm.get('discountInfo') as UntypedFormArray).at(stockFormArrayIndex).get('variants') as UntypedFormArray;
            const units = (this.discountForm.get('discountInfo') as UntypedFormArray).at(stockFormArrayIndex).get('units').value;
            let variantObj = {
                price: null,
                quantity: null,
                taxInclusive: true,
                stockUnitUniqueName: matchingObject?.units[0].uniqueName,
                variantUnitCode: matchingObject?.units[0].code,
                uniqueName: event.value,
                name: event.label,
                isTemproraryVariant: true
            };
            variants.push(this.initVariantForm(variantObj));
            this.variantsWithoutDiscount[stockFormArrayIndex] = this.variantsWithoutDiscount[stockFormArrayIndex].filter(variant => variant.value !== event.value);
            this.changeDetectorRef.detectChanges();
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
    private checkTemporaryUser(value: any): number {
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
    private checkUserList(value: any): number {
        return this.userList.findIndex(element => element.uniqueName === value);
    }

    /**
     * If user enter details in temprorary variants and want to discard
     *
     * @memberof CustomerWiseComponent
     */
    public discardChanges(): void {
        if (this.userList?.length && !this.isLoading) {
            this.selectUser(this.currentUser, true);
        }
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Save Discount
     *
     * @param {number} stockFormArrayIndex
     * @memberof CustomerWiseComponent
     */
    public saveDiscount(): void {
        const discountFormArray = this.discountForm.value;
        let formData = cloneDeep(discountFormArray);
        let filteredArray = [];
        filteredArray = formData.discountInfo.filter((item, index) => {
            item['index'] = index;
            if (item?.isTempStock) {
                return true;
            }
            if (item?.variants) {
                return item?.variants.some(variant => variant.isTemproraryVariant);
            }
            return false;
        });
        let checkMandatory: boolean = false;
        filteredArray.forEach((stock) => {
            checkMandatory = stock.variants.some(item => (item.discounts !== null || item.price !== null));
            stock.variants = stock.variants?.map(variant => {
                if (variant.discounts === null) {
                    variant.discounts = [];
                }
                return this.filterKeys(variant, this.variantDesiredKeys);
            });
        });
        if (!checkMandatory) {
            this.toaster.warningToast(this.localeData?.invalid_form_msg);
            return;
        } else {
            filteredArray.forEach((stock) => {
                let reqObj = {
                    customerVendorAccountUniqueName: this.discountForm.value.customerVendorAccountUniqueName,
                    customerVendorGroupUniqueName: this.discountForm.value.customerVendorGroupUniqueName,
                    discountInfo: stock.variants
                }
                this.inventoryService.createDiscount(stock.stockUniqueName, reqObj).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                    if (response && response?.status === 'success') {
                        this.showSaveDiscardButton = false;
                        const discountForm = (this.discountForm.get('discountInfo') as UntypedFormArray).at(stock.index) as UntypedFormArray;
                        discountForm.get('isTempStock').patchValue(false);

                        let index = this.checkTemporaryUser(this.currentUser.uniqueName);
                        if (index > -1) {
                            this.tempUserList.splice(index, 1);
                        }
                        const variants = (((this.discountForm.get('discountInfo') as UntypedFormArray).at(stock.index) as UntypedFormArray).get('variants') as UntypedFormArray);

                        for (let i = 0; i < variants.length; i++) {
                            variants.at(i).get('isTemproraryVariant').patchValue(false);

                            const variantControl = (variants.at(i) as UntypedFormGroup).controls;

                            variantControl.discounts.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(discountsValue => {
                                const stockUniqueName = (this.discountForm.get('discountInfo') as UntypedFormArray).at(stock.index).get('stockUniqueName').value;
                                let variant = { discounts: discountsValue };
                                this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                            });
                            variantControl.taxInclusive.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(taxInclusiveValue => {
                                const stockUniqueName = (this.discountForm.get('discountInfo') as UntypedFormArray).at(stock.index).get('stockUniqueName').value;
                                let variant = { taxInclusive: taxInclusiveValue };
                                this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                            });
                            variantControl.price.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(priceValue => {
                                const stockUniqueName = (this.discountForm.get('discountInfo') as UntypedFormArray).at(stock.index).get('stockUniqueName').value;
                                let variant = { price: priceValue };
                                this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                            });
                        }
                        this.currentUser.isTempUser = false;
                        this.toaster.successToast(response?.body);
                    } else {
                        this.toaster.errorToast(response?.message)
                    }
                });
            });
        }
        this.changeDetectorRef.detectChanges();
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
    private updateDiscount(stockUniqueName: string, variantUniqueName: string, variant: any): void {
        const model: CreateDiscount = {
            customerVendorAccountUniqueName: this.discountForm.get('customerVendorAccountUniqueName').value,
            customerVendorGroupUniqueName: this.discountForm.get('customerVendorGroupUniqueName').value,
            discountInfo: [variant]
        };

        this.inventoryService.updateDiscount(stockUniqueName, variantUniqueName, model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            if (response?.status === 'error') {
                this.toaster.errorToast(response?.message);
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
    private filterKeys(obj: any, keysToKeep: any[]): any {
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
                this.currentUser['isTempUser'] = true;
                this.userList.unshift(event);
                this.userList = [...this.userList];
                this.tempUserList.unshift(event);
                this.initDiscountMainForm();
                this.currentUserStocks = [];
                this.variantsWithoutDiscount = [];
                this.dialogRef.close();
                this.cdkScrollable?.scrollTo({ top: 0 });
            } else {
                let type = event?.type === 'ACCOUNT' ? 'Account' : 'Group';
                let msg = this.localeData?.already_added_msg.replace('[TYPE]', type);
                this.toaster.warningToast(msg);
            }
        } else {
            let isExistingStock = this.currentUserStocks?.some(item => (item?.stock?.uniqueName === event?.uniqueName) || (item?.uniqueName === event?.uniqueName));
            if (isExistingStock) {
                let msg = this.localeData?.already_added_msg.replace('[TYPE]', this.commonLocaleData?.app_stock);
                this.toaster.warningToast(msg);
            } else {
                this.showSaveDiscardButton = true;
                this.inventoryService.getStockDetails(event?.uniqueName, this.userType).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                    if (response && response?.body) {
                        this.stockVariants = response.body?.variants;
                        const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;
                        let stockIndex = discounts.length;
                        this.variantsWithoutDiscount.push([]);
                        if (this.currentUser.type === 'ACCOUNT') {
                            this.discountForm.get('customerVendorAccountUniqueName').patchValue(this.currentUser.uniqueName);
                        } else {
                            this.discountForm.get('customerVendorGroupUniqueName').patchValue(this.currentUser.uniqueName);
                        }
                        discounts.push(this.initDiscountForm({
                            stock: { name: event?.name, uniqueName: event?.uniqueName },
                            isTempStock: true,
                            units: [],
                            hasVariants: response?.body?.variants.length > 1
                        }));
                        let variants = (this.discountForm.get('discountInfo') as UntypedFormArray).at(stockIndex).get('variants') as UntypedFormArray;
                        response.body?.variants.forEach(variant => {
                            variants.push(this.initVariantForm({ name: variant?.name, uniqueName: variant?.uniqueName, isTemproraryVariant: true, stockUnitUniqueName: variant?.units[0].uniqueName, variantUnitCode: variant?.units[0].code }));
                        });
                        this.currentUserStocks.push(event);
                        this.stocksContainer.nativeElement?.scrollTo({
                            top: this.stocksContainer.nativeElement.scrollHeight,
                            behavior: 'smooth'
                        });
                    }

                });
            }
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
            this.getAllDiscount(this.currentUser, this.stockSearchQuery);
        }
    }

    /**
     * Callback for discount selection
     *
     * @param {UntypedFormGroup} variant
     * @memberof CustomerWiseComponent
     */
    public updateDiscountInVariant(variant: UntypedFormGroup, event?: any): void {
        if (event?.label && (event?.value || event?.value === null)) {
            variant.get('discountName').patchValue(event?.label);
            if (event?.value == null) {
                variant.get('discounts').patchValue(null);
            } else {
                variant.get('discounts').patchValue([{ uniqueName: event?.value }]);
            }
        }
    }

    /**
     * Get Customer/Vendor list by Group or Account
     *
     * @param {string} type
     * @memberof CustomerWiseComponent
     */
    public getUsersByType(type: 'account' | 'group'): void {
        if (type === this.userFilterType) {
            this.userFilterType = 'all';

        } else {
            this.userFilterType = type;
        }
        this.getCustomerVendorDiscountUserList();

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
