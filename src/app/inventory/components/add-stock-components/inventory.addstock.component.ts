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
import { uniqueNameValidator } from '../../../shared/helpers/customValidationHelper';
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
  public stockUnit$: Observable<StockUnitRequest[]>;
  public groupUniqueName: string;
  public stockUniqueName: string;
  public addStockForm: FormGroup;
  public fetchingStockUniqueName$: Observable<boolean>;
  public isStockNameAvailable$: Observable<boolean>;
  public activeGroup$: Observable<StockGroupResponse>;
  public linkedStocks: IStockItemDetail[] = [];
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
    this.stockListDropDown$ =  this.store.select(p => {
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
    this.stockUnitsDropDown$ =  this.store.select(p => {
      if (p.inventory.stockUnits.length) {
        let units = p.inventory.stockUnits;

        return units.map(unit => {
          return { text: `${unit.name} (${unit.code})`, id: unit.code };
        });
      }
    }).takeUntil(this.destroyed$);

    // add stock form
    this.addStockForm = this._fb.group({
      name: ['', [Validators.required]],
      uniqueName: ['', [Validators.required], uniqueNameValidator],
      stockUnitCode: ['', [Validators.required]],
      openingQuantity: ['', [Validators.required]],
      stockRate: [{ value: '', disabled: true }],
      openingAmount: ['', [Validators.required]],
      purchaseAccountUniqueName: ['', [Validators.required]],
      salesAccountUniqueName: ['', [Validators.required]],
      purchaseUnitRates: this._fb.array([
        this.initUnitAndRates()
      ]),
      saleUnitRates: this._fb.array([
        this.initUnitAndRates()
      ]),
      manufacturingDetails: this._fb.group({
        // manufacturingQuantity: ['', Validators.required],
        // manufacturingUnitCode: ['', Validators.required],
        linkedStocks: this._fb.array([])
      }),
      linkedStockUniqueName: ['', Validators.required],
      linkedQuantity: ['', Validators.required],
      linkedStockUnitCode: ['', Validators.required],
      isFsStock: [false]
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
      rate: ['', Validators.required],
      stockUnitCode: ['', Validators.required]
    });
  }

  // add purchaseUnitRates controls
  public addPurchaseUnitRates() {
    // add address to the list
    if (this.addStockForm.controls['purchaseUnitRates'].valid) {
      const control = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
      control.push(this.initUnitAndRates());
    }
  }

  // remove purchaseUnitRates controls
  public removePurchaseUnitRates(i: number) {
    // remove address from the list
    const control = this.addStockForm.controls['purchaseUnitRates'] as FormArray;
    control.removeAt(i);
  }

  // add saleUnitRates controls
  public addSaleUnitRates() {
    // add address to the list
    if (this.addStockForm.controls['saleUnitRates'].valid) {
      const control = this.addStockForm.controls['saleUnitRates'] as FormArray;
      control.push(this.initUnitAndRates());
    }
  }

  // remove saleUnitRates controls
  public removeSaleUnitRates(i: number) {
    // remove address from the list
    const control = this.addStockForm.controls['saleUnitRates'] as FormArray;
    control.removeAt(i);
  }
  public ngAfterViewInit() {
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
      stockUniqueName: ['', [Validators.required]],
      stockUnitCode: ['', [Validators.required]],
      quantity: ['', [Validators.required]]
    });
  }

  public addItemInLinkedStocks() {
    const manufacturingDetailsContorl = this.addStockForm.controls['manufacturingDetails'] as FormGroup;
    const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;

    let obj = new IStockItemDetail();
    obj.stockUniqueName = this.addStockForm.value.linkedStockUniqueName;
    obj.stockUnitCode = this.addStockForm.value.linkedStockUnitCode;
    obj.quantity = this.addStockForm.value.linkedQuantity;

    let frmgrp = this.initialIManufacturingDetails();
    control.push(frmgrp);
    frmgrp.patchValue(obj);

    this.addStockForm.controls['linkedStockUniqueName'].reset();
    this.addStockForm.controls['linkedStockUnitCode'].reset();
    this.addStockForm.controls['linkedQuantity'].reset();
  }

  public editItemInLinkedStocks(item: FormGroup) {
    this.addStockForm.controls['linkedStockUniqueName'].setValue(item.value.stockUniqueName);
    this.addStockForm.controls['linkedStockUnitCode'].setValue(item.value.stockUnitCode);
    this.addStockForm.controls['linkedQuantity'].setValue(item.value.quantity);
  }

  public removeItemInLinkedStocks(i: number) {
    this.linkedStocks.splice(i, 1);
  }

  public resetLinkedStock() {
    // this.linkedStock = new IStockItemDetail();
  }
  // submit form
  public submit() {
    let stockObj = new CreateStockRequest();
    stockObj = this.addStockForm.value as CreateStockRequest;
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
