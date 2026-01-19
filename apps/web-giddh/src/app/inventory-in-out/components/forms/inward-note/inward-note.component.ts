import { Component, EventEmitter, Input, NgZone, OnChanges, OnInit, Output, SimpleChanges, OnDestroy } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';
import { IStocksItem } from '../../../../models/interfaces/stocks-item.interface';
import * as dayjs from 'dayjs';
import { StockUnitRequest } from '../../../../models/api-models/Inventory';
import { digitsOnly, stockManufacturingDetailsValidator } from '../../../../shared/helpers';
import { ToasterService } from '../../../../services/toaster.service';
import { InventoryService } from '../../../../services/inventory.service';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';
import { takeUntil } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { IOption } from 'apps/web-giddh/src/app/app.constant';
import { cloneDeep, forEach, without } from '../../../../lodash-optimized';

/**
 * Handles Component functionality
 */
@Component({
    selector: 'inward-note',
    templateUrl: './inward-note.component.html',
    styleUrls: ['./inward-note.component.scss'],
    standalone: false
})

/**
 * InwardNoteComponent component
 * Handles inwardnote functionality and user interactions
 */
export class InwardNoteComponent implements OnInit, OnChanges, OnDestroy {
    @Output() public onCancel = new EventEmitter();
    @Output() public onSave = new EventEmitter<InventoryEntry>();

    @Input() public stockList: IStocksItem[];
    @Input() public stockUnits: StockUnitRequest[];
    @Input() public userList: InventoryUser[];

    @Input() public isLoading: boolean;
    public stockListOptions: IOption[];
    public stockUnitsOptions: IOption[];
    public userListOptions: IOption[];
    public form: UntypedFormGroup;
    public mode: 'sender' | 'product' = 'sender';
    public today = new Date();
    public editLinkedStockIdx: any = null;
    public editModeForLinkedStokes: boolean = false;
    public disableStockButton: boolean = false;
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;
    /** Observable to unsubscribe all the store listeners to avoid memory leaks */
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    /**
     * Creates an instance of component
     * Initializes component dependencies and sets up initial state
     */
    constructor(private _fb: UntypedFormBuilder, private _toasty: ToasterService, private _inventoryService: InventoryService,
        private _zone: NgZone) {
        this.initializeForm(true);
    }

    public get inventoryEntryDate(): UntypedFormControl {
        return this.form.get('inventoryEntryDate') as UntypedFormControl;
    }

    public get inventoryUser(): UntypedFormControl {
        return this.form.get('inventoryUser') as UntypedFormControl;
    }

    public get stock(): UntypedFormControl {
        return this.form.get('stock') as UntypedFormControl;
    }

    public get transactions(): UntypedFormArray {
        return this.form.get('transactions') as UntypedFormArray;
    }

    public get description(): UntypedFormControl {
        return this.form.get('description') as UntypedFormControl;
    }

    public get manufacturingDetails(): UntypedFormGroup {
        return this.form.get('manufacturingDetails') as UntypedFormGroup;
    }

    public get isManufactured(): UntypedFormControl {
        return this.form.get('isManufactured') as UntypedFormControl;
    }

    /**
     * Handles ngOnInit functionality
     */
    public ngOnInit() {
        this.manufacturingDetails.disable();
        this.isManufactured.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe(val => {
            this.manufacturingDetails.reset();
            val ? this.manufacturingDetails.enable() : this.manufacturingDetails.disable();
        });
    }

    /**
     * Initializes ializeform
     */
    public initializeForm(initialRequest: boolean = false) {
        this.form = this._fb.group({
            inventoryEntryDate: [dayjs().format(GIDDH_DATE_FORMAT), Validators.required],
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
        /**
         * Handles if functionality
         */
        if (initialRequest) {
            this.addTransactionItem();
        }
    }

    /**
     * Initializes ialimanufacturingdetails
     */
    public initialIManufacturingDetails() {
        // initialize our controls
        return this._fb.group({
            stockUniqueName: [''],
            stockUnitCode: [''],
            quantity: ['', digitsOnly]
        });
    }

    /**
     * Handles modeChanged functionality
     */
    public modeChanged(mode: 'sender' | 'product') {
        this.mode = mode;
        this.form.reset();
        this.inventoryEntryDate?.patchValue(dayjs().format(GIDDH_DATE_FORMAT));
        this.transactions.controls = this.transactions.controls?.filter(trx => false);

        /**
         * Handles if functionality
         */
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

    /**
     * Handles ngOnChanges functionality
     */
    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * Handles if functionality
         */
        if (changes.stockList && this.stockList) {
            this.stockListOptions = this.stockList.map(p => ({ label: p.name, value: p?.uniqueName }));
        }
        /**
         * Handles if functionality
         */
        if (changes.stockUnits && this.stockUnits) {
            this.stockUnitsOptions = this.stockUnits.map(p => ({ label: `${p.name} (${p.code})`, value: p.code }));
        }
        /**
         * Handles if functionality
         */
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(p => ({ label: p.name, value: p?.uniqueName }));
        }
    }

    /**
     * Handles addTransactionItem functionality
     */
    public addTransactionItem(control?: AbstractControl) {

        /**
         * Handles if functionality
         */
        if (control && (control.invalid || this.stock.invalid || this.inventoryUser.invalid)) {
            return;
        }

        const items = this.transactions;
        const value = items?.length > 0 ? items?.at(0)?.value : {
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

    /**
     * Deletes transactionitem
     */
    public deleteTransactionItem(index: number) {
        const items = this.form.get('transactions') as UntypedFormArray;
        items.removeAt(index);
    }

    /**
     * Handles userChanged functionality
     */
    public userChanged(option: IOption, index: number) {
        const items = this.form.get('transactions') as UntypedFormArray;
        const user = this.userList.find(p => p?.uniqueName === option?.value);
        const inventoryUser = user ? { uniqueName: user?.uniqueName } : null;

        /**
         * Handles if functionality
         */
        if (index >= 0) {
            const control = items.at(index);
            control?.patchValue({
                ...control?.value,
                inventoryUser
            });
        } else {
            (Array.isArray(items.controls) ? items.controls : []).forEach(c => c?.patchValue({ ...c?.value, inventoryUser }));
        }
    }

    /**
     * Handles stockChanged functionality
     */
    public async stockChanged(option: IOption, index: number) {
        const items = this.transactions;
        const stockItem = this.stockList.find(p => p?.uniqueName === option?.value);
        const stock = stockItem ? { uniqueName: stockItem?.uniqueName } : null;
        const stockUnit = stockItem ? stockItem.stockUnit.code : null;

        /**
         * Handles if functionality
         */
        if (stockItem && this.mode === 'sender') {
            this.stock.disable();
            try {
                let stockDetails = await this.getStockDetails(stockItem);
                this._zone.run(() => {
                    this.stock.enable();
                });

                /**
                 * Handles if functionality
                 */
                if (stockDetails.body && stockDetails.body.manufacturingDetails) {
                    let mfd = stockDetails.body.manufacturingDetails;
                    this.isManufactured?.patchValue(true);

                    this.manufacturingDetails?.patchValue({
                        manufacturingQuantity: mfd.manufacturingQuantity,
                        manufacturingUnitCode: mfd.manufacturingUnitCode
                    });

                    mfd.linkedStocks.map((item, i) => {
                        this.addItemInLinkedStocks(item, i, mfd.linkedStocks.length - 1);
                    });

                } else {
                    this.isManufactured?.patchValue(false);
                }

            } catch (e) {
                this._zone.run(() => {
                    this.stock.enable();
                });
                this._toasty.errorToast('something went wrong. please try again!');
            }
        }

        /**
         * Handles if functionality
         */
        if (index >= 0) {
            const control = items.at(index);
            control?.patchValue({ ...control?.value, stock, stockUnit });
        } else {
            (Array.isArray(items.controls) ? items.controls : []).forEach(c => c?.patchValue({ ...c?.value, stock, stockUnit }));
        }
    }

    /**
     * findAddedStock
     */
    public findAddedStock(uniqueName, i) {
        const manufacturingDetailsContorl = this.manufacturingDetails;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        let count = 0;
        /**
         * Handles forEach functionality
         */
        forEach(control.controls, (o) => {
            /**
             * Handles if functionality
             */
            if (o?.value.stockUniqueName === uniqueName) {
                count++;
            }
        });

        /**
         * Handles if functionality
         */
        if (count > 1) {
            this._toasty.errorToast('Stock already added.');
            this.disableStockButton = true;
            return;
        } else {
            const stockItem = this.stockList.find(p => p?.uniqueName === uniqueName);
            const stockUnit = stockItem ? stockItem.stockUnit.code : null;
            control.at(i).get('stockUnitCode')?.patchValue(stockUnit);
            this.disableStockButton = false;
        }
    }

    /**
     * Handles addItemInLinkedStocks functionality
     */
    public addItemInLinkedStocks(item, i?: number, lastIdx?) {
        const manufacturingDetailsContorl = this.manufacturingDetails;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        let frmgrp = this.initialIManufacturingDetails();
        /**
         * Handles if functionality
         */
        if (item) {
            /**
             * Handles if functionality
             */
            if (item.controls) {
                let isValid = this.validateLinkedStock(item.value);
                /**
                 * Handles if functionality
                 */
                if (!isValid) {
                    return this._toasty.errorToast('All fields are required.');
                }

            } else {
                let isValid = this.validateLinkedStock(item);
                /**
                 * Handles if functionality
                 */
                if (isValid) {
                    frmgrp?.patchValue(item);
                    control.controls[i] = frmgrp;
                } else {
                    return this._toasty.errorToast('All fields are required.');
                }
            }
            /**
             * Handles if functionality
             */
            if (i === lastIdx) {
                control.controls.push(this.initialIManufacturingDetails());
            }
        }
    }

    /**
     * Deletes iteminlinkedstocks
     */
    public removeItemInLinkedStocks(i: number) {
        /**
         * Handles if functionality
         */
        if (this.editLinkedStockIdx === i) {
            this.editModeForLinkedStokes = false;
            this.editLinkedStockIdx = null;
        }
        const manufacturingDetailsContorl = this.manufacturingDetails;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        control.removeAt(i);
    }

    /**
     * validateLinkedStock
     */
    public validateLinkedStock(item) {
        return !(!item.quantity || !item.stockUniqueName || !item.stockUnitCode);
    }

    /**
     * Saves  data
     */
    public save() {
        /**
         * Handles if functionality
         */
        if (this.form.valid) {
            let rawValues = this.transactions.getRawValue();

            rawValues.map(rv => {
                rv.stockUnit = { code: rv.stockUnit };
                return rv;
            });
            let value: InventoryEntry = {
                inventoryEntryDate: dayjs(this.inventoryEntryDate?.value, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT),
                description: this.description?.value,
                transactions: rawValues,
            };

            /**
             * Handles if functionality
             */
            if (this.mode === 'sender') {
                value.transactions = value.transactions.map(trx => {
                    let linkedStocks: any = this.removeBlankLinkedStock(this.manufacturingDetails.controls.linkedStocks);
                    trx.manufacturingDetails = {
                        manufacturingQuantity: this.manufacturingDetails?.value.manufacturingQuantity,
                        manufacturingUnitCode: this.manufacturingDetails?.value.manufacturingUnitCode,
                        linkedStocks: linkedStocks.map(l => l),
                    };
                    return trx;
                });
                value.isManufactured = this.isManufactured?.value;
            }

            this.onSave.emit({ ...value });
        }
    }

    /**
     * Retrieves stockdetails data
     */
    public async getStockDetails(stockItem: IStocksItem) {
        return await this._inventoryService.GetStockDetails(stockItem.stockGroup?.uniqueName, stockItem?.uniqueName).toPromise();
    }

    /**
     * removeBlankLinkedStock
     */
    public removeBlankLinkedStock(linkedStocks) {
        const manufacturingDetailsContorl = this.manufacturingDetails;
        const control = manufacturingDetailsContorl.controls['linkedStocks'] as UntypedFormArray;
        let rawArr = control.getRawValue();
        /**
         * Handles forEach functionality
         */
        forEach(rawArr, (o, i) => {
            /**
             * Handles if functionality
             */
            if (!o.quantity || !o.stockUniqueName || !o.stockUnitCode) {
                rawArr = without(rawArr, o);
                control.removeAt(i);
            }
        });
        linkedStocks = cloneDeep(rawArr);
        return linkedStocks;
    }

    /**
     * This will destroy all the memory used by this component
     *
     * @memberof InwardNoteComponent
     */
    public ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }
}
