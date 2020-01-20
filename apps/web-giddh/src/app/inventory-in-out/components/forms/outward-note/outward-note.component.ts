import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import * as moment from 'moment';
import { StockUnitRequest } from '../../../../models/api-models/Inventory';

@Component({
	selector: 'outward-note',
	templateUrl: './outward-note.component.html',
	styles: [`

  `],
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
	public form: FormGroup;
	public config: Partial<BsDatepickerConfig> = { dateInputFormat: 'DD-MM-YYYY' };
	public mode: 'receiver' | 'product' = 'receiver';
	public today = new Date();

	constructor(private _fb: FormBuilder) {
		this.initializeForm(true);
	}

	public get inventoryEntryDate(): FormControl {
		return this.form.get('inventoryEntryDate') as FormControl;
	}

	public get transactions(): FormArray {
		return this.form.get('transactions') as FormArray;
	}

	public get inventoryUser(): FormControl {
		return this.form.get('inventoryUser') as FormControl;
	}

	public get stock(): FormControl {
		return this.form.get('stock') as FormControl;
	}

	public get description(): FormArray {
		return this.form.get('description') as FormArray;
	}

	public initializeForm(initialRequest: boolean = false) {
		this.form = this._fb.group({
			inventoryEntryDate: [moment().format('DD-MM-YYYY'), Validators.required],
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
		this.inventoryEntryDate.patchValue(moment().format('DD-MM-YYYY'));
		this.transactions.controls = this.transactions.controls.filter(trx => false);

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

		const items = this.form.get('transactions') as FormArray;
		const value = items.length > 0 ? items.at(0).value : {
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

	public stockChanged(option: IOption, index: number) {
		const items = this.transactions;
		const stockItem = this.stockList.find(p => p.uniqueName === option.value);
		const stock = stockItem ? { uniqueName: stockItem.uniqueName } : null;
		const stockUnit = stockItem ? stockItem.stockUnit.code : null;
		if (index >= 0) {
			const control = items.at(index);
			control.patchValue({ ...control.value, stock, stockUnit });
		} else {
			items.controls.forEach(c => c.patchValue({ ...c.value, stock, stockUnit }));
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
				inventoryEntryDate: moment(this.inventoryEntryDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY'),
				description: this.description.value,
				transactions: rawValues
			};
			this.onSave.emit({ ...value });
		}
	}
}
