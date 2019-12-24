import { Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';

import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import * as moment from 'moment';
import { StockUnitRequest } from '../../../../models/api-models/Inventory';
import { digitsOnly, stockManufacturingDetailsValidator } from '../../../../shared/helpers';
import { ToasterService } from '../../../../services/toaster.service';
import { InventoryService } from '../../../../services/inventory.service';

@Component({
    selector: 'inward-note',
    templateUrl: './inward-note.component.html',
    styles: [`
    .pad-10-5 {
      padding: 10px 5px;
    }
  `],
})

export class InwardNoteComponent implements OnInit, OnChanges {
    @Output() public onCancel = new EventEmitter();
    @Output() public onSave = new EventEmitter<InventoryEntry>();

    @Input() public stockList: IStocksItem[];
    @Input() public stockUnits: StockUnitRequest[];
    @Input() public userList: InventoryUser[];

    @Input() public isLoading: boolean;
    public stockListOptions: IOption[];
    public stockUnitsOptions: IOption[];
    public userListOptions: IOption[];
    public form: FormGroup;
    public config: Partial<BsDatepickerConfig> = { dateInputFormat: 'DD-MM-YYYY' };
    public mode: 'sender' | 'product' = 'sender';
    public today = new Date();
    public editLinkedStockIdx: any = null;
    public editModeForLinkedStokes: boolean = false;
    public disableStockButton: boolean = false;

    constructor(private _fb: FormBuilder, private _toasty: ToasterService, private _inventoryService: InventoryService,
        private _zone: NgZone) {
        this.initializeForm(true);
    }

    public get inventoryEntryDate(): FormControl {
        return this.form.get('inventoryEntryDate') as FormControl;
    }

    public get inventoryUser(): FormControl {
        return this.form.get('inventoryUser') as FormControl;
    }

    public get stock(): FormControl {
        return this.form.get('stock') as FormControl;
    }

    public get transactions(): FormArray {
        return this.form.get('transactions') as FormArray;
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
        this.manufacturingDetails.disable();
        this.isManufactured.valueChanges.subscribe(val => {
            this.manufacturingDetails.reset();
            val ? this.manufacturingDetails.enable() : this.manufacturingDetails.disable();
        });
    }

    public initializeForm(initialRequest: boolean = false) {
        this.form = this._fb.group({
            inventoryEntryDate: [moment().format('DD-MM-YYYY'), Validators.required],
            transactions: this._fb.array([], Validators.required),
            description: [''],
            inventoryUser: [''],
            stock: ['', Validators.required],
            isManufactured: [false],
            manufacturingDetails: this._fb.group({
                manufacturingQuantity: ['', [Validators.required, digitsOnly]],
                manufacturingUnitCode: ['', [Validators.required]],
                linkedStocks: this._fb.array([
                    this.initialIManufacturingDetails()
                ]),
                linkedStockUniqueName: [''],
                linkedQuantity: ['', digitsOnly],
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
            quantity: ['', digitsOnly]
        });
    }

    public modeChanged(mode: 'sender' | 'product') {
        this.mode = mode;
        this.form.reset();
        this.inventoryEntryDate.patchValue(moment().format('DD-MM-YYYY'));
        this.transactions.controls = this.transactions.controls.filter(trx => false);

        if (this.mode === 'sender') {
            this.stock.setValidators(Validators.required);
            this.inventoryUser.clearValidators();
            this.inventoryUser.updateValueAndValidity();
        } else {
            this.inventoryUser.setValidators(Validators.required);
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
    }

    public addTransactionItem(control?: AbstractControl) {

        if (control && (control.invalid || this.stock.invalid || this.inventoryUser.invalid)) {
            return;
        }

        const items = this.transactions;
        const value = items.length > 0 ? items.at(0).value : {
            type: '',
            quantity: '',
            inventoryUser: '',
            stock: '',
            stockUnit: '',
        };
        const transaction = this._fb.group({
            type: ['SENDER', Validators.required],
            quantity: ['', Validators.required],
            inventoryUser: [this.mode === 'product' ? value.inventoryUser : '', this.mode === 'sender' ? [Validators.required] : []],
            stock: [this.mode === 'sender' ? value.stock : '', this.mode === 'product' ? [Validators.required] : []],
            stockUnit: [this.mode === 'sender' ? value.stockUnit : '', Validators.required]
        });
        transaction.updateValueAndValidity();
        items.push(transaction);
    }

    public deleteTransactionItem(index: number) {
        const items = this.form.get('transactions') as FormArray;
        items.removeAt(index);
    }

    public userChanged(option: IOption, index: number) {
        const items = this.form.get('transactions') as FormArray;
        const user = this.userList.find(p => p.uniqueName === option.value);
        const inventoryUser = user ? { uniqueName: user.uniqueName } : null;

        if (index >= 0) {
            const control = items.at(index);
            control.patchValue({
                ...control.value,
                inventoryUser
            });
        } else {
            items.controls.forEach(c => c.patchValue({ ...c.value, inventoryUser }));
        }
    }

    public async stockChanged(option: IOption, index: number) {
        const items = this.transactions;
        const stockItem = this.stockList.find(p => p.uniqueName === option.value);
        const stock = stockItem ? { uniqueName: stockItem.uniqueName } : null;
        const stockUnit = stockItem ? stockItem.stockUnit.code : null;

        if (stockItem && this.mode === 'sender') {
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

        if (index >= 0) {
            const control = items.at(index);
            control.patchValue({ ...control.value, stock, stockUnit });
        } else {
            items.controls.forEach(c => c.patchValue({ ...c.value, stock, stockUnit }));
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

    public save() {
        if (this.form.valid) {
            let rawValues = this.transactions.getRawValue();

            rawValues.map(rv => {
                rv.stockUnit = { code: rv.stockUnit };
                return rv;
            });
            let value: InventoryEntry = {
                inventoryEntryDate: moment(this.inventoryEntryDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY'),
                description: this.description.value,
                transactions: rawValues,
            };

            // if (this.mode === 'sender') {
            //   value.transactions = value.transactions.map(trx => {
            //     trx.manufacturingDetails = {
            //       manufacturingQuantity: this.manufacturingDetails.value.manufacturingQuantity,
            //       manufacturingUnitCode: this.manufacturingDetails.value.manufacturingUnitCode,
            //       linkedStocks: this.manufacturingDetails.value.linkedStocks,
            //     };
            //     return trx;
            //   });
            //   value.isManufactured = this.isManufactured.value;
            // }

            if (this.mode === 'sender') {
                value.transactions = value.transactions.map(trx => {
                    let linkedStocks: any = this.removeBlankLinkedStock(this.manufacturingDetails.controls.linkedStocks);
                    trx.manufacturingDetails = {
                        manufacturingQuantity: this.manufacturingDetails.value.manufacturingQuantity,
                        manufacturingUnitCode: this.manufacturingDetails.value.manufacturingUnitCode,
                        linkedStocks: linkedStocks.map(l => l),
                    };
                    return trx;
                });
                value.isManufactured = this.isManufactured.value;
            }

            this.onSave.emit({ ...value });
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
}
