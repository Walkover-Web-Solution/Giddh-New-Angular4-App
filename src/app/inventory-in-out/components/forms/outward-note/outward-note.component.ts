import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InventoryEntry, InventoryUser } from '../../../../models/api-models/Inventory-in-out';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { IOption } from '../../../../theme/ng-virtual-select/sh-options.interface';
import { IStocksItem } from '../../../../models/interfaces/stocksItem.interface';
import * as moment from 'moment';

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
  @Input() public userList: InventoryUser[];
  public stockListOptions: IOption[];
  public userListOptions: IOption[];
  public form: FormGroup;
  public config: Partial<BsDatepickerConfig> = {dateInputFormat: 'DD-MM-YYYY'};
  public mode: 'receiver' | 'product' = 'receiver';

  constructor(private _fb: FormBuilder) {

    this.form = this._fb.group({
      inventoryEntryDate: ['', Validators.required],
      transactions: this._fb.array([], Validators.required),
      description: ['']
    });
    this.addTransactionItem();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.stockList && this.stockList) {
      this.stockListOptions = this.stockList.map(p => ({label: p.name, value: p.uniqueName}));
    }
    if (changes.userList && this.userList) {
      this.userListOptions = this.userList.map(p => ({label: p.name, value: p.uniqueName}));
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
      type: ['RECEIVER', Validators.required],
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
    const inventoryUser = this.userList.find(p => p.uniqueName === option.value);
    if (index) {
      const control = items.at(index);
      control.patchValue({...control.value, inventoryUser: {uniqueName: inventoryUser.uniqueName}});
    } else {
      items.controls.forEach(c => c.patchValue({...c.value, inventoryUser: {uniqueName: inventoryUser.uniqueName}}));
    }
  }

  public stockChanged(option: IOption, index: number) {
    const items = this.form.get('transactions') as FormArray;
    const stock = this.stockList.find(p => p.uniqueName === option.value);
    if (index) {
      const control = items.at(index);
      control.patchValue({...control.value, stock: {uniqueName: stock.uniqueName}, stockUnit: {code: stock.stockUnit.code}});
    } else {
      items.controls.forEach(c => c.patchValue({...c.value, stock: {uniqueName: stock.uniqueName}, stockUnit: {code: stock.stockUnit.code}}));
    }
  }

  public save() {
    if (this.form.valid) {
      const inventoryEntryDate = moment(this.form.value.inventoryEntryDate).format('DD-MM-YYYY');
      this.onSave.emit({...this.form.value, inventoryEntryDate});
    }
  }
}
