import { Observable, of, ReplaySubject, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { INVALID_STOCK_ERROR_MESSAGE } from 'apps/web-giddh/src/app/app.constant';
import { SalesService } from 'apps/web-giddh/src/app/services/sales.service';
import { InvoiceService } from 'apps/web-giddh/src/app/services/invoice.service';
import { CompanyActions } from 'apps/web-giddh/src/app/actions/company.actions';
import { CustomStockUnitAction } from 'apps/web-giddh/src/app/actions/inventory/custom-stock-unit.actions';
import { InventoryAction } from 'apps/web-giddh/src/app/actions/inventory/inventory.actions';
import { SidebarAction } from 'apps/web-giddh/src/app/actions/inventory/sidebar.actions';
import { InvViewService } from 'apps/web-giddh/src/app/inventory/inv.view.service';
import { TaxResponse } from 'apps/web-giddh/src/app/models/api-models/Company';
import { StockGroupResponse, StockDetailResponse, CreateStockRequest } from 'apps/web-giddh/src/app/models/api-models/Inventory';
import { IForceClear } from 'apps/web-giddh/src/app/models/api-models/Sales';
import { IGroupsWithStocksHierarchyMinItem } from 'apps/web-giddh/src/app/models/interfaces/groups-with-stocks.interface';
import { IUnitRateItem } from 'apps/web-giddh/src/app/models/interfaces/stocks-item.interface';
import { InventoryService } from 'apps/web-giddh/src/app/services/inventory.service';
import { ToasterService } from 'apps/web-giddh/src/app/services/toaster.service';
import { AppState } from 'apps/web-giddh/src/app/store';
import { IOption } from 'apps/web-giddh/src/app/theme/ng-virtual-select/sh-options.interface';
import { decimalDigits, digitsOnly, stockManufacturingDetailsValidator } from '../../../helpers';
import { uniqueNameInvalidStringReplace } from '../../../helpers/helperFunctions';

@Component({
    selector: 'sales-create-stock',
    styleUrls: ['./sales.create.stock.component.scss'],
    templateUrl: './sales.create.stock.component.html'
})
export class SalesAddStockComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
    @Input() public addStock: boolean = false;
    @Input() public autoFocusInChild: boolean = false;
    public stockListDropDown$: Observable<IOption[]>;
    public stockUnitsDropDown$: Observable<IOption[]> = of(null);
    public purchaseAccountsDropDown$: Observable<IOption[]>;
    public salesAccountsDropDown$: Observable<IOption[]>;

    @ViewChild('formDiv', { static: true }) public formDiv: ElementRef;
    @ViewChild('groupDDList', { static: true }) public groupDDList: any;
    public formDivBoundingRect: Subject<any> = new Subject<any>();


    @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();

    @ViewChild('uniqueName', { static: false }) public uniqueName: ElementRef;
    @ViewChild('stockName', { static: false }) public stockName: ElementRef;

    @ViewChild('purchaseAccountUniqueName', { static: false }) public purchaseAccountUniqueName: any;
    @ViewChild('purchaseStockUnitCode', { static: false }) public purchaseStockUnitCode: any;
    @ViewChild('purchaseRate', { static: false }) public purchaseRate: ElementRef;

    @ViewChild('salesAccountUniqueName', { static: false }) public salesAccountUniqueName: any;
    @ViewChild('salesStockUnitCode', { static: false }) public salesStockUnitCode: any;
    @ViewChild('salesRate', { static: false }) public salesRate: ElementRef;

    @ViewChild('manufacturingQuantity', { static: false }) public manufacturingQuantity: ElementRef;
    @ViewChild('manufacturingStockUniqueName', { static: false }) public manufacturingStockUniqueName: any;
    @ViewChild('manufacturingStockUnitCode', { static: false }) public manufacturingStockUnitCode; any;

    public groupUniqueName: string;
    public stockUniqueName: string;
    public addStockForm: UntypedFormGroup;
    public groupName: string;
    public fetchingStockUniqueName$: Observable<boolean>;
    public isStockNameAvailable$: Observable<boolean>;
    public activeGroup$: Observable<StockGroupResponse>;
    public isUpdatingStockForm: boolean = false;
    public editModeForLinkedStokes: boolean = false;
    public createStockSuccess$: Observable<boolean>;
    public activeStock$: Observable<StockDetailResponse>;
    public isStockAddInProcess$: Observable<boolean>;
    public isStockUpdateInProcess$: Observable<boolean>;
    public isStockDeleteInProcess$: Observable<boolean>;
    public showLoadingForStockEditInProcess$: Observable<boolean>;
    public showManufacturingItemsError: boolean = false;
    public groupsData$: Observable<any[]>;
    public selectedGroup: IOption;
    public activeGroup: any;
    public editLinkedStockIdx: any = null;
    public forceClear$: Observable<IForceClear> = of({ status: false });
    public forceClearStock$: Observable<IForceClear> = of({ status: false });
    public forceClearStockUnit$: Observable<IForceClear> = of({ status: false });
    public disableStockButton: boolean = false;
    public createGroupSuccess$: Observable<boolean>;
    public showOtherDetails: boolean;
    public addNewStock: boolean = false;
    public manageInProcess$: Observable<any>;
    public companyTaxesList$: Observable<TaxResponse[]>;
    public isManageInventory$: Observable<boolean>;
    public invoiceSetting$: Observable<any>;
    public customFieldsArray: any[] = [];
    public taxTempArray: any[] = [];
    public editSKUlabel: boolean = false;
    public customField1HeadingEditing: boolean = false;
    public customField2HeadingEditing: boolean = false;
    public customField1: boolean = false;
    public customField2: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold inventory settings */
    public inventorySettings: any;

    constructor(
        private store: Store<AppState>,
        private sideBarAction: SidebarAction,
        private _fb: UntypedFormBuilder,
        private inventoryAction: InventoryAction,
        private salesService: SalesService,
        private customStockActions: CustomStockUnitAction,
        private _toasty: ToasterService,
        private _inventoryService: InventoryService,
        private companyActions: CompanyActions,
        private invViewService: InvViewService,
        private cdr: ChangeDetectorRef,
        private invoiceService: InvoiceService
    ) {
        this.fetchingStockUniqueName$ = this.store.pipe(select(state => state.inventory.fetchingStockUniqueName), takeUntil(this.destroyed$));
        this.isStockNameAvailable$ = this.store.pipe(select(state => state.inventory.isStockNameAvailable), takeUntil(this.destroyed$));
        this.activeGroup$ = this.store.pipe(select(s => s.inventory.activeGroup), takeUntil(this.destroyed$));
        this.activeStock$ = this.store.pipe(select(s => s.inventory.activeStock), takeUntil(this.destroyed$));
        this.createStockSuccess$ = this.store.pipe(select(s => s.inventory.createStockSuccess), takeUntil(this.destroyed$));
        this.isStockAddInProcess$ = this.store.pipe(select(s => s.inventory.isStockAddInProcess), takeUntil(this.destroyed$));
        this.isStockUpdateInProcess$ = this.store.pipe(select(s => s.inventory.isStockUpdateInProcess), takeUntil(this.destroyed$));
        this.isStockDeleteInProcess$ = this.store.pipe(select(s => s.inventory.isStockDeleteInProcess), takeUntil(this.destroyed$));
        this.showLoadingForStockEditInProcess$ = this.store.pipe(select(s => s.inventory.showLoadingForStockEditInProcess), takeUntil(this.destroyed$));
        this.createGroupSuccess$ = this.store.pipe(select(s => s.inventory.createGroupSuccess), takeUntil(this.destroyed$));
        this.manageInProcess$ = this.store.pipe(select(s => s.inventory.inventoryAsideState), takeUntil(this.destroyed$));
        this.store.dispatch(this.companyActions.getTax());
        this.companyTaxesList$ = this.store.pipe(select(p => p.company && p.company.taxes), takeUntil(this.destroyed$));
        this.invoiceSetting$ = this.store.pipe(select(p => p.invoice.settings), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.inventory.stockUnits), takeUntil(this.destroyed$)).subscribe(p => {
            if (p && p.length) {
                let units = p;
                let unitArr = units.map(unit => {
                    return { label: `${unit.name} (${unit.code})`, value: unit.uniqueName, additional: unit.code };
                });
                this.stockUnitsDropDown$ = of(unitArr);
            }
        });
    }

    public ngOnInit() {
        this.getParentGroupData();
        // get all groups
        this.formDivBoundingRect.next({
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: 0,
            width: 0
        });
        // dispatch stocklist request
        this.store.dispatch(this.inventoryAction.GetStock());
        // dispatch stockunit request
        this.store.dispatch(this.customStockActions.getStockUnit());

        // subscribe getActiveView parameters
        this.invViewService.getActiveView().pipe(takeUntil(this.destroyed$)).subscribe(v => {
            this.groupUniqueName = v?.groupUniqueName;
            this.groupName = v?.stockName;
            this.stockUniqueName = v?.stockUniqueName;
            this.activeGroup = v;
            if (this.groupUniqueName && this.stockUniqueName) {
                this.store.dispatch(this.sideBarAction.GetInventoryStock(this.stockUniqueName, this.groupUniqueName));
            }
        });

        this.stockListDropDown$ = this.store.pipe(select(p => {
            if (p.inventory.stocksList) {
                if (p.inventory.stocksList.results) {
                    let units = p.inventory.stocksList.results;

                    return units.map(unit => {
                        return { label: `${unit.name} (${unit?.uniqueName})`, value: unit?.uniqueName };
                    });
                }
            }
        }), takeUntil(this.destroyed$));

        // add stock form
        this.addStockForm = this._fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            uniqueName: ['', [Validators.required, Validators.minLength(2)]],
            stockUnitCode: [''],
            stockUnitUniqueName: ['', [Validators.required]],
            openingQuantity: ['', decimalDigits],
            skuCode: [''],
            skuCodeHeading: [''],
            customField1Heading: [''],
            customField1Value: [''],
            customField2Heading: [''],
            customField2Value: [''],
            stockRate: [{ value: '', disabled: true }],
            openingAmount: [''],
            enableSales: [true],
            enablePurchase: [true],
            purchaseAccountUniqueName: [''],
            salesAccountUniqueName: [''],
            purchaseUnitRates: this._fb.array([
                this.initUnitAndRates()
            ]),
            saleUnitRates: this._fb.array([
                this.initUnitAndRates()
            ]),
            manufacturingDetails: this._fb.group({
                manufacturingQuantity: ['', [Validators.required, digitsOnly]],
                manufacturingUnitCode: [''],
                manufacturingUnitUniqueName: ['', [Validators.required]],
                linkedStocks: this._fb.array([
                    this.initialIManufacturingDetails()
                ]),
                linkedStockUniqueName: [''],
                linkedQuantity: ['', digitsOnly],
                linkedStockUnitCode: [''],
            }, { validator: stockManufacturingDetailsValidator }),
            isFsStock: [false],
            parentGroup: [''],
            hsnNumber: [''],
            sacNumber: [''],
            taxes: [[]],
            showCodeType: ['']
        });
        this.taxTempArray = [];

        this.showOtherDetails = false;
        this.getInvoiceSettings();

        // subscribe isFsStock for disabling manufacturingDetails
        this.addStockForm.controls['isFsStock'].valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((v) => {
            const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
            if (v) {
                manufacturingDetailsContorl.enable();
            } else {
                manufacturingDetailsContorl.disable();
            }
        });

        // subscribe enablePurchase checkbox for enable/disable unit/rate
        this.addStockForm.controls['enablePurchase'].valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
            const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as UntypedFormArray;
            if (a) {
                purchaseUnitRatesControls.enable();
            } else {
                purchaseUnitRatesControls.disable();
            }
        });

        // subscribe enableSales checkbox for enable/disable unit/rate
        this.addStockForm.controls['enableSales'].valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((a) => {
            const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as UntypedFormArray;
            if (a) {
                saleUnitRatesControls.enable();
            } else {
                saleUnitRatesControls.disable();
            }
        });

        // get purchase accounts
        this.salesService.getAccountsWithCurrency('operatingcost, indirectexpenses').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data?.status === 'success') {
                let purchaseAccounts: IOption[] = [];
                data?.body?.results?.map(d => {
                    purchaseAccounts.push({ label: `${d.name} (${d?.uniqueName})`, value: d?.uniqueName });
                });
                this.purchaseAccountsDropDown$ = of(purchaseAccounts);
            }
        });

        // get sales accounts
        this.salesService.getAccountsWithCurrency('revenuefromoperations, otherincome').pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data?.status === 'success') {
                let salesAccounts: IOption[] = [];
                data?.body?.results?.map(d => {
                    salesAccounts.push({ label: `${d.name} (${d?.uniqueName})`, value: d?.uniqueName });
                });
                this.salesAccountsDropDown$ = of(salesAccounts);
            }
        });

        // subscribe active stock if available fill form
        this.activeStock$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
            if (a && !this.addStock) {
                this.stockUniqueName = a.uniqueName;
                this.isUpdatingStockForm = true;
                this.addStockForm?.patchValue({
                    name: a.name, uniqueName: a.uniqueName,
                    stockUnitCode: a.stockUnit ? a.stockUnit.code : '',
                    stockUnitUniqueName: a.stockUnit ? a.stockUnit.uniqueName : '',
                    openingQuantity: a.openingQuantity,
                    openingAmount: a.openingAmount,
                    hsnNumber: a.hsnNumber,
                    skuCode: a.skuCode,
                    skuCodeHeading: a.skuCodeHeading,
                    customField1Heading: a.customField1Heading,
                    customField1Value: a.customField1Value,
                    customField2Heading: a.customField2Heading,
                    customField2Value: a.customField2Value,
                    sacNumber: a.sacNumber,
                    parentGroup: a.stockGroup?.uniqueName
                });
                this.groupUniqueName = a.stockGroup?.uniqueName;
                if (a.customField1Value) { this.customField1 = true; }
                if (a.customField2Value) { this.customField2 = true; }
                if (!this.activeGroup) {
                    this.activeGroup = { uniqueName: a.stockGroup?.uniqueName };
                } else {
                    this.activeGroup.uniqueName = a.stockGroup?.uniqueName;
                }
                this.calCulateRate();

                const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as UntypedFormArray;
                if (a.purchaseAccountDetails) {
                    this.addStockForm?.patchValue({ purchaseAccountUniqueName: a.purchaseAccountDetails.accountUniqueName });

                    // render purchase unit rates
                    a.purchaseAccountDetails.unitRates?.map((item, i) => {
                        this.addPurchaseUnitRates(i, item);
                    });
                    purchaseUnitRatesControls.enable();
                    this.addStockForm.controls['enablePurchase']?.patchValue(true);
                } else {
                    this.addStockForm.controls['enablePurchase']?.patchValue(false);
                    purchaseUnitRatesControls.disable();
                }

                const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as UntypedFormArray;
                if (a.salesAccountDetails) {
                    this.addStockForm?.patchValue({ salesAccountUniqueName: a.salesAccountDetails.accountUniqueName });

                    // render sale unit rates
                    a.salesAccountDetails.unitRates?.map((item, i) => {
                        this.addSaleUnitRates(i, item);
                    });
                    saleUnitRatesControls.enable();
                    this.addStockForm.controls['enableSales']?.patchValue(true);
                } else {
                    saleUnitRatesControls.disable();
                    this.addStockForm.controls['enableSales']?.patchValue(false);
                }

                // if manufacturingDetails is avilable
                if (a.manufacturingDetails) {
                    this.addStockForm?.patchValue({
                        isFsStock: true,
                        manufacturingDetails: {
                            manufacturingQuantity: a.manufacturingDetails.manufacturingQuantity,
                            manufacturingUnitCode: a.manufacturingDetails.manufacturingUnitCode,
                            manufacturingUnitUniqueName: a.manufacturingDetails.manufacturingUnitUniqueName
                        }
                    });
                    a.manufacturingDetails.linkedStocks?.map((item, i) => {
                        this.addItemInLinkedStocks(item, i, a.manufacturingDetails.linkedStocks?.length - 1);
                    });
                } else {
                    this.addStockForm?.patchValue({ isFsStock: false });
                }

                this.companyTaxesList$.subscribe((tax) => {
                    _.forEach(tax, (o) => {
                        o.isChecked = false;
                        o.isDisabled = false;
                    });
                });

                this.taxTempArray = [];
                if (a.taxes?.length) {
                    this.mapSavedTaxes(a.taxes);
                }
                this.store.dispatch(this.inventoryAction.hideLoaderForStock());
                // this.addStockForm.controls['parentGroup'].disable();
            } else {
                this.isUpdatingStockForm = false;
            }
        });

        this.companyTaxesList$.subscribe((tax) => {
            _.forEach(tax, (o) => {
                o.isChecked = false;
                o.isDisabled = false;
            });
        });
        this.cdr.detectChanges();

        // subscribe createStockSuccess for resting form
        this.createStockSuccess$.subscribe(s => {
            if (s) {
                this.resetStockForm();
                this.addStockForm.get('taxes')?.patchValue('');
                this.store.dispatch(this.inventoryAction.resetCreateStockFlags());
                this.closeAsidePane();
            }
        });

        this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            if (s) {
                this.activeGroup = s;
                this.groupUniqueName = s.uniqueName;
                this.activeGroup.uniqueName = s.uniqueName;
                this.addStockForm.get('parentGroup')?.patchValue(this.activeGroup.uniqueName);
            } else {
                this.activeGroup = null;
            }
        });

        this.createGroupSuccess$.subscribe(s => {
            if (s) {
                this.getParentGroupData();
            }
        });
        setTimeout(() => {
            this.addStockForm.controls['enableSales']?.patchValue(false);
            this.addStockForm.controls['enablePurchase']?.patchValue(false);
        }, 100);

        this.manageInProcess$.subscribe(s => {
            if (!s.isOpen) {
                this.addStockForm.reset();
            }
        });

        this.invoiceSetting$.subscribe(a => {
            if (a && a.companyInventorySettings) {
                this.isManageInventory$ = of(a.companyInventorySettings.manageInventory);
            }
        });
    }

    public addCustomField() {
        if (!this.customField1) {
            this.customField1 = true;
            return;
        }
        this.customField2 = true;
    }

    public actionCustomField(index: number) {
        if (index === 1) {
            this.customField1HeadingEditing = !this.customField1HeadingEditing;
        } else {
            this.customField2HeadingEditing = !this.customField2HeadingEditing;
        }
    }

    public removeCustomField(type?: string, index?: number) {
        if (type === 'remove' && index === 1) {
            this.customField1 = false;
            this.addStockForm.get('customField1Value')?.patchValue('');
            this.addStockForm.get('customField1Heading')?.patchValue('');
        }
        if (type === 'remove' && index === 2) {
            this.customField2 = false;
            this.addStockForm.get('customField2Value')?.patchValue('');
            this.addStockForm.get('customField2Heading')?.patchValue('');
        }
    }

    // initial unitandRates controls
    public initUnitAndRates() {
        // initialize our controls
        return this._fb.group({
            rate: [''],
            stockUnitCode: [''],
            stockUnitUniqueName: ['']
        });
    }

    // add purchaseUnitRates controls
    public addPurchaseUnitRates(i: number, item?: IUnitRateItem) {
        const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as UntypedFormArray;
        const control = this.addStockForm.controls['purchaseUnitRates'] as UntypedFormArray;

        // add purchaseUnitRates to the list
        if (item) {
            if (control.controls[i]) {
                control.controls[i]?.patchValue(item);
            } else {
                control.push(this.initUnitAndRates());
                setTimeout(() => {
                    control.controls[i]?.patchValue(item);
                }, 200);
            }
        } else {
            if (purchaseUnitRatesControls.controls[i]?.value.rate && purchaseUnitRatesControls.controls[i]?.value.stockUnitUniqueName) {
                control.push(this.initUnitAndRates());
            }
        }
    }

    // remove purchaseUnitRates controls
    public removePurchaseUnitRates(i: number) {
        // remove address from the list
        const control = this.addStockForm.controls['purchaseUnitRates'] as UntypedFormArray;
        if (control?.length > 1) {
            control.removeAt(i);
        } else {
            control.controls[0].reset();
        }
    }

    // add saleUnitRates controls
    public addSaleUnitRates(i: number, item?: IUnitRateItem) {
        const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as UntypedFormArray;
        const control = this.addStockForm.controls['saleUnitRates'] as UntypedFormArray;

        // add saleUnitRates to the list
        if (item) {
            if (control.controls[i]) {
                control.controls[i]?.patchValue(item);
            } else {
                control.push(this.initUnitAndRates());
                setTimeout(() => {
                    control.controls[i]?.patchValue(item);
                }, 200);
            }
        } else {
            if (saleUnitRatesControls.controls[i]?.value.rate && saleUnitRatesControls.controls[i]?.value.stockUnitUniqueName) {
                control.push(this.initUnitAndRates());
            }
        }
    }

    // remove saleUnitRates controls
    public removeSaleUnitRates(i: number) {
        // remove address from the list
        const control = this.addStockForm.controls['saleUnitRates'] as UntypedFormArray;
        if (control?.length > 1) {
            control.removeAt(i);
        } else {
            control.controls[0].reset();
        }
    }

    public ngAfterViewInit() {
        const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
        manufacturingDetailsContorl.disable();

    }

    // generate uniquename
    public generateUniqueName() {
        if (this.isUpdatingStockForm) {
            return true;
        }
        let val: string = this.addStockForm.controls['name']?.value;
        if (val) {
            val = uniqueNameInvalidStringReplace(val);
        }

        if (val) {
            this.store.dispatch(this.inventoryAction.GetStockWithUniqueName(val));

            this.isStockNameAvailable$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
                if (a !== null && a !== undefined) {
                    if (a) {
                        this.addStockForm?.patchValue({ uniqueName: val });
                    } else {
                        let num = 1;
                        this.addStockForm?.patchValue({ uniqueName: val + num });
                    }
                }
            });
        } else {
            this.addStockForm?.patchValue({ uniqueName: '' });
        }
    }

    // calculate rate
    public calCulateRate() {
        let quantity = this.addStockForm?.value.openingQuantity;
        let amount = this.addStockForm?.value.openingAmount;

        if (quantity && amount) {
            this.addStockForm?.patchValue({ stockRate: (amount / quantity).toFixed(4) });
        } else if (!quantity || !amount) {
            this.addStockForm.controls['stockRate']?.patchValue('');
        }
    }

    public initialIManufacturingDetails() {
        // initialize our controls
        return this._fb.group({
            stockUniqueName: [''],
            stockUnitCode: [''],
            stockUnitUniqueName: [''],
            quantity: ['', digitsOnly]
        });
    }

    public addItemInLinkedStocks(item, i?: number, lastIdx?) {
        const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        let frmgrp = this.initialIManufacturingDetails();
        if (item) {
            if (item.controls) {
                let isValid = this.validateLinkedStock(item.value);
                if (isValid) {
                    control.controls[i] = item;
                } else {
                    return this._toasty.errorToast('All fields are required.');
                }

            } else {
                let isValid = this.validateLinkedStock(item);
                if (isValid) {
                    frmgrp?.patchValue(item);
                    control.controls[i] = frmgrp;
                } else {
                    return this._toasty.errorToast('All fields are required.');
                }
            }
            if (i === lastIdx) {
                control.controls.push(this.initialIManufacturingDetails());
            }
        }
    }

    public editItemInLinkedStocks(item: UntypedFormGroup, i: number) {
        this.editLinkedStockIdx = i;
        const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        let last = control.controls?.length - 1;
        control.disable();
        control.controls[i].enable();
        control.controls[last].enable();
        this.editModeForLinkedStokes = true;
    }

    public updateItemInLinkedStocks(item: UntypedFormGroup, i: any) {
        const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        control.controls[i]?.patchValue(item);
        this.editLinkedStockIdx = null;
        this.editModeForLinkedStokes = false;
        let last = control.controls?.length;
        control.disable();
        control.controls[last - 1].enable();
    }

    public removeItemInLinkedStocks(i: number) {
        if (this.editLinkedStockIdx === i) {
            this.editModeForLinkedStokes = false;
            this.editLinkedStockIdx = null;
        }
        const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        control.removeAt(i);
    }

    public checkIfLinkedStockIsUnique(v: IOption) {
        const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        const linkedStokes = control?.value;
        if (linkedStokes) {
            let el = linkedStokes.find(a => a.stockUniqueName === v?.value);
            if (el) {
                manufacturingDetailsContorl.controls['linkedStockUniqueName'].setValue(el.stockUniqueName);
                manufacturingDetailsContorl.controls['linkedStockUnitCode'].setValue(el.stockUnitCode);
                manufacturingDetailsContorl.controls['linkedQuantity'].setValue(el.quantity);
                return true;
            }
        }
        return true;
    }

    // close pane
    public closeAsidePane() {
        this.closeAsideEvent.emit();
    }

    public resetStockForm() {
        this.forceClear$ = of({ status: true });
        this.forceClearStock$ = of({ status: true });
        this.forceClearStockUnit$ = of({ status: true });
        let activeStock: StockDetailResponse = null;
        this.activeStock$.pipe(take(1)).subscribe((a) => activeStock = a);

        const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as UntypedFormArray;
        const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as UntypedFormArray;

        const manufacturingDetailsContorls = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
        const linkedStocksControls = manufacturingDetailsContorls.controls['linkedStocks'] as UntypedFormArray;

        if (purchaseUnitRatesControls.controls?.length > 1) {
            purchaseUnitRatesControls.controls = purchaseUnitRatesControls.controls.splice(1);
        }
        if (saleUnitRatesControls?.length > 1) {
            saleUnitRatesControls.controls = saleUnitRatesControls.controls.splice(1);
        }
        if (linkedStocksControls?.length > 1) {
            linkedStocksControls.controls = [];
            linkedStocksControls.push(this.initialIManufacturingDetails());
        }

        this.addStockForm.reset();
        //this.closeAsideEvent.emit({action: 'first'});

        if (activeStock && !this.addStock) {
            this.isUpdatingStockForm = true;
            this.addStockForm?.patchValue({
                name: activeStock.name,
                uniqueName: activeStock?.uniqueName,
                stockUnitCode: activeStock.stockUnit ? activeStock.stockUnit.code : '',
                stockUnitUniqueName: activeStock.stockUnit ? activeStock.stockUnit.uniqueName : '',
                openingQuantity: activeStock.openingQuantity,
                openingAmount: activeStock.openingAmount
            });

            if (activeStock.purchaseAccountDetails) {
                this.addStockForm?.patchValue({ purchaseAccountUniqueName: activeStock.purchaseAccountDetails.accountUniqueName });

                // render unit rates
                activeStock.purchaseAccountDetails.unitRates?.map((item, i) => {
                    this.addPurchaseUnitRates(i, item);
                });
            }

            if (activeStock.salesAccountDetails) {
                this.addStockForm?.patchValue({ salesAccountUniqueName: activeStock.salesAccountDetails.accountUniqueName });

                // render unit rates
                activeStock.salesAccountDetails.unitRates?.map((item, i) => {
                    this.addSaleUnitRates(i, item);
                });
            }

            // if manufacturingDetails is avilable
            if (activeStock.manufacturingDetails) {
                this.addStockForm?.patchValue({
                    isFsStock: true,
                    manufacturingDetails: {
                        manufacturingQuantity: activeStock.manufacturingDetails.manufacturingQuantity,
                        manufacturingUnitCode: activeStock.manufacturingDetails.manufacturingUnitCode,
                        manufacturingUnitUniqueName: activeStock.manufacturingDetails.manufacturingUnitUniqueName
                    }
                });
                activeStock.manufacturingDetails.linkedStocks?.map((item, i) => {
                    this.addItemInLinkedStocks(item, i, activeStock.manufacturingDetails.linkedStocks?.length - 1);
                });
            } else {
                this.addStockForm?.patchValue({ isFsStock: false });
            }
        }
    }

    // submit form
    public submit() {
        let stockObj = new CreateStockRequest();
        let uniqueName = this.addStockForm.get('uniqueName');
        if (uniqueName?.value) {
            uniqueName?.patchValue(uniqueName.value?.replace(/ /g, '')?.toLowerCase());
        }
        this.addStockForm.get('uniqueName').enable();

        let formObj = _.cloneDeep(this.addStockForm?.value);
        stockObj.name = formObj.name;
        stockObj.uniqueName = formObj?.uniqueName;
        stockObj.stockUnitCode = formObj.stockUnitCode;
        stockObj.stockUnitUniqueName = formObj.stockUnitUniqueName;
        stockObj.openingAmount = formObj.openingAmount;
        stockObj.openingQuantity = formObj.openingQuantity;
        stockObj.hsnNumber = (this.addStockForm.get("showCodeType")?.value === "hsn") ? formObj.hsnNumber : "";
        stockObj.sacNumber = (this.addStockForm.get("showCodeType")?.value === "sac") ? formObj.sacNumber : "";
        stockObj.skuCode = formObj.skuCode;
        stockObj.skuCodeHeading = formObj.skuCodeHeading;
        stockObj.customField1Heading = formObj.customField1Heading;
        stockObj.customField1Value = formObj.customField1Value;
        stockObj.customField2Heading = formObj.customField2Heading;
        stockObj.customField2Value = formObj.customField2Value;

        if (formObj.enablePurchase) {
            if (this.validateStock(formObj.purchaseUnitRates)) {
                formObj.purchaseUnitRates = formObj.purchaseUnitRates?.filter((pr) => {
                    // Aditya: In inventory while creating purchase and sales unit and rate are mandatory error issue
                    return pr.stockUnitUniqueName || pr.rate;
                });
                stockObj.purchaseAccountDetails = {
                    accountUniqueName: formObj.purchaseAccountUniqueName,
                    unitRates: formObj.purchaseUnitRates
                };
            } else {
                this._toasty.errorToast(INVALID_STOCK_ERROR_MESSAGE);
                return;
            }
        }
        if (formObj.enableSales) {
            if (this.validateStock(formObj.purchaseUnitRates)) {
                formObj.saleUnitRates = formObj.saleUnitRates?.filter((pr) => {
                    // Aditya: In inventory while creating purchase and sales unit and rate are mandatory error issue
                    return pr.stockUnitUniqueName || pr.rate;
                });
                stockObj.salesAccountDetails = {
                    accountUniqueName: formObj.salesAccountUniqueName,
                    unitRates: formObj.saleUnitRates
                };
            } else {
                this._toasty.errorToast(INVALID_STOCK_ERROR_MESSAGE);
                return;
            }
        }

        stockObj.isFsStock = formObj.isFsStock;
        stockObj.taxes = formObj.taxes;

        if (stockObj.isFsStock) {
            formObj.manufacturingDetails.linkedStocks = this.removeBlankLinkedStock(formObj.manufacturingDetails.linkedStocks);
            stockObj.manufacturingDetails = {
                manufacturingQuantity: formObj.manufacturingDetails.manufacturingQuantity,
                manufacturingUnitCode: formObj.manufacturingDetails.manufacturingUnitCode,
                manufacturingUnitUniqueName: formObj.manufacturingDetails.manufacturingUnitUniqueName,
                linkedStocks: formObj.manufacturingDetails.linkedStocks
            };
        } else {
            stockObj.manufacturingDetails = null;
        }
        let parentSelected = false;
        // if (!_.isString && formObj.parentGroup.value) {
        //   formObj.parentGroup = formObj.parentGroup.value;
        //   parentSelected = true;
        // }
        let defaultGrpisExist = false;
        if (formObj.parentGroup) {
            parentSelected = true;
        } else {
            this.groupsData$.subscribe(p => {
                if (p) {
                    defaultGrpisExist = p.findIndex(q => q?.value === 'maingroup') > -1;
                    if (defaultGrpisExist) {
                        formObj.parentGroup = 'maingroup';
                    }
                }
            });
        }

        this.showOtherDetails = false;

        if (!formObj.parentGroup) {
            let stockRequest = {
                name: 'Main Group',
                uniqueName: 'maingroup',
                hsnNumber: '',
                sacNumber: ''
            };
            formObj.parentGroup = stockRequest?.uniqueName;
            this.store.dispatch(this.inventoryAction.addNewGroup(stockRequest));
        } else {
            if (typeof (formObj.parentGroup) === 'object') {
                formObj.parentGroup = formObj.parentGroup?.value;
            }
            this.store.dispatch(this.inventoryAction.createStock(stockObj, formObj.parentGroup));
        }
        this.createGroupSuccess$.subscribe(s => {
            if (s && formObj.parentGroup) {
                this.store.dispatch(this.inventoryAction.createStock(stockObj, formObj.parentGroup));
            }
        });

    }

    public getParentGroupData() {
        // parentgroup data
        let flattenData: IOption[] = [];
        this._inventoryService.GetGroupsWithStocksFlatten().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data?.status === 'success') {
                this.flattenDATA(data?.body?.results, flattenData);
                this.groupsData$ = of(flattenData);
                this.setActiveGroupOnCreateStock();
            }
        });
    }

    public setActiveGroupOnCreateStock() {  // trying to select active group on create stock
        this.groupsData$.subscribe(p => {
            let selected = p.find(q => q?.value === this.groupUniqueName);
            if (selected) {
                this.addStockForm.get('parentGroup')?.patchValue({
                    label: selected.label,
                    value: selected?.value
                });
            }
        });
    }

    public flattenDATA(rawList: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []) {
        rawList?.map(p => {
            if (p) {
                let newOption: IOption = { label: '', value: '' };
                newOption.label = p.name;
                newOption.value = p?.uniqueName;
                parents.push(newOption);
                if (p.childStockGroups && p.childStockGroups.length > 0) {
                    this.flattenDATA(p.childStockGroups, parents);
                }
            }
        });
    }

    // group selected
    public groupSelected(event: IOption) {
        setTimeout(() => {
            this.stockName?.nativeElement.focus();
        }, 200);
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    /**
     * findAddedStock
     */
    public findAddedStock(uniqueName, i) {
        const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        let count = 0;
        _.forEach(control.controls, (o) => {
            if (o?.value.stockUniqueName === uniqueName) {
                count++;
            }
        });

        if (count > 1) {
            this._toasty.errorToast('Stock already added.');
            this.disableStockButton = true;
            return;
        } else {
            this.disableStockButton = false;
        }
    }

    /**
     * removeBlankLinkedStock
     */
    public removeBlankLinkedStock(linkedStocks) {
        const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as UntypedFormGroup;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        let rawArr = control.getRawValue();
        _.forEach(rawArr, (o, i) => {
            if (!o.quantity || !o.stockUniqueName || !o.stockUnitUniqueName) {
                rawArr = _.without(rawArr, o);
                control.removeAt(i);
            }
        });
        linkedStocks = _.cloneDeep(rawArr);
        return linkedStocks;
    }

    /**
     * validateLinkedStock
     */
    public validateLinkedStock(item) {
        return !(!item.quantity || !item.stockUniqueName || !item.stockUnitUniqueName);
    }

    public addNewGroupPane() {
        this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
    }

    public addNewStockUnit() {
        this.store.dispatch(this.inventoryAction.OpenCustomUnitPane(true));
    }

    public validateSKU(e: any) {
        let pattern = new RegExp("^[a-zA-Z0-9]+$");
        let isOk = pattern.test(e.key);
        if (!isOk) {
            let val = this.addStockForm.get('skuCode')?.value;
            val = val?.substr(0, (val?.length - 1));
            this.addStockForm.get('skuCode')?.patchValue(val);
            return;
        }
    }

    /**
     * ngOnChanges
     */
    public ngOnChanges(s: SimpleChanges) {
        if (s.addStock && s.addStock.currentValue) {
            if (this.addStockForm) {
                this.addStockForm.reset();
                this.forceClear$ = of({ status: true });
                this.addStockForm.controls['parentGroup'].enable();
                if (this.activeGroup) {
                    this.addStockForm.get('parentGroup')?.patchValue(this.activeGroup?.uniqueName);
                } else {
                    this.groupsData$.subscribe(p => {
                        if (p) {
                            let defaultGrpisExist = p.findIndex(q => q?.value === 'maingroup') > -1;
                            if (defaultGrpisExist) {
                                this.addStockForm.get('parentGroup')?.patchValue('maingroup');
                            }
                        }
                    });
                }
                this.isUpdatingStockForm = false;
            }
        }
        if (s.autoFocusInChild && s.autoFocusInChild.currentValue) {
            this.groupDDList?.show('');
        }
    }

    /**
     * selectTax
     */
    public selectTax(e, tax) {
        if (tax.taxType !== 'gstcess') {
            let index = _.findIndex(this.taxTempArray, (o) => o.taxType === tax.taxType);
            if (index > -1 && e.target?.checked) {
                this.companyTaxesList$.subscribe((taxes) => {
                    _.forEach(taxes, (o) => {
                        if (o.taxType === tax.taxType) {
                            o.isChecked = false;
                            o.isDisabled = true;
                        }
                    });
                });
            }

            if (index < 0 && e.target?.checked) {
                this.companyTaxesList$.subscribe((taxes) => {
                    _.forEach(taxes, (o) => {
                        if (o.taxType === tax.taxType) {
                            o.isChecked = false;
                            o.isDisabled = true;
                        }
                        if (o?.uniqueName === tax?.uniqueName) {
                            tax.isChecked = true;
                            tax.isDisabled = false;
                            this.taxTempArray.push(tax);
                        }
                    });
                });
            } else if (index > -1 && e.target?.checked) {
                tax.isChecked = true;
                tax.isDisabled = false;
                this.taxTempArray = this.taxTempArray?.filter(ele => {
                    return tax.taxType !== ele.taxType;
                });
                this.taxTempArray.push(tax);
            } else {
                let idx = _.findIndex(this.taxTempArray, (o) => o?.uniqueName === tax?.uniqueName);
                this.taxTempArray.splice(idx, 1);
                tax.isChecked = false;
                this.companyTaxesList$.subscribe((taxes) => {
                    _.forEach(taxes, (o) => {
                        if (o.taxType === tax.taxType) {
                            o.isDisabled = false;
                        }
                    });
                });
            }
        } else {
            if (e.target?.checked) {
                this.taxTempArray.push(tax);
                tax.isChecked = true;
            } else {
                let idx = _.findIndex(this.taxTempArray, (o) => o?.uniqueName === tax?.uniqueName);
                this.taxTempArray.splice(idx, 1);
                tax.isChecked = false;
            }
        }

        this.addStockForm.get('taxes')?.patchValue(this.taxTempArray?.map(m => m?.uniqueName));
    }

    /**
     * mapSavedTaxes
     */
    public mapSavedTaxes(taxes) {
        let taxToMap = [];
        let e: any = { target: { checked: true } };
        this.companyTaxesList$.subscribe(a => {
            _.filter(a, (tax) => {
                _.find(taxes, (unq) => {
                    if (unq === tax?.uniqueName) {
                        return taxToMap.push(tax);
                    }
                });
            });
        });
        taxToMap?.map((tax, i) => {
            this.selectTax(e, tax);
        });
    }

    /**
     * moveStock
     */
    public moveStock() {
        if (this.addStockForm.get('parentGroup')?.value !== this.activeGroup?.uniqueName) {
            this.store.dispatch(this.inventoryAction.MoveStock(this.activeGroup, this.stockUniqueName, this.addStockForm.get('parentGroup')?.value));
        }
    }

    public openShowOtherDetailsSection() {
        this.toggleOtherDetails();
        setTimeout(() => {
            this.uniqueName?.nativeElement.focus();
        }, 200);
    }

    public focusInPurchaseAccountField() {
        setTimeout(() => {
            this.purchaseAccountUniqueName?.show('');
        }, 200);
    }

    public onSelectPurchaseAccount() {
        setTimeout(() => {
            this.purchaseStockUnitCode?.show('');
        }, 200);
    }

    public focusInSalesAccountField() {
        setTimeout(() => {
            this.salesAccountUniqueName?.show('');
        }, 200);
    }

    public onSelectSalesAccount() {
        setTimeout(() => {
            this.salesStockUnitCode?.show('');
        }, 200);
    }

    public onSelectPurchaseStockUnitCode() {
        setTimeout(() => {
            this.purchaseRate?.nativeElement.focus();
        }, 200);
    }

    public onSelectSalesStockUnitCode() {
        setTimeout(() => {
            this.salesRate?.nativeElement.focus();
        }, 200);
    }

    public showManufacturingQuantitySection() {
        if (this.addStockForm?.value.isFsStock) {
            setTimeout(() => {
                this.manufacturingQuantity?.nativeElement.focus();
            }, 200);
        }
    }

    public onSelectManufacturingStockUnitCode() {
        setTimeout(() => {
            this.manufacturingStockUniqueName?.show();
        }, 200);
    }

    public onSelectManufacturingStockQuantity() {
        setTimeout(() => {
            this.manufacturingStockUnitCode?.show();
        }, 200);
    }

    /**
     * Validates the stock to have both unit and rate if either of them has been provided
     * The stock to be created is valid if the user has either provided both unit and rate or
     * has provided none. If the user provides anyone of them then it is invalid entry and method
     * will return false
     *
     * @private
     * @param {Array<any>} unitRates Array of stockUnitUniqueName and rate keys
     * @returns {boolean} True, if the stock is valid
     * @memberof SalesAddStockComponent
     */
    private validateStock(unitRates: Array<any>): boolean {
        if (unitRates) {
            const formEntries = unitRates.filter((unitRate) => {
                return (unitRate.stockUnitUniqueName && !unitRate.rate) || (!unitRate.stockUnitUniqueName && unitRate.rate);
            });
            return formEntries?.length === 0;
        }
        return true;
    }

    /**
     * This will get invoice settings
     *
     * @memberof SalesAddStockComponent
     */
    public getInvoiceSettings(): void {
        this.invoiceService.GetInvoiceSetting().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                let invoiceSettings = _.cloneDeep(response.body);
                this.inventorySettings = invoiceSettings.companyInventorySettings;
            }
        });
    }

    /**
     * This will toggle other details section
     *
     * @memberof SalesAddStockComponent
     */
    public toggleOtherDetails(): void {
        this.showOtherDetails = !this.showOtherDetails;

        if (this.addStockForm.get("hsnNumber")?.value) {
            this.addStockForm.get("showCodeType")?.patchValue("hsn");
        } else if (this.addStockForm.get("sacNumber")?.value) {
            this.addStockForm.get("showCodeType")?.patchValue("sac");
        } else {
            if (this.inventorySettings?.manageInventory) {
                this.addStockForm.get("showCodeType")?.patchValue("hsn");
            } else {
                this.addStockForm.get("showCodeType")?.patchValue("sac");
            }
        }
    }
}
