import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    TemplateRef
} from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';

import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import * as moment from 'moment';
import { StockUnitRequest } from '../../../../models/api-models/Inventory';
import { stockManufacturingDetailsValidator } from '../../../../shared/helpers';
import { ToasterService } from '../../../../services/toaster.service';
import { InventoryService } from '../../../../services/inventory.service';
import { CompanyResponse } from "../../../../models/api-models/Company";
import { Observable, ReplaySubject } from "rxjs";
import { take, takeUntil } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "../../../../store";
import { ShSelectComponent } from "../../../../theme/ng-virtual-select/sh-select.component";
import { ActivatedRoute, Router } from "@angular/router";
import { InvViewService } from "../../../inv.view.service";
import { GeneralService } from '../../../../services/general.service';

@Component({
    selector: 'branch-transfer-note',
    templateUrl: './branch-transfer-note.component.html',
    styleUrls: ['./branch-transfer-note.component.scss']
})

export class BranchTransferNoteComponent implements OnInit, AfterViewInit, OnChanges {
    @Output() public onCancel = new EventEmitter();
    @Output() public onSave = new EventEmitter<InventoryEntry>();

    @Input() public stockList: IStocksItem[];
    @Input() public stockUnits: StockUnitRequest[];
    @Input() public userList: InventoryUser[];
    @Input() public branchList: CompanyResponse[];

    @Input() public isLoading: boolean;
    @Input() public currentCompany: CompanyResponse;
    @ViewChild('shDestination') public shDestination: ShSelectComponent;

    public hideForm = false;
    public stockListOptions: IOption[];
    public stockUnitsOptions: IOption[];
    public userListOptions: IOption[];
    public branchListOptions: IOption[];
    public form: FormGroup;
    public config: Partial<BsDatepickerConfig> = { dateInputFormat: 'DD-MM-YYYY' };
    public mode: 'receiver' | 'product' = 'product';
    public today = new Date();
    public editLinkedStockIdx: any = null;
    public editModeForLinkedStokes: boolean = false;
    public disableStockButton: boolean = false;
    public InventoryEntryValue: InventoryEntry = {};
    public entrySuccess$: Observable<boolean>;
    public errorMessage: string;
    public stockUnitCode: string;
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);


    constructor(
        private _generalService: GeneralService, private _fb: FormBuilder, private _toasty: ToasterService, private _inventoryService: InventoryService,
        private _zone: NgZone, private _store: Store<AppState>, private invViewService: InvViewService, private _router: Router) {
        this.initializeForm(true);
        this.entrySuccess$ = this._store.select(s => s.inventoryInOutState.entrySuccess).pipe(takeUntil(this.destroyed$));
    }

    /* setModalClass() {
         this.valueWidth = !this.valueWidth;
         const modalWidth = this.valueWidth ? 'modal-lg' : 'modal-sm';
         this.modalRef.setClass(modalWidth);
     }*/

    public get transferDate(): FormControl {
        return this.form.get('transferDate') as FormControl;
    }

    public get inventoryUser(): FormControl {
        return this.form.get('inventoryUser') as FormControl;
    }

    public get inventorySource(): FormControl {
        return this.form.get('inventorySource') as FormControl;
    }

    public get inventoryDestination(): FormControl {
        return this.form.get('inventoryDestination') as FormControl;
    }

    public get stock(): FormControl {
        return this.form.get('stock') as FormControl;
    }

    public get transfers(): FormArray {
        return this.form.get('transfers') as FormArray;
    }

    public get description(): FormControl {
        return this.form.get('description') as FormControl;
    }

    public get manufacturingDetails(): FormGroup {
        return this.form.get('manufacturingDetails') as FormGroup;
    }

    public get isManufactured(): FormControl {
        return this.form.get('isManufactured') as FormControl;
    }

    public ngOnInit() {
        this.InventoryEntryValue.transactions = [];
        this.InventoryEntryValue.source = {
            uniqueName: null,
            entity: null
        };
        this.InventoryEntryValue.destination = {
            uniqueName: null,
            entity: null
        };
        this.InventoryEntryValue.product = {
            uniqueName: null,
            entity: null
        };
        this.manufacturingDetails.disable();
        this.isManufactured.valueChanges.subscribe(val => {
            this.manufacturingDetails.reset();
            val ? this.manufacturingDetails.enable() : this.manufacturingDetails.disable();
        });
        this.entrySuccess$.subscribe(s => {
            if (s) {
                this.modeChanged(this.mode);
            }
        });
    }

    public ngAfterViewInit() {
        this.setSource();
    }

    public setSource() {
        setTimeout(() => {
            if (this.currentCompany.uniqueName) {
                this.InventoryEntryValue.source.uniqueName = this.currentCompany.uniqueName;
                this.InventoryEntryValue.source.entity = 'company';
                this.inventorySource.patchValue(this.currentCompany.uniqueName);
            }
        });
    }
    public initializeForm(initialRequest: boolean = false) {
        this.form = this._fb.group({
            transferDate: [moment().format('DD-MM-YYYY'), Validators.required],
            transfers: this._fb.array([], Validators.required),
            description: [''],
            inventoryUser: [],
            inventoryDestination: ['', [Validators.required]],
            inventorySource: ['', [Validators.required]],
            stock: [],
            entityDetails: [],
            isManufactured: [false],
            manufacturingDetails: this._fb.group({
                manufacturingQuantity: ['', [Validators.required]],
                manufacturingUnitCode: ['', [Validators.required]],
                linkedStocks: this._fb.array([
                    this.initialIManufacturingDetails()
                ]),
                linkedStockUniqueName: [''],
                linkedQuantity: ['',],
                linkedStockUnitCode: [''],
            }, { validator: stockManufacturingDetailsValidator })
        });
        if (initialRequest) {
            this.addTransactionItem();
        }
    }

    public initialIManufacturingDetails() {
        // initialize our controls
        return this._fb.group({
            stockUniqueName: [''],
            stockUnitCode: [''],
            quantity: ['',]
        });
    }

    public modeChanged(mode: 'receiver' | 'product') {
        if (this.mode === mode) {
            return;
        }
        this.mode = mode;
        this.form.reset();
        this.transferDate.patchValue(moment().format('DD-MM-YYYY'));
        this.transfers.controls = this.transfers.controls.filter(trx => false);
        this.setSource();
        if (this.mode === 'receiver') {
            this.inventorySource.clearValidators();
            this.stock.setValidators(Validators.required);
            this.inventoryUser.clearValidators();
            this.inventoryUser.updateValueAndValidity();
            this.inventoryDestination.clearValidators();
            this.inventoryDestination.updateValueAndValidity();
        } else {
            this.inventoryDestination.setValidators(Validators.required);
            this.inventorySource.setValidators(Validators.required);
            this.stock.clearValidators();
            this.stock.updateValueAndValidity();
        }
        this.addTransactionItem();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.stockList && this.stockList) {
            this.stockListOptions = this.stockList.map(p => ({ label: p.name, value: p.uniqueName }));
        }
        if (changes.stockUnits && this.stockUnits) {
            this.stockUnitsOptions = this.stockUnits.map(p => ({ label: `${p.name} (${p.code})`, value: p.code }));
        }
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(p => ({ label: p.name, value: p.uniqueName }));
        }
        if (changes.branchList && this.branchList) {
            this.branchListOptions = this.branchList.map(p => ({ label: p.name, value: p.uniqueName }));
        }
    }

    public addTransactionItem(control?: AbstractControl) {

        if (control && (control.invalid || this.stock.invalid || this.inventoryUser.invalid)) {
            this.errorMessage = "Please fill all (*)mandatory fields";
            this.hideMessage();
            return;
        }

        const items = this.transfers;
        const value = items.length > 0 ? items.at(0).value : {
            quantity: '',
            rate: '',
            totalValue: '',
            inventoryUser: '',
            entityDetails: '',
            stock: '',
            stockUnit: '',
        };

        const transaction = this._fb.group({
            quantity: ['', Validators.required],
            totalValue: [''],
            rate: ['', Validators.required],
            inventoryUser: [this.mode === 'product' ? value.inventoryUser : '', this.mode === 'receiver' ? [Validators.required] : []],
            stock: [this.mode === 'receiver' ? value.stock : '', this.mode === 'product' ? [Validators.required] : []],
            entityDetails: [],
            stockUnit: [this.mode === 'receiver' ? value.stockUnit : '', Validators.required]
        });


        transaction.updateValueAndValidity();
        items.push(transaction);
    }

    public deleteTransactionItem(index: number) {
        const items = this.form.get('transfers') as FormArray;
        items.removeAt(index);
    }

    public userChanged(option: IOption, index: number, type?: string) {
        const items = this.form.get('transfers') as FormArray;

        if (type === 'source') {
            this.InventoryEntryValue.source.uniqueName = option.value;
            this.InventoryEntryValue.source.entity = 'company';
        }
        if (type === 'destination') {
            this.InventoryEntryValue.destination.uniqueName = option.value;
            this.InventoryEntryValue.destination.entity = 'company';
        }
        if (this.InventoryEntryValue.source.uniqueName === this.InventoryEntryValue.destination.uniqueName) {
            this._toasty.errorToast('Source and Destination can\'t be same!');
            this.shDestination.clear();
            return;
        }

        if (this.mode === 'receiver' && type !== 'source') {
            const stockItem = this.branchListOptions.find(p => p.value === option.value);
            const entityDetails = {
                uniqueName: stockItem ? stockItem.value : null,
                entity: this.mode === 'receiver' ? 'company' : 'stock'
            }
            if (index) {
                const control = items.at(index);
                control.patchValue({ ...control.value, entityDetails });
                control.get('stockUnit').patchValue(this.stockUnitCode);
            } else {
                items.controls.forEach(c => c.patchValue({ ...c.value, entityDetails }));
            }
        } else {

            if (index) {
                const control = items.at(index);
                control.patchValue({
                    ...control.value
                });
            } else {
                items.controls.forEach(c => c.patchValue({ ...c.value }));
            }
        }
    }

    public async stockChanged(option: IOption, index: number, type?: string) {
        const items = this.transfers;
        const stockItem = this.stockList.find(p => p.uniqueName === option.value);
        const stock = stockItem ? { uniqueName: stockItem.uniqueName } : null;
        const stockUnit = stockItem ? stockItem.stockUnit.code : null;
        const entityDetails = {
            uniqueName: stockItem ? stockItem.uniqueName : null,
            entity: this.mode === 'receiver' ? 'company' : 'stock'
        }

        if (stockItem && this.mode === 'receiver') {
            if (type) {
                this.InventoryEntryValue.product.uniqueName = option.value;
                this.InventoryEntryValue.product.entity = type;
                this.stockUnitCode = stockUnit;
            }


            this.stock.disable();
            try {
                let stockDetails = await this.getStockDetails(stockItem);
                this._zone.run(() => {
                    this.stock.enable();
                });

                if (stockDetails.body && stockDetails.body.manufacturingDetails) {
                    let mfd = stockDetails.body.manufacturingDetails;
                    this.isManufactured.patchValue(true);

                    this.manufacturingDetails.patchValue({
                        manufacturingQuantity: mfd.manufacturingQuantity,
                        manufacturingUnitCode: mfd.manufacturingUnitCode
                    });

                    mfd.linkedStocks.map((item, i) => {
                        this.addItemInLinkedStocks(item, i, mfd.linkedStocks.length - 1);
                    });

                } else {
                    this.isManufactured.patchValue(false);
                }

            } catch (e) {
                this._zone.run(() => {
                    this.stock.enable();
                });
                this._toasty.errorToast('something went wrong. please try again!');
            }
        }


        if (index || index === 0) {
            const control = items.at(index);
            control.patchValue({ ...control.value, entityDetails });
            control.get('stockUnit').patchValue(stockUnit);
        } else {
            items.controls.forEach(c => c.patchValue({ ...c.value, entityDetails }));
        }
    }

    /**
     * findAddedStock
     */
    public findAddedStock(uniqueName, i) {
        const manufacturingDetailsContorl = this.manufacturingDetails;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
        let count = 0;
        _.forEach(control.controls, (o) => {
            if (o.value.stockUniqueName === uniqueName) {
                count++;
            }
        });

        if (count > 1) {
            this._toasty.errorToast('Stock already added.');
            this.disableStockButton = true;
            return;
        } else {
            const stockItem = this.stockList.find(p => p.uniqueName === uniqueName);
            const stockUnit = stockItem ? stockItem.stockUnit.code : null;
            control.at(i).get('stockUnitCode').patchValue(stockUnit);
            this.disableStockButton = false;
        }
    }


    public calculateAmount(index, type?: string) {
        const items = this.transfers;
        const control = items.at(index);
        if (type === 'qty' && control.value.quantity) {
            control.get('quantity').patchValue(this.removeExtraChar(control.value.quantity));
        }
        if (type === 'rate' && control.value.rate) {
            control.get('rate').patchValue(this.removeExtraChar(control.value.rate));
        }

        if (control.value && control.value.quantity && control.value.rate) {
            control.get('totalValue').patchValue((parseFloat(control.value.quantity) * parseFloat(control.value.rate)).toFixed(2));
        }
    }

    public removeExtraChar(val) {
        return val.replace(/[^0-9.]/g, "");
    }

    public addItemInLinkedStocks(item, i?: number, lastIdx?) {
        const manufacturingDetailsContorl = this.manufacturingDetails;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
        let frmgrp = this.initialIManufacturingDetails();
        if (item) {
            if (item.controls) {
                let isValid = this.validateLinkedStock(item.value);
                if (isValid) {
                    // control.controls[i] = item;
                } else {
                    return this._toasty.errorToast('All fields are required.');
                }

            } else {
                let isValid = this.validateLinkedStock(item);
                if (isValid) {
                    frmgrp.patchValue(item);
                    control.controls[i] = frmgrp;
                } else {
                    return this._toasty.errorToast('All fields are required.');
                }
            }
            if (i === lastIdx) {
                control.controls.push(this.initialIManufacturingDetails());
            }
        }
    }

    public removeItemInLinkedStocks(i: number) {
        if (this.editLinkedStockIdx === i) {
            this.editModeForLinkedStokes = false;
            this.editLinkedStockIdx = null;
        }
        const manufacturingDetailsContorl = this.manufacturingDetails;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
        control.removeAt(i);
    }

    /**
     * validateLinkedStock
     */
    public validateLinkedStock(item) {
        return !(!item.quantity || !item.stockUniqueName || !item.stockUnitCode);
    }

    public hideMessage() {
        setTimeout(() => {
            this.errorMessage = null;
        }, 2000);
    }

    public save() {
        if (this.form.invalid) {
            this.errorMessage = "Please fill all (*)mandatory fields";
            this.hideMessage();
        }
        if (this.form.valid) {
            let rawValues = this.transfers.getRawValue();

            rawValues.map(rv => {
                rv.stockUnit = rv.stockUnit;
                delete rv.inventoryUser;
                delete rv.stock;
                return rv;
            });

            if (this.mode === 'receiver') {
                this.InventoryEntryValue.transferProducts = false
            } else {
                this.InventoryEntryValue.transferProducts = true
            }

            this.InventoryEntryValue.transferDate = moment(this.transferDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY');
            this.InventoryEntryValue.description = this.description.value;
            this.InventoryEntryValue.transfers = rawValues

            if (this.mode === 'receiver') {
                this.InventoryEntryValue.transfers = this.InventoryEntryValue.transfers.map(trx => {
                    let linkedStocks: any = this.removeBlankLinkedStock(this.manufacturingDetails.controls.linkedStocks);
                    trx.manufacturingDetails = {
                        manufacturingQuantity: this.manufacturingDetails.value.manufacturingQuantity,
                        manufacturingUnitCode: this.manufacturingDetails.value.manufacturingUnitCode,
                        linkedStocks: linkedStocks.map(l => l),
                    };
                    return trx;
                });
                this.InventoryEntryValue.isManufactured = this.isManufactured.value;
            }
            this.onSave.emit({ ...this.InventoryEntryValue });
        }
    }

    public async getStockDetails(stockItem: IStocksItem) {
        return await this._inventoryService.GetStockDetails(stockItem.stockGroup.uniqueName, stockItem.uniqueName).toPromise();
    }

    /**
     * removeBlankLinkedStock
     */
    public removeBlankLinkedStock(linkedStocks) {
        const manufacturingDetailsContorl = this.manufacturingDetails;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as FormArray;
        let rawArr = control.getRawValue();
        _.forEach(rawArr, (o, i) => {
            if (!o.quantity || !o.stockUniqueName || !o.stockUnitCode) {
                rawArr = _.without(rawArr, o);
                control.removeAt(i);
            }
        });
        linkedStocks = _.cloneDeep(rawArr);
        return linkedStocks;
    }

    public openBranchTransferPopup(transferType) {
        this._generalService.invokeEvent.next(["openbranchtransferpopup", transferType]);
    }
}
