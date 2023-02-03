import { Observable, of as observableOf, ReplaySubject, Subscription } from 'rxjs';
import { distinctUntilChanged, filter, take, takeUntil, map } from 'rxjs/operators';
import { AppState } from '../../../store';
import { Store, select } from '@ngrx/store';
import { AfterViewInit, Component, Input, OnDestroy, OnInit, Output, EventEmitter, TemplateRef } from '@angular/core';
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
import { isObject, cloneDeep } from 'apps/web-giddh/src/app/lodash-optimized';
import { TaxResponse } from '../../../models/api-models/Company';
import { InvoiceService } from '../../../services/invoice.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { BootstrapToggleSwitch } from '../../../app.constant';
@Component({
    selector: 'inventory-add-group',
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
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    /** This will hold temporary tax list */
    public taxTempArray: any[] = [];
    /** Observable for company taxes */
    public companyTaxesList$: Observable<TaxResponse[]>;
    /** This will hold inventory settings */
    public inventorySettings: any;
    /** This will hold modal reference */
    public modalRef: BsModalRef;
    /** This will hold toggle buttons value and size */
    public bootstrapToggleSwitch = BootstrapToggleSwitch;

    /**
     * TypeScript public modifiers
     */
    constructor(private store: Store<AppState>, private route: ActivatedRoute, private sideBarAction: SidebarAction,
        private _fb: FormBuilder, private _inventoryService: InventoryService, private inventoryActions: InventoryAction,
        private router: Router, private invoiceService: InvoiceService, private modalService: BsModalService) {
        this.fetchingGrpUniqueName$ = this.store.pipe(select(state => state.inventory.fetchingGrpUniqueName), takeUntil(this.destroyed$));
        this.isGroupNameAvailable$ = this.store.pipe(select(state => state.inventory.isGroupNameAvailable), takeUntil(this.destroyed$));
        this.activeGroup$ = this.store.pipe(select(state => state.inventory.activeGroup), takeUntil(this.destroyed$));
        this.createGroupSuccess$ = this.store.pipe(select(state => state.inventory.createGroupSuccess), takeUntil(this.destroyed$));
        this.isAddNewGroupInProcess$ = this.store.pipe(select(state => state.inventory.isAddNewGroupInProcess), takeUntil(this.destroyed$));
        this.isUpdateGroupInProcess$ = this.store.pipe(select(state => state.inventory.isUpdateGroupInProcess), takeUntil(this.destroyed$));
        this.isDeleteGroupInProcess$ = this.store.pipe(select(state => state.inventory.isDeleteGroupInProcess), takeUntil(this.destroyed$));
        this.manageInProcess$ = this.store.pipe(select(s => s.inventory.inventoryAsideState), takeUntil(this.destroyed$));
        this.companyTaxesList$ = this.store.pipe(select(state => state.company && state.company.taxes), takeUntil(this.destroyed$));
    }

    public ngOnInit() {
        this.store.pipe(take(1)).subscribe(state => {
            if (state.inventory.groupsWithStocks === null) {
                this.store.dispatch(this.sideBarAction.GetGroupsWithStocksHierarchyMin('', 1, 30));
            }
        });
        // get all groups
        this.getParentGroupData();
        this.getInvoiceSettings();
        // subscribe to url
        this.sub = this.route.params.pipe(takeUntil(this.destroyed$)).subscribe(params => {
            if(params) {
                this.groupUniqueName = params['groupUniqueName'];
            }
        });

        // add group form
        this.addGroupForm = this._fb.group({
            name: ['', [Validators.required]],
            uniqueName: ['', [Validators.required]],
            hsnNumber: [''],
            sacNumber: [''],
            parentStockGroupUniqueName: [{ value: '', disabled: true }, [Validators.required]],
            isSubGroup: [false],
            taxes: [[]],
            showCodeType: ['']
        });
        this.taxTempArray = [];

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
                updGroupObj.uniqueName = account?.uniqueName;
                updGroupObj.hsnNumber = account.hsnNumber;
                updGroupObj.sacNumber = account.sacNumber;
                if (updGroupObj?.uniqueName === 'maingroup') {
                    this.addGroupForm.controls['uniqueName'].disable();
                    this.defaultGrpActive = true;
                } else {
                    this.addGroupForm.controls['uniqueName'].enable();
                    this.defaultGrpActive = false;
                }

                if (account.parentStockGroup) {
                    this.selectedGroup = { label: account.parentStockGroup.name, value: account.parentStockGroup?.uniqueName };
                    this.parentStockSearchString = account.parentStockGroup?.uniqueName;
                    updGroupObj.isSubGroup = true;
                } else {
                    updGroupObj.parentStockGroupUniqueName = '';
                    this.parentStockSearchString = '';
                    updGroupObj.isSubGroup = false;
                    this.forceClear$ = observableOf({ status: true });
                }
                this.addGroupForm?.patchValue(updGroupObj);
                if (account.parentStockGroup) {
                    this.addGroupForm?.patchValue({ parentStockGroupUniqueName: account.parentStockGroup?.uniqueName });
                }

                if (account.hsnNumber) {
                    this.addGroupForm.get("showCodeType")?.patchValue("hsn");
                } else if (account.sacNumber) {
                    this.addGroupForm.get("showCodeType")?.patchValue("sac");
                }

            } else {
                if (account) {
                    this.addGroupForm?.patchValue({ isSubGroup: true, parentStockGroupUniqueName: account?.uniqueName });
                } else {
                    this.addGroupForm?.patchValue({ name: '', uniqueName: '', hsnNumber: '', sacNumber: '', isSubGroup: false });
                }
                this.parentStockSearchString = '';
            }

            this.companyTaxesList$.subscribe((tax) => {
                _.forEach(tax, (o) => {
                    o.isChecked = false;
                    o.isDisabled = false;
                });
            });

            this.taxTempArray = [];
            if (!this.addGroup && account && account.taxes && account.taxes.length) {
                this.mapSavedTaxes(account.taxes);
            }
        });

        // reset add form and get all groups data
        this.createGroupSuccess$.subscribe(d => {
            if (d) {
                if (this.addGroup) {
                    this.addGroupForm.reset();

                    this.getParentGroupData();
                    this.taxTempArray = [];
                    this.companyTaxesList$.subscribe((taxes) => {
                        _.forEach(taxes, (o) => {
                            o.isChecked = false;
                            o.isDisabled = false;
                        });
                    });
                    this.addGroupForm.get('taxes')?.patchValue('');
                }
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
            if (this.groupUniqueName && a && a?.uniqueName === this.groupUniqueName) {
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
            if (data?.status === 'success') {
                let flattenData: IOption[] = [];
                this.flattenDATA(data.body?.results, flattenData);
                this.groupsData$ = observableOf(flattenData);
            }
        });
    }

    public flattenDATA(rawList: IGroupsWithStocksHierarchyMinItem[], parents: IOption[] = []) {
        rawList.map(p => {
            if (p) {
                let newOption: IOption = { label: '', value: '' };
                newOption.label = p.name;
                newOption.value = p?.uniqueName;
                parents.push(newOption);
                if (p.childStockGroups && p.childStockGroups.length > 0) {
                    this.flattenDATA(p.childStockGroups, parents);
                }
            }
        });
    }

    public ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    // group selected
    public groupSelected(event: IOption) {
        let selected;
        this.groupsData$.subscribe(p => {
            selected = p.find(q => q?.value === event?.value);
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
        let val: string = this.addGroupForm.controls['name']?.value;
        val = uniqueNameInvalidStringReplace(val);

        /** unique name availability is check on server now
        if unique name is not available then server will assign number suffix **/

        if (val) {
            this.addGroupForm?.patchValue({ uniqueName: val });
        } else {
            this.addGroupForm?.patchValue({ uniqueName: '' });
        }
    }

    public addNewGroup() {
        let stockRequest = new StockGroupRequest();
        let uniqueNameField = this.addGroupForm.get('uniqueName');
        if (uniqueNameField && uniqueNameField.value) {
            uniqueNameField?.patchValue(uniqueNameField.value?.replace(/ /g, '')?.toLowerCase());
        }

        if (this.addGroupForm.get("showCodeType")?.value === "hsn") {
            this.addGroupForm.get('sacNumber')?.patchValue("");
        } else {
            this.addGroupForm.get('hsnNumber')?.patchValue("");
        }

        stockRequest = this.addGroupForm?.value as StockGroupRequest;
        if (this.addGroupForm?.value.isSubGroup && this.selectedGroup) {
            stockRequest.parentStockGroupUniqueName = this.selectedGroup.value;
        }
        if (!stockRequest.isSubGroup) {
            stockRequest.isSubGroup = false;
        }
        if (isObject(stockRequest.parentStockGroupUniqueName)) {
            let uniqName: any = cloneDeep(stockRequest.parentStockGroupUniqueName);
            stockRequest.parentStockGroupUniqueName = uniqName?.value;
        }

        if (!stockRequest.taxes) {
            stockRequest.taxes = [];
        }

        this.store.dispatch(this.inventoryActions.addNewGroup(stockRequest));
    }

    public updateGroup() {
        let stockRequest = new StockGroupRequest();
        let activeGroup: StockGroupResponse = null;
        let uniqueNameField = this.addGroupForm.get('uniqueName');

        this.activeGroup$.pipe(take(1)).subscribe(a => activeGroup = a);
        if (uniqueNameField && uniqueNameField.value) {
            uniqueNameField?.patchValue(uniqueNameField.value?.replace(/ /g, '')?.toLowerCase());
        }

        if (this.addGroupForm.get("showCodeType")?.value === "hsn") {
            this.addGroupForm.get('sacNumber')?.patchValue("");
        } else {
            this.addGroupForm.get('hsnNumber')?.patchValue("");
        }

        stockRequest = this.addGroupForm?.value as StockGroupRequest;
        if (this.addGroupForm?.value.isSubGroup) {
            stockRequest.parentStockGroupUniqueName = this.selectedGroup?.value;
        }
        if (isObject(stockRequest.parentStockGroupUniqueName)) {
            let uniqName: any = cloneDeep(stockRequest.parentStockGroupUniqueName);
            stockRequest.parentStockGroupUniqueName = uniqName?.value;
        }

        if (!stockRequest.taxes) {
            stockRequest.taxes = [];
        }

        this.store.dispatch(this.inventoryActions.updateGroup(stockRequest, activeGroup?.uniqueName));
        this.store.pipe(select(p => p.inventory.isUpdateGroupInProcess), distinctUntilChanged(), filter(p => !p), takeUntil(this.destroyed$)).subscribe((a) => {
            this.activeGroup$.pipe(take(1)).subscribe(b => activeGroup = b);
        });
    }

    public removeGroup() {
        let activeGroup: StockGroupResponse = null;
        this.activeGroup$.pipe(take(1)).subscribe(a => activeGroup = a);
        if (activeGroup) {
            this.store.dispatch(this.inventoryActions.removeGroup(activeGroup?.uniqueName));
        }
        this.router.navigateByUrl('/pages/inventory');
    }

    /**
     * validateUniqueName
     */
    public validateUniqueName(unqName) {
        if (unqName) {
            let val = uniqueNameInvalidStringReplace(unqName);
            this.addGroupForm?.patchValue({ uniqueName: val });
        }
    }

    // close pane
    public closeAsidePane() {
        this.addGroupForm.reset();

        this.companyTaxesList$.pipe(map((item) => {
            return item.map(tax => {
                if (tax) {
                    tax.isChecked = false;
                    tax.isDisabled = false;
                }
                return tax;
            });
        }), takeUntil(this.destroyed$)).subscribe(res => {
            return res;
        });

        this.taxTempArray = [];
        this.closeAsideEvent.emit();
    }

    /**
     * This will check/uncheck tax in list
     *
     * @param {*} e
     * @param {*} tax
     * @memberof InventoryAddGroupComponent
     */
    public selectTax(event: any, tax: any): void {
        if (tax.taxType !== 'gstcess') {
            let index = _.findIndex(this.taxTempArray, (taxTemp) => taxTemp.taxType === tax.taxType);
            if (index > -1 && event.target?.checked) {
                this.companyTaxesList$.subscribe((taxes) => {
                    _.forEach(taxes, (companyTax) => {
                        if (companyTax.taxType === tax.taxType) {
                            companyTax.isChecked = false;
                            companyTax.isDisabled = true;
                        }
                        if (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay') {
                            if (companyTax.taxType === 'tcsrc' || companyTax.taxType === 'tdsrc' || companyTax.taxType === 'tcspay' || companyTax.taxType === 'tdspay') {
                                companyTax.isChecked = false;
                                companyTax.isDisabled = true;
                            }
                        }
                    });
                });
            }

            if (index < 0 && event.target?.checked) {
                this.companyTaxesList$.subscribe((taxes) => {
                    _.forEach(taxes, (companyTax) => {
                        if (companyTax.taxType === tax.taxType) {
                            companyTax.isChecked = false;
                            companyTax.isDisabled = true;
                        }

                        if (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay') {
                            if (companyTax.taxType === 'tcsrc' || companyTax.taxType === 'tdsrc' || companyTax.taxType === 'tcspay' || companyTax.taxType === 'tdspay') {
                                companyTax.isChecked = false;
                                companyTax.isDisabled = true;
                            }
                        }
                        if (companyTax?.uniqueName === tax?.uniqueName) {
                            tax.isChecked = true;
                            tax.isDisabled = false;
                            this.taxTempArray.push(tax);
                        }
                    });
                });
            } else if (index > -1 && event.target?.checked) {
                tax.isChecked = true;
                tax.isDisabled = false;
                this.taxTempArray = this.taxTempArray?.filter(ele => {
                    return tax.taxType !== ele.taxType;
                });
                this.taxTempArray.push(tax);
            } else {
                let idx = _.findIndex(this.taxTempArray, (taxTemp) => taxTemp?.uniqueName === tax?.uniqueName);
                this.taxTempArray.splice(idx, 1);
                tax.isChecked = false;
                this.companyTaxesList$.subscribe((taxes) => {
                    _.forEach(taxes, (companyTax) => {
                        if (companyTax.taxType === tax.taxType) {
                            companyTax.isDisabled = false;
                        }
                        if (tax.taxType === 'tcsrc' || tax.taxType === 'tdsrc' || tax.taxType === 'tcspay' || tax.taxType === 'tdspay') {
                            if (companyTax.taxType === 'tcsrc' || companyTax.taxType === 'tdsrc' || companyTax.taxType === 'tcspay' || companyTax.taxType === 'tdspay') {
                                companyTax.isDisabled = false;
                            }
                        }
                    });
                });
            }
        } else {
            if (event.target?.checked) {
                this.taxTempArray.push(tax);
                tax.isChecked = true;
            } else {
                let idx = _.findIndex(this.taxTempArray, (taxTemp) => taxTemp?.uniqueName === tax?.uniqueName);
                this.taxTempArray.splice(idx, 1);
                tax.isChecked = false;
            }
        }

        this.addGroupForm.get('taxes')?.patchValue(this.taxTempArray.map(taxTemp => taxTemp?.uniqueName));
    }

    /**
     * This will map the saved taxes
     *
     * @param {*} taxes
     * @memberof InventoryAddGroupComponent
     */
    public mapSavedTaxes(taxes): void {
        let taxToMap = [];
        let event: any = { target: { checked: true } };

        this.companyTaxesList$.subscribe(companyTax => {
            _.filter(companyTax, (tax) => {
                _.find(taxes, (unq) => {
                    if (unq === tax?.uniqueName) {
                        return taxToMap.push(tax);
                    }
                });
            });
        });

        taxToMap.map((tax, index) => {
            this.selectTax(event, tax);
        });
    }

    /**
     * This will get invoice settings
     *
     * @memberof InventoryAddGroupComponent
     */
    public getInvoiceSettings(): void {
        this.invoiceService.GetInvoiceSetting().pipe(takeUntil(this.destroyed$)).subscribe(response => {
            if (response && response.status === "success" && response.body) {
                let invoiceSettings = _.cloneDeep(response.body);
                this.inventorySettings = invoiceSettings.companyInventorySettings;

                if (!this.addGroupForm.get("showCodeType")?.value) {
                    if (this.inventorySettings?.manageInventory) {
                        this.addGroupForm.get("showCodeType")?.patchValue("hsn");
                    } else {
                        this.addGroupForm.get("showCodeType")?.patchValue("sac");
                    }
                }
            }
        });
    }

    /**
     * Opens the modal with the provided template
     *
     * @param {TemplateRef<any>} template
     * @memberof InventoryAddGroupComponent
     */
    public openModal(template: TemplateRef<any>): void {
        this.modalRef = this.modalService.show(template);
    }

    /**
     * Hides the current opened modal
     *
     * @memberof InventoryAddGroupComponent
     */
    public hideModal(): void {
        this.modalRef.hide();
    }
}
