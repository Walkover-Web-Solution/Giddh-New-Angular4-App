import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { AfterViewInit, Component, OnDestroy, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { InventoryService } from '../../../services/inventory.service';
import { StockGroupRequest, StockGroupResponse } from '../../../models/api-models/Inventory';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { uniqueNameInvalidStringReplace } from '../../../shared/helpers/helperFunctions';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';

@Component({
  selector: 'inventory-add-group',  // <home></home>
  templateUrl: './inventory.addgroup.component.html'
})
export class InventoryAddGroupComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public addGroup: boolean;

  public sub: Subscription;
  public groupsData$: Observable<IOption[]>;
  public parentStockSearchString: string;
  public groupUniqueName: string;
  public addGroupForm: FormGroup;
  public selectedGroup: IOption;
  public fetchingGrpUniqueName$: Observable<boolean>;
  public isGroupNameAvailable$: Observable<boolean>;
  public activeGroup$: Observable<StockGroupResponse>;
  public createGroupSuccess$: Observable<boolean>;
  public isAddNewGroupInProcess$: Observable<boolean>;
  public isUpdateGroupInProcess$: Observable<boolean>;
  public isDeleteGroupInProcess$: Observable<boolean>;
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
    private _fb: FormBuilder, private _inventoryService: InventoryService, private inventoryActions: InventoryAction,
    private router: Router) {
    this.fetchingGrpUniqueName$ = this.store.select(state => state.inventory.fetchingGrpUniqueName).takeUntil(this.destroyed$);
    this.isGroupNameAvailable$ = this.store.select(state => state.inventory.isGroupNameAvailable).takeUntil(this.destroyed$);
    this.activeGroup$ = this.store.select(state => state.inventory.activeGroup).takeUntil(this.destroyed$);
    this.createGroupSuccess$ = this.store.select(state => state.inventory.createGroupSuccess).takeUntil(this.destroyed$);
    this.isAddNewGroupInProcess$ = this.store.select(state => state.inventory.isAddNewGroupInProcess).takeUntil(this.destroyed$);
    this.isUpdateGroupInProcess$ = this.store.select(state => state.inventory.isUpdateGroupInProcess).takeUntil(this.destroyed$);
    this.isDeleteGroupInProcess$ = this.store.select(state => state.inventory.isDeleteGroupInProcess).takeUntil(this.destroyed$);
    this.store.take(1).subscribe(state => {
      if (state.inventory.groupsWithStocks === null) {
        this.store.dispatch(this.sideBarAction.GetGroupsWithStocksHierarchyMin());
      }
    });
  }

  public ngOnInit() {
    // get all groups
    this.getParentGroupData();
    // subscribe to url
    this.sub = this.route.params.takeUntil(this.destroyed$).subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
    });

    // add group form
    this.addGroupForm = this._fb.group({
      name: ['', [Validators.required]],
      uniqueName: ['', [Validators.required]],
      parentStockGroupUniqueName: [{ value: '', disabled: true }, [Validators.required]],
      isSubGroup: [false]
    });

    // enable disable parentGroup select
    this.addGroupForm.controls['isSubGroup'].valueChanges.takeUntil(this.destroyed$).subscribe(s => {
      if (s) {
        this.addGroupForm.controls['parentStockGroupUniqueName'].enable();
      } else {
        this.addGroupForm.controls['parentStockGroupUniqueName'].reset();
        this.addGroupForm.controls['parentStockGroupUniqueName'].disable();
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
      if (a && !this.addGroup) {
        let updGroupObj = new StockGroupRequest();
        updGroupObj.name = a.name;
        updGroupObj.uniqueName = a.uniqueName;

        if (a.parentStockGroup) {
          this.selectedGroup = { label: a.parentStockGroup.name, value: a.parentStockGroup.uniqueName };
          updGroupObj.parentStockGroupUniqueName = a.parentStockGroup.uniqueName;
          this.parentStockSearchString = a.parentStockGroup.uniqueName;
          updGroupObj.isSubGroup = true;
        } else {
          updGroupObj.parentStockGroupUniqueName = '';
          this.parentStockSearchString = '';
          updGroupObj.isSubGroup = false;
        }
        this.addGroupForm.patchValue(updGroupObj);

        // if (!this.addGroup) {
        //   this.addGroupForm.patchValue(updGroupObj);
        // } else if (this.addGroup) {

        //   this.addGroupForm.patchValue({ name: '', uniqueName: '', isSubGroup: false });
        // }

      } else {
        this.addGroupForm.patchValue({ name: '', uniqueName: '', isSubGroup: false });
        this.parentStockSearchString = '';
      }
    });

    // reset add form and get all groups data
    this.createGroupSuccess$.subscribe(d => {
      if (d) {
        if (this.addGroup) {
          this.addGroupForm.reset();
          this.getParentGroupData();
        }
        // this.router.navigate(['/pages', 'inventory', 'add-group']);
      }
    });
  }

  public ngAfterViewInit() {
    this.activeGroup$.take(1).subscribe(a => {
      if (this.groupUniqueName && a && a.uniqueName === this.groupUniqueName) {
        //
      } else {
        if (this.groupUniqueName) {
          this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
        }
      }
    });
  }
  public getParentGroupData() {
    // parentgroup data
    this._inventoryService.GetGroupsWithStocksFlatten().takeUntil(this.destroyed$).subscribe(data => {
      if (data.status === 'success') {
        let flattenData: IOption[] = [];
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

  public ngOnDestroy() {
    // this.store.dispatch(this.inventoryActions.resetActiveGroup());
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  // group selected
  public groupSelected(event: IOption) {
    let selected;
    this.groupsData$.subscribe(p => {
      selected = p.find(q => q.value === event.value);
    });
    this.selectedGroup = selected;
    this.addGroupForm.updateValueAndValidity();
  }

  // if there's no matched result
  public onGroupResult() {
    this.addGroupForm.setErrors({ groupNameInvalid: true });
  }

  // generate uniquename
  public generateUniqueName() {
    let activeGrp = null;
    this.activeGroup$.take(1).subscribe(ag => activeGrp = ag);
    // if updating group don't generate uniqueName
    if (!this.addGroup) {
      return true;
    }
    let val: string = this.addGroupForm.controls['name'].value;
    val = uniqueNameInvalidStringReplace(val);

    // if val then check for uniqueName is available or not
    if (val) {
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
    } else {
      this.addGroupForm.patchValue({ uniqueName: '' });
    }
  }

  public addNewGroup() {
    let stockRequest = new StockGroupRequest();
    let uniqueNameField = this.addGroupForm.get('uniqueName');
    uniqueNameField.patchValue(uniqueNameField.value.replace(/ /g, '').toLowerCase());
    stockRequest = this.addGroupForm.value as StockGroupRequest;
    if (!this.addGroupForm.value.isSubGroup && this.selectedGroup) {
      stockRequest.parentStockGroupUniqueName = this.selectedGroup.value;
    }
    this.store.dispatch(this.inventoryActions.addNewGroup(stockRequest));
  }

  public updateGroup() {
    let stockRequest = new StockGroupRequest();
    let activeGroup: StockGroupResponse = null;
    let uniqueNameField = this.addGroupForm.get('uniqueName');

    this.activeGroup$.take(1).subscribe(a => activeGroup = a);
    uniqueNameField.patchValue(uniqueNameField.value.replace(/ /g, '').toLowerCase());

    stockRequest = this.addGroupForm.value as StockGroupRequest;
    if (this.addGroupForm.value.isSubGroup) {
      stockRequest.parentStockGroupUniqueName = this.selectedGroup.value;
    }
    this.store.dispatch(this.inventoryActions.updateGroup(stockRequest, activeGroup.uniqueName));
    this.store.select(p => p.inventory.isUpdateGroupInProcess).takeUntil(this.destroyed$).distinctUntilChanged().filter(p => !p).subscribe((a) => {
      this.activeGroup$.take(1).subscribe(b => activeGroup = b);
      this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/pages', 'inventory', 'add-group', activeGroup.uniqueName]);
      });
    });
  }

  public removeGroup() {
    let activeGroup: StockGroupResponse = null;
    this.activeGroup$.take(1).subscribe(a => activeGroup = a);
    this.store.dispatch(this.inventoryActions.removeGroup(activeGroup.uniqueName));
    this.addGroupForm.reset();
    this.router.navigateByUrl('/pages/inventory');
  }

  /**
   * validateUniqueName
   */
  public validateUniqueName(unqName) {
    if (unqName) {
      let val = uniqueNameInvalidStringReplace(unqName);
      this.addGroupForm.patchValue({ uniqueName: val });
    }
  }

}
