import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import * as dayjs from 'dayjs';
import { StockUnitRequest } from '../../../../models/api-models/Inventory';
import { GIDDH_DATE_FORMAT } from 'apps/web-giddh/src/app/shared/helpers/defaultDateFormat';

@Component({
    selector: 'transfer-outward-note',
    templateUrl: './outward-note.component.html',
})

export class OutwardNoteComponent implements OnChanges {
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
    public config: Partial<BsDatepickerConfig> = { dateInputFormat: GIDDH_DATE_FORMAT };
    public mode: 'receiver' | 'product' = 'receiver';
    public today = new Date();
    /** This holds giddh date format */
    public giddhDateFormat: string = GIDDH_DATE_FORMAT;

    constructor(private _fb: UntypedFormBuilder) {
        this.initializeForm(true);
    }

    public get inventoryEntryDate(): UntypedFormControl {
        return this.form.get('inventoryEntryDate') as UntypedFormControl;
    }

    public get transactions(): UntypedFormArray {
        return this.form.get('transactions') as UntypedFormArray;
    }

    public get inventoryUser(): UntypedFormControl {
        return this.form.get('inventoryUser') as UntypedFormControl;
    }

    public get stock(): UntypedFormControl {
        return this.form.get('stock') as UntypedFormControl;
    }

    public get description(): UntypedFormArray {
        return this.form.get('description') as UntypedFormArray;
    }

    public initializeForm(initialRequest: boolean = false) {
        this.form = this._fb.group({
            inventoryEntryDate: [dayjs().format(GIDDH_DATE_FORMAT), Validators.required],
            transactions: this._fb.array([], Validators.required),
            description: [''],
            inventoryUser: [''],
            stock: ['', Validators.required]
        });
        if (initialRequest) {
            this.addTransactionItem();
        }
    }

    public modeChanged(mode: 'receiver' | 'product') {
        this.mode = mode;
        this.form.reset();
        this.inventoryEntryDate?.patchValue(dayjs().format(GIDDH_DATE_FORMAT));
        this.transactions.controls = this.transactions.controls?.filter(trx => false);

        if (this.mode === 'receiver') {
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
            this.stockListOptions = this.stockList.map(p => ({ label: p.name, value: p?.uniqueName }));
        }
        if (changes.stockUnits && this.stockUnits) {
            this.stockUnitsOptions = this.stockUnits.map(p => ({ label: `${p.name} (${p.code})`, value: p.code }));
        }
        if (changes.userList && this.userList) {
            this.userListOptions = this.userList.map(p => ({ label: p.name, value: p?.uniqueName }));
        }
    }

    public addTransactionItem(control?: AbstractControl) {

        if (control && (control.invalid || this.stock.invalid || this.inventoryUser.invalid)) {
            return;
        }

        const items = this.form.get('transactions') as UntypedFormArray;
        const value = items?.length > 0 ? items?.at(0)?.value : {
            type: '',
            quantity: '',
            inventoryUser: '',
            stock: '',
            stockUnit: '',
        };
        const transaction = this._fb.group({
            type: ['RECEIVER', Validators.required],
            quantity: ['', Validators.required],
            inventoryUser: [this.mode === 'product' ? value.inventoryUser : '', this.mode === 'receiver' ? [Validators.required] : []],
            stock: [this.mode === 'receiver' ? value.stock : '', this.mode === 'product' ? [Validators.required] : []],
            stockUnit: [this.mode === 'receiver' ? value.stockUnit : '', Validators.required]
        });
        transaction.updateValueAndValidity();
        items.push(transaction);
    }

    public deleteTransactionItem(index: number) {
        const items = this.form.get('transactions') as UntypedFormArray;
        items.removeAt(index);
    }

    public userChanged(option: IOption, index: number) {
        const items = this.form.get('transactions') as UntypedFormArray;
        const user = this.userList.find(p => p?.uniqueName === option.value);
        const inventoryUser = user ? { uniqueName: user?.uniqueName } : null;
        if (index >= 0) {
            const control = items.at(index);
            control?.patchValue({
                ...control.value,
                inventoryUser
            });
        } else {
            items.controls.forEach(c => c?.patchValue({ ...c.value, inventoryUser }));
        }
    }

    public stockChanged(option: IOption, index: number) {
        const items = this.transactions;
        const stockItem = this.stockList.find(p => p?.uniqueName === option.value);
        const stock = stockItem ? { uniqueName: stockItem?.uniqueName } : null;
        const stockUnit = stockItem ? stockItem.stockUnit.code : null;
        if (index >= 0) {
            const control = items.at(index);
            control?.patchValue({ ...control.value, stock, stockUnit });
        } else {
            items.controls.forEach(c => c?.patchValue({ ...c.value, stock, stockUnit }));
        }
    }

    public save() {
        if (this.form.valid) {
            let rawValues = this.transactions.getRawValue();

            rawValues.map(rv => {
                rv.stockUnit = { code: rv.stockUnit };
                return rv;
            });
            let value: InventoryEntry = {
                inventoryEntryDate: dayjs(this.inventoryEntryDate.value, GIDDH_DATE_FORMAT).format(GIDDH_DATE_FORMAT),
                description: this.description.value,
                transactions: rawValues
            };
            this.onSave.emit({ ...value });
        }
    }
}
