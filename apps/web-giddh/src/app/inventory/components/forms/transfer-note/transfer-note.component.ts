import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import * as moment from 'moment';
import { StockUnitRequest } from '../../../../models/api-models/Inventory';

@Component({
	selector: 'transfer-notes',
	templateUrl: './transfer-note.component.html',
	styles: [`

  `],
})

export class TransferNoteComponent implements OnChanges, OnInit {
	@Output() public onCancel = new EventEmitter();
	@Output() public onSave = new EventEmitter<{ entry: InventoryEntry, user: Partial<InventoryUser> }>();

	@Input() public stockList: IStocksItem[];
	@Input() public stockUnits: StockUnitRequest[];
	@Input() public userList: InventoryUser[];

	@Input() public isLoading: boolean;
	public recieverUniqueName: string;
	public stockListOptions: IOption[];
	public stockUnitsOptions: IOption[];
	public userListOptions: IOption[];
	public form: FormGroup;
	public config: Partial<BsDatepickerConfig> = { dateInputFormat: 'DD-MM-YYYY' };
	public today = new Date();

	// public inventoryEntryDateValid;
	constructor(private _fb: FormBuilder) {
		this.form = this._fb.group({
			inventoryEntryDate: [moment().format('DD-MM-YYYY'), Validators.required],
			transactions: this._fb.array([]),
			description: [''],
			type: ['SENDER', Validators.required],
			quantity: ['', Validators.required],
			inventoryUser: ['', Validators.required],
			stock: ['', Validators.required],
			stockUnit: ['', Validators.required]
		});
	}

	public get inventoryEntryDate(): FormControl {
		return this.form.get('inventoryEntryDate') as FormControl;
	}

	public get description(): FormControl {
		return this.form.get('description') as FormControl;
	}

	public get type(): FormControl {
		return this.form.get('type') as FormControl;
	}

	public get quantity(): FormControl {
		return this.form.get('quantity') as FormControl;
	}

	public get inventoryUser(): FormControl {
		return this.form.get('inventoryUser') as FormControl;
	}

	public get stock(): FormControl {
		return this.form.get('stock') as FormControl;
	}

	public get stockUnit(): FormControl {
		return this.form.get('stockUnit') as FormControl;
	}

	public get transactions(): FormArray {
		return this.form.get('transactions') as FormArray;
	}

	public ngOnInit() {
		//
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

	public stockChanged(option: IOption) {
		const stockItem = this.stockList.find(p => p.uniqueName === option.value);
		const stockUnit = stockItem ? stockItem.stockUnit.code : null;
		this.form.patchValue({ ...this.form.value, stockUnit });
	}

	public save() {
		if (this.form.valid) {

			let value: any = {
				inventoryEntryDate: moment(this.inventoryEntryDate.value, 'DD-MM-YYYY').format('DD-MM-YYYY'),
				description: this.description.value,
				transactions: [{
					stock: { uniqueName: this.stock.value },
					inventoryUser: { uniqueName: this.inventoryUser.value },
					stockUnit: { code: this.stockUnit.value },
					type: this.type.value,
					quantity: this.quantity.value
				}]
			};

			this.onSave.emit({ entry: { ...value }, user: { uniqueName: this.recieverUniqueName } });
		}
	}
}
