import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';

import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import * as moment from 'moment';

@Component({
  selector: 'inward-note',
  templateUrl: './inward-note.component.html',
  styles: [`

  `],
})

export class InwardNoteComponent implements OnInit, OnChanges {
  @Output() public onCancel = new EventEmitter();
  @Output() public onSave = new EventEmitter<InventoryEntry>();

  @Input() public stockList: IStocksItem[];
  @Input() public userList: InventoryUser[];

  @Input() public isLoading: boolean;
  public stockListOptions: IOption[];
  public userListOptions: IOption[];
  public form: FormGroup;
  public config: Partial<BsDatepickerConfig> = { dateInputFormat: 'DD-MM-YYYY' };
  public mode: 'sender' | 'product' = 'sender';
  public today = new Date();
  public get inventoryEntryDate(): FormControl { debugger; return this.form.get('inventoryEntryDate') as FormControl; }
  public get transactions(): FormArray { return this.form.get('transactions') as FormArray; }

  constructor(private _fb: FormBuilder) {
    this.form = this._fb.group({
      inventoryEntryDate: [moment().format('DD-MM-YYYY'), Validators.required],
      transactions: this._fb.array([], Validators.required),
      description: ['']
    });
    this.addTransactionItem();
  }

  public ngOnInit() {
    //
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.stockList && this.stockList) {
      this.stockListOptions = this.stockList.map(p => ({ label: p.name, value: p.uniqueName }));
    }
    if (changes.userList && this.userList) {
      this.userListOptions = this.userList.map(p => ({ label: p.name, value: p.uniqueName }));
    }
  }

  public addTransactionItem() {
    const items = this.form.get('transactions') as FormArray;
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
      inventoryUser: [value.inventoryUser, Validators.required],


      stock: [value.stock, Validators.required],
      stockUnit: [value.stockUnit, Validators.required]
    });
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

  public save() {
    if (this.form.valid) {
      const inventoryEntryDate = moment(this.form.value.inventoryEntryDate).format('DD-MM-YYYY');
      this.onSave.emit({ ...this.form.value, inventoryEntryDate });
    }
  }
}
