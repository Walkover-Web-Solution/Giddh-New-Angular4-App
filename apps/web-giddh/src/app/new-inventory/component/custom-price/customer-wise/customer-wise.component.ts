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

    public searchForm: UntypedFormGroup = new UntypedFormGroup({
        userSearch: new FormControl(),
        stockSearch: new FormControl()
    });

    public discountForm: UntypedFormGroup;
    public variantsWithoutDiscount: any[] = [];
    // public deletedVariantSelectedObject: any = [];

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
                this.initDiscountMainForm();
                this.getCustomerVendorDiscountUserList();
            }
        });

        this.searchForm.get("userSearch").valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(queryString => {
            console.log(queryString);
            this.getCustomerVendorDiscountUserList(queryString);
        });

        this.searchForm.get("stockSearch").valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(queryString => {
            console.log(queryString);
            this.getAllDiscount(this.currentUser, queryString);
        });

        this.getDiscounts();
        this.scrollDispatcher.scrolled().pipe(takeUntil(this.destroyed$)).subscribe((event: any) => {
            console.log("scrollDispatcher", event);
            if (event && (event?.getDataLength() - event?.getRenderedRange().end) < 10 && !this.isLoading && (this.pagination.user.totalPages >= this.pagination.user.page)) {
                this.pagination.user.page++;
                this.getCustomerVendorDiscountUserList();
            }
        });
    }

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

    private initDiscountMainForm(): void {
        this.discountForm = this.formBuilder.group({
            customerVendorAccountUniqueName: [''],
            customerVendorGroupUniqueName: [''],
            discountInfo: this.formBuilder.array([])
        });
    }

    private initDiscountForm(discount: any): UntypedFormGroup {
        return this.formBuilder.group({
            stockName: [discount?.stock?.name],
            stockUniqueName: [discount?.stock?.uniqueName],
            units: [discount?.units],
            variants: this.formBuilder.array([])
        });
    }

    private initVariantForm(variant: any): UntypedFormGroup {
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
        if (this.currentUser?.uniqueName !== userData?.uniqueName) {
            this.currentUser = userData;
            let isTempUser = this.checkTemporaryUser(userData);
            if (isTempUser === -1) {
                this.getAllDiscount(userData);
            }
        }
    }

    private getAllDiscount(userData: any, query: string = ''): void {
        let model = {
            page: this.pagination.stock.page,
            count: this.paginationLimit,
            uniqueName: userData?.uniqueName,
            query: query
        };
        this.isLoading = true;
        this.inventoryService.getAllDiscount(model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {

            //response?.body?.length THIS IS TEMPORY CODE IT WILL CHANGE AFTER API CHANGE (PAGINATED DATA WILL COME IN FUTURE)
            if (response && response?.body?.results?.length) {
                this.initDiscountMainForm();
                if (userData?.type === 'ACCOUNT') {
                    this.discountForm.get('customerVendorAccountUniqueName').patchValue(userData?.uniqueName);
                } else {
                    this.discountForm.get('customerVendorGroupUniqueName').patchValue(userData?.uniqueName);
                }

                const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;

                response?.body?.results.forEach((res, index) => {
                    this.variantsWithoutDiscount.push([]);
                    if (res?.hasVariants) {
                        this.inventoryService.getStockVariants(res?.stock?.uniqueName).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
                            if (response) {
                                let existingVariants = res.variants?.map(variant => {
                                    return variant.variantUniqueName;
                                });

                                let allVariants = [];

                                response?.body?.forEach(variant => {
                                    if (!existingVariants.includes(variant?.uniqueName)) {
                                        allVariants.push({
                                            label: variant?.name,
                                            value: variant?.uniqueName
                                        });
                                    }
                                });
                                this.variantsWithoutDiscount[index] = allVariants;
                            }
                        });
                    }

                    res?.units.map(unit => {
                        unit.value = unit?.uniqueName;
                        unit.label = unit?.name;
                    });

                    discounts.push(this.initDiscountForm(res));

                    let variants = (this.discountForm.get('discountInfo') as FormArray).at(index).get('variants') as UntypedFormArray;

                    res?.variants.forEach((variant, variantIndex) => {
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
                        const variantControl = (((this.discountForm.get('discountInfo') as FormArray).at(index).get('variants') as UntypedFormArray).at(variantIndex) as FormGroup).controls;

                        variantControl.price.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(priceValue => {
                            const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                            let variant = { price: priceValue };
                            variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                            this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                        });
                        variantControl.quantity.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(quantityValue => {
                            const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                            let variant = { quantity: quantityValue };
                            variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                            this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                        });
                        variantControl.discountExclusive.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(discountExclusiveValue => {
                            const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                            let variant = { discountExclusive: discountExclusiveValue };
                            variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                            this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                        });
                        variantControl.stockUnitUniqueName.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(stockUnitUniqueNameValue => {
                            const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                            let variant = { stockUnitUniqueName: stockUnitUniqueNameValue };
                            variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                            this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                        });
                        variantControl.discountUniqueName.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(discountUniqueNameValue => {
                            const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                            let variant = { discountUniqueName: discountUniqueNameValue };
                            variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                            this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                        });
                        variantControl.discountValue.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(newDiscountValue => {
                            const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                            let variant = { discountValue: newDiscountValue };
                            variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                            this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                        });
                        variantControl.type.valueChanges.pipe(debounceTime(400), takeUntil(this.destroyed$)).subscribe(newDiscountType => {
                            const stockUniqueName = (this.discountForm.get('discountInfo') as FormArray).at(index).get('stockUniqueName').value;
                            let variant = { type: newDiscountType };
                            variant = this.getDiscountValueOrUniqueName(variant, variantControl);
                            this.updateDiscount(stockUniqueName, variantControl.variantUniqueName.value, variant);
                        });
                    });
                });

                this.currentUserStocks = response?.body?.results;
            } else {
                this.currentUserStocks = null;
            }
            this.isLoading = false;
        });
    }

    private getDiscountValueOrUniqueName(variantObject, variantControl): any {
        if (variantControl.discountUniqueName.value) {
            variantObject['discountUniqueName'] = variantControl.discountUniqueName.value
        } else {
            variantObject['type'] = variantControl.type.value;
            variantObject['discountValue'] = variantControl.discountValue.value ?? 10;  // WILL REMOVE THIS ?? 10 AFTER IMPLEMENT DISCOUNT 
        }
        return variantObject;
    }

    private getDiscountDataByUniqueName(discountUniqueName: string): any {
        if (this.discountsList.length) {
            const index = this.discountsList.findIndex(item => item['uniqueName'] === discountUniqueName);
            return this.discountsList[index];
        }
    }

    public confirmationPopup(uniqueName: string, type: 'user' | 'stock' | 'variant', stockFormArrayIndex?: number, variantFormArrayIndex?: number, variantName?: string): void {
        console.log("Deleted CALL FOR uniqueName", uniqueName, " TYPE- ", type, " stockFormArrayIndex", stockFormArrayIndex, " variantFormArrayIndex", variantFormArrayIndex);

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
            this.variantsWithoutDiscount[stockFormArrayIndex].variantName = variantName;
        }

        let index = this.checkTemporaryUser(uniqueName);
        if (index === -1) {
            // this.inventoryService.deleteDiscountRecord(model).pipe(take(1)).subscribe((response) => {
            //     if (response && response?.status === "success") {
            // console.log("deleteDiscountRecord",response);
            const discounts = this.discountForm.get('discountInfo') as UntypedFormArray;
            var stock = discounts.at(stockFormArrayIndex).get('variants') as UntypedFormArray;

            var variant = stock.at(variantFormArrayIndex)?.value;

            variant = {
                label: variant?.variantName,
                value: variant?.variantUniqueName
            };
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

            let variants = (this.discountForm.get('discountInfo') as FormArray).at(stockFormArrayIndex).get('variants') as UntypedFormArray;
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

            this.variantsWithoutDiscount[stockFormArrayIndex] = this.variantsWithoutDiscount[stockFormArrayIndex].filter(variant => variant.value !== event.value);

            console.log("discount form", this.discountForm);
            console.log("variantsWithoutDiscount", this.variantsWithoutDiscount[stockFormArrayIndex]);

            this.changeDetectorRef.detectChanges();
        }
    }

    public selectVariantUnit(event: any, stockFormArrayIndex: number, variantFormArrayIndex: number): void {
        if (event && event.value && event.label) {
            const variantFormGroup = ((((this.discountForm.get('discountInfo') as FormArray).at(stockFormArrayIndex) as FormGroup).get('variants') as FormArray).at(variantFormArrayIndex) as FormArray);
            variantFormGroup.controls['stockUnitUniqueName'].setValue(event.value);
            variantFormGroup.controls['variantUnitName'].setValue(event.label);
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
        this.isLoading = true;
        this.inventoryService.createDiscount(stockUniqueName, discountFormValues).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            this.isLoading = false;
            if (response) {
                console.log("createDiscount res", response);
            }
        });
    }

    private updateDiscount(stockUniqueName: string, variantUniqueName: string, variant): void {
        const model: CreateDiscount = {
            customerVendorAccountUniqueName: this.discountForm.get('customerVendorAccountUniqueName').value,
            customerVendorGroupUniqueName: this.discountForm.get('customerVendorGroupUniqueName').value,
            discountInfo: []
        }
        model.discountInfo.push(variant);
        this.inventoryService.updateDiscount(stockUniqueName, variantUniqueName, model).pipe(takeUntil(this.destroyed$)).subscribe((response) => {
            console.log("updateDiscount response", response);
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
                this.userList = [...this.userList];
                this.tempUserList.push(event);
                this.initDiscountMainForm();
                this.currentUserStocks = null;
                this.variantsWithoutDiscount = [];
                console.log("this.userList", this.userList);

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
                    console.log("At first time", response);

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
                        stock: { name: event?.name, uniqueName: event?.uniqueName },
                        units: units ?? []
                    }));

                    let variants = (this.discountForm.get('discountInfo') as FormArray).at(stockIndex).get('variants') as UntypedFormArray;
                    response.body?.variants.forEach(variant => {
                        let variantObject = {
                            label: variant?.name,
                            value: variant?.uniqueName
                        };
                        if (event.hasVariants) {
                            this.variantsWithoutDiscount[stockIndex].push(variantObject);
                        }
                        variants.push(this.initVariantForm({ variantName: variant?.name, variantUniqueName: variant?.uniqueName }));
                    });
                    this.currentUserStocks = event;
                    console.log("variantsWithoutDiscount ", this.variantsWithoutDiscount);
                    console.log("new discountForm ", this.discountForm.value);
                }
            });
            this.dialogRef.close();
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