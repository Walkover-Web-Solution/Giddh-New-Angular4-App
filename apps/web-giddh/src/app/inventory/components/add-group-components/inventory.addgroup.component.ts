import { Observable, of as observableOf, ReplaySubject, Subscription } from 'rxjs';

import { distinctUntilChanged, filter, take, takeUntil } from 'rxjs/operators';
import { AppState } from '../../../store';
import { Store } from '@ngrx/store';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { StockGroupRequest, StockGroupResponse } from '../../../models/api-models/Inventory';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { IGroupsWithStocksHierarchyMinItem } from '../../../models/interfaces/groupsWithStocks.interface';
import { uniqueNameInvalidStringReplace } from '../../../shared/helpers/helperFunctions';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { IForceClear } from '../../../models/api-models/Sales';
import * as _ from 'lodash';

@Component({
    selector: 'inventory-add-group',  // <home></home>
    templateUrl: './inventory.addgroup.component.html',
    styleUrls: [`./inventory.addgroup.component.scss`],
})
export class InventoryAddGroupComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input() public addGroup: boolean;
    @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();

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
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public defaultGrpActive: boolean = false;
    public manageInProcess$: Observable<any>;
    public canDeleteGroup: boolean = false;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * TypeScript public modifiers
     */
    constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
        private _fb: FormBuilder, private _inventoryService: InventoryService, private inventoryActions: InventoryAction,
        private router: Router) {
        this.fetchingGrpUniqueName$ = this.store.select(state => state.inventory.fetchingGrpUniqueName).pipe(takeUntil(this.destroyed$));
        this.isGroupNameAvailable$ = this.store.select(state => state.inventory.isGroupNameAvailable).pipe(takeUntil(this.destroyed$));
        this.activeGroup$ = this.store.select(state => state.inventory.activeGroup).pipe(takeUntil(this.destroyed$));
        this.createGroupSuccess$ = this.store.select(state => state.inventory.createGroupSuccess).pipe(takeUntil(this.destroyed$));
        this.isAddNewGroupInProcess$ = this.store.select(state => state.inventory.isAddNewGroupInProcess).pipe(takeUntil(this.destroyed$));
        this.isUpdateGroupInProcess$ = this.store.select(state => state.inventory.isUpdateGroupInProcess).pipe(takeUntil(this.destroyed$));
        this.isDeleteGroupInProcess$ = this.store.select(state => state.inventory.isDeleteGroupInProcess).pipe(takeUntil(this.destroyed$));
        this.manageInProcess$ = this.store.select(s => s.inventory.inventoryAsideState).pipe(takeUntil(this.destroyed$));
        this.store.pipe(take(1)).subscribe(state => {
            if (state.inventory.groupsWithStocks === null) {
                this.store.dispatch(this.sideBarAction.GetGroupsWithStocksHierarchyMin());
            }
        });
    }

    public ngOnInit() {
        // get all groups
        this.getParentGroupData();
        // subscribe to url
        this.sub = this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            this.groupUniqueName = params['groupUniqueName'];
        });

        // add group form
        this.addGroupForm = this._fb.group({
            name: ['', [Validators.required]],
            uniqueName: ['', [Validators.required]],
            hsnNumber: [''],
            sacNumber: [''],
            parentStockGroupUniqueName: [{ value: '', disabled: true }, [Validators.required]],
            isSubGroup: [false]
        });

        // enable disable parentGroup select
        this.addGroupForm.controls['isSubGroup'].valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(s => {
            if (s) {
                this.addGroupForm.controls['parentStockGroupUniqueName'].enable();
            } else {
                this.addGroupForm.controls['parentStockGroupUniqueName'].reset();
                this.addGroupForm.controls['parentStockGroupUniqueName'].disable();
                this.addGroupForm.setErrors({ groupNameInvalid: true });
                this.forceClear$ = observableOf({ status: true });
            }
        });

        // fetching uniquename boolean
        this.fetchingGrpUniqueName$.pipe(takeUntil(this.destroyed$)).subscribe(f => {
            if (f) {
                this.addGroupForm.controls['uniqueName'].disable();
            } else {
                this.addGroupForm.controls['uniqueName'].enable();
            }
        });

        // check if active group is available if then fill form else reset form
        this.activeGroup$.pipe(takeUntil(this.destroyed$)).subscribe(account => {
            if (account && !this.addGroup) {
                let updGroupObj = new StockGroupRequest();
                updGroupObj.name = account.name;
                updGroupObj.uniqueName = account.uniqueName;
                updGroupObj.hsnNumber = account.hsnNumber;
                updGroupObj.sacNumber = account.sacNumber;
                if (updGroupObj.uniqueName === 'maingroup') {
                    this.addGroupForm.controls['uniqueName'].disable();
                    this.defaultGrpActive = true;
                } else {
                    this.addGroupForm.controls['uniqueName'].enable();
                    this.defaultGrpActive = false;
                }

                if (account.parentStockGroup) {
                    this.selectedGroup = { label: account.parentStockGroup.name, value: account.parentStockGroup.uniqueName };
                    // updGroupObj.parentStockGroupUniqueName = this.selectedGroup.value;
                    this.parentStockSearchString = account.parentStockGroup.uniqueName;
                    updGroupObj.isSubGroup = true;
                } else {
                    updGroupObj.parentStockGroupUniqueName = '';
                    this.parentStockSearchString = '';
                    updGroupObj.isSubGroup = false;
                    this.forceClear$ = observableOf({ status: true });
                }
                this.addGroupForm.patchValue(updGroupObj);
                if (account.parentStockGroup) {
                    this.addGroupForm.patchValue({ parentStockGroupUniqueName: account.parentStockGroup.uniqueName });
                }

            } else {
                if (account) {
                    this.addGroupForm.patchValue({ isSubGroup: true, parentStockGroupUniqueName: account.uniqueName });
                } else {
                    this.addGroupForm.patchValue({ name: '', uniqueName: '', hsnNumber: '', sacNumber: '', isSubGroup: false });
                }
                this.parentStockSearchString = '';
            }
            if (account && account.stocks.length > 0) {
                this.canDeleteGroup = false;
            } else {
                this.canDeleteGroup = true;
            }
        });

        // reset add form and get all groups data
        this.createGroupSuccess$.subscribe(d => {
            if (d) {
                if (this.addGroup) {
                    this.addGroupForm.reset();
                }
                this.getParentGroupData();
                // this.router.navigate(['/pages', 'inventory', 'add-group']);
            }
        });

        this.manageInProcess$.subscribe(s => {
            if (!s.isOpen) {
                this.addGroupForm.reset();
            }
        });
    }

    public ngAfterViewInit() {
        this.activeGroup$.pipe(take(1)).subscribe(a => {
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
        this._inventoryService.GetGroupsWithStocksFlatten().pipe(takeUntil(this.destroyed$)).subscribe(data => {
            if (data.status === 'success') {
                let flattenData: IOption[] = [];
                this.flattenDATA(data.body.results, flattenData);
                this.groupsData$ = observableOf(flattenData);
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
        this.activeGroup$.pipe(take(1)).subscribe(ag => activeGrp = ag);
        // if updating group don't generate uniqueName
        if (!this.addGroup) {
            return;
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
        if (this.addGroupForm.value.isSubGroup && this.selectedGroup) {
            stockRequest.parentStockGroupUniqueName = this.selectedGroup.value;
        }
        if (!stockRequest.isSubGroup) {
            stockRequest.isSubGroup = false;
        }
        if (_.isObject(stockRequest.parentStockGroupUniqueName)) {
            let uniqName: any = _.cloneDeep(stockRequest.parentStockGroupUniqueName);
            stockRequest.parentStockGroupUniqueName = uniqName.value;
        }
        this.store.dispatch(this.inventoryActions.addNewGroup(stockRequest));
    }

    public updateGroup() {
        let stockRequest = new StockGroupRequest();
        let activeGroup: StockGroupResponse = null;
        let uniqueNameField = this.addGroupForm.get('uniqueName');

        this.activeGroup$.pipe(take(1)).subscribe(a => activeGroup = a);
        uniqueNameField.patchValue(uniqueNameField.value.replace(/ /g, '').toLowerCase());

        stockRequest = this.addGroupForm.value as StockGroupRequest;
        if (this.addGroupForm.value.isSubGroup) {
            stockRequest.parentStockGroupUniqueName = this.selectedGroup.value;
        }
        if (_.isObject(stockRequest.parentStockGroupUniqueName)) {
            let uniqName: any = _.cloneDeep(stockRequest.parentStockGroupUniqueName);
            stockRequest.parentStockGroupUniqueName = uniqName.value;
        }
        this.store.dispatch(this.inventoryActions.updateGroup(stockRequest, activeGroup.uniqueName));
        this.store.select(p => p.inventory.isUpdateGroupInProcess).pipe(takeUntil(this.destroyed$), distinctUntilChanged(), filter(p => !p)).subscribe((a) => {
            this.activeGroup$.pipe(take(1)).subscribe(b => activeGroup = b);
            // this.router.navigateByUrl('/dummy', { skipLocationChange: true }).then(() => {
            //   this.router.navigate(['/pages', 'inventory', 'group', activeGroup.uniqueName, 'stock-report']);
            // });
        });
    }

    public removeGroup() {
        let activeGroup: StockGroupResponse = null;
        this.activeGroup$.pipe(take(1)).subscribe(a => activeGroup = a);
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

    // close pane
    public closeAsidePane() {
        this.addGroupForm.reset();
        this.closeAsideEvent.emit();
    }

}
