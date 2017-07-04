import { AppState } from '../../../store/roots';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { Subscription, Subject } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { InventoryService } from '../../../services/inventory.service';
import { StockGroupRequest, StockGroupResponse } from '../../../models/api-models/Inventory';
import { InventoryAction } from '../../../services/actions/inventory/inventory.actions';
import { IGroupsWithStocksFlattenItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { uniqueNameValidator } from '../../../shared/helpers/customValidationHelper';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Component({
  selector: 'inventory-add-group',  // <home></home>
  templateUrl: './inventory.addgroup.component.html'
})
export class InventoryAddGroupComponent implements OnInit, OnDestroy {
  public sub: Subscription;
  public parentStockSearchString: string;
  public groupUniqueName: string;
  public addGroupForm: FormGroup;
  public dataSource: Subject<any> = new Subject<any>();
  public selectedGroup: IGroupsWithStocksFlattenItem;
  public fetchingGrpUniqueName$: Observable<boolean>;
  public isGroupNameAvailable$: Observable<boolean>;
  public activeGroup$: Observable<StockGroupResponse>;
  public isUpdateGroupInProcess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    private _fb: FormBuilder, private _inventoryService: InventoryService, private inventoryActions: InventoryAction,
    private router: Router) {
    this.fetchingGrpUniqueName$ = this.store.select(state => state.inventory.fetchingGrpUniqueName);
    this.isGroupNameAvailable$ = this.store.select(state => state.inventory.isGroupNameAvailable);
    this.activeGroup$ = this.store.select(state => state.inventory.activeGroup);
    this.isUpdateGroupInProcess$ = this.store.select(state => state.inventory.isUpdateGroupInProcess);

    this.store.take(1).subscribe(state => {
      if (state.inventory.groupsWithStocks === null) {
        this.store.dispatch(this.sideBarAction.GetGroupsWithStocksHierarchyMin());
      }
    });
  }

  public ngOnInit() {
    // subscribe to url
    this.sub = this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      let activeGroup = null;
      this.activeGroup$.take(1).subscribe(a => {
        if (this.groupUniqueName && a && a.uniqueName === this.groupUniqueName) {
          //
        } else {
          debugger;
          this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
        }
      });
    });

    // add group form
    this.addGroupForm = this._fb.group({
      name: ['', [Validators.required]],
      uniqueName: ['', [Validators.required], uniqueNameValidator],
      parentStockGroupUniqueName: [{ value: '', disabled: true }, [Validators.required]],
      isSelfParent: [true]
    });

    // source for parentgroup selection
    this.addGroupForm.controls['parentStockGroupUniqueName'].valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap((value: string) => {
        return this._inventoryService.GetGroupsWithStocksFlatten(value);
      })
      .takeUntil(this.destroyed$)
      .subscribe(data => {
        this.dataSource.next(data.body.results);
      });

    // enable disable parentGroup select
    this.addGroupForm.controls['isSelfParent'].valueChanges.takeUntil(this.destroyed$).subscribe(s => {
      if (s) {
        this.addGroupForm.controls['parentStockGroupUniqueName'].reset();
        this.addGroupForm.controls['parentStockGroupUniqueName'].disable();
      } else {
        this.addGroupForm.controls['parentStockGroupUniqueName'].enable();
        this.addGroupForm.setErrors({ groupNameInvalid: true });
      }
    });

    // fetching uniquename boolean
    this.fetchingGrpUniqueName$.takeUntil(this.destroyed$).subscribe(f => {
      if (f) {
        this.addGroupForm.controls['uniqueName'].disable();
      } else {
        this.addGroupForm.controls['uniqueName'].enable();
      }
    });

    // check if active group is available if then fill form else reset form
    this.activeGroup$.takeUntil(this.destroyed$).subscribe(a => {
      if (a) {
        let updGroupObj = new StockGroupRequest();
        updGroupObj.name = a.name;
        updGroupObj.uniqueName = a.uniqueName;

        if (a.parentStockGroup) {
          this.selectedGroup = { name: a.parentStockGroup.name, uniqueName: a.parentStockGroup.uniqueName };
          updGroupObj.parentStockGroupUniqueName = a.parentStockGroup.name;
          this.parentStockSearchString = a.parentStockGroup.name;
          updGroupObj.isSelfParent = false;
        } else {
          updGroupObj.parentStockGroupUniqueName = '';
          this.parentStockSearchString = '';
          updGroupObj.isSelfParent = true;
        }
        this.addGroupForm.patchValue(updGroupObj);
      } else {
        this.addGroupForm.reset();
      }
    });
  }

  public ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  // group selected
  public groupSelected(event: any) {
    this.selectedGroup = event.item;
    this.addGroupForm.updateValueAndValidity();
  }

  // if there's no matched result
  public onGroupResult() {
    this.addGroupForm.setErrors({ groupNameInvalid: true });
  }

  // generate uniquename
  public generateUniqueName() {
    let val: string = this.addGroupForm.controls['name'].value;
    val = val.replace(/[^a-zA-Z0-9]/g, '').toLocaleLowerCase();
    this.store.dispatch(this.sideBarAction.GetGroupUniqueName(val));

    this.isGroupNameAvailable$.subscribe(a => {
      if (a !== null && a !== undefined) {
        if (a) {
          this.addGroupForm.patchValue({ uniqueName: val });
        } else {
          let num = 1;
          this.addGroupForm.patchValue({ uniqueName: val + num });
        }
      }
    });
  }

  public addNewGroup() {
    let stockRequest = new StockGroupRequest();
    stockRequest = this.addGroupForm.value as StockGroupRequest;
    if (!this.addGroupForm.value.isSelfParent) {
      stockRequest.parentStockGroupUniqueName = this.selectedGroup.uniqueName;
    }
    this.store.dispatch(this.inventoryActions.addNewGroup(stockRequest));
    this.addGroupForm.reset();
  }

  public updateGroup() {
    let stockRequest = new StockGroupRequest();
    let activeGroup: StockGroupResponse = null;
    this.activeGroup$.take(1).subscribe(a => activeGroup = a);
    stockRequest = this.addGroupForm.value as StockGroupRequest;
    if (!this.addGroupForm.value.isSelfParent) {
      stockRequest.parentStockGroupUniqueName = this.selectedGroup.uniqueName;
    }
    // this.router.navigate(['/pages', 'inventory', 'add-group', 'soda123']);
  }

  public removeGroup() {
    let activeGroup: StockGroupResponse = null;
    this.activeGroup$.take(1).subscribe(a => activeGroup = a);
    this.store.dispatch(this.inventoryActions.removeGroup(activeGroup.uniqueName));
    this.addGroupForm.reset();
    this.router.navigateByUrl('/pages/inventory/add-group');
  }
}
