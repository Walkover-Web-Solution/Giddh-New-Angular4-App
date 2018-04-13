import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { Observable } from 'rxjs/Observable';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { decimalDigits, digitsOnly, stockManufacturingDetailsValidator } from '../../../shared/helpers';
import { CreateStockRequest, StockDetailResponse, StockGroupResponse } from '../../../models/api-models/Inventory';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import * as  _ from '../../../lodash-optimized';
import { AccountService } from '../../../services/account.service';
import { CustomStockUnitAction } from '../../../actions/inventory/customStockUnit.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IStockItemDetail, IUnitRateItem } from '../../../models/interfaces/stocksItem.interface';
import { Subject } from 'rxjs/Subject';
import { uniqueNameInvalidStringReplace } from '../../../shared/helpers/helperFunctions';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { ToasterService } from 'app/services/toaster.service';
import { InventoryService } from 'app/services/inventory.service';
import { IGroupsWithStocksHierarchyMinItem } from 'app/models/interfaces/groupsWithStocks.interface';
import { IForceClear } from 'app/models/api-models/Sales';
import { TaxResponse } from '../../../models/api-models/Company';
import { CompanyActions } from '../../../actions/company.actions';

@Component({
  selector: 'inventory-add-stock',  // <home></home>
  templateUrl: './inventory.addstock.component.html',
  styles: [`
  .output_row>td {
    padding: 12px 10px 12px 0 !important;
  }
  .basic>tbody>tr>td {
    padding: 2px 10px 2px 0;
  }
  .table_label td {
    padding-top: 12px !important;
  }
  .dropdown-menu{
    max-height: 168px;
    overflow: auto;
  }
  `]
})
export class InventoryAddStockComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @Input() public addStock: boolean = false;

  public stockListDropDown$: Observable<IOption[]>;
  public stockUnitsDropDown$: Observable<IOption[]> = Observable.of(null);
  public purchaseAccountsDropDown$: Observable<IOption[]>;
  public salesAccountsDropDown$: Observable<IOption[]>;

  @ViewChild('formDiv') public formDiv: ElementRef;
  public formDivBoundingRect: Subject<any> = new Subject<any>();

  public groupUniqueName: string;
  public stockUniqueName: string;
  public addStockForm: FormGroup;
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
  public forceClear$: Observable<IForceClear> = Observable.of({status: false});
  public forceClearStock$: Observable<IForceClear> = Observable.of({status: false});
  public forceClearStockUnit$: Observable<IForceClear> = Observable.of({status: false});
  public disableStockButton: boolean = false;
  public createGroupSuccess$: Observable<boolean>;
  public showOtherDetails: boolean;
  public addNewStock: boolean = false;
  public manageInProcess$: Observable<any>;
  public companyTaxesList$: Observable<TaxResponse[]>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    private _fb: FormBuilder, private inventoryAction: InventoryAction, private _accountService: AccountService,
    private customStockActions: CustomStockUnitAction, private ref: ChangeDetectorRef, private _toasty: ToasterService, private _inventoryService: InventoryService, private companyActions: CompanyActions) {
    this.fetchingStockUniqueName$ = this.store.select(state => state.inventory.fetchingStockUniqueName).takeUntil(this.destroyed$);
    this.isStockNameAvailable$ = this.store.select(state => state.inventory.isStockNameAvailable).takeUntil(this.destroyed$);
    this.activeGroup$ = this.store.select(s => s.inventory.activeGroup).takeUntil(this.destroyed$);
    this.activeStock$ = this.store.select(s => s.inventory.activeStock).takeUntil(this.destroyed$);
    this.createStockSuccess$ = this.store.select(s => s.inventory.createStockSuccess).takeUntil(this.destroyed$);
    this.isStockAddInProcess$ = this.store.select(s => s.inventory.isStockAddInProcess).takeUntil(this.destroyed$);
    this.isStockUpdateInProcess$ = this.store.select(s => s.inventory.isStockUpdateInProcess).takeUntil(this.destroyed$);
    this.isStockDeleteInProcess$ = this.store.select(s => s.inventory.isStockDeleteInProcess).takeUntil(this.destroyed$);
    this.showLoadingForStockEditInProcess$ = this.store.select(s => s.inventory.showLoadingForStockEditInProcess).takeUntil(this.destroyed$);
    this.createGroupSuccess$ = this.store.select(s => s.inventory.createGroupSuccess).takeUntil(this.destroyed$);
    this.manageInProcess$ = this.store.select(s => s.inventory.inventoryAsideState).takeUntil(this.destroyed$);
    this.store.dispatch(this.companyActions.getTax());
    this.companyTaxesList$ = this.store.select(p => p.company.taxes).takeUntil(this.destroyed$);

    this.store.select(state => state.inventory.stockUnits).takeUntil(this.destroyed$).subscribe( p  => {
      if (p && p.length) {
        let units = p;
        let unitArr = units.map(unit => {
          return { label: `${unit.name} (${unit.code})`, value: unit.code };
        });
        this.stockUnitsDropDown$ = Observable.of(unitArr);
      }
    });

    this.getParentGroupData();
  }

  public ngOnInit() {
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
    this.store.dispatch(this.customStockActions.GetStockUnit());

    // subscribe route parameters
    this.route.params.distinct().takeUntil(this.destroyed$).subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      this.stockUniqueName = params['stockUniqueName'];
      if (params['stockUniqueName'] && params['groupUniqueName']) {
        this.store.dispatch(this.sideBarAction.GetInventoryStock(this.stockUniqueName, this.groupUniqueName));
      }
    });

    this.stockListDropDown$ = this.store.select(p => {
      if (p.inventory.stocksList) {
        if (p.inventory.stocksList.results) {
          let units = p.inventory.stocksList.results;

          return units.map(unit => {
            return { label: `${unit.name} (${unit.uniqueName})`, value: unit.uniqueName };
          });
        }
      }
    }).takeUntil(this.destroyed$);

    // get all stock units
    // this.stockUnitsDropDown$ = this.store.select(p => {

    // }).takeUntil(this.destroyed$);

    // add stock form
    this.addStockForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      uniqueName: ['', [Validators.required, Validators.minLength(2)]],
      stockUnitCode: ['', [Validators.required]],
      openingQuantity: ['', decimalDigits],
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
        manufacturingUnitCode: ['', [Validators.required]],
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
      taxes: this._fb.array([])
    });

    // subscribe isFsStock for disabling manufacturingDetails
    this.addStockForm.controls['isFsStock'].valueChanges.subscribe((v) => {
      const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
      if (v) {
        manufacturingDetailsContorl.enable();
      } else {
        manufacturingDetailsContorl.disable();
      }
    });

    // subscribe enablePurchase checkbox for enable/disable unit/rate
    this.addStockForm.controls['enablePurchase'].valueChanges.subscribe((a) => {
      const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
      if (a) {
        purchaseUnitRatesControls.enable();
        // console.log(a);
      } else {
        purchaseUnitRatesControls.disable();
      }
    });

    // subscribe enableSales checkbox for enable/disable unit/rate
    this.addStockForm.controls['enableSales'].valueChanges.subscribe((a) => {
      const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as FormArray;
      if (a) {
        saleUnitRatesControls.enable();
        // console.log(a);
      } else {
        saleUnitRatesControls.disable();
      }
    });

    // get purchase accounts
    this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: ['purchases'] }).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let purchaseAccounts: IOption[] = [];
        data.body.results.map(d => {
          purchaseAccounts.push({ label: `${d.name} (${d.uniqueName})`, value: d.uniqueName });
        });
        this.purchaseAccountsDropDown$ = Observable.of(purchaseAccounts);
      }
    });

    // get sales accounts
    this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: ['sales'] }).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let salesAccounts: IOption[] = [];
        data.body.results.map(d => {
          salesAccounts.push({ label: `${d.name} (${d.uniqueName})`, value: d.uniqueName });
        });
        this.salesAccountsDropDown$ = Observable.of(salesAccounts);
      }
    });

    // subscribe active stock if availabel fill form
    this.activeStock$.takeUntil(this.destroyed$).subscribe(a => {
      if (a && !this.addStock) {
        this.stockUniqueName = a.uniqueName;
        this.isUpdatingStockForm = true;
        this.addStockForm.patchValue({
          name: a.name, uniqueName: a.uniqueName,
          stockUnitCode: a.stockUnit ? a.stockUnit.code : '', openingQuantity: a.openingQuantity,
          openingAmount: a.openingAmount,
          hsnNumber: a.hsnNumber,
          parentGroup: a.stockGroup.uniqueName
        });
        this.calCulateRate();

        const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
        if (a.purchaseAccountDetails) {
          this.addStockForm.patchValue({ purchaseAccountUniqueName: a.purchaseAccountDetails.accountUniqueName });

          // render purchase unit rates
          a.purchaseAccountDetails.unitRates.map((item, i) => {
            this.addPurchaseUnitRates(i, item);
          });
          purchaseUnitRatesControls.enable();
          this.addStockForm.controls['enablePurchase'].patchValue(true);
        } else {
          this.addStockForm.controls['enablePurchase'].patchValue(false);
          purchaseUnitRatesControls.disable();
        }

        const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as FormArray;
        if (a.salesAccountDetails) {
          this.addStockForm.patchValue({ salesAccountUniqueName: a.salesAccountDetails.accountUniqueName });

          // render sale unit rates
          a.salesAccountDetails.unitRates.map((item, i) => {
            this.addSaleUnitRates(i, item);
          });
          saleUnitRatesControls.enable();
          this.addStockForm.controls['enableSales'].patchValue(true);
        } else {
          saleUnitRatesControls.disable();
          this.addStockForm.controls['enableSales'].patchValue(false);
        }

        // if manufacturingDetails is avilable
        if (a.manufacturingDetails) {
          this.addStockForm.patchValue({
            isFsStock: true,
            manufacturingDetails: {
              manufacturingQuantity: a.manufacturingDetails.manufacturingQuantity,
              manufacturingUnitCode: a.manufacturingDetails.manufacturingUnitCode
            }
          });
          a.manufacturingDetails.linkedStocks.map((item, i) => {
            this.addItemInLinkedStocks(item, i, a.manufacturingDetails.linkedStocks.length - 1);
          });
        } else {
          this.addStockForm.patchValue({ isFsStock: false });
        }
        if (a.taxes.length) {
          this.addStockForm.get('taxes').patchValue([]);
          this.mapSavedTaxes(a.taxes);
        }
        this.store.dispatch(this.inventoryAction.hideLoaderForStock());
        this.addStockForm.controls['parentGroup'].disable();
      } else {
        this.isUpdatingStockForm = false;
      }
    });

    // subscribe createStockSuccess for resting form
    this.createStockSuccess$.subscribe(s => {
      if (s) {
        this.resetStockForm();
        this.store.dispatch(this.inventoryAction.GetStock());
        this.addStockForm.get('parentGroup').patchValue(this.activeGroup.uniqueName);
      }
    });

    this.activeGroup$.takeUntil(this.destroyed$).subscribe(s => {
      if (s) {
        this.activeGroup = s;
        this.groupUniqueName = s.uniqueName;
        this.addStockForm.get('parentGroup').patchValue(this.activeGroup.uniqueName);
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
    this.addStockForm.controls['enableSales'].patchValue(false);
    this.addStockForm.controls['enablePurchase'].patchValue(false);
    }, 100);

    this.manageInProcess$.subscribe(s => {
      if (s.isOpen && !s.isGroup && !s.isUpdate) {

        // console.log('this.activeGroup', this.activeGroup);
      }
    });
  }

  // initial unitandRates controls
  public initUnitAndRates() {
    // initialize our controls
    return this._fb.group({
      rate: [''],
      stockUnitCode: ['']
    });
  }

  // add purchaseUnitRates controls
  public addPurchaseUnitRates(i: number, item?: IUnitRateItem) {
    const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
    const control = this.addStockForm.controls['purchaseUnitRates'] as FormArray;

    // add purchaseUnitRates to the list
    if (item) {
      if (control.controls[i]) {
        control.controls[i].patchValue(item);
      } else {
        control.push(this.initUnitAndRates());
        setTimeout(() => {
          control.controls[i].patchValue(item);
        }, 200);
      }
    } else {
      if (purchaseUnitRatesControls.controls[i].value.rate && purchaseUnitRatesControls.controls[i].value.stockUnitCode) {
        control.push(this.initUnitAndRates());
      }
    }
  }

  // remove purchaseUnitRates controls
  public removePurchaseUnitRates(i: number) {
    // remove address from the list
    const control = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
    if (control.length > 1) {
      control.removeAt(i);
    } else {
      control.controls[0].reset();
    }
  }

  // add saleUnitRates controls
  public addSaleUnitRates(i: number, item?: IUnitRateItem) {
    const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as FormArray;
    const control = this.addStockForm.controls['saleUnitRates'] as FormArray;

    // add saleUnitRates to the list
    if (item) {
      if (control.controls[i]) {
        control.controls[i].patchValue(item);
      } else {
        control.push(this.initUnitAndRates());
        setTimeout(() => {
          control.controls[i].patchValue(item);
        }, 200);
      }
    } else {
      if (saleUnitRatesControls.controls[i].value.rate && saleUnitRatesControls.controls[i].value.stockUnitCode) {
        control.push(this.initUnitAndRates());
      }
    }
  }

  // remove saleUnitRates controls
  public removeSaleUnitRates(i: number) {
    // remove address from the list
    const control = this.addStockForm.controls['saleUnitRates'] as FormArray;
    if (control.length > 1) {
      control.removeAt(i);
    } else {
      control.controls[0].reset();
    }
  }

  public ngAfterViewInit() {
    if (this.groupUniqueName) {
      // this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
    }
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    manufacturingDetailsContorl.disable();
  }

  // generate uniquename
  public generateUniqueName() {
    if (this.isUpdatingStockForm) {
      return true;
    }
    let groupName = null;
    let val: string = this.addStockForm.controls['name'].value;
    if (val) {
      val = uniqueNameInvalidStringReplace(val);
    }

    if (val) {
      this.store.dispatch(this.inventoryAction.GetStockWithUniqueName(val));

      this.isStockNameAvailable$.takeUntil(this.destroyed$).subscribe(a => {
        if (a !== null && a !== undefined) {
          if (a) {
            this.addStockForm.patchValue({ uniqueName: val });
          } else {
            let num = 1;
            this.addStockForm.patchValue({ uniqueName: val + num });
          }
        }
      });
    } else {
      this.addStockForm.patchValue({ uniqueName: '' });
    }
  }

  // calculate rate
  public calCulateRate() {
    let quantity = this.addStockForm.value.openingQuantity;
    let amount = this.addStockForm.value.openingAmount;

    if (quantity && amount) {
      this.addStockForm.patchValue({ stockRate: (amount / quantity).toFixed(4) });
    } else if (!quantity || !amount) {
      this.addStockForm.controls['stockRate'].patchValue('');
    }
  }

  public initialIManufacturingDetails() {
    // initialize our controls
    return this._fb.group({
      stockUniqueName: [''],
      stockUnitCode: [''],
      quantity: ['', digitsOnly]
    });
  }

  public addItemInLinkedStocks(item, i?: number, lastIdx?) {
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
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
          frmgrp.patchValue(item);
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

  public editItemInLinkedStocks(item: FormGroup, i: number) {
    this.editLinkedStockIdx = i;
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
    let last = control.controls.length - 1;
    control.disable();
    control.controls[i].enable();
    control.controls[last].enable();
    this.editModeForLinkedStokes = true;
  }

  public updateItemInLinkedStocks(item: FormGroup, i: any) {
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
    const linkedStokesControl = control;
    linkedStokesControl.controls[i].patchValue(item);
    this.editLinkedStockIdx = null;
    this.editModeForLinkedStokes = false;
    let last = control.controls.length;
    control.disable();
    control.controls[last - 1].enable();
  }

  public removeItemInLinkedStocks(i: number) {
    if (this.editLinkedStockIdx === i) {
    this.editModeForLinkedStokes = false;
    this.editLinkedStockIdx = null;
    }
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
    const linkedStokesControl = control;
    linkedStokesControl.removeAt(i);
  }

  public checkIfLinkedStockIsUnique(v: IOption) {
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
    const linkedStokes = control.value;
    if (linkedStokes) {
      let el = linkedStokes.find(a => a.stockUniqueName === v.value);
      if (el) {
        manufacturingDetailsContorl.controls['linkedStockUniqueName'].setValue(el.stockUniqueName);
        manufacturingDetailsContorl.controls['linkedStockUnitCode'].setValue(el.stockUnitCode);
        manufacturingDetailsContorl.controls['linkedQuantity'].setValue(el.quantity);
        return true;
      }
    }
    return true;
  }

  public resetStockForm() {
    this.forceClear$ = Observable.of({status: true});
    this.forceClearStock$ = Observable.of({status: true});
    this.forceClearStockUnit$ = Observable.of({ status: true});
    let activeStock: StockDetailResponse = null;
    this.activeStock$.take(1).subscribe((a) => activeStock = a);

    const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
    const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as FormArray;

    const manufacturingDetailsContorls = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const linkedStocksControls = manufacturingDetailsContorls.controls['linkedStocks'] as FormArray;

    if (purchaseUnitRatesControls.controls.length > 1) {
      purchaseUnitRatesControls.controls = purchaseUnitRatesControls.controls.splice(1);
    }
    if (saleUnitRatesControls.length > 1) {
      saleUnitRatesControls.controls = saleUnitRatesControls.controls.splice(1);
    }
    if (linkedStocksControls.length > 1) {
      linkedStocksControls.controls = [];
      linkedStocksControls.push(this.initialIManufacturingDetails());
    }

    this.addStockForm.reset();

    if (activeStock && !this.addStock) {
      this.isUpdatingStockForm = true;
      this.addStockForm.patchValue({
        name: activeStock.name,
        uniqueName: activeStock.uniqueName,
        stockUnitCode: activeStock.stockUnit ? activeStock.stockUnit.code : '',
        openingQuantity: activeStock.openingQuantity,
        openingAmount: activeStock.openingAmount
      });

      if (activeStock.purchaseAccountDetails) {
        this.addStockForm.patchValue({ purchaseAccountUniqueName: activeStock.purchaseAccountDetails.accountUniqueName });

        // render unit rates
        activeStock.purchaseAccountDetails.unitRates.map((item, i) => {
          this.addPurchaseUnitRates(i, item);
        });
      }

      if (activeStock.salesAccountDetails) {
        this.addStockForm.patchValue({ salesAccountUniqueName: activeStock.salesAccountDetails.accountUniqueName });

        // render unit rates
        activeStock.salesAccountDetails.unitRates.map((item, i) => {
          this.addSaleUnitRates(i, item);
        });
      }

      // if manufacturingDetails is avilable
      if (activeStock.manufacturingDetails) {
        this.addStockForm.patchValue({
          isFsStock: true,
          manufacturingDetails: {
            manufacturingQuantity: activeStock.manufacturingDetails.manufacturingQuantity,
            manufacturingUnitCode: activeStock.manufacturingDetails.manufacturingUnitCode
          }
        });
        activeStock.manufacturingDetails.linkedStocks.map((item, i) => {
          this.addItemInLinkedStocks(item, i, activeStock.manufacturingDetails.linkedStocks.length - 1);
        });
      } else {
        this.addStockForm.patchValue({ isFsStock: false });
      }
    }
  }

  // submit form
  public submit() {
    let stockObj = new CreateStockRequest();
    let uniqueName = this.addStockForm.get('uniqueName');
    uniqueName.patchValue(uniqueName.value.replace(/ /g, '').toLowerCase());
    this.addStockForm.get('uniqueName').enable();

    let formObj = this.addStockForm.value;
    stockObj.name = formObj.name;
    stockObj.uniqueName = formObj.uniqueName;
    stockObj.stockUnitCode = formObj.stockUnitCode;
    stockObj.openingAmount = formObj.openingAmount;
    stockObj.openingQuantity = formObj.openingQuantity;
    stockObj.hsnNumber = formObj.hsnNumber;
    if (formObj.enablePurchase) {
      formObj.purchaseUnitRates = formObj.purchaseUnitRates.filter((pr) => {
        return pr.stockUnitCode && pr.rate;
      });
      stockObj.purchaseAccountDetails = {
        accountUniqueName: formObj.purchaseAccountUniqueName,
        unitRates: formObj.purchaseUnitRates
      };
    }
    if (formObj.enableSales) {
      formObj.saleUnitRates = formObj.saleUnitRates.filter((pr) => {
        return pr.stockUnitCode && pr.rate;
      });
      stockObj.salesAccountDetails = {
        accountUniqueName: formObj.salesAccountUniqueName,
        unitRates: formObj.saleUnitRates
      };
    }

    stockObj.isFsStock = formObj.isFsStock;

    if (stockObj.isFsStock) {
      formObj.manufacturingDetails.linkedStocks = this.removeBlankLinkedStock(formObj.manufacturingDetails.linkedStocks);
      stockObj.manufacturingDetails = {
        manufacturingQuantity: formObj.manufacturingDetails.manufacturingQuantity,
        manufacturingUnitCode: formObj.manufacturingDetails.manufacturingUnitCode,
        linkedStocks: formObj.manufacturingDetails.linkedStocks
      };
    } else {
      stockObj.manufacturingDetails = null;
    }
    if (!_.isString && formObj.parentGroup.value) {
      formObj.parentGroup = formObj.parentGroup.value;
    }

    if (!formObj.parentGroup) {
      let defaultGrp = null;
      this.groupsData$.subscribe(p => {
        defaultGrp = p.find(q => q.value === 'maingroup');
      });
      if (!defaultGrp) {
        let stockRequest = {
            name: 'Main Group',
            uniqueName: 'maingroup'
        };
        formObj.parentGroup = stockRequest.uniqueName;
        this.store.dispatch(this.inventoryAction.addNewGroup(stockRequest));
      }
      if (defaultGrp) {
        formObj.parentGroup = defaultGrp.value;
      }
    }

    this.store.dispatch(this.inventoryAction.createStock(stockObj, formObj.parentGroup));
  }

  public update() {
    let stockObj = new CreateStockRequest();
    let uniqueName = this.addStockForm.get('uniqueName');
    uniqueName.patchValue(uniqueName.value.replace(/ /g, '').toLowerCase());
    this.addStockForm.get('uniqueName').enable();

    let formObj = this.addStockForm.value;

    stockObj.name = formObj.name;
    stockObj.uniqueName = formObj.uniqueName.toLowerCase();
    stockObj.stockUnitCode = formObj.stockUnitCode;
    stockObj.openingAmount = formObj.openingAmount;
    stockObj.openingQuantity = formObj.openingQuantity;
    stockObj.hsnNumber = formObj.hsnNumber;
    stockObj.taxes = formObj.taxes;

    if (formObj.enablePurchase) {
      formObj.purchaseUnitRates = formObj.purchaseUnitRates.filter((pr) => {
        return pr.stockUnitCode && pr.rate;
      });
      stockObj.purchaseAccountDetails = {
        accountUniqueName: formObj.purchaseAccountUniqueName,
        unitRates: formObj.purchaseUnitRates
      };
    }

    if (formObj.enableSales) {
      formObj.saleUnitRates = formObj.saleUnitRates.filter((pr) => {
        return pr.stockUnitCode && pr.rate;
      });
      stockObj.salesAccountDetails = {
        accountUniqueName: formObj.salesAccountUniqueName,
        unitRates: formObj.saleUnitRates
      };
    }

    stockObj.isFsStock = formObj.isFsStock;

    if (stockObj.isFsStock) {
      formObj.manufacturingDetails.linkedStocks = this.removeBlankLinkedStock(formObj.manufacturingDetails.linkedStocks);
      stockObj.manufacturingDetails = {
        manufacturingQuantity: formObj.manufacturingDetails.manufacturingQuantity,
        manufacturingUnitCode: formObj.manufacturingDetails.manufacturingUnitCode,
        linkedStocks: formObj.manufacturingDetails.linkedStocks
      };
    } else {
      stockObj.manufacturingDetails = null;
    }

    this.store.dispatch(this.inventoryAction.updateStock(stockObj, this.groupUniqueName, this.stockUniqueName));
  }

  public deleteStock() {
    this.store.dispatch(this.inventoryAction.removeStock(this.groupUniqueName, this.stockUniqueName));
  }

  public getParentGroupData() {
    // parentgroup data
    let flattenData: IOption[] = [];
    this._inventoryService.GetGroupsWithStocksFlatten().takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        this.flattenDATA(data.body.results, flattenData);
        this.groupsData$ = Observable.of(flattenData);
      }
    });
  }

  public flattenDATA(rawList: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []) {
    rawList.map(p => {
      if (p) {
        let newOption: IOption = { label: '', value: '' };
        newOption.label = p.name;
        newOption.value = p.uniqueName;
        parents.push(newOption);
        if (p.childStockGroups && p.childStockGroups.length > 0) {
          this.flattenDATA(p.childStockGroups, parents);
        }
      }
    });
  }

  // group selected
  public groupSelected(event: IOption) {
    let selected;
    // this.generateUniqueName();
    this.groupsData$.subscribe(p => {
      selected = p.find(q => q.value === event.value);
    });
    // this.activeGroup = selected;
  }

  // public autoGroupSelect(grpname) {
  //   if (grpname) {
  //     this.groupsData$.subscribe(p => {
  //     let selected = p.find(q => q.value === grpname);
  //       if (selected) {
  //       this.addStockForm.patchValue({ parentGroup: selected.value });
  //       } else {
  //         this.addStockForm.patchValue({ parentGroup: null });
  //       }
  //     });
  //   }
  // }

  public ngOnDestroy() {
    // this.store.dispatch(this.inventoryAction.resetActiveStock());
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * findAddedStock
   */
  public findAddedStock(uniqueName, i) {
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
    let count = 0;
    _.forEach(control.controls, function(o) {
      if (o.value.stockUniqueName === uniqueName) {
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
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
    let rawArr = control.getRawValue();
    _.forEach(rawArr, function(o, i) {
      if (!o.quantity || !o.stockUniqueName || !o.stockUnitCode) {
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
    if (!item.quantity || !item.stockUniqueName || !item.stockUnitCode) {
      return false;
    } else {
      return true;
    }
  }

  public addNewGroupPane() {
    this.store.dispatch(this.inventoryAction.OpenInventoryAsidePane(true));
  }

  public addNewStockUnit() {
    this.store.dispatch(this.inventoryAction.OpenCustomUnitPane(true));
  }

  /**
   * ngOnChanges
   */
  public ngOnChanges(s: SimpleChanges) {
    if (s.addStock && s.addStock.currentValue) {
      if (this.addStockForm) {
        this.addStockForm.reset();
        this.addStockForm.controls['parentGroup'].enable();
        if (this.activeGroup) {
          this.addStockForm.get('parentGroup').patchValue(this.activeGroup.uniqueName);
        }
        this.isUpdatingStockForm = false;
        this.companyTaxesList$.subscribe(a => {
            _.forEach(a, function(o) {
              o.isChecked = false;
            });
        });
      }
    }
  }

  /**
   * selectTax
   */
  public selectTax(e, tax) {
    const taxesControls = this.addStockForm.controls['taxes']['value'] as any;
    if (e.target.checked) {
      tax.isChecked = true;
      taxesControls.push(tax.uniqueName);
    } else {
      let idx = _.findIndex(taxesControls, (o) => o === tax.uniqueName);
      taxesControls.splice(idx, 1);
      tax.isChecked = false;
    }
  }

  /**
   * mapSavedTaxes
   */
  public mapSavedTaxes(taxes) {
    let taxToMap = [];
    let e: any = { target: { checked: true } };
    let common = this.companyTaxesList$.subscribe(a => {
        _.filter(a, function(tax) {
          _.find(taxes, function(unq) {
              if (unq === tax.uniqueName) {
                return taxToMap.push(tax);
              }
          });
        });
    });
    taxToMap.map((tax, i) => {
      this.selectTax(e, tax);
    });
  }
}
