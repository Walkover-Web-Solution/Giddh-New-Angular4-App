import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import * as moment from 'moment';

@Component({
	selector: 'transfer-inventory-user',
	templateUrl: './transfer-inventory-user.component.html',
	styles: [`

  `],
})

export class InventoryUserComponent implements OnChanges, OnInit {
	@Output() public onCancel = new EventEmitter();
	@Output() public onSave = new EventEmitter<{ entry: InventoryEntry, user: Partial<InventoryUser> }>();
	@Input() public stockList: IStocksItem[];
	@Input() public userList: InventoryUser[];
	@Input() public isLoading: boolean;
	public recieverUniqueName: string;
	public stockListOptions: IOption[];
	public userListOptions: IOption[];
	public form: FormGroup;
	public config: Partial<BsDatepickerConfig> = { dateInputFormat: 'DD-MM-YYYY' };
	public today = new Date();

	// public inventoryEntryDateValid;
	constructor(private _fb: FormBuilder) {
		const transaction = this._fb.group({
			type: ['SENDER', Validators.required],
			quantity: ['', Validators.required],
			inventoryUser: ['', Validators.required],
			stock: ['', Validators.required],
			stockUnit: ['', Validators.required]
		});
		this.form = this._fb.group({
			name: ['']
		});
	}

	public get inventoryEntryDate(): FormControl {
		return this.form.get('inventoryEntryDate') as FormControl;
	}

	public get transactions(): FormArray {
		return this.form.get('transactions') as FormArray;
	}

	public ngOnInit() {
		// this.inventoryEntryDateValid = this.form.get('inventoryEntryDate').errors?.required
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes.stockList && this.stockList) {
			this.stockListOptions = this.stockList.map(p => ({ label: p.name, value: p.uniqueName }));
		}
		if (changes.userList && this.userList) {
			this.userListOptions = this.userList.map(p => ({ label: p.name, value: p.uniqueName }));
		}
	}

	public userChanged(option: IOption, index: number = -1) {
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

	public stockChanged(option: IOption, index: number = -1) {
		const items = this.form.get('transactions') as FormArray;
		const stockItem = this.stockList.find(p => p.uniqueName === option.value);
		const stock = stockItem ? { uniqueName: stockItem.uniqueName } : null;
		const stockUnit = stockItem ? { code: stockItem.stockUnit.code } : null;
		if (index >= 0) {
			const control = items.at(index);
			control.patchValue({ ...control.value, stock, stockUnit });
		} else {
			items.controls.forEach(c => c.patchValue({ ...c.value, stock, stockUnit }));
		}
	}

	public quantityChanged(event) {
		const items = this.form.get('transactions') as FormArray;
		items.controls.forEach(c => c.patchValue({ ...c.value, quantity: event.target.value }));

	}

	public save() {
		if (this.form.valid) {
			const inventoryEntryDate = moment(this.form.value.transferDate).format('DD-MM-YYYY');
			this.onSave.emit(this.form.value);
		}
	}
}
