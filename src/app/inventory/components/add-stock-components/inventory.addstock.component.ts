import { AppState } from '../../../store/roots';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { ActivatedRoute } from '@angular/router';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { Subscription } from 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { uniqueNameValidator, stockManufacturingDetailsValidator } from '../../../shared/helpers/customValidationHelper';
import { StockUnitRequest, CreateStockRequest, StockGroupResponse } from '../../../models/api-models/Inventory';
import { Select2OptionData } from '../../../shared/theme/select2/select2.interface';
import { InventoryAction } from '../../../services/actions/inventory/inventory.actions';
import * as  _ from 'lodash';
import { AccountService } from '../../../services/account.service';
import { CustomStockUnitAction } from '../../../services/actions/inventory/customStockUnit.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { IStockItemDetail } from '../../../models/interfaces/stocksItem.interface';

@Component({
  selector: 'invetory-add-stock',  // <home></home>
  templateUrl: './inventory.addstock.component.html'
})
export class InventoryAddStockComponent implements OnInit, AfterViewInit, OnDestroy {
  public stockListDropDown$: Observable<Select2OptionData[]>;
  public stockUnitsDropDown$: Observable<Select2OptionData[]>;
  public purchaseAccountsDropDown$: Observable<Select2OptionData[]>;
  public salesAccountsDropDown$: Observable<Select2OptionData[]>;
  public options: Select2Options = {
    multiple: false,
    width: '100%',
    placeholder: 'Choose a parent unit'
  };
  public groupUniqueName: string;
  public stockUniqueName: string;
  public addStockForm: FormGroup;
  public fetchingStockUniqueName$: Observable<boolean>;
  public isStockNameAvailable$: Observable<boolean>;
  public activeGroup$: Observable<StockGroupResponse>;
  public editModeForLinkedStokes: boolean = false;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    private _fb: FormBuilder, private inventoryAction: InventoryAction, private _accountService: AccountService,
    private customStockActions: CustomStockUnitAction) {
    this.fetchingStockUniqueName$ = this.store.select(state => state.inventory.fetchingStockUniqueName).takeUntil(this.destroyed$);
    this.isStockNameAvailable$ = this.store.select(state => state.inventory.isStockNameAvailable).takeUntil(this.destroyed$);
    this.activeGroup$ = this.store.select(s => s.inventory.activeGroup).takeUntil(this.destroyed$);
  }
  public ngOnInit() {
    // dispatch stocklist request
    this.store.dispatch(this.inventoryAction.GetStock());
    // dispatch stockunit request
    this.store.dispatch(this.customStockActions.GetStockUnit());

    // subscribe route parameters
    this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      this.stockUniqueName = params['stockUniqueName'];
      if (this.groupUniqueName) {
        this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
      }
    });

    // get all stocks
    this.stockListDropDown$ = this.store.select(p => {
      if (p.inventory.stocksList) {
        if (p.inventory.stocksList.results) {
          let units = p.inventory.stocksList.results;

          return units.map(unit => {
            return { text: ` ${unit.name} (${unit.uniqueName})`, id: unit.uniqueName };
          });
        }
      }
    }).takeUntil(this.destroyed$);

    // get all stock units
    this.stockUnitsDropDown$ = this.store.select(p => {
      if (p.inventory.stockUnits.length) {
        let units = p.inventory.stockUnits;

        return units.map(unit => {
          return { text: `${unit.name} (${unit.code})`, id: unit.code };
        });
      }
    }).takeUntil(this.destroyed$);

    // add stock form
    this.addStockForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      uniqueName: ['', [Validators.required, Validators.minLength(2)], uniqueNameValidator],
      stockUnitCode: ['', [Validators.required]],
      openingQuantity: [''],
      stockRate: [{ value: '', disabled: true }],
      openingAmount: [''],
      purchaseAccountUniqueName: [''],
      salesAccountUniqueName: [''],
      purchaseUnitRates: this._fb.array([
        this.initUnitAndRates()
      ]),
      saleUnitRates: this._fb.array([
        this.initUnitAndRates()
      ]),
      manufacturingDetails: this._fb.group({
        manufacturingQuantity: ['', [Validators.required]],
        manufacturingUnitCode: ['', [Validators.required]],
        linkedStocks: this._fb.array([]),
        linkedStockUniqueName: [''],
        linkedQuantity: [''],
        linkedStockUnitCode: [''],
      }, { validator: stockManufacturingDetailsValidator }),
      isFsStock: [false]
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

    // get purchase accounts
    this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: ['purchases'] }).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let purchaseAccounts: Select2OptionData[] = [];
        data.body.results.map(d => {
          purchaseAccounts.push({ text: d.name, id: d.uniqueName });
        });
        this.purchaseAccountsDropDown$ = Observable.of(purchaseAccounts);
      }
    });

    // get sales accounts
    this._accountService.GetFlatternAccountsOfGroup({ groupUniqueNames: ['sales'] }).takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let salesAccounts: Select2OptionData[] = [];
        data.body.results.map(d => {
          salesAccounts.push({ text: d.name, id: d.uniqueName });
        });
        this.salesAccountsDropDown$ = Observable.of(salesAccounts);
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
  public addPurchaseUnitRates(i: number) {
    const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
    // add address to the list
    if (purchaseUnitRatesControls.controls[i].value.rate && purchaseUnitRatesControls.controls[i].value.stockUnitCode) {
      const control = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
      control.push(this.initUnitAndRates());
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
  public addSaleUnitRates(i: number) {
    const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as FormArray;
    // add address to the list
    if (saleUnitRatesControls.controls[i].value.rate && saleUnitRatesControls.controls[i].value.stockUnitCode) {
      const control = this.addStockForm.controls['saleUnitRates'] as FormArray;
      control.push(this.initUnitAndRates());
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
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    manufacturingDetailsContorl.disable();
    // calculate rate on changes of form values
    this.addStockForm.controls['openingQuantity'].valueChanges.subscribe(() => this.calCulateRate());
    this.addStockForm.controls['openingAmount'].valueChanges.subscribe(() => this.calCulateRate());
  }
  // generate uniquename
  public generateUniqueName() {
    let groupName = null;
    this.activeGroup$.take(1).subscribe(s => { groupName = s.uniqueName; });
    let val: string = this.addStockForm.controls['name'].value;
    val = val.replace(/[^a-zA-Z0-9]/g, '').toLocaleLowerCase();
    this.store.dispatch(this.inventoryAction.GetStockUniqueName(groupName, val));

    this.isStockNameAvailable$.subscribe(a => {
      if (a !== null && a !== undefined) {
        if (a) {
          this.addStockForm.patchValue({ uniqueName: val });
        } else {
          let num = 1;
          this.addStockForm.patchValue({ uniqueName: val + num });
        }
      }
    });
  }

  // calculate rate
  public calCulateRate() {
    let quantity = this.addStockForm.value.openingQuantity;
    let amount = this.addStockForm.value.openingAmount;

    if (quantity && amount) {
      this.addStockForm.patchValue({ stockRate: (amount / quantity) });
    }
  }

  public initialIManufacturingDetails() {
    // initialize our controls
    return this._fb.group({
      stockUniqueName: [''],
      stockUnitCode: [''],
      quantity: ['']
    });
  }

  public addItemInLinkedStocks() {
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;

    if (manufacturingDetailsContorl.value.linkedStockUniqueName && manufacturingDetailsContorl.value.linkedStockUnitCode && manufacturingDetailsContorl.value.linkedQuantity) {
      let obj = new IStockItemDetail();
      obj.stockUniqueName = manufacturingDetailsContorl.value.linkedStockUniqueName;
      obj.stockUnitCode = manufacturingDetailsContorl.value.linkedStockUnitCode;
      obj.quantity = manufacturingDetailsContorl.value.linkedQuantity;

      let frmgrp = this.initialIManufacturingDetails();
      control.push(frmgrp);
      frmgrp.patchValue(obj);

      manufacturingDetailsContorl.controls['linkedStockUniqueName'].reset();
      manufacturingDetailsContorl.controls['linkedStockUnitCode'].reset();
      manufacturingDetailsContorl.controls['linkedQuantity'].reset();
    }
  }

  public editItemInLinkedStocks(item: FormGroup) {
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    manufacturingDetailsContorl.controls['linkedStockUniqueName'].setValue(item.value.stockUniqueName);
    manufacturingDetailsContorl.controls['linkedStockUnitCode'].setValue(item.value.stockUnitCode);
    manufacturingDetailsContorl.controls['linkedQuantity'].setValue(item.value.quantity);
    this.editModeForLinkedStokes = true;
  }

  public updateItemInLinkedStocks() {
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    if (manufacturingDetailsContorl.value.linkedStockUniqueName && manufacturingDetailsContorl.value.linkedStockUnitCode && manufacturingDetailsContorl.value.linkedQuantity) {
      const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
      const linkedStokesControl = control;
      const linkedStokesValues = control.value;

      let obj = new IStockItemDetail();
      obj.stockUniqueName = manufacturingDetailsContorl.value.linkedStockUniqueName;
      obj.stockUnitCode = manufacturingDetailsContorl.value.linkedStockUnitCode;
      obj.quantity = manufacturingDetailsContorl.value.linkedQuantity;

      const index = linkedStokesValues.findIndex(c => c.stockUniqueName === obj.stockUniqueName);
      linkedStokesControl.controls[index].patchValue(obj);

      manufacturingDetailsContorl.controls['linkedStockUniqueName'].reset();
      manufacturingDetailsContorl.controls['linkedStockUnitCode'].reset();
      manufacturingDetailsContorl.controls['linkedQuantity'].reset();
      this.editModeForLinkedStokes = false;
    }
  }

  public removeItemInLinkedStocks(i: number) {
    this.editModeForLinkedStokes = false;

    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
    const linkedStokesControl = control;

    manufacturingDetailsContorl.controls['linkedStockUniqueName'].reset();
    manufacturingDetailsContorl.controls['linkedStockUnitCode'].reset();
    manufacturingDetailsContorl.controls['linkedQuantity'].reset();

    linkedStokesControl.removeAt(i);
  }

  public resetLinkedStock() {
    // this.linkedStock = new IStockItemDetail();
  }

  public checkIfLinkedStockIsUnique(v) {
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
    const linkedStokes = control.value;
    if (linkedStokes) {
      let el = linkedStokes.find(a => a.stockUniqueName === v.value);
      if (el) {
        manufacturingDetailsContorl.controls['linkedStockUniqueName'].setValue(el.stockUniqueName);
        manufacturingDetailsContorl.controls['linkedStockUnitCode'].setValue(el.stockUnitCode);
        manufacturingDetailsContorl.controls['linkedQuantity'].setValue(el.quantity);
        this.editModeForLinkedStokes = true;
        return true;
      }
    }
    manufacturingDetailsContorl.controls['linkedStockUnitCode'].reset();
    manufacturingDetailsContorl.controls['linkedQuantity'].reset();
    this.editModeForLinkedStokes = false;
    return true;
  }

  public resetStockForm() {
    const purchaseUnitRatesControls = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
    const saleUnitRatesControls = this.addStockForm.controls['saleUnitRates'] as FormArray;

    const manufacturingDetailsContorls = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const linkedStocksControls = manufacturingDetailsContorls.controls['linkedStocks'] as FormArray;

    purchaseUnitRatesControls.controls = purchaseUnitRatesControls.controls.splice(1);
    saleUnitRatesControls.controls = saleUnitRatesControls.controls.splice(1);

    linkedStocksControls.controls = [];
    this.addStockForm.reset();
  }

  // submit form
  public submit() {
    let activeGroup: StockGroupResponse = null;
    this.activeGroup$.take(1).subscribe((a) => activeGroup = a);
    let stockObj = new CreateStockRequest();
    let formObj = this.addStockForm.value;

    stockObj.name = formObj.name;
    stockObj.uniqueName = formObj.uniqueName;
    stockObj.stockUnitCode = formObj.stockUnitCode;
    stockObj.openingAmount = formObj.openingAmount;
    stockObj.openingQuantity = formObj.openingQuantity;

    formObj.purchaseUnitRates = formObj.purchaseUnitRates.filter((pr) => {
      return pr.stockUnitCode && pr.rate;
    });
    stockObj.purchaseAccountDetails = { accountUniqueName: formObj.purchaseAccountUniqueName, unitRates: formObj.purchaseUnitRates };

    formObj.saleUnitRates = formObj.saleUnitRates.filter((pr) => {
      return pr.stockUnitCode && pr.rate;
    });
    stockObj.salesAccountDetails = { accountUniqueName: formObj.salesAccountUniqueName, unitRates: formObj.saleUnitRates };

    stockObj.isFsStock = formObj.isFsStock;

    if (stockObj.isFsStock) {
      stockObj.manufacturingDetails = {
        manufacturingQuantity: formObj.manufacturingDetails.manufacturingQuantity,
        manufacturingUnitCode: formObj.manufacturingDetails.manufacturingUnitCode,
        linkedStocks: formObj.manufacturingDetails.linkedStocks
      };
    } else {
      stockObj.manufacturingDetails = null;
    }

    this.store.dispatch(this.inventoryAction.createStock(stockObj, activeGroup.uniqueName));
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
