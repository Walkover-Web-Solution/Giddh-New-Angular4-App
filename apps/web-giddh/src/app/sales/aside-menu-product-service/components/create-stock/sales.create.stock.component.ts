import { Observable, of as observableOf, ReplaySubject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
import * as  _ from '../../../../lodash-optimized';
import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { decimalDigits, digitsOnly } from '../../../../shared/helpers/customValidationHelper';
import { CreateStockRequest, INameUniqueName, StockDetailResponse, StockUnitResponse } from '../../../../models/api-models/Inventory';
import { InventoryAction } from '../../../../actions/inventory/inventory.actions';
import { AccountService } from '../../../../services/account.service';
import { CustomStockUnitAction } from '../../../../actions/inventory/customStockUnit.actions';
import { giddhRoundOff, uniqueNameInvalidStringReplace } from '../../../../shared/helpers/helperFunctions';
import { InventoryService } from '../../../../services/inventory.service';
import { BaseResponse } from '../../../../models/api-models/BaseResponse';
import { ToasterService } from '../../../../services/toaster.service';
import { SalesActions } from '../../../../actions/sales/sales.action';
import { IOption } from '../../../../theme/ng-select/option.interface';

@Component({
  selector: 'sales-create-stock',
  styleUrls: ['./sales.create.stock.component.scss'],
  templateUrl: './sales.create.stock.component.html'
})

export class SalesAddStockComponent implements OnInit, OnDestroy {

  @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();
  @Output() public animateAside: EventEmitter<any> = new EventEmitter();

  // public
  public selectedGroupUniqueName: string = 'maingroup';
  public selectedGroup: IOption;
  public stockGroups$: Observable<IOption[]> = observableOf([]);
  public addStockForm: FormGroup;
  public stockUnitsDropDown$: Observable<IOption[]>;
  public purchaseAccountsDropDown$: Observable<IOption[]>;
  public salesAccountsDropDown$: Observable<IOption[]>;
  public isStockNameAvailable$: Observable<boolean>;
  public stockCreationInProcess: boolean = false;
  public newlyGroupCreated$: Observable<INameUniqueName>;
  public newlyCreatedAc$: Observable<INameUniqueName>;
  public modalType: string;

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
    this.store.dispatch(this._salesActions.getGroupsListForSales());
    // get all ac
    this.store.dispatch(this._salesActions.getFlattenAcOfSales({groupUniqueNames: ['sales']}));
    this.store.dispatch(this._salesActions.getFlattenAcOfPurchase({groupUniqueNames: ['purchases']}));

    // get all stock units
    this._inventoryService.GetStockUnit().pipe(takeUntil(this.destroyed$)).subscribe((data) => {
      if (data.status === 'success') {
        let arr: IOption[] = [];
        data.body.map((d: StockUnitResponse) => {
          arr.push({label: d.name, value: d.code});
        });
        this.stockUnitsDropDown$ = observableOf(arr);
      }
    });

    this.isStockNameAvailable$ = this.store.select(state => state.inventory.isStockNameAvailable).pipe(takeUntil(this.destroyed$));
    this.newlyGroupCreated$ = this.store.select(state => state.sales.newlyCreatedGroup).pipe(takeUntil(this.destroyed$));
    this.newlyCreatedAc$ = this.store.select(state => state.groupwithaccounts.newlyCreatedAccount).pipe(takeUntil(this.destroyed$));
  }

  public ngOnInit() {
    this.getStockGroups();  // get all stock gropus
    // add stock form

    this.addStockForm = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      uniqueName: ['', [Validators.required, Validators.minLength(2)]],
      stockUnitCode: [null, [Validators.required]],
      openingQuantity: ['', decimalDigits],
      stockRate: [{value: '', disabled: true}],
      openingAmount: [''],
      purchaseAccountUniqueName: [''],
      salesAccountUniqueName: [''],
      purchaseUnitRates: this._fb.array([
        this.initUnitAndRates()
      ]),
      salesUnitRates: this._fb.array([
        this.initUnitAndRates()
      ]),
      manufacturingDetails: null,
      hsnNumber: [''],
      isFsStock: false
    });

    // get groups list and assign values
    this.store.select(state => state.sales.hierarchicalStockGroups).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
      if (o) {
        this.stockGroups$ = observableOf(o);
        if (o.length > 0) {
          this.selectedGroupUniqueName = o[0].value;
        }
      }
    });
    this.purchaseAccountsDropDown$ = this.store.select(state => state.sales.purchaseAcList).pipe(takeUntil(this.destroyed$));
    this.salesAccountsDropDown$ = this.store.select(state => state.sales.salesAcList).pipe(takeUntil(this.destroyed$));

    // listen for newly created group
    this.newlyGroupCreated$.pipe(takeUntil(this.destroyed$)).subscribe((o: INameUniqueName) => {
      if (o) {
        this.selectedGroupUniqueName = o.uniqueName;
      }
    });

    // listen for new add account utils
    this.newlyCreatedAc$.pipe(takeUntil(this.destroyed$)).subscribe((o: INameUniqueName) => {
      if (o) {
        if (this.modalType === 'Purchase') {
          this.addStockForm.patchValue({purchaseAccountUniqueName: o.uniqueName});
        } else if (this.modalType === 'Sales') {
          this.addStockForm.patchValue({salesAccountUniqueName: o.uniqueName});
        }
      }
    });

  }

  public ngOnDestroy() {
    this.addStockForm.reset();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  // initial unitandRates controls
  public initUnitAndRates() {
    // initialize our controls
    return this._fb.group({
      rate: [null, digitsOnly],
      stockUnitCode: [null]
    });
  }

  // add unit controls
  public addUnitRow(type: string, item: any) {
    const control = this.addStockForm.controls[type] as FormArray;
    if (item.controls.rate.touched && item.controls.rate.value && item.controls.stockUnitCode.touched && item.controls.stockUnitCode.value) {
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
      this.addStockForm.patchValue({uniqueName: null});
      return;
    } else {
      this.store.dispatch(this.inventoryAction.GetStockUniqueName(this.selectedGroupUniqueName, val));
      this.isStockNameAvailable$.subscribe(a => {
        if (a) {
          this.addStockForm.patchValue({uniqueName: val});
        } else {
          let num = 1;
          this.addStockForm.patchValue({uniqueName: val + num});
        }
      });
    }
  }

  // calculate rate
  public calculateRate() {
    let quantity = this.addStockForm.value.openingQuantity;
    let amount = this.addStockForm.value.openingAmount;

    if (quantity && amount) {
      this.addStockForm.patchValue({stockRate: giddhRoundOff((amount / quantity), 2)});
    } else if (quantity === 0 || amount === 0) {
      this.addStockForm.controls['stockRate'].reset();
    }
  }

  // submit form
  public addStockFormSubmit() {

    this.store.select(state => state.sales.hierarchicalStockGroups).pipe(takeUntil(this.destroyed$)).subscribe((o) => {
      if (o && !o.length) {
        let stockRequest = {
          name: 'Main Group',
          uniqueName: 'maingroup'
        };
        this.selectedGroupUniqueName = 'maingroup';
        this._inventoryService.CreateStockGroup(stockRequest).subscribe((op) => {
          this.store.dispatch(this.inventoryAction.addNewGroupResponse(op));
          if (op.status === 'success') {
            this.addStockProcess();

          }
        });
      } else {
        this.addStockProcess();
      }
    });


  }

  public addStockProcess() {
    this.stockCreationInProcess = true;
    let formObj = this.addStockForm.value;
    formObj.manufacturingDetails = null;
    formObj.isFsStock = false;
    let stockObj = new CreateStockRequest();
    // remove empty values from array
    formObj.purchaseUnitRates = formObj.purchaseUnitRates.filter((pr) => {
      return pr.stockUnitCode && pr.rate;
    });
    formObj.salesUnitRates = formObj.salesUnitRates.filter((pr) => {
      return pr.stockUnitCode && pr.rate;
    });

    stockObj = _.cloneDeep(formObj);
    // stockObj = _.omit( stockObj, ['salesAccountUniqueName', 'purchaseAccountUniqueName', 'salesUnitRates', 'purchaseUnitRates']);

    // set sales and purchase obj
    stockObj.salesAccountDetails = {
      accountUniqueName: formObj.salesAccountUniqueName,
      unitRates: formObj.salesUnitRates
    };
    stockObj.purchaseAccountDetails = {
      accountUniqueName: formObj.purchaseAccountUniqueName,
      unitRates: formObj.purchaseUnitRates
    };

    this._inventoryService.CreateStock(stockObj, encodeURIComponent(this.selectedGroupUniqueName)).pipe(takeUntil(this.destroyed$)).subscribe((res) => {
      let data: BaseResponse<StockDetailResponse, CreateStockRequest> = res;
      let item = data.body;
      if (data.status === 'success') {
        // show message
        this.toasty.successToast('Stock created successfully!');
        // form reset, call for get product
        this.addStockForm.reset();
        this.closeAsidePane();
        // announce other modules if sales ac is linked
        if (item.salesAccountDetails && item.salesAccountDetails.accountUniqueName) {
          this.store.dispatch(this._salesActions.createStockAcSuccess({linkedAc: item.salesAccountDetails.accountUniqueName, name: item.name, uniqueName: item.uniqueName}));
        } else if (item.purchaseAccountDetails && item.purchaseAccountDetails.accountUniqueName) {
          this.store.dispatch(this._salesActions.createStockAcSuccess({linkedAc: item.salesAccountDetails.accountUniqueName, name: item.name, uniqueName: item.uniqueName}));
        }
      } else {
        this.toasty.errorToast(data.message, data.code);
      }
      this.stockCreationInProcess = false;
    });
  }

  // reset stock form
  public resetStockForm() {
    this.addStockForm.reset();
    this.closeAsideEvent.emit({action: 'first'});
  }

  // close pane
  public closeAsidePane() {
    this.closeAsideEvent.emit();
  }

  /**
   * Accounts related funcs
   */
  public onNoResultsOfAc(val: string) {
    this.modalType = val;
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
