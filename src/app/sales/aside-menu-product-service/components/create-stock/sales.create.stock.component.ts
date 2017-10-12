import * as  _ from 'lodash';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  decimalDigits,
  digitsOnly,
  stockManufacturingDetailsValidator
} from '../../../../shared/helpers/customValidationHelper';
import { CreateStockRequest, StockDetailResponse, StockGroupResponse, StockUnitResponse } from '../../../../models/api-models/Inventory';
import { Select2OptionData } from '../../../../shared/theme/select2/select2.interface';
import { InventoryAction } from '../../../../services/actions/inventory/inventory.actions';
import { AccountService } from '../../../../services/account.service';
import { CustomStockUnitAction } from '../../../../services/actions/inventory/customStockUnit.actions';
import { IStockItemDetail, IUnitRateItem } from '../../../../models/interfaces/stocksItem.interface';
import { uniqueNameInvalidStringReplace } from '../../../../shared/helpers/helperFunctions';
import { InventoryService } from '../../../../services/inventory.service';
import { IGroupsWithStocksHierarchyMinItem } from '../../../../models/interfaces/groupsWithStocks.interface';
import { IOption } from '../../../../shared/theme/index';
import { BaseResponse } from '../../../../models/api-models/BaseResponse';
import { ToasterService } from '../../../../services/toaster.service';
import { SalesActions } from '../../../../services/actions/sales/sales.action';

@Component({
  selector: 'sales-create-stock',
  styleUrls: ['./sales.create.stock.component.scss'],
  templateUrl: './sales.create.stock.component.html'
})

export class SalesAddStockComponent implements OnInit, OnDestroy {

  @Output() public closeAsideEvent: EventEmitter<boolean> = new EventEmitter(true);
  @Output() public animateAside: EventEmitter<any> = new EventEmitter();

  // public
  public selectedGroupUniqueName: string;
  public selectedGroup: IOption;
  public stockGroups$: Observable<IOption[]> = Observable.of([]);
  public addStockForm: FormGroup;
  public stockUnitsDropDown$: Observable<IOption[]>;
  public purchaseAccountsDropDown$: Observable<IOption[]>;
  public salesAccountsDropDown$: Observable<IOption[]>;
  public isStockNameAvailable$: Observable<boolean>;
  public stockCreationInProcess: boolean = false;

  // private
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private store: Store<AppState>,
    private _fb: FormBuilder,
    private inventoryAction: InventoryAction,
    private _accountService: AccountService,
    private _inventoryService: InventoryService,
    private customStockActions: CustomStockUnitAction,
    private ref: ChangeDetectorRef,
    private toasty: ToasterService,
    private _salesActions: SalesActions
  ) {
    // get all stock groups
    this.getStockGroups();

    // get all ac
    this.store.dispatch(this._salesActions.getFlattenAcOfSales({groupUniqueNames: ['sales']}));
    this.store.dispatch(this._salesActions.getFlattenAcOfPurchase({groupUniqueNames: ['purchases']}));

    // get all stock units
    this._inventoryService.GetStockUnit().takeUntil(this.destroyed$).subscribe((data) => {
      if (data.status === 'success') {
        let arr: IOption[] = [];
        data.body.map( (d: StockUnitResponse) => {
          arr.push({ label: d.name, value: d.code });
        });
        this.stockUnitsDropDown$ = Observable.of(arr);
      }
    });

    this.isStockNameAvailable$ = this.store.select(state => state.inventory.isStockNameAvailable).takeUntil(this.destroyed$);
  }

  public ngOnInit() {

    // add stock form
    this.addStockForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      uniqueName: ['', [Validators.required, Validators.minLength(2)]],
      stockUnitCode: [null, [Validators.required]],
      openingQuantity: ['', decimalDigits],
      stockRate: [{ value: '', disabled: true }],
      openingAmount: [''],
      purchaseAccountUniqueName: [''],
      salesAccountUniqueName: [''],
      purchaseUnitRates: this._fb.array([
        this.initUnitAndRates()
      ]),
      salesUnitRates: this._fb.array([
        this.initUnitAndRates()
      ])
    });

    // get groups list and assign values
    this.store.select(state => state.sales.hierarchicalStockGroups).takeUntil(this.destroyed$).subscribe((o) => {
      if (o) {
        this.stockGroups$ = Observable.of(o);
      }
    });

    this.purchaseAccountsDropDown$ = this.store.select(state => state.sales.purchaseAcList).takeUntil(this.destroyed$);
    this.salesAccountsDropDown$ = this.store.select(state => state.sales.salesAcList).takeUntil(this.destroyed$);

  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  // initial unitandRates controls
  public initUnitAndRates() {
    // initialize our controls
    return this._fb.group({
      rate: [ null, digitsOnly],
      stockUnitCode: [null]
    });
  }

  // add unit controls
  public addUnitRow(type: string, item: any) {
    const control = this.addStockForm.controls[type] as FormArray;
    if ( item.controls.rate.touched && item.controls.rate.value && item.controls.stockUnitCode.touched &&  item.controls.stockUnitCode.value ) {
      control.push(this.initUnitAndRates());
    } else {
      this.toasty.warningToast('Before add new Fill all the fields');
    }
  }

  // remove unit controls
  public removeUnitRow(i: number, type: string) {
    const control = this.addStockForm.controls[type] as FormArray;
    if (control.length > 1) {
      control.removeAt(i);
    } else {
      control.controls[0].reset();
    }
  }

  // generate uniquename
  public generateUniqueName() {
    let val: string = this.addStockForm.controls['name'].value;
    val = uniqueNameInvalidStringReplace(val);
    if (_.isEmpty(this.selectedGroupUniqueName || val)) {
      return;
    }else {
      this.store.dispatch(this.inventoryAction.GetStockUniqueName(this.selectedGroupUniqueName, val));
      this.isStockNameAvailable$.subscribe(a => {
        if (a) {
          this.addStockForm.patchValue({ uniqueName: val });
        } else {
          let num = 1;
          this.addStockForm.patchValue({ uniqueName: val + num });
        }
      });
    }
  }

  // calculate rate
  public calculateRate() {
    let quantity = this.addStockForm.value.openingQuantity;
    let amount = this.addStockForm.value.openingAmount;

    if (quantity && amount) {
      this.addStockForm.patchValue({ stockRate: (amount / quantity).toFixed(4) });
    } else if (quantity === 0 || amount === 0) {
      this.addStockForm.controls['stockRate'].reset();
    }
  }

  // submit form
  public addStockFormSubmit() {
    this.stockCreationInProcess = true;
    let formObj = this.addStockForm.value;
    let stockObj = new CreateStockRequest();
    // remove empty values from array
    formObj.purchaseUnitRates = formObj.purchaseUnitRates.filter((pr) => {
      return pr.stockUnitCode && pr.rate;
    });
    formObj.salesUnitRates = formObj.salesUnitRates.filter((pr) => {
      return pr.stockUnitCode && pr.rate;
    });

    stockObj = _.cloneDeep(formObj);
    stockObj = _.omit( stockObj, ['salesAccountUniqueName', 'purchaseAccountUniqueName', 'salesUnitRates', 'purchaseUnitRates']);

    // set sales and purchase obj
    stockObj.salesAccountDetails = {
      accountUniqueName: formObj.salesAccountUniqueName,
      unitRates: formObj.salesUnitRates
    };
    stockObj.purchaseAccountDetails = {
      accountUniqueName: formObj.purchaseAccountUniqueName,
      unitRates: formObj.purchaseUnitRates
    };
    stockObj.manufacturingDetails = null;
    stockObj.isFsStock =  false;
    this._inventoryService.CreateStock(stockObj, encodeURIComponent(this.selectedGroupUniqueName)).takeUntil(this.destroyed$).subscribe((res) => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = res;
      if (data.status === 'success') {
        // show message
        this.toasty.successToast('Stock created successfully!');
        // form reset, call for get product
        this.addStockForm.reset();
        this.closeAsidePane();
      }else {
        this.toasty.errorToast('Something went wrong, Please reload page');
      }
      this.stockCreationInProcess = false;
    });
  }

  // reset stock form
  public resetStockForm() {
    this.addStockForm.reset();
  }

  // close pane
  public closeAsidePane() {
    this.closeAsideEvent.emit();
  }

  /**
   * Accounts related funcs
   */
  public onNoResultsOfAc(val: string) {
    this.animateAside.emit({type: val});
  }

  /**
   * groups related funcs
   */

  // get all stock groups and flatten it and use in dom
  public getStockGroups() {
    this.store.dispatch(this._salesActions.getGroupsListForSales());
  }

  public onNoResultsOfGroup() {
    let obj: any = {};
    obj.type = 'groupModal';
    this.animateAside.emit(obj);
  }

}
