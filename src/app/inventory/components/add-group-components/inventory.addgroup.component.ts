import { AppState } from '../../../store/roots';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginActions } from '../services/actions/login.action';
import { Subscription } from 'rxjs/Rx';
import { ActivatedRoute } from '@angular/router';
import { SidebarAction } from '../../../services/actions/inventory/sidebar.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { InventoryService } from '../../../services/inventory.service';
import { StockGroupRequest } from '../../../models/api-models/Inventory';
import { InventoryAction } from '../../../services/actions/inventory/inventory.actions';
import { IGroupsWithStocksFlattenItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { uniqueNameValidator } from '../../../shared/helpers/customValidationHelper';

@Component({
  selector: 'inventory-add-group',  // <home></home>
  templateUrl: './inventory.addgroup.component.html'
})
export class InventoryAddGroupComponent implements OnInit, OnDestroy {
  public sub: Subscription;
  public parentStockSearchString: string;
  public groupUniqueName: string;
  public addGroupForm: FormGroup;
  public dataSource: Observable<any>;
  public selectedGroup: IGroupsWithStocksFlattenItem;
  public fetchingGrpUniqueName: Observable<boolean>;
  public isGroupNameAvailable$: Observable<boolean>;

  /**
   * TypeScript public modifiers
   */
  constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
              private  _fb: FormBuilder, private _inventoryService: InventoryService, private inventoryActions: InventoryAction) {
    this.fetchingGrpUniqueName = this.store.select(state => state.inventory.fetchingGrpUniqueName);
    this.isGroupNameAvailable$ = this.store.select(state => state.inventory.isGroupNameAvailable);
  }

  public ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.groupUniqueName = params['groupUniqueName'];
      if (this.groupUniqueName) {
        this.store.dispatch(this.sideBarAction.OpenGroup(this.groupUniqueName));
        this.store.dispatch(this.sideBarAction.GetInventoryGroup(this.groupUniqueName));
      }
    });
    this.addGroupForm = this._fb.group({
      name: ['', [Validators.required]],
      uniqueName: ['', [Validators.required], uniqueNameValidator],
      parentStockGroupUniqueName: [{value: '', disabled: true}, [Validators.required]],
      isSelfParent: [true]
    });

    this.dataSource = Observable
      .create((observer: any) => {
        this._inventoryService.GetGroupsWithStocksFlatten(this.parentStockSearchString).subscribe((res) => {
          observer.next(res.body.results);
        });
      });
    this.addGroupForm.controls['isSelfParent'].valueChanges.subscribe(s => {
      this.addGroupForm.controls['parentStockGroupUniqueName'].reset();
      if (s) {
        this.addGroupForm.controls['parentStockGroupUniqueName'].disable();
      } else {
        this.addGroupForm.controls['parentStockGroupUniqueName'].enable();
      }
    });

    this.fetchingGrpUniqueName.subscribe(f => {
      if (f) {
        this.addGroupForm.controls['uniqueName'].disable();
      } else {
        this.addGroupForm.controls['uniqueName'].enable();
      }
    });
  }

  public ngOnDestroy() {
    this.sub.unsubscribe();
  }

  public groupSelected(event: any) {
    this.selectedGroup = event.item;
  }

  public generateUniqueName() {
    let val: string = this.addGroupForm.controls['name'].value;
    val = val.replace(/\\ |,|\//g, '').toLocaleLowerCase();
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
}
