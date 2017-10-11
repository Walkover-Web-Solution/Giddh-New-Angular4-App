import { AppState } from '../../../../store/roots';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { InventoryService } from '../../../../services/inventory.service';
import { StockGroupRequest, StockGroupResponse } from '../../../../models/api-models/Inventory';
import { InventoryAction } from '../../../../services/actions/inventory/inventory.actions';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { uniqueNameInvalidStringReplace } from '../../../../shared/helpers/helperFunctions';
import { IOption } from '../../../../shared/theme/index';
import { SidebarAction } from '../../../../services/actions/inventory/sidebar.actions';
import { BaseResponse } from '../../../../models/api-models/BaseResponse';
import { ToasterService } from '../../../../services/toaster.service';
import { SalesActions } from '../../../../services/actions/sales/sales.action';

@Component({
  selector: 'sales-add-group-modal',
  templateUrl: './create.stock.group.modal.html'
})
export class SalesAddStockGroupComponent implements OnInit, OnDestroy {

  @Output() public actionFired: EventEmitter<any> = new EventEmitter();

  // public
  public isAddStockGroupInProcess: boolean = false;
  public addStockGroupForm: FormGroup;
  public stockGroups$: Observable<IOption[]> = Observable.of([]);
  public isGroupNameAvailable$: Observable<boolean>;

  // private
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _store: Store<AppState>,
    private _fb: FormBuilder,
    private _inventoryService: InventoryService,
    private _inventoryActions: InventoryAction,
    private _sideBarAction: SidebarAction,
    private _toasty: ToasterService,
    private _salesActions: SalesActions
  ) {
    this.isGroupNameAvailable$ = this._store.select(state => state.inventory.isGroupNameAvailable).takeUntil(this.destroyed$);
  }

  public ngOnInit() {

    this.getStockGroups();

    // init stock group form
    this.addStockGroupForm = this._fb.group({
      name: [null, [Validators.required]],
      uniqueName: [null, [Validators.required]],
      parentStockGroupUniqueName: [{ value: null, disabled: true }, [Validators.required]],
      isSelfParent: [true]
    });

    // enable disable parentGroup select
    this.addStockGroupForm.controls['isSelfParent'].valueChanges.takeUntil(this.destroyed$).subscribe(s => {
      if (s) {
        this.addStockGroupForm.controls['parentStockGroupUniqueName'].reset();
        this.addStockGroupForm.controls['parentStockGroupUniqueName'].disable();
      } else {
        this.addStockGroupForm.controls['parentStockGroupUniqueName'].enable();
        this.addStockGroupForm.setErrors({ groupNameInvalid: true });
      }
    });

    // get groups list and assign values
    this._store.select(state => state.sales.hierarchicalStockGroups).takeUntil(this.destroyed$).subscribe((o) => {
      if (o) {
        this.stockGroups$ = Observable.of(o);
      }
    });

  }

  // generate uniquename
  public generateUniqueName() {
    let val: string = this.addStockGroupForm.controls['name'].value;
    val = uniqueNameInvalidStringReplace(val);
    this._store.dispatch(this._sideBarAction.GetGroupUniqueName(val));
    this.isGroupNameAvailable$.subscribe(a => {
      if (a !== null && a !== undefined) {
        if (a) {
          this.addStockGroupForm.patchValue({ uniqueName: val });
        } else {
          this.addStockGroupForm.patchValue({ uniqueName: val + 1 });
        }
      } else {
        this.addStockGroupForm.patchValue({ uniqueName: val + 1 });
      }
    });
  }

  // get all stock groups and flatten it and use in dom
  public getStockGroups() {
    this._store.dispatch(this._salesActions.getGroupsListForSales());
  }

  public addStockGroupFormSubmit() {
    this.isAddStockGroupInProcess = true;
    let formObj: StockGroupRequest = this.addStockGroupForm.value;
    console.log ('finally', formObj);
    this._inventoryService.CreateStockGroup(formObj).takeUntil(this.destroyed$).subscribe((res) => {
      let data: BaseResponse<StockGroupResponse, StockGroupRequest> = res;
      if (data.status === 'success') {
        this._toasty.successToast('Stock group Created Successfully');
        this.getStockGroups();
        this.addStockGroupFormReset();
        this.closeCreateGroupModal();
      } else {
        this._toasty.errorToast(data.message, data.code);
      }
      this.isAddStockGroupInProcess = false;
    });
  }

  public addStockGroupFormReset() {
    this.addStockGroupForm.reset();
  }

  public closeCreateGroupModal() {
    this.actionFired.emit({action: 'close'});
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
