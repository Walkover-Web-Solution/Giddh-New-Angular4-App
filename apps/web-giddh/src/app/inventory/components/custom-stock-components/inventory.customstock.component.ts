import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, OnChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, of as observableOf, ReplaySubject } from 'rxjs';
import { find, take, takeUntil } from 'rxjs/operators';
import { CustomStockUnitAction } from '../../../actions/inventory/customStockUnit.actions';
import { InventoryAction } from '../../../actions/inventory/inventory.actions';
import { SidebarAction } from '../../../actions/inventory/sidebar.actions';
import { SettingsProfileActions } from '../../../actions/settings/profile/settings.profile.action';
import { StockUnitRequest } from '../../../models/api-models/Inventory';
import { IForceClear } from '../../../models/api-models/Sales';
import { InventoryService } from '../../../services/inventory.service';
import { giddhRoundOff, uniqueNameInvalidStringReplace } from '../../../shared/helpers/helperFunctions';
import { AppState } from '../../../store/roots';
import { IOption } from '../../../theme/ng-virtual-select/sh-options.interface';
import { StockUnits } from './stock-unit';
import { ToasterService } from '../../../services/toaster.service';
import { clone, cloneDeep, isEmpty } from '../../../lodash-optimized';

@Component({
    selector: 'inventory-custom-stock',
    templateUrl: './inventory.customstock.component.html',
    styleUrls: ['./inventory.customstock.component.scss']
})
export class InventoryCustomStockComponent implements OnInit, OnDestroy, OnChanges {
    @Input() public isAsideClose: boolean;
    @Output() public closeAsideEvent: EventEmitter<any> = new EventEmitter();
    public stockUnitsDropDown$: Observable<IOption[]>;
    public activeGroupUniqueName$: Observable<string>;
    public stockUnit$: Observable<StockUnitRequest[]>;
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

    constructor(
        private store: Store<AppState>,
        private customStockActions: CustomStockUnitAction,
        private inventoryAction: InventoryAction,
        private inventoryService: InventoryService,
        private sidebarAction: SidebarAction,
        private settingsProfileActions: SettingsProfileActions,
        private toasterService: ToasterService
    ) {
        this.customUnitObj = new StockUnitRequest();
        this.stockUnit$ = this.store.pipe(select(p => p.inventory.stockUnits), takeUntil(this.destroyed$));
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
            }
        });

        this.updateCustomStockInProcess$.subscribe((a) => {
            if (!a) {
                this.clearFields();
                this.selectedUnitName = null;
            }
        });
    }

    public saveUnit(): any {
        let customUnitObj = clone(this.customUnitObj);
        if (!this.editMode) {
            if (this.isIndia && this.selectedUnitName) {
                customUnitObj.name = cloneDeep(this.selectedUnitName);
            }
            if (this.isDivide) {
                customUnitObj.quantityPerUnit = 1 * cloneDeep(customUnitObj.quantityPerUnit);
                customUnitObj.quantityPerUnit = Number(customUnitObj.quantityPerUnit.toFixed(4));
            } else {
                customUnitObj.quantityPerUnit = 1 / cloneDeep(customUnitObj.quantityPerUnit);
                customUnitObj.quantityPerUnit = Number(customUnitObj.quantityPerUnit.toFixed(16));
            }
            this.store.dispatch(this.customStockActions.CreateStockUnit(cloneDeep(customUnitObj)));
        } else {
            if (this.isDivide) {
                customUnitObj.quantityPerUnit = 1 * cloneDeep(customUnitObj.quantityPerUnit);
                customUnitObj.quantityPerUnit = Number(customUnitObj.quantityPerUnit.toFixed(4));
            } else {
                customUnitObj.quantityPerUnit = 1 / cloneDeep(customUnitObj.quantityPerUnit);
                customUnitObj.quantityPerUnit = Number(customUnitObj.quantityPerUnit.toFixed(16));
            }

            this.store.dispatch(this.customStockActions.UpdateStockUnit(cloneDeep(customUnitObj), this.editCode));
            this.customUnitObj.name = null;
        }
    }

    public deleteUnit(code): any {
        this.store.dispatch(this.customStockActions.DeleteStockUnit(code));
    }

    public editUnit(item: StockUnitRequest) {
        this.customUnitObj = Object.assign({}, item);
        this.selectedUnitName = item?.name;
        if (item?.displayQuantityPerUnit) {
            this.customUnitObj.quantityPerUnit = giddhRoundOff(item.displayQuantityPerUnit, this.giddhDecimalPlaces);
        }
        if (this.customUnitObj.parentStockUnit) {
            this.customUnitObj.parentStockUnitCode = item?.parentStockUnit?.code;
        }
        this.editCode = item?.code;
        this.editMode = true;
    }

    public clearFields() {
        this.customUnitObj = new StockUnitRequest();
        this.forceClear$ = observableOf({ status: true });
        this.customUnitObj.parentStockUnitCode = null;
        this.editMode = false;
        this.editCode = '';
        this.isDivide = false;

    }

    public change(v) {
        this.stockUnit$.pipe(find(p => {
            let unit = p.find(q => q.code === v);
            if (unit !== undefined) {
                this.customUnitObj.parentStockUnit = unit;
                return true;
            }
        })).subscribe();
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    public setUnitName(name) {
        let unit = this.stockUnitsList?.filter((obj) => obj.value === name || obj.label === name);
        if (unit !== undefined && unit.length > 0) {
            this.customUnitObj.code = unit[0].value;
            this.customUnitObj.name = unit[0].value;
            this.selectedUnitName = unit[0].label;
            this.checkIfUnitIsExist();
        }
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
    public checkIfUnitIsExist() {
        if (this.editMode) {
            return true;
        }
        let val: string = this.customUnitObj?.code;
        if (val && this.stockUnitsList.includes({ label: val, value: val })) {
            val = uniqueNameInvalidStringReplace(val);
        }

        if (val) {
            this.store.dispatch(this.customStockActions.GetStockUnitByName(val));

            this.isStockUnitCodeAvailable$.pipe(takeUntil(this.destroyed$)).subscribe(a => {
                if (a !== null && a !== undefined) {
                    if (a) {
                        this.customUnitObj.code = val;
                    } else {
                        let num = 1;
                        this.customUnitObj.code = val + num;
                    }
                }
            });
        } else {
            this.customUnitObj.code = '';
        }
    }

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
}
