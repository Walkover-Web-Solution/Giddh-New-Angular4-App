import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { find, take, takeUntil } from 'rxjs/operators';
import { CustomStockUnitAction } from '../../../actions/inventory/customStockUnit.actions';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { StockMappedUnitResponse, StockUnitRequest } from '../../../models/api-models/Inventory';
import { IForceClear } from '../../../models/api-models/Sales';
import { InventoryService } from '../../../services/inventory.service';
import { uniqueNameInvalidStringReplace } from '../../../shared/helpers/helperFunctions';
import { AppState } from '../../../store/roots';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { StockUnits } from './stock-unit';
import { ToasterService } from '../../../services/toaster.service';
import { cloneDeep, isEmpty } from '../../../lodash-optimized';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'inventory-custom-stock',
    templateUrl: './inventory.customstock.component.html',
    styleUrls: ['./inventory.customstock.component.scss']
})
export class InventoryCustomStockComponent implements OnInit, OnDestroy, OnChanges {
    @ViewChild('customUnitForm', { static: true }) customUnitForm: NgForm;
    @Input() public isAsideClose: boolean;
    @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();
    public stockUnitsDropDown$: Observable<IOption[]>;
    public activeGroupUniqueName$: Observable<string>;
    public stockUnit$: Observable<StockUnitRequest[]>;
    public stockMappedUnits$: Observable<StockMappedUnitResponse[]>;
    public stockMappedUnitsWithUniqueName$: Observable<StockMappedUnitResponse[]>;
    public editMode: boolean;
    public editCode: string;
    public customUnitObj: StockUnitRequest;
    public createCustomStockInProcess$: Observable<boolean>;
    public updateCustomStockInProcess$: Observable<boolean>;
    public deleteCustomStockInProcessCode$: Observable<any[]>;
    public createCustomStockSuccess$: Observable<boolean>;
    public stockUnitsList = StockUnits;

    public companyProfile: any;
    public country: string;
    public selectedUnitName: string;
    public isIndia: boolean;
    public forceClear$: Observable<IForceClear> = observableOf({ status: false });
    public isStockUnitCodeAvailable$: Observable<boolean>;
    public stockUnitCodeRegex: string = '';
    public isDivide: boolean = false;
    /** User selected decimal places */
    public giddhDecimalPlaces: number = 2;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    public isValidForm: boolean = true;



    constructor(
        private store: Store<AppState>,
        private customStockActions: CustomStockUnitAction,
        private inventoryAction: InventoryAction,
        private inventoryService: InventoryService,
        private sidebarAction: SidebarAction,
        private toasterService: ToasterService
    ) {
        this.customUnitObj = new StockUnitRequest();
        this.stockUnit$ = this.store.pipe(select(p => p.inventory.stockUnits), takeUntil(this.destroyed$));
        this.stockMappedUnits$ = this.store.pipe(select(p => p.inventory.stockMappedUnits), takeUntil(this.destroyed$));
        this.stockMappedUnitsWithUniqueName$ = this.store.pipe(select(p => p.inventory.stockMappedUnitsWithUniqueName), takeUntil(this.destroyed$));
        this.isStockUnitCodeAvailable$ = this.store.pipe(select(state => state.inventory.isStockUnitCodeAvailable), takeUntil(this.destroyed$));

        this.store.pipe(select(state => state.inventory.stockUnits), takeUntil(this.destroyed$)).subscribe(p => {
            if (p && p.length) {
                let units = p;
                let unitArr = units.map(unit => {
                    return { label: `${unit.name} (${unit.code})`, value: unit.code };
                });
                this.stockUnitsDropDown$ = observableOf(unitArr);
            }
        });

        this.activeGroupUniqueName$ = this.store.pipe(select(s => s.inventory.activeGroupUniqueName), takeUntil(this.destroyed$));
        this.createCustomStockInProcess$ = this.store.pipe(select(s => s.inventory.createCustomStockInProcess), takeUntil(this.destroyed$));
        this.updateCustomStockInProcess$ = this.store.pipe(select(s => s.inventory.updateCustomStockInProcess), takeUntil(this.destroyed$));
        this.deleteCustomStockInProcessCode$ = this.store.pipe(select(s => s.inventory.deleteCustomStockInProcessCode), takeUntil(this.destroyed$));
        this.createCustomStockSuccess$ = this.store.pipe(select(s => s.inventory.createCustomStockSuccess), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.pipe(select(p => p.settings.profile), takeUntil(this.destroyed$)).subscribe((profileData) => {
            if (!isEmpty(profileData)) {
                this.companyProfile = cloneDeep(profileData);
                this.giddhDecimalPlaces = this.companyProfile.balanceDecimalPlaces || 2;
                this.inventoryService.getUnitCodeRegex('stockUnit', this.companyProfile.country || '').pipe(takeUntil(this.destroyed$)).subscribe((data: any) => {
                    if (data && data.body) {
                        this.stockUnitCodeRegex = data.body.regex;
                    }
                });
                if (this.companyProfile.country) {
                    this.country = this.companyProfile.country.toLocaleLowerCase();
                    if (this.country && this.country === 'india') {
                        this.isIndia = true;
                    }
                } else {
                    this.country = 'india';
                    this.isIndia = true;
                }
            }
        });

        let activeGroup = null;
        this.activeGroupUniqueName$.pipe(take(1)).subscribe(a => activeGroup = a);
        if (activeGroup) {
            this.store.dispatch(this.sidebarAction.OpenGroup(activeGroup));
        }

        this.store.dispatch(this.inventoryAction.resetActiveStock());
        this.store.dispatch(this.customStockActions.GetStockUnit());

        this.createCustomStockSuccess$.subscribe((a) => {
            if (a) {
                this.clearFields();
                this.selectedUnitName = null;
                this.store.dispatch(this.customStockActions.GetStockMappedUnits());
            }
        });

        this.updateCustomStockInProcess$.subscribe((a) => {
            if (!a) {
                this.clearFields();
                this.selectedUnitName = null;
                this.store.dispatch(this.customStockActions.GetStockMappedUnits());
            }
        });
        this.addDefaultMapping();
    }

    public saveUnit(): any {
        this.isValidForm = true;
        let customMapping = cloneDeep(this.customUnitObj)
        customMapping.mappings.forEach((mapping) => {
            if ((mapping?.stockUnitY?.code && !mapping?.quantity) || (mapping?.quantity && !mapping?.stockUnitY?.code)) {
                this.isValidForm = false;
            }
        });
        if (!this.isValidForm) {
            return;
        }
        customMapping.mappings = customMapping.mappings.filter(mapping => mapping.quantity || mapping.stockUnitY.code);
        if (!this.editMode) {
            if (this.isIndia && this.selectedUnitName) {
                customMapping.name = cloneDeep(this.selectedUnitName);
            }
            this.store.dispatch(this.customStockActions.CreateStockUnit(cloneDeep(customMapping)));
        } else {
            this.store.dispatch(this.customStockActions.UpdateStockUnit(cloneDeep(customMapping), this.editCode));
            customMapping.name = null;
        }

    }

    public deleteUnit(code): any {
        this.store.dispatch(this.customStockActions.DeleteStockUnit(code));
    }

    public editUnit(item: any) {
        this.store.dispatch(this.customStockActions.getStockMappedUnitByUniqueName(item.stockUnitX.code));
        this.stockMappedUnitsWithUniqueName$.subscribe((res: any) => {
            if (res?.code) {
                this.customUnitObj.name = res?.name;
                this.customUnitObj.code = res?.code;
                this.customUnitObj.mappings = [];
                res.mappings.forEach(mapping => {
                    this.customUnitObj.mappings.push({
                        quantity: mapping?.quantity,
                        stockUnitY: {
                            code: mapping?.stockUnitY?.code
                        },
                    });
                });
                this.selectedUnitName = res?.name;
                this.editCode = res?.code;
                this.editMode = true;
            }
        });
    }

    public clearFields() {
        this.customUnitObj = new StockUnitRequest();
        this.forceClear$ = observableOf({ status: true });
        this.editMode = false;
        this.editCode = '';
    }

    /**
     * This will use for change mapped units
     *
     * @param {*} v
     * @memberof InventoryCustomStockComponent
     */
    public change(v) {
        if (!this.editMode) {
            this.stockUnitsDropDown$.subscribe(res => {
                let value = res.filter(val => val.value !== v);
                this.stockUnitsDropDown$ = observableOf(value);
            });
        }
        this.stockUnit$.pipe(find(p => {
            let unit = p.find(q => q.code === v);
            if (unit?.code !== undefined) {
                this.customUnitObj.mappings.filter(val => val.stockUnitY.code === unit?.code);
                return true;
            }
        })).subscribe();
    }

    /**
     * This will use for set unit name
     *
     * @param {*} name
     * @memberof InventoryCustomStockComponent
     */
    public setUnitName(name) {
        this.stockUnitsDropDown$.subscribe(res => {
            let value = res.filter(val => val.value !== name);
            this.stockUnitsDropDown$ = observableOf(value);
        });

        let unit = this.stockUnitsList?.filter((obj) => obj.value === name || obj.label === name);
        if (unit !== undefined && unit?.length > 0) {
            this.customUnitObj.code = unit[0].value;
            this.customUnitObj.name = unit[0].value;
            this.selectedUnitName = unit[0].label;
        }
        this.addDefaultMapping();
    }

    public ngOnChanges(changes) {
        if (this.isAsideClose) {
            this.clearFields();
        }
    }

    /**
     * clearUnit
     */
    public clearUnit() {
        setTimeout(() => {
            this.customUnitObj.code = '';
        }, 100);
    }

    /**
     * checkIfUnitIsExist
     */
    // public checkIfUnitIsExist() {
    //     if (this.editMode) {
    //         return true;
    //     }
    //     let val: string = this.customUnitObj?.code;
    //     if (val && this.stockUnitsList.includes({ label: val, value: val })) {
    //         val = uniqueNameInvalidStringReplace(val);
    //     }

    //     if (val) {
    //         this.store.dispatch(this.customStockActions.GetStockUnitByName(val));

    //         this.isStockUnitCodeAvailable$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
    //             if (a !== null && a !== undefined) {
    //                 if (a) {
    //                     this.customUnitObj.code = val;
    //                 } else {
    //                     let num = 1;
    //                     this.customUnitObj.code = val + num;
    //                 }
    //             }
    //         });
    //     } else {
    //         this.customUnitObj.code = '';
    //     }

    // }

    /**
     * noUnitFound
     */
    public noUnitFound(selectElem) {
        if (selectElem) {
            let val: string = selectElem.filter;
            this.customUnitObj.name = cloneDeep(val);
            this.selectedUnitName = '';
            if (!this.editMode && val) {
                val = uniqueNameInvalidStringReplace(val);
                this.customUnitObj.code = cloneDeep(val);
            }
        }
    }

    /**
     * changeType
     */
    public changeType(ev) {
        this.isDivide = ev;
    }
    // close pane
    public closeAsidePane() {
        this.closeAsideEvent.emit();
    }

    /**
     * Displays the error message if unit code is invalid
     *
     * @param {boolean} isInvalid True, if unit code field has errors
     * @memberof InventoryCustomStockComponent
     */
    public handleUnitCodeValidation(isInvalid: boolean): void {
        if (isInvalid) {
            this.toasterService.errorToast('Only numbers and lower case alphabets without spaces are allowed!', 'Invalid Unit Code');
        }
    }

    /**
     * This will use for add default feature
     *
     * @return {*}  {void}
     * @memberof InventoryCustomStockComponent
     */
    public addDefaultMapping(mappings?: any): void {
        this.isValidForm = true;
        if (!this.customUnitObj.mappings.length) {
            this.customUnitObj.mappings.push(
                {
                    quantity: "",
                    stockUnitY: {
                        code: ""
                    }
                }
            );
        } else {
            if (mappings?.quantity && mappings?.stockUnitY.code) {
                this.customUnitObj.mappings.push(
                    {
                        quantity: "",
                        stockUnitY: {
                            code: ""
                        }
                    }
                );
            } else {
                return;
            }
        }
    }

    /**
    *This will use for  remove default filter
    *
    * @param {*} event
    * @param {number} index
    * @memberof InventoryCustomStockComponent
    */
    public removeMappedUnit(index: number): void {
        this.customUnitObj.mappings?.splice(index, 1);
        if (this.customUnitObj.mappings.length === 0) {
            this.addDefaultMapping();
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
